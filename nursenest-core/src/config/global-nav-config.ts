/**
 * Single source of truth for marketing header (desktop dropdowns + mobile drawer)
 * and learner shell primary nav. Paths are locale-agnostic; callers apply
 * `mapLegacyMarketingHref` + `withMarketingLocale` on marketing routes only.
 */

export type NavVisibility = "marketing" | "learner" | "both";

/** Semantic grouping for audits and tooling (not all map 1:1 to a visible dropdown). */
export type GlobalNavGroupId =
  | "who-we-help"
  | "learn-practice"
  | "guides-plans"
  | "learner-shell";

export type GlobalNavIconId = "book-open" | "graduation-cap" | "briefcase" | "heart";

export type GlobalNavLeafItem = {
  id: string;
  labelKey: string;
  href: string;
  group: GlobalNavGroupId;
  visibility: NavVisibility;
  /** Sort within desktop dropdown / learner row */
  order: number;
  icon?: GlobalNavIconId;
  /** Shown in marketing mobile drawer (flat list under hubs) */
  includeInMarketingMobileDrawer: boolean;
  /** Ordering in mobile drawer; lower first. Omitted when not in drawer. */
  mobileDrawerOrder?: number;
  /** Reserved for nested menus; not rendered yet. */
  children?: readonly GlobalNavLeafItem[];
};

const LEAF = (x: GlobalNavLeafItem) => x;

/** Desktop “Explore” / who we help (icons in dropdown). */
export const GLOBAL_NAV_WHO_WE_HELP: GlobalNavLeafItem[] = [
  LEAF({
    id: "marketing-exam-prep",
    labelKey: "nav.examPrep",
    href: "/exam-prep",
    group: "who-we-help",
    visibility: "marketing",
    order: 10,
    icon: "book-open",
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "marketing-new-graduate-support",
    labelKey: "nav.newGradSupport",
    href: "/new-graduate-support",
    group: "who-we-help",
    visibility: "marketing",
    order: 20,
    icon: "graduation-cap",
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "marketing-healthcare-careers",
    labelKey: "nav.healthcareCareers",
    href: "/healthcare-careers",
    group: "who-we-help",
    visibility: "marketing",
    order: 30,
    icon: "briefcase",
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "marketing-allied-health",
    labelKey: "nav.alliedHealth",
    href: "/allied-health",
    group: "who-we-help",
    visibility: "marketing",
    order: 40,
    icon: "heart",
    includeInMarketingMobileDrawer: false,
  }),
];

/** Desktop “Learn & practice” dropdown + matching mobile drawer entries. */
export const GLOBAL_NAV_LEARN_PRACTICE: GlobalNavLeafItem[] = [
  LEAF({
    id: "marketing-lessons",
    labelKey: "nav.lessons",
    href: "/lessons",
    group: "learn-practice",
    visibility: "marketing",
    order: 10,
    includeInMarketingMobileDrawer: true,
    mobileDrawerOrder: 20,
  }),
  LEAF({
    id: "marketing-exam-lessons",
    labelKey: "nav.lessonsByExam",
    href: "/exam-lessons",
    group: "learn-practice",
    visibility: "marketing",
    order: 20,
    includeInMarketingMobileDrawer: true,
    mobileDrawerOrder: 30,
  }),
  LEAF({
    id: "marketing-test-bank",
    labelKey: "nav.questionBank",
    href: "/test-bank",
    group: "learn-practice",
    visibility: "marketing",
    order: 30,
    includeInMarketingMobileDrawer: true,
    mobileDrawerOrder: 50,
  }),
  LEAF({
    id: "marketing-mock-exams",
    labelKey: "nav.practiceExams",
    href: "/mock-exams",
    group: "learn-practice",
    visibility: "marketing",
    order: 40,
    includeInMarketingMobileDrawer: true,
    mobileDrawerOrder: 60,
  }),
  LEAF({
    id: "marketing-flashcards",
    labelKey: "nav.flashcards",
    href: "/flashcards",
    group: "learn-practice",
    visibility: "marketing",
    order: 50,
    includeInMarketingMobileDrawer: true,
    mobileDrawerOrder: 40,
  }),
];

