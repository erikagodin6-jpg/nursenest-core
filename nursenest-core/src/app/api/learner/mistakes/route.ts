import { NextResponse } from "next/server";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { upsertMistakeTag, deleteMistakeTag } from "@/lib/mistakes/mistake-store";
import { MISTAKE_REASONS, type MistakeReason } from "@/lib/mistakes/mistake-types";

const tagSchema = z.object({
  questionId: z.string().min(1).max(128),
  reason: z.enum(MISTAKE_REASONS as [string, ...string[]]).nullable(),
  note: z.string().max(2000).default(""),
  topic: z.string().max(200).optional().nullable(),
});

/** POST /api/learner/mistakes — upsert a reason tag + note for a missed question */
export async function POST(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = tagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { questionId, reason, note, topic } = parsed.data;

  // If reason is null and note is empty, remove the tag entirely
  if (reason === null && note.trim() === "") {
    await deleteMistakeTag(gate.userId, questionId);
    return NextResponse.json({ ok: true, action: "deleted" });
  }

  await upsertMistakeTag(
    gate.userId,
    questionId,
    { reason: (reason as MistakeReason | null), note },
    topic,
  );

  return NextResponse.json({ ok: true, action: "upserted" });
}
