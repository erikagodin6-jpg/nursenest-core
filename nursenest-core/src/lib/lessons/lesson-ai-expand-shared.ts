/**
 * Shared configuration for RN + RPN/PN clinical lesson AI expansion
 * (`scripts/lesson-ai-expand-lessons.ts`, `scripts/rn-ai-expand-lessons.ts`).
 */
import * as fs from "node:fs";
import * as path from "node:path";

import {
  RN_EXPAND_REQUIRED_SECTION_KINDS,
  type RNExpandRequiredSectionKind,
} from "@/lib/lessons/rn-expanded-lesson-contract";

export type LessonExpandTier = "rn" | "rpn" | "np";

export const LESSON_AI_EXPAND_RN_PATHWAY_IDS = new Set<string>(["ca-rn-nclex-rn", "us-rn-nclex-rn"]);
export const LESSON_AI_EXPAND_RPN_PATHWAY_IDS = new Set<string>(["ca-rpn-rex-pn", "us-lpn-nclex-pn"]);
/** Canadian NP / CNPLE lessons live in `lesson-library.json` (not pathway-lessons slices). */
export const LESSON_AI_EXPAND_NP_PATHWAY_IDS = new Set<string>(["ca-np-cnple"]);

export const LESSON_EXPAND_PROGRESS_FILENAME = "lesson-expand-progress.json";

const CATALOG_SKIP_FILES = new Set([
  "rn-nclex-catalog-import-state.json",
  "rn-nclex-master-map.json",
  "rn-nclex-explicit-inventory-aliases.json",
  "nclex-rn-source-checklist.json",
]);

export function pathwayIdsForTiers(tiers: Set<LessonExpandTier>): Set<string> {
  const out = new Set<string>();
  if (tiers.has("rn")) for (const id of LESSON_AI_EXPAND_RN_PATHWAY_IDS) out.add(id);
  if (tiers.has("rpn")) for (const id of LESSON_AI_EXPAND_RPN_PATHWAY_IDS) out.add(id);
  if (tiers.has("np")) for (const id of LESSON_AI_EXPAND_NP_PATHWAY_IDS) out.add(id);
  return out;
}

export function parseTierCliArg(
  argv: string[],
  defaultTiers: Set<LessonExpandTier>,
): Set<LessonExpandTier> {
  const i = argv.indexOf("--tier");
  if (i === -1 || !argv[i + 1]) return new Set(defaultTiers);
  const raw = argv[i + 1]!.toLowerCase();
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  const out = new Set<LessonExpandTier>();
  for (const p of parts) {
    if (p === "rn") out.add("rn");
    else if (p === "rpn" || p === "pn" || p === "lpn") out.add("rpn");
    else if (p === "np" || p === "cnple") out.add("np");
    else console.warn(`[lesson-ai-expand] Ignoring unknown --tier token: ${p}`);
  }
  return out.size > 0 ? out : new Set(defaultTiers);
}

export function tierForPathwayId(pathwayId: string): LessonExpandTier | null {
  if (LESSON_AI_EXPAND_RN_PATHWAY_IDS.has(pathwayId)) return "rn";
  if (LESSON_AI_EXPAND_RPN_PATHWAY_IDS.has(pathwayId)) return "rpn";
  if (LESSON_AI_EXPAND_NP_PATHWAY_IDS.has(pathwayId)) return "np";
  return null;
}

/** Catalog JSON files under `pathway-lessons` that contain at least one lesson for a target pathway. */
export function getExpandCatalogFiles(
  catalogDir: string,
  targetPathwayIds: Set<string>,
): Array<{ filePath: string; fileName: string }> {
  const results: Array<{ filePath: string; fileName: string }> = [];
  for (const fname of fs.readdirSync(catalogDir).sort()) {
    if (!fname.endsWith(".json") || CATALOG_SKIP_FILES.has(fname)) continue;
    const fpath = path.join(catalogDir, fname);
    let data: unknown;
    try {
      data = JSON.parse(fs.readFileSync(fpath, "utf8"));
    } catch {
      continue;
    }
    if (!data || typeof data !== "object" || !("pathways" in data)) continue;
    const pathways = (data as Record<string, unknown>).pathways;
    if (!pathways || typeof pathways !== "object") continue;
    const has = Object.keys(pathways as object).some((k) => targetPathwayIds.has(k));
    if (has) results.push({ filePath: fpath, fileName: fname });
  }
  return results;
}

