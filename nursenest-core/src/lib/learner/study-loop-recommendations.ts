import { appCatWeakFocusPath } from "@/lib/exam-pathways/pathway-cat-flow";

/**
 * Client-safe study-loop helpers: aggregate per-session performance and build next-step URLs.
 * Recommendations prioritize topics with incorrect answers, then tie-break by volume.
 */

export type GradedLearningLoop = {
  topicCode: string | null;
  confidence: "high" | "medium" | "low";
  lessonHref: string | null;
  flashcardsHref: string | null;
  topicDrillHref: string | null;
} | null;

export type QuestionBankGradedRow = {
  correct: boolean;
  learningLoop?: GradedLearningLoop;
};

export type QuestionBankRowForRollup = {
  id: string;
  topic?: string | null;
};

export type SessionTopicRollup = {
  /** Display label (question bank topic string). */
  topic: string;
  wrong: number;
  right: number;
  lessonHref: string | null;
  topicDrillHref: string | null;
  topicCode: string | null;
};

function pickBetterLoop(
  a: NonNullable<GradedLearningLoop>,
  b: NonNullable<GradedLearningLoop>,
): NonNullable<GradedLearningLoop> {
  const score = (x: NonNullable<GradedLearningLoop>) =>
    (x.lessonHref ? 4 : 0) + (x.topicDrillHref ? 2 : 0) + (x.confidence === "high" ? 2 : x.confidence === "medium" ? 1 : 0);
  return score(b) > score(a) ? b : a;
}

/**
 * Roll up graded items in the current batch by topic; attach remediation links from the first
 * incorrect (preferring rows with a lesson link).
 */
export function buildSessionTopicRollup(
  questions: QuestionBankRowForRollup[],
  graded: Record<string, QuestionBankGradedRow>,
): SessionTopicRollup[] {
  const byTopic = new Map<
    string,
    { wrong: number; right: number; loop: NonNullable<GradedLearningLoop> | null }
  >();

  for (const q of questions) {
    const g = graded[q.id];
    if (!g) continue;
    const topic = (q.topic ?? "").trim() || "General";
    let row = byTopic.get(topic);
    if (!row) {
      row = { wrong: 0, right: 0, loop: null };
      byTopic.set(topic, row);
    }
    if (g.correct) {
      row.right += 1;
    } else {
      row.wrong += 1;
      const loop = g.learningLoop ?? null;
      if (loop) {
        row.loop = row.loop ? pickBetterLoop(row.loop, loop) : loop;
      }
    }
  }

  return [...byTopic.entries()]
    .map(([topic, v]) => ({
      topic,
      wrong: v.wrong,
      right: v.right,
      lessonHref: v.loop?.lessonHref ?? null,
      topicDrillHref: v.loop?.topicDrillHref ?? null,
      topicCode: v.loop?.topicCode ?? null,
    }))
    .filter((r) => r.wrong + r.right > 0)
    .sort((a, b) => b.wrong - a.wrong || b.right + b.wrong - (a.right + a.wrong));
}

export function sessionWeakTopics(rollup: SessionTopicRollup[]): SessionTopicRollup[] {
  return rollup.filter((r) => r.wrong > 0);
}

/** Stable question-bank URL for a topic, optionally scoped to pathway. */
export function buildAppTopicDrillHref(args: {
  topic: string;
  topicCode: string | null;
  pathwayId: string | null;
}): string {
  const qs = new URLSearchParams();
  qs.set("preset", "topic_drill");
  if (args.topic) qs.set("topic", args.topic);
  if (args.topicCode?.trim()) qs.set("topicCode", args.topicCode.trim());
  if (args.pathwayId?.trim()) qs.set("pathwayId", args.pathwayId.trim());
  return `/app/questions?${qs.toString()}`;
}

export function practiceTestsWeakFocusHref(pathwayId: string | null): string {
  return appCatWeakFocusPath(pathwayId);
}

/** Signed-in practice-tests hub with pathway pre-selected (`PracticeTestsHubClient` reads `pathwayId`). */
export function buildAppPracticeTestsHubHref(pathwayId: string): string {
  const id = pathwayId.trim();
  if (!id) return "/app/practice-tests";
  return `/app/practice-tests?pathwayId=${encodeURIComponent(id)}`;
}
