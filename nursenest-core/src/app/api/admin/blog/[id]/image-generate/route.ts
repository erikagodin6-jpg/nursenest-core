import { BlogImageStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  prompt: z.string().min(10).max(2000).optional(),
});

type Props = { params: Promise<{ id: string }> };

/**
 * Queue optional async image generation/regeneration for a blog post.
 * Non-blocking by design so campaigns do not fail on image provider latency.
 */
export async function POST(req: Request, { params }: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { id: true, title: true, coverImagePrompt: true },
  });
  if (!post) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

  let promptToUse = post.coverImagePrompt ?? `Educational featured image: ${post.title}`;
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (parsed.success && parsed.data.prompt) {
      promptToUse = parsed.data.prompt;
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { coverImagePrompt: promptToUse },
        select: { id: true },
      });
    }
  } catch {
    /* empty body ok */
  }

  await prisma.backgroundJob.create({
    data: {
      type: "blog.image.generate_featured",
      status: JobStatus.PENDING,
      payload: { postId: post.id, prompt: promptToUse },
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
