/**
 * Required flat marketing i18n keys for **user-facing** chrome (nav, hero, auth entry,
 * learner account shell, breadcrumbs). Excludes admin-only surfaces (`nav.admin`).
 *
 * Used by CI tests and `scripts/audit/run-i18n-completeness-audit.mts` — keep in sync.
 */
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { PRODUCTION_CHROME_I18N_KEYS } from "@/lib/i18n/production-chrome-i18n-keys";

/** Auth / signup / password flows — minimal strings so routes are not half-English. */
export const REQUIRED_AUTH_AND_ACCOUNT_FLOW_KEYS = [
  "pages.login.title",
  "pages.login.cantFindAccount",
  "pages.login.submit",
  "pages.login.fieldIdentifierLabel",
  "pages.login.fieldPasswordLabel",
  "pages.login.rememberMe",
  "pages.login.rememberMeHint",
  "pages.login.forgotPasswordLink",
  "pages.signup.title",
  "pages.signup.createAccount",
  "pages.signup.h1",
  "pages.forgotPassword.h1",
  "pages.forgotPassword.submitLabel",
  "dashboard.breadcrumbHome",
  "dashboard.breadcrumbDashboard",
  "learner.account.menu.dashboardOverview",
  "learner.account.menu.accountHub",
  "learner.account.nav.aria",
  "learner.account.nav.mistakeNotebook",
  "learner.account.nav.notesHighlights",
  "learner.account.nav.smartReview",
  "learner.account.nav.studyHub",
  "learner.userBar.link.accountOverview",
  "learner.userBar.link.subscription",
  "learner.shell.nav.questions",
  "learner.shell.nav.practice",
  "learner.shell.nav.lessons",
  "learner.shell.nav.cat",
  "learner.shell.nav.flashcards",
  "learner.shell.nav.progress",
  "learner.shell.nav.examsSurface",
  "nav.pricing",
  "footer.blog",
  "nav.logIn",
  "nav.signup",
  "nav.dashboard",
  "nav.account",
] as const;

/** Homepage, paywall, marketing nav, CTAs, hero carousel, and auth/account chrome — `nav.admin` excluded. */
export const REQUIRED_USER_UI_I18N_KEYS: readonly string[] = Array.from(
  new Set<string>([
    ...REQUIRED_AUTH_AND_ACCOUNT_FLOW_KEYS,
    ...PRODUCTION_CHROME_I18N_KEYS.filter((k) => k !== "nav.admin"),
  ]),
);

function isMissing(v: string | undefined): boolean {
  return v === undefined || (typeof v === "string" && v.trim() === "");
}

export type RequiredUserUiI18nResult = {
  ok: boolean;
  locale: string;
  missing: string[];
  empty: string[];
};

/** Validates merged locale bundle (e.g. disk `public/i18n/{locale}.json`). */
export function validateRequiredUserUiI18nKeys(
  messages: MarketingMessages,
  locale: string,
): RequiredUserUiI18nResult {
  const missing: string[] = [];
  const empty: string[] = [];
  for (const key of REQUIRED_USER_UI_I18N_KEYS) {
    const v = messages[key];
    if (v === undefined) missing.push(key);
    else if (typeof v === "string" && v.trim() === "") empty.push(key);
  }
  return {
    ok: missing.length === 0 && empty.length === 0,
    locale,
    missing,
    empty,
  };
}
