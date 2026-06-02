import { expect, type Page } from "@playwright/test";

/**
 * When a subscriber opens a pathway they are **not** entitled to, the UI must not expose paid bank / lesson / CAT surfaces.
 */
export async function expectCrossTierBlockedForPathway(page: Page, context: string): Promise<void> {
  const body = (await page.locator("body").innerText().catch(() => "")).slice(0, 24_000);
  const lower = body.toLowerCase();

  const notOnAccount = /this study track is not on your account/i.test(body);
  const upgrade = /\bupgrade\b/i.test(body) && /(subscription|plan|unlock|add)/i.test(lower);
  const subscriptionRequired = /subscription required/i.test(body);
  const previewOnly = /preview only/i.test(body);
  const locked = /(locked|not included|doesn.?t include)/i.test(lower);
  const signInGate =
    (await page.getByRole("link", { name: /sign in/i }).first().isVisible().catch(() => false)) &&
    (await page.locator('input[type="password"]').count()) > 0;

  const gated = notOnAccount || upgrade || subscriptionRequired || previewOnly || locked || signInGate;
  expect(
    gated,
    `Expected cross-tier gate for ${context}. Snippet: ${body.slice(0, 400).replace(/\s+/g, " ")}`,
  ).toBe(true);

  await expect(page.locator(".nn-question-stem")).toHaveCount(0);
  await expect(page.locator(".nn-cat-question-stem")).toHaveCount(0);
}
