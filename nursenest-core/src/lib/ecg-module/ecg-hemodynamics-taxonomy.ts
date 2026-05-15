/**
 * ECG Platform — Future Hemodynamics Expansion Taxonomy
 *
 * This file RESERVES the taxonomy, types, and route structure for the future
 * Hemodynamic Monitoring and ICU Waveform Analysis educational lanes.
 *
 * Architecture purpose:
 *   Preventing future naming conflicts, ensuring the Clinical Modules nav has
 *   typed placeholders, and allowing the hemodynamics lanes to be built without
 *   refactoring the navigation or sitemap from scratch.
 *
 * Current status: ALL entries are "reserved_future" — no routes are live.
 * Do NOT publish any hemodynamics route to the sitemap until the content is ready.
 *
 * Clinical scope (when built):
 *   - Hemodynamic Monitoring: arterial lines, CVP, pulse pressure, MAP
 *   - Advanced Hemodynamics: Swan-Ganz catheter, PCWP, SvO₂, CO/CI
 *   - Shock Physiology: distributive, obstructive, cardiogenic, hypovolemic
 *   - ICU Waveform Analysis: A-line waveform, damping, respiratory variation
 *   - Pulsus paradoxus: correctly classified as hemodynamic finding (not rhythm)
 *   - Tamponade physiology: clinical context for pulsus paradoxus + pericardial disease
 */

// ─── Hemodynamic waveform taxonomy ─────────────────────────────────────────────

/**
 * Categories of hemodynamic waveforms — the primary content axis.
 * Each category maps to a dedicated curriculum unit.
 */
export type HemodynamicWaveformCategory =
  | "arterial_line"           // A-line: systolic/diastolic/MAP, dicrotic notch
  | "central_venous_pressure" // CVP: a/c/v waves, RAP trends
  | "pulmonary_artery"        // PA catheter: PA systolic/diastolic, PCWP
  | "mixed_venous"            // SvO₂: oxygen delivery/consumption balance
  | "cardiac_output"          // CO/CI: thermodilution, indicator dilution
  | "pulse_pressure_variation" // PPV: respiratory variation in preload-responsive patients
  | "capnography_waveform"    // ETCO₂: ventilation-perfusion correlation
  | "ecg_hemodynamic_correlation"; // ECG changes correlated with hemodynamics

/**
 * Monitoring device classification — determines what clinical context applies.
 */
export type HemodynamicMonitoringDevice =
  | "arterial_line_radial"     // Radial artery — most common
  | "arterial_line_femoral"    // Femoral — larger vessel, trauma
  | "arterial_line_brachial"   // Brachial — intermediate
  | "central_venous_catheter"  // CVC: subclavian, IJ, femoral
  | "pulmonary_artery_catheter" // Swan-Ganz PAC
  | "cardiac_output_monitor"   // PiCCO, FloTrac, Vigileo
  | "pulse_ox_plethysmograph"  // Non-invasive surrogate (pulsus paradoxus assessment)
  | "bedside_ecg_correlate";   // ECG-hemodynamic correlation (12-lead + monitor)

/**
 * Invasive vs non-invasive classification — drives access restrictions.
 * Invasive monitoring content should require RN or higher (not student).
 */
export type HemodynamicInvasiveness =
  | "invasive"       // Requires arterial/venous catheter insertion
  | "non_invasive"   // BP cuff, SpO₂, ETCO₂
  | "minimally_invasive" // Esophageal Doppler, POCUS (operator-dependent)
  | "correlative";   // ECG + hemodynamic correlation (non-procedural)

/**
 * Hemodynamic competency domain.
 * Learner mastery is tracked per domain.
 */
export type HemodynamicCompetencyDomain =
  | "waveform_recognition"      // Identify normal vs abnormal waveform morphology
  | "troubleshooting"           // Damping, zeroing, positioning errors
  | "clinical_interpretation"   // Trending, intervention decisions
  | "shock_assessment"          // Classify shock type from hemodynamics
  | "fluid_responsiveness"      // PPV, PLR, clinical predictors
  | "advanced_monitoring";      // PAC, SvO₂, CO calculations

/**
 * Shock state classification — used for case-based hemodynamic teaching.
 */
export type ShockStateClassification =
  | "hypovolemic"    // Absolute volume loss (hemorrhage, GI loss, burns)
  | "distributive"   // Vasodilation (sepsis, anaphylaxis, neurogenic)
  | "cardiogenic"    // Pump failure (MI, HF, tamponade, PE-right heart)
  | "obstructive"    // Outflow obstruction (tamponade, tension PTX, PE)
  | "mixed";         // >1 mechanism (septic cardiomyopathy, trauma)

/**
 * Hemodynamic clinical context for case teaching.
 * Each case is tagged to enable targeted remediation.
 */
