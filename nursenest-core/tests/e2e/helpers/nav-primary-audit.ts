import { expect, type Locator, type Page } from "@playwright/test";
import { learnerShellStudyNavigation } from "./learner-shell-locators";
import { expectNotPageNotFound } from "./navigation-e2e";

/** Console lines that indicate a hydration / SSR mismatch (fail the audit). */
const HYDRATION_RE =
  /hydration|did not match|Hydration failed|hydrated but some attributes|Minified React error #418|Minified React error #423/i;

export function attachHydrationAudit(page: Page): { lines: string[]; dispose: () => void } {
  const lines: string[] = [];
  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() !== "error") return;
    const t = msg.text();
    if (HYDRATION_RE.test(t)) lines.push(t);
  };
  page.on("console", onConsole);
  return {
    lines,
    dispose: () => page.off("console", onConsole),
  };
}

/**
 * Clicks each in-page link in order, starting from `startUrl` before every click
 * (avoids brittle history stacks).
 */
export async function auditNavLinks(args: {
  page: Page;
  baseURL: string;
  startUrl: string;
  links: Locator;
  label: string;
  /** e.g. reopen mobile menu after each navigation (drawer closes on route change). */
  beforeEachClick?: () => Promise<void>;
}): Promise<void> {
  const { page, baseURL, startUrl, links, label, beforeEachClick } = args;
  const origin = baseURL.replace(/\/$/, "");
  const seen = new Set<string>();

  await page.goto(startUrl, { waitUntil: "domcontentloaded" });
  if (beforeEachClick) {
    await beforeEachClick();
  }
  const count = await links.count();
  expect(count, `${label}: expected at least one link`).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await page.goto(startUrl, { waitUntil: "domcontentloaded" });
    if (beforeEachClick) {
      await beforeEachClick();
    }
    const link = links.nth(i);
    await expect(link).toBeVisible({ timeout: 15_000 });
    const href = await link.getAttribute("href");
    expect(href, `${label}: link ${i} missing href`).toBeTruthy();
    if (!href || href === "#" || href.startsWith("mailto:")) continue;

    const normalized = new URL(href, origin).pathname + new URL(href, origin).search;
    if (seen.has(normalized)) {
      throw new Error(`${label}: duplicate nav target "${normalized}" — possible duplicate route issue.`);
    }
    seen.add(normalized);

    await link.click();
    await page.waitForLoadState("domcontentloaded");
    const final = new URL(page.url());
    const expected = new URL(href, origin);
    expect(
      final.pathname,
      `${label}: expected pathname ${expected.pathname}, got ${final.pathname}`,
    ).toBe(expected.pathname);

    const expQ = new URLSearchParams(expected.search);
    const gotQ = new URLSearchParams(final.search);
    expQ.forEach((val, key) => {
      expect(gotQ.get(key), `${label}: query param ${key}=${val}`).toBe(val);
    });

    await expectMainHeadingVisible(page, `${label} → ${href}`);
    await expectNotBlankMain(page);
    await expectNotPageNotFound(page);
  }
}

async function expectMainHeadingVisible(page: Page, context: string): Promise<void> {
  const main = page.locator("main").first();
  await expect(main, `${context}: main landmark`).toBeVisible({ timeout: 30_000 });
  const h1 = main.getByRole("heading", { level: 1 });
  if ((await h1.count()) > 0) {
    await expect(h1.first(), `${context}: visible h1`).toBeVisible({ timeout: 15_000 });
  } else {
    await expect(main.getByRole("heading").first(), `${context}: visible heading in main`).toBeVisible({
      timeout: 15_000,
    });
  }
}

async function expectNotBlankMain(page: Page): Promise<void> {
  const txt = await page.locator("main").first().innerText().catch(() => "");
  expect(txt.trim().length, "main should not be blank").toBeGreaterThan(40);
}

/**
 * After navigation: document is not 404, main has a heading, and main is not effectively blank.
 * Use for learner `/app` flows and marketing pages with a single `<main>`.
 */
export async function assertLearnerRouteHealthy(page: Page, context: string): Promise<void> {
  await expectMainHeadingVisible(page, context);
  await expectNotBlankMain(page);
  await expectNotPageNotFound(page);
}

const MAIN_LINK_SKIP_RE =
  /\/api\/|\/logout|sign-?out|mailto:|^javascript:|^#|\.(png|jpe?g|gif|webp|svg|ico|woff2?)(\?|$)/i;

/**
 * HEAD/GET same-origin navigational links inside `<main>` (bounded) — catches obvious 404s in content.
 */
export async function assertNoObviousBrokenLinksInMain(page: Page, baseURL: string): Promise<void> {
  const origin = baseURL.replace(/\/$/, "");
  const paths = await page
    .locator("main")
    .locator("a[href]")
    .evaluateAll((els) => {
      const out: string[] = [];
      const seen = new Set<string>();
      for (const el of els) {
        const raw = (el as HTMLAnchorElement).getAttribute("href")?.trim() ?? "";
        if (!raw || raw === "#" || raw.startsWith("mailto:") || raw.startsWith("javascript:")) continue;
        let path: string;
        try {
          const u = new URL(raw, window.location.origin);
          if (u.origin !== window.location.origin) continue;
          path = u.pathname + u.search;
        } catch {
          continue;
        }
        if (seen.has(path)) continue;
        seen.add(path);
        out.push(path);
      }
      return out;
    });
  const filtered = paths.filter((p) => !MAIN_LINK_SKIP_RE.test(p)).slice(0, 40);
  for (const path of filtered) {
    const url = `${origin}${path}`;
    const res = await page.request.get(url, { maxRedirects: 15, timeout: 30_000 });
    expect(res.ok(), `same-origin link broken: GET ${url} → HTTP ${res.status()}`).toBeTruthy();
  }
}

export async function openMobileNavMenu(page: Page): Promise<void> {
  const open = page.getByRole("button", { name: /open menu/i });
  await expect(open).toBeVisible({ timeout: 30_000 });
  await open.click();
  await expect(page.getByRole("button", { name: /close menu/i })).toBeVisible({ timeout: 15_000 });
}

export function learnerHeaderNav(page: Page): Locator {
  return page.locator('[data-nn-nav-mode="learner"] nav[aria-label="Learner navigation"]');
}

export function learnerShellPrimaryNav(page: Page): Locator {
  return learnerShellStudyNavigation(page);
}

/** First scrollable drawer block: eyebrow + study links (entitled learner). */
export function learnerMobileDrawerStudyLinks(page: Page): Locator {
  const scroll = page.locator("div.min-h-0.flex-1.space-y-5.overflow-y-auto").first();
  return scroll.locator("div.space-y-1").first().getByRole("link");
}

export function learnerBottomNavLinks(page: Page): Locator {
  return page.getByRole("navigation", { name: "Learner bottom navigation" }).getByRole("link");
}
