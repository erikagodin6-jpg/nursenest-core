/**
 * Internal Link Target Registry.
 *
 * A deterministic, statically-declared map from canonical topic key → set of
 * LinkTarget entries (lessons, flashcards, question pages, and blog hubs).
 *
 * Design rules:
 * - All hrefs are root-relative and canonical (no locale prefix, no trailing slash).
 * - Flashcard hrefs use /flashcards/{topicSlug} when a deck exists.
 * - Question hrefs are pathway-scoped where possible; shared /question-bank as fallback.
 * - Lesson hrefs use marketingPathwayLessonDetailPath helpers.
 * - Topic-scoped lesson lists use /lessons?topicSlug={slug} on each pathway lessons hub.
 * - A registry miss (unrecognized topic) is safe — the resolver returns empty results.
 * - Additional targets can be registered at runtime via registerLinkTargets().
 *
 * How to add new topics:
 * 1. Add the canonical key to topic-synonym-map.ts if needed.
 * 2. Add entries below following the existing pattern.
 */

import type { LinkTarget } from "@/lib/linking/internal-link-types";

// ── Pathway question base paths (canonical) ───────────────────────────────────

const Q = {
  usRn: "/us/rn/nclex-rn/questions",
  usPn: "/us/lpn/nclex-pn/questions",
  usNp: "/us/np/nclex-rn/questions",
  caRpn: "/canada/rpn/rex-pn/questions",
  shared: "/question-bank",
};

// ── Pathway lesson base paths (canonical) ─────────────────────────────────────

