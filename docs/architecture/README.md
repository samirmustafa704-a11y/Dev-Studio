# Architecture Overview

High-level overview of Dev Studio's system design and data flow.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 19 + TanStack Router + TanStack Query         │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Pages (Routes)                                │  │   │
│  │  │  - Dashboard, Prompts, Agents, Components...  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Components (shadcn/ui + Custom)              │  │   │
│  │  │  - UI components, layouts, forms              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  State Management (Zustand)                   │  │   │
│  │  │  - Prompts, Agents, Components, Snippets...  │  │   │
│  │  │  - Persisted to localStorage                  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  TanStack Start (SSR)                        │
│  - Server-side rendering                                    │
│  - Error handling and normalization                         │
│  - Middleware pipeline                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Backend                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication (Supabase Auth)                      │   │
│  │  - Email/password, OAuth (Google, GitHub, MS)       │   │
│  │  - JWT tokens, session management                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database (PostgreSQL)                              │   │
│  │  - Profiles table (user data)                       │   │
│  │  - Row Level Security (RLS) policies                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Workers (Deployment)                │
│  - Edge computing                                           │
│  - Global distribution                                      │
│  - Serverless execution                                     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Authentication

```
1. User visits app
   ↓
2. AuthProvider checks session
   ↓
3. If no session → redirect to /auth
   ↓
4. User signs in (email/OAuth)
   ↓
5. Supabase Auth returns JWT token
   ↓
6. Token stored in localStorage
   ↓
7. User redirected to dashboard
   ↓
8. App loads user data
```

### Asset Management

```
1. User creates/edits asset (Prompt, Agent, etc.)
   ↓
2. Component dispatches Zustand action
   ↓
3. Zustand store updates state
   ↓
4. State persisted to localStorage
   ↓
5. UI re-renders with new data
   ↓
6. (Optional) Sync to Supabase
```

### Page Navigation

```
1. User clicks link
   ↓
2. TanStack Router matches route
   ↓
3. Route component renders
   ↓
4. TanStack Query fetches data (if needed)
   ↓
5. Component renders with data
   ↓
6. User sees page
```

## Core Modules

### 1. Authentication (`src/hooks/use-auth.tsx`)

Manages user authentication state and session.

**Key Functions:**
- `useAuth()` - Get current user and auth state
- `signOut()` - Sign out user
- `AuthProvider` - Wraps app with auth context

**Data:**
```typescript
{
  session: Session | null,
  user: User | null,
  isReady: boolean
}
```

### 2. State Management (`src/lib/store.ts`)

Zustand store for all asset data.

**Stores:**
- Prompts
- Agents
- Components
- Templates
- Snippets
- Interview Questions

**Features:**
- Persisted to localStorage
- Undo/redo support (via versions)
- Favorites and usage tracking
- Search and filtering

### 3. Routing (`src/routes/`)

TanStack Router for page navigation.

**Routes:**
- `/` - Dashboard
- `/prompts` - Prompts library
- `/agents` - AI Agents
- `/components` - Components library
- `/templates` - Project templates
- `/snippets` - Code snippets
- `/interview` - Interview prep
- `/auth` - Login page
- `/profile` - User profile

### 4. Components (`src/components/`)

React components for UI.

**Categories:**
- **UI Components** - shadcn/ui components
- **Layout** - AppShell, Sidebar, Header
- **Forms** - Input, Select, Textarea
- **Cards** - Asset cards, preview cards
- **Dialogs** - Modals, confirmations

### 5. Integrations (`src/integrations/`)

External service clients.

**Services:**
- Supabase - Database and auth
- (Future) OpenAI, Anthropic, etc.

## Technology Stack

### Frontend
- **React 19** - UI framework
- **TanStack Router** - Client-side routing
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **TanStack Start** - Full-stack framework
- **Vite** - Build tool
- **TypeScript** - Type safety

### Services
- **Supabase** - Auth and database
- **Cloudflare Workers** - Deployment

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vite** - Dev server and build

## State Management

### Zustand Store Structure

```typescript
interface ForgeState {
  // Data
  prompts: Prompt[]
  agents: Agent[]
  components: ComponentAsset[]
  templates: Template[]
  snippets: Snippet[]
  interviewQuestions: InterviewQuestion[]

  // Actions
  upsertPrompt(p: Prompt): void
  deletePrompt(id: string): void
  toggleFavoritePrompt(id: string): void
  // ... similar for other assets
}
```

### Persistence

- **Storage**: localStorage
- **Key**: `forgedev-store-v3`
- **Scope**: Per browser/device
- **Sync**: Manual (no auto-sync to server)

## Error Handling

### Client-Side

```typescript
// Try-catch in components
try {
  // Operation
} catch (error) {
  // Show toast notification
  toast.error('Operation failed')
}
```

### Server-Side

```typescript
// Error middleware in TanStack Start
const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next()
  } catch (error) {
    // Normalize error
    // Return error page
  }
})
```

## Performance Considerations

### Optimization Strategies

1. **Code Splitting** - Route-based code splitting via Vite
2. **Lazy Loading** - Components loaded on demand
3. **Memoization** - React.memo for expensive components
4. **Query Caching** - TanStack Query caches data
5. **State Persistence** - localStorage reduces API calls

### Bundle Size

- **Target**: < 200KB gzipped
- **Monitoring**: Vite bundle analysis
- **Optimization**: Tree-shaking, minification

## Security

### Authentication

- **JWT tokens** - Supabase Auth
- **Session persistence** - localStorage
- **Auto-refresh** - Token refresh on expiry
- **Logout** - Clear session and localStorage

### Data Protection

- **Row Level Security** - Supabase RLS policies
- **HTTPS only** - All connections encrypted
- **CORS** - Restricted to trusted origins
- **Input validation** - Zod schemas

### Secrets Management

- **API keys** - Never exposed in frontend
- **Environment variables** - Separate per environment
- **Rotation** - Regular key rotation

## Scalability

### Current Limitations

- **Data**: All stored in localStorage (browser limit ~5-10MB)
- **Users**: Single user per browser
- **Sync**: No real-time sync between devices

### Future Improvements

- **Server-side storage** - Move data to Supabase
- **Real-time sync** - WebSocket for live updates
- **Offline support** - Service workers for offline mode
- **Multi-device sync** - Sync across devices

## Deployment

### Development

```bash
npm run dev
# Runs on http://localhost:5000
```

### Production

```bash
npm run build
wrangler deploy
# Deployed to Cloudflare Workers
```

See [Deployment Guide](../deployment/README.md) for details.

## Related Documentation

- [Data Models](./DATA_MODELS.md) - Asset types and schemas
- [State Management](./STATE_MANAGEMENT.md) - Zustand store details
- [Components Guide](../components/README.md) - UI components
- [Deployment Guide](../deployment/README.md) - Production deployment

---

**Last updated**: May 2026
