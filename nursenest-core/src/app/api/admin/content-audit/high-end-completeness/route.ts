import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildHighEndCompletenessAudit } from "@/lib/content-audit/high-end-completeness-audit";

/**
 * High-end completeness audit for pathway dominance standards.
 * Admin-only JSON report used by ops, planning, and release gates.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  try {
    const url = new URL(req.url);
    const pathwayId = url.searchParams.get("pathwayId")?.trim();
    const includeLanguage = url.searchParams.get("includeLanguage") !== "0";
    const report = await buildHighEndCompletenessAudit({
      pathwayIds: pathwayId ? [pathwayId] : undefined,
      includeLanguageAudit: includeLanguage,
    });
    return NextResponse.json(report);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        error: message,
        code: "high_end_completeness_audit_failed",
      },
      { status: 500 },
    );
  }
}
