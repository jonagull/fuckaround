# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wedding planning application with:
- **Backend**: C# .NET 8.0 with Entity Framework Core and PostgreSQL
- **Frontend**: Next.js 15 with App Router, TypeScript, and Tailwind CSS
- **Shared Package**: `weddingplanner-shared` NPM package for frontend utilities and types
- **Package Manager**: pnpm (enforced via preinstall scripts)

## Common Development Commands

### Backend (.NET)
```bash
# Run backend
cd WeddingPlannerBackend
dotnet run

# Run database migrations
dotnet ef migrations add MigrationName
dotnet ef database update

# Build backend
dotnet build
```

### Frontend (Next.js)
```bash
# Install dependencies (use pnpm only)
cd web
pnpm install

# Run development server
pnpm dev  # Runs on port 3050 with Turbopack

# Build for production
pnpm build

# Lint code
pnpm lint
```

### Shared Package
```bash
cd frontend-shared
pnpm build    # Build TypeScript
pnpm dev      # Watch mode
pnpm pub      # Publish new version (patches version, builds, and publishes)
```

### Docker & Database
```bash
# Start PostgreSQL database
make up
# or
docker-compose up -d

# Stop services
make down

# View logs
make logs
```

## Architecture & Structure

### Backend Architecture
- **Controllers**: REST API endpoints in `WeddingPlannerBackend/Controllers/`
- **Services**: Business logic in `WeddingPlannerBackend/Services/`
- **Entities**: Database models in `WeddingPlannerBackend/Entities/`
- **Authentication**: JWT-based auth with BCrypt password hashing
- **Database**: PostgreSQL via Entity Framework Core, migrations in `Migrations/`

### Frontend Architecture
- **App Router**: Next.js 15 App Router with file-based routing
- **Components**: Reusable components in `web/src/components/`
  - UI primitives in `web/src/components/ui/`
  - Feature components alongside UI components
- **State Management**: React Query (TanStack Query) for server state
- **API Client**: Axios-based client in `frontend-shared/src/api/`
- **Types**: Shared TypeScript types in `frontend-shared/src/types/`
- **Authentication**: JWT stored in cookies, middleware in `web/src/middleware.ts`

### Key Patterns
- **API Structure**: RESTful endpoints with consistent naming
- **Type Safety**: Strict TypeScript mode enabled, explicit types for exports
- **Component Structure**: Functional components with hooks
- **Styling**: Tailwind CSS with component variants via `class-variance-authority`
- **Error Handling**: Centralized error handling in API client

## Important Conventions

### Naming Conventions
- **TypeScript/JavaScript**: camelCase for variables/functions
- **React Components**: PascalCase
- **Database Fields**: snake_case (via Entity Framework conventions)
- **API Routes**: PascalCase for controller names, camelCase for actions

### Code Organization
- Keep React components in `web/src/components/`
- Shared types must be in `frontend-shared/src/types/` (never duplicate in frontend)
- API utilities go in `frontend-shared/src/api/`
- Backend services follow repository pattern with dependency injection

### Database Connection
PostgreSQL runs on port 5677 (mapped from 5432 in Docker) with:
- Database: `wedding_planner`
- User: `wedding_user`
- Password: `wedding_pass`