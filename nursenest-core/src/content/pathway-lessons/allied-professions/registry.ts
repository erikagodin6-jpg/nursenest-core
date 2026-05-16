import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import paramedicCatalog from "@/content/pathway-lessons/allied-professions/paramedic";

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

const paramedicProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "paramedic");
if (paramedicProfession) {
  paramedicProfession.dedicatedCatalogFile = "paramedic";
  paramedicProfession.topicSlugsIn = [
    "scene-size-up",
    "patient-assessment",
    "airway-management",
    "shock-recognition",
    "cardiac-emergencies",
    "prehospital-ecg",
    "neurologic-emergencies",
    "trauma-care",
    "pediatric-emergencies",
    "ob-neonatal-emergencies",
    "toxicology-overdose",
    "ems-documentation",
  ];
  paramedicProfession.description =
    "Deep paramedic and EMS education covering field assessment, airway management, STEMI recognition, trauma, shock, pediatrics, toxicology, scene safety, and protocol-first prehospital reasoning.";
  paramedicProfession.examOverview = [
    "Paramedic exams reward rapid scene judgment, airway and perfusion priorities, and protocol-safe escalation under pressure.",
    "High-yield EMS preparation connects ECG findings, shock patterns, trauma priorities, destination decisions, and reassessment instead of isolated memorization.",
    "Scenario-based repetition and timed field-style reasoning outperform passive reading for EMS certification preparation.",
  ];
  paramedicProfession.features = [
    "Dedicated EMS lesson shard with mechanism-first prehospital reasoning.",
    "Paramedic-specific airway, trauma, shock, ECG, stroke, toxicology, and pediatric content.",
    "Scenario-heavy field cases with pre/post testing and protocol-aware rationales.",
    "Profession-scoped allied lessons without RN-only inpatient leakage.",
  ];
  paramedicProfession.ctaLine =
    "Train scene management, airway, ECG, trauma, and prehospital decision-making through the dedicated EMS pathway.";
  paramedicProfession.premiumCtaHeadline =
    "Master prehospital assessment, airway management, trauma, ECG, and EMS field judgment";
}

export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  paramedic: paramedicCatalog,
};
