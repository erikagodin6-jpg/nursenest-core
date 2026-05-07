/**
 * Runs when paid credentials are missing for `playwright.visual-qa.config.ts` setup project.
 * Fails fast with an actionable message (never a silent empty `storageState`).
 */
import { test as setup } from "@playwright/test";

setup("visual QA requires paid learner credentials", () => {
  throw new Error(
    [
      "Visual QA auth is blocked: no paid test credentials in the environment.",
      "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_EMAIL + PLAYWRIGHT_TEST_PASSWORD).",
      "Copy nursenest-core/.env.playwright.example → .env.playwright.local and fill placeholders.",
      "Then: npm run visual-qa:auth",
    ].join(" "),
  );
});
