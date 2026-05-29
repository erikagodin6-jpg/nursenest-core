import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { getOrCreateReferralCode, loadReferralDashboard } from "@/lib/referrals/referral-rewards";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/referrals", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const dashboard = await loadReferralDashboard(gate.userId, new URL(req.url).origin);
    return NextResponse.json({ ok: true, dashboard }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/referrals", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const code = await getOrCreateReferralCode(gate.userId, new URL(req.url).origin);
    return NextResponse.json({ ok: true, code }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
