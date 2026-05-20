import { NextResponse } from "next/server";
import { ecgApiDeniedResponse, getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";
import { PEDIATRIC_CASE_SIMULATIONS } from "@/lib/ecg-module/ecg-pediatric-case-simulations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/modules/ecg-pediatric/cases
 *
 * Returns the case simulation list (metadata only — no decision-point options).
 * Full case detail (including options) is returned by the [id] route.
 *
 * Pulsus paradoxus governance: hemodynamicFindings with isNotRhythm=true are
 * included with a `hemodynamicFindingNotRhythm: true` flag to ensure the client
 * renders them with the correct framing.
 */
export async function GET() {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok) return ecgApiDeniedResponse(access.reason);

  const cases = PEDIATRIC_CASE_SIMULATIONS.map((c) => ({
    id: c.id,
    title: c.title,
    ageGroup: c.ageGroup,
    ageDescription: c.ageDescription,
    setting: c.setting,
    chiefComplaint: c.chiefComplaint,
    monitorRhythm: c.monitorRhythm,
    palsBranch: c.palsBranch,
    decisionPointCount: c.decisionPoints.length,
    learningObjectiveCount: c.learningObjectives.length,
    reinforcesCurriculumIds: c.reinforcesCurriculumIds,
    rpnAccessLevel: c.rpnAccessLevel,
    // Include hemodynamic finding names for list preview
    hemodynamicFindingNames: c.hemodynamicFindings.map((f) => ({
      name: f.findingName,
      isNotRhythm: f.isNotRhythm,
    })),
    presentingVitals: {
      heartRate: c.presentingVitals.heartRate,
      spO2: c.presentingVitals.spO2,
      respRate: c.presentingVitals.respRate,
    },
  }));

  return NextResponse.json({ ok: true, cases, total: cases.length });
}
