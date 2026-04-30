import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { plainBodyFromPathwaySectionsJson } from "@/lib/lessons/pathway-lesson-plain-body-sections";

export const dynamic = "force-dynamic";

/**
 * Admin read helper: resolve a {@link PathwayLesson} by stable keys (`pathwayId` + `slug` + optional `locale`)
 * without requiring the internal `pathway_lessons.id`.
 *
 * ContentItem → PathwayLesson sync is **compatibility only** (legacy migration); this route is the
 * canonical admin read path alongside `GET /api/admin/pathway-lessons/[id]`.
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

  const row = await prisma.pathwayLesson.findFirst({
    where: { pathwayId, slug, locale },
  });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = plainBodyFromPathwaySectionsJson(row.sections);
  return NextResponse.json({ lesson: row, body });
}
