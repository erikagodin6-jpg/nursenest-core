#!/usr/bin/env node
/**
 * Emits data/reports/pathway-lessons/np-canonical-coverage-map.json — canonical topic spine for CA + US NP tracks.
 * Run from nursenest-core/: node script/build-np-canonical-coverage-map.mjs
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../data/reports/pathway-lessons/np-canonical-coverage-map.json");

const C = ["CA_NP", "FNP", "AGPCNP", "WHNP", "PNP_PC"];
const ALL = [...C, "PMHNP"];

function T(id, title, exams, extra = {}) {
  return { id, title, exams, auditDefault: "VERIFY_DB", ...extra };
}

/** Adult-primary-care heavy (excludes PNP_PC where inappropriate). */
const ADULT_PC = ["CA_NP", "FNP", "AGPCNP", "WHNP"];
/** Lifespan primary care. */
const LIFE = C;

const systems = [
  {
    id: "cardiovascular",
    name: "Cardiovascular",
    topics: [
      T("cv-hypertension", "Hypertension — all stages and management", LIFE),
      T("cv-heart-failure", "Heart failure — HFrEF and HFpEF", LIFE),
      T("cv-cad", "Coronary artery disease", LIFE),
      T("cv-stable-angina", "Stable angina", ADULT_PC.concat("PNP_PC")),
      T("cv-acs", "Acute coronary syndrome — recognition and initial management", LIFE),
      T("cv-afib", "Atrial fibrillation", LIFE),
      T("cv-arrhythmias-overview", "Other arrhythmias — overview", LIFE),
      T("cv-dyslipidemia", "Hyperlipidemia / dyslipidemia", LIFE),
      T("cv-pad", "Peripheral artery disease", ADULT_PC.concat("PNP_PC")),
      T("cv-dvt-vte", "DVT / VTE", LIFE),
      T("cv-pe", "Pulmonary embolism — recognition and initial management", LIFE, {
        dedupeNote: "Share pathophysiology with respiratory PE lesson — MERGE content where one canonical PE lesson suffices.",
      }),
      T("cv-valvular-overview", "Valvular heart disease — overview", ADULT_PC.concat("PNP_PC")),
      T("cv-risk-stratification", "Cardiovascular risk stratification", LIFE),
      T("cv-ecg-np", "ECG basics for NP practice", LIFE),
      T("cv-pharm-antihypertensives", "Antihypertensive pharmacology", LIFE),
      T("cv-pharm-hf", "Heart failure pharmacology", LIFE),
      T("cv-pharm-anticoagulation", "Anticoagulation", LIFE),
      T("cv-pharm-lipids", "Lipid management pharmacology", LIFE),
    ],
  },
  {
    id: "respiratory",
    name: "Respiratory",
    topics: [
      T("resp-asthma", "Asthma", LIFE),
      T("resp-copd", "COPD", ADULT_PC.concat("PNP_PC")),
      T("resp-pneumonia", "Pneumonia", LIFE),
      T("resp-bronchitis", "Bronchitis (acute / chronic context)", LIFE),
      T("resp-tb", "Tuberculosis — screening and basics", LIFE),
      T("resp-pe", "Pulmonary embolism", LIFE, { mergeInto: "cv-pe", auditDefault: "MERGE" }),
      T("resp-sleep-apnea", "Obstructive sleep apnea", ADULT_PC.concat("PNP_PC")),
      T("resp-urti-lrti", "URTI vs LRTI differentiation", LIFE),
      T("resp-oxygen", "Oxygen therapy", LIFE),
      T("resp-inhalers", "Inhaler pharmacology and technique", LIFE),
      T("resp-smoking-patho", "Smoking and vaping — pathophysiology", LIFE),
      T("resp-cessation", "Smoking cessation", LIFE),
    ],
  },
  {
    id: "gastrointestinal",
    name: "Gastrointestinal",
    topics: [
      T("gi-gerd", "GERD", LIFE),
      T("gi-pud", "Peptic ulcer disease", LIFE),
      T("gi-bleed", "GI bleeding — recognition and stabilization", LIFE),
      T("gi-ibs", "Irritable bowel syndrome", LIFE),
      T("gi-ibd", "IBD — Crohn disease and ulcerative colitis", LIFE),
      T("gi-hepatitis", "Viral hepatitis A, B, and C", LIFE),
      T("gi-nafld", "NAFLD / MASLD", LIFE),
      T("gi-cirrhosis", "Cirrhosis and complications", ADULT_PC.concat("PNP_PC")),
      T("gi-biliary", "Gallbladder and biliary disease", LIFE),
      T("gi-pancreatitis", "Pancreatitis", LIFE),
      T("gi-constipation", "Constipation", LIFE),
      T("gi-diarrhea", "Diarrhea — acute and chronic", LIFE),
      T("gi-nausea", "Nausea and vomiting", LIFE),
      T("gi-colon-screening", "Colon cancer screening", ADULT_PC.concat("PNP_PC")),
      T("gi-lfts", "Liver function tests — interpretation", LIFE),
    ],
  },
  {
    id: "endocrine_metabolic",
    name: "Endocrine / metabolic",
    topics: [
      T("endo-t1dm", "Type 1 diabetes", LIFE),
      T("endo-t2dm", "Type 2 diabetes", LIFE),
      T("endo-dka", "Diabetic ketoacidosis", LIFE),
      T("endo-hypoglycemia", "Hypoglycemia", LIFE),
      T("endo-insulin", "Insulin pharmacology", LIFE),
      T("endo-oral-dm", "Oral and non-insulin glucose-lowering agents", LIFE),
      T("endo-thyroid", "Thyroid disorders — hypo- and hyperthyroidism", LIFE),
      T("endo-adrenal", "Adrenal disorders — Cushing and Addison", ADULT_PC.concat("PNP_PC")),
      T("endo-hyperaldo", "Hyperaldosteronism", ADULT_PC.concat("PNP_PC")),
      T("endo-calcium", "Calcium and parathyroid disorders", LIFE),
      T("endo-osteoporosis", "Osteoporosis — diagnosis and management", LIFE),
      T("endo-metabolic-syndrome", "Metabolic syndrome", ADULT_PC.concat("PNP_PC")),
      T("endo-obesity", "Obesity — evaluation and lifestyle", LIFE),
      T("endo-weight-pharm", "Weight management pharmacology", ADULT_PC.concat("PNP_PC")),
      T("endo-hpa", "HPA axis and stress physiology — clinical relevance", ALL),
    ],
  },
  {
    id: "renal_gu",
    name: "Renal / genitourinary",
    topics: [
      T("renal-aki", "Acute kidney injury", LIFE),
      T("renal-ckd", "Chronic kidney disease", LIFE),
      T("renal-electrolytes", "Electrolyte disorders", LIFE),
      T("renal-uti", "Urinary tract infections", LIFE),
      T("renal-pyelo", "Pyelonephritis", LIFE),
      T("renal-bph", "Benign prostatic hyperplasia", ["CA_NP", "FNP", "AGPCNP", "WHNP"]),
      T("renal-prostatitis", "Prostatitis", ["CA_NP", "FNP", "AGPCNP"]),
      T("renal-ed", "Erectile dysfunction", ["CA_NP", "FNP", "AGPCNP", "WHNP"]),
      T("renal-male-infertility", "Male infertility — basics", ["CA_NP", "FNP", "AGPCNP"]),
      T("renal-hematuria", "Hematuria workup", LIFE),
      T("renal-dosing", "Renal dosing considerations", LIFE),
    ],
  },
  {
    id: "neurology",
    name: "Neurology",
    topics: [
      T("neuro-stroke-tia", "Stroke and TIA", LIFE),
      T("neuro-dementia", "Dementia", ADULT_PC.concat("PNP_PC")),
      T("neuro-delirium", "Delirium", ALL),
      T("neuro-parkinson", "Parkinson disease", ADULT_PC.concat("PNP_PC")),
      T("neuro-seizure", "Seizures and epilepsy — outpatient basics", LIFE),
      T("neuro-headache", "Headache — migraine, tension, cluster", LIFE),
      T("neuro-meningitis", "Meningitis — recognition and referral", LIFE),
      T("neuro-vertigo", "Vertigo — BPPV and vestibular neuritis", LIFE),
      T("neuro-sleep", "Sleep disorders — beyond OSA", ADULT_PC.concat("PNP_PC")),
      T("neuro-neuropathic-pain", "Neuropathic pain", LIFE),
      T("neuro-cns-pharm", "CNS pharmacology basics", ALL),
    ],
  },
  {
    id: "msk_rheum",
    name: "Musculoskeletal / rheumatology",
    topics: [
      T("msk-oa", "Osteoarthritis", LIFE),
      T("msk-ra", "Rheumatoid arthritis", LIFE),
      T("msk-gout", "Gout", LIFE),
      T("msk-as", "Ankylosing spondylitis", ADULT_PC.concat("PNP_PC")),
      T("msk-fibromyalgia", "Fibromyalgia", ALL),
      T("msk-osteoporosis", "Osteoporosis", LIFE, { mergeInto: "endo-osteoporosis", auditDefault: "MERGE" }),
      T("msk-septic-joint", "Septic arthritis", LIFE),
      T("msk-osteomyelitis", "Osteomyelitis", LIFE),
      T("msk-rhabdo", "Rhabdomyolysis", LIFE),
      T("msk-sprains", "Sprains, strains, and acute MSK injuries", LIFE),
      T("msk-rheum-pharm", "Rheumatologic pharmacology", LIFE),
    ],
  },
  {
    id: "womens_health",
    name: "Women’s health",
    topics: [
      T("wh-cycle", "Menstrual cycle physiology", ["CA_NP", "FNP", "WHNP", "PNP_PC"]),
      T("wh-contraception", "Contraception", ["CA_NP", "FNP", "WHNP"]),
      T("wh-pregnancy-basics", "Pregnancy — basics and triage", ["CA_NP", "FNP", "WHNP", "PNP_PC"]),
      T("wh-prenatal", "Prenatal care — primary care NP scope", ["CA_NP", "FNP", "WHNP"]),
      T("wh-menopause", "Menopause", ["CA_NP", "FNP", "WHNP", "AGPCNP"]),
      T("wh-osteoporosis", "Osteoporosis in women", ["CA_NP", "FNP", "WHNP", "AGPCNP"], {
        mergeInto: "endo-osteoporosis",
        auditDefault: "MERGE",
      }),
      T("wh-vaginitis", "Vaginitis", ["CA_NP", "FNP", "WHNP", "PNP_PC"]),
      T("wh-pid", "Pelvic inflammatory disease", ["CA_NP", "FNP", "WHNP"]),
      T("wh-pcos", "PCOS", ["CA_NP", "FNP", "WHNP", "AGPCNP"]),
      T("wh-endometriosis", "Endometriosis", ["CA_NP", "FNP", "WHNP"]),
      T("wh-aub", "Abnormal uterine bleeding", ["CA_NP", "FNP", "WHNP"]),
      T("wh-amenorrhea", "Amenorrhea", ["CA_NP", "FNP", "WHNP", "PNP_PC"]),
      T("wh-fertility", "Fertility basics", ["CA_NP", "FNP", "WHNP"]),
      T("wh-screening", "Cervical and breast cancer screening", ["CA_NP", "FNP", "WHNP", "AGPCNP"]),
    ],
  },
  {
    id: "mens_health",
    name: "Men’s health",
    topics: [
      T("mens-ed", "Erectile dysfunction", ["CA_NP", "FNP", "AGPCNP"], { mergeInto: "renal-ed", auditDefault: "MERGE" }),
      T("mens-testosterone", "Testosterone deficiency", ["CA_NP", "FNP", "AGPCNP"]),
      T("mens-bph", "BPH", ["CA_NP", "FNP", "AGPCNP"], { mergeInto: "renal-bph", auditDefault: "MERGE" }),
      T("mens-prostate-ca-screen", "Prostate cancer screening", ["CA_NP", "FNP", "AGPCNP"]),
      T("mens-infertility", "Male infertility", ["CA_NP", "FNP", "AGPCNP"], { mergeInto: "renal-male-infertility", auditDefault: "MERGE" }),
      T("mens-prostatitis", "Prostatitis", ["CA_NP", "FNP", "AGPCNP"], { mergeInto: "renal-prostatitis", auditDefault: "MERGE" }),
      T("mens-uti", "UTI in males", ["CA_NP", "FNP", "AGPCNP"]),
    ],
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    topics: [
      T("peds-growth", "Growth and development", ["CA_NP", "FNP", "PNP_PC"]),
      T("peds-vitals", "Pediatric vital signs and red flags", ["CA_NP", "FNP", "PNP_PC"]),
      T("peds-infections", "Common pediatric infections", ["CA_NP", "FNP", "PNP_PC"]),
      T("peds-fever", "Fever in children", ["CA_NP", "FNP", "PNP_PC"]),
      T("peds-immunizations", "Immunizations — pediatric focus", ["CA_NP", "FNP", "PNP_PC"]),
      T("peds-pharm", "Pediatric pharmacology basics", ["CA_NP", "FNP", "PNP_PC"]),
      T("peds-common", "Common ambulatory pediatric conditions", ["CA_NP", "FNP", "PNP_PC"]),
    ],
  },
  {
    id: "infectious_disease",
    name: "Infectious disease",
    topics: [
      T("id-abx-classes", "Antibiotic classes", LIFE),
      T("id-gram", "Gram-positive vs gram-negative — empiric implications", LIFE),
      T("id-empiric", "Empiric therapy selection", LIFE),
      T("id-stewardship", "Antibiotic stewardship", LIFE),
      T("id-resistance", "Resistance mechanisms — overview", LIFE),
      T("id-outpatient", "Common outpatient infections", LIFE),
      T("id-antifungal", "Antifungals — basics", LIFE),
      T("id-sti", "STI management", LIFE),
      T("id-travel", "Travel medicine — basics", LIFE),
    ],
  },
  {
    id: "immunology_vaccines",
    name: "Immunology / vaccines",
    topics: [
      T("imm-vaccine-types", "Vaccine types", LIFE),
      T("imm-active-passive", "Active vs passive immunity", LIFE),
      T("imm-mrna-adeno", "mRNA vs adenovirus platforms — conceptual", ["CA_NP", "FNP", "AGPCNP", "WHNP", "PNP_PC"]),
      T("imm-schedules", "Vaccine schedules — conceptual (US vs Canada overlays)", LIFE),
      T("imm-herd", "Herd immunity", LIFE),
      T("imm-travel-vax", "Travel vaccines", LIFE),
      T("imm-safety", "Vaccine counseling and safety communication", LIFE),
    ],
  },
  {
    id: "mental_health",
    name: "Mental health",
    topics: [
      T("mh-depression", "Depression", ALL),
      T("mh-anxiety", "Anxiety disorders", ALL),
      T("mh-ptsd", "PTSD", ALL),
      T("mh-sud", "Substance use disorders", ALL),
      T("mh-suicide", "Suicide risk assessment", ALL),
      T("mh-psychopharm", "Psychopharmacology basics", ALL),
      T("mh-behavioral", "Behavioral therapy — basics for NPs", ALL),
    ],
  },
  {
    id: "dermatology",
    name: "Dermatology",
    topics: [
      T("derm-rashes", "Common rashes — morphologic approach", LIFE),
      T("derm-acne", "Acne", ["CA_NP", "FNP", "WHNP", "PNP_PC"]),
      T("derm-eczema", "Eczema / atopic dermatitis", LIFE),
      T("derm-psoriasis", "Psoriasis", LIFE),
      T("derm-infections", "Skin infections", LIFE),
      T("derm-cancer", "Skin cancer basics", ADULT_PC.concat("PNP_PC")),
    ],
  },
  {
    id: "hematology_oncology",
    name: "Hematology / oncology",
    topics: [
      T("heme-anemia", "Anemia — classification and workup", LIFE),
      T("heme-coag", "Coagulopathies — outpatient recognition", LIFE),
      T("heme-leukemia", "Leukemia — recognition and referral", ADULT_PC.concat("PNP_PC")),
      T("onco-screening", "Cancer screening — cross-system summary", ADULT_PC.concat("PNP_PC")),
      T("onco-red-flags", "Oncology red flags", LIFE),
    ],
  },
  {
    id: "geriatrics",
    name: "Geriatrics",
    topics: [
      T("geri-polypharm", "Polypharmacy", ADULT_PC.concat("PNP_PC", "PMHNP")),
      T("geri-deprescribing", "Deprescribing", ADULT_PC.concat("PNP_PC", "PMHNP")),
      T("geri-beers", "Beers criteria — high-level application", ADULT_PC.concat("PNP_PC", "PMHNP")),
      T("geri-falls", "Falls prevention and evaluation", ADULT_PC.concat("PNP_PC", "PMHNP")),
      T("geri-cognitive", "Cognitive decline — evaluation basics", ADULT_PC.concat("PNP_PC", "PMHNP")),
      T("geri-frailty", "Frailty", ["CA_NP", "FNP", "AGPCNP", "PMHNP"]),
    ],
  },
  {
    id: "preventive_primary_core",
    name: "Preventive care / primary care core",
    topics: [
      T("prev-screening", "Evidence-based screening guidelines (US vs Canada overlays)", LIFE),
      T("prev-health-promotion", "Health promotion", LIFE),
      T("prev-lifestyle", "Lifestyle medicine", LIFE),
      T("prev-risk", "Cardiometabolic and cancer risk reduction", LIFE),
      T("prev-vax-counsel", "Vaccination counseling", LIFE),
      T("prev-chronic-prev", "Chronic disease prevention", LIFE),
    ],
  },
  {
    id: "pharmacology_systemwide",
    name: "Pharmacology (system-wide)",
    topics: [
      T("pharm-classes", "Major drug classes across organ systems", ALL),
      T("pharm-mechanisms", "Mechanisms — high-yield for boards", ALL),
      T("pharm-adverse", "Adverse effects and monitoring", ALL),
      T("pharm-contra", "Contraindications", ALL),
      T("pharm-interactions", "Drug interactions", ALL),
      T("pharm-prescribing", "Prescribing decision logic", ALL),
      T("pharm-polypharm-cross", "Polypharmacy and deprescribing integration", ALL, {
        mergeInto: "geri-polypharm",
        auditDefault: "MERGE",
      }),
    ],
  },
];

