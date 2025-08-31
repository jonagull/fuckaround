.PHONY: up down dev build logs ps clean

# Start services in detached mode
up:
	docker-compose up -d

# Stop and remove services
down:
	docker-compose down

# Build images and start services (for development)
dev:
	docker-compose up --build

# Build images only
build:
	docker-compose build

# View logs
logs:
	docker-compose logs -f

# Show running containers
ps:
	docker-compose ps

# Clean up everything (including volumes)
clean:
	docker-compose down -v

# Open Prisma Studio
studio:
	docker exec -it wedding_planner_backend pnpm studio
