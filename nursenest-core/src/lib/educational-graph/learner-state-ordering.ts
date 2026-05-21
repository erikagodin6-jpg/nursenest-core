import type { RnCompetencyId } from "@/lib/educational-graph/rn-competency-ontology";
import { resolveRnCompetencyForTopic } from "@/lib/educational-graph/rn-competency-ontology";
import type { EduGraphStep, EduGraphStepKind } from "@/lib/educational-graph/graph-step-contract";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

const UNSTABLE_COMPETENCY_PRIORITY: RnCompetencyId[] = [
  "perfusion_hemodynamics",
  "respiratory_instability",
  "infection_sepsis",
  "acid_base_gas_exchange",
  "pharmacology_safety",
  "clinical_judgment",
];

const KIND_WEIGHT_AUTHENTICATED: Record<EduGraphStepKind, number> = {
  mechanism: 10,
  interpretation: 9,
  lesson: 8,
  glossary: 5,
  prioritization_drill: 7,
  mixed_case: 6,
  flashcards: 4,
  remediation_review: 6,
  reassessment: 3,
  cat_exam: 2,
  loft_simulation: 2,
};

function competencyUrgency(competencyId: string | null, state: RnLearnerStateSnapshot | null): number {
  if (!competencyId || !state) return 0;
  const row = state.competencyStates.find((c) => c.competencyId === competencyId);
  if (!row) return UNSTABLE_COMPETENCY_PRIORITY.includes(competencyId as RnCompetencyId) ? 5 : 0;
  let score = 100 - row.masteryScore;
  if (row.persistentWeak) score += 25;
  if (row.volatility === "declining" || row.volatility === "volatile") score += 15;
  if (UNSTABLE_COMPETENCY_PRIORITY.includes(competencyId as RnCompetencyId)) score += 10;
  return score;
}

function topicWeakScore(topicSlug: string, persistentWeakTopics: readonly string[]): number {
  const lower = topicSlug.toLowerCase();
  for (let i = 0; i < persistentWeakTopics.length; i++) {
    const w = persistentWeakTopics[i]!.toLowerCase();
    if (lower.includes(w) || w.includes(lower.replace(/-/g, " "))) return 50 - i * 5;
  }
  return 0;
}

/**
 * Re-order graph steps for authenticated learners — unstable competencies and measurement gaps first.
 */
export function orderStepsForLearnerState(args: {
  steps: EduGraphStep[];
  learnerState: RnLearnerStateSnapshot | null;
  persistentWeakTopics?: readonly string[];
  measurementWeaknesses?: readonly string[];
  recentHrefs?: ReadonlySet<string>;
  remediationFatigueCap?: number;
}): EduGraphStep[] {
  const fatigue = args.learnerState?.remediationFatigueScore ?? 0;
  const maxSteps = fatigue >= 0.7 ? Math.min(5, args.remediationFatigueCap ?? 8) : (args.remediationFatigueCap ?? 8);
  const measurementBoost = new Set(args.measurementWeaknesses ?? args.learnerState?.measurementWeaknesses ?? []);

  const scored = args.steps.map((step) => {
    let score = KIND_WEIGHT_AUTHENTICATED[step.stepKind] ?? 0;
    score += competencyUrgency(step.competencyId, args.learnerState);
    score += topicWeakScore(step.topicSlug, args.persistentWeakTopics ?? []);
    if (step.stepKind === "interpretation" && measurementBoost.size > 0) score += 12;
    if (args.recentHrefs?.has(step.href)) score -= 40;
    return { step, score };
  });

  scored.sort((a, b) => b.score - a.score || a.step.graphDepth - b.step.graphDepth);

  const seen = new Set<string>();
  const out: EduGraphStep[] = [];
  for (const { step } of scored) {
    if (seen.has(step.href)) continue;
    seen.add(step.href);
    out.push({
      ...step,
      remediationPriority: out.length + 1,
      learnerStateReason:
        step.learnerStateReason ??
        (competencyUrgency(step.competencyId, args.learnerState) > 20
          ? "Prioritized for persistent competency gap"
          : null),
    });
    if (out.length >= maxSteps) break;
  }
  return out;
}

/** Editorial progression for public / anonymous surfaces. */
export function orderStepsEditorial(steps: EduGraphStep[], maxSteps: number): EduGraphStep[] {
  const editorialOrder: EduGraphStepKind[] = [
    "mechanism",
    "lesson",
    "interpretation",
    "glossary",
    "prioritization_drill",
    "mixed_case",
    "flashcards",
    "reassessment",
    "cat_exam",
    "loft_simulation",
  ];
  const sorted = [...steps].sort(
    (a, b) => editorialOrder.indexOf(a.stepKind) - editorialOrder.indexOf(b.stepKind) || a.graphDepth - b.graphDepth,
  );
  const seen = new Set<string>();
  const out: EduGraphStep[] = [];
  for (const step of sorted) {
    if (seen.has(step.href)) continue;
    seen.add(step.href);
    out.push({ ...step, remediationPriority: out.length + 1, learnerStateReason: null });
    if (out.length >= maxSteps) break;
  }
  return out;
}

export function resolveTopicCompetencyId(topicSlug: string): RnCompetencyId | null {
  return resolveRnCompetencyForTopic(topicSlug)?.id ?? null;
}
