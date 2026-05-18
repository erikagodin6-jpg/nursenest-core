import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import medicalLaboratoryTechnologyCatalog from "@/content/pathway-lessons/allied-professions/medical-laboratory-technology";
import medicalImagingCatalog from "@/content/pathway-lessons/allied-professions/medical-imaging";
import emergencyMedicalServicesCatalog from "@/content/pathway-lessons/allied-professions/emergency-medical-services";
import sonographyCatalog from "@/content/pathway-lessons/allied-professions/sonography";
import medicalAssistantCatalog from "@/content/pathway-lessons/allied-professions/medical-assistant";

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
  medicalAssistantProfession.topicSlugsIn = [
    "ma-clinical-intake",
    "ma-vital-signs",
    "ma-infection-control",
    "ma-procedure-support",
    "ma-medication-safety",
    "ma-administrative-safety",
    "ambulatory-care",
    "medical-office-assistant",
    "clinic-workflow",
    "phone-triage",
    "patient-rooming",
  ];
  medicalAssistantProfession.description =
    "Deep medical assistant education covering rooming, vital signs, ambulatory workflows, medication safety, infection control, procedure support, privacy, and administrative triage routing.";
  medicalAssistantProfession.examOverview = [
    "Medical assistant exams reward workflow safety, prioritization, infection control, medication awareness, and recognition of urgent symptoms in ambulatory settings.",
    "Use rooming, vitals, specimen handling, privacy, and escalation logic together instead of memorizing isolated administrative facts.",
    "Scenario-based clinic workflow review improves retention and patient-safety reasoning more than passive memorization alone.",
  ];
  medicalAssistantProfession.features = [
    "Dedicated ambulatory-care lesson shard separated from generic allied-health filler.",
    "Mechanism-first rooming, intake, infection-control, and medication-safety education.",
    "Integrated ECG, POCT, vaccine, specimen, and administrative workflow training.",
    "Shared clinic-care foundation supporting future pediatrics, family practice, urgent care, and specialty-office expansion.",
  ];
  medicalAssistantProfession.ctaLine =
    "Study ambulatory workflows, rooming, vitals, medication safety, and clinic operations through the dedicated medical assistant pathway.";
  medicalAssistantProfession.premiumCtaHeadline = "Master ambulatory care workflows, patient intake, medication safety, and clinic operations";
}

export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  "pharmacy-technician": pharmacyTechnicianCatalog,
  "medical-laboratory-technology": medicalLaboratoryTechnologyCatalog,
  "medical-imaging": medicalImagingCatalog,
  "emergency-medical-services": emergencyMedicalServicesCatalog,
  sonography: sonographyCatalog,
  "medical-assistant": medicalAssistantCatalog,
};
