import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingHubInventoryWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import { expandedExamKeysForPathwayPool } from "@/lib/content-quality/exam-question-exam-normalization";
import { generalStudyBankModuleSurfaceWhere } from "@/lib/study-question-pool/study-question-pool-gates";
import { NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-pool";

test("us-rn-nclex-rn practice hub inventory uses the expected pathway scope", () => {
  const pathway = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(pathway);
  assert.equal(pathway.countryCode, "US");
  assert.equal(pathway.stripeTier, "RN");
  assert.deepEqual(pathway.contentExamKeys, ["NCLEX-RN", "NCLEX_RN"]);

  const expandedExamKeys = expandedExamKeysForPathwayPool([...new Set(pathway.contentExamKeys)]);
  assert.ok(expandedExamKeys.includes("NCLEX-RN"));
  assert.ok(expandedExamKeys.includes("NCLEX_RN"));

  const where = pathwayExamQuestionMarketingHubInventoryWhere(pathway);
  const serialized = JSON.stringify(where);
  assert.match(serialized, /"exam":\{"in":\["NCLEX-RN","NCLEX_RN"\]\}/);
  assert.match(serialized, /"status":\{"in":\["published","PUBLISHED"\]\}/);
  assert.match(serialized, /"regionScope":"US_ONLY"/);
  assert.match(serialized, /"regionScope":"BOTH"/);
  assert.match(serialized, /"tier":\{"equals":"rpn","mode":"insensitive"\}/);
  assert.match(serialized, /"tier":\{"equals":"lvn","mode":"insensitive"\}/);
  assert.match(serialized, /"tier":\{"equals":"rn","mode":"insensitive"\}/);
});

test("us-rn-nclex-rn practice hub inventory excludes ECG and module-only rows unless opted in", () => {
  const pathway = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(pathway);
  const where = pathwayExamQuestionMarketingHubInventoryWhere(pathway);
  const serialized = JSON.stringify(where);

  assert.deepEqual(NON_ECG_PRACTICE_EXAM_WHERE, {
    NOT: [{ questionFormat: "ecg_video" }, { tags: { has: "ecg-video" } }],
  });
  assert.deepEqual(generalStudyBankModuleSurfaceWhere(), {
    OR: [
      { tags: { has: "general-nursing-practice" } },
      {
        NOT: {
          tags: { hasSome: ["lab-drills-only", "med-calculations-only"] },
        },
      },
    ],
  });
  assert.match(serialized, /ecg_video/);
  assert.match(serialized, /ecg-video/);
  assert.match(serialized, /lab-drills-only/);
  assert.match(serialized, /med-calculations-only/);
  assert.match(serialized, /general-nursing-practice/);
});