export const LESSON_EXPAND_REQUIRED_KINDS = RN_EXPAND_REQUIRED_SECTION_KINDS;
export type LessonExpandSectionKind = RNExpandRequiredSectionKind;

export const LESSON_EXPAND_SECTION_META: Record<
  LessonExpandSectionKind,
  { heading: string; promptRn: string; promptRpn: string; promptNp: string }
> = {
  introduction: {
    heading: "Overview",
    promptRn:
      "Write a clinical overview (150–200 words). Cover: what this condition/topic is, clinical significance, incidence/prevalence where relevant, and which nursing settings encounter it (ICU, med-surg, ED, community, primary care). Be specific to this exact topic — no generic sentences. Do NOT start with the topic name. End one sentence with why it matters for NCLEX-RN clinical judgment.",
    promptRpn:
      "Write a practical-nursing overview (150–200 words). Cover: what this condition/topic is, why it matters on the unit or in community care, and where LPN/RPNs typically see it. Be specific — no generic sentences. Do NOT start with the topic name. End one sentence with exam relevance for REx-PN / NCLEX-PN (safety, scope, prioritization).",
    promptNp:
      "Write a Canadian NP / CNPLE-focused overview (160–220 words). Cover: clinical problem definition, primary care or urgent-care context, why advanced assessment and diagnostic reasoning matter, and how provincial scope shapes ordering and prescribing. Be specific to this topic. Do NOT start with the topic name. Close with one sentence on CNPLE-style exam relevance (risk, scope, documentation, referral).",
  },
  pathophysiology_overview: {
    heading: "Pathophysiology",
    promptRn:
      "Write detailed pathophysiology (250–350 words). Go cellular → organ → systemic. Use step-by-step cause-and-effect chains. Explain compensatory mechanisms the body uses. Include specific cellular/molecular mechanisms (receptor types, enzymes, mediators). Must be detailed enough for a student to explain the disease progression aloud without notes.",
    promptRpn:
      "Write pathophysiology at LPN/RPN depth (220–300 words): enough mechanism to explain signs, treatments you will monitor, and why vitals/labs change — cellular/organ level where it helps bedside reasoning. Use clear cause-and-effect chains. Avoid MD-only management plans; focus on what the practical nurse must recognize and report.",
    promptNp:
      "Write advanced pathophysiology for Canadian NP practice (280–380 words). Cellular → organ → systemic with mechanisms that explain **why** diagnostics and therapies are chosen. Connect compensatory physiology to bedside cues you will monitor. Stay clinically accurate and exam-useful for CNPLE-style integration questions.",
  },
  signs_symptoms: {
    heading: "Signs & Symptoms",
    promptRn:
      "Write Signs & Symptoms (200–250 words). TWO subsections: EARLY SIGNS and LATE/RED FLAG SIGNS. For EACH sign explain WHY it occurs physiologically (link to pathophysiology). Include at least 3 early and 3 late findings. Red flags that require immediate nursing action must be explicitly labeled. Distinguish subjective (patient-reported) from objective (nurse-observed) findings.",
    promptRpn:
      "Write Signs & Symptoms (200–250 words). EARLY vs LATE/RED FLAG subsections. Link each finding to pathophysiology in plain language. Include at least 3 early and 3 late findings. Label what must be reported to the RN or provider immediately. Distinguish subjective vs objective findings.",
    promptNp:
      "Write Signs & Symptoms for NP primary care (220–280 words). EARLY vs LATE/RED FLAG subsections with **escalation** language appropriate to Canadian NP scope (when to arrange urgent imaging, ED referral, specialist consult). Link findings to mechanism. Include objective exam cues you would document.",
  },
  labs_diagnostics: {
    heading: "Diagnostics & Labs",
    promptRn:
      "Write Diagnostics & Labs (180–220 words). List key tests with specific normal vs abnormal values (e.g., troponin >0.04 ng/mL = abnormal, BNP >100 pg/mL). Include critical/panic values that require immediate notification. Cover labs, imaging, and bedside tests relevant to this specific condition. Explain clinical significance of each finding.",
    promptRpn:
      "Write Diagnostics & Labs (180–220 words). Priority tests the practical nurse will see, trend, or transport the patient for — with specific abnormal/critical examples where possible. State what to report and who to notify for critical values. Stay within monitoring and reporting scope.",
    promptNp:
      "Write Diagnostics & Labs for NP ordering and interpretation (220–280 words). Include **numeric** examples (SI where natural for Canada). Cover labs, point-of-care tests, imaging indications, and **what changes management**. Name when to repeat testing, when results demand urgent referral, and documentation expectations.",
  },
  treatments: {
    heading: "Medical Treatments",
    promptRn:
      "Write Medical Treatments (200–250 words). Focus on the MEDICAL management: procedures (e.g., cardioversion, intubation, surgery), IV fluid protocols, oxygen therapy strategies, device therapies, non-pharmacological interventions. Be specific to this condition — mention exact protocols (e.g., Surviving Sepsis Hour-1 Bundle, STEMI door-to-balloon time). Explain rationale for each treatment.",
    promptRpn:
      "Write treatments (200–250 words) from the LPN/RPN lens: oxygen, fluids, procedures, devices, and care routines the team orders that you implement, monitor, and document. Name common protocols where relevant. Emphasize monitoring for effectiveness and adverse responses; clarify you carry out orders and escalate changes — you do not independently prescribe.",
    promptNp:
      "Write a treatment plan overview for Canadian NP practice (240–300 words). Organize first-line therapy, alternatives when contraindicated, non-pharmacologic measures, procedures, and follow-up intervals. Emphasize **collaboration**, **shared decision-making**, and **when care must move to ED, hospital, or specialist** rather than implying unsafe independent management.",
  },
  pharmacology: {
    heading: "Pharmacology",
    promptRn:
      "Write Pharmacology (200–250 words). List the primary drug classes used for this condition. For each class: mechanism of action, clinical purpose, key side effects, contraindications, and ONE nursing pearl. Format each drug entry clearly. Include specific examples (e.g., furosemide for diuresis, metoprolol for rate control). Flag high-alert medications.",
    promptRpn:
      "Write Pharmacology (200–250 words). Drug classes used for this condition: mechanism in plain language, why the team orders them, side effects and monitoring the LPN/RPN performs, administration safety (rights, IV push rules where relevant), and when to hold and notify RN/provider. Flag high-alert medications. No independent dosing decisions.",
    promptNp:
      "Write Pharmacology and prescribing considerations for Canadian NP practice (240–320 words). Mechanism, first-line choice, renal/hepatic adjustments, interactions, monitoring after initiation, deprescribing triggers, and **high-alert** cautions. Tie choices to guideline anchors where appropriate. Remind readers to verify **provincial formulary and scope** rather than memorizing doses alone.",
  },
  nursing_assessment_interventions: {
    heading: "Nursing Interventions",
    promptRn:
      "Write Nursing Interventions (250–300 words). Focus on what the nurse DOES: monitoring parameters and frequency, safety precautions, positioning, IV management, specimen collection, documentation requirements. Include ESCALATION TRIGGERS — specific findings that require calling the provider immediately. Explain the rationale for each major intervention.",
    promptRpn:
      "Write Nursing Interventions (250–300 words). Focused assessment, vitals and intake/output, infection control, safe med administration, wound/skin care, mobility and safety, therapeutic communication, and documentation. Include ESCALATION TRIGGERS with explicit 'notify RN or prescriber when…'. Emphasize scope-appropriate actions — no independent medical diagnosis.",
    promptNp:
      "Write assessment priorities and NP-appropriate interventions (260–320 words). Focused history, risk stratification, physical exam elements, safety planning, monitoring frequency after therapy changes, care coordination, and documentation that supports medicolegal clarity. Include explicit **escalation triggers** and who to involve (physician, specialist, EMS).",
  },
  clinical_decision_making: {
    heading: "Clinical Decision-Making & Priorities",
    promptRn:
      "Write Clinical Decision-Making (150–200 words). Apply ABC framework first. What should the nurse do in the FIRST 15 MINUTES of recognizing this problem? How to prioritize when multiple problems compete (use Maslow + ABCs). Real bedside clinical thinking. Include: when to call rapid response, how to communicate findings (SBAR). No textbook theory — only bedside application.",
    promptRpn:
      "Write Clinical Decision-Making (150–200 words). ABCs first. First 15 minutes: focused assessment, safety, calling for RN or provider when needed, and safe delegation awareness. PN exam-style priority questions — what to do first within practical nursing scope. Use SBAR-style communication examples. When to activate emergency response or notify RN immediately.",
    promptNp:
      "Write Clinical Decision-Making for Canadian NP practice (220–280 words). Include **differential diagnosis** discipline: most likely diagnosis, key alternatives, discriminating features, and **what not to miss**. Apply ABCs when relevant, then outline diagnostics, initial therapy, referral thresholds, and follow-up. Use concise SBAR-style communication examples.",
  },
  complications: {
    heading: "Complications",
    promptRn:
      "Write Complications (150–200 words). Separate ACUTE (immediate, hours to days) from CHRONIC (weeks to years) complications. For each complication: what happens physiologically, timeline if relevant, and the specific nursing implication (what to monitor, when to escalate). Include at least 3 acute and 2 chronic complications specific to this condition.",
    promptRpn:
      "Write Complications (150–200 words). ACUTE vs CHRONIC. For each: what to monitor, infection or deterioration signs, and when to report to RN/provider or EMS. At least 3 acute and 2 chronic complications specific to this condition.",
    promptNp:
      "Write Complications (180–240 words). ACUTE vs CHRONIC with NP-focused monitoring, expected timelines, and **referral or admission** triggers. Tie each complication to a concrete follow-up plan.",
  },
  clinical_pearls: {
    heading: "Clinical Pearls",
    promptRn:
      "Write Clinical Pearls (150–200 words). Include: (1) NCLEX-style common trap — what students INCORRECTLY pick vs the correct answer and why; (2) a memory anchor or mnemonic specific to this topic; (3) how to distinguish this condition from the most commonly confused similar condition; (4) one NEVER DO THIS safety pearl. Make every pearl specific — zero generic exam advice.",
    promptRpn:
      "Write Clinical Pearls (150–200 words). Include: (1) REx-PN / NCLEX-PN style trap — distractor vs correct priority within LPN scope; (2) mnemonic or memory hook; (3) distinguish from a commonly confused presentation; (4) one NEVER DO THIS safety pearl. No generic filler.",
    promptNp:
      "Write Clinical Pearls for CNPLE-style reasoning (180–220 words). Include: (1) a common trap tied to **scope, documentation, or referral**; (2) a memory hook; (3) how to separate this presentation from a close mimic; (4) one NEVER DO THIS safety pearl tied to prescribing, diagnostics, or follow-up.",
  },
  client_education: {
    heading: "Patient & Client Education",
    promptRn:
      "Write Patient Education (150–200 words). Include: when to call 911 (list 3–4 specific symptoms), when to call the provider/clinic (list 3–4 symptoms), medication adherence teaching with specific safety points, lifestyle modifications with rationale, and a teach-back example sentence appropriate for this condition. Be condition-specific throughout.",
    promptRpn:
      "Write Client Education (150–200 words). When to call 911, when to call provider/clinic, med safety and adherence, infection prevention or lifestyle teaching as relevant, and a teach-back example. Use Canadian 'provider/clinic' or US '911' language consistent with the pathway region. Condition-specific throughout.",
    promptNp:
      "Write Patient Education for Canadian primary care (180–230 words). Use **emergency department** or **911** language as appropriate for Canada. Include teach-back, monitoring parameters at home when safe, medication safety, and explicit **return precautions**. Align counseling with realistic follow-up intervals.",
  },
  case_study: {
    heading: "Case-Based Application",
    promptRn:
      "Write a Case-Based Application (200–250 words). Use a realistic patient name, age, and setting. Present with: 2–3 specific vital sign abnormalities, relevant history, chief complaint. Ask TWO questions: (1) 'What is most likely happening and why?' (2) 'What should the nurse do FIRST, in priority order?' Provide detailed answers with clinical rationale for each action. End with one 'Key Teaching Point' sentence.",
    promptRpn:
      "Write a Case-Based Application (200–250 words). Realistic patient, age, unit or community setting; 2–3 abnormal vitals or findings; brief history. TWO questions: (1) What is most concerning and what would you report? (2) What are your first actions within LPN/RPN scope (assessment, safety, monitoring, documentation, notify RN/provider)? Answers with rationale. End with one Key Teaching Point.",
    promptNp:
      "Write a Case-Based Application for Canadian NP practice (240–300 words). Realistic patient with **named vitals** (BP, HR, SpO2, temperature), focused history, and a primary-care or urgent-care setting. TWO questions: (1) differential narrowing and key diagnostics; (2) initial management, prescribing or ordering considerations within scope, monitoring, and **referral** if needed. End with one **Key Teaching Point** sentence and explicit **rationale** for priorities.",
  },
};

