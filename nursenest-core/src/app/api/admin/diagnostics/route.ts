import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildAdminDiagnosticsOperationsLayer } from "@/lib/admin/build-admin-diagnostics-operations-layer";
import { readPriorReadinessScore, writePriorReadinessScore } from "@/lib/admin/readiness-prior-score-cache";
import { loadAdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import { loadQuestionBankRemediationIntelligence } from "@/lib/questions/load-question-bank-remediation-intelligence";

export const dynamic = "force-dynamic";

/**
 * JSON snapshot for the admin diagnostics dashboard (safe when optional tables are missing).
 */
export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  try {
    const [diagnostics, remediation] = await Promise.all([
      loadAdminDiagnostics(),
      loadQuestionBankRemediationIntelligence(),
    ]);
    const priorReadiness = readPriorReadinessScore();
    const rawOps = buildAdminDiagnosticsOperationsLayer(diagnostics, remediation, { priorReadiness });
    writePriorReadinessScore(rawOps.readinessScore);
    const operations = {
      ...rawOps,
      priorityIssues: rawOps.priorityIssues.map(({ impactRank: _i, ...rest }) => rest),
    };
    return NextResponse.json({ ok: true, diagnostics, operations });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg.slice(0, 400) }, { status: 500 });
  }
}
