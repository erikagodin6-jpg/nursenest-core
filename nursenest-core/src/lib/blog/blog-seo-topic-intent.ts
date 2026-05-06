/**
 * NCLEX-style, high-intent nursing SEO topic validation.
 * Broad but valid nursing topics are normalized into clinically specific article prompts
 * before the strict generation gate runs.
 */

const FORBIDDEN_TITLE_START =
  /^(understanding|overview of|the overview of|a quick overview of|guide to|a guide to|complete guide to|the complete guide to|introduction to|an introduction to|exploring|discovering|everything about|all about)\b/i;

const FORBIDDEN_WEAK_PREFIX = /^(tips for|things to know about|important information about)\b/i;

const EXAM_OR_LICENSURE =
  /\b(NCLEX|NGN|next[-\s]?generation nclex|REx[-\s]?PN|REX[-\s]?PN|NCLEX[-\s]?RN|NCLEX[-\s]?PN|CAT adaptive|clinical judgment|board exam|licensure exam|exam prep|test day|nurse practitioner|\bNP\b|AANP|ANCC|CNPLE|allied health|allied)\b/i;

const SPAM_OR_UNSAFE =
  /\b(bitcoin|crypto|casino|sportsbook|porn|escort|viagra|essay writer|seo agency|backlinks|guest post|payday loan|forex|dropshipping|weight loss gummies)\b/i;