export function sectionMetaForTier(tier: LessonExpandTier): Record<LessonExpandSectionKind, { heading: string; prompt: string }> {
  const out = {} as Record<LessonExpandSectionKind, { heading: string; prompt: string }>;
  for (const k of LESSON_EXPAND_REQUIRED_KINDS) {
    const row = LESSON_EXPAND_SECTION_META[k];
    const prompt =
      tier === "rpn" ? row.promptRpn : tier === "np" ? row.promptNp : row.promptRn;
    out[k] = { heading: row.heading, prompt };
  }
  return out;
}

export const LESSON_EXPAND_FLASHCARD_TOPIC_MAP: Array<{ section: LessonExpandSectionKind; prompt: string }> = [
  { section: "pathophysiology_overview", prompt: "What is the cellular/molecular mechanism of {title}?" },
  { section: "pathophysiology_overview", prompt: "Describe the compensatory mechanisms activated in {title}." },
  { section: "signs_symptoms", prompt: "What are the early vs late signs of {title}?" },
  { section: "signs_symptoms", prompt: "What red flags in {title} require immediate nursing action?" },
  { section: "labs_diagnostics", prompt: "What are the key diagnostic labs and critical values for {title}?" },
  { section: "pharmacology", prompt: "What drug classes are used for {title} and what is their mechanism?" },
  {
    section: "nursing_assessment_interventions",
    prompt: "What are the priority nursing interventions for {title} and why?",
  },
  { section: "complications", prompt: "What are the acute complications of {title} and how should the nurse respond?" },
  { section: "clinical_decision_making", prompt: "What does the nurse do in the first 15 minutes of recognizing {title}?" },
  { section: "client_education", prompt: "What should a patient with {title} know before discharge?" },
];

