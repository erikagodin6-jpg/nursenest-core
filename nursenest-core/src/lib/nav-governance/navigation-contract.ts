/**
 * Navigation Contract — Platform Governance Authority
 *
 * SINGLE SOURCE OF TRUTH for learner navigation architecture.
 *
 * Every learner-facing route MUST render through the canonical learner shell
 * at `src/app/(app)/app/(learner)/layout.tsx`. No exceptions except CAT exams
 * in focused mode and the explicitly registered module routes below.
 *
 * HOW TO READ THIS FILE
 * ─────────────────────
 * 1. SHELL_MODE defines what nav chrome is permitted for each route category.
 * 2. APPROVED_SUBSECTION_PATTERNS defines sub-navigation that may render
 *    INSIDE the learner shell (e.g. account sidebar, workstation chrome).
 * 3. APPROVED_MODULE_EXCEPTIONS lists routes that intentionally bypass the
 *    learner shell. Each exception requires a justification and owner.
 * 4. PROHIBITED_PATTERNS lists patterns that must never appear in learner routes.
 *
 * GOVERNANCE RULE
 * ───────────────
 * Adding a new exception to APPROVED_MODULE_EXCEPTIONS requires:
 *   1. Written justification (why the learner shell cannot be used)
 *   2. Design review from the platform team
 *   3. Comment with the tracking ticket
 *
 * The contract tests in tests/contracts/learner-shell-navigation.contract.test.ts
 * enforce this file. Violations break CI.
 */

// ─── Shell Mode Definitions ───────────────────────────────────────────────────

/**
 * The four permitted navigation states for learner routes.
 * Ordered from most chrome to least chrome.
 */
export const SHELL_MODES = {
  /**
   * FULL — Complete learner navigation rendered.
   * Includes: brand link, pathway pill, study nav row, mobile bottom nav.
   * Required for: all standard learner pages.
   */
  FULL: "full",

  /**
   * ACCOUNT — Full nav + account-specific sidebar and section header.
   * The learner shell is fully present; account adds an inner layout layer.
   * Required for: /app/account/* routes.
   */
  ACCOUNT: "account",

  /**
   * WORKSTATION — Full nav + module workstation chrome (sidebar, tool panels).
   * The learner shell is fully present; workstation adds inner chrome.
   * Required for: labs, med-calculations, clinical-skills (within learner shell).
   */
  WORKSTATION: "workstation",

  /**
   * EXAM_FOCUSED — Minimal chrome only (back button + timer).
   * Global navigation is suppressed via LearnerExamChromeGate.
   * ONLY approved for: active CAT/practice exam sessions.
   * Gate: isFocusedPracticeTestSessionPath()
   */
  EXAM_FOCUSED: "exam-focused",
} as const;

export type ShellMode = (typeof SHELL_MODES)[keyof typeof SHELL_MODES];

// ─── Route Registry ───────────────────────────────────────────────────────────

/**
 * Canonical registry of all learner route categories and their required shell mode.
 * This is the authoritative list — if a route is not here, it must use FULL mode.
 */