export type HemodynamicClinicalContext =
  | "icu_rn"                   // ICU bedside nurse competency
  | "ccu_rn"                   // CCU/cardiac critical care
  | "perioperative"            // OR/PACU hemodynamic management
  | "emergency"                // ED resuscitation, trauma
  | "np_advanced_practice"     // NP/CRNA advanced interpretation
  | "acls_integration";        // Hemodynamics in arrest/peri-arrest

// ─── Reserved route taxonomy ───────────────────────────────────────────────────

/**
 * Reserved routes for future hemodynamics lanes.
 *
 * STATUS: RESERVED — do not publish to sitemap or render.
 * These routes are typed here to prevent future naming conflicts and ensure
 * consistent URL architecture when the content is ready.
 *
 * Naming convention:
 *   Marketing/SEO: /hemodynamic-monitoring, /advanced-hemodynamics, etc.
 *   Learner modules: /modules/hemodynamics, /modules/advanced-hemodynamics
 */
export const HEMODYNAMICS_RESERVED_ROUTES = {
  // ── Marketing authority pages (will be indexed when live) ─────────────────
  marketing: [
    "/hemodynamic-monitoring",
    "/advanced-hemodynamics",
    "/arterial-line-waveforms",
    "/cvp-monitoring",
    "/pulmonary-artery-catheter",
    "/shock-hemodynamics",
    "/icu-monitoring",
  ] as const,

  // ── Learner module routes (noindex when live — auth-gated) ────────────────
  learner: [
    "/modules/hemodynamics",
    "/modules/hemodynamics/basics",
    "/modules/hemodynamics/advanced",
    "/modules/hemodynamics/cases",
    "/modules/advanced-hemodynamics",
    "/modules/icu-waveform-analysis",
  ] as const,

  // ── Advanced Hemodynamics sub-routes ──────────────────────────────────────
  advanced: [
    "/advanced-hemodynamics/arterial-line-interpretation",
    "/advanced-hemodynamics/cvp-waveform-analysis",
    "/advanced-hemodynamics/pulmonary-artery-catheter",
    "/advanced-hemodynamics/cardiac-output-monitoring",
    "/advanced-hemodynamics/shock-physiology",
    "/advanced-hemodynamics/fluid-responsiveness",
    "/advanced-hemodynamics/icu-waveform-cases",
  ] as const,
} as const;

// ─── Navigation group placeholders ─────────────────────────────────────────────

/**
 * Navigation entries reserved for future hemodynamics expansion.
 * These are the typed placeholders for Clinical Modules flyout entries.
 *
 * When hemodynamics content ships, import these into buildClinicalModulesNavLinks()
 * and change status from "coming_soon" to "available" or "premium".
 */
export type HemodynamicsNavEntry = {
  key: string;
  href: string;
  label: string;
  description: string;
  status: "coming_soon";
  group: "hemodynamics" | "invasive_monitoring" | "shock_states" | "arterial_waveforms";
};

export const HEMODYNAMICS_RESERVED_NAV_ENTRIES: ReadonlyArray<HemodynamicsNavEntry> = [
  {
    key: "hemodynamic-monitoring",
    href: "/app/study-tools",
    label: "Hemodynamic Monitoring",
    description: "Arterial lines, CVP, MAP trends, fluid responsiveness",
    status: "coming_soon",
    group: "hemodynamics",
  },
  {
    key: "advanced-hemodynamics",
    href: "/app/study-tools",
    label: "Advanced Hemodynamics",
    description: "Swan-Ganz catheter, PCWP, SvO₂, cardiac output calculations",
    status: "coming_soon",
    group: "hemodynamics",
  },
  {
    key: "arterial-waveforms",
    href: "/app/study-tools",
    label: "Arterial Waveform Analysis",
    description: "A-line interpretation, damping, pulse pressure variation, troubleshooting",
    status: "coming_soon",
    group: "arterial_waveforms",
  },
  {
    key: "shock-physiology",
    href: "/app/study-tools",
    label: "Shock Physiology",
    description: "Cardiogenic, distributive, obstructive, hypovolemic shock classification",
    status: "coming_soon",
    group: "shock_states",
  },
  {
    key: "icu-waveform-analysis",
    href: "/app/study-tools",
    label: "ICU Waveform Analysis",
    description: "CVP, PAC, SvO₂, capnography correlation — critical care ICU/CCU",
    status: "coming_soon",
    group: "invasive_monitoring",
  },
  {
    key: "critical-care-telemetry",
    href: "/app/study-tools",
    label: "Critical Care Telemetry",
    description: "ICU telemetry alarm management, post-op monitoring, multi-parameter trends",
    status: "coming_soon",
    group: "hemodynamics",
  },
] as const;

