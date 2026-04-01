import { BlogFunnelStage, BlogImageStatus, BlogPostIntent, BlogPostStatus, BlogPostTemplate, BlogWorkflowStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  slug: z.string().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(3).max(220),
  excerpt: z.string().min(10).max(500),
  body: z.string().min(20),
  exam: z.string().max(80).optional().nullable(),
  category: z.string().max(120).optional().nullable(),
  tags: z.array(z.string().min(1).max(80)).max(20).optional(),
  seoTitle: z.string().max(220).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  postTemplate: z.nativeEnum(BlogPostTemplate).optional().nullable(),
  intent: z.nativeEnum(BlogPostIntent).optional().nullable(),
  funnelStage: z.nativeEnum(BlogFunnelStage).optional().nullable(),
  workflowStatus: z.nativeEnum(BlogWorkflowStatus).optional(),
  targetKeyword: z.string().max(200).optional().nullable(),
  keywordCluster: z.string().max(200).optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  coverImageAlt: z.string().max(240).optional().nullable(),
  coverImageCaption: z.string().max(300).optional().nullable(),
  imageStatus: z.nativeEnum(BlogImageStatus).optional(),
  apaReferences: z.array(z.string().max(600)).max(40).optional(),
  requiresReferences: z.boolean().optional(),
  postStatus: z.nativeEnum(BlogPostStatus).optional(),
  publishAt: z.string().datetime().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const take = Math.min(200, Math.max(10, Number(sp.get("take") ?? "80")));
  const where =
    status && Object.values(BlogPostStatus).includes(status as BlogPostStatus)
      ? { postStatus: status as BlogPostStatus }
      : {};

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: [{ publishAt: "asc" }, { updatedAt: "desc" }],
    take,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      exam: true,
      category: true,
      tags: true,
      seoTitle: true,
      seoDescription: true,
      targetKeyword: true,
      keywordCluster: true,
      intent: true,
      funnelStage: true,
      workflowStatus: true,
      coverImage: true,
      coverImageAlt: true,
      imageStatus: true,
      apaReferences: true,
      requiresReferences: true,
      postStatus: true,
      publishAt: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  const [draftCount, scheduledCount, publishedCount, nextScheduled] = await Promise.all([
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.DRAFT } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.SCHEDULED } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.PUBLISHED } }),
    prisma.blogPost.findFirst({
      where: { postStatus: BlogPostStatus.SCHEDULED, publishAt: { not: null } },
      orderBy: { publishAt: "asc" },
      select: { id: true, slug: true, publishAt: true, title: true },
    }),
  ]);

  const warnings = posts
    .filter((p) => !p.title.trim() || !p.excerpt.trim() || !p.seoTitle?.trim() || !p.seoDescription?.trim() || (p.requiresReferences && p.apaReferences.length === 0))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      titleMissing: !p.title.trim(),
      excerptMissing: !p.excerpt.trim(),
      seoTitleMissing: !p.seoTitle?.trim(),
      seoDescriptionMissing: !p.seoDescription?.trim(),
      referencesMissing: p.requiresReferences && p.apaReferences.length === 0,
      altTextMissing: Boolean(p.coverImage) && !p.coverImageAlt?.trim(),
    }));

  const keywordCounts = posts.reduce<Record<string, number>>((acc, p) => {
    const k = p.targetKeyword?.trim().toLowerCase();
    if (!k) return acc;
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const cannibalization = Object.entries(keywordCounts)
    .filter(([, count]) => count > 1)
    .map(([keyword, count]) => ({ keyword, count }));

  return NextResponse.json({
    posts,
    counts: { draft: draftCount, scheduled: scheduledCount, published: publishedCount },
    nextScheduled,
    warnings,
    cannibalization,
  });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const post = await prisma.blogPost.create({
    data: {
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt,
      body: d.body,
      exam: d.exam ?? null,
      category: d.category ?? null,
      tags: d.tags ?? [],
      seoTitle: d.seoTitle ?? null,
      seoDescription: d.seoDescription ?? null,
      postTemplate: d.postTemplate ?? null,
      intent: d.intent ?? null,
      funnelStage: d.funnelStage ?? null,
      workflowStatus: d.workflowStatus ?? BlogWorkflowStatus.GENERATED,
      targetKeyword: d.targetKeyword ?? null,
      keywordCluster: d.keywordCluster ?? null,
      coverImage: d.coverImage ?? null,
      coverImageAlt: d.coverImageAlt ?? null,
      coverImageCaption: d.coverImageCaption ?? null,
      imageStatus: d.imageStatus ?? BlogImageStatus.NONE,
      apaReferences: d.apaReferences ?? [],
      requiresReferences: d.requiresReferences ?? false,
      postStatus: d.postStatus ?? (d.publishAt ? BlogPostStatus.SCHEDULED : BlogPostStatus.DRAFT),
      publishAt: d.publishAt ? new Date(d.publishAt) : null,
    },
    select: { id: true, slug: true, postStatus: true, publishAt: true, updatedAt: true },
  });

  return NextResponse.json({ post }, { status: 201 });
}
