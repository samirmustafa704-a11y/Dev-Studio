import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForge, newId } from "@/lib/store";
import { Bot, Plus, Trash2, Play, Search } from "lucide-react";
import { toast } from "sonner";
import type { Agent } from "@/types/tools";
import { Field, StatusDot, Input, TextArea } from "./shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SplitLayout } from "../layout";

export function Agents({ selectedId }: { selectedId?: string }) {
  const navigate = useNavigate();
  const search = useSearch({ from: "/tools" });
  const { agents, upsertAgent, deleteAgent } = useForge();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => agents.filter((a) => a.name.toLowerCase().includes(query.toLowerCase())),
    [agents, query],
  );
  const selected = selectedId ? agents.find((a) => a.id === selectedId) : filtered[0];

  const select = (aid: string) => navigate({ search: { ...search, id: aid } } as any);

  const create = () => {
    const a: Agent = {
      id: newId("a"),
      name: "New Agent",
      role: "Describe what this agent does.",
      systemPrompt: "You are…",
      tools: [],
      model: "claude-3.5-sonnet",
      temperature: 0.4,
      status: "draft",
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertAgent(a);
    select(a.id);
  };

  const update = (patch: Partial<Agent>) => {
    if (!selected) return;
    upsertAgent({ ...selected, ...patch, updatedAt: Date.now() });
  };

  const sidebar = (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-3 border-b border-border space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter agents…"
            className="pl-8"
          />
        </div>
        <button
          onClick={create}
          className="w-full flex items-center justify-center gap-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-medium py-1.5 rounded-md hover:bg-primary/20 transition-colors"
        >
          <Plus className="size-3.5" /> New agent
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => select(a.id)}
              className={`w-full text-left p-4 border-b border-border transition-colors relative ${
                selected?.id === a.id ? "bg-card" : "hover:bg-card/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Bot className="size-4 text-primary" />
                <span className="text-sm font-medium truncate">{a.name}</span>
                <StatusDot status={a.status} className="ml-auto" />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 pl-6">{a.role}</p>
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
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="size-12 rounded-lg bg-linear-to-br from-primary to-accent grid place-items-center shrink-0">
                <Bot className="size-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={selected.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className="w-full text-2xl font-semibold tracking-tight bg-transparent focus:outline-none border-none p-0 h-auto"
                />
                <Input
                  value={selected.role}
                  onChange={(e) => update({ role: e.target.value })}
                  className="w-full text-sm text-muted-foreground bg-transparent focus:outline-none border-none p-0 h-auto mt-1"
                />
              </div>
                <button
                  onClick={() => {
                    deleteAgent(selected.id);
                    navigate({ search: { ...search, id: undefined } } as any);
                  }}
                  className="p-2 rounded-md border border-border hover:bg-destructive/10 self-end sm:self-auto"
                >
                  <Trash2 className="size-4 text-muted-foreground" />
                </button>
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <Field label="Status">
                <Select
                  value={selected.status}
                  onValueChange={(value) => update({ status: value as Agent["status"] })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">draft</SelectItem>
                    <SelectItem value="idle">idle</SelectItem>
                    <SelectItem value="active">active</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Model">
                <Input
                  value={selected.model}
                  onChange={(e) => update({ model: e.target.value })}
                  className="font-mono"
                />
              </Field>
              <Field label="Temperature">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={selected.temperature}
                  onChange={(e) => update({ temperature: parseFloat(e.target.value) || 0 })}
                  className="font-mono"
                />
              </Field>
              <Field label="Tools">
                <Input
                  value={selected.tools.join(", ")}
                  onChange={(e) => update({ tools: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                  className="font-mono"
                />
              </Field>
            </div>

            <div className="border-t border-border pt-6">
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2">
                System prompt
              </label>
              <TextArea
                value={selected.systemPrompt}
                onChange={(e) => update({ systemPrompt: e.target.value })}
                rows={10}
                className="font-mono"
              />
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Playground</p>
                <button
                  onClick={() => toast.info("Connect Lovable AI to run the agent")}
                  className="inline-flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md"
                >
                  <Play className="size-3.5" /> Run
                </button>
              </div>
              <TextArea
                rows={4}
                placeholder="Send a test message to this agent…"
                className="bg-background"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="grid place-items-center p-8 text-center flex-1">
          <div>
            <Bot className="size-10 text-muted-foreground mx-auto mb-3" />
            <button onClick={create} className="text-xs font-mono uppercase tracking-wider border border-border px-3 py-2 rounded-md">
              Provision your first agent
            </button>
          </div>
        </section>
      )}
    </SplitLayout>
  );
}
