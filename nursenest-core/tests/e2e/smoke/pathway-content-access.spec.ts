/**
 * Paid pathway matrix — lessons, flashcards, question bank, CAT per major nursing `pathwayId`.
 *
 * Credentials: see `tests/e2e/helpers/pathway-content-credentials.ts` and `pathway-content-access-matrix.ts`.
 *
 * Run: `npm run qa:pathways` (from `nursenest-core/`).
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { PATHWAY_CONTENT_ACCESS_MATRIX } from "../helpers/pathway-content-access-matrix";
import { resolvePathwayAccessCredentials } from "../helpers/pathway-content-credentials";
import { expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  attachSlowRequestTap,
  buildCaptureFromObservers,
  type SmokeCapture,
} from "../helpers/smoke-evidence";
import {
  pathwayCatSurface,
  pathwayFlashcardsSurface,
  pathwayLessonsHubAndSample,
  pathwayQuestionBankSurface,
} from "../helpers/pathway-surface-flows";

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

async function attachPathwayFailureReport(
  testInfo: import("@playwright/test").TestInfo,
  page: Page,
  observers: PageObservers,
  slowMs: { url: string; ms: number }[],
  pathwayId: string,
  surface: string,
): Promise<void> {
  await attachSmokeFailureScreenshot(page, testInfo, `pathway-fail-${pathwayId}-${surface}.png`);
  await testInfo.attach(`pathway-fail-${pathwayId}.json`, {
    body: Buffer.from(
      JSON.stringify(
        {
          pathwayId,
          surface,
          currentUrl: page.url(),
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

for (const row of PATHWAY_CONTENT_ACCESS_MATRIX) {
  test(`${row.label} (${row.pathwayId})`, async ({ page, baseURL }, testInfo) => {
    const creds = resolvePathwayAccessCredentials(row.credentialPrefixes);
    const prefixHint = row.credentialPrefixes.map((p) => `${p}_EMAIL + ${p}_PASSWORD`).join(" or ");
    test.skip(
      !creds,
      `Set ${prefixHint}, or generic QA_PAID_EMAIL + QA_PAID_PASSWORD (shared subscriber covering all pathways).`,
    );

    const slowMs: { url: string; ms: number }[] = [];
    const origin = baseOriginFrom(page, baseURL);
    const disposeSlow = attachSlowRequestTap(page, origin, slowMs, 3000);
    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    const tag = row.pathwayId;

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

      await test.step("CAT session", async () => {
        await pathwayCatSurface({ page, pathwayId: row.pathwayId, surfaceTag: tag, observers });
      });

      const capture: SmokeCapture = {
        ...buildCaptureFromObservers(page, observers, { slowRequestsMs: slowMs }),
      };
      await attachSmokeCapture(testInfo, `pathway-${row.pathwayId}`, capture);
    } catch (e) {
      await attachPathwayFailureReport(testInfo, page, observers, slowMs, row.pathwayId, "flow");
      throw e;
    } finally {
      disposeSlow();
      observers.dispose();
    }
  });
}
