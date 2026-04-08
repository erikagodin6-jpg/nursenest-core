/**
 * Single source of truth for marketing header (desktop dropdowns + mobile drawer)
 * and learner shell primary nav. Paths are locale-agnostic; callers apply
 * `mapLegacyMarketingHref` + `withMarketingLocale` on marketing routes only.
 *
 * ## Locale (learner shell)
 * Marketing UI language for `/app/(learner)` matches {@link getMarketingLocaleForDefaultRoute}:
 * `nn_marketing_locale` cookie, set by the language picker and `/[locale]/…` layouts.
 *
 * ## Surface parity (intentional exclusions)
 * - **FAQ** (`/faq`) and **Shop** (`/shop`): `marketingDesktopDropdown` only. They appear in the
 *   “Guides & plans” desktop dropdown but not in the marketing mobile drawer (space / IA: hubs +
 *   core study links first; full resources stay on desktop).
 * - **Explore** (“Who we help”) links: desktop dropdown only; not duplicated in the mobile flat list
 *   (mobile users use region + exam hub section first).
 * - **Learner shell** links are a distinct set (`/app/…` plus selected marketing routes). They never
 *   appear in the marketing header; marketing items never appear in the learner row except shared
 *   label keys where copy aligns (e.g. `nav.pricing`).
 *
 * ## Auth
 * No nav entries are gated by auth in this config; marketing header auth UI stays separate.
 */

/** Where a leaf link may appear. One item can target multiple surfaces. */
export type NavSurface = "marketingDesktopDropdown" | "marketingMobileDrawer" | "learnerShell";

/** Semantic grouping for audits (not always 1:1 with a visible dropdown). */
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
  /** Which chrome surfaces render this link. */
  surfaces: readonly NavSurface[];
  /** Sort within a dropdown or learner row */
  order: number;
  icon?: GlobalNavIconId;
  /** When `marketingMobileDrawer` is in `surfaces`, controls order in the drawer (lower first). */
  mobileDrawerOrder?: number;
  /** Reserved for nested menus; not rendered yet. */
  children?: readonly GlobalNavLeafItem[];
};

export function itemHasSurface(item: GlobalNavLeafItem, surface: NavSurface): boolean {
  return item.surfaces.includes(surface);
}

const DD = "marketingDesktopDropdown" as const;
const MD = "marketingMobileDrawer" as const;
const LS = "learnerShell" as const;

const LEAF = (x: GlobalNavLeafItem) => x;

/** Desktop “Explore” / who we help (icons); not in mobile drawer list. */
export const GLOBAL_NAV_WHO_WE_HELP: GlobalNavLeafItem[] = [
  LEAF({
    id: "marketing-new-graduate-support",
    labelKey: "nav.newGradSupport",
    href: "/new-graduate-support",
    group: "who-we-help",
    surfaces: [DD],
    order: 10,
    icon: "graduation-cap",
  }),
  LEAF({
    id: "marketing-healthcare-careers",
    labelKey: "nav.healthcareCareers",
    href: "/healthcare-careers",
    group: "who-we-help",
    surfaces: [DD],
    order: 20,
    icon: "briefcase",
  }),
];

/** Desktop “Learn & practice” + mobile drawer (same subset). */
export const GLOBAL_NAV_LEARN_PRACTICE: GlobalNavLeafItem[] = [
  LEAF({
    id: "marketing-lessons",
    labelKey: "nav.lessons",
    href: "/lessons",
    group: "learn-practice",
    surfaces: [DD, MD],
    order: 10,
    mobileDrawerOrder: 20,
  }),
  LEAF({
    id: "marketing-exam-lessons",
    labelKey: "nav.lessonsByExam",
    href: "/exam-lessons",
    group: "learn-practice",
    surfaces: [DD, MD],
    order: 20,
    mobileDrawerOrder: 30,
  }),
  LEAF({
    id: "marketing-test-bank",
    labelKey: "nav.questionBank",
    href: "/test-bank",
    group: "learn-practice",
    surfaces: [DD, MD],
    order: 30,
    mobileDrawerOrder: 50,
  }),
  LEAF({
    id: "marketing-mock-exams",
    labelKey: "nav.practiceExams",
    href: "/mock-exams",
    group: "learn-practice",
    surfaces: [DD, MD],
    order: 40,
    mobileDrawerOrder: 60,
  }),
  LEAF({
    id: "marketing-flashcards",
    labelKey: "nav.flashcards",
    href: "/flashcards",
    group: "learn-practice",
    surfaces: [DD, MD],
    order: 50,
    mobileDrawerOrder: 40,
  }),
];

/**
 * Desktop “Guides & plans” (`nav.resources`). FAQ and shop are desktop-dropdown-only (see file header).
 */
