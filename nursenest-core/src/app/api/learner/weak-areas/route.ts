import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/learner/weak-areas", feature: SERVER_FEATURE.question, userId: gate.userId });

  try {
    const snap = await loadUnifiedTopicPerformance(gate.userId, gate.entitlement, 12);
    return NextResponse.json(snap);
  } catch {
    return NextResponse.json({ error: "Unable to load weak areas." }, { status: 503 });
  }
}
