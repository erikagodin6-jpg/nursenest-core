/**
 * Every picker theme must ship full marketing chrome:
 * - Either {@link getThemePaletteTokens} + derived surface tokens (ThemeStateHydration), or
 * - An identity `[data-theme="…"] { … }` block in theme-palettes.css with page + nav/header + menu hover tokens.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { getThemePaletteTokens, getThemeSurfaceContrastTokens } from "@/lib/theme/theme-palette-tokens";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

const HERE = dirname(fileURLToPath(import.meta.url));
const PALETTES_PATH = join(HERE, "../../app/theme-palettes.css");
const themePalettesCss = readFileSync(PALETTES_PATH, "utf-8");

const HEXISH = /^(#|transparent|color-mix)/i;

function escapeRe(themeId: string) {
  return themeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** First identity block `[data-theme="id"] { … }` (non-greedy until `\n}`). */
function extractThemeIdentityBlock(css: string, themeId: string): string | null {
  const re = new RegExp(`\\[data-theme="${escapeRe(themeId)}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const m = css.match(re);
  return m ? m[0] : null;
}

function assertCssChromeBundle(themeId: string, block: string) {
  assert.match(block, /--theme-page-bg\s*:/i, `${themeId}: CSS must set page background`);
  assert.match(block, /--theme-primary\s*:/i, `${themeId}: CSS must set primary`);
  const hasNavChrome =
    /--theme-nav-background/i.test(block) ||
    /--theme-nav-bg/i.test(block) ||
    /--theme-header-top-bg/i.test(block);
  assert.ok(hasNavChrome, `${themeId}: CSS must set nav or header chrome background`);
  const hasHover =
    /--theme-menu-hover-bg/i.test(block) ||
    /--theme-nav-hover/i.test(block) ||
    /--theme-menu-hover-text/i.test(block);
  assert.ok(hasHover, `${themeId}: CSS must set nav/menu hover tokens`);
  const hasNavFg =
    /--theme-nav-foreground/i.test(block) ||
    /--theme-nav-text/i.test(block) ||
    /--theme-menu-text/i.test(block);
  assert.ok(hasNavFg, `${themeId}: CSS must set nav or menu text`);
}

function assertNonEmptyVisualToken(themeId: string, label: string, value: string) {
  const v = value.trim();
  assert.ok(v.length > 0, `${themeId}: empty ${label}`);
}

describe("theme-registry palette coverage (deploy gate)", () => {
  for (const opt of THEME_OPTIONS) {
    it(`theme "${opt.id}" has TS palette or full CSS chrome block`, () => {
      const palette = getThemePaletteTokens(opt.id);
      const surface = getThemeSurfaceContrastTokens(opt.id);

      if (palette && surface) {
        for (const [k, v] of Object.entries(palette)) {
          assertNonEmptyVisualToken(opt.id, `palette.${k}`, String(v));
        }
        for (const [k, v] of Object.entries(surface)) {
          assertNonEmptyVisualToken(opt.id, `surface.${k}`, String(v));
        }
        assert.match(String(surface.navBackground), HEXISH, `${opt.id}: navBackground`);
        assert.match(String(surface.navForeground), HEXISH, `${opt.id}: navForeground`);
        assert.match(String(surface.background), HEXISH, `${opt.id}: page background`);
        return;
      }

      const block = extractThemeIdentityBlock(themePalettesCss, opt.id);
      assert.ok(block, `${opt.id}: missing THEME_PALETTE_TOKENS and no [data-theme] identity block in theme-palettes.css`);
      assertCssChromeBundle(opt.id, block);
    });
  }
});
