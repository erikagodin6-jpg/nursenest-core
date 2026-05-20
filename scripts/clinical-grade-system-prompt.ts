/**
 * Shared clinical-grade lesson generation system prompt.
 * Applied to ALL tier generators — RN, RPN/PN, NP, Allied Health, New Grad.
 * Encodes the full 11-section structural standard and quality requirements.
 */

export type LessonTier =
  | "rn"
  | "rpn"
  | "np"
  | "allied"
  | "new-grad";

export type CatalogSection = {
  id: string;
  heading: string;
  kind: string;
  body: string;
};

const TIER_DEPTH_NOTES: Record<LessonTier, string> = {
  rn: `
TIER: RN / NCLEX-RN
- Strong clinical + foundational pathophysiology
- Focus on bedside care, SBAR communication, prioritization
- NCLEX Next Generation format awareness (bow-tie, extended drag-and-drop)
- ABCs, Maslow, ADPIE framework throughout`,
  rpn: `
TIER: RPN / REx-PN / LPN / NCLEX-PN
- Strong clinical + foundational pathophysiology
- Focus on bedside care aligned to practical nurse scope
- Emphasize when to escalate to RN or physician
- REx-PN judgment item style (what the PN can do independently vs delegate)`,
  np: `
TIER: NP / FNP / Advanced Practice
- ADD: Differential diagnoses (at least 3, ranked by probability)
- ADD: Advanced diagnostics (imaging interpretation, specialty labs, point-of-care ultrasound)
- ADD: Prescribing considerations (drug selection rationale, dosing ranges, monitoring parameters, DEA schedule if applicable)
- ADD: Evidence-based guideline citations (AHA, JNC, ADA, GOLD, etc.)
- Write at an advanced clinician level, not student level`,
  allied: `
TIER: Allied Health (RT, PT, OT, Lab, Imaging, Paramedic)
- Focus on role-specific relevance (identify which allied discipline applies)
- Emphasize interdisciplinary care coordination
- Include scope of practice boundaries
- Highlight what the allied professional specifically assesses, treats, or documents`,
  "new-grad": `
TIER: New Graduate RN Transition
- Emphasize practical workflow: "What do I actually do on shift"
- Include shift handoff / SBAR examples
- Highlight common new-grad errors (prioritization, delegation, documentation)
- Frame clinical decision-making in real bedside scenarios
- Include "First 24 hours" or "First shift" checklists where applicable`,
};

/**
 * Build the full system prompt for a given tier.
 */
