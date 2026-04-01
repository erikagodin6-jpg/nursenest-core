import { BlogFunnelStage, BlogImageStatus, BlogPostIntent, BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  title: z.string().min(3).max(220).optional(),
  excerpt: z.string().min(10).max(500).optional(),
  body: z.string().min(20).optional(),
  exam: z.string().max(80).nullable().optional(),
  category: z.string().max(120).nullable().optional(),
  tags: z.array(z.string().min(1).max(80)).max(20).optional(),
  seoTitle: z.string().max(220).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  targetKeyword: z.string().max(200).nullable().optional(),
  keywordCluster: z.string().max(200).nullable().optional(),
  intent: z.nativeEnum(BlogPostIntent).nullable().optional(),
  funnelStage: z.nativeEnum(BlogFunnelStage).nullable().optional(),
  workflowStatus: z.nativeEnum(BlogWorkflowStatus).optional(),
  coverImage: z.string().url().nullable().optional(),
  coverImageAlt: z.string().max(240).nullable().optional(),
  coverImageCaption: z.string().max(300).nullable().optional(),
  coverImagePrompt: z.string().max(2000).nullable().optional(),
  imageStatus: z.nativeEnum(BlogImageStatus).optional(),
  apaReferences: z.array(z.string().max(600)).max(40).optional(),
  requiresReferences: z.boolean().optional(),
  sourcesJson: z.unknown().optional(),
  reviewDueAt: z.string().datetime().nullable().optional(),
  lastReviewedAt: z.string().datetime().nullable().optional(),
  postStatus: z.nativeEnum(BlogPostStatus).optional(),
  publishAt: z.string().datetime().nullable().optional(),
  action: z.enum(["publish_now", "unpublish", "schedule", "revert_to_draft"]).optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const where = { id };
  const existing = await prisma.blogPost.findUnique({ where, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

  const now = new Date();
  const actionData =
    d.action === "publish_now"
      ? { postStatus: BlogPostStatus.PUBLISHED, publishAt: now }
      : d.action === "unpublish"
        ? { postStatus: BlogPostStatus.DRAFT }
        : d.action === "revert_to_draft"
          ? { postStatus: BlogPostStatus.DRAFT, publishAt: null }
          : d.action === "schedule"
            ? { postStatus: BlogPostStatus.SCHEDULED }
        : {};

  const updated = await prisma.blogPost.update({
    where,
    data: {
      ...actionData,
      ...(d.title !== undefined ? { title: d.title } : {}),
      ...(d.excerpt !== undefined ? { excerpt: d.excerpt } : {}),
      ...(d.body !== undefined ? { body: d.body } : {}),
      ...(d.exam !== undefined ? { exam: d.exam } : {}),
      ...(d.category !== undefined ? { category: d.category } : {}),
      ...(d.tags !== undefined ? { tags: d.tags } : {}),
      ...(d.seoTitle !== undefined ? { seoTitle: d.seoTitle } : {}),
      ...(d.seoDescription !== undefined ? { seoDescription: d.seoDescription } : {}),
      ...(d.targetKeyword !== undefined ? { targetKeyword: d.targetKeyword } : {}),
      ...(d.keywordCluster !== undefined ? { keywordCluster: d.keywordCluster } : {}),
      ...(d.intent !== undefined ? { intent: d.intent } : {}),
      ...(d.funnelStage !== undefined ? { funnelStage: d.funnelStage } : {}),
      ...(d.workflowStatus !== undefined ? { workflowStatus: d.workflowStatus } : {}),
      ...(d.coverImage !== undefined ? { coverImage: d.coverImage } : {}),
      ...(d.coverImageAlt !== undefined ? { coverImageAlt: d.coverImageAlt } : {}),
      ...(d.coverImageCaption !== undefined ? { coverImageCaption: d.coverImageCaption } : {}),
      ...(d.coverImagePrompt !== undefined ? { coverImagePrompt: d.coverImagePrompt } : {}),
      ...(d.imageStatus !== undefined ? { imageStatus: d.imageStatus } : {}),
      ...(d.apaReferences !== undefined ? { apaReferences: d.apaReferences } : {}),
      ...(d.requiresReferences !== undefined ? { requiresReferences: d.requiresReferences } : {}),
      ...(d.sourcesJson !== undefined ? { sourcesJson: d.sourcesJson } : {}),
      ...(d.reviewDueAt !== undefined ? { reviewDueAt: d.reviewDueAt ? new Date(d.reviewDueAt) : null } : {}),
      ...(d.lastReviewedAt !== undefined ? { lastReviewedAt: d.lastReviewedAt ? new Date(d.lastReviewedAt) : null } : {}),
      ...(d.postStatus !== undefined ? { postStatus: d.postStatus } : {}),
      ...(d.publishAt !== undefined ? { publishAt: d.publishAt ? new Date(d.publishAt) : null } : {}),
    },
    select: {
      id: true,
      slug: true,
      postStatus: true,
      publishAt: true,
      updatedAt: true,
      title: true,
      excerpt: true,
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
      requiresReferences: true,
      apaReferences: true,
    },
  });

  return NextResponse.json({ post: updated });
}