// ─── Curriculum unit type (future) ────────────────────────────────────────────

/**
 * Typed structure for a future hemodynamics curriculum unit.
 * Parallel to EcgCurriculumTopic but for hemodynamic monitoring content.
 */
export type HemodynamicsCurriculumUnit = {
  id: string;
  label: string;
  waveformCategory: HemodynamicWaveformCategory;
  monitoringDevice: HemodynamicMonitoringDevice;
  invasiveness: HemodynamicInvasiveness;
  competencyDomain: HemodynamicCompetencyDomain;
  shockStates?: ReadonlyArray<ShockStateClassification>;
  clinicalContext: HemodynamicClinicalContext;
  /** Whether pulsus paradoxus is relevant to this unit (hemodynamic finding, NOT rhythm). */
  involvesPulsusPardoxus: boolean;
  /** True when this unit has a direct ECG correlation teaching component. */
  hasEcgCorrelation: boolean;
  prerequisites: ReadonlyArray<string>;
  eligibleTiers: ReadonlyArray<string>;
  depth: "foundational" | "intermediate" | "advanced" | "mastery";
  clinicalReviewStatus: "reviewed" | "unreviewed" | "planned";
};

/**
 * The set of all reserved hemodynamics curriculum unit IDs.
 * Prevents future ID collisions with ECG curriculum IDs.
 * All prefixed "hd-" to distinguish from ECG "ped-" and standard units.
 */
export const HEMODYNAMICS_RESERVED_UNIT_IDS: ReadonlySet<string> = new Set([
  "hd-arterial-line-basics",
  "hd-arterial-waveform-analysis",
  "hd-arterial-line-troubleshooting",
  "hd-cvp-interpretation",
  "hd-cvp-waveform-analysis",
  "hd-pac-basics",
  "hd-pcwp-interpretation",
  "hd-mixed-venous-oxygen",
  "hd-cardiac-output-thermodilution",
  "hd-pulse-pressure-variation",
  "hd-shock-cardiogenic",
  "hd-shock-distributive",
  "hd-shock-obstructive",
  "hd-shock-hypovolemic",
  "hd-tamponade-physiology",
  "hd-pulsus-paradoxus-clinical",  // Pulsus paradoxus as hemodynamic finding
  "hd-fluid-responsiveness",
  "hd-icu-waveform-cases",
]);

// ─── Governance: pulsus paradoxus in hemodynamics lane ────────────────────────

/**
 * When the hemodynamics lane ships, pulsus paradoxus MUST appear in the
 * hemodynamics curriculum, NOT in the ECG rhythm bank.
 *
 * This object documents the governance bridge between the pediatric ECG
 * classification (where pulsus paradoxus is a hemodynamic finding in case
 * simulations) and the future hemodynamics curriculum (where it becomes a
 * first-class instructional unit).
 */
export const PULSUS_PARADOXUS_TAXONOMY_BRIDGE = {
  currentClassification: "hemodynamic_finding_in_case_simulation" as const,
  currentCurriculumLocation: "ecg-pediatric-case-simulations (case 2 and 6)" as const,
  futureClassification: "hemodynamics_curriculum_unit" as const,
  futureCurriculumUnit: "hd-pulsus-paradoxus-clinical" as const,
  canonicalDescription:
    "Pulsus paradoxus is an inspiratory decrease in systolic BP > 10 mmHg. " +
    "It is assessed by sphygmomanometry or pulse oximetry plethysmography. " +
    "It is a HEMODYNAMIC finding — NOT an ECG rhythm. " +
    "It must NOT appear as a rhythm tag in any ECG question database.",
  prohibitedRhythmTag: "Pulsus paradoxus" as const,
} as const;

// ─── Platform expansion readiness checklist ──────────────────────────────────

/**
 * Conditions that must be met before the hemodynamics lane can ship.
 * Used by admin readiness checks to prevent premature publication.
 */
export const HEMODYNAMICS_LAUNCH_PREREQUISITES = [
  "HEMODYNAMICS_CURRICULUM_AUTHORED",     // Minimum 6 curriculum units written
  "HEMODYNAMICS_CLINICAL_REVIEW_COMPLETE", // All units clinician-reviewed
  "HEMODYNAMICS_QUESTION_BANK_SEEDED",    // Minimum 40 questions seeded
  "HEMODYNAMICS_ENTITLEMENT_CONFIGURED",  // Stripe price + DB entitlement wired
  "HEMODYNAMICS_MARKETING_PAGES_LIVE",    // /hemodynamic-monitoring etc. published
  "HEMODYNAMICS_SITEMAP_UPDATED",         // Sitemap includes hemodynamics routes
  "HEMODYNAMICS_GOVERNANCE_TESTS_PASS",   // Contract tests green
] as const;