export const GLOBAL_NAV_GUIDES_PLANS: GlobalNavLeafItem[] = [
  LEAF({
    id: "marketing-blog",
    labelKey: "nav.blog",
    href: "/blog",
    group: "guides-plans",
    surfaces: [DD, MD],
    order: 10,
    mobileDrawerOrder: 70,
  }),
  LEAF({
    id: "marketing-tools",
    labelKey: "nav.clinicalTools",
    href: "/tools",
    group: "guides-plans",
    surfaces: [DD, MD],
    order: 20,
    mobileDrawerOrder: 80,
  }),
  LEAF({
    id: "marketing-case-studies",
    labelKey: "nav.caseStudies",
    href: "/case-studies",
    group: "guides-plans",
    surfaces: [DD, MD],
    order: 30,
    mobileDrawerOrder: 90,
  }),
  LEAF({
    id: "marketing-pricing",
    labelKey: "nav.pricing",
    href: "/pricing",
    group: "guides-plans",
    surfaces: [DD, MD],
    order: 40,
    mobileDrawerOrder: 100,
  }),
  LEAF({
    id: "marketing-faq",
    labelKey: "footer.faq",
    href: "/faq",
    group: "guides-plans",
    surfaces: [DD],
    order: 50,
  }),
  LEAF({
    id: "marketing-shop",
    labelKey: "nav.store",
    href: "/shop",
    group: "guides-plans",
    surfaces: [DD],
    order: 60,
  }),
];

/** Learner shell nav row (`/app/(learner)` layout). */
export const GLOBAL_NAV_LEARNER_SHELL: GlobalNavLeafItem[] = [
  LEAF({
    id: "learner-dashboard",
    labelKey: "dashboard.breadcrumbDashboard",
    href: "/app",
    group: "learner-shell",
    surfaces: [LS],
    order: 10,
  }),
  LEAF({
    id: "learner-lessons",
    labelKey: "nav.lessons",
    href: "/app/lessons",
    group: "learner-shell",
    surfaces: [LS],
    order: 20,
  }),
  LEAF({
    id: "learner-questions",
    labelKey: "nav.questionBank",
    href: "/app/questions",
    group: "learner-shell",
    surfaces: [LS],
    order: 30,
  }),
  LEAF({
    id: "learner-practice-tests",
    labelKey: "nav.topicAdaptiveTests",
    href: "/app/practice-tests",
    group: "learner-shell",
    surfaces: [LS],
    order: 40,
  }),
  LEAF({
    id: "learner-exams",
    labelKey: "nav.practiceExams",
    href: "/app/exams",
    group: "learner-shell",
    surfaces: [LS],
    order: 50,
  }),
  LEAF({
    id: "learner-study-plan",
    labelKey: "nav.studyPlanShort",
    href: "/app/study-plan",
    group: "learner-shell",
    surfaces: [LS],
    order: 60,
  }),
  LEAF({
    id: "learner-flashcards",
    labelKey: "nav.flashcards",
    href: "/app/flashcards",
    group: "learner-shell",
    surfaces: [LS],
    order: 70,
  }),
  LEAF({
    id: "learner-blog",
    labelKey: "nav.articlesAndTips",
    href: "/blog",
    group: "learner-shell",
    surfaces: [LS],
    order: 80,
  }),
  LEAF({
    id: "learner-tools",
    labelKey: "nav.clinicalTools",
    href: "/tools",
    group: "learner-shell",
    surfaces: [LS],
    order: 90,
  }),
  LEAF({
    id: "learner-case-studies",
    labelKey: "nav.caseStudiesShort",
    href: "/case-studies",
    group: "learner-shell",
    surfaces: [LS],
    order: 100,
  }),
  LEAF({
    id: "learner-pricing",
    labelKey: "nav.pricing",
    href: "/pricing",
    group: "learner-shell",
    surfaces: [LS],
    order: 110,
  }),
];

const byGroup = (group: GlobalNavGroupId, items: GlobalNavLeafItem[]) =>
  items.filter((i) => i.group === group).sort((a, b) => a.order - b.order);

function filterBySurface(items: GlobalNavLeafItem[], surface: NavSurface): GlobalNavLeafItem[] {
  return items.filter((i) => itemHasSurface(i, surface)).sort((a, b) => a.order - b.order);
}

export function getMarketingWhoWeHelpItems(): GlobalNavLeafItem[] {
  return filterBySurface(byGroup("who-we-help", GLOBAL_NAV_WHO_WE_HELP), DD);
}

export function getMarketingLearnPracticeItems(): GlobalNavLeafItem[] {
  return filterBySurface(byGroup("learn-practice", GLOBAL_NAV_LEARN_PRACTICE), DD);
}

export function getMarketingGuidesPlansItems(): GlobalNavLeafItem[] {
  return filterBySurface(byGroup("guides-plans", GLOBAL_NAV_GUIDES_PLANS), DD);
}

export function getMarketingMobileDrawerLeafItems(): GlobalNavLeafItem[] {
  const combined = [...GLOBAL_NAV_LEARN_PRACTICE, ...GLOBAL_NAV_GUIDES_PLANS];
  return combined
    .filter((i) => itemHasSurface(i, MD) && i.mobileDrawerOrder !== undefined)
    .sort((a, b) => (a.mobileDrawerOrder ?? 0) - (b.mobileDrawerOrder ?? 0));
}

export function getLearnerShellNavItems(): GlobalNavLeafItem[] {
  return filterBySurface([...GLOBAL_NAV_LEARNER_SHELL], LS);
}
