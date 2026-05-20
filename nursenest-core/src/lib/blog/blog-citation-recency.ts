import type { BlogSourceRecord } from "@/lib/blog/apa7";

/** Rolling window for “recent enough” bibliographic years on generated SEO posts (UTC). */
export const BLOG_REFERENCE_RECENCY_WINDOW_YEARS = 7 as const;

export function minimumPublicationYearForBlogReferences(now: Date = new Date()): number {
  return now.getUTCFullYear() - BLOG_REFERENCE_RECENCY_WINDOW_YEARS;
}

/**
 * Enforces a minimum 4-digit publication year on structured sources when a year is supplied.
 * Skips: foundational flag, missing year, n.d., in press, non-numeric years (handled elsewhere).
 */
export function assessBlogSourceYearRecency(
  record: BlogSourceRecord,
  minYear: number,
): { ok: true } | { ok: false; message: string } {
  if (record.foundational) return { ok: true };
  const raw = (record.year ?? "").trim();
  if (!raw) return { ok: true };
  const y = raw.toLowerCase();
  if (y === "n.d." || y === "in press") return { ok: true };
  const m = /^(\d{4})([a-z])?$/i.exec(raw);
  if (!m) return { ok: true };
  const num = parseInt(m[1]!, 10);
  if (!Number.isFinite(num) || num < minYear) {
    return {
      ok: false,
      message: `Verified source “${(record.title ?? "").slice(0, 80)}” lists year ${num}, before the ${BLOG_REFERENCE_RECENCY_WINDOW_YEARS}-year window (minimum ${minYear}). Mark foundational only for seminal works or replace with a current guideline/study.`,
    };
  }
  return { ok: true };
}

export function collectVerifiedSourceRecencyIssues(sources: readonly BlogSourceRecord[], minYear: number): string[] {
  const out: string[] = [];
  for (const s of sources) {
    const r = assessBlogSourceYearRecency(s, minYear);
    if (!r.ok) out.push(r.message);
  }
  return out;
}
