/**
 * Tests for the adaptive practice session setup:
 *   - buildPracticeAdaptiveCreatePayload produces the correct config
 *   - Practice mode always uses catExamFeedbackMode: "study" (rationale after each question)
 *   - CAT exam simulation still uses catExamFeedbackMode: "test" (unchanged)
 *   - Filters (topicNames, catSelectionBasis) are passed through correctly
 *   - Question count is clamped to valid bounds
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildPracticeAdaptiveCreatePayload,
  buildCatExamSimulationCreatePayload,
} from "@/components/student/pathway-cat-start-payload";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeShell(overrides?: Partial<PracticeTestPathwayClientShell>): PracticeTestPathwayClientShell {
  return {
    id: "ca-rn-nclex-rn",
    countrySlug: "canada",
    roleTrack: "rn",
    examCode: "nclex-rn",
    shortName: "CA RN",
    examFamily: "NCLEX_RN",
    ...overrides,
  };
}

// ── buildPracticeAdaptiveCreatePayload ───────────────────────────────────────

describe("buildPracticeAdaptiveCreatePayload", () => {
  it("returns practice mode with study feedback (rationale after each question)", () => {
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "random",
      questionCount: 30,
    });
    assert.equal(p.catPresentationMode, "practice");
    assert.equal(p.catExamFeedbackMode, "study", "Practice mode must show rationale after each question");
    assert.equal(p.selectionMode, "cat");
    assert.equal(p.timedMode, false, "Practice mode must not be timed");
  });

  it("passes topicNames through to the payload", () => {
    const topics = ["Cardiovascular", "Respiratory"];
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: topics,
      catSelectionBasis: "random",
      questionCount: 20,
    });
    assert.deepEqual(p.topicNames, topics);
  });

  it("empty topicNames = all systems (no filter)", () => {
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "random",
      questionCount: 20,
    });
    assert.deepEqual(p.topicNames, []);
  });

  it("passes weak selection basis for weak areas filter", () => {
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "weak",
      questionCount: 30,
    });
    assert.equal(p.catSelectionBasis, "weak");
  });

  it("passes missed selection basis for previously incorrect filter", () => {
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "missed",
      questionCount: 30,
    });
    assert.equal(p.catSelectionBasis, "missed");
  });

  it("clamps questionCount to [10, 200]", () => {
    const low = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "random",
      questionCount: 1,
    });
    assert.equal(low.questionCount, 10, "minimum is 10");

    const high = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "random",
      questionCount: 9999,
    });
    assert.equal(high.questionCount, 200, "maximum is 200");
  });

  it("includes pathwayId in the payload", () => {
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "us-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "random",
      questionCount: 30,
    });
    assert.equal(p.pathwayId, "us-rn-nclex-rn");
  });

  it("accepts multiple topic names for multi-system filter", () => {
    const systems = ["Cardiovascular", "Respiratory", "Neurological", "Pharmacology"];
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: systems,
      catSelectionBasis: "random",
      questionCount: 50,
    });
    assert.deepEqual(p.topicNames, systems);
    assert.equal(p.questionCount, 50);
  });
});

// ── CAT exam simulation is unchanged ─────────────────────────────────────────

describe("buildCatExamSimulationCreatePayload (CAT mode must be unchanged)", () => {
  it("CAT exam simulation uses test feedback mode (no rationale during session)", () => {
    const shell = makeShell();
    const p = buildCatExamSimulationCreatePayload(shell);
    assert.equal(
      p.catExamFeedbackMode,
      "test",
      "CAT exam simulation must NOT show rationale during the session",
    );
    assert.equal(p.catPresentationMode, "exam_simulation");
    assert.equal(p.timedMode, true);
  });

  it("CAT exam simulation and practice mode use the same adaptive engine", () => {
    const shell = makeShell();
    const cat = buildCatExamSimulationCreatePayload(shell);
    const practice = buildPracticeAdaptiveCreatePayload({
      pathwayId: shell.id,
      topicNames: [],
      catSelectionBasis: "random",
      questionCount: 30,
    });
    // Both use the CAT engine
    assert.equal(cat.selectionMode, "cat");
    assert.equal(practice.selectionMode, "cat");
    // They differ only in presentation / feedback mode
    assert.notEqual(cat.catPresentationMode, practice.catPresentationMode);
    assert.notEqual(cat.catExamFeedbackMode, practice.catExamFeedbackMode);
  });
});

// ── Filter correctness ────────────────────────────────────────────────────────

describe("practice adaptive filter correctness", () => {
  it("no systems selected + no special filter → all questions (empty topicNames, random basis)", () => {
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "random",
      questionCount: 30,
    });
    assert.deepEqual(p.topicNames, []);
    assert.equal(p.catSelectionBasis, "random");
  });

  it("body systems selected → topicNames filter, random basis", () => {
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: ["Cardiovascular", "Renal"],
      catSelectionBasis: "random",
      questionCount: 20,
    });
    assert.deepEqual(p.topicNames, ["Cardiovascular", "Renal"]);
    assert.equal(p.catSelectionBasis, "random");
  });

  it("weak areas special filter → empty topicNames, weak basis", () => {
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "weak",
      questionCount: 30,
    });
    assert.deepEqual(p.topicNames, []);
    assert.equal(p.catSelectionBasis, "weak");
  });

  it("previously incorrect special filter → empty topicNames, missed basis", () => {
    const p = buildPracticeAdaptiveCreatePayload({
      pathwayId: "ca-rn-nclex-rn",
      topicNames: [],
      catSelectionBasis: "missed",
      questionCount: 30,
    });
    assert.deepEqual(p.topicNames, []);
    assert.equal(p.catSelectionBasis, "missed");
  });
});
