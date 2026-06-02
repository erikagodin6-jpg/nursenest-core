/**
 * Regression guard: midnight theme must emit light palette tokens so that
 * `--palette-heading` / `--palette-text` / `--palette-text-muted` are
 * readable (high-contrast) on the dark midnight background.
 *
 * Root cause this guards against: the midnight basic-palette entry had
 * stale light-theme values (heading: "#0f172a", text: "#1e293b") which
 * ThemeStateHydration was writing as `--palette-heading: #0f172a` — dark
 * navy on a near-black background, failing every WCAG level.
 *
 * Run: node --import tsx --test src/lib/theme/midnight-dark-readability.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  getThemePaletteTokens,
  getThemeSurfaceContrastTokens,
} from "@/lib/theme/theme-palette-tokens";

const HERE = dirname(fileURLToPath(import.meta.url));
const PALETTES_CSS = readFileSync(
  join(HERE, "../../app/theme-palettes.css"),
  "utf-8",
);
const GLOBALS_CSS = readFileSync(
  join(HERE, "../../app/globals.css"),
  "utf-8",
);

// ─── WCAG helpers ────────────────────────────────────────────────────────────

function hexToLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return 0.2126 * hexToLinear(r) + 0.7152 * hexToLinear(g) + 0.0722 * hexToLinear(b);
}

function contrastRatio(fg: string, bg: string): number {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Luminance threshold for "is light-coloured" — must be above mid-gray. */
const LIGHT_LUMINANCE_THRESHOLD = 0.25;

// Midnight dark page background from canonical surface override.
const MIDNIGHT_BG = "#0B1220";
// Midnight page background from theme-palettes.css (darker variant).
const MIDNIGHT_CSS_BG = "#07111f";

// ─── Extract a CSS token value from the midnight identity block ──────────────

