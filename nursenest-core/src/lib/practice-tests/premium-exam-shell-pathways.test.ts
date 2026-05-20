import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PREMIUM_EXAM_SHELL_LOFT_PATHWAY_IDS,
  PREMIUM_EXAM_SHELL_RN_PATHWAY_IDS,
  PREMIUM_EXAM_SHELL_RPN_PATHWAY_IDS,
  pathwayUsesLoftNclexExamPresentation,
  pathwayUsesPremiumNclexExamShell,
  premiumExamShellSliceForPathway,
} from "@/lib/practice-tests/premium-exam-shell-pathways";

describe("premium exam shell pathways — RN", () => {
  for (const id of PREMIUM_EXAM_SHELL_RN_PATHWAY_IDS) {
    it(`${id} uses premium NCLEX shell`, () => {
      assert.equal(pathwayUsesPremiumNclexExamShell(id), true);
      assert.equal(premiumExamShellSliceForPathway(id), "rn");
      assert.equal(pathwayUsesLoftNclexExamPresentation(id), false);
    });
  }
});

describe("premium exam shell pathways — RPN", () => {
  for (const id of PREMIUM_EXAM_SHELL_RPN_PATHWAY_IDS) {
    it(`${id} uses premium NCLEX shell`, () => {
      assert.equal(pathwayUsesPremiumNclexExamShell(id), true);
      assert.equal(premiumExamShellSliceForPathway(id), "rpn");
      assert.equal(pathwayUsesLoftNclexExamPresentation(id), false);
    });
  }
});

describe("premium exam shell pathways — NP / LOFT", () => {
  it("US NP FNP uses CAT premium shell", () => {
    assert.equal(pathwayUsesPremiumNclexExamShell("us-np-fnp"), true);
    assert.equal(premiumExamShellSliceForPathway("us-np-fnp"), "np");
  });

  for (const id of PREMIUM_EXAM_SHELL_LOFT_PATHWAY_IDS) {
    it(`${id} uses LOFT presentation on shared shell layout`, () => {
      assert.equal(pathwayUsesPremiumNclexExamShell(id), true);
      assert.equal(pathwayUsesLoftNclexExamPresentation(id), true);
      assert.equal(premiumExamShellSliceForPathway(id), "loft");
    });
  }
});
