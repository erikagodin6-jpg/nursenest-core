import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: RouteContext) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const batch = await prisma.blogDraftGenerationBatch.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { ordinal: "asc" },
        select: {
          id: true,
          ordinal: true,
          topicRaw: true,
          canonicalTopicKey: true,
          status: true,
          blogPostId: true,
          error: true,
          blogPost: { select: { id: true, slug: true, title: true } },
        },
      },
    },
  });

  if (!batch) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, batch });
}
