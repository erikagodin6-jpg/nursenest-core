import type { CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";

export type ClinicalOrderingSequence = {
  id: string;
  title: string;
  steps: string[];
  /** When learner picks these canonical filters, prefer this sequence. */
  canonicalTags: CanonicalStudyCategoryId[];
};

/**
 * Pathway-agnostic nursing priority templates (not exam-key hard-coded).
 * Used when exam rows do not include explicit ordering items.
 */
export const CLINICAL_ORDERING_SEQUENCES: ClinicalOrderingSequence[] = [
  {
    id: "primary_survey",
    title: "Primary survey (adult)",
    steps: ["Assess responsiveness", "Airway with cervical spine protection", "Breathing and ventilation", "Circulation and bleeding control", "Disability (neuro)", "Exposure and environment"],
    canonicalTags: ["emergency_critical_care", "fundamentals_safety"],
  },
  {
    id: "pain_escalation",
    title: "Pain reassessment ladder (general)",
    steps: ["Reassess pain intensity and quality", "Evaluate route and timing of analgesia", "Consider non-pharmacologic adjuncts", "Escalate per order set / protocol", "Document response and adverse effects"],
    canonicalTags: ["fundamentals_safety", "pharmacology"],
  },
  {
    id: "infection_precautions",
    title: "Transmission-based precautions order",
    steps: ["Perform hand hygiene", "Don appropriate PPE before entry", "Maintain room and equipment discipline", "Handle waste and linen per policy", "Doff PPE safely at exit", "Perform hand hygiene after removal"],
    canonicalTags: ["immune_infection_control", "fundamentals_safety"],
  },
  {
    id: "dka_priorities",
    title: "DKA stabilization priorities (initial)",
    steps: ["Assess airway and mental status", "Establish IV access and cardiac monitoring", "Restore intravascular volume", "Begin insulin therapy per protocol", "Monitor glucose, electrolytes, and acid-base status", "Watch for complications (hypokalemia, cerebral edema risk)"],
    canonicalTags: ["endocrine", "emergency_critical_care"],
  },
  {
    id: "stroke_timeline",
    title: "Acute stroke workflow (screening)",
    steps: ["Recognize sudden focal deficits", "Activate stroke team / rapid assessment", "Establish last known well time", "Obtain non-contrast CT / imaging per protocol", "Prepare for reperfusion eligibility", "Admit to monitored setting with neuro checks"],
    canonicalTags: ["neurological", "emergency_critical_care"],
  },
  {
    id: "aki_monitoring",
    title: "AKI monitoring priorities",
    steps: ["Trend intake and output", "Monitor daily weights", "Review creatinine and electrolytes", "Assess volume status", "Protect renal insults (nephrotoxins, hypotension)", "Escalate concerning trends to provider"],
    canonicalTags: ["renal_urinary", "lab_values_diagnostics"],
  },
  {
    id: "delegation_sequence",
    title: "Safe delegation sequence",
    steps: ["Assess stability and predictability of the task", "Verify scope and competency of the delegatee", "Provide clear, complete instructions", "Establish supervision level and checkpoints", "Evaluate outcomes and intervene if needed", "Document delegation and follow-up"],
    canonicalTags: ["delegation_assignment", "leadership_management"],
  },
];

export function orderingSequencesForCategories(selected: CanonicalStudyCategoryId[]): ClinicalOrderingSequence[] {
  if (selected.length === 0) return [...CLINICAL_ORDERING_SEQUENCES];
  const hit = CLINICAL_ORDERING_SEQUENCES.filter((s) => s.canonicalTags.some((t) => selected.includes(t)));
  return hit.length > 0 ? hit : [...CLINICAL_ORDERING_SEQUENCES];
}
