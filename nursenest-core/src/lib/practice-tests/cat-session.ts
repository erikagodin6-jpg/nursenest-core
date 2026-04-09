import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  pathwayAllowsCatAdaptiveStart,
  subscriptionCoversPathwayBase,
} from "@/lib/exam-pathways/pathway-entitlements";
import { answerMatches } from "@/lib/exams/score-session-answers";
import {
  appendScoredResult,
  blueprintKeyForPoolRow,
  buildCatReport,
  buildPoolBlueprintDiagnostics,
  clampDifficulty,
  coerceCatBlueprintDiagnostics,
  createInitialAdaptiveState,
  finalizeThetaDecision,
  mergeBlueprintDiagnosticsPostScore,
  parseAdaptiveState,
  pushIncident,
  selectNextQuestion,
  shouldStopAfterAnswer,
  type CatPoolRow,
  type CatSelectOptions,
  validateCatQuestionPool,
  validatePracticeCatPool,
} from "@/lib/exams/cat-engine";
import { catHighYieldPracticeBoost } from "@/lib/exams/cat-adaptive-policy";
import { logCatBlueprintSessionMappingQualityFromReport } from "@/lib/exams/cat-blueprint-mapping-quality";
import {
  examSimulationConfigForPathway,
  logCatBlueprintPoolReady,
  nclexRnSimulationBoundsFromConfig,
  pathwaySupportsCatExamSimulation,
} from "@/lib/exams/cat-exam-simulation";
import type { CatAdaptiveState, CatAnswerResult, CatExamReport, CatPresentationMode } from "@/lib/exams/cat-types";
import {
  blueprintTagSourceForCategoryKey,
  getExamConfig,
  nclexBlueprintWeightMap,
  NCLEX_RN_US_EXAM_CONFIG,
} from "@/lib/exams/exam-config";
import { loadWeakTopicPracticePlan } from "@/lib/learner/topic-performance";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { fetchCatPracticePool } from "@/lib/practice-tests/cat-pool";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { practiceCatBounds } from "@/lib/practice-tests/cat-practice-config";
import { configFromInput, type PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";
import { computePracticeTestResults } from "@/lib/practice-tests/score-practice-test";
import { buildCatStudyFeedback } from "@/lib/practice-tests/build-cat-study-feedback";
import { buildMinimalCatStudyFeedbackPayload } from "@/lib/practice-tests/cat-practice-fallbacks";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { CatStudyFeedbackPayload } from "@/lib/practice-tests/types";
import type {
  CatExamFeedbackMode,
  CatSelectionBasis,
  PracticeTestConfigJson,
  PracticeTestResultsJson,
} from "@/lib/practice-tests/types";

function readinessFromReport(report: CatExamReport, presentationMode?: CatPresentationMode): string {
  const sim = presentationMode === "exam_simulation";
  if (report.stoppedReason === "confidence_pass") {
    return sim
      ? "Exam simulation: pass signal (estimate above threshold with enough precision)."
      : "Pass signal. Estimate stabilized above threshold";
  }
  if (report.stoppedReason === "confidence_fail") {
    return sim
      ? "Exam simulation: remediation signal (estimate below threshold with enough precision)."
      : "Remediation signal. Estimate stabilized below threshold";
  }
  if (report.decision === "pass") return sim ? "Exam simulation: above passing band" : "On track";
  if (report.decision === "fail") return sim ? "Exam simulation: below passing band" : "Needs work";
  return sim ? "Exam simulation: estimate still forming" : "Building confidence";
}

function enrichWithCat(
  base: PracticeTestResultsJson,
  report: CatExamReport,
  presentationMode?: CatPresentationMode,
): PracticeTestResultsJson {
  return {
    ...base,
    catReport: report,
    estimatedAbility: report.theta,
    abilityStdError: report.se,
    readinessLabel: readinessFromReport(report, presentationMode),
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

function mergeBlueprintIntoBoost(boost: CatSelectOptions, blueprintWeights: Record<string, number> | undefined) {
  if (!blueprintWeights || Object.keys(blueprintWeights).length === 0) return boost;
  return { ...boost, blueprintWeights };
}

async function scoreOne(
  q: {
    id: string;
    questionType: string;
    correctAnswer: Prisma.JsonValue;
    difficulty: number | null;
    bodySystem: string | null;
    topic: string | null;
    nclexClientNeedsCategory: string | null;
    nclexClientNeedsSubcategory: string | null;
  },
  userAns: unknown,
): Promise<{ result: CatAnswerResult }> {
  const correct = answerMatches(q.questionType, q.correctAnswer, userAns);
  const row: CatPoolRow = {
    id: q.id,
    difficulty: typeof q.difficulty === "number" ? clampDifficulty(q.difficulty) : 3,
    bodySystem: q.bodySystem,
    topic: q.topic,
    nclexClientNeedsCategory: q.nclexClientNeedsCategory,
    nclexClientNeedsSubcategory: q.nclexClientNeedsSubcategory,
  };
  const categoryKey = blueprintKeyForPoolRow(row);
  return {
    result: {
      questionId: q.id,
      correct,
      categoryKey,
      difficulty: row.difficulty,
      blueprintMappingSource: blueprintTagSourceForCategoryKey(categoryKey),
    },
  };
}

function patchBlueprintSessionDiagnostics(state: CatAdaptiveState): CatAdaptiveState {
  if (!state.catBlueprintDiagnostics) return state;
  return {
    ...state,
    catBlueprintDiagnostics: mergeBlueprintDiagnosticsPostScore(state.catBlueprintDiagnostics, state.results),
  };
}

export async function createCatPracticeTestPayload(
  userId: string,
  entitlement: AccessScope,
  catBasis: CatSelectionBasis,
  input: Omit<PickQuestionsInput, "selectionMode">,
  timedMode: boolean,
  timeLimitSec: number | null,
  presentationMode: CatPresentationMode = "practice",
  /** UI-only: instant rationales vs end-only for practice CAT. Coerced to `test` when `presentationMode` is exam simulation. */
  examFeedbackMode: CatExamFeedbackMode = "test",
): Promise<
  | {
      ok: true;
      questionIds: string[];
      adaptiveState: CatAdaptiveState;
      config: PracticeTestConfigJson;
    }
  | { ok: false; message: string; code?: string }
> {
  const sim = presentationMode === "exam_simulation";
  const requestedPathwayId = input.pathwayId?.trim() || null;
  let pathway: ExamPathwayDefinition | null = null;

  if (requestedPathwayId) {
    const resolved = getExamPathwayById(requestedPathwayId);
    if (!resolved) {
      return {
        ok: false,
        code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found,
        message:
          "Unknown exam pathway. Choose a pathway from the list on the practice test page, or clear the selection if your client sent an invalid id.",
      };
    }
    const covered = subscriptionCoversPathwayBase(entitlement, resolved);
    if (!covered) {
      return {
        ok: false,
        code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled,
        message: sim
          ? "Your subscription does not include the selected exam pathway. Pick a pathway that matches your plan, or choose a different track for exam simulation."
          : "Your subscription does not cover this exam pathway. Choose a track that matches your plan and region (Account → Billing to upgrade), or pick another pathway from the list.",
      };
    }
    if (!pathwayAllowsCatAdaptiveStart(resolved)) {
      return {
        ok: false,
        code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_track_not_ready,
        message:
          "Adaptive (CAT) practice is not available for this track yet. Use pathway lessons and the question bank, join the waitlist from the pathway hub if offered, or switch to an active exam track your plan includes.",
      };
    }
    pathway = resolved;
  }

  if (sim && !pathwaySupportsCatExamSimulation(pathway)) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.exam_sim_unsupported_pathway,
      message:
        "Exam simulation is available for NCLEX-RN and NP pathways. Choose an RN or NP track, or leave the pathway unset for the default NCLEX-RN pool.",
    };
  }

  const effectiveBasis: CatSelectionBasis = sim ? "random" : catBasis;

  const weakPlan = sim
    ? { dbTopicNames: [] as string[], priorityByCanonical: new Map<string, number>() }
    : await loadWeakTopicPracticePlan(userId, entitlement, 14);
  const catWeakCategories = weakPlan.dbTopicNames;
  const catWeakPriorityByCanonical = Object.fromEntries(weakPlan.priorityByCanonical);

  if (!sim && effectiveBasis === "weak" && weakPlan.priorityByCanonical.size === 0) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_weak_areas_empty,
      message:
        "No weak areas yet. Use the question bank, complete a mock, or finish a practice test. Then try weak adaptive mode.",
    };
  }

  const examCfg = examSimulationConfigForPathway(pathway);
  const bounds = sim ? nclexRnSimulationBoundsFromConfig(examCfg) : practiceCatBounds(input.questionCount);

  const poolInput: PickQuestionsInput = {
    ...input,
    questionCount: bounds.max,
    selectionMode: effectiveBasis,
  };

  const pool = await fetchCatPracticePool(userId, entitlement, poolInput);
  const v = sim
    ? validateCatQuestionPool(pool, { minPoolSize: bounds.min })
    : validatePracticeCatPool(pool);
  if (!v.ok) return { ok: false, code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid, message: v.error };

  const blueprintWeights = nclexBlueprintWeightMap(examCfg);
  const diagnostics = buildPoolBlueprintDiagnostics(pool, examCfg.id);
  logCatBlueprintPoolReady({
    presentationMode: presentationMode,
    examConfigId: examCfg.id,
    poolSize: pool.length,
    poolMappedFraction: diagnostics.poolMappedFraction,
    userId,
  });

  const state: CatAdaptiveState = {
    ...createInitialAdaptiveState(),
    catPresentationMode: presentationMode,
    catBlueprintDiagnostics: diagnostics,
  };

  const delivered = new Map<string, number>();
  const practiceBoost = mergeCatBoosts(
    mergeCatBoosts(catBoostFromWeakPriorities(weakPlan.priorityByCanonical), sessionMissBoost(state)),
    catHighYieldPracticeBoost(),
  );
  const selectOpts: CatSelectOptions = sim
    ? { blueprintWeights }
    : mergeBlueprintIntoBoost(practiceBoost, blueprintWeights);

  const first = selectNextQuestion(pool, new Set(), state.targetDifficulty, delivered, selectOpts);
  if (!first.selected) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pick_failed,
      message: "Could not pick a first question. Try broader filters.",
    };
  }

  const catExamFeedbackMode: CatExamFeedbackMode = sim ? "test" : examFeedbackMode;

  const config: PracticeTestConfigJson = {
    ...configFromInput(poolInput, timedMode, timeLimitSec),
    selectionMode: "cat",
    catSelectionBasis: effectiveBasis,
    catMinQuestions: bounds.min,
    catMaxQuestions: bounds.max,
    catWeakCategories,
    catWeakPriorityByCanonical,
    catPresentationMode: presentationMode,
    catExamFeedbackMode,
    catExamConfigId: examCfg.id,
  };

  return {
    ok: true,
    questionIds: [first.selected.id],
    adaptiveState: state,
    config,
  };
}

