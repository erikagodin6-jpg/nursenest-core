import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildQuestionBankCoverageAnalysis } from "@/lib/questions/build-question-bank-coverage-analysis";

/**
 * Full pathway coverage + canonical topic distribution + quality flags (published rows only).
 * Heavy aggregate — admin-only; suitable for ops / nightly jobs.
 */
export async function GET() {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const report = await buildQuestionBankCoverageAnalysis();
    return NextResponse.json(report);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, code: "coverage_failed" }, { status: 500 });
  }
}
