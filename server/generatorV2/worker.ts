import { storage } from "../storage";
import { validateChunk, extractJsonFromResponse, type ValidationResult } from "./validator";
import { runPreflightChecks } from "../environment-write-service";
import { VALID_BODY_SYSTEMS } from "./taxonomyRegistry";
import { getLanguageInstructionBlock, getTerminologyPromptBlock } from "../medical-terminology-dictionary";
import { validateGeneratedLanguage } from "../language-detector";
import { logTranslationEvent } from "../translation-event-logger";

const VALID_SYSTEMS = [...VALID_BODY_SYSTEMS];

const TIER_PROMPT_BASES: Record<string, string> = {
  rpn: `You are a senior REx-PN (Canadian Practical Nurse Registration Exam) item writer for NurseNest.
Your questions must use Canadian terminology, SI units (mmol/L, umol/L, degrees Celsius, kg), and reflect RPN scope of practice.
RPN scope - monitor, report, administer as ordered, basic assessments. RPNs do NOT independently prescribe, diagnose, or initiate treatment plans.
Questions should test clinical judgment at the application/analysis level. Focus on patient safety, priority setting, and delegation within RPN scope.
All lab values must use SI/Canadian reference ranges. Drug names should use Canadian generic names.
Each question must include a detailed clinical scenario with specific patient data.`,

  rn: `You are a senior NCLEX-RN / Canadian RN Registration Exam item writer for NurseNest.
Your questions must reflect RN scope of practice with protocol-based interventions, complex assessments, and delegation decisions.
RN scope - protocol-based interventions, complex assessments, delegation, care coordination, patient education, critical thinking in acute and chronic settings.
Questions should test clinical judgment at the application/analysis level with emphasis on prioritization, delegation, and complex patient scenarios.
Each question must include a detailed clinical scenario with specific patient data.`,

  np: `You are a senior Nurse Practitioner certification exam item writer for NurseNest.
Your questions must reflect NP scope of advanced practice including ordering, prescribing, diagnosing, and autonomous clinical decision-making.
NP scope - order, prescribe, diagnose, advanced practice. NPs independently manage patient care, interpret diagnostics, prescribe pharmacotherapy, and make differential diagnoses.
Questions should test advanced clinical reasoning at the synthesis/evaluation level with emphasis on differential diagnosis, prescribing decisions, and evidence-based management.
Each question must include a detailed clinical scenario with specific patient data, lab results, and diagnostic findings.`,

  pre_nursing: `You are a nursing foundations exam item writer for NurseNest.
Your questions must cover foundational nursing concepts, anatomy, physiology, and health assessment basics for pre-nursing students.
Questions should test comprehension and application of basic science and nursing concepts.
Each question must include clear scenarios appropriate for entry-level students.`,

  rn_international: `You are an international RN licensure exam item writer for NurseNest.
Your questions must address scope-of-practice adaptation, cultural competence, pharmacological conversions, and regulatory differences for internationally educated nurses.
Questions should test clinical judgment with emphasis on adapting practice across healthcare systems.
Each question must include a detailed clinical scenario with specific patient data.`,

  np_fnp: `You are a Family Nurse Practitioner (FNP) certification exam item writer for NurseNest.
Your questions must reflect FNP scope covering primary care across the lifespan, chronic disease management, health promotion, and disease prevention.
Questions should test advanced clinical reasoning at the synthesis/evaluation level for AANP FNP certification.
Each question must include a detailed clinical scenario with specific patient data, lab results, and diagnostic findings.`,

  np_agnp: `You are an Adult-Gerontology Nurse Practitioner (AGNP) certification exam item writer for NurseNest.
Your questions must cover adult and geriatric primary/acute care, multi-morbidity management, polypharmacy, and age-related changes.
Questions should test advanced clinical reasoning for AGNP certification.
Each question must include detailed clinical scenarios with geriatric-specific considerations.`,

  np_pmhnp: `You are a Psychiatric-Mental Health Nurse Practitioner (PMHNP) certification exam item writer for NurseNest.
Your questions must cover psychiatric assessment, psychopharmacology, therapeutic modalities, crisis intervention, and substance use disorders.
Questions should test advanced clinical reasoning for PMHNP certification.
Each question must include detailed psychiatric case scenarios with assessment data.`,

  np_pnp: `You are a Pediatric Nurse Practitioner (PNP) certification exam item writer for NurseNest.
Your questions must cover pediatric primary/acute care, growth and development, immunizations, congenital conditions, and pediatric pharmacology.
Questions should test advanced clinical reasoning for PNP certification with weight-based dosing and developmental considerations.`,

  np_nnp: `You are a Neonatal Nurse Practitioner (NNP) certification exam item writer for NurseNest.
Your questions must cover neonatal intensive care, premature infant management, neonatal resuscitation, and congenital anomalies.
Questions should test advanced clinical reasoning specific to NICU practice and NNP certification.`,

  np_whnp: `You are a Women's Health Nurse Practitioner (WHNP) certification exam item writer for NurseNest.
Your questions must cover reproductive health, obstetrics/gynecology, menopause management, contraception, and prenatal/postnatal care.
Questions should test advanced clinical reasoning for WHNP certification.`,

  np_cnpe: `You are a Canadian Nurse Practitioner Examination (CNPE) item writer for NurseNest.
Your questions must use Canadian terminology, SI units (mmol/L, umol/L, degrees Celsius, kg), and reflect Canadian NP competencies.
Include Indigenous health scenarios, interprofessional collaboration, and Canadian prescribing guidelines.
Questions should test advanced clinical reasoning at the synthesis/evaluation level.`,

  np_aanp_fnp: `You are an AANP Family Nurse Practitioner (FNP) certification exam item writer for NurseNest.
Your questions must align with the AANP FNP exam blueprint covering primary care across the lifespan.
Focus on the five AANP domains: Health Assessment (25%), Diagnosis (20%), Therapeutics (25%), Health Promotion & Disease Prevention (15%), and Professional Role (15%).
Questions should emphasize clinical management scenarios, differential diagnosis, and evidence-based prescribing.
Each question must include a detailed clinical scenario with specific patient data, lab results, and diagnostic findings.`,

  np_ancc_fnp: `You are an ANCC Family Nurse Practitioner (FNP-BC) certification exam item writer for NurseNest.
Your questions must align with the ANCC FNP-BC exam blueprint including clinical knowledge, evidence-based practice, and professional role development.
The ANCC exam includes more questions about professional role, research methodology, healthcare policy, and quality improvement compared to AANP.
Questions should test advanced clinical reasoning with emphasis on evidence-based practice frameworks and interprofessional collaboration.
Each question must include a detailed clinical scenario with specific patient data, lab results, and diagnostic findings.`,

  np_agpcnp: `You are an Adult-Gerontology Primary Care Nurse Practitioner (AGPCNP-BC) certification exam item writer for NurseNest.
Your questions must focus on primary care management of adults and older adults across the health-illness continuum.
Cover chronic disease management, health promotion for aging populations, polypharmacy assessment, geriatric syndromes, and age-specific screening guidelines.
Questions should test advanced clinical reasoning for managing complex multi-morbidity in adult and geriatric primary care settings.
Each question must include detailed clinical scenarios with age-appropriate considerations, medication lists, and comorbidity profiles.`,

  np_agacnp: `You are an Adult-Gerontology Acute Care Nurse Practitioner (AGACNP-BC) certification exam item writer for NurseNest.
Your questions must focus on acute, critical, and complex care management of adults and older adults.
Cover hemodynamic monitoring, mechanical ventilation, vasoactive medications, acute decompensation, post-surgical management, and ICU-level clinical decision-making.
Questions should test advanced clinical reasoning for managing acutely ill and critically ill adult and geriatric patients.
Each question must include detailed clinical scenarios with vital signs, lab trends, ventilator settings, and hemodynamic parameters.`,

  np_enp: `You are an Emergency Nurse Practitioner (ENP-C) certification exam item writer for NurseNest.
Your questions must focus on emergency and urgent care across the lifespan including trauma, acute medical emergencies, toxicology, and procedural skills.
Cover triage decision-making, rapid differential diagnosis, emergency pharmacology, wound management, fracture evaluation, and disposition planning.
Questions should test advanced clinical reasoning under time pressure with emphasis on life-threatening condition recognition and stabilization.
Each question must include detailed emergency scenarios with vital signs, mechanism of injury, and time-sensitive clinical data.`,

  respiratory_therapy: `You are a Registered Respiratory Therapist (RRT) certification exam item writer for NurseNest.
Your questions must cover respiratory assessment, mechanical ventilation, airway management, ABG interpretation, pulmonary function testing, and respiratory pharmacology.
Questions should reflect TMC and Clinical Simulation Exam content for RRT certification.`,

  medical_lab_tech: `You are a Medical Laboratory Technologist (MLT) certification exam item writer for NurseNest.
Your questions must cover clinical chemistry, hematology, microbiology, immunology, blood banking, and laboratory safety.
Questions should reflect ASCP certification exam content for MLT.`,

  paramedic: `You are a Paramedic/EMS (NREMT) certification exam item writer for NurseNest.
Your questions must cover prehospital emergency care, trauma assessment, cardiac emergencies, airway management, pharmacology, and patient transport decisions.
Questions should reflect NREMT certification exam content.`,

  radiologic_tech: `You are a Radiologic Technologist (ARRT) certification exam item writer for NurseNest.
Your questions must cover radiographic procedures, patient positioning, radiation safety, image evaluation, and equipment operation.
Questions should reflect ARRT certification exam content.`,

  diagnostic_sonography: `You are a Diagnostic Medical Sonographer (ARDMS) certification exam item writer for NurseNest.
Your questions must cover ultrasound physics, abdominal sonography, OB/GYN sonography, vascular sonography, and image interpretation.
Questions should reflect ARDMS certification exam content.`,

  cardiac_sonographer: `You are a Cardiac Sonographer (RDCS/RCS) certification exam item writer for NurseNest.
Your questions must cover echocardiography, cardiac anatomy, hemodynamic assessment, valvular pathology, and congenital heart disease imaging.
Questions should reflect RDCS/RCS certification exam content.`,

  occupational_therapy_asst: `You are an Occupational Therapy Assistant (COTA) certification exam item writer for NurseNest.
Your questions must cover therapeutic interventions, functional assessments, adaptive equipment, activity analysis, and OT treatment planning.
Questions should reflect NBCOT COTA certification exam content.`,

  physical_therapy_asst: `You are a Physical Therapy Assistant (PTA) certification exam item writer for NurseNest.
Your questions must cover therapeutic exercises, modalities, gait training, patient transfers, and PT treatment implementation.
Questions should reflect NPTE PTA certification exam content.`,

  pharmacy_tech: `You are a Pharmacy Technician (PTCB) certification exam item writer for NurseNest.
Your questions must cover medication dispensing, compounding, inventory management, pharmacy law, and drug calculations.
Questions should reflect PTCB certification exam content.`,

  surgical_tech: `You are a Surgical Technologist (CST) certification exam item writer for NurseNest.
Your questions must cover surgical procedures, sterile technique, instrumentation, perioperative care, and surgical anatomy.
Questions should reflect NBSTSA CST certification exam content.`,

  dental_hygienist: `You are a Dental Hygienist (NBDHE) certification exam item writer for NurseNest.
Your questions must cover oral anatomy, periodontal assessment, dental radiography, patient education, and infection control.
Questions should reflect NBDHE certification exam content.`,

  dietitian: `You are a Registered Dietitian (RD) certification exam item writer for NurseNest.
Your questions must cover medical nutrition therapy, clinical nutrition, food science, community nutrition, and foodservice management.
Questions should reflect CDR RD certification exam content.`,

  social_worker: `You are a Social Worker (ASWB) licensing exam item writer for NurseNest.
Your questions must cover human development, social work ethics, assessment and intervention, diversity, and professional practice.
Include both ASWB and Canadian social work licensing content.
Questions should reflect clinical and macro social work practice scenarios.`,

  cert_acls: `You are an ACLS (Advanced Cardiovascular Life Support) certification exam item writer for NurseNest.
Your questions must cover cardiac arrest algorithms, arrhythmia management, post-cardiac arrest care, and team dynamics.
Questions should align with current AHA ACLS guidelines.`,

  cert_bls: `You are a BLS (Basic Life Support) certification exam item writer for NurseNest.
Your questions must cover CPR technique, AED use, choking management, and rescue breathing for adults, children, and infants.
Questions should align with current AHA BLS guidelines.`,

  cert_pals: `You are a PALS (Pediatric Advanced Life Support) certification exam item writer for NurseNest.
Your questions must cover pediatric cardiac arrest, respiratory emergencies, shock management, and weight-based drug dosing.
Questions should align with current AHA PALS guidelines.`,

  cert_nrp: `You are an NRP (Neonatal Resuscitation Program) certification exam item writer for NurseNest.
Your questions must cover neonatal resuscitation algorithm, initial steps, positive pressure ventilation, chest compressions, and medications.
Questions should align with current NRP guidelines.`,

  cert_ccrn: `You are a CCRN (Critical Care Registered Nurse) certification exam item writer for NurseNest.
Your questions must cover critical care nursing, hemodynamic monitoring, mechanical ventilation, vasoactive medications, and multi-organ failure.
Questions should reflect AACN CCRN certification exam blueprint.`,

  cert_cen: `You are a CEN (Certified Emergency Nurse) certification exam item writer for NurseNest.
Your questions must cover emergency nursing, triage, trauma assessment, toxicology, and environmental emergencies.
Questions should reflect BCEN CEN certification exam blueprint.`,

  cert_med_surg: `You are a CMSRN (Medical-Surgical Nursing) certification exam item writer for NurseNest.
Your questions must cover medical-surgical nursing, perioperative care, chronic disease management, and patient safety.
Questions should reflect AMSN CMSRN certification exam blueprint.`,

  cert_oncology: `You are an OCN (Oncology Certified Nurse) certification exam item writer for NurseNest.
Your questions must cover cancer pathophysiology, chemotherapy protocols, radiation therapy, oncologic emergencies, and palliative care.
Questions should reflect ONCC OCN certification exam blueprint.`,

  cert_wound_care: `You are a WCC/CWCN (Wound Care Certification) exam item writer for NurseNest.
Your questions must cover wound assessment, pressure injury staging, dressing selection, debridement, and compression therapy.
Questions should reflect wound care certification exam content.`,

  cert_infection_control: `You are a CIC (Infection Control) certification exam item writer for NurseNest.
Your questions must cover infection prevention, outbreak investigation, sterilization, surveillance, and antimicrobial stewardship.
Questions should reflect CBIC CIC certification exam blueprint.`,

  cert_gerontology: `You are a GERO-BC (Gerontological Nursing) certification exam item writer for NurseNest.
Your questions must cover geriatric syndromes, falls prevention, polypharmacy, dementia care, end-of-life, and elder abuse.
Questions should reflect ANCC GERO-BC certification exam blueprint.`,
};

