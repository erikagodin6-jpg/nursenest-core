import { expect, type APIRequestContext, type BrowserContext, type Page, type TestInfo, test } from "@playwright/test";
import { MARKETING_REGION_COOKIE, type MarketingRegionCookieValue } from "@/lib/region/marketing-region-cookie";
import { dismissMarketingScrims } from "./helpers/marketing-navigation-audit";
import { getE2eBaseURL } from "./helpers/e2e-env";

const baseURL = getE2eBaseURL();

type ViewportCase = {
  name: "desktop" | "mobile";
  viewport: { width: number; height: number };
};

type Journey = {
  name: string;
  region: MarketingRegionCookieValue;
  navigationLinkName: RegExp;
  followUpLinkName?: RegExp;
  followUpHref?: string;
  expectedPath: RegExp;
  contentSignals: RegExp[];
  ctaSignals: RegExp[];
};

const VIEWPORTS: ViewportCase[] = [
  { name: "desktop", viewport: { width: 1440, height: 1000 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
];

const JOURNEYS: Journey[] = [
  {
    name: "RN",
    region: "US",
    navigationLinkName: /^RN$/,
    expectedPath: /^\/us\/rn\/nclex-rn\/?$/,
    contentSignals: [/NCLEX-RN/i, /Registered Nurse|RN/i],
    ctaSignals: [/Sign up|Start|Practice|Lessons|Questions|CAT/i],
  },
  {
    name: "RPN",
    region: "CA",
    navigationLinkName: /^RPN$/,
    expectedPath: /^\/canada\/pn\/rex-pn\/?$/,
    contentSignals: [/REx-PN/i, /RPN|Practical Nurse|PN/i],
    ctaSignals: [/Sign up|Start|Practice|Lessons|Questions|CAT/i],
  },
  {
    name: "NP",
    region: "US",
    navigationLinkName: /^NP$/,
    expectedPath: /^\/np-exam-prep\/?$/,
    contentSignals: [/Nurse Practitioner|NP/i, /FNP|AANP|ANCC|specialty/i],
    ctaSignals: [/Choose|Start|Practice|Lessons|Questions|CAT/i],
  },
  {
    name: "CPNLE/CNPLE",
    region: "CA",
    navigationLinkName: /^NP$/,
    expectedPath: /^\/canada-np-exam-prep\/?$/,
    contentSignals: [/CNPLE|CPNLE/i, /Nurse Practitioner|NP/i, /Canada|Canadian/i],
    ctaSignals: [/Start|Practice|Questions|Study guide|Case|LOFT|Sign up/i],
  },
];

const IGNORED_CONSOLE_ERROR_PATTERNS = [
  /favicon/i,
  /ResizeObserver loop/i,
  /Failed to load resource: the server responded with a status of 404.*favicon/i,
  /\[nursenest-core\] marketing home_stats_cache_hit/i,
];

const IGNORED_REQUEST_FAILURE_PATTERNS = [
  /ERR_ABORTED/i,
  /googletagmanager/i,
  /google-analytics/i,
  /posthog/i,
  /vercel\/insights/i,
];

function sameOriginUrl(value: string): boolean {
  try {
    return new URL(value).origin === new URL(baseURL).origin;
  } catch {
    return false;
  }
}

async function seedVisitorRegion(context: BrowserContext, region: MarketingRegionCookieValue) {
  await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: region, url: baseURL }]);
  await context.addInitScript(
    ({ key, value }) => {
      try {
        localStorage.setItem(key, value);
        localStorage.setItem("nn_selector_dismissed", "1");
      } catch {
        /* ignore */
      }
    },
    { key: MARKETING_REGION_COOKIE, value: region },
  );
}

async function assertNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body?.scrollWidth ?? 0,
  }));
  expect(
    metrics.documentWidth,
    `expected no horizontal overflow: ${JSON.stringify(metrics)}`,
  ).toBeLessThanOrEqual(metrics.viewport + 2);
}

async function assertAccessibleFormsIfPresent(page: Page) {
  const forms = page.locator("form");
  const count = await forms.count();
  for (let i = 0; i < count; i += 1) {
    const form = forms.nth(i);
    await expect(form).toBeVisible();
    const controls = form.locator("input, select, textarea, button");
    const controlCount = await controls.count();
    expect(controlCount, "visible forms should expose fields or actions").toBeGreaterThan(0);
    for (let j = 0; j < Math.min(controlCount, 8); j += 1) {
      const control = controls.nth(j);
      const tagName = await control.evaluate((el) => el.tagName.toLowerCase());
      if (tagName === "input") {
        const type = await control.getAttribute("type");
        if (type === "hidden") continue;
      }
      const accessibleName = await control.evaluate((el) => {
        const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
        const id = el.getAttribute("id");
        const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent : "";
        const text = el.textContent;
        return `${aria ?? ""}${label ?? ""}${text ?? ""}`.trim();
      });
      expect(accessibleName.length, "form controls need an accessible name or label").toBeGreaterThan(0);
    }
  }
}

