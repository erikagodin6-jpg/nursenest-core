import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

export type LessonHighYieldStudyDerivation = {
  studyTakeaways?: string[];
  studyCommonTraps?: string[];
  memoryAnchor?: string;
  /** Section ids to skip in the article when bullets were hoisted to top/bottom takeaways strips. */
  omitHighYieldSectionIds?: string[];
};

function sanitizeStringArray(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const t = x.trim();
    if (t.length > 0) out.push(t);
  }
  return out.length > 0 ? out : undefined;
}

/**
 * Pull bullet-like lines from markdown-ish lesson bodies (•, -, *, numbered).
 * Strips simple **bold** markers for display list items.
 */
export function extractBulletLinesFromLessonBody(body: string): string[] {
  const lines = body.split(/\r?\n/);
  const out: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    const m = t.match(/^(?:[•·▪▫]\s*|[\*\-]\s+|\d+\.\s+)(.+)$/);
    if (!m) continue;
    let inner = m[1].trim();
    inner = inner.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
    if (inner.length >= 6) out.push(inner);
  }
  return out;
}

function splitTrapsNarrative(text: string): string[] {
  const t = text.trim();
  if (!t) return [];
  const paras = t
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 12);
  if (paras.length >= 2) return paras.slice(0, 12);
  const lines = t
    .split(/\n/)
    .map((l) => l.replace(/^[\s•\-\*·]+/, "").trim())
    .filter((l) => l.length >= 12);
  return lines.length ? lines.slice(0, 12) : paras.length === 1 ? [paras[0]!] : [];
}

type RawLessonInput = {
  studyTakeaways?: unknown;
  studyCommonTraps?: unknown;
  memoryAnchor?: unknown;
};

/**
 * Derives high-yield study arrays for top/bottom strips + optional section omission.
 * Does not invent prose; only splits existing section bodies / exam focus text.
 */
export function deriveLessonHighYieldStudyFields(
  sections: PathwayLessonSection[],
  raw: RawLessonInput,
): LessonHighYieldStudyDerivation {
  const explicitTakeaways = sanitizeStringArray(raw.studyTakeaways);
  const explicitTraps = sanitizeStringArray(raw.studyCommonTraps);
  const memoryAnchor =
    typeof raw.memoryAnchor === "string" && raw.memoryAnchor.trim().length > 0
      ? raw.memoryAnchor.trim()
      : undefined;

  let studyTakeaways = explicitTakeaways;
  const omitHighYieldSectionIds: string[] = [];

  if (!studyTakeaways?.length) {
    const tw = sections.find((s) => s.kind === "takeaways");
    if (tw && typeof tw.body === "string") {
      const extracted = extractBulletLinesFromLessonBody(tw.body);
      if (extracted.length >= 1) {
        studyTakeaways = extracted;
        omitHighYieldSectionIds.push(tw.id);
      }
    }
  }

  let studyCommonTraps = explicitTraps;
  if (!studyCommonTraps || studyCommonTraps.length === 0) {
    const trapChunks: string[] = [];
    for (const s of sections) {
      const ct = s.examFocus?.commonTraps?.trim();
      if (ct) trapChunks.push(...splitTrapsNarrative(ct));
    }
    if (trapChunks.length > 0) {
      const seen = new Set<string>();
      const deduped: string[] = [];
      for (const line of trapChunks) {
        const k = line.toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k);
        deduped.push(line);
      }
      studyCommonTraps = deduped.length ? deduped : undefined;
    }
  }

  const out: LessonHighYieldStudyDerivation = {};
  if (studyTakeaways && studyTakeaways.length >= 1) {
    out.studyTakeaways = studyTakeaways;
  }
  if (studyCommonTraps && studyCommonTraps.length > 0) {
    out.studyCommonTraps = studyCommonTraps;
  }
  if (memoryAnchor) {
    out.memoryAnchor = memoryAnchor;
  }
  if (omitHighYieldSectionIds.length > 0) {
    out.omitHighYieldSectionIds = omitHighYieldSectionIds;
  }
  return out;
}
