# Credentials Setup Guide

Complete guide for collecting and configuring all credentials for Dev Studio.

## Overview

Dev Studio requires credentials from multiple services:
- **Slack** - Team notifications
- **Cloudflare** - Deployment and hosting
- **Sentry** - Error tracking
- **Supabase** - Database and authentication

## 🔐 Slack Credentials

### Your Slack App Details

**App ID:** `A0B4G5Q1VSL`

**Date of App Creation:** [Your creation date]

### Credentials to Collect

#### 1. Client ID
```
11123859410146.11152194063904
```
- **Location:** OAuth & Permissions
- **Security:** Public (safe to share)
- **Usage:** OAuth authorization flows

#### 2. Client Secret ⚠️
```
[REDACTED]
```
- **Location:** OAuth & Permissions
- **Security:** KEEP SECRET - Never commit to git
- **Usage:** OAuth token exchange
- **GitHub Secret:** `SLACK_CLIENT_SECRET`

#### 3. Signing Secret ⚠️
```
[REDACTED]
```
- **Location:** Basic Information
- **Security:** KEEP SECRET - Never commit to git
- **Usage:** Verify requests from Slack
- **GitHub Secret:** `SLACK_SIGNING_SECRET`

#### 4. Verification Token (Deprecated) ⚠️
```
[REDACTED]
```
- **Location:** Basic Information
- **Security:** KEEP SECRET - Deprecated but still secure
- **Usage:** Legacy request verification
- **GitHub Secret:** `SLACK_VERIFICATION_TOKEN`

### Setup Instructions

1. **Add to GitHub Secrets:**
   ```
   SLACK_APP_ID=A0B4G5Q1VSL
   SLACK_CLIENT_ID=11123859410146.11152194063904
   SLACK_CLIENT_SECRET=[REDACTED]
   SLACK_SIGNING_SECRET=[REDACTED]
   SLACK_VERIFICATION_TOKEN=[REDACTED]
   ```

2. **Add to .env.local (local development):**
   ```env
   SLACK_APP_ID=A0B4G5Q1VSL
   SLACK_CLIENT_ID=11123859410146.11152194063904
   SLACK_CLIENT_SECRET=[REDACTED]
   SLACK_SIGNING_SECRET=[REDACTED]
   SLACK_VERIFICATION_TOKEN=[REDACTED]
   ```

3. **Get Bot Token and Webhook URL:**
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Select your app
   - Go to **OAuth & Permissions**
   - Copy **Bot User OAuth Token** (starts with `xoxb-`)
   - Go to **Incoming Webhooks**
   - Copy **Webhook URL**

4. **Add Bot Token and Webhook:**
   ```
   SLACK_BOT_TOKEN=xoxb-your-token-here
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
   ```

## ☁️ Cloudflare Credentials

### Your Cloudflare API Token

**API Token:** `[REDACTED]`

### Credentials to Collect

#### 1. API Token ⚠️
```
[REDACTED]
```
- **Location:** Cloudflare Dashboard → My Profile → API Tokens
- **Security:** KEEP SECRET - Never commit to git
- **Usage:** Deploy to Cloudflare Workers
- **GitHub Secret:** `CLOUDFLARE_API_TOKEN`

#### 2. Account ID
- **Location:** Cloudflare Dashboard → Workers → Overview
- **Security:** Public (safe to share)
- **Usage:** Identify your Cloudflare account
- **GitHub Secret:** `CLOUDFLARE_ACCOUNT_ID`

### Verify Token

To verify your token is valid:

```bash
curl "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer [REDACTED]"
```

Expected response:
```json
{
  "success": true,
  "errors": [],
  "messages": [],
  "result": {
    "id": "token_id",
    "status": "active"
  }
}
```

### Setup Instructions

1. **Add to GitHub Secrets:**
   ```
   CLOUDFLARE_API_TOKEN=[REDACTED]
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   ```

2. **Add to .env.local:**
   ```env
   CLOUDFLARE_API_TOKEN=[REDACTED]
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   ```

3. **Test Deployment:**
   ```bash
   npm run build
   wrangler deploy
   ```

## 🔍 Sentry Error Tracking

### Your Sentry Configuration

**DSN:** `https://[REDACTED]@o4511383932567552.ingest.de.sentry.io/4511383934271568`

**Auth Token:** `[REDACTED]`

### Credentials to Collect

#### 1. DSN (Data Source Name) ⚠️
```
https://[REDACTED]@o4511383932567552.ingest.de.sentry.io/4511383934271568
```
- **Location:** Sentry Project → Settings → Client Keys (DSN)
- **Security:** KEEP SECRET - Contains project key
- **Usage:** Initialize Sentry in your app
- **GitHub Secret:** `SENTRY_DSN`

