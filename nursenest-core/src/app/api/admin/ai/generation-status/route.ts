import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { getAdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";

export const dynamic = "force-dynamic";

/**
 * GET — current admin AI generation gate (no secrets). For diagnostics and client refresh.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const g = getAdminAiGenerationGate();
  return NextResponse.json({
    mode: g.mode,
    runnable: g.runnable,
    flagEnabled: g.flagEnabled,
    aiProvider: g.aiProvider,
    aiProviderKeyPresent: g.aiProviderKeyPresent,
    openAiKeyPresent: g.openAiKeyPresent,
    summaryLine: g.summaryLine,
    diagnostics: g.diagnostics,
  });
}
