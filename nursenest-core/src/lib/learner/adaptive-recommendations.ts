import { ExamDatePlanType } from "@prisma/client";
import { computeReadiness, type ReadinessBand, type ReadinessResult } from "@/lib/learner/readiness-score";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { AdaptiveTeachingLoopRecommendation } from "@/lib/learner/adaptive-teaching-loop";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import {
  assessPlanTrack,
  buildExamPlanMilestones,
  buildRecoveryRecommendations,
  buildWeeklyStudyPlan,
  cadenceLabel,
  type ExamPlanMilestone,
  type PlanTrackAssessment,
  type RecoveryRecommendation,
  type WeeklyStudyPlan,
} from "@/lib/learner/exam-plan-engine";
import {
  buildCountdownCopy,
  daysDeltaToExamUtc,
  daysUntilExamUtc,
  urgencyFromDays,
  weeksRemainingRounded,
  type ExamUrgency,
} from "@/lib/learner/exam-timeline";

export type PaceStatus = "on_pace" | "slightly_behind" | "behind_weak_review" | "final_review";

export type TrajectoryStatus =
  | "building_foundation"
  | "improving"
  | "on_track"
  | "needs_focused_review"
  | "final_review";

export type NextAction = {
  title: string;
  href: string;
  reason: string;
  kind: "lesson" | "quiz" | "mock" | "cat" | "review" | "continue" | "settings" | "exams";
};

export type AdaptiveLearnerRecommendations = {
  countdown: ReturnType<typeof buildCountdownCopy>;
  paceStatus: PaceStatus;
  trajectory: TrajectoryStatus;
  trajectoryLines: string[];
  primaryNext: NextAction;
  secondary: NextAction[];
  weakTop3: string[];
  /** Factors most limiting readiness (from blended score). */
  holdingBackLabels: string[];
  weeklyPriorities: string[];
  todayFocus: string[];
  /** Honest combined line for readiness + time — no pass guarantees. */
  readinessTimelineLine: string | null;
  /** Calm exam-plan pacing — preferred for dashboard copy. */
  planTrack: PlanTrackAssessment;
  /** Cadence-aware weekly targets (lessons, questions, flashcards, mock timing). */
  weeklyPlan: WeeklyStudyPlan;
  /** Supportive recovery paths for common risk patterns. */
  recovery: RecoveryRecommendation[];
  milestones: ExamPlanMilestone[];
  /** Human label for active cadence (or default). */
  cadenceDisplay: string;
  /** Raw stored preference — light | steady | intensive | null */
  studyCadencePreference: string | null;
  /** Client-updated adaptive teaching loop (performance + teaching + image). */
  adaptiveLoop: AdaptiveTeachingLoopRecommendation | null;
};

function encodeTopic(topic: string): string {
  return encodeURIComponent(topic);
}

/** Canonical key for dedupe + stable ordering (aligned with weak-topic ledger). */
function weakTopicNormKey(row: WeakTopicRow): string {
  return row.normalizedTopic ?? normalizeTopicKey(row.topic);
}

/**
 * One row per canonical topic; deterministic order: priority desc, then norm key, then display label.
 * Weak-topic rows are already entitlement- and exam-scoped by upstream loaders — do not re-filter here.
 */
function dedupeWeakTopicsStable(rows: WeakTopicRow[]): WeakTopicRow[] {
  const map = new Map<string, WeakTopicRow>();
  for (const r of rows) {
    const k = weakTopicNormKey(r);
    const ex = map.get(k);
    if (!ex) {
      map.set(k, r);
      continue;
    }
    const rp = r.weakPriorityScore ?? 0;
    const ep = ex.weakPriorityScore ?? 0;
    if (rp > ep + 0.0001) map.set(k, r);
  }
  return [...map.values()].sort((a, b) => {
    const pb = Math.round((b.weakPriorityScore ?? 0) * 1000);
    const pa = Math.round((a.weakPriorityScore ?? 0) * 1000);
    if (pb !== pa) return pb - pa;
    const ka = weakTopicNormKey(a);
    const kb = weakTopicNormKey(b);
    if (ka !== kb) return ka.localeCompare(kb);
    return a.topic.localeCompare(b.topic);
  });
}

function quizTopicNormFromHref(href: string): string | null {
  const match = /[?&]topic=([^&]*)/.exec(href);
  if (!match?.[1]) return null;
  const raw = match[1];
  try {
    return normalizeTopicKey(decodeURIComponent(raw.replace(/\+/g, " ")));
  } catch {
    return normalizeTopicKey(raw);
  }
}

