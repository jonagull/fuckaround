# Wedding Planner

Full-stack wedding planning app: React Native, Next.js, Node.js, PostgreSQL.

## 🚀 Quick Start

```bash
# 1. Setup
git clone <repo-url> && cd weddingplanner
pnpm -r install
docker-compose up -d

# 2. Start development (recommended)
./dev-setup.sh

# 3. Access apps
# Backend: http://localhost:3070
# Web: http://localhost:3000
```

## 📁 Project Structure

```
├── app/                 # React Native mobile
├── web/                 # Next.js web app
├── backend/             # Node.js API
├── packages/types/      # Shared TypeScript types
└── packages/frontend-shared/  # Shared frontend utils
```

## 🛠 Development Scripts

```bash
./dev-setup.sh     # Full setup: builds types + starts backend
./build-types.sh   # Rebuild types only (after adding new types)
./reset-db.sh      # Reset database (⚠️ destroys data)
```

## 🗄️ Database (Prisma)

### Common Commands

```bash
cd backend

# After schema changes
npx prisma generate
npx prisma migrate dev --name migration_name

# View/edit data
npx prisma studio

# Reset database (development only)
npx prisma migrate reset
```

### Schema Workflow

1. **Edit schema**: `backend/prisma/schema.prisma`
2. **Create migration**: `npx prisma migrate dev --name add_something`
3. **Generate client**: `npx prisma generate` (auto-runs with migrate)
4. **Restart dev server** to pick up changes

### Troubleshooting Database Issues

```bash
# Migration drift (database out of sync)
./reset-db.sh  # Safe reset with confirmations

# Manual reset
cd backend && npx prisma migrate reset

# Pull existing database schema
npx prisma db pull
```

## 🔧 Development Workflows

### Adding New Types

```bash
# 1. Create type file
echo "export interface MyType {}" > packages/types/src/mytype.ts

# 2. Export in index
echo "export * from './mytype';" >> packages/types/src/index.ts

# 3. Rebuild
./build-types.sh
```

### Watch Mode (Multi-terminal)

```bash
# Terminal 1 - Types auto-rebuild
cd packages/types && pnpm dev

# Terminal 2 - Backend
cd backend && pnpm dev

# Terminal 3 - Web
cd web && pnpm dev
```

## 📡 API Endpoints

**Auth**: `/api/auth/{register,login/web,login/mobile,refresh,logout}`  
**Users**: `/api/users/:id`  
**Wedding**: `/api/wedding`

## 🏗️ Tech Stack

-   **Backend**: Express + TypeScript + Prisma + JWT
-   **Web**: Next.js + TypeScript + Tailwind + shadcn/ui
-   **Mobile**: React Native + Expo
-   **Database**: PostgreSQL
-   **Monorepo**: pnpm workspaces

## 🔧 Troubleshooting

**TypeScript issues**: Restart TS server (`Cmd+Shift+P` → "TypeScript: Restart")  
**Types not found**: Run `./build-types.sh`  
**Database drift**: Run `./reset-db.sh`  
**Dependency issues**: `pnpm -r clean && pnpm -r install`

## 🤝 Contributing

1. Use single quotes, follow existing patterns
2. Import types from `@weddingplanner/types`
3. Run `./build-types.sh` after type changes
4. Test across web/mobile when applicable
