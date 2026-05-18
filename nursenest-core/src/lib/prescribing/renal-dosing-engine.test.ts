import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRenalDosingResult,
  estimateCreatinineClearance
} from "./renal-dosing-engine";

describe("renal dosing engine", () => {
  it("calculates creatinine clearance", () => {
    const result = estimateCreatinineClearance({
      age: 70,
      weightKg: 70,
      serumCreatinine: 1.2,
      sex: "female"
    });

    assert.ok(result > 0);
  });

  it("categorizes severe impairment", () => {
    const result = buildRenalDosingResult({
      age: 82,
      weightKg: 50,
      serumCreatinine: 3.4,
      sex: "female"
    });

    assert.equal(result.category, "severe-impairment");
  });
});
