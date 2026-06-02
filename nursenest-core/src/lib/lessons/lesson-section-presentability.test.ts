import * as assert from "node:assert/strict";
import { test } from "node:test";
import {
  bodyIsPlaceholderOrTrivial,
  countAlphanumericChars,
  filterLearnerPresentablePathwaySections,
  pathwaySectionIsLearnerPresentable,
} from "./lesson-section-presentability";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

// ── bodyIsPlaceholderOrTrivial ────────────────────────────────────────────────

test("bodyIsPlaceholderOrTrivial: empty string", () => {
  assert.equal(bodyIsPlaceholderOrTrivial(""), true);
  assert.equal(bodyIsPlaceholderOrTrivial("   "), true);
  assert.equal(bodyIsPlaceholderOrTrivial("\n\n"), true);
});

test("bodyIsPlaceholderOrTrivial: placeholder keywords", () => {
  assert.equal(bodyIsPlaceholderOrTrivial("TODO: fill this in"), true);
  assert.equal(bodyIsPlaceholderOrTrivial("TBD"), true);
  assert.equal(bodyIsPlaceholderOrTrivial("WIP content here"), true);
  assert.equal(bodyIsPlaceholderOrTrivial("[placeholder]"), true);
  assert.equal(bodyIsPlaceholderOrTrivial("Content todo"), true);
  assert.equal(bodyIsPlaceholderOrTrivial("Coming soon"), true);
  assert.equal(bodyIsPlaceholderOrTrivial("Lorem ipsum dolor sit amet"), true);
  assert.equal(bodyIsPlaceholderOrTrivial("FIXME"), true);
});

test("bodyIsPlaceholderOrTrivial: too few alphanumeric chars (< 14)", () => {
  assert.equal(bodyIsPlaceholderOrTrivial("See."), true);
  assert.equal(bodyIsPlaceholderOrTrivial("abc"), true);
  assert.equal(bodyIsPlaceholderOrTrivial("...(13 chars)"), true);
});

test("bodyIsPlaceholderOrTrivial: real content passes", () => {
  assert.equal(bodyIsPlaceholderOrTrivial("Administer oxygen via nasal cannula at 2-4 L/min."), false);
  assert.equal(bodyIsPlaceholderOrTrivial("Monitor urine output; report < 30 mL/hr."), false);
  assert.equal(bodyIsPlaceholderOrTrivial("Check blood glucose before meals and at bedtime."), false);
});

test("bodyIsPlaceholderOrTrivial: placeholder keywords mid-sentence do NOT trigger", () => {
  assert.equal(bodyIsPlaceholderOrTrivial("The WIP pathway to recovery requires patience."), false);
});

test("bodyIsPlaceholderOrTrivial: short lorem ipsum is detected as placeholder", () => {
  const shortLorem = "Lorem ipsum dolor sit amet";
  assert.equal(bodyIsPlaceholderOrTrivial(shortLorem), true);
});

test("bodyIsPlaceholderOrTrivial: lorem ipsum > 160 chars bypasses the guard (not flagged)", () => {
  // The check is deliberately limited to short strings to avoid false positives on real content
  // that happens to start with a known keyword further into a sentence.
  const longLorem = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation";
  assert.ok(longLorem.length > 160);
  assert.equal(bodyIsPlaceholderOrTrivial(longLorem), false);
});

test("countAlphanumericChars: counts letters and numbers", () => {
  assert.equal(countAlphanumericChars("abc 123"), 6);
  assert.equal(countAlphanumericChars("...---"), 0);
  assert.equal(countAlphanumericChars(""), 0);
});

// ── pathwaySectionIsLearnerPresentable ────────────────────────────────────────

function makeSection(overrides: Partial<PathwayLessonSection> = {}): PathwayLessonSection {
  return {
    id: "sec-test",
    heading: "Test Section",
    body: "",
    kind: "introduction",
    ...overrides,
  } as PathwayLessonSection;
}

test("pathwaySectionIsLearnerPresentable: substantive body returns true", () => {
  const s = makeSection({ body: "Administer oxygen at 2 L/min via nasal cannula." });
  assert.equal(pathwaySectionIsLearnerPresentable(s), true);
});

test("pathwaySectionIsLearnerPresentable: empty body returns false", () => {
  const s = makeSection({ body: "" });
  assert.equal(pathwaySectionIsLearnerPresentable(s), false);
});

test("pathwaySectionIsLearnerPresentable: placeholder body returns false", () => {
  const s = makeSection({ body: "TODO: write clinical pearls here" });
  assert.equal(pathwaySectionIsLearnerPresentable(s), false);
});

test("pathwaySectionIsLearnerPresentable: figures alone make section presentable", () => {
  const s = makeSection({
    body: "",
    figures: [{ id: "fig-1", url: "https://example.com/img.png", alt: "diagram" } as never],
  });
  assert.equal(pathwaySectionIsLearnerPresentable(s), true);
});

test("pathwaySectionIsLearnerPresentable: recall prompts alone make section presentable", () => {
  const s = makeSection({
    body: "",
    recallPrompts: [{ front: "Q?", back: "A." } as never],
  });
  assert.equal(pathwaySectionIsLearnerPresentable(s), true);
});

test("pathwaySectionIsLearnerPresentable: examFocus with substance is presentable", () => {
  const s = makeSection({
    body: "",
    examFocus: {
      howTested: "This concept is tested by selecting the priority intervention.",
    } as never,
  });
  assert.equal(pathwaySectionIsLearnerPresentable(s), true);
});

test("pathwaySectionIsLearnerPresentable: examFocus with placeholder body is NOT presentable", () => {
  const s = makeSection({
    body: "",
    examFocus: { howTested: "TODO" } as never,
  });
  assert.equal(pathwaySectionIsLearnerPresentable(s), false);
});

// ── filterLearnerPresentablePathwaySections ───────────────────────────────────

test("filterLearnerPresentablePathwaySections: removes empty and placeholder sections", () => {
  const sections: PathwayLessonSection[] = [
    makeSection({ id: "a", body: "Administer oxygen via nasal cannula at 2–4 L/min." }),
    makeSection({ id: "b", body: "" }),
    makeSection({ id: "c", body: "TODO" }),
    makeSection({ id: "d", body: "Check blood pressure before giving metoprolol." }),
  ] as PathwayLessonSection[];
  const result = filterLearnerPresentablePathwaySections(sections);
  assert.deepEqual(
    result.map((s) => s.id),
    ["a", "d"],
  );
});

test("filterLearnerPresentablePathwaySections: preserves all when all have content", () => {
  const sections: PathwayLessonSection[] = [
    makeSection({ id: "1", body: "Monitor urine output; report < 30 mL/hr to provider." }),
    makeSection({ id: "2", body: "Elevate head of bed to 30-45 degrees to prevent aspiration." }),
  ] as PathwayLessonSection[];
  assert.equal(filterLearnerPresentablePathwaySections(sections).length, 2);
});

test("filterLearnerPresentablePathwaySections: empty input returns empty", () => {
  assert.deepEqual(filterLearnerPresentablePathwaySections([]), []);
});
