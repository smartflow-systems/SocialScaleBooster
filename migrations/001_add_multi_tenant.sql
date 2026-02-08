-- [migrations/001_add_multi_tenant.sql] (OVERWRITE)
BEGIN;

-- 1. Create tables
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    plan_limits JSONB DEFAULT '{"socialAccounts":1,"postsPerMonth":10,"users":1}'::jsonb
);

CREATE TABLE social_accounts (
    id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    handle TEXT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- 2. Alter tables (if needed, safe to keep for future migrations)
-- Example: adding new columns
-- ALTER TABLE organizations ADD COLUMN stripe_customer_id TEXT;

-- 3. Insert default data into organizations
INSERT INTO organizations (name, is_premium, plan_limits)
VALUES 
('Default Org', false, '{"socialAccounts":1,"postsPerMonth":10,"users":1}'::jsonb);

-- 4. Update JSONB plan_limits based on is_premium
UPDATE organizations
SET plan_limits = CASE
    WHEN is_premium THEN '{"socialAccounts":3,"postsPerMonth":100,"users":1}'::jsonb
    ELSE '{"socialAccounts":1,"postsPerMonth":10,"users":1}'::jsonb
END;

COMMIT;

