import {
  CAT_EARLY_FAIL_THETA,
  CAT_EARLY_PASS_THETA,
  CAT_EARLY_STOP_SE,
  CAT_FINAL_FAIL_THETA,
  CAT_FINAL_PASS_THETA,
  CAT_MAX_QUESTIONS,
  CAT_MIN_QUESTIONS,
  CAT_START_TARGET_DIFFICULTY,
  CAT_START_THETA,
} from "@/lib/exams/cat-config";
import {
  CAT_STATE_VERSION,
  type CatAdaptiveState,
  type CatAnswerResult,
  type CatExamReport,
  type CatIncident,
} from "@/lib/exams/cat-types";

export type CatPoolRow = {
  id: string;
  difficulty: number;
  bodySystem: string | null;
  topic: string | null;
};

export function categoryKeyForQuestion(row: Pick<CatPoolRow, "bodySystem" | "topic">): string {
  const b = row.bodySystem?.trim();
  const t = row.topic?.trim();
  if (b && b.length > 0) return b;
  if (t && t.length > 0) return t;
  return "General";
}

export function clampDifficulty(n: number): number {
  if (!Number.isFinite(n)) return 3;
  return Math.min(5, Math.max(1, Math.round(n)));
}

export function createInitialAdaptiveState(): CatAdaptiveState {
  return {
    v: CAT_STATE_VERSION,
    theta: CAT_START_THETA,
    targetDifficulty: CAT_START_TARGET_DIFFICULTY,
    se: 1.25,
    results: [],
    difficultyHistory: [],
    incidents: [],
    stoppedReason: null,
    decision: null,
  };
}

export function parseAdaptiveState(raw: unknown): CatAdaptiveState | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<CatAdaptiveState>;
  if (o.v !== CAT_STATE_VERSION) return null;
  if (typeof o.theta !== "number" || typeof o.targetDifficulty !== "number") return null;
  return {
    v: CAT_STATE_VERSION,
    theta: o.theta,
    targetDifficulty: clampDifficulty(o.targetDifficulty),
    se: typeof o.se === "number" ? o.se : 1.25,
    results: Array.isArray(o.results) ? (o.results as CatAnswerResult[]) : [],
    difficultyHistory: Array.isArray(o.difficultyHistory) ? o.difficultyHistory.map(Number) : [],
    incidents: Array.isArray(o.incidents) ? (o.incidents as CatIncident[]) : [],
    stoppedReason: o.stoppedReason ?? null,
    decision: o.decision ?? null,
  };
}

/** After each scored item, append result and update theta / SE. */
export function appendScoredResult(state: CatAdaptiveState, result: CatAnswerResult): CatAdaptiveState {
  const d = clampDifficulty(result.difficulty);
  const diffFromCenter = (d - 3) / 2;
  const step = 0.18 * (result.correct ? 1 : -1) * (1 - 0.15 * Math.abs(diffFromCenter));
  let theta = state.theta + step;
  theta = Math.min(3, Math.max(-3, theta));

  let target = state.targetDifficulty;
  if (result.correct) target = Math.min(5, target + 1);
  else target = Math.max(1, target - 1);

  const n = state.results.length + 1;
  const se = Math.min(1.2, 2.0 / Math.sqrt(Math.max(1, n)));

  return {
    ...state,
    theta,
    targetDifficulty: clampDifficulty(target),
    se,
    difficultyHistory: [...state.difficultyHistory, d],
    results: [...state.results, result],
  };
}

export type CatPoolValidation = { ok: true } | { ok: false; error: string };

/**
 * Ensures enough adaptive-eligible items exist for a credible CAT run.
 */
