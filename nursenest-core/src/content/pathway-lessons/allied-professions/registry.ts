import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import medicalLaboratoryTechnologyCatalog from "@/content/pathway-lessons/allied-professions/medical-laboratory-technology";
import medicalImagingCatalog from "@/content/pathway-lessons/allied-professions/medical-imaging";
import emergencyMedicalServicesCatalog from "@/content/pathway-lessons/allied-professions/emergency-medical-services";
import sonographyCatalog from "@/content/pathway-lessons/allied-professions/sonography";
import medicalAssistantCatalog from "@/content/pathway-lessons/allied-professions/medical-assistant";
import dentalHygieneCatalog from "@/content/pathway-lessons/allied-professions/dental-hygiene";
import physiotherapyRehabCatalog from "@/content/pathway-lessons/allied-professions/physiotherapy-rehab";

type AlliedProfessionCatalogModule = {
  lessons?: unknown[];
};

const respiratoryProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "respiratory");
if (respiratoryProfession) {
  respiratoryProfession.dedicatedCatalogFile = "respiratory-therapy";
}

const pharmacyTechProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "pharmacy-tech");
if (pharmacyTechProfession) {
  pharmacyTechProfession.dedicatedCatalogFile = "pharmacy-technician";
}

const mltProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "mlt");
if (mltProfession) {
  mltProfession.dedicatedCatalogFile = "medical-laboratory-technology";
}

const imagingProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "imaging");
if (imagingProfession) {
  imagingProfession.dedicatedCatalogFile = "medical-imaging";
}

const emtProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "emt");
if (emtProfession) {
  emtProfession.dedicatedCatalogFile = "emergency-medical-services";
}

const sonographyProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "sonography");
if (sonographyProfession) {
  sonographyProfession.dedicatedCatalogFile = "sonography";
}

const medicalAssistantProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "medical-assistant");
if (medicalAssistantProfession) {
  medicalAssistantProfession.dedicatedCatalogFile = "medical-assistant";
}

const dentalHygieneProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "dental-hygiene");
if (dentalHygieneProfession) {
  dentalHygieneProfession.dedicatedCatalogFile = "dental-hygiene";
}

const physiotherapyProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "physiotherapy");
if (physiotherapyProfession) {
  physiotherapyProfession.dedicatedCatalogFile = "physiotherapy-rehab";
  physiotherapyProfession.topicSlugsIn = [
    "physiotherapy-assessment",
    "therapeutic-exercise",
    "gait-and-mobility",
    "neurologic-rehabilitation",
    "cardiopulmonary-rehab",
    "rehab-documentation-scope",
    "rehabilitation",
    "physical-therapy",
    "exercise-progression",
    "mobility-training",
    "fall-prevention",
  ];
  physiotherapyProfession.description =
    "Deep physiotherapy education covering movement assessment, therapeutic exercise, gait training, neurologic rehabilitation, cardiopulmonary rehab, mobility safety, and rehabilitation documentation.";
  physiotherapyProfession.examOverview = [
    "Physiotherapy and PTA exams reward clinical reasoning, progression safety, mobility assessment, neurologic recognition, and exercise prescription logic.",
    "Use function, gait, symptoms, vitals, balance, and movement quality together instead of memorizing isolated exercises.",
    "Scenario-based rehabilitation review improves retention and patient-safety reasoning more than passive memorization alone.",
  ];
  physiotherapyProfession.features = [
    "Dedicated rehabilitation lesson shard separated from generic allied-health filler.",
    "Mechanism-first movement assessment, gait, neuro rehab, and therapeutic-exercise education.",
    "Integrated cardiopulmonary monitoring, mobility safety, and rehab progression workflows.",
    "Shared rehab foundation supporting future orthopedics, sports medicine, vestibular rehab, pediatrics, and chronic-pain expansion.",
  ];
  physiotherapyProfession.ctaLine =
    "Study movement assessment, mobility, therapeutic exercise, and rehabilitation safety through the dedicated physiotherapy pathway.";
  physiotherapyProfession.premiumCtaHeadline = "Master rehabilitation assessment, therapeutic exercise, gait, and mobility safety";
}

const ptaProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "pta");
if (ptaProfession) {
  ptaProfession.dedicatedCatalogFile = "physiotherapy-rehab";
}

export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  "pharmacy-technician": pharmacyTechnicianCatalog,
  "medical-laboratory-technology": medicalLaboratoryTechnologyCatalog,
  "medical-imaging": medicalImagingCatalog,
  "emergency-medical-services": emergencyMedicalServicesCatalog,
  sonography: sonographyCatalog,
  "medical-assistant": medicalAssistantCatalog,
  "dental-hygiene": dentalHygieneCatalog,
  "physiotherapy-rehab": physiotherapyRehabCatalog,
};
