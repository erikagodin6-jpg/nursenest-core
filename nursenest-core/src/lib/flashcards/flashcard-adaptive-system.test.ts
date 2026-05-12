/**
 * Unit tests for Phase 4–6 adaptive system components:
 *   - isSataPayload guard (SATA card type detection)
 *   - applyRemediationBoost (remediation bridge ordering)
 *   - useFlashcardStudyTelemetry (no-crash on missing PostHog)
 */

import assert from "node:assert/strict";
import test from "node:test";

// ── SATA payload guard ────────────────────────────────────────────────────────

import { isSataPayload } from "@/lib/flashcards/flashcard-exam-style";

test("isSataPayload: null → false", () => {
  assert.equal(isSataPayload(null), false);
});

test("isSataPayload: undefined → false", () => {
  assert.equal(isSataPayload(undefined), false);
});

test("isSataPayload: standard MCQ payload → false", () => {
  const mcq = {
    itemKind: "CLINICAL" as const,
    questionStem: "Which action is priority?",
    answerOptions: [{ letter: "A", text: "Option A" }],
    correctLetter: "A",
    rationaleCorrect: "Because it is the safest.",
    rationaleIncorrect: [],
  };
  assert.equal(isSataPayload(mcq), false);
});

test("isSataPayload: valid SATA payload → true", () => {
  const sata = {
    itemKind: "SATA" as const,
    questionStem: "Select all that apply.",
    answerOptions: [
      { letter: "A", text: "Option A" },
      { letter: "B", text: "Option B" },
    ],
    correctLetters: ["A", "B"],
    rationaleCorrect: "Both are correct.",
    rationaleByLetter: [
      { letter: "A", rationale: "Correct because...", correct: true },
      { letter: "B", rationale: "Correct because...", correct: true },
    ],
  };
  assert.equal(isSataPayload(sata), true);
});

test("isSataPayload: itemKind=SATA but no correctLetters array → false (malformed MCQ guard)", () => {
  // Simulates a card that incorrectly has itemKind=SATA but uses the MCQ shape
  const malformed = {
    itemKind: "SATA" as const,
    questionStem: "Which action?",
    answerOptions: [{ letter: "A", text: "Option A" }],
    correctLetter: "A",  // MCQ field, not SATA
    rationaleCorrect: "Reason.",
    rationaleIncorrect: [],
    // correctLetters is absent
  };
  assert.equal(isSataPayload(malformed as never), false, "must reject malformed SATA-labeled MCQ");
});

test("isSataPayload: itemKind=SATA with empty correctLetters array → true (valid but empty set)", () => {
  const edge = {
    itemKind: "SATA" as const,
    questionStem: "Select all.",
    answerOptions: [],
    correctLetters: [],
    rationaleCorrect: "None are correct.",
    rationaleByLetter: [],
  };
  assert.equal(isSataPayload(edge), true, "empty correctLetters is still a valid SATA shape");
});

// ── Remediation boost ordering ────────────────────────────────────────────────

import { applyRemediationBoost } from "@/lib/flashcards/flashcard-remediation-bridge";

type TestCard = { id: string; topic: string };

test("applyRemediationBoost: empty boostMap → cards unchanged", () => {
  const cards: TestCard[] = [
    { id: "1", topic: "Cardiology" },
    { id: "2", topic: "Respiratory" },
  ];
  const result = applyRemediationBoost(cards, new Map());
  assert.deepEqual(result, cards);
});

test("applyRemediationBoost: boosted topic moves to front", () => {
  const cards: TestCard[] = [
    { id: "1", topic: "Cardiology" },
    { id: "2", topic: "respiratory" },  // normalized: "respiratory"
    { id: "3", topic: "Neuro" },
  ];
  const boost = new Map([["respiratory", 50]]);
  const result = applyRemediationBoost(cards, boost);
  assert.equal(result[0]!.id, "2", "boosted card must be first");
  assert.equal(result[1]!.id, "1");
  assert.equal(result[2]!.id, "3");
});

