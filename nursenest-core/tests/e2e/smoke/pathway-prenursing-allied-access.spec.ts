/**
 * Pre-nursing tier + allied health — **learner** surfaces vs secondary marketing hubs.
 *
 * - **Pre-nursing:** canonical `/pre-nursing/*` routes (see `pathway-prenursing-allied-matrix.ts`). Not
 *   `us-rn-nclex-rn` app lessons unless you add a separate RN pathway test elsewhere.
 * - **Allied:** `/app/*` scoped to `us-allied-core` / `ca-allied-core`; readiness is **SIMULATION** per
 *   `pathway-readiness-config.ts` (linear practice exam flow, not NCLEX CAT).
 * - **Marketing:** `/allied-health/{professionKey}/lessons` — secondary coverage only.
 *
 * Run: `npm run qa:pathways:prenursing-allied` (from `nursenest-core/`).
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";
import { ALLIED_LEARNER_PROFESSION_KEYS } from "../helpers/allied-profession-keys";
import { loginWithCredentials } from "../helpers/learner-login";
import { readLearnerSessionSnapshot } from "../helpers/learner-session";
import { PRENURSING_ALLIED_PATHWAY_MATRIX } from "../helpers/pathway-prenursing-allied-matrix";
import { resolvePrenursingAlliedCredentials } from "../helpers/pathway-prenursing-allied-credentials";
import { expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import {
  pathwayFlashcardsSurface,
  pathwayLessonsHubAndSample,
  pathwayLinearPracticeExamSurface,
  pathwayQuestionBankSurface,
} from "../helpers/pathway-surface-flows";
import {
  preNursingAppFlashcardsSurface,
  preNursingLessonsHubAndSample,
  preNursingMiniCatSurface,
} from "../helpers/pathway-prenursing-surfaces";
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

type FailureExtra = {
  pathwayKey: string;
  surface?: string;
  credentialSource?: string;
  session?: Awaited<ReturnType<typeof readLearnerSessionSnapshot>>;
};

async function attachPrenursingAlliedFailure(
  testInfo: import("@playwright/test").TestInfo,
  page: Page,
  observers: PageObservers,
  slowMs: { url: string; ms: number }[],
  extra: FailureExtra,
): Promise<void> {
  const { pathwayKey, surface = "flow", credentialSource, session } = extra;
  await attachSmokeFailureScreenshot(page, testInfo, `prenursing-allied-fail-${pathwayKey}-${surface}.png`);
  const hints = await visibleErrorHints(page).catch(() => []);
  await testInfo.attach(`prenursing-allied-fail-${pathwayKey}.json`, {
    body: Buffer.from(
      JSON.stringify(
        {
          pathwayKey,
          surface,
          credentialSource: credentialSource ?? null,
          session: session ?? null,
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
    test.skip(!creds, `Set ${hint}, or generic QA_PAID_EMAIL + QA_PAID_PASSWORD (session tier/country must match the row).`);

    const slowMs: { url: string; ms: number }[] = [];
    const disposeSlow = attachSlowRequestTap(page, baseOriginFrom(page, baseURL), slowMs, 3000);
    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      await test.step("Login", async () => {
        await loginWithCredentials(page, creds!.email, creds!.password);
        await expectOnPaidSubscriberApp(page);
        expect(page.url()).not.toMatch(/\/login/i);
      });

      const session = await readLearnerSessionSnapshot(page);

      if (row.coverage === "learnerPreNursingCanonical") {
        expect(
          session?.tier,
          `Pre-nursing row requires session tier PRE_NURSING (got ${session?.tier ?? "null"}). ` +
            `Credential source: ${creds!.sourceLabel}. Set QA_PRENURSING_EMAIL+PASSWORD or QA_PAID_PRE_NURSING_*; ` +
            `do not rely on a generic RN-only QA_PAID account for this canonical /pre-nursing/* suite.`,
        ).toBe("PRE_NURSING");

        const tag = `${row.key}-pre-nursing`;

        await test.step("/pre-nursing/lessons hub + sample modules", async () => {
          await preNursingLessonsHubAndSample({ page, surfaceTag: tag, observers });
        });

        await test.step("/app/flashcards (tier-scoped; no pathwayId)", async () => {
          await preNursingAppFlashcardsSurface({ page, surfaceTag: tag, observers });
        });

        await test.step("/pre-nursing/mini-cat (mini adaptive — not NCLEX CAT)", async () => {
          await preNursingMiniCatSurface({ page, surfaceTag: tag, observers });
        });
      } else {
        expect(
          session?.country,
          `Allied ${row.pathwayId} requires session country ${row.requiredSessionCountry} (got ${session?.country ?? "null"}). ` +
            `Credential source: ${creds!.sourceLabel}. Use ${row.key === "allied-ca" ? "QA_ALLIED_CA_* or QA_PAID_ALLIED_CA_*" : "QA_ALLIED_US_* or QA_ALLIED_*"} ` +
            `— do not silently reuse a US account for Canada rows (or vice versa).`,
        ).toBe(row.requiredSessionCountry);

        const tag = `${row.key}-${row.pathwayId}`;

        await test.step("Lessons hub + sample (entitled pathway)", async () => {
          await pathwayLessonsHubAndSample({ page, pathwayId: row.pathwayId, surfaceTag: tag, observers });
        });

        await test.step("Flashcards (pathway-scoped hub)", async () => {
          await pathwayFlashcardsSurface({ page, pathwayId: row.pathwayId, surfaceTag: tag, observers });
        });

        await test.step("Question bank", async () => {
          await pathwayQuestionBankSurface({ page, pathwayId: row.pathwayId, surfaceTag: tag, observers });
        });

        await test.step("Practice exam (SIMULATION / linear builder — not NCLEX CAT)", async () => {
          await pathwayLinearPracticeExamSurface({ page, pathwayId: row.pathwayId, surfaceTag: tag, observers });
        });
      }

      const capture = buildCaptureFromObservers(page, observers, {
        slowRequestsMs: slowMs,
      });
      await attachSmokeCapture(testInfo, `prenursing-allied-${row.key}`, capture);
      await testInfo.attach(`prenursing-allied-${row.key}-meta.json`, {
        body: Buffer.from(
          JSON.stringify(
            row.coverage === "learnerPreNursingCanonical"
              ? {
                  pathwayKey: row.key,
                  pathwayId: null,
                  credentialSource: creds!.sourceLabel,
                  session,
                  routingNote: row.routingNote,
                  coverage: row.coverage,
                }
              : {
                  pathwayKey: row.key,
                  pathwayId: row.pathwayId,
                  displayName: row.displayName,
                  requiredSessionCountry: row.requiredSessionCountry,
                  readinessEngineType: row.readinessEngineType,
                  credentialSource: creds!.sourceLabel,
                  session,
                  routingNote: row.routingNote,
                  professionScopingNote: row.professionScopingNote,
                  coverage: row.coverage,
                },
            null,
            2,
          ),
          "utf-8",
        ),
        contentType: "application/json",
      });
    } catch (e) {
      await attachPrenursingAlliedFailure(testInfo, page, observers, slowMs, {
        pathwayKey: row.key,
        credentialSource: creds?.sourceLabel,
        session: await readLearnerSessionSnapshot(page).catch(() => null),
      });
      throw e;
    } finally {
      disposeSlow();
      observers.dispose();
    }
  });
}

test.describe("Secondary: allied profession marketing lesson hubs", () => {
  test("each registry professionKey resolves a lesson index (signed-in)", async ({ page, baseURL }, testInfo) => {
    const creds = resolvePrenursingAlliedCredentials(["QA_ALLIED_US", "QA_ALLIED", "QA_PAID_ALLIED", "QA_PAID"]);
    test.skip(!creds, "Set QA_ALLIED_US_EMAIL + QA_ALLIED_US_PASSWORD (or QA_ALLIED_* / QA_PAID_* with US allied entitlements).");

    const slowMs: { url: string; ms: number }[] = [];
    const disposeSlow = attachSlowRequestTap(page, baseOriginFrom(page, baseURL), slowMs, 3000);
    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      const session = await readLearnerSessionSnapshot(page);
      expect(
        session?.country,
        `Marketing hub sweep expects a US session (got ${session?.country ?? "null"}). Credential source: ${creds!.sourceLabel}.`,
      ).toBe("US");

      for (const professionKey of ALLIED_LEARNER_PROFESSION_KEYS) {
        await test.step(`marketing /allied-health/${professionKey}/lessons`, async () => {
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
      await testInfo.attach("prenursing-allied-marketing-meta.json", {
        body: Buffer.from(
          JSON.stringify({
            note: "Marketing-only; not a substitute for /app/lessons?pathwayId=us-allied-core checks.",
            credentialSource: creds.sourceLabel,
            session,
          }),
          null,
          2,
        ),
        contentType: "application/json",
      });
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
            credentialSource: creds?.sourceLabel,
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
