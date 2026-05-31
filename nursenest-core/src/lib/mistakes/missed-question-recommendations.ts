import type { MistakeReason } from "./mistake-types";

export type MissedQuestionRecommendation = {
  label: string;
  href: string;
  kind: "lesson" | "flashcards" | "practice";
};

function queryFor(topic: string | null | undefined, pathwayId: string | null | undefined, extra?: Record<string, string>) {
  const params = new URLSearchParams();
  if (topic?.trim()) params.set("topic", topic.trim());
  if (pathwayId?.trim()) params.set("pathwayId", pathwayId.trim());
  for (const [key, value] of Object.entries(extra ?? {})) {
    params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function missedQuestionReasonCoaching(reason: MistakeReason | null): string {
  switch (reason) {
    case "knowledge_gap":
      return "Start with a short lesson, then reinforce the same concept with flashcards before drilling questions.";
    case "misread_question":
      return "Slow the stem down. Identify the time frame, priority cue, and what the question is actually asking before choosing.";
    case "second_guessed":
      return "Only change an answer when the stem gives a concrete reason. Track what evidence made you switch.";
    case "calculation_error":
      return "Write the formula, carry units through the calculation, and check whether the final value is clinically realistic.";
    case "rushed":
      return "Use shorter timed sets and pause briefly before submitting. Accuracy is the pattern to rebuild first.";
    case "fatigue_distraction":
      return "Use a shorter focused review block and stop when attention drops. Protect the quality of the reps.";
    default:
      return "Review the concept, then practice the same topic again while the clinical reasoning is fresh.";
  }
}

export function buildMissedQuestionRecommendations(input: {
  topic?: string | null;
  pathwayId?: string | null;
}): MissedQuestionRecommendation[] {
  const topicLabel = input.topic?.trim() || "this topic";
  return [
    {
      kind: "lesson",
      label: `Review ${topicLabel} lesson`,
      href: `/app/lessons${queryFor(input.topic, input.pathwayId)}`,
    },
    {
      kind: "flashcards",
      label: `Study ${topicLabel} flashcards`,
      href: `/app/flashcards${queryFor(input.topic, input.pathwayId, { filter: "weak-areas" })}`,
    },
    {
      kind: "practice",
      label: `Practice ${topicLabel} questions`,
      href: `/app/practice-tests${queryFor(input.topic, input.pathwayId, { focus: "missed" })}`,
    },
  ];
}
