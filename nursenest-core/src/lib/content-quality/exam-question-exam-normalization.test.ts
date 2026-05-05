import assert from "node:assert/strict";
import test from "node:test";
import {
  isExamQuestionExamPublishAllowed,
  normalizeExamQuestionExamForStorage,
  normExamKeyForMatching,
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

test("isExamQuestionExamPublishAllowed accepts pathway and allied board keys", () => {
  assert.equal(isExamQuestionExamPublishAllowed("NCLEX-RN"), true);
  assert.equal(isExamQuestionExamPublishAllowed("REx-PN"), true);
  assert.equal(isExamQuestionExamPublishAllowed("RDCS-AE"), true);
  assert.equal(isExamQuestionExamPublishAllowed("NOT_A_BOARD"), false);
});