export function validateCatQuestionPool(rows: CatPoolRow[]): CatPoolValidation {
  if (rows.length < CAT_MIN_QUESTIONS) {
    return {
      ok: false,
      error: `CAT needs at least ${CAT_MIN_QUESTIONS} published adaptive-eligible questions in your pool (found ${rows.length}). Add items or contact your admin.`,
    };
  }

  const byDiff = new Map<number, number>();
  const categories = new Set<string>();
  for (const r of rows) {
    const d = clampDifficulty(r.difficulty);
    byDiff.set(d, (byDiff.get(d) ?? 0) + 1);
    categories.add(categoryKeyForQuestion(r));
  }

  if (byDiff.size < 2) {
    return {
      ok: false,
      error:
        "CAT pool needs questions tagged with at least two distinct difficulty levels (1–5). Normalize difficulty metadata.",
    };
  }

  if (categories.size < 3) {
    return {
      ok: false,
      error:
        "CAT pool needs at least three distinct categories (body system or topic) for blueprint-style coverage.",
    };
  }

  return { ok: true };
}

/** Relaxed validation for learner practice CAT (smaller banks than full NCLEX sim). */
export function validatePracticeCatPool(rows: CatPoolRow[]): CatPoolValidation {
  const minPool = 8;
  if (rows.length < minPool) {
    return {
      ok: false,
      error: `Adaptive practice needs at least ${minPool} eligible questions in the filtered pool (found ${rows.length}). Broaden topics or difficulty.`,
    };
  }

  const byDiff = new Map<number, number>();
  const categories = new Set<string>();
  for (const r of rows) {
    const d = clampDifficulty(r.difficulty);
    byDiff.set(d, (byDiff.get(d) ?? 0) + 1);
    categories.add(categoryKeyForQuestion(r));
  }

  if (byDiff.size < 2) {
    return {
      ok: false,
      error:
        "Adaptive practice needs at least two distinct difficulty levels (1–5). Add more varied items or relax filters.",
    };
  }

  if (categories.size < 2) {
    return {
      ok: false,
      error:
        "Adaptive practice needs at least two distinct categories (body system or topic) in the pool. Broaden topic filters.",
    };
  }

  return { ok: true };
}

function hashPickStable(candidates: CatPoolRow[], salt: string): CatPoolRow {
  let h = 0;
  for (let i = 0; i < salt.length; i++) h = (h * 31 + salt.charCodeAt(i)) >>> 0;
  const idx = h % candidates.length;
  return candidates[idx]!;
}

/** Optional tuning for next-item selection (weak-area priority, etc.). */
export type CatSelectOptions = {
  /**
   * Category keys (body system / topic / General) that should be sampled more often.
   * Lower returned value = higher priority in the sort.
   */
  categoryPriorityBoost?: (categoryKey: string, row: CatPoolRow) => number;
};

/**
 * Blueprint-style: prefer categories with fewer delivered items; match difficulty band; no repeats.
 */
export function selectNextQuestion(
  pool: CatPoolRow[],
  usedIds: Set<string>,
  targetDifficulty: number,
  deliveredCountsByCategory: Map<string, number>,
  options?: CatSelectOptions,
): { selected: CatPoolRow | null; fallback: boolean; detail?: string } {
  const unused = pool.filter((p) => !usedIds.has(p.id));
  if (unused.length === 0) {
    return { selected: null, fallback: true, detail: "pool_exhausted" };
  }

  const td = clampDifficulty(targetDifficulty);
  const band = (d: number) => Math.abs(clampDifficulty(d) - td);

  const scored = unused.map((row) => {
    const cat = categoryKeyForQuestion(row);
    const delivered = deliveredCountsByCategory.get(cat) ?? 0;
    const deficit = delivered; // lower is better for balance — invert
    const boost = options?.categoryPriorityBoost?.(cat, row) ?? 0;
    const score = band(row.difficulty) * 12 + deficit * 3 - boost + Math.random() * 0.01;
    return { row, score };
  });

  scored.sort((a, b) => a.score - b.score);
  const best = scored[0]?.score ?? 0;
  const top = scored.filter((s) => s.score <= best + 0.5).map((s) => s.row);
  const pick = top.length ? hashPickStable(top, `${usedIds.size}:${td}`) : unused[0]!;

  const bandMatch = band(pick.difficulty) <= 1;
  if (bandMatch) return { selected: pick, fallback: false };

  const close = unused.filter((r) => band(r.difficulty) <= 1);
  if (close.length) {
    const p2 = hashPickStable(close, `${usedIds.size}:close`);
    return { selected: p2, fallback: true, detail: "difficulty_band_relaxed" };
  }

  return { selected: pick, fallback: true, detail: "closest_available" };
}

