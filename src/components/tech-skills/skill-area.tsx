import { useState } from "react";
import {
  BookOpen,
  CheckSquare,
  ExternalLink,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import type { SkillAreaData } from "@/types/skills";
import { OverviewSection } from "./overview-section";
import { ChecklistSection } from "./checklist-section";
import { InterviewSection } from "./interview-section";
import { ResourcesSection } from "./resources-section";

type SectionId = "overview" | "checklist" | "interview" | "resources";

const SECTIONS: { id: SectionId; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "checklist", label: "Production Checklist", icon: CheckSquare },
  { id: "interview", label: "Interview Q&A", icon: GraduationCap },
  { id: "resources", label: "Resources", icon: ExternalLink },
];

import { SplitLayout } from "../layout";

export function SkillArea({ data, activeSubArea }: { data: SkillAreaData; activeSubArea?: string }) {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [internalSubArea, setInternalSubArea] = useState<string>(data.subAreas?.[0]?.id || "");
  
  const subArea = activeSubArea || internalSubArea;
  const setSubArea = (id: string) => setInternalSubArea(id);

  const sidebar = (
    <div className="p-6">
      {/* Area identity */}
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <data.icon className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">{data.label}</h3>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Focus Area
          </p>
        </div>
      </div>

      {/* Section nav */}
      <nav className="space-y-1">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <span className="shrink-0">
                <Icon className="size-3.5" />
              </span>
              {s.label}
            </button>
          );
        })}
      </nav>

      {/* Sub-areas (stacks / topics) */}
      {data.subAreas && (
        <div className="mt-8">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-3 mb-3">
            {data.id === "softskills" ? "Topics" : "Stacks / Frameworks"}
          </h4>
          <nav className="space-y-1">
            {data.subAreas.map((sa) => {
              const SaIcon = sa.icon;
              const active = subArea === sa.id;
              return (
                <button
                  key={sa.id}
                  onClick={() => setSubArea(sa.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? "bg-card text-foreground border border-border shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {SaIcon && <SaIcon className="size-3" />}
                    {sa.label}
                  </div>
                  {active && <ChevronRight className="size-3 text-primary" />}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );

  return (
    <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[260px]" className="border-t border-border">
      <div className="overflow-y-auto scrollbar-thin h-full w-full">
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-10">
          {activeSection === "overview" && (
            <OverviewSection data={data} subArea={subArea} onSubAreaChange={setSubArea} />
          )}
          {activeSection === "checklist" && <ChecklistSection data={data} />}
          {activeSection === "interview" && <InterviewSection data={data} />}
          {activeSection === "resources" && (
            <ResourcesSection data={data} subArea={subArea} />
          )}
        </div>
      </div>
    </SplitLayout>
  );
}
