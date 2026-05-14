import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForge, newId } from "@/lib/store";
import { LayoutTemplate, Plus, Trash2, Search, Check, Layers, ListTree, StickyNote } from "lucide-react";
import { toast } from "sonner";
import type { Template } from "@/types/tools";
import { Field, Input, TextArea } from "./shared";
import { SplitLayout } from "../layout";

export function Templates({ selectedId }: { selectedId?: string }) {
  const navigate = useNavigate();
  const search = useSearch({ from: "/tools" });
  const { templates, upsertTemplate, deleteTemplate } = useForge();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => templates.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())),
    [templates, query],
  );
  const selected = selectedId ? templates.find((t) => t.id === selectedId) : filtered[0];

  const select = (tid: string) => navigate({ search: { ...search, id: tid } } as any);

  const create = () => {
    const t: Template = {
      id: newId("t"),
      name: "New Template",
      description: "A boilerplate for new projects.",
      stack: ["React", "Tailwind"],
      tags: [],
      structure: "src/\n  components/\n  lib/\n  main.tsx",
      notes: "Quick start guide...",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertTemplate(t);
    select(t.id);
  };

  const update = (patch: Partial<Template>) => {
    if (!selected) return;
    upsertTemplate({ ...selected, ...patch, updatedAt: Date.now() });
  };

  const sidebar = (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-3 border-b border-border space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter templates…"
            className="pl-8"
          />
        </div>
        <button
          onClick={create}
          className="w-full flex items-center justify-center gap-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-medium py-1.5 rounded-md hover:bg-primary/20 transition-colors"
        >
          <Plus className="size-3.5" /> New template
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => select(t.id)}
              className={`w-full text-left p-4 border-b border-border transition-colors relative ${
                selected?.id === t.id ? "bg-card" : "hover:bg-card/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <LayoutTemplate className="size-4 text-primary" />
                <span className="text-sm font-medium truncate">{t.name}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 pl-6">{t.description}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[300px]" className="border-t border-border">
      {selected ? (
        <section className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex-1 min-w-0">
                <Input
                  value={selected.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className="text-2xl font-semibold tracking-tight bg-transparent border-none p-0 focus:ring-0"
                />
                <Input
                  value={selected.description}
                  onChange={(e) => update({ description: e.target.value })}
                  className="text-sm text-muted-foreground bg-transparent border-none p-0 focus:ring-0 mt-1"
                />
              </div>
              <button
                onClick={() => {
                  deleteTemplate(selected.id);
                  navigate({ search: { ...search, id: undefined } } as any);
                }}
                className="p-2 rounded-md border border-border hover:bg-destructive/10 self-end sm:self-auto mt-2 sm:mt-0"
              >
                <Trash2 className="size-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Field label="Tech Stack">
                <Input
                  value={selected.stack.join(", ")}
                  onChange={(e) => update({ stack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                  className="font-mono"
                  placeholder="React, Next.js, etc."
                />
              </Field>
              <Field label="Tags">
                <Input
                  value={selected.tags.join(", ")}
                  onChange={(e) => update({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                  className="font-mono"
                  placeholder="saas, internal-tool, etc."
                />
              </Field>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ListTree className="size-4 text-primary" />
                <h3>Project Structure</h3>
              </div>
              <TextArea
                value={selected.structure}
                onChange={(e) => update({ structure: e.target.value })}
                rows={8}
                className="font-mono"
                placeholder="Describe the file/folder layout..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <StickyNote className="size-4 text-primary" />
                <h3>Notes & Instructions</h3>
              </div>
              <TextArea
                value={selected.notes}
                onChange={(e) => update({ notes: e.target.value })}
                rows={8}
                placeholder="Implementation details, usage tips..."
              />
            </div>

            <div className="pt-6 border-t border-border">
              <button
                onClick={() => {
                  toast.success(`Scaffolding ${selected.name}…`);
                  setTimeout(() => toast.success("Template guidance ready!"), 2000);
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Check className="size-4" /> Use Template
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid place-items-center p-8 text-center flex-1">
          <div>
            <LayoutTemplate className="size-10 text-muted-foreground mx-auto mb-3" />
            <button onClick={create} className="text-xs font-mono uppercase tracking-wider border border-border px-3 py-2 rounded-md">
              Save your first template
            </button>
          </div>
        </section>
      )}
    </SplitLayout>
  );
}
