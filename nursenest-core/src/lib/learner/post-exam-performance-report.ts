import type { CatExamReport } from "@/lib/exams/cat-types";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import { isLoftSimulationPolicy } from "@/lib/practice-tests/loft-simulation-policy";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { remediationLessonsTopicHref, remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  CNPLE_PATHWAY_ID,
  getCoachingPolicyForPathway,
  getCoachingPolicyForTestingModel,
  getTestingModelDefinition,
  getTestingModelForPathwayId,
  validateCoachingCopyForPathway,
} from "@/lib/testing/testing-model";
import type { CaseSessionScore } from "@/lib/cases/longitudinal-case-types";
import type { PostExamCoachingReport } from "@/lib/learner/post-exam-coaching/types";

export type ReadinessBand = "not_ready" | "building" | "approaching" | "exam_ready";

export function getReadinessBandFromScore(score: number): ReadinessBand {
  if (score >= 75) return "exam_ready";
  if (score >= 60) return "approaching";
  if (score >= 40) return "building";
  return "not_ready";
}

export type PostExamSessionKind =
  | "cat"
  | "practice_exam"
  | "loft_simulation"
  | "readiness_assessment"
  | "timed_assessment";

export type PostExamCompetencyRow = {
  label: string;
  correct: number;
  total: number;
  accuracyPct: number;
  strength: "strong" | "weak" | "mixed";
};

export type PostExamCompetencyGroup = {
  title: string;
  rows: PostExamCompetencyRow[];
};

export type PostExamRecommendation = {
  priority: number;
  title: string;
  reason: string;
  href: string;
  kind: "lesson" | "flashcards" | "drill" | "practice" | "simulation" | "review" | "cat";
};

export type PostExamClinicalJudgmentInsight = {
  domain: string;
  pattern: string;
  guidance: string;
  emphasis: "strength" | "focus";
};

export type PostExamTimingInsight = {
  elapsedLabel: string;
  avgSecPerQuestion: number | null;
  pacingLabel: string;
  pacingDetail: string;
  recommendations: string[];
};

export type PostExamPerformanceReport = {
  sessionKind: PostExamSessionKind;
  examModeLabel: string;
  headline: string;
  narrative: string;
  readinessBand: ReadinessBand;
  overall: {
    scorePct: number;
    readinessLevel: string;
    readinessResult: string | null;
    passOutlookPct: number | null;
    passOutlookBand: string | null;
    confidenceLabel: string;
    trendLabel: string | null;
    correctCount: number;
    totalCount: number;
  };
  timing: PostExamTimingInsight;
  recommendations: PostExamRecommendation[];
  competencyGroups: PostExamCompetencyGroup[];
  clinicalJudgment: PostExamClinicalJudgmentInsight[];
  strengths: string[];
  strengthTopics: PostExamCompetencyRow[];
  weakTopics: PostExamCompetencyRow[];
  /** Present when built via {@link buildEnrichedPostExamPerformanceReport}. */
  coaching?: PostExamCoachingReport;
};

export type PostExamQuestionOutcome = {
  questionId: string;
  isCorrect: boolean;
  questionType?: string | null;
  topic?: string | null;
  tags?: string[] | null;
};

export type BuildPostExamPerformanceReportInput = {
  results: PracticeTestResultsJson;
  config: PracticeTestConfigJson | null;
  pathwayId?: string | null;
  elapsedMs?: number | null;
  timedMode?: boolean;
  timeLimitSec?: number | null;
  questionOutcomes?: PostExamQuestionOutcome[];
  confidenceByQuestionId?: Record<string, "low" | "medium" | "high">;
};