const DEFAULT_PROMPT_BASE = TIER_PROMPT_BASES.rpn;

const ANTI_ECHO_SYSTEM = `
CRITICAL RULES FOR OUTPUT:
1. You must output ONLY valid JSON matching the schema below. No markdown, no code fences, no prose.
2. NEVER copy, paraphrase, or reference the user's instructions, system prompt, or any meta-instructions in ANY output field.
3. The "title" or "stem" fields must contain ONLY clinical question content. Never include phrases like "Generate questions", "Output JSON", "You are", "Instructions:", "Follow these", or any directive language.
4. If you cannot produce the requested number of questions, produce as many as you can - never pad with empty or placeholder items.
5. Every question must be unique with a distinct clinical scenario.
6. Do NOT use any emoji characters anywhere. Plain text only.
`;

interface PromptState {
  byType: Record<string, number>;
  byDifficulty: Record<string, number>;
  bySystem: Record<string, number>;
  byTopic: Record<string, number>;
  lastStems: string[];
  lastHashes: string[];
}

function getDefaultPromptState(): PromptState {
  return {
    byType: { MCQ: 0, SATA: 0 },
    byDifficulty: { moderate: 0, hard: 0, very_challenging: 0 },
    bySystem: {},
    byTopic: {},
    lastStems: [],
    lastHashes: [],
  };
}

