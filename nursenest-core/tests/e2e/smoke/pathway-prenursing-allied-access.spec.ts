/**
 * Pre-nursing tier + allied health — **learner** surfaces vs secondary marketing hubs.
 *
 * **Proven product choices (do not overclaim in reports):**
 * - Pre-nursing is **not** backed by an `EXAM_PATHWAYS` row — canonical routes are `/pre-nursing/*` (see
 *   `pathway-prenursing-allied-coverage-manifest.ts` + `pathway-prenursing-allied-matrix.ts`).
 * - Primary bounded interactive assessment for pre-nursing subscribers: `/pre-nursing/mini-cat` (not NCLEX CAT).
 * - Allied practice uses **linear** `/app/practice-tests` start — `pathway-readiness-config.ts` marks allied as
 *   SIMULATION, not NCLEX CAT (`pathwayLinearPracticeExamSurface` vs `pathwayCatSurface`).
 * - Profession does **not** change `/api/lessons` / `/api/questions` query shapes (no `alliedProfessionKey` in
 *   those routes); weak-topic/dashboard filtering may use profession only when `topicSlugsIn` is set on registry
 *   entries (currently omitted → no-op filter). Session + `/api/learner/exam-plan` assert profile wiring for allied rows.
 *
 * Run: `npm run qa:pathways:prenursing-allied` (from `nursenest-core/`).
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";
import { ALLIED_LEARNER_PROFESSION_KEYS } from "../helpers/allied-profession-keys";
import { loginWithCredentials } from "../helpers/learner-login";
import { readLearnerSessionSnapshot } from "../helpers/learner-session";
import {
  assertAlliedLearnerProfessionInvariant,
  fetchExamPlanJson,
  formatTierMismatchFailure,
} from "../helpers/pathway-prenursing-allied-assertions";
import { PRENURSING_ALLIED_COVERAGE_MANIFEST } from "../helpers/pathway-prenursing-allied-coverage-manifest";
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
  attachPrenursingAlliedEnvironmentCheck,
  assertEnvironmentAllowsSuite,
  classifyPrenursingAlliedErrorMessage,
  runEnvironmentPreflight,
  type PrenursingAlliedEnvironmentCheck,
} from "../helpers/prenursing-allied-environment";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  attachSlowRequestTap,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe.configure({ timeout: 900_000 });

test("suite: coverage manifest (documentation only)", async ({}, testInfo) => {
  await testInfo.attach("prenursing-allied-coverage-manifest.json", {
    body: Buffer.from(JSON.stringify(PRENURSING_ALLIED_COVERAGE_MANIFEST, null, 2), "utf-8"),
    contentType: "application/json",
  });
});

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
  matchedPrefix?: string | null;
  usedGenericFallback?: boolean;
  session?: Awaited<ReturnType<typeof readLearnerSessionSnapshot>>;
  environmentCheck?: PrenursingAlliedEnvironmentCheck | null;
  failurePhase?: string;
};

async function attachPrenursingAlliedFailure(
  testInfo: import("@playwright/test").TestInfo,
  page: Page,
  observers: PageObservers,
  slowMs: { url: string; ms: number }[],
  extra: FailureExtra,
): Promise<void> {
  const { pathwayKey, surface = "flow", credentialSource, matchedPrefix, usedGenericFallback, session } = extra;
  await attachSmokeFailureScreenshot(page, testInfo, `prenursing-allied-fail-${pathwayKey}-${surface}.png`);
  const hints = await visibleErrorHints(page).catch(() => []);
  await testInfo.attach(`prenursing-allied-fail-${pathwayKey}.json`, {
    body: Buffer.from(
      JSON.stringify(
        {
          pathwayKey,
          surface,
          credentialSource: credentialSource ?? null,
          matchedPrefix: matchedPrefix ?? null,
          usedGenericFallback: usedGenericFallback ?? null,
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
  test(`${row.label}`, async ({ page, baseURL, request }, testInfo) => {
    const creds = resolvePrenursingAlliedCredentials(row.credentialPrefixes);
    const hint = row.credentialPrefixes.map((p) => `${p}_EMAIL + ${p}_PASSWORD`).join(", ");
    test.skip(!creds, `Set ${hint}, or generic QA_PAID_EMAIL + QA_PAID_PASSWORD (session tier/country/profession must match the row).`);

    const envCheck = await runEnvironmentPreflight({
      request,
      baseURL,
      credentialPrefixes: row.credentialPrefixes,
    });
    await attachPrenursingAlliedEnvironmentCheck(testInfo, envCheck);
    assertEnvironmentAllowsSuite(envCheck);

    const slowMs: { url: string; ms: number }[] = [];
    const disposeSlow = attachSlowRequestTap(page, baseOriginFrom(page, baseURL), slowMs, 3000);
    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    let examPlanJson: Awaited<ReturnType<typeof fetchExamPlanJson>> | null = null;

    try {
      await test.step("Login", async () => {
        try {
          await loginWithCredentials(page, creds!.email, creds!.password);
          await expectOnPaidSubscriberApp(page);
          expect(page.url()).not.toMatch(/\/login/i);
        } catch (e) {
          const m = e instanceof Error ? e.message : String(e);
          const phase = classifyPrenursingAlliedErrorMessage(m);
          throw new Error(
            `[prenursing-allied:${phase}] ${m}\n` +
              "(Environment preflight passed — /login was reachable; this is auth or learner-shell routing, not connection refused.)",
          );
        }
      });

      const session = await readLearnerSessionSnapshot(page);

      if (row.coverage === "learnerPreNursingCanonical") {
        expect(session?.tier, formatTierMismatchFailure(creds!, "PRE_NURSING", session?.tier ?? null)).toBe(
          "PRE_NURSING",
        );

        const tag = `${row.key}-pre-nursing`;

        await test.step("/pre-nursing/lessons hub + sample modules", async () => {
          await preNursingLessonsHubAndSample({ page, surfaceTag: tag, observers });
        });

        await test.step("/app/flashcards (tier-scoped; no pathwayId)", async () => {
          await preNursingAppFlashcardsSurface({ page, surfaceTag: tag, observers });
        });

        await test.step("/pre-nursing/mini-cat (primary interactive assessment — not /app/questions pathway hub)", async () => {
          await preNursingMiniCatSurface({ page, surfaceTag: tag, observers });
        });
      } else {
        examPlanJson = await fetchExamPlanJson(page, baseURL);
        assertAlliedLearnerProfessionInvariant({ row, session, examPlan: examPlanJson, creds: creds! });

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

      await testInfo.attach("prenursing-allied-coverage-manifest.json", {
        body: Buffer.from(JSON.stringify(PRENURSING_ALLIED_COVERAGE_MANIFEST, null, 2), "utf-8"),
        contentType: "application/json",
      });

      await testInfo.attach(`prenursing-allied-${row.key}-meta.json`, {
        body: Buffer.from(
          JSON.stringify(
            row.coverage === "learnerPreNursingCanonical"
              ? {
                  pathwayKey: row.key,
                  pathwayId: null,
                  credentialSource: creds!.sourceLabel,
                  matchedPrefix: creds!.matchedPrefix,
                  usedGenericFallback: creds!.usedGenericFallback,
                  session,
                  routingNote: row.routingNote,
                  coverage: row.coverage,
                  coverageLayers: {
                    canonicalLearner: ["/pre-nursing/lessons", "/pre-nursing/mini-cat", "/app/flashcards"],
                    professionContextLearner: [],
                    marketingOnly: [],
                    intentionallyNotConfigured: [
                      "/app/questions hub as primary PRE_NURSING bank (no PRE_NURSING pathway in EXAM_PATHWAYS — see manifest)",
                    ],
                  },
                }
              : {
                  pathwayKey: row.key,
                  pathwayId: row.pathwayId,
                  displayName: row.displayName,
                  requiredSessionCountry: row.requiredSessionCountry,
                  readinessEngineType: row.readinessEngineType,
                  credentialSource: creds!.sourceLabel,
                  matchedPrefix: creds!.matchedPrefix,
                  usedGenericFallback: creds!.usedGenericFallback,
                  session,
                  examPlanAlliedProfessionKey: examPlanJson?.alliedProfessionKey ?? null,
                  routingNote: row.routingNote,
                  professionScopingNote: row.professionScopingNote,
                  coverage: row.coverage,
                  coverageLayers: {
                    canonicalLearner: [
                      `/app/lessons?pathwayId=${row.pathwayId}`,
                      `/app/flashcards?pathwayId=${row.pathwayId}`,
                      `/app/questions?pathwayId=${row.pathwayId}`,
                      `/app/practice-tests?pathwayId=${row.pathwayId} (linear start)`,
                    ],
                    professionContextLearner: [
                      "session.alliedProfessionKey + GET /api/learner/exam-plan (registry key validated; not per-profession pathwayId)",
                    ],
                    marketingOnly: [],
                    provenProductLimitations: [
                      "No topicSlugsIn on ALLIED_PROFESSIONS entries → allied-weak-topic-filter.ts is currently a no-op for weak-topic narrowing",
                    ],
                  },
                },
            null,
            2,
          ),
          "utf-8",
        ),
        contentType: "application/json",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const phase = classifyPrenursingAlliedErrorMessage(msg);
      await attachPrenursingAlliedFailure(testInfo, page, observers, slowMs, {
        pathwayKey: row.key,
        credentialSource: creds?.sourceLabel,
        matchedPrefix: creds?.matchedPrefix,
        usedGenericFallback: creds?.usedGenericFallback,
        session: await readLearnerSessionSnapshot(page).catch(() => null),
        environmentCheck: envCheck,
        failurePhase: phase,
      });
      throw e;
    } finally {
      disposeSlow();
      observers.dispose();
    }
  });
}

test.describe("Secondary: allied profession marketing lesson hubs", () => {
  test("each registry professionKey resolves a lesson index (signed-in)", async ({ page, baseURL, request }, testInfo) => {
    const creds = resolvePrenursingAlliedCredentials(["QA_ALLIED_US", "QA_ALLIED", "QA_PAID_ALLIED", "QA_PAID"]);
    test.skip(!creds, "Set QA_ALLIED_US_EMAIL + QA_ALLIED_US_PASSWORD (or QA_ALLIED_* / QA_PAID_* with US allied entitlements).");

    const prefixes = ["QA_ALLIED_US", "QA_ALLIED", "QA_PAID_ALLIED", "QA_PAID"];
    const envCheck = await runEnvironmentPreflight({
      request,
      baseURL,
      credentialPrefixes: prefixes,
    });
    await attachPrenursingAlliedEnvironmentCheck(testInfo, envCheck);
    assertEnvironmentAllowsSuite(envCheck);

    const slowMs: { url: string; ms: number }[] = [];
    const disposeSlow = attachSlowRequestTap(page, baseOriginFrom(page, baseURL), slowMs, 3000);
    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      try {
        await loginWithCredentials(page, creds!.email, creds!.password);
        await expectOnPaidSubscriberApp(page);
      } catch (e) {
        const m = e instanceof Error ? e.message : String(e);
        const phase = classifyPrenursingAlliedErrorMessage(m);
        throw new Error(
          `[prenursing-allied:${phase}] ${m}\n` +
            "(Environment preflight passed — /login was reachable; this is auth or learner-shell routing.)",
        );
      }

      const session = await readLearnerSessionSnapshot(page);
      expect(
        session?.country,
        `Marketing hub sweep expects a US session (got ${session?.country ?? "null"}). Credential: ${creds!.sourceLabel} (matchedPrefix=${creds!.matchedPrefix ?? "none"}).`,
      ).toBe("US");

      if (session?.tier === "ALLIED") {
        expect(
          session.alliedProfessionKey,
          `When tier is ALLIED, set User.alliedProfessionKey for profession context (${creds!.sourceLabel}).`,
        ).toBeTruthy();
      }

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
      await testInfo.attach("prenursing-allied-coverage-manifest.json", {
        body: Buffer.from(JSON.stringify(PRENURSING_ALLIED_COVERAGE_MANIFEST, null, 2), "utf-8"),
        contentType: "application/json",
      });
      await testInfo.attach("prenursing-allied-marketing-meta.json", {
        body: Buffer.from(
          JSON.stringify({
            layer: "marketing_only",
            note: "Public/marketing lesson index routes; not entitled /app/lessons pathway proof per profession.",
            credentialSource: creds.sourceLabel,
            matchedPrefix: creds.matchedPrefix,
            usedGenericFallback: creds.usedGenericFallback,
            session,
          }),
          null,
          2,
        ),
        contentType: "application/json",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await attachSmokeFailureScreenshot(page, testInfo, "prenursing-allied-professions-failure.png");
      const hints = await visibleErrorHints(page).catch(() => []);
      await testInfo.attach("prenursing-allied-professions-fail.json", {
        body: Buffer.from(
          JSON.stringify({
            failurePhase: classifyPrenursingAlliedErrorMessage(msg),
            currentUrl: page.url(),
            visibleErrorHints: hints,
            consoleErrors: observers.consoleErrors,
            failedRequests: observers.failedRequests,
            slowRequestsOver3s: slowMs,
            credentialSource: creds?.sourceLabel,
            matchedPrefix: creds?.matchedPrefix,
            usedGenericFallback: creds?.usedGenericFallback,
            environmentCheck: envCheck,
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
