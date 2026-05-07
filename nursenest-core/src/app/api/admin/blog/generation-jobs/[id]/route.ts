import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadBlogGenerationJobForAdmin } from "@/lib/blog/blog-generation-jobs";

export const dynamic = "force-dynamic";
/** Avoid platform default (often 10–60s) cutting off large job payloads before client reads body. */
export const maxDuration = 120;

type RouteContext = { params: Promise<{ id: string }> };

const LITE_POLL_DEFAULT_CAP = 48;
const LITE_POLL_MAX_CAP = 120;

export async function GET(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const lite = searchParams.get("lite") === "1" || searchParams.get("summary") === "1";
  const rawMax = searchParams.get("maxItems");
  const parsedMax = rawMax != null ? Number(rawMax) : NaN;
  const maxItems =
    lite
      ? Math.min(
          LITE_POLL_MAX_CAP,
          Math.max(8, Number.isFinite(parsedMax) && parsedMax > 0 ? Math.floor(parsedMax) : LITE_POLL_DEFAULT_CAP),
        )
      : Number.isFinite(parsedMax) && parsedMax > 0
        ? Math.min(500, Math.floor(parsedMax))
        : null;

  const job = await loadBlogGenerationJobForAdmin(id, maxItems != null ? { maxItems } : undefined);
  if (!job) {
    return NextResponse.json(
      { ok: false, error: "Not found", code: "NOT_FOUND", message: "No generation job exists for this id." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, job });
}
