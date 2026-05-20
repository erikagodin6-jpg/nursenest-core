/**
 * Pure parsing for marketing lesson detail URLs (no Prisma, no server-only).
 * Shared by pre-publish validation and lesson link verification.
 */

const LESSON_DETAIL =
  /^\/(us|canada)\/([^/]+)\/([^/]+)\/lessons\/([^/]+)\/?$/i;

export function parseMarketingLessonDetailPath(path: string): {
  countrySlug: string;
  roleTrack: string;
  examSegment: string;
  lessonSlug: string;
} | null {
  const p = path.trim().split("?")[0]?.split("#")[0] ?? "";
  const m = p.match(LESSON_DETAIL);
  if (!m) return null;
  const [, countrySlug, roleTrack, examSegment, lessonSlug] = m;
  if (!lessonSlug || lessonSlug === "topics") return null;
  return { countrySlug, roleTrack, examSegment, lessonSlug };
}
