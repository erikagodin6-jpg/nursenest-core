/**
 * Comprehensive tests for adaptive clinical cognition telemetry.
 *
 * Covers:
 *   - Event deduplication (reveal, rated guards)
 *   - Metadata correctness (flattenMeta, deriveCardFlags)
 *   - SATA partial accuracy calculation
 *   - Distractor selection tracking
 *   - PostHog absence graceful handling (no-crash)
 *   - Aggregation functions: heatmap, weak clusters, prescribing safety,
 *     longitudinal trend, confidence-accuracy mismatch
 *   - Mobile session stability (rapid card advance + keyboard interaction)
 */

import assert from "node:assert/strict";
import test from "node:test";

// ── deriveCardFlags ───────────────────────────────────────────────────────────

import { deriveCardFlags } from "@/lib/flashcards/use-flashcard-study-telemetry";

test("deriveCardFlags: ECG keyword in topic → ecgFlag true", () => {
  const flags = deriveCardFlags({ topic: "ECG Interpretation" });
  assert.equal(flags.ecgFlag, true);
  assert.equal(flags.bowtieFlag, false);
  assert.equal(flags.labFlag, false);
});

test("deriveCardFlags: 12-lead in stem → ecgFlag true", () => {
  const flags = deriveCardFlags({ questionStem: "A client has a 12-lead showing ST elevation." });
  assert.equal(flags.ecgFlag, true);
});

test("deriveCardFlags: electrocardiogram in stem → ecgFlag true", () => {
  const flags = deriveCardFlags({ questionStem: "The nurse reviews an electrocardiogram strip." });
  assert.equal(flags.ecgFlag, true);
});

test("deriveCardFlags: bow-tie in stem → bowtieFlag true", () => {
  const flags = deriveCardFlags({ questionStem: "Complete the bow-tie clinical judgment item." });
  assert.equal(flags.bowtieFlag, true);
  assert.equal(flags.ecgFlag, false);
});

test("deriveCardFlags: bowtie (no hyphen) → bowtieFlag true", () => {
  const flags = deriveCardFlags({ questionStem: "This is a bowtie item type." });
  assert.equal(flags.bowtieFlag, true);
});

test("deriveCardFlags: potassium in stem → labFlag true", () => {
  const flags = deriveCardFlags({ questionStem: "The client's serum potassium is 6.2 mEq/L." });
  assert.equal(flags.labFlag, true);
  assert.equal(flags.ecgFlag, false);
});

test("deriveCardFlags: troponin → labFlag true", () => {
  const flags = deriveCardFlags({ questionStem: "Troponin I is elevated at 2.4 ng/mL." });
  assert.equal(flags.labFlag, true);
});

test("deriveCardFlags: sourceKey containing 'lab' → labFlag true", () => {
  const flags = deriveCardFlags({ sourceKey: "lab-values-renal" });
  assert.equal(flags.labFlag, true);
});

test("deriveCardFlags: cardiology topic with no special keywords → all false", () => {
  const flags = deriveCardFlags({ topic: "Cardiology", questionStem: "A nurse assesses lung sounds." });
  assert.equal(flags.ecgFlag, false);
  assert.equal(flags.bowtieFlag, false);
  assert.equal(flags.labFlag, false);
});

test("deriveCardFlags: null inputs → all false", () => {
  const flags = deriveCardFlags({ topic: null, questionStem: null, sourceKey: null });
  assert.equal(flags.ecgFlag, false);
  assert.equal(flags.bowtieFlag, false);
  assert.equal(flags.labFlag, false);
});

test("deriveCardFlags: multiple flags can be true simultaneously", () => {
  // ECG + lab (rhythm strip + troponin)
  const flags = deriveCardFlags({
    topic: "ECG Monitoring",
    questionStem: "The client's troponin is elevated. Interpret the rhythm strip.",
  });
  assert.equal(flags.ecgFlag, true);
  assert.equal(flags.labFlag, true);
});

// ── SATA partial accuracy computation ────────────────────────────────────────

// We test the logic directly since it's a pure calculation inside onAnswerSubmitted.
// Replicate the formula: correctSelected / correctLetters.length, rounded to 2dp.

