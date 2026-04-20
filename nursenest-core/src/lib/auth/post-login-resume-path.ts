import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";

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

/** Localized marketing home (`/` or `/fr`, …). */
export function postLoginMarketingHomePath(locale: string): string {
  return withMarketingLocale(locale, "/");
}

/**
 * Same-page resume target for `callbackUrl` when the user did not pass an explicit callback.
 * Keeps guests on the **marketing** shell they were browsing; avoids defaulting to `/app` (learner chrome).
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
