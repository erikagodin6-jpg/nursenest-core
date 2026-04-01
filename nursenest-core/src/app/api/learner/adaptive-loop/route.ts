import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { buildAdaptiveTeachingLoopFromPerformance } from "@/lib/learner/adaptive-teaching-loop";

const eventSchema = z.object({
  v: z.literal(1),
  questionId: z.string(),
  topic: z.string().nullable(),
  subtopic: z.string().nullable(),
  pathwayId: z.string().nullable(),
  exam: z.string().nullable(),
  correct: z.boolean(),
  timeSpentMs: z.number().optional(),
  at: z.string(),
});

const bodySchema = z.object({
  events: z.array(eventSchema).max(220).default([]),
  fallbackTopics: z.array(z.string()).max(6).optional(),
});

export async function POST(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const loop = await buildAdaptiveTeachingLoopFromPerformance({
    userId: gate.userId,
    events: parsed.data.events,
    fallbackTopics: parsed.data.fallbackTopics,
  });

  return NextResponse.json(loop);
}

