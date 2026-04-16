import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";

/**
 * Bounded coverage report: counts and capped groupings only (no stems).
 */
export async function GET() {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const report = await buildQuestionBankCoverageReport();
    return NextResponse.json({ ok: true, report });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
