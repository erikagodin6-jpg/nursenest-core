import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { answerMatches } from "@/lib/exams/score-session-answers";
import {
  appendScoredResult,
  buildCatReport,
  categoryKeyForQuestion,
  clampDifficulty,
  createInitialAdaptiveState,
  finalizeThetaDecision,
  parseAdaptiveState,
  pushIncident,
  selectNextQuestion,
  shouldStopAfterAnswer,
  type CatPoolRow,
  type CatSelectOptions,
  validatePracticeCatPool,
} from "@/lib/exams/cat-engine";
import type { CatAdaptiveState, CatAnswerResult, CatExamReport } from "@/lib/exams/cat-types";
import { loadWeakTopicPracticePlan } from "@/lib/learner/topic-performance";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { fetchCatPracticePool } from "@/lib/practice-tests/cat-pool";
import { practiceCatBounds } from "@/lib/practice-tests/cat-practice-config";
import { configFromInput, type PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";
import { computePracticeTestResults } from "@/lib/practice-tests/score-practice-test";
import type { CatSelectionBasis, PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

function readinessFromReport(report: CatExamReport): string {
  if (report.stoppedReason === "confidence_pass") return "Pass signal. Estimate stabilized above threshold";
  if (report.stoppedReason === "confidence_fail") return "Remediation signal. Estimate stabilized below threshold";
  if (report.decision === "pass") return "On track";
  if (report.decision === "fail") return "Needs work";
  return "Building confidence";
}

function enrichWithCat(base: PracticeTestResultsJson, report: CatExamReport): PracticeTestResultsJson {
  return {
    ...base,
    catReport: report,
    estimatedAbility: report.theta,
    abilityStdError: report.se,
    readinessLabel: readinessFromReport(report),
  };
}

function countsFromResults(results: CatAnswerResult[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of results) {
    m.set(r.categoryKey, (m.get(r.categoryKey) ?? 0) + 1);
  }
  return m;
}

/** Proportional weak boost (0…~9); blueprint balancing still dominates via deficit * 3 in cat-engine. */
const CAT_WEAK_MAX_BOOST = 9;

function catBoostFromWeakPriorities(priorityByCanonical: Map<string, number>): CatSelectOptions {
  return {
    categoryPriorityBoost: (cat: string, row: CatPoolRow) => {
      const t = row.topic?.trim() ?? "";
      const pT = t ? (priorityByCanonical.get(normalizeTopicKey(t)) ?? 0) : 0;
      const pC = priorityByCanonical.get(normalizeTopicKey(cat)) ?? 0;
      const p = Math.max(pT, pC);
      return CAT_WEAK_MAX_BOOST * p;
    },
  };
}

/** Prefer categories missed on this CAT run (without repeating items). */
function sessionMissBoost(state: CatAdaptiveState): CatSelectOptions {
  const missed = new Set<string>();
  for (const r of state.results) {
    if (!r.correct) missed.add(r.categoryKey);
  }
  return {
    categoryPriorityBoost: (cat: string) => (missed.has(cat) ? 5 : 0),
  };
}

function mergeCatBoosts(a: CatSelectOptions, b: CatSelectOptions): CatSelectOptions {
  return {
    categoryPriorityBoost: (cat: string, row: CatPoolRow) =>
      (a.categoryPriorityBoost?.(cat, row) ?? 0) + (b.categoryPriorityBoost?.(cat, row) ?? 0),
  };
}

export function hasUsableCatWeakPriorityMap(
  pri: PracticeTestConfigJson["catWeakPriorityByCanonical"] | undefined,
): pri is Record<string, number> {
  if (!pri || typeof pri !== "object") return false;
  const entries = Object.entries(pri as Record<string, unknown>);
  if (entries.length === 0) return false;
  return entries.some(([, v]) => typeof v === "number" && Number.isFinite(v) && v > 0);
}

async function scoreOne(
  q: {
    id: string;
    questionType: string;
    correctAnswer: Prisma.JsonValue;
    difficulty: number | null;
    bodySystem: string | null;
    topic: string | null;
  },
  userAns: unknown,
): Promise<{ result: CatAnswerResult }> {
  const correct = answerMatches(q.questionType, q.correctAnswer, userAns);
  const row: CatPoolRow = {
    id: q.id,
    difficulty: typeof q.difficulty === "number" ? clampDifficulty(q.difficulty) : 3,
    bodySystem: q.bodySystem,
    topic: q.topic,
  };
  const categoryKey = categoryKeyForQuestion(row);
  return {
    result: {
      questionId: q.id,
      correct,
      categoryKey,
      difficulty: row.difficulty,
    },
  };
}

export async function createCatPracticeTestPayload(
  userId: string,
  entitlement: AccessScope,
  catBasis: CatSelectionBasis,
  input: Omit<PickQuestionsInput, "selectionMode">,
  timedMode: boolean,
  timeLimitSec: number | null,
): Promise<
  | {
      ok: true;
      questionIds: string[];
      adaptiveState: CatAdaptiveState;
      config: PracticeTestConfigJson;
    }
  | { ok: false; message: string }
> {
  const weakPlan = await loadWeakTopicPracticePlan(userId, entitlement, 14);
  const catWeakCategories = weakPlan.dbTopicNames;
  const catWeakPriorityByCanonical = Object.fromEntries(weakPlan.priorityByCanonical);

  if (catBasis === "weak" && weakPlan.priorityByCanonical.size === 0) {
    return {
      ok: false,
      message:
        "No weak areas yet. Use the question bank, complete a mock, or finish a practice test. Then try weak adaptive mode.",
    };
  }

  const poolInput: PickQuestionsInput = {
    ...input,
    selectionMode: catBasis,
  };

  const pool = await fetchCatPracticePool(userId, entitlement, poolInput);
  const v = validatePracticeCatPool(pool);
  if (!v.ok) return { ok: false, message: v.error };

  const bounds = practiceCatBounds(input.questionCount);
  const state = createInitialAdaptiveState();
  const delivered = new Map<string, number>();
  const boost = mergeCatBoosts(catBoostFromWeakPriorities(weakPlan.priorityByCanonical), sessionMissBoost(state));

  const first = selectNextQuestion(pool, new Set(), state.targetDifficulty, delivered, boost);
  if (!first.selected) {
    return { ok: false, message: "Could not pick a first question. Try broader filters." };
  }

  const config: PracticeTestConfigJson = {
    ...configFromInput(poolInput, timedMode, timeLimitSec),
    selectionMode: "cat",
    catSelectionBasis: catBasis,
    catMinQuestions: bounds.min,
    catMaxQuestions: bounds.max,
    catWeakCategories,
    catWeakPriorityByCanonical,
  };

  return {
    ok: true,
    questionIds: [first.selected.id],
    adaptiveState: state,
    config,
  };
}

export async function advanceCatPracticeTest(params: {
  questionIds: string[];
  adaptiveState: unknown;
  mergedAnswers: Record<string, unknown>;
  cursorIndex: number;
  config: PracticeTestConfigJson;
  userId: string;
  entitlement: AccessScope;
}): Promise<
  | { kind: "completed"; results: PracticeTestResultsJson; adaptiveState: CatAdaptiveState }
  | { kind: "continue"; questionIds: string[]; cursorIndex: number; adaptiveState: CatAdaptiveState }
  | { kind: "error"; message: string }
> {
  const ids = params.questionIds;
  const cursor = params.cursorIndex;
  if (ids.length === 0) return { kind: "error", message: "No questions in session." };
  if (cursor !== ids.length - 1) {
    return { kind: "error", message: "Adaptive advance is only valid on the latest question." };
  }

  const currentId = ids[cursor];
  if (currentId == null) return { kind: "error", message: "Invalid cursor." };
  const userAns = params.mergedAnswers[currentId];
  if (userAns === undefined) return { kind: "error", message: "Answer the current question before continuing." };

  let state = parseAdaptiveState(params.adaptiveState) ?? createInitialAdaptiveState();
  if (state.results.some((r) => r.questionId === currentId)) {
    return { kind: "error", message: "This step was already recorded. Refresh if the UI looks stale." };
  }

  const base = questionAccessWhere(params.entitlement);
  const q = await prisma.examQuestion.findFirst({
    where: { AND: [{ id: currentId }, base] },
    select: {
      id: true,
      questionType: true,
      correctAnswer: true,
      difficulty: true,
      bodySystem: true,
      topic: true,
    },
  });
  if (!q) return { kind: "error", message: "Question not available for your plan." };

  const { result } = await scoreOne(q, userAns);
  state = appendScoredResult(state, result);

  const bounds = {
    min: params.config.catMinQuestions ?? practiceCatBounds(30).min,
    max: params.config.catMaxQuestions ?? practiceCatBounds(30).max,
  };

  const pri = params.config.catWeakPriorityByCanonical;
  const hasPriority = hasUsableCatWeakPriorityMap(pri);
  const priorityMap = hasPriority
    ? new Map<string, number>(
        Object.entries(pri as Record<string, number>).map(([k, v]) => [k, typeof v === "number" ? v : 0]),
      )
    : new Map<string, number>();
  const weakBoost = hasPriority
    ? catBoostFromWeakPriorities(priorityMap)
    : (() => {
        const weakCats = params.config.catWeakCategories ?? [];
        const weak = new Set(weakCats.map((s) => s.trim()).filter(Boolean));
        return {
          categoryPriorityBoost: (cat: string, row: CatPoolRow) => {
            const t = row.topic?.trim() ?? "";
            let boost = 0;
            if (weak.has(cat) || (t && weak.has(t))) boost += 6;
            return boost;
          },
        } satisfies CatSelectOptions;
      })();
  const boost = mergeCatBoosts(weakBoost, sessionMissBoost(state));

  const basis = params.config.catSelectionBasis ?? "random";
  const pickInput: PickQuestionsInput = {
    questionCount: bounds.max,
    topicNames: params.config.topicNames ?? [],
    difficultyMin: params.config.difficultyMin ?? null,
    difficultyMax: params.config.difficultyMax ?? null,
    selectionMode: basis,
    pathwayId: params.config.pathwayId ?? null,
  };

  const pool = await fetchCatPracticePool(params.userId, params.entitlement, pickInput);
  const used = new Set(ids);
  const deliveredCounts = countsFromResults(state.results);

  const stop = shouldStopAfterAnswer(state, state.results.length, bounds);
  if (stop) {
    const earlyDecision =
      stop === "confidence_pass" ? ("pass" as const) : stop === "confidence_fail" ? ("fail" as const) : null;
    state = { ...state, stoppedReason: stop, decision: earlyDecision ?? state.decision };
    const report = buildCatReport(state);
    const baseResults = await computePracticeTestResults(ids, params.mergedAnswers, params.entitlement);
    return { kind: "completed", results: enrichWithCat(baseResults, report), adaptiveState: state };
  }

  const next = selectNextQuestion(pool, used, state.targetDifficulty, deliveredCounts, boost);
  if (!next.selected) {
    state = pushIncident(state, "pool_exhausted", next.detail);
    state = {
      ...state,
      stoppedReason: "pool_exhausted",
      decision: finalizeThetaDecision(state.theta),
    };
    const report = buildCatReport(state);
    const baseResults = await computePracticeTestResults(ids, params.mergedAnswers, params.entitlement);
    return { kind: "completed", results: enrichWithCat(baseResults, report), adaptiveState: state };
  }

  const newIds = [...ids, next.selected.id];
  return {
    kind: "continue",
    questionIds: newIds,
    cursorIndex: cursor + 1,
    adaptiveState: state,
  };
}

/** Replay all answered items in order and produce CAT summary (e.g. manual submit on adaptive session). */
export async function finalizeCatPracticeTest(
  questionIds: string[],
  answers: Record<string, unknown>,
  entitlement: AccessScope,
): Promise<{ results: PracticeTestResultsJson; adaptiveState: CatAdaptiveState }> {
  let state = createInitialAdaptiveState();
  const base = questionAccessWhere(entitlement);

  for (const qid of questionIds) {
    const a = answers[qid];
    if (a === undefined) continue;
    const q = await prisma.examQuestion.findFirst({
      where: { AND: [{ id: qid }, base] },
      select: {
        id: true,
        questionType: true,
        correctAnswer: true,
        difficulty: true,
        bodySystem: true,
        topic: true,
      },
    });
    if (!q) continue;
    const { result } = await scoreOne(q, a);
    state = appendScoredResult(state, result);
  }

  const report = buildCatReport(state);
  const baseResults = await computePracticeTestResults(questionIds, answers, entitlement);
  return { results: enrichWithCat(baseResults, report), adaptiveState: state };
}
