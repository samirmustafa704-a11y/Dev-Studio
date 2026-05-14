import { Mail, MessageCircle, FileText, Plus, Trash2 } from "lucide-react";
import type { MailTemplate } from "@/types/tools";

interface MailsSidebarProps {
  channel: string;
  templates: MailTemplate[];
  activeTemplateId: string | null;
  onSelectTemplate: (id: string) => void;
  onNewTemplate: () => void;
  onDeleteTemplate: (id: string) => void;
}

export function MailsSidebar({
  channel,
  templates,
  activeTemplateId,
  onSelectTemplate,
  onNewTemplate,
  onDeleteTemplate,
}: MailsSidebarProps) {
  const channelTemplates = templates.filter((t) => t.channel === channel);

  return (
    <div className="p-6 h-full flex flex-col min-h-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          {channel === "cover-letter" && <FileText className="size-5" />}
          {channel === "gmail" && <Mail className="size-5" />}
          {channel === "whatsapp" && <MessageCircle className="size-5" />}
        </div>
        <div>
          <h3 className="text-sm font-semibold capitalize">{channel.replace("-", " ")}</h3>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Channel
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">Saved Templates</span>
        <button
          onClick={onNewTemplate}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <nav className="space-y-1 overflow-y-auto flex-1 mt-2 pr-2 scrollbar-thin">
        {channelTemplates.length > 0 ? (
          channelTemplates.map((template) => (
            <div
              key={template.id}
              className={`group relative w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                activeTemplateId === template.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="pr-6">
                <div
                  className={`truncate ${activeTemplateId === template.id ? "font-medium" : ""}`}
                >
                  {template.subject || "Untitled Template"}
                </div>
                <div className="truncate text-xs text-muted-foreground mt-0.5">
                  {template.content || "Empty content"}
                </div>
                <div className="text-[10px] opacity-70 mt-1">
                  {new Date(template.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTemplate(template.id);
                }}
                className="absolute right-2 top-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                title="Delete template"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-xs text-muted-foreground border border-dashed border-border rounded-md text-center">
            No templates yet
          </div>
        )}
      </nav>
    </div>
  );
}