/** Desktop “Guides & plans” (nav.resources) + mobile drawer tail. */
export const GLOBAL_NAV_GUIDES_PLANS: GlobalNavLeafItem[] = [
  LEAF({
    id: "marketing-blog",
    labelKey: "nav.blog",
    href: "/blog",
    group: "guides-plans",
    visibility: "marketing",
    order: 10,
    includeInMarketingMobileDrawer: true,
    mobileDrawerOrder: 70,
  }),
  LEAF({
    id: "marketing-tools",
    labelKey: "nav.clinicalTools",
    href: "/tools",
    group: "guides-plans",
    visibility: "marketing",
    order: 20,
    includeInMarketingMobileDrawer: true,
    mobileDrawerOrder: 80,
  }),
  LEAF({
    id: "marketing-case-studies",
    labelKey: "nav.caseStudies",
    href: "/case-studies",
    group: "guides-plans",
    visibility: "marketing",
    order: 30,
    includeInMarketingMobileDrawer: true,
    mobileDrawerOrder: 90,
  }),
  LEAF({
    id: "marketing-pricing",
    labelKey: "nav.pricing",
    href: "/pricing",
    group: "guides-plans",
    visibility: "marketing",
    order: 40,
    includeInMarketingMobileDrawer: true,
    mobileDrawerOrder: 100,
  }),
  LEAF({
    id: "marketing-faq",
    labelKey: "footer.faq",
    href: "/faq",
    group: "guides-plans",
    visibility: "marketing",
    order: 50,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "marketing-shop",
    labelKey: "nav.store",
    href: "/shop",
    group: "guides-plans",
    visibility: "marketing",
    order: 60,
    includeInMarketingMobileDrawer: false,
  }),
];

/** Learner shell nav row (`/app/(learner)` layout). */
export const GLOBAL_NAV_LEARNER_SHELL: GlobalNavLeafItem[] = [
  LEAF({
    id: "learner-dashboard",
    labelKey: "dashboard.breadcrumbDashboard",
    href: "/app",
    group: "learner-shell",
    visibility: "learner",
    order: 10,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-lessons",
    labelKey: "nav.lessons",
    href: "/app/lessons",
    group: "learner-shell",
    visibility: "learner",
    order: 20,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-questions",
    labelKey: "nav.questionBank",
    href: "/app/questions",
    group: "learner-shell",
    visibility: "learner",
    order: 30,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-practice-tests",
    labelKey: "nav.topicAdaptiveTests",
    href: "/app/practice-tests",
    group: "learner-shell",
    visibility: "learner",
    order: 40,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-exams",
    labelKey: "nav.practiceExams",
    href: "/app/exams",
    group: "learner-shell",
    visibility: "learner",
    order: 50,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-study-plan",
    labelKey: "nav.studyPlanShort",
    href: "/app/study-plan",
    group: "learner-shell",
    visibility: "learner",
    order: 60,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-flashcards",
    labelKey: "nav.flashcards",
    href: "/app/flashcards",
    group: "learner-shell",
    visibility: "learner",
    order: 70,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-blog",
    labelKey: "nav.articlesAndTips",
    href: "/blog",
    group: "learner-shell",
    visibility: "learner",
    order: 80,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-tools",
    labelKey: "nav.clinicalTools",
    href: "/tools",
    group: "learner-shell",
    visibility: "learner",
    order: 90,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-case-studies",
    labelKey: "nav.caseStudiesShort",
    href: "/case-studies",
    group: "learner-shell",
    visibility: "learner",
    order: 100,
    includeInMarketingMobileDrawer: false,
  }),
  LEAF({
    id: "learner-pricing",
    labelKey: "nav.pricing",
    href: "/pricing",
    group: "learner-shell",
    visibility: "learner",
    order: 110,
    includeInMarketingMobileDrawer: false,
  }),
];

const byGroup = (group: GlobalNavGroupId, items: GlobalNavLeafItem[]) =>
  items.filter((i) => i.group === group).sort((a, b) => a.order - b.order);

export function getMarketingWhoWeHelpItems(): GlobalNavLeafItem[] {
  return byGroup("who-we-help", GLOBAL_NAV_WHO_WE_HELP);
}

export function getMarketingLearnPracticeItems(): GlobalNavLeafItem[] {
  return byGroup("learn-practice", GLOBAL_NAV_LEARN_PRACTICE);
}

export function getMarketingGuidesPlansItems(): GlobalNavLeafItem[] {
  return byGroup("guides-plans", GLOBAL_NAV_GUIDES_PLANS);
}

export function getMarketingMobileDrawerLeafItems(): GlobalNavLeafItem[] {
  return [...GLOBAL_NAV_LEARN_PRACTICE, ...GLOBAL_NAV_GUIDES_PLANS]
    .filter((i) => i.includeInMarketingMobileDrawer && i.mobileDrawerOrder !== undefined)
    .sort((a, b) => (a.mobileDrawerOrder ?? 0) - (b.mobileDrawerOrder ?? 0));
}

export function getLearnerShellNavItems(): GlobalNavLeafItem[] {
  return [...GLOBAL_NAV_LEARNER_SHELL].sort((a, b) => a.order - b.order);
}
