import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForge, newId } from "@/lib/store";
import { Scissors, Plus, Trash2, Search, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { Snippet } from "@/types/tools";
import { Field, Input, TextArea } from "./shared";
import { SplitLayout } from "../layout";

export function Snippets({ selectedId }: { selectedId?: string }) {
  const navigate = useNavigate();
  const search = useSearch({ from: "/tools" });
  const { snippets, upsertSnippet, deleteSnippet } = useForge();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => snippets.filter((s) => s.title.toLowerCase().includes(query.toLowerCase())),
    [snippets, query],
  );
  const selected = selectedId ? snippets.find((s) => s.id === selectedId) : filtered[0];

  const select = (sid: string) => navigate({ search: { ...search, id: sid } } as any);

  const create = () => {
    const s: Snippet = {
      id: newId("sn"),
      title: "Untitled snippet",
      description: "Quick reusable logic.",
      code: "// Paste your snippet here",
      language: "typescript",
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertSnippet(s);
    select(s.id);
  };

  const update = (patch: Partial<Snippet>) => {
    if (!selected) return;
    upsertSnippet({ ...selected, ...patch, updatedAt: Date.now() });
  };

  const sidebar = (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-3 border-b border-border space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter snippets…"
            className="pl-8"
          />
        </div>
        <button
          onClick={create}
          className="w-full flex items-center justify-center gap-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-medium py-1.5 rounded-md hover:bg-primary/20 transition-colors"
        >
          <Plus className="size-3.5" /> New snippet
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => select(s.id)}
              className={`w-full text-left p-4 border-b border-border transition-colors relative ${
                selected?.id === s.id ? "bg-card" : "hover:bg-card/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Scissors className="size-4 text-primary" />
                <span className="text-sm font-medium truncate">{s.title}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 pl-6">{s.description}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[300px]" className="border-t border-border">
      {selected ? (
        <section className="flex flex-col flex-1 overflow-hidden">
          <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-border bg-background">
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <Input
                  value={selected.title}
                  onChange={(e) => update({ title: e.target.value })}
                  className="text-2xl font-semibold tracking-tight bg-transparent border-none p-0 focus:ring-0"
                />
                <Input
                  value={selected.description}
                  onChange={(e) => update({ description: e.target.value })}
                  className="text-sm text-muted-foreground bg-transparent border-none p-0 focus:ring-0 mt-1"
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto mt-2 sm:mt-0">
                <button
                  onClick={() => {
                    deleteSnippet(selected.id);
                    navigate({ search: { ...search, id: undefined } } as any);
                  }}
                  className="p-2 rounded-md border border-border hover:bg-destructive/10"
                >
                  <Trash2 className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Field label="Language">
                <Input
                  value={selected.language}
                  onChange={(e) => update({ language: e.target.value })}
                  className="font-mono"
                />
              </Field>
              <Field label="Tags">
                <Input
                  value={selected.tags.join(", ")}
                  onChange={(e) => update({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                  className="font-mono"
                />
              </Field>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 sm:p-8 min-h-0 bg-sidebar/20">
            <div className="w-full max-w-[1400px] mx-auto h-full">
              <div className="relative group h-full">
                <TextArea
                  value={selected.code}
                  onChange={(e) => update({ code: e.target.value })}
                  className="h-full font-mono resize-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selected.code);
                    toast.success("Snippet copied");
                  }}
                  className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="size-3.5" /> Copy Snippet
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid place-items-center p-8 text-center flex-1">
          <div>
            <Scissors className="size-10 text-muted-foreground mx-auto mb-3" />
            <button onClick={create} className="text-xs font-mono uppercase tracking-wider border border-border px-3 py-2 rounded-md">
              Save your first snippet
            </button>
          </div>
        </section>
      )}
    </SplitLayout>
  );
}
