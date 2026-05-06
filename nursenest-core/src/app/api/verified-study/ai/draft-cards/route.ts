import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";

export const dynamic = "force-dynamic";

const postBody = z
  .object({
    pathwayId: z.string().min(1).max(64),
    canonicalCategoryId: z.string().max(64).nullable().optional(),
    topicHint: z.string().max(200).nullable().optional(),
  })
  .strict();

/**
 * Draft-only AI study cards (no persistence). Production wiring will ground prompts in pathway lessons
 * + exam bank slices and run citation validation; this stub proves the API surface and reference bar.
 */
export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/verified-study/ai/draft-cards", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;

    let body: z.infer<typeof postBody>;
    try {
      body = postBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    const cdcUrl = "https://www.cdc.gov/hypertension/facts.htm";
    const drafts = [
      {
        promptFront: `[${body.pathwayId}] Draft: lifestyle counseling for elevated blood pressure`,
        answerBack: "Emphasize diet, activity, adherence, and follow-up per current clinical guidance.",
        rationale: "Draft card — replace with bank-backed stem after pipeline wiring.",
        clinicalPearl: "Always pair education with measurable follow-up.",
        referencesJson: [{ url: cdcUrl, title: "CDC — hypertension facts", year: new Date().getUTCFullYear() }],
        verificationStatus: "UNVERIFIED" as const,
        aiRejected: null as string | null,
      },
    ];

    return NextResponse.json({
      ok: true,
      pathwayId: body.pathwayId,
      drafts,
      notice:
        "Drafts are not saved. Public/community publishing still requires staff verification, valid HTTPS references, and moderation approval.",
    });
  });
}
