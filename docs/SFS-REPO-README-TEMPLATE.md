# SocialScaleBooster

> AI-powered social media automation platform that helps e-commerce businesses 10x their sales with intelligent bots and automated engagement.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-FFD700?style=for-the-badge&logo=replit&logoColor=black)](https://socialscaleboosteraibot.replit.app)
[![SmartFlow Systems](https://img.shields.io/badge/SmartFlow-Systems-0a0a0a?style=for-the-badge)](https://github.com/smartflow-systems)

---

## What It Does

SocialScaleBooster is a no-code AI bot platform for e-commerce businesses that want to automate their social media sales and engagement. Users can create, configure, and deploy AI bots that interact with customers across social platforms — without writing a single line of code. The platform includes real-time analytics, bot templates, Stripe-powered subscriptions, and a live WebSocket dashboard so you can watch performance as it happens.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Runtime | Node.js 18+ |
| Framework | Express (backend) + Vite + React (frontend) |
| Frontend | React + Tailwind CSS |
| Database / Storage | PostgreSQL via Neon (serverless) — Drizzle ORM |
| Key packages | Stripe, Drizzle, Zod, Vitest, JWT, bcryptjs, WebSocket |

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/smartflow-systems/SocialScaleBooster.git
cd SocialScaleBooster

# 2. Install dependencies
npm install

# 3. Copy the environment variables file and fill in your values
cp .env.example .env

# 4. Push the database schema
npm run migrate

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:5000`.

---

## Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string | `postgresql://user:pass@host.neon.tech/db?sslmode=require` |
| `JWT_SECRET` | Yes | Secret key for signing auth tokens | `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key for payments | `sk_test_abc123` |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key for frontend | `pk_test_abc123` |
| `PORT` | No | Port to run the server on | `5000` |
| `NODE_ENV` | No | Environment (`development` / `production`) | `development` |
| `REPLIT_TOKEN` | No | Replit deployment token for auto-sync | `your-token` |

---

## API Endpoints

| Method | Route | Auth required | Description |
|---|---|---|---|
| `GET` | `/health` | No | Health check |
| `POST` | `/api/auth/register` | No | Create a new user account |
| `POST` | `/api/auth/login` | No | Log in, returns JWT |
| `GET` | `/api/auth/me` | Bearer token | Get current user profile |
| `POST` | `/api/auth/logout` | No | Log out |
| `GET` | `/api/bots` | Bearer token | List all bots for the user |
| `POST` | `/api/bots` | No | Create a new bot |
| `GET` | `/api/bots/:id/stats` | No | Get stats for a specific bot |
| `GET` | `/api/templates` | No | List all bot templates |
| `POST` | `/api/templates` | No | Create a bot template |
| `GET` | `/api/analytics` | No | Get analytics events |
| `GET` | `/api/analytics/metrics` | No | Get aggregated analytics metrics |
| `POST` | `/api/analytics` | No | Record an analytics event |
| `GET` | `/api/user/status` | No | Get user subscription status |
| `POST` | `/api/create-payment-intent` | No | Create a Stripe payment intent |
| `POST` | `/api/create-subscription` | No | Start a Stripe subscription |
| `GET` | `/api/subscription-status` | No | Check current subscription status |
| `POST` | `/api/cancel-subscription` | No | Cancel a Stripe subscription |

---

## How It Connects to SmartFlow Systems

- **Main hub** — [`smartflow-systems/SmartFlowSite`](https://github.com/smartflow-systems/SmartFlowSite) links to this repo's live demo from the AI Bot product card on the homepage.
- **Design system** — follows the SFS design system (gold `#FFD700` on dark `#0a0a0a`). See [`sfs-claude-skills`](https://github.com/smartflow-systems/sfs-claude-skills) for the full token reference.
- **Stripe** — used for premium subscriptions and one-off payment intents. Keys stored as environment secrets.
- **Database** — Neon serverless PostgreSQL (external). All other SFS repos use flat-file JSON; this is the only repo with a real relational database.

---

## Live Demo

**[socialscaleboosteraibot.replit.app](https://socialscaleboosteraibot.replit.app)** — Full live platform: create an account, build a bot, view analytics in real time.

---

## Design System

This repo follows the SmartFlow Systems design system.

- Brand colours: Gold `#FFD700` on dark background `#0a0a0a`
- Typography: Inter (headings), system-ui (body)
- Full token reference and component rules: [`sfs-claude-skills/sfs-design-system/SKILL.md`](https://github.com/smartflow-systems/sfs-claude-skills/blob/main/sfs-design-system/SKILL.md)

---

## Contact

| | |
|---|---|
| Sales enquiries | [sales@smartflowsystems.com](mailto:sales@smartflowsystems.com) |
| Book a demo | [calendly.com/boweazy123](https://calendly.com/boweazy123) |

---

## Part of the SmartFlow Systems Suite

SmartFlow Systems builds automation tools for modern businesses — booking, CRM, e-commerce, AI bots, analytics, and more.

| | |
|---|---|
| Website | [smartflowsystems.replit.app](https://smartflowsystems.replit.app) |
| All repos | [github.com/smartflow-systems](https://github.com/smartflow-systems) |

---

*Built by SmartFlow Systems.*
