import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { safeCallbackPath } from "@/lib/auth/safe-callback-path";

/**
 * Surfaces where resuming the same URL after auth would loop or leak API bodies into the document.
 * Paths are **locale-stripped** (e.g. `/login`, not `/fr/login`).
 */
const AUTH_RESUME_BLOCKLIST_PREFIXES = [
  "/login",
  "/signup",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
] as const;

function isBlockedResumeStrippedPath(strippedPathname: string): boolean {
  const p = strippedPathname.split("?")[0] || "";
  return AUTH_RESUME_BLOCKLIST_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
}

/**
 * Resolves where to send the user after credentials auth on marketing surfaces.
 * - Honors explicit same-origin `callbackUrl` except `/app` and `/app/*` (learner shell), which are ignored
 *   when resolving from the query so arbitrary deep links cannot be injected via URL alone.
 * - Falls back to {@link marketingResumeCallbackFromLocation} using the current pathname and query
 *   (with `callbackUrl` stripped from the query so it cannot echo back into the resume URL).
 *   Auth-only blocklist paths (e.g. `/login`) resume to localized marketing home (`/`, `/fr`, …), not `/app`,
 *   so generic login does not trap users in the learner shell; explicit `callbackUrl` still wins when allowed.
 */
export function resolveMarketingAuthRedirectTarget(
  pathname: string,
  searchParams: Pick<URLSearchParams, "get" | "toString">,
  locale: string,
): string {
  const fromQuery = safeCallbackPath(searchParams.get("callbackUrl"), { rejectLearnerAppShell: true });
  if (fromQuery) {
    return fromQuery;
  }
  const sp = new URLSearchParams(searchParams.toString());
  sp.delete("callbackUrl");
  const qs = sp.toString();
  const q = qs ? `?${qs}` : "";
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return marketingResumeCallbackFromLocation(path, q, locale);
}

/** Localized marketing home (`/` or `/fr`, …). */
export function postLoginMarketingHomePath(locale: string): string {
  return withMarketingLocale(locale, "/");
}

/**
 * Same-page resume target when there is no usable `callbackUrl` (or it was stripped).
 * Marketing paths resume in-place; auth-only routes (`/login`, `/signup`, …) resume to marketing home
 * so post-login lands on the shared marketing shell (admin nav, site IA) instead of `/app`.
 */
export function marketingResumeCallbackFromLocation(
  pathname: string,
  queryWithQuestionMark: string,
  locale: string,
): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const { pathname: stripped } = stripMarketingLocalePrefix(path);
  if (isBlockedResumeStrippedPath(stripped)) {
    return postLoginMarketingHomePath(locale);
  }
  if (path === "/api" || path.startsWith("/api/")) {
    return postLoginMarketingHomePath(locale);
  }
  const q = queryWithQuestionMark.startsWith("?")
    ? queryWithQuestionMark
    : queryWithQuestionMark
      ? `?${queryWithQuestionMark}`
      : "";
  return `${path}${q}`;
}
