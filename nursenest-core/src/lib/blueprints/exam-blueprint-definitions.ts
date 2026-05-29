import { ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type BlueprintDomainTarget = {
  id: string;
  label: string;
  targetPercent: number;
  objectives: string[];
};

export type ExamBlueprintDefinition = {
  id: string;
  label: string;
  examFamilies: string[];
  sourceLabel: string;
  sourceUrl: string;
  reviewedAt: string;
  domains: BlueprintDomainTarget[];
};

const CORE_NURSING_DOMAINS: BlueprintDomainTarget[] = [
  {
    id: "cardiovascular",
    label: "Cardiovascular",
    targetPercent: 15,
    objectives: ["Perfusion", "hemodynamics", "shock recognition", "cardiac medications", "rhythm safety"],
  },
  {
    id: "respiratory",
    label: "Respiratory",
    targetPercent: 13,
    objectives: ["Airway", "oxygenation", "ventilation", "COPD/asthma", "respiratory deterioration"],
  },
  {
    id: "mental_health",
    label: "Mental Health",
    targetPercent: 12,
    objectives: ["Therapeutic communication", "safety risk", "crisis intervention", "psychopharmacology"],
  },
  {
    id: "maternal_newborn",
    label: "Maternal-Newborn",
    targetPercent: 10,
    objectives: ["Pregnancy complications", "labor", "postpartum", "newborn assessment"],
  },
  {
    id: "pediatrics",
    label: "Pediatrics",
    targetPercent: 9,
    objectives: ["Growth and development", "pediatric safety", "family teaching", "common pediatric illness"],
  },
  {
    id: "pharmacology",
    label: "Pharmacology",
    targetPercent: 14,
    objectives: ["Medication safety", "adverse effects", "high-alert medications", "patient teaching"],
  },
  {
    id: "safety_infection_control",
    label: "Safety & Infection Control",
    targetPercent: 12,
    objectives: ["Standard precautions", "isolation", "falls", "error prevention", "environmental safety"],
  },
  {
    id: "leadership_delegation",
    label: "Leadership, Prioritization & Delegation",
    targetPercent: 8,
    objectives: ["Scope of practice", "delegation", "prioritization", "assignment", "professional practice"],
  },
  {
    id: "fundamentals",
    label: "Fundamentals & Health Promotion",
    targetPercent: 7,
    objectives: ["Assessment", "basic care", "teaching", "health promotion", "documentation"],
  },
];

const NP_CNPLE_DOMAINS: BlueprintDomainTarget[] = [
  { id: "assessment_diagnosis", label: "Assessment & Diagnosis", targetPercent: 22, objectives: ["History", "physical exam", "differential diagnosis", "diagnostic reasoning"] },
  { id: "clinical_management", label: "Clinical Management", targetPercent: 24, objectives: ["Treatment planning", "follow-up", "chronic disease", "acute presentations"] },
  { id: "pharmacology", label: "Pharmacology & Prescribing", targetPercent: 18, objectives: ["Prescribing decisions", "contraindications", "monitoring", "patient education"] },
  { id: "professional_practice", label: "Professional Practice", targetPercent: 12, objectives: ["Ethics", "collaboration", "scope", "documentation"] },
  { id: "health_promotion", label: "Health Promotion", targetPercent: 10, objectives: ["Screening", "prevention", "risk reduction", "patient counseling"] },
  { id: "mental_health", label: "Mental Health", targetPercent: 8, objectives: ["Mood disorders", "risk assessment", "psychopharmacology", "referral"] },
  { id: "maternal_pediatrics", label: "Maternal, Pediatric & Lifespan", targetPercent: 6, objectives: ["Lifespan care", "family practice", "reproductive health", "pediatrics"] },
];

const RT_DOMAINS: BlueprintDomainTarget[] = [
  { id: "airway_ventilation", label: "Airway & Ventilation", targetPercent: 26, objectives: ["Airway management", "mechanical ventilation", "oxygen delivery", "weaning"] },
  { id: "cardiopulmonary_assessment", label: "Cardiopulmonary Assessment", targetPercent: 18, objectives: ["ABGs", "breath sounds", "hemodynamics", "monitoring"] },
  { id: "respiratory_disease", label: "Respiratory Disease", targetPercent: 18, objectives: ["COPD", "asthma", "ARDS", "pneumonia", "neonatal/pediatric respiratory care"] },
  { id: "critical_care_emergency", label: "Critical Care & Emergency Response", targetPercent: 15, objectives: ["ACLS support", "rapid deterioration", "shock", "transport"] },
  { id: "diagnostics_equipment", label: "Diagnostics & Equipment", targetPercent: 13, objectives: ["Pulmonary diagnostics", "equipment checks", "troubleshooting", "safety"] },
  { id: "professional_practice", label: "Professional Practice", targetPercent: 10, objectives: ["Communication", "infection control", "documentation", "ethics"] },
];

const ALLIED_DOMAINS: BlueprintDomainTarget[] = [
  { id: "professional_practice", label: "Professional Practice", targetPercent: 15, objectives: ["Scope", "ethics", "communication", "documentation"] },
  { id: "safety_infection_control", label: "Safety & Infection Control", targetPercent: 15, objectives: ["Infection prevention", "patient safety", "equipment safety"] },
  { id: "assessment_diagnostics", label: "Assessment & Diagnostics", targetPercent: 20, objectives: ["Clinical data", "diagnostic findings", "measurement accuracy"] },
  { id: "cardiopulmonary", label: "Cardiopulmonary", targetPercent: 15, objectives: ["Perfusion", "oxygenation", "respiratory assessment"] },
  { id: "procedures_skills", label: "Procedures & Skills", targetPercent: 20, objectives: ["Profession-specific procedures", "technical skill", "quality control"] },
  { id: "clinical_reasoning", label: "Clinical Reasoning", targetPercent: 15, objectives: ["Prioritization", "recognition of risk", "escalation"] },
];

export const EXAM_BLUEPRINTS: Record<string, ExamBlueprintDefinition> = {
  nclex_rn: {
    id: "nclex_rn",
    label: "NCLEX-RN Blueprint",
    examFamilies: [ExamFamily.NCLEX_RN],
    sourceLabel: "NCSBN NCLEX-RN Test Plan",
    sourceUrl: "https://www.ncsbn.org/nclex.page",
    reviewedAt: "2026-05-29",
    domains: CORE_NURSING_DOMAINS,
  },
  nclex_pn: {
    id: "nclex_pn",
    label: "NCLEX-PN Blueprint",
    examFamilies: [ExamFamily.NCLEX_PN],
    sourceLabel: "NCSBN NCLEX-PN Test Plan",
    sourceUrl: "https://www.ncsbn.org/nclex.page",
    reviewedAt: "2026-05-29",
    domains: CORE_NURSING_DOMAINS,
  },
  rex_pn: {
    id: "rex_pn",
    label: "REx-PN Blueprint",
    examFamilies: [ExamFamily.REX_PN],
    sourceLabel: "REx-PN Test Plan",
    sourceUrl: "https://www.rexpn.com/",
    reviewedAt: "2026-05-29",
    domains: CORE_NURSING_DOMAINS,
  },
  cnple: {
    id: "cnple",
    label: "CNPLE Blueprint",
    examFamilies: [ExamFamily.NP],
    sourceLabel: "Canadian NP exam blueprint",
    sourceUrl: "https://www.np-education.ca/",
    reviewedAt: "2026-05-29",
    domains: NP_CNPLE_DOMAINS,
  },
  rt: {
    id: "rt",
    label: "Respiratory Therapy Blueprint",
    examFamilies: [ExamFamily.ALLIED],
    sourceLabel: "Respiratory therapy exam competency blueprint",
    sourceUrl: "https://www.csrt.com/",
    reviewedAt: "2026-05-29",
    domains: RT_DOMAINS,
  },
  allied: {
    id: "allied",
    label: "Allied Health Blueprint",
    examFamilies: [ExamFamily.ALLIED],
    sourceLabel: "Profession-specific allied health competency blueprint",
    sourceUrl: "https://www.nursenest.ca/allied-health",
    reviewedAt: "2026-05-29",
    domains: ALLIED_DOMAINS,
  },
};

export function blueprintForPathway(pathway: ExamPathwayDefinition): ExamBlueprintDefinition {
  if (pathway.id === "ca-np-cnple") return EXAM_BLUEPRINTS.cnple;
  if (pathway.examFamily === ExamFamily.NCLEX_RN) return EXAM_BLUEPRINTS.nclex_rn;
  if (pathway.examFamily === ExamFamily.NCLEX_PN) return EXAM_BLUEPRINTS.nclex_pn;
  if (pathway.examFamily === ExamFamily.REX_PN) return EXAM_BLUEPRINTS.rex_pn;
  if (pathway.examFamily === ExamFamily.ALLIED && /rt|respiratory/i.test(`${pathway.id} ${pathway.displayName}`)) {
    return EXAM_BLUEPRINTS.rt;
  }
  if (pathway.examFamily === ExamFamily.ALLIED) return EXAM_BLUEPRINTS.allied;
  if (pathway.examFamily === ExamFamily.NP) return EXAM_BLUEPRINTS.cnple;
  return EXAM_BLUEPRINTS.allied;
}