export const LEARNER_ROUTE_REGISTRY: ReadonlyArray<{
  /** Human-readable route category name. */
  readonly label: string;
  /** Path prefix (relative to /app). */
  readonly prefix: string;
  /** Required shell mode. */
  readonly mode: ShellMode;
  /** Whether this route category is explicitly registered. */
  readonly registered: true;
}> = [
  // ── Core study surfaces ────────────────────────────────────────────────
  { label: "Dashboard",         prefix: "/app",                  mode: SHELL_MODES.FULL,         registered: true },
  { label: "Lessons Hub",       prefix: "/app/lessons",          mode: SHELL_MODES.FULL,         registered: true },
  { label: "Flashcards Hub",    prefix: "/app/flashcards",       mode: SHELL_MODES.FULL,         registered: true },
  { label: "Practice Tests Hub",prefix: "/app/practice-tests",   mode: SHELL_MODES.FULL,         registered: true },
  { label: "Questions",         prefix: "/app/questions",        mode: SHELL_MODES.FULL,         registered: true },
  { label: "Study Tools",       prefix: "/app/study-tools",      mode: SHELL_MODES.FULL,         registered: true },

  // ── Exam sessions (suppressed chrome — approved exception) ─────────────
  { label: "Practice Exam Session", prefix: "/app/practice-tests/",   mode: SHELL_MODES.EXAM_FOCUSED,  registered: true },
  { label: "Exams Surface",     prefix: "/app/exams",            mode: SHELL_MODES.FULL,         registered: true },
  { label: "CAT Exam",          prefix: "/app/cat",              mode: SHELL_MODES.EXAM_FOCUSED, registered: true },

  // ── Clinical module workstations (within learner shell) ────────────────
  { label: "Labs",              prefix: "/app/labs",             mode: SHELL_MODES.WORKSTATION,  registered: true },
  { label: "Med Calculations",  prefix: "/app/med-calculations", mode: SHELL_MODES.WORKSTATION,  registered: true },
  { label: "Clinical Skills",   prefix: "/app/clinical-skills",  mode: SHELL_MODES.WORKSTATION,  registered: true },
  { label: "Pharmacology",      prefix: "/app/pharmacology",     mode: SHELL_MODES.FULL,         registered: true },

  // ── ECG / telemetry (within learner shell) ─────────────────────────────
  { label: "ECG Video Quiz",    prefix: "/app/ecg-video-quiz",   mode: SHELL_MODES.WORKSTATION,  registered: true },

  // ── Simulation surfaces ────────────────────────────────────────────────
  { label: "Physiology Monitor",   prefix: "/app/physiology-monitor",   mode: SHELL_MODES.FULL, registered: true },
  { label: "Simulation Center",    prefix: "/app/simulation-center",    mode: SHELL_MODES.FULL, registered: true },
  { label: "Clinical Scenarios",   prefix: "/app/clinical-scenarios",   mode: SHELL_MODES.WORKSTATION, registered: true },
  { label: "OSCE",                 prefix: "/app/osce",                  mode: SHELL_MODES.FULL, registered: true },
  { label: "Cases",                prefix: "/app/cases",                 mode: SHELL_MODES.FULL, registered: true },

  // ── Account / settings ─────────────────────────────────────────────────
  { label: "Account",           prefix: "/app/account",          mode: SHELL_MODES.ACCOUNT,      registered: true },
  { label: "Profile",           prefix: "/app/profile",          mode: SHELL_MODES.FULL,         registered: true },
  { label: "Onboarding",        prefix: "/app/onboarding",       mode: SHELL_MODES.FULL,         registered: true },

  // ── Learning supports ──────────────────────────────────────────────────
  { label: "Coach",             prefix: "/app/coach",            mode: SHELL_MODES.FULL,         registered: true },
  { label: "Explore",           prefix: "/app/explore",          mode: SHELL_MODES.FULL,         registered: true },
  { label: "Guided",            prefix: "/app/guided",           mode: SHELL_MODES.FULL,         registered: true },
  { label: "Exam Plan",         prefix: "/app/exam-plan",        mode: SHELL_MODES.FULL,         registered: true },
  { label: "Study Plan",        prefix: "/app/study-plan",       mode: SHELL_MODES.FULL,         registered: true },

  // ── Content pathways ───────────────────────────────────────────────────
  { label: "NP Pathway",        prefix: "/app/np",               mode: SHELL_MODES.FULL,         registered: true },
  { label: "Printables",        prefix: "/app/printables",       mode: SHELL_MODES.FULL,         registered: true },
  { label: "Baseline Assessment",prefix: "/app/baseline-assessment", mode: SHELL_MODES.FULL,     registered: true },
] as const;

// ─── Approved Subsection Patterns ─────────────────────────────────────────────

/**
 * Sub-navigation patterns that are PERMITTED inside the learner shell.
 * These add inner chrome without replacing the global nav.
 */
export const APPROVED_SUBSECTION_PATTERNS = [
  {
    name: "Account Section Nav",
    components: ["LearnerAccountNav", "LearnerAccountShellHeader"],
    allowedIn: ["/app/account"],
    justification: "Account settings require a contextual sidebar. The global learner nav remains fully rendered above it.",
  },
  {
    name: "Exam Session Chrome",
    components: ["ExamSessionShell", "NclexExamLayout", "LearnerExamChromeGate"],
    allowedIn: ["/app/practice-tests/", "/app/exams/", "/app/cat/"],
    justification: "Exam sessions suppress global nav for focus via LearnerExamChromeGate. The shell still renders; chrome is conditionally hidden by the gate.",
  },
  {
    name: "Workstation Chrome",
    components: ["LabsWorkstationShell", "MedCalcWorkstationShell", "ClinicalSkillsWorkstationShell", "EcgWorkstationShell", "LearningModuleShell"],
    allowedIn: ["/app/labs", "/app/med-calculations", "/app/clinical-skills", "/app/ecg-video-quiz", "/app/clinical-scenarios"],
    justification: "Workstation modules add a sidebar and main area within the learner shell content area. The global nav is unchanged.",
  },
] as const;

// ─── Approved Module Exceptions ────────────────────────────────────────────────

/**
 * Routes that intentionally bypass the canonical learner shell.
 *
 * THESE ARE THE ONLY APPROVED EXCEPTIONS.
 * No new exceptions may be added without platform team review.
 *
 * STATUS: These module routes are LEGACY — they predate the learner shell
 * architecture. The long-term plan is to migrate them into the learner shell.
 * See: docs/navigation-governance-standard.md — "Migration Roadmap"
 */
