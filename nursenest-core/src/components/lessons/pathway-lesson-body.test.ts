import test from "node:test";
import assert from "node:assert/strict";
import {
  parseParagraphBlock,
  lessonCalloutFromParagraph,
  pathwayLessonResolvedParagraphs,
} from "@/components/lessons/pathway-lesson-body";
import { lessonBodyPresentationClass } from "@/lib/ui/lesson-body-presentation";

test("parseParagraphBlock: pure bullet list", () => {
  const b = parseParagraphBlock("- a\n- b");
  assert.deepEqual(b, { kind: "list", items: ["a", "b"] });
});

test("parseParagraphBlock: pure numbered list", () => {
  const b = parseParagraphBlock("1. first\n2. second");
  assert.deepEqual(b, { kind: "ordered-list", items: ["first", "second"] });
});

test("parseParagraphBlock: numbered list with indentation", () => {
  const b = parseParagraphBlock("  1. x\n  2. y");
  assert.deepEqual(b, { kind: "ordered-list", items: ["x", "y"] });
});

test("parseParagraphBlock: headed bullet list wins over ordered when first line not numbered", () => {
  const b = parseParagraphBlock("Intro here\n- one\n- two");
  assert.equal(b.kind, "headed-list");
  if (b.kind === "headed-list") {
    assert.equal(b.header, "Intro here");
    assert.deepEqual(b.items, ["one", "two"]);
  }
});

test("parseParagraphBlock: text when mixed bullet and number", () => {
  const b = parseParagraphBlock("- a\n1. b");
  assert.equal(b.kind, "text");
});

test("lessonBodyPresentationClass: known kinds map to stable tokens", () => {
  assert.equal(
    lessonBodyPresentationClass("tier_specific_relevance"),
    "nn-lesson-body--tier",
  );
  assert.equal(
    lessonBodyPresentationClass("clinical_pearls"),
    "nn-lesson-body--pearl",
  );
});

test("lessonBodyPresentationClass: null/undefined", () => {
  assert.equal(lessonBodyPresentationClass(null), null);
  assert.equal(lessonBodyPresentationClass(undefined), null);
});

// ── lessonCalloutFromParagraph ────────────────────────────────────────────────

test("lessonCalloutFromParagraph: exam tip (bare and with colon)", () => {
  assert.deepEqual(lessonCalloutFromParagraph("Exam Tip: study this"), {
    variant: "exam",
    body: "study this",
  });
  assert.deepEqual(lessonCalloutFromParagraph("Exam Tip study this"), {
    variant: "exam",
    body: "study this",
  });
  assert.deepEqual(lessonCalloutFromParagraph("**Exam Tip:** study this"), {
    variant: "exam",
    body: "study this",
  });
});

test("lessonCalloutFromParagraph: clinical insight", () => {
  assert.deepEqual(lessonCalloutFromParagraph("Clinical Insight: note this"), {
    variant: "clinical",
    body: "note this",
  });
});

test("lessonCalloutFromParagraph: clinical pearl variants", () => {
  assert.deepEqual(
    lessonCalloutFromParagraph("Clinical Pearl: remember this"),
    { variant: "pearl", body: "remember this" },
  );
  assert.deepEqual(lessonCalloutFromParagraph("Pearl: short one"), {
    variant: "pearl",
    body: "short one",
  });
});

test("pathwayLessonResolvedParagraphs drops empty callout-only pearl labels", () => {
  assert.deepEqual(pathwayLessonResolvedParagraphs("Pearl:"), []);
  assert.deepEqual(pathwayLessonResolvedParagraphs("**Clinical Pearl:**"), []);
  assert.deepEqual(pathwayLessonResolvedParagraphs("Pearl: assess pain before mobility"), [
    "Pearl: assess pain before mobility",
  ]);
});

test("lessonCalloutFromParagraph: nursing priority variants", () => {
  assert.deepEqual(
    lessonCalloutFromParagraph("Nursing Priority: assess airway first"),
    { variant: "priority", body: "assess airway first" },
  );
  assert.deepEqual(
    lessonCalloutFromParagraph("Priority Action: monitor vitals"),
    { variant: "priority", body: "monitor vitals" },
  );
  assert.deepEqual(lessonCalloutFromParagraph("First Action: call provider"), {
    variant: "priority",
    body: "call provider",
  });
});

test("lessonCalloutFromParagraph: safety variants", () => {
  assert.deepEqual(
    lessonCalloutFromParagraph("Safety Alert: check allergies"),
    { variant: "safety", body: "check allergies" },
  );
  assert.deepEqual(lessonCalloutFromParagraph("Safety Priority: fall risk"), {
    variant: "safety",
    body: "fall risk",
  });
  assert.deepEqual(lessonCalloutFromParagraph("Safety: use gloves"), {
    variant: "safety",
    body: "use gloves",
  });
});

test("lessonCalloutFromParagraph: pharm variants", () => {
  assert.deepEqual(
    lessonCalloutFromParagraph("Pharm Note: narrow therapeutic index"),
    { variant: "pharm", body: "narrow therapeutic index" },
  );
  assert.deepEqual(
    lessonCalloutFromParagraph("Medication Alert: check renal function"),
    { variant: "pharm", body: "check renal function" },
  );
  assert.deepEqual(
    lessonCalloutFromParagraph("Pharmacology Note: MAO inhibitor"),
    { variant: "pharm", body: "MAO inhibitor" },
  );
});

test("lessonCalloutFromParagraph: safety before priority (specificity order)", () => {
  const r = lessonCalloutFromParagraph(
    "Safety Priority: do not confuse with nursing priority",
  );
  assert.equal(r?.variant, "safety");
});

test("lessonCalloutFromParagraph: regular prose returns null", () => {
  assert.equal(
    lessonCalloutFromParagraph("The patient should remain NPO after midnight."),
    null,
  );
  assert.equal(lessonCalloutFromParagraph(""), null);
});

test("lessonCalloutFromParagraph: bare callout marker with no body returns empty string", () => {
  const r = lessonCalloutFromParagraph("Exam Tip:");
  assert.ok(r !== null);
  assert.equal(r.variant, "exam");
  assert.equal(r.body, "");
});

test("lessonCalloutFromParagraph: case-insensitive matching", () => {
  assert.equal(
    lessonCalloutFromParagraph("exam tip: lowercase")?.variant,
    "exam",
  );
  assert.equal(
    lessonCalloutFromParagraph("SAFETY ALERT: uppercase")?.variant,
    "safety",
  );
  assert.equal(
    lessonCalloutFromParagraph("Pearl: Mixed Case")?.variant,
    "pearl",
  );
});
