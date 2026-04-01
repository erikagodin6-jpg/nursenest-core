import type { ExplainableAction } from "@/lib/insights/types";
import type { NextAction } from "@/lib/learner/adaptive-recommendations";

function howForKind(kind: NextAction["kind"]): string {
  switch (kind) {
    case "lesson":
      return "Structured content builds schemas so questions stick — especially for weak areas.";
    case "quiz":
      return "Short, focused sets give fast feedback and update your topic ledger.";
    case "mock":
    case "exams":
      return "Timed blocks train pacing and expose gaps that untimed drills hide.";
    case "cat":
      return "Adaptive difficulty approximates exam-style targeting of your ability level.";
    case "review":
      return "Spaced repetition reduces forgetting between longer study sessions.";
    case "continue":
      return "Finishing what you started prevents half-learned concepts from compounding.";
    case "settings":
      return "Aligning your exam date and plan type unlocks time-aware priorities.";
    default:
      return "Small consistent steps beat occasional marathon sessions for long-term retention.";
  }
}

export function explainNextAction(a: NextAction): ExplainableAction {
  const kindMap: Record<NextAction["kind"], ExplainableAction["kind"]> = {
    lesson: "lesson",
    quiz: "quiz",
    mock: "mock",
    cat: "cat",
    review: "review",
    continue: "continue",
    settings: "settings",
    exams: "exams",
  };
  return {
    title: a.title,
    href: a.href,
    kind: kindMap[a.kind] ?? "quiz",
    why: a.reason,
    what: `Use “${a.title}” as your next concrete step.`,
    how: howForKind(a.kind),
  };
}
