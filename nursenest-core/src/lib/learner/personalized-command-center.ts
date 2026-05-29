import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { withPathwayScopeHref } from "@/lib/learner/pathway-scoped-href";

export type PersonalizedCommandCenterActivityKind =
  | "lesson"
  | "questions"
  | "flashcards"
  | "cat"
  | "ecg"
  | "pharmacology"
  | "clinical_skills";

export type PersonalizedCommandCenterActivity = {
  kind: PersonalizedCommandCenterActivityKind;
  label: string;
  title: string;
  detail: string;
  minutes: number;
  href: string;
  reason: string;
};

export type PersonalizedCommandCenterPlan = {
  focusTopic: string;
  estimatedMinutes: number;
  currentReadiness: number | null;
  predictedReadiness: number | null;
  strengthAreas: string[];
  weakAreas: string[];
  activities: PersonalizedCommandCenterActivity[];
  startHref: string;
  startLabel: string;
  explanation: string;
};

function uniqueLabels(items: Array<string | null | undefined>, max: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const label = item?.trim();
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
    if (out.length >= max) break;
  }
  return out;
}

function topicParam(topic: string): string {
  return encodeURIComponent(topic);
}

function matchesAny(topic: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(topic));
}

function activityExists(activities: PersonalizedCommandCenterActivity[], kind: PersonalizedCommandCenterActivityKind): boolean {
  return activities.some((activity) => activity.kind === kind);
}

function addActivity(
  activities: PersonalizedCommandCenterActivity[],
  activity: PersonalizedCommandCenterActivity,
): void {
  if (activityExists(activities, activity.kind)) return;
  activities.push(activity);
}

function pathwayHref(href: string, pathwayId: string | null): string {
  return withPathwayScopeHref(href, pathwayId);
}

export function buildPersonalizedCommandCenterPlan(args: {
  snapshot: PremiumDashboardSnapshot;
  studySnap: LearnerStudySnapshot | null;
  preferredPathwayId: string | null;
}): PersonalizedCommandCenterPlan {
  const { snapshot, studySnap, preferredPathwayId } = args;
  const weakAreas = uniqueLabels(
    [
      ...(studySnap?.weakTopics.map((topic) => topic.topic) ?? []),
      ...snapshot.readiness.topWeakAreas,
      ...snapshot.readiness.holdingBack,
      snapshot.recommendedQuizTopic,
    ],
    5,
  );
  const strengthAreas = uniqueLabels(
    [
      ...(studySnap?.strongTopicsHighlight.map((topic) => topic.topic) ?? []),
      ...snapshot.momentumMessages
        .filter((message) => /performing well|strong|improved/i.test(message))
        .map((message) => message.replace(/^Performing well in\s+/i, "").replace(/\..*$/, "")),
    ],
    4,
  );

  const focusTopic = weakAreas[0] ?? studySnap?.recommendedFocusTopic ?? snapshot.recommendedQuizTopic ?? "Core readiness";
  const normalizedFocus = focusTopic.toLowerCase();
  const activities: PersonalizedCommandCenterActivity[] = [];

  const lessonHref = studySnap?.weakTopicPathwayLesson?.href ?? snapshot.continueLesson?.href ?? "/app/lessons";
  addActivity(activities, {
    kind: "lesson",
    label: "Learn",
    title: studySnap?.weakTopicPathwayLesson
      ? `Review ${studySnap.weakTopicPathwayLesson.title}`
      : snapshot.continueLesson
        ? `Continue ${snapshot.continueLesson.title}`
        : `Review ${focusTopic}`,
    detail: "Targeted lesson review",
    minutes: 12,
    href: lessonHref,
    reason: "Start with a short concept review so practice is anchored to the clinical idea.",
  });

  addActivity(activities, {
    kind: "questions",
    label: "Practice",
    title: `${snapshot.readiness.score != null && snapshot.readiness.score >= 72 ? 15 : 10} ${focusTopic} questions`,
    detail: "Targeted question set",
    minutes: snapshot.readiness.score != null && snapshot.readiness.score >= 72 ? 18 : 14,
    href: pathwayHref(
      `/app/questions/start?studyFilter=weak&count=${snapshot.readiness.score != null && snapshot.readiness.score >= 72 ? 15 : 10}&topic=${topicParam(focusTopic)}`,
      preferredPathwayId,
    ),
    reason: "Questions confirm whether the review transferred into clinical judgment.",
  });

  if (studySnap?.hasWeakTopicFlashcards || snapshot.flashcards?.suggestedDecks.length) {
    addActivity(activities, {
      kind: "flashcards",
      label: "Recall",
      title: `${snapshot.readiness.score != null && snapshot.readiness.score >= 72 ? 10 : 15} ${focusTopic} flashcards`,
      detail: "Spaced recall set",
      minutes: 10,
      href: pathwayHref(`/app/flashcards?topic=${topicParam(focusTopic)}`, preferredPathwayId),
      reason: "Flashcards reinforce the same topic with low-friction retrieval practice.",
    });
  }

  if (matchesAny(normalizedFocus, [/ecg|cardiac|cardio|rhythm|telemetry|heart/])) {
    addActivity(activities, {
      kind: "ecg",
      label: "Interpret",
      title: "ECG review",
      detail: "Rhythm and clinical response",
      minutes: 8,
      href: "/app/ecg-video-quiz",
      reason: "Cardiac weak areas improve faster when rhythm interpretation is practiced alongside questions.",
    });
  }

  if (matchesAny(normalizedFocus, [/pharm|medicat|drug|insulin|endocrine|anticoag|opioid|antibiotic/])) {
    addActivity(activities, {
      kind: "pharmacology",
      label: "Medication safety",
      title: "Pharmacology review",
      detail: "Medication reasoning",
      minutes: 10,
      href: "/app/pharmacology",
      reason: "Medication weak areas need concept review, nursing implications, and safety checks together.",
    });
  }

  if (matchesAny(normalizedFocus, [/skill|assessment|safety|delegation|priorit|communication|documentation|infection/])) {
    addActivity(activities, {
      kind: "clinical_skills",
      label: "Apply",
      title: "Clinical skills practice",
      detail: "Competency reinforcement",
      minutes: 10,
      href: "/app/clinical-skills",
      reason: "Clinical skills help connect knowledge to safe bedside action.",
    });
  }

  if (
    snapshot.readiness.score != null &&
    snapshot.readiness.score >= 70 &&
    activities.length < 5
  ) {
    addActivity(activities, {
      kind: "cat",
      label: "Assess",
      title: "Mini CAT",
      detail: "Readiness check",
      minutes: 24,
      href: pathwayHref("/app/cat", preferredPathwayId),
      reason: "A short adaptive check validates readiness without turning today into a long exam block.",
    });
  }

  const balanced = activities.slice(0, 4);
  const estimatedMinutes = balanced.reduce((sum, activity) => sum + activity.minutes, 0);
  const currentReadiness = snapshot.readiness.score;
  const readinessLift = Math.min(5, Math.max(2, Math.round(estimatedMinutes / 14)));
  const predictedReadiness =
    currentReadiness == null ? null : Math.min(100, currentReadiness + readinessLift);

  return {
    focusTopic,
    estimatedMinutes,
    currentReadiness,
    predictedReadiness,
    strengthAreas,
    weakAreas,
    activities: balanced,
    startHref: balanced[0]?.href ?? "/app/guided",
    startLabel: "Start My Session",
    explanation:
      weakAreas.length > 0
        ? `Built from your weakest current signal: ${weakAreas[0]}.`
        : "Built from your pathway progress and recent study activity.",
  };
}
