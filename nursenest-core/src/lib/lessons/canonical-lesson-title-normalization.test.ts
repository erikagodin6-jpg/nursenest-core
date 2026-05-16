import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCanonicalLessonHubIndex,
  canonicalLessonHubKey,
  canonicalLessonHubTitle,
} from "./canonical-lesson-title-normalization";

test("canonicalLessonHubTitle simplifies verbose nursing lesson titles", () => {
  assert.equal(canonicalLessonHubTitle("COPD Management"), "COPD");
  assert.equal(canonicalLessonHubTitle("COPD Nursing Care"), "COPD");
  assert.equal(canonicalLessonHubTitle("Nursing Interventions for COPD"), "COPD");
  assert.equal(canonicalLessonHubTitle("Heart Failure Discharge Teaching"), "Heart Failure");
  assert.equal(canonicalLessonHubTitle("A Fib Review"), "Atrial Fibrillation");
  assert.equal(canonicalLessonHubTitle("SVT Basics"), "Supraventricular Tachycardia (SVT)");
});

test("canonicalLessonHubKey collapses common abbreviations and synonyms", () => {
  assert.equal(canonicalLessonHubKey("Chronic Obstructive Pulmonary Disease"), "copd");
  assert.equal(canonicalLessonHubKey("CHF"), "heart failure");
  assert.equal(canonicalLessonHubKey("A Fib"), "atrial fibrillation");
  assert.equal(canonicalLessonHubKey("Diabetic Ketoacidosis"), "dka");
});

test("buildCanonicalLessonHubIndex keeps the richest canonical lesson and suppresses same-topic variants", () => {
  const result = buildCanonicalLessonHubIndex([
    {
      slug: "copd-management",
      title: "COPD Management",
      sectionCount: 4,
      bodyLength: 1_000,
    },
    {
      slug: "copd",
      title: "COPD",
      sectionCount: 11,
      bodyLength: 10_000,
    },
    {
      slug: "copd-nursing-care",
      title: "COPD Nursing Care",
      sectionCount: 6,
      bodyLength: 2_000,
    },
  ]);

  assert.deepEqual([...result.visibleSlugs].sort(), ["copd"]);
  assert.equal(result.slugToCanonicalTitle["copd"], "COPD");
  assert.equal(result.slugToCanonicalTitle["copd-management"], "COPD");
  assert.equal(result.duplicateRedirects["copd-management"], "copd");
  assert.equal(result.duplicateRedirects["copd-nursing-care"], "copd");
});

test("buildCanonicalLessonHubIndex preserves legitimate clinical split lessons", () => {
  const result = buildCanonicalLessonHubIndex([
    {
      slug: "copd",
      title: "COPD",
      sectionCount: 10,
      bodyLength: 10_000,
    },
    {
      slug: "copd-exacerbation",
      title: "COPD Exacerbation",
      sectionCount: 8,
      bodyLength: 8_000,
    },
    {
      slug: "pediatric-asthma",
      title: "Pediatric Asthma",
      sectionCount: 8,
      bodyLength: 8_000,
    },
    {
      slug: "asthma",
      title: "Asthma",
      sectionCount: 10,
      bodyLength: 10_000,
    },
  ]);

  assert.deepEqual([...result.visibleSlugs].sort(), ["asthma", "copd", "copd-exacerbation", "pediatric-asthma"]);
});

test("buildCanonicalLessonHubIndex respects existing explicit canonical redirects", () => {
  const result = buildCanonicalLessonHubIndex([
    {
      slug: "heart-failure",
      title: "Heart Failure",
      sectionCount: 12,
      bodyLength: 12_000,
    },
    {
      slug: "heart-failure-discharge-teaching",
      title: "Heart Failure Discharge Teaching",
      canonicalLessonId: "heart-failure",
      sectionCount: 5,
      bodyLength: 2_000,
    },
  ]);

  assert.deepEqual([...result.visibleSlugs].sort(), ["heart-failure"]);
  assert.equal(result.slugToCanonicalTitle["heart-failure-discharge-teaching"], "Heart Failure");
  assert.equal(result.duplicateRedirects["heart-failure-discharge-teaching"], "heart-failure");
});
