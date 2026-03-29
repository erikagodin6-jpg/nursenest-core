import { db, pool } from "./storage";
import { examQuestions } from "@shared/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import crypto from "crypto";

export interface PipelineConfig {
  tier: string;
  examType: string;
  topic?: string;
  subtopic?: string;
  targetCount: number;
  questionFormatMix?: Record<string, number>;
  cognitiveDistribution?: Record<string, number>;
  countryCode?: string;
}

export interface PipelineRun {
  id: string;
  config: PipelineConfig;
  status: "queued" | "running" | "paused" | "completed" | "failed";
  generatedCount: number;
  validCount: number;
  duplicateCount: number;
  errorCount: number;
  startedAt?: Date;
  completedAt?: Date;
  lastError?: string;
}

interface GeneratedQuestionRecord {
  tier: string;
  exam: string;
  questionType: string;
  status: string;
  stem: string;
  options: any;
  correctAnswer: any;
  rationale: string;
  difficulty: number;
  tags: string[];
  bodySystem: string;
  topic: string;
  subtopic: string;
  regionScope: string;
  stemHash: string;
  scenario: string;
  clinicalPearl: string;
  examStrategy: string;
  memoryHook: string;
  frameworkUsed: string;
  clinicalTrap: string;
  distractorRationales: any;
  qualityScores: any;
  qualityScore: number;
  careerType: string;
  cognitiveLevel: string;
  questionFormat: string;
}

const HIGH_END_TARGETS: Record<string, number> = {
  rpn: 8000,
  rn: 12000,
  np: 15000,
};

const TIER_EXAM_MAP: Record<string, string[]> = {
  rpn: ["REx-PN", "NCLEX-PN"],
  rn: ["NCLEX-RN", "NMC-CBT", "AHPRA"],
  np: ["AANP-FNP", "ANCC-FNP", "AGPCNP-AANP", "AGPCNP-ANCC", "AGACNP", "PMHNP", "PNP", "WHNP", "ENP", "CNPE", "AGNP", "ACNP"],
};

const BLUEPRINT_WEIGHTS: Record<string, Record<string, number>> = {
  "REx-PN": {
    "Safe & Effective Care Environment": 0.32,
    "Health Promotion & Maintenance": 0.09,
    "Psychosocial Integrity": 0.09,
    "Physiological Integrity": 0.50,
  },
  "NCLEX-PN": {
    "Safe & Effective Care Environment": 0.32,
    "Health Promotion & Maintenance": 0.09,
    "Psychosocial Integrity": 0.09,
    "Physiological Integrity": 0.50,
  },
  "NCLEX-RN": {
    "Safe & Effective Care Environment": 0.32,
    "Health Promotion & Maintenance": 0.09,
    "Psychosocial Integrity": 0.09,
    "Physiological Integrity": 0.50,
  },
  "AANP-FNP": {
    "Assessment & Diagnosis": 0.38,
    "Clinical Management & Treatment": 0.38,
    "Health Promotion": 0.12,
    "Professional Practice": 0.12,
  },
  "ANCC-FNP": {
    "Assessment & Diagnosis": 0.32,
    "Clinical Management & Treatment": 0.32,
    "Health Promotion": 0.12,
    "Professional Practice": 0.08,
    "Research & Evidence": 0.08,
    "Role & Policy": 0.08,
  },
  "AGPCNP-AANP": {
    "Adult/Geriatric Disease Management": 0.35,
    "Chronic Illness Management": 0.25,
    "Acute Episodic Care": 0.20,
    "Health Promotion": 0.10,
    "Professional Practice": 0.10,
  },
  "AGPCNP-ANCC": {
    "Adult/Geriatric Disease Management": 0.30,
    "Chronic Illness Management": 0.22,
    "Acute Episodic Care": 0.18,
    "Health Promotion": 0.10,
    "Professional Practice": 0.10,
    "Research & Evidence": 0.10,
  },
  "AGACNP": {
    "Complex Acute Care": 0.35,
    "Critical Care Management": 0.25,
    "Diagnostic Reasoning": 0.20,
    "Procedural Knowledge": 0.10,
    "Professional Practice": 0.10,
  },
  "CNPE": {
    "Health Assessment & Diagnosis": 0.25,
    "Therapeutic Management": 0.25,
    "Health Promotion & Prevention": 0.20,
    "Professional Role & Accountability": 0.15,
    "System Navigation & Collaboration": 0.15,
  },
  "PMHNP": {
    "Psychiatric Assessment": 0.30,
    "Psychopharmacology": 0.30,
    "Therapy Modalities": 0.20,
    "Crisis Intervention": 0.15,
    "Professional Practice": 0.05,
  },
  "AGPCNP": {
    "Chronic Disease Management": 0.30,
    "Health Promotion & Disease Prevention": 0.20,
    "Geriatric Syndromes & Aging": 0.20,
    "Clinical Assessment & Diagnosis": 0.20,
    "Professional Role & Policy": 0.10,
  },
  "PNP": {
    "Pediatric Health Assessment": 0.25,
    "Growth & Developmental Milestones": 0.20,
    "Pediatric Disease Management": 0.25,
    "Health Promotion & Immunizations": 0.15,
    "Family & Behavioral Health": 0.10,
    "Professional Practice": 0.05,
  },
  "WHNP": {
    "Reproductive Health & Gynecology": 0.30,
    "Prenatal & Postpartum Care": 0.20,
    "Primary Care of Women": 0.20,
    "Health Promotion & Screening": 0.15,
    "Professional Practice & Ethics": 0.15,
  },
  "ENP": {
    "Emergency Assessment & Triage": 0.30,
    "Acute Illness & Injury Management": 0.30,
    "Procedures & Diagnostics": 0.20,
    "Trauma Management": 0.10,
    "Professional Practice & Systems": 0.10,
  },
};

