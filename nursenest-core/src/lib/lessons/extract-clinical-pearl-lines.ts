export type ClinicalPearlLine = {
  label: string;
  text: string;
};

function stripMarkup(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function splitParagraphs(body: string): string[] {
  const plain = body.replace(/<\/p>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n");
  return stripMarkup(plain)
    .split(/\n{2,}|(?<=[.!?])\s+(?=[A-Z])/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 24);
}

function splitListItems(body: string): string[] {
  const lines = body
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n")
    .split(/\r?\n/)
    .map((line) => stripMarkup(line))
    .map((line) => line.replace(/^[-*•]\s+/, "").replace(/^\d+[.)]\s+/, "").trim())
    .filter(Boolean);
  return lines.filter((line) => line.length >= 20);
}

/**
 * Pull short pearl lines from a clinical_pearls section body for the left rail.
 */
export function extractClinicalPearlLines(body: string, max = 5): ClinicalPearlLine[] {
  const trimmed = body.trim();
  if (!trimmed) return [];

  const candidates = [...splitListItems(trimmed), ...splitParagraphs(trimmed)];
  const seen = new Set<string>();
  const out: ClinicalPearlLine[] = [];

  for (const text of candidates) {
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const clipped =
      text.length > 220 ? `${text.slice(0, 217).trimEnd()}…` : text;
    out.push({ label: "Pearl", text: clipped });
    if (out.length >= max) break;
  }

  return out;
}
