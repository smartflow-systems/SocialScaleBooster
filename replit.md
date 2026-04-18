# SmartFlow AI - AI E-Commerce Social Media Bot Platform

## Overview

SmartFlow AI is a premium no-code AI platform designed to automate e-commerce social media sales through intelligent bot builders. It enables users to create, manage, and deploy social media automation bots across platforms like TikTok, Instagram, Facebook, Twitter, and YouTube to increase engagement and drive revenue. The platform features an SEO-optimized landing page, an advanced analytics dashboard, a comprehensive marketplace for bot templates, and integrated Stripe payment processing. Its vision is to empower businesses with AI-driven social media automation, enhancing their online presence and driving significant e-commerce growth.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application employs a modern full-stack architecture with a focus on modularity, scalability, and a premium user experience.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom SFS Design System, ensuring a consistent gold/black/glass theme. All UI components use typed React wrappers (`GlassCard`, `SfsContainer`, `GoldButton`, etc.) from `@/components/sfs` to enforce design consistency.
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API
- **Session Management**: Express sessions with a PostgreSQL store
- **Error Handling**: Centralized error middleware

### Design System
- **Color Scheme**: Dark theme (`#0D0D0D`) with gold accents (`#FFD700`, `#E6C200`) and a glass effect.
- **Typography**: Inter font family.
- **Components**: Reusable UI components following atomic design principles.
- **Responsiveness**: Mobile-first responsive design.

### Key Features and Implementations
- **Authentication & Authorization**: JWT-based authentication with user accounts stored in PostgreSQL. Includes login, registration, and an onboarding wizard for new users. Admin roles are supported via an `isAdmin` flag and a claim mechanism.
- **Bot Management System**: Supports multi-platform bots (TikTok, Instagram, Facebook, Twitter, YouTube) with JSON configuration storage for flexibility. Bots can be assigned to specific clients.
- **Multi-Client Management System**: Allows users (especially agencies) to manage multiple clients, each with their own workspace, bots, and revenue tracking.
- **Analytics Dashboard**: Comprehensive Chart.js integration for visualizing revenue, ROI, engagement rates, and platform performance.
- **Marketplace System**: A comprehensive bot template marketplace with category filtering, search, and premium template locks for paid users.
- **Scheduled Posts**: Functionality to schedule social media posts with a datetime picker, persisting scheduled posts to the database.
- **Server-Side Drafts**: Post drafts are saved and loaded from the server, allowing persistence across devices and sessions.
- **Monetization**: Freemium model with a 3-bot limit for free users and a £49/month Pro plan. Integrated Stripe for subscriptions and premium access.
- **Server-Side Rendered Landing Page**: Express SSR for SEO optimization.

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL via Neon, managed with Drizzle ORM for schema and migrations.
- **UI Components**: Radix UI primitives with Shadcn/ui.
- **Styling**: Tailwind CSS.
- **Charts**: Chart.js for data visualization.
- **Payment Processing**: Stripe for subscriptions and payment management.
- **Session Storage**: PostgreSQL-backed sessions.

### Development Tools
- **TypeScript**: For type safety across the stack.
- **Vite**: For fast frontend development and production builds.
- **ESBuild**: For backend bundling.
- **Drizzle Kit**: For database migrations and schema management.