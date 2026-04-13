import {
  CAT_EARLY_STOP_SE,
  CAT_FINAL_PASS_THETA,
  CAT_MAX_QUESTIONS,
  CAT_MIN_ANSWERED_FOR_CONFIDENCE_STOP,
  CAT_MIN_QUESTIONS,
  CAT_START_TARGET_DIFFICULTY,
  CAT_START_THETA,
} from "@/lib/exams/cat-config";
import {
  confidenceLevelFromSe,
  confidenceText,
  readinessHeadlineFromSignals,
  readinessScoreFromTheta,
  trajectorySummary,
} from "@/lib/exams/cat-readiness";
import { buildCatBlueprintAdminDiagnostics } from "@/lib/exams/cat-blueprint-mapping-quality";
import { getExamConfig } from "@/lib/exams/exam-config";
import {
  CAT_STATE_VERSION,
  type CatAdaptiveState,
  type CatAnswerResult,
  type CatBlueprintDiagnostics,
  type CatExamReport,
  type CatIncident,
  type CatStoppedReason,
} from "@/lib/exams/cat-types";

export type CatPoolRow = {
  id: string;
  difficulty: number;
  bodySystem: string | null;
  topic: string | null;
  /** NCLEX client-needs major id when tagged; drives blueprint balancing when set. */
  nclexClientNeedsCategory?: string | null;
  nclexClientNeedsSubcategory?: string | null;
};

export function categoryKeyForQuestion(row: Pick<CatPoolRow, "bodySystem" | "topic">): string {
  const b = row.bodySystem?.trim();
  const t = row.topic?.trim();
  if (b && b.length > 0) return b;
  if (t && t.length > 0) return t;
  return "General";
}

/** Blueprint key: client-needs id when present, else body system / topic / General (legacy fallback). */
export function blueprintKeyForPoolRow(row: CatPoolRow): string {
  const c = row.nclexClientNeedsCategory?.trim();
  if (c && c.length > 0) return c;
  return categoryKeyForQuestion(row);
}

export function buildPoolBlueprintDiagnostics(pool: CatPoolRow[], examConfigId: string): CatBlueprintDiagnostics {
  const poolCountsByBlueprintKey: Record<string, number> = {};
  const cfg = getExamConfig(examConfigId);
  const allowedBlueprint = cfg ? new Set(cfg.categories.map((c) => c.id)) : null;
  let mapped = 0;
  for (const r of pool) {
    const k = blueprintKeyForPoolRow(r);
    if (allowedBlueprint && allowedBlueprint.size > 0) {
      if (allowedBlueprint.has(k)) mapped++;
    } else if (r.nclexClientNeedsCategory?.trim()) {
      mapped++;
    }
    poolCountsByBlueprintKey[k] = (poolCountsByBlueprintKey[k] ?? 0) + 1;
  }
  return {
    examConfigId,
    poolCountsByBlueprintKey,
    sessionCountsByBlueprintKey: {},
    poolMappedFraction: pool.length ? mapped / pool.length : 0,
    sessionMappedFraction: 0,
  };
}

/** Fraction of results tagged with a known blueprint axis (NCLEX client-needs or AANP domains). */
export function sessionMappedFractionFromResults(results: CatAnswerResult[]): number {
  if (results.length === 0) return 0;
  const n = results.filter(
    (r) => r.blueprintMappingSource === "nclex_client_needs" || r.blueprintMappingSource === "aanp_blueprint",
  ).length;
  return n / results.length;
}

export function mergeBlueprintDiagnosticsPostScore(
  diagnostics: CatBlueprintDiagnostics,
  results: CatAnswerResult[],
): CatBlueprintDiagnostics {
  return {
    ...diagnostics,
    sessionCountsByBlueprintKey: sessionBlueprintCountsFromResults(results),
    sessionMappedFraction: sessionMappedFractionFromResults(results),
  };
}

export function sessionBlueprintCountsFromResults(results: CatAnswerResult[]): Record<string, number> {
  const m: Record<string, number> = {};
  for (const r of results) {
    m[r.categoryKey] = (m[r.categoryKey] ?? 0) + 1;
  }
  return m;
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
    totalInformation: 0,
    results: [],
    difficultyHistory: [],
    thetaHistory: [],
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
    totalInformation: typeof o.totalInformation === "number" ? o.totalInformation : 0,
    results: Array.isArray(o.results) ? (o.results as CatAnswerResult[]) : [],
    difficultyHistory: Array.isArray(o.difficultyHistory) ? o.difficultyHistory.map(Number) : [],
    thetaHistory: Array.isArray(o.thetaHistory) ? o.thetaHistory.map(Number) : [],
    incidents: Array.isArray(o.incidents) ? (o.incidents as CatIncident[]) : [],
    stoppedReason: o.stoppedReason ?? null,
    decision: o.decision ?? null,
    catPresentationMode: o.catPresentationMode,
    catStudyAwaitingContinue: o.catStudyAwaitingContinue === true,
    catBlueprintDiagnostics: coerceCatBlueprintDiagnostics(o.catBlueprintDiagnostics),
  };
}

