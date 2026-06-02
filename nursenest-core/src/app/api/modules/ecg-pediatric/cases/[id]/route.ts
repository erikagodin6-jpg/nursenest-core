import { NextResponse } from "next/server";
import { ecgApiDeniedResponse, getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";
import { getPediatricCaseSimulation } from "@/lib/ecg-module/ecg-pediatric-case-simulations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

/**
 * GET /api/modules/ecg-pediatric/cases/[id]
 *
 * Returns the full case simulation including decision points.
 * Hemodynamic findings with isNotRhythm=true include a governance flag
 * that the client must render with: "Hemodynamic finding — not an ECG rhythm."
 */
export async function GET(_req: Request, ctx: Props) {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok) return ecgApiDeniedResponse(access.reason);

  const { id } = await ctx.params;
  const c = getPediatricCaseSimulation(id);
  if (!c) {
    return NextResponse.json({ ok: false, code: "case_not_found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    case: {
      id: c.id,
      title: c.title,
      ageGroup: c.ageGroup,
      ageDescription: c.ageDescription,
      setting: c.setting,
      chiefComplaint: c.chiefComplaint,
      presentingVitals: c.presentingVitals,
      presentingFindings: c.presentingFindings,
      monitorRhythm: c.monitorRhythm,
      hemodynamicFindings: c.hemodynamicFindings,
      decisionPoints: c.decisionPoints.map((dp) => ({
        scenario: dp.scenario,
        options: dp.options.map((o) => ({ action: o.action })), // answers hidden until attempt
        teachingPoint: null, // revealed post-attempt via POST
      })),
      palsBranch: c.palsBranch,
      learningObjectives: c.learningObjectives,
      nursingErrorTraps: c.nursingErrorTraps,
      reinforcesCurriculumIds: c.reinforcesCurriculumIds,
      rpnAccessLevel: c.rpnAccessLevel,
    },
  });
}
