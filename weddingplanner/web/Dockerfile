FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app/web

# Copy package files
COPY web/package.json web/pnpm-lock.yaml ./

# Copy shared packages
COPY packages /app/packages

# Install dependencies
RUN pnpm install

# Copy application code
COPY web/ .

# Expose port
EXPOSE 3050

# Start the application
CMD ["pnpm", "dev"]