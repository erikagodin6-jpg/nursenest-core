/**
 * Pure helpers for parsing marketing pathway lesson detail hrefs (no Prisma / server-only).
 */
import { stripMarketingLocalePrefix } from "@/lib/i18n/marketing-locale-prefix";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";

/** Extract lesson slug from a same-origin marketing lesson detail href for this pathway. */
export function parseMarketingLessonSlugForPathwayHref(
  pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">,
  href: string,
): string | null {
  if (href.startsWith("http://") || href.startsWith("https://")) return null;
  const { pathname } = stripMarketingLocalePrefix(href);
  const base = marketingPathwayLessonsIndexPath(pathway);
  if (!pathname.startsWith(`${base}/`)) return null;
  const tail = pathname.slice(base.length + 1).split("?")[0] ?? "";
  try {
    const s = decodeURIComponent(tail).trim();
    return s.length > 0 ? s : null;
  } catch {
    const s = tail.trim();
    return s.length > 0 ? s : null;
  }
}
