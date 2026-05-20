/**
 * Human-facing triage for release / deploy gate failures (maps Playwright errors to coarse buckets).
 */
import { classifyPaidFailureMessage, type PaidFailureCategory } from "./paid-failure-classifier";

export type ReleaseLikelyClass =
  | "auth"
  | "onboarding"
  | "paywall"
  | "routing"
  | "content"
  | "readiness/database"
  | "unknown";

function mapPaidCategoryToRelease(cat: PaidFailureCategory, message: string): ReleaseLikelyClass {
  const healthish = /\/api\/health|health\/ready|database|prisma|503|postgres|connection|pool/i.test(message);
  switch (cat) {
    case "authFailure":
    case "authNoise":
      return "auth";
    case "onboardingBlockingFlow":
      return "onboarding";
    case "entitlementFailure":
      return "paywall";
    case "contentDiscoveryFailure":
      return "content";
    case "slowEndpointFailure":
    case "networkFailure":
      return healthish ? "readiness/database" : "unknown";
    case "selectorOrRouteDrift":
      return "routing";
    case "shellFailure":
      return "routing";
    case "i18nCoreFailure":
      return "content";
    default:
      return "unknown";
  }
}

/** Classify for console / deploy summaries (pathname + likelyClass). */
export function classifyReleaseDeployFailure(message: string, pageUrl?: string): {
  likelyClass: ReleaseLikelyClass;
  pathname: string | undefined;
  headline: string;
} {
  const m = message.slice(0, 8_000);
  const classified = classifyPaidFailureMessage(m, pageUrl);
  let likelyClass = mapPaidCategoryToRelease(classified.category, m);

  if (/\/api\/health\/ready|readiness|database|not_configured|SELECT 1|prisma|pool|connection/i.test(m)) {
    likelyClass = "readiness/database";
  } else if (/\/api\/health\b/i.test(m) && /50[0-9]|fail/i.test(m)) {
    likelyClass = "readiness/database";
  } else if (/subscription required|paywall|Preview only|not_subscribed/i.test(m)) {
    likelyClass = "paywall";
  } else if (/\/login|session|Unauthorized|401/i.test(m)) {
    likelyClass = "auth";
  } else if (/onboarding/i.test(m)) {
    likelyClass = "onboarding";
  }

  let pathname: string | undefined;
  if (pageUrl) {
    try {
      pathname = new URL(pageUrl).pathname + new URL(pageUrl).search;
    } catch {
      pathname = pageUrl;
    }
  }
  const um = m.match(/https?:\/\/[^\s)'"]+/);
  if (!pathname && um) {
    try {
      pathname = new URL(um[0]).pathname + new URL(um[0]).search;
    } catch {
      /* ignore */
    }
  }

  const headline = (m.split("\n").find((l) => l.trim().length > 0) ?? m).trim().slice(0, 400);

  return { likelyClass, pathname, headline };
}