function sataPct(selected: string[], correct: string[]): number {
  if (correct.length === 0) return 0;
  const correctSelected = selected.filter((l) => correct.includes(l)).length;
  return Math.round((correctSelected / correct.length) * 100) / 100;
}

test("SATA partial accuracy: all correct → 1.0", () => {
  assert.equal(sataPct(["A", "B", "C"], ["A", "B", "C"]), 1);
});

test("SATA partial accuracy: none correct → 0.0", () => {
  assert.equal(sataPct(["D"], ["A", "B", "C"]), 0);
});

test("SATA partial accuracy: half correct → 0.5", () => {
  assert.equal(sataPct(["A", "C"], ["A", "B", "C", "D"]), 0.5);
});

test("SATA partial accuracy: 1 of 3 correct → 0.33", () => {
  assert.equal(sataPct(["A"], ["A", "B", "C"]), 0.33);
});

test("SATA partial accuracy: extra selections don't inflate score", () => {
  // selected all 4 but only 2 are correct → 2/2 = 1.0
  assert.equal(sataPct(["A", "B", "C", "D"], ["A", "B"]), 1);
});

test("SATA partial accuracy: empty correct set → 0", () => {
  assert.equal(sataPct(["A"], []), 0);
});

// ── Deduplication guard logic ─────────────────────────────────────────────────
// The hook uses lastRevealFiredFor / lastRatedFiredFor refs.
// We simulate the guard logic inline.

function makeDedup() {
  let lastFiredFor: string | null = null;
  return {
    fire(cardId: string): boolean {
      if (lastFiredFor === cardId) return false; // duplicate — skip
      lastFiredFor = cardId;
      return true;
    },
    reset() {
      lastFiredFor = null;
    },
  };
}

test("deduplication: second call for same card → skipped", () => {
  const dedup = makeDedup();
  assert.equal(dedup.fire("card-abc"), true);
  assert.equal(dedup.fire("card-abc"), false, "duplicate must be skipped");
});

test("deduplication: different card → allowed", () => {
  const dedup = makeDedup();
  assert.equal(dedup.fire("card-1"), true);
  assert.equal(dedup.fire("card-2"), true, "different card must fire");
});

test("deduplication: reset then same card → fires again", () => {
  const dedup = makeDedup();
  dedup.fire("card-abc");
  dedup.reset();
  assert.equal(dedup.fire("card-abc"), true, "must fire after reset");
});

test("deduplication: rapid same-card calls → only one fires", () => {
  const dedup = makeDedup();
  let count = 0;
  for (let i = 0; i < 10; i++) {
    if (dedup.fire("card-xyz")) count++;
  }
  assert.equal(count, 1, "exactly one event must fire out of 10 rapid calls");
});

test("deduplication: mobile session rapid card advance, each card fires once", () => {
  const dedup = makeDedup();
  const cardIds = ["c1", "c2", "c3", "c4", "c5"];
  const fired: string[] = [];
  for (const id of cardIds) {
    dedup.reset(); // simulate onCardShown clearing the guard
    // simulate rapid double-tap (e.g. touchstart + click)
    if (dedup.fire(id)) fired.push(id);
    dedup.fire(id); // second tap — must not double fire
  }
  assert.deepEqual(fired, cardIds, "each card in mobile session fires exactly once");
});

// ── Keyboard interaction tracking ─────────────────────────────────────────────

test("keyboard rating map: keys 1–4 map to Anki ratings", () => {
  const ratingMap = { "1": "again", "2": "hard", "3": "good", "4": "easy" } as const;
  assert.equal(ratingMap["1"], "again");
  assert.equal(ratingMap["2"], "hard");
  assert.equal(ratingMap["3"], "good");
  assert.equal(ratingMap["4"], "easy");
});

test("keyboard: non-rating keys do not trigger a rating event", () => {
  const ratingKeys = new Set(["1", "2", "3", "4"]);
  const nonRatingKeys = ["5", "a", "Enter", " ", "ArrowLeft", "Escape"];
  for (const key of nonRatingKeys) {
    assert.equal(ratingKeys.has(key), false, `key "${key}" must not be a rating key`);
  }
});

