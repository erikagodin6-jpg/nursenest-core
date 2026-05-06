import assert from "node:assert/strict";
import test from "node:test";
import {
  coerceRecordedExamQuestionExamValue,
  expandedExamKeysForPathwayPool,
  examKeyNormsForPathwayPool,
  isExamQuestionExamPublishAllowed,
  normalizeExamQuestionExamForStorage,
  normExamKeyForMatching,
  orderExamQuestionExamRewritesForBackfill,
  canonicalExamQuestionExamForDbWrite,
} from "@/lib/content-quality/exam-question-exam-normalization";

test("normExamKeyForMatching collapses spaces and underscores", () => {
  assert.equal(normExamKeyForMatching("NCLEX_RN"), "nclex-rn");
  assert.equal(normExamKeyForMatching("nclex rn"), "nclex-rn");
  assert.equal(normExamKeyForMatching("REX-PN"), "rex-pn");
});

test("normalizeExamQuestionExamForStorage maps legacy CAT and board aliases", () => {
  assert.equal(normalizeExamQuestionExamForStorage("RN-CAT"), "NCLEX-RN");
  assert.equal(normalizeExamQuestionExamForStorage("RPN-CAT"), "NCLEX-PN");
  assert.equal(normalizeExamQuestionExamForStorage("NP-CAT"), "NP");
  assert.equal(normalizeExamQuestionExamForStorage("AANP"), "FNP");
  assert.equal(normalizeExamQuestionExamForStorage("AANP-FNP"), "NP-FNP");
});

test("normalizeExamQuestionExamForStorage prefers REx-PN casing", () => {
  assert.equal(normalizeExamQuestionExamForStorage("REX-PN"), "REx-PN");
  assert.equal(normalizeExamQuestionExamForStorage("rex-pn"), "REx-PN");
});

test("normalizeExamQuestionExamForStorage maps underscore NCLEX enums", () => {
  assert.equal(normalizeExamQuestionExamForStorage("NCLEX_RN"), "NCLEX-RN");
  assert.equal(normalizeExamQuestionExamForStorage("NCLEX_PN"), "NCLEX-PN");
});

test("normalizeExamQuestionExamForStorage maps lowercase slug forms to pathway casing", () => {
  assert.equal(normalizeExamQuestionExamForStorage("nclex-rn"), "NCLEX-RN");
  assert.equal(normalizeExamQuestionExamForStorage("nclex pn"), "NCLEX-PN");
});

test("canonicalExamQuestionExamForDbWrite matches normalize for family column output", () => {
  assert.equal(canonicalExamQuestionExamForDbWrite("NCLEX_RN"), "NCLEX-RN");
  assert.equal(canonicalExamQuestionExamForDbWrite("rex-pn"), "REx-PN");
});

test("legacy aliases: condensed and mixed-case NP exam tokens", () => {
  assert.equal(normalizeExamQuestionExamForStorage("np-fnp"), "NP-FNP");
  assert.equal(normalizeExamQuestionExamForStorage("NCLEXRN"), "NCLEX-RN");
  assert.equal(normalizeExamQuestionExamForStorage("nclexpn"), "NCLEX-PN");
  assert.equal(normalizeExamQuestionExamForStorage("rexpn"), "REx-PN");
});

test("Canadian NP legacy board strings consolidate to CNPLE", () => {
  assert.equal(normalizeExamQuestionExamForStorage("CAN-NP"), "CNPLE");
  assert.equal(normalizeExamQuestionExamForStorage("can-np"), "CNPLE");
});

test("pathway id accidentally stored as exam maps to FNP", () => {
  assert.equal(normalizeExamQuestionExamForStorage("us-np-fnp"), "FNP");
});

test("expandedExamKeysForPathwayPool adds underscore spellings from allowlist", () => {
  const keys = ["NCLEX-RN"];
  const expanded = expandedExamKeysForPathwayPool(keys);
  assert.ok(expanded.includes("NCLEX-RN"));
  assert.ok(expanded.includes("NCLEX_RN"));
  assert.ok(!expanded.includes("NCLEX-PN"));
});

test("examKeyNormsForPathwayPool includes norms of normalized pathway keys", () => {
  const norms = examKeyNormsForPathwayPool(["CAN-NP", "CNPLE", "NP"]);
  assert.ok(norms.includes("can-np"));
  assert.ok(norms.includes("cnple"));
  assert.ok(norms.includes("np"));
});

test("orderExamQuestionExamRewritesForBackfill runs chained from-values before their to becomes a from", () => {
  const ordered = orderExamQuestionExamRewritesForBackfill([
    { from: "b", to: "c" },
    { from: "a", to: "b" },
  ]);
  assert.deepEqual(
    ordered.map((x) => x.from),
    ["a", "b"],
  );
});

test("isExamQuestionExamPublishAllowed accepts pathway and allied board keys", () => {
  assert.equal(isExamQuestionExamPublishAllowed("NCLEX-RN"), true);
  assert.equal(isExamQuestionExamPublishAllowed("REx-PN"), true);
  assert.equal(isExamQuestionExamPublishAllowed("RDCS-AE"), true);
  assert.equal(isExamQuestionExamPublishAllowed("NOT_A_BOARD"), false);
});
