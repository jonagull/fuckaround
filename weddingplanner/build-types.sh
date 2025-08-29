#!/bin/bash

# Quick script to rebuild types and update all packages

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📦 Building types package..."
cd packages/types
pnpm build

echo "🔄 Updating all packages with new types..."
cd ../..
pnpm -r install

echo "✅ Types updated across all packages!"