/** First weak topic whose canonical key differs from the primary targeted quiz topic (if any). */
function pickSecondaryDrillTopic(weakOrdered: WeakTopicRow[], primaryQuizTopicNorm: string | null): string | null {
  for (const w of weakOrdered) {
    const k = weakTopicNormKey(w);
    if (primaryQuizTopicNorm && k === primaryQuizTopicNorm) continue;
    return w.topic;
  }
  return null;
}

const MAX_STUDY_NEXT_SECONDARY = 2;

/**
 * At most {@link MAX_STUDY_NEXT_SECONDARY} items; no duplicate hrefs; at most one quiz action per topic (encoded in href).
 */
function finalizeStudyNextSecondaries(primary: NextAction, candidates: NextAction[]): NextAction[] {
  const seenHref = new Set<string>([primary.href]);
  const seenQuizTopicNorm = new Set<string>();
  const primaryQuizNorm = primary.kind === "quiz" ? quizTopicNormFromHref(primary.href) : null;
  if (primaryQuizNorm) seenQuizTopicNorm.add(primaryQuizNorm);

  const out: NextAction[] = [];
  for (const a of candidates) {
    if (out.length >= MAX_STUDY_NEXT_SECONDARY) break;
    if (seenHref.has(a.href)) continue;
    const qn = a.kind === "quiz" ? quizTopicNormFromHref(a.href) : null;
    if (qn && seenQuizTopicNorm.has(qn)) continue;
    if (qn) seenQuizTopicNorm.add(qn);
    seenHref.add(a.href);
    out.push(a);
  }
  return out;
}

function paceFromSignals(args: {
  urgency: ExamUrgency | null;
  readinessBand: ReadinessBand;
  weakTopicCount: number;
}): PaceStatus {
  if (args.urgency === "final_stretch") return "final_review";
  if (args.urgency === "near" && (args.readinessBand === "not_ready" || args.weakTopicCount >= 3)) {
    return "behind_weak_review";
  }
  if (args.readinessBand === "not_ready" && args.urgency && args.urgency !== "far") {
    return "slightly_behind";
  }
  return "on_pace";
}

function trajectoryFromSignals(args: {
  lessonPct: number;
  readinessBand: ReadinessBand;
  urgency: ExamUrgency | null;
  weakTopicCount: number;
}): TrajectoryStatus {
  if (args.urgency === "final_stretch") return "final_review";
  if (args.lessonPct < 30 || args.readinessBand === "insufficient_data") return "building_foundation";
  if (args.readinessBand === "not_ready" && args.weakTopicCount >= 2) return "needs_focused_review";
  if (args.readinessBand === "improving") return "improving";
  if (args.readinessBand === "near_ready" || args.readinessBand === "ready") return "on_track";
  return "improving";
}

function explainTrajectory(args: {
  readiness: ReadinessResult;
  weakTop3: string[];
  lessonPct: number;
  days: number | null;
}): string[] {
  const lines: string[] = [];
  if (args.readiness.summary) {
    lines.push(`Exam readiness: ${args.readiness.summary}`);
  }
  if (args.days != null) {
    lines.push(
      args.days > 30
        ? "With your current timeline, steady blocks beat cramming."
        : args.days > 14
          ? "Time remaining supports focused weak-topic work each week."
          : "Shorter horizon. Prioritize gaps that move your readiness the most.",
    );
  } else {
    lines.push("Without a target date, we use mastery-style pacing; add a date anytime for tighter timing.");
  }
  if (args.weakTop3.length) {
    lines.push(`Topics to watch: ${args.weakTop3.slice(0, 3).join(", ")}.`);
  }
  if (args.lessonPct < 50) {
    lines.push(`Lesson completion is about ${args.lessonPct}% of your visible plan. Finishing modules lifts readiness inputs.`);
  }
  return lines.slice(0, 4);
}