export function shouldStopAfterAnswer(
  state: CatAdaptiveState,
  nAnswered: number,
  bounds?: { min: number; max: number },
): CatAdaptiveState["stoppedReason"] {
  const minQ = bounds?.min ?? CAT_MIN_QUESTIONS;
  const maxQ = bounds?.max ?? CAT_MAX_QUESTIONS;
  if (nAnswered >= maxQ) return "max_length";
  if (nAnswered < minQ) return null;
  if (state.se <= CAT_EARLY_STOP_SE && state.theta >= CAT_EARLY_PASS_THETA) return "confidence_pass";
  if (state.se <= CAT_EARLY_STOP_SE && state.theta <= CAT_EARLY_FAIL_THETA) return "confidence_fail";
  return null;
}

export function finalizeThetaDecision(theta: number): "pass" | "fail" | "uncertain" {
  if (theta >= CAT_FINAL_PASS_THETA) return "pass";
  if (theta <= CAT_FINAL_FAIL_THETA) return "fail";
  return "uncertain";
}

export function buildCatReport(state: CatAdaptiveState): CatExamReport {
  const byCat = new Map<string, { correct: number; total: number }>();
  for (const r of state.results) {
    const cur = byCat.get(r.categoryKey) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (r.correct) cur.correct += 1;
    byCat.set(r.categoryKey, cur);
  }

  const correctCount = state.results.filter((r) => r.correct).length;
  const totalQuestions = state.results.length;
  const decision =
    state.decision ?? (totalQuestions > 0 ? finalizeThetaDecision(state.theta) : "uncertain");

  const categoryBreakdown = [...byCat.entries()]
    .map(([category, v]) => {
      const pct = v.total > 0 ? v.correct / v.total : 0;
      let strength: "strong" | "weak" | "mixed" = "mixed";
      if (pct >= 0.65) strength = "strong";
      else if (pct < 0.45) strength = "weak";
      return { category, correct: v.correct, total: v.total, strength };
    })
    .sort((a, b) => b.total - a.total);

  const weakAreas = categoryBreakdown.filter((c) => c.strength === "weak").map((c) => c.category);

  const suggestedNextSteps: string[] = [];
  if (weakAreas.length) {
    suggestedNextSteps.push(
      `Drill ${weakAreas.slice(0, 3).join(", ")} with short timed sets (10–15 items) before your next full run.`,
    );
  }
  if (decision === "uncertain") {
    suggestedNextSteps.push(
      "Your estimate sat near the cutoff—add two full-length timed blocks this week to stabilize performance.",
    );
  }
  if (decision === "fail") {
    suggestedNextSteps.push(
      "Review rationales for missed items in the question bank, then retry a CAT after focused study.",
    );
  }
  if (decision === "pass") {
    suggestedNextSteps.push("Maintain readiness with mixed-topic quizzes and one timed review per week.");
  }
  if (suggestedNextSteps.length === 0) {
    suggestedNextSteps.push("Keep mixing systems and prioritization items in the question bank.");
  }

  return {
    decision,
    theta: state.theta,
    se: state.se,
    totalQuestions,
    correctCount,
    stoppedReason:
      state.stoppedReason === null
        ? "completed"
        : state.stoppedReason === "pool_exhausted"
          ? "completed"
          : state.stoppedReason,
    categoryBreakdown,
    weakAreas,
    suggestedNextSteps,
  };
}

export function pushIncident(state: CatAdaptiveState, code: string, detail?: string): CatAdaptiveState {
  return {
    ...state,
    incidents: [...state.incidents, { code, detail, at: new Date().toISOString() }],
  };
}
