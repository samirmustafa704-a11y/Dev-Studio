# Data Models

Complete reference for all data types and schemas used in Dev Studio.

## Asset Types

### Prompt

Versioned prompt library with variables and usage tracking.

```typescript
interface Prompt {
  id: string                    // Unique identifier
  title: string                 // Prompt title
  description: string           // Short description
  category: string              // Category (e.g., "API Design")
  tags: string[]                // Search tags
  body: string                  // Prompt content
  variables: string[]           // Template variables (e.g., ["language", "framework"])
  model?: string                // Preferred AI model
  favorite?: boolean            // Marked as favorite
  usageCount: number            // Times used
  versions: {                   // Version history
    id: string
    createdAt: number
    body: string
    note?: string
  }[]
  createdAt: number             // Creation timestamp
  updatedAt: number             // Last update timestamp
}
```

**Example:**
```json
{
  "id": "prompt_abc123",
  "title": "API Design Review",
  "description": "Review API design for best practices",
  "category": "Backend",
  "tags": ["api", "design", "review"],
  "body": "Review this {{language}} API for:\n- RESTful principles\n- Error handling\n- Authentication",
  "variables": ["language"],
  "model": "gpt-4",
  "favorite": true,
  "usageCount": 42,
  "versions": [],
  "createdAt": 1715000000000,
  "updatedAt": 1715000000000
}
```

### Agent

Custom AI agent with system prompt and tools.

```typescript
interface Agent {
  id: string                    // Unique identifier
  name: string                  // Agent name
  role: string                  // Agent role/description
  systemPrompt: string          // System prompt for AI
  tools: string[]               // Available tools
  model: string                 // AI model (e.g., "gpt-4")
  temperature: number           // Temperature (0-2)
  status: "active" | "idle" | "draft"  // Agent status
  tags: string[]                // Search tags
  createdAt: number             // Creation timestamp
  updatedAt: number             // Last update timestamp
}
```

**Example:**
```json
{
  "id": "agent_xyz789",
  "name": "Code Reviewer",
  "role": "Reviews code for quality and best practices",
  "systemPrompt": "You are an expert code reviewer...",
  "tools": ["analyze_code", "suggest_improvements"],
  "model": "gpt-4",
  "temperature": 0.7,
  "status": "active",
  "tags": ["code-review", "quality"],
  "createdAt": 1715000000000,
  "updatedAt": 1715000000000
}
```

### Component

Reusable code component with dependencies.

```typescript
interface ComponentAsset {
  id: string                    // Unique identifier
  name: string                  // Component name
  description: string           // Description
  category: string              // Category (e.g., "Form")
  tags: string[]                // Search tags
  code: string                  // Component code
  dependencies: string[]        // Required packages
  favorite?: boolean            // Marked as favorite
  usageCount: number            // Times used
  createdAt: number             // Creation timestamp
  updatedAt: number             // Last update timestamp
}
```

**Example:**
```json
{
  "id": "comp_def456",
  "name": "Form Input",
  "description": "Reusable form input component",
  "category": "Form",
  "tags": ["form", "input", "react"],
  "code": "export const FormInput = ({ ... }) => { ... }",
  "dependencies": ["react", "react-hook-form"],
  "favorite": true,
  "usageCount": 15,
  "createdAt": 1715000000000,
  "updatedAt": 1715000000000
}
```

### Template

Project template with tech stack.

```typescript
interface Template {
  id: string                    // Unique identifier
  name: string                  // Template name
  description: string           // Description
  stack: string[]               // Tech stack (e.g., ["React", "Node", "PostgreSQL"])
  tags: string[]                // Search tags
  structure: string             // Project structure description
  notes: string                 // Additional notes
  createdAt: number             // Creation timestamp
  updatedAt: number             // Last update timestamp
}
```

**Example:**
```json
{
  "id": "tmpl_ghi789",
  "name": "Full-Stack Web App",
  "description": "Modern full-stack web application",
  "stack": ["React", "Node.js", "PostgreSQL", "Docker"],
  "tags": ["fullstack", "web", "production"],
  "structure": "src/\n  components/\n  pages/\n  api/\nserver/\n  routes/\n  middleware/",
  "notes": "Includes authentication and database setup",
  "createdAt": 1715000000000,
  "updatedAt": 1715000000000
}
```

