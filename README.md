# Femoor OMS

Production-oriented order management and analytics app built with Next.js App Router, MongoDB/Mongoose, NextAuth, Zod, and Steadfast courier integration.

## Features

- Role-based auth (`super_admin`, `moderator`)
- Product and order management with server-side validation
- Dashboard analytics with period filters (all/year/month/custom)
- Steadfast push/tracking/webhook sync endpoints
- Moderator administration and activity logging
- System settings and courier logs

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `STEADFAST_API_BASE_URL`
- `STEADFAST_API_KEY`
- `STEADFAST_SECRET_KEY`

## Getting started

1. Install dependencies: `npm install`
2. Set env vars in `.env.local`
3. Seed your first super admin:
   - default values are `admin@gmail.com / 123456`
   - run `npm run seed`
4. Run app: `npm run dev`

## Architecture

- `app/api/*`: Route handlers backend
- `lib/models/*`: MongoDB schema layer
- `lib/services/steadfast.js`: Courier integration and sync logic
- `lib/auth/*`: NextAuth config and role guards
- `app/*`: Dashboard-first responsive UI pages