const CORE_TOPICS: Record<string, string[]> = {
  rpn: [
    "Fundamentals of Nursing", "Medication Administration", "Patient Safety",
    "Infection Control", "Fluid & Electrolytes", "Vital Signs Assessment",
    "Wound Care", "Pain Management", "Nutrition", "Elimination",
    "Perioperative Care", "Mental Health Basics", "Maternal-Newborn",
    "Pediatric Nursing", "Geriatric Care", "Delegation & Scope",
    "Documentation", "Communication", "Ethics & Legal", "Emergency Response",
  ],
  rn: [
    "Critical Thinking & Clinical Judgment", "Pharmacology", "Medical-Surgical Nursing",
    "Cardiac & Hemodynamic Monitoring", "Respiratory Management", "Neurological Assessment",
    "Renal & Urinary", "Endocrine Disorders", "GI & Hepatic", "Hematology & Oncology",
    "Immune & Infectious Disease", "Musculoskeletal", "Integumentary",
    "Maternal-Newborn & Women's Health", "Pediatric Nursing", "Mental Health & Psychiatric",
    "Emergency & Trauma Nursing", "Community & Public Health", "Leadership & Management",
    "Delegation & Prioritization", "Patient Education", "Cultural Competence",
    "Ethics & Legal", "Evidence-Based Practice", "Quality Improvement",
  ],
  np: [
    "Advanced Pathophysiology", "Advanced Pharmacology", "Advanced Health Assessment",
    "Diagnostic Reasoning & Differential Diagnosis", "Prescribing Principles",
    "Primary Care Management", "Acute Care Management", "Chronic Disease Management",
    "Cardiovascular Disorders", "Pulmonary Disorders", "Endocrine & Metabolic",
    "Neurological Disorders", "GI & Hepatic Disorders", "Renal & Urological",
    "Musculoskeletal & Rheumatological", "Dermatological Conditions",
    "Hematological & Oncological", "Infectious Disease Management",
    "Women's Health & Reproductive", "Pediatric & Adolescent Care",
    "Geriatric & Palliative Care", "Mental Health & Behavioral",
    "Emergency & Urgent Care", "Evidence-Based Practice & Research",
    "Professional Role & Health Policy",
  ],
};

