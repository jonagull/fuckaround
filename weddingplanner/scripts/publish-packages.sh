#!/bin/bash

# Script to publish types and automatically update frontend-shared
set -e

# Parse command line arguments
TAG=""
while getopts "t:" opt; do
  case $opt in
    t)
      TAG="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      echo "Usage: $0 [-t tag]"
      echo "  -t tag    Publish with a specific tag (e.g., beta.2)"
      exit 1
      ;;
  esac
done

if [ -n "$TAG" ]; then
  echo "🚀 Starting package publication process with tag: $TAG"
else
  echo "🚀 Starting package publication process..."
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Get the root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Step 1: Build and publish types package
echo -e "${BLUE}📦 Publishing weddingplanner-types...${NC}"
cd "$ROOT_DIR/packages/types"

# Build the package first
pnpm run build

if [ -n "$TAG" ]; then
  # For tagged releases, bump patch version and add tag
  echo -e "${YELLOW}Bumping patch version and adding tag ${TAG}${NC}"
  npm version patch --no-git-tag-version
  BASE_VERSION=$(node -p "require('./package.json').version")
  NEW_VERSION="${BASE_VERSION}-${TAG}"
  npm version "$NEW_VERSION" --no-git-tag-version
  echo -e "${YELLOW}Publishing version ${NEW_VERSION} with tag 'prerelease'${NC}"
  # Publish with prerelease tag for beta/alpha versions
  npm publish --tag prerelease --no-git-checks
  TYPES_VERSION="$NEW_VERSION"
else
  # For regular releases, just bump patch version
  npm version patch --no-git-tag-version
  npm publish --no-git-checks
  TYPES_VERSION=$(node -p "require('./package.json').version")
fi

echo -e "${GREEN}✅ Published weddingplanner-types@${TYPES_VERSION}${NC}"

# Step 2: Update frontend-shared with new types version
echo -e "${BLUE}📦 Updating weddingplanner-types in frontend-shared...${NC}"
cd "$ROOT_DIR/packages/frontend-shared"

# Update the dependency to exact tagged version
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"weddingplanner-types\": \".*\"/\"weddingplanner-types\": \"${TYPES_VERSION}\"/" package.json
else
    # Linux
    sed -i "s/\"weddingplanner-types\": \".*\"/\"weddingplanner-types\": \"${TYPES_VERSION}\"/" package.json
fi

# Wait a moment for npm registry to update
echo -e "${YELLOW}Waiting for npm registry to update...${NC}"
sleep 3

# Install the updated dependency
pnpm install

# Step 3: Build and publish frontend-shared
echo -e "${BLUE}📦 Publishing weddingplanner-shared...${NC}"

# Build the package first
pnpm run build

if [ -n "$TAG" ]; then
  # For tagged releases, bump patch version and add tag
  echo -e "${YELLOW}Bumping patch version and adding tag ${TAG}${NC}"
  npm version patch --no-git-tag-version
  BASE_VERSION=$(node -p "require('./package.json').version")
  NEW_VERSION="${BASE_VERSION}-${TAG}"
  npm version "$NEW_VERSION" --no-git-tag-version
  echo -e "${YELLOW}Publishing version ${NEW_VERSION} with tag 'prerelease'${NC}"
  # Publish with prerelease tag for beta/alpha versions
  npm publish --tag prerelease --no-git-checks
  SHARED_VERSION="$NEW_VERSION"
else
  # For regular releases, just bump patch version
  npm version patch --no-git-tag-version
  npm publish --no-git-checks
  SHARED_VERSION=$(node -p "require('./package.json').version")
fi

echo -e "${GREEN}✅ Published weddingplanner-shared@${SHARED_VERSION}${NC}"

# Step 4: Update web and backend with new versions (optional)
read -p "Do you want to update web and backend with the new package versions? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${BLUE}📦 Updating web dependencies...${NC}"
    cd "$ROOT_DIR/web"
    
    # Update to exact tagged version (no caret)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\"weddingplanner-shared\": \".*\"/\"weddingplanner-shared\": \"${SHARED_VERSION}\"/" package.json
    else
        sed -i "s/\"weddingplanner-shared\": \".*\"/\"weddingplanner-shared\": \"${SHARED_VERSION}\"/" package.json
    fi
    
    echo -e "${BLUE}📦 Updating backend dependencies...${NC}"
    cd "$ROOT_DIR/backend"
    
    # Update to exact tagged version (no caret)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\"weddingplanner-types\": \".*\"/\"weddingplanner-types\": \"${TYPES_VERSION}\"/" package.json
    else
        sed -i "s/\"weddingplanner-types\": \".*\"/\"weddingplanner-types\": \"${TYPES_VERSION}\"/" package.json
    fi
    
    # Run pnpm install at the root to update all workspaces
    echo -e "${BLUE}📦 Installing updated dependencies across all workspaces...${NC}"
    cd "$ROOT_DIR"
    pnpm install -r
    
    echo -e "${GREEN}✅ All projects updated with tagged versions!${NC}"
fi

cd "$ROOT_DIR"
echo -e "${GREEN}🎉 Package publication complete!${NC}"
if [ -n "$TAG" ]; then
  echo "Published versions with tag '${TAG}':"
else
  echo "Published versions:"
fi
echo "  - weddingplanner-types@${TYPES_VERSION}"
echo "  - weddingplanner-shared@${SHARED_VERSION}"