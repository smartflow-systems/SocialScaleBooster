# SmartFlow AI - AI E-Commerce Social Media Bot Platform

## Overview

SmartFlow AI is a premium no-code AI platform designed to automate e-commerce social media sales through intelligent bot builders. The application allows users to create, manage, and deploy social media automation bots across platforms like TikTok, Instagram, Facebook, Twitter, and YouTube to increase engagement and drive revenue. Now features a complete SEO-optimized landing page, advanced analytics dashboard, comprehensive marketplace, and Stripe payment integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## SFS Design System

The SmartFlow Systems (SFS) gold/black/glass theme lives in
`public/sfs-complete-theme.css` (linked from `client/index.html`). All app
code should reach for the typed React wrappers in
`client/src/components/sfs/index.tsx` rather than raw class strings.

Available wrappers (each forwards `className`, `children`, and standard HTML
props; SFS classes are merged via the `cn` helper):

| Wrapper          | Renders   | SFS class(es)            |
|------------------|-----------|--------------------------|
| `GlassCard`      | `<div>`   | `glass-card`             |
| `SfsContainer`   | `<div>`   | `container`              |
| `SfsSection`     | `<section>` | `section`              |
| `GoldButton`     | `<button>`| `btn btn-gold`           |
| `GhostButton`    | `<button>`| `btn btn-ghost`          |
| `GoldHeading`    | `<h1>`–`<h6>` (via `level`, default `2`) | `text-gold-gradient` |
| `GoldText`       | `<span>`  | `text-gold`              |
| `FadeInUp`       | `<div>`   | `fade-in-up` + optional `stagger-1`…`stagger-6` (via `stagger` prop) |

Color palette (do not override): `--sf-black #0D0D0D`, `--sf-brown #3B2F2F`,
`--sf-gold #FFD700`, `--sf-gold-2 #E6C200`, `--sf-beige #F5F5DC`,
`--sf-white #FFFFFF`, plus the `--sf-gold-grad` gradient.

**Rule for future agents:** prefer the SFS wrappers over raw class strings,
and never override the gold/black color tokens or other SFS CSS variables.

## Recent Updates (April 2026)

