import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminPathwayLessonRow } from "@/lib/admin/load-admin-pathway-lesson-row.server";
import { plainBodyFromPathwaySectionsJson } from "@/lib/lessons/pathway-lesson-plain-body-sections";

export const dynamic = "force-dynamic";

/**
 * @deprecated Prefer `GET /api/admin/pathway-lessons/[id]?pathwayId=&slug=` (same payload).
 * ContentItem → PathwayLesson sync is **compatibility only** (legacy migration).
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const pathwayId = url.searchParams.get("pathwayId")?.trim() ?? "";
  const slug = url.searchParams.get("slug")?.trim() ?? "";
  const locale = (url.searchParams.get("locale")?.trim() || "en").slice(0, 20);

  if (!pathwayId || !slug) {
    return NextResponse.json({ error: "pathwayId and slug query parameters are required" }, { status: 400 });
  }

  const row = await loadAdminPathwayLessonRow({ slugLookup: { pathwayId, slug, locale } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = plainBodyFromPathwaySectionsJson(row.sections);
  return NextResponse.json({ lesson: row, body });
}
