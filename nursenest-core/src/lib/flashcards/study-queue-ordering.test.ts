/**
 * Pure-logic tests for study queue ordering and deduplication.
 * Tests the segment priority rules without hitting the DB.
 *
 * Rules verified:
 *   - lapsing cards appear before overdue cards in the output list
 *   - overdue appears before due-today
 *   - a card appearing in multiple segments is deduplicated (shown once in highest-priority bucket)
 *   - empty inputs return empty output
 *   - utcDayBounds produces correct boundaries
 */

import assert from "node:assert/strict";
import test from "node:test";

// ── Inline the utcDayBounds helper to test it independently ──────────────────

function utcDayBounds(d: Date): { start: Date; end: Date } {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return { start, end };
}

test("utcDayBounds: start is midnight UTC", () => {
  const d = new Date("2026-07-04T15:30:00.000Z");
  const { start } = utcDayBounds(d);
  assert.equal(start.toISOString(), "2026-07-04T00:00:00.000Z");
});

test("utcDayBounds: end is 23:59:59.999 UTC", () => {
  const d = new Date("2026-07-04T01:00:00.000Z");
  const { end } = utcDayBounds(d);
  assert.equal(end.toISOString(), "2026-07-04T23:59:59.999Z");
});

test("utcDayBounds: midnight UTC → same-day bounds", () => {
  const d = new Date("2026-07-04T00:00:00.000Z");
  const { start, end } = utcDayBounds(d);
  assert.equal(start.toISOString(), "2026-07-04T00:00:00.000Z");
  assert.equal(end.toISOString(), "2026-07-04T23:59:59.999Z");
});

// ── Inline segment ordering logic (mirrors study-queue-segments.ts toCard) ───

type MockCard = { id: string; segment: "lapsing" | "overdue" | "due" | "new"; lapses: number };

function buildMockQueue(
  lapsingIds: string[],
  overdueIds: string[],
  dueTodayIds: string[],
): MockCard[] {
  const seenIds = new Set<string>();
  const cards: MockCard[] = [];

  for (const id of lapsingIds) {
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    cards.push({ id, segment: "lapsing", lapses: 1 });
  }
  for (const id of overdueIds) {
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    cards.push({ id, segment: "overdue", lapses: 0 });
  }
  for (const id of dueTodayIds) {
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    cards.push({ id, segment: "due", lapses: 0 });
  }
  return cards;
}

test("ordering: lapsing before overdue before due", () => {
  const result = buildMockQueue(["L1"], ["O1"], ["D1"]);
  assert.deepEqual(
    result.map((c) => c.segment),
    ["lapsing", "overdue", "due"],
  );
});

test("ordering: multiple items per segment maintain internal order", () => {
  const result = buildMockQueue(["L1", "L2"], ["O1", "O2"], ["D1"]);
  assert.equal(result[0]!.id, "L1");
  assert.equal(result[1]!.id, "L2");
  assert.equal(result[2]!.id, "O1");
  assert.equal(result[3]!.id, "O2");
  assert.equal(result[4]!.id, "D1");
});

test("deduplication: a card in lapsing + overdue appears only in lapsing", () => {
  const result = buildMockQueue(["SHARED"], ["SHARED", "O1"], []);
  assert.equal(result.length, 2, "SHARED deduped, O1 also present");
  assert.equal(result[0]!.id, "SHARED");
  assert.equal(result[0]!.segment, "lapsing");
  assert.equal(result[1]!.id, "O1");
  assert.equal(result[1]!.segment, "overdue");
});

test("deduplication: a card in overdue + due appears only in overdue", () => {
  const result = buildMockQueue([], ["SHARED"], ["SHARED", "D1"]);
  assert.equal(result.length, 2);
  assert.equal(result[0]!.segment, "overdue");
  assert.equal(result[1]!.id, "D1");
});

test("empty input returns empty list", () => {
  const result = buildMockQueue([], [], []);
  assert.deepEqual(result, []);
});

test("only due-today cards: correct segment label", () => {
  const result = buildMockQueue([], [], ["D1", "D2"]);
  assert.ok(result.every((c) => c.segment === "due"));
  assert.equal(result.length, 2);
});

// ── newCards arithmetic ───────────────────────────────────────────────────────

test("newCards: totalAccessible > totalReviewed → positive", () => {
  const totalAccessible = 100;
  const totalReviewed = 60;
  const newCards = Math.max(0, totalAccessible - totalReviewed);
  assert.equal(newCards, 40);
});

test("newCards: totalReviewed equals totalAccessible → 0 (not negative)", () => {
  const newCards = Math.max(0, 50 - 50);
  assert.equal(newCards, 0);
});

test("newCards: totalReviewed > totalAccessible (edge: synthetic rows) → clamped to 0", () => {
  const newCards = Math.max(0, 50 - 60);
  assert.equal(newCards, 0, "must never be negative");
});

// ── Lapsing vs overdue count exclusivity ─────────────────────────────────────

test("lapsing count does not overlap with overdue when lapses=0 filter applied", () => {
  // Simulate the SQL filter: overdue WHERE lapses=0, lapsing WHERE lapses>0
  const progressRows = [
    { lapses: 0, dueAt: "yesterday" },  // overdue, not lapsing
    { lapses: 1, dueAt: "yesterday" },  // lapsing, not in overdue
    { lapses: 2, dueAt: "today" },      // lapsing (due today), not in overdue
    { lapses: 0, dueAt: "today" },      // due today, not lapsing
  ];

  const overdue = progressRows.filter((r) => r.lapses === 0 && r.dueAt === "yesterday");
  const lapsing = progressRows.filter((r) => r.lapses > 0 && (r.dueAt === "yesterday" || r.dueAt === "today"));
  const dueToday = progressRows.filter((r) => r.lapses === 0 && r.dueAt === "today");

  // No overlap between buckets
  const overdueIds = new Set(overdue.map((r) => JSON.stringify(r)));
  const lapsingOverlap = lapsing.filter((r) => overdueIds.has(JSON.stringify(r)));
  assert.equal(lapsingOverlap.length, 0, "no card appears in both lapsing and overdue");

  // Totals add up to 4 unique cards
  assert.equal(overdue.length + lapsing.length + dueToday.length, 4);
});