function formatElapsed(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "Not recorded";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function rowStrength(correct: number, total: number): PostExamCompetencyRow["strength"] {
  if (total <= 0) return "mixed";
  const pct = correct / total;
  if (pct >= 0.75 && total >= 2) return "strong";
  if (pct < 0.55) return "weak";
  return "mixed";
}

function rowsFromCounts(
  counts: Map<string, { correct: number; total: number }>,
  maxRows = 6,
): PostExamCompetencyRow[] {
  return [...counts.entries()]
    .filter(([, v]) => v.total > 0)
    .map(([label, v]) => {
      const accuracyPct = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
      return {
        label,
        correct: v.correct,
        total: v.total,
        accuracyPct,
        strength: rowStrength(v.correct, v.total),
      };
    })
    .sort((a, b) => a.accuracyPct - b.accuracyPct || b.total - a.total)
    .slice(0, maxRows);
}

function humanizeQuestionType(raw: string): string {
  const u = raw.trim().toUpperCase();
  if (u === "SATA" || u.includes("SELECT_ALL")) return "Select-all-that-apply";
  if (u === "MCQ" || u === "MULTIPLE_CHOICE") return "Multiple choice";
  if (u.includes("BOWTIE")) return "Bowtie / NGN";
  if (u.includes("DRAG")) return "Drag-and-drop";
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function resolvePostExamSessionKind(
  config: PracticeTestConfigJson | null,
  pathwayId?: string | null,
): PostExamSessionKind {
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : null;
  if (
    isLoftSimulationPolicy({
      examCode: pathway?.examCode ?? null,
      pathwaySlug: pathway?.id ?? pathwayId ?? null,
      deliveryMode: config?.linearDeliveryMode === "exam" ? "linear_exam" : null,
      simulationKind: config?.catEngineMode === "simulation" ? "loft" : null,
    })
  ) {
    return "loft_simulation";
  }
  if (config?.selectionMode === "cat") {
    if (config.catPresentationMode === "exam_simulation") return "cat";
    if (config.catAdaptiveSessionType === "practice") return "readiness_assessment";
    return "cat";
  }
  if (config?.timedMode || config?.linearDeliveryMode === "exam") {
    return config.timedMode ? "timed_assessment" : "practice_exam";
  }
  if (config?.selectionMode === "weak" || config?.catSelectionBasis === "weak") {
    return "readiness_assessment";
  }
  return "practice_exam";
}

function examModeLabel(
  kind: PostExamSessionKind,
  config: PracticeTestConfigJson | null,
  pathwayId?: string | null,
): string {
  if (kind === "loft_simulation") {
    return getTestingModelDefinition("LOFT").learnerFacingName;
  }
  const model =
    kind === "cat" || (kind === "readiness_assessment" && config?.selectionMode === "cat")
      ? "CAT"
      : getTestingModelForPathwayId(pathwayId ?? config?.pathwayId ?? null);
  if (kind === "cat") {
    return config?.catPresentationMode === "exam_simulation"
      ? `${getTestingModelDefinition("CAT").learnerFacingName} exam`
      : getTestingModelDefinition("CAT").learnerFacingName;
  }
  switch (kind) {
    case "readiness_assessment":
      return config?.selectionMode === "cat"
        ? "Guided adaptive readiness"
        : "Readiness assessment";
    case "timed_assessment":
      return "Timed assessment";
    case "practice_exam":
    default:
      return config?.linearDeliveryMode === "exam"
        ? getTestingModelDefinition(model).learnerFacingName
        : "Practice session";
  }
}

function trendLabelFromResults(
  results: PracticeTestResultsJson,
  sessionKind: PostExamSessionKind,
): string | null {
  if (sessionKind === "loft_simulation") {
    return "Competency pattern across this simulation";
  }
  const traj = results.catReport?.trajectory ?? results.catCoach?.stabilityTrendLabel;
  if (!traj || traj === "insufficient") return null;
  if (traj === "improving") return "Improving within this session";
  if (traj === "slipping" || traj === "cooling") return "Accuracy softened toward the end";
  return "Steady across this session";
}

function buildTimingInsight(args: {
  elapsedMs?: number | null;
  totalQuestions: number;
  timedMode?: boolean;
  timeLimitSec?: number | null;
  confidenceByQuestionId?: Record<string, "low" | "medium" | "high">;
  outcomes: PostExamQuestionOutcome[];
}): PostExamTimingInsight {
  const { elapsedMs, totalQuestions, timedMode, timeLimitSec, confidenceByQuestionId, outcomes } = args;
  const elapsedLabel = formatElapsed(elapsedMs);
  const avgSecPerQuestion =
    elapsedMs != null && totalQuestions > 0 && Number.isFinite(elapsedMs)
      ? Math.round(elapsedMs / 1000 / totalQuestions)
      : null;

  const recommendations: string[] = [];
  let pacingLabel = "Balanced pacing";
  let pacingDetail = "Your time use looked even across the session.";

  if (avgSecPerQuestion != null) {
    if (avgSecPerQuestion < 45) {
      pacingLabel = "Fast pacing";
      pacingDetail =
        "You moved quickly per item. If accuracy dipped, add timed drills that force a brief safety check before submit.";
      recommendations.push("Try a 15-question timed set with a 75-second-per-item cap to practice deliberate pacing.");
    } else if (avgSecPerQuestion > 150) {
      pacingLabel = "Deliberate pacing";
      pacingDetail =
        "You invested more time per item. That can help complex cases, but watch for late-session fatigue on full-length runs.";
      recommendations.push("Run a half-length timed mock to build endurance without rushing early items.");
    }
  }

  if (timedMode && timeLimitSec != null && elapsedMs != null) {
    const usedRatio = elapsedMs / 1000 / timeLimitSec;
    if (usedRatio >= 0.92) {
      pacingLabel = "Time limit pressure";
      pacingDetail = "You used most of the allotted time — prioritize decision rules that unblock faster on familiar stems.";
      recommendations.push("Review flagged items first on the next run so uncertain questions do not consume the clock.");
    } else if (usedRatio <= 0.55 && totalQuestions >= 20) {
      recommendations.push("You finished with time remaining — consider a full-length simulation to stress-test end-of-exam focus.");
    }
  }

  let overconfident = 0;
  let hesitantCorrect = 0;
  let rated = 0;
  for (const o of outcomes) {
    const c = confidenceByQuestionId?.[o.questionId];
    if (!c) continue;
    rated += 1;
    if (c === "high" && !o.isCorrect) overconfident += 1;
    if ((c === "low" || c === "medium") && o.isCorrect) hesitantCorrect += 1;
  }
  if (rated >= 4 && overconfident / rated >= 0.2) {
    recommendations.push(
      "Several high-confidence misses appeared — slow down on SATA and prioritization stems before locking your answer.",
    );
  }
  if (rated >= 4 && hesitantCorrect / rated >= 0.25) {
    recommendations.push(
      "You answered correctly while unsure — that knowledge is fragile. Reinforce with flashcards, then repeat under time pressure.",
    );
  }

  return {
    elapsedLabel,
    avgSecPerQuestion,
    pacingLabel,
    pacingDetail,
    recommendations: [...new Set(recommendations)].slice(0, 3),
  };
}

function clinicalJudgmentFromCoach(
  coach: CatResultsCoachSnapshot | null | undefined,
  report: CatExamReport | null | undefined,
): PostExamClinicalJudgmentInsight[] {
  const insights: PostExamClinicalJudgmentInsight[] = [];

  for (const p of coach?.errorPatterns ?? []) {
    insights.push({
      domain: "Clinical judgment",
      pattern: p.title,
      guidance: p.detail,
      emphasis: "focus",
    });
  }

  for (const s of coach?.strongestDomains?.slice(0, 2) ?? []) {
    if (!s?.trim() || s === "—") continue;
    insights.push({
      domain: "Strength",
      pattern: s,
      guidance: `You showed stable performance in ${s}. Use this as momentum while you shore up weaker domains.`,
      emphasis: "strength",
    });
  }

  const breakdown = report?.categoryBreakdown ?? [];
  const weakPrio = breakdown.filter((c) => c.strength === "weak").slice(0, 2);
  for (const w of weakPrio) {
    if (insights.some((i) => i.pattern === w.category)) continue;
    insights.push({
      domain: "Client needs / blueprint",
      pattern: w.category,
      guidance: `Missed ${w.total - w.correct} of ${w.total} items in this area — review decision frameworks, not isolated facts.`,
      emphasis: "focus",
    });
  }

  return insights.slice(0, 5);
}

function flashcardsHref(pathwayId: string | null, topic: string): string {
  const q = new URLSearchParams();
  if (pathwayId) q.set("pathwayId", pathwayId);
  if (topic.trim()) q.set("q", topic.trim());
  const qs = q.toString();
  return qs ? `/app/flashcards?${qs}` : "/app/flashcards";
}

function buildRecommendations(args: {
  results: PracticeTestResultsJson;
  pathwayId: string | null;
  weakTopics: string[];
  sessionKind: PostExamSessionKind;
}): PostExamRecommendation[] {
  const { results, pathwayId, weakTopics, sessionKind } = args;
  const coach = results.catCoach;
  const out: PostExamRecommendation[] = [];
  let priority = 1;

  for (const topic of coach?.studyNext ?? []) {
    const link = topic.links.find((l) => l.kind === "drill") ?? topic.links[0];
    if (!link?.href) continue;
    out.push({
      priority: priority++,
      title: topic.title,
      reason: topic.reason,
      href: link.href,
      kind: link.kind === "lesson" ? "lesson" : link.kind === "flashcards" ? "flashcards" : "drill",
    });
    if (out.length >= 3) break;
  }

  const topWeak = weakTopics[0];
  if (topWeak && out.length < 4) {
    out.push({
      priority: priority++,
      title: `Drill ${topWeak}`,
      reason: `Your lowest-accuracy domain this session was ${topWeak}. Targeted questions rebuild judgment faster than broad review.`,
      href: remediationTopicDrillHref(topWeak, pathwayId),
      kind: "drill",
    });
  }

  if (topWeak && out.length < 5) {
    out.push({
      priority: priority++,
      title: `Lesson review: ${topWeak}`,
      reason: "Consolidate the underlying clinical story before your next timed run.",
      href: remediationLessonsTopicHref(topWeak, null, pathwayId),
      kind: "lesson",
    });
  }

  if (out.length < 5 && topWeak) {
    out.push({
      priority: priority++,
      title: "Flashcard reinforcement",
      reason: `Strengthen recall for ${topWeak} with spaced repetition before you re-test.`,
      href: flashcardsHref(pathwayId, topWeak),
      kind: "flashcards",
    });
  }

  const coaching = getCoachingPolicyForPathway(pathwayId);
  if (
    out.length < 5 &&
    sessionKind === "loft_simulation" &&
    coaching.followUpSimulationTitle
  ) {
    out.push({
      priority: priority++,
      title: coaching.followUpSimulationTitle,
      reason: coaching.followUpSimulationReason,
      href: "/app/cases/cnple",
      kind: "simulation",
    });
  }

  if (
    out.length < 5 &&
    (sessionKind === "cat" || sessionKind === "readiness_assessment") &&
    coaching.followUpAdaptiveSessionTitle &&
    coaching.emphasizeAdaptiveProgression
  ) {
    out.push({
      priority: priority++,
      title: coaching.followUpAdaptiveSessionTitle,
      reason: coaching.followUpAdaptiveSessionReason ?? coaching.followUpSimulationReason,
      href: pathwayId ? `/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(pathwayId)}` : "/app/practice-tests",
      kind: "cat",
    });
  }

  const seenHref = new Set<string>();
  return out.filter((r) => {
    if (seenHref.has(r.href)) return false;
    seenHref.add(r.href);
    return true;
  }).slice(0, 5);
}

function aggregateOutcomes(outcomes: PostExamQuestionOutcome[]): {
  byTopic: Map<string, { correct: number; total: number }>;
  byQuestionType: Map<string, { correct: number; total: number }>;
} {
  const byTopic = new Map<string, { correct: number; total: number }>();
  const byQuestionType = new Map<string, { correct: number; total: number }>();

  for (const o of outcomes) {
    const topicLabel = (o.topic?.trim() || "General").slice(0, 120);
    const t = byTopic.get(topicLabel) ?? { correct: 0, total: 0 };
    t.total += 1;
    if (o.isCorrect) t.correct += 1;
    byTopic.set(topicLabel, t);

    const qt = humanizeQuestionType(o.questionType?.trim() || "Multiple choice");
    const q = byQuestionType.get(qt) ?? { correct: 0, total: 0 };
    q.total += 1;
    if (o.isCorrect) q.correct += 1;
    byQuestionType.set(qt, q);
  }

  return { byTopic, byQuestionType };
}

function competencyGroupsFromResults(
  results: PracticeTestResultsJson,
  outcomes: PostExamQuestionOutcome[],
): PostExamCompetencyGroup[] {
  const groups: PostExamCompetencyGroup[] = [];
  const breakdown = results.catReport?.categoryBreakdown;

  if (breakdown?.length) {
    groups.push({
      title: "Clinical domains",
      rows: breakdown
        .map((c) => ({
          label: c.category,
          correct: c.correct,
          total: c.total,
          accuracyPct: c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0,
          strength: c.strength,
        }))
        .sort((a, b) => a.accuracyPct - b.accuracyPct)
        .slice(0, 6),
    });
  } else if (Object.keys(results.byTopic).length > 0) {
    groups.push({
      title: "Topics",
      rows: rowsFromCounts(
        new Map(
          Object.entries(results.byTopic).map(([k, v]) => [k, { correct: v.correct, total: v.total }]),
        ),
      ),
    });
  }

  if (outcomes.length > 0) {
    const { byQuestionType } = aggregateOutcomes(outcomes);
    const qtRows = rowsFromCounts(byQuestionType, 5);
    if (qtRows.length > 0) {
      groups.push({ title: "Question formats", rows: qtRows });
    }
  }

  return groups;
}

export function buildPostExamPerformanceReport(
  input: BuildPostExamPerformanceReportInput,
): PostExamPerformanceReport {
  const {
    results,
    config,
    pathwayId = config?.pathwayId ?? null,
    elapsedMs,
    timedMode = config?.timedMode ?? false,
    timeLimitSec = config?.timeLimitSec ?? null,
    questionOutcomes = [],
    confidenceByQuestionId,
  } = input;

  const sessionKind = resolvePostExamSessionKind(config, pathwayId);
  const coaching = getCoachingPolicyForPathway(pathwayId);
  const catReport = sessionKind === "loft_simulation" ? null : results.catReport;
  const coach = sessionKind === "loft_simulation" ? null : results.catCoach;

  const scorePct =
    catReport?.readinessScore != null
      ? Math.round(catReport.readinessScore)
      : results.accuracyPct;
  const readinessBand = getReadinessBandFromScore(scorePct);
  const readinessLevel = catReport?.readinessLevel ?? results.readinessLevel ?? "Borderline";
  const readinessResult = results.readinessResult ?? catReport?.result ?? null;

  const headline =
    sessionKind === "loft_simulation"
      ? coaching.readinessHeadlineTemplate(scorePct, readinessLevel)
      : coach?.readinessHeadline?.trim() ||
        catReport?.readinessHeadline?.trim() ||
        coaching.readinessHeadlineTemplate(scorePct, readinessLevel);
  const narrative =
    sessionKind === "loft_simulation"
      ? "Review competency balance and domain gaps below before your next licensing-style simulation."
      : coach?.readinessNarrative?.trim() ||
        catReport?.confidenceText?.trim() ||
        "Use the breakdown below to see what to reinforce before your next study block.";

  const outcomes =
    questionOutcomes.length > 0
      ? questionOutcomes
      : (results.incorrectQuestionIds ?? []).map((id) => ({
          questionId: id,
          isCorrect: false,
          topic: null,
          questionType: null,
        }));

  const { byTopic: aggTopic } =
    outcomes.length > 0
      ? aggregateOutcomes(outcomes)
      : {
          byTopic: new Map(
            Object.entries(results.byTopic).map(([k, v]) => [k, { correct: v.correct, total: v.total }]),
          ),
        };

  const weakTopics = rowsFromCounts(aggTopic, 5).filter((r) => r.strength === "weak");
  const strengthTopics = rowsFromCounts(aggTopic, 5)
    .filter((r) => r.strength === "strong")
    .sort((a, b) => b.accuracyPct - a.accuracyPct);

  const strengths =
    coach?.strongestDomains?.filter((s) => s?.trim() && s !== "—").slice(0, 4) ??
    strengthTopics.map((t) => t.label).slice(0, 4);

  const timing = buildTimingInsight({
    elapsedMs,
    totalQuestions: results.scoreTotal,
    timedMode,
    timeLimitSec,
    confidenceByQuestionId,
    outcomes,
  });

  return reportPayload({
    sessionKind,
    examModeLabel: examModeLabel(sessionKind, config, pathwayId),
    headline,
    narrative,
    readinessBand,
    overall: {
      scorePct,
      readinessLevel,
      readinessResult: sessionKind === "loft_simulation" ? null : readinessResult,
      passOutlookBand: sessionKind === "loft_simulation" ? null : results.passProbabilityBand ?? null,
      confidenceLabel:
        sessionKind === "loft_simulation"
          ? "Session balance"
          : results.catReport?.confidenceLevelLabel ??
            results.confidenceLevel ??
            coach?.confidenceLevel ??
            "Moderate",
      trendLabel: trendLabelFromResults(results, sessionKind),
      passOutlookPct:
        sessionKind === "loft_simulation" || coach?.passOutlookOmitted
          ? null
          : coach?.passOutlookPercent ?? results.passProbability ?? null,
      correctCount: results.scoreCorrect,
      totalCount: results.scoreTotal,
    },
    timing,
    recommendations: buildRecommendations({
      results,
      pathwayId,
      weakTopics: weakTopics.map((t) => t.label),
      sessionKind,
    }),
    competencyGroups: competencyGroupsFromResults(results, outcomes),
    clinicalJudgment: sessionKind === "loft_simulation" ? [] : clinicalJudgmentFromCoach(coach, catReport),
    strengths,
    strengthTopics,
    weakTopics,
  });
}

function reportPayload(partial: PostExamPerformanceReport): PostExamPerformanceReport {
  return partial;
}

/** LOFT / longitudinal case sessions (CNPLE simulation & practice). */
export function buildPostExamPerformanceReportFromCase(args: {
  score: CaseSessionScore;
  caseTitle: string;
  mode: "PRACTICE" | "SIMULATION";
  elapsedMs?: number | null;
}): PostExamPerformanceReport {
  const { score, caseTitle, mode, elapsedMs } = args;
  const sessionKind: PostExamSessionKind = mode === "SIMULATION" ? "loft_simulation" : "readiness_assessment";
  const coaching = getCoachingPolicyForTestingModel("LOFT");
  const scorePct = score.score0to100;
  const readinessBand = getReadinessBandFromScore(scorePct);
  const readinessLevel =
    scorePct >= 75 ? "Likely Pass" : scorePct >= 55 ? "Borderline" : "At Risk";

  const domainRows: PostExamCompetencyRow[] = [
    ...score.weakDomains.map((d) => ({
      label: d.replace(/-/g, " "),
      correct: 0,
      total: 1,
      accuracyPct: 0,
      strength: "weak" as const,
    })),
    ...score.strongDomains.map((d) => ({
      label: d.replace(/-/g, " "),
      correct: 1,
      total: 1,
      accuracyPct: 100,
      strength: "strong" as const,
    })),
  ];

  const recommendations: PostExamRecommendation[] = score.recommendations.slice(0, 5).map((text, i) => ({
    priority: i + 1,
    title: text.slice(0, 72),
    reason: text,
    href:
      score.weakDomains[0] != null
        ? `/canada/np/cnple/flashcards?domain=${encodeURIComponent(score.weakDomains[0])}`
        : "/app/cases/cnple",
    kind: i === 0 ? "flashcards" : "simulation",
  }));

  const trajEntries = Object.entries(score.trajectoryProfile).filter(([, n]) => n > 0);
  const clinicalJudgment: PostExamClinicalJudgmentInsight[] = trajEntries.map(([trajectory, count]) => ({
    domain: "Decision trajectory",
    pattern: trajectory.replace(/_/g, " "),
    guidance:
      trajectory === "harmful" || trajectory === "suboptimal"
        ? `${count} step(s) followed a ${trajectory} path — rehearse the guideline-linked decision rule for similar presentations.`
        : `${count} step(s) were ${trajectory} — keep linking assessments to the safest next action.`,
    emphasis: trajectory === "optimal" || trajectory === "acceptable" ? "strength" : "focus",
  }));

  const headline = coaching.readinessHeadlineTemplate(scorePct, caseTitle);
  const narrative =
    score.weakDomains.length > 0
      ? coaching.readinessNarrativeWeak(score.weakDomains)
      : coaching.readinessNarrativeStrong;
  validateCoachingCopyForPathway(CNPLE_PATHWAY_ID, `${headline} ${narrative}`);

  return reportPayload({
    sessionKind,
    examModeLabel:
      mode === "SIMULATION"
        ? getTestingModelDefinition("LOFT").learnerFacingName
        : "Case practice",
    headline,
    narrative,
    readinessBand,
    overall: {
      scorePct,
      readinessLevel,
      readinessResult: null,
      passOutlookPct: null,
      passOutlookBand: null,
      confidenceLabel: "Moderate",
      trendLabel: null,
      correctCount: score.correctCount,
      totalCount: score.totalSteps,
    },
    timing: buildTimingInsight({
      elapsedMs,
      totalQuestions: score.totalSteps,
      timedMode: mode === "SIMULATION",
      outcomes: [],
    }),
    recommendations,
    competencyGroups: domainRows.length
      ? [{ title: "CNPLE domains", rows: domainRows }]
      : [],
    clinicalJudgment: clinicalJudgment.slice(0, 5),
    strengths: score.strongDomains.map((d) => d.replace(/-/g, " ")),
    strengthTopics: domainRows.filter((r) => r.strength === "strong"),
    weakTopics: domainRows.filter((r) => r.strength === "weak"),
  });
}