const NP_SPECIALTY_TOPICS: Record<string, string[]> = {
  "AANP-FNP": [
    "Primary Care Across the Lifespan", "Chronic Disease Management", "Health Promotion & Disease Prevention",
    "Differential Diagnosis", "Pharmacotherapeutics & Prescribing", "Cardiovascular Primary Care",
    "Respiratory Primary Care", "Endocrine & Metabolic Disorders", "GI & Hepatic Management",
    "Musculoskeletal Assessment", "Dermatological Conditions", "Neurological Assessment",
    "Infectious Disease Management", "Mental Health in Primary Care", "Pediatric Primary Care",
    "Geriatric Primary Care", "Women's Health Screening", "Men's Health",
    "Evidence-Based Practice", "Professional Role & Ethics",
  ],
  "ANCC-FNP": [
    "Clinical Knowledge & Assessment", "Evidence-Based Practice Frameworks", "Interprofessional Collaboration",
    "Healthcare Policy & Systems", "Quality Improvement", "Differential Diagnosis",
    "Pharmacotherapeutics", "Chronic Disease Management", "Cardiovascular Disorders",
    "Respiratory Disorders", "Endocrine Management", "GI & Hepatic Disorders",
    "Musculoskeletal Conditions", "Neurological Conditions", "Infectious Disease",
    "Mental Health Assessment", "Research Methodology", "Health Promotion",
    "Professional Role Development", "Pediatric & Geriatric Primary Care",
  ],
  "PMHNP": [
    "Psychopharmacology", "Psychiatric Assessment & DSM-5", "Mood Disorders",
    "Anxiety & Trauma-Related Disorders", "Psychotic Disorders", "Substance Use Disorders",
    "Child & Adolescent Psychiatry", "Geriatric Psychiatry", "Crisis Intervention & Suicidality",
    "Therapeutic Communication & Modalities", "Neurodevelopmental Disorders",
    "Personality Disorders", "Sleep-Wake Disorders", "Psychotropic Drug Interactions",
    "Involuntary Commitment & Legal Issues",
  ],
  "PNP": [
    "Developmental Milestones & Screening", "Pediatric Growth Assessment",
    "Childhood Immunization Schedules", "Common Pediatric Infections",
    "Pediatric Respiratory Disorders", "Congenital & Genetic Conditions",
    "Pediatric Nutrition & Feeding", "Behavioral & Developmental Disorders",
    "Pediatric Pharmacology & Dosing", "Child Abuse Recognition & Reporting",
    "Adolescent Health & Risk Behaviors", "Pediatric Dermatology",
    "Pediatric Cardiac Disorders", "School-Age Health & Sports Injuries",
    "Family-Centered Care & Anticipatory Guidance",
  ],
  "WHNP": [
    "Reproductive Health & Contraception", "Menstrual Disorders",
    "Prenatal Care & Obstetric Management", "Postpartum Care & Lactation",
    "Menopause & Hormone Therapy", "Gynecological Infections & STIs",
    "Cervical & Breast Cancer Screening", "Infertility Assessment",
    "Pelvic Floor Disorders", "Intimate Partner Violence Screening",
    "Osteoporosis & Women's Bone Health", "Polycystic Ovary Syndrome",
    "Ectopic Pregnancy & Pregnancy Complications", "Vulvovaginal Disorders",
    "Women's Primary Care & Chronic Disease",
  ],
  "ENP": [
    "Emergency Triage & Acuity Assessment", "Acute Coronary Syndromes",
    "Stroke Recognition & Management", "Trauma Assessment & ATLS Principles",
    "Toxicology & Overdose Management", "Emergency Procedures & Wound Management",
    "Pediatric Emergencies", "Obstetric Emergencies", "Shock Recognition & Management",
    "Airway Management & Respiratory Emergencies", "Orthopedic Injuries & Fractures",
    "Burns & Environmental Emergencies", "Sepsis Recognition & Management",
    "Psychiatric Emergencies", "Mass Casualty & Disaster Triage",
  ],
  "AGPCNP-AANP": [
    "Adult & Geriatric Health Assessment", "Chronic Disease Management",
    "Geriatric Syndromes & Frailty", "Polypharmacy & Medication Reconciliation",
    "Cardiovascular Risk Management", "Diabetes Management in Older Adults",
    "Cognitive Assessment & Dementia", "Fall Prevention & Mobility",
    "Cancer Screening & Prevention", "Palliative Care & Advance Directives",
    "Musculoskeletal Disorders in Aging", "Depression & Mental Health in Older Adults",
    "Immunizations & Preventive Health", "Urinary & Bowel Disorders",
    "Sensory Changes & Age-Related Conditions",
  ],
  "AGPCNP-ANCC": [
    "Adult & Geriatric Health Assessment", "Chronic Disease Management",
    "Geriatric Syndromes & Frailty", "Polypharmacy & Medication Reconciliation",
    "Cardiovascular Risk Management", "Diabetes Management in Older Adults",
    "Cognitive Assessment & Dementia", "Fall Prevention & Mobility",
    "Cancer Screening & Prevention", "Palliative Care & Advance Directives",
    "Evidence-Based Practice & Research Methods", "Healthcare Policy & Systems",
    "Quality Improvement & Patient Safety", "Interprofessional Collaboration",
    "Role Development & Professional Practice",
  ],
  "AGPCNP": [
    "Adult Health Assessment", "Geriatric Syndromes", "Polypharmacy Management",
    "Chronic Disease Management", "Cardiovascular Disease in Adults", "Diabetes & Metabolic Syndrome",
    "COPD & Respiratory Disease", "Hypertension Management", "Heart Failure Management",
    "Osteoporosis & Falls Prevention", "Dementia & Cognitive Decline", "Depression in Older Adults",
    "Cancer Screening & Prevention", "Renal Disease in Aging", "Arthritis & Pain Management",
    "Thyroid Disorders", "Age-Specific Screening Guidelines", "Palliative & End-of-Life Care",
    "Health Promotion for Aging Populations", "Interprofessional Geriatric Care",
  ],
  "AGACNP": [
    "Complex Acute Care Management", "Critical Care & ICU Management",
    "Hemodynamic Monitoring & Interpretation", "Ventilator Management",
    "Acute Cardiac Events & Interventions", "Acute Respiratory Failure",
    "Sepsis & Multi-Organ Dysfunction", "Acute Renal Failure & Dialysis",
    "Acute Neurological Events", "Surgical & Post-Operative Management",
    "Procedural Skills & Diagnostics", "Pharmacotherapeutics in Acute Care",
    "Trauma Assessment & Stabilization", "End-of-Life Care in Acute Settings",
    "Rapid Response & Deteriorating Patients",
  ],
  "AGNP": [
    "Adult Health Assessment", "Geriatric Syndromes", "Chronic Disease Management",
    "Cardiovascular Disease in Adults", "Diabetes & Metabolic Syndrome", "Polypharmacy Management",
    "COPD & Respiratory Disease", "Hypertension Management", "Heart Failure Management",
    "Osteoporosis & Falls Prevention", "Dementia & Cognitive Decline", "Depression in Older Adults",
    "Cancer Screening & Prevention", "Renal Disease in Aging", "Palliative & End-of-Life Care",
  ],
  "ACNP": [
    "Critical Care Management", "Hemodynamic Monitoring", "Mechanical Ventilation",
    "Vasoactive Medication Management", "Acute Coronary Syndrome", "Sepsis & Septic Shock",
    "Acute Respiratory Failure", "Stroke & Neurological Emergencies", "Acute Kidney Injury",
    "Post-Surgical Management", "Trauma in Adult Populations", "Multi-Organ Dysfunction",
    "ICU Pharmacology", "Rapid Clinical Deterioration", "Advanced Diagnostic Interpretation",
  ],
  "CNPE": [
    "Health Assessment & Diagnosis", "Therapeutic Management", "Health Promotion & Prevention",
    "Professional Role & Accountability", "System Navigation & Collaboration",
    "Indigenous Health", "Interprofessional Collaboration", "Canadian Prescribing Guidelines",
    "Chronic Disease Management", "Mental Health Assessment", "Pediatric & Maternal Health",
    "Geriatric Care", "Emergency & Urgent Care", "Pharmacology & Prescribing",
    "Evidence-Based Practice",
  ],
};

