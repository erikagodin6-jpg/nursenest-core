/**
 * Shared helpers for aesthetic-visual-audit Playwright specs (screenshots + light automated checks).
 * Figma remains source of truth for major layout; this suite inventories visuals + catches regressions.
 */
import { expect, type Page } from "@playwright/test";

/** Canonical premium matrix — matches contract tests (`REQUIRED_THEMES`) and navigation audits. */
export const AESTHETIC_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
export type AestheticThemeId = (typeof AESTHETIC_THEMES)[number];

export const VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

/** Approximate luminance 0–1 for rgb()/rgba() from getComputedStyle color. */
function parseRgbParts(cssColor: string): [number, number, number] | null {
  const m = cssColor.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const lin = [r, g, b].map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!;
}

/**
 * Cheap readability hint: body text vs background contrast ratio (main column when present).
 * Not a WCAG certification — flags obvious flat/low-contrast pairs for audit triage.
 */
export async function measureBodyContrastHint(page: Page): Promise<{
  ratio: number | null;
  fgSample: string;
  bgSample: string;
}> {
  const raw = await page.evaluate(() => {
    const pick =
      (document.querySelector("main") as HTMLElement | null) ??
      (document.querySelector('[role="main"]') as HTMLElement | null) ??
      document.body;
    const cs = getComputedStyle(pick);
    const fg = cs.color || "";
    const bg = cs.backgroundColor || "";
    return { fgSample: fg.slice(0, 120), bgSample: bg.slice(0, 120) };
  });
  const fgRgb = parseRgbParts(raw.fgSample);
  const bgRgb = parseRgbParts(raw.bgSample);
  if (!fgRgb || !bgRgb) return { ratio: null, fgSample: raw.fgSample, bgSample: raw.bgSample };
  const L1 = relativeLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);
  const L2 = relativeLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return { ratio, fgSample: raw.fgSample, bgSample: raw.bgSample };
}

export async function applyMarketingTheme(page: Page, theme: AestheticThemeId): Promise<void> {
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("nursenest-theme", t);
    } catch {
      /* ignore */
    }
  }, theme);
  await page.waitForTimeout(120);
}

export async function applyLearnerTheme(page: Page, theme: AestheticThemeId): Promise<void> {
  await page.evaluate(
    ({ key, id }) => {
      try {
        localStorage.setItem(key, id);
      } catch {
        /* ignore */
      }
    },
    { key: "nursenest-theme", id: theme },
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(120);
}

export async function assertHtmlTheme(page: Page, theme: AestheticThemeId): Promise<void> {
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

export async function assertNavChromeTokensPresent(page: Page): Promise<void> {
  const navBg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--nav-bg").trim(),
  );
  const navFg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--nav-fg").trim(),
  );
  expect(navBg.length, "--nav-bg token").toBeGreaterThan(2);
  expect(navFg.length, "--nav-fg token").toBeGreaterThan(2);
  expect(navFg.toLowerCase()).not.toBe("transparent");
}

/** Marketing surfaces should expose at most one primary public nav landmark. */
export async function assertSinglePublicSiteNav(page: Page): Promise<void> {
  const n = await page.locator('[data-nn-nav-mode="public"]').count();
  expect(n, "duplicate [data-nn-nav-mode=public] landmarks").toBeLessThanOrEqual(1);
}

/**
 * Soft audit only — logs candidate shouty CTAs for human triage (does not fail tests).
 * Ignores short labels and conservative threshold to reduce noise.
 */
export async function warnSuspiciousAllCapsCTAs(page: Page, routeLabel: string): Promise<void> {
  const bad = await page.evaluate(() => {
    const sel =
      'button, [role="button"], a.btn, a[class*="rounded"][class*="font-semibold"], a[class*="Button"]';
    const nodes = [...document.querySelectorAll(sel)] as HTMLElement[];
    const out: string[] = [];
    for (const el of nodes) {
      const r = el.getBoundingClientRect?.();
      if (!r || r.width < 2 || r.height < 2) continue;
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (t.length < 6 || t.length > 90) continue;
      const letters = t.replace(/[^a-zA-Z]/g, "");
      if (letters.length < 6) continue;
      const upper = letters.replace(/[^A-Z]/g, "").length;
      if (upper / letters.length > 0.88) out.push(t.slice(0, 72));
    }
    return [...new Set(out)].slice(0, 12);
  });
  if (bad.length) {
    console.warn(`[aesthetic-audit] Possible ALL-CAPS / shouty CTAs on ${routeLabel}:`, bad);
  }
}
