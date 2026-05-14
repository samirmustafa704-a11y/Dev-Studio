# Docker Guide

Complete guide for containerizing Dev Studio with Docker.

## Overview

Docker allows you to:
- **Consistent environments** - Same setup across dev, staging, production
- **Easy deployment** - Single command to deploy
- **Isolation** - App runs in isolated container
- **Scaling** - Easy to scale horizontally

## Prerequisites

- **Docker** 20.10+
- **Docker Compose** 2.0+

Install from [docker.com](https://www.docker.com/products/docker-desktop)

## Development Setup

### Build Development Image

```bash
docker-compose -f docker/docker-compose.dev.yml build
```

### Start Development Environment

```bash
docker-compose -f docker/docker-compose.dev.yml up
```

The app will be available at `http://localhost:5000`

### Stop Development Environment

```bash
docker-compose -f docker/docker-compose.dev.yml down
```

### View Logs

```bash
docker-compose -f docker/docker-compose.dev.yml logs -f
```

## Production Setup

### Build Production Image

```bash
docker build -f docker/Dockerfile -t dev-studio:latest .
```

### Run Production Container

```bash
docker run -p 5000:5000 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your_key \
  -e VITE_SUPABASE_PROJECT_ID=your_id \
  dev-studio:latest
```

### Using Docker Compose

```bash
docker-compose -f docker/docker-compose.yml up
```

## Docker Files

### Dockerfile (Production)

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 5000
CMD ["npm", "run", "preview"]
```

### Dockerfile.dev (Development)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
```

### docker-compose.yml (Production)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "5000:5000"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
      - VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### docker-compose.dev.yml (Development)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile.dev
    ports:
      - "5000:5000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
      - VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID}
    command: npm run dev
```

## Environment Variables

### Create .env File

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Pass to Container

```bash
# Using --env-file
docker run --env-file .env -p 5000:5000 dev-studio:latest

# Using -e flag
docker run -e VITE_SUPABASE_URL=... -p 5000:5000 dev-studio:latest

# Using docker-compose
docker-compose up
```

## Common Commands

### Build Image

```bash
# Production
docker build -f docker/Dockerfile -t dev-studio:latest .

# Development
docker build -f docker/Dockerfile.dev -t dev-studio:dev .

# With tag
docker build -f docker/Dockerfile -t dev-studio:v1.0.0 .
```

### Run Container

```bash
# Interactive
docker run -it -p 5000:5000 dev-studio:latest

# Detached
docker run -d -p 5000:5000 dev-studio:latest

# With volume mount
docker run -v $(pwd):/app -p 5000:5000 dev-studio:dev
```

### View Containers

```bash
# Running containers
docker ps

# All containers
docker ps -a

# Container logs
docker logs <container_id>

# Follow logs
docker logs -f <container_id>
```

### Stop Container

```bash
# Stop
docker stop <container_id>

# Kill
docker kill <container_id>

# Remove
docker rm <container_id>
```

### Docker Compose

```bash
# Start
docker-compose up

# Start in background
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose build --no-cache
```

## Optimization

### Multi-Stage Build

The production Dockerfile uses multi-stage build:

1. **Builder stage** - Install dependencies and build
2. **Runtime stage** - Copy only necessary files

This reduces final image size from ~500MB to ~200MB.

### .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
dist
.output
.vinxi
```

### Image Size

```bash
# Check image size
docker images dev-studio

# Analyze layers
docker history dev-studio:latest
```

## Deployment

### Push to Registry

```bash
# Tag image
docker tag dev-studio:latest myregistry/dev-studio:latest

# Push to Docker Hub
docker push myregistry/dev-studio:latest

# Push to private registry
docker push registry.example.com/dev-studio:latest
```

### Deploy to Cloud

#### AWS ECS

```bash
# Create ECR repository
aws ecr create-repository --repository-name dev-studio

# Push image
docker push <account_id>.dkr.ecr.<region>.amazonaws.com/dev-studio:latest

# Deploy with ECS
aws ecs create-service --cluster my-cluster --service-name dev-studio ...
```

#### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/my-project/dev-studio

# Deploy
gcloud run deploy dev-studio --image gcr.io/my-project/dev-studio
```

#### Azure Container Instances

```bash
# Push to ACR
az acr build --registry myregistry --image dev-studio:latest .

# Deploy
az container create --resource-group mygroup --name dev-studio ...
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs <container_id>

# Check environment variables
docker inspect <container_id>

# Run with interactive shell
docker run -it dev-studio:latest /bin/sh
```

### Port Already in Use

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
docker run -p 5001:5000 dev-studio:latest
```

### Build Fails

```bash
# Clear cache
docker build --no-cache -f docker/Dockerfile -t dev-studio:latest .

# Check Dockerfile syntax
docker build --progress=plain -f docker/Dockerfile .

# Check dependencies
npm ci --verbose
```

### Volume Mount Issues

```bash
# Check volume is mounted
docker inspect <container_id> | grep Mounts

# Verify path exists
ls -la /path/to/mount

# Use absolute paths
docker run -v /absolute/path:/app ...
```

## Best Practices

1. **Use specific base image versions** - Not `latest`
2. **Multi-stage builds** - Reduce image size
3. **Minimize layers** - Combine RUN commands
4. **Use .dockerignore** - Exclude unnecessary files
5. **Health checks** - Monitor container health
6. **Security scanning** - Scan images for vulnerabilities
7. **Resource limits** - Set CPU and memory limits
8. **Logging** - Configure proper logging

## Related Documentation

- [DevOps Guide](./README.md) - Overview
- [CI/CD Setup](./CICD.md) - GitHub Actions
- [Deployment Guide](../deployment/README.md) - Production deployment

---

**Last updated**: May 2026
