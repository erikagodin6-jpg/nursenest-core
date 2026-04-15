/**
 * Public marketing smoke: fast checks that core unauthenticated routes render and stay clean
 * (shell visible, no obvious 404, no unexpected console errors or failed requests).
 *
 * Run: `npx playwright test tests/e2e/public/smoke.spec.ts`
 * Needs app: `BASE_URL=http://127.0.0.1:3000 npm run dev`
 */
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics, type PageObservers } from "../helpers/attach-observers";
import { HEADER_CHROME, getE2eBaseURL } from "../helpers/country-selector";
import { LESSON_FLOW_PATHWAY_QA } from "../../../src/lib/qa/lesson-flow-pathways";

const baseURL = getE2eBaseURL();

const usRn = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "us-rn-nclex-rn");
const caRn = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "ca-rn-nclex-rn");

if (!usRn || !caRn) {
  throw new Error("lesson-flow-pathways: us-rn-nclex-rn / ca-rn-nclex-rn required for public smoke");
}

async function gotoExpect2xx(page: Page, path: string) {
  const r = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(r?.ok(), `HTTP ${r?.status()} for ${path}`).toBeTruthy();
}

/** Public marketing layout: header chrome + main landmark (or body fallback). */
async function expectPublicShell(page: Page) {
  await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  await expect(page.locator(HEADER_CHROME).first()).toBeVisible({ timeout: 30_000 });
  const main = page.locator("main, [role='main']").first();
  if (await main.isVisible().catch(() => false)) {
    await expect(main).toBeVisible();
  } else {
    await expect(page.locator("body")).toBeVisible();
  }
}

async function expectNoObvious404(page: Page) {
  const dead = await page
    .getByRole("heading", { name: /^404|Not [Ff]ound|Page not found/i })
    .first()
    .isVisible()
    .catch(() => false);
  expect(dead, "unexpected 404 / not-found heading").toBe(false);
}

async function recordAndAssertCleanObservers(
  o: PageObservers,
  testInfo: TestInfo,
  routeLabel: string,
) {
  const { consoleErrors, failedRequests } = o;
  const seriousConsole = seriousPublicSmokeConsoleErrors(consoleErrors);
  await logObserverDiagnostics(o, routeLabel);
  await testInfo.attach(`public-smoke-${slugify(routeLabel)}.json`, {
    body: Buffer.from(
      JSON.stringify(
        {
          route: routeLabel,
          consoleErrorsRaw: consoleErrors,
          consoleErrorsSerious: seriousConsole,
          failedRequests,
        },
        null,
        2,
      ),
    ),
    contentType: "application/json",
  });
  expect(seriousConsole, `unexpected console errors on ${routeLabel} (see attachment for raw)`).toEqual([]);
  expect(failedRequests, `failed requests on ${routeLabel}`).toEqual([]);
}

function slugify(s: string) {
  return s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "page";
}

/**
 * Dev/local runs often emit Auth.js + Next dev "Server" styled logs when `AUTH_SECRET` (or full auth config)
 * is missing — not a public-page regression. We still attach **raw** console lines to the test report;
 * assertions use this filter so smoke stays useful without tuning every dev machine.
 */
