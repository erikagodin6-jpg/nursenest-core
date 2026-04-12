import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { getAdminLocalizedBlogList } from "@/lib/blog/safe-localized-blog-queries";

// @ts-expect-error — available after prisma generate + migration
const localizedModel = () => prisma.localizedBlogArticle as Record<string, (...args: unknown[]) => Promise<unknown>>;

const createSchema = z.object({
  canonicalArticleId: z.string().min(1),
  locale: z.string().min(2).max(10),
  region: z.string().min(2).max(32),
  profession: z.string().max(32).nullable().optional(),
  exam: z.string().max(48).nullable().optional(),
  sourceLanguage: z.string().max(10).default("en"),
  adaptationType: z.enum(["ORIGINAL", "TRANSLATED", "ADAPTED", "LOCALIZED_REWRITE", "MARKET_EXPANSION"]).default("ADAPTED"),
  localizedTitle: z.string().min(3).max(220),
  localizedExcerpt: z.string().min(10).max(500),
  localizedBody: z.string().min(20),
  canonicalSlug: z.string().min(3).max(200),
  localizedSlug: z.string().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  localizedMetaTitle: z.string().max(220).nullable().optional(),
  localizedMetaDescription: z.string().max(500).nullable().optional(),
  seoKeywordPrimary: z.string().max(200).nullable().optional(),
  seoKeywordSecondary: z.array(z.string().max(200)).max(10).optional(),
  searchIntent: z.string().max(48).nullable().optional(),
  targetAudience: z.string().max(64).nullable().optional(),
  ctaVariant: z.string().max(48).nullable().optional(),
  ctaText: z.string().max(500).nullable().optional(),
  ctaHref: z.string().max(500).nullable().optional(),
  internalLinkTargets: z.unknown().optional(),
  complianceReviewRequired: z.boolean().optional(),
  medicalReviewRequired: z.boolean().optional(),
  editorialReviewRequired: z.boolean().optional(),
  reviewFlags: z.array(z.string().max(500)).max(50).optional(),
  editorialNotes: z.string().max(5000).nullable().optional(),
  aiModelVersion: z.string().max(64).nullable().optional(),
  aiPromptVersion: z.string().max(32).nullable().optional(),
  contentStatus: z.enum(["DRAFT", "AI_GENERATED", "AI_ADAPTED", "PENDING_REVIEW"]).default("DRAFT"),
});

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const canonicalArticleId = url.searchParams.get("canonicalArticleId") ?? undefined;
  const region = url.searchParams.get("region") ?? undefined;
  const locale = url.searchParams.get("locale") ?? undefined;
  const contentStatus = url.searchParams.get("contentStatus") ?? undefined;
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "50", 10);

  const result = await getAdminLocalizedBlogList({
    canonicalArticleId,
    region,
    locale,
    contentStatus,
    page,
    pageSize,
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const d = parsed.data;

  const canonical = await prisma.blogPost.findUnique({
    where: { id: d.canonicalArticleId },
    select: { id: true },
  });
  if (!canonical) {
    return NextResponse.json({ error: "Canonical article not found" }, { status: 404 });
  }

  const existing = await localizedModel().findUnique({
    where: {
      canonicalArticleId_locale_region: {
        canonicalArticleId: d.canonicalArticleId,
        locale: d.locale,
        region: d.region,
      },
    },
    select: { id: true },
  }) as { id: string } | null;
  if (existing) {
    return NextResponse.json(
      { error: "A localized variant already exists for this canonical article + locale + region combination", existingId: existing.id },
      { status: 409 },
    );
  }

  const article = await localizedModel().create({
    data: {
      canonicalArticleId: d.canonicalArticleId,
      locale: d.locale,
      region: d.region,
      profession: d.profession ?? null,
      exam: d.exam ?? null,
      sourceLanguage: d.sourceLanguage,
      adaptationType: d.adaptationType,
      contentStatus: d.contentStatus,
      localizedTitle: d.localizedTitle,
      localizedExcerpt: d.localizedExcerpt,
      localizedBody: d.localizedBody,
      canonicalSlug: d.canonicalSlug,
      localizedSlug: d.localizedSlug,
      localizedMetaTitle: d.localizedMetaTitle ?? null,
      localizedMetaDescription: d.localizedMetaDescription ?? null,
      seoKeywordPrimary: d.seoKeywordPrimary ?? null,
      seoKeywordSecondary: d.seoKeywordSecondary ?? [],
      searchIntent: d.searchIntent ?? null,
      targetAudience: d.targetAudience ?? null,
      ctaVariant: d.ctaVariant ?? null,
      ctaText: d.ctaText ?? null,
      ctaHref: d.ctaHref ?? null,
      internalLinkTargets: d.internalLinkTargets ?? undefined,
      complianceReviewRequired: d.complianceReviewRequired ?? false,
      medicalReviewRequired: d.medicalReviewRequired ?? false,
      editorialReviewRequired: d.editorialReviewRequired ?? true,
      reviewFlags: d.reviewFlags ?? [],
      editorialNotes: d.editorialNotes ?? null,
      aiModelVersion: d.aiModelVersion ?? null,
      aiPromptVersion: d.aiPromptVersion ?? null,
      generationLog: [{ timestamp: new Date().toISOString(), action: "generate", detail: "Created via admin API" }],
    },
  });

  return NextResponse.json({ article }, { status: 201 });
}
