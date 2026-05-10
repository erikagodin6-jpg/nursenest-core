/**
 * Marketing theme propagation: every public route must respond to theme switching.
 *
 * Asserts propagation for every id in `PUBLIC_MARKETING_THEME_ALLOWLIST` (Ocean, Midnight, Blossom, Aurora, Sunset)
 * on `/`, `/pricing`, `/blog`, selected blog slug, and RN hub; captures pricing + blog screenshots for all five.
 * PN pathway hub `.lv-card` (LearnerSurfaceCard) is checked across the same allowlist.
 *  - `html[data-theme]` actually changes when the picker is used
 *  - computed CSS variable colors (page bg, surface, heading, body text, border, brand) shift
 *    between themes
 *  - body and the first card surface render with theme-aware background/text colors
 *  - layout height stays within tight tolerance (no layout shift between themes)
 *
 * Run with auto local dev server:
 *   cd nursenest-core && npx playwright test tests/e2e/public/marketing-theme-propagation.spec.ts \
 *     --project=chromium
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import {
  PUBLIC_MARKETING_THEME_ALLOWLIST,
  themeOptionsForPublicMarketingPicker,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

const SCREENSHOT_DIR = join("docs", "screenshots", "marketing-theme-propagation");
mkdirSync(SCREENSHOT_DIR, { recursive: true });

type ThemeSnapshot = {
  dataTheme: string;
  pageBgVar: string;
  surfaceVar: string;
  headingVar: string;
  bodyTextVar: string;
  borderVar: string;
  brandVar: string;
  ctaVar: string;
  bodyBgRendered: string;
  bodyColorRendered: string;
  documentHeight: number;
};

async function readThemeSnapshot(page: Page): Promise<ThemeSnapshot> {
  return page.evaluate(() => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const bodyCs = getComputedStyle(document.body);
    return {
      dataTheme: root.getAttribute("data-theme") ?? "",
      pageBgVar: cs.getPropertyValue("--theme-page-bg").trim(),
      surfaceVar:
        cs.getPropertyValue("--theme-surface").trim() ||
        cs.getPropertyValue("--theme-card-bg").trim(),
      headingVar: cs.getPropertyValue("--theme-heading-text").trim(),
      bodyTextVar: cs.getPropertyValue("--theme-body-text").trim(),
      borderVar: cs.getPropertyValue("--theme-border").trim(),
      brandVar:
        cs.getPropertyValue("--semantic-brand").trim() ||
        cs.getPropertyValue("--theme-primary").trim(),
      ctaVar: cs.getPropertyValue("--role-cta").trim(),
      bodyBgRendered: bodyCs.backgroundColor,
      bodyColorRendered: bodyCs.color,
      documentHeight: document.documentElement.scrollHeight,
    };
  });
}

async function selectThemeViaPicker(page: Page, label: RegExp): Promise<void> {
  const trigger = page.getByRole("button", { name: /^Theme\b/i }).first();
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(trigger).toBeEnabled({ timeout: 60_000 });
  await trigger.click();
  const listbox = page.getByRole("listbox");
  await expect(listbox).toBeVisible({ timeout: 5_000 });
  await page.getByRole("option", { name: label }).first().click();
  // `disableTransitionOnChange` keeps style writes synchronous; tiny wait covers the
  // useLayoutEffect tick where ThemeStateHydration applies inline tokens.
  await page.waitForTimeout(120);
}

type PublicMarketingThemeId = (typeof PUBLIC_MARKETING_THEME_ALLOWLIST)[number];

function themePickerRegex(themeId: PublicMarketingThemeId): RegExp {
  const opt = themeOptionsForPublicMarketingPicker().find((o) => o.id === themeId);
  expect(opt, `public marketing picker must include ${themeId}`).toBeTruthy();
  const escaped = opt!.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}\\b`);
}

type LvCardComputed = {
  backgroundColor: string;
  color: string;
  borderColor: string;
  boxShadow: string;
  /** WCAG contrast (resolved in browser; some themes yield `transparent` / non-rgb() until parent walk). */
  contrastApprox: number | null;
};

