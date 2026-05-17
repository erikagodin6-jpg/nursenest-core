import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";

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

/**
 * Static manifest for optional per-profession allied lesson shards.
 *
 * Keep this explicit so Turbopack never has to resolve an open-ended dynamic
 * import for `allied-professions/${file}` when no optional shards are present.
 */
export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  "pharmacy-technician": pharmacyTechnicianCatalog,
};
