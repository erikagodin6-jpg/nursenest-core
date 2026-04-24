import type { ContentStatus, Prisma, TierCode } from "@prisma/client";

import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { computeStructuralPublicCompleteFromDbRow } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { LegacyLessonExportRow } from "@/lib/legacy/legacy-public-content-types";
import { normalizeLegacySlug } from "@/lib/legacy/legacy-public-content-types";

const CANONICAL_LOCALE = "en" as const;

export const LEGACY_PIPELINE_ALLOWED_PATHWAY_IDS = new Set(EXAM_PATHWAYS.map((p) => p.id));

export function assertPathwayAllowed(pathwayId: string): void {
  if (!LEGACY_PIPELINE_ALLOWED_PATHWAY_IDS.has(pathwayId)) {
    throw new Error(`Refusing legacy row: pathwayId not in catalog allowlist: ${pathwayId}`);
  }
}

export type PathwayLessonRowShape = {
  id: string;
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: Prisma.JsonValue;
  locale: string;
  exams: string[];
  countries: string[];
  priority: string;
  examMeta: Prisma.JsonValue;
  status: ContentStatus;
  tierCode: TierCode | null;
  structuralPublicComplete: boolean;
  published_at: Date | null;
};

export function metadataNeedsRepair(
  legacy: LegacyLessonExportRow,
  current: Pick<PathwayLessonRowShape, "topic" | "topicSlug" | "bodySystem">,
): boolean {
  const t = legacy.topic?.trim();
  const ts = legacy.topicSlug?.trim();
  const bs = legacy.bodySystem?.trim();
  const curTopic = current.topic?.trim() ?? "";
  const curTs = current.topicSlug?.trim() ?? "";
  const curBs = current.bodySystem?.trim() ?? "";
  if (t && t !== curTopic) return true;
  if (ts && ts !== curTs) return true;
  if (bs && bs !== curBs) return true;
  if (!curTopic || !curTs || !curBs) return true;
  return false;
}

export function buildPathwayLessonUpdateFromLegacy(
  legacy: LegacyLessonExportRow,
  current: PathwayLessonRowShape,
  opts: {
    overwriteBody: boolean;
    allowPathwayCorrection: boolean;
  },
): { data: Prisma.PathwayLessonUpdateInput; notes: string[] } {
  assertPathwayAllowed(legacy.pathwayId);
  const notes: string[] = [];
  if (current.pathwayId !== legacy.pathwayId && !opts.allowPathwayCorrection) {
    return { data: {}, notes: ["skip_pathway_mismatch: set LEGACY_IMPORT_ALLOW_PATHWAY_CORRECTION=1"] };
  }

  const data: Prisma.PathwayLessonUpdateInput = {};
  const nextSlug = normalizeLegacySlug(legacy.slug);
  if (!nextSlug) {
    notes.push("skip_invalid_legacy_slug");
    return { data: {}, notes };
  }
  if (nextSlug !== current.slug) {
    data.slug = nextSlug;
    notes.push(`slug: ${current.slug} -> ${nextSlug}`);
  }

  if (opts.allowPathwayCorrection && legacy.pathwayId !== current.pathwayId) {
    data.pathwayId = legacy.pathwayId;
    notes.push(`pathwayId: ${current.pathwayId} -> ${legacy.pathwayId}`);
  }

  if (legacy.title?.trim() && legacy.title.trim() !== current.title) {
    data.title = legacy.title.trim();
    notes.push("title_updated");
  }

  if (legacy.topic?.trim()) {
    data.topic = legacy.topic.trim();
  }
  if (legacy.topicSlug?.trim()) {
    data.topicSlug = normalizeLegacySlug(legacy.topicSlug.trim()) || legacy.topicSlug.trim().toLowerCase();
  }
  if (legacy.bodySystem?.trim()) {
    data.bodySystem = legacy.bodySystem.trim();
  }

  if (legacy.tierCode && legacy.tierCode !== current.tierCode) {
    const t = legacy.tierCode as TierCode;
    data.tierCode = t;
    notes.push("tierCode_updated");
  }

  if (legacy.status && legacy.status !== current.status) {
    data.status = legacy.status;
    notes.push(`status -> ${legacy.status}`);
  }

  if (legacy.visiblePublic === true || legacy.status === "PUBLISHED") {
    if (!current.published_at) {
      data.published_at = new Date();
      notes.push("published_at_set");
    }
  }

  if (opts.overwriteBody && legacy.sections !== undefined && legacy.sections !== null) {
    data.sections = legacy.sections as Prisma.InputJsonValue;
    notes.push("sections_overwritten");
  }

  const mergedPreview: PathwayLessonRowShape = {
    ...current,
    ...(typeof data.slug === "string" ? { slug: data.slug } : {}),
    ...(typeof data.pathwayId === "string" ? { pathwayId: data.pathwayId } : {}),
    ...(typeof data.title === "string" ? { title: data.title } : {}),
    ...(typeof data.topic === "string" ? { topic: data.topic } : {}),
    ...(typeof data.topicSlug === "string" ? { topicSlug: data.topicSlug } : {}),
    ...(typeof data.bodySystem === "string" ? { bodySystem: data.bodySystem } : {}),
    ...(data.sections !== undefined ? { sections: data.sections as Prisma.JsonValue } : {}),
    ...(data.tierCode !== undefined && data.tierCode !== null ? { tierCode: data.tierCode as TierCode } : {}),
    ...(typeof data.status === "string" ? { status: data.status as ContentStatus } : {}),
  };

  const structuralPublicComplete = computeStructuralPublicCompleteFromDbRow(
    mergedPreview as Parameters<typeof pathwayLessonRowToInput>[0] & { pathwayId: string },
  );
  if (structuralPublicComplete !== current.structuralPublicComplete) {
    data.structuralPublicComplete = structuralPublicComplete;
    notes.push(`structuralPublicComplete -> ${structuralPublicComplete}`);
  }

  return { data, notes };
}

/** Applies Prisma update fields onto a snapshot row for structural gate preview (no DB). */
export function previewPathwayLessonRowAfterUpdate(
  current: PathwayLessonRowShape,
  data: Prisma.PathwayLessonUpdateInput,
): PathwayLessonRowShape {
  return {
    ...current,
    ...(data.slug !== undefined ? { slug: String(data.slug) } : {}),
    ...(data.pathwayId !== undefined ? { pathwayId: String(data.pathwayId) } : {}),
    ...(data.title !== undefined ? { title: String(data.title) } : {}),
    ...(data.topic !== undefined ? { topic: String(data.topic) } : {}),
    ...(data.topicSlug !== undefined ? { topicSlug: String(data.topicSlug) } : {}),
    ...(data.bodySystem !== undefined ? { bodySystem: String(data.bodySystem) } : {}),
    ...(data.sections !== undefined ? { sections: data.sections as Prisma.JsonValue } : {}),
    ...(data.tierCode !== undefined ? { tierCode: data.tierCode as TierCode | null } : {}),
    ...(data.status !== undefined ? { status: data.status as ContentStatus } : {}),
    ...(data.structuralPublicComplete !== undefined
      ? { structuralPublicComplete: Boolean(data.structuralPublicComplete) }
      : {}),
  };
}

export { CANONICAL_LOCALE };
