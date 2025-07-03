# Makefile for Node.js Dockerized Project

# Variables
PROJECT_NAME = express-app
COMPOSE = docker compose

# Default: build and start
up:
	$(COMPOSE) up --build

# Start without rebuilding
start:
	$(COMPOSE) up

# Stop containers
stop:
	$(COMPOSE) down

# Stop and remove volumes
clean:
	$(COMPOSE) down -v

# Build only
build:
	$(COMPOSE) build

# Show logs
logs:
	$(COMPOSE) logs -f

# Rebuild specific service (example: api)
rebuild-api:
	$(COMPOSE) up --build api

# Check compose version
version:
	$(COMPOSE) version

# List containers
ps:
	$(COMPOSE) ps

# Run shell in api container
shell:
	$(COMPOSE) exec api sh
