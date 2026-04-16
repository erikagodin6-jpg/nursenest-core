/**
 * Runs in `chromium-paid` only when paid credentials are **missing** (see `playwright.config.ts`).
 * Documents how to enable full paid E2E — not a product test.
 */
import { test } from "@playwright/test";

test.describe("Paid E2E — credentials not configured", () => {
  test("document enabling paid Playwright (skipped)", async () => {
    test.skip(
      true,
      "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or PLAYWRIGHT_TEST_EMAIL + PLAYWRIGHT_TEST_PASSWORD). Optional: .env.playwright.local in nursenest-core/. See tests/e2e/TEST_LAYERS.md and docs/RELEASE_QA.md.",
    );
  });
});
