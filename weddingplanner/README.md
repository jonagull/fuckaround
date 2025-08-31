# Wedding Planner

## Package Manager Commands

### Install Dependencies
```bash
pnpm i
```
Installs dependencies recursively for all workspaces (root, web, and frontend-shared).

### Watch Shared Package
```bash
pnpm watch
```
Watches the `frontend-shared` package for changes and automatically rebuilds on file modifications using nodemon.

### Development Mode
```bash
pnpm dev
```
Runs both the Next.js web development server and watches the frontend-shared package concurrently for a seamless development experience.