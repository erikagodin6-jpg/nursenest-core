import test from "node:test";
import assert from "node:assert/strict";
import { parseParagraphBlock } from "@/components/lessons/pathway-lesson-body";
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
  assert.equal(lessonBodyPresentationClass("tier_specific_relevance"), "nn-lesson-body--tier");
  assert.equal(lessonBodyPresentationClass("clinical_pearls"), "nn-lesson-body--pearl");
});

test("lessonBodyPresentationClass: null/undefined", () => {
  assert.equal(lessonBodyPresentationClass(null), null);
  assert.equal(lessonBodyPresentationClass(undefined), null);
});
