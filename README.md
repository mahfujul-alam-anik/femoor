# Femoor OMS

Production-oriented order management and analytics app built with Next.js App Router, MongoDB/Mongoose, NextAuth, Zod, and Steadfast courier integration.

## Features

- Role-based auth (`super_admin`, `moderator`)
- Product and order management
- Dashboard analytics with charts
- Steadfast push/tracking/webhook sync endpoints
- Moderator administration
- System settings with secure env-driven configuration
- Activity and courier logging models

## Getting started

1. Copy `.env.example` to `.env.local`
2. Install dependencies: `npm install`
3. Seed your first super admin in MongoDB (password hash via bcrypt)
4. Run: `npm run dev`

## Architecture

- `app/api/*`: Route handlers backend
- `lib/models/*`: MongoDB schema layer
- `lib/services/steadfast.js`: Courier integration and sync logic
- `lib/auth/*`: NextAuth config and role guards
- `app/*`: Dashboard-first responsive UI pages
