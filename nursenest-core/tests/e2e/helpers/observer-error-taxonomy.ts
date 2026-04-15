/**
 * Classifies Playwright observer console lines and parses structured i18n payloads
 * so paid audits can report i18n vs auth vs other failures separately.
 */

export type ObserverErrorCategory = "i18n" | "auth" | "api" | "console";

/** Four account-nav keys added for learner sidebar; keep aligned with marketing-en.json + audits. */
export const PRODUCTION_I18N_ACCOUNT_NAV_KEYS = [
  "learner.account.nav.studyHub",
  "learner.account.nav.smartReview",
  "learner.account.nav.mistakeNotebook",
  "learner.account.nav.notesHighlights",
] as const;

/** Expanded production bundle checks — homepage, paywall, pricing, learner shell (see marketing-en.json). */
export const PRODUCTION_I18N_CRITICAL_EXTRA_KEYS = [
  "learner.shell.nav.lessons",
  "learner.shell.nav.practice",
  "learner.primaryNav.lessons",
  "learner.primaryNav.practice",
  "paywall.preview.heading",
  "paywall.preview.bankSizeLine",
  "paywall.preview.sampleStem",
  "paywall.questions.title",
  "pages.home.blogTeaser.title",
  "pages.home.hero.headline",
  "pages.home.hero.primaryCta",
  "pages.home.hero.secondaryCta",
  "pages.pricing.conversion.h1",
  "pages.pricing.description",
  "learner.dashboard.title",
  "learner.studyHome.sectionPriorityEyebrow",
  "learner.studyHome.sectionPriorityEyebrowNew",
] as const;

export const PRODUCTION_I18N_CRITICAL_BUNDLE_KEYS = [
  ...PRODUCTION_I18N_ACCOUNT_NAV_KEYS,
  ...PRODUCTION_I18N_CRITICAL_EXTRA_KEYS,
] as const;

const I18N_MISSING_RE = /marketing_message_key_missing/;
const AUTH_ERR_RE =
  /errors\.authjs\.dev|#autherror|ClientFetchError|Failed to fetch.*getSession|\/api\/auth\/|next-auth\.|session.*fetch/i;

/** Parsed line from `[nursenest-core] {"scope":"i18n",...}` production logs. */
export function tryParseI18nMissingKeyConsole(text: string): { key: string } | null {
  const idx = text.indexOf("[nursenest-core]");
  const jsonSlice = idx >= 0 ? text.slice(idx + "[nursenest-core]".length).trim() : text.trim();
  try {
    const o = JSON.parse(jsonSlice) as { scope?: string; event?: string; key?: string };
    if (o?.scope === "i18n" && o?.event === "marketing_message_key_missing" && typeof o.key === "string") {
      return { key: o.key };
    }
  } catch {
    /* not JSON */
  }
  return null;
}

export function categorizeConsoleErrorLine(text: string): ObserverErrorCategory {
  if (I18N_MISSING_RE.test(text) || tryParseI18nMissingKeyConsole(text)) return "i18n";
  if (AUTH_ERR_RE.test(text)) return "auth";
  return "console";
}

export type GroupedConsoleLines = {
  i18n: string[];
  auth: string[];
  other: string[];
};

export function groupConsoleLinesByCategory(lines: string[]): GroupedConsoleLines {
  const i18n: string[] = [];
  const auth: string[] = [];
  const other: string[] = [];
  for (const line of lines) {
    const c = categorizeConsoleErrorLine(line);
    if (c === "i18n") i18n.push(line);
    else if (c === "auth") auth.push(line);
    else other.push(line);
  }
  return { i18n, auth, other };
}
