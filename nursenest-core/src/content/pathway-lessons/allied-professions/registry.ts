import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";

type AlliedProfessionCatalogModule = {
  lessons?: unknown[];
};

/**
 * Attach the RT dedicated catalog without forcing a full rewrite of the large
 * profession registry. `ALLIED_PROFESSIONS` is an exported mutable array; this
 * preserves existing route metadata while enabling the optional shard merge in
 * `loadAlliedProfessionDedicatedLessonsForPathway()`.
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

/**
 * Static manifest for optional per-profession allied lesson shards.
 *
 * Keep this explicit so Turbopack never has to resolve an open-ended dynamic
 * import for `allied-professions/${file}` when no optional shards are present.
 */
export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
};