export type AdvanceCatPracticeTestResult =
  | {
      kind: "completed";
      results: PracticeTestResultsJson;
      adaptiveState: CatAdaptiveState;
      studyFeedback?: CatStudyFeedbackPayload | null;
    }
  | { kind: "continue"; questionIds: string[]; cursorIndex: number; adaptiveState: CatAdaptiveState }
  | { kind: "study_reveal"; studyFeedback: CatStudyFeedbackPayload; adaptiveState: CatAdaptiveState }
  | { kind: "error"; message: string };

async function catPoolAndSelectOpts(
  state: CatAdaptiveState,
  config: PracticeTestConfigJson,
  userId: string,
  entitlement: AccessScope,
): Promise<{
  pool: CatPoolRow[];
  selectOpts: CatSelectOptions;
  bounds: { min: number; max: number };
  presentationMode: CatPresentationMode;
}> {
  const bounds = {
    min: config.catMinQuestions ?? practiceCatBounds(30).min,
    max: config.catMaxQuestions ?? practiceCatBounds(30).max,
  };
  const sim = config.catPresentationMode === "exam_simulation";
  const examCfg = getExamConfig(config.catExamConfigId ?? "") ?? NCLEX_RN_US_EXAM_CONFIG;
  const blueprintWeights = nclexBlueprintWeightMap(examCfg);
  const pri = config.catWeakPriorityByCanonical;
  const hasPriority = !sim && hasUsableCatWeakPriorityMap(pri);
  const priorityMap = hasPriority
    ? new Map<string, number>(
        Object.entries(pri as Record<string, number>).map(([k, v]) => [k, typeof v === "number" ? v : 0]),
      )
    : new Map<string, number>();
  const weakBoost = hasPriority
    ? catBoostFromWeakPriorities(priorityMap)
    : !sim
      ? (() => {
          const weakCats = config.catWeakCategories ?? [];
          const weak = new Set(weakCats.map((s) => s.trim()).filter(Boolean));
          return {
            categoryPriorityBoost: (cat: string, row: CatPoolRow) => {
              const t = row.topic?.trim() ?? "";
              let boost = 0;
              if (weak.has(cat) || (t && weak.has(t))) boost += 6;
              return boost;
            },
          } satisfies CatSelectOptions;
        })()
      : ({} as CatSelectOptions);
  const practiceBoost = mergeCatBoosts(
    mergeCatBoosts(weakBoost, sessionMissBoost(state)),
    sim ? {} : catHighYieldPracticeBoost(),
  );
  const selectOpts: CatSelectOptions = sim
    ? { blueprintWeights }
    : mergeBlueprintIntoBoost(practiceBoost, blueprintWeights);
  const basis = config.catSelectionBasis ?? "random";
  const pickInput: PickQuestionsInput = {
    questionCount: bounds.max,
    topicNames: config.topicNames ?? [],
    difficultyMin: config.difficultyMin ?? null,
    difficultyMax: config.difficultyMax ?? null,
    selectionMode: basis,
    pathwayId: config.pathwayId ?? null,
  };
  const pool = await fetchCatPracticePool(userId, entitlement, pickInput);
  return {
    pool,
    selectOpts,
    bounds,
    presentationMode: config.catPresentationMode ?? "practice",
  };
}