export const LESSON_EXPAND_FLASHCARD_TOPIC_MAP_NP: Array<{ section: LessonExpandSectionKind; prompt: string }> = [
  { section: "pathophysiology_overview", prompt: "What mechanisms drive {title} at cellular and organ level?" },
  { section: "clinical_decision_making", prompt: "What differential diagnoses matter most for {title} and how do you narrow them?" },
  { section: "labs_diagnostics", prompt: "Which diagnostics change management for {title} in primary care?" },
  { section: "treatments", prompt: "What is the first-line treatment plan and follow-up interval for {title}?" },
  { section: "pharmacology", prompt: "What prescribing considerations (dose, renal, interactions) apply to {title}?" },
  { section: "signs_symptoms", prompt: "What red flags in {title} require urgent referral or ED evaluation?" },
  { section: "nursing_assessment_interventions", prompt: "What assessment priorities and monitoring apply to {title}?" },
  { section: "complications", prompt: "What complications of {title} need proactive monitoring?" },
  { section: "clinical_pearls", prompt: "What is a common CNPLE-style trap when answering items on {title}?" },
  { section: "client_education", prompt: "What return precautions and teach-back points matter for {title}?" },
];

export function flashcardTopicMapForTier(tier: LessonExpandTier): Array<{ section: LessonExpandSectionKind; prompt: string }> {
  return tier === "np" ? LESSON_EXPAND_FLASHCARD_TOPIC_MAP_NP : LESSON_EXPAND_FLASHCARD_TOPIC_MAP;
}

