/**
 * Classifies Playwright assertion errors and network/console signals for paid-user suite reporting.
 */
export type PaidFailureCategory =
  | "authFailure"
  | "onboardingRedirects"
  | "entitlementFailures"
  | "networkFailures"
  | "slowEndpoints"
  | "missingTranslations"
  | "consoleRuntimeErrors"
  | "selectorOrRouteDrift"
  | "nonBlockingAuthNoise"
  | "failedRoutes"
  | "contentDiscovery"
  | "unknown";

export type ClassifiedPaidFailure = {
  category: PaidFailureCategory;
  reason: string;
  route?: string;
  endpoint?: string;
};

function extractUrlPath(hay: string): string | undefined {
  const m = hay.match(/https?:\/\/[^\s)]+|\/app\/[^\s)'"]+/i);
  return m ? m[0].slice(0, 240) : undefined;
}

/** Classify a thrown error message (and optional page URL) for summaries and CI. */
export function classifyPaidFailureMessage(message: string, pageUrl?: string): ClassifiedPaidFailure {
  const m = message.slice(0, 2_000);
  const route = pageUrl ?? extractUrlPath(m);

  if (/PaidContentDiscoveryError|noLessonContentAvailable|noQuestionBankItemsAvailable|noFlashcardDeckAvailable/i.test(m)) {
    return { category: "contentDiscovery", reason: m.slice(0, 400), route };
  }
  if (/\/app\/onboarding|onboardingCompletedAt|unexpected \/app\/onboarding/i.test(m)) {
    return { category: "onboardingRedirects", reason: m.slice(0, 400), route };
  }
  if (/\/login|Redirected to \/login|session missing|Unauthenticated|Invalid.*session|ClientFetchError.*session/i.test(m)) {
    return { category: "authFailure", reason: m.slice(0, 400), route };
  }
  if (/Subscription required|paywall|Entitlement mismatch|Preview only/i.test(m)) {
    return { category: "entitlementFailures", reason: m.slice(0, 400), route };
  }
  if (/missing i18n|translation missing|locale bundle|\[missing:/i.test(m)) {
    return { category: "missingTranslations", reason: m.slice(0, 400), route };
  }
  if (/fetch\/XHR|status 4\d\d|status 5\d\d|network error|critical API|api\/questions.*40/i.test(m)) {
    return { category: "networkFailures", reason: m.slice(0, 400), route };
  }
  if (/Slow same-origin|slow >\d+ms/i.test(m)) {
    return { category: "slowEndpoints", reason: m.slice(0, 400), route };
  }
  if (/hydration|Hydration failed|did not match/i.test(m)) {
    return { category: "consoleRuntimeErrors", reason: m.slice(0, 400), route };
  }
  if (/not visible|timeout|strict mode violation|locator.*not found/i.test(m)) {
    return { category: "selectorOrRouteDrift", reason: m.slice(0, 400), route };
  }
  if (/getSession|\/api\/auth\/session|authjs/i.test(m) && !/200/.test(m)) {
    return { category: "authFailure", reason: m.slice(0, 400), route };
  }

  return { category: "unknown", reason: m.slice(0, 400), route };
}

/**
 * If `/api/auth/session` returns 4xx/5xx before shell is ready → authFailure.
 * If console mentions auth but message looks like noise → nonBlockingAuthNoise.
 */
export function classifyAuthContext(input: {
  errorMessage: string;
  authHttpLast?: Array<{ url: string; status: number }>;
}): PaidFailureCategory {
  const authBad = input.authHttpLast?.some((x) => x.status >= 400 && /\/api\/auth\//i.test(x.url));
  if (authBad) return "authFailure";

  if (/nonBlockingAuthNoise|noise.*auth/i.test(input.errorMessage)) return "nonBlockingAuthNoise";

  return classifyPaidFailureMessage(input.errorMessage).category;
}
