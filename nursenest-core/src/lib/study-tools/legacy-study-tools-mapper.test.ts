import test from "node:test";
import assert from "node:assert/strict";
import {
  mapLegacyCategoryToBodySystem,
  mapLegacyRrtPharmStudyToolsExport,
} from "./legacy-study-tools-mapper";

test("mapLegacyCategoryToBodySystem preserves respiratory pharmacology buckets", () => {
  assert.equal(mapLegacyCategoryToBodySystem("Bronchodilators"), "respiratory");
  assert.equal(mapLegacyCategoryToBodySystem("Drug Interactions"), "pharmacology");
});

test("mapLegacyRrtPharmStudyToolsExport: categories preserved, published stays false", () => {
  const bundle = mapLegacyRrtPharmStudyToolsExport({
    pathwayId: "rn-nclex",
    tmcTraps: [
      {
        id: 1,
        trap: "t",
        wrongAnswer: "w",
        correctAnswer: "c",
        explanation: "e",
        category: "Asthma Management",
      },
    ],
    oneMinuteCards: [
      {
        id: 10,
        title: "Card",
        keyFacts: ["a"],
        examTip: "tip",
        category: "Ventilation",
      },
    ],
    highYieldSideEffects: [
      { drug: "X", sideEffects: ["s"], clinicalTip: "tip" },
    ],
  });

  assert.equal(bundle.published, false);
  assert.equal(bundle.pathwayId, "rn-nclex");
  assert.ok(bundle.activities.length >= 3);
  const trap = bundle.activities.find((a) => a.kind === "trap_mc");
  assert.ok(trap);
  assert.equal(trap!.grouping.category, "Asthma Management");
  assert.equal(trap!.grouping.bodySystem, "respiratory");
  const groupKeys = new Set(bundle.groupings.map((g) => `${g.bodySystem}:${g.category}`));
  assert.ok(groupKeys.size >= 1);
});
