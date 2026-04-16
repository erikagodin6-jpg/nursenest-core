import { NextResponse } from "next/server";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { enforceProtectionTelemetryPost } from "@/lib/http/api-protection";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { isClientProtectionMetricKey, recordPremiumProtectionClientBatch } from "@/lib/premium-protection/telemetry-db";

const surfaceSchema = z.enum([
  "question_bank",
  "practice_test",
  "flashcards",
  "pathway_lesson",
  "content_lesson",
  "unknown",
]);

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        metricKey: z.string().min(4).max(64),
        surface: surfaceSchema,
        count: z.number().int().min(1).max(500),
      }),
    )
    .max(24),
});

export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/learner/protection-telemetry", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const blocked = await enforceProtectionTelemetryPost(req, gate.userId);
  if (blocked) return blocked;

  setSentryServerContext({ route: "/api/learner/protection-telemetry", feature: SERVER_FEATURE.other, userId: gate.userId });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const items = parsed.data.items.filter((it) => isClientProtectionMetricKey(it.metricKey));
  if (items.length === 0) {
    return NextResponse.json({ ok: true, accepted: 0 });
  }

  await recordPremiumProtectionClientBatch({ userId: gate.userId, items });
  return NextResponse.json({ ok: true, accepted: items.length });
  });
}