async function readFirstVisibleLvCardStyles(page: Page): Promise<LvCardComputed> {
  const handle = page.locator(".lv-card").first();
  await expect(handle).toBeVisible({ timeout: 60_000 });
  return handle.evaluate((el) => {
    const cs = getComputedStyle(el);
    const isTransparent = (v: string) => v === "rgba(0, 0, 0, 0)" || v === "transparent";
    const elBg = cs.backgroundColor;
    let displayBg = elBg;
    if (isTransparent(elBg)) {
      let p: HTMLElement | null = el.parentElement;
      for (let i = 0; i < 8 && p; i++) {
        const b = getComputedStyle(p).backgroundColor;
        if (!isTransparent(b)) {
          displayBg = b;
          break;
        }
        p = p.parentElement;
      }
    }
    /** Prefer the card’s own fill for WCAG; parent-walk is only for painted `displayBg` when the layer is transparent. */
    const bgForContrast = isTransparent(elBg) ? displayBg : elBg;

    const parseRgb = (value: string): [number, number, number] | null => {
      const inner = value.replace(/\s/g, "").match(/^rgba?\(([^)]+)\)/i);
      if (!inner) return null;
      const raw = inner[1]!;
      const parts = raw.includes(",")
        ? raw.split(",").map((x) => Number.parseFloat(x.trim()))
        : raw
            .split(/\s+/)
            .map((x) => Number.parseFloat(x))
            .filter((n) => !Number.isNaN(n));
      if (parts.length < 3 || parts.slice(0, 3).some((n) => Number.isNaN(n))) return null;
      return [Math.round(parts[0]!), Math.round(parts[1]!), Math.round(parts[2]!)];
    };

    const relLum = (rgb: [number, number, number]): number => {
      const ch = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * ch(rgb[0]) + 0.7152 * ch(rgb[1]) + 0.0722 * ch(rgb[2]);
    };

    const wcagContrast = (fgCss: string, bgCss: string): number | null => {
      const fgRgb = parseRgb(fgCss);
      const bgRgb = parseRgb(bgCss);
      if (!fgRgb || !bgRgb) return null;
      const l1 = relLum(fgRgb);
      const l2 = relLum(bgRgb);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      if (darker <= 0) return null;
      return (lighter + 0.05) / (darker + 0.05);
    };

    // Wrapper `color` is often wrong; sample several in-card nodes and take the strongest ratio.
    const fgNodes: HTMLElement[] = [
      el,
      ...Array.from(el.querySelectorAll<HTMLElement>(".nn-marketing-h4, .nn-marketing-body-sm, a, p")),
    ];
    let contrastApprox: number | null = null;
    for (const node of fgNodes) {
      const fg = getComputedStyle(node).color;
      const r = wcagContrast(fg, bgForContrast);
      if (r != null && (contrastApprox == null || r > contrastApprox)) contrastApprox = r;
    }

    return {
      backgroundColor: displayBg,
      color: cs.color,
      borderColor: cs.borderColor,
      boxShadow: cs.boxShadow,
      contrastApprox,
    };
  });
}

type PaintedSurfaceSnapshot = {
  backgroundColor: string;
  color: string;
  borderColor: string;
  boxShadow: string;
};

async function readPaintedSurfaceStyles(page: Page, selector: string): Promise<PaintedSurfaceSnapshot> {
  const target = page.locator(selector).first();
  await expect(target, `${selector} should be visible before reading computed styles`).toBeVisible({
    timeout: 60_000,
  });
  return target.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      backgroundColor: cs.backgroundColor,
      color: cs.color,
      borderColor: cs.borderColor,
      boxShadow: cs.boxShadow,
    };
  });
}

