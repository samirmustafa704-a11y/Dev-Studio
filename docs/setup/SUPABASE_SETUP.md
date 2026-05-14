# Supabase Setup Guide

Complete guide for setting up Supabase for Dev Studio.

## Initial Project Setup

For the basic steps to create a Supabase project and collect your API credentials, please refer to the **[Setup Guide](./README.md#supabase-setup)**.

Once you have your project ready and credentials added to `.env.local`, follow the technical configuration steps below.

## Database Setup

### Create Tables

Dev Studio uses minimal database schema. Only the `profiles` table is required:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Run SQL

1. Go to **SQL Editor**
2. Click **New Query**
3. Paste the SQL above
4. Click **Run**

## Authentication Setup

### Email/Password (Default)

Email/password authentication is enabled by default.

To customize:
1. Go to **Authentication** → **Providers**
2. Click **Email**
3. Configure settings:
   - Enable/disable email confirmations
   - Set email templates
   - Configure SMTP (optional)

### OAuth Providers

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback?provider=google
   ```
6. Copy Client ID and Client Secret
7. In Supabase:
   - Go to **Authentication** → **Providers** → **Google**
   - Paste Client ID and Client Secret
   - Click **Save**

#### GitHub OAuth

1. Go to GitHub Settings → **Developer settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Dev Studio
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**:
     ```
     https://your-project.supabase.co/auth/v1/callback?provider=github
     ```
4. Copy Client ID and Client Secret
5. In Supabase:
   - Go to **Authentication** → **Providers** → **GitHub**
   - Paste Client ID and Client Secret
   - Click **Save**

#### Microsoft OAuth

1. Go to [Azure Portal](https://portal.azure.com)
2. Create new app registration
3. Add redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback?provider=azure
   ```
4. Create client secret
5. In Supabase:
   - Go to **Authentication** → **Providers** → **Microsoft**
   - Paste Client ID and Client Secret
   - Click **Save**

### Email Templates

Customize email templates:

1. Go to **Authentication** → **Email Templates**
2. Edit templates for:
   - Confirmation email
   - Password reset
   - Magic link
   - Change email

## Row Level Security (RLS)

Dev Studio uses RLS to ensure users can only access their own data.

### Enable RLS

1. Go to **Database** → **Tables**
2. Select table
3. Click **RLS** toggle to enable

### Create Policies

Example policy for profiles table:

```sql
-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

## Backup & Recovery

### Enable Backups

1. Go to **Settings** → **Backups**
2. Backups are enabled by default
3. Free tier: 7-day retention
4. Paid tier: 30-day retention

### Manual Backup

1. Go to **Settings** → **Backups**
2. Click **Request backup**
3. Backup will be created within 24 hours

### Restore from Backup

1. Go to **Settings** → **Backups**
2. Select backup
3. Click **Restore**
4. Confirm restoration

## Monitoring

### View Logs

1. Go to **Logs** → **API Logs**
2. View recent API requests
3. Check for errors

### Monitor Usage

1. Go to **Settings** → **Usage**
2. View:
   - Database size
   - Auth users
   - API requests
   - Storage usage

## Troubleshooting

### Connection Error

1. Verify credentials in `.env.local`
2. Check Supabase project is active
3. Ensure API keys are not expired
4. Check network connectivity

### Authentication Not Working

1. Verify OAuth provider credentials
2. Check redirect URIs are correct
3. Ensure email is verified (if using email auth)
4. Check browser console for errors

### Database Errors

1. Check RLS policies are correct
2. Verify user has permission to access table
3. Check table exists in database
4. View logs for detailed error messages

## Next Steps

- Add to `.env.local` (see [Environment Variables](./ENVIRONMENT.md))
- Start development server: `npm run dev`
- Read [Setup Guide](./README.md) for complete setup
- Check [Architecture Overview](../architecture/README.md) to understand the system

---

**Last updated**: May 2026
