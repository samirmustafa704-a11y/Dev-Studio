# Deployment Guide

Complete guide for deploying Dev Studio to production.

## Overview

Dev Studio is deployed to **Cloudflare Workers** for:
- Global edge distribution
- Zero cold starts
- Automatic scaling
- Pay-per-use pricing

## Prerequisites

- Cloudflare account (free tier available)
- Wrangler CLI installed
- GitHub account with repository access
- Environment variables configured

## Quick Deploy

### 1. Install Wrangler

```bash
npm install -g wrangler
```

### 2. Authenticate

```bash
wrangler login
```

### 3. Configure wrangler.jsonc

```json
{
  "name": "dev-studio",
  "type": "service",
  "main": "src/server.ts",
  "build": {
    "command": "npm run build",
    "cwd": "."
  },
  "env": {
    "production": {
      "routes": [
        {
          "pattern": "dev-studio.example.com/*",
          "zone_name": "example.com"
        }
      ]
    }
  }
}
```

### 4. Deploy

```bash
npm run build
wrangler deploy
```

Your app is now live!

## Environments

### Development

```bash
# Local development
npm run dev

# Preview production build
npm run preview
```

### Staging

```bash
# Deploy to staging
wrangler deploy --env staging
```

### Production

```bash
# Deploy to production
wrangler deploy --env production
```

## Environment Variables

### Set Variables

1. Go to Cloudflare dashboard
2. Select your Worker
3. Go to **Settings** → **Environment Variables**
4. Add variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Local Development

Create `.dev.vars`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## Custom Domain

### Add Domain

1. Go to Cloudflare dashboard
2. Select your Worker
3. Go to **Triggers** → **Routes**
4. Click **Add route**
5. Enter route: `dev-studio.example.com/*`
6. Select zone: `example.com`

### DNS Configuration

1. Go to DNS settings
2. Add CNAME record:
   - **Name**: `dev-studio`
   - **Target**: `dev-studio.workers.dev`
   - **Proxy status**: Proxied

## Monitoring

### View Logs

```bash
# Real-time logs
wrangler tail

# View specific logs
wrangler tail --format json
```

### Metrics

1. Go to Cloudflare dashboard
2. Select your Worker
3. View metrics:
   - Requests
   - Errors
   - CPU time
   - Duration

### Error Tracking

Set up Sentry for error tracking:

1. Create Sentry project
2. Add to environment variables:
   ```
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   ```
3. Errors will be tracked automatically

## Rollback

### Rollback to Previous Version

```bash
# View deployment history
wrangler deployments list

# Rollback to specific version
wrangler rollback --version <version_id>
```

## Performance

### Optimize Bundle

```bash
# Analyze bundle size
npm run build -- --analyze

# Check what's included
wrangler publish --dry-run
```

### Caching

Configure caching headers in `wrangler.jsonc`:

```json
{
  "routes": [
    {
      "pattern": "dev-studio.example.com/static/*",
      "custom_domain": true,
      "cache": {
        "default_ttl": 3600,
        "browser_ttl": 1800
      }
    }
  ]
}
```

## Troubleshooting

### Deployment Failed

1. Check build output:
   ```bash
   npm run build
   ```

2. Verify environment variables:
   ```bash
   wrangler env list
   ```

3. Check Wrangler version:
   ```bash
   wrangler --version
   ```

### App Not Loading

1. Check Cloudflare status
2. View logs:
   ```bash
   wrangler tail
   ```
3. Check browser console for errors
4. Verify DNS is configured

### Slow Performance

1. Check Cloudflare metrics
2. Optimize bundle size
3. Enable caching
4. Check database queries

## Automated Deployment

### GitHub Actions

See [CI/CD Setup](../devops/CICD.md) for automated deployment on push to main.

### Manual Deployment

```bash
# Build and deploy
npm run build
wrangler deploy

# Deploy with message
wrangler deploy --message "Deploy v1.0.0"
```

## Security

### Secrets Management

Never commit secrets to git. Use environment variables:

```bash
# Set secret
wrangler secret put SUPABASE_SECRET_KEY

# List secrets
wrangler secret list

# Delete secret
wrangler secret delete SUPABASE_SECRET_KEY
```

### HTTPS

All Cloudflare Workers are automatically HTTPS.

### CORS

Configure CORS in your app:

```typescript
// src/server.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://dev-studio.example.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

## Scaling

Cloudflare Workers automatically scales based on traffic. No configuration needed.

### Limits

- **CPU time**: 50ms per request
- **Memory**: 128MB
- **Request size**: 100MB
- **Response size**: 6MB

## Cost

Cloudflare Workers pricing:
- **Free tier**: 100,000 requests/day
- **Paid tier**: $0.50 per million requests

See [Cloudflare pricing](https://workers.cloudflare.com/pricing/) for details.

## Related Documentation

- [DevOps Guide](../devops/README.md) - CI/CD and infrastructure
- [Docker Guide](../devops/DOCKER.md) - Containerization
- [Environment Variables](./ENVIRONMENT.md) - Configuration reference
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues

---

**Last updated**: May 2026
