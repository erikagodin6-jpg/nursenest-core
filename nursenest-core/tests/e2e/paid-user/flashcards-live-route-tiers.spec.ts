/**
 * Live `/app/flashcards` hub per pathway query — mirrors lessons hub affordances (systems, presets, start CTA).
 *
 * Requires paid auth storage (same as learning-routes). Pathways the fixture is not entitled to are skipped
 * with a clear message so default US-RN CI stays green; run with CA/NP/Allied/New-grad reset for full matrix.
 *
 * Run: `npx playwright test -c playwright.learning-routes.config.ts tests/e2e/paid-user/flashcards-live-route-tiers.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { paidFlashcardsHubUrl } from "../helpers/paid-content-discovery";
import { expectPaidLearnerShellReady, learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

/** Query param values as shipped / documented; aliases resolve on the server (see flashcards-pathway-query). */
const FLASHCARDS_TIER_PATHWAYS: { pathwayId: string; label: string }[] = [
  { pathwayId: "ca-rn-nclex-rn", label: "Canada RN (NCLEX-RN)" },
  { pathwayId: "ca-rpn-rex-pn", label: "Canada PN (REx-PN)" },
  { pathwayId: "ca-np", label: "Canada NP (alias → ca-np-cnple)" },
  { pathwayId: "new-grad", label: "New grad (alias → us-rn-new-grad-transition)" },
  { pathwayId: "allied-health", label: "Allied health (alias → us|ca-allied-core)" },
];

test.describe("Flashcards live route — tier pathway matrix", () => {
  for (const row of FLASHCARDS_TIER_PATHWAYS) {
    test(`flashcards hub: ${row.label} (${row.pathwayId})`, async ({ page, baseURL }) => {
      test.setTimeout(180_000);

      let customSessionGets = 0;
      page.on("request", (req) => {
        try {
          const u = new URL(req.url());
          if (u.pathname === "/api/flashcards/custom-session" && req.method() === "GET") {
            customSessionGets += 1;
          }
        } catch {
          /* ignore */
        }
      });

      const url = new URL(paidFlashcardsHubUrl(row.pathwayId), baseURL ?? "http://127.0.0.1:3000").toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, `flashcards tiers ${row.pathwayId}`);
      await expectNoSubscriptionPaywall(page, `flashcards tiers ${row.pathwayId}`);

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(
        await notOnAccount.isVisible().catch(() => false),
        `Paid fixture has no entitlement for pathway query ${row.pathwayId} — set QA_PAID_TEST_COUNTRY / tier or expand subscription pathways.`,
      );

      const main = learnerAppMainLandmark(page);
      await expect(main).toBeVisible({ timeout: 120_000 });

      await expect(page.getByText("NN_RENDER_TRACE: flashcards live route")).toBeVisible({ timeout: 30_000 });

      const hub = main.locator("[data-nn-e2e-flashcards-hub]");
      await expect(hub).toBeVisible({ timeout: 90_000 });

      await expect(main.getByRole("heading", { level: 1 })).toBeVisible();

      const presets = main.locator("[data-nn-e2e-flashcard-filter-presets]");
      await expect(presets).toBeVisible();
      await expect(presets.getByRole("button", { name: "All cards" })).toBeVisible();
      await expect(presets.getByRole("button", { name: "Weak areas" })).toBeVisible();
      await expect(presets.getByRole("button", { name: "Starred" })).toBeVisible();
      await expect(presets.getByRole("button", { name: "Unseen" })).toBeVisible();
      await expect(presets.getByRole("button", { name: "Review incorrect" })).toBeVisible();

      await expect(main.locator("[data-nn-e2e-start-review]")).toBeVisible({ timeout: 90_000 });

      const bodyCards = main.locator("[data-nn-e2e-body-system-card]");
      const diagnostics = main.locator("[data-nn-e2e-flashcards-lesson-diagnostics]");
      await expect(bodyCards.or(diagnostics).first()).toBeVisible({ timeout: 90_000 });

      const setupEmpty = main.locator("[data-nn-e2e-flashcards-setup-report]");
      const hasDiagnostics = await diagnostics.isVisible().catch(() => false);
      const cardCount = await bodyCards.count();
      const diagText = hasDiagnostics ? (await diagnostics.innerText()).toLowerCase() : "";
      const virtualCountPositive = hasDiagnostics && /total generated virtual cards:\s*[1-9]/.test(diagText);
      if (virtualCountPositive || cardCount > 0) {
        await expect(setupEmpty).not.toBeVisible();
      }

      await page.waitForTimeout(2800);
      expect(customSessionGets, "custom-session inventory should not loop (initialHub skip + bounded refetch)").toBeLessThanOrEqual(
        4,
      );

      const afterUrl = page.url();
      expect(new URL(afterUrl).pathname).toBe("/app/flashcards");
      expect(afterUrl).toContain("pathwayId=");
    });
  }
});