async function assertInternalLinksHealthy(page: Page, request: APIRequestContext, testInfo: TestInfo) {
  const hrefs = await page.locator("a[href]").evaluateAll((links) =>
    Array.from(
      new Set(
        links
          .map((link) => link.getAttribute("href") ?? "")
          .filter((href) => href.startsWith("/") && !href.startsWith("//") && !href.startsWith("#"))
          .filter((href) => !href.startsWith("/api/"))
          .filter((href) => !href.includes("logout"))
          .slice(0, 8),
      ),
    ),
  );

  const broken: Array<{ href: string; status: number; finalUrl: string }> = [];
  for (const href of hrefs) {
    const response = await request.get(new URL(href, baseURL).href, {
      maxRedirects: 4,
      timeout: 30_000,
    });
    if (response.status() >= 400) {
      broken.push({ href, status: response.status(), finalUrl: response.url() });
    }
  }

  if (broken.length > 0) {
    await testInfo.attach("broken-internal-links", {
      body: JSON.stringify(broken, null, 2),
      contentType: "application/json",
    });
  }
  expect(broken, "public visitor page should not expose broken internal links").toEqual([]);
}

async function assertJourneyPage(page: Page, request: APIRequestContext, journey: Journey, testInfo: TestInfo) {
  await expect(page.locator("body")).toBeVisible();
  await expect(page.getByRole("navigation").first()).toBeVisible();
  await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 30_000 });

  const bodyText = await page.locator("body").innerText({ timeout: 30_000 });
  for (const signal of journey.contentSignals) {
    expect(bodyText, `${journey.name} page missing content signal ${signal}`).toMatch(signal);
  }

  const ctaLocator = page.getByRole("link", { name: new RegExp(journey.ctaSignals.map((r) => r.source).join("|"), "i") });
  await expect(ctaLocator.first()).toBeVisible({ timeout: 30_000 });

  await assertAccessibleFormsIfPresent(page);
  await assertNoHorizontalOverflow(page);
  await assertInternalLinksHealthy(page, request, testInfo);
}

test.describe("public visitor pathway journeys", () => {
  for (const viewportCase of VIEWPORTS) {
    test.describe(viewportCase.name, () => {
      test.use({ viewport: viewportCase.viewport });

      for (const journey of JOURNEYS) {
        test(`${journey.name} visitor can select the correct pathway`, async ({ page, context, request }, testInfo) => {
          const consoleErrors: string[] = [];
          const requestFailures: string[] = [];
          const failedResponses: Array<{ url: string; status: number }> = [];

          page.on("console", (msg) => {
            if (msg.type() !== "error") return;
            const text = msg.text();
            if (IGNORED_CONSOLE_ERROR_PATTERNS.some((pattern) => pattern.test(text))) return;
            consoleErrors.push(text);
          });
          page.on("requestfailed", (req) => {
            const url = req.url();
            const failure = req.failure()?.errorText ?? "unknown";
            if (IGNORED_REQUEST_FAILURE_PATTERNS.some((pattern) => pattern.test(`${url} ${failure}`))) return;
            if (!sameOriginUrl(url)) return;
            requestFailures.push(`${req.method()} ${url} — ${failure}`);
          });
          page.on("response", (response) => {
            const url = response.url();
            const status = response.status();
            if (!sameOriginUrl(url)) return;
            if (status >= 400 && !url.includes("/favicon")) {
              failedResponses.push({ url, status });
            }
          });

          await seedVisitorRegion(context, journey.region);
          await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
          await dismissMarketingScrims(page);

          await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 60_000 });
          await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({ timeout: 60_000 });
          await assertNoHorizontalOverflow(page);
          if (viewportCase.name === "mobile") {
            await page.getByRole("button", { name: /open menu/i }).click();
          }
          await expect(page.getByRole("navigation").first()).toBeVisible();
          const pathwayNavigation = page.getByRole("navigation", { name: /Marketing Pathways/i }).first();
          const pathwayLink = pathwayNavigation.getByRole("link", { name: journey.navigationLinkName }).first();
          await expect(pathwayLink).toBeVisible({ timeout: 60_000 });

          await pathwayLink.click();
          await page.waitForLoadState("domcontentloaded", { timeout: 120_000 });
          await dismissMarketingScrims(page);

          if (journey.followUpHref || journey.followUpLinkName) {
            const followUp = journey.followUpHref
              ? page.locator(`a[href="${journey.followUpHref}"]`, { hasText: "Open hub" }).first()
              : page.getByRole("link", { name: journey.followUpLinkName! }).first();
            await expect(followUp).toBeVisible({ timeout: 60_000 });
            await followUp.click();
            await page.waitForLoadState("domcontentloaded", { timeout: 120_000 });
            await dismissMarketingScrims(page);
          }

          expect(new URL(page.url()).pathname).toMatch(journey.expectedPath);
          await assertJourneyPage(page, request, journey, testInfo);

          if (consoleErrors.length > 0) {
            await testInfo.attach("console-errors", {
              body: consoleErrors.join("\n"),
              contentType: "text/plain",
            });
          }
          if (requestFailures.length > 0) {
            await testInfo.attach("request-failures", {
              body: requestFailures.join("\n"),
              contentType: "text/plain",
            });
          }
          if (failedResponses.length > 0) {
            await testInfo.attach("failed-http-responses", {
              body: JSON.stringify(failedResponses, null, 2),
              contentType: "application/json",
            });
          }

          expect(consoleErrors, "browser console should not emit public visitor errors").toEqual([]);
          expect(requestFailures, "same-origin network requests should not fail").toEqual([]);
          expect(failedResponses, "same-origin browser responses should not be 4xx/5xx").toEqual([]);
        });
      }
    });
  }
});
