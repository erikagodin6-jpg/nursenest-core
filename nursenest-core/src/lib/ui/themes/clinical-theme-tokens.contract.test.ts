import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LAUNCH_CLINICAL_THEME_IDS, getClinicalThemeMeta } from "@/lib/ui/themes/clinical-theme-tokens";
import { SEMANTIC_LESSON_SECTION_TOKENS } from "@/lib/ui/themes/semantic-section-tokens";
import { DASHBOARD_THEME_TOKENS } from "@/lib/ui/themes/dashboard-theme-tokens";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

const DISALLOWED_LABEL_WORDS = /\b(girl|boy|pink theme|dark blue theme)\b/i;

describe("launch clinical theme architecture", () => {
  it("keeps curated launch themes first in the registry", () => {
    assert.deepEqual(
      THEME_OPTIONS.slice(0, LAUNCH_CLINICAL_THEME_IDS.length).map((theme) => theme.id),
      [...LAUNCH_CLINICAL_THEME_IDS],
    );
    for (const id of LAUNCH_CLINICAL_THEME_IDS) {
      const option = THEME_OPTIONS.find((theme) => theme.id === id);
      const meta = getClinicalThemeMeta(id);
      assert.ok(option, `${id} must exist in THEME_OPTIONS`);
      assert.ok(meta, `${id} must exist in CLINICAL_THEME_META`);
      assert.equal(option?.label, meta?.label);
      assert.equal(option?.group, meta?.group);
      assert.equal(option?.named, true);
      assert.doesNotMatch(option?.label ?? "", DISALLOWED_LABEL_WORDS);
    }
  });

  it("exposes semantic lesson section token triples", () => {
    for (const [section, tokens] of Object.entries(SEMANTIC_LESSON_SECTION_TOKENS)) {
      assert.match(tokens.accent, /^--lesson-[a-z-]+-accent$/, `${section}: accent token`);
      assert.match(tokens.soft, /^--lesson-[a-z-]+-soft$/, `${section}: soft token`);
      assert.match(tokens.contrast, /^--lesson-[a-z-]+-contrast$/, `${section}: contrast token`);
    }
  });

  it("exposes dashboard premium UI tokens", () => {
    for (const [key, token] of Object.entries(DASHBOARD_THEME_TOKENS)) {
      assert.match(token, /^--nn-[a-z-]+$/, `${key}: dashboard token`);
    }
  });
});