const FORMAT_TYPES = [
  "MCQ", "SATA", "bowtie", "scenario-based", "prioritization",
  "delegation", "dosage-calculation", "lab-interpretation", "progressive-unfolding",
  "ordered-response", "cloze-dropdown", "safety-infection-control",
] as const;

const DEFAULT_FORMAT_MIX: Record<string, number> = {
  MCQ: 35,
  SATA: 13,
  "scenario-based": 13,
  prioritization: 8,
  delegation: 5,
  "dosage-calculation": 4,
  "lab-interpretation": 4,
  bowtie: 3,
  "progressive-unfolding": 3,
  "ordered-response": 5,
  "cloze-dropdown": 4,
  "safety-infection-control": 3,
};

const NP_FORMAT_MIX: Record<string, number> = {
  MCQ: 50,
  "scenario-based": 20,
  prioritization: 10,
  "lab-interpretation": 8,
  "dosage-calculation": 5,
  SATA: 5,
  "progressive-unfolding": 2,
};

const COGNITIVE_LEVELS = ["recall", "application", "analysis", "synthesis"] as const;

const DEFAULT_COGNITIVE_DISTRIBUTION: Record<string, number> = {
  recall: 15,
  application: 35,
  analysis: 35,
  synthesis: 15,
};

function hashStem(stem: string): string {
  const normalized = stem
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return crypto.createHash("sha256").update(normalized).digest("hex").substring(0, 16);
}

function stemSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/));
  const wordsB = new Set(b.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/));
  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

const activeRuns = new Map<string, PipelineRun>();

export async function getExistingHashes(tier: string): Promise<Set<string>> {
  const result = await pool.query(
    `SELECT stem_hash FROM exam_questions WHERE tier = $1 AND stem_hash IS NOT NULL`,
    [tier]
  );
  return new Set(result.rows.map((r: any) => r.stem_hash).filter(Boolean));
}

export async function getExistingStems(tier: string, limit: number = 500): Promise<string[]> {
  const result = await pool.query(
    `SELECT stem FROM exam_questions WHERE tier = $1 ORDER BY created_at DESC LIMIT $2`,
    [tier, limit]
  );
  return result.rows.map((r: any) => r.stem);
}

export async function getCurrentCounts(): Promise<Record<string, { total: number; byExam: Record<string, number>; byTopic: Record<string, number>; byFormat: Record<string, number>; byStatus: Record<string, number> }>> {
  const counts: Record<string, any> = {};

  for (const tier of ["rpn", "rn", "np"]) {
    const totalR = await pool.query(
      `SELECT COUNT(*)::int as total FROM exam_questions WHERE tier = $1`,
      [tier]
    );
    const byExamR = await pool.query(
      `SELECT exam, COUNT(*)::int as count FROM exam_questions WHERE tier = $1 GROUP BY exam`,
      [tier]
    );
    const byTopicR = await pool.query(
      `SELECT COALESCE(topic, body_system, 'Unknown') as topic, COUNT(*)::int as count FROM exam_questions WHERE tier = $1 GROUP BY COALESCE(topic, body_system, 'Unknown') ORDER BY count DESC LIMIT 30`,
      [tier]
    );
    const byFormatR = await pool.query(
      `SELECT question_type, COUNT(*)::int as count FROM exam_questions WHERE tier = $1 GROUP BY question_type`,
      [tier]
    );
    const byStatusR = await pool.query(
      `SELECT COALESCE(status, 'draft') as status, COUNT(*)::int as count FROM exam_questions WHERE tier = $1 GROUP BY COALESCE(status, 'draft')`,
      [tier]
    );

    counts[tier] = {
      total: totalR.rows[0]?.total || 0,
      target: HIGH_END_TARGETS[tier] || 0,
      byExam: Object.fromEntries(byExamR.rows.map((r: any) => [r.exam, r.count])),
      byTopic: Object.fromEntries(byTopicR.rows.map((r: any) => [r.topic, r.count])),
      byFormat: Object.fromEntries(byFormatR.rows.map((r: any) => [r.question_type, r.count])),
      byStatus: Object.fromEntries(byStatusR.rows.map((r: any) => [r.status, r.count])),
    };
  }

  return counts;
}

