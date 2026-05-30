import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { trackSimulationEvent, type SimulationConversionEvent } from "@/lib/physiology-monitor/simulation-conversion-events";

export const dynamic = "force-dynamic";

/**
 * POST /api/learner/simulation-events
 * Lightweight client-side PostHog event relay for simulation conversion tracking.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

    const body = await req.json() as { event?: string; properties?: Record<string, unknown> };
    const event = body.event as SimulationConversionEvent | undefined;
    if (!event) return NextResponse.json({ ok: false }, { status: 400 });

    await trackSimulationEvent(userId, event, body.properties ?? {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Never fail client
  }
}