export function buildAdaptiveRecommendations(args: {
  examDatePlanType: ExamDatePlanType | null | undefined;
  examDate: Date | null | undefined;
  readiness: ReadinessResult;
  weakTopics: WeakTopicRow[];
  /** Optional momentum lines — fold into weekly priorities when present. */
  topicTrends?: TopicTrendRow[];
  streakDays: number;
  lessonPct: number;
  /** Completed / total lessons in scope — drives weekly lesson targets. */
  lessonsCompleted: number;
  lessonsTotal: number;
  studyCadencePreference: string | null | undefined;
  continueLesson: { title: string; href: string } | null;
  recommendedQuizTopic: string | null;
  mockCount: number;
  practiceSessionCount: number;
  /** Subscriber country (`US` | `CA`) — avoids US-exam-specific wording in Canada. */
  subscriberCountry?: string | null;
}): AdaptiveLearnerRecommendations {
  const weakTopicsOrdered = dedupeWeakTopicsStable(args.weakTopics);
  const isCanadaSubscriber = args.subscriberCountry === "CA";

  const countdown = buildCountdownCopy({
    examDatePlanType: args.examDatePlanType,
    examDate: args.examDate,
  });

  const days = daysUntilExamUtc(args.examDate ?? null);
  const daysDelta = daysDeltaToExamUtc(args.examDate ?? null);
  const weeksRem = weeksRemainingRounded(days);
  const urgency = urgencyFromDays(days);
  const weakTop3 = weakTopicsOrdered
    .slice(0, 3)
    .map((w) => w.topic)
    .filter(Boolean);

  const recNorm = args.recommendedQuizTopic ? normalizeTopicKey(args.recommendedQuizTopic) : null;
  const matchedRec = recNorm ? weakTopicsOrdered.find((w) => weakTopicNormKey(w) === recNorm) : undefined;
  const topic =
    matchedRec?.topic ?? weakTopicsOrdered[0]?.topic ?? (args.recommendedQuizTopic ? args.recommendedQuizTopic : null);

  const weakMixedBankHref = "/app/questions?studyMode=weak";
  const quizHref = topic
    ? `/app/questions?preset=topic_drill&topic=${encodeTopic(topic)}`
    : weakMixedBankHref;

  const coldStartNoWeakNoPathway =
    weakTopicsOrdered.length === 0 &&
    !args.continueLesson &&
    args.lessonsCompleted === 0 &&
    args.practiceSessionCount + args.mockCount === 0;

  const paceStatus = paceFromSignals({
    urgency,
    readinessBand: args.readiness.band,
    weakTopicCount: weakTopicsOrdered.length,
  });

  const planTrack = assessPlanTrack({
    examDatePlanType: args.examDatePlanType,
    examDate: args.examDate,
    readinessBand: args.readiness.band,
    weakTopicCount: weakTopicsOrdered.length,
    streakDays: args.streakDays,
    mockCount: args.mockCount,
    lessonPct: args.lessonPct,
    practiceSessionCount: args.practiceSessionCount,
  });

  const weeklyPlan = buildWeeklyStudyPlan({
    daysRemaining: days,
    weeksRemaining: weeksRem,
    urgency,
    cadence: args.studyCadencePreference,
    lessonPct: args.lessonPct,
    lessonsCompleted: args.lessonsCompleted,
    lessonsTotal: args.lessonsTotal,
  });

  const recovery = buildRecoveryRecommendations({
    daysRemaining: days,
    daysDelta,
    urgency,
    readiness: args.readiness,
    mockCount: args.mockCount,
    streakDays: args.streakDays,
    weakTopics: weakTopicsOrdered,
    lessonPct: args.lessonPct,
  });

  const milestones = buildExamPlanMilestones({
    lessonPct: args.lessonPct,
    mockCount: args.mockCount,
    readiness: args.readiness,
    weakestTopic: weakTop3[0] ?? null,
    examDatePlanType: args.examDatePlanType,
  });

  const trajectory = trajectoryFromSignals({
    lessonPct: args.lessonPct,
    readinessBand: args.readiness.band,
    urgency,
    weakTopicCount: weakTopicsOrdered.length,
  });

  const trajectoryLines = explainTrajectory({
    readiness: args.readiness,
    weakTop3,
    lessonPct: args.lessonPct,
    days,
  });

  const primaryNext: NextAction = (() => {
    if (args.streakDays === 0 && args.practiceSessionCount + args.mockCount > 0) {
      return {
        title: "Pick up where you left off",
        href: args.continueLesson?.href ?? weakMixedBankHref,
        reason: "A short session today keeps your streak and signals moving again.",
        kind: args.continueLesson ? "continue" : "quiz",
      };
    }
    if (coldStartNoWeakNoPathway) {
      return {
        title: "Start your first pathway lesson",
        href: "/app/lessons",
        reason: "Your plan is ready—open a lesson on your exam track, then add short question sets.",
        kind: "lesson",
      };
    }
    if (args.continueLesson && args.lessonPct < 55) {
      return {
        title: `Continue: ${args.continueLesson.title}`,
        href: args.continueLesson.href,
        reason: "Lesson-first work builds context before heavy question volume.",
        kind: "lesson",
      };
    }
    if (urgency === "final_stretch" && args.mockCount < 2) {
      return {
        title: "Run a timed practice exam",
        href: "/app/exams",
        reason: "Near your date. Rehearsal under time mirrors test day.",
        kind: "exams",
      };
    }
    if (topic) {
      return {
        title: `Targeted quiz: ${topic}`,
        href: quizHref,
        reason: "Your recent pattern points here. Short sets beat marathon cramming.",
        kind: "quiz",
      };
    }
    if (args.lessonPct < 40) {
      return {
        title: "Complete a lesson module",
        href: "/app/lessons",
        reason: "Foundation still opening up. Lessons anchor the bank work.",
        kind: "lesson",
      };
    }
    return {
      title: "Weak-first mixed question block",
      href: weakMixedBankHref,
      reason: "No topic signal yet—weak-mode pulls your ledger when available, otherwise mixed items in your scope.",
      kind: "quiz",
    };
  })();

  const primaryQuizNorm = primaryNext.kind === "quiz" ? quizTopicNormFromHref(primaryNext.href) : null;
  const secondaryDrillTopic = pickSecondaryDrillTopic(weakTopicsOrdered, primaryQuizNorm);

  const secondaryCandidates: NextAction[] = [];
  if (primaryNext.kind !== "lesson" && args.continueLesson) {
    secondaryCandidates.push({
      title: `Lesson: ${args.continueLesson.title}`,
      href: args.continueLesson.href,
      reason: "Alternate reading with questions for retention.",
      kind: "lesson",
    });
  }
  if (secondaryDrillTopic) {
    secondaryCandidates.push({
      title: `Drill ${secondaryDrillTopic}`,
      href: `/app/questions?preset=topic_drill&topic=${encodeTopic(secondaryDrillTopic)}`,
      reason: "Your next-highest weak signal after the primary pick—different topic when one exists.",
      kind: "quiz",
    });
  }
  secondaryCandidates.push({
    title: "Weak-area study mode (bank)",
    href: weakMixedBankHref,
    reason: "Prioritizes topics your ledger flags. Less random-only drilling.",
    kind: "quiz",
  });
  if (urgency === "near" || urgency === "final_stretch") {
    secondaryCandidates.push({
      title: isCanadaSubscriber ? "Adaptive practice test" : "Adaptive (CAT) practice test",
      href: "/app/practice-tests/start",
      reason: isCanadaSubscriber
        ? "Computer-adaptive practice adjusts difficulty—useful when your exam is close."
        : "CAT adjusts difficulty. Useful when the exam is close.",
      kind: "cat",
    });
  } else {
    secondaryCandidates.push({
      title: "Timed mock exam",
      href: "/app/exams",
      reason: "Mocks show pacing and stamina. Use occasionally even early on.",
      kind: "mock",
    });
  }
  secondaryCandidates.push({
    title: "Weak-topic flashcards",
    href: "/app/flashcards/weak-areas",
    reason: "Ties missed bank concepts to short spaced-repetition reps.",
    kind: "review",
  });

  const dedupedSecondary = finalizeStudyNextSecondaries(primaryNext, secondaryCandidates);

  const weeklyPriorities: string[] = [];
  weeklyPriorities.push(
    `This week: ~${weeklyPlan.questionVolume} scored questions, ${weeklyPlan.lessonsToFinish} lesson module(s), ${weeklyPlan.flashcardSessions} short flashcard session(s)`,
  );
  weeklyPriorities.push(weeklyPlan.mockTiming);
  if (weakTop3.length) {
    weeklyPriorities.push(`Tackle weak signals: ${weakTop3.slice(0, 2).join(", ")}`);
  }
  const trends = args.topicTrends ?? [];
  const declining = trends
    .filter((t) => t.momentum === "declining")
    .sort((a, b) => a.topic.localeCompare(b.topic))
    .slice(0, 2);
  const improving = trends
    .filter((t) => t.momentum === "improving")
    .sort((a, b) => a.topic.localeCompare(b.topic))
    .slice(0, 2);
  if (declining.length) {
    weeklyPriorities.push(`Stabilize: ${declining.map((t) => t.topic).join(", ")} (recent misses)`);
  }
  if (improving.length && weeklyPriorities.length < 4) {
    weeklyPriorities.push(`Keep momentum on: ${improving.map((t) => t.topic).join(", ")}`);
  }
  if (args.mockCount < 2 && (urgency === "near" || urgency === "final_stretch")) {
    weeklyPriorities.push("Schedule at least one full mock-style attempt this week");
  } else if (args.mockCount < 1) {
    weeklyPriorities.push("Log a mock or long timed block to anchor readiness");
  }
  if (args.lessonPct < 80) {
    weeklyPriorities.push("Advance one lesson pathway module you have not finished");
  }
  if (!weeklyPriorities.length) {
    weeklyPriorities.push("Rotate question bank, one mock, and one weak-topic drill");
  }

  const todayFocus: string[] = [];
  if (primaryNext.title) todayFocus.push(primaryNext.title);
  if (weakTop3[0]) todayFocus.push(`Short block on ${weakTop3[0]}`);
  if (args.streakDays < 3) todayFocus.push("15–25 minutes to extend your study streak");
  else todayFocus.push("One timed segment plus rationales review");
  todayFocus.push(`${cadenceLabel(args.studyCadencePreference)}. ${weeklyPlan.rationale}`);

  const readinessTimelineLine =
    args.readiness.score != null && days != null
      ? `Readiness score ${args.readiness.score}/100 with ${days} day${days === 1 ? "" : "s"} on the calendar. Trajectory depends on consistent practice, not a single number.`
      : args.readiness.score != null
        ? `Readiness score ${args.readiness.score}/100. Add an exam date for time-aware pacing.`
        : null;

  return {
    countdown,
    paceStatus,
    trajectory,
    trajectoryLines,
    primaryNext,
    secondary: dedupedSecondary,
    weakTop3,
    holdingBackLabels: args.readiness.holdingBack ?? [],
    weeklyPriorities: weeklyPriorities.slice(0, 6),
    todayFocus: todayFocus.slice(0, 5),
    readinessTimelineLine,
    planTrack,
    weeklyPlan,
    recovery,
    milestones,
    cadenceDisplay: cadenceLabel(args.studyCadencePreference),
    studyCadencePreference:
      args.studyCadencePreference === "light" || args.studyCadencePreference === "steady" || args.studyCadencePreference === "intensive"
        ? args.studyCadencePreference
        : null,
    adaptiveLoop: null,
  };
}