export async function getGapAnalysis(): Promise<Array<{ tier: string; target: number; current: number; gap: number; percentComplete: number; topicGaps: Array<{ topic: string; current: number; estimated: number; gap: number }> }>> {
  const counts = await getCurrentCounts();
  const analysis = [];

  for (const tier of ["rpn", "rn", "np"]) {
    const data = counts[tier];
    const target = HIGH_END_TARGETS[tier];
    const topics = CORE_TOPICS[tier] || [];
    const perTopicTarget = Math.ceil(target / Math.max(topics.length, 1));

    const topicGaps = topics.map(topic => {
      const current = data.byTopic[topic] || 0;
      return {
        topic,
        current,
        estimated: perTopicTarget,
        gap: Math.max(0, perTopicTarget - current),
      };
    }).sort((a, b) => b.gap - a.gap);

    analysis.push({
      tier,
      target,
      current: data.total,
      gap: Math.max(0, target - data.total),
      percentComplete: data.total > 0 ? Math.round((data.total / target) * 100) : 0,
      topicGaps,
    });
  }

  return analysis;
}

function buildGenerationPrompt(config: PipelineConfig, batchSize: number, existingStems: string[]): { system: string; user: string } {
  const tier = config.tier;
  const examType = config.examType;
  const topic = config.topic || "mixed clinical topics";
  const subtopic = config.subtopic || "";
  const formatMix = config.questionFormatMix || (tier === "np" ? NP_FORMAT_MIX : DEFAULT_FORMAT_MIX);
  const cognitiveDist = config.cognitiveDistribution || DEFAULT_COGNITIVE_DISTRIBUTION;
  const countryCode = config.countryCode || "CA";
  const blueprintWeights = BLUEPRINT_WEIGHTS[examType] || {};

  const tierContext: Record<string, string> = {
    rpn: `RPN/PN/LVN scope of practice. RPNs monitor, report, administer medications as ordered, perform basic assessments. They do NOT independently prescribe, diagnose, or initiate treatment plans. Focus on safety, delegation, and fundamental nursing skills.`,
    rn: `RN scope of practice. RNs perform protocol-based interventions, complex assessments, delegation decisions, care coordination, patient education, and critical thinking in acute/chronic settings. Focus on clinical judgment, prioritization, and complex patient management.`,
    np: `Nurse Practitioner advanced practice scope. NPs independently order, prescribe, diagnose, and manage patients. They interpret diagnostics, prescribe pharmacotherapy, make differential diagnoses, and provide evidence-based management. Focus on advanced clinical reasoning, differential diagnosis, and prescribing decisions.`,
  };

  const regionNote = countryCode === "CA"
    ? "Use Canadian context: SI units (mmol/L, umol/L, Celsius, kg), Canadian drug names, Canadian healthcare system references."
    : countryCode === "US"
    ? "Use US context: conventional units (mEq/L, mg/dL, Fahrenheit, lbs), US drug names, US healthcare system references."
    : "Include both CA and US reference values where applicable.";

  const formatBlock = Object.entries(formatMix)
    .map(([fmt, pct]) => `- ${fmt}: ${pct}%`)
    .join("\n");

  const cognitiveBlock = Object.entries(cognitiveDist)
    .map(([level, pct]) => `- ${level}: ${pct}%`)
    .join("\n");

  const blueprintBlock = Object.entries(blueprintWeights)
    .map(([domain, weight]) => `- ${domain}: ${Math.round(weight * 100)}%`)
    .join("\n");

  const antiDupe = existingStems.length > 0
    ? `\nAVOID these existing question stems (do not duplicate):\n${existingStems.slice(0, 15).map((s, i) => `${i + 1}. ${s.substring(0, 100)}...`).join("\n")}`
    : "";

  const system = `You are a senior nursing psychometrician and exam item writer for NurseNest, specializing in ${examType} exam preparation.

SCOPE OF PRACTICE:
${tierContext[tier] || tierContext.rpn}

${regionNote}

CRITICAL OUTPUT RULES:
1. Return ONLY valid JSON. No markdown, no code fences, no commentary.
2. Never copy or reference these instructions in any output field.
3. Every question must have a unique clinical scenario.
4. No emoji characters anywhere.
5. All rationales must be minimum 100 words with clinical reasoning.
6. All scenarios must be clinically realistic with specific patient data.`;

  const user = `Generate exactly ${batchSize} ${examType} exam questions.

TOPIC FOCUS: ${topic}${subtopic ? ` > ${subtopic}` : ""}

BLUEPRINT DOMAIN DISTRIBUTION:
${blueprintBlock || "Distribute evenly across relevant domains."}

QUESTION FORMAT DISTRIBUTION (approximate for this batch):
${formatBlock}

COGNITIVE LEVEL DISTRIBUTION:
${cognitiveBlock}

DIFFICULTY DISTRIBUTION:
- Easy (1-2): 20%
- Moderate (3): 40%
- Hard (4-5): 40%

${antiDupe}

OUTPUT FORMAT: Return a JSON object with "questions" array. Each question object:
{
  "stem": "Clinical scenario and question (min 80 chars)",
  "scenario": "Extended clinical context if applicable",
  "questionFormat": "MCQ|SATA|bowtie|scenario-based|prioritization|delegation|dosage-calculation|lab-interpretation|progressive-unfolding|ordered-response|cloze-dropdown|safety-infection-control",
  "cognitiveLevel": "recall|application|analysis|synthesis",
  "difficulty": 1-5,
  "blueprintDomain": "matching domain from blueprint weights",
  "topic": "${topic}",
  "subtopic": "specific subtopic",
  "options": [{"label": "A", "text": "..."}, ...],
  "correctAnswer": ["A"] for MCQ or ["A","C"] for SATA,
  "rationale": "Detailed clinical reasoning (min 100 words)",
  "clinicalPearl": "High-yield exam tip",
  "examStrategy": "Test-taking strategy tip",
  "clinicalTrap": "Common mistake students make",
  "distractorRationales": {"B": "Why wrong", "C": "Why wrong", "D": "Why wrong"},
  "tags": ["tag1", "tag2"],
  "isScenario": true/false,
  "isMockExamEligible": true/false
}

MCQ: 4 options, 1 correct answer.
SATA: 5-6 options, 2-5 correct answers.
bowtie: 4 options with causal chain reasoning.
scenario-based: detailed clinical vignette, 4 options.
prioritization: 4 options ordered by priority.
delegation: 4 options about appropriate delegation.
dosage-calculation: 4 options with numeric calculations.
lab-interpretation: 4 options interpreting lab values.
progressive-unfolding: multi-part question, 4 options per part.
ordered-response: 4-6 items that must be ranked in correct sequence.
cloze-dropdown: fill-in-the-blank with dropdown selections, 4 options per blank.
safety-infection-control: 4 options focused on safety protocols, infection control, PPE, or sterile technique.

Return EXACTLY ${batchSize} questions. JSON only.`;

  return { system, user };
}

