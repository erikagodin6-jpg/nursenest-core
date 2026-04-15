/**
 * **i18n:** fails on missing translation / locale bundle signals in console while visiting core learner routes.
 * Also checks DOM for `[missing:` tokens after each navigation.
 *
 * Flow: English → switch to Français via shell → revisit routes → restore English.
 *
 * Requires `--project=chromium-paid` + `setup-paid-auth`.
 *
 * @see ../helpers/paid-user-suite.ts for run commands.
 */
import { expect, test, type Page } from "@playwright/test";
import { assertNoMissingI18nDomTokens } from "../helpers/paid-user-suite";
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
    await assertNoMissingI18nDomTokens(page);
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

test.describe("Paid learner — i18n (console + DOM)", () => {
  test("no missing-key logs on dashboard, lessons, practice, account (+ locale switch)", async ({ page }, testInfo) => {
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
      await testInfo.attach("ci-i18n-status.txt", {
        body:
          audit.violations.length > 0
            ? `MISSING:\n${audit.violations.join("\n")}`
            : "OK: no missing translation / i18n key console signals detected.",
        contentType: "text/plain",
      });
      audit.dispose();
    }
  });
});