export function coerceCatBlueprintDiagnostics(raw: unknown): CatBlueprintDiagnostics | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Partial<CatBlueprintDiagnostics>;
  if (typeof d.examConfigId !== "string") return undefined;
  return {
    examConfigId: d.examConfigId,
    poolCountsByBlueprintKey:
      d.poolCountsByBlueprintKey && typeof d.poolCountsByBlueprintKey === "object"
        ? (d.poolCountsByBlueprintKey as Record<string, number>)
        : {},
    sessionCountsByBlueprintKey:
      d.sessionCountsByBlueprintKey && typeof d.sessionCountsByBlueprintKey === "object"
        ? (d.sessionCountsByBlueprintKey as Record<string, number>)
        : {},
    poolMappedFraction: typeof d.poolMappedFraction === "number" ? d.poolMappedFraction : 0,
    sessionMappedFraction: typeof d.sessionMappedFraction === "number" ? d.sessionMappedFraction : 0,
  };
}

/** After each scored item, append result and update theta / SE. */
export function appendScoredResult(state: CatAdaptiveState, result: CatAnswerResult): CatAdaptiveState {
  const d = clampDifficulty(result.difficulty);
  const diffFromCenter = (d - 3) / 2;
  // P3: replace with item-parameter-driven IRT update when discrimination + difficulty (b) are stored per item.
  const step = 0.18 * (result.correct ? 1 : -1) * (1 - 0.15 * Math.abs(diffFromCenter));
  let theta = state.theta + step;
  theta = Math.min(3, Math.max(-3, theta));

  /** Next-item difficulty target: larger steps after hard wins / easy misses (exam-like progression). */
  let target = state.targetDifficulty;
  if (result.correct) {
    target = Math.min(5, target + (d >= 4 ? 2 : 1));
  } else {
    target = Math.max(1, target - (d <= 2 ? 2 : 1));
  }
  target = clampDifficulty(target);

  const n = state.results.length + 1;
  const se = Math.min(1.2, 2.0 / Math.sqrt(Math.max(1, n)));

  const info =
    typeof result.itemInformation === "number" && Number.isFinite(result.itemInformation)
      ? result.itemInformation
      : 0.25;
  const thetaHistory = [...state.thetaHistory, theta].slice(-30);

  return {
    ...state,
    theta,
    targetDifficulty: clampDifficulty(target),
    se,
    totalInformation: state.totalInformation + info,
    difficultyHistory: [...state.difficultyHistory, d],
    results: [...state.results, result],
    thetaHistory,
  };
}

export type CatPoolValidation = { ok: true } | { ok: false; error: string };

/**
 * Ensures enough adaptive-eligible items exist for a credible CAT run.
 */
