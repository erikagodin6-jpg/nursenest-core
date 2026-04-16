/**
 * Locale matrix for marketing / public-site smoke (Playwright).
 *
 * Override with `E2E_SMOKE_MARKETING_LOCALES` (comma-separated), e.g.
 * `en,fr,es,de` or the full hosted set for a longer run.
 */
import {
  CORE_HOSTED_MARKETING_LOCALES,
  DEFAULT_MARKETING_LOCALE,
  isMarketingLocaleCode,
} from "../../../src/lib/i18n/marketing-locale-policy";

export { DEFAULT_MARKETING_LOCALE };

export type SmokeMarketingLocale = { code: string; homePath: string };

/**
 * Default smoke matrix: English + major non-default + Indic + RTL + CJK + Latin EU.
 * Override with `E2E_SMOKE_MARKETING_LOCALES` for full matrix or CI experiments.
 */
const DEFAULT_SMOKE_LOCALE_CODES: readonly string[] = [
  DEFAULT_MARKETING_LOCALE,
  "fr",
  "es",
  "hi",
  "ja",
  "ar",
  "zh-tw",
  "de",
];

export function marketingHomePath(localeCode: string): string {
  return localeCode === DEFAULT_MARKETING_LOCALE ? "/" : `/${localeCode}`;
}

function parseLocaleListFromEnv(): string[] | null {
  const raw = process.env.E2E_SMOKE_MARKETING_LOCALES?.trim();
  if (!raw) return null;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Resolves the ordered list of locale codes to smoke-test.
 * Validates each code against marketing locale policy (unknown codes throw).
 */
export function resolveSmokeMarketingLocaleCodes(): string[] {
  const fromEnv = parseLocaleListFromEnv();
  const codes = fromEnv?.length ? fromEnv : [...DEFAULT_SMOKE_LOCALE_CODES];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const code of codes) {
    if (seen.has(code)) continue;
    seen.add(code);
    if (code === DEFAULT_MARKETING_LOCALE) {
      out.push(code);
      continue;
    }
    if (!isMarketingLocaleCode(code)) {
      throw new Error(
        `E2E_SMOKE_MARKETING_LOCALES: unknown or unsupported locale "${code}". ` +
          `Expected "en" or one of: ${CORE_HOSTED_MARKETING_LOCALES.join(", ")}`,
      );
    }
    out.push(code);
  }
  return out;
}

export function getSmokeMarketingLocaleMatrix(): SmokeMarketingLocale[] {
  return resolveSmokeMarketingLocaleCodes().map((code) => ({
    code,
    homePath: marketingHomePath(code),
  }));
}

/** Escape locale segment for safe use in RegExp (e.g. zh-tw). */
export function escapeLocaleForPathRegex(locale: string): string {
  return locale.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Asserts the URL pathname matches the expected marketing locale (English = `/`, others `/{code}`).
 */
export function expectPathMatchesMarketingLocale(url: string, localeCode: string): void {
  const u = new URL(url);
  if (localeCode === DEFAULT_MARKETING_LOCALE) {
    const p = u.pathname.endsWith("/") && u.pathname !== "/" ? u.pathname.slice(0, -1) : u.pathname;
    if (p !== "/") {
      throw new Error(`Expected default (en) marketing home at "/", got pathname "${u.pathname}"`);
    }
    return;
  }
  const seg = escapeLocaleForPathRegex(localeCode);
  const re = new RegExp(`^/${seg}(?:/|$)`);
  if (!re.test(u.pathname)) {
    throw new Error(`Expected localized home under /${localeCode}/, got "${u.pathname}"`);
  }
}