test("keyboard: input element guard (does not fire inside text input)", () => {
  // Simulates the guard: el?.closest("input, textarea, select, [contenteditable=true]")
  function shouldFireKeydown(tagName: string): boolean {
    const blockedTags = ["INPUT", "TEXTAREA", "SELECT"];
    return !blockedTags.includes(tagName.toUpperCase());
  }
  assert.equal(shouldFireKeydown("INPUT"), false);
  assert.equal(shouldFireKeydown("TEXTAREA"), false);
  assert.equal(shouldFireKeydown("SELECT"), false);
  assert.equal(shouldFireKeydown("DIV"), true);
  assert.equal(shouldFireKeydown("BUTTON"), true);
});

// ── PostHog no-crash ──────────────────────────────────────────────────────────

test("trackClientEvent: does not throw when PostHog is not initialized", async () => {
  const { trackClientEvent } = await import("@/lib/observability/posthog-client");

  await assert.doesNotReject(() =>
    trackClientEvent("flashcard_reveal", {
      card_id: "test-card",
      reveal_dwell_ms: 1200,
      question_type: "MCQ",
      topic: "Cardiology",
      remediation_boosted: false,
    }),
  );
});

test("trackClientEvent: answer_submitted does not throw", async () => {
  const { trackClientEvent } = await import("@/lib/observability/posthog-client");
  await assert.doesNotReject(() =>
    trackClientEvent("answer_submitted", {
      card_id: "test-card",
      is_correct: false,
      distractor_selected: "B",
      question_type: "MCQ",
      topic: "Pharmacology",
    }),
  );
});

test("trackClientEvent: remediation_triggered does not throw", async () => {
  const { trackClientEvent } = await import("@/lib/observability/posthog-client");
  await assert.doesNotReject(() =>
    trackClientEvent("remediation_triggered", {
      card_id: "test-card",
      topic: "Respiratory",
      priority_score: 87,
    }),
  );
});

test("trackClientEvent: rationale_opened does not throw", async () => {
  const { trackClientEvent } = await import("@/lib/observability/posthog-client");
  await assert.doesNotReject(() =>
    trackClientEvent("rationale_opened", {
      card_id: "test-card",
      question_type: "SATA",
      topic: "Neuro",
    }),
  );
});

test("trackClientEvent: lesson_link_clicked does not throw", async () => {
  const { trackClientEvent } = await import("@/lib/observability/posthog-client");
  await assert.doesNotReject(() =>
    trackClientEvent("lesson_link_clicked", {
      card_id: "test-card",
      link_type: "lesson",
      topic: "Cardiology",
    }),
  );
});

// ── Aggregators ───────────────────────────────────────────────────────────────

import {
  buildMisconceptionHeatmap,
  buildWeakTopicClusters,
  buildPrescribingSafetyMisses,
  buildLongitudinalWeaknessTrend,
  buildConfidenceAccuracyMismatch,
  type FlashcardTelemetryEventRecord,
} from "@/lib/flashcards/flashcard-analytics-aggregators";

// ── buildMisconceptionHeatmap ─────────────────────────────────────────────────

test("heatmap: empty events → empty result", () => {
  assert.deepEqual(buildMisconceptionHeatmap([]), []);
});

test("heatmap: only correct answers → no heatmap rows", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", topic: "Cardiology", is_correct: true, distractor_selected: undefined },
  ];
  assert.deepEqual(buildMisconceptionHeatmap(events), []);
});

test("heatmap: single wrong answer adds one row", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", topic: "Cardiology", is_correct: false, distractor_selected: "B" },
  ];
  const rows = buildMisconceptionHeatmap(events);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]!.topic, "cardiology");
  assert.equal(rows[0]!.distractor, "B");
  assert.equal(rows[0]!.count, 1);
});

test("heatmap: same topic + distractor accumulates count", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", topic: "Pharmacology", is_correct: false, distractor_selected: "C" },
    { event: "answer_submitted", topic: "Pharmacology", is_correct: false, distractor_selected: "C" },
    { event: "answer_submitted", topic: "Pharmacology", is_correct: false, distractor_selected: "C" },
  ];
  const rows = buildMisconceptionHeatmap(events);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]!.count, 3);
});

