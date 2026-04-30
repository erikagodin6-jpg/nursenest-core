import { NextResponse } from "next/server";
import { ContentStatus, type Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { revalidateSurfacesAfterPathwayLessonMutation } from "@/lib/admin/revalidate-pathway-lesson-surfaces";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { governContentItemLessonPublish } from "@/lib/content/editorial-publish-policy";
import { validateLessonForPublish } from "@/lib/content/publish-validation";
import { computeStructuralPublicCompleteFromDbRow } from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  pathwaySectionsFromPlainBody,
  plainBodyFromPathwaySectionsJson,
} from "@/lib/lessons/pathway-lesson-plain-body-sections";
import { contentItemLessonTaxonomyFromCorpus } from "@/lib/taxonomy/content-write-taxonomy";

export const dynamic = "force-dynamic";

const patchSchema = z
  .object({
    title: z.string().min(4).optional(),
    slug: z.string().min(4).optional(),
    seoTitle: z.string().min(4).optional(),
    seoDescription: z.string().optional(),
    body: z.string().optional(),
    status: z.nativeEnum(ContentStatus).optional(),
    topic: z.string().min(1).optional(),
    topicSlug: z.string().min(1).optional(),
    bodySystem: z.string().min(1).optional(),
    previewSectionCount: z.number().int().min(0).max(20).optional(),
    categoryId: z.string().optional(),
    acknowledgeBelowQualityBar: z.boolean().optional(),
  })
  .strict();

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const row = await prisma.pathwayLesson.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = plainBodyFromPathwaySectionsJson(row.sections);
  return NextResponse.json({
    lesson: row,
    body,
  });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const existing = await prisma.pathwayLesson.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const d = parsed.data;
  console.log("[ADMIN PATHWAY LESSON SAVE]", { pathwayLessonId: id, pathwayId: existing.pathwayId, fields: Object.keys(d) });

  const mergedTitle = d.title ?? existing.title;
  const mergedSlug = d.slug ?? existing.slug;
  const mergedSeoTitle = d.seoTitle ?? existing.seoTitle;
  const mergedSeoDescription = d.seoDescription ?? existing.seoDescription;
  const mergedBody =
    d.body !== undefined ? d.body : plainBodyFromPathwaySectionsJson(existing.sections);
  const nextStatus = d.status ?? existing.status;

  let topic = d.topic ?? existing.topic;
  let topicSlug = d.topicSlug ?? existing.topicSlug;
  let bodySystem = d.bodySystem ?? existing.bodySystem;
  if (d.categoryId) {
    const cat = await prisma.category.findUnique({ where: { id: d.categoryId } });
    const label = cat?.name?.trim() || cat?.slug?.trim();
    if (label) {
      topic = label;
      topicSlug = (cat?.slug?.trim() || label.toLowerCase().replace(/\s+/g, "-")).slice(0, 200);
    }
  }

  const taxonomy = contentItemLessonTaxonomyFromCorpus({
    title: mergedTitle,
    summary: mergedSeoDescription,
    body: mergedBody,
    tags: [],
    categoryHint: topic,
    systemHint: bodySystem,
  });
  if (taxonomy.violations.length > 0) {
    return NextResponse.json(
      { error: "Taxonomy classification invalid", violations: taxonomy.violations, code: "taxonomy_invalid" },
      { status: 422 },
    );
  }
  bodySystem = taxonomy.bodySystem ?? bodySystem;

  if (nextStatus === ContentStatus.PUBLISHED && !taxonomy.publishable) {
    return NextResponse.json(
      {
        error: "Publish blocked — taxonomy needs a resolved category for this lesson",
        code: "taxonomy_publish_blocked",
        classification: {
          domain: taxonomy.classification.domain,
          category: taxonomy.classification.category,
        },
      },
      { status: 422 },
    );
  }

  let lessonGov: ReturnType<typeof governContentItemLessonPublish> | null = null;
  if (d.status === ContentStatus.PUBLISHED) {
    const v = validateLessonForPublish({
      title: mergedTitle,
      summary: mergedSeoDescription,
      body: mergedBody,
    });
    if (!v.ok) {
      return NextResponse.json({ error: "Publish validation failed", reasons: v.reasons }, { status: 422 });
    }
    lessonGov = governContentItemLessonPublish(
      { title: mergedTitle, summary: mergedSeoDescription, body: mergedBody },
      { acknowledgeBelowQualityBar: d.acknowledgeBelowQualityBar === true },
    );
    if (!lessonGov.ok) {
      return NextResponse.json(
        { error: "Publish blocked by editorial policy", reasons: lessonGov.reasons, quality: lessonGov },
        { status: 422 },
      );
    }
    if (!taxonomy.publishable) {
      return NextResponse.json(
        {
          error: "Publish blocked — taxonomy needs a resolved category for this lesson",
          code: "taxonomy_publish_blocked",
          classification: {
            domain: taxonomy.classification.domain,
            category: taxonomy.classification.category,
          },
        },
        { status: 422 },
      );
    }
  }

  const previousSlug = existing.slug;
  const sectionsJson: Prisma.InputJsonValue =
    d.body !== undefined
      ? (pathwaySectionsFromPlainBody(mergedBody, mergedTitle) as unknown as Prisma.InputJsonValue)
      : (existing.sections as Prisma.InputJsonValue);

  let nextPublishedAt: Date | null = existing.published_at;
  if (nextStatus === ContentStatus.PUBLISHED) {
    nextPublishedAt = new Date();
  } else if (nextStatus === ContentStatus.DRAFT || nextStatus === ContentStatus.IN_REVIEW) {
    nextPublishedAt = null;
  }

  const mergedRow = {
    ...existing,
    title: mergedTitle,
    slug: mergedSlug,
    seoTitle: mergedSeoTitle,
    seoDescription: mergedSeoDescription,
    topic,
    topicSlug,
    bodySystem,
    previewSectionCount: d.previewSectionCount ?? existing.previewSectionCount,
    sections: sectionsJson,
    status: nextStatus,
  };

  const structuralPublicComplete = computeStructuralPublicCompleteFromDbRow({
    ...mergedRow,
    pathwayId: existing.pathwayId,
  });

  let updated;
  try {
    updated = await prisma.pathwayLesson.update({
      where: { id },
      data: {
        title: mergedTitle,
        slug: mergedSlug,
        seoTitle: mergedSeoTitle,
        seoDescription: mergedSeoDescription,
        topic,
        topicSlug,
        bodySystem,
        previewSectionCount: mergedRow.previewSectionCount,
        sections: sectionsJson as Prisma.InputJsonValue,
        status: nextStatus,
        structuralPublicComplete,
        published_at: nextPublishedAt,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Unique constraint") || msg.includes("unique constraint")) {
      return NextResponse.json({ error: "Slug already in use for this pathway", slug: mergedSlug }, { status: 409 });
    }
    throw e;
  }

  const indexingImpact =
    nextStatus === ContentStatus.PUBLISHED &&
    (d.status === ContentStatus.PUBLISHED ||
      d.slug !== undefined ||
      d.title !== undefined ||
      d.seoTitle !== undefined ||
      d.body !== undefined);

  safeServerLog("admin_pathway_lesson_publish", "saved_to_db", {
    pathwayLessonId: updated.id,
    pathwayId: updated.pathwayId,
    slug: updated.slug,
    title: updated.title.slice(0, 160),
    status: String(updated.status),
  });

  if (nextStatus === ContentStatus.PUBLISHED) {
    safeServerLog("admin_pathway_lesson_publish", "published_flag_set", {
      pathwayLessonId: updated.id,
      pathwayId: updated.pathwayId,
      slug: updated.slug,
      published_at: updated.published_at?.toISOString() ?? "",
    });
  }

  revalidateSurfacesAfterPathwayLessonMutation({
    pathwayLessonId: updated.id,
    pathwayId: updated.pathwayId,
    slug: updated.slug,
    previousSlug: d.slug !== undefined && d.slug !== previousSlug ? previousSlug : null,
    indexingImpact,
  });

  safeServerLog("admin_pathway_lesson_publish", "route_rerender_requested", {
    pathwayLessonId: updated.id,
    pathwayId: updated.pathwayId,
    slug: updated.slug,
    indexingImpact: indexingImpact ? 1 : 0,
  });

  return NextResponse.json({
    lesson: updated,
    ...(lessonGov && lessonGov.warnings.length ? { publishWarnings: lessonGov.warnings, quality: lessonGov } : {}),
  });
}
