/**
 * Premium flashcards — rendered interaction checks (hub → custom session, weak-only preset, deck learn/test,
 * optional deterministic image deck, weak areas, reveal, themes, mobile overflow, stability, console/network hygiene).
 *
 * Optional env:
 *   FLASHCARDS_PREMIUM_E2E_PATHWAY_ID — pathway query for hub/custom/deck list (default: US RN from paid helpers).
 *   FLASHCARDS_PREMIUM_E2E_IMAGE_DECK_SLUG — when set, enables clinical-image layout assertions for that deck slug.
 *
 * Paid Playwright (learning-routes config + E2E_PAID_EMAIL / E2E_PAID_PASSWORD):
 *   npx playwright test -c playwright.learning-routes.config.ts tests/e2e/paid-user/flashcards-premium-interaction.spec.ts
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { resolveE2eAppBaseUrl } from "../helpers/e2e-env";
import { paidFlashcardsHubUrl } from "../helpers/paid-content-discovery";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  expectPaidLearnerShellReady,
  learnerAppMainLandmark,
} from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

const pathwayId =
  process.env.FLASHCARDS_PREMIUM_E2E_PATHWAY_ID?.trim() || PAID_E2E_DEFAULT_PATHWAY_ID;

const imageDeckSlug = process.env.FLASHCARDS_PREMIUM_E2E_IMAGE_DECK_SLUG?.trim() ?? "";

async function assertLearnerMainNoHorizontalOverflow(page: Page): Promise<void> {
  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible();
  const ok = await main.evaluate((el) => el.scrollWidth <= el.clientWidth + 2);
  expect(ok, "learner main should not horizontally overflow").toBe(true);
}

async function assertVisibleHttpImagesNotBroken(page: Page): Promise<void> {
  const broken = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")] as HTMLImageElement[];
    return imgs
      .filter((img) => {
        const src = img.getAttribute("src") || "";
        if (!src.startsWith("http")) return false;
        const r = img.getBoundingClientRect();
        const visible = r.width > 2 && r.height > 2;
        return visible && img.complete && img.naturalWidth === 0;
      })
      .map((img) => img.getAttribute("src") || "");
  });
  expect(broken, `broken visible images: ${broken.join(", ")}`).toEqual([]);
}

/** Visible http(s) images inside the premium flashcard session should fit their card column (no horizontal bleed). */
async function assertFlashcardSessionHttpImagesFitCard(page: Page): Promise<void> {
  const bad = await page.evaluate(() => {
    const layout = document.querySelector(".nn-flashcard-session-layout");
    if (!layout) return ["missing .nn-flashcard-session-layout"];
    const layoutRect = layout.getBoundingClientRect();
    const imgs = [...layout.querySelectorAll("img")].filter((img) =>
      (img.getAttribute("src") || "").startsWith("http"),
    ) as HTMLImageElement[];
    const out: string[] = [];
    for (const img of imgs) {
      const r = img.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      if (!img.complete || img.naturalWidth === 0) {
        out.push(`broken: ${img.getAttribute("src")?.slice(0, 80)}`);
        continue;
      }
      const card = img.closest(".nn-flashcard-hero-surface") ?? img.closest(".nn-flashcard-session-main") ?? layout;
      const cr = card.getBoundingClientRect();
      if (r.width > cr.width + 6 || r.left < cr.left - 4 || r.right > cr.right + 4) {
        out.push(`overflow: imgW=${Math.round(r.width)} cardW=${Math.round(cr.width)}`);
      }
      if (r.height > layoutRect.height + 80) {
        out.push(`tall: imgH=${Math.round(r.height)} layoutH=${Math.round(layoutRect.height)}`);
      }
    }
    return out;
  });
  expect(bad, bad.join("; ")).toEqual([]);
}

