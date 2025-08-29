#!/bin/bash

# Database reset script for development
# ⚠️ WARNING: This will destroy all data in the database!

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/backend"

echo "⚠️  WARNING: This will destroy all data in the development database!"
echo "🗄️  Database: wedding_planner at localhost:5677"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirmation

if [ "$confirmation" = "yes" ]; then
    echo "🗑️  Resetting database..."
    npx prisma migrate reset --force
    
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    echo "✅ Database reset complete!"
else
    echo "❌ Database reset cancelled."
    exit 1
fi
