import type { LinearDeliveryMode, LinearRationaleVisibility } from "@/lib/practice-tests/types";

export type PracticeExamSessionMode = "tutor" | "exam";
export type PracticeExamRationaleVisibilityMode = "immediate" | "review";
export type PracticeExamSelectionMode = "random" | "targeted" | "weak";

export type BuildPracticeExamStartPayloadInput = {
  title?: string | null;
  questionCount: number;
  selectionMode: PracticeExamSelectionMode;
  topicNames?: string[];
  pathwayId?: string | null;
  timedMode: boolean;
  timeLimitSec?: number | null;
  difficultyMin?: number | null;
  difficultyMax?: number | null;
  sessionMode: PracticeExamSessionMode;
  rationaleVisibilityMode: PracticeExamRationaleVisibilityMode;
};

function toLinearDeliveryMode(
  sessionMode: PracticeExamSessionMode,
  rationaleVisibilityMode: PracticeExamRationaleVisibilityMode,
): LinearDeliveryMode {
  if (sessionMode === "tutor") return "practice";
  if (rationaleVisibilityMode === "review") return "exam";
  return "practice";
}

function toLinearRationaleVisibility(mode: PracticeExamRationaleVisibilityMode): LinearRationaleVisibility {
  return mode === "immediate" ? "after_each" : "end_of_exam";
}

function normalizeTopicNames(topicNames: string[] | undefined): string[] {
  if (!topicNames || topicNames.length === 0) return [];
  const deduped = new Set<string>();
  for (const topic of topicNames) {
    const cleaned = topic.trim();
    if (!cleaned) continue;
    deduped.add(cleaned);
  }
  return Array.from(deduped);
}

export function buildPracticeExamStartPayload(input: BuildPracticeExamStartPayloadInput) {
  const questionCount = Math.max(5, Math.min(100, Math.floor(input.questionCount)));
  const topicNames = normalizeTopicNames(input.topicNames);
  const linearDeliveryMode = toLinearDeliveryMode(input.sessionMode, input.rationaleVisibilityMode);
  return {
    title: input.title?.trim() || undefined,
    questionCount,
    selectionMode: input.selectionMode,
    topicNames,
    pathwayId: input.pathwayId?.trim() || null,
    timedMode: input.timedMode,
    timeLimitSec: input.timedMode ? input.timeLimitSec ?? null : null,
    difficultyMin: input.difficultyMin ?? null,
    difficultyMax: input.difficultyMax ?? null,
    linearDeliveryMode,
    linearRationaleVisibility: toLinearRationaleVisibility(
      linearDeliveryMode === "practice" ? "immediate" : "review",
    ),
  };
}