/** Fixed weak-topic rows for conversion previews — not user-derived. */
const CONVERSION_PREVIEW_WEAK_TOPICS: WeakTopicRow[] = [
  {
    topic: "Pharmacology & dosing",
    missed: 5,
    attempted: 18,
    missRate: 5 / 18,
    normalizedTopic: "pharmacology dosing",
    weakPriorityScore: 0.72,
  },
  {
    topic: "Fluid & electrolytes",
    missed: 3,
    attempted: 14,
    missRate: 3 / 14,
    normalizedTopic: "fluid electrolytes",
    weakPriorityScore: 0.55,
  },
];

/**
 * Deterministic Study Next payload for paywall / marketing previews only.
 * Uses real {@link computeReadiness} + {@link buildAdaptiveRecommendations} — not any learner's data.
 * Callers must label the UI as a sample (no implied personalization).
 */
export function buildSimulatedAdaptiveRecommendationsForConversionPreview(): AdaptiveLearnerRecommendations {
  const readiness = computeReadiness({
    practiceCorrect: 48,
    practiceTotal: 72,
    recentMocks: [{ score: 58, total: 85 }],
    weakTopics: CONVERSION_PREVIEW_WEAK_TOPICS,
    lessonsCompleted: 5,
    lessonsAvailable: 28,
    scope: { tier: "NCLEX_RN", country: "US" },
  });

  const sampleExamDate = new Date();
  sampleExamDate.setUTCDate(sampleExamDate.getUTCDate() + 52);

  return buildAdaptiveRecommendations({
    examDatePlanType: ExamDatePlanType.PROPOSED,
    examDate: sampleExamDate,
    readiness,
    weakTopics: CONVERSION_PREVIEW_WEAK_TOPICS,
    streakDays: 4,
    lessonPct: 42,
    lessonsCompleted: 5,
    lessonsTotal: 28,
    studyCadencePreference: "steady",
    continueLesson: { title: "Sample pathway module (illustration)", href: "/pricing" },
    recommendedQuizTopic: CONVERSION_PREVIEW_WEAK_TOPICS[0]!.topic,
    mockCount: 1,
    practiceSessionCount: 6,
    subscriberCountry: "US",
  });
}

