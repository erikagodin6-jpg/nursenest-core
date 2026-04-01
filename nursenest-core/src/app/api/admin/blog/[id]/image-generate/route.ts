import { BlogImageStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

/**
 * Queue optional async image generation/regeneration for a blog post.
 * Non-blocking by design so campaigns do not fail on image provider latency.
 */
export async function POST(_req: Request, { params }: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { id: true, title: true, coverImagePrompt: true },
  });
  if (!post) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  await prisma.backgroundJob.create({
    data: {
      type: "blog.image.generate_featured",
      status: JobStatus.PENDING,
      payload: { postId: post.id, prompt: post.coverImagePrompt ?? `Educational featured image: ${post.title}` },
      maxAttempts: 3,
    },
  });
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { imageStatus: BlogImageStatus.REQUESTED },
    select: { id: true },
  });
  return NextResponse.json({ ok: true, queued: true });
}