function validateGeneratedQuestion(raw: any, existingHashes: Set<string>): { valid: boolean; errors: string[]; qualityScore: number } {
  const errors: string[] = [];
  let qualityScore = 100;

  if (!raw.stem || raw.stem.length < 40) {
    errors.push("Stem too short (min 40 chars)");
    qualityScore -= 30;
  }

  if (!Array.isArray(raw.options) || raw.options.length < 4) {
    errors.push("Must have at least 4 options");
    qualityScore -= 30;
  }

  if (!raw.correctAnswer || !Array.isArray(raw.correctAnswer) || raw.correctAnswer.length === 0) {
    errors.push("Missing correct answer");
    qualityScore -= 30;
  }

  if (!raw.rationale || raw.rationale.length < 50) {
    errors.push("Rationale too short (min 50 chars)");
    qualityScore -= 20;
  }

  if (!raw.cognitiveLevel || !COGNITIVE_LEVELS.includes(raw.cognitiveLevel)) {
    qualityScore -= 5;
  }

  if (!raw.topic) {
    qualityScore -= 10;
  }

  if (!raw.questionFormat) {
    qualityScore -= 5;
  }

  const stemHash = hashStem(raw.stem || "");
  if (existingHashes.has(stemHash)) {
    errors.push("Duplicate question detected (stem hash match)");
    qualityScore -= 50;
  }

  if (raw.options) {
    const texts = raw.options.map((o: any) => (o.text || o).toString().toLowerCase().trim());
    if (new Set(texts).size !== texts.length) {
      errors.push("Duplicate option texts");
      qualityScore -= 15;
    }
  }

  if (raw.correctAnswer && raw.options) {
    const labels = new Set(raw.options.map((o: any) => o.label || String.fromCharCode(65 + raw.options.indexOf(o))));
    for (const ans of raw.correctAnswer) {
      if (!labels.has(ans)) {
        errors.push(`Correct answer "${ans}" not in option labels`);
        qualityScore -= 20;
      }
    }
  }

  const echoPatterns = [/generate \d+ questions/i, /output json/i, /you are/i, /instructions:/i];
  for (const pat of echoPatterns) {
    if (pat.test(raw.stem || "")) {
      errors.push("Stem contains instruction echo");
      qualityScore -= 30;
    }
  }

  return { valid: errors.length === 0, errors, qualityScore: Math.max(0, qualityScore) };
}

