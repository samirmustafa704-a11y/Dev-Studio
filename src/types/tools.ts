export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  body: string;
  variables: string[];
  model?: string;
  favorite?: boolean;
  usageCount: number;
  versions: { id: string; createdAt: number; body: string; note?: string }[];
  createdAt: number;
  updatedAt: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  tools: string[];
  model: string;
  temperature: number;
  status: "active" | "idle" | "draft";
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ComponentAsset {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  code: string;
  dependencies: string[];
  favorite?: boolean;
  usageCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  stack: string[];
  tags: string[];
  structure: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface Snippet {
  id: string;
  title: string;
  language: string;
  description: string;
  code: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Connector {
  id: string;
  type: string; // companies, hr, clients
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SocialDraft {
  id: string;
  platform: string; // linkedin, twitter, instagram
  content: string;
  mediaUrls: string[];
  createdAt: number;
  updatedAt: number;
}

export interface MailTemplate {
  id: string;
  channel: string; // cover-letter, gmail, whatsapp
  subject?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}
