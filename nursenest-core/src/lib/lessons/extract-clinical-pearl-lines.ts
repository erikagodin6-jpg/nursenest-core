export type ClinicalPearlLine = {
  label: string;
  text: string;
};

type ClinicalPearlWarningContext = {
  pathwayId?: string | null;
  lessonSlug?: string | null;
  source?: string | null;
};

type ClinicalPearlExtractionOptions = ClinicalPearlWarningContext & {
  max?: number;
};

function warnEmptyClinicalPearl(
  reason: string,
  context?: ClinicalPearlWarningContext,
): void {
  if (process.env.NODE_ENV === "production") return;
  const contextLabel = [
    context?.source,
    context?.pathwayId,
    context?.lessonSlug,
  ]
    .filter(Boolean)
    .join(" ");
  console.warn(
    `[lessons] Empty clinical pearl omitted${contextLabel ? ` (${contextLabel})` : ""}: ${reason}`,
  );
}

function stripMarkup(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function stripClinicalPearlPrefix(text: string): string {
  return text
    .replace(
      /^\s*\*{0,2}\s*(?:clinical\s+)?pearl\s*:?\s*\*{0,2}\s*/i,
      "",
    )
    .trim();
}

function splitParagraphs(body: string): string[] {
  const plain = body
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/(?:^|\n)\s*[-*•]\s+/g, "\n\n")
    .replace(/(?:^|\n)\s*\d+[.)]\s+/g, "\n\n")
    .replace(/\r\n/g, "\n");
  return plain
    .split(/\n{2,}|(?<=[.!?])\s+(?=[A-Z])/)
    .map(stripMarkup)
    .map(stripClinicalPearlPrefix)
    .map((part) => part.trim())
    .filter((part) => part.length >= 24);
}

function splitListItems(body: string): string[] {
  const lines = body
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n")
    .split(/\r?\n/)
    .map((line) => stripMarkup(line))
    .map((line) =>
      line
        .replace(/^[-*•]\s+/, "")
        .replace(/^\d+[.)]\s+/, "")
        .replace(/^(?:clinical\s+)?pearl\s*:?\s*/i, "")
        .trim(),
    )
    .filter(Boolean);
  return lines.filter((line) => line.length >= 20);
}

export function normalizeClinicalPearlLines(
  pearls: readonly Partial<ClinicalPearlLine>[] | null | undefined,
  context?: ClinicalPearlWarningContext,
): ClinicalPearlLine[] {
  const out: ClinicalPearlLine[] = [];
  for (const pearl of pearls ?? []) {
    const label =
      typeof pearl?.label === "string" && pearl.label.trim()
        ? pearl.label.trim()
        : "Pearl";
    const text =
      typeof pearl?.text === "string" ? stripClinicalPearlPrefix(pearl.text) : "";
    if (!text.trim()) {
      warnEmptyClinicalPearl("missing pearl body", context);
      continue;
    }
    out.push({ label, text: text.trim() });
  }
  return out;
}

/**
 * Pull short pearl lines from a clinical_pearls section body for the left rail.
 */
export function extractClinicalPearlLines(
  body: string,
  maxOrOptions: number | ClinicalPearlExtractionOptions = 5,
): ClinicalPearlLine[] {
  const max =
    typeof maxOrOptions === "number" ? maxOrOptions : (maxOrOptions.max ?? 5);
  const context =
    typeof maxOrOptions === "number" ? undefined : maxOrOptions;
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

  if (out.length === 0 && /\b(?:clinical\s+)?pearl\b/i.test(trimmed)) {
    warnEmptyClinicalPearl("section contains pearl markers but no body text", context);
  }

  return out;
}
