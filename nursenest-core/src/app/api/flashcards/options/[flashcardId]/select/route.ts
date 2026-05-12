/**
 * POST /api/flashcards/options/[flashcardId]/select
 *
 * Records which option(s) a learner selected for analytics.
 * Increments denormalized selectCount / correctSelectCount on FlashcardOption rows.
 *
 * Body:
 *   selectedKeys: string[]   — letter(s) the learner chose (["A"] for MCQ, ["A","C"] for SATA)
 *   overallCorrect: boolean  — whether the overall answer was scored correct
 *
 * Notes:
 *   - Fire-and-forget on the client — 200 is the only expected success code.
 *   - Returns 204 (no content) when the card has no canonical option rows (legacy JSON card).
 *   - Never modifies FlashcardProgress — this is analytics-only.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { recordOptionSelections } from "@/lib/flashcards/flashcard-option-select.server";
import { enforceFlashcardReviewProtection } from "@/lib/http/api-protection";

const bodySchema = z.object({
  selectedKeys: z.array(z.string().min(1).max(8)).min(1).max(6),
  overallCorrect: z.boolean(),
});

type Props = { params: Promise<{ flashcardId: string }> };

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: Props) {
  return runWithApiTelemetry(req, "POST /api/flashcards/options/[flashcardId]/select", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const { userId } = gate;
    const { flashcardId } = await params;
    setSentryServerContext({ route: "/api/flashcards/options/[flashcardId]/select", feature: SERVER_FEATURE.flashcard, userId });

    const rateLimited = await enforceFlashcardReviewProtection(req, userId);
    if (rateLimited) return rateLimited;

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { selectedKeys, overallCorrect } = parsed.data;

    // Fire-and-forget — errors are swallowed inside recordOptionSelections
    await recordOptionSelections({ flashcardId, selectedKeys, overallCorrect });

    return NextResponse.json({ ok: true });
  });
}
