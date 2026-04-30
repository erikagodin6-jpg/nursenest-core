import "server-only";

import { randomUUID } from "node:crypto";
import type { ContentItem, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { bodyStringFromContentJson } from "@/lib/prisma/content-item-body";
import { computeStructuralPublicCompleteFromDbRow } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonSection, PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";

const MARKETING_LOCALE = "en";
const PATHWAY_SYNC_TAG = "pathway-sync:";
const PATHWAY_LESSON_ID_TAG = "pathway-lesson-id:";

export function pathwaySyncPathwayIdsFromTags(tags: string[] | null | undefined): string[] {
  const out: string[] = [];
  for (const t of tags ?? []) {
    const s = typeof t === "string" ? t.trim() : "";
    if (!s.toLowerCase().startsWith(PATHWAY_SYNC_TAG)) continue;
    const id = s.slice(PATHWAY_SYNC_TAG.length).trim();
    if (id) out.push(id);
  }
  return [...new Set(out)];
}

function pathwayLessonIdsFromTags(tags: string[] | null | undefined): string[] {
  const out: string[] = [];
  for (const t of tags ?? []) {
    const s = typeof t === "string" ? t.trim() : "";
    if (!s.toLowerCase().startsWith(PATHWAY_LESSON_ID_TAG)) continue;
    const id = s.slice(PATHWAY_LESSON_ID_TAG.length).trim();
    if (id) out.push(id);
  }
  return [...new Set(out)];
}

function pathwaySyncIdsFromVersionKey(versionKey: string | null | undefined): string[] {
  if (!versionKey) return [];
  const v = versionKey.trim();
  if (!v.toLowerCase().startsWith(PATHWAY_SYNC_TAG)) return [];
  const id = v.slice(PATHWAY_SYNC_TAG.length).trim();
  return id ? [id] : [];
}

/** Map CMS `content_items.content` JSON blocks into legacy-style pathway sections (intro/core). */
export function pathwaySectionsFromContentItemJson(
  content: Prisma.JsonValue,
  fallbackHeading: string,
): PathwayLessonSection[] {
  const kinds: PathwayLessonSectionKind[] = ["intro", "core"];
  if (content !== null && Array.isArray(content) && content.length > 0) {
    const sections: PathwayLessonSection[] = [];
    let i = 0;
    for (const block of content) {
      if (!block || typeof block !== "object") continue;
      const o = block as { sectionTitle?: unknown; content?: unknown };
      const heading =
        typeof o.sectionTitle === "string" && o.sectionTitle.trim()
          ? o.sectionTitle.trim()
          : i === 0
            ? fallbackHeading
            : `Section ${i + 1}`;
      const body = typeof o.content === "string" ? o.content : String(o.content ?? "");
      const kind = i === 0 ? kinds[0]! : kinds[1]!;
      sections.push({ id: randomUUID(), heading, kind, body });
      i += 1;
    }
    if (sections.length > 0) return sections;
  }
  const body = bodyStringFromContentJson(content);
  return [{ id: randomUUID(), heading: fallbackHeading, kind: "intro", body }];
}

type PathwayLessonRow = Prisma.PathwayLessonGetPayload<{
  select: {
    id: true;
    pathwayId: true;
    slug: true;
    title: true;
    topic: true;
    topicSlug: true;
    bodySystem: true;
    previewSectionCount: true;
    seoTitle: true;
    seoDescription: true;
    sections: true;
    locale: true;
    status: true;
  };
}>;

async function resolveTargets(item: Pick<ContentItem, "slug" | "tags" | "versionKey">): Promise<{
  targets: PathwayLessonRow[];
  resolution: "ids" | "slug_unique" | "slug_and_pathway_tags" | "none" | "ambiguous";
}> {
  const slug = item.slug.trim();
  if (!slug) return { targets: [], resolution: "none" };

  const explicitIds = pathwayLessonIdsFromTags(item.tags);
  if (explicitIds.length > 0) {
    const rows = await prisma.pathwayLesson.findMany({
      where: { id: { in: explicitIds }, locale: MARKETING_LOCALE },
      select: {
        id: true,
        pathwayId: true,
        slug: true,
        title: true,
        topic: true,
        topicSlug: true,
        bodySystem: true,
        previewSectionCount: true,
        seoTitle: true,
        seoDescription: true,
        sections: true,
        locale: true,
        status: true,
      },
      take: Math.min(50, explicitIds.length),
    });
    const targets = rows.filter((r) => r.slug === slug);
    if (rows.length > 0 && targets.length === 0) {
      console.log("[PATHWAY SYNC SKIPPED]", {
        reason: "pathway_lesson_id_slug_mismatch",
        contentItemSlug: slug,
        pathwayLessonSlugs: rows.map((r) => r.slug),
      });
    }
    return { targets, resolution: "ids" };
  }

  const pathwayHints = [...pathwaySyncPathwayIdsFromTags(item.tags), ...pathwaySyncIdsFromVersionKey(item.versionKey)];

  const candidates = await prisma.pathwayLesson.findMany({
    where: { slug, locale: MARKETING_LOCALE },
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      previewSectionCount: true,
      seoTitle: true,
      seoDescription: true,
      sections: true,
      locale: true,
      status: true,
    },
    take: 40,
  });

  if (pathwayHints.length > 0) {
    const hintSet = new Set(pathwayHints);
    const targets = candidates.filter((c) => hintSet.has(c.pathwayId));
    return { targets, resolution: "slug_and_pathway_tags" };
  }

  if (candidates.length === 0) return { targets: [], resolution: "none" };
  if (candidates.length === 1) return { targets: candidates, resolution: "slug_unique" };
  return { targets: [], resolution: "ambiguous" };
}

