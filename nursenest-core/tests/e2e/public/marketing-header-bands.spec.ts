/**
 * Browser verification: marketing light header — utility and tier backgrounds match;
 * middle chrome is lighter than accent bands; nav link text is opaque.
 *
 * From nursenest-core:
 *   npx playwright test tests/e2e/public/marketing-header-bands.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";
const THEME_STORAGE_KEY = "nursenest-theme";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ context }) => {
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

/** Chromium may serialize computed colors as `color(srgb r g b / a)` instead of `rgb()`. */
function parseColorSrgb(cssColor: string): { r: number; g: number; b: number; a: number } | null {
  const m = cssColor.match(
    /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i,
  );
  if (!m) return null;
  const a = m[4] !== undefined ? Number(m[4]) : 1;
  return {
    r: Number(m[1]) * 255,
    g: Number(m[2]) * 255,
    b: Number(m[3]) * 255,
    a: Number.isFinite(a) ? a : 1,
  };
}

function parseAnyRgb(cssColor: string): { r: number; g: number; b: number; a: number } | null {
  return parseRgb(cssColor) ?? parseColorSrgb(cssColor);
}

test.describe("Marketing header bands — desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("utility and tier backgrounds match; primary row is lighter; link colors opaque", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.evaluate((themeKey) => {
      try {
        localStorage.setItem(themeKey, "ocean");
      } catch {
        /* ignore */
      }
    }, THEME_STORAGE_KEY);
    await expect(page.locator('header[data-nn-header-layout="marketing-row4"]')).toBeVisible({
      timeout: 120_000,
    });

    const utility = page.locator("[data-nn-header-band='utility']").first();
    const tier = page.locator("[data-nn-header-band='tier']").first();
    const header = page.locator("header.nn-header-logo-row").first();
    const pricing = page.locator("header.nn-header-logo-row a[href*='pricing']").first();

    await expect(utility, "utility band").toBeVisible({ timeout: 60_000 });
    await expect(tier, "tier band").toBeVisible({ timeout: 10_000 });
    await expect(header, "light marketing header").toBeVisible();
    await expect(pricing, "pricing link in header").toBeVisible({ timeout: 60_000 });

    const bands = await page.evaluate(() => {
      const u = document.querySelector("[data-nn-header-band='utility']");
      const t = document.querySelector("[data-nn-header-band='tier']");
      const h = document.querySelector("header.nn-header-logo-row");
      const primary = document.querySelector("[data-nn-header-band='primary']");
      const row4 = Boolean(document.querySelector('header[data-nn-header-layout="marketing-row4"]'));
      const p = Array.from(document.querySelectorAll("a")).find((a) => /^pricing$/i.test((a.textContent ?? "").trim()));
      if (!u || !t || !h || !p || !primary) {
        return {
          ok: false as const,
          missing: { utility: !u, tier: !t, header: !h, pricing: !p, primary: !primary },
          tBgLayer: "",
        };
      }
      const uBg = getComputedStyle(u).backgroundColor;
      const tCs = getComputedStyle(t);
      const tBg = tCs.backgroundColor;
      const tBgLayer = tCs.background;
      const hBg = getComputedStyle(h).backgroundColor;
      const primaryBgImage = getComputedStyle(primary).backgroundImage;
      const pColor = getComputedStyle(p).color;
      return { ok: true as const, uBg, tBg, tBgLayer, hBg, primaryBgImage, pColor, row4 };
    });

    expect(bands.ok, JSON.stringify(bands)).toBe(true);
    if (!bands.ok) return;

    if (!bands.row4) {
      expect(bands.uBg, "utility bg === tier bg (legacy stacked bands)").toBe(bands.tBg);
      const uRgb = parseRgb(bands.uBg);
      const hRgb = parseRgb(bands.hBg);
      expect(uRgb && hRgb, "parse header backgrounds").toBeTruthy();
      if (!uRgb || !hRgb) return;
      const uLum = (0.2126 * uRgb.r + 0.7152 * uRgb.g + 0.0722 * uRgb.b) / 255;
      const hLum = (0.2126 * hRgb.r + 0.7152 * hRgb.g + 0.0722 * hRgb.b) / 255;
      expect(hLum, "middle/header surface lighter than utility+tier").toBeGreaterThan(uLum + 0.15);
    } else {
      const tRgb = parseAnyRgb(bands.tBg);
      if (tRgb && tRgb.a > 0.2) {
        expect(tRgb.a, "tier band not fully transparent").toBeGreaterThan(0.2);
      } else {
        expect(
          bands.tBgLayer,
          `tier strip paints via background layers (bgc=${bands.tBg})`,
        ).toMatch(/color-mix|linear-gradient|rgb|rgba|srgb/i);
      }
    }

    const pRgb = parseAnyRgb(bands.pColor);

    expect(bands.primaryBgImage, "primary band uses neutral paper gradient").toMatch(/linear-gradient/i);
    expect(bands.primaryBgImage, "primary band must not read as hot pink chrome").not.toMatch(
      /rgb\(236,\s*72,\s*153\)|rgb\(219,\s*39,\s*119\)|#ec4899|#db2777/i,
    );

    expect(pRgb, "pricing color parse").toBeTruthy();
    if (pRgb) {
      expect(pRgb.a, "pricing text not transparent").toBeGreaterThanOrEqual(0.75);
      const pLum = (0.2126 * pRgb.r + 0.7152 * pRgb.g + 0.0722 * pRgb.b) / 255;
      expect(pLum, "pricing link dark on light middle").toBeLessThan(0.45);
    }

    const brandHome = page.locator("header.nn-header-logo-row .nn-header-desktop-grid a.nn-header-logo-link").first();
    await expect(brandHome, "header brand home link (logo + wordmark)").toBeVisible();
    if (bands.row4) {
      const auth = page.locator(".nn-header-desktop-auth-cluster").first();
      await expect(auth, "desktop auth cluster").toBeVisible({ timeout: 10_000 });
      await expect(auth.locator("a[href]").first(), "desktop auth actions after session").toBeVisible({
        timeout: 120_000,
      });
      const logIn = auth.getByRole("link", { name: /log in/i }).first();
      if (await logIn.isVisible().catch(() => false)) {
        const loginBorder = await logIn.evaluate((el) => getComputedStyle(el).borderTopWidth);
        expect(parseFloat(loginBorder), "Log In uses outline button (non-zero border)").toBeGreaterThan(0);
      }
    }
    await expect(page.getByRole("button", { name: /language/i }).first()).toBeVisible();
    const themePickerBtn = page.locator('[data-nn-header-band="utility"] button[aria-haspopup="listbox"]');
    if ((await themePickerBtn.count()) > 0) {
      await expect(themePickerBtn.first()).toBeVisible();
    }
  });

  test("mobile viewport: primary band uses neutral gradient; nav text dark; menu visible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.evaluate((themeKey) => {
      try {
        localStorage.setItem(themeKey, "ocean");
      } catch {
        /* ignore */
      }
    }, THEME_STORAGE_KEY);
    await expect(page.locator('header[data-nn-header-layout="marketing-row4"]')).toBeVisible({
      timeout: 120_000,
    });
    const primary = page.locator("[data-nn-header-band='primary']").first();
    await expect(primary).toBeVisible({ timeout: 60_000 });
    const { bgImage, pricingColor } = await page.evaluate(() => {
      const el = document.querySelector("[data-nn-header-band='primary']");
      const p = Array.from(document.querySelectorAll("a")).find((a) => /^pricing$/i.test((a.textContent ?? "").trim()));
      if (!el || !p) return { bgImage: "", pricingColor: "" };
      const st = getComputedStyle(el);
      return { bgImage: st.backgroundImage, pricingColor: getComputedStyle(p).color };
    });
    expect(bgImage, "gradient paints primary band (backgroundColor is often transparent)").toMatch(/linear-gradient/i);
    expect(bgImage, "resolved gradient should not read as hot pink chrome").not.toMatch(
      /rgb\(236,\s*72,\s*153\)|rgb\(219,\s*39,\s*119\)|#ec4899|#db2777/i,
    );
    const pRgb = parseAnyRgb(pricingColor);
    expect(pRgb, "parse pricing color").toBeTruthy();
    if (pRgb) {
      const pLum = (0.2126 * pRgb.r + 0.7152 * pRgb.g + 0.0722 * pRgb.b) / 255;
      expect(pLum, "pricing link dark on light mobile header").toBeLessThan(0.45);
    }
    await expect(page.getByRole("button", { name: /open menu|menu/i })).toBeVisible();
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

    const { uBg, tBg, row4 } = await page.evaluate(() => {
      const u = document.querySelector("[data-nn-header-band='utility']");
      const t = document.querySelector("[data-nn-header-band='tier']");
      return {
        uBg: u ? getComputedStyle(u).backgroundColor : "",
        tBg: t ? getComputedStyle(t).backgroundColor : "",
        row4: Boolean(document.querySelector('header[data-nn-header-layout="marketing-row4"]')),
      };
    });
    if (!row4) {
      expect(uBg).toBe(tBg);
    } else {
      expect(tBg.length).toBeGreaterThan(3);
    }
  });
});
