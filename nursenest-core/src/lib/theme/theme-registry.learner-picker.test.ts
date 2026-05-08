import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LAUNCH_CLINICAL_THEME_IDS } from "@/lib/ui/themes/clinical-theme-tokens";
import {
  LEARNER_THEME_PICKER_ALLOWLIST,
  THEME_OPTIONS,
  themeOptionsForLearnerPicker,
} from "./theme-registry";

describe("themeOptionsForLearnerPicker", () => {
  it("returns only launch clinical themes in registry order", () => {
    const opts = themeOptionsForLearnerPicker();
    assert.deepStrictEqual(
      opts.map((o) => o.id),
      [...LAUNCH_CLINICAL_THEME_IDS],
    );
    assert.strictEqual(opts.length, LAUNCH_CLINICAL_THEME_IDS.length);
  });

  it("allowlist matches launch clinical ids", () => {
    assert.deepStrictEqual([...LEARNER_THEME_PICKER_ALLOWLIST], [...LAUNCH_CLINICAL_THEME_IDS]);
  });

  it("every learner picker id exists in THEME_OPTIONS", () => {
    const ids = new Set(THEME_OPTIONS.map((o) => o.id));
    for (const id of LEARNER_THEME_PICKER_ALLOWLIST) {
      assert.ok(ids.has(id), `missing theme-registry entry for ${id}`);
    }
  });
});
