import { formatYandelDialogue } from "./formatYandelDialogue";

/** Doubles sauts → blocs distincts ; retours à la ligne simple → espaces */
function normalizeNarrativeParagraphs(raw: string): string[] {  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [""];

  return normalized.split(/\n\n+/).map((block) =>
    block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " "),
  );
}

export function slidesFromNarrative(raw: string): string[] {
  const parts = normalizeNarrativeParagraphs(raw);
  if (parts.length === 1 && parts[0] === "") return [""];
  const nonEmpty = parts.map((p) => p.trim()).filter(Boolean);
  if (nonEmpty.length === 0) return [""];
  return nonEmpty.map(formatYandelDialogue);
}