function parseTopics(topicStr: string | null | undefined): string[] {
  if (!topicStr) return [];
  return topicStr
    .split(/[,;]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0 && t.length <= 100);
}

function getTierPromptBase(tier: string | null | undefined): string {
  const key = (tier || "rpn").toLowerCase();
  return TIER_PROMPT_BASES[key] || TIER_PROMPT_BASES.rpn;
}

function computeTopicDistribution(topics: string[], targetCount: number): Record<string, number> {
  if (topics.length === 0) return {};
  const perTopic = Math.floor(targetCount / topics.length);
  const remainder = targetCount % topics.length;
  const dist: Record<string, number> = {};
  topics.forEach((t, i) => {
    dist[t] = perTopic + (i < remainder ? 1 : 0);
  });
  return dist;
}

function getTopicNeedsBlock(topics: string[], state: PromptState, targetCount: number): string {
  if (topics.length === 0) return "";
  const dist = computeTopicDistribution(topics, targetCount);
  const lines = [`Topic distribution targets:`];
  for (const [topic, target] of Object.entries(dist)) {
    const done = state.byTopic[topic] || 0;
    const need = Math.max(0, target - done);
    lines.push(`- ${topic}: need ~${need} more (${done}/${target} done)`);
  }
  const underrep = topics.filter(t => {
    const target = dist[t] || 0;
    const done = state.byTopic[t] || 0;
    return done < target;
  });
  if (underrep.length > 0) {
    lines.push(`Focus this chunk on: ${underrep.slice(0, 3).join(", ")}`);
  }
  return lines.join("\n");
}

