/**
 * Central typed builders for learner-facing lesson URLs.
 *
 * Use these instead of ad hoc `/${country}/${role}/${exam}/lessons/...` strings so routes stay aligned with
 * `ExamPathwayDefinition` and Next.js marketing segments (`[locale]` = countrySlug, `[slug]` = roleTrack).
 */

import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** Marketing landing that lists all exam pathway lesson hubs. */
export const PUBLIC_MARKETING_EXAM_LESSONS_HUB_PATH = "/lessons" as const;

/** Signed-in learner lesson list. */
export const APP_LEARNER_LESSONS_INDEX_PATH = "/app/lessons" as const;

/** Pre-nursing module lesson index (marketing). */
export const PRE_NURSING_LESSONS_INDEX_PATH = "/pre-nursing/lessons" as const;

const ALLIED_HEALTH_ROOT = "/allied-health" as const;

/** `/allied-health/{segment}` — profession hero or canonical slug segment. */
export function alliedHealthSegmentPath(segment: string): string {
  return `${ALLIED_HEALTH_ROOT}/${encodeURIComponent(segment.trim())}`;
}

/** Raw dynamic segments from `app/(marketing)/.../[locale]/[slug]/[examCode]/...`. */
export type MarketingExamHubRouteParams = {
  locale: string;
  slug: string;
  examCode: string;
};

export function normalizeMarketingExamHubRouteParams(params: MarketingExamHubRouteParams): {
  countrySlug: string;
  roleTrack: string;
  examCode: string;
} {
  return {
    countrySlug: params.locale.trim().toLowerCase(),
    roleTrack: params.slug.trim().toLowerCase(),
    examCode: params.examCode.trim().toLowerCase(),
  };
}

function usableMarketingLessonSlug(slug: string | null | undefined): slug is string {
  return typeof slug === "string" && slug.trim().length > 0;
}

/**
 * `{lessonsIndexPath}/{slug}` with encoding — null when the slug cannot be linked.
 * Prefer {@link marketingPathwayLessonDetailPath} when you have a resolved pathway.
 */
export function marketingLessonDetailHref(lessonsIndexPath: string, slug: string | null | undefined): string | null {
  if (!usableMarketingLessonSlug(slug)) return null;
  const base = lessonsIndexPath.replace(/\/$/, "");
  return `${base}/${encodeURIComponent(slug.trim())}`;
}

/** Exam hub root: `/{countrySlug}/{roleTrack}/{examCode}`. */
export function marketingExamHubBasePath(
  pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">,
): string {
  return buildExamPathwayPath(pathway);
}

/** Pathway lessons index: `/{country}/{role}/{exam}/lessons`. */
export function marketingPathwayLessonsIndexPath(
  pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">,
): string {
  return buildExamPathwayPath(pathway, "lessons");
}

/**
 * Canonical marketing lesson detail URL: `/{locale}/{role}/{examCode}/lessons/{lessonSlug}`.
 * - `locale` is the pathway country segment (`us` / `canada`), not BCP-47 UI language.
 * - `roleTrack` is the internal role id; {@link buildExamPathwayPath} maps LPN/RPN → `pn` in the URL.
 */
export function buildLessonPath(input: {
  locale: string;
  roleTrack: string;
  examCode: string;
  lessonSlug: string | null | undefined;
}): string | null {
  const slug = typeof input.lessonSlug === "string" ? input.lessonSlug.trim() : "";
  if (!slug) return null;
  const countrySlug = typeof input.locale === "string" ? input.locale.trim().toLowerCase() : "";
  const roleTrack = typeof input.roleTrack === "string" ? input.roleTrack.trim().toLowerCase() : "";
  const examCode = typeof input.examCode === "string" ? input.examCode.trim().toLowerCase() : "";
  if (!countrySlug || !roleTrack || !examCode) return null;
  return buildExamPathwayPath({ countrySlug, roleTrack, examCode }, `lessons/${encodeURIComponent(slug)}`);
}

/** Single lesson on the marketing pathway hub. */
export function marketingPathwayLessonDetailPath(
  pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">,
  lessonSlug: string | null | undefined,
): string | null {
  return buildLessonPath({
    locale: pathway.countrySlug,
    roleTrack: pathway.roleTrack,
    examCode: pathway.examCode,
    lessonSlug,
  });
}

/** Paginated topic cluster under a pathway lessons hub. */
export function marketingPathwayLessonTopicClusterPath(
  pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">,
  topicSlug: string,
): string {
  const ts = topicSlug.trim();
  return buildExamPathwayPath(pathway, `lessons/topics/${encodeURIComponent(ts)}`);
}

/**
 * Topic index under an existing lessons base (e.g. prop-drilled `lessonsBasePath`).
 * Empty `topicSlug` returns the lessons index path unchanged.
 */
export function marketingLessonsTopicClusterPath(lessonsIndexPath: string, topicSlug: string | null | undefined): string {
  const hub = lessonsIndexPath.replace(/\/$/, "");
  const slug = (topicSlug ?? "").trim();
  if (!slug) return hub;
  return `${hub}/topics/${encodeURIComponent(slug)}`;
}

/** `/allied-health/{professionKey}/lessons` */
export function alliedHealthLessonsIndexPath(professionKey: string): string {
  return `${ALLIED_HEALTH_ROOT}/${encodeURIComponent(professionKey.trim())}/lessons`;
}

/** `/allied-health/{professionKey}/lessons/{lessonSlug}` */
export function alliedHealthLessonDetailPath(professionKey: string, lessonSlug: string): string {
  return `${alliedHealthLessonsIndexPath(professionKey)}/${encodeURIComponent(lessonSlug.trim())}`;
}

/** `/app/lessons/{id}` */
export function appLearnerLessonDetailPath(lessonId: string): string {
  return `${APP_LEARNER_LESSONS_INDEX_PATH}/${encodeURIComponent(String(lessonId).trim())}`;
}

/** `/pre-nursing/lessons/{slug}` */
export function preNursingLessonDetailPath(moduleSlug: string): string {
  return `${PRE_NURSING_LESSONS_INDEX_PATH}/${encodeURIComponent(moduleSlug.trim())}`;
}

/**
 * Lightweight shape check for marketing pathway lesson URLs (detail, not topic index).
 * Intended for tests and audits — not a full router parser.
 */
export function isMarketingPathwayLessonDetailPath(pathname: string): boolean {
  return /^\/(canada|us)\/(pn|rpn|lpn|rn|np|allied)\/[^/]+\/lessons\/[^/]+$/.test(pathname);
}

export function isMarketingPathwayLessonsIndexPath(pathname: string): boolean {
  return /^\/(canada|us)\/(pn|rpn|lpn|rn|np|allied)\/[^/]+\/lessons$/.test(pathname);
}