export const APPROVED_MODULE_EXCEPTIONS: ReadonlyArray<{
  readonly routePrefix: string;
  readonly label: string;
  readonly shellComponent: string;
  readonly justification: string;
  readonly migrationStatus: "pending" | "in-progress" | "deferred";
  readonly migrationTicket?: string;
}> = [
  {
    routePrefix: "/app/modules/ecg",
    label: "ECG Module",
    shellComponent: "PremiumEducationalModuleShell",
    justification: "Legacy ECG module predates learner shell. Uses focused workstation chrome (brand + back button only). No learner pathway context needed for deep ECG drill sessions.",
    migrationStatus: "pending",
  },
  {
    routePrefix: "/app/modules/ecg-advanced",
    label: "Advanced ECG Module",
    shellComponent: "AdvancedEcgModuleShell",
    justification: "Same as ECG Module — legacy workstation chrome.",
    migrationStatus: "pending",
  },
  {
    routePrefix: "/app/modules/ecg-interpretation",
    label: "ECG Interpretation Module",
    shellComponent: "PremiumEducationalModuleShell",
    justification: "Same as ECG Module — legacy workstation chrome.",
    migrationStatus: "pending",
  },
  {
    routePrefix: "/app/modules/hemodynamics",
    label: "Hemodynamics Module",
    shellComponent: "PremiumLayoutVersionMarker (minimal)",
    justification: "Legacy hemodynamics module — renders without full workstation chrome.",
    migrationStatus: "pending",
  },
  {
    routePrefix: "/app/modules/hemodynamics-advanced",
    label: "Advanced Hemodynamics Module",
    shellComponent: "PremiumLayoutVersionMarker (minimal)",
    justification: "Same as Hemodynamics Module.",
    migrationStatus: "pending",
  },
  {
    routePrefix: "/app/modules/lab-values",
    label: "Lab Values Module",
    shellComponent: "PremiumEducationalModuleShell",
    justification: "Legacy lab values reference module — focused reference tool without pathway context.",
    migrationStatus: "pending",
  },
  {
    routePrefix: "/app/modules/labs-advanced",
    label: "Advanced Labs Module",
    shellComponent: "PremiumLayoutVersionMarker (minimal)",
    justification: "Same as Lab Values Module.",
    migrationStatus: "pending",
  },
  {
    routePrefix: "/app/modules/rt-ventilator",
    label: "RT Ventilator Module",
    shellComponent: "PremiumEducationalModuleShell",
    justification: "Legacy RT ventilator module — specialized workstation requiring full-screen layout.",
    migrationStatus: "pending",
  },
] as const;

// ─── Prohibited Patterns ──────────────────────────────────────────────────────

/**
 * Patterns that must NEVER appear in learner route layouts.
 * If a layout imports any of these for navigation purposes, it is a violation.
 */
export const PROHIBITED_NAVIGATION_PATTERNS = [
  {
    pattern: "custom-learner-header",
    description: "A custom header component duplicating learner shell header functionality.",
    severity: "critical" as const,
  },
  {
    pattern: "module-specific-nav-bar",
    description: "A nav bar specific to one module that duplicates the global study navigation.",
    severity: "critical" as const,
  },
  {
    pattern: "new PremiumEducationalModuleShell", // new usages, not the approved ones
    description: "New usage of PremiumEducationalModuleShell outside of APPROVED_MODULE_EXCEPTIONS.",
    severity: "critical" as const,
  },
] as const;

// ─── Approved Exception Lookup ────────────────────────────────────────────────

export const APPROVED_EXCEPTION_PREFIXES = new Set(
  APPROVED_MODULE_EXCEPTIONS.map((e) => e.routePrefix),
);

export function isApprovedModuleException(routePath: string): boolean {
  for (const prefix of APPROVED_EXCEPTION_PREFIXES) {
    if (routePath === prefix || routePath.startsWith(prefix + "/")) return true;
  }
  return false;
}

export function getApprovedExceptionForRoute(routePath: string) {
  return APPROVED_MODULE_EXCEPTIONS.find(
    (e) => routePath === e.routePrefix || routePath.startsWith(e.routePrefix + "/"),
  ) ?? null;
}

// ─── Contract Version ─────────────────────────────────────────────────────────

/**
 * Increment this when the contract changes.
 * Contract tests pin to this version — a mismatch means the tests need updating.
 */
export const NAVIGATION_CONTRACT_VERSION = "1.0.0" as const;
export const CANONICAL_LEARNER_SHELL_PATH = "src/app/(app)/app/(learner)/layout.tsx" as const;
export const CANONICAL_NAV_COMPONENT_PATH = "src/components/layout/learner-shell-primary-nav.tsx" as const;
