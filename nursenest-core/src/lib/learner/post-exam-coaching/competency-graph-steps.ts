import { remediationLessonsTopicHref, remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import type { CompetencyGraphStep, CoachingModel } from "@/lib/learner/post-exam-coaching/types";

function flashcardsHref(pathwayId: string | null, topic: string): string {
  const q = new URLSearchParams();
  if (pathwayId) q.set("pathwayId", pathwayId);
  if (topic.trim()) q.set("q", topic.trim());
  const qs = q.toString();
  return qs ? `/app/flashcards?${qs}` : "/app/flashcards";
}

/**
 * Scaffolded remediation ladder: mechanism framing → lesson → flashcards → drill → reassessment.
 */
export function buildCompetencyGraphSteps(args: {
  topic: string;
  pathwayId: string | null;
  coachingModel: CoachingModel;
  exposureDepth: number;
}): CompetencyGraphStep[] {
  const { topic, pathwayId, coachingModel, exposureDepth } = args;
  const depth = Math.min(4, Math.max(0, exposureDepth));

  const mechanismTitle =
    coachingModel === "loft_readiness"
      ? `Clinical decision frame: ${topic}`
      : `Mechanism check: ${topic}`;

  const steps: CompetencyGraphStep[] = [
    {
      depth: 0,
      kind: "mechanism",
      title: mechanismTitle,
      reason: `Name the assessment cue and first safe action for ${topic} before memorizing isolated facts.`,
      href: remediationLessonsTopicHref(topic, null, pathwayId),
    },
    {
      depth: 1,
      kind: "lesson",
      title: `Lesson: ${topic}`,
      reason: "Consolidate the clinical story and decision rules in one focused lesson block.",
      href: remediationLessonsTopicHref(topic, null, pathwayId),
    },
    {
      depth: 2,
      kind: "flashcards",
      title: `Flashcards: ${topic}`,
      reason: "Stabilize recall so reasoning under time pressure does not collapse.",
      href: flashcardsHref(pathwayId, topic),
    },
    {
      depth: 3,
      kind: "drill",
      title: `Targeted drill: ${topic}`,
      reason: "Apply judgment on fresh stems after review — this is where licensing-style gaps surface.",
      href: remediationTopicDrillHref(topic, pathwayId),
    },
    {
      depth: 4,
      kind: coachingModel === "loft_readiness" ? "simulation" : "readiness_reassessment",
      title: coachingModel === "loft_readiness" ? "LOFT reassessment" : "Readiness reassessment",
      reason:
        coachingModel === "loft_readiness"
          ? "Repeat a fixed-length simulation to confirm domain balance under exam pacing."
          : "Run a short adaptive or timed set to verify the gap closed before full exam simulation.",
      href:
        coachingModel === "loft_readiness"
          ? "/app/cases/cnple"
          : pathwayId
            ? `/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(pathwayId)}`
            : "/app/practice-tests",
    },
  ];

  return steps.slice(depth, depth + 3);
}
