import { BlogPostStatus } from "@prisma/client";
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
  postStatus: z.nativeEnum(BlogPostStatus).optional(),
  publishAt: z.string().datetime().nullable().optional(),
  action: z.enum(["publish_now", "unpublish"]).optional(),
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
    },
  });

  return NextResponse.json({ post: updated });
}
