/**
 * Ensures `src/lib/db/env-bootstrap.ts` runs before `PrismaClient` in `src/lib/db.ts` (runtime guard).
 * If the assertion throws, SSR for `/app` fails (500 / error UI).
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-env-bootstrap-order.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";

test.describe("Paid user — env-bootstrap before Prisma", () => {
  test("/app loads (db module did not throw env-bootstrap assertion)", async ({ page }) => {
    test.skip(!getPaidTestCredentials(), "Requires paid E2E credentials / chromium-paid storage");

    const res = await page.goto("/app", { waitUntil: "domcontentloaded", timeout: 60_000 });
    expect(res?.ok(), `expected successful response, got HTTP ${res?.status()}`).toBeTruthy();
    await expectPaidLearnerShellReady(page, "env-bootstrap-order /app");
  });
});