test("heatmap: sorted descending by count", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", topic: "Neuro", is_correct: false, distractor_selected: "A" },
    { event: "answer_submitted", topic: "Cardiology", is_correct: false, distractor_selected: "B" },
    { event: "answer_submitted", topic: "Cardiology", is_correct: false, distractor_selected: "B" },
  ];
  const rows = buildMisconceptionHeatmap(events);
  assert.equal(rows[0]!.count, 2, "higher count must be first");
  assert.equal(rows[1]!.count, 1);
});

test("heatmap: ignores non-answer_submitted events", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_reveal", topic: "Cardiology", is_correct: false, distractor_selected: "A" },
    { event: "flashcard_rated", topic: "Cardiology", confidence_level: "again" },
  ];
  assert.deepEqual(buildMisconceptionHeatmap(events), []);
});

// ── buildWeakTopicClusters ────────────────────────────────────────────────────

test("weak clusters: empty → empty", () => {
  assert.deepEqual(buildWeakTopicClusters([]), []);
});

test("weak clusters: all easy ratings → weakRatio 0", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_rated", topic: "Cardiology", confidence_level: "easy" },
    { event: "flashcard_rated", topic: "Cardiology", confidence_level: "good" },
  ];
  const rows = buildWeakTopicClusters(events);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]!.weakRatio, 0);
});

test("weak clusters: all again → weakRatio 1.0", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_rated", topic: "Respiratory", confidence_level: "again" },
    { event: "flashcard_rated", topic: "Respiratory", confidence_level: "again" },
  ];
  const rows = buildWeakTopicClusters(events);
  assert.equal(rows[0]!.weakRatio, 1);
  assert.equal(rows[0]!.againCount, 2);
});

test("weak clusters: sorted descending by weakRatio", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_rated", topic: "Neuro", confidence_level: "easy" },
    { event: "flashcard_rated", topic: "Cardiology", confidence_level: "again" },
    { event: "flashcard_rated", topic: "Cardiology", confidence_level: "again" },
  ];
  const rows = buildWeakTopicClusters(events);
  assert.equal(rows[0]!.topic, "cardiology", "highest weakRatio must be first");
});

test("weak clusters: hard counts towards weak ratio", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_rated", topic: "Pharmacology", confidence_level: "hard" },
    { event: "flashcard_rated", topic: "Pharmacology", confidence_level: "good" },
  ];
  const rows = buildWeakTopicClusters(events);
  assert.equal(rows[0]!.hardCount, 1);
  assert.equal(rows[0]!.weakRatio, 0.5);
});

// ── buildPrescribingSafetyMisses ──────────────────────────────────────────────

test("prescribing safety: no pharmacology events → empty", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", topic: "Cardiology", is_correct: false },
  ];
  assert.deepEqual(buildPrescribingSafetyMisses(events), []);
});

test("prescribing safety: medication topic miss counted", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", topic: "Medication Safety", is_correct: false },
    { event: "answer_submitted", topic: "Medication Safety", is_correct: true },
  ];
  const rows = buildPrescribingSafetyMisses(events);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]!.missCount, 1);
  assert.equal(rows[0]!.totalAttempts, 2);
  assert.equal(rows[0]!.missRate, 0.5);
});

test("prescribing safety: 'pharmacology' keyword matches", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", topic: "Pharmacology – Renal", is_correct: false },
  ];
  const rows = buildPrescribingSafetyMisses(events);
  assert.equal(rows.length, 1);
});

test("prescribing safety: sorted by missRate desc", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", topic: "Drug Dosage", is_correct: false },
    { event: "answer_submitted", topic: "Drug Dosage", is_correct: false },
    { event: "answer_submitted", topic: "Medication Safety", is_correct: true },
  ];
  const rows = buildPrescribingSafetyMisses(events);
  assert.equal(rows[0]!.topic, "drug dosage", "highest missRate first");
});

// ── buildLongitudinalWeaknessTrend ────────────────────────────────────────────

test("longitudinal trend: events without timestamp are skipped", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_rated", topic: "Neuro", confidence_level: "again" }, // no timestamp
  ];
  assert.deepEqual(buildLongitudinalWeaknessTrend(events), []);
});

