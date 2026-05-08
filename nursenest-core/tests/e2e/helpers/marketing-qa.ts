/**
 * Strict copy/layout heuristics for public marketing Playwright suites.
 *
 * **Limitations** (see docs/testing/marketing-visual-qa-guards.md):
 * - Placeholder scan uses substring patterns — rare legitimate phrases could match.
 * - Capitalization checks are heuristics only — intentional lowercase titles / brands may false-positive.
 * - Horizontal overflow uses documentElement metrics; clipped regions inside `overflow-x-auto` may not surface.
 */
import { expect, type Locator, type Page } from "@playwright/test";

/** Forbidden fragments in visible marketing copy (case-insensitive where noted). */
const PLACEHOLDER_SUBSTRINGS = [
  "lorem ipsum",
  "placeholder",
  "{{",
  "}}",
  "todo:",
  " todo ",
  "[todo]",
] as const;

/** Match leaked i18n / template tokens in rendered text. */
const RAW_KEY_PATTERNS: RegExp[] = [
  /\bpages\.[a-z0-9_.]+\b/i,
  /\bmarketing\.[a-z0-9_.]+\b/i,
  /\{\{\s*[\w.]+\s*\}\}/,
];

function normalizeVisibleText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Fail when visible text contains placeholder junk, raw translation keys, or template leftovers.
 *
 * @param scope — When set, only scans this subtree (e.g. `main`); otherwise full page body text.
 */
export async function assertNoPlaceholderText(page: Page, scope?: Locator): Promise<void> {
  const root = scope ?? page.locator("body");
  const text = normalizeVisibleText(await root.innerText());
  const lower = text.toLowerCase();

  expect(lower, 'visible text must not contain standalone "todo"').not.toMatch(/\btodo\b/);

  for (const frag of PLACEHOLDER_SUBSTRINGS) {
    expect(lower, `visible text must not contain "${frag}"`).not.toContain(frag.toLowerCase());
  }

  expect(text, "visible text must not contain literal `undefined`").not.toMatch(/\bundefined\b/);
  expect(text, "visible text must not contain literal `null` as a token").not.toMatch(/\bnull\b/);

  for (const re of RAW_KEY_PATTERNS) {
    expect(text, `visible text must not match ${re}`).not.toMatch(re);
  }
}

/**
 * Document-level horizontal bleed: `scrollWidth <= clientWidth + tolerance`.
 */
export async function assertNoHorizontalOverflow(page: Page, tolerancePx = 1): Promise<void> {
  const excess = await page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
  expect(
    excess,
    `document horizontal overflow: scrollWidth vs clientWidth (excess ${excess}px)`,
  ).toBeLessThanOrEqual(tolerancePx);
}

function splitWords(s: string): string[] {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}'’-]/gu, ""))
    .filter(Boolean);
}

/** True if string looks like alternating caps chaos within a word (conservative). */
function hasExtremeMixedCaseToken(s: string): boolean {
  const tokens = s.split(/\s+/);
  for (const token of tokens) {
    const letters = token.replace(/[^a-zA-Z]/g, "");
    if (letters.length < 10) continue;
    let flips = 0;
    for (let i = 1; i < letters.length; i++) {
      const a = letters[i - 1]!;
      const b = letters[i]!;
      const aLower = a === a.toLowerCase();
      const bLower = b === b.toLowerCase();
      if (aLower !== bLower) flips++;
    }
    if (flips >= 5) return true;
  }
  return false;
}

export type CapitalizationIssue = {
  tag: string;
  text: string;
  kind: "all_lower_multi_word" | "extreme_mixed_case";
};

/**
 * Flags suspicious heading capitalization inside `main`:
 * - **All-lowercase multi-word** headings (two or more words, letters only lowercase).
 * - **Extreme mixed-case** within a long token (many case transitions).
 *
 * Skips very short headings (&lt; 6 chars), headings with digits, and single-word lines.
 * False positives: intentional sentence-case multi-word titles rendered all-lowercase in a locale;
 * brand names with chaotic casing.
 */
export async function collectCapitalizationIssues(main: Locator): Promise<CapitalizationIssue[]> {
  const headings = main.locator("h1, h2");
  const n = await headings.count();
  const issues: CapitalizationIssue[] = [];

  for (let i = 0; i < n; i++) {
    const h = headings.nth(i);
    const tag = (await h.evaluate((el) => el.tagName.toLowerCase())) as string;
    const raw = normalizeVisibleText(await h.innerText());
    if (raw.length < 6) continue;
    if (/\d/.test(raw)) continue;

    const words = splitWords(raw);
    if (words.length >= 2) {
      const lettersOnly = raw.replace(/[^a-zA-Z\s]/g, "");
      if (
        lettersOnly.length >= 8 &&
        lettersOnly === lettersOnly.toLowerCase() &&
        /[a-z]{2,}/.test(lettersOnly)
      ) {
        issues.push({ tag, text: raw, kind: "all_lower_multi_word" });
      }
    }

    if (hasExtremeMixedCaseToken(raw)) {
      issues.push({ tag, text: raw, kind: "extreme_mixed_case" });
    }
  }

  return issues;
}

