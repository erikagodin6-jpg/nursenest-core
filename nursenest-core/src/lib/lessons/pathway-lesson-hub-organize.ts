/**
 * ## Marketing lessons hub — canonical identity, dedupe, and display titles
 *
 * **Primary identity (non-negotiable):** `pathwayId` + `slug`. Each slug appears at most once on the hub;
 * duplicate rows for the same slug keep the higher-yield / richer-preview winner.
 *
 * **Secondary “concept” identity (near-duplicate titles):** `topicSlug` + a normalized form of the
 * **learner-facing** title — not raw DB title strings. We derive the key from
 * {@link cleanLessonTitleForDisplay} first, then {@link normalizeLessonTitleForDedupe} so pathway/exam
 * suffix noise and punctuation variants collapse before comparison.
 *
 * **Canonical display title:** `cleanLessonTitleForDisplay(seoTitle || title)` so cards show one
 * consistent line (exam pathway tokens stripped, acronyms preserved per lesson-title rules).
 *
 * **Dedupe order:** (1) collapse by slug → (2) optional collapse by concept key when
 * {@link OrganizeHubLessonsOptions.mergeNearDuplicateTitles} is true → (3) rewrite `title` to the
 * canonical display string. Marketing curriculum uses **slug-only** dedupe by default.
 */

import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import { normalizeLessonTitleForDedupe } from "@/lib/lessons/pathway-lesson-dedupe";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonYieldWeight } from "@/lib/lessons/pathway-lesson-yield";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

/** Higher = preferred when choosing one row per slug or per concept. */
export function hubLessonPresentationRank(lesson: PathwayLessonRecord): number {
  const y = pathwayLessonYieldWeight(lesson.activeExamMeta?.yieldLevel);
  let exam = 0;
  switch (lesson.examRelevance) {
    case "high_yield":
      exam = 4;
      break;
    case "core":
      exam = 3;
      break;
    case "specialty":
      exam = 2;
      break;
    default:
      exam = 1;
  }
  const preview = Math.min(99, lesson.previewSectionCount ?? 0);
  return exam * 1000 + y * 100 + preview;
}

function pickBetterHubLesson(a: PathwayLessonRecord, b: PathwayLessonRecord): PathwayLessonRecord {
  const ra = hubLessonPresentationRank(a);
  const rb = hubLessonPresentationRank(b);
  if (ra !== rb) return ra > rb ? a : b;
  return a.slug.toLowerCase() <= b.slug.toLowerCase() ? a : b;
}

/** Single learner-facing title for hub cards and concept keys. */
export function canonicalHubLessonDisplayTitle(lesson: PathwayLessonRecord): string {
  const raw = (lesson.seoTitle?.trim() || lesson.title || "").trim();
  return cleanLessonTitleForDisplay(raw);
}

function hubConceptKey(lesson: PathwayLessonRecord): string | null {
  const ts = (lesson.topicSlug ?? "").trim().toLowerCase();
  const cleaned = canonicalHubLessonDisplayTitle(lesson);
  const normalized = normalizeLessonTitleForDedupe(cleaned);
  if (!ts || !normalized) return null;
  return `${ts}|${normalized}`;
}

function firstIndexBySlug(order: readonly PathwayLessonRecord[], slug: string): number {
  const s = slug.toLowerCase();
  const i = order.findIndex((l) => l.slug.trim().toLowerCase() === s);
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}

export type OrganizeHubLessonsOptions = {
  /**
   * When true, different slugs that share the same topic + normalized display title collapse to one row
   * (legacy “near duplicate” hub cleanup). **Default false** — marketing curriculum must keep one card per slug;
   * otherwise hundreds of RN lessons can incorrectly collapse to a single card.
   */
  mergeNearDuplicateTitles?: boolean;
  /**
   * Set only from {@link prepareLessonsForHubCurriculum}. When true, concept merge is **never** applied: if
   * `mergeNearDuplicateTitles` is mistakenly true, we log, force slug-only behavior, and in production forward
   * to Sentry so this cannot silently regress.
   */
  marketingLessonsHubInvocation?: boolean;
};

/**
 * Dedupe by slug, optionally by topic+normalized learner title, then normalize `title` for display.
 * Preserves relative order of first appearance in `lessons` among survivors.
 */
export function organizeHubLessonsForPresentation(
  lessons: readonly PathwayLessonRecord[],
  pathwayId?: string,
  options?: OrganizeHubLessonsOptions,
): PathwayLessonRecord[] {
  const before = lessons.length;
  let mergeConcepts = Boolean(options?.mergeNearDuplicateTitles);
  if (options?.marketingLessonsHubInvocation === true && mergeConcepts) {
    safeServerLog("pathway_lessons", "hub_organize_forbidden_concept_merge_error", {
      pathway_id: pathwayId ?? "",
      forced_merge_near_duplicate_titles_false: "1",
      surface: "marketing_lessons_hub",
    });
    if (process.env.NODE_ENV === "production") {
      safeServerLogCritical(
        "pathway_lessons",
        "hub_organize_forbidden_concept_merge_production",
        { pathway_id: pathwayId ?? "", surface: "marketing_lessons_hub" },
        new Error("mergeNearDuplicateTitles must not run for marketing lessons hub"),
      );
    }
    mergeConcepts = false;
  }

  const bySlug = new Map<string, PathwayLessonRecord>();
  for (const l of lessons) {
    const s = l.slug?.trim().toLowerCase();
    if (!s) continue;
    const prev = bySlug.get(s);
    bySlug.set(s, prev ? pickBetterHubLesson(prev, l) : l);
  }
  const slugPass = [...bySlug.values()];

  const merged = (() => {
    if (!mergeConcepts) return slugPass;
    const byConcept = new Map<string, PathwayLessonRecord>();
    const noConceptKey: PathwayLessonRecord[] = [];
    for (const l of slugPass) {
      const ck = hubConceptKey(l);
      if (!ck) {
        noConceptKey.push(l);
        continue;
      }
      const prev = byConcept.get(ck);
      byConcept.set(ck, prev ? pickBetterHubLesson(prev, l) : l);
    }
    return [...byConcept.values(), ...noConceptKey];
  })();

  merged.sort((a, b) => {
    const ia = firstIndexBySlug(lessons, a.slug);
    const ib = firstIndexBySlug(lessons, b.slug);
    if (ia !== ib) return ia - ib;
    return a.slug.localeCompare(b.slug, "en", { sensitivity: "base" });
  });

  const out = merged.map((l) => {
    const display = canonicalHubLessonDisplayTitle(l);
    if (display === l.title) return l;
    return { ...l, title: display };
  });

  if (before > out.length) {
    safeServerLog("pathway_lessons", "hub_curriculum_organize_shrink", {
      pathway_id: pathwayId ?? "",
      before: String(before),
      after: String(out.length),
      dropped: String(before - out.length),
      merge_near_duplicate_titles: mergeConcepts ? "1" : "0",
    });
  }

  return out;
}
