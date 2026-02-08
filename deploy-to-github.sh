#!/bin/bash
# Deploy SocialScaleBooster Multi-Tenant + Beautiful UI to GitHub

set -e

echo "🚀 Deploying SocialScaleBooster to GitHub..."
echo "Repository: https://github.com/smartflow-systems/SocialScaleBooster.git"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the SocialScaleBooster directory."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_status "Initializing git repository..."
    git init
    git remote add origin https://github.com/smartflow-systems/SocialScaleBooster.git
fi

# Install dependencies
print_status "Installing dependencies..."
npm install react-router-dom @heroicons/react bcrypt jsonwebtoken stripe

# Create necessary directories
print_status "Creating directory structure..."
mkdir -p migrations
mkdir -p server/middleware
mkdir -p server/routes
mkdir -p src/styles
mkdir -p src/components/landing
mkdir -p src/components/auth
mkdir -p src/components/onboarding
mkdir -p src/components/dashboard
mkdir -p src/components/billing
mkdir -p src/components/common

# Backup current files if they exist
if [ -f "shared/schema.ts" ]; then
    print_warning "Backing up existing schema.ts..."
    cp shared/schema.ts shared/schema-backup-$(date +%Y%m%d_%H%M%S).ts
fi

# Stage all files
print_status "Staging files for commit..."
git add .

# Create comprehensive commit message
COMMIT_MSG="feat: implement multi-tenant SaaS architecture + beautiful UI

🏗️ Multi-Tenant Backend:
- Organization-based tenant isolation
- Stripe billing integration (£29/£99 plans)
- Usage limits enforcement  
- Team management with invitations
- Webhook handling for subscriptions
- JWT-based authentication

🎨 Beautiful Customer UI:
- Professional landing page with pricing
- Seamless onboarding flow
- Modern dashboard with usage visualization
- Billing management with Stripe integration
- Mobile-responsive design system
- Brand-consistent components

🚀 Ready for Customers:
- Complete customer journey optimized
- £29/month starter plan conversion ready
- Professional design builds trust
- Smooth upgrade flow to drive revenue

Files changed:
- Multi-tenant database schema
- Stripe integration & webhooks
- Authentication & authorization
- Landing page & marketing site
- Dashboard & app interface
- Billing & subscription management
- Mobile-responsive components
- Brand design system

Breaking changes:
- Database schema migration required
- New environment variables needed
- Stripe configuration required

Co-authored-by: Claude <claude@anthropic.com>"

# Commit changes
print_status "Committing changes..."
git commit -m "$COMMIT_MSG" || print_warning "Nothing new to commit"

# Push to GitHub
print_status "Pushing to GitHub..."
git push -u origin main

print_success "✅ Successfully deployed to GitHub!"
echo ""
echo "🎯 Next Steps:"
echo "1. Set up environment variables (see .env.example)"
echo "2. Configure Stripe products and webhooks"
echo "3. Run database migration: psql \$DATABASE_URL -f migrations/001_add_multi_tenant.sql"
echo "4. Test the complete customer journey"
echo "5. Switch Stripe to live mode"
echo ""
echo "📊 Ready for your first £29/month customer! 🚀"

# Optional: Open repository in browser
if command -v open &> /dev/null; then
    read -p "Open repository in browser? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://github.com/smartflow-systems/SocialScaleBooster"
    fi
fi