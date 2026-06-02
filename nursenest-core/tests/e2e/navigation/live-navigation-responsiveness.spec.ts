import { expect, test, type Page } from "@playwright/test";

const ORIGIN = process.env.PLAYWRIGHT_LIVE_NAV_ORIGIN?.replace(/\/$/, "") || undefined;

type NavCase = {
  label: string;
  href: string;
  pathPattern: RegExp;
};

const NAV_CASES: NavCase[] = [
  { label: "Pricing", href: "/pricing", pathPattern: /\/pricing(?:\/|$)/ },
  { label: "Blog", href: "/blog", pathPattern: /\/blog(?:\/|$)/ },
  { label: "RN", href: "/canada/rn/nclex-rn", pathPattern: /\/canada\/rn\/nclex-rn(?:\/|$)/ },
  { label: "RPN", href: "/canada/pn/rex-pn", pathPattern: /\/canada\/pn\/rex-pn(?:\/|$)/ },
  { label: "NP", href: "/canada-np-exam-prep", pathPattern: /\/canada-np-exam-prep(?:\/|$)/ },
  { label: "Allied", href: "/allied/allied-health", pathPattern: /\/allied\/allied-health(?:\/|$)/ },
  { label: "Start Free", href: "/signup", pathPattern: /\/signup(?:\/|$)/ },
];

async function gotoHome(page: Page, baseURL: string | undefined) {
  const url = ORIGIN ? `${ORIGIN}/` : "/";
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expect(page.locator("header[data-nn-nav-mode]").first()).toBeVisible({ timeout: 20_000 });
  await page.evaluate(() => {
    try {
      window.localStorage.setItem("nn-nav-debug", "1");
    } catch {
      /* ignore */
    }
  });
  if (!ORIGIN && baseURL) await page.waitForURL(new RegExp(new URL(baseURL).origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

async function clickAndMeasure(page: Page, navCase: NavCase) {
  const selector =
    navCase.label === "Start Free"
      ? `header a[href^="${navCase.href}"][aria-label*="Start free"]`
      : `header a[href="${navCase.href}"]`;
  const linkCandidates = page.locator(selector);
  const link =
    navCase.label === "Start Free"
      ? linkCandidates.filter({ visible: true }).first()
      : linkCandidates.filter({ hasText: navCase.label, visible: true }).first();
  await expect(link, `${navCase.label} link should be visible`).toBeVisible({ timeout: 20_000 });
  const box = await link.boundingBox();
  expect(box, `${navCase.label} link should have a clickable bounding box`).not.toBeNull();
  const clickX = box!.x + box!.width / 2;
  const clickY = box!.y + box!.height / 2;
  await page.mouse.move(clickX, clickY);

  const navigationRequestPromise = page
    .waitForRequest(
      (request) => {
        if (!request.isNavigationRequest()) return false;
        try {
          return navCase.pathPattern.test(new URL(request.url()).pathname);
        } catch {
          return false;
        }
      },
      { timeout: 5_000 },
    )
    .then(() => Date.now());
  const urlCommitPromise = page.waitForURL((url) => navCase.pathPattern.test(url.pathname), { timeout: 5_000 }).then(() => Date.now());
  const destinationStartPromise = Promise.race([
    navigationRequestPromise.catch(() => new Promise<number>(() => {})),
    urlCommitPromise,
  ]);

  const visualPendingPromise = page
    .waitForFunction(() => document.documentElement.dataset.nnNavPending === "true", null, { timeout: 250 })
    .then(() => Date.now())
    .catch(() => new Promise<number>(() => {}));

  const startedAt = Date.now();
  await page.mouse.down();
  await page.mouse.up();

  const firstResponseAt = await Promise.race([visualPendingPromise, destinationStartPromise]);
  const destinationStartAt = await destinationStartPromise;
  await page.waitForURL((url) => navCase.pathPattern.test(url.pathname), { timeout: 60_000 });

  const diagnostics = await page.evaluate(() => {
    const w = window as Window & {
      __nnNavDiagnostics?: {
        clicks?: Array<{ t: number; label: string; href: string }>;
        intents?: Array<{ t: number; href: string }>;
        longTasks?: Array<{ start: number; duration: number }>;
      };
    };
    return w.__nnNavDiagnostics ?? null;
  }).catch(() => null);

  return {
    firstResponseMs: firstResponseAt - startedAt,
    navigationRequestMs: destinationStartAt - startedAt,
    diagnostics,
  };
}

test.use({
  viewport: { width: 1440, height: 900 },
  trace: "on",
  screenshot: "only-on-failure",
  video: "retain-on-failure",
});

test.describe("live marketing navigation responsiveness", () => {
  for (const navCase of NAV_CASES) {
    test(`${navCase.label} responds within interaction budget`, async ({ page, baseURL }, testInfo) => {
      await gotoHome(page, baseURL);
      const result = await clickAndMeasure(page, navCase);
      testInfo.attach("navigation-diagnostics", {
        body: JSON.stringify(result, null, 2),
        contentType: "application/json",
      });
      expect(result.firstResponseMs, `${navCase.label} should show visible feedback or start navigation within 250ms`).toBeLessThanOrEqual(250);
      expect(result.navigationRequestMs, `${navCase.label} should start a destination navigation request within 500ms`).toBeLessThanOrEqual(500);
    });
  }
});
