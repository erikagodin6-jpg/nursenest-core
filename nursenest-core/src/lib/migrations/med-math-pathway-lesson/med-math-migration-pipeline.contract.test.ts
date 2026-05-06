import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { medMathLessons } from "@legacy-client/data/lessons/med-math-lessons";
import type { LessonContent } from "@legacy-client/data/lessons/types";

import {
  buildMedMathCreatePayload,
  buildMedMathPathwayLessonRecord,
  countMedMathLessonWords,
  evaluateMedMathStructuralQuality,
} from "./transform-med-math-lesson";
import { MED_MATH_MIGRATION_MIN_WORDS, validateMedMathLessonContent, validateMedMathPayloadCorpus } from "./validate-med-math-payload";

describe("med-math migration pipeline (no DB)", () => {
  it("first catalog lesson passes validation + structural gate for NCLEX pathway", () => {
    const pathwayId = "us-rn-nclex-rn";
    const legacySlug = "med-math-dosage-calculations";
    const lesson = (medMathLessons as Record<string, LessonContent>)[legacySlug];
    assert.ok(lesson, "expected med-math-dosage-calculations in catalog");

    const contentIssues = validateMedMathLessonContent(lesson);
    const payload = buildMedMathCreatePayload({ legacySlug, lesson, pathwayId });
    const corpusIssues = validateMedMathPayloadCorpus(payload.sections);
    const record = buildMedMathPathwayLessonRecord({ legacySlug, lesson, pathwayId });
    const gate = evaluateMedMathStructuralQuality(record);
    const wc = countMedMathLessonWords(payload.sections);

    assert.ok(wc >= MED_MATH_MIGRATION_MIN_WORDS, `word count ${wc}`);
    assert.deepEqual(contentIssues, []);
    assert.deepEqual(corpusIssues, []);
    assert.equal(gate.publicComplete, true, gate.issues.join("; "));
  });
});
