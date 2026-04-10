import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { stripToPlainText } from "@/lib/content-quality/plain-text";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildRationaleSectionsFromQuestion } from "@/lib/content-quality/rationale-display";
import {
  answerMatches,
  canonicalCorrectKeysForQuestion,
} from "@/lib/exams/score-session-answers";
import { resolveRationaleLessonLinksForQuestion } from "@/lib/learner/rationale-lesson-link-resolve";
import { getLearnerExamFraming } from "@/lib/learner/learner-exam-framing";
import type { CatStudyFeedbackPayload, CatStudyFeedbackSection } from "@/lib/practice-tests/types";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  SAFE_EMPTY_LESSON_LINKS,
  buildMinimalCatStudyFeedbackPayload,
} from "@/lib/practice-tests/cat-practice-fallbacks";

export type { CatStudyFeedbackPayload } from "@/lib/practice-tests/types";

function firstSentences(text: string, maxSentences: number, maxChars: number): string {
  const plain = stripToPlainText(text);
  if (!plain) return "";
  const parts = plain.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 8);
  const joined = parts.slice(0, maxSentences).join(" ").trim();
  if (!joined) return plain.length <= maxChars ? plain : `${plain.slice(0, maxChars - 1).trim()}…`;
  return joined.length <= maxChars ? joined : `${joined.slice(0, maxChars - 1).trim()}…`;
}

function buildLevel1Short(args: {
  keyTakeaway: string | null;
  whyCorrectBody: string;
  clinicalTakeawayBody: string;
}): string {
  const kt = stripToPlainText(args.keyTakeaway);
  if (kt.length > 24) {
    return firstSentences(kt, 3, 360);
  }
  const why = firstSentences(args.whyCorrectBody, 2, 360);
  if (why.length > 24) return why;
  const tw = firstSentences(args.clinicalTakeawayBody, 2, 360);
  if (tw.length > 24) return tw;
  return "Open the full rationale below for the core rule, then use the lesson links to reinforce the topic.";
}

function questionFormatHint(questionType: string): string {
  const u = (questionType ?? "").toUpperCase();
  if (u.includes("SATA") || u.includes("SELECT_ALL")) {
    return "This is a select-all-that-apply item: decide each option on its own merits before submitting.";
  }
  if (u.includes("PRIOR")) {
    return "This is a prioritization item: identify the most urgent problem or first action before comparing distractors.";
  }
  if (u.includes("DRAG") || u.includes("ORDER")) {
    return "This is an ordered-response item: sequence matters — match the stem’s goal (e.g., assessment before intervention).";
  }
  return "Treat this as a best-answer item: the stem usually points to one primary nursing problem or action.";
}

function partitionLayers(
  sections: CatStudyFeedbackSection[],
  questionType: string,
  clinicalTrap: string | null,
): {
  level2: CatStudyFeedbackSection[];
  level3: string;
} {
  const safe = Array.isArray(sections)
    ? sections.filter((s) => s && typeof s.heading === "string" && typeof s.body === "string")
    : [];
  const level2 = safe.filter((s) => s.heading.trim().toLowerCase() !== "exam strategy");
  const strat = safe.find((s) => s.heading.trim().toLowerCase() === "exam strategy");
  const stratBody =
    strat && stripToPlainText(strat.body).length > 4
      ? stripToPlainText(strat.body)
      : "Read the stem twice: note whether it asks for first action, worst finding, or teaching need — then eliminate options that violate safety or scope.";
  const trap = stripToPlainText(clinicalTrap);
  const trapLine = trap.length > 12 ? ` Common trap: ${trap}` : "";
  const level3 = `${questionFormatHint(questionType)} ${stratBody}${trapLine}`;
  return { level2, level3 };
}

