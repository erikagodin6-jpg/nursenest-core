/**
 * Consistent, actionable strings for release-gate / deploy-blocker failures.
 * Use from Node-side Playwright helpers (not inside page.evaluate).
 */
import type { Page } from "@playwright/test";

export type ReleaseGateFailureCategory =
  | "auth"
  | "onboarding"
  | "paywall"
  | "routing"
  | "content"
  | "api"
  | "health"
  | "unknown";

export function releaseGateUrlContext(page: Page): { url: string; pathname: string; line: string } {
  const url = page.url();
  let pathname = "";
  try {
    pathname = new URL(url).pathname;
  } catch {
    pathname = "(unparsed)";
  }
  return { url, pathname, line: `url=${url} pathname=${pathname}` };
}

/**
 * Blocking heading / button text snippets for triage (best-effort, sync).
 */
export function releaseGateBlockingSnippet(page: Page): string {
  try {
    const p = new URL(page.url()).pathname;
    if (p.includes("/login")) return "visible=surface looks like login";
    if (p.includes("/app/onboarding")) return "visible=surface looks like onboarding wizard";
  } catch {
    /* ignore */
  }
  return "visible=(run describeAuthFailureSurface for full snapshot)";
}
