/**
 * Runtime DOM BreadcrumbList governance — release-gated semantic navigation.
 *
 * Run: npm run qa:semantic-navigation-gate
 */

import { expect, test } from "@playwright/test";
import { getE2eBaseURL } from "../helpers/e2e-env";
import {
  assertIndexableBreadcrumbSchema,
  assertLearnerNoBreadcrumbSchema,
  captureBreadcrumbGovernanceSnapshot,
  countBreadcrumbListInHtml,
} from "../helpers/semantic-navigation-governance";
import { assertClientTransitionContinuity } from "@/lib/breadcrumbs/governance/client-navigation-governance";
import { ACADEMY_PATHNAME_REGISTRY } from "@/lib/breadcrumbs/pathname-normalization";

const BASE_URL = getE2eBaseURL();

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 640 },
  { name: "ipad-portrait", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "ultra-wide", width: 1920, height: 1080 },
] as const;

const INDEXABLE_ROUTES = Object.values(ACADEMY_PATHNAME_REGISTRY).slice(0, 12);

const LEARNER_ROUTES = [
  "/app/account/focus-areas",
  "/app/practice-tests",
  "/app/coach",
] as const;

test.describe("Semantic navigation release gate — runtime", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const route of INDEXABLE_ROUTES) {
    for (const vp of VIEWPORTS) {
      test(`≤1 BreadcrumbList ${route} @ ${vp.name}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const res = await page.goto(`${BASE_URL}${route}`, {
          waitUntil: "networkidle",
          timeout: 90_000,
        });
        test.skip(res?.status() === 404, `${route} not deployed`);
        const snapshot = await assertIndexableBreadcrumbSchema(page, route);
        await testInfo.attach("structured-data-snapshot", {
          body: JSON.stringify(snapshot, null, 2),
          contentType: "application/json",
        });
        const expected = ACADEMY_PATHNAME_REGISTRY[route];
        if (expected) {
          expect(normalizePath(snapshot.pathname)).toBe(normalizePath(expected));
        }
      });
    }
  }

  for (const route of LEARNER_ROUTES) {
    test(`0 BreadcrumbList learner ${route}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 90_000 });
      const snapshot = await assertLearnerNoBreadcrumbSchema(page, route);
      await testInfo.attach("learner-schema-snapshot", {
        body: JSON.stringify(snapshot, null, 2),
        contentType: "application/json",
      });
    });
  }

  test("glossary client navigation — schema + pathname continuity", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const hubPath = "/nursing-glossary";
    const hubRes = await page.goto(`${BASE_URL}${hubPath}`, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    test.skip(hubRes?.status() === 404, "glossary hub unavailable");
    const hubSnap = await captureBreadcrumbGovernanceSnapshot(page, hubPath);
    expect(hubSnap.breadcrumbListCount).toBeLessThanOrEqual(1);

    const termLink = page.locator('a[href^="/nursing-glossary/"]').first();
    const href = await termLink.getAttribute("href");
    test.skip(!href, "no glossary term links");
    await termLink.click();
    await page.waitForLoadState("networkidle");
    const termPath = href!.split("?")[0]!;
    const termSnap = await captureBreadcrumbGovernanceSnapshot(page, termPath);
    expect(termSnap.breadcrumbListCount).toBeLessThanOrEqual(1);

    const transitionIssues = assertClientTransitionContinuity({
      fromPath: hubPath,
      toPath: termPath,
      fromBreadcrumbListCount: hubSnap.breadcrumbListCount,
      toBreadcrumbListCount: termSnap.breadcrumbListCount,
    });
    expect(transitionIssues, transitionIssues.join(";")).toEqual([]);

    await testInfo.attach("glossary-transition-snapshot", {
      body: JSON.stringify({ hub: hubSnap, term: termSnap, transitionIssues }, null, 2),
      contentType: "application/json",
    });
  });

  test("ECG topic leaf — no nested duplicate BreadcrumbList", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/ecg/sinus-rhythm`, { waitUntil: "networkidle", timeout: 90_000 });
    const html = await page.content();
    expect(countBreadcrumbListInHtml(html)).toBeLessThanOrEqual(1);
  });

  test("focus-area hub — learner schema suppressed after hydration", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/app/account/focus-areas`, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    await assertLearnerNoBreadcrumbSchema(page, "/app/account/focus-areas");
    const nav = page.locator('[aria-label="Breadcrumb"]').first();
    if (await nav.isVisible().catch(() => false)) {
      await expect(nav).toBeVisible();
    }
  });
});

function normalizePath(p: string): string {
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
}
