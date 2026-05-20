/**
 * Pure folds for `/app/lessons` hub vs `/app/lessons/[id]` detail — no Prisma, no `server-only`.
 * {@link app-lessons-hub-row-renderability.ts} delegates here so unit tests stay lightweight.
 */
import type { AppLessonsHubListSource } from "@/lib/lessons/app-lessons-hub-list-source";

export type AppLessonsHubRowDropReason =
  | "slug_invalid"
  | "detail_hydration_failed"
  | "entitlement_gate"
  | "content_entitlement_miss"
  | "legacy_not_found"
  | "legacy_out_of_plan";

export type AppLessonsHubRowRenderabilityResult =
  | { ok: true; source: AppLessonsHubListSource }
  | { ok: false; source: AppLessonsHubListSource; reason: AppLessonsHubRowDropReason };

/** Tri-state pathway resolution outcome folded by the hub (mirrors {@link AppSubscriberPathwayLessonDetailResolution}). */
export type PathwayHubDetailFoldResolution =
  | { kind: "out_of_plan" }
  | { kind: "not_found" }
  | { kind: "pathway_ok" };

export function pathwayResolutionToHubRowResult(
  r: PathwayHubDetailFoldResolution,
  pwRow: { slug?: string | null },
): AppLessonsHubRowRenderabilityResult {
  if (r.kind === "out_of_plan") return { ok: false, source: "pathway_lessons", reason: "entitlement_gate" };
  if (r.kind === "pathway_ok") return { ok: true, source: "pathway_lessons" };
  const slug = typeof pwRow.slug === "string" ? pwRow.slug.trim() : "";
  if (!slug) return { ok: false, source: "pathway_lessons", reason: "slug_invalid" };
  return { ok: false, source: "pathway_lessons", reason: "detail_hydration_failed" };
}

export function contentItemLessonAccessToHubRowResult(args: {
  id: string;
  lessonTypeExists: boolean;
  entitledRowExists: boolean;
}): AppLessonsHubRowRenderabilityResult {
  const id = args.id.trim();
  if (!id) return { ok: false, source: "content_items", reason: "slug_invalid" };
  if (!args.lessonTypeExists) return { ok: false, source: "content_items", reason: "detail_hydration_failed" };
  if (!args.entitledRowExists) return { ok: false, source: "content_items", reason: "content_entitlement_miss" };
  return { ok: true, source: "content_items" };
}

export function legacyLessonAccessToHubRowResult(args: {
  id: string;
  lessonHit: boolean;
  canAccess: boolean;
}): AppLessonsHubRowRenderabilityResult {
  const id = args.id.trim();
  if (!id) return { ok: false, source: "legacy_content_map", reason: "slug_invalid" };
  if (!args.lessonHit) return { ok: false, source: "legacy_content_map", reason: "legacy_not_found" };
  if (!args.canAccess) return { ok: false, source: "legacy_content_map", reason: "legacy_out_of_plan" };
  return { ok: true, source: "legacy_content_map" };
}
