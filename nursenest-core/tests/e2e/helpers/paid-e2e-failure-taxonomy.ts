/**
 * Lightweight triage labels for paid Playwright failures (setup + chromium-paid specs).
 * Use in logs / thrown messages — does not change assertions.
 */
export type PaidE2eFailureTaxonomyInput = {
  /** From `collectLearnerShellMainMissingDiagnostics` or similar */
  inferredCause?: string | null;
  /** HTTP or Playwright error text */
  thrownMessage?: string | null;
  /** Optional URL pathname */
  pathname?: string | null;
  /** Counts from attach-observers */
  failedRequestCount?: number;
  consoleErrorCount?: number;
};

const ORDER = [
  "redirect",
  "env",
  "inventory",
  "seed",
  "race",
  "dup_server",
  "ssr_cold",
  "assertion",
  "auth",
  "unknown",
] as const;

export type PaidE2eFailureCategory = (typeof ORDER)[number];

/**
 * Returns ordered unique categories (highest-signal first for logging).
 */
export function classifyPaidE2eFailure(input: PaidE2eFailureTaxonomyInput): PaidE2eFailureCategory[] {
  const blob = [input.inferredCause, input.thrownMessage, input.pathname]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const out = new Set<PaidE2eFailureCategory>();

  if (/redirect|loop|callbackurl|max_hops|middleware/i.test(blob)) out.add("redirect");
  if (/econnrefused|enotfound|eaddrinuse|missingsecret|nextauth_secret|auth_url|database_url|ssl|prisma/i.test(blob))
    out.add("env");
  if (/not found|404|no rows|empty catalog|no ecg|no question/i.test(blob)) out.add("inventory");
  if (/seed|qa-paid-test-account-reset|seed:auth-qa|auth-qa|onboarding_completed|onboarding/i.test(blob))
    out.add("seed");
  if (/timeout|stale|intermittent|race|closed|navigation aborted/i.test(blob)) out.add("race");
  if (/duplicate|second dev|eaddrinuse|already in use|two.*next/i.test(blob)) out.add("dup_server");
  if (/compil|webpack|chunkload|first paint|cold/i.test(blob)) out.add("ssr_cold");
  if (/expect\(|assertion|to_be|tohave|strict mode violation/i.test(blob)) out.add("assertion");
  if (/login|session|credentials|sign in|csrf|paywall|subscription required|storagestate/i.test(blob)) out.add("auth");

  if (out.size === 0) out.add("unknown");

  const ranked: PaidE2eFailureCategory[] = [];
  for (const c of ORDER) {
    if (out.has(c)) ranked.push(c);
  }
  return ranked;
}

export function formatPaidE2eFailureTaxonomy(input: PaidE2eFailureTaxonomyInput): string {
  return classifyPaidE2eFailure(input).join(",");
}
