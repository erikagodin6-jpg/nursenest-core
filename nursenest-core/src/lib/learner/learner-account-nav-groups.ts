/**
 * Single source for learner Account Center IA (sidebar + hub quick links).
 * Primary routes stay small; deeper study analytics stay one click away.
 */
export type LearnerAccountNavItem = { href: string; key: string };
export type LearnerAccountNavGroup = { sectionKey: string; items: readonly LearnerAccountNavItem[] };

export const LEARNER_ACCOUNT_NAV_GROUPS: readonly LearnerAccountNavGroup[] = [
  {
    sectionKey: "learner.account.nav.groupAccountCenter",
    items: [
      { href: "/app/account", key: "learner.account.nav.accountHome" },
      { href: "/app/account/billing", key: "learner.account.nav.billing" },
      { href: "/app/account/settings", key: "learner.account.nav.settings" },
      { href: "/app/account/report", key: "learner.account.nav.report" },
      { href: "/app/account/activity", key: "learner.account.nav.activity" },
      { href: "/app/account/support", key: "learner.account.nav.support" },
    ],
  },
  {
    sectionKey: "learner.account.nav.groupStudy",
    items: [
      { href: "/app", key: "learner.account.nav.dashboard" },
      { href: "/app/command-center", key: "learner.account.nav.studyHub" },
      { href: "/app/account/overview", key: "learner.account.nav.overview" },
    ],
  },
  {
    sectionKey: "learner.account.nav.groupPerformance",
    items: [
      { href: "/app/account/readiness", key: "learner.account.nav.readiness" },
      { href: "/app/account/progress", key: "learner.account.nav.progress" },
      { href: "/app/account/question-bank-performance", key: "learner.account.nav.questionBankPerf" },
      { href: "/app/account/focus-areas", key: "learner.account.nav.focusAreas" },
    ],
  },
  {
    sectionKey: "learner.account.nav.groupActivity",
    items: [
      { href: "/app/account/study-history", key: "learner.account.nav.studyHistory" },
      { href: "/app/account/cat-history", key: "learner.account.nav.catHistory" },
      { href: "/app/review", key: "learner.account.nav.smartReview" },
      { href: "/app/account/review-queue", key: "learner.account.nav.reviewQueue" },
      { href: "/app/account/mistakes", key: "learner.account.nav.mistakeNotebook" },
      { href: "/app/account/notes", key: "learner.account.nav.notesHighlights" },
    ],
  },
  {
    sectionKey: "learner.account.nav.groupAccount",
    items: [
      { href: "/app/account/personal", key: "learner.account.nav.personal" },
      { href: "/app/account/study-preferences", key: "learner.account.nav.settingsHub" },
      { href: "/app/account/security", key: "learner.account.nav.security" },
    ],
  },
] as const;
