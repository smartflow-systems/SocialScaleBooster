# SocialScaleBooster

**AI-Powered Social Media Content Planning Demo**

Part of the SmartFlow Systems ecosystem. This repository currently supports a
controlled internal demo of content planning and scheduling workflows.

Canonical source: smartflow-systems/SocialScaleBooster on main.

## Live Demo

> Replit public URL: pending confirmation
>
> Candidate: https://socialscalebooster.replit.app - currently unverified/404
>
> Replit deployment target must be confirmed in the Replit dashboard before deploy.

---

## Features

### Internal Demo Workflows
- **Platform Labels** - Organize planned content by social platform
- **Demo Bot Records** - Create, pause, stop, and inspect internal bot records
- **Template Marketplace** - Browse content-planning templates
- **Dashboard Views** - Review demo metrics and workflow state

### Multi-Account Management
- **Account Records** - Organize multiple account records by platform
- **Encrypted Credential Storage** - AES-256-GCM encryption for API keys and tokens
- **Account Linking** - Associate social accounts with internal demo workflows
- **Demo Connection Check** - Run an internal check without claiming live platform verification
- **Platform-Specific Views** - Organized account management by platform

### Analytics & Insights
- **Demo Analytics Views** - Review sample and internally recorded metrics
- **Engagement Fields** - Organize platform-specific metric records
- **Performance Dashboard** - Visual charts and data visualization
- **Report Planning** - Prepare internal reporting workflows

### Pricing Demo
- **Tiered Plan UI** - Compare visible Starter, Pro, and Agency plan copy
- **Stripe Routes Present** - Billing requires separate verification before use
- **No Billing Guarantee** - Do not treat the internal demo as a proven live subscription flow

### Authentication & Security
- **JWT-based Auth** - Secure token authentication
- **bcrypt Password Hashing** - Industry-standard password security
- **Protected Routes** - Middleware-based route protection
- **Session Management** - 7-day token expiration with refresh capability

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast HMR and builds
- **Tailwind CSS** - Utility-first styling with SFS brand palette
- **shadcn/ui** - 70+ accessible components
- **Wouter** - Lightweight client-side routing
- **React Query** - Server state management
- **Recharts** - Data visualization

### Backend
- **Express** - Node.js web framework
- **TypeScript** - Type-safe development
- **Drizzle ORM** - Type-safe SQL with PostgreSQL
- **JWT** - JSON Web Token authentication
- **Stripe** - Billing integration present; live readiness unverified
- **WebSocket** - Real-time analytics updates

### Database
- **PostgreSQL** via Neon (or any Postgres provider)
- **Drizzle Kit** - Schema migrations and management

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **Replit** - Deployment target
- **tsx** - TypeScript execution
- **Vitest** - Unit testing framework

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Stripe account only if separately verifying billing in a controlled environment
- GitHub account (for CI/CD)

### Installation

```bash
# Clone repository
git clone https://github.com/smartflow-systems/SocialScaleBooster.git
cd SocialScaleBooster

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Environment Variables

Create `.env` file in root:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database

# Authentication (required in production)
SFS_JWT_SECRET=your_secure_random_jwt_secret_here

# Encryption (for social account credentials)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-64-char-hex-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional: Replit Deployment
REPLIT_TOKEN=your-replit-token
SFS_SYNC_URL=https://your-replit-webhook
```

### Database Setup

```bash
# Generate Drizzle schema
npm run migrate

# Open Drizzle Studio (optional)
npm run db:studio

# Seed database with sample data (optional)
npm run db:seed
```

### Development

```bash
# Start development server (with hot reload)
npm run dev

# Server runs on http://localhost:5000
```

### Production Build

```bash
# Build frontend and backend
npm run build

# Start production server
npm start
```

---

## Project Structure

```
SocialScaleBooster/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── analytics/   # Analytics dashboards
│   │   │   ├── bots/        # Bot management
│   │   │   ├── marketplace/ # Template marketplace
│   │   │   ├── subscription/# Payment & subscriptions
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities
│   │   ├── pages/           # Route pages
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles (SFS theme)
│   └── index.html
├── server/                  # Express backend
│   ├── auth/                # Authentication routes
│   │   └── index.ts
│   ├── middleware/          # Express middleware
│   │   └── auth.ts          # JWT middleware
│   ├── db/                  # Database connection
│   │   └── index.ts
│   ├── routes.ts            # API endpoints
│   ├── storage.ts           # Database operations
│   ├── websocket.ts         # WebSocket server
│   ├── index.ts             # Server entry point
│   └── vite.ts              # Vite integration
├── shared/                  # Shared TypeScript types
│   └── schema.ts            # Drizzle schema + Zod validation
├── .github/
│   └── workflows/
│       └── sfs-deploy.yml   # CI/CD pipeline
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── README.md
```

---

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "isPremium": false,
    "botCount": 0
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Bots (Protected Routes)

All bot routes require `Authorization: Bearer {token}` header.

#### List User Bots
```http
GET /api/bots
```

#### Create Bot
```http
POST /api/bots
Content-Type: application/json

{
  "name": "TikTok Growth Bot",
  "platform": "tiktok",
  "status": "active",
  "description": "Internal demo content planning workflow"
}
```

#### Get Bot Statistics
```http
GET /api/bots/:id/stats
```

#### Update Bot Status
```http
PATCH /api/bots/:id
Content-Type: application/json

{
  "status": "paused"
}
```

