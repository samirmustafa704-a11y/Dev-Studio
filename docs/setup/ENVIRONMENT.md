# Environment Variables

Complete reference for all environment variables used in Dev Studio.

## Required Variables

### Supabase Configuration

```env
# Supabase Project URL
VITE_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anon Public Key (safe to expose in frontend)
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Project ID (for reference)
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## Optional Variables

### Development

```env
# Enable debug logging
DEBUG=dev-studio:*

# API timeout (milliseconds)
API_TIMEOUT=30000

# Enable mock data
USE_MOCK_DATA=false
```

### Deployment

```env
# Cloudflare Workers
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# Sentry Error Tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Analytics
ANALYTICS_ID=your_analytics_id
```

## Environment Files

### Development (`.env.local`)

Used for local development. Never commit to git.

```bash
cp .env.example .env.local
```

### Production (`.env.production`)

Used when building for production. Set in CI/CD or deployment platform.

### Staging (`.env.staging`)

Used for staging environment. Set in CI/CD.

## Setting Variables

For detailed instructions on where and how to set these variables, refer to the following guides:

- **Local Development**: See **[Setup Guide](./README.md#3-environment-configuration)**
- **CI/CD (GitHub Secrets)**: See **[CI/CD Setup Guide](../devops/CICD.md#1-add-github-secrets)**
- **Production (Cloudflare Workers)**: See **[Cloudflare Deployment](../deployment/CLOUDFLARE.md#environment-variables)**
- **Docker**: Pass via `.env.local` or directly in `docker-compose.yml`

## Variable Naming Convention

- **`VITE_`** prefix - Exposed to frontend (safe values only)
- **No prefix** - Server-side only (secrets)
- **`CLOUDFLARE_`** prefix - Cloudflare-specific
- **`SENTRY_`** prefix - Sentry-specific

## Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use `.env.example`** - Template with placeholder values
3. **Rotate keys regularly** - Especially API tokens
4. **Use different keys per environment** - Dev, staging, production
5. **Limit key permissions** - Use Supabase role-based access
6. **Monitor key usage** - Check Supabase logs for suspicious activity

## Validation

Environment variables are validated on app startup:

```typescript
// src/integrations/supabase/client.ts
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing required Supabase environment variables');
}
```

If validation fails, the app will not start.

## Troubleshooting

### Variables Not Loading

1. Check file is named `.env.local` (not `.env`)
2. Restart dev server after changing variables
3. Verify syntax: `KEY=value` (no spaces around `=`)

### Variables Undefined in Frontend

1. Ensure variable starts with `VITE_` prefix
2. Restart dev server
3. Check browser console for errors

### Variables Undefined in Server

1. Ensure variable does NOT start with `VITE_` prefix
2. Set in `.dev.vars` for Cloudflare Workers
3. Check Cloudflare dashboard for production

## Reference

See [Supabase Setup](./SUPABASE_SETUP.md) for getting Supabase credentials.

See [Deployment Guide](../deployment/README.md) for environment setup per deployment target.

---

**Last updated**: May 2026
