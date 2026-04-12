import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { scanLessonQuestionLinkCoverage } from "@/lib/lessons/lesson-question-link-coverage-core";

/**
 * Per-lesson related bank counts (same predicate as lesson “Practice questions”).
 * Query: ?pathway=us-rn-nclex-rn (optional)
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const pathway = url.searchParams.get("pathway")?.trim() || null;

  try {
    const { rows, summary } = await scanLessonQuestionLinkCoverage(pathway);
    return NextResponse.json({
      summary,
      rows,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, code: "lesson_link_coverage_failed" }, { status: 500 });
  }
}
