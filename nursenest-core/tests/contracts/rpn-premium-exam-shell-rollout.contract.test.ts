import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { PREMIUM_EXAM_SHELL_RPN_PATHWAY_IDS } from "@/lib/practice-tests/premium-exam-shell-pathways";
import { resolvePremiumNclexShellRoute } from "@/lib/practice-tests/resolve-premium-nclex-shell-route";

const root = process.cwd();
const hubSrc = readFileSync(
  join(root, "src/components/student/practice-tests-hub-client.tsx"),
  "utf-8",
);

describe("RPN premium exam shell rollout", () => {
  for (const pathwayId of PREMIUM_EXAM_SHELL_RPN_PATHWAY_IDS) {
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

    it(`${pathwayId} CAT exam simulation uses NclexCatRunner route`, () => {
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

  it("hub study tools preserve pathway when opening Practice Exams", () => {
    assert.match(hubSrc, /pathwayId=\$\{encodeURIComponent\(trimmedPathwayId\)\}/);
  });

  it("hub uses premium practice-exam convergence shell (pathway-agnostic)", () => {
    assert.match(hubSrc, /SharedStudySetupLayout/);
    assert.match(hubSrc, /mode=\{examMode === "cat" \? "cat" : "practice-exam"\}/);
    assert.match(hubSrc, /sessionMode: "exam"/);
  });
});