✓ **SFS Retrofit — Marketing & Auth Pages (Task #80)**: Migrated `not-found.tsx`, `checkout.tsx`, `login.tsx`, `onboarding.tsx`, `subscribe.tsx` (full retrofits) and `landing.tsx` (focused CTA/heading swaps) to use the typed SFS wrappers from `@/components/sfs` (`GlassCard`, `GoldButton`, `GhostButton`, `GoldHeading`, `GoldText`, `SfsContainer`, `SfsSection`, `FadeInUp`). Replaced raw hex colors (`#FFD700`/`#0D0D0D`/`#E6C200`) with `var(--sf-gold)`/`var(--sf-black)`/`var(--sf-gold-2)` tokens in retrofitted markup. Demo panel inside landing left intact intentionally (preserves bespoke gradient/featured states). Code review: PASS.

✓ **Admin Template Manager** (`/admin/templates`): Admin-only page for creating, editing, and deleting bot templates from the marketplace. Adds `isAdmin` boolean to `users` table and JWT payload. Admins claim access via a secret code (`ADMIN_SECRET` env var). Full CRUD: table view, create dialog, edit dialog, delete confirmation. `PUT /api/templates/:id` and `DELETE /api/templates/:id` routes protected by admin check. `POST /api/admin/claim` issues a fresh JWT with admin flag.

✓ **Scheduled Posts Persisted to DB**: `scheduled_posts` table added to Drizzle schema. DatabaseStorage now uses DB for all scheduled post CRUD instead of in-memory Map. Migration 0002 auto-applies on startup.

✓ **Server-Side Drafts**: `drafts` DB table + full CRUD API (`GET/POST/DELETE /api/drafts`). Create Post page now saves/loads drafts from the server instead of localStorage — persists across devices and sessions.

✓ **Schedule from Create Post**: "Schedule Post" button on the Create Post output panel opens a modal with a datetime picker. Validates future datetime, creates a scheduled post via API, and invalidates the sidebar badge count.

✓ **Sidebar Schedule Badge**: Post Scheduler nav item shows a live count badge of upcoming scheduled posts. Refreshes every 60 seconds via `GET /api/scheduled-posts/count`.

✓ **Bot Template Seed**: `server/seed.ts` exports `seedBotTemplates()` called on startup — inserts 6 default templates (Instagram Growth, Twitter Engagement, LinkedIn Lead Gen, TikTok Trend Rider, Facebook Community, Agency Suite) if no templates exist in DB.

✓ **PostgreSQL Database Connected**: Switched from in-memory MemStorage to Drizzle ORM + Neon PostgreSQL. All tables migrated (users, clients, social_accounts, bots, bot_templates, analytics). Users and data now persist across server restarts.

**Note:** `DATABASE_URL` must be a clean, valid PostgreSQL connection string with no embedded spaces or newlines. Set it in the Replit Secrets panel as a single unbroken line (e.g. `postgresql://user:pass@host/db?sslmode=require`).



✓ **SmartFlow Systems Landing Page**: Full rebuild as digital agency landing page — Hero (dot-grid animation, gradient headline, stats), Ticker marquee, Services 3×2 grid with modals, Work portfolio with alternating cards + tags, About with floating stat cards, Process with → arrows, Contact form, single-row footer. Gold (#FFD700) / dark (#0D0D0D) brand, Inter font.

✓ **Auth System**: AuthProvider (`client/src/lib/auth-context.tsx`) wrapping the app — login/logout with JWT token stored in localStorage, user object persisted. Auth guard on all `/dashboard` and app routes → redirects to `/login` if unauthenticated.

✓ **Login / Register page** (`/login`): Branded, tabbed Sign In / Create Account. Username + password (+ email for register). Connects to `/api/auth/login` and `/api/auth/register`. Redirects to `/onboarding` for new users, `/dashboard` for returning.

✓ **Onboarding Wizard** (`/onboarding`): 3-step flow — (1) Business name + Solo/Agency type, (2) Pick niche (8 options), (3) Pick goals (multi-select). Progress bar, skip option. Saves to auth context, redirects to `/dashboard`.

✓ **App Sidebar** (`client/src/components/AppSidebar.tsx`): Persistent collapsible left sidebar shown on all authenticated app pages. Grouped sections: Main, Create, Automate, Grow, Account, Support. Active link highlight, collapse/expand toggle, user info + logout at bottom.

✓ **Dashboard redesign** (`/dashboard`): Clean welcome page — greeting, 6 quick-action tiles, 4-step Getting Started checklist, stats row (with empty state prompts), Explore Features cards, upgrade banner. No more broken API calls on load.

✓ **Navigation updates**: Landing page nav shows Sign In + Get Started for guests; Go to Dashboard for logged-in users.

## Recent Updates (January 2026)

✓ **Multi-Client Management System**: New feature allowing users to manage multiple clients from one account. Each client gets their own workspace with bots, revenue tracking, and analytics. Perfect for agencies and service providers.
✓ **Client Management Page**: Dedicated page at /clients to view all clients, add new ones, track monthly fees, bot counts, and total revenue per client.
✓ **Client-Linked Bots**: Bots can now be assigned to specific clients for organized management and revenue tracking.
✓ **Revenue Per Client**: Track how much each client is generating through their bots.

## Recent Updates (January 2025)

✓ **Brand Rebrand to SmartFlow AI**: Updated all branding from SFS ScaleBots to SmartFlow AI with refined messaging
✓ **PostgreSQL Database Integration**: Migrated from memory storage to PostgreSQL with complete schema and seeded data
✓ **Advanced Analytics Dashboard**: Comprehensive Chart.js integration with revenue tracking (£4,550.50), ROI metrics (340%), engagement rates, and platform performance analytics
✓ **Enhanced Marketplace**: Premium template system with category filtering, search, and gold "Apply Template" buttons with premium locks for Pro users
✓ **Smart Scheduling System**: Advanced cron UI with if-then automation rules, peak hours optimization, and engagement threshold posting
✓ **Bot Personality Designer**: Comprehensive personality sliders for tone, formality, enthusiasm, creativity with real-time preview and personality presets
✓ **Platform Integration Wizard**: Multi-step integration setup for Instagram, TikTok, Facebook, Twitter, YouTube with secure API key management
✓ **Premium Monetization**: Freemium model with 3-bot limit for free users, £49/mo Pro plan upgrade flow, premium template locks
✓ **Server-Side Rendered Landing Page**: Implemented Express SSR route for crawlable landing page with static HTML content, proper meta tags, and SEO optimization
✓ **Analytics Dashboard**: Added Chart.js integration with real-time e-commerce metrics, engagement tracking, ROI calculations, and platform performance analytics  
✓ **Enhanced Marketplace**: Created comprehensive bot template marketplace with category filtering, search functionality, and premium template system
✓ **Stripe Payment Integration**: Implemented secure payment processing for premium subscriptions with checkout flow and upgrade functionality
✓ **E-commerce Bot Presets**: Added specialized bot creation templates for product showcases, flash sales, testimonials, and trend tracking
✓ **Premium Brown & Gold Theme**: Transformed color scheme from yellow to sophisticated brown with gold trimmings for luxury aesthetic
✓ **Premium Theme Implementation**: Applied consistent dark brown base with gold accents and subtle gold glows throughout
✓ **Complete Stripe Payment Integration**: Implemented comprehensive payment processing with £49/month Pro plan subscriptions, one-time purchases, subscription management, premium template access controls, payment success notifications, and webhook support for subscription lifecycle events

## System Architecture

The application follows a modern full-stack architecture with the following key components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture
- **Session Management**: Express sessions with PostgreSQL store
- **Error Handling**: Centralized error middleware

### Design System
- **Color Scheme**: Dark theme with gold accents (SFS ScaleBots branding)
- **Typography**: Inter font family
- **Components**: Reusable UI components following atomic design principles
- **Responsive**: Mobile-first responsive design

## Key Components

### Database Schema (Drizzle ORM - Neon PostgreSQL)
- **Users Table**: Authentication, premium status, Stripe integration, bot count tracking
- **Clients Table**: Multi-tenant client management with revenue tracking
- **Social Accounts Table**: Connected social media accounts with encrypted credentials
- **Bots Table**: Bot configurations, platform associations, performance metrics
- **Bot Templates Table**: Marketplace templates with pricing and ratings
- **Analytics Table**: Revenue tracking, engagement metrics, performance data

### Authentication & Authorization
- JWT-based authentication with real user accounts persisted in PostgreSQL
- Register/login routes write and read from the Neon database
- Premium vs free tier limitations (3 bots for free users)

### Bot Management System
- Multi-platform support (TikTok, Instagram, Facebook, Twitter, YouTube)
- Bot status management (active, paused, stopped)
- JSON configuration storage for flexible bot settings
- Performance metrics tracking

### Analytics & Metrics
- Revenue tracking and growth calculations with Chart.js visualization
- Engagement rate monitoring across all platforms
- ROI calculations and conversion tracking
- Platform-specific performance metrics with growth indicators
- Real-time dashboard with interactive charts and KPI cards
- E-commerce focused analytics service for sales optimization

### Marketplace System
- Comprehensive template categorization (E-commerce, Beauty, Fashion, Technology)
- Advanced search and filtering capabilities
- Premium vs free template distinction with Stripe integration
- Template configuration inheritance and e-commerce presets
- Category-based browsing with visual indicators
- Review and rating system for community feedback

## Data Flow

1. **User Authentication**: Mock authentication system with plans for real auth
2. **Bot Creation**: Users select templates or create custom bots with platform-specific configurations
3. **Bot Management**: Start/stop/pause functionality with real-time status updates
4. **Analytics Collection**: Performance data aggregation and trend analysis
5. **Premium Upgrades**: Stripe integration for subscription management

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI primitives with Shadcn/ui
- **Styling**: Tailwind CSS with custom configuration
- **Charts**: Chart.js for analytics visualization
- **Payment Processing**: Stripe for subscription management
- **Session Storage**: PostgreSQL-backed sessions

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast development and production builds
- **ESBuild**: Backend bundling for production
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development Environment
- Vite dev server for frontend hot reloading
- Express server with TypeScript compilation via tsx
- Replit integration with development banners and error overlays

### Production Build
- Frontend: Vite build to `dist/public`
- Backend: ESBuild compilation to `dist/index.js`
- Static file serving through Express
- Environment variable configuration for database connections

### Database Management
- PostgreSQL with connection pooling (@neondatabase/serverless)
- Migration system through Drizzle Kit
- Environment-based configuration (DATABASE_URL)

### Key Architectural Decisions

1. **Monorepo Structure**: Shared schema between client and server for type safety
2. **Memory Storage Fallback**: Development storage system with interface for easy PostgreSQL migration
3. **Component-Based UI**: Modular, reusable components with consistent theming
4. **Platform Agnostic Bot System**: JSON configuration allows for flexible bot implementations
5. **Freemium Model**: Built-in limitation system with upgrade paths through Stripe