async function readBodyBackground(page: Page): Promise<string> {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

/** Normalize browser rgb()/rgba() for exact comparisons. */
function rgbTripletFromCssColor(css: string): [number, number, number] | null {
  const compact = css.replace(/\s/g, "");
  const rgb = compact.match(/^rgba?\((\d+),(\d+),(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];

  const hex = css.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const raw = hex[1]!;
    return [
      Number.parseInt(raw.slice(0, 2), 16),
      Number.parseInt(raw.slice(2, 4), 16),
      Number.parseInt(raw.slice(4, 6), 16),
    ];
  }

  // Chromium may preserve color-mix() computed output as `color(srgb r g b / a)`.
  const srgb = css.trim().match(/^color\(\s*srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/i);
  if (srgb) {
    return [
      Math.round(Number(srgb[1]) * 255),
      Math.round(Number(srgb[2]) * 255),
      Math.round(Number(srgb[3]) * 255),
    ];
  }

  return null;
}

const ROOT_LV_CARD_PASTEL_RGB: [number, number, number] = [255, 252, 254];

function isRootPastelLvSurface(bg: string): boolean {
  const t = rgbTripletFromCssColor(bg);
  if (!t) return false;
  const [r, g, b] = t;
  const [pr, pg, pb] = ROOT_LV_CARD_PASTEL_RGB;
  return Math.abs(r - pr) <= 2 && Math.abs(g - pg) <= 2 && Math.abs(b - pb) <= 2;
}

function rgbDistance(a: string, b: string): number {
  const A = rgbTripletFromCssColor(a);
  const B = rgbTripletFromCssColor(b);
  if (!A || !B) return 0;
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
}

function expectPaintedSurfaceChanges(
  route: string,
  selector: string,
  light: PaintedSurfaceSnapshot,
  dark: PaintedSurfaceSnapshot,
): void {
  expect(
    rgbDistance(light.backgroundColor, dark.backgroundColor),
    `${route}: ${selector} background should repaint between light and Midnight themes`,
  ).toBeGreaterThan(12);
  expect(
    rgbDistance(light.borderColor, dark.borderColor),
    `${route}: ${selector} border should repaint between light and Midnight themes`,
  ).toBeGreaterThan(8);
  expect(
    light.backgroundColor,
    `${route}: ${selector} must render a non-transparent background`,
  ).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/i);
  expect(
    dark.backgroundColor,
    `${route}: ${selector} must render a non-transparent Midnight background`,
  ).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/i);
}

type PublicMarketingThemeSnapshots = Record<PublicMarketingThemeId, ThemeSnapshot>;

async function snapshotAcrossPublicMarketingThemes(
  page: Page,
  routePath: string,
): Promise<PublicMarketingThemeSnapshots> {
  await page.goto(routePath, { waitUntil: "load", timeout: 120_000 });
  await dismissMarketingScrims(page);
  await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({
    timeout: 60_000,
  });

  const out = {} as PublicMarketingThemeSnapshots;
  for (const id of PUBLIC_MARKETING_THEME_ALLOWLIST) {
    await selectThemeViaPicker(page, themePickerRegex(id));
    const snap = await readThemeSnapshot(page);
    expect(snap.dataTheme, `${routePath}: data-theme should be ${id}`).toBe(id);
    out[id] = snap;
  }
  return out;
}

function expectAllNonEmptyHex(snapshot: ThemeSnapshot, route: string): void {
  for (const key of [
    "pageBgVar",
    "surfaceVar",
    "headingVar",
    "bodyTextVar",
    "borderVar",
    "brandVar",
    "ctaVar",
  ] as const) {
    const value = snapshot[key];
    expect(value, `${route} ${snapshot.dataTheme}.${key} should be a non-empty color`).toMatch(
      /^(#|rgb|hsl|color-mix)/i,
    );
  }
  expect(
    snapshot.bodyBgRendered,
    `${route} ${snapshot.dataTheme}: body background must render as a real color`,
  ).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/i);
}

function expectThemesDiffer(
  a: ThemeSnapshot,
  b: ThemeSnapshot,
  route: string,
  hint: string,
): void {
  expect(
    a.pageBgVar,
    `${route}: ${hint} page-bg must differ from ${a.dataTheme}`,
  ).not.toBe(b.pageBgVar);
  expect(
    a.surfaceVar,
    `${route}: ${hint} surface must differ from ${a.dataTheme}`,
  ).not.toBe(b.surfaceVar);
  expect(
    a.bodyBgRendered,
    `${route}: ${hint} body bg must render differently from ${a.dataTheme}`,
  ).not.toBe(b.bodyBgRendered);
}

function expectLayoutStable(snapshots: ThemeSnapshot[], route: string): void {
  // Heights can shift slightly when font-loading or async sections settle; stay generous but bounded.
  const heights = snapshots.map((s) => s.documentHeight);
  const max = Math.max(...heights);
  const min = Math.min(...heights);
  // Up to 6% variance, capped at 240px — covers chip wrap on light vs dark themes without masking
  // genuine layout shifts that would indicate non-token-only theme changes.
  const tolerance = Math.max(240, Math.round(max * 0.06));
  expect(
    max - min,
    `${route}: theme switch should not change layout height (got ${heights.join(" / ")} px, tol=${tolerance}px)`,
  ).toBeLessThanOrEqual(tolerance);
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
  await context.addInitScript((key: string) => {
    try {
      // Fresh profiles: Ocean. If a theme id is already stored (e.g. Apex set before `reload()` for
      // themes outside the public picker), do not overwrite — init runs before app JS on every navigation.
      const existing = localStorage.getItem(key);
      if (existing != null && String(existing).trim() !== "") return;
      localStorage.setItem(key, "ocean");
    } catch {
      /* ignore */
    }
  }, THEME_STORAGE_KEY);
});

