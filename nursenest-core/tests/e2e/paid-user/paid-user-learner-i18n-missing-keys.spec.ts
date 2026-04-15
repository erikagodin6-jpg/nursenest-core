/**
 * Fails if the browser console reports missing i18n / translation while visiting core learner routes.
 *
 * Intercepts **all** `console` events and matches (case-sensitive substrings via regex):
 * - `missing i18n key`, `translation missing`, `undefined translation`
 * - `[marketing-i18n] missing key`, `marketing_message_key_missing`, `missing key … locale bundle`
 *
 * Flow: English (default) → switch locale via learner shell Language control → re-run same pages.
 *
 * Requires `chromium-paid` + paid credentials (`setup-paid-auth`).
 *
 * Run:
 *   cd nursenest-core && E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... npx playwright test tests/e2e/paid-user/paid-user-learner-i18n-missing-keys.spec.ts --project=chromium-paid
 */
import { expect, test } from "@playwright/test";
import { attachI18nMissingKeyAudit } from "../helpers/i18n-missing-key-audit";

const LEARNER_I18N_PATHS = ["/app", "/app/lessons", "/app/questions", "/app/account/overview"] as const;

async function visitLearnerPaths(
  page: Page,
  setPath: (p: string) => void,
  paths: readonly string[],
): Promise<void> {
  for (const path of paths) {
    setPath(path);
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
    await page.waitForTimeout(600);
  }
}

async function switchLocaleViaShell(page: Page, options: { name: RegExp }): Promise<void> {
  await page.goto("/app", { waitUntil: "domcontentloaded" });
  const langBtn = page.getByRole("button", { name: /^Language$/i });
  await expect(langBtn).toBeVisible({ timeout: 20_000 });
  await langBtn.click();
  const choice = page.getByRole("button", { name: options.name });
  await expect(choice.first()).toBeVisible({ timeout: 15_000 });
  await choice.first().click();
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1200);
}

test.describe("Learner shell — i18n missing keys (console)", () => {
  test("no missing-key logs on dashboard, lessons, practice, account (+ locale switch)", async ({ page }) => {
    let currentPath = "";
    const getPath = () => currentPath;
    const audit = attachI18nMissingKeyAudit(page, getPath);

    try {
      await test.step("English — visit core routes", async () => {
        await visitLearnerPaths(page, (p) => {
          currentPath = p;
        }, LEARNER_I18N_PATHS);
      });

      await test.step("Switch to Français (supported switcher locale)", async () => {
        currentPath = "/app (locale switch)";
        await switchLocaleViaShell(page, { name: /^Français/i });
      });

      await test.step("Français — revisit core routes", async () => {
        await visitLearnerPaths(page, (p) => {
          currentPath = `${p} (fr)`;
        }, LEARNER_I18N_PATHS);
      });

      await test.step("Restore English", async () => {
        currentPath = "/app (locale switch)";
        await switchLocaleViaShell(page, { name: /^English$/i });
      });

      expect(
        audit.violations,
        `Missing i18n console signals:\n${audit.violations.join("\n---\n")}`,
      ).toEqual([]);
    } finally {
      audit.dispose();
    }
  });
});
