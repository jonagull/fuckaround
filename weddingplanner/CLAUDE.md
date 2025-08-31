# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Wedding Planner - A full-stack monorepo application for managing wedding and event planning with Express.js/Prisma backend, Next.js web frontend, and Expo React Native mobile app.

## Tech Stack
- **Backend**: Express.js, Prisma ORM, PostgreSQL, JWT authentication
- **Web Frontend**: Next.js 15 (App Router), Tailwind CSS, Radix UI
- **Mobile App**: Expo/React Native
- **Package Manager**: pnpm workspaces
- **Database**: PostgreSQL (Docker)
- **Language**: TypeScript (strict mode)

## Development Commands

### Initial Setup
```bash
pnpm install -r  # Install all dependencies
docker-compose up -d  # Start PostgreSQL database
cd backend && pnpm migrate  # Run database migrations
```

### Development
```bash
pnpm dev  # Runs database, backend, and web concurrently
pnpm dev:backend  # Backend only (port 3001)
pnpm dev:web  # Web frontend only (port 3050)
pnpm dev:db  # Database only
```

### Database
```bash
cd backend
pnpm migrate  # Apply migrations
pnpm migrate:reset  # Reset database
pnpm studio  # Open Prisma Studio
```

### Code Quality
```bash
pnpm lint  # Run ESLint with auto-fix
pnpm lint:check  # Check for linting errors
pnpm format  # Format with Prettier
pnpm format:check  # Check formatting
pnpm check  # Run both format and lint checks
```

### Building
```bash
cd backend && pnpm build  # Build backend
cd web && pnpm build  # Build web frontend
pnpm build:types  # Build types package
pnpm build:shared  # Build frontend-shared package
```

## Architecture

### Monorepo Structure
```
/
├── backend/           # Express.js API server
│   ├── routes/       # API endpoints (auth, users, events, addressSearch)
│   ├── middleware/   # Auth middleware, error handlers
│   ├── lib/          # Utilities, Prisma client
│   └── prisma/       # Database schema and migrations
├── web/              # Next.js web application
│   └── src/
│       ├── app/      # App Router pages
│       │   ├── api/  # API route handlers
│       │   ├── login/
│       │   ├── protected/
│       │   └── project/
│       ├── components/  # React components
│       └── middleware.ts  # Auth middleware
├── app/              # Expo React Native app
└── packages/
    ├── types/        # Shared TypeScript types
    └── frontend-shared/  # Shared frontend utilities & API client
```

### Key Architectural Patterns

**Authentication Flow**:
- JWT access tokens (15min) + refresh tokens (7 days)
- Refresh tokens stored in httpOnly cookies (web) or secure storage (mobile)
- Auth middleware validates tokens on protected routes
- Separate login endpoints for web vs mobile

**API Structure**:
- RESTful endpoints under `/api/v1/`
- Each route module exports router with specific endpoints
- Centralized error handling via middleware
- Prisma client singleton pattern

**Frontend State Management**:
- React Query for server state (via frontend-shared package)
- Context API for user authentication state
- Custom hooks in frontend-shared for data fetching

**Database Schema**:
- Users with email/password authentication
- Events with multiple user roles (OWNER, PLANNER, VENDOR, GUEST)
- Address model with geocoding support
- Refresh token tracking

## Important Conventions

### Code Style
- **TypeScript**: Strict mode, explicit types for exports
- **Naming**: camelCase (JS/TS), PascalCase (components), snake_case (DB)
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS with Radix UI components

### File Organization
- Backend routes: `/backend/routes/[resource]/[action].ts`
- Frontend components: `/web/src/components/[ComponentName].tsx`
- Shared types: `/packages/types/src/types/[domain].ts`
- API clients: `/packages/frontend-shared/src/api/[resource].ts`

### Development Workflow
1. All type definitions go in `packages/types`
2. API client methods go in `packages/frontend-shared`
3. Use existing UI components from `/web/src/components/ui`
4. Follow existing patterns in route handlers and middleware
5. Run lint and format checks before committing

## Environment Variables

Backend requires:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Access token secret
- `JWT_REFRESH_SECRET`: Refresh token secret

See `backend/.env.example` for template.