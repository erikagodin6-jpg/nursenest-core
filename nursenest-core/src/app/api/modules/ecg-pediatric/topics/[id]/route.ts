import { NextResponse } from "next/server";
import { ecgApiDeniedResponse, getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";
import { getPediatricCurriculumTopic } from "@/lib/ecg-module/ecg-pediatric-curriculum";
import {
  filterPediatricTopicForRpnTier,
  getPediatricContentAccessLevel,
} from "@/lib/ecg-module/ecg-pediatric-governance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

/**
 * GET /api/modules/ecg-pediatric/topics/[id]
 * Returns a single pediatric curriculum topic filtered by tier.
 */
export async function GET(_req: Request, ctx: Props) {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok) return ecgApiDeniedResponse(access.reason);

  const { id } = await ctx.params;
  const topic = getPediatricCurriculumTopic(id);
  if (!topic) {
    return NextResponse.json({ ok: false, code: "topic_not_found" }, { status: 404 });
  }

  const tier = access.mode === "public" ? access.tier : "RN";
  const contentAccess = getPediatricContentAccessLevel(tier);
  const filtered = filterPediatricTopicForRpnTier(topic);

  return NextResponse.json({
    ok: true,
    topic: {
      ...filtered,
      includesDosing: contentAccess.showDosing ? filtered.includesDosing : false,
    },
    contentAccess,
  });
}
