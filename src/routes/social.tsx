import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, PageContainer, TabNav, SplitLayout } from "@/components/layout";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import { z } from "zod";

const socialSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/social")({
  validateSearch: socialSearchSchema,
  head: () => ({
    meta: [{ title: "Social Media — Dev Studio" }],
  }),
  component: SocialPage,
});

import { SocialSidebar, type Draft } from "@/components/social/social-sidebar";
import { PostEditor } from "@/components/social/post-editor";

const SOCIAL_TABS = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "twitter", label: "X / Twitter", icon: Twitter },
  { id: "instagram", label: "Instagram", icon: Instagram },
];

// Seed Data
const INITIAL_DRAFTS: Draft[] = [
  { id: "1", platform: "linkedin", content: "Excited to share my new side project! #buildinpublic", updatedAt: "2 mins ago" },
  { id: "2", platform: "twitter", content: "Just shipped a massive update to the UI. The layout engine is finally stable.", updatedAt: "1 hour ago" },
];

function SocialPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = search.tab || "linkedin";

  const [drafts, setDrafts] = useState<Draft[]>(INITIAL_DRAFTS);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dev-studio-social-drafts");
    if (saved) {
      try {
        setDrafts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse social drafts", e);
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("dev-studio-social-drafts", JSON.stringify(drafts));
  }, [drafts]);

  // Switch active draft when platform changes
  useEffect(() => {
    const platformDrafts = drafts.filter(d => d.platform === tab);
    if (platformDrafts.length > 0 && !platformDrafts.some(d => d.id === activeDraftId)) {
      setActiveDraftId(platformDrafts[0].id);
    } else if (platformDrafts.length === 0) {
      setActiveDraftId(null);
    }
  }, [tab, drafts, activeDraftId]);

  const handleNewDraft = () => {
    const newDraft: Draft = {
      id: Date.now().toString(),
      platform: tab,
      content: "",
      updatedAt: "Just now",
    };
    setDrafts([newDraft, ...drafts]);
    setActiveDraftId(newDraft.id);
  };

  const handleUpdateDraft = (updates: Partial<Draft>) => {
    setDrafts(prev => prev.map(d => 
      d.id === activeDraftId ? { ...d, ...updates, updatedAt: "Just now" } : d
    ));
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    if (activeDraftId === id) {
      setActiveDraftId(null);
    }
  };

  const activeDraft = drafts.find(d => d.id === activeDraftId) || null;

  return (
    <PageContainer>
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <PageHeader 
            title="Social Media Management"
            description="Manage your posts, threads, and updates across all social platforms."
            className="mb-6"
          />
          <div className="w-full">
            <TabNav 
              tabs={SOCIAL_TABS.map((t) => ({
                ...t,
                onClick: () => navigate({ to: ".", search: { tab: t.id } })
              }))} 
              activeTab={tab} 
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SplitLayout 
          sidebar={
            <SocialSidebar 
              platform={tab}
              drafts={drafts}
              activeDraftId={activeDraftId}
              onSelectDraft={setActiveDraftId}
              onNewDraft={handleNewDraft}
              onDeleteDraft={handleDeleteDraft}
            />
          } 
          sidebarWidth="lg:w-[260px]" 
          className="border-t border-border"
        >
          <div className="overflow-y-auto scrollbar-thin h-full w-full">
            <PostEditor 
              platform={tab}
              activeDraft={activeDraft}
              onUpdateDraft={handleUpdateDraft}
              onSave={() => console.log("Saved!", activeDraft)}
            />
          </div>
        </SplitLayout>
      </div>
    </PageContainer>
  );
}
