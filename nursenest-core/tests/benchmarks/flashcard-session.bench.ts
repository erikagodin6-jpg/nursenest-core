/**
 * Flashcard Session Performance Benchmark — Phase 3H
 *
 * Measures in-process latency of the CPU-bound operations inside
 * buildFlashcardCustomSession (shuffle, category resolution, serialization,
 * filter chains) without a real DB connection.
 *
 * Run:  node --import tsx --test tests/benchmarks/flashcard-session.bench.ts
 *
 * Build-gate thresholds (fail test if exceeded):
 *   RN / RPN / NP shuffle+filter+sort (150 cards): p95 < 5 ms
 *   Multi-System (80 cards):                       p95 < 3 ms
 *   Weak / Incorrect (200 cards, progress filter):  p95 < 5 ms
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";

// ── CPU-only helpers mirroring the session builder ────────────────────────────

function hashSeedToUint32(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  let state = h >>> 0;
  if (state === 0) state = 0x9e3779b9;
  return state;
}

function nextUnitFloat(state: { s: number }): number {
  let x = state.s;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  state.s = x >>> 0;
  return (x >>> 0) / 0xffffffff;
}

function shuffleSeededBench<T>(arr: T[], seed: string): T[] {
  const a = arr;
  const state = { s: hashSeedToUint32(seed) };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(nextUnitFloat(state) * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

type MockCard = {
  id: string;
  builderCategoryId: string;
  lastQuality?: number;
  repetitions?: number;
  lapses?: number;
};

function makeMockCards(n: number, prefix = "card"): MockCard[] {
  const categories = ["cardiology", "respiratory", "pharmacology", "neuro", "musculoskeletal"];
  return Array.from({ length: n }, (_, i) => ({
    id: `${prefix}-${i}`,
    builderCategoryId: categories[i % categories.length]!,
    lastQuality: Math.random() > 0.7 ? 1 : 3,
    repetitions: Math.floor(Math.random() * 10),
    lapses: Math.random() > 0.8 ? 1 : 0,
  }));
}

type ProgressMap = Map<string, { lastQuality: number | null; repetitions: number; lapses: number }>;

function makeProgressMap(cards: MockCard[]): ProgressMap {
  const m: ProgressMap = new Map();
  for (const c of cards.slice(0, Math.floor(cards.length * 0.6))) {
    m.set(c.id, { lastQuality: c.lastQuality ?? null, repetitions: c.repetitions ?? 0, lapses: c.lapses ?? 0 });
  }
  return m;
}

function filterWeak(cards: MockCard[], progress: ProgressMap): MockCard[] {
  return cards.filter((c) => {
    const p = progress.get(c.id);
    return Boolean(p && ((p.lastQuality ?? 3) <= 2 || p.repetitions < 2));
  });
}

function filterIncorrect(cards: MockCard[], progress: ProgressMap): MockCard[] {
  return cards.filter((c) => {
    const p = progress.get(c.id);
    return Boolean(p && (p.lastQuality ?? 3) <= 1);
  });
}

function filterByCategory(cards: MockCard[], selected: Set<string>): MockCard[] {
  if (selected.size === 0) return cards;
  return cards.filter((c) => selected.has(c.builderCategoryId));
}

function buildCategoryCounts(cards: MockCard[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of cards) {
    counts[c.builderCategoryId] = (counts[c.builderCategoryId] ?? 0) + 1;
  }
  return counts;
}

// ── Benchmark harness ─────────────────────────────────────────────────────────

type BenchResult = { p50: number; p95: number; p99: number; mean: number; runs: number };

async function bench(label: string, fn: () => void, iterations = 1000): Promise<BenchResult> {
  // Warm-up
  for (let i = 0; i < 50; i++) fn();

  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    fn();
    times.push(performance.now() - t0);
  }
  times.sort((a, b) => a - b);
  const p50 = times[Math.floor(times.length * 0.5)]!;
  const p95 = times[Math.floor(times.length * 0.95)]!;
  const p99 = times[Math.floor(times.length * 0.99)]!;
  const mean = times.reduce((s, t) => s + t, 0) / times.length;
  console.log(`[bench] ${label}: p50=${p50.toFixed(3)}ms p95=${p95.toFixed(3)}ms p99=${p99.toFixed(3)}ms mean=${mean.toFixed(3)}ms (${iterations} runs)`);
  return { p50, p95, p99, mean, runs: iterations };
}

// ── Session type benchmarks ───────────────────────────────────────────────────

describe("Flashcard Session CPU Benchmarks — Phase 3H", () => {
  test("RN standard session (150 cards, shuffle+category+sort)", async () => {
    const cards = makeMockCards(150, "rn");
    const progress = makeProgressMap(cards);
    const result = await bench("RN standard (150 cards)", () => {
      const shuffled = shuffleSeededBench([...cards], "seed-rn-bench");
      const capped = shuffled.slice(0, 150);
      const counts = buildCategoryCounts(capped);
      // Simulate adaptive scoring (lightweight)
      const scored = capped.map((c) => {
        const p = progress.get(c.id);
        const score = (p ? (p.lastQuality ?? 5) <= 2 ? 520_000 : 0 : 1_250_000);
        return { ...c, score };
      });
      scored.sort((a, b) => b.score - a.score);
      void counts;
      return scored.slice(0, 8);
    });
    assert.ok(result.p95 < 5, `RN p95 ${result.p95.toFixed(3)}ms must be < 5ms`);
  });

  test("RPN standard session (150 cards, shuffle+category+sort)", async () => {
    const cards = makeMockCards(150, "rpn");
    const progress = makeProgressMap(cards);
    const result = await bench("RPN standard (150 cards)", () => {
      const shuffled = shuffleSeededBench([...cards], "seed-rpn-bench");
      const capped = shuffled.slice(0, 150);
      const counts = buildCategoryCounts(capped);
      const scored = capped.map((c) => {
        const p = progress.get(c.id);
        return { ...c, score: p ? 0 : 1_250_000 };
      });
      scored.sort((a, b) => b.score - a.score);
      void counts;
      return scored.slice(0, 8);
    });
    assert.ok(result.p95 < 5, `RPN p95 ${result.p95.toFixed(3)}ms must be < 5ms`);
  });

  test("NP standard session (150 cards, shuffle+category+sort)", async () => {
    const cards = makeMockCards(150, "np");
    const progress = makeProgressMap(cards);
    const result = await bench("NP standard (150 cards)", () => {
      const shuffled = shuffleSeededBench([...cards], "seed-np-bench");
      const capped = shuffled.slice(0, 150);
      const counts = buildCategoryCounts(capped);
      const scored = capped.map((c) => {
        const p = progress.get(c.id);
        return { ...c, score: p ? 0 : 1_250_000 };
      });
      scored.sort((a, b) => b.score - a.score);
      void counts;
      return scored.slice(0, 8);
    });
    assert.ok(result.p95 < 5, `NP p95 ${result.p95.toFixed(3)}ms must be < 5ms`);
  });

  test("Multi-System session (80 cards, category filter + sort)", async () => {
    const cards = makeMockCards(80, "multi");
    const progress = makeProgressMap(cards);
    const selected = new Set(["cardiology", "respiratory"]);
    const result = await bench("Multi-System (80 cards, 2 categories)", () => {
      const filtered = filterByCategory(cards, selected);
      const counts = buildCategoryCounts(filtered);
      const scored = filtered.map((c) => {
        const p = progress.get(c.id);
        return { ...c, score: p ? 0 : 1_250_000 };
      });
      scored.sort((a, b) => b.score - a.score);
      void counts;
      return scored.slice(0, 8);
    });
    assert.ok(result.p95 < 3, `Multi-System p95 ${result.p95.toFixed(3)}ms must be < 3ms`);
  });

  test("Weak Areas session (200 cards, progress filter)", async () => {
    const cards = makeMockCards(200, "weak");
    const progress = makeProgressMap(cards);
    const result = await bench("Weak Areas (200 cards, progress filter)", () => {
      const counts = buildCategoryCounts(cards);
      const weak = filterWeak(cards, progress);
      void counts;
      return weak.slice(0, 8);
    });
    assert.ok(result.p95 < 5, `Weak Areas p95 ${result.p95.toFixed(3)}ms must be < 5ms`);
  });

  test("Incorrect Only session (200 cards, strict quality filter)", async () => {
    const cards = makeMockCards(200, "incorrect");
    const progress = makeProgressMap(cards);
    const result = await bench("Incorrect Only (200 cards, quality<=1 filter)", () => {
      const counts = buildCategoryCounts(cards);
      const incorrect = filterIncorrect(cards, progress);
      void counts;
      return incorrect.slice(0, 8);
    });
    assert.ok(result.p95 < 5, `Incorrect Only p95 ${result.p95.toFixed(3)}ms must be < 5ms`);
  });

  test("Category count accumulation (800 cards)", async () => {
    const cards = makeMockCards(800, "count");
    const result = await bench("Category count (800 cards)", () => {
      return buildCategoryCounts(cards);
    });
    assert.ok(result.p95 < 2, `Category count p95 ${result.p95.toFixed(3)}ms must be < 2ms`);
  });
});
