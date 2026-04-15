/**
 * Classifies Playwright errors and durability signals for paid-user CI summaries.
 * **Primary cause** = first matching rule below (order matters in {@link classifyPaidFailureMessage}).
 */
export type PaidFailureCategory =
  | "authFailure"
  | "onboardingBlockingFlow"
  | "entitlementFailure"
  | "contentDiscoveryFailure"
  | "slowEndpointFailure"
  | "networkFailure"
  | "i18nCoreFailure"
  | "selectorOrRouteDrift"
  | "shellFailure"
  /** Non-blocking: `Failed to fetch` + session/auth in console while HTTP OK */
  | "authNoise"
  | "unknown";

export type ClassifiedPaidFailure = {
  category: PaidFailureCategory;
  /** Short primary reason (first line / headline). */
  reason: string;
  route?: string;
  endpoint?: string;
};

function extractRoute(hay: string, pageUrl?: string): string | undefined {
  if (pageUrl && /^https?:\/\//.test(pageUrl)) {
    try {
      return new URL(pageUrl).pathname + new URL(pageUrl).search;
    } catch {
      /* ignore */
    }
  }
  const m = hay.match(/url=([^\s)]+)/i) ?? hay.match(/(https?:\/\/[^\s)]+|\/app\/[^\s)'"]+)/i);
  return m ? m[1]?.slice(0, 240) ?? m[0].slice(0, 240) : undefined;
}

/**
 * Prefer the **first line** of multi-line Playwright errors as the human "primary cause" headline.
 */
export function primaryFailureHeadline(message: string): string {
  const first = message.split(/\n/).find((l) => l.trim().length > 0) ?? message;
  return first.trim().slice(0, 500);
}

/** Classify a thrown error message for summaries and bucket routing. */
export function classifyPaidFailureMessage(message: string, pageUrl?: string): ClassifiedPaidFailure {
  const m = message.slice(0, 4_000);
  const route = extractRoute(m, pageUrl);
  const reason = primaryFailureHeadline(m);

  if (/onboardingBlockingFlow|OnboardingBlockingFlowError/i.test(m)) {
    return { category: "onboardingBlockingFlow", reason, route };
  }
  if (/PaidContentDiscoveryError|noLessonContentAvailable|noQuestionBankItemsAvailable|noFlashcardDeckAvailable/i.test(m)) {
    return { category: "contentDiscoveryFailure", reason, route };
  }
  if (/slowEndpointFailure|exceeds 6000ms|core API \d+ms exceeds/i.test(m)) {
    return { category: "slowEndpointFailure", reason, route };
  }
  if (/authFailure:.*\/api\/auth\/session|\/api\/auth\/session returned (401|403|[5-9]\d\d)/i.test(m)) {
    return { category: "authFailure", reason, route };
  }
  if (/shellFailure|shellNotInteractive/i.test(m)) {
    return { category: "shellFailure", reason, route };
  }
  if (/blankScreenDetected|stuckLoadingState/i.test(m)) {
    return { category: "shellFailure", reason, route };
  }
  if (/\/login|Redirected to \/login|session missing|Unauthenticated/i.test(m)) {
    return { category: "authFailure", reason, route };
  }
  if (/Subscription required|paywall|Entitlement mismatch|Preview only/i.test(m)) {
    return { category: "entitlementFailure", reason, route };
  }
  if (/i18nCoreFailure|missing-key console/i.test(m)) {
    return { category: "i18nCoreFailure", reason, route };
  }
  if (/missing i18n|translation missing|locale bundle|\[missing:/i.test(m)) {
    return { category: "i18nCoreFailure", reason, route };
  }
  if (/fetch\/XHR|status 4\d\d|status 5\d\d|network error|failed request/i.test(m)) {
    return { category: "networkFailure", reason, route };
  }
  if (/hydration|Hydration failed|did not match/i.test(m)) {
    return { category: "shellFailure", reason, route };
  }
  if (/not visible|timeout|strict mode violation|locator.*not found|expect\(.*\).*failed/i.test(m)) {
    return { category: "selectorOrRouteDrift", reason, route };
  }
  if (/auth-fetch-noise|authFetchNoise|Failed to fetch.*session/i.test(m)) {
    return { category: "authNoise", reason, route };
  }

  return { category: "unknown", reason, route };
}
