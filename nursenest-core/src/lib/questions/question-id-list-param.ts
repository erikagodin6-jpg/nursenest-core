/**
 * Shared parsing for comma-separated `exam_questions.id` lists in query strings.
 * Keeps URL-driven drills bounded (no huge IN lists).
 */
export const MAX_QUESTION_ID_LIST_PARAM = 16;

export function parseCommaSeparatedQuestionIds(raw: string | null, max = MAX_QUESTION_ID_LIST_PARAM): string[] {
  if (!raw || raw.trim().length === 0) return [];
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const p of parts) {
    if (p.length < 8 || p.length > 64) continue;
    if (seen.has(p)) continue;
    seen.add(p);
    out.push(p);
    if (out.length >= max) break;
  }
  return out;
}
