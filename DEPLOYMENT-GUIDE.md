# 🚀 SocialScaleBooster Deployment Guide

## Repository: https://github.com/smartflow-systems/SocialScaleBooster.git

This guide will help you deploy the complete multi-tenant architecture + beautiful UI to your live GitHub repository.

## 📦 What We Built

### 🏗️ Multi-Tenant Backend
- **Database schema** with organization isolation
- **Stripe billing** integration (£29 Starter, £99 Pro)
- **Usage limits** enforcement
- **Team management** with invitations
- **Webhook handling** for subscriptions

### 🎨 Beautiful Customer UI
- **Professional landing page** with pricing
- **Seamless onboarding** flow
- **Modern dashboard** with usage visualization
- **Billing management** with Stripe integration
- **Mobile-responsive** design

## 🚀 Deployment Steps

### 1. Clone Your Repository
```bash
git clone https://github.com/smartflow-systems/SocialScaleBooster.git
cd SocialScaleBooster
```

### 2. Install Dependencies
```bash
npm install
npm install react-router-dom @heroicons/react bcrypt jsonwebtoken stripe
```

### 3. Copy New Files

**Backend Files:**
```bash
# Multi-tenant schema
cp shared/schema-multitenant.ts shared/schema.ts

# Stripe integration
cp server/stripe.ts server/
cp server/middleware/tenant.ts server/middleware/
cp server/routes/onboarding.ts server/routes/
cp server/routes/billing.ts server/routes/
cp server/routes/webhooks.ts server/routes/
cp server/routes-multitenant.ts server/routes.ts

# Database migration
cp migrations/001_add_multi_tenant.sql migrations/
```

**Frontend Files:**
```bash
# Design system
cp src/styles/brand.css src/styles/

# Components
cp -r src/components/* src/components/
cp src/App.tsx src/

# Package.json updates
# (manually merge the new dependencies)
```

### 4. Environment Configuration

Update your `.env` file:
```env
# Existing variables...
DATABASE_URL=your_database_url

# Add these NEW variables:
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
JWT_SECRET=your_super_secure_random_string_here
APP_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
```

### 5. Database Migration

**IMPORTANT: Backup first!**
```bash
# Create backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d_%H%M%S).sql

# Run migration
psql $DATABASE_URL -f migrations/001_add_multi_tenant.sql
```

### 6. Stripe Setup

**Create Products in Stripe Dashboard:**
1. Starter Plan: £29/month recurring
2. Pro Plan: £99/month recurring

**Update Price IDs in `shared/schema-multitenant.ts`:**
```typescript
starter: {
  stripePriceId: "price_your_starter_price_id", 
},
pro: {
  stripePriceId: "price_your_pro_price_id",
}
```

**Create Webhook Endpoint:**
- URL: `https://yourdomain.com/api/webhooks/stripe`
- Events: `customer.subscription.*`, `invoice.payment_*`

### 7. Deploy to Production

**For Replit:**
```bash
# Push to GitHub first
git add .
git commit -m "feat: multi-tenant architecture + beautiful UI"
git push origin main

# Deploy on Replit
# Your Replit will auto-deploy from GitHub
```

**For other platforms:**
```bash
# Build
npm run build

# Deploy using your preferred method
npm start
```

### 8. Test Complete Flow

**Customer Journey Test:**
1. Visit your domain → Landing page loads
2. Click "Start Free Trial" → Signup works
3. Create account → Redirects to dashboard
4. View usage limits → Shows correctly
5. Click upgrade → Stripe checkout opens
6. Complete payment → Subscription activates

## 🔧 Configuration Checklist

### Stripe Configuration:
- [ ] Products created (£29, £99)
- [ ] Price IDs updated in code
- [ ] Webhook endpoint configured
- [ ] Test mode → Live mode switch
- [ ] Customer portal enabled

### Environment Variables:
- [ ] STRIPE_SECRET_KEY (live key)
- [ ] STRIPE_WEBHOOK_SECRET 
- [ ] JWT_SECRET (secure random string)
- [ ] APP_URL (your domain)
- [ ] DATABASE_URL (production database)

### Database:
- [ ] Backup created
- [ ] Migration run successfully
- [ ] Existing data migrated
- [ ] New tables created
- [ ] Indexes created

### Frontend:
- [ ] Landing page loads
- [ ] Signup flow works
- [ ] Login redirects to dashboard
- [ ] Mobile responsive
- [ ] Billing page functional

## 🎯 Go-Live Checklist

### Pre-Launch:
- [ ] Test complete customer journey
- [ ] Verify Stripe payments work
- [ ] Test webhook handling
- [ ] Check mobile responsiveness
- [ ] Verify usage limit enforcement
- [ ] Test team invitations

### Launch Day:
- [ ] Switch Stripe to live mode
- [ ] Update domain in Stripe webhook
- [ ] Monitor error logs
- [ ] Test first real signup
- [ ] Monitor subscription webhooks

## 📊 Success Metrics

Track these after launch:
- **Conversion Rate**: Landing page → Signup
- **Trial-to-Paid**: Free trial → £29 subscription
- **Usage Adoption**: Features being used
- **Revenue**: MRR from subscriptions
- **Support Tickets**: Issues customers face

## 🆘 Troubleshooting

**Common Issues:**

**Database Migration Fails:**
```bash
# Check current schema
psql $DATABASE_URL -c "\dt"

# Rollback and retry
psql $DATABASE_URL < backup-file.sql
```

**Stripe Webhooks Not Working:**
```bash
# Check webhook logs in Stripe dashboard
# Verify endpoint URL is correct
# Test webhook signature validation
```

**UI Not Loading:**
```bash
# Check build errors
npm run build

# Verify imports
npm run typecheck
```

## 🎉 You're Ready!

Your SocialScaleBooster is now:
- ✅ **Multi-tenant** with proper data isolation
- ✅ **Stripe-integrated** for £29 & £99 plans  
- ✅ **Customer-ready** with beautiful UI
- ✅ **Mobile-optimized** for all devices
- ✅ **Usage-enforced** to drive upgrades

**Time to get your first £29/month customer!** 🚀💰

Need help with any step? The architecture is solid and ready to scale! 🎯