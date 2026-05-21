/**
 * Nav/header chrome must follow canonical surface tokens (not a stale hardcoded map)
 * so new themes update the full nav, not only logo/accent.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getNavChrome } from "@/lib/theme/nav-chrome";
import { getThemeSurfaceContrastTokens } from "@/lib/theme/theme-palette-tokens";

const NEW_PREMIUM_THEMES = [
  "blueberry-sherbet",
  "strawberry-cream",
  "ocean-mist",
  "lavender-dream",
  "mint-breeze",
] as const;

/** Themes with TS palette or canonical surface overrides (not CSS-only identity themes). */
const SEMANTIC_NAV_THEMES = [...NEW_PREMIUM_THEMES, "ocean", "blossom", "mint-blossom"] as const;

describe("nav chrome tracks semantic surface tokens", () => {
  for (const id of SEMANTIC_NAV_THEMES) {
    it(`theme "${id}" maps getNavChrome to surface nav colors`, () => {
      const surface = getThemeSurfaceContrastTokens(id);
      assert.ok(surface, `${id}: missing surface tokens`);
      const chrome = getNavChrome(id);
      assert.equal(chrome.chrome, surface.navBackground);
      assert.equal(chrome.foreground, surface.navForeground);
      assert.equal(chrome.border, surface.navBorder);
      assert.equal(chrome.hoverBg, surface.navHover);
    });
  }

  it("mint-breeze does not reuse generic mint cyan chrome", () => {
    const chrome = getNavChrome("mint-breeze");
    assert.notEqual(
      chrome.chrome.toLowerCase(),
      "#1da2d8",
      "mint-breeze must use brand teal from palette, not legacy mint map",
    );
    assert.equal(chrome.chrome, getThemeSurfaceContrastTokens("mint-breeze")!.navBackground);
  });
});

describe("CSS-only picker themes still resolve nav chrome", () => {
  for (const id of ["aurora", "sunset", "meadow"] as const) {
    it(`theme "${id}" uses static nav map when no surface tokens`, () => {
      assert.equal(getThemeSurfaceContrastTokens(id), null);
      const chrome = getNavChrome(id);
      // Static nav map may use a hex (#…) or a CSS color-mix() expression
      // for warm pastel chromes; both are valid concrete colors.
      assert.match(chrome.chrome, /^(#|color-mix\()/);
      assert.ok(chrome.foreground.length > 0);
    });
  }
});
