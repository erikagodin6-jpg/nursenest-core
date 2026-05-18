import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import medicalLaboratoryTechnologyCatalog from "@/content/pathway-lessons/allied-professions/medical-laboratory-technology";
import medicalImagingCatalog from "@/content/pathway-lessons/allied-professions/medical-imaging";
import emergencyMedicalServicesCatalog from "@/content/pathway-lessons/allied-professions/emergency-medical-services";
import sonographyCatalog from "@/content/pathway-lessons/allied-professions/sonography";

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
  sonographyProfession.topicSlugsIn = [
    "sonography-physics",
    "abdominal-sonography",
    "ob-gyn-sonography",
    "vascular-sonography",
    "small-parts-sonography",
    "sonography-patient-care",
    "doppler-ultrasound",
    "ultrasound-physics",
    "fetal-ultrasound",
    "echogenicity",
    "probe-selection",
  ];
  sonographyProfession.description =
    "Deep sonography education covering ultrasound physics, Doppler, OB/GYN imaging, abdominal ultrasound, vascular scanning, artifacts, probe selection, and patient care.";
  sonographyProfession.examOverview = [
    "Sonography exams reward image optimization, anatomy recognition, Doppler reasoning, pathology pattern recognition, and role-safe communication.",
    "Use probe selection, artifacts, vascular flow analysis, and anatomy together instead of memorizing isolated screenshots.",
    "Scenario-heavy scanning review improves retention and clinical reasoning more than passive image memorization alone.",
  ];
  sonographyProfession.features = [
    "Dedicated sonography lesson shard separated from generic imaging filler.",
    "Mechanism-first ultrasound physics, Doppler, and pathology education.",
    "Integrated OB/GYN, vascular, abdominal, and small-parts scanning workflows.",
    "Shared ultrasound foundation supporting future cardiac, MSK, and advanced specialty ultrasound expansion.",
  ];
  sonographyProfession.ctaLine =
    "Study ultrasound physics, Doppler, OB/GYN, abdominal, and vascular sonography through the dedicated ultrasound pathway.";
  sonographyProfession.premiumCtaHeadline = "Master ultrasound physics, Doppler, pathology recognition, and scanning workflow";
}

export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  "pharmacy-technician": pharmacyTechnicianCatalog,
  "medical-laboratory-technology": medicalLaboratoryTechnologyCatalog,
  "medical-imaging": medicalImagingCatalog,
  "emergency-medical-services": emergencyMedicalServicesCatalog,
  sonography: sonographyCatalog,
};
