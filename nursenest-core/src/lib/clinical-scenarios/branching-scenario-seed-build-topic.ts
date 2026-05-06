import type { ClinicalNursingScenarioDifficulty, ClinicalNursingScenarioTier } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";
import {
  leadStem,
  type BranchingSeedOption,
  type BranchingSeedScenarioSpec,
  type BranchingSeedStage,
  TIER_PATHWAY,
} from "@/lib/clinical-scenarios/branching-scenario-seed-types";

export type RawTopicDef = {
  slug: string;
  categoryId: CanonicalStudyCategoryId;
  titleBase: string;
  patientAgeContext: string;
  presentingConcern: string;
  briefHistory: string;
  medicationsAllergies: string | null;
  initialVitals: Prisma.InputJsonValue;
  assessmentFindings: string;
  labsDiagnostics: Prisma.InputJsonValue | null;
  stages: Array<{
    scenarioLead: string;
    stemTail: string;
    assessmentFindings: string;
    vitals: Prisma.InputJsonValue;
    labUpdates: Prisma.InputJsonValue | null;
    options: BranchingSeedOption[];
    rationale: string;
  }>;
};

function withIds(slug: string, orderIndex: number, opts: BranchingSeedOption[]): BranchingSeedOption[] {
  return opts.map((o, i) => ({
    ...o,
    id: o.id || `opt_${slug}_${orderIndex}_${["a", "b", "c", "d"][i] ?? "x"}`,
  }));
}

export function rawTopicToSpec(
  tier: ClinicalNursingScenarioTier,
  difficulty: ClinicalNursingScenarioDifficulty,
  topic: RawTopicDef,
): BranchingSeedScenarioSpec {
  const pathwayId = TIER_PATHWAY[tier].pathwayId;
  const seedKey = `b1-${tier}-${topic.slug}`;
  const title = `[seed:${seedKey}] ${topic.titleBase}`.slice(0, 240);
  const judgment = TIER_PATHWAY[tier].judgmentHint;

  const stages: BranchingSeedStage[] = topic.stages.map((s, idx) => {
    const opts = withIds(topic.slug, idx, s.options);
    return {
      orderIndex: idx,
      scenarioText: s.scenarioLead,
      vitals: s.vitals,
      assessmentFindings: s.assessmentFindings,
      labUpdates: s.labUpdates,
      questionStem: leadStem(tier, s.stemTail),
      options: opts,
      rationale: s.rationale,
      clinicalJudgmentFocus: judgment,
      nextStageOrder: null,
    };
  });

  return {
    seedKey,
    pathwayId,
    tierFocus: tier,
    difficulty,
    title,
    canonicalCategoryId: topic.categoryId,
    patientAgeContext: topic.patientAgeContext,
    presentingConcern: topic.presentingConcern,
    briefHistory: topic.briefHistory,
    medicationsAllergies: topic.medicationsAllergies,
    initialVitals: topic.initialVitals,
    assessmentFindings: topic.assessmentFindings,
    labsDiagnostics: topic.labsDiagnostics,
    referencesJson: [{ kind: "scenario_seed", key: seedKey }] as unknown as Prisma.InputJsonValue,
    stages,
  };
}
