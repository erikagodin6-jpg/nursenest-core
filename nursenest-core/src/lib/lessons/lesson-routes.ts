/**
 * Central typed builders for learner-facing lesson URLs.
 *
 * Use these instead of ad hoc `/${country}/${role}/${exam}/lessons/...` strings so routes stay aligned with
 * `ExamPathwayDefinition` and Next.js marketing segments (`[locale]` = countrySlug, `[slug]` = roleTrack).
 */

import { getAlliedProfessionByProfessionKey, getPathwayOrThrow } from "@/lib/allied/allied-professions-registry";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ALLIED_PROFESSION_QUERY_PARAM } from "@/lib/lessons/canonical-lessons-hubs";

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
 * Normalizes the `[lessonSlug]` route param (percent-encoded bookmarks, copy/paste).
 * Next usually delivers a decoded segment; this stays safe if a slug is still encoded once.
 */
export function marketingLessonSlugFromRouteParam(raw: string | null | undefined): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    return decodeURIComponent(trimmed).trim();
  } catch {
    return trimmed;
  }
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
 * Normalized topic slug for `?topicSlug=` on the pathway lessons hub, or null when unusable.
 * Keeps hub filters aligned with DB/catalog topicSlug values (lowercase, bounded length).
 */
export function normalizeMarketingLessonsHubTopicSlug(raw: string | null | undefined): string | null {
  const t = (raw ?? "").trim().toLowerCase();
  if (t.length < 1 || t.length > 160) return null;
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(t)) return null;
  return t;
}

export type BuildLessonPathInput =
  | {
      /** Pathway country URL segment (`us` / `canada`), not BCP-47 UI language. */
      locale: string;
      /** Internal role id; {@link buildExamPathwayPath} maps LPN/RPN → `pn` in the URL. */
      roleTrack: string;
      examCode: string;
      lessonSlug: string | null | undefined;
    }
  | {
      pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">;
      lessonSlug: string | null | undefined;
    };

/**
 * Canonical marketing lesson detail URL: `/{locale}/{role}/{examCode}/lessons/{lessonSlug}`.
 * Prefer the `{ pathway, lessonSlug }` overload so links stay aligned with {@link ExamPathwayDefinition}.
 */
export function buildLessonPath(input: BuildLessonPathInput): string | null {
  if ("pathway" in input) {
    return buildLessonPath({
      locale: input.pathway.countrySlug,
      roleTrack: input.pathway.roleTrack,
      examCode: input.pathway.examCode,
      lessonSlug: input.lessonSlug,
    });
  }
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
  return buildLessonPath({ pathway, lessonSlug });
}

/**
 * Topic-scoped view of the pathway lessons hub (same page as the main index, `?topicSlug=` filter).
 * Legacy `/lessons/topics/{slug}` URLs permanently redirect here.
 */
export function marketingPathwayLessonTopicClusterPath(
  pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">,
  topicSlug: string,
): string {
  const ts = normalizeMarketingLessonsHubTopicSlug(topicSlug);
  const base = marketingPathwayLessonsIndexPath(pathway);
  if (!ts) return base;
  return `${base}?topicSlug=${encodeURIComponent(ts)}`;
}

/**
 * Topic index under an existing lessons base (e.g. prop-drilled `lessonsBasePath`).
 * Empty `topicSlug` returns the lessons index path unchanged.
 */
export function marketingLessonsTopicClusterPath(lessonsIndexPath: string, topicSlug: string | null | undefined): string {
  const hub = lessonsIndexPath.replace(/\/$/, "");
  const ts = normalizeMarketingLessonsHubTopicSlug(topicSlug ?? undefined);
  if (!ts) return hub;
  return `${hub}?topicSlug=${encodeURIComponent(ts)}`;
}

/**
 * Canonical allied **lessons hub** URL — always the single country pathway lessons index with profession filter:
 * `/{country}/allied/allied-health/lessons?alliedProfession=…`
 * (Legacy `/allied-health/{key}/lessons` routes 301 here.)
 */
export function alliedHealthLessonsIndexPath(professionKey: string): string {
  const k = professionKey.trim();
  const prof = getAlliedProfessionByProfessionKey(k);
  const pathway = prof ? getPathwayOrThrow(prof.pathwayId) : undefined;
  if (!prof || !pathway) {
    return `${ALLIED_HEALTH_ROOT}/${encodeURIComponent(k)}/lessons`;
  }
  const qs = new URLSearchParams();
  qs.set(ALLIED_PROFESSION_QUERY_PARAM, prof.professionKey);
  return `${buildExamPathwayPath(pathway, "lessons")}?${qs.toString()}`;
}

/** Canonical allied lesson detail — same as other pathways: pathway lessons detail (no duplicate hub layer). */
export function alliedHealthLessonDetailPath(professionKey: string, lessonSlug: string): string {
  const k = professionKey.trim();
  const slug = lessonSlug.trim();
  const prof = getAlliedProfessionByProfessionKey(k);
  const pathway = prof ? getPathwayOrThrow(prof.pathwayId) : undefined;
  if (!prof || !pathway) {
    return `${ALLIED_HEALTH_ROOT}/${encodeURIComponent(k)}/lessons/${encodeURIComponent(slug)}`;
  }
  const detail = marketingPathwayLessonDetailPath(pathway, slug);
  return detail ?? `${ALLIED_HEALTH_ROOT}/${encodeURIComponent(k)}/lessons/${encodeURIComponent(slug)}`;
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
