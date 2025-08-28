FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.9.0 --activate

WORKDIR /app/backend

# Copy package files
COPY backend/package.json backend/pnpm-lock.yaml ./

# Copy shared packages
COPY packages /app/packages

# Install dependencies
RUN pnpm install

# Copy application code
COPY backend/ .

# Generate Prisma client
RUN pnpm prisma generate

# Expose port
EXPOSE 3070

# Start the application
CMD ["pnpm", "dev"]