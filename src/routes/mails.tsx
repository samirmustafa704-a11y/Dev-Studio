import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, PageContainer, TabNav, SplitLayout } from "@/components/layout";
import { Mail, MessageCircle, FileText } from "lucide-react";
import { z } from "zod";

const mailsSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/mails")({
  validateSearch: mailsSearchSchema,
  head: () => ({
    meta: [{ title: "Mails & Messaging — Dev Studio" }],
  }),
  component: MailsPage,
});

import { MailsSidebar, type MailTemplate } from "@/components/mails/mails-sidebar";
import { TemplateEditor } from "@/components/mails/template-editor";

const MAILS_TABS = [
  { id: "cover-letter", label: "Cover Letters", icon: FileText },
  { id: "gmail", label: "Gmail", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

// Seed Data
const INITIAL_TEMPLATES: MailTemplate[] = [
  { id: "1", channel: "cover-letter", subject: "Frontend Engineer - Tech Corp", content: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Frontend Engineer position...", updatedAt: "2 days ago" },
  { id: "2", channel: "gmail", subject: "Project Update: Q3 Launch", content: "Hi team,\n\nHere's a quick update on our progress for the Q3 launch...", updatedAt: "5 hours ago" },
  { id: "3", channel: "whatsapp", content: "Hey! Just wanted to follow up on our meeting from yesterday. Let me know when you have time to chat.", updatedAt: "1 day ago" },
];

function MailsPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = search.tab || "cover-letter";

  const [templates, setTemplates] = useState<MailTemplate[]>(INITIAL_TEMPLATES);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dev-studio-mails-templates");
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse mail templates", e);
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("dev-studio-mails-templates", JSON.stringify(templates));
  }, [templates]);

  // Switch active template when channel changes
  useEffect(() => {
    const channelTemplates = templates.filter(t => t.channel === tab);
    if (channelTemplates.length > 0 && !channelTemplates.some(t => t.id === activeTemplateId)) {
      setActiveTemplateId(channelTemplates[0].id);
    } else if (channelTemplates.length === 0) {
      setActiveTemplateId(null);
    }
  }, [tab, templates, activeTemplateId]);

  const handleNewTemplate = () => {
    const newTemplate: MailTemplate = {
      id: Date.now().toString(),
      channel: tab,
      subject: tab === "gmail" ? "" : undefined,
      content: "",
      updatedAt: "Just now",
    };
    setTemplates([newTemplate, ...templates]);
    setActiveTemplateId(newTemplate.id);
  };

  const handleUpdateTemplate = (updates: Partial<MailTemplate>) => {
    setTemplates(prev => prev.map(t => 
      t.id === activeTemplateId ? { ...t, ...updates, updatedAt: "Just now" } : t
    ));
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (activeTemplateId === id) {
      setActiveTemplateId(null);
    }
  };

  const activeTemplate = templates.find(t => t.id === activeTemplateId) || null;

  return (
    <PageContainer>
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <PageHeader 
            title="Mails & Messaging"
            description="Manage your professional communications, cover letters, and outreach."
            className="mb-6"
          />
          <div className="w-full">
            <TabNav 
              tabs={MAILS_TABS.map((t) => ({
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
            <MailsSidebar 
              channel={tab}
              templates={templates}
              activeTemplateId={activeTemplateId}
              onSelectTemplate={setActiveTemplateId}
              onNewTemplate={handleNewTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          } 
          sidebarWidth="lg:w-[260px]" 
          className="border-t border-border"
        >
          <div className="overflow-y-auto scrollbar-thin h-full w-full">
            <TemplateEditor 
              channel={tab}
              activeTemplate={activeTemplate}
              onUpdateTemplate={handleUpdateTemplate}
              onSave={() => console.log("Saved!", activeTemplate)}
            />
          </div>
        </SplitLayout>
      </div>
    </PageContainer>
  );
}
