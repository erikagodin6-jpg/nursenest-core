import {
  BlogFunnelStage,
  BlogImageStatus,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  Prisma,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { stripBrokenOrEmptyImagesFromHtml } from "@/lib/blog/blog-image-workflow";
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
  postTemplate: z.nativeEnum(BlogPostTemplate).nullable().optional(),
  titleAlternates: z.array(z.string().max(220)).max(8).optional(),
  keyTakeaways: z.array(z.string().max(500)).max(16).optional(),
  relatedLessonPaths: z.array(z.string().max(500)).max(40).optional(),
  featuredSnippet: z.string().max(4000).nullable().optional(),
  metaTitleVariant: z.string().max(220).nullable().optional(),
  metaDescriptionVariant: z.string().max(500).nullable().optional(),
  schemaSummary: z.string().max(8000).nullable().optional(),
  outlineJson: z.unknown().optional(),
  faqBlock: z.unknown().optional(),
  internalLinkPlan: z.unknown().optional(),
  keyQuestions: z.array(z.string().max(400)).max(20).optional(),
});

const adminBlogPostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  body: true,
  exam: true,
  postStatus: true,
  publishAt: true,
  seoTitle: true,
  seoDescription: true,
  targetKeyword: true,
  keywordCluster: true,
  countryTarget: true,
  intent: true,
  funnelStage: true,
  postTemplate: true,
  workflowStatus: true,
  outlineJson: true,
  faqBlock: true,
  internalLinkPlan: true,
  titleAlternates: true,
  keyTakeaways: true,
  relatedLessonPaths: true,
  schemaSummary: true,
  metaTitleVariant: true,
  metaDescriptionVariant: true,
  featuredSnippet: true,
  apaReferences: true,
  tags: true,
  keyQuestions: true,
  updatedAt: true,
  coverImage: true,
  coverImageAlt: true,
  coverImageCaption: true,
  coverImagePrompt: true,
  imageStatus: true,
  requiresReferences: true,
  sourcesJson: true,
  medicalRiskFlags: true,
  sourceReliabilityScore: true,
  category: true,
} as const;

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id }, select: adminBlogPostSelect });
  if (!post) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  return NextResponse.json({ post });
}

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

  let bodyForUpdate: string | undefined;
  if (d.action === "publish_now") {
    const prevBody =
      d.body ??
      (await prisma.blogPost.findUnique({ where, select: { body: true } }))?.body ??
      "";
    bodyForUpdate = stripBrokenOrEmptyImagesFromHtml(prevBody);
  } else if (d.body !== undefined) {
    bodyForUpdate = d.body;
  }

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
      ...(bodyForUpdate !== undefined ? { body: bodyForUpdate } : {}),
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
      ...(d.sourcesJson !== undefined
        ? { sourcesJson: d.sourcesJson === null ? Prisma.JsonNull : (d.sourcesJson as Prisma.InputJsonValue) }
        : {}),
      ...(d.reviewDueAt !== undefined ? { reviewDueAt: d.reviewDueAt ? new Date(d.reviewDueAt) : null } : {}),
      ...(d.lastReviewedAt !== undefined ? { lastReviewedAt: d.lastReviewedAt ? new Date(d.lastReviewedAt) : null } : {}),
      ...(d.postStatus !== undefined ? { postStatus: d.postStatus } : {}),
      ...(d.publishAt !== undefined ? { publishAt: d.publishAt ? new Date(d.publishAt) : null } : {}),
      ...(d.postTemplate !== undefined ? { postTemplate: d.postTemplate } : {}),
      ...(d.titleAlternates !== undefined ? { titleAlternates: d.titleAlternates } : {}),
      ...(d.keyTakeaways !== undefined ? { keyTakeaways: d.keyTakeaways } : {}),
      ...(d.relatedLessonPaths !== undefined ? { relatedLessonPaths: d.relatedLessonPaths } : {}),
      ...(d.featuredSnippet !== undefined ? { featuredSnippet: d.featuredSnippet } : {}),
      ...(d.metaTitleVariant !== undefined ? { metaTitleVariant: d.metaTitleVariant } : {}),
      ...(d.metaDescriptionVariant !== undefined ? { metaDescriptionVariant: d.metaDescriptionVariant } : {}),
      ...(d.schemaSummary !== undefined ? { schemaSummary: d.schemaSummary } : {}),
      ...(d.keyQuestions !== undefined ? { keyQuestions: d.keyQuestions } : {}),
      ...(d.outlineJson !== undefined
        ? { outlineJson: d.outlineJson === null ? Prisma.JsonNull : (d.outlineJson as Prisma.InputJsonValue) }
        : {}),
      ...(d.faqBlock !== undefined
        ? { faqBlock: d.faqBlock === null ? Prisma.JsonNull : (d.faqBlock as Prisma.InputJsonValue) }
        : {}),
      ...(d.internalLinkPlan !== undefined
        ? {
            internalLinkPlan:
              d.internalLinkPlan === null ? Prisma.JsonNull : (d.internalLinkPlan as Prisma.InputJsonValue),
          }
        : {}),
    },
    select: adminBlogPostSelect,
  });

  return NextResponse.json({ post: updated });
}