export async function buildCatStudyFeedback(
  questionId: string,
  userAnswer: unknown,
  entitlement: AccessScope,
  pathwayId: string | null = null,
): Promise<CatStudyFeedbackPayload | null> {
  try {
  const base = questionAccessWhere(entitlement);
  const q = await prisma.examQuestion.findFirst({
    where: { AND: [{ id: questionId }, base] },
    select: {
      id: true,
      questionType: true,
      correctAnswer: true,
      rationale: true,
      topic: true,
      subtopic: true,
      bodySystem: true,
      stem: true,
      tags: true,
      correctAnswerExplanation: true,
      clinicalReasoning: true,
      keyTakeaway: true,
      clinicalPearl: true,
      examStrategy: true,
      memoryHook: true,
      clinicalTrap: true,
      distractorRationales: true,
      incorrectAnswerRationale: true,
    },
  });
  if (!q) return null;
  const correctAnswer = q.correctAnswer as Prisma.JsonValue;
  const isCorrect = answerMatches(q.questionType, correctAnswer, userAnswer);
  const correctKeys = canonicalCorrectKeysForQuestion(q.questionType, correctAnswer);

  let sections: CatStudyFeedbackSection[] = [];
  try {
    sections = buildRationaleSectionsFromQuestion({
      rationale: q.rationale,
      correctAnswerExplanation: q.correctAnswerExplanation,
      clinicalReasoning: q.clinicalReasoning,
      keyTakeaway: q.keyTakeaway,
      clinicalPearl: q.clinicalPearl,
      examStrategy: q.examStrategy,
      memoryHook: q.memoryHook,
      clinicalTrap: q.clinicalTrap,
      distractorRationales: q.distractorRationales,
      incorrectAnswerRationale: q.incorrectAnswerRationale,
    });
  } catch {
    sections = [];
  }

  const why = sections.find((s) => s.heading === "Why this is correct")?.body ?? "";
  const clinicalTake = sections.find((s) => s.heading === "Clinical takeaway")?.body ?? "";
  const { level2, level3 } = partitionLayers(sections, q.questionType, q.clinicalTrap ? String(q.clinicalTrap) : null);
  const level1Short = buildLevel1Short({
    keyTakeaway: q.keyTakeaway,
    whyCorrectBody: why,
    clinicalTakeawayBody: clinicalTake,
  });

  let relatedLessons: Array<{ title: string; href: string }> = SAFE_EMPTY_LESSON_LINKS;
  try {
    const related = await resolveRationaleLessonLinksForQuestion(prisma, {
      pathwayId,
      topic: q.topic,
      subtopic: q.subtopic,
      bodySystem: q.bodySystem,
      tags: q.tags ?? [],
      stem: typeof q.stem === "string" ? q.stem.slice(0, 520) : null,
    });
    const filtered = related.filter(
      (r) => r && typeof r.title === "string" && typeof r.href === "string" && r.href.trim().startsWith("/"),
    );
    if (related.length > filtered.length) {
      recordRouteRenderFallback({
        fallbackType: "lesson_link_mismatch_suppressed",
        pathwayId: pathwayId ?? undefined,
        count: related.length - filtered.length,
      });
    }
    relatedLessons = filtered
      .slice(0, 3)
      .map((r) => ({ title: r.title, href: r.href }));
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("cat_study", "cat_lesson_link_suppressed", {
      event: "cat_lesson_link_suppressed",
      questionId: questionId.slice(0, 24),
      error_message: message.slice(0, 300),
    });
    recordRouteRenderFallback({
      fallbackType: "lesson_link_resolution_failed",
      pathwayId: pathwayId ?? undefined,
    });
    relatedLessons = SAFE_EMPTY_LESSON_LINKS;
  }
  const framing = getLearnerExamFraming(pathwayId);
  const examFramingNote =
    framing.region === "unknown"
      ? undefined
      : `This reflects ${framing.examShortLabel}-style prioritization and scope rules — compare distractors against ${framing.examIdentityLabel} expectations.`;

  return {
    questionId: q.id,
    isCorrect,
    correctKeys,
    sections,
    topic: q.topic,
    subtopic: q.subtopic,
    layers: {
      level1Short,
      level2Sections: level2,
      level3Strategy: level3,
      relatedLessons,
      ...(examFramingNote ? { examFramingNote } : {}),
    },
  };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("cat_study", "cat_study_feedback_build_failed", {
      event: "cat_study_feedback_build_failed",
      questionId: questionId.slice(0, 24),
      error_message: message.slice(0, 400),
    });
    return buildMinimalCatStudyFeedbackPayload({
      questionId,
      isCorrect: false,
      correctKeys: [],
    });
  }
}
