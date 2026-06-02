/**
 * Marketing pathway practice-questions hubs: pathway-specific hero copy, surface chips, header chrome per theme.
 *
 * From nursenest-core package root:
 *   npx playwright test tests/e2e/public/marketing-pathway-questions-hub.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { gotoExpectOk } from "../helpers/navigation-e2e";
import { resolveE2eAppBaseUrl } from "../helpers/e2e-env";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";
const THEME_STORAGE_KEY = "nursenest-theme";
const MARKETING_THEME_READABILITY_THEMES = ["ocean", "blossom", "midnight"] as const;

const QUESTIONS_HUB_ROOT = '[data-nn-qa-marketing-pathway-questions-hub="true"]';

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ context, browserName }) => {
  test.skip(browserName !== "chromium", "Marketing pathway questions hub probes run on Chromium only.");
  await context.addInitScript(
    ({ dismissedKey, themeKey }: { dismissedKey: string; themeKey: string }) => {
      try {
        localStorage.setItem(dismissedKey, "1");
        localStorage.setItem(themeKey, "ocean");
      } catch {
        /* ignore */
      }
    },
    { dismissedKey: SELECTOR_DISMISSED_LS, themeKey: THEME_STORAGE_KEY },
  );
});

async function gotoQuestionsHubWithTheme(
  page: import("@playwright/test").Page,
  pathname: string,
  theme: (typeof MARKETING_THEME_READABILITY_THEMES)[number],
): Promise<void> {
  await page.addInitScript(
    ({ themeKey, themeId }: { themeKey: string; themeId: string }) => {
      try {
        localStorage.setItem(themeKey, themeId);
      } catch {
        /* ignore */
      }
    },
    { themeKey: THEME_STORAGE_KEY, themeId: theme },
  );
  await gotoExpectOk(page, pathname);
  await page.evaluate(
    ({ themeKey, themeId }: { themeKey: string; themeId: string }) => {
      try {
        localStorage.setItem(themeKey, themeId);
        document.documentElement.setAttribute("data-theme", themeId);
      } catch {
        /* ignore */
      }
    },
    { themeKey: THEME_STORAGE_KEY, themeId: theme },
  );
  await page.waitForLoadState("domcontentloaded", { timeout: 60_000 }).catch(() => {});
  await dismissMarketingScrims(page);
}

async function assertMarketingHeaderChrome(page: import("@playwright/test").Page): Promise<void> {
  await expect(page.locator("header[data-nn-header-layout]").first()).toBeVisible({ timeout: 120_000 });
  await expect(page.locator('.nn-marketing-nav-v31-tier-rail[data-nn-header-band="tier"]').first()).toBeVisible({
    timeout: 60_000,
  });
}

/** Pathway-specific H1 must not read as a bare generic “Exam Practice Questions” title only. */
async function assertNonGenericHeroH1(
  page: import("@playwright/test").Page,
  opts: { minDistinctTokens: RegExp[] },
): Promise<void> {
  const h1 = page.locator("h1").first();
  await expect(h1).toBeVisible({ timeout: 90_000 });
  const text = (await h1.innerText()).trim();
  expect(text.length).toBeGreaterThan(12);
  expect(text).not.toMatch(/^NCLEX-RN\s+Practice\s+Questions$/i);
  expect(text).not.toMatch(/^Practice\s+Questions\s*$/i);
  for (const re of opts.minDistinctTokens) {
    expect(text, `H1 should match ${re}`).toMatch(re);
  }
}

async function assertEyebrowVisible(page: import("@playwright/test").Page): Promise<void> {
  const eyebrow = page.locator("p.nn-marketing-eyebrow").first();
  await expect(eyebrow).toBeVisible({ timeout: 90_000 });
}

async function assertChipRow(
  page: import("@playwright/test").Page,
  origin: string,
  patterns: {
    lessons: RegExp;
    cat: RegExp;
    flashcards: RegExp;
    practiceTests: RegExp;
    overview: RegExp;
  },
): Promise<void> {
  const chips = page.locator('[data-testid="lesson-hub-surface-chips"]');
  await expect(chips).toBeVisible({ timeout: 90_000 });
  const links = chips.locator("a[href]");
  await expect(links).toHaveCount(5);
  const hrefs = await links.evaluateAll((els) => els.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""));
  for (const href of hrefs) {
    expect(href.length, `chip href must be non-empty: ${href}`).toBeGreaterThan(0);
    const u = new URL(href, origin);
    expect(u.protocol === "http:" || u.protocol === "https:").toBe(true);
  }
  expect(hrefs.some((h) => patterns.lessons.test(h))).toBe(true);
  expect(hrefs.some((h) => patterns.cat.test(h))).toBe(true);
  expect(hrefs.some((h) => patterns.flashcards.test(h))).toBe(true);
  expect(hrefs.some((h) => patterns.practiceTests.test(h))).toBe(true);
  expect(hrefs.some((h) => patterns.overview.test(h))).toBe(true);
}

async function assertDocumentTitlePathwayScoped(
  page: import("@playwright/test").Page,
  opts: { mustMatch: RegExp[]; mustNotEqual?: RegExp },
): Promise<void> {
  const title = await page.title();
  for (const re of opts.mustMatch) {
    expect(title, `document.title should match ${re}`).toMatch(re);
  }
  if (opts.mustNotEqual) {
    expect(title).not.toMatch(opts.mustNotEqual);
  }
}

