/**
 * Guard: {@link buildExamPathwayPath} in `build-exam-pathway-path.ts` must stay identical to the
 * re-export from `exam-product-registry` so narrow imports do not drift from the catalog facade.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildExamPathwayPath } from "./build-exam-pathway-path";
import { EXAM_PATHWAYS, buildExamPathwayPath as buildExamPathwayPathFromRegistry } from "./exam-product-registry";

describe("buildExamPathwayPath narrow module", () => {
  it("matches exam-product-registry for every pathway (base + sample subpath)", () => {
    for (const p of EXAM_PATHWAYS) {
      assert.equal(buildExamPathwayPath(p), buildExamPathwayPathFromRegistry(p));
      assert.equal(
        buildExamPathwayPath(p, "lessons/sample-lesson"),
        buildExamPathwayPathFromRegistry(p, "lessons/sample-lesson"),
      );
    }
  });
});
