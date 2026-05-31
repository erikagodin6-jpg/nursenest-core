import assert from "node:assert/strict";
import test from "node:test";
import {
  clinicalPearlGate,
  normalizeClinicalPearlForDuplicateDetection,
  scoreClinicalPearl,
} from "@/lib/questions/clinical-pearl-score";

test("clinical pearl scoring fails missing and generic pearls", () => {
  const missing = scoreClinicalPearl({ id: "missing", pearl: "" });
  assert.equal(missing.score, 1);
  assert.equal(missing.gate, "fail");

  const generic = scoreClinicalPearl({
    id: "generic",
    pearl: "This is important for safe care.",
    topic: "Heart failure",
  });
  assert.equal(generic.gate, "fail");
  assert.ok(generic.failureReasons.some((reason) => reason.includes("Generic")));
});

test("clinical pearl scoring rewards memorable bedside safety insight", () => {
  const result = scoreClinicalPearl({
    id: "heart-failure",
    pathway: "NCLEX-RN",
    topic: "Heart Failure",
    stem: "A client has crackles, dyspnea, edema, and oxygen saturation of 88%.",
    pearl: "Weight gain warns early, but dyspnea with falling SpO2 means the patient may be deteriorating now.",
  });

  assert.equal(result.score, 5);
  assert.equal(result.gate, "flagship");
  assert.equal(result.failureReasons.length, 0);
});

test("clinical pearl gate thresholds match publish policy", () => {
  assert.equal(clinicalPearlGate(1), "fail");
  assert.equal(clinicalPearlGate(2), "fail");
  assert.equal(clinicalPearlGate(3), "review");
  assert.equal(clinicalPearlGate(4), "publish_eligible");
  assert.equal(clinicalPearlGate(5), "flagship");
});

test("clinical pearl duplicate normalization is stable", () => {
  assert.equal(
    normalizeClinicalPearlForDuplicateDetection("Trend beats snapshot — reassess after intervention."),
    "trend beats snapshot reassess after intervention",
  );
});

