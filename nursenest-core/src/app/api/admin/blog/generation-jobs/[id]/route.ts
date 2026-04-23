import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadBlogGenerationJobForAdmin } from "@/lib/blog/blog-generation-jobs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const job = await loadBlogGenerationJobForAdmin(id);
  if (!job) {
    return NextResponse.json(
      { ok: false, error: "Not found", code: "NOT_FOUND", message: "No generation job exists for this id." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, job });
}