// ─── Post-test remediation (Study Next engine, post_test profile) ───

export type PostTestStudyNextActionKind = "weak_topic_lesson" | "weak_topic_qbank" | "next_pathway_lesson";

export type PostTestStudyNextAction = {
  title: string;
  href: string;
  reason: string;
  kind: PostTestStudyNextActionKind;
};

export type PostTestStudyNextBundle = {
  primary: PostTestStudyNextAction;
  secondary: PostTestStudyNextAction[];
};

/** Enriched weak-topic row with resolved hrefs (server supplies links; engine only ranks and dedupes). */
export type PostTestRemediationInputRow = {
  topicLabel: string;
  topicCode: string | null;
  missCount: number;
  lessonHref: string;
  qbankHref: string;
};

/**
 * Study Next — post-test profile: for each topic in rank order, emit weak_topic_lesson then weak_topic_qbank,
 * then take the first three unique hrefs as 1 primary + up to 2 secondaries.
 */
export function recommendNextActions(rows: PostTestRemediationInputRow[]): PostTestStudyNextBundle | null {
  if (rows.length === 0) return null;

  const candidates: PostTestStudyNextAction[] = [];
  for (const r of rows) {
    const reason =
      r.missCount >= 2
        ? "You missed multiple questions in this topic"
        : "You missed a question in this topic";
    candidates.push({
      kind: "weak_topic_lesson",
      href: r.lessonHref,
      title: `Review lesson · ${r.topicLabel}`,
      reason,
    });
    candidates.push({
      kind: "weak_topic_qbank",
      href: r.qbankHref,
      title: `Question bank · ${r.topicLabel}`,
      reason,
    });
  }

  const seenHref = new Set<string>();
  const picked: PostTestStudyNextAction[] = [];
  for (const c of candidates) {
    if (seenHref.has(c.href)) continue;
    seenHref.add(c.href);
    picked.push(c);
    if (picked.length >= 3) break;
  }

  if (picked.length === 0) return null;
  return {
    primary: picked[0]!,
    secondary: picked.slice(1, 3),
  };
}