test.describe("Marketing theme propagation — public routes", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("public marketing picker exposes the agreed allowlist (Ocean, Midnight, Blossom, Aurora, Sunset)", async () => {
    const ids = themeOptionsForPublicMarketingPicker().map((opt) => opt.id);
    expect(ids).toEqual([...PUBLIC_MARKETING_THEME_ALLOWLIST]);
  });

  for (const route of [
    { path: "/", id: "home" },
    { path: "/pricing", id: "pricing" },
    { path: "/blog", id: "blog" },
    {
      path: "/blog/rt-acid-base-compensation-chronic-respiratory-disorders",
      id: "blog-post",
    },
    { path: "/us/rn/nclex-rn", id: "rn-hub" },
  ] as const) {
    test(`${route.path} — public allowlist themes shift surface tokens & body bg`, async ({ page }) => {
      const s = await snapshotAcrossPublicMarketingThemes(page, route.path);

      for (const id of PUBLIC_MARKETING_THEME_ALLOWLIST) {
        expectAllNonEmptyHex(s[id], route.path);
      }

      expectThemesDiffer(s.ocean, s.blossom, route.path, "Ocean ↔ Blossom");
      expectThemesDiffer(s.ocean, s.midnight, route.path, "Ocean ↔ Midnight");
      expectThemesDiffer(s.blossom, s.midnight, route.path, "Blossom ↔ Midnight");
      expectThemesDiffer(s.midnight, s.aurora, route.path, "Midnight ↔ Aurora");
      expectThemesDiffer(s.midnight, s.sunset, route.path, "Midnight ↔ Sunset");
      expectThemesDiffer(s.aurora, s.sunset, route.path, "Aurora ↔ Sunset");

      expectLayoutStable(
        PUBLIC_MARKETING_THEME_ALLOWLIST.map((id) => s[id]),
        route.path,
      );
    });
  }

  test("/pricing — capture public allowlist screenshot evidence", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({
      timeout: 60_000,
    });

    for (const id of PUBLIC_MARKETING_THEME_ALLOWLIST) {
      await selectThemeViaPicker(page, themePickerRegex(id));
      const themeAttr = await page.evaluate(
        () => document.documentElement.getAttribute("data-theme") ?? "",
      );
      expect(themeAttr).toBe(id);
      await page.waitForTimeout(200);
      await page.screenshot({
        path: join(SCREENSHOT_DIR, `pricing-${themeAttr}-1280x900-chromium.png`),
      });
    }
  });

  test("/pricing — pricing cards, FAQ blocks, and footer repaint with theme tokens", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({
      timeout: 60_000,
    });

    type SurfaceByTheme = Record<"ocean" | "blossom" | "midnight", PaintedSurfaceSnapshot>;
    const planCard = {} as SurfaceByTheme;
    const faqCard = {} as SurfaceByTheme;
    const footer = {} as SurfaceByTheme;

    for (const id of ["ocean", "blossom", "midnight"] as const) {
      await selectThemeViaPicker(page, themePickerRegex(id));
      await expect(page.locator("html")).toHaveAttribute("data-theme", id, { timeout: 15_000 });
      planCard[id] = await readPaintedSurfaceStyles(page, ".nn-pricing-plan-card");
      faqCard[id] = await readPaintedSurfaceStyles(page, ".nn-pricing-faq-card");
      footer[id] = await readPaintedSurfaceStyles(page, "[data-nn-footer-root]");
    }

    expectPaintedSurfaceChanges("/pricing", ".nn-pricing-plan-card", planCard.ocean, planCard.midnight);
    expectPaintedSurfaceChanges("/pricing", ".nn-pricing-faq-card", faqCard.ocean, faqCard.midnight);
    expectPaintedSurfaceChanges("/pricing", "[data-nn-footer-root]", footer.ocean, footer.midnight);
    expect(
      rgbDistance(planCard.ocean.backgroundColor, planCard.blossom.backgroundColor),
      "/pricing: plan cards should visibly shift Ocean to Blossom, not stay Ocean-fixed",
    ).toBeGreaterThan(3);
  });

  test("/blog — capture public allowlist screenshot evidence", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({
      timeout: 60_000,
    });

    for (const id of PUBLIC_MARKETING_THEME_ALLOWLIST) {
      await selectThemeViaPicker(page, themePickerRegex(id));
      const themeAttr = await page.evaluate(
        () => document.documentElement.getAttribute("data-theme") ?? "",
      );
      expect(themeAttr).toBe(id);
      await page.waitForTimeout(200);
      await page.screenshot({
        path: join(SCREENSHOT_DIR, `blog-${themeAttr}-1280x900-chromium.png`),
      });
    }
  });

  test("/blog and article surfaces repaint with theme tokens", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({
      timeout: 60_000,
    });

    const blogCards = {} as Record<"blossom" | "midnight", PaintedSurfaceSnapshot>;
    for (const id of ["blossom", "midnight"] as const) {
      await selectThemeViaPicker(page, themePickerRegex(id));
      await expect(page.locator("html")).toHaveAttribute("data-theme", id, { timeout: 15_000 });
      blogCards[id] = await readPaintedSurfaceStyles(page, ".nn-premium-blog-post-card");
    }
    expectPaintedSurfaceChanges("/blog", ".nn-premium-blog-post-card", blogCards.blossom, blogCards.midnight);

    await page.goto("/blog/rt-acid-base-compensation-chronic-respiratory-disorders", {
      waitUntil: "load",
      timeout: 120_000,
    });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({
      timeout: 60_000,
    });

    const relatedCards = {} as Record<"blossom" | "midnight", PaintedSurfaceSnapshot>;
    for (const id of ["blossom", "midnight"] as const) {
      await selectThemeViaPicker(page, themePickerRegex(id));
      await expect(page.locator("html")).toHaveAttribute("data-theme", id, { timeout: 15_000 });
      relatedCards[id] = await readPaintedSurfaceStyles(page, ".nn-premium-blog-related-card");
    }
    expectPaintedSurfaceChanges(
      "/blog/rt-acid-base-compensation-chronic-respiratory-disorders",
      ".nn-premium-blog-related-card",
      relatedCards.blossom,
      relatedCards.midnight,
    );
  });

  /**
   * Pathway hub regression: `LearnerSurfaceCard` → `.lv-card` must track public marketing
   * `html[data-theme]` values via `styles/tokens.css` bridge (not stuck on :root pastel
   * `--lv-bg-surface` #fffcfe).
   *
   * Route: `/us/pn/nclex-pn` — PN marketing tier hub renders `.lv-card` in the insight rail.
   * `/us/rn/nclex-rn` uses `StudyCard` / `.nn-exam-hub-study-card` without `.lv-card`, so it cannot guard this bridge.
   */
  test("/us/pn/nclex-pn — pathway hub .lv-card tracks public marketing themes", async ({ page }) => {
    const routePath = "/us/pn/nclex-pn";
    type HubLvSnap = { lv: LvCardComputed; bodyBg: string };
    type HubLvByTheme = Record<PublicMarketingThemeId, HubLvSnap>;

    await page.goto(routePath, { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({ timeout: 60_000 });

    const hub = {} as HubLvByTheme;
    for (const id of PUBLIC_MARKETING_THEME_ALLOWLIST) {
      await selectThemeViaPicker(page, themePickerRegex(id));
      await expect(page.locator("html")).toHaveAttribute("data-theme", id, { timeout: 15_000 });
      hub[id] = {
        lv: await readFirstVisibleLvCardStyles(page),
        bodyBg: await readBodyBackground(page),
      };
    }

    expect(isRootPastelLvSurface(hub.midnight.lv.backgroundColor)).toBe(false);

    for (const light of ["ocean", "blossom", "aurora", "sunset"] as const) {
      expect(
        rgbDistance(hub[light].lv.backgroundColor, hub.midnight.lv.backgroundColor),
        `${routePath}: ${light} vs midnight .lv-card`,
      ).toBeGreaterThan(35);
    }

    expect(rgbDistance(hub.ocean.lv.backgroundColor, hub.blossom.lv.backgroundColor)).toBeGreaterThan(4);
    expect(rgbDistance(hub.aurora.lv.backgroundColor, hub.sunset.lv.backgroundColor)).toBeGreaterThan(4);

    for (const id of PUBLIC_MARKETING_THEME_ALLOWLIST) {
      const ratio = hub[id].lv.contrastApprox;
      expect(ratio, `${routePath} ${id}: .lv-card contrast`).not.toBeNull();
      expect(ratio!, `${routePath} ${id}: .lv-card contrast`).toBeGreaterThanOrEqual(3);
    }

    for (const id of PUBLIC_MARKETING_THEME_ALLOWLIST) {
      expect(hub[id].lv.borderColor.length, `${routePath} ${id}: border-color`).toBeGreaterThan(0);
    }

    expect(hub.ocean.bodyBg.length).toBeGreaterThan(0);
    expect(rgbDistance(hub.ocean.bodyBg, hub.midnight.bodyBg)).toBeGreaterThan(8);
  });
});
