import type { Prisma } from "@prisma/client";

/** Reference figures attached to a graded question (from `exam_questions.images` JSON). */
export type RationaleReferenceMedia = {
  url: string;
  alt: string;
  caption?: string;
  kind?: string;
};

function isHttpsUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Parse `ExamQuestion.images` into a safe list for rationale review surfaces.
 * Drops non-HTTPS URLs and entries without alt text (caller may substitute a generic alt).
 */
export function parseRationaleReferenceMedia(raw: Prisma.JsonValue | null | undefined): RationaleReferenceMedia[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) return [];

  const out: RationaleReferenceMedia[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const url = typeof o.url === "string" ? o.url.trim() : "";
    if (!url || !isHttpsUrl(url)) continue;
    const alt = typeof o.alt === "string" && o.alt.trim() ? o.alt.trim() : "Clinical reference figure";
    const caption = typeof o.caption === "string" && o.caption.trim() ? o.caption.trim() : undefined;
    const kind = typeof o.kind === "string" && o.kind.trim() ? o.kind.trim() : undefined;
    out.push({ url, alt, caption, kind });
  }
  return out;
}
