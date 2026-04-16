import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildPathwayLessonTranslationGapReport } from "@/lib/lessons/pathway-lesson-translation-diagnostics";

/** Bounded translation coverage matrix (counts / slug samples only). */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const report = await buildPathwayLessonTranslationGapReport();
    return NextResponse.json({ ok: true, report });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
