/**
 * Shared helpers for `regression.full-platform.spec.ts` — diagnostics, SEO, link probes.
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { expect, type Page } from "@playwright/test";

export const FULL_REGRESSION_SCREENSHOT_DIR =
  process.env.FULL_REGRESSION_SCREENSHOT_DIR?.trim() ||
  join(process.cwd(), "docs/screenshots/playwright-full-regression");

const REACT_DEVTOOLS = /Download the React DevTools/i;
const HMR = /\[HMR\]|Fast Refresh/i;

export function benignConsoleText(msg: string): boolean {
  if (REACT_DEVTOOLS.test(msg)) return true;
  if (HMR.test(msg)) return true;
  if (msg.includes("Failed to load resource")) return true;
  return false;
}

export type RegressionDiagnostics = {
  consoleErrors: string[];
  pageErrors: string[];
  http500: string[];
};

export function attachRegressionDiagnostics(page: Page): RegressionDiagnostics {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const http500: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (benignConsoleText(text)) return;
    consoleErrors.push(text);
  });

  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });

  page.on("response", (res) => {
    const s = res.status();
    if (s >= 500 && s < 600 && res.request().resourceType() !== "websocket") {
      http500.push(`${s} ${res.url()}`);
    }
  });

  return { consoleErrors, pageErrors, http500 };
}

export async function ensureScreenshotDir(): Promise<void> {
  await mkdir(FULL_REGRESSION_SCREENSHOT_DIR, { recursive: true });
}

export async function captureRegressionShot(page: Page, basename: string): Promise<void> {
  await ensureScreenshotDir();
  await page.screenshot({
    path: join(FULL_REGRESSION_SCREENSHOT_DIR, `${basename}.png`),
    fullPage: false,
  });
}

/** Canonical + meta description + non-empty title (guest marketing pages). */
export async function assertSeoBasics(page: Page): Promise<void> {
  await expect
    .poll(async () => (await page.title()).trim().length, { timeout: 15_000 })
    .toBeGreaterThan(0);
  const title = await page.title();
  expect(title.toLowerCase(), "document.title").not.toContain("untitled");

  const canonCount = await page.locator('link[rel="canonical"]').count();
  expect(canonCount, "expected at least one canonical link").toBeGreaterThan(0);
  const canonHref = await page.locator('link[rel="canonical"]').first().getAttribute("href");
  expect(canonHref?.trim().length ?? 0, "canonical href").toBeGreaterThan(0);

  const desc = await page
    .locator('meta[name="description"]')
    .first()
    .getAttribute("content")
    .catch(() => "");
  expect((desc ?? "").trim().length, "meta description").toBeGreaterThan(10);
}

/** Sample same-origin anchors on `path`; HEAD request with navigation fallback. */
export async function probeInternalLinks(
  page: Page,
  origin: string,
  path: string,
  opts: { maxLinks?: number } = {},
): Promise<void> {
  const maxLinks = opts.maxLinks ?? 25;
  const hrefs = await page.evaluate(() => {
    const set = new Set<string>();
    for (const a of Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
      const h = a.getAttribute("href")?.trim();
      if (!h || h.startsWith("#") || h.startsWith("mailto:") || h.startsWith("tel:")) continue;
      if (h.includes("/admin")) continue;
      set.add(h);
      if (set.size >= 80) break;
    }
    return [...set];
  });

  let checked = 0;
  for (const href of hrefs) {
    if (checked >= maxLinks) break;
    let pathOnly = href;
    try {
      const u = new URL(href, origin);
      if (u.origin !== new URL(origin).origin) continue;
      pathOnly = u.pathname + u.search;
    } catch {
      continue;
    }
    const head = await page.request.head(pathOnly).catch(() => null);
    const st = head?.status() ?? 0;
    if (st === 405 || st === 404) {
      const get = await page.request.get(pathOnly, { maxRedirects: 5 }).catch(() => null);
      const gst = get?.status() ?? 0;
      expect(gst, `${pathOnly} GET`).toBeLessThan(400);
    } else {
      expect(st, `${pathOnly} HEAD`).toBeLessThan(400);
    }
    checked++;
  }
}

export async function assertNoAdminAnchorsInSample(page: Page, rootSel = "body"): Promise<void> {
  const bad = await page.evaluate((sel) => {
    const root = document.querySelector(sel) ?? document.body;
    return Array.from(root.querySelectorAll('a[href*="admin"]')).map(
      (a) => (a as HTMLAnchorElement).getAttribute("href") ?? "",
    );
  }, rootSel);
  expect(bad, `unexpected /admin links`).toEqual([]);
}

export async function softOverflowDelta(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}