async function firstDeckSlug(page: Page, pid: string): Promise<string | null> {
  const res = await page.request.get(
    `/api/flashcards/decks?pathwayId=${encodeURIComponent(pid)}&pageSize=5&page=1`,
  );
  if (!res.ok()) return null;
  const json = (await res.json()) as { decks?: { slug?: string }[] };
  const slug = json.decks?.[0]?.slug?.trim();
  return slug && slug.length > 0 ? slug : null;
}

test.describe("Flashcards premium interaction (paid)", () => {
  test("hub → custom study: deck band, start CTA, premium shell, reveal, ratings, 5s stability", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    try {
      const url = new URL(paidFlashcardsHubUrl(pathwayId), resolveE2eAppBaseUrl(baseURL)).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "flashcards premium hub");
      await expectNoSubscriptionPaywall(page, "flashcards premium hub");

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(
        await notOnAccount.isVisible().catch(() => false),
        "Paid fixture has no entitlement for this pathway — set FLASHCARDS_PREMIUM_E2E_PATHWAY_ID or expand subscription pathways.",
      );

      const main = learnerAppMainLandmark(page);
      await expect(main).toBeVisible({ timeout: 120_000 });
      await expect(page.getByText("NN_RENDER_TRACE: flashcards live route")).toBeVisible({ timeout: 30_000 });
      await expect(main.locator("[data-nn-e2e-flashcards-hub]")).toBeVisible({ timeout: 90_000 });

      await expect(main.locator("[data-nn-e2e-flashcards-deck-band]")).toBeVisible({ timeout: 60_000 });

      const start = main.locator("[data-nn-e2e-start-review]");
      await expect(start).toBeVisible({ timeout: 90_000 });
      await expect(start).toBeEnabled();

      for (const theme of ["ocean", "blossom", "midnight", "sunset", "aurora"] as const) {
        await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
        await assertLearnerMainNoHorizontalOverflow(page);
      }

      await page.evaluate(() => document.documentElement.setAttribute("data-theme", "ocean"));

      await start.click();
      await page.waitForURL(/\/app\/flashcards\/custom/, { timeout: 120_000 });

      const shell = page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium");
      await expect(shell).toBeVisible({ timeout: 120_000 });
      await expect(shell.locator(".nn-exam-session-premium.nn-learner-exam-shell")).toBeVisible();
      await expect(shell.locator("[data-nn-premium-flashcard-study]")).toBeVisible();

      const noCards = page.getByRole("heading", { name: /no cards for this pathway yet/i });
      if (await noCards.isVisible().catch(() => false)) {
        test.skip(true, "No flashcards returned for custom session on this pathway/seed — cannot exercise reveal UI.");
      }

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });

      const revealBtn = page.locator(".nn-flashcard-reveal-cta--premium").first();
      if (await revealBtn.isVisible().catch(() => false)) {
        await revealBtn.click();
        await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });
        await expect(page.locator("[data-nn-premium-flashcard-reveal]").first()).toBeVisible({ timeout: 30_000 });
        await expect(page.locator("[data-nn-premium-flashcard-confidence]").first()).toBeVisible({ timeout: 30_000 });
        const easyBtn = page.getByRole("button", { name: /^Easy$/i });
        await expect(easyBtn).toBeVisible({ timeout: 30_000 });
        await expect(easyBtn).toBeEnabled();
        await easyBtn.click();
      }

      await assertVisibleHttpImagesNotBroken(page);
      await assertLearnerMainNoHorizontalOverflow(page);

      await page.waitForTimeout(5000);
      await assertLearnerMainNoHorizontalOverflow(page);

      if (process.env.FLASHCARD_E2E_SCREENSHOTS === "1") {
        const shot = await page.screenshot({ fullPage: true });
        await testInfo.attach("flashcards-custom-study-desktop.png", {
          body: shot,
          contentType: "image/png",
        });
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
    }
  });

  test("hub weak-only preset → Start session: URL weakOnly=1, shell or empty weak copy, no overflow", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    try {
      const url = new URL(paidFlashcardsHubUrl(pathwayId), resolveE2eAppBaseUrl(baseURL)).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "flashcards weak-only hub");
      await expectNoSubscriptionPaywall(page, "flashcards weak-only hub");

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(
        await notOnAccount.isVisible().catch(() => false),
        "Paid fixture has no entitlement for this pathway — set FLASHCARDS_PREMIUM_E2E_PATHWAY_ID.",
      );

      const main = learnerAppMainLandmark(page);
      await expect(main.locator("[data-nn-e2e-flashcards-hub]")).toBeVisible({ timeout: 90_000 });

      const details = main.locator("[data-nn-e2e-flashcards-secondary]");
      await expect(details).toBeVisible({ timeout: 30_000 });
      await details.evaluate((el: HTMLDetailsElement) => {
        el.open = true;
      });

      const weakPreset = main
        .locator("[data-nn-e2e-flashcard-filter-presets]")
        .getByRole("button", { name: "Weak areas", exact: true });
      await expect(weakPreset).toBeVisible({ timeout: 30_000 });
      await weakPreset.click();

      const start = main.locator("[data-nn-e2e-start-review]");
      await expect(start).toBeVisible({ timeout: 90_000 });
      const href = await start.getAttribute("href");
      expect(href ?? "", "Start session link should include weakOnly=1 after Weak areas preset").toMatch(/weakOnly=1/);

      await start.click();
      await page.waitForURL(/\/app\/flashcards\/custom/, { timeout: 120_000 });
      expect(page.url()).toMatch(/[?&]weakOnly=1(?:&|$)/);

      const emptyWeak = page.getByRole("heading", { name: /no weak-area flashcards yet/i });
      const shell = page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium");

      if (await emptyWeak.isVisible().catch(() => false)) {
        await expect(shell).toHaveCount(0);
      } else {
        await expect(shell).toBeVisible({ timeout: 120_000 });
        await expect(shell.locator(".nn-exam-session-premium.nn-learner-exam-shell")).toBeVisible();
      }

      await assertLearnerMainNoHorizontalOverflow(page);
      await page.waitForTimeout(3000);
      await assertLearnerMainNoHorizontalOverflow(page);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
    }
  });

  test("deck study learn + test: premium shell, mode chip, reveal path", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    try {
      const slug = await firstDeckSlug(page, pathwayId);
      test.skip(!slug, "No deck slugs returned from /api/flashcards/decks for this pathway — skip deck learn/test.");

      for (const mode of ["learn", "test"] as const) {
        const u = new URL(
          `/app/flashcards/${encodeURIComponent(slug!)}?start=1&mode=${mode}`,
          resolveE2eAppBaseUrl(baseURL),
        ).toString();
        await page.goto(u, { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, `flashcards deck ${mode}`);
        await expectNoSubscriptionPaywall(page, `flashcards deck ${mode}`);

        const shell = page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium");
        await expect(shell).toBeVisible({ timeout: 120_000 });

        const modeChip = page.locator(".nn-flashcard-chip--mode").first();
        await expect(modeChip).toContainText(mode === "test" ? "Test" : "Learn", { ignoreCase: true });

        const layout = page.locator(".nn-flashcard-session-layout").first();
        await expect(layout).toBeVisible({ timeout: 90_000 });
        const revealBtn = page.locator(".nn-flashcard-reveal-cta--premium").first();
        if (await revealBtn.isVisible().catch(() => false)) {
          await revealBtn.click();
          await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });
        }

        await assertLearnerMainNoHorizontalOverflow(page);
        await page.waitForTimeout(2000);
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
    }
  });

  test("deterministic image deck: learn mode, images not broken, fit card bounds", async ({ page, baseURL }, testInfo) => {
    test.skip(
      !imageDeckSlug,
      "Set FLASHCARDS_PREMIUM_E2E_IMAGE_DECK_SLUG to a deck slug that includes at least one https clinical figure for deterministic image layout coverage.",
    );
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    try {
      const u = new URL(
        `/app/flashcards/${encodeURIComponent(imageDeckSlug)}?start=1&mode=learn`,
        resolveE2eAppBaseUrl(baseURL),
      ).toString();
      await page.goto(u, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "flashcards image deck");
      await expectNoSubscriptionPaywall(page, "flashcards image deck");

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(await notOnAccount.isVisible().catch(() => false), "No entitlement for image deck study.");

      const shell = page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium");
      await expect(shell).toBeVisible({ timeout: 120_000 });

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });

      const httpImgs = page.locator(".nn-flashcard-session-layout img[src^='http']");
      const n = await httpImgs.count();
      expect(n, "Image deck should render at least one https image in the session layout").toBeGreaterThan(0);

      await assertVisibleHttpImagesNotBroken(page);
      await assertFlashcardSessionHttpImagesFitCard(page);
      await assertLearnerMainNoHorizontalOverflow(page);

      const revealBtn = page.locator(".nn-flashcard-reveal-cta--premium").first();
      if (await revealBtn.isVisible().catch(() => false)) {
        await revealBtn.click();
        await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });
        await assertVisibleHttpImagesNotBroken(page);
        await assertFlashcardSessionHttpImagesFitCard(page);
      }

      await page.waitForTimeout(2000);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
    }
  });

  test("weak areas: shell when queue loaded, hub parity markers", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    try {
      const u = new URL(
        `/app/flashcards/weak-areas?pathwayId=${encodeURIComponent(pathwayId)}`,
        resolveE2eAppBaseUrl(baseURL),
      ).toString();
      await page.goto(u, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "flashcards weak areas");
      await expectNoSubscriptionPaywall(page, "flashcards weak areas");

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(
        await notOnAccount.isVisible().catch(() => false),
        "Paid fixture has no entitlement for weak-areas pathway query.",
      );

      const empty = page.locator("[data-nn-e2e-flashcards-weak-study-empty]");
      const root = page.locator("[data-nn-e2e-flashcards-weak-study-root]");
      await expect(empty.or(root)).toBeVisible({ timeout: 120_000 });

      if (await root.isVisible().catch(() => false)) {
        await expect(root.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium")).toBeVisible({
          timeout: 90_000,
        });
        await expect(root.locator(".nn-exam-session-premium")).toBeVisible();
      }

      await assertLearnerMainNoHorizontalOverflow(page);
      await page.waitForTimeout(3000);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
    }
  });

  test("mobile viewport: hub → custom, reveal CTA focus + keyboard", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 390, height: 844 });
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    try {
      const url = new URL(paidFlashcardsHubUrl(pathwayId), resolveE2eAppBaseUrl(baseURL)).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "flashcards premium hub mobile");
      await expectNoSubscriptionPaywall(page, "flashcards premium hub mobile");

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(await notOnAccount.isVisible().catch(() => false), "No entitlement for pathway on mobile test.");

      const main = learnerAppMainLandmark(page);
      await expect(main.locator("[data-nn-e2e-start-review]")).toBeVisible({ timeout: 90_000 });
      await main.locator("[data-nn-e2e-start-review]").click();
      await page.waitForURL(/\/app\/flashcards\/custom/, { timeout: 120_000 });

      const noCards = page.getByRole("heading", { name: /no cards for this pathway yet/i });
      if (await noCards.isVisible().catch(() => false)) {
        test.skip(true, "No cards for custom session — skip mobile reveal.");
      }

      await expect(page.locator(".nn-premium-flashcard-session-root")).toBeVisible({ timeout: 120_000 });

      const revealBtn = page.locator(".nn-flashcard-reveal-cta--premium").first();
      if (await revealBtn.isVisible().catch(() => false)) {
        await revealBtn.focus();
        await expect(revealBtn).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page.locator(".nn-flashcard-session-layout").first()).toHaveAttribute(
          "data-nn-revealed",
          "1",
          { timeout: 30_000 },
        );
      }

      await assertLearnerMainNoHorizontalOverflow(page);
      await assertVisibleHttpImagesNotBroken(page);
      await page.waitForTimeout(5000);
      await assertLearnerMainNoHorizontalOverflow(page);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
    }
  });
});
