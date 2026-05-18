import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import medicalLaboratoryTechnologyCatalog from "@/content/pathway-lessons/allied-professions/medical-laboratory-technology";
import medicalImagingCatalog from "@/content/pathway-lessons/allied-professions/medical-imaging";
import emergencyMedicalServicesCatalog from "@/content/pathway-lessons/allied-professions/emergency-medical-services";

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
  emtProfession.topicSlugsIn = [
    "ems-scene-safety",
    "ems-primary-assessment",
    "ems-airway",
    "ems-shock",
    "ems-cardiology",
    "ems-trauma",
    "prehospital-care",
    "emergency-response",
    "patient-assessment",
    "critical-care-transport",
  ];
  emtProfession.description =
    "Deep EMT and paramedic education covering scene safety, airway management, trauma, shock, STEMI systems, cardiac arrest, rapid transport, and prehospital critical thinking.";
  emtProfession.examOverview = [
    "EMS exams reward prioritization, rapid life-threat recognition, and protocol-driven emergency decision-making.",
    "Use scene size-up, primary assessment, airway management, shock recognition, and trauma triage together instead of memorizing isolated algorithms.",
    "Scenario-heavy prehospital review improves retention and field reasoning more than passive memorization alone.",
  ];
  emtProfession.features = [
    "Dedicated EMS lesson shard separated from generic allied-health filler.",
    "Mechanism-first trauma, cardiology, airway, and shock education.",
    "Prehospital transport-priority and scene-safety reasoning integrated into every lesson cluster.",
    "Shared EMS foundation supporting EMT, AEMT, paramedic, and critical-care transport expansion.",
  ];
  emtProfession.ctaLine =
    "Study airway, trauma, STEMI systems, shock, and EMS decision-making through the dedicated prehospital-care pathway.";
  emtProfession.premiumCtaHeadline = "Master prehospital assessment, airway management, trauma, and emergency response";
}

export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  "pharmacy-technician": pharmacyTechnicianCatalog,
  "medical-laboratory-technology": medicalLaboratoryTechnologyCatalog,
  "medical-imaging": medicalImagingCatalog,
  "emergency-medical-services": emergencyMedicalServicesCatalog,
};
