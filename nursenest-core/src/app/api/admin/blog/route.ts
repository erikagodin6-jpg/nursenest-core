import { BlogPostStatus, BlogPostTemplate } from "@prisma/client";
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
    .filter((p) => !p.title.trim() || !p.excerpt.trim() || !p.seoTitle?.trim() || !p.seoDescription?.trim())
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      titleMissing: !p.title.trim(),
      excerptMissing: !p.excerpt.trim(),
      seoTitleMissing: !p.seoTitle?.trim(),
      seoDescriptionMissing: !p.seoDescription?.trim(),
    }));

  return NextResponse.json({
    posts,
    counts: { draft: draftCount, scheduled: scheduledCount, published: publishedCount },
    nextScheduled,
    warnings,
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
      postStatus: d.postStatus ?? (d.publishAt ? BlogPostStatus.SCHEDULED : BlogPostStatus.DRAFT),
      publishAt: d.publishAt ? new Date(d.publishAt) : null,
    },
    select: { id: true, slug: true, postStatus: true, publishAt: true, updatedAt: true },
  });

  return NextResponse.json({ post }, { status: 201 });
}
