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
import occupationalTherapyCatalog from "@/content/pathway-lessons/allied-professions/occupational-therapy";

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
}

const ptaProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "pta");
if (ptaProfession) {
  ptaProfession.dedicatedCatalogFile = "physiotherapy-rehab";
}

const occupationalTherapyProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "occupational-therapy");
if (occupationalTherapyProfession) {
  occupationalTherapyProfession.dedicatedCatalogFile = "occupational-therapy";
  occupationalTherapyProfession.topicSlugsIn = [
    "ot-assessment",
    "ot-adl-iadl-intervention",
    "ot-cognition-perception",
    "ot-upper-extremity",
    "ot-psychosocial-pediatrics",
    "ot-ota-documentation-scope",
    "occupational-therapy",
    "activities-of-daily-living",
    "adaptive-equipment",
    "cognitive-rehabilitation",
    "sensory-processing",
  ];
  occupationalTherapyProfession.description =
    "Deep occupational therapy education covering ADLs, IADLs, cognition, sensory processing, upper-extremity rehabilitation, psychosocial OT, pediatrics, adaptive equipment, and occupation-based intervention.";
  occupationalTherapyProfession.examOverview = [
    "OT and OTA exams reward occupation-based reasoning, cognitive-perceptual safety, adaptive intervention planning, and client-centered rehabilitation.",
    "Use function, environment, routines, cognition, sensation, and participation together instead of memorizing isolated impairments.",
    "Scenario-based occupational-performance review improves retention and rehabilitation reasoning more than passive memorization alone.",
  ];
  occupationalTherapyProfession.features = [
    "Dedicated occupational-therapy lesson shard separated from generic rehab filler.",
    "Mechanism-first ADL/IADL, cognition, sensory, and occupation-based intervention education.",
    "Integrated psychosocial, pediatric, upper-extremity, and adaptive-equipment workflows.",
    "Shared OT foundation supporting future hand therapy, school OT, mental health OT, geriatrics, and home-modification expansion.",
  ];
  occupationalTherapyProfession.ctaLine =
    "Study ADLs, cognition, adaptive equipment, sensory processing, and occupation-based rehabilitation through the dedicated OT pathway.";
  occupationalTherapyProfession.premiumCtaHeadline = "Master occupation-based intervention, cognition, adaptive equipment, and functional rehabilitation";
}

const otaProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "ota");
if (otaProfession) {
  otaProfession.dedicatedCatalogFile = "occupational-therapy";
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
  "occupational-therapy": occupationalTherapyCatalog,
};