export type LessonContinueNextArgs = {
  currentLessonId: string;
  nextPathwayLesson: { id: string; title: string } | null;
  weakRows: PostTestRemediationInputRow[];
};

/**
 * Study Next — lesson-end profile: next pathway lesson first, then weak-topic qbank then lesson links,
 * excluding the current lesson URL and duplicate hrefs (max 1 primary + 2 secondaries).
 */
export function recommendNextActionsForLessonContinue(args: LessonContinueNextArgs): PostTestStudyNextBundle | null {
  const currentLessonHref = `/app/lessons/${args.currentLessonId}`;
  const candidates: PostTestStudyNextAction[] = [];

  if (args.nextPathwayLesson && args.nextPathwayLesson.id !== args.currentLessonId) {
    candidates.push({
      kind: "next_pathway_lesson",
      href: `/app/lessons/${args.nextPathwayLesson.id}`,
      title: `Next lesson: ${args.nextPathwayLesson.title}`,
      reason: "Continue your pathway in order.",
    });
  }

  for (const r of args.weakRows) {
    const reason =
      r.missCount >= 2
        ? "Several recent misses in this area — short practice helps it stick."
        : "Light practice here balances what you just studied.";
    candidates.push({
      kind: "weak_topic_qbank",
      href: r.qbankHref,
      title: `Question bank · ${r.topicLabel}`,
      reason,
    });
    candidates.push({
      kind: "weak_topic_lesson",
      href: r.lessonHref,
      title: `Review lesson · ${r.topicLabel}`,
      reason,
    });
  }

  const seenHref = new Set<string>();
  const picked: PostTestStudyNextAction[] = [];
  for (const c of candidates) {
    if (c.href === currentLessonHref) continue;
    if (seenHref.has(c.href)) continue;
    seenHref.add(c.href);
    picked.push(c);
    if (picked.length >= 3) break;
  }

  if (picked.length === 0) return null;
  return {
    primary: picked[0]!,
    secondary: picked.slice(1, 3),
  };
}