/**
 * Assert no suspicious capitalization patterns in `main` headings (see {@link collectCapitalizationIssues}).
 */
export async function assertCapitalizationHeuristics(main: Locator): Promise<void> {
  const issues = await collectCapitalizationIssues(main);
  expect(
    issues,
    issues.length ? `Suspicious heading capitalization:\n${issues.map((x) => `- [${x.tag}] ${x.kind}: ${x.text}`).join("\n")}` : "",
  ).toEqual([]);
}

export type Rgb = { r: number; g: number; b: number };

/** Parse `rgb()` / `rgba()` from computed styles; returns null if unsupported. */
export function parseRgb(cssColor: string): Rgb | null {
  const m = cssColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return null;
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
}

/**
 * Pragmatic visibility check on dark surfaces: hero heading color must not collapse into background.
 * Call only after a **dark** theme is applied (`data-theme` dark group), not after `prefers-color-scheme` alone.
 */
export async function assertMarketingHeroHeadingContrast(page: Page, headingSelector = "#home-conversion-hero-heading"): Promise<void> {
  const result = await page.evaluate((sel) => {
    function parseRgbLocal(css: string): { r: number; g: number; b: number } | null {
      const m = css.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      if (!m) return null;
      return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
    }

    const el = document.querySelector(sel);
    if (!el) return { ok: false as const, detail: "missing hero heading" };

    const textRgb = parseRgbLocal(getComputedStyle(el).color);
    const section = el.closest("section") ?? document.body;
    const bgRgb = parseRgbLocal(getComputedStyle(section).backgroundColor);

    if (!textRgb) return { ok: true as const, detail: "non-rgb text color — skipped" };
    if (!bgRgb) return { ok: true as const, detail: "non-rgb bg — skipped" };

    const tSum = textRgb.r + textRgb.g + textRgb.b;
    const bSum = bgRgb.r + bgRgb.g + bgRgb.b;
    const diff =
      Math.abs(textRgb.r - bgRgb.r) + Math.abs(textRgb.g - bgRgb.g) + Math.abs(textRgb.b - bgRgb.b);

    // Near-identical text and bg (invisible)
    if (diff < 25 && tSum < 100 && bSum < 100) {
      return { ok: false as const, detail: `text vs bg too similar (diff=${diff})` };
    }

    // Dark surface: ensure text is not all near-black
    if (bSum < 160 && tSum < 80) {
      return { ok: false as const, detail: `dark bg (sum=${bSum}) but text too dark (sum=${tSum})` };
    }

    return { ok: true as const, detail: "ok" };
  }, headingSelector);

  expect(result.ok, "detail" in result ? result.detail : "").toBe(true);
}

const NURSENEST_THEME_STORAGE_KEY = "nursenest-theme";

/**
 * Apply **Midnight** for contrast/visual checks.
 * Prefer the header theme picker when multiple public palettes exist; otherwise set `data-theme`
 * + storage directly (public marketing may hide the picker when only the default theme is offered).
 * @returns whether `data-theme` became `midnight`
 */
export async function applyMidnightThemeFromPicker(page: Page): Promise<boolean> {
  const themeBtn = page.getByRole("button", { name: /^theme$/i }).first();
  if (await themeBtn.isVisible({ timeout: 2500 }).catch(() => false)) {
    await themeBtn.click();
    const midnight = page.getByRole("option", { name: /^midnight$/i }).first();
    if (await midnight.isVisible({ timeout: 3000 }).catch(() => false)) {
      await midnight.click();
      await page.waitForTimeout(400);
      const attr = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      return attr === "midnight";
    }
    await page.keyboard.press("Escape").catch(() => {});
  }

  const set = await page.evaluate((key) => {
    try {
      localStorage.setItem(key, "midnight");
      document.documentElement.setAttribute("data-theme", "midnight");
      return true;
    } catch {
      return false;
    }
  }, NURSENEST_THEME_STORAGE_KEY);
  if (!set) return false;
  await page.waitForTimeout(200);
  const attr = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  return attr === "midnight";
}
