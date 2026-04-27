/**
 * Canonical hrefs for nursing tier hub study tiles (Lessons, Flashcards, Practice, Exams/CAT).
 * {@link resolveMarketingTierHubStudyActionHref} validates optional `href` overrides so CMS/config
 * cannot ship `#`, fragments-only, protocol tricks, or cross-tier paths onto these tiles.
 */
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";

export const MARKETING_TIER_HUB_STUDY_ACTION_IDS = ["lessons", "flashcards", "practice_questions", "exams"] as const;

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
      return `/app/flashcards?pathwayId=${encodeURIComponent(pathway.id)}`;
    case "practice_questions":
      return buildExamPathwayPath(pathway, "questions");
    case "exams":
      return buildExamPathwayPath(pathway, "cat");
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

    if (actionId === "exams") {
      const catRoot = pathnameOf(buildExamPathwayPath(pathway, "cat"));
      if (!catRoot) return canonical;
      if (candidatePath === catRoot || candidatePath.startsWith(`${catRoot}/`)) return canonical;
      return canonical;
    }

    return canonical;
  }

  if (isSafeHttpOrHttpsExternal(raw)) return raw;

  return canonical;
}
