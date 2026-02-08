#!/bin/bash
# Quick Setup Script for SocialScaleBooster Multi-Tenant SaaS

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 SocialScaleBooster Setup                    ║"
echo "║              Multi-Tenant SaaS Ready! 🚀                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this from SocialScaleBooster directory.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo -e "${BLUE}📦 Installing additional multi-tenant dependencies...${NC}"
npm install react-router-dom @heroicons/react bcrypt jsonwebtoken stripe

echo -e "${BLUE}⚙️  Setting up environment configuration...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from template${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your actual configuration!${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists. Please verify configuration.${NC}"
fi

echo -e "${BLUE}🗄️  Setting up database...${NC}"
if [ -n "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  IMPORTANT: About to run database migration!${NC}"
    echo -e "${YELLOW}⚠️  This will modify your database schema.${NC}"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}📦 Creating database backup...${NC}"
        if command -v pg_dump &> /dev/null; then
            pg_dump $DATABASE_URL > "backup-$(date +%Y%m%d_%H%M%S).sql"
            echo -e "${GREEN}✅ Database backed up${NC}"
        else
            echo -e "${YELLOW}⚠️  pg_dump not found. Skipping backup.${NC}"
        fi
        
        echo -e "${BLUE}🔄 Running database migration...${NC}"
        if [ -f "migrations/001_add_multi_tenant.sql" ]; then
            psql $DATABASE_URL -f migrations/001_add_multi_tenant.sql
            echo -e "${GREEN}✅ Database migration completed${NC}"
        else
            echo -e "${RED}❌ Migration file not found${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Database migration skipped${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  DATABASE_URL not set. Please configure and run migration manually.${NC}"
fi

echo -e "${BLUE}🔧 Building application...${NC}"
npm run build

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete! ✅                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}🎉 SocialScaleBooster is ready!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Update .env with your actual configuration:"
echo "   - Stripe API keys (live mode for production)"
echo "   - JWT secret (generate with: openssl rand -base64 32)"
echo "   - App URL (your domain)"
echo ""
echo "2. Configure Stripe:"
echo "   - Create products: £29 Starter, £99 Pro"
echo "   - Set up webhook: https://yourdomain.com/api/webhooks/stripe"
echo "   - Update price IDs in shared/schema-multitenant.ts"
echo ""
echo "3. Test the application:"
echo "   - npm start (start the server)"
echo "   - Visit your domain"
echo "   - Complete customer journey test"
echo ""
echo -e "${YELLOW}📖 Documentation:${NC}"
echo "- DEPLOYMENT-GUIDE.md - Complete deployment instructions"
echo "- POST-DEPLOYMENT-CHECKLIST.md - Testing checklist"
echo "- UI-IMPLEMENTATION-SUMMARY.md - UI features overview"
echo ""
echo -e "${BLUE}🎯 Ready for your first £29/month customer!${NC}"

# Check if we can start the server
if [ -f ".env" ] && [ -n "$(grep -E '^DATABASE_URL=' .env | cut -d '=' -f2-)" ]; then
    echo ""
    read -p "Start the development server now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🚀 Starting server...${NC}"
        npm start
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Configure .env first, then run: npm start${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Happy building! Time to scale to success! 💰${NC}"