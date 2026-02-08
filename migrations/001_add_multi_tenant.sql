-- Migration: Single-tenant to Multi-tenant
-- This migration transforms existing single-user data into multi-tenant structure

BEGIN;

-- 1. Create new organizations table
CREATE TABLE organizations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'trial',
  plan_limits JSONB NOT NULL DEFAULT '{"socialAccounts": 1, "postsPerMonth": 10, "users": 1}',
  current_usage JSONB NOT NULL DEFAULT '{"socialAccounts": 0, "postsThisMonth": 0, "users": 0}',
  usage_reset_date TIMESTAMP DEFAULT NOW(),
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create subscriptions table
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create posts table for usage tracking
CREATE TABLE posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  bot_id INTEGER,
  social_account_id INTEGER NOT NULL,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_for TIMESTAMP,
  published_at TIMESTAMP,
  external_post_id TEXT,
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create invitations table
CREATE TABLE invitations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  token TEXT NOT NULL UNIQUE,
  invited_by INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Migrate existing users to organizations
-- Create one organization per existing user
INSERT INTO organizations (id, name, slug, plan, plan_limits, current_usage, status, stripe_customer_id)
SELECT 
  gen_random_uuid()::text,
  COALESCE(username, 'Organization ' || id::text),
  'org-' || id::text,
  CASE WHEN is_premium THEN 'starter' ELSE 'trial' END,
  CASE WHEN is_premium 
    THEN '{"socialAccounts": 3, "postsPerMonth": 100, "users": 1}'
    ELSE '{"socialAccounts": 1, "postsPerMonth": 10, "users": 1}'
  END,
  '{"socialAccounts": 0, "postsThisMonth": 0, "users": 1}',
  'active',
  stripe_customer_id
FROM users;

-- 6. Add organization_id to users table
ALTER TABLE users ADD COLUMN organization_id TEXT;
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'owner';
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Make email unique
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Update users with their organization IDs
UPDATE users SET organization_id = (
  SELECT id FROM organizations WHERE slug = 'org-' || users.id::text
);

-- Add foreign key constraint
ALTER TABLE users ADD CONSTRAINT users_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Make organization_id NOT NULL after populating
ALTER TABLE users ALTER COLUMN organization_id SET NOT NULL;

-- 7. Add organization_id to all existing tables
ALTER TABLE clients ADD COLUMN organization_id TEXT;
ALTER TABLE clients ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

UPDATE clients SET organization_id = (
  SELECT organization_id FROM users WHERE users.id = clients.user_id
);

ALTER TABLE clients ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE clients ADD CONSTRAINT clients_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- 8. Update social_accounts table
ALTER TABLE social_accounts ADD COLUMN organization_id TEXT;

UPDATE social_accounts SET organization_id = (
  SELECT organization_id FROM users WHERE users.id = social_accounts.user_id
);

ALTER TABLE social_accounts ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE social_accounts ADD CONSTRAINT social_accounts_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Add updated_at column
ALTER TABLE social_accounts ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- 9. Update bots table
ALTER TABLE bots ADD COLUMN organization_id TEXT;
ALTER TABLE bots ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

UPDATE bots SET organization_id = (
  SELECT organization_id FROM users WHERE users.id = bots.user_id
);

ALTER TABLE bots ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE bots ADD CONSTRAINT bots_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- 10. Update analytics table
ALTER TABLE analytics ADD COLUMN organization_id TEXT;

UPDATE analytics SET organization_id = (
  SELECT organization_id FROM users WHERE users.id = analytics.user_id
);

ALTER TABLE analytics ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE analytics ADD CONSTRAINT analytics_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- 11. Update bot_templates table (add updated_at)
ALTER TABLE bot_templates ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- 12. Remove old columns from users
ALTER TABLE users DROP COLUMN is_premium;
ALTER TABLE users DROP COLUMN stripe_customer_id;
ALTER TABLE users DROP COLUMN stripe_subscription_id;
ALTER TABLE users DROP COLUMN bot_count;

-- 13. Add indexes for performance
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_clients_organization_id ON clients(organization_id);
CREATE INDEX idx_social_accounts_organization_id ON social_accounts(organization_id);
CREATE INDEX idx_bots_organization_id ON bots(organization_id);
CREATE INDEX idx_analytics_organization_id ON analytics(organization_id);
CREATE INDEX idx_posts_organization_id ON posts(organization_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- 14. Update current usage counts for existing organizations
UPDATE organizations SET current_usage = (
  SELECT jsonb_build_object(
    'socialAccounts', COALESCE(sa_count.count, 0),
    'postsThisMonth', 0,  -- Start fresh
    'users', 1  -- Each org starts with 1 user (the owner)
  )
  FROM (
    SELECT 
      users.organization_id,
      COUNT(social_accounts.id) as count
    FROM users
    LEFT JOIN social_accounts ON social_accounts.organization_id = users.organization_id
    WHERE users.organization_id = organizations.id
    GROUP BY users.organization_id
  ) sa_count
  WHERE sa_count.organization_id = organizations.id
);

COMMIT;