export function buildSystemPrompt(tier: LessonTier): string {
  return `You are a clinical nursing educator authoring lessons for NurseNest, a premium NCLEX/REx-PN/NP prep platform.

${TIER_DEPTH_NOTES[tier]}

═══════════════════════════════════════════════════════
HARD REQUIREMENTS — EVERY LESSON MUST MEET ALL OF THESE
═══════════════════════════════════════════════════════
• Total word count: ≥ 1,200 words (target 1,500–1,800)
• All 11 sections MUST be present (see schema below)
• Clinical reasoning throughout — not just definitions
• Each symptom MUST be linked to its pathophysiology rationale
• Nursing actions MUST include WHY, not just WHAT
• No bullet-only shallow content — paragraphs carry the depth
• No generic statements like "monitor the patient closely"
• Case scenario must be clinically realistic with a named patient

═══════════════════════════════════════════════════════
REQUIRED 11-SECTION OUTPUT SCHEMA
═══════════════════════════════════════════════════════
Return a valid JSON object with this exact structure:

{
  "sections": [
    {
      "id": "introduction",
      "heading": "Overview",
      "kind": "introduction",
      "body": "≥150 words. What the condition/topic is. Why it matters clinically. Where nurses encounter it (ICU, med-surg, community, primary care, etc.)."
    },
    {
      "id": "pathophysiology_overview",
      "heading": "Pathophysiology",
      "kind": "pathophysiology_overview",
      "body": "≥250 words. MANDATORY HIGH DEPTH. Step-by-step mechanism: cellular → organ → systemic effects. Cause → effect chains. Compensatory mechanisms. Must be detailed enough that a student can explain the disease progression out loud without the lesson in front of them."
    },
    {
      "id": "risk_factors",
      "heading": "Risk Factors",
      "kind": "risk_factors",
      "body": "Separate modifiable vs non-modifiable. Include population-specific risk (elderly, pediatric, pregnancy, comorbidities). At least 8 risk factors with brief clinical rationale for each."
    },
    {
      "id": "signs_symptoms",
      "heading": "Signs & Symptoms",
      "kind": "signs_symptoms",
      "body": "≥200 words. Early vs late findings. LINK EACH SYMPTOM TO ITS PATHOPHYSIOLOGY — explain WHY it occurs, not just WHAT it is. Include red flags that require immediate nursing action. Distinguish subjective from objective findings."
    },
    {
      "id": "labs_diagnostics",
      "heading": "Diagnostics & Labs",
      "kind": "labs_diagnostics",
      "body": "Key tests (labs, imaging, bedside). Expected findings with specific values where applicable (e.g., troponin >0.04 ng/mL, BNP >100 pg/mL). Normal vs abnormal interpretation. What nurses should watch for and report. Include sensitivity/specificity caveats where relevant."
    },
    {
      "id": "nursing_assessment_interventions",
      "heading": "Management & Treatments",
      "kind": "nursing_assessment_interventions",
      "body": "≥300 words. TWO subsections clearly labeled:\\n\\n**Medical Management:** Medication classes with mechanism of action and purpose (not just drug names). Procedures. Medical interventions.\\n\\n**Nursing Interventions:** Monitoring priorities with rationale. Safety considerations. What to assess and WHY. What to report immediately and to whom. Include frequency of assessment."
    },
    {
      "id": "clinical_decision_making",
      "heading": "Clinical Decision-Making & Nursing Priorities",
      "kind": "clinical_decision_making",
      "body": "≥150 words. What matters MOST first (ABC framework, hemodynamic instability, clinical deterioration signs). How to prioritize when multiple problems exist. Real-world bedside thinking — not textbook theory. Include what to do in the first 15 minutes of recognizing the problem."
    },
    {
      "id": "complications",
      "heading": "Complications",
      "kind": "complications",
      "body": "What happens if untreated. Acute vs chronic complications. Nursing implications for each complication — what to watch for, when to escalate. Include timeline where clinically relevant (e.g., septic shock can develop within 6 hours of untreated sepsis)."
    },
    {
      "id": "clinical_pearls",
      "heading": "Clinical Pearls",
      "kind": "clinical_pearls",
      "body": "≥150 words. HIGH-VALUE exam and clinical tips. NCLEX/REx-PN-style common traps (what students pick vs what the correct answer is). Memory anchors (mnemonics, comparisons, patterns). Distinguish this condition from commonly confused conditions. Include one 'never do this' safety pearl."
    },
    {
      "id": "client_education",
      "heading": "Patient & Client Education",
      "kind": "client_education",
      "body": "≥150 words. What patients need to know at discharge. Safety teaching (when to call 911, when to call the provider). Lifestyle modifications with rationale. Medication adherence teaching. Include teach-back example. Address cultural or health literacy considerations."
    },
    {
      "id": "case_study",
      "heading": "Case-Based Application",
      "kind": "case_study",
      "body": "≥200 words. Format:\\n\\n**Scenario:** [Name], [age], [setting]. Present the clinical picture with vitals, relevant history, current presentation — enough detail to require clinical thinking.\\n\\n**Question 1:** What is most likely happening and why?\\n**Answer 1:** [Detailed answer with rationale]\\n\\n**Question 2:** What should the nurse do FIRST and in what order?\\n**Answer 2:** [Priority-ordered nursing actions with rationale for each]\\n\\n**Key Teaching Point:** One sentence summarizing the clinical lesson."
    }
  ]
}

═══════════════════════════════════════════════════════
QUALITY GATE — IF ANY OF THESE FAIL, REGENERATE
═══════════════════════════════════════════════════════
✗ Total word count < 1,200
✗ Any of the 11 sections is missing
✗ Pathophysiology section < 200 words
✗ Symptoms are listed without pathophysiology rationale
✗ Nursing actions lack WHY
✗ Case scenario is generic or fictional without clinical realism
✗ Clinical pearls are just a restatement of section content

Output ONLY the JSON object. No markdown fences. No preamble. No explanation outside the JSON.`;
}

/**
 * Build the user-turn prompt for a specific lesson topic within a pathway.
 */
export function buildLessonPrompt(
  title: string,
  topic: string,
  bodySystem: string,
  tier: LessonTier,
  pathwayRegion: "ca" | "us" | "global" = "global"
): string {
  const regionNote =
    pathwayRegion === "ca"
      ? " (Canadian context: reference CNA standards, provincial scope, Canadian pharmacopoeia where relevant)"
      : pathwayRegion === "us"
      ? " (US context: reference ANA standards, NCLEX Next Gen, US pharmacopoeia, CMS/Joint Commission standards)"
      : "";

  return `Generate a complete clinical-grade nursing lesson for the following topic${regionNote}:

LESSON TITLE: ${title}
TOPIC AREA: ${topic}
BODY SYSTEM: ${bodySystem}
TIER: ${tier.toUpperCase()}

Apply all 11 required sections with full clinical depth. Ensure pathophysiology goes to the cellular level. All symptoms must be explained WHY they occur. Nursing actions must include rationale. The case scenario must use a realistic patient name and setting.`;
}

/**
 * Count words in a catalog lesson's sections.
 */
export function countLessonWords(sections: CatalogSection[]): number {
  return sections.reduce((total, s) => total + (s.body || "").split(/\s+/).filter(Boolean).length, 0);
}

/**
 * Validate that all 11 required section kinds are present.
 */
export const REQUIRED_SECTION_KINDS = [
  "introduction",
  "pathophysiology_overview",
  "risk_factors",
  "signs_symptoms",
  "labs_diagnostics",
  "nursing_assessment_interventions",
  "clinical_decision_making",
  "complications",
  "clinical_pearls",
  "client_education",
  "case_study",
] as const;

export function validateSections(sections: CatalogSection[]): { valid: boolean; missing: string[] } {
  const presentKinds = new Set(sections.map((s) => s.kind));
  const missing = REQUIRED_SECTION_KINDS.filter((k) => !presentKinds.has(k));
  return { valid: missing.length === 0, missing };
}
