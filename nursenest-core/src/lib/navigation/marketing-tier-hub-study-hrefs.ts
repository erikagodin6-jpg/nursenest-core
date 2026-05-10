/**
 * Canonical hrefs for nursing tier hub study tiles (Lessons, Flashcards, Practice Questions, public
 * CAT landing, Practice Tests hub). {@link resolveMarketingTierHubStudyActionHref} validates
 * optional `href` overrides so CMS/config cannot ship `#`, fragments-only, protocol tricks, or
 * cross-tier paths onto these tiles.
 */
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { pathwayHubAppFlashcardsHref, pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";

export const MARKETING_TIER_HUB_STUDY_ACTION_IDS = [
  "lessons",
  "flashcards",
  "practice_questions",
  "cat",
  "exams",
] as const;

export type MarketingTierHubStudyActionId = (typeof MARKETING_TIER_HUB_STUDY_ACTION_IDS)[number];

const RESOLVE_URL_BASE = "http://nn.invalid";

export function isMarketingTierHubStudyActionId(id: string): id is MarketingTierHubStudyActionId {
  return (MARKETING_TIER_HUB_STUDY_ACTION_IDS as readonly string[]).includes(id);
}

/**
 * Empty, whitespace-only, fragment-only (`#`, `#topics`), or disallowed protocols.
 */
export function isUnsafeOrPlaceholderTierHubHref(href: string | undefined | null): boolean {
  if (href == null) return true;
  const t = href.trim();
  if (t.length === 0) return true;
  if (t.startsWith("#")) return true;
  const lower = t.toLowerCase();
  return (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  );
}

function pathnameOf(href: string): string | null {
  try {
    return new URL(href, RESOLVE_URL_BASE).pathname;
  } catch {
    return null;
  }
}

/**
 * Single canonical builder for tier hub study-card destinations (marketing + tests).
 */
export function marketingTierHubStudyActionHref(pathway: ExamPathwayDefinition, actionId: MarketingTierHubStudyActionId): string {
  switch (actionId) {
    case "lessons":
      return marketingPathwayLessonsIndexPath(pathway);
    case "flashcards":
      return pathwayHubAppFlashcardsHref(pathway.id);
    case "practice_questions":
      return buildExamPathwayPath(pathway, "questions");
    case "cat":
      return buildExamPathwayPath(pathway, "cat");
    case "exams":
      /** Practice Exam tile — learner timed/linear sets hub (CAT launch is a sub-route from there). */
      return pathwayHubAppPracticeTestsHref(pathway.id);
    default: {
      const _never: never = actionId;
      return _never;
    }
  }
}

function isSafeHttpOrHttpsExternal(href: string): boolean {
  const lower = href.trim().toLowerCase();
  if (!lower.startsWith("http://") && !lower.startsWith("https://")) return false;
  try {
    const u = new URL(href.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Resolves a study-tile href: rejects placeholders and unsafe URLs, keeps same-pathway internal
 * paths (optionally stripping query when pathname matches the canonical hub path), and falls back
 * to {@link marketingTierHubStudyActionHref} when the override is unusable.
 */
export function resolveMarketingTierHubStudyActionHref(
  pathway: ExamPathwayDefinition,
  actionId: MarketingTierHubStudyActionId,
  hrefOverride?: string | null,
): string {
  const canonical = marketingTierHubStudyActionHref(pathway, actionId);
  const raw = hrefOverride?.trim() ?? "";

  if (isUnsafeOrPlaceholderTierHubHref(raw)) return canonical;

  if (raw.startsWith("/")) {
    if (raw.startsWith("//")) return canonical;

    const candidatePath = pathnameOf(raw);
    const canonicalPath = pathnameOf(canonical);
    if (!candidatePath || !canonicalPath) return canonical;

    if (actionId === "flashcards") {
      try {
        const u = new URL(raw, RESOLVE_URL_BASE);
        if (u.pathname !== "/app/flashcards") return canonical;
        if (u.searchParams.get("pathwayId") !== pathway.id) return canonical;
        return raw;
      } catch {
        return canonical;
      }
    }

    if (actionId === "exams") {
      try {
        const u = new URL(raw, RESOLVE_URL_BASE);
        if (u.pathname !== "/app/practice-tests") return canonical;
        if (u.searchParams.get("pathwayId") !== pathway.id) return canonical;
        return raw;
      } catch {
        return canonical;
      }
    }

    if (actionId === "cat") {
      try {
        const u = new URL(raw, RESOLVE_URL_BASE);
        if (u.pathname === "/app/practice-tests/cat-launch" && u.searchParams.get("pathwayId") === pathway.id) {
          return raw;
        }
      } catch {
        return canonical;
      }
      const catRoot = pathnameOf(buildExamPathwayPath(pathway, "cat"));
      if (!catRoot) return canonical;
      if (candidatePath === catRoot) return canonical;
      if (candidatePath.startsWith(`${catRoot}/`)) return raw;
      return canonical;
    }

    const hubBasePath = pathnameOf(buildExamPathwayPath(pathway));
    if (!hubBasePath) return canonical;
    const underThisTierHub =
      candidatePath === hubBasePath || candidatePath.startsWith(`${hubBasePath}/`);
    if (!underThisTierHub) return canonical;

    if (candidatePath === canonicalPath) return canonical;

    if (actionId === "lessons") {
      const lessonRoot = pathnameOf(marketingPathwayLessonsIndexPath(pathway));
      if (!lessonRoot) return canonical;
      if (candidatePath === lessonRoot || candidatePath.startsWith(`${lessonRoot}/`)) return canonical;
      return canonical;
    }

    if (actionId === "practice_questions") {
      const qRoot = pathnameOf(buildExamPathwayPath(pathway, "questions"));
      if (!qRoot) return canonical;
      if (candidatePath === qRoot || candidatePath.startsWith(`${qRoot}/`)) return canonical;
      return canonical;
    }

    return canonical;
  }

  if (isSafeHttpOrHttpsExternal(raw)) return raw;

  return canonical;
}
