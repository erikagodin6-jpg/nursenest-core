import type { ExamBlueprintDefinition } from "@/lib/blueprints/exam-blueprint-definitions";

type DomainRule = {
  domainId: string;
  pattern: RegExp;
};

const DOMAIN_RULES: DomainRule[] = [
  { domainId: "cardiovascular", pattern: /cardio|heart|coronary|rhythm|ecg|ekg|perfusion|shock|hemodynamic|vascular|hypertension|stroke/i },
  { domainId: "respiratory", pattern: /resp|airway|oxygen|ventilat|copd|asthma|pneumonia|ards|pulmonary|trach|suction/i },
  { domainId: "mental_health", pattern: /mental|psych|anxiety|depress|suicide|bipolar|schizo|substance|addiction|therapeutic communication/i },
  { domainId: "maternal_newborn", pattern: /maternal|obstetric|pregnan|labor|delivery|postpartum|newborn|neonate|fetal|prenatal/i },
  { domainId: "pediatrics", pattern: /pediatric|child|infant|toddler|adolescent|growth|development/i },
  { domainId: "pharmacology", pattern: /pharm|medication|drug|insulin|opioid|heparin|warfarin|anticoag|antibiotic|dose|dosage|prescrib/i },
  { domainId: "safety_infection_control", pattern: /safety|infection|isolation|aseptic|fall|restraint|precaution|sterile|error|harm/i },
  { domainId: "leadership_delegation", pattern: /delegat|priority|priorit|leadership|assignment|scope|uap|lpn|rpn|charge nurse|professional practice/i },
  { domainId: "fundamentals", pattern: /fundamental|assessment|health promotion|teaching|documentation|mobility|hygiene|nutrition|comfort|skin|wound/i },
  { domainId: "assessment_diagnosis", pattern: /diagnos|assessment|differential|history|physical|investigation|diagnostic/i },
  { domainId: "clinical_management", pattern: /management|treatment|follow-up|chronic|acute|intervention|plan/i },
  { domainId: "professional_practice", pattern: /professional|ethic|legal|collaboration|communication|documentation|scope|practice/i },
  { domainId: "health_promotion", pattern: /screening|prevention|promotion|vaccin|immuniz|counsel|lifestyle/i },
  { domainId: "maternal_pediatrics", pattern: /maternal|pediatric|child|pregnan|reproductive|lifespan|family/i },
  { domainId: "airway_ventilation", pattern: /airway|ventilat|intubat|oxygen|wean|peep|bipap|cpap/i },
  { domainId: "cardiopulmonary_assessment", pattern: /cardiopulmonary|abg|breath|hemodynamic|monitor|perfusion|oxygenation/i },
  { domainId: "respiratory_disease", pattern: /copd|asthma|ards|pneumonia|respiratory|pulmonary|bronch/i },
  { domainId: "critical_care_emergency", pattern: /critical|emergency|code|acls|rapid|shock|arrest|trauma/i },
  { domainId: "diagnostics_equipment", pattern: /equipment|diagnostic|spirometry|quality control|troubleshoot|device/i },
  { domainId: "assessment_diagnostics", pattern: /assessment|diagnostic|lab|measurement|data|interpret/i },
  { domainId: "cardiopulmonary", pattern: /cardio|resp|pulmonary|oxygen|perfusion|heart/i },
  { domainId: "procedures_skills", pattern: /procedure|skill|technical|equipment|competenc|simulation|lab/i },
  { domainId: "clinical_reasoning", pattern: /reasoning|priority|judgment|escalat|recognition|cue|decision/i },
];

export function normalizeBlueprintDomain(
  blueprint: ExamBlueprintDefinition,
  signals: readonly (string | null | undefined)[],
): string | null {
  const text = signals.filter(Boolean).join(" ").trim();
  if (!text) return null;
  const allowed = new Set(blueprint.domains.map((domain) => domain.id));
  for (const rule of DOMAIN_RULES) {
    if (allowed.has(rule.domainId) && rule.pattern.test(text)) return rule.domainId;
  }
  const lowered = text.toLowerCase();
  return blueprint.domains.find((domain) => lowered.includes(domain.label.toLowerCase()))?.id ?? null;
}
