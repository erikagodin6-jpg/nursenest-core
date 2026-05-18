import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import medicalLaboratoryTechnologyCatalog from "@/content/pathway-lessons/allied-professions/medical-laboratory-technology";
import medicalImagingCatalog from "@/content/pathway-lessons/allied-professions/medical-imaging";
import emergencyMedicalServicesCatalog from "@/content/pathway-lessons/allied-professions/emergency-medical-services";
import sonographyCatalog from "@/content/pathway-lessons/allied-professions/sonography";
import medicalAssistantCatalog from "@/content/pathway-lessons/allied-professions/medical-assistant";
import dentalHygieneCatalog from "@/content/pathway-lessons/allied-professions/dental-hygiene";

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
  dentalHygieneProfession.topicSlugsIn = [
    "dental-hygiene-periodontology",
    "dental-hygiene-instrumentation",
    "dental-radiography",
    "dental-hygiene-prevention",
    "dental-medical-emergencies",
    "dental-hygiene-ethics",
    "periodontal-therapy",
    "dental-hygiene-board-exam",
    "oral-health-prevention",
    "fluoride-and-sealants",
    "dental-scaling",
  ];
  dentalHygieneProfession.description =
    "Deep dental hygiene education covering periodontal assessment, instrumentation, radiography, prevention, fluoride, sealants, ethics, and dental-office emergency response.";
  dentalHygieneProfession.examOverview = [
    "Dental hygiene board exams reward periodontal reasoning, instrumentation safety, radiographic interpretation, prevention planning, and ethical decision-making.",
    "Use probing, attachment loss, calculus detection, caries risk, and radiographic patterns together instead of memorizing isolated facts.",
    "Scenario-based oral-health review improves retention and patient-care reasoning more than passive memorization alone.",
  ];
  dentalHygieneProfession.features = [
    "Dedicated dental hygiene lesson shard separated from generic dental-assistant filler.",
    "Mechanism-first periodontal, instrumentation, radiography, and prevention education.",
    "Integrated ethics, consent, emergency response, and patient-education workflows.",
    "Shared oral-health foundation supporting future local anesthesia, orthodontic, pediatric, and advanced periodontal expansion.",
  ];
  dentalHygieneProfession.ctaLine =
    "Study periodontal therapy, instrumentation, radiography, prevention, and oral-health workflows through the dedicated dental hygiene pathway.";
  dentalHygieneProfession.premiumCtaHeadline = "Master periodontal assessment, instrumentation, prevention, and oral-health care";
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
};