function computeDistributionNeeds(state: PromptState, remaining: number, targetCount: number): string {
  const totalSoFar = (state.byType.MCQ || 0) + (state.byType.SATA || 0);
  const targetMcq = Math.round(targetCount * 0.7);
  const targetSata = targetCount - targetMcq;
  const needMcq = Math.max(0, targetMcq - (state.byType.MCQ || 0));
  const needSata = Math.max(0, targetSata - (state.byType.SATA || 0));

  const targetMod = Math.round(targetCount * 0.30);
  const targetHard = Math.round(targetCount * 0.45);
  const targetVC = Math.round(targetCount * 0.25);

  const currentMod = state.byDifficulty.moderate || 0;
  const currentHard = state.byDifficulty.hard || 0;
  const currentVC = state.byDifficulty.very_challenging || 0;

  const needMod = Math.max(0, targetMod - currentMod);
  const needHard = Math.max(0, targetHard - currentHard);
  const needVC = Math.max(0, targetVC - currentVC);

  const lines = [
    `Distribution needs for this chunk:`,
    `- Type: need ~${needMcq} MCQ and ~${needSata} SATA (${totalSoFar}/${targetCount} done)`,
    `- Difficulty target: 30% moderate (easy), 45% hard (moderate), 25% very_challenging (hard)`,
    `- Difficulty needs: ~${needMod} moderate, ~${needHard} hard, ~${needVC} very_challenging`,
  ];

  const underrep = VALID_SYSTEMS.filter(s => !state.bySystem[s] || state.bySystem[s] < Math.ceil(targetCount / VALID_SYSTEMS.length));
  if (underrep.length > 0) {
    lines.push(`- Prioritize systems: ${underrep.slice(0, 5).join(", ")}`);
  }

  return lines.join("\n");
}

function validateDifficultyDistribution(items: any[]): { balanced: boolean; feedback: string } {
  if (items.length === 0) return { balanced: true, feedback: "" };
  
  const counts = { moderate: 0, hard: 0, very_challenging: 0 };
  for (const item of items) {
    const d = (item.difficulty || "moderate").toLowerCase();
    if (d in counts) counts[d as keyof typeof counts]++;
  }
  
  const total = items.length;
  const modPct = counts.moderate / total;
  const hardPct = counts.hard / total;
  const vcPct = counts.very_challenging / total;
  
  const driftThreshold = 0.20;
  const drifted = 
    Math.abs(modPct - 0.30) > driftThreshold ||
    Math.abs(hardPct - 0.45) > driftThreshold ||
    Math.abs(vcPct - 0.25) > driftThreshold;
  
  return {
    balanced: !drifted,
    feedback: drifted 
      ? `Difficulty drift detected: moderate=${Math.round(modPct*100)}% (target 30%), hard=${Math.round(hardPct*100)}% (target 45%), very_challenging=${Math.round(vcPct*100)}% (target 25%)`
      : "",
  };
}

