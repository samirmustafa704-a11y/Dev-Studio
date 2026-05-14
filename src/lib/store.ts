import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Prompt, Agent, ComponentAsset, Template, Snippet, Connector, SocialDraft, MailTemplate } from "../types/tools";
import type { InterviewQuestion } from "../types/skills";
import * as db from "@/integrations/supabase/actions";
import { toast } from "sonner";
import { seedPrompts, seedAgents, seedComponents, seedTemplates, seedSnippets } from "@/data/seeds/tools";
import { seedInterviewQuestions } from "@/data/seeds/interview-core";
import { seedInterviewExtra } from "@/data/seeds/interview-extra";

interface ForgeState {
  prompts: Prompt[];
  agents: Agent[];
  components: ComponentAsset[];
  templates: Template[];
  snippets: Snippet[];
  interviewQuestions: InterviewQuestion[];
  connectors: Connector[];
  socialDrafts: SocialDraft[];
  mailTemplates: MailTemplate[];
  userProgress: Record<string, boolean>;
  isLoading: boolean;
  initialized: boolean;

  init: () => Promise<void>;
  
  upsertPrompt: (p: Prompt) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  toggleFavoritePrompt: (id: string) => Promise<void>;
  incrementPromptUsage: (id: string) => Promise<void>;

  upsertAgent: (a: Agent) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;

  upsertComponent: (c: ComponentAsset) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  toggleFavoriteComponent: (id: string) => Promise<void>;

  upsertTemplate: (t: Template) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;

