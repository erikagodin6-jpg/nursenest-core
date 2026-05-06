/**
 * Flashcards hub inventory alignment for CA RN NCLEX-RN — category grid near top, no topic-load error copy.
 *
 * Run: `npm run test:e2e -- --grep "flashcards hub CA RN inventory"`
 */
import { expect, test } from "@playwright/test";
import { paidFlashcardsHubUrl } from "../helpers/paid-content-discovery";
import { expectPaidLearnerShellReady, learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

test.describe("flashcards hub CA RN inventory", () => {
  test("flashcards hub CA RN inventory — grid near top, nonzero category when bank seeded, no topic load error", async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(180_000);
    const pathwayId = "ca-rn-nclex-rn";
    const url = new URL(paidFlashcardsHubUrl(pathwayId), baseURL ?? "http://127.0.0.1:3000").toString();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, `flashcards inventory ${pathwayId}`);
    await expectNoSubscriptionPaywall(page, `flashcards inventory ${pathwayId}`);

    const notOnAccount = page.getByText("This study track is not on your account");
    test.skip(
      await notOnAccount.isVisible().catch(() => false),
      "Paid fixture has no entitlement for CA RN pathway — expand subscription pathways for this e2e.",
    );

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 120_000 });
    await expect(page.getByText("NN_RENDER_TRACE: flashcards live route")).toBeVisible({ timeout: 30_000 });

    await expect(main.locator("[data-nn-e2e-flashcards-hub]")).toBeVisible({ timeout: 90_000 });

    await expect(page.getByText("Could not load flashcard topics.")).toHaveCount(0);

    const grid = main.locator("[data-nn-e2e-flashcards-canonical-grid]");
    await expect(grid).toBeVisible({ timeout: 90_000 });
    const gridBox = await grid.boundingBox();
    expect(gridBox, "category grid should have layout").toBeTruthy();
    if (gridBox) {
      expect(gridBox.y, "category grid should appear without excessive vertical scroll").toBeLessThan(520);
    }

    const cards = main.locator("[data-nn-e2e-body-system-card]");
    await expect(cards.first()).toBeVisible({ timeout: 90_000 });
    const n = await cards.count();
    let maxCount = 0;
    for (let i = 0; i < n; i += 1) {
      const txt = (await cards.nth(i).innerText()).toLowerCase();
      const m = txt.match(/(\d+)\s+items?\s+in\s+pool/);
      if (m) maxCount = Math.max(maxCount, Number(m[1]));
    }
    expect(maxCount, "at least one canonical category should advertise a non-zero pool when bank is seeded").toBeGreaterThan(
      0,
    );
  });
});
