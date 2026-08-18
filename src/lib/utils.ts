import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const CATEGORY_LABELS: Record<string, string> = {
  PROMPT: "Prompts IA",
  SKILL: "Skills IA",
  AGENT: "Agents IA",
  NEWSLETTER: "Newsletter (prompt gratuit)",
};

export const CATEGORY_SLUGS: Record<string, string> = {
  PROMPT: "prompts",
  SKILL: "skills",
  AGENT: "agents",
};
