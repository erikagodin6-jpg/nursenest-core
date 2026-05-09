/**
 * Canonical learner primary nav — one list for marketing header + `/app` learner shell.
 */

import { resolveStudySurfaceCatHref } from "@/lib/exam-pathways/pathway-cat-flow";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";
import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import { isStudyToolsPubliclyEnabled } from "@/lib/study-tools/study-tools-feature-flag";

import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { ecgUrlSegmentFromPathwayId } from "@/lib/ecg/ecg-pathway";

export const CANONICAL_LEARNER_ROUTES = {
  lessons: "/app/lessons",
  practice: "/app/questions",
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

/** Appended when ECG learner surfaces are enabled for the pathway segment (RN/NP/PN). */
export const ECG_SHELL_NAV_ID = "ecg" as const;

export type LearnerShellStudyNavRowId =
  | LearnerPrimaryNavItem["key"]
  | typeof STUDY_TOOLS_SHELL_NAV_ID
  | typeof PRINTOUTS_SHELL_NAV_ID
  | typeof OSCE_SHELL_NAV_ID
  | typeof CLINICAL_SCENARIOS_SHELL_NAV_ID
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

export type LearnerExamsSurfaceLabel = "CAT Exams" | "Exams";

/**
 * Ordered: Lessons → Practice → Flashcards → CAT → Reports → Profile (max 6).
 * @param examsLabel — from learner shell: CAT surfaces use practice-tests; generic "Exams" uses `/app/exams`.
 */
export function buildLearnerPrimaryNavItems(
  pathwayId: string | null,
  options?: { examsLabel?: LearnerExamsSurfaceLabel },
): Omit<LearnerPrimaryNavItem, "labelKey">[] {
  const lessonsHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.lessons, pathwayId);
  const practiceHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.practice, pathwayId);
  const flashHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.flashcards, pathwayId);
  const useCatBuilder = options?.examsLabel !== "Exams";
  const catHref = useCatBuilder
    ? resolveStudySurfaceCatHref({
        pathwayId,
        availablePathwayIds: pathwayId ? [pathwayId] : [],
      })
    : "/app/exams";
  const catMatch = useCatBuilder ? "/app/practice-tests" : "/app/exams";

  return [
    { key: "lessons", href: lessonsHref, matchBase: "/app/lessons" },
    { key: "practice", href: practiceHref, matchBase: "/app/questions" },
    { key: "flashcards", href: flashHref, matchBase: "/app/flashcards" },
    { key: "cat", href: catHref, matchBase: catMatch },
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

export function buildOptionalEcgShellNavItem(pathwayId: string | null): {
  id: typeof ECG_SHELL_NAV_ID;
  href: string;
  matchPrefix: string;
  labelKey: string;
} | null {
  const trimmed = pathwayId?.trim();
  if (!trimmed) return null;
  if (!getExamPathwayById(trimmed)) return null;
  const segment = ecgUrlSegmentFromPathwayId(trimmed);
  const href = `/app/${segment}/ecg`;
  return {
    id: ECG_SHELL_NAV_ID,
    href,
    matchPrefix: href,
    labelKey: "learner.shell.nav.ecg",
  };
}