#### 2. Auth Token ⚠️
```
[REDACTED]
```
- **Location:** Sentry → Settings → Auth Tokens
- **Security:** KEEP SECRET - Never commit to git
- **Usage:** Sentry CLI operations
- **GitHub Secret:** `SENTRY_AUTH_TOKEN`

#### 3. Organization Slug
```
dev-studio-zp
```
- **Location:** Sentry → Settings → Organization
- **Security:** Public (safe to share)
- **Usage:** Identify your Sentry organization
- **GitHub Secret:** `SENTRY_ORG`

#### 4. Project Slug
```
your-project-slug
```
- **Location:** Sentry Project → Settings
- **Security:** Public (safe to share)
- **Usage:** Identify your Sentry project
- **GitHub Secret:** `SENTRY_PROJECT`

### Setup Instructions

1. **Add to GitHub Secrets:**
   ```
   SENTRY_DSN=https://[REDACTED]@o4511383932567552.ingest.de.sentry.io/4511383934271568
   SENTRY_AUTH_TOKEN=[REDACTED]
   SENTRY_ORG=dev-studio-zp
   SENTRY_PROJECT=your-project-slug
   ```

2. **Add to .env.local:**
   ```env
   SENTRY_DSN=https://[REDACTED]@o4511383932567552.ingest.de.sentry.io/4511383934271568
   SENTRY_AUTH_TOKEN=[REDACTED]
   SENTRY_ORG=dev-studio-zp
   SENTRY_PROJECT=your-project-slug
   ```

3. **Initialize Sentry in your app:**
   ```typescript
   import * as Sentry from "@sentry/react";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
     sendDefaultPii: true,
   });

   const container = document.getElementById("app");
   const root = createRoot(container);
   root.render(<App />);
   ```

## 📊 Supabase Credentials

### Credentials to Collect

#### 1. Project URL
- **Location:** Supabase Dashboard → Settings → API
- **Format:** `https://your-project.supabase.co`
- **Security:** Public (safe to share)
- **GitHub Secret:** `VITE_SUPABASE_URL`

#### 2. Anon Public Key
- **Location:** Supabase Dashboard → Settings → API
- **Security:** Public (safe to expose in frontend)
- **GitHub Secret:** `VITE_SUPABASE_PUBLISHABLE_KEY`

#### 3. Project ID
- **Location:** Supabase Dashboard → Settings → General
- **Security:** Public (safe to share)
- **GitHub Secret:** `VITE_SUPABASE_PROJECT_ID`

### Setup Instructions

See [Supabase Setup Guide](./SUPABASE_SETUP.md) for complete instructions.

## 📋 Complete Credentials Checklist

### Slack
- [ ] App ID: `A0B4G5Q1VSL`
- [ ] Client ID: `11123859410146.11152194063904`
- [ ] Client Secret: `[REDACTED]`
- [ ] Signing Secret: `[REDACTED]`
- [ ] Verification Token: `[REDACTED]`
- [ ] Bot Token: `xoxb-...`
- [ ] Webhook URL: `https://hooks.slack.com/services/...`

### Cloudflare
- [ ] API Token: `[REDACTED]`
- [ ] Account ID: `your_account_id`

### Sentry
- [ ] DSN: `https://[REDACTED]@o4511383932567552.ingest.de.sentry.io/4511383934271568`
- [ ] Auth Token: `[REDACTED]`
- [ ] Organization: `dev-studio-zp`
- [ ] Project: `your-project-slug`

### Supabase
- [ ] Project URL: `https://your-project.supabase.co`
- [ ] Anon Key: `your_anon_key`
- [ ] Project ID: `your_project_id`

## 🔐 Security Best Practices

1. **Never commit secrets** - Add `.env.local` to `.gitignore`
2. **Use GitHub Secrets** - Store all secrets in GitHub
3. **Rotate regularly** - Rotate tokens monthly
4. **Monitor usage** - Check logs for suspicious activity
5. **Use signing secrets** - Verify all requests
6. **Limit scopes** - Only request necessary permissions
7. **Revoke old tokens** - When rotating credentials

## 🆘 Troubleshooting

### Credentials Not Working

1. Verify credentials are correct
2. Check they haven't expired
3. Verify they have required permissions
4. Check GitHub Secrets are set
5. Restart development server

### Permission Denied

1. Verify credentials have required scopes
2. Check service permissions
3. Verify credentials are active
4. Regenerate if needed

## 📞 Support

- [Slack Setup Guide](./SLACK_SETUP.md)
- [Slack Credentials Reference](../integrations/SLACK_CREDENTIALS.md)
- [Environment Variables](./ENVIRONMENT.md)
- [Deployment Guide](../deployment/README.md)

---

**Last updated**: May 2026
