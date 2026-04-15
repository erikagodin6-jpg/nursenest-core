/**
 * **i18n (high-signal):** DOM `[missing:` tokens are always failures on learner routes.
 * Console missing-key lines are **fatal** only when attributed to core learner / study surfaces
 * (see `isCoreLearnerI18nViolation`); peripheral marketing strings are warnings in attachments.
 *
 * Default run is **English-only** for speed. Set `E2E_I18N_SECOND_LOCALE=1` to also run Français
 * shell switch + revisit (extended suite / nightly).
 *
 * @see ../helpers/paid-user-suite.ts
 */
import { expect, test, type Page } from "@playwright/test";
import { paidLessonsHubUrl, paidQuestionsHubUrl } from "../helpers/paid-content-discovery";
import { assertNoMissingI18nDomTokens } from "../helpers/paid-user-suite";
import { attachI18nMissingKeyAudit } from "../helpers/i18n-missing-key-audit";

const ENGLISH_PATHS = ["/app", paidLessonsHubUrl(), paidQuestionsHubUrl(), "/app/account/overview"] as const;

function isCoreLearnerI18nViolation(line: string): boolean {
  const s = line.toLowerCase();
  if (s.includes("/app") || /\b(learner\.|question|lesson|flashcard|rationale|pathway|account\.)/i.test(s)) {
    return true;
  }
  /** Marketing-only signals without learner route context → warn only */
  return false;
}

async function visitLearnerPaths(
  page: Page,
  setPath: (p: string) => void,
  paths: readonly string[],
): Promise<void> {
  for (const path of paths) {
    setPath(path);
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
    await page.waitForTimeout(400);
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
  test("core learner routes: no DOM leaks; core console signals fail, peripheral warns", async ({ page }, testInfo) => {
    let currentPath = "";
    const getPath = () => currentPath;
    const audit = attachI18nMissingKeyAudit(page, getPath);
    const fullLocale = process.env.E2E_I18N_SECOND_LOCALE === "1";

    try {
      await test.step("English — core routes", async () => {
        await visitLearnerPaths(page, (p) => {
          currentPath = p;
        }, ENGLISH_PATHS);
      });

      if (fullLocale) {
        await test.step("Switch to Français", async () => {
          currentPath = "/app (locale switch)";
          await switchLocaleViaShell(page, { name: /^Français/i });
        });

        await test.step("Français — revisit core routes", async () => {
          await visitLearnerPaths(page, (p) => {
            currentPath = `${p} (fr)`;
          }, ENGLISH_PATHS);
        });

        await test.step("Restore English", async () => {
          currentPath = "/app (locale switch)";
          await switchLocaleViaShell(page, { name: /^English$/i });
        });
      }

      const coreViolations = audit.violations.filter(isCoreLearnerI18nViolation);
      const peripheralViolations = audit.violations.filter((v) => !isCoreLearnerI18nViolation(v));

      if (peripheralViolations.length > 0) {
        await testInfo.attach("i18n-console-peripheral-warnings.txt", {
          body: peripheralViolations.join("\n---\n"),
          contentType: "text/plain",
        });
      }

      expect(
        coreViolations,
        `Core learner i18n console signals:\n${coreViolations.join("\n---\n")}`,
      ).toEqual([]);
    } finally {
      await testInfo.attach("ci-i18n-status.txt", {
        body:
          audit.violations.length > 0
            ? `ALL (core+peripheral):\n${audit.violations.join("\n")}`
            : "OK: no missing translation / i18n key console signals detected.",
        contentType: "text/plain",
      });
      audit.dispose();
    }
  });
});
