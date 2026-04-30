import type { ClinicalNursingScenarioDifficulty, ClinicalNursingScenarioTier } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";

export type BranchingSeedOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  rationale: string;
  consequence: { trajectory: "improves" | "unchanged" | "deteriorates"; effect: "unlock" | "limit" | "escalate" | "delay" };
};

export function optCorrect(text: string, rationale: string): BranchingSeedOption {
  return { id: "", text, isCorrect: true, rationale, consequence: { trajectory: "improves", effect: "unlock" } };
}

export function optWrongDelay(text: string, rationale: string): BranchingSeedOption {
  return { id: "", text, isCorrect: false, rationale, consequence: { trajectory: "unchanged", effect: "delay" } };
}

export function optWrongLimit(text: string, rationale: string): BranchingSeedOption {
  return { id: "", text, isCorrect: false, rationale, consequence: { trajectory: "deteriorates", effect: "limit" } };
}

export function optWrongEscalate(text: string, rationale: string): BranchingSeedOption {
  return { id: "", text, isCorrect: false, rationale, consequence: { trajectory: "deteriorates", effect: "escalate" } };
}

export type BranchingSeedStage = {
  orderIndex: number;
  scenarioText: string;
  vitals: Prisma.InputJsonValue;
  assessmentFindings: string;
  labUpdates: Prisma.InputJsonValue | null;
  questionStem: string;
  options: BranchingSeedOption[];
  /** Stage-level rationale shown after commit (summary of best path). */
  rationale: string;
  clinicalJudgmentFocus: string;
  /** Linear cases use null; branching uses explicit orderIndex of next stage. */
  nextStageOrder: number | null;
};

export type BranchingSeedScenarioSpec = {
  seedKey: string;
  pathwayId: string;
  tierFocus: ClinicalNursingScenarioTier;
  difficulty: ClinicalNursingScenarioDifficulty;
  title: string;
  canonicalCategoryId: CanonicalStudyCategoryId;
  patientAgeContext: string;
  presentingConcern: string;
  briefHistory: string;
  medicationsAllergies: string | null;
  initialVitals: Prisma.InputJsonValue;
  assessmentFindings: string;
  labsDiagnostics: Prisma.InputJsonValue | null;
  referencesJson: Prisma.InputJsonValue;
  stages: BranchingSeedStage[];
};

export const TIER_PATHWAY: Record<
  ClinicalNursingScenarioTier,
  { pathwayId: string; stemLead: string; judgmentHint: string }
> = {
  RN_NCLEX_RN: {
    pathwayId: "ca-rn-nclex-rn",
    stemLead: "As the RN,",
    judgmentHint: "Prioritization · first action · safety",
  },
  RPN_PN: {
    pathwayId: "ca-rpn-rex-pn",
    stemLead: "As the PN/RPN,",
    judgmentHint: "Monitoring · escalation · scope-appropriate care",
  },
  NP: {
    pathwayId: "ca-np-cnple",
    stemLead: "As the NP,",
    judgmentHint: "Differential · diagnostics · prescribing",
  },
  NEW_GRAD: {
    pathwayId: "us-rn-new-grad-transition",
    stemLead: "As a new grad RN,",
    judgmentHint: "What to report · red flags · avoiding common traps",
  },
};

export function leadStem(tier: ClinicalNursingScenarioTier, rest: string): string {
  return `${TIER_PATHWAY[tier].stemLead} ${rest}`.replace(/\s+/g, " ").trim();
}

export function optionsToPrismaJson(opts: BranchingSeedOption[]): Prisma.InputJsonValue {
  return opts.map((o) => ({
    id: o.id,
    text: o.text,
    isCorrect: o.isCorrect,
    rationale: o.rationale,
    consequence: o.consequence,
  }));
}

export function whyWrongFromOptions(opts: BranchingSeedOption[]): Prisma.InputJsonValue {
  const m: Record<string, string> = {};
  for (const o of opts) {
    if (!o.isCorrect) m[o.id] = o.rationale;
  }
  return m;
}

export function consequencesFromOptions(opts: BranchingSeedOption[]): Prisma.InputJsonValue {
  const m: Record<string, string> = {};
  for (const o of opts) {
    const t = o.consequence.trajectory;
    m[o.id] =
      t === "improves" ? "patient improves" : t === "deteriorates" ? "patient deteriorates" : "patient unchanged";
  }
  return m;
}

export function correctId(opts: BranchingSeedOption[]): string {
  const c = opts.find((o) => o.isCorrect);
  if (!c) throw new Error("branching_seed_missing_correct_option");
  return c.id;
}