/**
 * When a `ContentItem` lesson is published (or saved while already published), push title/body/SEO into
 * matching `pathway_lessons` rows so marketing lesson URLs stay aligned with admin CMS.
 *
 * Safety: updates only when slug matches a unique English row, or when `pathway-sync:<pathwayId>` tags /
 * `versionKey` narrow to specific pathways, or when `pathway-lesson-id:<rowId>` pins a row (slug must match).
 * Does not create pathway rows. Does not overwrite topic/topicSlug/bodySystem/examMeta/tier metadata.
 */
export async function syncPublishedContentItemToPathwayLessons(item: ContentItem): Promise<void> {
  if (item.type !== "lesson") return;
  const status = (item.status ?? "").toLowerCase();
  if (status !== "published") return;

  const { targets, resolution } = await resolveTargets(item);

  if (resolution === "ambiguous") {
    console.log("[PATHWAY SYNC AMBIGUOUS]", {
      slug: item.slug,
      contentItemId: item.id,
      hint: "Add a pathway-sync:<pathwayId> tag (or pathway-sync:… versionKey) to choose one pathway.",
    });
    return;
  }

  if (targets.length === 0) {
    console.log("[NO PATHWAY LESSON MATCH]", { slug: item.slug, contentItemId: item.id, resolution });
    return;
  }

  const nextTitle = item.title.trim() || item.slug;
  const nextSeoTitle = (item.seoTitle && item.seoTitle.trim()) || nextTitle;
  const summaryTrim = (item.summary ?? "").trim();
  const newSections = pathwaySectionsFromContentItemJson(item.content, nextTitle);
  const sectionsJson = newSections as unknown as Prisma.InputJsonValue;

  for (const row of targets) {
    const nextSeoDescription = summaryTrim.length > 0 ? summaryTrim : row.seoDescription;

    const mergedForGate = {
      ...row,
      pathwayId: row.pathwayId,
      title: nextTitle,
      seoTitle: nextSeoTitle,
      seoDescription: nextSeoDescription,
      sections: sectionsJson,
    };
    const structuralPublicComplete = computeStructuralPublicCompleteFromDbRow(mergedForGate);

    await prisma.pathwayLesson.update({
      where: { id: row.id },
      data: {
        title: nextTitle,
        seoTitle: nextSeoTitle,
        seoDescription: nextSeoDescription,
        sections: sectionsJson,
        structuralPublicComplete,
      },
    });

    console.log("[SYNC CONTENT → PATHWAY]", {
      slug: item.slug,
      contentItemId: item.id,
      pathwayLessonId: row.id,
      pathwayId: row.pathwayId,
    });
  }
}
