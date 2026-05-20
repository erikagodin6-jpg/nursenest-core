export type NclexRnCoverageConcept = {
  clientNeed: string;
  subcategory?: string;
  concepts: string[];
  requiredLessonSignals: string[];
  requiredQuestionSignals: string[];
  minimumLessonCount: number;
  minimumQuestionCount: number;
  minimumNgnCaseCount: number;
  minimumSataCount: number;
};

export const NCLEX_RN_2026_SOURCE = {
  publisher: "National Council of State Boards of Nursing (NCSBN)",
  title: "2026 NCLEX-RN Test Plan",
  effective: "April 1, 2026 through March 31, 2029",
  url: "https://www.nclex.com/test-plans.page",
  note: "This map is an original NurseNest coverage-control taxonomy derived from public test-plan categories and entry-level RN competency expectations. It is not copied test-plan text or third-party question-bank content.",
} as const;

export const NCLEX_RN_2026_COVERAGE_MAP: NclexRnCoverageConcept[] = [
  {
    clientNeed: "Safe and Effective Care Environment",
    subcategory: "Management of Care",
    concepts: [
      "advance directives and client rights",
      "assignment, delegation, and supervision",
      "case management and continuity of care",
      "confidentiality, privacy, HIPAA/PHIPA-aware practice",
      "ethical practice and informed consent",
      "legal responsibilities and mandatory reporting",
      "prioritization using ABCs, Maslow, acuity, stability, and least restrictive care",
      "quality improvement, risk management, and incident reporting",
      "resource management and interprofessional collaboration",
      "safe discharge planning, referrals, home care, and transitions of care",
      "SBAR, handoff communication, documentation, and chain of command",
    ],
    requiredLessonSignals: ["delegation", "prioritization", "SBAR", "scope", "legal", "ethical", "handoff", "discharge"],
    requiredQuestionSignals: ["delegate", "assign", "first", "priority", "report", "handoff", "scope"],
    minimumLessonCount: 12,
    minimumQuestionCount: 100,
    minimumNgnCaseCount: 12,
    minimumSataCount: 15,
  },
  {
    clientNeed: "Safe and Effective Care Environment",
    subcategory: "Safety and Infection Prevention and Control",
    concepts: [
      "accident prevention and fall prevention",
      "bioterrorism and emergency response basics",
      "ergonomic principles and safe patient handling",
      "error prevention, high-alert medication safeguards, and two-identifier verification",
      "hazardous materials, radiation, chemotherapy, and sharps safety",
      "infection chain, asepsis, hand hygiene, PPE, isolation precautions",
      "medical and surgical asepsis, sterile technique, wound contamination prevention",
      "restraints, seclusion, least restrictive care, and safety alternatives",
      "seizure, aspiration, suicide, elopement, and violence precautions",
      "specimen handling, exposure response, and post-exposure reporting",
    ],
    requiredLessonSignals: ["infection", "PPE", "isolation", "safety", "fall", "restraint", "asepsis", "exposure"],
    requiredQuestionSignals: ["precaution", "PPE", "isolation", "fall", "restraint", "sterile", "safety"],
    minimumLessonCount: 12,
    minimumQuestionCount: 100,
    minimumNgnCaseCount: 12,
    minimumSataCount: 15,
  },
  {
    clientNeed: "Health Promotion and Maintenance",
    concepts: [
      "aging process, health screening, immunizations, and anticipatory guidance",
      "antepartum, intrapartum, postpartum, and newborn care",
      "developmental stages and milestones across the lifespan",
      "family planning, fertility, contraception, and reproductive health",
      "health promotion, lifestyle counseling, disease prevention, and screening schedules",
      "high-risk pregnancy warning signs and obstetric emergencies",
      "newborn assessment, thermoregulation, feeding, jaundice, and safety",
      "pediatric growth, nutrition, injury prevention, and caregiver education",
      "prenatal labs, fetal monitoring concepts, labor stages, and postpartum complications",
    ],
    requiredLessonSignals: ["screening", "immunization", "development", "prenatal", "postpartum", "newborn", "teaching"],
    requiredQuestionSignals: ["milestone", "pregnant", "postpartum", "newborn", "screening", "immunization", "teaching"],
    minimumLessonCount: 18,
    minimumQuestionCount: 120,
    minimumNgnCaseCount: 15,
    minimumSataCount: 18,
  },
  {
    clientNeed: "Psychosocial Integrity",
    concepts: [
      "abuse, neglect, intimate partner violence, trafficking, and mandatory reporting",
      "addiction, withdrawal, overdose safety, and therapeutic communication",
      "anxiety, mood disorders, psychosis, personality disorders, and eating disorders",
      "behavioral interventions, de-escalation, crisis care, and milieu safety",
      "coping, grief, loss, end-of-life psychosocial support, and spiritual care",
      "cultural humility, family dynamics, sexuality, and support systems",
      "mental status examination, suicide risk, self-harm, and violence risk",
      "psychotropic medication safety, adverse effects, and adherence teaching",
      "therapeutic communication, boundaries, defense mechanisms, and trauma-informed care",
    ],
    requiredLessonSignals: ["therapeutic communication", "suicide", "abuse", "psychotropic", "crisis", "trauma", "coping"],
    requiredQuestionSignals: ["therapeutic", "suicide", "safety", "abuse", "withdrawal", "hallucination", "de-escalation"],
    minimumLessonCount: 18,
    minimumQuestionCount: 120,
    minimumNgnCaseCount: 15,
    minimumSataCount: 18,
  },
  {
    clientNeed: "Physiological Integrity",
    subcategory: "Basic Care and Comfort",
    concepts: [
      "assistive devices, mobility, positioning, transfer safety, and immobility complications",
      "bowel and bladder elimination, ostomy care, catheter care, and continence support",
      "comfort care, palliative care, hospice care, and nonpharmacologic pain relief",
      "nutrition, hydration, enteral feeding, aspiration precautions, and therapeutic diets",
      "oral care, hygiene, skin integrity, pressure injury prevention, and wound support",
      "rest, sleep, sensory impairment, communication aids, and environmental modification",
    ],
    requiredLessonSignals: ["nutrition", "mobility", "skin", "elimination", "comfort", "aspiration", "pressure injury"],
    requiredQuestionSignals: ["position", "feed", "aspiration", "skin", "catheter", "ostomy", "comfort"],
    minimumLessonCount: 12,
    minimumQuestionCount: 100,
    minimumNgnCaseCount: 12,
    minimumSataCount: 15,
  },
  {
    clientNeed: "Physiological Integrity",
    subcategory: "Pharmacological and Parenteral Therapies",
    concepts: [
      "adverse effects, contraindications, allergies, interactions, and toxicity",
      "blood and blood product administration and transfusion reactions",
      "central lines, IV therapy, infusion pumps, parenteral nutrition, and compatibility",
      "dosage calculation, pediatric/weight-based dosing, titration, and medication reconciliation",
      "high-alert medications: insulin, anticoagulants, opioids, potassium, vasopressors, sedatives",
      "medication administration rights, routes, timing, monitoring, and client education",
      "pharmacokinetics, pharmacodynamics, renal/hepatic dosing, pregnancy/lactation precautions",
      "therapeutic drug monitoring, antidotes, reversal agents, and emergency medication safety",
    ],
    requiredLessonSignals: ["medication", "adverse", "contraindication", "IV", "blood", "calculation", "toxicity"],
    requiredQuestionSignals: ["administer", "hold", "side effect", "antidote", "dose", "IV", "transfusion"],
    minimumLessonCount: 22,
    minimumQuestionCount: 160,
    minimumNgnCaseCount: 18,
    minimumSataCount: 24,
  },
  {
    clientNeed: "Physiological Integrity",
    subcategory: "Reduction of Risk Potential",
    concepts: [
      "abnormal laboratory values, diagnostic tests, and pre/post-procedure care",
      "changes in vital signs, hemodynamic trends, and early recognition of deterioration",
      "complications from surgery, immobility, diagnostic procedures, and disease progression",
      "focused assessments, health history, risk screening, and monitoring frequency",
      "potential for alterations in body systems: cardiac, respiratory, neuro, renal, endocrine, GI, hematologic, immune",
      "therapeutic procedures, drains, tubes, lines, wound devices, and complication prevention",
    ],
    requiredLessonSignals: ["diagnostic", "lab", "complication", "procedure", "monitor", "risk", "trend"],
    requiredQuestionSignals: ["lab", "diagnostic", "complication", "postoperative", "report", "trend", "procedure"],
    minimumLessonCount: 24,
    minimumQuestionCount: 180,
    minimumNgnCaseCount: 20,
    minimumSataCount: 26,
  },
  {
    clientNeed: "Physiological Integrity",
    subcategory: "Physiological Adaptation",
    concepts: [
      "acid-base imbalance, fluid/electrolyte imbalance, shock, sepsis, and multisystem failure",
      "alterations in body systems: cardiovascular, respiratory, neurological, endocrine, renal, GI, hematologic, immune, musculoskeletal, reproductive",
      "burns, trauma, emergency care, critical care, and rapid response management",
      "hemodynamics, oxygenation, perfusion, ventilation, cardiac rhythm, and neurological status",
      "medical emergencies: stroke, MI/ACS, PE, DKA/HHS, thyroid storm, adrenal crisis, seizures, anaphylaxis, hypertensive crisis",
      "pathophysiology-based nursing interventions and evaluation of treatment response",
      "unexpected response to therapy, deterioration, rescue priorities, and escalation thresholds",
    ],
    requiredLessonSignals: ["pathophysiology", "shock", "oxygen", "perfusion", "electrolyte", "emergency", "deterioration"],
    requiredQuestionSignals: ["first", "priority", "unstable", "shock", "oxygen", "perfusion", "rapid response"],
    minimumLessonCount: 32,
    minimumQuestionCount: 220,
    minimumNgnCaseCount: 28,
    minimumSataCount: 32,
  },
];

export const NCLEX_RN_INTEGRATED_PROCESSES = [
  "Caring",
  "Clinical Judgment",
  "Communication and Documentation",
  "Culture and Spirituality",
  "Nursing Process",
  "Teaching/Learning",
] as const;

export const NCLEX_RN_CLINICAL_JUDGMENT_STEPS = [
  "Recognize cues",
  "Analyze cues",
  "Prioritize hypotheses",
  "Generate solutions",
  "Take action",
  "Evaluate outcomes",
] as const;

export const NURSENEST_RN_DEEP_COVERAGE_STANDARD = {
  minimumLessonWords: 1500,
  minimumLessonSections: 11,
  requiredQuestionFields: [
    "scenario",
    "rationale",
    "correctAnswerExplanation",
    "incorrectAnswerRationale",
    "clinicalReasoning",
    "clinicalPearl",
    "keyTakeaway",
  ],
  requiredQuestionMix: ["multiple_choice", "select_all_that_apply", "case_study", "matrix", "bow_tie", "trend"],
  externalAuditPrinciple: "Use public outlines and primary clinical guidelines to identify coverage gaps only. Do not copy competitor questions, rationales, proprietary explanations, or protected test-plan passages.",
} as const;
