import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForge, newId } from "@/lib/store";
import { Component as ComponentIcon, Plus, Trash2, Search, Code2, Monitor, Eye } from "lucide-react";
import { toast } from "sonner";
import type { ComponentAsset } from "@/types/tools";
import { Field, Input, TextArea } from "./shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SplitLayout } from "../layout";

export function Components({ selectedId }: { selectedId?: string }) {
  const navigate = useNavigate();
  const search = useSearch({ from: "/tools" });
  const { components, upsertComponent, deleteComponent } = useForge();
  const [query, setQuery] = useState("");
  const [previewMode, setPreviewMode] = useState<"code" | "preview">("preview");

  const filtered = useMemo(
    () => components.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [components, query],
  );
  const selected = selectedId ? components.find((c) => c.id === selectedId) : filtered[0];

  const select = (cid: string) => navigate({ 
    search: { ...search, id: cid } 
  } as any);

  const create = () => {
    const c: ComponentAsset = {
      id: newId("c"),
      name: "NewComponent",
      description: "A reusable UI component.",
      code: "export default function NewComponent() {\n  return <div>Component</div>;\n}",
      dependencies: ["lucide-react"],
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      category: "UI",
      usageCount: 0,
    };
    upsertComponent(c);
    select(c.id);
  };

  const update = (patch: Partial<ComponentAsset>) => {
    if (!selected) return;
    upsertComponent({ ...selected, ...patch, updatedAt: Date.now() });
  };

  const sidebar = (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-3 border-b border-border space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter components…"
            className="pl-8"
          />
        </div>
        <button
          onClick={create}
          className="w-full flex items-center justify-center gap-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-medium py-1.5 rounded-md hover:bg-primary/20 transition-colors"
        >
          <Plus className="size-3.5" /> New component
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => select(c.id)}
              className={`w-full text-left p-4 border-b border-border transition-colors relative ${
                selected?.id === c.id ? "bg-card" : "hover:bg-card/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ComponentIcon className="size-4 text-primary" />
                <span className="text-sm font-medium truncate">{c.name}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 pl-6">{c.description}</p>
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
            <div className="flex items-start gap-4 mb-6">
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
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    deleteComponent(selected.id);
                    navigate({ 
                      search: { ...search, id: undefined } 
                    } as any);
                  }}
                  className="p-2 rounded-md border border-border hover:bg-destructive/10"
                >
                  <Trash2 className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <Field label="Category">
                  <span className="px-2 py-0.5 rounded bg-muted font-mono uppercase text-[9px]">{selected.category}</span>
                </Field>
                <Field label="Dependencies">
                  <span className="text-muted-foreground">{selected.dependencies.join(", ")}</span>
                </Field>
              </div>
              <div className="flex p-1 bg-muted rounded-md">
                <button
                  onClick={() => setPreviewMode("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                    previewMode === "preview" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Eye className="size-3.5" /> Preview
                </button>
                <button
                  onClick={() => setPreviewMode("code")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                    previewMode === "code" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Code2 className="size-3.5" /> Code
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 sm:p-8 min-h-0 bg-sidebar/20">
            <div className="w-full max-w-[1400px] mx-auto h-full">
              {previewMode === "code" ? (
                <div className="relative group h-full">
                  <TextArea
                    value={selected.code}
                    onChange={(e) => update({ code: e.target.value })}
                    className="h-full font-mono resize-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selected.code);
                      toast.success("Code copied to clipboard");
                    }}
                    className="absolute top-4 right-4 p-2 bg-background/80 border border-border rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Code2 className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="h-full border border-border rounded-lg bg-background flex flex-col items-center justify-center p-12 text-center">
                  <div className="size-16 rounded-full bg-primary/10 grid place-items-center mb-4">
                    <Monitor className="size-8 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium mb-1">Canvas Preview</h3>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Sandbox environment for rendering <strong>{selected.name}</strong> will appear here.
                  </p>
                  <button
                    onClick={() => toast.info("Building sandbox container…")}
                    className="mt-6 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:opacity-90"
                  >
                    Mount component
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="grid place-items-center p-8 text-center flex-1">
          <div>
            <ComponentIcon className="size-10 text-muted-foreground mx-auto mb-3" />
            <button onClick={create} className="text-xs font-mono uppercase tracking-wider border border-border px-3 py-2 rounded-md">
              Create your first component
            </button>
          </div>
        </section>
      )}
    </SplitLayout>
  );
}
