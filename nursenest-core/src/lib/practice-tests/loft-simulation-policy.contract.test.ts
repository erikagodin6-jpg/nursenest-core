import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isLoftSimulationPolicy } from "./loft-simulation-policy";
import { resolveLearnerExamShellModeForPracticeRunner } from "./linear-runner-session-mode";

describe("LOFT simulation policy", () => {
  it("identifies CNPLE as LOFT simulation", () => {
    assert.equal(isLoftSimulationPolicy({ examCode: "cnple" }), true);
    assert.equal(isLoftSimulationPolicy({ examCode: "CNPLE" }), true);
  });

  it("identifies explicit LOFT and linear exam delivery", () => {
    assert.equal(isLoftSimulationPolicy({ simulationKind: "loft" }), true);
    assert.equal(isLoftSimulationPolicy({ deliveryMode: "linear_exam" }), true);
  });

  it("does not classify adaptive NCLEX/CAT as LOFT", () => {
    assert.equal(isLoftSimulationPolicy({ examCode: "nclex-rn", deliveryMode: "cat" }), false);
    assert.equal(isLoftSimulationPolicy({ examCode: "rex-pn", deliveryMode: "cat" }), false);
  });

  it("resolves linear exam delivery to LOFT shell", () => {
    assert.equal(
      resolveLearnerExamShellModeForPracticeRunner({
        status: "IN_PROGRESS",
        catMode: false,
        linearPracticeSplitReview: false,
        linearDeliveryMode: "exam",
      }),
      "loft",
    );
  });

  it("keeps adaptive CAT on CAT shell even when other policy hints exist", () => {
    assert.equal(
      resolveLearnerExamShellModeForPracticeRunner({
        status: "IN_PROGRESS",
        catMode: true,
        linearPracticeSplitReview: false,
        linearDeliveryMode: "exam",
        loftPolicy: { examCode: "cnple" },
      }),
      "cat",
    );
  });

  it("resolves CNPLE policy to LOFT shell when not adaptive CAT", () => {
    assert.equal(
      resolveLearnerExamShellModeForPracticeRunner({
        status: "IN_PROGRESS",
        catMode: false,
        linearPracticeSplitReview: false,
        loftPolicy: { examCode: "cnple" },
      }),
      "loft",
    );
  });
});