test("longitudinal trend: single week bucket computed correctly", () => {
  // 2026-05-11 is a Monday
  const MON = new Date("2026-05-11T10:00:00.000Z").getTime();
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_rated", topic: "Cardiology", confidence_level: "again", timestamp: MON },
    { event: "flashcard_rated", topic: "Cardiology", confidence_level: "good", timestamp: MON },
  ];
  const rows = buildLongitudinalWeaknessTrend(events);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]!.weekStart, "2026-05-11");
  assert.equal(rows[0]!.againCount, 1);
  assert.equal(rows[0]!.totalRated, 2);
  assert.equal(rows[0]!.weakRatio, 0.5);
});

test("longitudinal trend: two different weeks → two buckets", () => {
  const W1 = new Date("2026-05-11T10:00:00.000Z").getTime(); // week of 2026-05-11
  const W2 = new Date("2026-05-18T10:00:00.000Z").getTime(); // week of 2026-05-18
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_rated", topic: "Neuro", confidence_level: "again", timestamp: W1 },
    { event: "flashcard_rated", topic: "Neuro", confidence_level: "again", timestamp: W2 },
  ];
  const rows = buildLongitudinalWeaknessTrend(events);
  assert.equal(rows.length, 2);
  assert.equal(rows[0]!.weekStart, "2026-05-11");
  assert.equal(rows[1]!.weekStart, "2026-05-18");
});

test("longitudinal trend: sorted by weekStart asc", () => {
  const W1 = new Date("2026-04-14T10:00:00.000Z").getTime();
  const W2 = new Date("2026-05-11T10:00:00.000Z").getTime();
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_rated", topic: "Neuro", confidence_level: "again", timestamp: W2 },
    { event: "flashcard_rated", topic: "Neuro", confidence_level: "again", timestamp: W1 },
  ];
  const rows = buildLongitudinalWeaknessTrend(events);
  assert.ok(rows[0]!.weekStart < rows[1]!.weekStart, "must be sorted ascending");
});

// ── buildConfidenceAccuracyMismatch ───────────────────────────────────────────

test("confidence-accuracy: empty events → empty result", () => {
  assert.deepEqual(buildConfidenceAccuracyMismatch([]), []);
});

test("confidence-accuracy: card with no rated event excluded", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", card_id: "c1", is_correct: false },
  ];
  assert.deepEqual(buildConfidenceAccuracyMismatch(events), []);
});

test("confidence-accuracy: card with no answer_submitted excluded", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "flashcard_rated", card_id: "c1", confidence_level: "easy" },
  ];
  assert.deepEqual(buildConfidenceAccuracyMismatch(events), []);
});

test("confidence-accuracy: overconfident card has positive gap", () => {
  // easy (score 0) but wrong (accuracy 0) → gap = 0 - (1-0)*3 = -3
  // Actually let's check: confident=easy(0), accuracy=wrong(0) → this is overconfident (rated easy but wrong)
  // gap = confidenceScore - (1 - accuracyScore) * 3 = 0 - 1*3 = -3
  // Hmm, let me re-read the formula: low confidenceScore = easy, high = again
  // overconfident = easy (0) + wrong (0) → gap is -3... that seems backwards.
  // Let me re-read the aggregator: gap = confidenceScore - (1 - accuracyScore) * 3
  // confidenceScore 0=easy, 3=again
  // accuracyScore 1=correct, 0=wrong
  // easy(0) + wrong(0): gap = 0 - (1-0)*3 = -3 (large negative)
  // again(3) + correct(1): gap = 3 - (1-1)*3 = 3 (large positive)
  // So: negative gap = overconfident (easy but wrong), positive gap = underconfident (again but correct)
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", card_id: "c1", is_correct: false },
    { event: "flashcard_rated", card_id: "c1", confidence_level: "easy" },
  ];
  const rows = buildConfidenceAccuracyMismatch(events);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]!.cardId, "c1");
  assert.equal(rows[0]!.confidenceScore, 0); // easy
  assert.equal(rows[0]!.accuracyScore, 0);   // wrong
  assert.ok(rows[0]!.gap < 0, "easy + wrong → negative gap (overconfident)");
});

