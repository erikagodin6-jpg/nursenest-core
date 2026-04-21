import assert from "node:assert/strict";
import test from "node:test";
import { flashcardPathwayAccessOptionsFromPathwayId } from "@/lib/flashcards/flashcard-pathway-scope";

test("pre-nursing sentinel scopes to foundational tier override", () => {
  assert.deepEqual(flashcardPathwayAccessOptionsFromPathwayId("pre-nursing"), {
    includePreNursingFoundation: true,
  });
  assert.deepEqual(flashcardPathwayAccessOptionsFromPathwayId("pre-nursing/study-strategies"), {
    includePreNursingFoundation: true,
  });
});

test("catalog pathway uses stripe tier ladder (new-grad is not mis-heuristed as RN)", () => {
  const o = flashcardPathwayAccessOptionsFromPathwayId("us-rn-new-grad-transition");
  assert.ok(o && "tierIntersectWith" in o);
  assert.deepEqual(o?.tierIntersectWith, ["NEW_GRAD"]);
});

test("unknown pathway id falls back to deck pathway tag", () => {
  assert.deepEqual(flashcardPathwayAccessOptionsFromPathwayId("custom-internal-track"), {
    deckPathwayId: "custom-internal-track",
  });
});

test("blank pathway yields no narrowing", () => {
  assert.equal(flashcardPathwayAccessOptionsFromPathwayId(null), null);
  assert.equal(flashcardPathwayAccessOptionsFromPathwayId("   "), null);
});
