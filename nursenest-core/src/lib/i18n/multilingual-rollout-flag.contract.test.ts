/**
 * @contract Multilingual rollout flag behavior
 *
 * Requirements:
 *   - Default: disabled (no env = off)
 *   - Enabled only when NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT="true"
 *   - Non-rollout locales always visible
 *   - Rollout locales hidden unless flag on, staff, or previewLocale match
 */
import {
  describe,
  test,
} from "node:test";
import assert from "node:assert/strict";

import {
  isMultilingualRolloutEnabled,
  isRolloutLocale,
  isLocaleVisible,
  MULTILINGUAL_ROLLOUT_LOCALES,
} from "./multilingual-rollout-flag";

describe("multilingual-rollout-flag", () => {
  describe("isMultilingualRolloutEnabled", () => {
    test("defaults to false when env is unset", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT;
      assert.equal(isMultilingualRolloutEnabled(), false);
    });

    test("defaults to false when env is empty", () => {
      process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT = "";
      assert.equal(isMultilingualRolloutEnabled(), false);
    });

    test("defaults to false when env is 'false'", () => {
      process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT = "false";
      assert.equal(isMultilingualRolloutEnabled(), false);
    });

    test("returns true when env is 'true'", () => {
      process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT = "true";
      assert.equal(isMultilingualRolloutEnabled(), true);
    });
  });

  describe("isRolloutLocale", () => {
    test("returns true for all target locales", () => {
      for (const locale of MULTILINGUAL_ROLLOUT_LOCALES) {
        assert.equal(isRolloutLocale(locale), true, `expected ${locale} to be a rollout locale`);
      }
    });

    test("returns false for non-target locales", () => {
      const nonTargets = ["en", "fr", "es", "pt", "hi", "zh", "ko", "ru"];
      for (const locale of nonTargets) {
        assert.equal(isRolloutLocale(locale), false, `expected ${locale} NOT to be a rollout locale`);
      }
    });
  });

  describe("isLocaleVisible", () => {
    test("non-rollout locales are always visible", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT;
      assert.equal(isLocaleVisible("en"), true);
      assert.equal(isLocaleVisible("fr"), true);
      assert.equal(isLocaleVisible("es"), true);
    });

    test("rollout locales hidden when flag off and no staff/preview", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT;
      for (const locale of MULTILINGUAL_ROLLOUT_LOCALES) {
        assert.equal(isLocaleVisible(locale), false, `expected ${locale} to be hidden`);
      }
    });

    test("rollout locales visible when flag is on", () => {
      process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT = "true";
      for (const locale of MULTILINGUAL_ROLLOUT_LOCALES) {
        assert.equal(isLocaleVisible(locale), true, `expected ${locale} to be visible`);
      }
    });

    test("rollout locales visible for staff even when flag off", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT;
      for (const locale of MULTILINGUAL_ROLLOUT_LOCALES) {
        assert.equal(isLocaleVisible(locale, { isStaff: true }), true);
      }
    });

    test("rollout locale visible when previewLocale matches", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT;
      assert.equal(isLocaleVisible("de", { previewLocale: "de" }), true);
      assert.equal(isLocaleVisible("ja", { previewLocale: "ja" }), true);
    });

    test("rollout locale hidden when previewLocale does not match", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT;
      assert.equal(isLocaleVisible("de", { previewLocale: "ja" }), false);
    });
  });
});