function midnightCssToken(prop: string): string | null {
  // Match `html[data-theme="midnight"] { … }` then find the property inside.
  const blockRe = /html\[data-theme="midnight"\]\s*\{([\s\S]*?)\n\}/m;
  const block = PALETTES_CSS.match(blockRe)?.[1] ?? "";
  const tokenRe = new RegExp(`${prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*(#[0-9a-fA-F]{3,8})`, "i");
  return block.match(tokenRe)?.[1] ?? null;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("midnight basic palette tokens — dark-theme readability", () => {
  const palette = getThemePaletteTokens("midnight");

  it("midnight has a basic palette entry in THEME_PALETTE_TOKENS", () => {
    assert.ok(palette, "getThemePaletteTokens('midnight') must return a palette");
  });

  it("palette.heading is light-coloured (luminance > 0.25) for dark backgrounds", () => {
    assert.ok(palette);
    const lum = relativeLuminance(palette.heading);
    assert.ok(
      lum > LIGHT_LUMINANCE_THRESHOLD,
      `midnight palette.heading "${palette.heading}" luminance ${lum.toFixed(3)} must be > ${LIGHT_LUMINANCE_THRESHOLD} — it was dark navy, invisible on #07111f`,
    );
  });

  it("palette.heading meets WCAG AAA (7:1) on midnight background", () => {
    assert.ok(palette);
    const ratio = contrastRatio(palette.heading, MIDNIGHT_BG);
    assert.ok(
      ratio >= 7.0,
      `midnight palette.heading "${palette.heading}" contrast ${ratio.toFixed(2)}:1 must be >= 7:1 (AAA) on ${MIDNIGHT_BG}`,
    );
  });

  it("palette.text is light-coloured and meets WCAG AA (4.5:1) on midnight background", () => {
    assert.ok(palette);
    const lum = relativeLuminance(palette.text);
    assert.ok(lum > LIGHT_LUMINANCE_THRESHOLD, `palette.text "${palette.text}" luminance ${lum.toFixed(3)} must be > ${LIGHT_LUMINANCE_THRESHOLD}`);
    const ratio = contrastRatio(palette.text, MIDNIGHT_BG);
    assert.ok(
      ratio >= 4.5,
      `midnight palette.text "${palette.text}" contrast ${ratio.toFixed(2)}:1 must be >= 4.5:1 (AA) on ${MIDNIGHT_BG}`,
    );
  });

  it("palette.textMuted is light-coloured and meets WCAG AA Large (3:1) on midnight background", () => {
    assert.ok(palette);
    const lum = relativeLuminance(palette.textMuted);
    assert.ok(lum > LIGHT_LUMINANCE_THRESHOLD, `palette.textMuted "${palette.textMuted}" luminance ${lum.toFixed(3)} must be > ${LIGHT_LUMINANCE_THRESHOLD}`);
    const ratio = contrastRatio(palette.textMuted, MIDNIGHT_BG);
    assert.ok(
      ratio >= 3.0,
      `midnight palette.textMuted "${palette.textMuted}" contrast ${ratio.toFixed(2)}:1 must be >= 3:1 on ${MIDNIGHT_BG}`,
    );
  });

  it("palette.heading and canonical surface heading are both light-coloured", () => {
    assert.ok(palette);
    const surface = getThemeSurfaceContrastTokens("midnight");
    assert.ok(surface, "midnight must have canonical surface tokens");
    const palLum = relativeLuminance(palette.heading);
    const surfLum = relativeLuminance(surface.heading);
    assert.ok(
      palLum > LIGHT_LUMINANCE_THRESHOLD,
      `palette.heading "${palette.heading}" luminance ${palLum.toFixed(3)} must be light`,
    );
    assert.ok(
      surfLum > LIGHT_LUMINANCE_THRESHOLD,
      `surface.heading "${surface.heading}" luminance ${surfLum.toFixed(3)} must be light`,
    );
  });

  it("palette.navText is light-coloured (nav fg on dark nav bar)", () => {
    assert.ok(palette);
    const lum = relativeLuminance(palette.navText);
    assert.ok(
      lum > LIGHT_LUMINANCE_THRESHOLD,
      `midnight palette.navText "${palette.navText}" must be light for dark nav bar`,
    );
  });
});

describe("midnight canonical surface tokens — dark-theme readability", () => {
  const surface = getThemeSurfaceContrastTokens("midnight");

  it("midnight has canonical surface token override", () => {
    assert.ok(surface, "getThemeSurfaceContrastTokens('midnight') must return tokens");
  });

  it("surface.text meets WCAG AA (4.5:1) on midnight background", () => {
    assert.ok(surface);
    const ratio = contrastRatio(surface.text, MIDNIGHT_BG);
    assert.ok(
      ratio >= 4.5,
      `surface.text "${surface.text}" contrast ${ratio.toFixed(2)}:1 must be >= 4.5:1 on ${MIDNIGHT_BG}`,
    );
  });

  it("surface.heading meets WCAG AAA (7:1) on midnight background", () => {
    assert.ok(surface);
    const ratio = contrastRatio(surface.heading, MIDNIGHT_BG);
    assert.ok(
      ratio >= 7.0,
      `surface.heading "${surface.heading}" contrast ${ratio.toFixed(2)}:1 must be >= 7:1 on ${MIDNIGHT_BG}`,
    );
  });

  it("surface.navForeground meets WCAG AA (4.5:1) on surface.navBackground", () => {
    assert.ok(surface);
    const ratio = contrastRatio(surface.navForeground, surface.navBackground);
    assert.ok(
      ratio >= 4.5,
      `navForeground "${surface.navForeground}" on navBackground "${surface.navBackground}" contrast ${ratio.toFixed(2)}:1 must be >= 4.5:1`,
    );
  });
});

describe("midnight CSS identity block — dark-theme readability", () => {
  it("--theme-heading-text is defined as a light hex in midnight CSS block", () => {
    const val = midnightCssToken("--theme-heading-text");
    assert.ok(val, "--theme-heading-text must be set in midnight CSS identity block");
    const lum = relativeLuminance(val);
    assert.ok(
      lum > LIGHT_LUMINANCE_THRESHOLD,
      `CSS --theme-heading-text "${val}" luminance ${lum.toFixed(3)} must be > ${LIGHT_LUMINANCE_THRESHOLD} for dark background`,
    );
  });

  it("--theme-body-text is defined as a light hex in midnight CSS block", () => {
    const val = midnightCssToken("--theme-body-text");
    assert.ok(val, "--theme-body-text must be set in midnight CSS identity block");
    const lum = relativeLuminance(val);
    assert.ok(
      lum > LIGHT_LUMINANCE_THRESHOLD,
      `CSS --theme-body-text "${val}" luminance ${lum.toFixed(3)} must be > ${LIGHT_LUMINANCE_THRESHOLD}`,
    );
    const ratio = contrastRatio(val, MIDNIGHT_CSS_BG);
    assert.ok(
      ratio >= 4.5,
      `CSS --theme-body-text "${val}" contrast ${ratio.toFixed(2)}:1 on ${MIDNIGHT_CSS_BG} must be >= 4.5:1`,
    );
  });

  it("--theme-muted-text is defined and readable in midnight CSS block", () => {
    const val = midnightCssToken("--theme-muted-text");
    assert.ok(val, "--theme-muted-text must be set in midnight CSS identity block");
    const lum = relativeLuminance(val);
    assert.ok(
      lum > LIGHT_LUMINANCE_THRESHOLD,
      `CSS --theme-muted-text "${val}" luminance ${lum.toFixed(3)} must be > ${LIGHT_LUMINANCE_THRESHOLD}`,
    );
  });
});

describe("marketing heading classes — palette-heading contract", () => {
  it(".nn-marketing-h1 uses var(--palette-heading) for color", () => {
    assert.match(
      GLOBALS_CSS,
      /\.nn-marketing-h1\s*\{[^}]*color\s*:\s*var\(--palette-heading\)/s,
      ".nn-marketing-h1 must use var(--palette-heading) so midnight headings are white, not dark navy",
    );
  });

  it(".nn-marketing-h2 uses var(--palette-heading) for color", () => {
    assert.match(
      GLOBALS_CSS,
      /\.nn-marketing-h2\s*\{[^}]*color\s*:\s*var\(--palette-heading\)/s,
      ".nn-marketing-h2 must use var(--palette-heading)",
    );
  });

  it(".nn-marketing-h3 uses var(--palette-heading) for color", () => {
    assert.match(
      GLOBALS_CSS,
      /\.nn-marketing-h3\s*\{[^}]*color\s*:\s*var\(--palette-heading\)/s,
      ".nn-marketing-h3 must use var(--palette-heading)",
    );
  });
});
