# SmartFlow AI - AI E-Commerce Social Media Bot Platform

## Overview

SmartFlow AI is a no-code AI platform designed to automate e-commerce social media sales using intelligent bot builders. It allows users to create, manage, and deploy social media automation bots across platforms like TikTok, Instagram, Facebook, Twitter, and YouTube to increase engagement and drive revenue. The platform features an SEO-optimized landing page, an advanced analytics dashboard, a marketplace for bot templates, and integrated Stripe payment processing. Its vision is to empower businesses with AI-driven social media automation, enhancing their online presence and driving e-commerce growth.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application uses a modern full-stack architecture focusing on modularity, scalability, and a premium user experience.

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite for building.
- **Routing**: Wouter.
- **UI Framework**: Shadcn/ui components built on Radix UI primitives.
- **Styling**: Tailwind CSS with a custom SFS Design System, enforcing a consistent gold/black/glass theme. All UI components utilize typed React wrappers (`GlassCard`, `SfsContainer`, `GoldButton`, etc.) from `@/components/sfs` to maintain design consistency.
- **State Management**: TanStack Query for server state.
- **Forms**: React Hook Form with Zod validation.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API.
- **Session Management**: Express sessions with a PostgreSQL store.
- **Error Handling**: Centralized error middleware.

### Design System
- **Color Scheme**: Dark theme (`#0D0D0D`) with gold accents (`#FFD700`, `#E6C200`) and a glass effect.
- **Typography**: Inter font family.
- **Components**: Reusable UI components following atomic design principles.
- **Responsiveness**: Mobile-first responsive design.

### Key Features and Implementations
- **Authentication & Authorization**: JWT-based authentication with user accounts in PostgreSQL. Includes login, registration, and an onboarding wizard. Admin roles are supported via an `isAdmin` flag and a claim mechanism.
- **Bot Management System**: Supports multi-platform bots (TikTok, Instagram, Facebook, Twitter, YouTube) with JSON configuration storage. Bots can be assigned to specific clients.
- **Multi-Client Management System**: Enables users to manage multiple clients, each with their own workspace, bots, and revenue tracking.
- **Analytics Dashboard**: Chart.js integration for visualizing revenue, ROI, engagement rates, and platform performance.
- **Marketplace System**: A bot template marketplace with categorization, search, and premium template locks for paid users.
- **Scheduled Posts**: Functionality to schedule social media posts with a datetime picker, persisting scheduled posts to the database.
- **Server-Side Drafts**: Post drafts are saved and loaded from the server, allowing persistence across devices and sessions.
- **Monetization**: Freemium model with a 3-bot limit for free users and a £49/month Pro plan. Integrated Stripe for subscriptions and premium access.
- **Server-Side Rendered Landing Page**: Express SSR for SEO optimization.

## External Dependencies

- **Database**: PostgreSQL via Neon, managed with Drizzle ORM.
- **UI Components**: Radix UI primitives with Shadcn/ui.
- **Styling**: Tailwind CSS.
- **Charts**: Chart.js for data visualization.
- **Payment Processing**: Stripe for subscriptions and payment management.