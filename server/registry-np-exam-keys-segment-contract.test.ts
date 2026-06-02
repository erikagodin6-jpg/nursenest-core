import { describe, expect, test } from "vitest";
import { EXAM_PATHWAYS } from "../nursenest-core/src/lib/exam-pathways/exam-product-registry";
import { EXAM_PATHWAYS_SEGMENT_A } from "../nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-a";
import { EXAM_PATHWAYS_SEGMENT_C } from "../nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-c";

/**
 * `exam-questions-json-np-recovery` derives NP registry exam keys from segment A (np rows) + segment C only.
 * This contract fails if a new NP pathway is added outside those segments (update the recovery module).
 */
describe("registry NP exam keys (segment import boundary)", () => {
  test("NP contentExamKeys from segments A+C match full-registry NP pathways", () => {
    const fromFacade = new Set(
      EXAM_PATHWAYS.filter((p) => p.roleTrack === "np").flatMap((p) => p.contentExamKeys.map((k) => k.toUpperCase())),
    );
    const fromSegments = new Set(
      [...EXAM_PATHWAYS_SEGMENT_A.filter((p) => p.roleTrack === "np"), ...EXAM_PATHWAYS_SEGMENT_C].flatMap((p) =>
        p.contentExamKeys.map((k) => k.toUpperCase()),
      ),
    );
    expect([...fromSegments].sort()).toEqual([...fromFacade].sort());
  });
});
