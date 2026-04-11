import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { isStudyCoachEnabled } from "@/lib/ai/learner-ai-policy";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
import {
  buildCoachSystemPrompt,
  buildCoachUserPrompt,
  titleForIntent,
  followUpsForIntent,
  type CoachIntent,
  type CoachRequest,
  type CoachResponse,
} from "@/lib/coach/study-coach-actions";

const INTENTS: CoachIntent[] = [
  "explain_simply",
  "why_wrong",
  "what_next",
  "weak_summary",
  "topic_review",
  "quick_plan",
  "quiz_concept",
];

const bodySchema = z.object({
  intent: z.enum(INTENTS as [CoachIntent, ...CoachIntent[]]),
  context: z.object({
    content: z.string().max(4000).optional(),
    topic: z.string().max(200).optional(),
    subtopic: z.string().max(200).optional(),
    wasCorrect: z.boolean().optional(),
    rationale: z.string().max(2000).optional(),
    weakTopics: z.array(z.string().max(200)).max(20).optional(),
    examTarget: z.string().max(50).optional(),
    daysUntilExam: z.number().int().min(0).max(730).optional(),
  }),
});

const RATE = { windowMs: 3_600_000, max: 30 } as const;

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to use the Study Coach." },
      { status: 401 },
    );
  }

  if (!isStudyCoachEnabled()) {
    return NextResponse.json(
      { error: "Study Coach is not enabled.", code: "FEATURE_DISABLED" },
      { status: 403 },
    );
  }

  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 });
  }

  const rl = checkRateLimit(`study-coach:${userId}`, RATE);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: "You've reached the hourly limit. Try again shortly.",
        code: "RATE_LIMIT",
      },
      { status: 429 },
    );
  }

  let parsed: z.infer<typeof bodySchema>;
  try {
    const json = await req.json();
    const r = bodySchema.safeParse(json);
    if (!r.success) {
      return NextResponse.json(
        { error: "Invalid request", details: r.error.flatten() },
        { status: 400 },
      );
    }
    parsed = r.data;
  } catch {
    return NextResponse.json({ error: "Expected JSON body" }, { status: 400 });
  }

  const coachReq: CoachRequest = {
    intent: parsed.intent,
    context: parsed.context,
  };

  try {
    const result = await openAiChatCompletion({
      messages: [
        { role: "system", content: buildCoachSystemPrompt(parsed.intent) },
        { role: "user", content: buildCoachUserPrompt(coachReq) },
      ],
      temperature: 0.5,
      maxTokens: 1200,
    });

    const response: CoachResponse = {
      intent: parsed.intent,
      title: titleForIntent(parsed.intent),
      content: result.content?.trim() || "",
      followUp: followUpsForIntent(parsed.intent),
    };

    return NextResponse.json({ response, tokensUsed: result.totalTokens ?? 0 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
