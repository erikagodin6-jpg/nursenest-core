import assert from "node:assert/strict";
import test from "node:test";
import {
  NURSENEST_DEFAULT_THEME,
  PUBLIC_MARKETING_THEME_ALLOWLIST,
  publicMarketingThemeChoiceCount,
  themeOptionsForPublicMarketingPicker,
} from "@/lib/theme/theme-registry";

test("public marketing theme allowlist is primary brand only", () => {
  assert.deepEqual([...PUBLIC_MARKETING_THEME_ALLOWLIST], [NURSENEST_DEFAULT_THEME]);
  const opts = themeOptionsForPublicMarketingPicker();
  assert.equal(opts.length, 1);
  assert.equal(opts[0]?.id, NURSENEST_DEFAULT_THEME);
  assert.equal(publicMarketingThemeChoiceCount(), 1);
});
