import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildExamBlueprintCoverageReport } from "@/lib/content-blueprint/build-blueprint-coverage-report";

/**
 * Pathway blueprint + catalog lesson inventory + rationale tiers (published pool, tier/region gates).
 * Heavy aggregate — admin-only.
 */
export async function GET() {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const report = await buildExamBlueprintCoverageReport();
    return NextResponse.json(report);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, code: "exam_coverage_audit_failed" }, { status: 500 });
  }
}
