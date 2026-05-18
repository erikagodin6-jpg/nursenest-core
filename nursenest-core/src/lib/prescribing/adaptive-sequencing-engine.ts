import type {
  PrescribingAttemptRecord,
  PrescribingNextStepRecommendation
} from "./adaptive-sequencing-types";

export function buildAdaptiveRecommendations(
  attempts: PrescribingAttemptRecord[]
): PrescribingNextStepRecommendation[] {
  const recommendations: PrescribingNextStepRecommendation[] = [];

  const stewardshipWeakness = attempts.some(
    (attempt) => attempt.stewardshipScore < 60
  );

  if (stewardshipWeakness) {
    recommendations.push({
      activityType: "coverage-drill",
      title: "Repeat Antibiotic Coverage Drills",
      rationale:
        "Recent attempts suggest unsafe escalation or organism targeting gaps.",
      priority: "high",
      href: "/app/prescribing/coverage"
    });
  }

  const renalWeakness = attempts.some(
    (attempt) =>
      attempt.domain === "renal-dosing" && attempt.score < 70
  );

  if (renalWeakness) {
    recommendations.push({
      activityType: "renal-dosing",
      title: "Renal Dosing Reinforcement",
      rationale:
        "Recent prescribing attempts demonstrated renal-adjustment safety gaps.",
      priority: "high",
      href: "/app/prescribing/renal-dosing"
    });
  }

  const documentationWeakness = attempts.some(
    (attempt) =>
      attempt.domain === "documentation" && attempt.safetyMisses > 0
  );

  if (documentationWeakness) {
    recommendations.push({
      activityType: "documentation",
      title: "SOAP Documentation Review",
      rationale:
        "Important escalation or follow-up documentation elements were missed.",
      priority: "moderate",
      href: "/app/prescribing/documentation"
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      activityType: "case-runner",
      title: "Advance to Complex Prescribing Cases",
      rationale:
        "Recent performance suggests readiness for more advanced longitudinal scenarios.",
      priority: "low",
      href: "/app/prescribing/cases"
    });
  }

  return recommendations;
}
