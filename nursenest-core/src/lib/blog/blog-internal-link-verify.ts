/**
 * Verifies marketing lesson detail paths against published PathwayLesson rows
 * so generators do not promote dead lesson URLs.
 */

import { ContentStatus } from "@prisma/client";
import { resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import type { BlogLessonLinkRow, BlogLinkPathStatus } from "@/lib/blog/blog-control-panel-schema";
import {
  alignLessonPathForAudienceCountry,
  isAllowedBlogInternalHref,
} from "@/lib/blog/blog-internal-lesson-links";
import { defaultPathwayLessonContentLocaleForExamHubRoute } from "@/lib/lessons/pathway-lesson-locale";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

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

export async function pathwayLessonExistsAtMarketingPath(path: string): Promise<boolean> {
  if (!isDatabaseUrlConfigured()) return true;
  const parsed = parseMarketingLessonDetailPath(path);
  if (!parsed) return true;
  const pathway = resolveExamPathwayFromMarketingHubSegment(
    parsed.countrySlug,
    parsed.roleTrack,
    parsed.examSegment,
  );
  if (!pathway) return false;
  const locale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const row = await prisma.pathwayLesson.findFirst({
    where: {
      pathwayId: pathway.id,
      slug: parsed.lessonSlug,
      locale,
      status: ContentStatus.PUBLISHED,
    },
    select: { id: true },
  });
  return Boolean(row);
}

/**
 * Annotate plan rows with {@link BlogLinkPathStatus}; lesson detail paths hit the DB when configured.
 */
export async function annotateBlogInternalLinkRowsWithVerification(
  rows: BlogLessonLinkRow[],
  country: "US" | "CA" | "unspecified",
): Promise<BlogLessonLinkRow[]> {
  const out: BlogLessonLinkRow[] = [];
  for (const row of rows) {
    const aligned = alignLessonPathForAudienceCountry(row.suggestedPath.trim(), country);
    const primary = (row.replacementPath ?? "").trim();
    const candidate = primary && isAllowedBlogInternalHref(primary) ? primary : aligned;

    let pathStatus: BlogLinkPathStatus = "unchecked";
    if (!isAllowedBlogInternalHref(candidate)) {
      pathStatus = "invalid_allowlist";
    } else if (parseMarketingLessonDetailPath(candidate)) {
      const ok = await pathwayLessonExistsAtMarketingPath(candidate);
      pathStatus = ok ? "ok" : "not_found";
    } else {
      pathStatus = "skipped_non_lesson";
    }

    out.push({ ...row, pathStatus });
  }
  return out;
}
