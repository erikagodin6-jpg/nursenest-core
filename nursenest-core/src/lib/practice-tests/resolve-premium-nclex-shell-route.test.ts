import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolvePremiumNclexShellRoute } from "@/lib/practice-tests/resolve-premium-nclex-shell-route";

describe("resolvePremiumNclexShellRoute", () => {
  it("routes RN CAT exam simulation to cat shell", () => {
    assert.equal(
      resolvePremiumNclexShellRoute({
        pathwayId: "us-rn-nclex-rn",
        config: {
          pathwayId: "us-rn-nclex-rn",
          selectionMode: "cat",
          catPresentationMode: "exam_simulation",
        },
      }),
      "cat",
    );
  });

  it("routes RPN linear practice exam to practice shell", () => {
    assert.equal(
      resolvePremiumNclexShellRoute({
        pathwayId: "ca-rpn-rex-pn",
        config: {
          pathwayId: "ca-rpn-rex-pn",
          selectionMode: "random",
          linearDeliveryMode: "exam",
          linearRationaleVisibility: "end_of_exam",
        },
      }),
      "practice",
    );
  });

  it("routes CNPLE linear exam to practice shell (LOFT pathway)", () => {
    assert.equal(
      resolvePremiumNclexShellRoute({
        pathwayId: "ca-np-cnple",
        config: {
          pathwayId: "ca-np-cnple",
          selectionMode: "random",
          linearDeliveryMode: "exam",
          linearRationaleVisibility: "end_of_exam",
        },
      }),
      "practice",
    );
  });

  it("keeps CAT study on legacy runner", () => {
    assert.equal(
      resolvePremiumNclexShellRoute({
        pathwayId: "us-rn-nclex-rn",
        config: {
          pathwayId: "us-rn-nclex-rn",
          selectionMode: "cat",
          catAdaptiveSessionType: "practice",
          catPresentationMode: "practice",
        },
      }),
      null,
    );
  });

  it("does not route allied linear exams to NCLEX shell", () => {
    assert.equal(
      resolvePremiumNclexShellRoute({
        pathwayId: "ca-allied-core",
        config: { pathwayId: "ca-allied-core", linearDeliveryMode: "exam" },
      }),
      null,
    );
  });
});