const payload = {
  version: 1,
  generated: "2026-04-08",
  description:
    "Canonical NP topic spine: one logical lesson per concept where possible; pathway overlays (CA vs US, FNP vs AGPCNP vs WHNP vs PNP-PC vs PMHNP) live in lesson metadata and country_specific_notes — not duplicate full libraries per exam.",
  pathways: [
    { pathwayId: "ca-np-cnple", examTags: ["CA_NP"], notes: "Canadian NP / primary health care NP — use country_specific_notes vs US tracks." },
    { pathwayId: "us-np-fnp", examTags: ["FNP"] },
    { pathwayId: "us-np-agpcnp", examTags: ["AGPCNP"] },
    { pathwayId: "us-np-whnp", examTags: ["WHNP"] },
    { pathwayId: "us-np-pnp-pc", examTags: ["PNP_PC"] },
    { pathwayId: "us-np-pmhnp", examTags: ["PMHNP"] },
  ],
  auditLegend: {
    VERIFY_DB: "Compare topic to PathwayLesson rows by pathway — classify EXISTS_STRONG_SKIP | EXISTS_UPGRADE | CREATE_NEW | MERGE.",
    MERGE: "Do not author a second lesson; fold into mergeInto canonical id.",
  },
  systems,
  summaryBySystem: Object.fromEntries(systems.map((s) => [s.id, { topicCount: s.topics.length }])),
  totals: {
    systems: systems.length,
    topics: systems.reduce((n, s) => n + s.topics.length, 0),
    mergeHints: systems.flatMap((s) => s.topics.filter((t) => t.mergeInto).map((t) => ({ id: t.id, mergeInto: t.mergeInto }))),
  },
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2), "utf8");
console.log("Wrote", OUT, "topics:", payload.totals.topics);
