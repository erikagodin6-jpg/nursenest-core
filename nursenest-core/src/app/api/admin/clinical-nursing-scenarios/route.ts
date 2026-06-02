import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { createClinicalNursingScenarioDraft } from "@/lib/clinical-scenarios/clinical-nursing-scenarios.server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

const postBody = z
  .object({
    pathwayId: z.string().min(1).max(64),
    tierFocus: z.enum(["RN_NCLEX_RN", "RPN_PN", "NP", "NEW_GRAD"]),
    difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]),
    title: z.string().min(1).max(240).optional(),
  })
  .strict();

export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/admin/clinical-nursing-scenarios", "admin", async () => {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.response;

    let body: z.infer<typeof postBody>;
    try {
      body = postBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    try {
      const created = await createClinicalNursingScenarioDraft({
        pathwayId: body.pathwayId,
        tierFocus: body.tierFocus,
        difficulty: body.difficulty,
        title: body.title ?? null,
        createdByUserId: gate.admin.userId,
      });
      return NextResponse.json({ ok: true, id: created.id });
    } catch (e) {
      if (e instanceof Error && e.message === "unknown_pathway") {
        return NextResponse.json({ ok: false, code: "unknown_pathway" }, { status: 400 });
      }
      throw e;
    }
  });
}