function buildChunkPrompt(
  promptBase: string,
  startIdx: number,
  chunkSize: number,
  state: PromptState,
  targetCount: number,
  region: string,
  topics: string[] = [],
  targetLanguage: string = "en",
): { system: string; user: string } {
  const distributionBlock = computeDistributionNeeds(state, targetCount - (state.byType.MCQ || 0) - (state.byType.SATA || 0), targetCount);
  const topicBlock = getTopicNeedsBlock(topics, state, targetCount);
  const antiDupe = state.lastStems.length > 0
    ? `\nAvoid duplicating these recent stems:\n${state.lastStems.slice(-20).map((s, i) => `${i + 1}. ${s.substring(0, 80)}...`).join("\n")}`
    : "";

  const regionNote = region === "CA"
    ? "Use Canadian context: SI units (mmol/L, umol/L, Celsius, kg), Canadian drug names, RPN scope."
    : region === "US"
    ? "Use US context: conventional units (mEq/L, mg/dL, Fahrenheit, lbs), LPN/LVN scope."
    : "Include both CA and US reference values where applicable.";

  const topicInstruction = topics.length > 0
    ? `\nYou MUST generate questions covering these topics: ${topics.join(", ")}. Distribute questions proportionally across all listed topics. Each question's "topic" field must match one of the specified topics exactly.`
    : "";

  const languageBlock = getLanguageInstructionBlock(targetLanguage);
  const terminologyBlock = getTerminologyPromptBlock(targetLanguage);

  const system = `${promptBase}
${ANTI_ECHO_SYSTEM}
${regionNote}
${topicInstruction}
${languageBlock}
${terminologyBlock}

You will be called multiple times to generate questions in chunks.
You MUST return EXACTLY ${chunkSize} question objects in the "items" array. Not ${chunkSize - 1}, not ${chunkSize + 1}. Exactly ${chunkSize}.

Return strict JSON only. The JSON object must have exactly one key "items" containing an array of ${chunkSize} question objects.

Each question object schema:
{
  "type": "MCQ" or "SATA",
  "difficulty": "moderate" or "hard" or "very_challenging",
  "system": one of [${VALID_SYSTEMS.map(s => `"${s}"`).join(", ")}],
  "topic": "string - the clinical topic",
  "stem": "A detailed clinical scenario question (min 40 chars, NO instruction text)",
  "scenario": "Extended clinical context",
  "choices": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, ...],
  "correct_answers": ["B"] for MCQ (exactly 1) or ["A","C","D"] for SATA (2-5),
  "rationale": {
    "correctReasoning": "Why the correct answer is right (min 10 chars)",
    "incorrectBreakdown": {"A": "Why wrong...", "C": "Why wrong..."},
    "keyPathophysiology": "Key pathophysiology concept",
    "nursingImplication": "Clinical nursing implication"
  },
  "exam_pearl": "A concise clinical pearl for exam prep"
}

MCQ rules: exactly 4 choices (A-D), exactly 1 correct answer.
SATA rules: 5-8 choices (A through E/F/G/H), 2-5 correct answers.

${distributionBlock}
${topicBlock ? "\n" + topicBlock : ""}
${antiDupe}

Return EXACTLY ${chunkSize} items. JSON only. No extra text, no markdown, no explanation.`;

  const user = `Return a JSON object with an "items" array containing exactly ${chunkSize} nursing exam questions (items ${startIdx} through ${startIdx + chunkSize - 1}). Each question must have a unique clinical scenario.`;

  return { system, user };
}

function buildRetryPrompt(
  promptBase: string,
  requestedCount: number,
  returnedCount: number,
  failureReason: string,
  region: string,
  topics: string[] = [],
  targetLanguage: string = "en",
): { system: string; user: string } {
  const regionNote = region === "CA"
    ? "Use Canadian context: SI units, Canadian drug names, RPN scope."
    : region === "US"
    ? "Use US context: conventional units, LPN/LVN scope."
    : "";

  const topicInstruction = topics.length > 0
    ? `Topics to cover: ${topics.join(", ")}.`
    : "";

  const languageBlock = getLanguageInstructionBlock(targetLanguage);
  const terminologyBlock = getTerminologyPromptBlock(targetLanguage);

  const system = `${promptBase}
${ANTI_ECHO_SYSTEM}
${regionNote}
${topicInstruction}
${languageBlock}
${terminologyBlock}

PREVIOUS ATTEMPT FAILED: ${failureReason}

You MUST return EXACTLY ${requestedCount} question objects. Not fewer, not more.
Return strict JSON with one key "items" containing an array of exactly ${requestedCount} objects.

Each question object must have: type, difficulty, system, topic, stem, scenario, choices, correct_answers, rationale, exam_pearl.
MCQ: 4 choices (A-D), 1 correct. SATA: 5-8 choices, 2-5 correct.

CRITICAL: Do NOT use any emoji. Plain text only. JSON only. No markdown.`;

  const user = `You previously returned ${returnedCount} questions instead of ${requestedCount}. Return a complete JSON object with "items" array containing EXACTLY ${requestedCount} unique nursing exam questions. Every question needs a distinct clinical scenario.`;

  return { system, user };
}

function buildReplacementPrompt(
  promptBase: string,
  invalidItems: { idx: number; errors: string[] }[],
  region: string,
  targetLanguage: string = "en",
): { system: string; user: string } {
  const languageBlock = getLanguageInstructionBlock(targetLanguage);
  const terminologyBlock = getTerminologyPromptBlock(targetLanguage);

  const system = `${promptBase}
${ANTI_ECHO_SYSTEM}
You are replacing specific invalid questions. Return ONLY the replacement items.
${region === "CA" ? "Use Canadian context: SI units, Canadian drug names, RPN scope." : ""}
${languageBlock}
${terminologyBlock}

Return JSON: {"replacements": [...]} where each item has: idx, type, difficulty, system, topic, stem, scenario, choices, correct_answers, rationale, exam_pearl.
MCQ: 4 choices (A-D), 1 correct. SATA: 5-8 choices, 2-5 correct.
JSON only. No markdown. No emoji.`;

  const user = `Replace these invalid items:\n${invalidItems.map(i => `- idx ${i.idx}: ${i.errors.join("; ")}`).join("\n")}\n\nReturn JSON with "replacements" array containing corrected items for these exact idx values.`;

  return { system, user };
}

async function callModel(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
): Promise<{ content: string; tokens: number }> {
  const { routeAIRequest } = await import("../ai-provider-router");
  const result = await routeAIRequest(systemPrompt, userPrompt, {
    model: "gpt-4o-mini",
    maxTokens,
    temperature: 0.3,
    responseFormat: { type: "json_object" },
    taskType: "qbank",
    feature: "generatorV2-worker",
  });

  return {
    content: result.content || "{}",
    tokens: result.tokensUsed || 0,
  };
}

function parseModelResponse(raw: string): any[] {
  const cleaned = extractJsonFromResponse(raw);
  const parsed = JSON.parse(cleaned);

  if (Array.isArray(parsed.items)) return parsed.items;
  if (Array.isArray(parsed.questions)) return parsed.questions;
  if (Array.isArray(parsed.replacements)) return parsed.replacements;
  if (Array.isArray(parsed)) return parsed;

  for (const key of Object.keys(parsed)) {
    if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
      const first = parsed[key][0];
      if (first && typeof first === "object" && (first.stem || first.type || first.choices)) {
        return parsed[key];
      }
    }
  }

  return [];
}

