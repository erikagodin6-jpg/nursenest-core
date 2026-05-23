import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import {
  isLearnerAppShellCallbackPathname,
  safeCallbackPath,
  type SafeCallbackPathOptions,
} from "@/lib/auth/safe-callback-path";
import {
  isLearnerDeepLinkPath,
  isStudyRoutePath,
  normalizeStudyCallback,
} from "@/lib/auth/protected-study-routes";

/** Query param used across marketing + middleware for post-auth resume. */
export const AUTH_CALLBACK_PARAM = "callbackUrl";

/** OAuth full-page redirect in progress (marketing auth surfaces). */
export const AUTH_OAUTH_CONTINUING_PARAM = "oauth";

/** Session recovery after expiry — preserves {@link AUTH_CALLBACK_PARAM}. */
export const AUTH_SESSION_EXPIRED_PARAM = "session";

export type AuthFlowSearchParams = Pick<URLSearchParams, "get" | "toString">;

export type AuthReturnDestinationOptions = {
  locale?: string;
  /** When true, wrap learner destinations with onboarding if profile is incomplete. */
  needsPathwayOnboarding?: boolean;
};

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

function pathnameFromSafeCallback(safe: string): string {
  try {
    return new URL(safe, "http://localhost").pathname;
  } catch {
    return "";
  }
}

/**
 * Honors marketing + pathway hub URLs and study route deep links.
 * Rejects bare `/app` learner shell roots and auth pages.
 */
export function resolveMarketingCallbackPath(
  raw: string | null,
  opts?: SafeCallbackPathOptions,
): string | null {
  const study = normalizeStudyCallback(raw);
  if (study) return study;

  const safe = safeCallbackPath(raw, opts);
  if (!safe) return null;

  const pathOnly = pathnameFromSafeCallback(safe);
  const { pathname: stripped } = stripMarketingLocalePrefix(pathOnly);
  if (isBlockedResumeStrippedPath(stripped)) return null;

  return safe;
}

/**
 * Learner study destinations (flashcards, CAT, practice, analytics, etc.) with query/hash preserved.
 * Allows deep `/app/*` links except generic `/app` shell.
 *
 * Study routes are validated via {@link normalizeStudyCallback} from protected-study-routes.ts.
 * Non-study learner routes (lessons, analytics, etc.) are allowed via {@link isLearnerDeepLinkPath}.
 * Adding a new study route: update STUDY_ROUTE_PREFIXES in protected-study-routes.ts only.
 */
export function resolveLearnerStudyCallbackPath(raw: string | null): string | null {
  // Study routes: validated by the central classifier (pathwayId, UUID, session-id rules).
  const study = normalizeStudyCallback(raw);
  if (study !== null) return study;

  const safe = safeCallbackPath(raw);
  if (!safe) return null;

  const pathname = pathnameFromSafeCallback(safe);
  if (!pathname.startsWith("/app/") || isLearnerAppShellCallbackPathname(pathname)) {
    return null;
  }

  // Study route paths that normalizeStudyCallback rejected (e.g. session UUID, missing pathwayId
  // on a hub route) must not fall through to the deep-link allowlist.
  if (isStudyRoutePath(pathname)) return null;

  // Non-study learner deep links (lessons, analytics, etc.).
  return isLearnerDeepLinkPath(pathname) ? safe : null;
}

/** Unified post-auth destination: learner study links win over marketing paths. */
export function resolveAuthReturnDestination(
  rawCallback: string | null,
  options?: AuthReturnDestinationOptions,
): string | null {
  const learner = resolveLearnerStudyCallbackPath(rawCallback);
  if (learner) {
    if (options?.needsPathwayOnboarding) {
      return wrapWithOnboardingIfNeeded(learner, true);
    }
    return learner;
  }

  const safe = safeCallbackPath(rawCallback);
  if (safe) {
    const pathname = pathnameFromSafeCallback(safe);
    if (pathname.startsWith("/app/")) {
      return null;
    }
  }

  return resolveMarketingCallbackPath(rawCallback, { rejectLearnerAppShell: true });
}

export function postLoginMarketingHomePath(locale: string): string {
  return withMarketingLocale(locale, "/");
}

export function readAuthCallbackFromSearchParams(searchParams: AuthFlowSearchParams): string | null {
  return searchParams.get(AUTH_CALLBACK_PARAM);
}

export function buildLoginHrefWithCallback(
  callbackPath: string,
  locale: string,
  extraParams?: Record<string, string>,
): string {
  const loginBase = withMarketingLocale(locale, "/login");
  const params = new URLSearchParams();
  params.set(AUTH_CALLBACK_PARAM, callbackPath);
  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      if (value.trim()) params.set(key, value);
    }
  }
  return `${loginBase}?${params.toString()}`;
}

/** Full learner path including query and hash for post-login resume. */
export function buildLearnerResumePathFromParts(
  pathname: string,
  search: string,
  hash: string,
): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const q = search.startsWith("?") ? search : search ? `?${search}` : "";
  const h = hash.startsWith("#") ? hash : hash ? `#${hash}` : "";
  return `${path}${q}${h}`;
}

/**
 * Safe callback for session-expired redirects: learner study paths, then generic safe paths.
 */