function mapToExamQuestion(raw: any, config: PipelineConfig): GeneratedQuestionRecord {
  const options = (raw.options || []).map((o: any, i: number) => ({
    label: o.label || String.fromCharCode(65 + i),
    text: typeof o === "string" ? o : (o.text || String(o)),
  }));

  const correctAnswer = raw.correctAnswer || raw.correct_answer || [];

  const difficultyNum = typeof raw.difficulty === "number"
    ? Math.min(5, Math.max(1, raw.difficulty))
    : 3;

  return {
    tier: config.tier,
    exam: config.examType,
    questionType: raw.questionFormat || raw.questionType || "MCQ",
    status: "published",
    stem: raw.stem,
    options: JSON.stringify(options),
    correctAnswer: JSON.stringify(Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]),
    rationale: raw.rationale || "",
    difficulty: difficultyNum,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    bodySystem: config.topic || raw.bodySystem || raw.blueprintDomain || "",
    topic: raw.topic || config.topic || "",
    subtopic: raw.subtopic || config.subtopic || "",
    regionScope: config.countryCode || "BOTH",
    stemHash: hashStem(raw.stem || ""),
    scenario: raw.scenario || "",
    clinicalPearl: raw.clinicalPearl || "",
    examStrategy: raw.examStrategy || "",
    memoryHook: raw.memoryHook || "",
    frameworkUsed: raw.frameworkUsed || "",
    clinicalTrap: raw.clinicalTrap || "",
    distractorRationales: raw.distractorRationales ? JSON.stringify(raw.distractorRationales) : null,
    qualityScores: JSON.stringify({
      cognitiveLevel: raw.cognitiveLevel || "application",
      blueprintDomain: raw.blueprintDomain || "",
      isScenario: raw.isScenario ?? true,
      isMockExamEligible: raw.isMockExamEligible ?? true,
      blueprintWeight: BLUEPRINT_WEIGHTS[config.examType]?.[raw.blueprintDomain] || 0,
    }),
    qualityScore: 0,
    careerType: "nursing",
    cognitiveLevel: raw.cognitiveLevel || "application",
    questionFormat: raw.questionFormat || raw.questionType || "MCQ",
  };
}

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const { routeAIRequest } = await import("./ai-provider-router");
  const result = await routeAIRequest(systemPrompt, userPrompt, {
    model: "gpt-4o-mini",
    maxTokens: 16384,
    temperature: 0.4,
    responseFormat: { type: "json_object" },
    taskType: "qbank",
    feature: "qbank-pipeline",
  });
  return result.content || "{}";
}

function parseAIResponse(raw: string): any[] {
  let cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed.questions)) return parsed.questions;
    if (Array.isArray(parsed.items)) return parsed.items;
    if (Array.isArray(parsed)) return parsed;
    for (const key of Object.keys(parsed)) {
      if (Array.isArray(parsed[key]) && parsed[key].length > 0) return parsed[key];
    }
  } catch {
    return [];
  }
  return [];
}

