# Slack Integration Setup

Complete guide for integrating Dev Studio with Slack.

## Overview

Slack integration enables:
- Deployment notifications
- Error alerts
- Build status updates
- Team notifications
- Custom workflows

## Prerequisites

- Slack workspace (free or paid)
- Admin access to Slack workspace
- Dev Studio GitHub repository

## Step 1: Create Slack App

### 1.1 Go to Slack API

1. Visit [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App**
3. Choose **From scratch**

### 1.2 Configure App

1. **App Name**: `Dev Studio`
2. **Workspace**: Select your workspace
3. Click **Create App**

### 1.3 Get Credentials

You'll need these values:

**From Basic Information:**
- **App ID** - Unique identifier for your app
- **Client ID** - OAuth client identifier
- **Client Secret** - OAuth client secret (keep secure!)
- **Signing Secret** - For verifying requests from Slack
- **Verification Token** - Legacy verification (deprecated)

**Save these securely** - you'll need them later.

## Step 2: Configure OAuth

### 2.1 Set Redirect URLs

1. Go to **OAuth & Permissions**
2. Scroll to **Redirect URLs**
3. Click **Add New Redirect URL**
4. Add: `https://your-domain.com/slack/oauth_redirect`
5. Click **Save URLs**

### 2.2 Set Scopes

1. Go to **OAuth & Permissions**
2. Scroll to **Scopes**
3. Under **Bot Token Scopes**, add:
   - `chat:write` - Send messages
   - `chat:write.public` - Send to public channels
   - `channels:read` - Read channel info
   - `users:read` - Read user info
   - `incoming-webhook` - Incoming webhooks

### 2.3 Install App

1. Go to **OAuth & Permissions**
2. Click **Install to Workspace**
3. Authorize the app
4. Copy **Bot User OAuth Token** (starts with `xoxb-`)

## Step 3: Configure Incoming Webhooks

### 3.1 Enable Webhooks

1. Go to **Incoming Webhooks**
2. Toggle **Activate Incoming Webhooks** to ON
3. Click **Add New Webhook to Workspace**

### 3.2 Select Channel

1. Choose channel for notifications (e.g., `#dev-studio`)
2. Click **Allow**
3. Copy the **Webhook URL**

**Webhook URL format:**
```
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

## Step 4: Configure Event Subscriptions

### 4.1 Enable Events

1. Go to **Event Subscriptions**
2. Toggle **Enable Events** to ON
3. Enter **Request URL**: `https://your-domain.com/slack/events`
4. Slack will verify the URL

### 4.2 Subscribe to Events

1. Scroll to **Subscribe to bot events**
2. Add events:
   - `app_mention` - When app is mentioned
   - `message.channels` - Channel messages
   - `message.groups` - Group messages

3. Click **Save Changes**

## Step 5: Add to GitHub Secrets

### 5.1 GitHub Secrets

Go to **GitHub** → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

```
SLACK_BOT_TOKEN=xoxb-your-token-here
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_ID=your-app-id
SLACK_CLIENT_ID=your-client-id
SLACK_CLIENT_SECRET=your-client-secret
```

### 5.2 Local Development

Create `.env.local`:

```env
SLACK_BOT_TOKEN=xoxb-your-token-here
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_SIGNING_SECRET=your-signing-secret
```

## Step 6: Update GitHub Workflows

### 6.1 Deployment Notifications

Update `.github/workflows/deploy.yml`:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Deployment ${{ job.status }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Dev Studio Deployment*\nStatus: ${{ job.status }}\nCommit: ${{ github.sha }}\nAuthor: ${{ github.actor }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
    SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

### 6.2 Build Notifications

Add to `.github/workflows/ci.yml`:

```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Build failed",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Build Failed*\nBranch: ${{ github.ref }}\nCommit: ${{ github.sha }}\nAuthor: ${{ github.actor }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
    SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

## Step 7: Test Integration

### 7.1 Manual Test

Send a test message:

```bash
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-type: application/json' \
  -d '{
    "text": "Dev Studio is connected!",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Dev Studio* is now connected to Slack ✅"
        }
      }
    ]
  }'
```

### 7.2 Test Deployment

1. Create a test PR
2. Merge to main
3. Watch GitHub Actions
4. Check Slack for notification

## Step 8: Create Slack Channel

### 8.1 Create Channel

1. In Slack, click **+** next to Channels
2. Create channel: `#dev-studio`
3. Add description: "Dev Studio notifications"
4. Add team members

### 8.2 Configure Channel

1. Click channel name
2. Go to **Integrations**
3. Add the Dev Studio app
4. Configure notification preferences

## Slack Message Templates

### Deployment Success

```json
{
  "text": "Deployment successful",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "✅ Deployment Successful"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Environment:*\nProduction"
        },
        {
          "type": "mrkdwn",
          "text": "*Status:*\nSuccess"
        },
        {
          "type": "mrkdwn",
          "text": "*Commit:*\n`abc123def`"
        },
        {
          "type": "mrkdwn",
          "text": "*Author:*\n@username"
        }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View Deployment"
          },
          "url": "https://github.com/firstall31-dot/Dev-Studio/deployments"
        }
      ]
    }
  ]
}
```

### Build Failed

```json
{
  "text": "Build failed",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "❌ Build Failed"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Branch:*\nmain"
        },
        {
          "type": "mrkdwn",
          "text": "*Status:*\nFailed"
        },
        {
          "type": "mrkdwn",
          "text": "*Error:*\nLinting failed"
        },
        {
          "type": "mrkdwn",
          "text": "*Author:*\n@username"
        }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View Logs"
          },
          "url": "https://github.com/firstall31-dot/Dev-Studio/actions"
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Webhook Not Working

1. Verify webhook URL is correct
2. Check Slack workspace is active
3. Verify app is installed in workspace
4. Check message format is valid JSON

### Events Not Received

1. Verify Event Subscriptions are enabled
2. Check Request URL is accessible
3. Verify signing secret is correct
4. Check Slack app logs

### Permission Denied

1. Verify bot has required scopes
2. Check channel permissions
3. Verify app is installed in workspace
4. Reinstall app if needed

## Security Best Practices

1. **Never commit secrets** - Use GitHub Secrets
2. **Rotate tokens regularly** - Monthly or quarterly
3. **Use signing secret** - Verify all requests from Slack
4. **Limit scopes** - Only request needed permissions
5. **Monitor activity** - Check Slack app logs regularly

## Advanced Configuration

### Custom Workflows

Create custom Slack workflows:

1. Go to **Workflow Builder** in Slack
2. Create new workflow
3. Trigger: Webhook
4. Add steps for notifications
5. Get webhook URL

### Slash Commands

Add slash commands:

1. Go to **Slash Commands**
2. Click **Create New Command**
3. Command: `/dev-studio`
4. Request URL: `https://your-domain.com/slack/commands`
5. Save

### Interactive Components

Add buttons and menus:

1. Go to **Interactivity & Shortcuts**
2. Enable Interactivity
3. Request URL: `https://your-domain.com/slack/interactions`
4. Save

## Related Documentation

- [DevOps Guide](../devops/README.md) - CI/CD overview
- [Deployment Guide](../deployment/README.md) - Production deployment
- [GitHub Actions](../devops/CICD.md) - CI/CD setup

## Resources

- [Slack API Docs](https://api.slack.com)
- [Slack Webhooks](https://api.slack.com/messaging/webhooks)
- [Slack Bot Tokens](https://api.slack.com/authentication/token-types)
- [Slack Message Formatting](https://api.slack.com/reference/surfaces/formatting)

---

**Last updated**: May 2026
