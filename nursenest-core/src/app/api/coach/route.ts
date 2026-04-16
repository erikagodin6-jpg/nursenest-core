import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { isStudyCoachEnabled } from "@/lib/ai/learner-ai-policy";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { JSON_BODY_COACH, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";
import {
  buildCoachSystemPrompt,
  buildCoachUserPrompt,
  followUpsForIntent,
  isGenerativeCoachIntent,
  titleForIntent,
  type CoachIntent,
  type CoachRequest,
  type CoachResponse,
} from "@/lib/coach/study-coach-actions";
import type { CoachContext } from "@/lib/coach/study-coach-types";
import {
  formatInterventionResponse,
  formatPatternInsightResponse,
  formatReadinessExplainResponse,
  formatStudyPriorityResponse,
  loadCoachBundleForApi,
  rankInterventions,
} from "@/lib/coach/study-coach-intelligence";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";

const INTENTS: [CoachIntent, ...CoachIntent[]] = [
  "explain_simply",
  "why_wrong",
  "what_next",
  "weak_summary",
  "topic_review",
  "quick_plan",
  "quiz_concept",
  "readiness_explain",
  "study_priority_ranked",
  "pattern_insight",
  "intervention_alert",
];

const bodySchema = z.object({
  intent: z.enum(INTENTS),
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

const DETERMINISTIC: CoachIntent[] = [
  "readiness_explain",
  "study_priority_ranked",
  "pattern_insight",
  "intervention_alert",
];

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

  const rl = await checkRateLimitUnified(`study-coach:${userId}`, RATE);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: "You've reached the hourly limit. Try again shortly.",
        code: "RATE_LIMIT",
      },
      { status: 429 },
    );
  }

  const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_COACH);
  if (!bodyRead.ok) return bodyRead.response;

  const r = bodySchema.safeParse(bodyRead.value);
  if (!r.success) {
    return NextResponse.json(
      { error: "Invalid request", details: r.error.flatten() },
      { status: 400 },
    );
  }
  const parsed = r.data;

  const intent = parsed.intent;
  const context: CoachContext = parsed.context;

  if (DETERMINISTIC.includes(intent)) {
    const entitlement = await resolveEntitlementForPage(userId);
    if (entitlement === "error" || !entitlement.hasAccess) {
      return NextResponse.json(
        { error: "An active plan is required for this view.", code: "ENTITLEMENT" },
        { status: 403 },
      );
    }
    const bundle = await loadCoachBundleForApi(userId, entitlement);
    if (!bundle) {
      return NextResponse.json(
        { error: "Could not load study data. Try again later.", code: "DATA" },
        { status: 503 },
      );
    }

    let response: CoachResponse;
    switch (intent) {
      case "readiness_explain":
        response = formatReadinessExplainResponse(bundle.readiness);
        break;
      case "study_priority_ranked":
        response = formatStudyPriorityResponse(bundle.priorities);
        break;
      case "pattern_insight":
        response = formatPatternInsightResponse(bundle.patterns);
        break;
      case "intervention_alert": {
        const ranked = rankInterventions(bundle.interventions);
        const top = ranked[0];
        if (!top) {
          response = {
            intent: "intervention_alert",
            title: titleForIntent("intervention_alert"),
            content: "No proactive note for this moment. Keep the current plan.",
            deterministic: true,
            followUp: followUpsForIntent("intervention_alert"),
          };
        } else {
          response = formatInterventionResponse(top);
        }
        break;
      }
      default:
        return NextResponse.json({ error: "Unsupported intent" }, { status: 400 });
    }

    return NextResponse.json({ response, tokensUsed: 0 });
  }

  if (!isGenerativeCoachIntent(intent)) {
    return NextResponse.json({ error: "Unsupported intent" }, { status: 400 });
  }

  const subGate = await requireSubscriberSession();
  if (!subGate.ok) return subGate.response;

  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 });
  }

  const coachReq: CoachRequest = {
    intent,
    context,
  };

  try {
    const result = await openAiChatCompletion({
      messages: [
        { role: "system", content: buildCoachSystemPrompt(intent) },
        { role: "user", content: buildCoachUserPrompt(coachReq) },
      ],
      temperature: 0.5,
      maxTokens: 1200,
    });

    const response: CoachResponse = {
      intent,
      title: titleForIntent(intent),
      content: result.content?.trim() || "",
      followUp: followUpsForIntent(intent),
    };

    return NextResponse.json({ response, tokensUsed: result.totalTokens ?? 0 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
