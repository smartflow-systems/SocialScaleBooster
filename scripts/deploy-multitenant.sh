#!/bin/bash
# Deploy Multi-tenant SocialScaleBooster

set -e

echo "🚀 Deploying Multi-tenant SocialScaleBooster..."

# 1. Backup existing database
echo "📦 Creating database backup..."
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d_%H%M%S).sql

# 2. Run migration
echo "🔄 Running multi-tenant migration..."
psql $DATABASE_URL -f migrations/001_add_multi_tenant.sql

# 3. Update schema references
echo "📝 Updating schema references..."
# Backup original schema
cp shared/schema.ts shared/schema-original.ts

# Replace with multi-tenant schema
cp shared/schema-multitenant.ts shared/schema.ts

# 4. Install new dependencies
echo "📦 Installing dependencies..."
npm install stripe

# 5. Update environment variables
echo "⚙️  Setting up environment variables..."
cat >> .env << EOF

# Stripe Configuration (REQUIRED)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# JWT Secret (REQUIRED - generate a strong secret)
JWT_SECRET=$(openssl rand -base64 32)

# App Configuration
APP_URL=https://your-app-domain.com
ALLOWED_ORIGINS=https://your-app-domain.com,https://app.your-domain.com

EOF

echo "✅ Basic deployment complete!"
echo ""
echo "🔧 Manual steps required:"
echo "1. Update your Stripe keys in .env file"
echo "2. Create Stripe products and prices:"
echo "   - Starter Plan: £29/month"
echo "   - Pro Plan: £99/month"
echo "3. Update price IDs in shared/schema-multitenant.ts"
echo "4. Set up webhook endpoint: https://your-domain.com/api/webhooks/stripe"
echo "5. Test the migration with existing data"
echo ""
echo "📚 Next steps:"
echo "- Update your frontend to use the new multi-tenant API"
echo "- Test onboarding flow: POST /api/onboarding/signup" 
echo "- Test billing: POST /api/billing/checkout"
echo ""
echo "🎯 Ready for first £29/month customer!"