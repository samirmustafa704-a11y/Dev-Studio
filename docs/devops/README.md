# DevOps Guide

Complete guide for CI/CD, Docker, monitoring, and infrastructure.

## Overview

This guide covers:
- **CI/CD Pipelines** - Automated testing and deployment
- **Docker** - Containerization for development and production
- **Monitoring** - Error tracking and performance monitoring
- **Database** - Migrations and backups
- **Security** - Best practices and hardening

## Quick Links

- [CI/CD Setup](./CICD.md) - GitHub Actions workflows
- [Docker Guide](./DOCKER.md) - Containerization
- [Monitoring](./MONITORING.md) - Error tracking and logs
- [Database](./DATABASE.md) - Migrations and backups
- [Security](./SECURITY.md) - Security best practices

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Push to main/develop                            │   │
│  │  ↓                                                │   │
│  │  GitHub Actions Workflow Triggered               │   │
│  │  ├─ Lint & Type Check                            │   │
│  │  ├─ Build                                        │   │
│  │  ├─ Test                                         │   │
│  │  └─ Deploy (if main branch)                      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Cloudflare Workers (Production)             │
│  - Global edge deployment                               │
│  - Automatic scaling                                    │
│  - Zero cold starts                                     │
└─────────────────────────────────────────────────────────┘
```

## Environments

### Development

- **Branch**: `develop`
- **Deployment**: Manual or on PR
- **Database**: Supabase dev project
- **Monitoring**: Basic logging

### Staging

- **Branch**: `staging`
- **Deployment**: Automatic on push
- **Database**: Supabase staging project
- **Monitoring**: Full monitoring enabled

### Production

- **Branch**: `main`
- **Deployment**: Automatic on push
- **Database**: Supabase production project
- **Monitoring**: Full monitoring with alerts

## Deployment Flow

```
1. Developer pushes code to GitHub
   ↓
2. GitHub Actions workflow triggered
   ↓
3. Lint & type check
   ↓
4. Build application
   ↓
5. Run tests
   ↓
6. If all pass:
   ├─ Build Docker image
   ├─ Push to registry
   └─ Deploy to Cloudflare Workers
   ↓
7. Smoke tests
   ↓
8. Notify team
```

## Key Files

```
.github/
├── workflows/
│   ├── ci.yml              # Lint, build, test
│   ├── deploy.yml          # Deploy to production
│   └── docker.yml          # Build and push Docker image
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
└── pull_request_template.md

docker/
├── Dockerfile              # Production image
├── Dockerfile.dev          # Development image
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
└── .dockerignore

supabase/
├── migrations/             # Database migrations
└── seed.sql               # Initial data
```

## 🛠️ Infrastructure & Automation

Our infrastructure is designed for scalability and reliability, leveraging modern DevOps practices.

### CI/CD
Automated pipelines handle linting, testing, and deployment.
→ **[CI/CD Setup Guide](./CICD.md)**

### Containerization
Docker is used for environment consistency across development and production.
→ **[Docker Guide](./DOCKER.md)**

### Monitoring
Real-time error tracking and performance analytics.
→ **[Monitoring & Logging](./MONITORING.md)**

### Database & Security
Standardized migration workflows and security hardening guidelines.
→ **[Database Management](./DATABASE.md)** | **[Security Best Practices](./SECURITY.md)**

## Best Practices

1. **Always test locally** before pushing
2. **Use feature branches** for development
3. **Write descriptive commit messages**
4. **Keep dependencies updated**
5. **Monitor production closely** after deployment
6. **Document infrastructure changes**
7. **Automate repetitive tasks**
8. **Use environment variables** for configuration

## Related Documentation

- [CI/CD Setup](./CICD.md) - GitHub Actions workflows
- [Docker Guide](./DOCKER.md) - Containerization
- [Monitoring](./MONITORING.md) - Error tracking
- [Database](./DATABASE.md) - Migrations
- [Security](./SECURITY.md) - Security practices
- [Deployment Guide](../deployment/README.md) - Production deployment

---

**Last updated**: May 2026