export function systemPromptForTier(tier: LessonExpandTier): string {
  if (tier === "np") {
    return `You are a clinical educator writing Canadian **nurse practitioner** lesson depth for NurseNest, aligned with **CNPLE-style** reasoning and **primary care** scope.

CRITICAL RULES:
- Write ONLY the requested section body — no headings, no section labels, no preamble
- Every sentence must be specific to the given topic — zero generic filler
- Clinical accuracy is mandatory: correct drug classes, lab patterns, and mechanisms; remind readers to verify **provincial scope**, **formulary**, and **collaborative agreements** where relevant
- Use markdown bold (**text**) for: drug names, critical lab values, red flags, referral triggers
- Do NOT begin with the topic name as the first word or sentence
- Write at **NP** level: assessment, differential diagnosis, diagnostics, prescribing considerations, follow-up, monitoring, referral, documentation, and shared decision-making
- Do NOT imply unsafe independent management outside scope; name **consultation, referral, or escalation** when risk warrants
- Do NOT use em dashes (Unicode U+2014); use commas, colons, or parentheses instead
- Return ONLY the section body text — nothing else`;
  }
  if (tier === "rpn") {
    return `You are a clinical nursing educator writing REx-PN / NCLEX-PN lesson content for NurseNest, a premium nursing exam prep platform.

CRITICAL RULES:
- Write ONLY the requested section body — no headings, no section labels, no preamble
- Every sentence must be specific to the given topic — zero generic filler
- Clinical accuracy is mandatory: correct drug names, lab values, mechanisms
- Use markdown bold (**text**) for: drug names, critical lab values, red flags, key terms
- Do NOT begin with the topic name as the first word or sentence
- Write at LPN/RPN scope: focused assessment, safe medication administration, infection control, monitoring, documentation, patient education, and escalation to RN or prescriber when findings are outside parameters or scope
- Do NOT imply the LPN/RPN independently diagnoses, prescribes, or orders medical treatment without appropriate authorization
- Return ONLY the section body text — nothing else`;
  }
  return `You are a clinical nursing educator writing NCLEX-RN lesson content for NurseNest, a premium nursing exam prep platform.

CRITICAL RULES:
- Write ONLY the requested section body — no headings, no section labels, no preamble
- Every sentence must name a specific drug, lab value, clinical finding, or mechanism relevant to THIS topic — zero generic filler
- Clinical accuracy is mandatory: correct drug names, numeric lab values (e.g. Cr > 1.5 mg/dL), doses, mechanisms, and procedure steps
- Use markdown bold (**text**) for: drug names, critical lab values, red flags, key terms
- Do NOT begin with the topic name as the first word or sentence
- Write at RN/NCLEX-RN level: bedside focus, ABCs, clinical judgment, delegation, NCLEX Next Gen alignment
- FORBIDDEN phrases — never write these (they are generic boilerplate that will be automatically rejected):
  * "should always be interpreted in the context of trend data"
  * "nurses should document what changed, why it matters clinically"
  * "when multiple cues compete, prioritize what threatens oxygenation"
  * "the right option usually closes a safety loop"
  * "a frequent trap in these questions is choosing a routine or delayed action before addressing the highest-risk"
  * "this condition changes receptor signaling, mediator release, volume status, electrical conduction"
- Return ONLY the section body text — nothing else`;
}
