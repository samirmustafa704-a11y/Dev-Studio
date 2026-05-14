import { FocusArea, Difficulty, AnswerDepth } from "./common";

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  answerDepths?: AnswerDepth[];
  area: FocusArea;
  difficulty: Difficulty;
  tags: string[];
  category?: string;
  favorite?: boolean;
  createdAt: number;
}

export type TechAreaId = "frontend" | "backend" | "devops" | "testing" | "database";
export type SoftAreaId = "softskills";
export type AreaId = TechAreaId | SoftAreaId;

export interface SkillConcept {
  title: string;
  body: string;
}

export interface SkillResource {
  label: string;
  url: string;
  desc: string;
}

export interface SkillChecklistItem {
  id: string;
  label: string;
}

export interface SkillAreaData {
  id: AreaId;
  label: string;
  icon: any;
  description: string;
  concepts: SkillConcept[];
  resources: SkillResource[];
  checklist: SkillChecklistItem[];
  subAreas?: {
    id: string;
    label: string;
    icon?: any;
    color: string;
    accent: string;
    tags: string[];
    concepts?: SkillConcept[];
    resources?: SkillResource[];
  }[];
}
