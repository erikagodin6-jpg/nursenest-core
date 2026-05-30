import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  TIER_VALUE_EXPERIENCES,
  TIER_VALUE_ORDER,
  type TierValueStageKey,
} from "@/lib/marketing/tier-value-experience";

const requiredStages: TierValueStageKey[] = [
  "learn",
  "practice",
  "assess",
  "remediate",
  "master",
];
const publicDir = path.resolve(process.cwd(), "public");

test("tier value experiences cover every required pathway and journey stage", () => {
  assert.deepEqual(TIER_VALUE_ORDER, [
    "rn",
    "pn",
    "np",
    "allied",
    "newgrad",
    "preNursing",
  ]);

  for (const key of TIER_VALUE_ORDER) {
    const experience = TIER_VALUE_EXPERIENCES[key];
    assert.equal(experience.key, key);
    assert.equal(experience.stages.length, requiredStages.length);
    assert.deepEqual(
      experience.stages.map((stage) => stage.key),
      requiredStages,
      `${experience.label} must follow Learn, Practice, Assess, Remediate, Master`,
    );
  }
});

test("tier value copy explains outcomes instead of generic feature checklists", () => {
  for (const experience of Object.values(TIER_VALUE_EXPERIENCES)) {
    assert.ok(
      experience.tagline.length > 40,
      `${experience.label} needs a specific value tagline`,
    );
    assert.ok(
      experience.differentiation.length > 40,
      `${experience.label} needs differentiation copy`,
    );

    for (const stage of experience.stages) {
      const copy = `${stage.headline} ${stage.body} ${stage.outcome}`;
      assert.doesNotMatch(copy, /✓|included features|checkmarks/i);
      assert.ok(
        stage.body.length > 80,
        `${experience.label} ${stage.label} needs outcome-led body copy`,
      );
      assert.ok(
        stage.outcome.length > 80,
        `${experience.label} ${stage.label} needs a learner outcome`,
      );
      assert.ok(
        stage.links.length >= 2,
        `${experience.label} ${stage.label} should connect to internal proof pages`,
      );
    }
  }
});

test("tier value screenshots are wired to a single canonical generated asset each", () => {
  for (const experience of Object.values(TIER_VALUE_EXPERIENCES)) {
    for (const stage of experience.stages) {
      assert.match(
        stage.screenshot,
        /^\/marketing\/generated-screenshots\/.+\.webp$/,
        `${experience.label} ${stage.label} should use Playwright-generated marketing screenshots`,
      );

      const screenshotPath = path.join(publicDir, stage.screenshot);
      assert.ok(
        fs.existsSync(screenshotPath),
        `${experience.label} ${stage.label} proof image does not exist: ${stage.screenshot}`,
      );
    }
  }
});
