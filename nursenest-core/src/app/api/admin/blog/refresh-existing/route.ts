import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { refreshExistingBlogPosts } from "@/lib/blog/blog-refresh-existing-posts";

const requestSchema = z.object({
  limit: z.number().int().min(1).max(5000).optional(),
  dryRun: z.boolean().optional(),
});

/**
 * Non-destructive bulk refresh for existing blog posts:
 * - appends clinical insights + NCLEX tips
 * - refreshes SEO title/description
 * - injects internal links + related posts section
 * - keeps slug/URL unchanged
 */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = requestSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const out = await refreshExistingBlogPosts({
    limit: parsed.data.limit,
    dryRun: parsed.data.dryRun === true,
  });

  return NextResponse.json({
    ok: true,
    ...out,
  });
}
