# Slack Credentials Reference

Complete guide to understanding and managing Slack credentials for Dev Studio.

## Credential Types

### 1. App ID

**What it is:** Unique identifier for your Slack app

**Where to find it:**
- Slack API Dashboard → Your App → Basic Information
- Format: `A0123456789`

**Usage:**
- Identifying your app
- OAuth flows
- API requests

**Security:** ✅ Safe to share (public identifier)

### 2. Client ID

**What it is:** OAuth 2.0 client identifier

**Where to find it:**
- Slack API Dashboard → Your App → OAuth & Permissions
- Format: `123456789012.1234567890123`

**Usage:**
- OAuth authorization requests
- Identifying your app to Slack
- Token exchange

**Security:** ✅ Safe to share (public identifier)

### 3. Client Secret

**What it is:** OAuth 2.0 client secret for authentication

**Where to find it:**
- Slack API Dashboard → Your App → OAuth & Permissions
- Format: Long alphanumeric string

**Usage:**
- Exchanging authorization code for token
- Server-to-server authentication
- Refreshing tokens

**Security:** ⚠️ **KEEP SECRET** - Never commit to git
- Store in GitHub Secrets
- Store in `.env.local` (not committed)
- Rotate regularly

### 4. Bot User OAuth Token

**What it is:** Token for bot user to perform actions

**Where to find it:**
- Slack API Dashboard → Your App → OAuth & Permissions
- Format: `your-bot-token-goes-here`

**Usage:**
- Sending messages
- Reading channels
- User operations
- All bot actions

**Security:** ⚠️ **KEEP SECRET** - Never commit to git
- Store in GitHub Secrets as `SLACK_BOT_TOKEN`
- Store in `.env.local` (not committed)
- Rotate if compromised

### 5. Signing Secret

**What it is:** Secret for verifying requests from Slack

**Where to find it:**
- Slack API Dashboard → Your App → Basic Information
- Format: Long alphanumeric string

**Usage:**
- Verifying webhook requests
- Confirming requests come from Slack
- Security validation

**Security:** ⚠️ **KEEP SECRET** - Never commit to git
- Store in GitHub Secrets as `SLACK_SIGNING_SECRET`
- Store in `.env.local` (not committed)
- Use for request verification

### 6. Verification Token (Deprecated)

**What it is:** Legacy token for verifying requests

**Where to find it:**
- Slack API Dashboard → Your App → Basic Information

**Usage:**
- Legacy request verification
- Deprecated - use Signing Secret instead

**Security:** ⚠️ Deprecated but still keep secret

### 7. Webhook URL

**What it is:** URL for sending messages to Slack

**Where to find it:**
- Slack API Dashboard → Your App → Incoming Webhooks
- Format: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX`

**Usage:**
- Sending notifications
- Posting messages to channels
- GitHub Actions notifications

**Security:** ⚠️ **KEEP SECRET** - Never commit to git
- Store in GitHub Secrets as `SLACK_WEBHOOK_URL`
- Store in `.env.local` (not committed)
- Regenerate if compromised

## Environment Variables

### GitHub Secrets

Set these in **Settings** → **Secrets and variables** → **Actions**:

```
SLACK_BOT_TOKEN=xoxb-...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_SIGNING_SECRET=...
SLACK_APP_ID=A...
SLACK_CLIENT_ID=...
SLACK_CLIENT_SECRET=...
```

### Local Development (.env.local)

Create `.env.local` (not committed):

```env
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_ID=your-app-id
SLACK_CLIENT_ID=your-client-id
SLACK_CLIENT_SECRET=your-client-secret
```

### Cloudflare Workers

Set in Cloudflare dashboard or `.dev.vars`:

```env
SLACK_BOT_TOKEN=xoxb-...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_SIGNING_SECRET=...
```

## Security Best Practices

### 1. Never Commit Secrets

❌ **Bad:**
```bash
git add .env
git commit -m "Add Slack credentials"
```

✅ **Good:**
```bash
# Add to .gitignore
echo ".env.local" >> .gitignore

# Use GitHub Secrets
# Use environment variables
```

### 2. Rotate Tokens Regularly

- **Frequency:** Monthly or quarterly
- **Process:**
  1. Generate new token in Slack
  2. Update GitHub Secrets
  3. Update `.env.local`
  4. Revoke old token

### 3. Use Signing Secret for Verification

```typescript
// Verify Slack request
import crypto from 'crypto';

function verifySlackRequest(req) {
  const timestamp = req.headers['x-slack-request-timestamp'];
  const signature = req.headers['x-slack-signature'];
  
  const baseString = `v0:${timestamp}:${req.body}`;
  const hmac = crypto
    .createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
    .update(baseString)
    .digest('hex');
  
  const computedSignature = `v0=${hmac}`;
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}
```

### 4. Limit Scopes

Only request necessary permissions:

```
chat:write          # Send messages
channels:read       # Read channels
users:read          # Read users
incoming-webhook    # Incoming webhooks
```

### 5. Monitor Activity

- Check Slack app logs regularly
- Review token usage
- Monitor failed requests
- Set up alerts for suspicious activity

## Credential Rotation

### Step 1: Generate New Credentials

1. Go to Slack API Dashboard
2. Select your app
3. Go to relevant section (OAuth, Webhooks, etc.)
4. Generate new token/secret

### Step 2: Update GitHub Secrets

1. Go to GitHub → Settings → Secrets
2. Update each secret with new value
3. Verify workflows use updated secrets

### Step 3: Update Local Environment

1. Update `.env.local` with new values
2. Test locally
3. Verify everything works

### Step 4: Revoke Old Credentials

1. Go back to Slack API Dashboard
2. Revoke old token/secret
3. Confirm revocation

### Step 5: Verify

1. Test GitHub Actions workflows
2. Test local development
3. Monitor for errors
4. Check Slack logs

## Troubleshooting

### "Invalid token" Error

1. Verify token is correct
2. Check token hasn't expired
3. Verify token has required scopes
4. Regenerate token if needed

### "Unauthorized" Error

1. Check signing secret is correct
2. Verify request format
3. Check timestamp is recent
4. Verify app is installed in workspace

### "Channel not found" Error

1. Verify channel exists
2. Check app is in channel
3. Verify channel ID is correct
4. Check channel permissions

### Webhook Not Working

1. Verify webhook URL is correct
2. Check message format is valid JSON
3. Verify webhook hasn't expired
4. Regenerate webhook if needed

## Credential Checklist

- [ ] App ID obtained
- [ ] Client ID obtained
- [ ] Client Secret obtained and secured
- [ ] Bot Token obtained and secured
- [ ] Signing Secret obtained and secured
- [ ] Webhook URL obtained and secured
- [ ] GitHub Secrets configured
- [ ] Local .env.local configured
- [ ] Cloudflare Workers configured
- [ ] Credentials tested
- [ ] Rotation schedule set

## Related Documentation

- [Slack Setup Guide](./SLACK_SETUP.md) - Complete setup instructions
- [Environment Variables](../setup/ENVIRONMENT.md) - Environment configuration
- [Deployment Guide](../deployment/README.md) - Production deployment

## Resources

- [Slack API Authentication](https://api.slack.com/authentication)
- [OAuth 2.0](https://api.slack.com/authentication/oauth-v2)
- [Token Types](https://api.slack.com/authentication/token-types)
- [Signing Secret](https://api.slack.com/authentication/verifying-requests-from-slack)

---

**Last updated**: May 2026
