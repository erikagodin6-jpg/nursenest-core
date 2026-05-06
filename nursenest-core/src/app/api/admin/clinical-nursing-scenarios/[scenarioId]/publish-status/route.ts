import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import {
  getClinicalNursingScenarioDetailForViewer,
  updateClinicalNursingScenarioPublishStatus,
} from "@/lib/clinical-scenarios/clinical-nursing-scenarios.server";
import { validateClinicalScenarioReadyToPublish } from "@/lib/clinical-scenarios/clinical-scenario-publish-guard";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

const patchBody = z
  .object({
    publishStatus: z.enum(["DRAFT", "IN_REVIEW", "APPROVED"]),
  })
  .strict();

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ scenarioId: string }> }) {
  return runWithApiTelemetry(
    req,
    "PATCH /api/admin/clinical-nursing-scenarios/[scenarioId]/publish-status",
    "admin",
    async () => {
      const gate = await requireAdmin(req);
      if (!gate.ok) return gate.response;

      const { scenarioId } = await ctx.params;
      const id = scenarioId?.trim();
      if (!id) {
        return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
      }

      let body: z.infer<typeof patchBody>;
      try {
        body = patchBody.parse(await req.json());
      } catch {
        return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
      }

      const exists = await prisma.clinicalNursingScenario.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!exists) {
        return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
      }

      if (body.publishStatus === "APPROVED") {
        const detail = await getClinicalNursingScenarioDetailForViewer({ id, viewerMaySeeDrafts: true });
        if (!detail) {
          return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
        }
        const guard = validateClinicalScenarioReadyToPublish(detail);
        if (!guard.ok) {
          return NextResponse.json({ ok: false, code: guard.code, error: guard.message }, { status: 422 });
        }
      }

      await updateClinicalNursingScenarioPublishStatus(id, body.publishStatus);

      const row = await getClinicalNursingScenarioDetailForViewer({ id, viewerMaySeeDrafts: true });
      return NextResponse.json({ ok: true, publishStatus: row?.publishStatus ?? body.publishStatus });
    },
  );
}
