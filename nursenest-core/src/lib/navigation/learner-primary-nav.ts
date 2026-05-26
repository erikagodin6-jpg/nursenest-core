/**
 * Canonical learner primary nav — one list for marketing header + `/app` learner shell.
 */

import { appPathwayCatSessionStartPath, resolveStudySurfaceCatHref } from "@/lib/exam-pathways/pathway-cat-flow";
import type { LearnerExamsSurfaceLabel } from "@/lib/testing/testing-model-types";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";
import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import { isStudyToolsPubliclyEnabled } from "@/lib/study-tools/study-tools-feature-flag";

export const CANONICAL_LEARNER_ROUTES = {
  lessons: "/app/lessons",
  practice: "/app/practice-tests",
  flashcards: "/app/flashcards",
  /** Gated by server + public nav flag; route 404s when the learner store is off. */
  printables: "/app/printables",
  osce: SCENARIO_LEARNER_ROUTES.osce,
  clinicalScenarios: SCENARIO_LEARNER_ROUTES.clinicalScenarios,
  /** CAT adaptive entry */
  cat: "/app/practice-tests/start",
  catBuilder: "/app/practice-tests",
  reports: "/app/account/progress",
  profile: "/app/profile",
} as const;

export type LearnerPrimaryNavItem = {
  key: "lessons" | "practice" | "flashcards" | "cat" | "reports" | "profile";
  href: string;
  matchBase: string;
  labelKey: string;
};

/**
 * Exactly one learner nav item is visually “primary” (subtle emphasis in header + shell).
 * Aligned with public marketing flow: Learn → **Practice** → Track.
 */
export const LEARNER_PRIMARY_NAV_ITEM_KEY = "practice" as const satisfies Extract<
  LearnerPrimaryNavItem["key"],
  "lessons" | "practice"
>;

/** Appended after flashcards when {@link isStudyToolsPubliclyEnabled} is true. */
export const STUDY_TOOLS_SHELL_NAV_ID = "study_tools" as const;

/** Appended when {@link isOsceScenariosPubliclyEnabled} is true (nursing OSCE). */
export const OSCE_SHELL_NAV_ID = "osce" as const;
/** Appended when {@link isClinicalScenariosPubliclyEnabled} is true (nursing clinical scenarios). */
export const CLINICAL_SCENARIOS_SHELL_NAV_ID = "clinical_scenarios" as const;

/** Shown only when {@link isPrintableStorePublicNavEnabled} is true (passed from learner layout). */
export const PRINTOUTS_SHELL_NAV_ID = "printouts" as const;

/** Dedicated ECG nav item — shown for RN/NP learners only, never for RPN/LVN_LPN. */
export const ECG_SHELL_NAV_ID = "ecg" as const;

export type LearnerShellStudyNavRowId =
  | LearnerPrimaryNavItem["key"]
  | typeof STUDY_TOOLS_SHELL_NAV_ID
  | typeof PRINTOUTS_SHELL_NAV_ID
  | typeof OSCE_SHELL_NAV_ID
  | typeof CLINICAL_SCENARIOS_SHELL_NAV_ID
  | typeof CLINICAL_MODULES_SHELL_NAV_ID
  | typeof ECG_SHELL_NAV_ID;

/** Whether this nav row is the designated primary study entry (visual emphasis in header + shell). */
export function isLearnerPrimaryNavKey(key: LearnerShellStudyNavRowId | string): boolean {
  return key === LEARNER_PRIMARY_NAV_ITEM_KEY;
}

function withPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId) return base;
  const q = `pathwayId=${encodeURIComponent(pathwayId)}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}

export type { LearnerExamsSurfaceLabel } from "@/lib/testing/testing-model-types";

function resolveLearnerExamsNavHref(
  pathwayId: string | null | undefined,
  examsLabel?: LearnerExamsSurfaceLabel,
): string {
  if (examsLabel === "LOFT Simulation") {
    return "/app/cases/cnple";
  }
  if (examsLabel === "CAT Exams" && pathwayId?.trim()) {
    return appPathwayCatSessionStartPath(pathwayId.trim());
  }
  return "/app/practice-tests?startMode=practice_exam";
}

/**
 * Ordered: Lessons → Practice → Flashcards → CAT → Reports → Profile (max 6).
 * @param examsLabel — label + destination; LOFT pathways route to CNPLE case simulation.
 */
export function buildLearnerPrimaryNavItems(
  pathwayId: string | null,
  options?: { examsLabel?: LearnerExamsSurfaceLabel },
): Omit<LearnerPrimaryNavItem, "labelKey">[] {
  const lessonsHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.lessons, pathwayId);
  const practiceHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.practice, pathwayId);
  const flashHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.flashcards, pathwayId);
  const examsLabel = options?.examsLabel;
  const catHref =
    examsLabel === "LOFT Simulation"
      ? resolveLearnerExamsNavHref(pathwayId, examsLabel)
      : examsLabel === "Exams"
        ? withPathwayQuery("/app/practice-tests?startMode=practice_exam", pathwayId)
        : resolveStudySurfaceCatHref({
            pathwayId,
            availablePathwayIds: pathwayId ? [pathwayId] : [],
          });
  const catMatch = examsLabel === "LOFT Simulation" ? "/app/cases/cnple" : "/app/practice-tests";

  return [
    { key: "lessons", href: lessonsHref, matchBase: "/app/lessons" },
    { key: "practice", href: practiceHref, matchBase: "/app/practice-tests" },
    { key: "flashcards", href: flashHref, matchBase: "/app/flashcards" },
    { key: "reports", href: CANONICAL_LEARNER_ROUTES.reports, matchBase: "/app/account/progress" },
    { key: "profile", href: CANONICAL_LEARNER_ROUTES.profile, matchBase: "/app/profile" },
  ];
}

const LABEL_KEYS: Record<LearnerPrimaryNavItem["key"], string> = {
  lessons: "learner.shell.nav.lessons",
  practice: "learner.shell.nav.practice",
  flashcards: "learner.shell.nav.flashcards",
  cat: "learner.shell.nav.cat",
  reports: "learner.shell.nav.progress",
  profile: "nav.account",
};

export function learnerPrimaryNavLabelKey(key: LearnerPrimaryNavItem["key"]): string {
  return LABEL_KEYS[key];
}

export function buildOptionalStudyToolsShellNavItem(pathwayId: string | null): {
  id: typeof STUDY_TOOLS_SHELL_NAV_ID;
  href: string;
  matchPrefix: string;
  labelKey: string;
} | null {
  if (!isStudyToolsPubliclyEnabled()) return null;
  return {
    id: STUDY_TOOLS_SHELL_NAV_ID,
    href: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.hub, pathwayId),
    matchPrefix: "/app/study-tools",
    labelKey: "learner.shell.nav.studyTools",
  };
}

export function buildOptionalOsceScenarioShellNavItems(pathwayId: string | null): Array<{
  id: typeof OSCE_SHELL_NAV_ID;
  href: string;
  matchPrefix: string;
  labelKey: string;
}> {
  if (!isOsceScenariosPubliclyEnabled()) return [];
  return [
    {
      id: OSCE_SHELL_NAV_ID,
      href: withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.osce, pathwayId),
      matchPrefix: "/app/osce",
      labelKey: "learner.shell.nav.osce",
    },
  ];
}

export function buildOptionalClinicalScenariosShellNavItem(pathwayId: string | null): {
  id: typeof CLINICAL_SCENARIOS_SHELL_NAV_ID;
  href: string;
  matchPrefix: string;
  labelKey: string;
} | null {
  if (!isClinicalScenariosPubliclyEnabled()) return null;
  return {
    id: CLINICAL_SCENARIOS_SHELL_NAV_ID,
    href: withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, pathwayId),
    matchPrefix: "/app/clinical-scenarios",
    labelKey: "learner.shell.nav.clinicalScenarios",
  };
}

// ─── Clinical Modules flyout ───────────────────────────────────────────────

/** Nav section ID for the Clinical Modules flyout. */
export const CLINICAL_MODULES_SHELL_NAV_ID = "clinical_modules" as const;

/**
 * Availability state for a Clinical Modules nav link.
 *   "available"   — fully accessible to entitled learners
 *   "premium"     — requires a paid add-on (Advanced ECG, etc.)
 *   "new"         — recently launched, surface with a "New" badge
 *   "coming_soon" — not yet live; render non-interactively
 *   "locked"      — exists but gated by tier (not the same as premium add-on)
 */
export type ClinicalModulesLinkStatus =
  | "available"
  | "premium"
  | "new"
  | "coming_soon"
  | "locked";

/**
 * Taxonomy group for grouping links in multi-column flyout layouts.
 * Extend as the platform grows.
 */
/**
 * Taxonomy group for grouping links in multi-column flyout layouts.
 *
 * Groups added for future hemodynamics expansion:
 *   "hemodynamics"          — Arterial lines, CVP, cardiac output
 *   "invasive_monitoring"   — Swan-Ganz, PCWP, SvO₂, PAC
 *   "shock_states"          — Shock physiology classification
 *   "arterial_waveforms"    — A-line waveform analysis
 *
 * Reserved groups must not be used for non-hemodynamics links.
 * When hemodynamics content ships, import HEMODYNAMICS_RESERVED_NAV_ENTRIES
 * from ecg-hemodynamics-taxonomy.ts and add them here.
 */
export type ClinicalModulesLinkGroup =
  | "cardiology"
  | "diagnostics"
  | "calculations"
  | "critical_care"
  | "pharmacology"
  | "telemetry"
  // ── Reserved: Hemodynamics expansion ────────────────────────────────────────
  | "hemodynamics"          // Arterial lines, CVP, MAP, fluid responsiveness
  | "invasive_monitoring"   // Swan-Ganz, PCWP, SvO₂, PAC
  | "shock_states"          // Cardiogenic/distributive/obstructive/hypovolemic
  | "arterial_waveforms";   // A-line waveform interpretation

/** A link within the Clinical Modules flyout dropdown. */
export type ClinicalModulesNavLink = {
  key: string;
  /** Learner-scoped destination inside /app/* or /modules/*. Never a marketing URL. */
  href: string;
  label: string;
  description: string;
  /** Availability state — drives badge rendering and interactivity. */
  status: ClinicalModulesLinkStatus;
  /** Taxonomy group for future grouped/columnar flyout rendering. */
  group: ClinicalModulesLinkGroup;
  /** Optional sub-grouping within a group. */
  subgroup?: string;
};

/** Derived convenience — true when the link should not be interactive. */
export function isClinicalModuleLinkDisabled(link: ClinicalModulesNavLink): boolean {
  return link.status === "coming_soon" || link.status === "locked";
}

/**
 * Returns the ordered list of Clinical Modules links for the flyout dropdown.
 * All hrefs are learner-scoped (/app/* or /modules/*) — never marketing URLs.
 * Grouped for future two-column rendering.
 *
 * @param ecgNavEnabled - When false (RPN/LVN_LPN), ECG and telemetry items are excluded.
 */
export function buildClinicalModulesNavLinks(pathwayId: string | null, ecgNavEnabled = true): ClinicalModulesNavLink[] {
  const ecgLinks: ClinicalModulesNavLink[] = ecgNavEnabled
    ? [
        // ── Cardiology / ECG ──
        {
          key: "ecg-fundamentals",
          href: withPathwayQuery("/modules/ecg/basic/lessons", pathwayId),
          label: "ECG Fundamentals",
          description: "Rhythm recognition, AV blocks, strip interpretation",
          status: "available",
          group: "cardiology",
        },
        {
          key: "advanced-ecg",
          href: withPathwayQuery("/modules/ecg-advanced", pathwayId),
          label: "Advanced ECG",
          description: "STEMI, electrolytes, telemetry mastery, ICU ECG",
          status: "premium",
          group: "cardiology",
        },
        {
          key: "ecg-drills",
          href: withPathwayQuery("/modules/ecg/basic/quizzes", pathwayId),
          label: "ECG Practice Drills",
          description: "Adaptive rhythm identification drills",
          status: "available",
          group: "cardiology",
        },
        {
          key: "pediatric-ecg",
          href: withPathwayQuery("/modules/ecg/pediatric", pathwayId),
          label: "Pediatric ECG",
          description: "PALS rhythms, SVT in infants, LQTS, post-op congenital heart",
          status: "new",
          group: "cardiology",
        },
        // ── Telemetry ──
        {
          key: "telemetry-mastery",
          href: withPathwayQuery("/modules/ecg-advanced", pathwayId),
          label: "Telemetry Mastery",
          description: "Alarm management, lead selection, ST monitoring",
          status: "premium",
          group: "telemetry",
        },
        // ── Hemodynamics ──
        {
          key: "hemodynamics-fundamentals",
          href: withPathwayQuery("/modules/hemodynamics", pathwayId),
          label: "Hemodynamic Monitoring",
          description: "Perfusion, MAP, preload, afterload, shock states",
          status: "available",
          group: "hemodynamics",
        },
        {
          key: "advanced-hemodynamics",
          href: withPathwayQuery("/modules/hemodynamics-advanced", pathwayId),
          label: "Advanced Hemodynamics",
          description: "Swan-Ganz, cardiac index, SVR, PAOP, vasopressor reasoning",
          status: "premium",
          group: "hemodynamics",
        },
      ]
    : [];

  return [
    ...ecgLinks,
    // ── Diagnostics ──
    {
      key: "lab-values",
      href: "/app/study-tools/labs",
      label: "Lab Values",
      description: "Critical lab interpretation and clinical correlation",
      status: "available",
      group: "diagnostics",
    },
    {
      key: "abg-interpretation",
      href: "/app/study-tools/labs",
      label: "ABG Interpretation",
      description: "Acid-base, respiratory vs metabolic disorders",
      status: "coming_soon",
      group: "diagnostics",
    },
    // ── Calculations ──
    {
      key: "med-calculations",
      href: withPathwayQuery("/app/med-calculations", pathwayId),
      label: "Medication Calculations",
      description: "IV drip, weight-based dosing, unit conversions",
      status: "available",
      group: "calculations",
    },
    // ── Hemodynamics (reserved — content in development) ──
    // When hemodynamics content ships, import HEMODYNAMICS_RESERVED_NAV_ENTRIES
    // from ecg-hemodynamics-taxonomy.ts and replace these entries.
    {
      key: "hemodynamics",
      href: "/app/study-tools",
      label: "Hemodynamic Monitoring",
      description: "Arterial lines, CVP, cardiac output interpretation",
      status: "coming_soon",
      group: "hemodynamics",
    },
    {
      key: "advanced-hemodynamics",
      href: "/app/study-tools",
      label: "Advanced Hemodynamics",
      description: "Swan-Ganz catheter, PCWP, SvO₂, shock physiology",
      status: "coming_soon",
      group: "hemodynamics",
    },
    {
      key: "icu-waveform-analysis",
      href: "/app/study-tools",
      label: "ICU Waveform Analysis",
      description: "Arterial waveform, respiratory variation, critical care telemetry",
      status: "coming_soon",
      group: "invasive_monitoring",
    },
  ];
}

/**
 * Clinical Modules nav item for the learner shell. Always shown for RN/NP
 * pathways; modules within are individually gated by entitlement.
 *
 * @param ecgNavEnabled - When false (RPN/LVN_LPN), ECG items are excluded from the flyout.
 */
export function buildClinicalModulesShellNavItem(pathwayId: string | null, ecgNavEnabled = true): {
  id: typeof CLINICAL_MODULES_SHELL_NAV_ID;
  href: string;
  matchPrefix: string;
  labelKey: string;
  links: ClinicalModulesNavLink[];
} {
  return {
    id: CLINICAL_MODULES_SHELL_NAV_ID,
    href: "/app/study-tools",
    matchPrefix: "/modules",
    labelKey: "learner.shell.nav.clinicalModules",
    links: buildClinicalModulesNavLinks(pathwayId, ecgNavEnabled),
  };
}

/**
 * Dedicated ECG nav item for the learner shell.
 * Only rendered when `ecgNavEnabled` is true (RN/NP tiers only).
 * Points to the core ECG module hub inside the learner module shell.
 */
export function buildEcgShellNavItem(pathwayId: string | null): {
  id: typeof ECG_SHELL_NAV_ID;
  href: string;
  matchPrefix: string;
  labelKey: string;
} {
  return {
    id: ECG_SHELL_NAV_ID,
    href: withPathwayQuery("/modules/ecg", pathwayId),
    matchPrefix: "/modules/ecg",
    labelKey: "learner.shell.nav.ecg",
  };
}

// ─── Printables ────────────────────────────────────────────────────────────

/**
 * When `navVisible` is true (typically from `isPrintableStorePublicNavEnabled()` in the learner layout),
 * both server and public printable flags are on — keep in sync with `printable-store-flags.ts`.
 */
export function buildOptionalPrintablesShellNavItem(
  pathwayId: string | null,
  navVisible: boolean,
): {
  id: typeof PRINTOUTS_SHELL_NAV_ID;
  href: string;
  matchPrefix: string;
  labelKey: string;
} | null {
  if (!navVisible) return null;
  return {
    id: PRINTOUTS_SHELL_NAV_ID,
    href: withPathwayQuery(CANONICAL_LEARNER_ROUTES.printables, pathwayId),
    matchPrefix: "/app/printables",
    labelKey: "learner.shell.nav.printouts",
  };
}