  upsertSnippet: (s: Snippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;

  upsertConnector: (c: Connector) => Promise<void>;
  deleteConnector: (id: string) => Promise<void>;

  upsertSocialDraft: (d: SocialDraft) => Promise<void>;
  deleteSocialDraft: (id: string) => Promise<void>;

  upsertMailTemplate: (m: MailTemplate) => Promise<void>;
  deleteMailTemplate: (id: string) => Promise<void>;

  toggleProgress: (itemId: string, areaId: string) => Promise<void>;
  
  upsertInterviewQuestion: (q: InterviewQuestion) => Promise<void>;
  deleteInterviewQuestion: (id: string) => Promise<void>;
  toggleFavoriteInterviewQuestion: (id: string) => Promise<void>;
  seedIfEmpty: () => Promise<void>;
}

export const useForge = create<ForgeState>()(
  persist(
    (set, get) => ({
      prompts: [],
      agents: [],
      components: [],
      templates: [],
      snippets: [],
      interviewQuestions: [],
      connectors: [],
      socialDrafts: [],
      mailTemplates: [],
      userProgress: {},
      isLoading: false,
      initialized: false,

      init: async () => {
        if (get().initialized) return;
        set({ isLoading: true });
        try {
          const user = await db.getCurrentUser();
          if (user) {
            const [p, a, c, s, conn, soc, mail, q, prog] = await Promise.all([
              db.getPrompts(),
              db.getAgents(),
              db.getComponents(),
              db.getSnippets(),
              db.getConnectors(),
              db.getSocialDrafts(),
              db.getMailTemplates(),
              db.getInterviewQuestions(),
              db.getUserProgress(),
            ]);
            
            const progressMap: Record<string, boolean> = {};
            prog.forEach(i => progressMap[i.item_id] = i.completed ?? true);

            set({
              prompts: p.map(x => ({
                ...x,
                createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
                updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now(),
                usageCount: x.usage_count ?? 0
              } as any)),
              agents: a.map(x => ({
                ...x,
                systemPrompt: x.system_prompt,
                createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
                updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
              } as any)),
              components: c.map(x => ({
                ...x,
                createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
                updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now(),
                usageCount: x.usage_count ?? 0
              } as any)),
              snippets: s.map(x => ({
                ...x,
                createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
                updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
              } as any)),
              connectors: conn.map(x => ({
                ...x,
                createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
                updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
              } as any)),
              socialDrafts: soc.map(x => ({
                ...x,
                mediaUrls: x.media_urls,
                createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
                updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
              } as any)),
              mailTemplates: mail.map(x => ({
                ...x,
                createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
                updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now()
              } as any)),
              interviewQuestions: q.map(x => ({
                ...x,
                area: (x.domain as any) || "frontend",
                category: (x.domain as any) || "frontend",
                tags: x.tags || [],
                favorite: x.is_global ?? false, // Assuming is_global was used as a proxy for fav in some logic
                createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now()
              } as any)),
              userProgress: progressMap,
              initialized: true
            });

            // Seed if empty
            if (p.length === 0 && a.length === 0) {
              await get().seedIfEmpty();
            }
          }
        } catch (e) {
          console.error("Init store error:", e);
        } finally {
          set({ isLoading: false });
        }
      },

      upsertPrompt: async (p) => {
        set((s) => ({ prompts: s.prompts.some(x => x.id === p.id) ? s.prompts.map(x => x.id === p.id ? p : x) : [p, ...s.prompts] }));
        try { await db.upsertPrompt({ ...p, usage_count: p.usageCount, versions: p.versions as any, user_id: '' }); } catch (e) { console.error(e); }
      },
      deletePrompt: async (id) => {
        set((s) => ({ prompts: s.prompts.filter(p => p.id !== id) }));
        try { await db.deletePrompt(id); } catch (e) { console.error(e); }
      },
      toggleFavoritePrompt: async (id) => {
        const p = get().prompts.find(x => x.id === id);
        if (p) await get().upsertPrompt({ ...p, favorite: !p.favorite });
      },
      incrementPromptUsage: async (id) => {
        const p = get().prompts.find(x => x.id === id);
        if (p) await get().upsertPrompt({ ...p, usageCount: (p.usageCount || 0) + 1 });
      },

      upsertAgent: async (a) => {
        set((s) => ({ agents: s.agents.some(x => x.id === a.id) ? s.agents.map(x => x.id === a.id ? a : x) : [a, ...s.agents] }));
        try { await db.upsertAgent({ ...a, system_prompt: a.systemPrompt, user_id: '' }); } catch (e) { console.error(e); }
      },
      deleteAgent: async (id) => {
        set((s) => ({ agents: s.agents.filter(a => a.id !== id) }));
        try { await db.deleteAgent(id); } catch (e) { console.error(e); }
      },

      upsertComponent: async (c) => {
        set((s) => ({ components: s.components.some(x => x.id === c.id) ? s.components.map(x => x.id === c.id ? c : x) : [c, ...s.components] }));
        try { await db.upsertComponent({ ...c, usage_count: c.usageCount, user_id: '' }); } catch (e) { console.error(e); }
      },
      deleteComponent: async (id) => {
        set((s) => ({ components: s.components.filter(c => c.id !== id) }));
        try { await db.deleteComponent(id); } catch (e) { console.error(e); }
      },
      toggleFavoriteComponent: async (id) => {
        const c = get().components.find(x => x.id === id);
        if (c) await get().upsertComponent({ ...c, favorite: !c.favorite });
      },

      upsertSnippet: async (snip) => {
        set((s) => ({ snippets: s.snippets.some(x => x.id === snip.id) ? s.snippets.map(x => x.id === snip.id ? snip : x) : [snip, ...s.snippets] }));
        try { await db.upsertSnippet({ ...snip, user_id: '' }); } catch (e) { console.error(e); }
      },
      deleteSnippet: async (id) => {
        set((s) => ({ snippets: s.snippets.filter(x => x.id !== id) }));
        try { await db.deleteSnippet(id); } catch (e) { console.error(e); }
      },

      upsertConnector: async (conn) => {
        set((s) => ({ connectors: s.connectors.some(x => x.id === conn.id) ? s.connectors.map(x => x.id === conn.id ? conn : x) : [conn, ...s.connectors] }));
        try { await db.upsertConnector({ ...conn, user_id: '', type: conn.type as any }); } catch (e) { console.error(e); }
      },
      deleteConnector: async (id) => {
        set((s) => ({ connectors: s.connectors.filter(x => x.id !== id) }));
        try { await db.deleteConnector(id); } catch (e) { console.error(e); }
      },

      upsertSocialDraft: async (soc) => {
        set((s) => ({ socialDrafts: s.socialDrafts.some(x => x.id === soc.id) ? s.socialDrafts.map(x => x.id === soc.id ? soc : x) : [soc, ...s.socialDrafts] }));
        try { await db.upsertSocialDraft({ ...soc, user_id: '', platform: (soc.platform as string) || "linkedin", media_urls: soc.mediaUrls || [] }); } catch (e) { console.error(e); }
      },
      deleteSocialDraft: async (id) => {
        set((s) => ({ socialDrafts: s.socialDrafts.filter(x => x.id !== id) }));
        try { await db.deleteSocialDraft(id); } catch (e) { console.error(e); }
      },

      upsertMailTemplate: async (mail) => {
        set((s) => ({ mailTemplates: s.mailTemplates.some(x => x.id === mail.id) ? s.mailTemplates.map(x => x.id === mail.id ? mail : x) : [mail, ...s.mailTemplates] }));
        try { await db.upsertMailTemplate({ ...mail, user_id: '', channel: mail.channel as any }); } catch (e) { console.error(e); }
      },
      deleteMailTemplate: async (id) => {
        set((s) => ({ mailTemplates: s.mailTemplates.filter(x => x.id !== id) }));
        try { await db.deleteMailTemplate(id); } catch (e) { console.error(e); }
      },

      toggleProgress: async (itemId, areaId) => {
        const current = !!get().userProgress[itemId];
        set((s) => ({ userProgress: { ...s.userProgress, [itemId]: !current } }));
        try { await db.toggleProgress(itemId, areaId, !current); } catch (e) { console.error(e); }
      },

      // Placeholder for remaining methods
      upsertTemplate: async (t) => {
        set((s) => ({ templates: s.templates.some(x => x.id === t.id) ? s.templates.map(x => x.id === t.id ? t : x) : [t, ...s.templates] }));
        try { await db.upsertTemplate({ ...t, user_id: '' }); } catch (e) { console.error(e); }
      },
      deleteTemplate: async (id) => {
        set((s) => ({ templates: s.templates.filter(x => x.id !== id) }));
        try { await db.deleteTemplate(id); } catch (e) { console.error(e); }
      },
      upsertInterviewQuestion: async (q) => {
        set((s) => ({ interviewQuestions: s.interviewQuestions.some(x => x.id === q.id) ? s.interviewQuestions.map(x => x.id === q.id ? q : x) : [q, ...s.interviewQuestions] }));
        try { await db.upsertInterviewQuestion({ 
          ...q, 
          user_id: '', 
          domain: (q.area || q.category || 'frontend') as any,
          tags: q.tags || []
        }); } catch (e) { console.error(e); }
      },
      deleteInterviewQuestion: async (id) => {
        set((s) => ({ interviewQuestions: s.interviewQuestions.filter(x => x.id !== id) }));
        try { await db.deleteInterviewQuestion(id); } catch (e) { console.error(e); }
      },
      toggleFavoriteInterviewQuestion: async (id) => {
        const q = get().interviewQuestions.find(x => x.id === id);
        if (q) await get().upsertInterviewQuestion({ ...q, favorite: !q.favorite });
      },

      seedIfEmpty: async () => {
        const user = await db.getCurrentUser();
        if (!user) return;

        console.log("Seeding initial data...");

        const prompts = seedPrompts.map(({ id, ...p }) => ({ ...p, body: p.body, system_prompt: "" }));
        const agents = seedAgents.map(({ id, ...a }) => ({ ...a, system_prompt: a.systemPrompt }));
        const components = seedComponents.map(({ id, ...c }) => c);
        const snippets = seedSnippets.map(({ id, ...s }) => s);
        const templates = seedTemplates.map(({ id, ...t }) => t);
        const interviewQs = [...seedInterviewQuestions, ...seedInterviewExtra].map(({ id, ...q }) => ({
          ...q,
          domain: q.area || q.category || 'frontend',
        }));

        try {
          await Promise.all([
            db.upsertPrompts(prompts as any),
            db.upsertAgents(agents as any),
            db.upsertComponents(components as any),
            db.upsertSnippets(snippets as any),
            db.upsertTemplates(templates as any),
            db.upsertInterviewQuestions(interviewQs as any),
          ]);

          // Refresh data
          const [p, a, c, s, t, iq] = await Promise.all([
            db.getPrompts(),
            db.getAgents(),
            db.getComponents(),
            db.getSnippets(),
            db.getTemplates(),
            db.getInterviewQuestions(),
          ]);

          set({
            prompts: p.map(x => ({ ...x, createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(), updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now(), usageCount: x.usage_count ?? 0 } as any)),
            agents: a.map(x => ({ ...x, systemPrompt: x.system_prompt, createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(), updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now() } as any)),
            components: c.map(x => ({ ...x, createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(), updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now(), usageCount: x.usage_count ?? 0 } as any)),
            snippets: s.map(x => ({ ...x, createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(), updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now() } as any)),
            templates: t.map(x => ({ ...x, createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(), updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now() } as any)),
            interviewQuestions: iq.map(x => ({ 
              ...x, 
              area: (x.domain as any) || "frontend",
              category: (x.domain as any) || "frontend",
              tags: x.tags || [],
              createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now() 
            } as any)),
          });
          toast.success("Initial data synchronized!");
        } catch (e) {
          console.error("Seeding error:", e);
        }
      },
    }),
    { name: "forgedev-store-supabase-v2" },
  ),
);

export function fillVariables(body: string, values: Record<string, string>) {
  return body.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => values[k] ?? `{{${k}}}`);
}

export function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