#### Delete Bot
```http
DELETE /api/bots/:id
```

### Templates

#### List Templates
```http
GET /api/templates
GET /api/templates?category=ecommerce
```

### Analytics

#### Get User Analytics
```http
GET /api/analytics
Authorization: Bearer {token}
```

#### Get Aggregated Metrics
```http
GET /api/analytics/metrics
Authorization: Bearer {token}
```

### Social Accounts (Protected Routes)

All social account routes require `Authorization: Bearer {token}` header.

#### List All Connected Accounts
```http
GET /api/social-accounts
```

**Response:**
```json
[
  {
    "id": 1,
    "platform": "instagram",
    "accountName": "Main Store",
    "accountHandle": "@mainstore",
    "status": "demo",
    "hasCredentials": true,
    "lastVerified": null
  }
]
```

#### List Accounts by Platform
```http
GET /api/social-accounts/platform/instagram
```

#### Connect New Account
```http
POST /api/social-accounts
Content-Type: application/json

{
  "platform": "instagram",
  "accountName": "Main Store",
  "accountHandle": "@mainstore",
  "apiKey": "your-api-key-here"
}
```

#### Update Account
```http
PUT /api/social-accounts/:id
Content-Type: application/json

{
  "accountName": "Updated Name",
  "accountHandle": "@newhandle"
}
```

#### Verify Account Connection
```http
POST /api/social-accounts/:id/verify
```

The social-account verification endpoint is an internal demo check. It does not
verify a live platform connection or mark an account as live-verified.

#### Delete Account
```http
DELETE /api/social-accounts/:id
```

#### Get Bots Linked to Account
```http
GET /api/social-accounts/:id/bots
```

### Payments

Payment routes are present but live subscription readiness is unverified. Do not
use them for a customer demo without a separate approved billing test.

#### Create Subscription
```http
POST /api/create-subscription
Authorization: Bearer {token}
```

#### Cancel Subscription
```http
POST /api/cancel-subscription
Authorization: Bearer {token}
```

---

## SmartFlow Systems Brand

### Color Palette

The application uses the official SFS color scheme:

```css
--sf-black: #0D0D0D      /* Primary background */
--sf-brown: #3B2F2F      /* Secondary elements */
--sf-gold: #FFD700       /* Primary accent */
--sf-gold-2: #E6C200     /* Hover states */
--sf-beige: #F5F5DC      /* Muted text */
--sf-white: #FFFFFF      /* Text on dark */
```

### Design Principles
- **rounded-2xl borders** - All cards and containers
- **Gold glow effects** - Premium elements and CTAs
- **Soft shadows** - Depth and hierarchy
- **Adequate padding** - Breathing room in designs

---

## CI/CD Pipeline

### GitHub Actions Workflow

Automatically runs on push to `main` or `master`:

1. **Checkout Code**
2. **Install Dependencies** - `npm ci`
3. **Lint Code** - `npm run lint`
4. **Run Tests** - `npm test`
5. **Build Project** - `npm run build`
6. **Request Replit deployment** only after configuration and runtime verification

### Required GitHub Secrets

Configure in **Settings → Secrets and variables → Actions**:

- `SFS_PAT` - GitHub Personal Access Token (repo + workflow scope)
- `REPLIT_TOKEN` - Replit deployment token (optional)
- `SFS_SYNC_URL` - Webhook URL for sync operations (optional)

---

## Deployment

### Replit Deployment

1. **Fork repository** to your GitHub account
2. **Import to Replit** from GitHub
3. **Set environment variables** in Replit Secrets
4. **Verify deployment workflow configuration** before enabling any webhook
5. **Run** `npm start`

### Manual Deployment

```bash
# Build production assets
npm run build

# Set environment to production
export NODE_ENV=production

# Start server
npm start
```

---

## Development Workflow

### Making Changes

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m "feat: add amazing feature

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin feature/amazing-feature
```

### Code Style

```bash
# Run linter
npm run lint

# Format code
npm run format
```

### Database Migrations

```bash
# Generate migration from schema changes
npm run migrate

# View database in Drizzle Studio
npm run db:studio
```

---

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- path/to/test.ts
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Check Neon dashboard for connection status
- Ensure IP whitelist includes your location

### Stripe Integration
- Billing is not part of the controlled internal demo.
- Verify routes, prices, webhooks, and provider settings separately before use.

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf client/node_modules/.vite
```

---

## Contributing

Part of the SmartFlow Systems organization. Follow SFS development standards:

1. Use SFS color palette (`--sf-*` variables)
2. Enforce `rounded-2xl` borders
3. Write concise commit messages
4. Include co-authorship credit for AI assistance
5. Test thoroughly before pushing

---

## License

Proprietary - SmartFlow Systems
All rights reserved.

---

## Support

For questions, issues, or feature requests:

- **GitHub Issues:** [SocialScaleBooster Issues](https://github.com/smartflow-systems/SocialScaleBooster/issues)
- **Organization:** smartflow-systems
- **Related Repos:**
  - [SmartFlowSite](https://github.com/smartflow-systems/SmartFlowSite)
  - SFSAPDemoCRM - future/parked reference; not connected to SocialScaleBooster
  - [SFSDataQueryEngine](https://github.com/smartflow-systems/SFSDataQueryEngine)

---

**SmartFlow Systems** | Internal social content planning demo