const L = {
  usRn: "/us/rn/nclex-rn/lessons",
  usPn: "/us/lpn/nclex-pn/lessons",
  caRpn: "/canada/rpn/rex-pn/lessons",
  allied: "/allied-health",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function lessonTarget(
  topicKey: string,
  slug: string,
  title: string,
  bodySystem: string,
  pathwayBase: string,
  examFamily: string | null = null,
): LinkTarget {
  return {
    kind: "lesson",
    topicKey,
    href: `${pathwayBase}/${slug}`,
    anchorText: `review the ${title} lesson`,
    anchorVariants: [
      `study ${title}`,
      `${title} study guide`,
      `learn about ${title}`,
      `${title} lesson`,
    ],
    bodySystem,
    examFamily,
    pathwayId: pathwayBase.includes("nclex-rn")
      ? "us-nclex-rn"
      : pathwayBase.includes("nclex-pn")
        ? "us-nclex-pn"
        : pathwayBase.includes("rex-pn")
          ? "ca-rex-pn"
          : null,
    eligible: true,
  };
}

function flashcardTarget(
  topicKey: string,
  deckSlug: string,
  label: string,
  bodySystem: string,
): LinkTarget {
  return {
    kind: "flashcard",
    topicKey,
    href: `/flashcards/${deckSlug}`,
    anchorText: `study ${label} flashcards`,
    anchorVariants: [
      `${label} flashcard deck`,
      `practice ${label} with flashcards`,
      `review ${label} cards`,
    ],
    bodySystem,
    examFamily: null,
    eligible: true,
  };
}

function questionTarget(
  topicKey: string,
  pathwayHref: string,
  label: string,
  examFamily: string | null,
  topicParam?: string,
): LinkTarget {
  const href = topicParam ? `${pathwayHref}?topic=${encodeURIComponent(topicParam)}` : pathwayHref;
  return {
    kind: "question",
    topicKey,
    href,
    anchorText: `practice ${label} questions`,
    anchorVariants: [
      `test your ${label} knowledge`,
      `${label} practice questions`,
      `try ${label} exam questions`,
    ],
    examFamily,
    eligible: true,
  };
}

function blogHubTarget(
  topicKey: string,
  tag: string,
  label: string,
): LinkTarget {
  return {
    kind: "blog",
    topicKey,
    href: `/blog/tag/${encodeURIComponent(tag)}`,
    anchorText: `read more about ${label}`,
    anchorVariants: [
      `${label} articles`,
      `${label} blog posts`,
      `explore ${label} content`,
    ],
    eligible: true,
  };
}

// ── Registry entries ──────────────────────────────────────────────────────────

const REGISTRY_ENTRIES: LinkTarget[] = [
  // ─── Cardiovascular ──────────────────────────────────────────────────────

  // Heart Failure
  lessonTarget("heart-failure", "heart-failure-management-gold", "Heart Failure", "cardiovascular", L.usRn, "NCLEX-RN"),
  flashcardTarget("heart-failure", "heart-failure", "Heart Failure", "cardiovascular"),
  questionTarget("heart-failure", Q.usRn, "heart failure", "NCLEX-RN", "heart-failure"),
  questionTarget("heart-failure", Q.caRpn, "heart failure", "REx-PN", "heart-failure"),
  blogHubTarget("heart-failure", "heart-failure", "Heart Failure"),

  // ACS / Myocardial Infarction
  lessonTarget("acute-coronary-syndrome", "acute-coronary-syndrome-gold", "Acute Coronary Syndrome", "cardiovascular", L.usRn, "NCLEX-RN"),
  flashcardTarget("acute-coronary-syndrome", "cardiac", "ACS & Cardiac", "cardiovascular"),
  questionTarget("acute-coronary-syndrome", Q.usRn, "cardiac / ACS", "NCLEX-RN"),
  blogHubTarget("acute-coronary-syndrome", "cardiac", "Cardiac Nursing"),

  lessonTarget("myocardial-infarction", "acute-coronary-syndrome-gold", "Acute Coronary Syndrome", "cardiovascular", L.usRn, "NCLEX-RN"),
  questionTarget("myocardial-infarction", Q.usRn, "myocardial infarction", "NCLEX-RN"),
  flashcardTarget("myocardial-infarction", "cardiac", "Cardiac", "cardiovascular"),

  // Cardiac Arrhythmia
  lessonTarget("cardiac-arrhythmia", "cardiac-arrhythmias-gold", "Cardiac Arrhythmias", "cardiovascular", L.usRn, "NCLEX-RN"),
  flashcardTarget("cardiac-arrhythmia", "cardiac-arrhythmias", "Cardiac Arrhythmias", "cardiovascular"),
  questionTarget("cardiac-arrhythmia", Q.usRn, "cardiac arrhythmia", "NCLEX-RN"),

  // Atrial Fibrillation (shares lesson with arrhythmia)
  lessonTarget("atrial-fibrillation", "cardiac-arrhythmias-gold", "Cardiac Arrhythmias", "cardiovascular", L.usRn, "NCLEX-RN"),
  questionTarget("atrial-fibrillation", Q.usRn, "atrial fibrillation", "NCLEX-RN"),

  // Hypertension
  lessonTarget("hypertension", "hypertension-hypertensive-crisis-gold", "Hypertension & Crisis", "cardiovascular", L.usRn, "NCLEX-RN"),
  flashcardTarget("hypertension", "hypertension", "Hypertension", "cardiovascular"),
  questionTarget("hypertension", Q.usRn, "hypertension", "NCLEX-RN"),

  // Hypertensive Crisis
  lessonTarget("hypertensive-crisis", "hypertension-hypertensive-crisis-gold", "Hypertensive Crisis", "cardiovascular", L.usRn, "NCLEX-RN"),
  questionTarget("hypertensive-crisis", Q.usRn, "hypertensive crisis", "NCLEX-RN"),

  // Pulmonary Embolism / DVT
  lessonTarget("pulmonary-embolism", "pulmonary-embolism-dvt-gold", "Pulmonary Embolism & DVT", "cardiovascular", L.usRn, "NCLEX-RN"),
  flashcardTarget("pulmonary-embolism", "pulmonary-embolism", "PE & DVT", "cardiovascular"),
  questionTarget("pulmonary-embolism", Q.usRn, "pulmonary embolism", "NCLEX-RN"),
  lessonTarget("deep-vein-thrombosis", "pulmonary-embolism-dvt-gold", "DVT & Pulmonary Embolism", "cardiovascular", L.usRn, "NCLEX-RN"),

  // AAA
  lessonTarget("abdominal-aortic-aneurysm", "aortic-aneurysm-gold", "Aortic Aneurysm", "cardiovascular", L.usRn, "NCLEX-RN"),
  questionTarget("abdominal-aortic-aneurysm", Q.usRn, "aortic aneurysm", "NCLEX-RN"),

  // ─── Respiratory ─────────────────────────────────────────────────────────

  // COPD
  lessonTarget("copd", "copd-gold-standard", "COPD Management", "respiratory", L.usRn, "NCLEX-RN"),
  lessonTarget("copd", "copd-gold-standard", "COPD Management", "respiratory", L.caRpn, "REx-PN"),
  flashcardTarget("copd", "copd", "COPD", "respiratory"),
  questionTarget("copd", Q.usRn, "COPD", "NCLEX-RN"),
  questionTarget("copd", Q.caRpn, "COPD", "REx-PN"),
  blogHubTarget("copd", "copd", "COPD"),

  // Asthma
  lessonTarget("asthma", "asthma-management-gold", "Asthma Management", "respiratory", L.usRn, "NCLEX-RN"),
  flashcardTarget("asthma", "respiratory", "Respiratory", "respiratory"),
  questionTarget("asthma", Q.usRn, "asthma", "NCLEX-RN"),

  // Pneumonia
  lessonTarget("pneumonia", "pneumonia-gold", "Pneumonia", "respiratory", L.usRn, "NCLEX-RN"),
  flashcardTarget("pneumonia", "pneumonia", "Pneumonia", "respiratory"),
  questionTarget("pneumonia", Q.usRn, "pneumonia", "NCLEX-RN"),

  // ARDS
  lessonTarget("ards", "ards-respiratory-failure-gold", "ARDS & Respiratory Failure", "respiratory", L.usRn, "NCLEX-RN"),
  questionTarget("ards", Q.usRn, "ARDS", "NCLEX-RN"),

  // Mechanical Ventilation
  lessonTarget("mechanical-ventilation", "mechanical-ventilation-gold", "Mechanical Ventilation", "respiratory", L.usRn, "NCLEX-RN"),
  questionTarget("mechanical-ventilation", Q.usRn, "mechanical ventilation", "NCLEX-RN"),

  // Oxygen therapy
  lessonTarget("oxygen-therapy", "oxygen-therapy-gold", "Oxygen Therapy", "respiratory", L.usRn, "NCLEX-RN"),
  flashcardTarget("oxygen-therapy", "respiratory", "Respiratory", "respiratory"),

  // ─── Neurological ────────────────────────────────────────────────────────

  // Stroke / ICP
  lessonTarget("stroke", "stroke-increased-icp-gold", "Stroke & Increased ICP", "neurological", L.usRn, "NCLEX-RN"),
  flashcardTarget("stroke", "neuro", "Neuro / Stroke", "neurological"),
  questionTarget("stroke", Q.usRn, "stroke", "NCLEX-RN"),
  blogHubTarget("stroke", "stroke", "Stroke Nursing"),

  lessonTarget("increased-icp", "stroke-increased-icp-gold", "Increased ICP", "neurological", L.usRn, "NCLEX-RN"),
  questionTarget("increased-icp", Q.usRn, "increased ICP", "NCLEX-RN"),

  // Seizure
  lessonTarget("seizure", "seizure-epilepsy-gold", "Seizures & Epilepsy", "neurological", L.usRn, "NCLEX-RN"),
  flashcardTarget("seizure", "neuro", "Neurology", "neurological"),
  questionTarget("seizure", Q.usRn, "seizure", "NCLEX-RN"),

  // Delirium
  lessonTarget("delirium", "delirium-dementia-gold", "Delirium vs Dementia", "neurological", L.usRn, "NCLEX-RN"),
  flashcardTarget("delirium", "neuro", "Neurology", "neurological"),
  questionTarget("delirium", Q.usRn, "delirium", "NCLEX-RN"),

  // Dementia
  lessonTarget("dementia", "delirium-dementia-gold", "Delirium vs Dementia", "neurological", L.usRn, "NCLEX-RN"),
  questionTarget("dementia", Q.usRn, "dementia", "NCLEX-RN"),

  // Multiple Sclerosis
  lessonTarget("multiple-sclerosis", "multiple-sclerosis-gold", "Multiple Sclerosis", "neurological", L.usRn, "NCLEX-RN"),
  questionTarget("multiple-sclerosis", Q.usRn, "multiple sclerosis", "NCLEX-RN"),

  // Spinal Cord Injury
  lessonTarget("spinal-cord-injury", "spinal-cord-injury-gold", "Spinal Cord Injury", "neurological", L.usRn, "NCLEX-RN"),
  questionTarget("spinal-cord-injury", Q.usRn, "spinal cord injury", "NCLEX-RN"),

  // ─── Renal ───────────────────────────────────────────────────────────────

  // AKI
  lessonTarget("acute-kidney-injury", "aki-renal-complications-gold", "AKI & Renal Complications", "renal", L.usRn, "NCLEX-RN"),
  flashcardTarget("acute-kidney-injury", "renal", "Renal", "renal"),
  questionTarget("acute-kidney-injury", Q.usRn, "acute kidney injury", "NCLEX-RN"),

  // CKD / Dialysis
  lessonTarget("dialysis", "renal-dialysis-acute-complications-gold", "Renal & Dialysis Complications", "renal", L.usRn, "NCLEX-RN"),
  flashcardTarget("dialysis", "renal", "Renal / Dialysis", "renal"),
  questionTarget("dialysis", Q.usRn, "dialysis", "NCLEX-RN"),
  blogHubTarget("dialysis", "renal", "Renal Nursing"),

  lessonTarget("chronic-kidney-disease", "renal-dialysis-acute-complications-gold", "Renal & Dialysis", "renal", L.usRn, "NCLEX-RN"),
  questionTarget("chronic-kidney-disease", Q.usRn, "chronic kidney disease", "NCLEX-RN"),

  // ─── Endocrine ───────────────────────────────────────────────────────────

  // Diabetes
  lessonTarget("diabetes-mellitus", "diabetes-management-gold", "Diabetes Management", "endocrine", L.usRn, "NCLEX-RN"),
  flashcardTarget("diabetes-mellitus", "endocrine", "Endocrine / Diabetes", "endocrine"),
  questionTarget("diabetes-mellitus", Q.usRn, "diabetes", "NCLEX-RN"),
  blogHubTarget("diabetes-mellitus", "diabetes", "Diabetes"),

  // DKA
  lessonTarget("diabetic-ketoacidosis", "dka-hhns-gold", "DKA & HHNS", "endocrine", L.usRn, "NCLEX-RN"),
  flashcardTarget("diabetic-ketoacidosis", "endocrine", "Endocrine", "endocrine"),
  questionTarget("diabetic-ketoacidosis", Q.usRn, "DKA", "NCLEX-RN"),

  // Thyroid Storm
  lessonTarget("thyroid-storm", "thyroid-disorders-gold", "Thyroid Disorders", "endocrine", L.usRn, "NCLEX-RN"),
  questionTarget("thyroid-storm", Q.usRn, "thyroid", "NCLEX-RN"),

  // SIADH
  lessonTarget("siadh", "siadh-diabetes-insipidus-gold", "SIADH & Diabetes Insipidus", "endocrine", L.usRn, "NCLEX-RN"),
  questionTarget("siadh", Q.usRn, "SIADH", "NCLEX-RN"),

  // ─── Fluids & Electrolytes ────────────────────────────────────────────────

  lessonTarget("fluids-electrolytes", "fluids-electrolytes-emergencies-gold", "Fluids & Electrolyte Emergencies", "medical-surgical", L.usRn, "NCLEX-RN"),
  lessonTarget("fluids-electrolytes", "fluids-electrolytes-emergencies-gold", "Fluids & Electrolytes", "medical-surgical", L.caRpn, "REx-PN"),
  flashcardTarget("fluids-electrolytes", "fluids-electrolytes", "Fluids & Electrolytes", "medical-surgical"),
  questionTarget("fluids-electrolytes", Q.usRn, "fluid and electrolyte", "NCLEX-RN"),
  questionTarget("fluids-electrolytes", Q.caRpn, "fluid and electrolyte", "REx-PN"),
  blogHubTarget("fluids-electrolytes", "fluids-electrolytes", "Fluids & Electrolytes"),

  lessonTarget("acid-base-balance", "acid-base-abg-gold", "Acid-Base Balance & ABGs", "medical-surgical", L.usRn, "NCLEX-RN"),
  flashcardTarget("acid-base-balance", "acid-base", "Acid-Base", "medical-surgical"),
  questionTarget("acid-base-balance", Q.usRn, "acid-base balance", "NCLEX-RN"),

  lessonTarget("hypokalemia", "fluids-electrolytes-emergencies-gold", "Fluids & Electrolytes", "medical-surgical", L.usRn, "NCLEX-RN"),
  lessonTarget("hyperkalemia", "fluids-electrolytes-emergencies-gold", "Fluids & Electrolytes", "medical-surgical", L.usRn, "NCLEX-RN"),

  // ─── Sepsis & Shock ──────────────────────────────────────────────────────

  lessonTarget("sepsis", "sepsis-early-recognition-gold", "Sepsis: Early Recognition & Response", "medical-surgical", L.usRn, "NCLEX-RN"),
  lessonTarget("sepsis", "sepsis-early-recognition-gold", "Sepsis", "medical-surgical", L.caRpn, "REx-PN"),
  flashcardTarget("sepsis", "sepsis", "Sepsis", "medical-surgical"),
  questionTarget("sepsis", Q.usRn, "sepsis", "NCLEX-RN"),
  questionTarget("sepsis", Q.caRpn, "sepsis", "REx-PN"),
  blogHubTarget("sepsis", "sepsis", "Sepsis"),

  lessonTarget("shock", "shock-gold", "Shock: Types, Assessment & Interventions", "medical-surgical", L.usRn, "NCLEX-RN"),
  flashcardTarget("shock", "shock", "Shock", "medical-surgical"),
  questionTarget("shock", Q.usRn, "shock", "NCLEX-RN"),
  blogHubTarget("shock", "shock", "Shock"),

  lessonTarget("anaphylactic-shock", "shock-gold", "Shock", "medical-surgical", L.usRn, "NCLEX-RN"),
  questionTarget("anaphylactic-shock", Q.usRn, "anaphylaxis", "NCLEX-RN"),

  // ─── Obstetrics ───────────────────────────────────────────────────────────

  lessonTarget("ob-emergencies", "ob-emergencies-gold", "OB Emergencies", "obstetrics", L.usRn, "NCLEX-RN"),
  flashcardTarget("ob-emergencies", "maternal-newborn", "Maternal Newborn", "obstetrics"),
  questionTarget("ob-emergencies", Q.usRn, "OB emergencies", "NCLEX-RN"),
  blogHubTarget("ob-emergencies", "maternal-newborn", "OB Nursing"),

  lessonTarget("preeclampsia", "ob-emergencies-gold", "OB Emergencies", "obstetrics", L.usRn, "NCLEX-RN"),
  questionTarget("preeclampsia", Q.usRn, "preeclampsia", "NCLEX-RN"),

  lessonTarget("abnormal-uterine-bleeding", "ob-emergencies-gold", "OB Emergencies", "obstetrics", L.usRn, "NCLEX-RN"),
  questionTarget("abnormal-uterine-bleeding", Q.usRn, "abnormal uterine bleeding", "NCLEX-RN"),
  blogHubTarget("abnormal-uterine-bleeding", "maternal-newborn", "Maternal Nursing"),

  // ─── Pediatrics ──────────────────────────────────────────────────────────

  lessonTarget("pediatrics", "pediatric-nursing-gold", "Pediatric Nursing", "pediatrics", L.usRn, "NCLEX-RN"),
  lessonTarget("pediatric-triage", "pediatric-triage-emergencies-gold", "Pediatric Triage & Emergencies", "pediatrics", L.usRn, "NCLEX-RN"),
  flashcardTarget("pediatrics", "pediatrics", "Pediatrics", "pediatrics"),
  questionTarget("pediatrics", Q.usRn, "pediatric", "NCLEX-RN"),
  blogHubTarget("pediatrics", "pediatrics", "Pediatric Nursing"),

  // ─── Pharmacology ────────────────────────────────────────────────────────

  lessonTarget("high-alert-medications", "high-alert-medications-gold", "High-Alert Medications", "pharmacology", L.usRn, "NCLEX-RN"),
  lessonTarget("high-alert-medications", "high-alert-medications-gold", "High-Alert Medications", "pharmacology", L.caRpn, "REx-PN"),
  flashcardTarget("high-alert-medications", "pharmacology", "Pharmacology", "pharmacology"),
  questionTarget("high-alert-medications", Q.usRn, "high-alert medications", "NCLEX-RN"),
  questionTarget("high-alert-medications", Q.caRpn, "high-alert medications", "REx-PN"),
  blogHubTarget("high-alert-medications", "pharmacology", "Pharmacology"),

  lessonTarget("anticoagulants", "anticoagulation-therapy-gold", "Anticoagulation Therapy", "pharmacology", L.usRn, "NCLEX-RN"),
  flashcardTarget("anticoagulants", "pharmacology", "Pharmacology", "pharmacology"),
  questionTarget("anticoagulants", Q.usRn, "anticoagulants", "NCLEX-RN"),

  lessonTarget("pain-management", "pain-management-gold", "Pain Management", "pharmacology", L.usRn, "NCLEX-RN"),
  flashcardTarget("pain-management", "pharmacology", "Pharmacology", "pharmacology"),
  questionTarget("pain-management", Q.usRn, "pain management", "NCLEX-RN"),

  lessonTarget("pharmacology", "pharmacology-fundamentals-gold", "Pharmacology Fundamentals", "pharmacology", L.usRn, "NCLEX-RN"),
  flashcardTarget("pharmacology", "pharmacology", "Pharmacology", "pharmacology"),
  questionTarget("pharmacology", Q.usRn, "pharmacology", "NCLEX-RN"),

  // ─── Clinical Judgment ────────────────────────────────────────────────────

  lessonTarget("clinical-judgment", "clinical-judgment-prioritization-gold", "Clinical Judgment & Prioritization", "medical-surgical", L.usRn, "NCLEX-RN"),
  flashcardTarget("clinical-judgment", "clinical-judgment", "Clinical Judgment", "medical-surgical"),
  questionTarget("clinical-judgment", Q.usRn, "clinical judgment", "NCLEX-RN"),
  blogHubTarget("clinical-judgment", "clinical-judgment", "Clinical Judgment"),

  lessonTarget("delegation", "delegation-supervision-gold", "Delegation & Supervision", "medical-surgical", L.usRn, "NCLEX-RN"),
  questionTarget("delegation", Q.usRn, "delegation", "NCLEX-RN"),

  lessonTarget("triage", "triage-prioritization-gold", "Triage & Prioritization", "medical-surgical", L.usRn, "NCLEX-RN"),
  questionTarget("triage", Q.usRn, "triage", "NCLEX-RN"),

  // ─── Infection Control ────────────────────────────────────────────────────

  lessonTarget("infection-control", "infection-control-precautions-gold", "Infection Control & Precautions", "medical-surgical", L.usRn, "NCLEX-RN"),
  flashcardTarget("infection-control", "infection-control", "Infection Control", "medical-surgical"),
  questionTarget("infection-control", Q.usRn, "infection control", "NCLEX-RN"),
  blogHubTarget("infection-control", "infection-control", "Infection Control"),

  // ─── Mental Health ────────────────────────────────────────────────────────

  lessonTarget("mental-health", "mental-health-fundamentals-gold", "Mental Health Fundamentals", "mental-health", L.usRn, "NCLEX-RN"),
  flashcardTarget("mental-health", "mental-health", "Mental Health", "mental-health"),
  questionTarget("mental-health", Q.usRn, "mental health", "NCLEX-RN"),
  blogHubTarget("mental-health", "mental-health", "Mental Health Nursing"),

  lessonTarget("suicide-risk", "suicide-risk-assessment-gold", "Suicide Risk Assessment", "mental-health", L.usRn, "NCLEX-RN"),
  questionTarget("suicide-risk", Q.usRn, "suicide risk", "NCLEX-RN"),

  lessonTarget("substance-abuse", "substance-abuse-withdrawal-gold", "Substance Abuse & Withdrawal", "mental-health", L.usRn, "NCLEX-RN"),
  questionTarget("substance-abuse", Q.usRn, "substance abuse", "NCLEX-RN"),

  // ─── Canadian RPN ─────────────────────────────────────────────────────────

  lessonTarget("rpn", "canadian-rpn-high-yield-gold", "Canadian RPN High-Yield Review", "medical-surgical", L.caRpn, "REx-PN"),
  lessonTarget("rex-pn", "canadian-rpn-high-yield-gold", "REx-PN High-Yield Review", "medical-surgical", L.caRpn, "REx-PN"),
  flashcardTarget("rpn", "rex-pn", "REx-PN Flashcards", "medical-surgical"),
  questionTarget("rpn", Q.caRpn, "RPN exam", "REx-PN"),
  questionTarget("rex-pn", Q.caRpn, "REx-PN", "REx-PN"),

  // ─── Hematology ──────────────────────────────────────────────────────────

  lessonTarget("sickle-cell-disease", "sickle-cell-disease-gold", "Sickle Cell Disease", "hematology", L.usRn, "NCLEX-RN"),
  flashcardTarget("sickle-cell-disease", "hematology", "Hematology", "hematology"),
  questionTarget("sickle-cell-disease", Q.usRn, "sickle cell", "NCLEX-RN"),

  lessonTarget("anemia", "anemia-management-gold", "Anemia Management", "hematology", L.usRn, "NCLEX-RN"),
  flashcardTarget("anemia", "hematology", "Hematology", "hematology"),
  questionTarget("anemia", Q.usRn, "anemia", "NCLEX-RN"),

  // ─── Safety ───────────────────────────────────────────────────────────────

  lessonTarget("patient-safety", "patient-safety-gold", "Patient Safety", "medical-surgical", L.usRn, "NCLEX-RN"),
  questionTarget("patient-safety", Q.usRn, "patient safety", "NCLEX-RN"),

  lessonTarget("fall-prevention", "fall-prevention-gold", "Fall Prevention", "medical-surgical", L.usRn, "NCLEX-RN"),
  questionTarget("fall-prevention", Q.usRn, "fall prevention", "NCLEX-RN"),

  // ─── GI ───────────────────────────────────────────────────────────────────

  lessonTarget("gi-bleeding", "gi-bleeding-gold", "GI Bleeding", "gastrointestinal", L.usRn, "NCLEX-RN"),
  flashcardTarget("gi-bleeding", "gastrointestinal", "GI Nursing", "gastrointestinal"),
  questionTarget("gi-bleeding", Q.usRn, "GI bleeding", "NCLEX-RN"),

  lessonTarget("pancreatitis", "pancreatitis-gold", "Pancreatitis", "gastrointestinal", L.usRn, "NCLEX-RN"),
  questionTarget("pancreatitis", Q.usRn, "pancreatitis", "NCLEX-RN"),

  // ─── Allied Health ────────────────────────────────────────────────────────

  {
    kind: "lesson",
    topicKey: "medical-laboratory-technology",
    href: `${L.allied}/mlt/lessons`,
    anchorText: "review MLT lessons",
    anchorVariants: ["medical laboratory technology lessons", "MLT study guide"],
    examFamily: "ALLIED",
    eligible: true,
  },
  {
    kind: "lesson",
    topicKey: "respiratory-therapy",
    href: `${L.allied}/respiratory-therapy/lessons`,
    anchorText: "study respiratory therapy lessons",
    anchorVariants: ["respiratory therapy study guide", "RT lessons"],
    examFamily: "ALLIED",
    eligible: true,
  },
  {
    kind: "lesson",
    topicKey: "paramedic",
    href: `${L.allied}/paramedic/lessons`,
    anchorText: "review paramedic lessons",
    anchorVariants: ["EMS study guide", "paramedic exam prep"],
    examFamily: "ALLIED",
    eligible: true,
  },
  {
    kind: "lesson",
    topicKey: "pharmacy-technician",
    href: `${L.allied}/pharmacy-tech/lessons`,
    anchorText: "study pharmacy technician lessons",
    anchorVariants: ["pharmacy tech exam prep", "pharmacy technician study guide"],
    examFamily: "ALLIED",
    eligible: true,
  },
  {
    kind: "question",
    topicKey: "medical-laboratory-technology",
    href: "/us/allied/allied-health/questions",
    anchorText: "practice allied health questions",
    anchorVariants: ["try allied health exam questions", "allied health question bank"],
    examFamily: "ALLIED",
    eligible: true,
  },
];

// ── Index ─────────────────────────────────────────────────────────────────────

/** Internal: topic-key → all targets for that topic. */
const _index = new Map<string, LinkTarget[]>();

function _buildIndex(): void {
  for (const target of REGISTRY_ENTRIES) {
    const list = _index.get(target.topicKey) ?? [];
    list.push(target);
    _index.set(target.topicKey, list);
  }
}

_buildIndex();

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Return all registered link targets for a canonical topic key.
 * Returns an empty array if the topic is not in the registry.
 */
export function getTargetsForTopic(topicKey: string): LinkTarget[] {
  return _index.get(topicKey) ?? [];
}

/**
 * Return all targets that match a given body system.
 * Useful for secondary/fallback matching.
 */
export function getTargetsByBodySystem(bodySystem: string): LinkTarget[] {
  return REGISTRY_ENTRIES.filter((t) => t.bodySystem === bodySystem);
}

/**
 * Register additional link targets at runtime (e.g. from DB-resolved data).
 * Re-indexes into the topic key map.
 */
export function registerLinkTargets(targets: LinkTarget[]): void {
  for (const target of targets) {
    REGISTRY_ENTRIES.push(target);
    const list = _index.get(target.topicKey) ?? [];
    list.push(target);
    _index.set(target.topicKey, list);
  }
}

/** Total number of registered link targets (useful for admin/debug). */
export function registrySize(): number {
  return REGISTRY_ENTRIES.length;
}

/** All canonical topic keys that have at least one registered target. */
export function registeredTopicKeys(): string[] {
  return [..._index.keys()].sort();
}
