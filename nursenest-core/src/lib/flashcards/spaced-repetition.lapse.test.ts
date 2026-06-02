/**
 * SM-2 lapse logic unit tests.
 * Verifies the exact semantics documented in spaced-repetition.ts:
 *   - New card failures (repetitions === 0) do NOT increment lapses
 *   - First "again" on a learned card increments lapses
 *   - lapses persist through subsequent good/easy ratings
 *   - Hard/Good/Easy never increment lapses
 *   - Ease factor decays on each lapse
 *   - Interval resets to 1 on fail regardless of lapses count
 */

import assert from "node:assert/strict";
import test from "node:test";
import { computeNextSchedule, initialSm2State, type Sm2State } from "@/lib/flashcards/spaced-repetition";

const NOW = new Date("2026-07-04T12:00:00.000Z");

function nextDay(days: number): Date {
  const d = new Date(NOW.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

// ── New card fails ─────────────────────────────────────────────────────────────

test("new card rated again: lapses stay 0", () => {
  const init = initialSm2State();
  assert.equal(init.lapses, 0);

  const result = computeNextSchedule(init, "again", NOW);
  assert.equal(result.lapses, 0, "new card fail must not increment lapses");
  assert.equal(result.repetitions, 0);
  assert.equal(result.intervalDays, 1);
});

test("new card rated again twice: lapses still 0", () => {
  const s0 = initialSm2State();
  const s1 = computeNextSchedule(s0, "again", NOW);
  const s2 = computeNextSchedule(s1, "again", NOW);
  assert.equal(s2.lapses, 0);
});

// ── First learned card fails ────────────────────────────────────────────────

test("card rated good then again: lapses increments to 1", () => {
  const s0 = initialSm2State();
  const s1 = computeNextSchedule(s0, "good", NOW);
  assert.equal(s1.repetitions, 1, "after good: reps=1");
  assert.equal(s1.lapses, 0);

  const s2 = computeNextSchedule(s1, "again", NOW);
  assert.equal(s2.lapses, 1, "first fail on learned card must lapse");
  assert.equal(s2.repetitions, 0, "repetitions reset to 0 on lapse");
  assert.equal(s2.intervalDays, 1, "interval resets to 1 on lapse");
});

test("learned card fails twice: lapses accumulate (1 then 2)", () => {
  const s0 = initialSm2State();
  const s1 = computeNextSchedule(s0, "good", NOW); // reps=1
  const s2 = computeNextSchedule(s1, "good", NOW); // reps=2
  const s3 = computeNextSchedule(s2, "again", NOW); // lapses=1
  const s4 = computeNextSchedule(s3, "good", NOW);  // relearn: reps=1 again
  const s5 = computeNextSchedule(s4, "good", NOW);  // reps=2
  const s6 = computeNextSchedule(s5, "again", NOW); // lapses=2
  assert.equal(s6.lapses, 2);
});

// ── lapses persist through good/easy ────────────────────────────────────────

test("lapses are preserved when card is re-learned after lapse", () => {
  const s0 = initialSm2State();
  const s1 = computeNextSchedule(s0, "good", NOW);
  const s2 = computeNextSchedule(s1, "again", NOW); // lapses=1
  const s3 = computeNextSchedule(s2, "good", NOW);  // re-learning: lapses should stay 1
  assert.equal(s3.lapses, 1, "lapses must survive a good rating after lapse");

  const s4 = computeNextSchedule(s3, "easy", NOW);
  assert.equal(s4.lapses, 1, "lapses must survive an easy rating");
});

// ── Hard/Good/Easy never lapse ───────────────────────────────────────────────

test("good rating on new card: lapses = 0", () => {
  const r = computeNextSchedule(initialSm2State(), "good", NOW);
  assert.equal(r.lapses, 0);
});

test("hard rating on new card: lapses = 0", () => {
  const r = computeNextSchedule(initialSm2State(), "hard", NOW);
  assert.equal(r.lapses, 0);
});

test("easy rating on new card: lapses = 0", () => {
  const r = computeNextSchedule(initialSm2State(), "easy", NOW);
  assert.equal(r.lapses, 0);
});

// ── Ease factor decay on lapse ───────────────────────────────────────────────

test("ease factor decreases by 0.2 on each lapse (min 1.3)", () => {
  let state: Sm2State = initialSm2State();
  state = computeNextSchedule(state, "good", NOW); // reps=1, ef≈2.5
  const efBefore = state.easeFactor;
  state = computeNextSchedule(state, "again", NOW); // lapse
  const efAfter = state.easeFactor;
  assert.ok(
    efAfter < efBefore,
    `ease factor should decrease on lapse: ${efBefore} → ${efAfter}`,
  );
  assert.ok(efAfter >= 1.3, `ease factor floor is 1.3, got ${efAfter}`);
});

test("ease factor bottoms at 1.3 after repeated lapses", () => {
  // Force many lapses by alternating good → again
  let state: Sm2State = { easeFactor: 1.5, intervalDays: 1, repetitions: 1, lapses: 0 };
  for (let i = 0; i < 10; i++) {
    state = computeNextSchedule(state, "again", NOW);
    state = computeNextSchedule(state, "good", NOW);
  }
  assert.ok(state.easeFactor >= 1.3, `floor must hold: got ${state.easeFactor}`);
});

// ── nextReviewAt correctness ─────────────────────────────────────────────────

test("again on learned card schedules review for tomorrow", () => {
  const s0 = initialSm2State();
  const s1 = computeNextSchedule(s0, "good", NOW);
  const s2 = computeNextSchedule(s1, "again", NOW);
  assert.equal(s2.intervalDays, 1);
  const expected = nextDay(1).toISOString().slice(0, 10);
  const actual = s2.nextReviewAt.toISOString().slice(0, 10);
  assert.equal(actual, expected, "lapse: review tomorrow");
});

test("easy on a fresh card schedules review 1 day later", () => {
  const r = computeNextSchedule(initialSm2State(), "easy", NOW);
  assert.equal(r.intervalDays, 1); // reps=0 → first review is always 1 day
});

test("good on reps=1 schedules review 6 days later", () => {
  const s0 = initialSm2State();
  const s1 = computeNextSchedule(s0, "good", NOW); // reps=1, interval=1
  const s2 = computeNextSchedule(s1, "good", NOW); // reps=2, interval=6
  assert.equal(s2.intervalDays, 6);
});

// ── Legacy state (no lapses field) ──────────────────────────────────────────

test("state without lapses field is treated as lapses=0", () => {
  const legacy: Sm2State = { easeFactor: 2.5, intervalDays: 6, repetitions: 2 }; // no lapses
  const result = computeNextSchedule(legacy, "again", NOW);
  assert.equal(result.lapses, 1, "lapses should default to 0 then increment to 1");
});

test("state with lapses=undefined is treated as lapses=0", () => {
  const s: Sm2State = { easeFactor: 2.5, intervalDays: 1, repetitions: 1, lapses: undefined };
  const result = computeNextSchedule(s, "again", NOW);
  assert.equal(result.lapses, 1);
});