export async function startPipelineRun(config: PipelineConfig): Promise<PipelineRun> {
  const runId = `pipeline-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  const run: PipelineRun = {
    id: runId,
    config,
    status: "queued",
    generatedCount: 0,
    validCount: 0,
    duplicateCount: 0,
    errorCount: 0,
  };

  activeRuns.set(runId, run);

  await pool.query(
    `INSERT INTO generation_jobs (id, run_date, content_type, tier, target_count, generated_count, mode, topic_plan_json, status)
     VALUES ($1, $2, $3, $4, $5, 0, $6, $7, 'queued')`,
    [
      runId,
      new Date().toISOString().split("T")[0],
      "exam_questions",
      config.tier,
      config.targetCount,
      "pipeline_v2",
      JSON.stringify({
        examType: config.examType,
        topic: config.topic,
        subtopic: config.subtopic,
        formatMix: config.questionFormatMix,
        cognitiveDistribution: config.cognitiveDistribution,
        countryCode: config.countryCode,
      }),
    ]
  );

  executePipelineRun(runId).catch(err => {
    console.error(`[QBankPipeline] Run ${runId} failed:`, err.message);
    const r = activeRuns.get(runId);
    if (r) {
      r.status = "failed";
      r.lastError = err.message;
    }
  });

  return run;
}

async function executePipelineRun(runId: string): Promise<void> {
  const run = activeRuns.get(runId);
  if (!run) return;

  run.status = "running";
  run.startedAt = new Date();

  await pool.query(
    `UPDATE generation_jobs SET status = 'running' WHERE id = $1`,
    [runId]
  );

  const config = run.config;
  const BATCH_SIZE = 15;
  const MAX_CONSECUTIVE_FAILURES = 5;
  let consecutiveFailures = 0;

  const existingHashes = await getExistingHashes(config.tier);
  const existingStems = await getExistingStems(config.tier, 200);

  const topics = config.topic
    ? [config.topic]
    : (config.examType && NP_SPECIALTY_TOPICS[config.examType]
      ? NP_SPECIALTY_TOPICS[config.examType]
      : (CORE_TOPICS[config.tier] || CORE_TOPICS.rpn));

  let topicIdx = 0;

  while (run.validCount < config.targetCount && run.status === "running") {
    const currentRun = activeRuns.get(runId);
    if (!currentRun || currentRun.status === "paused") {
      run.status = "paused";
      await pool.query(`UPDATE generation_jobs SET status = 'paused' WHERE id = $1`, [runId]);
      return;
    }

    const remaining = config.targetCount - run.validCount;
    const batchSize = Math.min(BATCH_SIZE, remaining);
    const currentTopic = topics[topicIdx % topics.length];
    topicIdx++;

    const batchConfig: PipelineConfig = {
      ...config,
      topic: currentTopic,
      targetCount: batchSize,
    };

    console.log(`[QBankPipeline] Run ${runId}: generating ${batchSize} questions on "${currentTopic}" (${run.validCount}/${config.targetCount})`);

    try {
      const { system, user } = buildGenerationPrompt(batchConfig, batchSize, existingStems.slice(-30));
      const response = await callAI(system, user);
      const questions = parseAIResponse(response);

      if (questions.length === 0) {
        consecutiveFailures++;
        console.log(`[QBankPipeline] Empty response, consecutive failures: ${consecutiveFailures}`);
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          run.status = "failed";
          run.lastError = `${MAX_CONSECUTIVE_FAILURES} consecutive empty responses`;
          break;
        }
        await delay(2000);
        continue;
      }

      consecutiveFailures = 0;
      run.generatedCount += questions.length;

      const validQuestions: GeneratedQuestionRecord[] = [];

      for (const q of questions) {
        const validation = validateGeneratedQuestion(q, existingHashes);

        if (!validation.valid) {
          run.errorCount++;
          continue;
        }

        const stemHash = hashStem(q.stem);
        const isDuplicate = existingHashes.has(stemHash) ||
          existingStems.some(s => stemSimilarity(s, q.stem) > 0.85);

        if (isDuplicate) {
          run.duplicateCount++;
          continue;
        }

        const record = mapToExamQuestion(q, batchConfig);
        record.qualityScore = validation.qualityScore;

        record.status = validation.qualityScore >= 60 ? "published" : "needs_review";

        validQuestions.push(record);
        existingHashes.add(stemHash);
        existingStems.push(q.stem);
      }

      if (validQuestions.length > 0) {
        for (const vq of validQuestions) {
          await pool.query(
            `INSERT INTO exam_questions (id, tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, scenario, clinical_pearl, exam_strategy, memory_hook, framework_used, clinical_trap, distractor_rationales, quality_scores, quality_score, career_type, cognitive_level, question_format, published_at, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, CASE WHEN $4 = 'published' THEN NOW() ELSE NULL END, NOW(), NOW())`,
            [
              vq.tier, vq.exam, vq.questionType, vq.status, vq.stem,
              vq.options, vq.correctAnswer, vq.rationale, vq.difficulty,
              vq.tags, vq.bodySystem, vq.topic, vq.subtopic, vq.regionScope,
              vq.stemHash, vq.scenario, vq.clinicalPearl, vq.examStrategy,
              vq.memoryHook, vq.frameworkUsed, vq.clinicalTrap,
              vq.distractorRationales, vq.qualityScores, vq.qualityScore, vq.careerType,
              vq.cognitiveLevel || "application", vq.questionFormat || vq.questionType,
            ]
          );
        }
        run.validCount += validQuestions.length;
      }

      await pool.query(
        `UPDATE generation_jobs SET generated_count = $1, status = 'running' WHERE id = $2`,
        [run.validCount, runId]
      );

      console.log(`[QBankPipeline] Batch done: ${validQuestions.length} valid, ${run.validCount}/${config.targetCount} total`);

      await delay(1000);
    } catch (err: any) {
      consecutiveFailures++;
      run.errorCount++;
      console.error(`[QBankPipeline] Batch error:`, err.message);

      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        run.status = "failed";
        run.lastError = err.message;
        break;
      }

      await delay(3000);
    }
  }

  if (run.status === "running") {
    run.status = "completed";
    run.completedAt = new Date();
  }

  await pool.query(
    `UPDATE generation_jobs SET status = $1, generated_count = $2, completed_at = $3 WHERE id = $4`,
    [run.status, run.validCount, run.completedAt || new Date(), runId]
  );

  console.log(`[QBankPipeline] Run ${runId} finished: status=${run.status}, valid=${run.validCount}, dupes=${run.duplicateCount}, errors=${run.errorCount}`);
}

export function pausePipelineRun(runId: string): boolean {
  const run = activeRuns.get(runId);
  if (!run || run.status !== "running") return false;
  run.status = "paused";
  return true;
}

export function getPipelineRun(runId: string): PipelineRun | undefined {
  return activeRuns.get(runId);
}

export function listPipelineRuns(): PipelineRun[] {
  return Array.from(activeRuns.values()).sort((a, b) =>
    (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0)
  );
}

export async function listPipelineRunsFromDB(limit: number = 50): Promise<any[]> {
  const result = await pool.query(
    `SELECT * FROM generation_jobs WHERE mode = 'pipeline_v2' ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export { HIGH_END_TARGETS, TIER_EXAM_MAP, CORE_TOPICS, NP_SPECIALTY_TOPICS, BLUEPRINT_WEIGHTS, FORMAT_TYPES, DEFAULT_FORMAT_MIX, NP_FORMAT_MIX, COGNITIVE_LEVELS, DEFAULT_COGNITIVE_DISTRIBUTION };

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
