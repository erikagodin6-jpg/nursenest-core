import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import medicalLaboratoryTechnologyCatalog from "@/content/pathway-lessons/allied-professions/medical-laboratory-technology";

type AlliedProfessionCatalogModule = {
  lessons?: unknown[];
};

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
}

const mltProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "mlt");
if (mltProfession) {
  mltProfession.dedicatedCatalogFile = "medical-laboratory-technology";
  mltProfession.topicSlugsIn = [
    "specimen-integrity",
    "hematology",
    "clinical-chemistry",
    "microbiology",
    "transfusion-medicine",
    "laboratory-quality-control",
    "lab-values",
    "infection-control",
    "medical-terminology",
    "clinical-documentation",
  ];
  mltProfession.description =
    "Deep MLT and MLS education covering specimen integrity, hematology, chemistry, microbiology, transfusion medicine, QC, critical values, and laboratory safety reasoning.";
  mltProfession.examOverview = [
    "MLT and MLS exams reward mechanism-first laboratory reasoning: specimen quality, analyzer interpretation, QC, microbiology workflow, and transfusion safety.",
    "Use morphology, chemistry trends, culture interpretation, and QC logic together instead of memorizing isolated facts.",
    "Short scenario-heavy laboratory study loops outperform passive memorization for certification readiness.",
  ];
  mltProfession.features = [
    "Dedicated laboratory medicine lesson shard separated from generic allied content.",
    "Mechanism-first hematology, chemistry, microbiology, transfusion, and QC education.",
    "Specimen-integrity and analytical-interference teaching aligned to real laboratory workflow.",
    "Paginated allied lesson hubs that scale as the laboratory catalog expands.",
  ];
  mltProfession.ctaLine =
    "Study hematology, chemistry, microbiology, transfusion medicine, and QC through the dedicated MLT/MLS pathway.";
  mltProfession.premiumCtaHeadline = "Master laboratory medicine, QC, microbiology, and transfusion safety";
}

export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  "pharmacy-technician": pharmacyTechnicianCatalog,
  "medical-laboratory-technology": medicalLaboratoryTechnologyCatalog,
};
