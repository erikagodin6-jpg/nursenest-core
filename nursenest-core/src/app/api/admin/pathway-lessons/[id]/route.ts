/**
 * Admin PathwayLesson read/write. PathwayLesson is the authoring source of truth for pathway lessons
 * (Option B). ContentItem → PathwayLesson sync exists only as a temporary legacy compatibility bridge.
 */
import { NextResponse } from "next/server";
import { ContentStatus, type Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminPathwayLessonRow } from "@/lib/admin/load-admin-pathway-lesson-row.server";
import { revalidateSurfacesAfterPathwayLessonMutation } from "@/lib/admin/revalidate-pathway-lesson-surfaces";
import { invalidatePathwayLessonPaidStaleCache } from "@/lib/lessons/invalidate-pathway-lesson-paid-stale-cache";
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
    /** BCP 47-style tag; required to be non-empty when publishing (validated against merged row). */
    locale: z.string().min(2).max(20).optional(),
  })
  .strict();

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const qPathwayId = url.searchParams.get("pathwayId")?.trim() ?? "";
  const qSlug = url.searchParams.get("slug")?.trim() ?? "";
  const qLocale = (url.searchParams.get("locale")?.trim() || "en").slice(0, 20);

  const row =
    qPathwayId && qSlug
      ? await loadAdminPathwayLessonRow({ slugLookup: { pathwayId: qPathwayId, slug: qSlug, locale: qLocale } })
      : await loadAdminPathwayLessonRow({ pathwayLessonId: id });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = plainBodyFromPathwaySectionsJson(row.sections);
  return NextResponse.json({
    lesson: row,
    body,
  });
}

/** Publish: same validation as PATCH with `status: PUBLISHED` — PathwayLesson-only (never ContentItem sync). */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  const nextReq = new Request(req.url, {
    method: "PATCH",
    headers: req.headers,
    body: JSON.stringify({ ...body, status: ContentStatus.PUBLISHED }),
  });
  return PATCH(nextReq, ctx);
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
  console.info("[ADMIN_PUBLISH_API]", {
    pathwayLessonId: id,
    pathwayId: existing.pathwayId,
    patchKeys: Object.keys(d),
    nextStatus: d.status ?? existing.status,
  });

  const mergedTitle = d.title ?? existing.title;
  const mergedSlug = d.slug ?? existing.slug;
  const mergedSeoTitle = d.seoTitle ?? existing.seoTitle;
  const mergedSeoDescription = d.seoDescription ?? existing.seoDescription;
  const mergedLocale = (d.locale !== undefined ? d.locale : existing.locale).trim();
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

  if (nextStatus === ContentStatus.PUBLISHED && mergedLocale.length < 2) {
    return NextResponse.json(
      { error: "Publish blocked — locale must be a non-empty BCP 47-style tag", code: "locale_invalid" },
      { status: 422 },
    );
  }

  if (nextStatus === ContentStatus.PUBLISHED) {
    if (!existing.pathwayId.trim()) {
      return NextResponse.json(
        { error: "Publish blocked — pathwayId is required on the lesson row", code: "pathway_id_required" },
        { status: 422 },
      );
    }
    if (!mergedTitle.trim() || !mergedSlug.trim()) {
      return NextResponse.json(
        { error: "Publish blocked — title and slug are required", code: "title_slug_required" },
        { status: 422 },
      );
    }
    if (mergedBody.trim().length < 20) {
      return NextResponse.json(
        { error: "Publish blocked — lesson body derived from sections is too short", code: "sections_body_too_short" },
        { status: 422 },
      );
    }
  }

  let lessonGov: ReturnType<typeof governContentItemLessonPublish> | null = null;
  if (nextStatus === ContentStatus.PUBLISHED) {
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
    if (existing.status !== ContentStatus.PUBLISHED) {
      nextPublishedAt = new Date();
    }
  } else if (nextStatus === ContentStatus.DRAFT || nextStatus === ContentStatus.IN_REVIEW) {
    nextPublishedAt = null;
  }

  const mergedRow = {
    ...existing,
    title: mergedTitle,
    slug: mergedSlug,
    seoTitle: mergedSeoTitle,
    seoDescription: mergedSeoDescription,
    locale: mergedLocale,
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

  const transitioningIntoPublished =
    nextStatus === ContentStatus.PUBLISHED && existing.status !== ContentStatus.PUBLISHED;
  if (transitioningIntoPublished && !structuralPublicComplete) {
    return NextResponse.json(
      {
        error: "Publish blocked — lesson structure does not meet public completeness requirements",
        code: "structural_public_incomplete",
      },
      { status: 422 },
    );
  }

  let updated;
  try {
    updated = await prisma.pathwayLesson.update({
      where: { id },
      data: {
        title: mergedTitle,
        slug: mergedSlug,
        seoTitle: mergedSeoTitle,
        seoDescription: mergedSeoDescription,
        locale: mergedLocale,
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

  console.info("[ADMIN_PUBLISH_SAVED]", {
    pathwayLessonId: updated.id,
    pathwayId: updated.pathwayId,
    slug: updated.slug,
    status: String(updated.status),
    publishedAt: updated.published_at?.toISOString() ?? null,
    structuralPublicComplete,
  });

  invalidatePathwayLessonPaidStaleCache(updated.id);

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
