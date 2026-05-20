import type { CatCoachErrorPattern } from "@/lib/practice-tests/cat-results-coach";
import type { ClinicalJudgmentPattern, StructuredClinicalInsight } from "@/lib/learner/post-exam-coaching/types";

const PATTERN_META: Record<
  ClinicalJudgmentPattern,
  { label: string; educatorFrame: string }
> = {
  premature_closure: {
    label: "Premature closure",
    educatorFrame: "You may be locking an answer before the full clinical picture is weighted.",
  },
  unsafe_prioritization: {
    label: "Unsafe prioritization",
    educatorFrame: "Stabilization and escalation cues need to lead before task-focused options.",
  },
  delayed_escalation: {
    label: "Delayed escalation",
    educatorFrame: "When status changes, escalation timing is as important as the final intervention.",
  },
  task_before_assessment: {
    label: "Task before assessment",
    educatorFrame: "Complete assessment and monitoring gaps before procedural or comfort interventions.",
  },
  monitoring_gap: {
    label: "Monitoring gap",
    educatorFrame: "Pair abnormal findings with what you would reassess next and how often.",
  },
  delegation_risk: {
    label: "Delegation risk",
    educatorFrame: "Unstable or assessment-heavy situations usually stay with the licensed nurse.",
  },
  hesitant_intervention: {
    label: "Hesitant intervention",
    educatorFrame: "Correct choices with slow timing often mean fragile confidence under pressure.",
  },
  sata_partial_reasoning: {
    label: "SATA partial reasoning",
    educatorFrame: "Evaluate each option independently; partial SATA credit rewards omitted safe steps.",
  },
  medication_safety_gap: {
    label: "Medication safety gap",
    educatorFrame: "Re-check contraindications, monitoring, and hold parameters on pharmacology stems.",
  },
  lifespan_context_gap: {
    label: "Lifespan context gap",
    educatorFrame: "Age and setting change expected findings — compare normal vs urgent for that population.",
  },
};

const CODE_MAP: Record<string, ClinicalJudgmentPattern> = {
  sata: "sata_partial_reasoning",
  prioritization: "unsafe_prioritization",
  infection_control: "monitoring_gap",
  delegation: "delegation_risk",
  labs: "monitoring_gap",
  medication_safety: "medication_safety_gap",
  lifespan: "lifespan_context_gap",
  communication: "premature_closure",
};

export function mapCoachPatternToTaxonomy(pattern: CatCoachErrorPattern): ClinicalJudgmentPattern {
  return CODE_MAP[pattern.code] ?? "unsafe_prioritization";
}

export function buildStructuredClinicalInsights(
  coachPatterns: CatCoachErrorPattern[],
  extraFocusDomains: string[],
): StructuredClinicalInsight[] {
  const out: StructuredClinicalInsight[] = [];

  for (const p of coachPatterns) {
    const pattern = mapCoachPatternToTaxonomy(p);
    const meta = PATTERN_META[pattern];
    out.push({
      pattern,
      patternLabel: meta.label,
      domain: "Clinical judgment",
      guidance: `${meta.educatorFrame} ${p.detail}`,
      emphasis: "focus",
    });
  }

  for (const d of extraFocusDomains.slice(0, 2)) {
    if (out.some((i) => i.domain === d)) continue;
    out.push({
      pattern: "unsafe_prioritization",
      patternLabel: "Domain gap",
      domain: d,
      guidance: `Repeated misses in ${d} suggest revisiting decision frameworks for unstable-patient scenarios, not fact memorization alone.`,
      emphasis: "focus",
    });
  }

  return out.slice(0, 6);
}
