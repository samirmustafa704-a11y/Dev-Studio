# Integrations Guide

Complete guide for integrating Dev Studio with external services.

## Available Integrations

### Slack

Connect Dev Studio with Slack for notifications and team collaboration.

**Features:**
- Deployment notifications
- Build status updates
- Error alerts
- Team notifications
- Custom workflows

**Setup Time:** 15-20 minutes

**Difficulty:** Beginner

**Documentation:**
- [Slack Setup Guide](./SLACK_SETUP.md) - Step-by-step setup
- [Slack Credentials Reference](./SLACK_CREDENTIALS.md) - Credential management

**Quick Start:**
1. Create Slack app at [api.slack.com/apps](https://api.slack.com/apps)
2. Get credentials (Bot Token, Webhook URL, Signing Secret)
3. Add to GitHub Secrets
4. Update workflows
5. Test integration

---

## Integration Overview

```
Dev Studio
    ↓
GitHub Actions
    ↓
Slack Webhook
    ↓
Slack Workspace
    ↓
Team Notifications
```

## Supported Services

| Service | Status | Documentation |
|---------|--------|---------------|
| Slack | ✅ Complete | [Slack Setup](./SLACK_SETUP.md) |
| Sentry | 🔄 Planned | Coming soon |
| DataDog | 🔄 Planned | Coming soon |
| PagerDuty | 🔄 Planned | Coming soon |
| Discord | 🔄 Planned | Coming soon |

## Quick Links

### Setup Guides
- [Slack Setup](./SLACK_SETUP.md) - Complete Slack integration
- [Slack Credentials](./SLACK_CREDENTIALS.md) - Credential management

### Configuration
- [Environment Variables](../setup/ENVIRONMENT.md) - All environment variables
- [GitHub Secrets](../devops/CICD.md) - GitHub Actions secrets

### Deployment
- [Deployment Guide](../deployment/README.md) - Production deployment
- [DevOps Guide](../devops/README.md) - DevOps overview

## Common Tasks

### Send Slack Notification

Using GitHub Actions:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Deployment successful",
        "blocks": [...]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Verify Slack Request

In your application:

```typescript
import crypto from 'crypto';

function verifySlackRequest(req) {
  const timestamp = req.headers['x-slack-request-timestamp'];
  const signature = req.headers['x-slack-signature'];
  
  const baseString = `v0:${timestamp}:${req.body}`;
  const hmac = crypto
    .createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
    .update(baseString)
    .digest('hex');
  
  return `v0=${hmac}` === signature;
}
```

### Send Message to Slack

Using webhook:

```bash
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-type: application/json' \
  -d '{
    "text": "Dev Studio notification",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Deployment Successful* ✅"
        }
      }
    ]
  }'
```

## Troubleshooting

### Integration Not Working

1. Check credentials are correct
2. Verify environment variables are set
3. Check GitHub Actions logs
4. Verify Slack app is installed
5. Check Slack workspace permissions

### Missing Notifications

1. Verify webhook URL is correct
2. Check message format is valid
3. Verify channel exists
4. Check app is in channel
5. Review Slack app logs

### Permission Errors

1. Verify app has required scopes
2. Check channel permissions
3. Verify app is installed in workspace
4. Reinstall app if needed

## Best Practices

1. **Use GitHub Secrets** - Never commit credentials
2. **Verify Requests** - Use signing secret to verify Slack requests
3. **Rotate Credentials** - Rotate tokens regularly
4. **Monitor Activity** - Check logs for suspicious activity
5. **Test Thoroughly** - Test integrations before production
6. **Document Setup** - Document your integration setup
7. **Keep Updated** - Update integrations when services change

## Security

### Credential Management

- ✅ Store in GitHub Secrets
- ✅ Store in `.env.local` (not committed)
- ✅ Rotate regularly
- ✅ Use signing secret for verification
- ❌ Never commit to git
- ❌ Never share publicly
- ❌ Never log credentials

### Request Verification

Always verify requests from Slack:

```typescript
// Verify timestamp is recent (within 5 minutes)
const timestamp = parseInt(req.headers['x-slack-request-timestamp']);
const now = Math.floor(Date.now() / 1000);
if (Math.abs(now - timestamp) > 300) {
  throw new Error('Request too old');
}

// Verify signature
if (!verifySlackRequest(req)) {
  throw new Error('Invalid signature');
}
```

## Related Documentation

- [Slack Setup Guide](./SLACK_SETUP.md) - Complete setup
- [Slack Credentials](./SLACK_CREDENTIALS.md) - Credential reference
- [Environment Variables](../setup/ENVIRONMENT.md) - Configuration
- [GitHub Actions](../devops/CICD.md) - CI/CD setup
- [Deployment Guide](../deployment/README.md) - Production deployment

## Resources

- [Slack API Documentation](https://api.slack.com)
- [Slack Webhooks](https://api.slack.com/messaging/webhooks)
- [Slack Bot Tokens](https://api.slack.com/authentication/token-types)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Last updated**: May 2026