async function assertNoRawScaffoldText(page: import("@playwright/test").Page): Promise<void> {
  await expect(page.getByText("undefined", { exact: true })).toHaveCount(0);
  await expect(page.getByText("NaN", { exact: true })).toHaveCount(0);
  await expect(page.getByText("[object Object]", { exact: true })).toHaveCount(0);
}

test.describe("Marketing pathway questions hub", () => {
  test.setTimeout(240_000);
  test("Canada RN hub: H1, eyebrow, chips, title, header tier rail; hub shell class stable across Ocean/Blossom/Midnight", async ({
    page,
    baseURL,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const origin = resolveE2eAppBaseUrl(baseURL);

    let oceanHubClass: string | null = null;
    for (const theme of MARKETING_THEME_READABILITY_THEMES) {
      await gotoQuestionsHubWithTheme(page, "/canada/rn/nclex-rn/questions", theme);

      await assertMarketingHeaderChrome(page);

      await assertNonGenericHeroH1(page, {
        minDistinctTokens: [/NCLEX-RN/i, /Canada|Canadian/i, /practice questions/i],
      });

      await assertEyebrowVisible(page);
      await expect(page.locator("p.nn-marketing-eyebrow").first()).toContainText(/Canada/i);

      await assertChipRow(page, origin, {
        lessons: /\/canada\/rn\/nclex-rn\/lessons/i,
        cat: /\/canada\/rn\/nclex-rn\/cat/i,
        flashcards: /\/app\/flashcards\?pathwayId=ca-rn-nclex-rn/i,
        practiceTests: /\/app\/practice-tests\?pathwayId=ca-rn-nclex-rn/i,
        overview: /\/canada\/rn\/nclex-rn\/?$/i,
      });

      await assertDocumentTitlePathwayScoped(page, {
        mustMatch: [/NCLEX-RN/i, /Canada|Canadian/i, /NurseNest$/],
        mustNotEqual: /^Practice Questions\s*\|\s*NurseNest$/i,
      });
      await assertNoRawScaffoldText(page);

      const hub = page.locator(QUESTIONS_HUB_ROOT).first();
      await expect(hub).toBeVisible();
      const cls = (await hub.getAttribute("class")) ?? "";
      if (theme === "ocean") {
        oceanHubClass = cls;
      } else {
        expect(cls, `questions hub shell className must match Ocean across themes (${theme})`).toBe(oceanHubClass);
      }
      const dataTheme = await page.locator("html").getAttribute("data-theme");
      expect(dataTheme).toBe(theme);
    }
  });

  test("Canada PN REx-PN hub: H1, eyebrow, chips, title, themes", async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const origin = resolveE2eAppBaseUrl(baseURL);

    for (const theme of MARKETING_THEME_READABILITY_THEMES) {
      await gotoQuestionsHubWithTheme(page, "/canada/pn/rex-pn/questions", theme);
      await assertMarketingHeaderChrome(page);

      await assertNonGenericHeroH1(page, {
        minDistinctTokens: [/REx-PN/i, /\(RPN\)/, /practice questions for Canada/i],
      });

      await assertEyebrowVisible(page);

      await assertChipRow(page, origin, {
        lessons: /\/canada\/pn\/rex-pn\/lessons/i,
        cat: /\/canada\/pn\/rex-pn\/cat/i,
        flashcards: /\/app\/flashcards\?pathwayId=ca-rpn-rex-pn/i,
        practiceTests: /\/app\/practice-tests\?pathwayId=ca-rpn-rex-pn/i,
        overview: /\/canada\/pn\/rex-pn\/?$/i,
      });

      await assertDocumentTitlePathwayScoped(page, {
        mustMatch: [/REx-PN/i, /NurseNest$/],
        mustNotEqual: /^Practice Questions\s*\|\s*NurseNest$/i,
      });
      await assertNoRawScaffoldText(page);

      expect(await page.locator("html").getAttribute("data-theme")).toBe(theme);
    }
  });

  test("Canada NP CNPLE hub: H1, chips, title (canonical marketing NP track)", async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const origin = resolveE2eAppBaseUrl(baseURL);

    for (const theme of MARKETING_THEME_READABILITY_THEMES) {
      await gotoQuestionsHubWithTheme(page, "/canada/np/cnple/questions", theme);
      await assertMarketingHeaderChrome(page);

      await assertNonGenericHeroH1(page, {
        minDistinctTokens: [/exam prep questions/i, /Canada|Canadian/i],
      });
      await assertEyebrowVisible(page);

      await assertChipRow(page, origin, {
        lessons: /\/canada\/np\/cnple\/lessons/i,
        cat: /\/canada\/np\/cnple\/cat/i,
        flashcards: /\/app\/flashcards\?pathwayId=ca-np-cnple/i,
        practiceTests: /\/app\/practice-tests\?pathwayId=ca-np-cnple/i,
        overview: /\/canada\/np\/cnple\/?$/i,
      });

      await assertDocumentTitlePathwayScoped(page, {
        mustMatch: [/CNPLE|exam prep questions/i, /NurseNest$/],
        mustNotEqual: /^Practice Questions\s*\|\s*NurseNest$/i,
      });
      await assertNoRawScaffoldText(page);

      expect(await page.locator("html").getAttribute("data-theme")).toBe(theme);
    }
  });

});
