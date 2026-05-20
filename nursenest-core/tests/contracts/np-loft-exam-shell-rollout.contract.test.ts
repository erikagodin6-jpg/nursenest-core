import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { CNPLE_PATHWAY_ID } from "@/lib/exam-pathways/cnple-pathway";
import {
  pathwayUsesLoftNclexExamPresentation,
  PREMIUM_EXAM_SHELL_NP_CAT_PATHWAY_IDS,
} from "@/lib/practice-tests/premium-exam-shell-pathways";
import { resolvePremiumNclexShellRoute } from "@/lib/practice-tests/resolve-premium-nclex-shell-route";

const root = process.cwd();
const runPage = readFileSync(
  join(root, "src/app/(student)/app/(learner)/practice-tests/[id]/page.tsx"),
  "utf-8",
);
const layout = readFileSync(join(root, "src/components/exam/nclex-exam-layout.tsx"), "utf-8");

describe("NP premium exam shell rollout", () => {
  for (const pathwayId of PREMIUM_EXAM_SHELL_NP_CAT_PATHWAY_IDS) {
    it(`${pathwayId} practice exams use NclexPracticeRunner route`, () => {
      assert.equal(
        resolvePremiumNclexShellRoute({
          pathwayId,
          config: {
            pathwayId,
            selectionMode: "weak",
            linearDeliveryMode: "exam",
            linearRationaleVisibility: "end_of_exam",
          },
        }),
        "practice",
      );
    });

    it(`${pathwayId} CAT exam simulation routes to cat shell`, () => {
      assert.equal(
        resolvePremiumNclexShellRoute({
          pathwayId,
          config: {
            pathwayId,
            selectionMode: "cat",
            catPresentationMode: "exam_simulation",
          },
        }),
        "cat",
      );
    });
  }

  it("CNPLE linear practice exam routes to practice shell with LOFT presentation", () => {
    assert.equal(pathwayUsesLoftNclexExamPresentation(CNPLE_PATHWAY_ID), true);
    assert.equal(
      resolvePremiumNclexShellRoute({
        pathwayId: CNPLE_PATHWAY_ID,
        config: {
          pathwayId: CNPLE_PATHWAY_ID,
          linearDeliveryMode: "exam",
          linearRationaleVisibility: "end_of_exam",
        },
      }),
      "practice",
    );
    assert.ok(runPage.includes("pathwayUsesLoftNclexExamPresentation"));
    assert.ok(runPage.includes('nclexShellPresentation = "loft"'));
    assert.ok(layout.includes("data-nn-loft-simulation-shell"));
  });
});