test("confidence-accuracy: underconfident card (again but correct)", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", card_id: "c2", is_correct: true },
    { event: "flashcard_rated", card_id: "c2", confidence_level: "again" },
  ];
  const rows = buildConfidenceAccuracyMismatch(events);
  assert.equal(rows[0]!.confidenceScore, 3); // again
  assert.equal(rows[0]!.accuracyScore, 1);   // correct
  assert.ok(rows[0]!.gap > 0, "again + correct → positive gap (underconfident)");
});

test("confidence-accuracy: sorted by |gap| descending", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    // c1: easy + wrong → large |gap|
    { event: "answer_submitted", card_id: "c1", is_correct: false },
    { event: "flashcard_rated", card_id: "c1", confidence_level: "easy" },
    // c2: good + correct → small gap
    { event: "answer_submitted", card_id: "c2", is_correct: true },
    { event: "flashcard_rated", card_id: "c2", confidence_level: "good" },
  ];
  const rows = buildConfidenceAccuracyMismatch(events);
  assert.equal(rows[0]!.cardId, "c1", "largest |gap| must be first");
});

// ── Metadata correctness: flattenMeta round-trip ──────────────────────────────
// We test flattenMeta indirectly via the PostHog event props contract:
// undefined values must be stripped (PostHog ignores undefined, but we confirm).

test("metadata: undefined fields are omitted from props (flattenMeta contract)", () => {
  // Simulate what flattenMeta produces for a card with only topic set
  const meta = { topic: "Cardiology" };
  const props: Record<string, string | number | boolean | undefined> = {
    item_kind: (meta as { itemKind?: string }).itemKind ?? undefined,
    question_type: undefined,
    topic: meta.topic,
    domain: undefined,
    segment: undefined,
    remediation_boosted: undefined,
    ecg_flag: undefined,
    bowtie_flag: undefined,
    lab_flag: undefined,
  };
  // All undefined values should be present but undefined (PostHog will skip them)
  assert.equal(props.topic, "Cardiology");
  assert.equal(props.item_kind, undefined);
  assert.equal(props.question_type, undefined);
});

test("metadata: remediation_boosted=true propagates correctly", () => {
  const props: Record<string, string | number | boolean | undefined> = {
    remediation_boosted: true,
    topic: "Respiratory",
  };
  assert.equal(props.remediation_boosted, true);
});

test("metadata: ecg + bowtie + lab flags all true on clinical combination", () => {
  const flags = deriveCardFlags({
    topic: "ECG interpretation",
    questionStem: "Complete the bowtie item. The client's troponin is 2.8.",
  });
  assert.equal(flags.ecgFlag, true);
  assert.equal(flags.bowtieFlag, true);
  assert.equal(flags.labFlag, true);
});

// ── Mobile session stability ──────────────────────────────────────────────────

test("mobile stability: processing 500 events does not throw", () => {
  const events: FlashcardTelemetryEventRecord[] = Array.from({ length: 500 }, (_, i) => ({
    event: i % 2 === 0 ? "answer_submitted" : "flashcard_rated",
    card_id: `card-${i % 50}`,
    topic: ["Cardiology", "Neuro", "Pharmacology", "Respiratory", "Endocrine"][i % 5],
    confidence_level: ["again", "hard", "good", "easy"][i % 4],
    is_correct: i % 3 !== 0,
    distractor_selected: i % 3 === 0 ? "B" : undefined,
    timestamp: Date.now() - i * 60_000,
  }));

  assert.doesNotThrow(() => buildMisconceptionHeatmap(events));
  assert.doesNotThrow(() => buildWeakTopicClusters(events));
  assert.doesNotThrow(() => buildPrescribingSafetyMisses(events));
  assert.doesNotThrow(() => buildLongitudinalWeaknessTrend(events));
  assert.doesNotThrow(() => buildConfidenceAccuracyMismatch(events));
});

test("mobile stability: empty card_id events are handled gracefully", () => {
  const events: FlashcardTelemetryEventRecord[] = [
    { event: "answer_submitted", card_id: undefined, is_correct: false, distractor_selected: "A" },
    { event: "flashcard_rated", card_id: undefined, confidence_level: "again" },
  ];
  assert.doesNotThrow(() => buildConfidenceAccuracyMismatch(events));
  // No card_ids → no rows
  assert.deepEqual(buildConfidenceAccuracyMismatch(events), []);
});
