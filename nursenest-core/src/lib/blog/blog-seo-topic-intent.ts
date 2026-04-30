/**
 * NCLEX-style, high-intent nursing SEO topic validation.
 * Used before expensive article generation so vague / generic titles never hit the AI pipeline.
 */

/** Titles that read like textbook chapter intros, not search queries. */
const FORBIDDEN_TITLE_START =
  /^(understanding|overview of|the overview of|a quick overview of|guide to|a guide to|complete guide to|the complete guide to|introduction to|an introduction to|exploring|discovering|everything about|all about)\b/i;

/** Banned anywhere as leading filler when followed by colon-style academic phrasing. */
const FORBIDDEN_WEAK_PREFIX = /^(tips for|things to know about|important information about)\b/i;

const EXAM_OR_LICENSURE =
  /\b(NCLEX|NGN|next[-\s]?generation nclex|REx[-\s]?PN|REX[-\s]?PN|NCLEX[-\s]?RN|NCLEX[-\s]?PN|CAT adaptive|clinical judgment|board exam|licensure exam|exam prep|test day)\b/i;

/**
 * Body systems, NCLEX client-need buckets, and concrete clinical anchors.
 * Keeps topics tied to bedside / exam decisions (not generic “wellness”).
 */
const CLINICAL_OR_EXAM_CATEGORY = new RegExp(
  [
    String.raw`fluid|electrolyte|acid[-\s]?base|\bABG\b|sodium|potassium|calcium|magnesium|phosph`,
    String.raw`cardiac|cardio|heart|STEMI|NSTEMI|MI\b|ACS|arrhythm|ECG|EKG|HF\b|heart failure|hypertension|shock|pulmonary embol|embolism|\bPE\b|DVT`,
    String.raw`respiratory|pneumonia|COPD|asthma|ARDS|ventilat|oxygen|airway|chest tube|pneumothorax|pleural|obstructive pulmonary|chronic obstructive|fibrosis|interstitial`,
    String.raw`renal|kidney|dialysis|AKI|CKD|urinary|catheter|UTI|prostatic|prostate|BPH|hyperplasia`,
    String.raw`GI\b|gastro|liver|hepat|cirrhosis|pancrea|bowel|IBD|GI bleed|peptic|cholecystitis|cholangitis|celiac|gluten`,
    String.raw`endocrine|diabetes|insulin|DKA|HHS|thyroid|adrenal|cortisol|SIADH|cushing|addison`,
    String.raw`neuro|stroke|seizure|ICP|mening|Parkinson|Alzheimer|spinal|GBS\b|dysreflexia|multiple sclerosis|\bMS\b`,
    String.raw`hemat|anemia|sickle|transfusion|coagul|platelet|HIT\b|INR`,
    String.raw`immune|HIV|TB\b|MRSA|C\.?\s*diff|isolation|infection control|sepsis`,
    String.raw`MSK|fracture|cast|compartment|arthritis|joint replacement|\bgout\b`,
    String.raw`maternal|OB\b|labor|postpartum|neonatal|pediatric|preeclampsia|HELLP`,
    String.raw`psychiat|mental health|suicide|delirium|dementia|therapeutic communication`,
    String.raw`pharmac|medication|drug|antibio|opioid|anticoag|insulin|chemo|\bIV\b|intravenous`,
    String.raw`delegation|scope of practice|priorit|triage|safety|restraint|fall`,
    String.raw`legal|ethical|HIPAA|consent|advocacy|documentation`,
    String.raw`palliative|hospice|discharge|home health|school nurse`,
    String.raw`burn|wound|pressure injury|oncology|radiation|dialysis|\bcancer\b|colorectal|lymphoma|leukemia|hepatocellular`,
    String.raw`lab values|vital signs|assessment findings|nursing interventions|patient teaching|malnutrition|obesity|bariatric|nutritional support|textbook|NurseNest`,
    String.raw`study plan|study schedule|practice test|question bank|flashcard|mnemonic|test anxiety|retake|rationale|prep\b|readiness|recall|retention|memory|\bclinical\b|concepts?`,
    String.raw`ICU|med[\s-]?surg|perioperative|emergency department|trauma|travel nursing|staff nursing|nurse practitioner|\bNP\b|\bPA\b|CNS\b|union|staffing`,
  ].join("|"),
  "i",
);

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

/** Nursing decision / action language (not pure encyclopedia). */
const ACTIONABLE_NURSING =
  /\b(nursing care|nursing assessment|nursing management|nursing interventions|nursing priorities|nursing actions|nursing responsibilities|bedside|monitoring|administration|delegation|teaching|escalat|report|hold|contraindicat|toxicity|precautions|bundle|protocol|anticoagulation|post-op|postoperative|exacerbation management)\b/i;

export type BlogSeoTopicIntentResult =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Validates a blog article topic for NCLEX-style search intent and clinical specificity.
 *
 * @param topic Raw topic / title line
 * @param scheduleExam When provided (e.g. from batch schedule), satisfies “exam relevance” without repeating NCLEX in every line.
 */
