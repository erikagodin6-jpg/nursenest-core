import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import medicalLaboratoryTechnologistCatalog from "@/content/pathway-lessons/allied-professions/medical-laboratory-technologist";
import physicalTherapistAssistantCatalog from "@/content/pathway-lessons/allied-professions/physical-therapist-assistant";

type AlliedProfessionCatalogModule = {
  lessons?: unknown[];
};

/**
 * Attach dedicated allied profession catalogs without forcing a full rewrite of
 * the large profession registry. `ALLIED_PROFESSIONS` is an exported mutable
 * array; this preserves existing route metadata while enabling the optional
 * shard merge in `loadAlliedProfessionDedicatedLessonsForPathway()`.
 */
const respiratoryProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "respiratory");
if (respiratoryProfession) {
  respiratoryProfession.dedicatedCatalogFile = "respiratory-therapy";
  respiratoryProfession.topicSlugsIn = [
    "respiratory-therapy",
    "abg-interpretation",
    "mechanical-ventilation",
    "ventilator-waveforms",
    "ventilator-troubleshooting",
    "critical-care-respiratory-therapy",
    "patient-assessment",
    "human-physiology",
    "emergency-response",
    "infection-control",
  ];
  respiratoryProfession.description =
    "Deep respiratory therapy education covering ABGs, mechanical ventilation, waveforms, ARDS, airway management, oxygenation failure, and ICU respiratory physiology.";
  respiratoryProfession.examOverview = [
    "RT board-style questions test mechanism-first reasoning: oxygenation failure, ventilation failure, alarms, compliance, resistance, and escalation.",
    "Use waveform interpretation, ABGs, and ventilator troubleshooting together instead of memorizing isolated settings.",
    "Short ICU-style study loops with scenario reasoning outperform passive reading for respiratory certification prep.",
  ];
  respiratoryProfession.features = [
    "Dedicated respiratory therapy lesson shard with ventilator and ABG depth.",
    "RT-specific lessons separated from generic allied-health filler content.",
    "Paginated lesson hubs and internal crawl paths for large critical-care topic libraries.",
    "Mechanism-first waveform and oxygenation teaching aligned to ICU practice.",
  ];
  respiratoryProfession.ctaLine =
    "Study ABGs, ventilation, waveforms, and ICU respiratory care through the dedicated RT pathway.";
  respiratoryProfession.premiumCtaHeadline = "Master ventilation, waveforms, ABGs, and ICU respiratory care";
}

const pharmacyTechProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "pharmacy-tech");
if (pharmacyTechProfession) {
  pharmacyTechProfession.dedicatedCatalogFile = "pharmacy-technician";
  pharmacyTechProfession.topicSlugsIn = [
    "pharmacy-tech",
    "pharmacy-calculations",
    "top-200-drugs",
    "medication-safety",
    "pharmacy-law-and-ethics",
    "pharmacy-compounding",
    "pharmacology",
    "medical-terminology",
    "clinical-documentation",
  ];
  pharmacyTechProfession.description =
    "PTCE, ExCPT, and PEBC-aligned pharmacy technician study for prescription workflow, dosage calculations, Top 200 drugs, medication safety, law, privacy, and compounding.";
  pharmacyTechProfession.examOverview = [
    "Pharmacy technician exams reward accuracy, unit-safe math, medication safety escalation, and role-boundary judgment.",
    "Alternate dosage calculation drills with Top 200 drug recall, workflow red flags, and high-alert medication safety rationales.",
    "Use jurisdiction-aware law and privacy review for PTCE, ExCPT, and PEBC-style exam contexts without mixing generic allied filler into the pharmacy lane.",
  ];
  pharmacyTechProfession.features = [
    "Dedicated pharmacy technician lesson shard separated from generic allied content.",
    "Medication-safety-first lessons covering high-alert drugs, unsafe abbreviations, LASA risks, and clarification triggers.",
    "Pharmacy math foundations with dimensional analysis, liquid dosing, days supply, and decimal safety.",
    "Top 200 drug, law, privacy, workflow, and compounding topics mapped for future flashcards and readiness analytics.",
  ];
  pharmacyTechProfession.ctaLine =
    "Study pharmacy math, Top 200 drugs, workflow, law, and compounding through the dedicated Pharmacy Technician pathway.";
  pharmacyTechProfession.premiumCtaHeadline = "Master pharmacy calculations, Top 200 drugs, and medication safety";
}

const mltProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "mlt");
if (mltProfession) {
  mltProfession.dedicatedCatalogFile = "medical-laboratory-technologist";
  mltProfession.topicSlugsIn = [
    "hematology-cbc-interpretation",
    "blood-banking-crossmatch",
    "clinical-chemistry-panels",
    "microbiology-culture-identification",
    "coagulation-studies-guide",
    "urinalysis-body-fluids",
    "lab-values",
    "infection-control",
    "medical-terminology",
    "clinical-documentation",
  ];
  mltProfession.description =
    "CSMLS, ASCP MLS, and ASCP MLT-aligned laboratory education for hematology, blood bank, clinical chemistry, microbiology, QC, analyzer reasoning, specimen integrity, and escalation judgment.";
  mltProfession.examOverview = [
    "MLS and MLT exams test more than reference ranges: they reward specimen integrity, analyzer logic, QC awareness, morphology recognition, and safe result verification.",
    "Use domain-specific study loops: hematology morphology, blood bank panel reasoning, chemistry interference, microbiology identification, and coagulation workflows.",
    "CSMLS-style fixed-format review and ASCP-style adaptive practice should both preserve laboratory workflow realism and escalation judgment.",
  ];
  mltProfession.features = [
    "Dedicated MLS/MLT lesson shard separated from generic allied-health filler content.",
    "Hematology, blood bank, chemistry, microbiology, coagulation, urinalysis, and QC topic slugs prepared for deep catalog expansion.",
    "Workflow-first teaching for specimen integrity, analyzer flags, critical values, and result verification.",
    "Future-ready metadata path for morphology drills, blood bank solver cases, QC simulations, and adaptive remediation.",
  ];
  mltProfession.ctaLine =
    "Study hematology, blood bank, chemistry, microbiology, and QC through the dedicated MLS/MLT laboratory pathway.";
  mltProfession.premiumCtaHeadline = "Master laboratory interpretation, QC, morphology, and transfusion safety";
}

const ptaProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "pta");
if (ptaProfession) {
  ptaProfession.dedicatedCatalogFile = "physical-therapist-assistant";
  ptaProfession.topicSlugsIn = [
    "pta-transfer-safety",
    "pta-gait-assistive-devices",
    "pta-therapeutic-exercise",
    "pta-orthopedic-rehab",
    "pta-neuro-rehab",
    "patient-assessment",
    "human-anatomy",
    "human-physiology",
    "vital-signs",
    "patient-communication",
  ];
  ptaProfession.description =
    "Dedicated PTA rehab education for transfer safety, gait training, assistive devices, therapeutic exercise progression, orthopedic precautions, neurorehab cueing, and fall-risk judgment.";
  ptaProfession.examOverview = [
    "PTA exams reward safe movement reasoning: setup, guarding, weight-bearing precautions, assist level, cueing, and when to stop or regress treatment.",
    "Use rehab-specific study loops across transfers, gait training, therapeutic exercise, orthopedic precautions, and neurorehab progression.",
    "Scenario practice should prioritize patient safety, plan-of-care alignment, symptom response, and scope-aware communication.",
  ];
  ptaProfession.features = [
    "Dedicated PTA lesson shard separated from generic allied-health filler content.",
    "Transfer safety, gait/device reasoning, therapeutic exercise, orthopedic rehab, and neurorehab topic slugs prepared for deeper catalog expansion.",
    "Workflow-first teaching for fall prevention, symptom response, guarding, assist level, and safe treatment progression.",
    "Future-ready metadata path for gait drills, transfer simulations, ROM dashboards, and adaptive rehab remediation.",
  ];
  ptaProfession.ctaLine =
    "Study transfer safety, gait training, therapeutic exercise, orthopedic rehab, and neurorehab through the dedicated PTA pathway.";
  ptaProfession.premiumCtaHeadline = "Master transfer safety, gait training, and rehab progression";
}

/**
 * Static manifest for optional per-profession allied lesson shards.
 *
 * Keep this explicit so Turbopack never has to resolve an open-ended dynamic
 * import for `allied-professions/${file}` when no optional shards are present.
 */
export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  "pharmacy-technician": pharmacyTechnicianCatalog,
  "medical-laboratory-technologist": medicalLaboratoryTechnologistCatalog,
  "physical-therapist-assistant": physicalTherapistAssistantCatalog,
};