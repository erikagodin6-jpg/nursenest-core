import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  flashcardLearnerExamPoolCandidateScopes,
  flashcardLearnerExamPoolWhereSql,
  flashcardLearnerExamQualityGatesSql,
} from "@/lib/flashcards/flashcard-learner-exam-pool-sql";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

const caRn = getExamPathwayById("ca-rn-nclex-rn")!;
const caRpn = getExamPathwayById("ca-rpn-rex-pn")!;

const caRnScope: AccessScope = {
  hasAccess: true,
  reason: "active_subscription",
  country: "CA",
  tier: "RN",
  alliedCareer: null,
};

describe("flashcard learner exam pool SQL", () => {
  it("quality gates SQL references correct_answer jsonb and flashcard format exclusions", () => {
    const q = flashcardLearnerExamQualityGatesSql().strings.join("");
    assert.match(q, /jsonb_typeof/i);
    assert.match(q, /question_format/i);
    assert.match(q, /ecg-video/i);
  });

  it("learner pool SQL uses study_link_pathway_id OR and normalized pathway scope fragment", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const scope: AccessScope = {
      hasAccess: true,
      reason: "active_subscription",
      tier: "RN",
      country: "US",
      alliedCareer: null,
    };
    const sql = flashcardLearnerExamPoolWhereSql(scope, pathway).strings.join("\n");
    assert.match(sql, /study_link_pathway_id/i);
    assert.match(sql, /regexp_replace/i);
    assert.match(sql, /coalesce\(exam/i);
  });
});

describe("flashcard learner exam pool candidate scopes", () => {
  it("retries Canada RN against the shared US NCLEX-RN bank only after the CA scope", () => {
    const scopes = flashcardLearnerExamPoolCandidateScopes(caRnScope, caRn);
    assert.equal(scopes.length, 2);
    assert.equal(scopes[0]?.country, "CA");
    assert.equal(scopes[1]?.country, "US");
    assert.equal(scopes[1]?.tier, "RN");
  });

  it("does not widen non-RN Canada pathways", () => {
    assert.deepEqual(flashcardLearnerExamPoolCandidateScopes({ ...caRnScope, tier: "RPN" }, caRpn), [
      { ...caRnScope, tier: "RPN" },
    ]);
  });
});