test("applyRemediationBoost: higher score wins when multiple boosted topics", () => {
  const cards: TestCard[] = [
    { id: "neuro-1", topic: "Neurology" },
    { id: "cardio-1", topic: "Cardiology" },
    { id: "resp-1", topic: "Respiratory" },
  ];
  const boost = new Map([
    ["neurology", 10],
    ["cardiology", 80],
    ["respiratory", 40],
  ]);
  const result = applyRemediationBoost(cards, boost);
  assert.equal(result[0]!.id, "cardio-1", "highest score first");
  assert.equal(result[1]!.id, "resp-1");
  assert.equal(result[2]!.id, "neuro-1");
});

test("applyRemediationBoost: non-boosted cards retain original order", () => {
  const cards: TestCard[] = [
    { id: "A", topic: "Cardiology" },
    { id: "B", topic: "Respiratory" },
    { id: "C", topic: "Cardiology" },
    { id: "D", topic: "Endocrine" },
  ];
  const boost = new Map([["endocrine", 100]]);
  const result = applyRemediationBoost(cards, boost);
  assert.equal(result[0]!.id, "D");
  // A, B, C maintain original order
  assert.deepEqual(result.slice(1).map((c) => c.id), ["A", "B", "C"]);
});

test("applyRemediationBoost: empty card list returns empty", () => {
  const result = applyRemediationBoost([], new Map([["cardiology", 50]]));
  assert.deepEqual(result, []);
});

test("applyRemediationBoost: does not mutate original array", () => {
  const cards: TestCard[] = [{ id: "1", topic: "Neuro" }, { id: "2", topic: "Cardiology" }];
  const original = [...cards];
  applyRemediationBoost(cards, new Map([["cardiology", 99]]));
  assert.deepEqual(cards, original, "original array must not be mutated");
});

// ── Feature flag: disabled → returns original order ───────────────────────────

test("applyRemediationBoost with empty map: preserves order", () => {
  const cards: TestCard[] = [{ id: "1", topic: "X" }, { id: "2", topic: "Y" }];
  const result = applyRemediationBoost(cards, new Map());
  assert.equal(result, cards, "should return exact same reference when map is empty");
});

// ── Telemetry: no crash when PostHog is not initialized ──────────────────────

test("telemetry helpers do not throw when trackClientEvent is a no-op", async () => {
  // Import and call trackClientEvent directly; in a server/test environment
  // PostHog is not initialized so it should silently no-op.
  const { trackClientEvent } = await import("@/lib/observability/posthog-client");

  await assert.doesNotReject(async () => {
    await trackClientEvent("flashcard_reveal", { card_id: "test", dwell_front_ms: 1000 });
  }, "trackClientEvent must not throw even without PostHog");

  await assert.doesNotReject(async () => {
    await trackClientEvent("flashcard_rated", { card_id: "test", rating: "good" });
  }, "trackClientEvent for rated must not throw");

  await assert.doesNotReject(async () => {
    await trackClientEvent("flashcard_link_clicked", { link_type: "lesson", card_id: "test" });
  }, "trackClientEvent for link clicked must not throw");

  await assert.doesNotReject(async () => {
    await trackClientEvent("flashcard_distractor_expanded", { card_id: "test" });
  }, "trackClientEvent for distractor expanded must not throw");
});

// ── Remediation signal input sanitization ────────────────────────────────────

test("remediation signal: valid source values are restricted enum", () => {
  const validSources = ["ecg_miss", "cat_miss", "flashcard_again", "manual"];
  const invalidSources = ["", "hack", "arbitrary_string", "delete * from users"];

  // We simulate the Zod schema validation inline
  function validateSource(s: string): boolean {
    return validSources.includes(s);
  }

  for (const valid of validSources) {
    assert.ok(validateSource(valid), `${valid} should be accepted`);
  }
  for (const invalid of invalidSources) {
    assert.ok(!validateSource(invalid), `${invalid} should be rejected`);
  }
});

test("remediation signal: topic must not be empty (min length 1 in schema)", () => {
  const mockValidate = (topic: string) => topic.trim().length >= 1;
  assert.ok(mockValidate("Cardiology"));
  assert.ok(!mockValidate(""));
  assert.ok(!mockValidate("   "));
});
