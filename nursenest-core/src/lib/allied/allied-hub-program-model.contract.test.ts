import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ALLIED_PROFESSION_KEYS } from "@/lib/allied/allied-professions-registry";
import {
  ALLIED_MINIMUM_CONTENT_PER_OCCUPATION,
  alliedPremiumModuleMatrixForOccupation,
  listAlliedOccupationsFromRegistry,
  usAlliedPathwayOrThrow,
} from "@/lib/allied/allied-hub-program-model";

describe("Allied hub program model", () => {
  it("registry keys align with ALLIED_PROFESSION_KEYS export", () => {
    const fromRegistry = listAlliedOccupationsFromRegistry().map((p) => p.professionKey).sort();
    const fromExport = [...ALLIED_PROFESSION_KEYS].sort();
    assert.deepEqual(fromRegistry, fromExport);
  });

  it("every occupation resolves a premium matrix without ECG or NGN tools", () => {
    const pathway = usAlliedPathwayOrThrow();
    for (const key of ALLIED_PROFESSION_KEYS) {
      const m = alliedPremiumModuleMatrixForOccupation(pathway, key, {
        clinicalScenariosPublic: false,
        oscePublic: true,
      });
      assert.ok(m.studyToolKeys.length > 0, key);
      assert.ok(!m.studyToolKeys.includes("ecg"), `${key}: no ECG tile`);
      assert.ok(!m.studyToolKeys.includes("ngn_tools"), `${key}: no NGN tools tile`);
      assert.ok(m.readinessKeys.includes("progress"), `${key}: progress`);
      assert.ok(m.readinessKeys.includes("exam_plan"), `${key}: exam plan`);
    }
  });

  it("minimum content object matches product brief floors", () => {
    assert.equal(ALLIED_MINIMUM_CONTENT_PER_OCCUPATION.lessons, 60);
    assert.equal(ALLIED_MINIMUM_CONTENT_PER_OCCUPATION.flashcards, 300);
    assert.equal(ALLIED_MINIMUM_CONTENT_PER_OCCUPATION.practiceQuestions, 300);
  });
});