export function resolveSessionExpiredCallbackPath(rawPath: string): string {
  const learner = resolveLearnerStudyCallbackPath(rawPath);
  if (learner) return learner;
  const marketing = resolveMarketingCallbackPath(rawPath, { rejectLearnerAppShell: false });
  if (marketing) return marketing;
  if (rawPath.startsWith("/app/") && !isLearnerAppShellCallbackPathname(rawPath.split("?")[0] ?? rawPath)) {
    return rawPath;
  }
  return "/app/start-studying";
}

export function buildSessionExpiredLoginHref(resumePath: string, locale = "en"): string {
  const callback = resolveSessionExpiredCallbackPath(resumePath);
  return buildLoginHrefWithCallback(callback, locale, {
    [AUTH_SESSION_EXPIRED_PARAM]: "expired",
  });
}

/** Avoid redirect loops when already on login/signup with session=expired. */
export function shouldSkipSessionExpiredRedirect(pathname: string, search: string): boolean {
  const stripped = pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || pathname;
  if (!stripped.startsWith("/login") && !stripped.startsWith("/signup")) return false;
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return params.get(AUTH_SESSION_EXPIRED_PARAM) === "expired";
}

export function wrapWithOnboardingIfNeeded(destination: string, needsOnboarding: boolean): string {
  if (!needsOnboarding) return destination;
  const params = new URLSearchParams();
  params.set(AUTH_CALLBACK_PARAM, destination);
  return `/app/onboarding?${params.toString()}`;
}

/**
 * Resolves where to send the user after credentials or OAuth auth on marketing surfaces.
 */
export function resolveMarketingAuthRedirectTarget(
  pathname: string,
  searchParams: AuthFlowSearchParams,
  locale: string,
  options?: AuthReturnDestinationOptions,
): string {
  const raw = readAuthCallbackFromSearchParams(searchParams);
  const resolved = resolveAuthReturnDestination(raw, options);
  if (resolved) return resolved;

  // If the callback was any /app/* path that couldn't be specifically preserved (e.g., a
  // session-specific URL, a tier-scoped path without pathwayId, or a route not in the allowlist),
  // land on the learner dashboard rather than the marketing home. Prevents authenticated users
  // from ending up on the marketing site after signing in from within the app.
  const rawTrimmed = raw?.trim() ?? "";
  if (rawTrimmed.startsWith("/app/") && !rawTrimmed.startsWith("/app/api/")) {
    return "/app";
  }

  return postLoginMarketingHomePath(locale);
}

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

export function isOAuthContinuationSearchParams(searchParams: AuthFlowSearchParams): boolean {
  return searchParams.get(AUTH_OAUTH_CONTINUING_PARAM) === "continuing";
}

export function isSessionExpiredSearchParams(searchParams: AuthFlowSearchParams): boolean {
  return searchParams.get(AUTH_SESSION_EXPIRED_PARAM) === "expired";
}

export type OAuthProviderId = "google" | "apple";

export function oauthProviderFromSearchParams(
  searchParams: AuthFlowSearchParams,
): OAuthProviderId | null {
  const raw = searchParams.get("provider")?.trim().toLowerCase();
  if (raw === "google" || raw === "apple") return raw;
  return null;
}

/** Auth.js `error` query values → calm Blossom copy for marketing auth. */
export function resolveAuthErrorPresentation(errorCode: string | null): {
  title: string;
  message: string;
  help: string | null;
} | null {
  if (!errorCode?.trim()) return null;

  switch (errorCode) {
    case "OAuthAccountNotLinked":
      return {
        title: "Use your existing sign-in method",
        message:
          "This email already has a NurseNest password. Sign in with your email and password, or reset your password if needed.",
        help: "You can link social sign-in later from Account Settings when available.",
      };
    case "OAuthSignin":
    case "OAuthCallback":
      return {
        title: "Sign-in paused",
        message: "We could not finish signing you in with that provider. Please try again in a moment.",
        help: null,
      };
    case "AccessDenied":
      return {
        title: "Sign-in not completed",
        message: "Permission was not granted. You can try again when you are ready.",
        help: null,
      };
    case "Configuration":
      return {
        title: "Sign-in unavailable",
        message: "Social sign-in is not available right now. Use email and password, or try again later.",
        help: null,
      };
    case "SessionRequired":
      return {
        title: "Session ended",
        message: "Your study session ended for security. Sign in again to continue where you left off.",
        help: null,
      };
    default:
      return {
        title: "Something went wrong",
        message: "We could not complete sign-in. Check your details and try again.",
        help: null,
      };
  }
}

/**
 * Validates Auth.js redirect targets — same-origin, no open redirects, no raw `/api/auth` JSON.
 */
export function resolveAuthJsRedirectUrl(url: string, baseUrl: string): string {
  const fallback = `${baseUrl}/login`;
  try {
    if (url.startsWith("/")) {
      const safe = safeCallbackPath(url) ?? resolveLearnerStudyCallbackPath(url);
      if (safe) return safe;
      if (url === "/login" || url.startsWith("/login?")) return url;
      return fallback;
    }
    const target = new URL(url);
    const base = new URL(baseUrl);
    if (target.origin !== base.origin) return fallback;
    const safe = safeCallbackPath(`${target.pathname}${target.search}${target.hash}`);
    if (safe) return safe;
    return fallback;
  } catch {
    return fallback;
  }
}