async function catAfterScoredStep(params: {
  ids: string[];
  cursor: number;
  state: CatAdaptiveState;
  mergedAnswers: Record<string, unknown>;
  config: PracticeTestConfigJson;
  userId: string;
  entitlement: AccessScope;
}): Promise<
  | { kind: "completed"; results: PracticeTestResultsJson; adaptiveState: CatAdaptiveState }
  | { kind: "continue"; questionIds: string[]; cursorIndex: number; adaptiveState: CatAdaptiveState }
> {
  const { ids, cursor, state: inputState, mergedAnswers, config, userId, entitlement } = params;
  let state = inputState;
  const { pool, selectOpts, bounds, presentationMode } = await catPoolAndSelectOpts(state, config, userId, entitlement);
  const used = new Set(ids);
  const deliveredCounts = countsFromResults(state.results);

  const stop = shouldStopAfterAnswer(state, state.results.length, bounds);
  if (stop) {
    const earlyDecision =
      stop === "confidence_pass" ? ("pass" as const) : stop === "confidence_fail" ? ("fail" as const) : null;
    state = { ...state, stoppedReason: stop, decision: earlyDecision ?? state.decision };
    const report = buildCatReport(state);
    logCatBlueprintSessionMappingQualityFromReport(report, {
      userId,
      presentationMode,
    });
    const baseResults = await computePracticeTestResults(ids, mergedAnswers, entitlement);
    return { kind: "completed", results: enrichWithCat(baseResults, report, presentationMode), adaptiveState: state };
  }

  const next = selectNextQuestion(pool, used, state.targetDifficulty, deliveredCounts, selectOpts);
  if (!next.selected) {
    state = pushIncident(state, "pool_exhausted", next.detail);
    state = {
      ...state,
      stoppedReason: "pool_exhausted",
      decision: finalizeThetaDecision(state.theta),
    };
    const report = buildCatReport(state);
    logCatBlueprintSessionMappingQualityFromReport(report, {
      userId,
      presentationMode,
    });
    const baseResults = await computePracticeTestResults(ids, mergedAnswers, entitlement);
    return { kind: "completed", results: enrichWithCat(baseResults, report, presentationMode), adaptiveState: state };
  }

  const newIds = [...ids, next.selected.id];
  return {
    kind: "continue",
    questionIds: newIds,
    cursorIndex: cursor + 1,
    adaptiveState: state,
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
}): Promise<AdvanceCatPracticeTestResult> {
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
  const feedbackMode: CatExamFeedbackMode = params.config.catExamFeedbackMode ?? "test";
  const study = feedbackMode === "study";

  if (study && state.catStudyAwaitingContinue === true) {
    const last = state.results[state.results.length - 1];
    if (!last || last.questionId !== currentId) {
      safeServerLog("cat_runner", "cat_resume_state_invalid", {
        event: "cat_resume_state_invalid",
        current_question: currentId.slice(0, 16),
        last_recorded: last?.questionId?.slice(0, 16),
      });
      state = { ...state, catStudyAwaitingContinue: false };
      return catAfterScoredStep({
        ids,
        cursor,
        state,
        mergedAnswers: params.mergedAnswers,
        config: params.config,
        userId: params.userId,
        entitlement: params.entitlement,
      });
    }
  }

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
      nclexClientNeedsCategory: true,
      nclexClientNeedsSubcategory: true,
    },
  });
  if (!q) return { kind: "error", message: "Question not available for your plan." };

  const { result } = await scoreOne(q, userAns);
  state = appendScoredResult(state, result);
  state = patchBlueprintSessionDiagnostics(state);

  const bounds = {
    min: params.config.catMinQuestions ?? practiceCatBounds(30).min,
    max: params.config.catMaxQuestions ?? practiceCatBounds(30).max,
  };
  const stop = shouldStopAfterAnswer(state, state.results.length, bounds);
  if (stop) {
    const tail = await catAfterScoredStep({
      ids,
      cursor,
      state,
      mergedAnswers: params.mergedAnswers,
      config: params.config,
      userId: params.userId,
      entitlement: params.entitlement,
    });
    if (tail.kind === "completed" && study) {
      let studyFeedback = await buildCatStudyFeedback(
        currentId,
        userAns,
        params.entitlement,
        params.config.pathwayId ?? null,
      );
      if (!studyFeedback) {
        safeServerLog("cat_runner", "cat_study_feedback_build_failed", {
          event: "cat_study_feedback_build_failed",
          phase: "final_item",
        });
        studyFeedback = buildMinimalCatStudyFeedbackPayload({
          questionId: currentId,
          isCorrect: result.correct,
          correctKeys: [],
        });
      }
      return { ...tail, studyFeedback };
    }
    return tail;
  }

  if (study) {
    let studyFeedback = await buildCatStudyFeedback(
      currentId,
      userAns,
      params.entitlement,
      params.config.pathwayId ?? null,
    );
    if (!studyFeedback) {
      safeServerLog("cat_runner", "cat_study_feedback_build_failed", {
        event: "cat_study_feedback_build_failed",
        phase: "mid_session",
      });
      studyFeedback = buildMinimalCatStudyFeedbackPayload({
        questionId: currentId,
        isCorrect: result.correct,
        correctKeys: [],
      });
    }
    state = { ...state, catStudyAwaitingContinue: true };
    return { kind: "study_reveal", studyFeedback, adaptiveState: state };
  }

  return catAfterScoredStep({
    ids,
    cursor,
    state,
    mergedAnswers: params.mergedAnswers,
    config: params.config,
    userId: params.userId,
    entitlement: params.entitlement,
  });
}