async function generateChunkWithRetry(
  promptBase: string,
  startIdx: number,
  chunkSize: number,
  state: PromptState,
  targetCount: number,
  region: string,
  topics: string[],
  existingHashes: Set<string>,
  generationId: string,
  maxRetries: number = 2,
  targetLanguage: string = "en",
): Promise<{ valid: ValidationResult[]; invalid: { idx: number; errors: string[] }[]; tokens: number; languageValidation?: { checked: boolean; mismatches: number } }> {
  let totalTokens = 0;
  let lastReceivedCount = 0;
  let lastFailReason = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let items: any[];

    try {
      let systemPrompt: string;
      let userPrompt: string;

      if (attempt === 0) {
        const prompts = buildChunkPrompt(promptBase, startIdx, chunkSize, state, targetCount, region, topics, targetLanguage);
        systemPrompt = prompts.system;
        userPrompt = prompts.user;
      } else {
        const reason = lastFailReason || `Returned ${lastReceivedCount} items instead of ${chunkSize}`;
        const prompts = buildRetryPrompt(promptBase, chunkSize, lastReceivedCount, reason, region, topics, targetLanguage);
        systemPrompt = prompts.system;
        userPrompt = prompts.user;
      }

      const maxTokens = Math.min(chunkSize * 600 + 500, 16384);
      const result = await callModel(systemPrompt, userPrompt, maxTokens);
      totalTokens += result.tokens;

      items = parseModelResponse(result.content);
      lastReceivedCount = items.length;

      console.log(`[GenV2] Chunk attempt ${attempt + 1}: requested=${chunkSize}, received=${items.length}`);

      await storage.createGenerationEvent({
        generationId,
        eventType: attempt === 0 ? "chunk_received" : "chunk_retry_received",
        payload: { attempt: attempt + 1, requestedCount: chunkSize, receivedCount: items.length, tokens: result.tokens },
      });

    } catch (err: any) {
      console.error(`[GenV2] Chunk attempt ${attempt + 1} failed:`, err.message);
      lastFailReason = `API error: ${err.message}`;
      await storage.createGenerationEvent({
        generationId,
        eventType: "chunk_error",
        payload: { attempt: attempt + 1, error: err.message },
      });

      if (attempt === maxRetries) {
        return { valid: [], invalid: [], tokens: totalTokens };
      }
      await new Promise(r => setTimeout(r, 1500));
      continue;
    }

    if (items.length === 0) {
      lastFailReason = "Returned 0 items";
      console.log(`[GenV2] Attempt ${attempt + 1}: 0 items parsed, retrying...`);
      if (attempt === maxRetries) {
        return { valid: [], invalid: [], tokens: totalTokens };
      }
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }

    let { valid, invalid } = validateChunk(items, startIdx, existingHashes);

    if (valid.length > 0) {
      const diffCheck = validateDifficultyDistribution(items);
      if (!diffCheck.balanced) {
        console.log(`[GenV2] ${diffCheck.feedback}`);
        await storage.createGenerationEvent({
          generationId,
          eventType: "difficulty_drift",
          payload: { feedback: diffCheck.feedback, itemCount: items.length, attempt: attempt + 1 },
        });

        if (attempt < maxRetries) {
          console.log(`[GenV2] Rejecting chunk due to difficulty drift, retrying (attempt ${attempt + 1}/${maxRetries})...`);
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        console.log(`[GenV2] Accepting drifted chunk after exhausting retries`);
      }

      if (valid.length < chunkSize && attempt < maxRetries) {
        console.log(`[GenV2] Attempt ${attempt + 1}: only ${valid.length}/${chunkSize} valid (${invalid.length} invalid). Accepting partial, outer loop will request more.`);
      }

      let languageValidation: { checked: boolean; mismatches: number; filtered: number } | undefined;
      if (targetLanguage && targetLanguage !== "en") {
        let mismatches = 0;
        const languageValid: ValidationResult[] = [];
        for (const v of valid) {
          const rationaleText = v.normalized?.rationale
            ? [
                v.normalized.rationale.correctReasoning || "",
                v.normalized.rationale.keyPathophysiology || "",
                v.normalized.rationale.nursingImplication || "",
                ...Object.values(v.normalized.rationale.incorrectBreakdown || {}),
              ].join(" ")
            : "";
          const choiceTexts = (v.normalized?.choices || []).map((c: any) => c.text || "").join(" ");
          const textsToCheck = [
            v.normalized?.stem || "",
            rationaleText,
            v.normalized?.scenario || "",
            choiceTexts,
          ].filter(t => typeof t === "string" && t.length > 20);
          const textToCheck = textsToCheck.join(" ");
          if (!textToCheck) {
            languageValid.push(v);
            continue;
          }
          const langCheck = validateGeneratedLanguage(textToCheck, targetLanguage);
          if (!langCheck.valid) {
            mismatches++;
            console.warn(`[GenV2] Language mismatch: expected ${targetLanguage}, detected ${langCheck.result.detectedLanguage} for item idx ${v.normalized?.idx}`);
            invalid.push({ idx: v.normalized?.idx ?? -1, errors: [`Language mismatch: expected ${targetLanguage}, got ${langCheck.result.detectedLanguage}`] });
          } else {
            languageValid.push(v);
          }
        }
        const filtered = valid.length - languageValid.length;
        valid = languageValid;
        languageValidation = { checked: true, mismatches, filtered };
        if (mismatches > 0) {
          await storage.createGenerationEvent({
            generationId,
            eventType: "language_validation",
            payload: { targetLanguage, mismatches, filtered, totalChecked: valid.length + filtered },
          });

          await logTranslationEvent({
            eventType: "language_mismatch",
            contentType: "exam_question",
            language: targetLanguage,
            generatorName: "generatorV2-worker",
            generationId,
            severity: "warning",
            details: { mismatches, filtered, totalChecked: valid.length + filtered, attempt: attempt + 1 },
          });

          if (valid.length === 0 && attempt < maxRetries) {
            console.log(`[GenV2] All items failed language validation for ${targetLanguage}, retrying...`);
            lastFailReason = `All items generated in wrong language (expected ${targetLanguage})`;
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
        }
      }

      return { valid, invalid, tokens: totalTokens, languageValidation };
    }

    lastFailReason = `All ${items.length} items failed validation: ${invalid.slice(0, 3).map(i => i.errors[0]).join("; ")}`;
    console.log(`[GenV2] Attempt ${attempt + 1}: all ${items.length} items invalid, retrying...`);
    await storage.createGenerationEvent({
      generationId,
      eventType: "chunk_all_invalid",
      payload: { attempt: attempt + 1, invalidCount: invalid.length, reasons: invalid.slice(0, 5).map(i => i.errors) },
    });

    if (attempt < maxRetries) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return { valid: [], invalid: [], tokens: totalTokens };
}

export async function runGenerationWorker(generationId: string): Promise<void> {
  let gen = await storage.getProductGeneration(generationId);
  if (!gen) throw new Error("Generation not found");

  if (gen.status === "complete") return;

  await storage.updateProductGeneration(generationId, {
    status: "running",
    startedAt: gen.startedAt || new Date(),
    lastError: null,
  });

  await storage.createGenerationEvent({
    generationId,
    eventType: "run_started",
    payload: { resumeFrom: gen.createdCount },
  });

  const settings = (gen.settings as Record<string, any>) || {};
  const tier = settings.tier || "rpn";
  const topics = parseTopics(gen.topic);
  const tierBase = getTierPromptBase(tier);
  const customInstructions = gen.promptBase || "";
  const promptBase = customInstructions
    ? `${tierBase}\n\nAdditional instructions from admin:\n${customInstructions}`
    : tierBase;
  const targetCount = gen.targetCount;
  const region = gen.region || "BOTH";
  const targetLanguage = settings.targetLanguage || "en";
  let state: PromptState = (gen.promptState as PromptState) || getDefaultPromptState();
  if (!state.byTopic) state.byTopic = {};

  const MAX_CHUNK = 10;
  const DEFAULT_CHUNK = 5;
  const CHUNK_SIZE = Math.min(gen.chunkSize || DEFAULT_CHUNK, MAX_CHUNK);

  const existingQuestions = await storage.getGeneratedQuestions(generationId);
  const existingHashes = new Set(existingQuestions.map(q => q.hash).filter(Boolean) as string[]);
  let currentCount = existingQuestions.length;
  let maxIdx = existingQuestions.reduce((max, q) => Math.max(max, q.idx), 0);
  let consecutiveEmptyChunks = 0;
  const MAX_EMPTY_CHUNKS = 5;

  console.log(`[GenV2] Starting worker for ${generationId}: ${currentCount}/${targetCount} done, tier=${tier}, topics=[${topics.join(", ")}], chunkSize=${CHUNK_SIZE}`);

  while (currentCount < targetCount) {
    gen = await storage.getProductGeneration(generationId);
    if (!gen || gen.status === "paused") {
      console.log(`[GenV2] Job ${generationId} paused`);
      return;
    }

    const remaining = targetCount - currentCount;
    const thisChunkSize = Math.min(CHUNK_SIZE, remaining);
    const startIdx = maxIdx + 1;

    console.log(`[GenV2] Chunk: generating ${thisChunkSize} items starting at idx ${startIdx} (${currentCount}/${targetCount})${targetLanguage !== "en" ? ` [lang=${targetLanguage}]` : ""}`);

    await storage.createGenerationEvent({
      generationId,
      eventType: "chunk_requested",
      payload: { startIdx, count: thisChunkSize, currentCount, targetCount, targetLanguage },
    });

    const { valid, invalid, tokens, languageValidation } = await generateChunkWithRetry(
      promptBase, startIdx, thisChunkSize, state, targetCount, region, topics, existingHashes, generationId, 2, targetLanguage,
    );

    if (valid.length === 0) {
      consecutiveEmptyChunks++;
      console.log(`[GenV2] No valid items from chunk (${consecutiveEmptyChunks}/${MAX_EMPTY_CHUNKS} consecutive)`);

      if (consecutiveEmptyChunks >= MAX_EMPTY_CHUNKS) {
        await storage.updateProductGeneration(generationId, {
          status: "failed",
          lastError: `${MAX_EMPTY_CHUNKS} consecutive chunks produced no valid items`,
        });
        return;
      }
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }

    consecutiveEmptyChunks = 0;

    const toSave = valid.map(v => ({
      generationId,
      idx: v.normalized!.idx,
      type: v.normalized!.type,
      difficulty: v.normalized!.difficulty,
      system: v.normalized!.system,
      stem: v.normalized!.stem,
      scenario: v.normalized!.scenario,
      choices: v.normalized!.choices,
      correctAnswers: v.normalized!.correctAnswers,
      rationale: v.normalized!.rationale,
      examPearl: v.normalized!.examPearl,
      hash: v.normalized!.hash,
    }));

    await storage.createGeneratedQuestionsBulk(toSave);

    const taxonomyMappings: Array<{ original: string; canonical: string; method: string; confidence: number; fallback: boolean }> = [];

    for (const v of valid) {
      existingHashes.add(v.normalized!.hash);
      state.byType[v.normalized!.type] = (state.byType[v.normalized!.type] || 0) + 1;
      state.byDifficulty[v.normalized!.difficulty] = (state.byDifficulty[v.normalized!.difficulty] || 0) + 1;
      state.bySystem[v.normalized!.system] = (state.bySystem[v.normalized!.system] || 0) + 1;
      const itemTopic = v.normalized!.topic || v.normalized!.system;
      state.byTopic[itemTopic] = (state.byTopic[itemTopic] || 0) + 1;
      state.lastStems.push(v.normalized!.stem.substring(0, 100));
      if (state.lastStems.length > 30) state.lastStems = state.lastStems.slice(-20);
      state.lastHashes.push(v.normalized!.hash);
      if (state.lastHashes.length > 30) state.lastHashes = state.lastHashes.slice(-20);
      maxIdx = Math.max(maxIdx, v.normalized!.idx);

      const tm = v.normalized!.taxonomyMapping;
      if (tm) {
        taxonomyMappings.push({
          original: tm.originalTopic || tm.originalSystem,
          canonical: tm.canonicalTopic,
          method: tm.method,
          confidence: tm.confidence,
          fallback: tm.fallbackApplied,
        });

        if (tm.fallbackApplied || tm.confidence < 0.7) {
          try {
            await storage.createTaxonomyReviewEntry({
              originalTopic: tm.originalTopic,
              originalSystem: tm.originalSystem,
              suggestedTopic: tm.canonicalTopic,
              suggestedSystem: tm.canonicalSystem,
              confidence: tm.confidence,
              matchMethod: tm.method,
              bodySystem: tm.canonicalSystem,
              generationId,
            });
          } catch (e) {
            console.warn(`[GenV2] Failed to log taxonomy review entry:`, e);
          }
        }
      }
    }

    currentCount += valid.length;

    await storage.createGenerationEvent({
      generationId,
      eventType: "chunk_saved",
      payload: {
        savedCount: valid.length,
        invalidCount: invalid.length,
        totalCount: currentCount,
        topicDistribution: state.byTopic,
        taxonomySummary: {
          totalMapped: taxonomyMappings.length,
          fallbacks: taxonomyMappings.filter(m => m.fallback).length,
          fuzzyMatches: taxonomyMappings.filter(m => m.method === "fuzzy").length,
          synonymMatches: taxonomyMappings.filter(m => m.method === "synonym").length,
          exactMatches: taxonomyMappings.filter(m => m.method === "exact").length,
          mappings: taxonomyMappings.slice(0, 10),
        },
      },
    });

    await storage.updateProductGeneration(generationId, {
      createdCount: currentCount,
      promptState: state,
    });

    console.log(`[GenV2] Saved ${valid.length} valid, ${invalid.length} invalid. Total: ${currentCount}/${targetCount}`);

    if (invalid.length > 0 && currentCount < targetCount) {
      console.log(`[GenV2] Requesting replacements for ${invalid.length} invalid items`);

      await storage.createGenerationEvent({
        generationId,
        eventType: "replacement_requested",
        payload: { invalidIds: invalid.map(i => i.idx), reasons: invalid.map(i => i.errors) },
      });

      try {
        const { system: rSys, user: rUser } = buildReplacementPrompt(promptBase, invalid, region, targetLanguage);
        const rResult = await callModel(rSys, rUser, Math.min(invalid.length * 600 + 500, 8192));
        const replacements = parseModelResponse(rResult.content);
        const { valid: rValid } = validateChunk(replacements, maxIdx + 1, existingHashes);

        if (rValid.length > 0) {
          const rToSave = rValid.map(v => ({
            generationId,
            idx: v.normalized!.idx,
            type: v.normalized!.type,
            difficulty: v.normalized!.difficulty,
            system: v.normalized!.system,
            stem: v.normalized!.stem,
            scenario: v.normalized!.scenario,
            choices: v.normalized!.choices,
            correctAnswers: v.normalized!.correctAnswers,
            rationale: v.normalized!.rationale,
            examPearl: v.normalized!.examPearl,
            hash: v.normalized!.hash,
          }));

          await storage.createGeneratedQuestionsBulk(rToSave);

          for (const v of rValid) {
            existingHashes.add(v.normalized!.hash);
            state.byType[v.normalized!.type] = (state.byType[v.normalized!.type] || 0) + 1;
            state.byDifficulty[v.normalized!.difficulty] = (state.byDifficulty[v.normalized!.difficulty] || 0) + 1;
            state.bySystem[v.normalized!.system] = (state.bySystem[v.normalized!.system] || 0) + 1;
            maxIdx = Math.max(maxIdx, v.normalized!.idx);
          }

          currentCount += rValid.length;

          await storage.updateProductGeneration(generationId, {
            createdCount: currentCount,
            promptState: state,
          });

          console.log(`[GenV2] Replacement: ${rValid.length} saved. Total: ${currentCount}/${targetCount}`);
        }
      } catch (rErr: any) {
        console.error(`[GenV2] Replacement request failed:`, rErr.message);
        await storage.createGenerationEvent({
          generationId,
          eventType: "replacement_failed",
          payload: { error: rErr.message },
        });
      }
    }
  }

  await storage.updateProductGeneration(generationId, {
    status: "complete",
    completedAt: new Date(),
    createdCount: currentCount,
    promptState: state,
  });

  await storage.createGenerationEvent({
    generationId,
    eventType: "completed",
    payload: { totalCount: currentCount, targetCount },
  });

  console.log(`[GenV2] Generation ${generationId} complete: ${currentCount}/${targetCount}`);
}

export { DEFAULT_PROMPT_BASE, TIER_PROMPT_BASES, parseTopics, getTierPromptBase };
