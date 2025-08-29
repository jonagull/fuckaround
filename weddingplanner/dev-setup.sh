#!/bin/bash

# Wedding Planner Development Setup Script
# This script builds types and sets up the backend for development

set -e  # Exit on any error

echo "🚀 Setting up development environment..."

# Get the script directory (works with relative paths)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📦 Building shared types..."
cd packages/types
pnpm build

echo "🔧 Installing backend dependencies..."
cd ../../backend
pnpm install

echo "🗄️  Generating Prisma client..."
npx prisma generate

echo "✅ Setup complete! Starting development server..."
echo "🌐 Backend will be available at http://localhost:3070"

# Start the backend development server
make dev