### Snippet

Code snippet by language.

```typescript
interface Snippet {
  id: string                    // Unique identifier
  title: string                 // Snippet title
  language: string              // Programming language
  description: string           // Description
  code: string                  // Code content
  tags: string[]                // Search tags
  createdAt: number             // Creation timestamp
  updatedAt: number             // Last update timestamp
}
```

**Example:**
```json
{
  "id": "snip_jkl012",
  "title": "Fetch with Retry",
  "language": "typescript",
  "description": "Fetch with automatic retry logic",
  "code": "async function fetchWithRetry(...) { ... }",
  "tags": ["fetch", "retry", "async"],
  "createdAt": 1715000000000,
  "updatedAt": 1715000000000
}
```

### Interview Question

Q&A for interview preparation.

```typescript
interface InterviewQuestion {
  id: string                    // Unique identifier
  question: string              // Question text
  answer: string                // Answer text
  answerDepths?: {              // Multiple answer depths
    id: string
    label: string               // Depth level (e.g., "Junior", "Senior")
    body: string                // Answer for this level
  }[]
  area: FocusArea               // Focus area
  difficulty: Difficulty        // Difficulty level
  tags: string[]                // Search tags
  category?: string             // Category
  favorite?: boolean            // Marked as favorite
  createdAt: number             // Creation timestamp
}

type FocusArea = "frontend" | "backend" | "devops" | "testing" | "database" | "general"
type Difficulty = "junior" | "mid" | "senior"
```

**Example:**
```json
{
  "id": "iq_mno345",
  "question": "What is React?",
  "answer": "React is a JavaScript library for building user interfaces...",
  "answerDepths": [
    {
      "id": "depth_1",
      "label": "Junior",
      "body": "React is a library for building UIs with components"
    },
    {
      "id": "depth_2",
      "label": "Senior",
      "body": "React is a declarative, component-based library with virtual DOM..."
    }
  ],
  "area": "frontend",
  "difficulty": "junior",
  "tags": ["react", "javascript", "frontend"],
  "category": "Frameworks",
  "favorite": false,
  "createdAt": 1715000000000
}
```

## Database Schema

### Profiles Table

Stores user profile information.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - User ID from Supabase Auth
- `display_name` - User's display name
- `avatar_url` - URL to user's avatar
- `created_at` - Account creation time
- `updated_at` - Last profile update

## Storage

### localStorage

All asset data is stored in browser localStorage under key `forgedev-store-v3`.

**Structure:**
```json
{
  "state": {
    "prompts": [...],
    "agents": [...],
    "components": [...],
    "templates": [...],
    "snippets": [...],
    "interviewQuestions": [...]
  }
}
```

**Limits:**
- ~5-10MB per browser
- Per-domain storage
- Persists across sessions
- Cleared when browser data is cleared

## Type Definitions

All types are defined in `src/lib/types.ts`:

```typescript
export type AssetKind = "prompt" | "agent" | "component" | "template" | "snippet"
export type FocusArea = "frontend" | "backend" | "devops" | "testing" | "database" | "general"
export type Difficulty = "junior" | "mid" | "senior"
```

## Relationships

```
User (Supabase Auth)
  ↓
Profile (Database)
  ↓
Assets (localStorage)
  ├─ Prompts
  ├─ Agents
  ├─ Components
  ├─ Templates
  ├─ Snippets
  └─ Interview Questions
```

## Timestamps

All timestamps are Unix milliseconds (not seconds):

```typescript
// Current time
const now = Date.now()  // e.g., 1715000000000

// Convert to Date
const date = new Date(timestamp)

// Format
const formatted = new Date(timestamp).toLocaleString()
```

## IDs

All IDs are generated with prefix and random suffix:

```typescript
// Format: prefix_randomstring
// Examples:
// - prompt_abc123def456
// - agent_xyz789uvw012
// - comp_ghi345jkl678
```

## Validation

All data is validated with Zod schemas in `src/lib/types.ts`.

## Related Documentation

- [Architecture Overview](./README.md) - System design and data flow
- [Setup Guide](../setup/README.md) - Local setup and configuration

---

**Last updated**: May 2026
