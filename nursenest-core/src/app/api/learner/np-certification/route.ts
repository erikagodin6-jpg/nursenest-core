import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  getNpCertificationPathway,
  listNpCertificationPathways,
  normalizeNpCertificationPathwayId,
  NP_CERTIFICATION_PATHWAY_COOKIE,
} from "@/lib/np/np-certification-pathways";
import { npCertificationPathwayCookieOptions } from "@/lib/np/np-certification-selection";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

const selectSchema = z.object({
  pathwayId: z.string().min(1),
});

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/np-certification", "content", async () => {
    const cookieStore = await cookies();
    const pathways = listNpCertificationPathways();
    return NextResponse.json({
      pathways,
      selectedPathwayId: normalizeNpCertificationPathwayId(cookieStore.get(NP_CERTIFICATION_PATHWAY_COOKIE)?.value),
    });
  });
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/np-certification", "content", async () => {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = selectSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid certification pathway." }, { status: 400 });
    }

    const pathway = getNpCertificationPathway(parsed.data.pathwayId);
    if (!pathway) {
      return NextResponse.json({ error: "Unsupported NP certification pathway." }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true, selectedPathwayId: pathway.pathwayId, pathway });
    res.cookies.set(NP_CERTIFICATION_PATHWAY_COOKIE, pathway.pathwayId, npCertificationPathwayCookieOptions());
    return res;
  });
}