export function validateBlogTopicForSeoArticleGeneration(
  topic: string,
  scheduleExam?: string | null,
): BlogSeoTopicIntentResult {
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
        'Title uses a generic pattern (e.g. "Understanding…", "Overview of…", "Guide to…"). Use NCLEX-style intent: questions, priorities, vs comparisons, labs for nurses, first sign, or "what should the nurse do first".',
    };
  }
  if (/\:\s*Understanding\b/i.test(t)) {
    return {
      ok: false,
      reason:
        'Avoid "Understanding …" phrasing in titles (including after a colon). Prefer mechanism + nursing decision language (e.g. compensation cues, assessment priorities, NCLEX traps).',
    };
  }

  if (/\b(complete guide|ultimate guide|everything you need)\b/i.test(t)) {
    return { ok: false, reason: "Avoid guide-style filler; prefer a concrete exam or bedside decision query." };
  }

  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 4) {
    return { ok: false, reason: "Topic is too vague (too few words)." };
  }

  /** "NCLEX Questions on …" / "REx-PN Questions on …" already implies exam-scoped clinical content. */
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

  const examFromSchedule =
    typeof scheduleExam === "string" && scheduleExam.trim().length >= 2 ?
      scheduleExam.trim()
    : null;
  const examInTopic = EXAM_OR_LICENSURE.test(t);
  const examFromScheduleOk = examFromSchedule !== null && EXAM_OR_LICENSURE.test(examFromSchedule);
  const examOk = examInTopic || examFromScheduleOk;

  const intentShape = matchesHighIntentShape(t);
  const nursingActionCue = ACTIONABLE_NURSING.test(t);
  /** Long, exam-anchored clinical titles (bank / editorial) without awkward “NCLEX questions for …” prefixes. */
  const examGroundedClinical =
    examOk && CLINICAL_OR_EXAM_CATEGORY.test(t) && t.length >= 32 && /\b(questions|strategies|nursing care|management|assessment|interventions|differentiation|comparison|priorities|protocol|safety)\b/i.test(t);
  /** NCLEX/REx study-strategy lines that still name exam prep mechanics (not lifestyle fluff). */
  const examPrepStudyLine =
    examOk &&
    t.length >= 32 &&
    /\b(study|review|schedule|plan|practice|question bank|flashcard|mnemonic|mapping|recall|retention|anxiety|simulation|rationales?|readiness|calculations|drip|blueprint|calendar|timeline|mistakes|avoid|lessons?|textbooks|textbook|weekend|second-career|content|sub-categories|categories|multiple response|EMR|knowledge gaps|intervention level|Maslow|ABCs|CABs|deterioration|review list|80\/20|physiological integrity|health promotion|preparation timeline|practice from day one|family responsibilities|building|first-year|efficiently)\b/i.test(
      t,
    ) &&
    (CLINICAL_OR_EXAM_CATEGORY.test(t) || /\b(nclex|rex-?pn)\b/i.test(t));

  /** Safety / operations topics with explicit bedside or systems hooks (QSEN-style bank rows). */
  const safetyOpsTitle =
    examOk &&
    t.length >= 28 &&
    /\b(SBAR|BLS|ACLS|code blue|hand hygiene|patient identification|critical value|smart pump|DERS|handoff|elopement|sentinel event|just culture|wrong-site|staffing ratio|nurse-to-patient|mandatory reporting|pulse oximetry|oximetry|disaster|evacuation|rapid response|turning and repositioning|central line bundle|infection prevention|safe patient handling|body mechanics|pain scales|scope and safe referral)\b/i.test(
      t,
    ) &&
    /\b(nursing|nurse|nurses|patient|safe|safety|reporting|compliance|evidence|WHO)\b/i.test(t);

  /** Category-B style pathophysiology / management deep dives with explicit nursing anchor words. */
  const clinicalTeachingTitle =
    CLINICAL_OR_EXAM_CATEGORY.test(t) &&
    t.length >= 34 &&
    /\b(nursing|nurses|pathophysiology|assessment|management|interventions|prevention|recognition|implications|rehab|surveillance|exacerbation|post-op|postoperative|differentiation)\b/i.test(t);

  /** Mechanism / etiology structure lines (still clinically specific) when schedule supplies exam context. */
  const pathologyStructureTitle =
    examOk &&
    CLINICAL_OR_EXAM_CATEGORY.test(t) &&
    t.length >= 36 &&
    /\b(causes|classification|staging|subtypes|prerenal|intrarenal|postrenal|hypovolemic|cardiogenic|distributive|obstructive|depth classification|fluid resuscitation|embolization|carcinoma|treatment modalities|uric acid|hydroxyurea|vaso-occlusive|opportunistic infections|H\.?\s*pylori)\b/i.test(t);

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
        "Topic is not clearly actionable for nursing decisions. Prefer NCLEX-style stems (questions, priorities, vs, labs for nurses, first sign, nurse do first), or a concrete exam + clinical teaching line (not generic overview copy).",
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

export function partitionBlogTopicsBySeoIntent(
  topics: string[],
  scheduleExam?: string | null,
): { approved: string[]; rejected: Array<{ topic: string; reason: string }> } {
  const approved: string[] = [];
  const rejected: Array<{ topic: string; reason: string }> = [];
  for (const topic of topics) {
    const r = validateBlogTopicForSeoArticleGeneration(topic, scheduleExam);
    if (r.ok) approved.push(topic);
    else rejected.push({ topic, reason: r.reason });
  }
  return { approved, rejected };
}
