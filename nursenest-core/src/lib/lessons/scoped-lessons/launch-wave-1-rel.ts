/** Shared related-lesson links for Launch Wave 1 scoped gold lessons. */
export const RELATED_CORE = {
  sepsis: { slug: "sepsis-early-recognition-gold", title: "Sepsis early recognition" },
  shock: { slug: "shock-emergencies-gold", title: "Shock emergencies" },
  fluids: { slug: "fluids-electrolytes-emergencies-gold", title: "Fluids & electrolyte emergencies" },
  cj: { slug: "clinical-judgment-prioritization-gold", title: "Clinical judgment & prioritization" },
  acs: { slug: "acute-coronary-syndrome-gold", title: "Acute coronary syndrome" },
  ham: { slug: "high-alert-medications-safety-gold", title: "High-alert medication safety" },
  stroke: { slug: "stroke-increased-icp-gold", title: "Stroke & increased ICP" },
  copd: { slug: "copd-clinical-judgment-gold", title: "COPD clinical judgment" },
  /** Link target for cross-family rationales (exam-complete medication & safety injectables). */
  dka: { slug: "dka-hhs-hyperglycemic-emergencies-gold", title: "DKA & HHS hyperglycemic emergencies" },
  medAbx: { slug: "med-family-antibiotics-gold", title: "Antibiotics — nursing implications" },
  medAnticoag: { slug: "med-family-anticoagulants-gold", title: "Anticoagulants — monitoring & safety" },
  medInsulin: { slug: "med-family-insulin-diabetes-gold", title: "Insulin & diabetes medications" },
  medCardiac: { slug: "med-family-cardiac-gold", title: "Cardiac medications (ischemia & rhythm)" },
  medAntihtn: { slug: "med-family-antihypertensives-gold", title: "Antihypertensives" },
  medResp: { slug: "med-family-respiratory-gold", title: "Respiratory medications" },
  medPsych: { slug: "med-family-psychotropic-gold", title: "Psychotropic medications" },
  medPain: { slug: "med-family-pain-sedation-gold", title: "Pain & sedation medications" },
  medEmerg: { slug: "med-family-emergency-response-gold", title: "Emergency response medications" },
  safeInfx: { slug: "safety-family-infection-control-gold", title: "Infection control & standard precautions" },
  safeIso: { slug: "safety-family-isolation-precautions-gold", title: "Isolation & transmission precautions" },
  safeFalls: { slug: "safety-family-falls-prevention-gold", title: "Falls prevention & safety" },
  safeRestraint: { slug: "safety-family-restraints-alternatives-gold", title: "Restraints & least-restrictive alternatives" },
  safeMedAdmin: { slug: "safety-family-medication-administration-gold", title: "Medication administration & error prevention" },
  safeDeleg: { slug: "safety-family-delegation-supervision-gold", title: "Delegation & supervision" },
  safeEscal: { slug: "safety-family-escalation-notification-gold", title: "Escalation & when to notify" },
  safePrior: { slug: "safety-family-prioritization-uncertainty-gold", title: "Prioritization under uncertainty" },
  rpnScope: { slug: "canadian-rpn-scope-collaboration-gold", title: "Canadian RPN scope & collaboration" },
} as const;

export function rel(...keys: (keyof typeof RELATED_CORE)[]): {
  relatedSlugs: string[];
  relatedTitlesBySlug: Record<string, string>;
} {
  const relatedSlugs = keys.map((k) => RELATED_CORE[k].slug);
  const relatedTitlesBySlug = Object.fromEntries(keys.map((k) => [RELATED_CORE[k].slug, RELATED_CORE[k].title]));
  return { relatedSlugs, relatedTitlesBySlug };
}