const PLACEHOLDER_OR_STUB =
  /\b(lorem ipsum|placeholder|stub post|tbd|todo|fixme|\[\[|\{\{)\b/i;

/** Broad nursing / licensure / allied cues — used only to decide when a vague seed may be expanded safely. */
const NURSING_OR_ALLIED_EDUCATION_SEED =
  /\b(nursing|nurses|nurse|rn\b|pn\b|lpn|lvn|rpn|np\b|cnm|crna|student nurse|new grad|bedside|clinical|hospital|inpatient|outpatient|icu|ed\b|er\b|telemetry|step[-\s]?down|pacu|or\b|operating room|med[\s-]?surg|maternal|neonatal|pediatric|geriatric|psychiat|mental health|community health|public health|home health|hospice|school nurse|camp nurse|telehealth|telemedicine|allied|paramedic|emt\b|respiratory therapist|rt\b|pta|ota|mlt|phlebotom|imaging|care plan|nursing diagnosis|head[-\s]?to[-\s]?toe|vital signs|med pass|medication administration|isolation|ppe|infection prevention|fall risk|pressure injury|wound care|ostomy|catheter|ng tube|feeding tube|dialysis|oncology|delegation|priorit|triage|sbar|charting|documentation|ehr|hipaa|consent|ethics|simulation|skills lab|interprofessional|women|gynec|reproductive|obstetr|lactation|postpartum)\b/i;

/** Obvious non-health / lifestyle topics — never auto-expand into clinical articles. */
const NON_HEALTH_LIFESTYLE_SEED =
  /\b(relationship advice|dating apps|credit score|mortgage rates|car loan|crypto investing|sports betting|video game|political campaign|travel hacking|recipe blog|celebrity gossip)\b/i;

const CLINICAL_OR_EXAM_CATEGORY = new RegExp(
  [
    String.raw`fluid|electrolyte|acid[-\s]?base|\bABG\b|sodium|potassium|calcium|magnesium|phosph|lab values|critical labs|diagnostic`,
    String.raw`cardiac|cardio|heart|STEMI|NSTEMI|MI\b|ACS|arrhythm|ECG|EKG|HF\b|heart failure|hypertension|shock|pulmonary embol|embolism|\bPE\b|DVT`,
    String.raw`respiratory|pneumonia|COPD|asthma|ARDS|ventilat|oxygen|airway|chest tube|pneumothorax|pleural|bronchiolitis|croup`,
    String.raw`renal|kidney|dialysis|AKI|CKD|urinary|catheter|UTI|prostatic|prostate|BPH|hyperplasia`,
    String.raw`GI\b|gastro|liver|hepat|cirrhosis|pancrea|bowel|IBD|GI bleed|peptic|cholecystitis|cholangitis|celiac|gluten`,
    String.raw`endocrine|diabetes|insulin|DKA|HHS|thyroid|adrenal|cortisol|SIADH|cushing|addison`,
    String.raw`neuro|stroke|seizure|ICP|mening|Parkinson|Alzheimer|spinal|GBS\b|dysreflexia|multiple sclerosis|\bMS\b`,
    String.raw`hemat|anemia|sickle|transfusion|coagul|platelet|HIT\b|INR`,
    String.raw`immune|HIV|TB\b|MRSA|C\.?\s*diff|isolation|infection control|sepsis|ppe|precaution`,
    String.raw`MSK|fracture|cast|compartment|arthritis|joint replacement|\bgout\b`,
    String.raw`maternal|OB\b|labor|postpartum|neonatal|pediatric|preeclampsia|HELLP|family[-\s]?centred`,
    String.raw`psychiat|mental health|suicide|delirium|dementia|therapeutic communication`,
    String.raw`pharmac|medication|drug|antibio|opioid|anticoag|diuretic|beta blocker|ace inhibitor|insulin|\bIV\b|intravenous`,
    String.raw`delegation|scope of practice|priorit|triage|safety|restraint|fall|fundamentals|isolation`,
    String.raw`legal|ethical|HIPAA|consent|advocacy|documentation`,
    String.raw`palliative|hospice|discharge|home health|school nurse|allied|respiratory therapist|paramedic|pta|ota|mlt|imaging`,
    String.raw`burn|wound|pressure injury|oncology|radiation|dialysis|\bcancer\b|colorectal|lymphoma|leukemia|hepatocellular`,
  ].join("|"),
  "i",
);

type TopicTemplate = {
  match: RegExp;
  clinicalDomain: string;
  bodySystem?: string;
  nclexCategory: string;
  buildTitle: (examLabel: string) => string;
};

const NORMALIZATION_TEMPLATES: TopicTemplate[] = [
  {
    match: /\bheart failure|cardiac failure|\bCHF\b/i,
    clinicalDomain: "cardiovascular nursing",
    bodySystem: "cardiovascular",
    nclexCategory: "Physiological Adaptation",
    buildTitle: (examLabel) =>
      `Heart Failure Nursing Care: Pathophysiology, Assessment, Medications, Labs, and ${examLabel}`,
  },
  {
    match: /\bdiabetes|diabetes mellitus|dka|hhs|insulin/i,
    clinicalDomain: "endocrine nursing",
    bodySystem: "endocrine",
    nclexCategory: "Pharmacological and Parenteral Therapies",
    buildTitle: (examLabel) =>
      `Diabetes Mellitus Nursing Review: Insulin Safety, DKA/HHS, Labs, Complications, and ${examLabel}`,
  },
  {
    match: /\binfection control|isolation|ppe|precautions|sepsis prevention/i,
    clinicalDomain: "infection prevention and safety",
    bodySystem: "immune / infectious disease",
    nclexCategory: "Safety and Infection Control",
    buildTitle: (examLabel) =>
      `Infection Control for Nursing Exams: Isolation Precautions, PPE, Transmission-Based Precautions, and ${examLabel}`,
  },
  {
    match: /\belectrolyte|sodium|potassium|calcium|magnesium|fluid balance/i,
    clinicalDomain: "fluids, electrolytes, and acid-base nursing",
    bodySystem: "renal / endocrine",
    nclexCategory: "Physiological Adaptation",
    buildTitle: (examLabel) =>
      `Electrolyte Imbalances Nursing Review: Sodium, Potassium, Calcium, Magnesium, ECG Changes, and ${examLabel}`,
  },
  {
    match: /\bpediatric nursing|pediatrics|pediatric care/i,
    clinicalDomain: "pediatric nursing",
    bodySystem: "respiratory",
    nclexCategory: "Health Promotion and Maintenance",
    buildTitle: (examLabel) =>
      `Pediatric Respiratory Distress Nursing Review: Assessment, Red Flags, Oxygenation, Family-Centred Care, and ${examLabel}`,
  },
  {
    match: /\bwomen'?s health|gynecolog|reproductive health|obstetr|lactation support/i,
    clinicalDomain: "women's health nursing",
    bodySystem: "reproductive",
    nclexCategory: "Health Promotion and Maintenance",
    buildTitle: (examLabel) =>
      `Women's Health Nursing Review: Assessment, Preventive Care, Red Flags, Client Education, and ${examLabel}`,
  },
  {
    match: /\bmed[\s-]?surg|medical surgical|general medicine nursing/i,
    clinicalDomain: "medical-surgical nursing",
    bodySystem: "multisystem",
    nclexCategory: "Physiological Adaptation",
    buildTitle: (examLabel) =>
      `Medical-Surgical Nursing Review: Assessment, Complications, Medication Safety, Labs, and ${examLabel}`,
  },
  {
    match: /\bcritical care nursing|\bICU\b nursing|intensive care nursing/i,
    clinicalDomain: "critical care nursing",
    bodySystem: "multisystem",
    nclexCategory: "Physiological Adaptation",
    buildTitle: (examLabel) =>
      `Critical Care Nursing Review: Hemodynamic Monitoring, Ventilation Basics, Safety, and ${examLabel}`,
  },
  {
    match: /\blab values|labs?|diagnostic tests?|critical values/i,
    clinicalDomain: "lab interpretation and diagnostic reasoning",
    bodySystem: "multisystem",
    nclexCategory: "Reduction of Risk Potential",
    buildTitle: (examLabel) =>
      `Lab Values for Nursing Exams: Critical Ranges, Trending Abnormal Results, Reporting Priorities, and ${examLabel}`,
  },
  {
    match: /\bpharmacology|medications?|drug class|drug safety/i,
    clinicalDomain: "pharmacology nursing",
    bodySystem: "multisystem",
    nclexCategory: "Pharmacological and Parenteral Therapies",
    buildTitle: (examLabel) =>
      `Pharmacology for Nursing Exams: High-Risk Medications, Drug Classes, Monitoring, and ${examLabel}`,
  },
  {
    match: /\ballied|respiratory therapy|paramedic|pta|ota|mlt|imaging|pharmacy tech/i,
    clinicalDomain: "allied health clinical practice",
    bodySystem: "profession-specific",
    nclexCategory: "Allied clinical readiness",
    buildTitle: (examLabel) =>
      `Allied Health Clinical Review: Assessment Priorities, Safety Checks, Diagnostics, and ${examLabel}`,
  },
  {
    match: /\bnurse practitioner|\bNP\b|advanced practice/i,
    clinicalDomain: "advanced practice nursing",
    bodySystem: "multisystem",
    nclexCategory: "NP clinical management",
    buildTitle: (examLabel) =>
      `Nurse Practitioner Clinical Review: Differential Diagnosis, Prescribing Safety, Follow-Up, and ${examLabel}`,
  },
  {
    match: /\bdelegation|prioritization|triage|fundamentals|patient safety|scope of practice/i,
    clinicalDomain: "nursing fundamentals and safety",
    bodySystem: "multisystem",
    nclexCategory: "Management of Care",
    buildTitle: (examLabel) =>
      `Nursing Fundamentals Review: Delegation, Prioritization, Safety Checks, and ${examLabel}`,
  },
];

export type BlogSeoTopicIntentResult =
  | { ok: true }
  | { ok: false; reason: string };

export type NormalizeBlogTopicIntentResult = {
  accepted: boolean;
  normalizedTopic: string;
  clinicalDomain: string;
  bodySystem?: string;
  nclexCategory?: string;
  reason?: string;
};

/** When `legacyCompatible` is true, broad-but-safe nursing seeds can pass with normalization (batch/CLI tooling). */
export type NormalizeBlogTopicIntentOptions = {
  legacyCompatible?: boolean;
};

function matchesHighIntentShape(topic: string): boolean {
  for (const re of [
    /\bhow to\b.{0,60}\b(nclex|rex-?pn)\b/i,
    /\bnclex questions\b/i,
    /\brex-?pn questions\b/i,
    /\b(priority nursing interventions|priority interventions|nursing priorities)\b/i,
    /\bwhat should the nurse do first\b/i,
    /\bnurse do first\b/i,
    /\bfirst sign of\b/i,
    /\bhow to recognize\b.{0,60}\b(early|nursing|nclex|signs?)\b/i,
    /\blabs for\b.{4,90}\b(explained for nurses|explained for nclex|for nurses|for nclex)\b/i,
    /\b(lab values|critical labs).{0,40}\b(nclex|nurses|report|hold)\b/i,
    /\s+vs\.?\s+.{3,}/i,
    /\b(practice questions|exam traps|question stems|bow\s*tie|case study questions)\b/i,
    /\b(sata|select[-\s]all[-\s]that[-\s]apply)\b/i,
    /\bwhich (client|patient|action|intervention)\b/i,
    /\b(best next action|priority action|first action|initial nursing)\b/i,
  ]) {
    if (re.test(topic)) return true;
  }
  return false;
}

const ACTIONABLE_NURSING =
  /\b(nursing care|nursing assessment|nursing management|nursing interventions|nursing priorities|nursing actions|nursing responsibilities|bedside|monitoring|administration|delegation|teaching|escalat|report|hold|contraindicat|toxicity|precautions|bundle|protocol|anticoagulation|post-op|postoperative|exacerbation management|clinical reasoning)\b/i;

function resolveExamLabel(scheduleExam?: string | null): string {
  const exam = String(scheduleExam ?? "").trim();
  if (/rex-?pn/i.test(exam)) return "REx-PN Priorities";
  if (/\bnp\b|nurse practitioner|aanp|ancc|cnple/i.test(exam)) return "NP Clinical Reasoning";
  if (/allied/i.test(exam)) return "Allied Health Relevance";
  if (/nclex/i.test(exam)) return "NCLEX Priorities";
  return "Nursing Priorities";
}

function detectTemplate(topic: string): TopicTemplate | null {
  for (const template of NORMALIZATION_TEMPLATES) {
    if (template.match.test(topic)) return template;
  }
  return null;
}

function validateSpecificTopic(topic: string, scheduleExam?: string | null): BlogSeoTopicIntentResult {
  const t = topic.trim();
  if (t.length < 22) {
    return { ok: false, reason: "Topic is too short to be a specific, high-intent query." };
  }
  if (t.length > 220) {
    return { ok: false, reason: "Topic exceeds maximum length; split into a narrower query." };
  }
  if (FORBIDDEN_TITLE_START.test(t) || FORBIDDEN_WEAK_PREFIX.test(t)) {
    return {
      ok: false,
      reason:
        'Title uses a generic pattern (e.g. "Understanding…", "Overview of…", "Guide to…"). Use a concrete nursing teaching title with mechanism, assessment, interventions, labs, or safety priorities.',
    };
  }
  if (/\:\s*Understanding\b/i.test(t)) {
    return {
      ok: false,
      reason:
        'Avoid "Understanding …" phrasing in titles (including after a colon). Prefer mechanism + nursing decision language.',
    };
  }
  if (/\b(complete guide|ultimate guide|everything you need)\b/i.test(t)) {
    return { ok: false, reason: "Avoid guide-style filler; prefer a concrete exam or bedside decision query." };
  }
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 4) {
    return { ok: false, reason: "Topic is too vague (too few words)." };
  }

  const examQuestionBankStem = /\b(nclex|rex-?pn)\s+questions\b/i.test(t);
  const caseStudyExamStem = /\b(ngn|case study questions|bow[\s-]?tie|matrix questions)\b/i.test(t) && /\bnclex\b/i.test(t);
  const examTrackComparison = /\s+vs\.?\s+/i.test(t) && /\b(nclex|rex-?pn|pn|rn)\b/i.test(t) && t.length >= 24;

  if (!examQuestionBankStem && !caseStudyExamStem && !examTrackComparison && !CLINICAL_OR_EXAM_CATEGORY.test(t)) {
    return {
      ok: false,
      reason:
        "Topic is not clearly tied to a clinical domain, body system, or NCLEX category (add a specific condition, drug class, lab focus, or system).",
    };
  }

  const examFromSchedule = typeof scheduleExam === "string" && scheduleExam.trim().length >= 2 ? scheduleExam.trim() : null;
  const examInTopic = EXAM_OR_LICENSURE.test(t);
  const examFromScheduleOk = examFromSchedule !== null && EXAM_OR_LICENSURE.test(examFromSchedule);
  const examOk = examInTopic || examFromScheduleOk;

  const intentShape = matchesHighIntentShape(t);
  const nursingActionCue = ACTIONABLE_NURSING.test(t);
  const examGroundedClinical =
    examOk &&
    CLINICAL_OR_EXAM_CATEGORY.test(t) &&
    t.length >= 32 &&
    /\b(questions|strategies|nursing care|management|assessment|interventions|differentiation|comparison|priorities|protocol|safety|review)\b/i.test(t);
  const examPrepStudyLine =
    examOk &&
    t.length >= 32 &&
    /\b(study|review|schedule|plan|practice|question bank|flashcard|mnemonic|mapping|recall|retention|anxiety|simulation|rationales?|readiness|calculations|drip|blueprint|timeline|mistakes|lessons?|content)\b/i.test(
      t,
    ) &&
    (CLINICAL_OR_EXAM_CATEGORY.test(t) || /\b(nclex|rex-?pn|np|allied)\b/i.test(t));
  const safetyOpsTitle =
    examOk &&
    t.length >= 28 &&
    /\b(SBAR|BLS|ACLS|code blue|hand hygiene|patient identification|critical value|smart pump|DERS|handoff|elopement|sentinel event|just culture|wrong-site|staffing ratio|rapid response|infection prevention|safe patient handling|body mechanics)\b/i.test(
      t,
    ) &&
    /\b(nursing|nurse|nurses|patient|safe|safety|reporting|compliance|evidence)\b/i.test(t);
  const clinicalTeachingTitle =
    CLINICAL_OR_EXAM_CATEGORY.test(t) &&
    t.length >= 34 &&
    /\b(nursing|nurses|pathophysiology|assessment|management|interventions|prevention|recognition|implications|rehab|surveillance|exacerbation|post-op|differentiation|client education)\b/i.test(
      t,
    );
  const pathologyStructureTitle =
    examOk &&
    CLINICAL_OR_EXAM_CATEGORY.test(t) &&
    t.length >= 36 &&
    /\b(causes|classification|staging|subtypes|fluid resuscitation|treatment modalities|opportunistic infections|monitoring)\b/i.test(t);

  if (
    !intentShape &&
    !nursingActionCue &&
    !examGroundedClinical &&
    !examPrepStudyLine &&
    !clinicalTeachingTitle &&
    !pathologyStructureTitle &&
    !safetyOpsTitle
  ) {
    return {
      ok: false,
      reason:
        "Topic is not clearly actionable for nursing decisions. Prefer mechanism, assessment, interventions, labs, safety priorities, or exam reasoning in the title.",
    };
  }

  if (!examOk) {
    return {
      ok: false,
      reason: "Include explicit exam or licensure context in the topic (e.g. NCLEX, REx-PN) or rely on a schedule exam label that names the test.",
    };
  }

  return { ok: true };
}

/**
 * Relaxed gate for **legacy-compatible** generators only: keeps spam/off-domain blocks,
 * but accepts broader nursing operational topics when schedule exam supplies licensure context.
 */
function validateSpecificTopicRelaxed(topic: string, scheduleExam?: string | null): BlogSeoTopicIntentResult {
  const t = topic.trim();
  if (t.length < 12) {
    return { ok: false, reason: "Topic is too short for legacy-compatible mode (minimum 12 characters)." };
  }
  if (t.length > 220) {
    return { ok: false, reason: "Topic exceeds maximum length; split into a narrower query." };
  }
  if (FORBIDDEN_TITLE_START.test(t) || FORBIDDEN_WEAK_PREFIX.test(t)) {
    return {
      ok: false,
      reason:
        'Generic "Understanding/Guide" style topics stay blocked. Use concrete nursing teaching language instead.',
    };
  }
  if (/\b(complete guide|ultimate guide|everything you need)\b/i.test(t)) {
    return { ok: false, reason: "Avoid guide-style filler; prefer a concrete exam or bedside decision query." };
  }
  if (SPAM_OR_UNSAFE.test(t) || PLACEHOLDER_OR_STUB.test(t) || NON_HEALTH_LIFESTYLE_SEED.test(t)) {
    return { ok: false, reason: "Topic appears spammy, unsafe, or unrelated to healthcare education." };
  }

  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 3) {
    return { ok: false, reason: "Topic is too vague (too few words)." };
  }

  const examFromSchedule = typeof scheduleExam === "string" && scheduleExam.trim().length >= 2 ? scheduleExam.trim() : null;
  const examFromScheduleOk = examFromSchedule !== null && EXAM_OR_LICENSURE.test(examFromSchedule);
  const examInTopic = EXAM_OR_LICENSURE.test(t);
  const examOk = examInTopic || examFromScheduleOk;
  if (!examOk) {
    return {
      ok: false,
      reason: "Include explicit exam or licensure context in the topic or rely on a schedule exam label that names the test.",
    };
  }

  const clinicallyAdjacent =
    CLINICAL_OR_EXAM_CATEGORY.test(t) ||
    NURSING_OR_ALLIED_EDUCATION_SEED.test(t) ||
    ACTIONABLE_NURSING.test(t) ||
    /\b(hospital|patient|bedside|unit|ward|shift|handoff|interprofessional|continuity|care team|rounding)\b/i.test(t);

  if (!clinicallyAdjacent) {
    return {
      ok: false,
      reason: "Topic is not clinical or nursing-operational enough for safe auto-generation.",
    };
  }

  return { ok: true };
}

/**
 * Last-resort expansion for vague-but-legitimate nursing / exam-prep seeds.
 * Produces titles that satisfy {@link validateSpecificTopic} (clinical tie + actionable nursing language + exam context).
 */
function tryExpandVagueClinicalNursingTopic(
  raw: string,
  scheduleExam: string | null | undefined,
): NormalizeBlogTopicIntentResult | null {
  const t = raw.trim();
  if (!t || SPAM_OR_UNSAFE.test(t) || PLACEHOLDER_OR_STUB.test(t) || NON_HEALTH_LIFESTYLE_SEED.test(t)) {
    return null;
  }
  if (FORBIDDEN_TITLE_START.test(t) || FORBIDDEN_WEAK_PREFIX.test(t) || /\b(complete guide|ultimate guide|everything you need)\b/i.test(t)) {
    return null;
  }

  const scheduleStr = typeof scheduleExam === "string" && scheduleExam.trim().length >= 2 ? scheduleExam.trim() : null;
  const examFromScheduleOk = scheduleStr !== null && EXAM_OR_LICENSURE.test(scheduleStr);
  const examInTopic = EXAM_OR_LICENSURE.test(t);
  const examPrepCue =
    /\b(study|studying|review|reviews|prep|preparation|tips|strategies|schedule|practice|question bank|flashcards?|mnemonics?|exam anxiety|test[-\s]?taking|pass|beat|crush)\b/i.test(t);
  const nursingCue = NURSING_OR_ALLIED_EDUCATION_SEED.test(t);
  const clinicalCue = CLINICAL_OR_EXAM_CATEGORY.test(t);

  /** Generic student-life / productivity without licensure or nursing context — never fabricate a clinical article. */
  const genericStudentLifeMotivation =
    !EXAM_OR_LICENSURE.test(t) &&
    /\b(motivat(?:ed|ion|ing|e)?|procrastinat(?:e|ing|ion)?|pomodoro|roommate|social media|weekend parties|college life)\b/i.test(t) &&
    !nursingCue &&
    !clinicalCue;

  if (genericStudentLifeMotivation) return null;

  const eligibleForExpansion =
    nursingCue ||
    clinicalCue ||
    (examFromScheduleOk && (examPrepCue || examInTopic || t.replace(/\s+/g, " ").trim().length >= 10));

  if (!eligibleForExpansion) return null;

  const examLabel = resolveExamLabel(scheduleExam);
  const base = t.replace(/\s+/g, " ").trim();
  const candidates = [
    `${base}: Nursing Pathophysiology, Assessment, Priority Interventions, Safety, Labs, Pharmacology Considerations, and ${examLabel}`,
    `${base}: Clinical Nursing Review — Assessment, Priority Interventions, Client Education, Safety Monitoring, and ${examLabel}`,
  ];
  for (const candidate of candidates) {
    if (validateSpecificTopic(candidate, scheduleExam).ok) {
      return {
        accepted: true,
        normalizedTopic: candidate,
        clinicalDomain: clinicalCue ? "clinical nursing" : "nursing education and exam readiness",
        bodySystem: clinicalCue ? "multisystem" : undefined,
        nclexCategory: "Management of Care",
      };
    }
  }
  return null;
}

export function normalizeBlogTopicIntent(
  inputTopic: string,
  scheduleExam?: string | null,
  options?: NormalizeBlogTopicIntentOptions,
): NormalizeBlogTopicIntentResult {
  const raw = inputTopic.trim();
  if (!raw) {
    return {
      accepted: false,
      normalizedTopic: raw,
      clinicalDomain: "unknown",
      reason: "Topic is empty.",
    };
  }
  if (SPAM_OR_UNSAFE.test(raw)) {
    return {
      accepted: false,
      normalizedTopic: raw,
      clinicalDomain: "rejected",
      reason: "Topic appears spammy, unsafe, or unrelated to healthcare education.",
    };
  }
  if (PLACEHOLDER_OR_STUB.test(raw)) {
    return {
      accepted: false,
      normalizedTopic: raw,
      clinicalDomain: "rejected",
      reason: "Placeholder or stub topics are not allowed.",
    };
  }
  if (FORBIDDEN_TITLE_START.test(raw) || FORBIDDEN_WEAK_PREFIX.test(raw) || /\b(complete guide|ultimate guide|everything you need)\b/i.test(raw)) {
    return {
      accepted: false,
      normalizedTopic: raw,
      clinicalDomain: "rejected",
      reason:
        'Generic "Understanding/Guide" style topics are blocked. Start with a real condition, lab, medication, safety category, or bedside priority instead.',
    };
  }

  const specific = validateSpecificTopic(raw, scheduleExam);
  if (specific.ok) {
    const template = detectTemplate(raw);
    return {
      accepted: true,
      normalizedTopic: raw,
      clinicalDomain: template?.clinicalDomain ?? "clinical nursing",
      bodySystem: template?.bodySystem,
      nclexCategory: template?.nclexCategory,
    };
  }

  const template = detectTemplate(raw);
  if (template) {
    const normalizedTopic = template.buildTitle(resolveExamLabel(scheduleExam));
    const normalizedCheck = validateSpecificTopic(normalizedTopic, scheduleExam);
    if (normalizedCheck.ok) {
      return {
        accepted: true,
        normalizedTopic,
        clinicalDomain: template.clinicalDomain,
        bodySystem: template.bodySystem,
        nclexCategory: template.nclexCategory,
      };
    }
  }

  const lowered = raw.toLowerCase();
  if (CLINICAL_OR_EXAM_CATEGORY.test(raw)) {
    const normalizedTopic = `${raw.replace(/\s+/g, " ").trim()}: Nursing Assessment, Interventions, Safety Priorities, and ${resolveExamLabel(scheduleExam)}`;
    const normalizedCheck = validateSpecificTopic(normalizedTopic, scheduleExam);
    if (normalizedCheck.ok) {
      return {
        accepted: true,
        normalizedTopic,
        clinicalDomain: "clinical nursing",
        nclexCategory: "Exam preparation",
      };
    }
  }

  const expanded = tryExpandVagueClinicalNursingTopic(raw, scheduleExam);
  if (expanded) return expanded;

  /**
   * Broad operational nursing seeds (handoffs, coordination, leadership) with schedule exam context:
   * expand into a high-intent title that passes {@link validateSpecificTopic}. Same expansion is used for
   * legacy-compatible batch runs and for the default admin pipeline so broad topics are not rejected
   * after {@link tryExpandVagueClinicalNursingTopic} misses a candidate shape.
   */
  const relaxed = validateSpecificTopicRelaxed(raw, scheduleExam);
  if (relaxed.ok) {
    const base = raw.replace(/\s+/g, " ").trim();
    const expandedLegacy = `${base}: Clinical Nursing Review — Assessment, Interventions, Client Education, Safety, and ${resolveExamLabel(scheduleExam)}`;
    if (validateSpecificTopic(expandedLegacy, scheduleExam).ok) {
      return {
        accepted: true,
        normalizedTopic: expandedLegacy,
        clinicalDomain: "clinical nursing",
        nclexCategory: "Management of Care",
      };
    }
  }

  const impossible =
    !CLINICAL_OR_EXAM_CATEGORY.test(raw) &&
    !/\b(nursing|nurse|patient|clinical|healthcare|medication|lab|safety|allied|respiratory|paramedic|pharmacy)\b/i.test(lowered);

  return {
    accepted: false,
    normalizedTopic: raw,
    clinicalDomain: impossible ? "non-medical" : "unresolved clinical topic",
    reason:
      impossible
        ? "Topic is not clinical, nursing, or allied-health relevant enough to normalize safely."
        : specific.reason,
  };
}

export function validateBlogTopicForSeoArticleGeneration(
  topic: string,
  scheduleExam?: string | null,
): BlogSeoTopicIntentResult {
  const normalized = normalizeBlogTopicIntent(topic, scheduleExam);
  if (!normalized.accepted) {
    return { ok: false, reason: normalized.reason ?? "Topic could not be normalized into a clinical nursing article." };
  }
  return validateSpecificTopic(normalized.normalizedTopic, scheduleExam);
}

export function partitionBlogTopicsBySeoIntent(
  topics: string[],
  scheduleExam?: string | null,
): { approved: string[]; rejected: Array<{ topic: string; reason: string }> } {
  const approved: string[] = [];
  const rejected: Array<{ topic: string; reason: string }> = [];
  for (const topic of topics) {
    const normalized = normalizeBlogTopicIntent(topic, scheduleExam);
    if (normalized.accepted) approved.push(normalized.normalizedTopic);
    else rejected.push({ topic, reason: normalized.reason ?? "rejected" });
  }
  return { approved, rejected };
}
