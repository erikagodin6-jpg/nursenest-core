import assert from "node:assert/strict";
import test from "node:test";
import {
  NURSENEST_DEFAULT_THEME,
  PUBLIC_MARKETING_THEME_ALLOWLIST,
  publicMarketingThemeChoiceCount,
  themeOptionsForPublicMarketingPicker,
} from "@/lib/theme/theme-registry";

test("public marketing theme allowlist exposes Ocean + Midnight for the public Theme control", () => {
  assert.deepEqual([...PUBLIC_MARKETING_THEME_ALLOWLIST], [NURSENEST_DEFAULT_THEME, "midnight"]);
  const opts = themeOptionsForPublicMarketingPicker();
  assert.equal(opts.length, 2);
  assert.ok(opts.some((o) => o.id === NURSENEST_DEFAULT_THEME));
  assert.ok(opts.some((o) => o.id === "midnight"));
  assert.equal(publicMarketingThemeChoiceCount(), 2);
});
