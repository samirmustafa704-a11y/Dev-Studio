import { Linkedin, Twitter, Instagram, Plus, Trash2 } from "lucide-react";
import type { SocialDraft } from "@/types/tools";

interface SocialSidebarProps {
  platform: string;
  drafts: SocialDraft[];
  activeDraftId: string | null;
  onSelectDraft: (id: string) => void;
  onNewDraft: () => void;
  onDeleteDraft: (id: string) => void;
}

export function SocialSidebar({
  platform,
  drafts,
  activeDraftId,
  onSelectDraft,
  onNewDraft,
  onDeleteDraft,
}: SocialSidebarProps) {
  const platformDrafts = drafts.filter((d) => d.platform === platform);

  return (
    <div className="p-6 h-full flex flex-col min-h-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          {platform === "linkedin" && <Linkedin className="size-5" />}
          {platform === "twitter" && <Twitter className="size-5" />}
          {platform === "instagram" && <Instagram className="size-5" />}
        </div>
        <div>
          <h3 className="text-sm font-semibold capitalize">{platform}</h3>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Platform
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">Post Drafts</span>
        <button
          onClick={onNewDraft}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <nav className="space-y-1 overflow-y-auto flex-1 mt-2 pr-2 scrollbar-thin">
        {platformDrafts.length > 0 ? (
          platformDrafts.map((draft) => (
            <div
              key={draft.id}
              className={`group relative w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                activeDraftId === draft.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
              onClick={() => onSelectDraft(draft.id)}
            >
              <div className="pr-6">
                <div className={`truncate ${activeDraftId === draft.id ? "font-medium" : ""}`}>
                  {draft.content || "New Draft"}
                </div>
                <div className="text-[10px] opacity-70 mt-1">
                  {new Date(draft.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDraft(draft.id);
                }}
                className="absolute right-2 top-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                title="Delete draft"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-xs text-muted-foreground border border-dashed border-border rounded-md text-center">
            No drafts yet
          </div>
        )}
      </nav>
    </div>
  );
}
