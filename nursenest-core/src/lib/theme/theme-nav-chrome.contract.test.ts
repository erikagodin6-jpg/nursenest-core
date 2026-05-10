import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getNavChrome, NAV_CHROME_BY_THEME } from "@/lib/theme/nav-chrome";

const HERE = dirname(fileURLToPath(import.meta.url));
const PALETTES_PATH = resolve(HERE, "../../app/theme-palettes.css");
const css = readFileSync(PALETTES_PATH, "utf-8");

const THEME_IDS = [
  "aurora",
  "sunset",
  "ocean-air",
  "meadow",
  "blueberry-sherbet",
  "strawberry-cream",
  "ocean-mist",
  "lavender-dream",
  "mint-breeze",
] as const;

const REQUIRED_CSS_TOKENS = [
  "--theme-header-top-bg",
  "--theme-header-main-bg",
  "--theme-header-secondary-bg",
  "--theme-header-secondary-fg",
  "--theme-nav-background",
  "--theme-nav-foreground",
  "--theme-nav-hover",
  "--theme-nav-hover-foreground",
  "--theme-brand-accent",
  "--theme-header-divider",
] as const;

function blockFor(themeId: string): string {
  const re = new RegExp(`\\[data-theme="${themeId}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const match = css.match(re);
  assert.ok(match, `missing [data-theme="${themeId}"]`);
  return match[0]!;
}

describe("theme nav/header chrome tokens", () => {
  it("new themes define the full production header token set", () => {
    for (const id of THEME_IDS) {
      const block = blockFor(id);
      for (const token of REQUIRED_CSS_TOKENS) {
        assert.match(block, new RegExp(`${token}:\\s*[^;]+;`), `${id} missing ${token}`);
      }
    }
  });

  it("new themes have explicit nav chrome mappings beyond logo accents", () => {
    const seen = new Set<string>();
    for (const id of THEME_IDS) {
      assert.ok(NAV_CHROME_BY_THEME[id], `missing NAV_CHROME_BY_THEME entry for ${id}`);
      const chrome = getNavChrome(id);
      assert.ok(
        chrome.chrome.startsWith("#") || chrome.chrome.startsWith("color-mix"),
        `${id} chrome must be a concrete color or color-mix()`,
      );
      assert.ok(chrome.foreground, `${id} foreground must be set`);
      seen.add(chrome.chrome);
    }

    assert.ok(seen.size > 4, "theme changes should alter nav/header chrome, not only logo variables");
  });
});
