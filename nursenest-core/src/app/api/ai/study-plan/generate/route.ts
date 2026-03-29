import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { isStudyPlanAiEnabled } from "@/lib/ai/learner-ai-policy";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";

const bodySchema = z.object({
  examTarget: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "GENERIC"]),
  weeksUntilExam: z.coerce.number().int().min(1).max(52),
  hoursPerWeek: z.coerce.number().min(1).max(40),
  weakAreas: z.string().max(2000).optional(),
});

/** Per-user daily cap (in-process; tune for multi-instance later). */
const RATE = { windowMs: 86_400_000, max: 20 } as const;

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to use the study plan generator." }, { status: 401 });
  }

  if (!isStudyPlanAiEnabled()) {
    return NextResponse.json(
      { error: "Study plan AI is not enabled on this deployment.", code: "FEATURE_DISABLED" },
      { status: 403 },
    );
  }

  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 });
  }

  const rl = checkRateLimit(`study-plan-ai:${userId}`, RATE);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Daily limit reached for study plan generation. Try again tomorrow.", code: "RATE_LIMIT" },
      { status: 429 },
    );
  }

  let parsed: z.infer<typeof bodySchema>;
  try {
    const json = await req.json();
    const r = bodySchema.safeParse(json);
    if (!r.success) {
      return NextResponse.json({ error: "Invalid request", details: r.error.flatten() }, { status: 400 });
    }
    parsed = r.data;
  } catch {
    return NextResponse.json({ error: "Expected JSON body" }, { status: 400 });
  }

  const { examTarget, weeksUntilExam, hoursPerWeek, weakAreas } = parsed;

  const userPrompt = `Create a personalized nursing exam study plan as JSON only (no markdown).
Exam: ${examTarget.replace(/_/g, " ")}.
Time until exam: ${weeksUntilExam} weeks.
Study budget: about ${hoursPerWeek} hours per week.
${weakAreas?.trim() ? `Self-reported weak areas: ${weakAreas.trim()}` : "Weak areas: not specified — infer reasonable priorities."}

Return a single JSON object with this shape:
{
  "summary": "2-3 sentences",
  "weeks": [
    {
      "week": 1,
      "focus": "short theme",
      "objectives": ["...", "..."],
      "suggestedSessions": [
        { "label": "short session name", "minutes": 45, "activities": ["..."] }
      ]
    }
  ],
  "examWeekTips": ["...", "..."]
}
Use ${Math.min(weeksUntilExam, 8)} week entries (cap at 8 for readability). Keep activities exam-focused (questions, review, drills, mock exams).`;

  try {
    const response = await openAiChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You are an expert nursing exam coach. Output must be valid JSON only. No clinical advice beyond study structure; avoid diagnosing or prescribing.",
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.55,
      maxTokens: 2800,
    });

    const raw = response.content?.trim() || "{}";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let plan: unknown;
    try {
      plan = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Could not parse AI response as JSON." }, { status: 502 });
    }

    return NextResponse.json({
      plan,
      tokensUsed: response.totalTokens ?? 0,
      disclaimer: "This plan is AI-generated for study organization only. It does not replace your program, clinical judgment, or instructor guidance.",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
