/**
 * ## Marketing pathway lesson — paywall / serialization contract
 *
 * **Server-only full lesson:** `PathwayLessonRecord` with `sections[]` and heavy blocks must remain in
 * server components and server-only loaders (`pathway-lesson-loader.ts`). Do not pass the full record to
 * `"use client"` modules.
 *
 * **Gating before client props:** `canViewFullPathwayLesson`, `visibleSectionsForLesson`, and
 * subscriber-only supplement checks run in the marketing lesson **page** (RSC) before any client bundle
 * receives props.
 *
 * **Locked views:** Never serialize subscriber-only supplements (exam takeaways, memory anchor, full locked
 * bodies, etc.) into client props. Client surfaces receive ids, booleans, headings for locked previews,
 * and already-trimmed preview strings only.
 *
 * Types below are the **only** approved wide shapes for marketing pathway client boundaries. Prefer
 * adding new fields here explicitly rather than threading `PathwayLessonRecord` into clients.
 */

import type { ReactNode } from "react";
import type { PathwayLessonRecord, PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

/** Chips row: metadata only — no `sections`, no bodies. */
export type PathwayLessonMarketingRecordChipsSource = Pick<
  PathwayLessonRecord,
  "topic" | "bodySystem" | "examRelevance" | "audienceTiers" | "countryScope"
>;

/**
 * Server-only deferred lane (related lessons / stems) — explicitly excludes `sections` and other article payload.
 * Build with a manual pick on the server; do not pass `lesson` if it still includes full sections.
 */
export type PathwayLessonDeferredServerSnapshot = Pick<
  PathwayLessonRecord,
  "slug" | "title" | "topic" | "topicSlug" | "bodySystem" | "relatedLessonRefs"
>;

/** Condensed bullets derived server-side from preview-visible sections only. */
export type MarketingPathwayLessonQuickReviewClientProps = {
  quickReviewLines: readonly string[];
};

export type MarketingPathwayLessonActionsClientProps = {
  pathwayId: string;
  lessonSlug: string;
  topicCode?: string | null;
  topicLabel?: string | null;
  userId: string;
  canMarkComplete: boolean;
  initialProgress?: PathwayLessonProgressStatus;
};

/** Pre/post quiz payloads only — not full lesson sections. */
export type MarketingPathwayLessonAssessmentShellProps = {
  userId: string;
  pathwayId: string;
  lessonSlug: string;
  initialProgress: PathwayLessonProgressStatus;
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
  fullAccess: boolean;
  assessmentsEnabled?: boolean;
  children: ReactNode;
};

/** Compile-time: deferred snapshot must not include `sections`. */
type _DeferredExcludesSections = PathwayLessonDeferredServerSnapshot extends { sections: unknown }
  ? never
  : true;

export const _marketingPathwayLessonDeferredSnapshotExcludesSections: _DeferredExcludesSections = true;

/** Server-only: strip to deferred snapshot so `sections` never crosses the deferred boundary. */
export function toPathwayLessonDeferredServerSnapshot(
  lesson: PathwayLessonRecord,
): PathwayLessonDeferredServerSnapshot {
  return {
    slug: lesson.slug,
    title: lesson.title,
    topic: lesson.topic,
    topicSlug: lesson.topicSlug,
    bodySystem: lesson.bodySystem,
    relatedLessonRefs: lesson.relatedLessonRefs,
  };
}

/** Explicit metadata pick — avoids passing a full `PathwayLessonRecord` into chip rows. */
export function pickPathwayLessonMarketingRecordChipsSource(
  lesson: PathwayLessonRecord,
): PathwayLessonMarketingRecordChipsSource {
  return {
    topic: lesson.topic,
    bodySystem: lesson.bodySystem,
    examRelevance: lesson.examRelevance,
    audienceTiers: lesson.audienceTiers,
    countryScope: lesson.countryScope,
  };
}
