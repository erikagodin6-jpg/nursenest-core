/**
 * Browser verification: marketing light header — utility and tier backgrounds match;
 * middle chrome is lighter than accent bands; nav link text is opaque.
 *
 * From nursenest-core:
 *   npx playwright test tests/e2e/public/marketing-header-bands.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
});

function parseRgb(cssColor: string): { r: number; g: number; b: number; a: number } | null {
  const m = cssColor.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (!m) return null;
  return {
    r: Number(m[1]),
    g: Number(m[2]),
    b: Number(m[3]),
    a: m[4] !== undefined ? Number(m[4]) : 1,
  };
}

test.describe("Marketing header bands — desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("utility and tier backgrounds match; primary row is lighter; link colors opaque", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });

    const utility = page.locator("[data-nn-header-band='utility']").first();
    const tier = page.locator("[data-nn-header-band='tier']").first();
    const header = page.locator("header.nn-header-logo-row").first();
    const pricing = page.getByRole("link", { name: /^pricing$/i }).first();

    await expect(utility, "utility band").toBeVisible({ timeout: 60_000 });
    await expect(tier, "tier band").toBeVisible({ timeout: 10_000 });
    await expect(header, "light marketing header").toBeVisible();
    await expect(pricing, "pricing link").toBeVisible();

    const bands = await page.evaluate(() => {
      const u = document.querySelector("[data-nn-header-band='utility']");
      const t = document.querySelector("[data-nn-header-band='tier']");
      const h = document.querySelector("header.nn-header-logo-row");
      const p = Array.from(document.querySelectorAll("a")).find((a) => /^pricing$/i.test((a.textContent ?? "").trim()));
      if (!u || !t || !h || !p) {
        return { ok: false as const, missing: { utility: !u, tier: !t, header: !h, pricing: !p } };
      }
      const uBg = getComputedStyle(u).backgroundColor;
      const tBg = getComputedStyle(t).backgroundColor;
      const hBg = getComputedStyle(h).backgroundColor;
      const pColor = getComputedStyle(p).color;
      return { ok: true as const, uBg, tBg, hBg, pColor };
    });

    expect(bands.ok, JSON.stringify(bands)).toBe(true);
    if (!bands.ok) return;

    expect(bands.uBg, "utility bg === tier bg").toBe(bands.tBg);

    const uRgb = parseRgb(bands.uBg);
    const hRgb = parseRgb(bands.hBg);
    const pRgb = parseRgb(bands.pColor);
    expect(uRgb && hRgb, "parse header backgrounds").toBeTruthy();
    if (!uRgb || !hRgb) return;

    const uLum = (0.2126 * uRgb.r + 0.7152 * uRgb.g + 0.0722 * uRgb.b) / 255;
    const hLum = (0.2126 * hRgb.r + 0.7152 * hRgb.g + 0.0722 * hRgb.b) / 255;
    expect(hLum, "middle/header surface lighter than utility+tier").toBeGreaterThan(uLum + 0.15);

    expect(pRgb, "pricing color parse").toBeTruthy();
    if (pRgb) {
      expect(pRgb.a, "pricing text not transparent").toBeGreaterThanOrEqual(0.95);
      const pLum = (0.2126 * pRgb.r + 0.7152 * pRgb.g + 0.0722 * pRgb.b) / 255;
      expect(pLum, "pricing link dark on light middle").toBeLessThan(0.45);
    }
  });

  test("blush theme: utility and tier backgrounds still match", async ({ page, context }) => {
    await context.addInitScript(() => {
      try {
        localStorage.setItem("nursenest-theme", "blush");
        localStorage.setItem("nn_selector_dismissed", "1");
      } catch {
        /* ignore */
      }
    });
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });

    const utility = page.locator("[data-nn-header-band='utility']").first();
    await expect(utility).toBeVisible({ timeout: 60_000 });

    const { uBg, tBg } = await page.evaluate(() => {
      const u = document.querySelector("[data-nn-header-band='utility']");
      const t = document.querySelector("[data-nn-header-band='tier']");
      return {
        uBg: u ? getComputedStyle(u).backgroundColor : "",
        tBg: t ? getComputedStyle(t).backgroundColor : "",
      };
    });
    expect(uBg).toBe(tBg);
  });
});