function seedAdaptiveStateFromPersisted(raw: unknown): Pick<CatAdaptiveState, "catPresentationMode" | "catBlueprintDiagnostics"> {
  const parsed = parseAdaptiveState(raw);
  if (parsed) {
    return {
      catPresentationMode: parsed.catPresentationMode,
      catBlueprintDiagnostics: parsed.catBlueprintDiagnostics,
    };
  }
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    return {
      catPresentationMode: o.catPresentationMode as CatPresentationMode | undefined,
      catBlueprintDiagnostics: coerceCatBlueprintDiagnostics(o.catBlueprintDiagnostics),
    };
  }
  return {};
}

/** Replay all answered items in order and produce CAT summary (e.g. manual submit on adaptive session). */
export async function finalizeCatPracticeTest(
  questionIds: string[],
  answers: Record<string, unknown>,
  entitlement: AccessScope,
  persistedAdaptiveState?: unknown,
): Promise<{ results: PracticeTestResultsJson; adaptiveState: CatAdaptiveState }> {
  const seed = seedAdaptiveStateFromPersisted(persistedAdaptiveState);
  let state: CatAdaptiveState = {
    ...createInitialAdaptiveState(),
    ...seed,
  };
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
        nclexClientNeedsCategory: true,
        nclexClientNeedsSubcategory: true,
      },
    });
    if (!q) continue;
    const { result } = await scoreOne(q, a);
    state = appendScoredResult(state, result);
  }

  state = patchBlueprintSessionDiagnostics(state);

  const report = buildCatReport(state);
  logCatBlueprintSessionMappingQualityFromReport(report, { presentationMode: state.catPresentationMode });
  const baseResults = await computePracticeTestResults(questionIds, answers, entitlement);
  return {
    results: enrichWithCat(baseResults, report, state.catPresentationMode),
    adaptiveState: state,
  };
}
