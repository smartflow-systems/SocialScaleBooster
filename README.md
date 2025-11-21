# SocialScaleBooster

Smartflow Store MVP API with Multi-Agent Orchestration

## Overview

Part of the SmartFlow Systems ecosystem - a comprehensive suite of SaaS tools for business automation, social media management, and AI-powered workflows.

## Features

- SmartFlow brown/black/gold signature theme
- Integrated CI/CD with GitHub Actions
- Replit deployment support
- Comprehensive API and documentation

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=5000
NODE_ENV=development
# Add additional variables as needed
```

## Deployment

Automated deployment via GitHub Actions to Replit.

### Manual Deployment
```bash
npm run build
npm start
```

## Health Check

```bash
curl http://localhost:5000/health
# Response: {"ok":true}
```

## Documentation

- See `AGENTS.md` for AI assistant guidelines
- See `docs/` for detailed documentation

## Tech Stack

- Node.js / TypeScript
- Express
- Prisma ORM
- React (frontend)
- Tailwind CSS

## Contributing

Part of the SmartFlow Systems organization. Follow standard SFS development practices.

## License

Proprietary - SmartFlow Systems

## Support

For questions or issues, contact the SmartFlow Systems team.

---

**SmartFlow Systems** | Building the future of business automation
