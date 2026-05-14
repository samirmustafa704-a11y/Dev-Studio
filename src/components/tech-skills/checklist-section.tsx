import { useState } from "react";
import type { SkillAreaData } from "@/types/skills";

interface Props {
  data: SkillAreaData;
}

export function ChecklistSection({ data }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setChecked((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const done = checked.size;
  const total = data.checklist.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Production Checklist</h2>
        <p className="text-muted-foreground text-sm">
          Follow these best practices to ensure excellence.
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>{done} / {total} completed</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden shadow-sm">
        {data.checklist.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors group"
          >
            <div
              className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                checked.has(item.id)
                  ? "bg-primary border-primary"
                  : "border-muted-foreground/30 group-hover:border-primary/50"
              }`}
            >
              {checked.has(item.id) && (
                <div className="size-1.5 rounded-full bg-primary-foreground" />
              )}
            </div>
            <span
              className={`text-sm transition-all ${
                checked.has(item.id)
                  ? "text-muted-foreground line-through opacity-60"
                  : "text-foreground"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}

        {data.checklist.length === 0 && (
          <div className="text-center py-16 text-sm text-muted-foreground">
            No checklist items defined for this area.
          </div>
        )}
      </div>
    </div>
  );
}
