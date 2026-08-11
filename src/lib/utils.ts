import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const CATEGORY_LABELS: Record<string, string> = {
  PROMPT: "Prompts IA",
  SKILL: "Skills IA",
  AGENT: "Agents IA",
};

export const CATEGORY_SLUGS: Record<string, string> = {
  PROMPT: "prompts",
  SKILL: "skills",
  AGENT: "agents",
};

/** Parses a textarea value (one item per line) into a clean list, dropping blank lines. */
export function parseContentsList(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
