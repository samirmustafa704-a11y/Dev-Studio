import { createFileRoute, useSearch } from "@tanstack/react-router";
import { SkillTabs } from "@/components/tech-skills/skill-tabs";
import { SkillArea } from "@/components/tech-skills/skill-area";
import { PageHeader, PageContainer } from "@/components/layout";
import { TECH_AREAS } from "@/data/skills";
import type { TechAreaId } from "@/types/skills";
import { z } from "zod";

const searchSchema = z.object({
  tab: z.enum(["frontend", "backend", "devops", "testing", "database"]).optional().default("frontend"),
});

export const Route = createFileRoute("/tech-skills")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Technical Skills Hub — Dev Studio" },
      { name: "description", content: "Master frontend, backend, devops, testing, and databases with our unified hub." },
    ],
  }),
  component: TechSkillsPage,
});

function TechSkillsPage() {
  const { tab } = useSearch({ from: "/tech-skills" });

  return (
    <PageContainer>
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <PageHeader 
            title="Technical Skills Hub"
            description="Unified dashboard for engineering excellence and interview preparation."
            className="mb-6"
          />
          <div className="w-full">
            <SkillTabs />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <SkillArea data={TECH_AREAS[tab as TechAreaId]} />
      </div>
    </PageContainer>
  );
}
