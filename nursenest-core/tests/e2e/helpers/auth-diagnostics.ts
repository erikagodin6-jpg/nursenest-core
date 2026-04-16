/**
 * Structured failure context for auth / entitlement / shell assertions (Node side).
 * Does not change production behavior — diagnostics only.
 */
import type { Page } from "@playwright/test";

export type AuthFailureSurface = {
  url: string;
  pathname: string;
  appearsOnboarding: boolean;
  appearsLogin: boolean;
  subscriptionRequiredHeadingCount: number;
  bodySample: string;
  visibleAuthErrorLine: string | null;
};

/** Truncate for logs — avoid dumping huge HTML. */
const SAMPLE = 500;

export async function describeAuthFailureSurface(page: Page): Promise<string> {
  const d = await collectAuthFailureSurface(page);
  return formatAuthFailureSurface(d);
}

export async function collectAuthFailureSurface(page: Page): Promise<AuthFailureSurface> {
  const url = page.url();
  let pathname = "";
  try {
    pathname = new URL(url).pathname;
  } catch {
    pathname = "(invalid-url)";
  }
  const appearsOnboarding = /\/app\/onboarding/i.test(url);
  const appearsLogin = /\/login/i.test(url);
  const subscriptionRequiredHeadingCount = await page
    .getByRole("heading", { name: "Subscription required" })
    .count()
    .catch(() => 0);
  const body = (await page.locator("body").innerText().catch(() => "")).slice(0, SAMPLE);
  let visibleAuthErrorLine: string | null = null;
  const authLineMatch =
    /Unable to sign in|Invalid email|Invalid credentials|incorrect password|Sign in failed|Authentication failed/i.exec(
      body,
    );
  if (authLineMatch) {
    visibleAuthErrorLine = authLineMatch[0].slice(0, 200);
  }
  return {
    url,
    pathname,
    appearsOnboarding,
    appearsLogin,
    subscriptionRequiredHeadingCount,
    bodySample: body,
    visibleAuthErrorLine,
  };
}

export function formatAuthFailureSurface(d: AuthFailureSurface): string {
  const parts = [
    `url=${d.url}`,
    `pathname=${d.pathname}`,
    `onboardingLike=${d.appearsOnboarding ? "yes" : "no"}`,
    `loginRouteLike=${d.appearsLogin ? "yes" : "no"}`,
    `subscriptionRequiredHeadings=${d.subscriptionRequiredHeadingCount}`,
  ];
  if (d.visibleAuthErrorLine) parts.push(`authErrorSnippet=${d.visibleAuthErrorLine}`);
  return parts.join(" ");
}
