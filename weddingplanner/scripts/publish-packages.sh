#!/bin/bash

# Script to publish types and automatically update frontend-shared
set -e

echo "🚀 Starting package publication process..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Step 1: Build and publish types package
echo -e "${BLUE}📦 Publishing weddingplanner-types...${NC}"
cd "$ROOT_DIR/packages/types"
pnpm run pub
TYPES_VERSION=$(node -p "require('./package.json').version")

echo -e "${GREEN}✅ Published weddingplanner-types@${TYPES_VERSION}${NC}"

# Step 2: Update frontend-shared with new types version
echo -e "${BLUE}📦 Updating weddingplanner-types in frontend-shared...${NC}"
cd "$ROOT_DIR/packages/frontend-shared"

# Update the dependency version in package.json
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"weddingplanner-types\": \".*\"/\"weddingplanner-types\": \"^${TYPES_VERSION}\"/" package.json
else
    # Linux
    sed -i "s/\"weddingplanner-types\": \".*\"/\"weddingplanner-types\": \"^${TYPES_VERSION}\"/" package.json
fi

# Install the updated dependency
pnpm install

# Step 3: Build and publish frontend-shared
echo -e "${BLUE}📦 Publishing weddingplanner-shared...${NC}"
pnpm run pub
SHARED_VERSION=$(node -p "require('./package.json').version")

echo -e "${GREEN}✅ Published weddingplanner-shared@${SHARED_VERSION}${NC}"

# Step 4: Update web and backend with new versions (optional)
read -p "Do you want to update web and backend with the new package versions? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${BLUE}📦 Updating web dependencies...${NC}"
    cd "$ROOT_DIR/web"
    
    # Update the dependency version in package.json
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\"weddingplanner-shared\": \".*\"/\"weddingplanner-shared\": \"^${SHARED_VERSION}\"/" package.json
    else
        sed -i "s/\"weddingplanner-shared\": \".*\"/\"weddingplanner-shared\": \"^${SHARED_VERSION}\"/" package.json
    fi
    
    echo -e "${BLUE}📦 Updating backend dependencies...${NC}"
    cd "$ROOT_DIR/backend"
    
    # Update the dependency version in package.json
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\"weddingplanner-types\": \".*\"/\"weddingplanner-types\": \"^${TYPES_VERSION}\"/" package.json
    else
        sed -i "s/\"weddingplanner-types\": \".*\"/\"weddingplanner-types\": \"^${TYPES_VERSION}\"/" package.json
    fi
    
    # Run pnpm install at the root to update all workspaces
    echo -e "${BLUE}📦 Installing updated dependencies across all workspaces...${NC}"
    cd "$ROOT_DIR"
    pnpm install -r
    
    echo -e "${GREEN}✅ All projects updated!${NC}"
fi

cd "$ROOT_DIR"
echo -e "${GREEN}🎉 Package publication complete!${NC}"
echo "Published versions:"
echo "  - weddingplanner-types@${TYPES_VERSION}"
echo "  - weddingplanner-shared@${SHARED_VERSION}"