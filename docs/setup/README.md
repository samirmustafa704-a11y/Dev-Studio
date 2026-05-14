# Setup Guide

Complete guide for setting up Dev Studio for local development.

## 🚀 Quick Start (5 Minutes)

Get Dev Studio running in 5 minutes.

### 1. Clone & Install
```bash
git clone https://github.com/firstall31-dot/Dev-Studio.git
cd Dev-Studio
npm install
```

### 2. Configure Environment
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Get your **Project URL** and **Anon Public Key** from **Settings** → **API**.
3. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
4. Edit `.env.local` with your credentials.

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5000` in your browser.

---

## Prerequisites

- **Node.js** 18.0.0 or higher (or Bun 1.0+)
- **npm** 9.0.0+ or **Bun** package manager
- **Git** 2.30+
- **Supabase account** (free tier available at https://supabase.com)


## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/firstall31-dot/Dev-Studio.git
cd Dev-Studio
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using Bun:
```bash
bun install
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials. See [Credentials Setup Guide](./CREDENTIALS_SETUP.md) for detailed instructions on collecting all required credentials:

**Required Credentials:**
- Supabase (database and auth)
- Slack (notifications)
- Cloudflare (deployment)
- Sentry (error tracking)

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: Dev Studio
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to you
5. Wait for project to initialize (2-3 minutes)

### Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values to `.env.local`:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Project ID** → `VITE_SUPABASE_PROJECT_ID`

See [Supabase Setup](./SUPABASE_SETUP.md) for detailed instructions.

### Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable desired providers:
   - Email/Password (enabled by default)
   - Google OAuth
   - GitHub OAuth
   - Microsoft OAuth

See [Supabase Setup](./SUPABASE_SETUP.md#oauth-configuration) for OAuth setup.

## Development Workflow

### Available Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run build:dev        # Build in development mode
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run format:check     # Check formatting without changes

# Testing (when configured)
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Project Structure

```
src/
├── routes/              # TanStack Router pages
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Dashboard
│   ├── prompts.tsx      # Prompts page
│   ├── agents.tsx       # AI Agents page
│   ├── components.tsx   # Components page
│   ├── templates.tsx    # Templates page
│   ├── snippets.tsx     # Snippets page
│   ├── interview.tsx    # Interview prep
│   ├── auth.tsx         # Login page
│   └── profile.tsx      # User profile
├── components/          # React components
│   ├── ui/              # shadcn/ui components
│   ├── app-shell.tsx    # Main layout
│   └── ...
├── hooks/               # Custom React hooks
│   ├── use-auth.tsx     # Authentication hook
│   └── ...
├── lib/                 # Utilities and store
│   ├── store.ts         # Zustand store
│   ├── types.ts         # TypeScript types
│   ├── seed.ts          # Initial data
│   └── ...
├── integrations/        # External services
│   └── supabase/        # Supabase client
└── styles.css           # Global styles
```

## Troubleshooting

### Port 5000 Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
npm run dev -- --port 5001
```

### Supabase Connection Error

1. Verify `.env.local` has correct credentials
2. Check Supabase project is active
3. Ensure API keys are not expired
4. Check network connectivity

See [Troubleshooting](../deployment/TROUBLESHOOTING.md) for more issues.

### Dependencies Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Next Steps

- Read [Quick Start](./QUICKSTART.md) for a 5-minute overview
- Check [Architecture Overview](../architecture/README.md) to understand the system
- Review [Components Guide](../components/README.md) for UI components
- See [Deployment Guide](../deployment/README.md) when ready to deploy

## Getting Help

- 📖 Check relevant documentation section
- 🐛 Search [GitHub Issues](https://github.com/firstall31-dot/Dev-Studio/issues)
- 💬 Start a [GitHub Discussion](https://github.com/firstall31-dot/Dev-Studio/discussions)
- 📧 Contact the team

---

**Last updated**: May 2026
