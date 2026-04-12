import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { buildExpansionQueue } from "@/lib/blog/generate-localized-blog";
import { GLOBAL_LOCALE_CODES, GLOBAL_REGION_SLUGS } from "@/lib/i18n/global-regions";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";

const queueSchema = z.object({
  canonicalArticleId: z.string().min(1),
  mode: z.enum(["canonical_only", "canonical_plus_selected", "bulk_market_expansion", "refresh_existing"]),
  targetRegions: z
    .array(z.string().refine((v): v is GlobalRegionSlug => (GLOBAL_REGION_SLUGS as readonly string[]).includes(v)))
    .optional(),
  targetLocales: z
    .array(z.string().refine((v): v is GlobalLocaleCode => (GLOBAL_LOCALE_CODES as readonly string[]).includes(v)))
    .optional(),
  profession: z.string().max(32).nullable().optional(),
});

/**
 * POST /api/admin/blog/localized/queue
 *
 * Builds a prioritized generation queue for bulk market expansion.
 * Returns the queue items sorted by market priority (underserved first).
 *
 * The caller (admin UI or background job) iterates the queue and calls
 * /api/admin/blog/localized/generate for each item.
 */
export async function POST(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const body = await req.json();
  const parsed = queueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const d = parsed.data;

  const canonical = await prisma.blogPost.findUnique({
    where: { id: d.canonicalArticleId },
    select: { id: true, title: true, slug: true, exam: true },
  });

  if (!canonical) {
    return NextResponse.json({ error: "Canonical article not found" }, { status: 404 });
  }

  const queue = buildExpansionQueue({
    canonicalArticleId: d.canonicalArticleId,
    canonicalExam: canonical.exam,
    mode: d.mode,
    targetRegions: d.targetRegions as GlobalRegionSlug[] | undefined,
    targetLocales: d.targetLocales as GlobalLocaleCode[] | undefined,
    profession: d.profession ?? null,
  });

  // Check which variants already exist
  const existingVariants = await prisma.localizedBlogArticle.findMany({
    where: { canonicalArticleId: d.canonicalArticleId },
    select: { locale: true, region: true, contentStatus: true },
  });

  const existingMap = new Map<string, string>(
    existingVariants.map((v: { locale: string; region: string; contentStatus: string }) => [`${v.locale}:${v.region}`, v.contentStatus]),
  );

  const enrichedQueue = queue.map((item) => ({
    ...item,
    existingStatus: existingMap.get(`${item.targetLocale}:${item.targetRegion}`) ?? null,
    alreadyExists: existingMap.has(`${item.targetLocale}:${item.targetRegion}`),
  }));

  return NextResponse.json({
    canonicalArticle: {
      id: canonical.id,
      title: canonical.title,
      slug: canonical.slug,
      exam: canonical.exam,
    },
    mode: d.mode,
    totalItems: enrichedQueue.length,
    newItems: enrichedQueue.filter((q) => !q.alreadyExists).length,
    existingItems: enrichedQueue.filter((q) => q.alreadyExists).length,
    queue: enrichedQueue,
  });
}