function seriousPublicSmokeConsoleErrors(errors: string[]): string[] {
  return errors.filter((t) => {
    if (/assertConfig|@auth_core|authjs\.dev#autherror/i.test(t)) return false;
    if (/ClientFetchError:.*server configuration|There was a problem with the server configuration/i.test(t)) {
      return false;
    }
    // Session fetch 500s often log without the URL in the same string as Auth.js misconfiguration.
    if (/Failed to load resource: the server responded with a status of 500/i.test(t)) return false;
    if (/background:.*light-dark.*Server\s*$/i.test(t) || /at Auth \(.*@auth_core/i.test(t)) return false;
    return true;
  });
}

async function visitPublicPage(
  page: Page,
  testInfo: TestInfo,
  path: string,
  routeLabel: string,
  afterLoad?: (page: Page) => Promise<void>,
) {
  const o = attachPageObservers(page, { profile: "public" });
  try {
    await gotoExpect2xx(page, path);
    await expectPublicShell(page);
    await expectNoObvious404(page);
    if (afterLoad) await afterLoad(page);
    await recordAndAssertCleanObservers(o, testInfo, routeLabel);
  } finally {
    o.dispose();
  }
}

test.describe("Public smoke (core routes)", () => {
  test("homepage loads", async ({ page }, testInfo) => {
    await visitPublicPage(page, testInfo, "/", "homepage", async (p) => {
      await expect(p.getByRole("link", { name: /NurseNest home/i })).toBeVisible();
    });
  });

  test("top navigation renders", async ({ page }, testInfo) => {
    const o = attachPageObservers(page, { profile: "public" });
    try {
      await gotoExpect2xx(page, "/");
      await expectPublicShell(page);
      await expectNoObvious404(page);
      const chrome = page.locator(HEADER_CHROME);
      await expect(chrome.getByRole("link", { name: /^Pricing$/i }).first()).toBeVisible({ timeout: 15_000 });
      await expect(chrome.getByRole("link", { name: /NurseNest home|Home/i }).first()).toBeVisible();
      await recordAndAssertCleanObservers(o, testInfo, "top-nav");
    } finally {
      o.dispose();
    }
  });

  test("pricing page loads", async ({ page }, testInfo) => {
    await visitPublicPage(page, testInfo, "/pricing", "pricing");
  });

  test("login page loads", async ({ page }, testInfo) => {
    const o = attachPageObservers(page, { profile: "public" });
    try {
      await gotoExpect2xx(page, "/login");
      await expect(page.getByRole("heading", { name: /log in|sign in/i })).toBeVisible({ timeout: 30_000 });
      await expectNoObvious404(page);
      await recordAndAssertCleanObservers(o, testInfo, "login");
    } finally {
      o.dispose();
    }
  });

  test("signup page loads", async ({ page }, testInfo) => {
    const o = attachPageObservers(page, { profile: "public" });
    try {
      await gotoExpect2xx(page, "/signup");
      await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });
      await expectNoObvious404(page);
      await recordAndAssertCleanObservers(o, testInfo, "signup");
    } finally {
      o.dispose();
    }
  });

  test("US pathway hub loads", async ({ page }, testInfo) => {
    await visitPublicPage(page, testInfo, usRn.hubPath, `US hub ${usRn.pathwayId}`);
  });

  test("Canada pathway hub loads", async ({ page }, testInfo) => {
    await visitPublicPage(page, testInfo, caRn.hubPath, `Canada hub ${caRn.pathwayId}`);
  });

  test("lesson hub loads (US RN)", async ({ page }, testInfo) => {
    await visitPublicPage(page, testInfo, usRn.lessonsPath, `lessons hub ${usRn.pathwayId}`);
  });

  test("blog hub loads if present", async ({ page }, testInfo) => {
    const o = attachPageObservers(page, { profile: "public" });
    try {
      const r = await page.goto("/blog", { waitUntil: "domcontentloaded" });
      if (!r?.ok()) {
        test.skip(true, `Blog route HTTP ${r?.status() ?? "no response"} — skipping`);
        return;
      }
      const looks404 = await page
        .getByRole("heading", { name: /^404|^Not [Ff]ound|^Page not found/i })
        .first()
        .isVisible()
        .catch(() => false);
      if (looks404) {
        test.skip(true, "Blog hub not present (404 content)");
        return;
      }
      await expectPublicShell(page);
      await expectNoObvious404(page);
      await recordAndAssertCleanObservers(o, testInfo, "blog");
    } finally {
      o.dispose();
    }
  });

  test("footer links are not obviously broken (sample)", async ({ page }, testInfo) => {
    const o = attachPageObservers(page, { profile: "public" });
    try {
      await gotoExpect2xx(page, "/");
      await expectPublicShell(page);
      const footer = page.locator("footer");
      await expect(footer).toBeVisible({ timeout: 15_000 });
      const hrefs = await footer.locator('a[href^="/"]').evaluateAll((els) =>
        [...new Set(els.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""))].filter(
          (h) => h && !h.startsWith("/app") && h !== "/",
        ),
      );
      const sample = hrefs.slice(0, 8);
      expect(sample.length, "expected footer internal links").toBeGreaterThan(0);
      for (const path of sample) {
        const r = await page.goto(path, { waitUntil: "domcontentloaded" });
        expect(r?.ok(), `${path} HTTP ${r?.status()}`).toBeTruthy();
        const nf = await page
          .getByRole("heading", { name: /^404|^Not [Ff]ound/i })
          .isVisible()
          .catch(() => false);
        expect(nf, `unexpected 404 page for ${path}`).toBe(false);
      }
      await gotoExpect2xx(page, "/");
      await recordAndAssertCleanObservers(o, testInfo, "footer-sample");
    } finally {
      o.dispose();
    }
  });
});
