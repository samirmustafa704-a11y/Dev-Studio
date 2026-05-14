# CI/CD Setup

Complete guide for continuous integration and deployment with GitHub Actions.

## Overview

GitHub Actions automatically:
- Lint code on every push
- Type check with TypeScript
- Build the application
- Run tests
- Deploy to production (on main branch)
- Notify team of results

## Workflows

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and pull request.

**Jobs:**
1. **Lint** - ESLint validation
2. **Build** - Build application
3. **Test** - Run test suite
4. **Security** - Vulnerability scanning

**Triggers:**
- Push to `main` or `develop`
- Pull request to `main` or `develop`

### Deploy Workflow (`.github/workflows/deploy.yml`)

Runs on push to `main` branch only.

**Jobs:**
1. **Lint** - Code quality check
2. **Build** - Build application
3. **Deploy** - Deploy to Cloudflare Workers
4. **Notify** - Send Slack notification

**Triggers:**
- Push to `main` branch only

## Setup

### 1. Add GitHub Secrets

Go to **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
SLACK_WEBHOOK_URL (optional)
```

### 2. Configure Environments

Go to **Settings** → **Environments**

Create `production` environment:
- Add deployment branch: `main`
- Add required reviewers (optional)
- Add secrets specific to production

### 3. Enable Actions

Go to **Actions** tab and enable GitHub Actions if not already enabled.

## Workflow Files

### CI Workflow

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit

  build:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test -- --run
        continue-on-error: true

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          format: 'sarif'
          output: 'trivy-results.sarif'
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

### Deploy Workflow

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
          VITE_SUPABASE_PROJECT_ID: ${{ secrets.VITE_SUPABASE_PROJECT_ID }}
      - run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      - uses: slackapi/slack-github-action@v1
        if: always()
        with:
          payload: |
            {
              "text": "Deployment ${{ job.status }}",
              "blocks": [...]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Monitoring

### View Workflow Runs

1. Go to **Actions** tab
2. Select workflow
3. View run details

### Check Status

- ✅ Green - All checks passed
- ❌ Red - One or more checks failed
- ⏳ Yellow - Workflow running

### View Logs

1. Click on workflow run
2. Click on job
3. View step logs

## Troubleshooting

### Workflow Failed

1. Check workflow logs
2. Verify secrets are set correctly
3. Check branch protection rules
4. Review error messages

### Build Failed

```bash
# Run locally to debug
npm run build
npm run lint
npx tsc --noEmit
```

### Deploy Failed

1. Check Cloudflare credentials
2. Verify environment variables
3. Check Wrangler configuration
4. Review deployment logs

### Tests Failing

```bash
# Run tests locally
npm run test -- --run

# Check test output
npm run test -- --reporter=verbose
```

## Best Practices

1. **Keep workflows simple** - One job per workflow
2. **Use caching** - Cache dependencies for speed
3. **Fail fast** - Run quick checks first
4. **Notify team** - Send Slack/email notifications
5. **Monitor runs** - Check workflow status regularly
6. **Update dependencies** - Keep actions up to date
7. **Document changes** - Update workflow docs when changing

## Advanced Configuration

### Matrix Builds

Test across multiple Node versions:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### Conditional Steps

Run step only on main branch:

```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: npm run deploy
```

### Scheduled Runs

Run workflow on schedule:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```

### Manual Trigger

Allow manual workflow trigger:

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
```

## Related Documentation

- [DevOps Guide](./README.md) - Overview
- [Docker Guide](./DOCKER.md) - Containerization
- [Deployment Guide](../deployment/README.md) - Production deployment

---

**Last updated**: May 2026
