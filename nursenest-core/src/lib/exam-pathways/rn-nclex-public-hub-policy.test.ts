import assert from "node:assert/strict";
import test from "node:test";
import {
  RN_NCLEX_EXAM_HUB_OVERVIEW_REDIRECT,
  rnNclexExamHubOverviewRedirectTarget,
} from "@/lib/exam-pathways/rn-nclex-public-hub-policy";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

test("RN NCLEX marketing hub overview redirects to canonical lessons entry", () => {
  assert.equal(RN_NCLEX_EXAM_HUB_OVERVIEW_REDIRECT, "/lessons");
  assert.equal(rnNclexExamHubOverviewRedirectTarget({ id: "us-rn-nclex-rn" } as ExamPathwayDefinition), "/lessons");
  assert.equal(rnNclexExamHubOverviewRedirectTarget({ id: "ca-rn-nclex-rn" } as ExamPathwayDefinition), "/lessons");
  assert.equal(rnNclexExamHubOverviewRedirectTarget({ id: "us-np-fnp" } as ExamPathwayDefinition), null);
  assert.equal(rnNclexExamHubOverviewRedirectTarget(null), null);
});
