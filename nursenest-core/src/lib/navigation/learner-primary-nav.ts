/**
 * Canonical learner primary nav — one list for marketing header + `/app` learner shell.
 */

import { resolveStudySurfaceCatHref } from "@/lib/exam-pathways/pathway-cat-flow";

export const CANONICAL_LEARNER_ROUTES = {
  lessons: "/app/lessons",
  practice: "/app/questions",
  flashcards: "/app/flashcards",
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
 * Use `"lessons"` for lesson-first IA; use `"practice"` for exam-question-first IA.
 */
export const LEARNER_PRIMARY_NAV_ITEM_KEY = "lessons" as const satisfies Extract<
  LearnerPrimaryNavItem["key"],
  "lessons" | "practice"
>;

/** Whether this nav row is the designated primary study entry (visual emphasis in header + shell). */
export function isLearnerPrimaryNavKey(key: LearnerPrimaryNavItem["key"]): boolean {
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
  reports: "learner.shell.nav.reports",
  profile: "nav.account",
};

export function learnerPrimaryNavLabelKey(key: LearnerPrimaryNavItem["key"]): string {
  return LABEL_KEYS[key];
}
