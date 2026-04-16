/**
 * **Core vs optional** learner UI: deploy gates should assert shell + main content, not every widget.
 *
 * Optional panels (recommendations, nudges) may be absent under degraded mode or empty data — do not fail
 * Layer A tests unless the spec targets that widget.
 */
import { expect, type Page } from "@playwright/test";

/**
 * Core invariant: authenticated learner routes render `main` with non-trivial text.
 * Does not assert specific cards or i18n strings.
 */
export async function expectLearnerMainHasBody(page: Page, context: string, opts?: { minChars?: number }): Promise<void> {
  const min = opts?.minChars ?? 40;
  const main = page.locator("main");
  await expect(main, `${context}: missing <main> — not a learner surface`).toBeVisible({ timeout: 60_000 });
  const text = (await main.innerText().catch(() => "")).trim();
  expect(text.length, `${context}: expected core main content (>= ${min} chars), got ${text.length}`).toBeGreaterThanOrEqual(
    min,
  );
}
