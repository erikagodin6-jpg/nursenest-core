import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { safeCallbackPath } from "@/lib/auth/safe-callback-path";
import { parseTierScopedAppStudyCallbackPath } from "@/lib/learner/tier-scoped-study-routes";

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
 * - Honors explicit same-origin `callbackUrl` except generic `/app` and most `/app/*` learner-shell paths,
 *   which are ignored when resolving from the query so arbitrary deep links cannot be injected via URL alone.
 * - **Exception:** tier-scoped study entry points `/app/questions?pathwayId=…`,
 *   `/app/practice-tests/start?pathwayId=…`, and `/app/flashcards?pathwayId=…` are honored when
 *   `pathwayId` matches a safe slug pattern,
 *   so marketing sign-in can return to the same exam track the learner chose on a hub.
 * - **Default (no valid `callbackUrl`):** localized marketing homepage (`/`, `/fr`, …). This avoids
 *   surprising post-login destinations and matches the product default after the 2026-04 hotfix.
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
  const tierScoped = parseTierScopedAppStudyCallbackPath(searchParams.get("callbackUrl"));
  if (tierScoped) {
    return tierScoped;
  }
  return postLoginMarketingHomePath(locale);
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
