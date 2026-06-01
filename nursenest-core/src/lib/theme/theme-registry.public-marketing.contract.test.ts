import assert from "node:assert/strict";
import test from "node:test";
import {
  NURSENEST_DEFAULT_THEME,
  PUBLIC_MARKETING_THEME_ALLOWLIST,
  publicMarketingThemeChoiceCount,
  themeOptionsForPublicMarketingPicker,
} from "@/lib/theme/theme-registry";

test("public marketing theme allowlist exposes Ocean, Midnight, Blossom, Sea Glass, Aurora, Sunset, Alpine, Sage", () => {
  assert.deepEqual([...PUBLIC_MARKETING_THEME_ALLOWLIST], [
    NURSENEST_DEFAULT_THEME,
    "midnight",
    "blossom",
    "sea-glass",
    "aurora",
    "sunset",
    "alpine",
    "sage",
  ]);
  const opts = themeOptionsForPublicMarketingPicker();
  assert.equal(opts.length, 8);
  assert.ok(opts.some((o) => o.id === NURSENEST_DEFAULT_THEME));
  assert.ok(opts.some((o) => o.id === "midnight"));
  assert.ok(opts.some((o) => o.id === "blossom"));
  assert.ok(opts.some((o) => o.id === "sea-glass" && o.label === "Sea Glass"));
  assert.ok(opts.some((o) => o.id === "aurora"));
  assert.ok(opts.some((o) => o.id === "sunset"));
  assert.ok(opts.some((o) => o.id === "alpine"));
  assert.ok(opts.some((o) => o.id === "sage"));
  assert.equal(publicMarketingThemeChoiceCount(), 8);
});
