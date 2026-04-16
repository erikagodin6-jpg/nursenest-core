import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadQuestionBankRemediationIntelligence } from "@/lib/questions/load-question-bank-remediation-intelligence";

export async function GET() {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const intel = await loadQuestionBankRemediationIntelligence();
  if (!intel) {
    return NextResponse.json(
      { error: "Database not configured", databaseConfigured: false },
      { status: 503 },
    );
  }
  return NextResponse.json(intel);
}

