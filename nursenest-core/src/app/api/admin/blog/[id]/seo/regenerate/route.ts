import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { parseInternalLinkPlanJson } from "@/lib/blog/blog-image-workflow";
import { regenerateBlogPostSeoById } from "@/lib/blog/blog-post-seo-regenerate-by-id";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  /** When true, refresh `seoTitle` / `seoDescription` columns from deterministic SEO (not only the JSON bundle). */
  overwrite: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const overwrite = parsed.data.overwrite === true;

  const regen = await regenerateBlogPostSeoById(id, { overwriteColumns: overwrite });
  if (!regen.ok) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

  const updated = await prisma.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      seoTitle: true,
      seoDescription: true,
      internalLinkPlan: true,
      schemaSummary: true,
      excerpt: true,
      tags: true,
      category: true,
      coverImage: true,
    },
  });

  const seoBundle = updated ? parseInternalLinkPlanJson(updated.internalLinkPlan).seo : null;

  return NextResponse.json({ ok: true, post: updated, seoBundle });
}
