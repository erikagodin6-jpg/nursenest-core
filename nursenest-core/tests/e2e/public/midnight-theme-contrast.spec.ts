/**
 * Midnight theme regression: token bridge must keep dark surfaces + readable body text (WCAG heuristic).
 * Run: `npm run test:e2e:midnight-contrast` from nursenest-core/
 */
import { join } from "node:path";
import { test, expect } from "@playwright/test";

const OUT_DIR = join(process.cwd(), "docs", "screenshots", "midnight-hotfix");

function relativeLuminance(rgb: [number, number, number]): number {
  const lin = rgb.map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!;
}

function parseCssColorToRgb(input: string): [number, number, number] | null {
  const s = input.trim();
  const m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(s);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const hex = /^#([0-9a-f]{6})$/i.exec(s);
  if (hex) {
    const n = parseInt(hex[1]!, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  return null;
}

function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
  const L1 = relativeLuminance(fg) + 0.05;
  const L2 = relativeLuminance(bg) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
}

async function assertMidnightBodyContrast(page: import("@playwright/test").Page, routeLabel: string): Promise<void> {
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "midnight"));
  const sample = await page.evaluate(() => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const fg = cs.color;
    const bg = cs.backgroundColor;
    const h1 = document.querySelector("h1");
    const h1Fg = h1 ? getComputedStyle(h1).color : fg;
    return { fg, bg, h1Fg };
  });
  const bgRgb = parseCssColorToRgb(sample.bg);
  const fgRgb = parseCssColorToRgb(sample.fg);
  const h1Rgb = parseCssColorToRgb(sample.h1Fg);
  expect(bgRgb, `${routeLabel}: body background parseable`).not.toBeNull();
  expect(fgRgb, `${routeLabel}: body color parseable`).not.toBeNull();
  if (bgRgb && fgRgb) {
    const r = contrastRatio(fgRgb, bgRgb);
    expect(r, `${routeLabel}: body text vs body bg contrast ≥ 4.5`).toBeGreaterThanOrEqual(4.45);
  }
  if (bgRgb && h1Rgb) {
    const r2 = contrastRatio(h1Rgb, bgRgb);
    expect(r2, `${routeLabel}: h1 vs body bg contrast ≥ 4.5`).toBeGreaterThanOrEqual(4.45);
  }
}

test.describe("Midnight theme contrast (marketing + learner shells)", () => {
  test.beforeAll(async () => {
    const fs = await import("node:fs");
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  /* Guest-safe marketing surfaces (authenticated /app/* varies by session + redirects). */
  for (const path of ["/", "/blog", "/pricing"] as const) {
    test(`midnight readable: ${path}`, async ({ page, baseURL }) => {
      test.skip(!baseURL, "baseURL required");
      await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
      await assertMidnightBodyContrast(page, path);
      await page.screenshot({
        path: join(OUT_DIR, `midnight-${path.replace(/\//g, "_") || "home"}.png`),
        fullPage: path === "/" || path === "/pricing",
      });
    });
  }
});
