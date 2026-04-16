/**
 * Pre-nursing tier + allied health pathway access — real entitlements, `/app/*` + allied marketing hubs.
 *
 * Pathway ids and profession keys are defined in `pathway-prenursing-allied-matrix.ts` and
 * `allied-profession-keys.ts` (synced with app registry).
 *
 * Run: `npm run qa:pathways:prenursing-allied` (from `nursenest-core/`).
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";
import { ALLIED_LEARNER_PROFESSION_KEYS } from "../helpers/allied-profession-keys";
import { loginWithCredentials } from "../helpers/learner-login";
import { PRENURSING_ALLIED_PATHWAY_MATRIX } from "../helpers/pathway-prenursing-allied-matrix";
import { resolvePrenursingAlliedCredentials } from "../helpers/pathway-prenursing-allied-credentials";
import { expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import {
  pathwayCatSurface,
  pathwayFlashcardsSurface,
  pathwayLessonsHubAndSample,
  pathwayQuestionBankSurface,
} from "../helpers/pathway-surface-flows";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  attachSlowRequestTap,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe.configure({ timeout: 900_000 });

function baseOriginFrom(page: Page, baseURL: string | undefined): string {
  if (baseURL) {
    try {
      return new URL(baseURL).origin;
    } catch {
      /* fall through */
    }
  }
  try {
    return new URL(page.url()).origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

async function visibleErrorHints(page: Page): Promise<string[]> {
  const hints: string[] = [];
  const alerts = page.locator('[role="alert"], [data-nn-error], .text-destructive');
  const n = await alerts.count().catch(() => 0);
  for (let i = 0; i < Math.min(n, 12); i++) {
    const t = await alerts.nth(i).innerText().catch(() => "");
    const s = t.trim();
    if (s.length > 0 && s.length < 2000) hints.push(s);
  }
  return hints;
}

async function attachPrenursingAlliedFailure(
  testInfo: import("@playwright/test").TestInfo,
  page: Page,
  observers: PageObservers,
  slowMs: { url: string; ms: number }[],
  pathwayKey: string,
  surface: string,
): Promise<void> {
  await attachSmokeFailureScreenshot(page, testInfo, `prenursing-allied-fail-${pathwayKey}-${surface}.png`);
  const hints = await visibleErrorHints(page).catch(() => []);
  await testInfo.attach(`prenursing-allied-fail-${pathwayKey}.json`, {
    body: Buffer.from(
      JSON.stringify(
        {
          pathwayKey,
          surface,
          currentUrl: page.url(),
          visibleErrorHints: hints,
          consoleErrors: observers.consoleErrors,
          failedRequests: observers.failedRequests,
          slowRequestsOver3s: slowMs,
        },
        null,
        2,
      ),
      "utf-8",
    ),
    contentType: "application/json",
  });
}

for (const row of PRENURSING_ALLIED_PATHWAY_MATRIX) {
  test(`${row.label}`, async ({ page, baseURL }, testInfo) => {
    const creds = resolvePrenursingAlliedCredentials(row.credentialPrefixes);
    const hint = row.credentialPrefixes.map((p) => `${p}_EMAIL + ${p}_PASSWORD`).join(", ");
    test.skip(!creds, `Set ${hint}, or generic QA_PAID_EMAIL + QA_PAID_PASSWORD (must match pathway country/tier).`);

    const slowMs: { url: string; ms: number }[] = [];
    const disposeSlow = attachSlowRequestTap(page, baseOriginFrom(page, baseURL), slowMs, 3000);
    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    const tag = `${row.key}-${row.pathwayId}`;

    try {
      await test.step("Login", async () => {
        await loginWithCredentials(page, creds!.email, creds!.password);
        await expectOnPaidSubscriberApp(page);
        expect(page.url()).not.toMatch(/\/login/i);
      });

      await test.step("Lessons hub + sample lessons", async () => {
        await pathwayLessonsHubAndSample({ page, pathwayId: row.pathwayId, surfaceTag: tag, observers });
      });

      await test.step("Flashcards", async () => {
        await pathwayFlashcardsSurface({ page, pathwayId: row.pathwayId, surfaceTag: tag, observers });
      });

      await test.step("Question bank", async () => {
        await pathwayQuestionBankSurface({ page, pathwayId: row.pathwayId, surfaceTag: tag, observers });
      });

      await test.step("Practice / adaptive session (CAT-style hub)", async () => {
        await pathwayCatSurface({ page, pathwayId: row.pathwayId, surfaceTag: tag, observers });
      });

      const capture = buildCaptureFromObservers(page, observers, {
        slowRequestsMs: slowMs,
      });
      await attachSmokeCapture(testInfo, `prenursing-allied-${row.key}`, capture);
      await testInfo.attach(`prenursing-allied-${row.key}-meta.json`, {
        body: Buffer.from(
          JSON.stringify(
            { pathwayKey: row.key, pathwayId: row.pathwayId, routingNote: row.routingNote },
            null,
            2,
          ),
          "utf-8",
        ),
        contentType: "application/json",
      });
    } catch (e) {
      await attachPrenursingAlliedFailure(testInfo, page, observers, slowMs, row.key, "flow");
      throw e;
    } finally {
      disposeSlow();
      observers.dispose();
    }
  });
}

test.describe("Allied professions — marketing lesson hubs", () => {
  test("each registry professionKey resolves a lesson index (signed-in)", async ({ page, baseURL }, testInfo) => {
    const creds = resolvePrenursingAlliedCredentials(["QA_ALLIED", "QA_PAID_ALLIED", "QA_ALLIED_US"]);
    test.skip(!creds, "Set QA_ALLIED_EMAIL + QA_ALLIED_PASSWORD (or QA_PAID_* with allied entitlements).");

    const slowMs: { url: string; ms: number }[] = [];
    const disposeSlow = attachSlowRequestTap(page, baseOriginFrom(page, baseURL), slowMs, 3000);
    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      for (const professionKey of ALLIED_LEARNER_PROFESSION_KEYS) {
        await test.step(`allied-health/${professionKey}/lessons`, async () => {
          await page.goto(`/allied-health/${encodeURIComponent(professionKey)}/lessons`, {
            waitUntil: "domcontentloaded",
          });
          const main = page.locator("main").first();
          await expect(main).toBeVisible({ timeout: 60_000 });
          const text = await main.innerText().catch(() => "");
          expect(
            text.length,
            `marketing lesson hub not empty for professionKey=${professionKey}`,
          ).toBeGreaterThan(60);
          expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
          expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
        });
      }

      await attachSmokeCapture(
        testInfo,
        "prenursing-allied-profession-hubs",
        buildCaptureFromObservers(page, observers, { slowRequestsMs: slowMs }),
      );
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "prenursing-allied-professions-failure.png");
      const hints = await visibleErrorHints(page).catch(() => []);
      await testInfo.attach("prenursing-allied-professions-fail.json", {
        body: Buffer.from(
          JSON.stringify({
            currentUrl: page.url(),
            visibleErrorHints: hints,
            consoleErrors: observers.consoleErrors,
            failedRequests: observers.failedRequests,
            slowRequestsOver3s: slowMs,
          }),
          null,
          2,
        ),
        contentType: "application/json",
      });
      throw e;
    } finally {
      disposeSlow();
      observers.dispose();
    }
  });
});
