export type AssetKind = "prompt" | "agent" | "component" | "template" | "snippet";
export type FocusArea = "frontend" | "backend" | "devops" | "testing" | "database" | "softskills" | "general";
export type Difficulty = "junior" | "mid" | "senior";

export interface AnswerDepth {
  id: string;
  label: string;
  body: string;
}