export function validateCatQuestionPool(rows: CatPoolRow[], options?: { minPoolSize?: number }): CatPoolValidation {
  const minNeed = options?.minPoolSize ?? CAT_MIN_QUESTIONS;
  if (rows.length < minNeed) {
    return {
      ok: false,
      error: `CAT needs at least ${minNeed} published adaptive-eligible questions in your pool (found ${rows.length}). Add items or contact your admin.`,
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
  /**
   * When set, balances toward NCLEX client-needs weights for rows with a mapped category id.
   * Rows without a mapping keep legacy deficit balancing on `blueprintKeyForPoolRow`.
   */
  blueprintWeights?: Record<string, number>;
};

/**
 * Blueprint-style: prefer under-served blueprint categories; match difficulty band; no repeats.
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
  const nDelivered = usedIds.size;
  const weights = options?.blueprintWeights;

  const scored = unused.map((row) => {
    const cat = blueprintKeyForPoolRow(row);
    const delivered = deliveredCountsByCategory.get(cat) ?? 0;
    const boost = options?.categoryPriorityBoost?.(cat, row) ?? 0;
    const mappedNclex = Boolean(row.nclexClientNeedsCategory?.trim());
    const w = mappedNclex && weights ? weights[cat] : undefined;
    let balanceTerm: number;
    if (w != null && nDelivered > 0) {
      const expected = nDelivered * w;
      balanceTerm = (expected - delivered) * 12;
    } else {
      balanceTerm = delivered * 3;
    }
    const score = band(row.difficulty) * 12 + balanceTerm - boost;
    return { row, score };
  });

  scored.sort((a, b) => a.score - b.score || a.row.id.localeCompare(b.row.id));
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

export type CatStopBounds = {
  min: number;
  max: number;
  passingThreshold?: number;
  earlyStopMargin?: number;
  /**
   * Minimum scored items before theta/SE confidence-based early stop is allowed.
   * Defaults to `CAT_MIN_ANSWERED_FOR_CONFIDENCE_STOP`. Exam simulations with a high `min`
   * (e.g. 75) already satisfy this; practice modes with a low `min` still require this floor.
   */
  minAnsweredForConfidenceStop?: number;
};

export function shouldStopAfterAnswer(
  state: CatAdaptiveState,
  nAnswered: number,
  bounds?: CatStopBounds,
): CatAdaptiveState["stoppedReason"] {
  const minQ = bounds?.min ?? CAT_MIN_QUESTIONS;
  const maxQ = bounds?.max ?? CAT_MAX_QUESTIONS;
  const minForConfidence =
    bounds?.minAnsweredForConfidenceStop ?? CAT_MIN_ANSWERED_FOR_CONFIDENCE_STOP;
  const passingThreshold = bounds?.passingThreshold ?? 0;
  const earlyStopMargin = Math.max(0.18, bounds?.earlyStopMargin ?? 0.32);
  const passCutoff = passingThreshold + earlyStopMargin;
  const failCutoff = passingThreshold - earlyStopMargin;

  if (nAnswered >= maxQ) return "max_length";
  if (nAnswered < minQ) return null;
  if (nAnswered < minForConfidence) return null;
  if (state.se <= CAT_EARLY_STOP_SE && state.theta >= passCutoff) return "confidence_pass";
  if (state.se <= CAT_EARLY_STOP_SE && state.theta <= failCutoff) return "confidence_fail";
  return null;
}

export function finalizeThetaDecision(
  theta: number,
  passingThreshold = 0,
  finalBand = Math.max(Math.abs(CAT_FINAL_PASS_THETA), Math.abs(CAT_FINAL_FAIL_THETA)),
): "pass" | "fail" | "uncertain" {
  const passCutoff = passingThreshold + finalBand;
  const failCutoff = passingThreshold - finalBand;
  if (theta >= passCutoff) return "pass";
  if (theta <= failCutoff) return "fail";
  return "uncertain";
}

function reportStoppedReason(raw: CatStoppedReason | null): CatExamReport["stoppedReason"] {
  if (raw === null || raw === "pool_exhausted") return "completed";
  if (raw === "max_length") return "max_length_reached";
  return raw;
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

  const examCfg = state.catBlueprintDiagnostics ? getExamConfig(state.catBlueprintDiagnostics.examConfigId) : null;

  const categoryBreakdown = [...byCat.entries()]
    .map(([blueprintKey, v]) => {
      const pct = v.total > 0 ? v.correct / v.total : 0;
      let strength: "strong" | "weak" | "mixed" = "mixed";
      if (pct >= 0.65) strength = "strong";
      else if (pct < 0.45) strength = "weak";
      const label = examCfg?.categories.find((c) => c.id === blueprintKey)?.label ?? blueprintKey;
      return {
        category: label,
        blueprintKey,
        correct: v.correct,
        total: v.total,
        strength,
      };
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
      "Your estimate sat near the cutoff. Add two full-length timed blocks this week to stabilize performance.",
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

  if (state.catPresentationMode === "exam_simulation") {
    const aanp = examCfg?.id === "aanp-np-us";
    suggestedNextSteps.unshift(
      aanp
        ? "This AANP-style NP readiness simulation uses NurseNest content and our adaptive engine. The live AANP exam is not computer-adaptive; this session simulates adaptive precision for learning. It is not an official AANP result or pass prediction."
        : "This NCLEX-RN-style simulation uses NurseNest content and our adaptive engine. It is not an official NCLEX result or pass prediction.",
    );
  }

  const readinessScore = readinessScoreFromTheta(state.theta);
  const confidenceLevel = confidenceLevelFromSe(state.se);
  const trajectory = trajectorySummary(state.results.map((r) => r.correct));
  const readinessHeadline = readinessHeadlineFromSignals({
    readinessScore,
    confidenceLevel,
    decision,
    presentationMode: state.catPresentationMode,
  });

  const blueprintDiagnostics = state.catBlueprintDiagnostics
    ? mergeBlueprintDiagnosticsPostScore(state.catBlueprintDiagnostics, state.results)
    : null;

  const blueprintAdminDiagnostics = blueprintDiagnostics
    ? buildCatBlueprintAdminDiagnostics({
        results: state.results,
        poolMappedFraction: blueprintDiagnostics.poolMappedFraction,
        presentationMode: state.catPresentationMode,
      })
    : null;

  return {
    decision,
    theta: state.theta,
    se: state.se,
    totalQuestions,
    correctCount,
    stoppedReason: reportStoppedReason(state.stoppedReason),
    categoryBreakdown,
    weakAreas,
    suggestedNextSteps,
    readinessScore,
    confidenceLevel,
    confidenceText: confidenceText(confidenceLevel),
    trajectory,
    readinessHeadline,
    blueprintDiagnostics,
    blueprintAdminDiagnostics,
  };
}

export function pushIncident(state: CatAdaptiveState, code: string, detail?: string): CatAdaptiveState {
  return {
    ...state,
    incidents: [...state.incidents, { code, detail, at: new Date().toISOString() }],
  };
}
