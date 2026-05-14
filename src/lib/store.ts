import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Prompt, Agent, ComponentAsset, Template, Snippet } from "../types/tools";
import type { InterviewQuestion } from "../types/skills";
import { seedAgents, seedComponents, seedPrompts, seedSnippets, seedTemplates } from "../data/seeds/tools";
import { seedInterviewQuestions } from "../data/seeds/interview-core";
import { seedInterviewExtra } from "../data/seeds/interview-extra";

const allInterviewQuestions = [...seedInterviewQuestions, ...seedInterviewExtra];

interface ForgeState {
  prompts: Prompt[];
  agents: Agent[];
  components: ComponentAsset[];
  templates: Template[];
  snippets: Snippet[];
  interviewQuestions: InterviewQuestion[];

  upsertPrompt: (p: Prompt) => void;
  deletePrompt: (id: string) => void;
  toggleFavoritePrompt: (id: string) => void;
  incrementPromptUsage: (id: string) => void;

  upsertAgent: (a: Agent) => void;
  deleteAgent: (id: string) => void;

  upsertComponent: (c: ComponentAsset) => void;
  deleteComponent: (id: string) => void;
  toggleFavoriteComponent: (id: string) => void;

  upsertTemplate: (t: Template) => void;
  deleteTemplate: (id: string) => void;

  upsertSnippet: (s: Snippet) => void;
  deleteSnippet: (id: string) => void;

  upsertInterviewQuestion: (q: InterviewQuestion) => void;
  deleteInterviewQuestion: (id: string) => void;
  toggleFavoriteInterviewQuestion: (id: string) => void;

  resetSeed: () => void;
}

export const useForge = create<ForgeState>()(
  persist(
    (set) => ({
      prompts: seedPrompts,
      agents: seedAgents,
      components: seedComponents,
      templates: seedTemplates,
      snippets: seedSnippets,
      interviewQuestions: allInterviewQuestions,

      upsertPrompt: (p) =>
        set((s) => {
          const exists = s.prompts.some((x) => x.id === p.id);
          return { prompts: exists ? s.prompts.map((x) => (x.id === p.id ? p : x)) : [p, ...s.prompts] };
        }),
      deletePrompt: (id) => set((s) => ({ prompts: s.prompts.filter((p) => p.id !== id) })),
      toggleFavoritePrompt: (id) =>
        set((s) => ({ prompts: s.prompts.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)) })),
      incrementPromptUsage: (id) =>
        set((s) => ({ prompts: s.prompts.map((p) => (p.id === id ? { ...p, usageCount: p.usageCount + 1 } : p)) })),

      upsertAgent: (a) =>
        set((s) => {
          const exists = s.agents.some((x) => x.id === a.id);
          return { agents: exists ? s.agents.map((x) => (x.id === a.id ? a : x)) : [a, ...s.agents] };
        }),
      deleteAgent: (id) => set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),

      upsertComponent: (c) =>
        set((s) => {
          const exists = s.components.some((x) => x.id === c.id);
          return { components: exists ? s.components.map((x) => (x.id === c.id ? c : x)) : [c, ...s.components] };
        }),
      deleteComponent: (id) => set((s) => ({ components: s.components.filter((c) => c.id !== id) })),
      toggleFavoriteComponent: (id) =>
        set((s) => ({
          components: s.components.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)),
        })),

      upsertTemplate: (t) =>
        set((s) => {
          const exists = s.templates.some((x) => x.id === t.id);
          return { templates: exists ? s.templates.map((x) => (x.id === t.id ? t : x)) : [t, ...s.templates] };
        }),
      deleteTemplate: (id) => set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),

      upsertSnippet: (s2) =>
        set((s) => {
          const exists = s.snippets.some((x) => x.id === s2.id);
          return { snippets: exists ? s.snippets.map((x) => (x.id === s2.id ? s2 : x)) : [s2, ...s.snippets] };
        }),
      deleteSnippet: (id) => set((s) => ({ snippets: s.snippets.filter((x) => x.id !== id) })),

      upsertInterviewQuestion: (q) =>
        set((s) => {
          const exists = s.interviewQuestions.some((x) => x.id === q.id);
          return {
            interviewQuestions: exists
              ? s.interviewQuestions.map((x) => (x.id === q.id ? q : x))
              : [q, ...s.interviewQuestions],
          };
        }),
      deleteInterviewQuestion: (id) =>
        set((s) => ({ interviewQuestions: s.interviewQuestions.filter((q) => q.id !== id) })),
      toggleFavoriteInterviewQuestion: (id) =>
        set((s) => ({
          interviewQuestions: s.interviewQuestions.map((q) =>
            q.id === id ? { ...q, favorite: !q.favorite } : q,
          ),
        })),

      resetSeed: () =>
        set({
          prompts: seedPrompts,
          agents: seedAgents,
          components: seedComponents,
          templates: seedTemplates,
          snippets: seedSnippets,
          interviewQuestions: allInterviewQuestions,
        }),
    }),
    { name: "forgedev-store-v3" },
  ),
);

export function fillVariables(body: string, values: Record<string, string>) {
  return body.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => values[k] ?? `{{${k}}}`);
}

export function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
