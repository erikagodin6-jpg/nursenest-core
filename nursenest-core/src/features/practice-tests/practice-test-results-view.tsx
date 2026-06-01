"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { CatStudyFeedbackPanel } from "@/components/student/cat-study-feedback-panel";
import { StudyNotesPanel } from "@/components/student/study-notes-panel";
import { ConfidenceAnalyticsBlock } from "@/components/study/confidence-analytics";
import type { SmartReviewItem } from "@/components/study/smart-review-screen";
import type { ConfidenceLevel } from "@/components/study/confidence-selector";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import type {
  CatStudyFeedbackPayload,
  PracticeTestConfigJson,
  PracticeTestResultsJson,
} from "@/lib/practice-tests/types";
import type { PracticeTestTeachingItem } from "@/lib/practice-tests/build-teaching-review";
import type { PostExamQuestionOutcome } from "@/lib/learner/post-exam-performance-report";

const PracticeTestTeachingReviewPanel = dynamic(
  () =>
    import("@/components/student/practice-test-teaching-review-panel").then(
      (m) => ({ default: m.PracticeTestTeachingReviewPanel }),
    ),
  { ssr: false },
);

const PracticeTestStudyLoopNext = dynamic(
  () =>
    import("@/components/student/practice-test-study-loop-next").then((m) => ({
      default: m.PracticeTestStudyLoopNext,
    })),
  { ssr: false },
);

const SmartReviewLayout = dynamic(
  () =>
    import("@/components/study/smart-review-screen").then((m) => ({
      default: m.SmartReviewLayout,
    })),
  { ssr: false },
);

const StudyPlanFromResults = dynamic(
  () =>
    import("@/components/study/study-plan").then((m) => ({
      default: m.StudyPlanFromResults,
    })),
  { ssr: false },
);

const PostExamAdaptiveReport = dynamic(
  () =>
    import("@/components/student/post-exam-adaptive-report").then((m) => ({
      default: m.PostExamAdaptiveReport,
    })),
  { ssr: false },
);

type Tx = (
  key: string,
  fallback: string,
  params?: Record<string, string | number | undefined>,
) => string;

type ResultsQuestionRow = {
  stem?: string | null;
  questionType?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  tags?: string[] | null;
};

type LinearPracticeFeedbackByQuestion = Record<
  string,
  {
    isCorrect: boolean;
    topic?: string | null;
    rationale: string | null;
    correctKeys: string[];
    correctAnswerExplanation?: string | null;
    relatedLessons?: { title: string; href: string }[];
  }
>;

export function PracticeTestResultsView({
  activePathwayId,
  adaptivePlanEnabled,
  catFinalStudyFeedback,
  catMode,
  confidence,
  confidenceTrackingEnabled,
  isEntitled,
  isLinearEngine,
  linearPracticeFeedback,
  onClearCatFinalStudyFeedback,
  onOpenTeachingReview,
  protectionFlags,
  questionCache,
  questionIds,
  results,
  savedElapsedMs,
  teachingReviewItems,
  teachingReviewLoading,
  testConfig,
  testId,
  timeLimitSec,
  timedMode,
  tx,
  userId,
  userLabel,
}: {
  activePathwayId: string | null;
  adaptivePlanEnabled: boolean;
  catFinalStudyFeedback: CatStudyFeedbackPayload | null;
  catMode: boolean;
  confidence: Record<string, ConfidenceLevel>;
  confidenceTrackingEnabled: boolean;
  isEntitled: boolean;
  isLinearEngine: boolean;
  linearPracticeFeedback: LinearPracticeFeedbackByQuestion;
  onClearCatFinalStudyFeedback: () => void;
  onOpenTeachingReview: (() => void) | undefined;
  protectionFlags: PremiumProtectionFlags;
  questionCache: Record<string, ResultsQuestionRow>;
  questionIds: string[];
  results: PracticeTestResultsJson;
  savedElapsedMs: number | null;
  teachingReviewItems: PracticeTestTeachingItem[] | null;
  teachingReviewLoading: boolean;
  testConfig: PracticeTestConfigJson | null;
  testId: string;
  timeLimitSec: number | null;
  timedMode: boolean;
  tx: Tx;
  userId: string;
  userLabel: string;
}) {
  if (catFinalStudyFeedback) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <div className="nn-cat-question-card">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            Session complete: final item
          </p>
          <h2 className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">
            Review before your summary
          </h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            {tx(
              "learner.practiceTests.run.catFinalReviewLead",
              "Here is the last rationale before your summary.",
            )}
          </p>
          <div className="mt-6">
            <CatStudyFeedbackPanel
              feedback={catFinalStudyFeedback}
              continueLabel={tx(
                "learner.practiceTests.run.viewResultsSummary",
                "View results summary",
              )}
              onContinue={onClearCatFinalStudyFeedback}
              continueDisabled={false}
              pathwayId={testConfig?.pathwayId ?? null}
            />
          </div>
        </div>
      </div>
    );
  }

  const correctnessMap: Record<string, boolean> = {};
  for (const [qid, fb] of Object.entries(linearPracticeFeedback)) {
    correctnessMap[qid] = fb.isCorrect;
  }

  const questionMetaMap: Record<
    string,
    { index: number; topic?: string | null }
  > = {};
  for (let i = 0; i < questionIds.length; i++) {
    const qid = questionIds[i];
    if (qid) {
      questionMetaMap[qid] = {
        index: i,
        topic: questionCache[qid]?.topic ?? null,
      };
    }
  }

  const linearFbCount = Object.keys(linearPracticeFeedback).length;
  const linearFbCorrect = Object.values(linearPracticeFeedback).filter(
    (f) => f.isCorrect,
  ).length;
  const linearFbMissed = linearFbCount - linearFbCorrect;
  const linearFbAccuracyPct =
    linearFbCount > 0 ? Math.round((linearFbCorrect / linearFbCount) * 100) : 0;

  const incorrectSet = new Set(results.incorrectQuestionIds ?? []);
  const postExamQuestionOutcomes: PostExamQuestionOutcome[] = [];
  for (let i = 0; i < questionIds.length; i++) {
    const qid = questionIds[i];
    if (!qid) continue;
    const fb = linearPracticeFeedback[qid];
    const q = questionCache[qid];
    let isCorrect: boolean | null = null;
    if (fb != null) isCorrect = fb.isCorrect;
    else if (incorrectSet.size > 0) isCorrect = !incorrectSet.has(qid);
    if (isCorrect == null) continue;
    postExamQuestionOutcomes.push({
      questionId: qid,
      isCorrect,
      questionType: q?.questionType ?? null,
      topic: q?.topic ?? null,
      tags: q?.tags ?? null,
    });
  }

  return (
    <div
      {...(catMode
        ? { "data-nn-qa-cat-results-root": "" }
        : isLinearEngine
          ? { "data-nn-qa-practice-exam-results-root": "" }
          : {})}
    >
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-6">
        <PostExamAdaptiveReport
          results={results}
          testId={testId}
          config={testConfig}
          pathwayId={testConfig?.pathwayId ?? null}
          elapsedMs={savedElapsedMs}
          timedMode={timedMode}
          timeLimitSec={timeLimitSec}
          questionOutcomes={postExamQuestionOutcomes}
          confidenceByQuestionId={confidence}
          learnerUserId={userId ?? null}
          isEntitled={isEntitled}
          onOpenTeachingReview={onOpenTeachingReview}
          teachingReviewLoading={teachingReviewLoading}
        />
      </div>

      {!results.catReport && linearFbCount > 0 ? (
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-6">
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-5 sm:p-6">
            <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
              {tx(
                "learner.practiceTests.run.sessionStudyPulseTitle",
                "Session study pulse",
              )}
            </p>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
              {tx(
                "learner.practiceTests.run.sessionStudyPulseAccuracy",
                "Accuracy on committed items",
              )}
              :{" "}
              <span className="font-semibold tabular-nums text-[var(--semantic-text-primary)]">
                {linearFbAccuracyPct}%
              </span>{" "}
              <span className="text-[var(--semantic-text-muted)]">
                ({linearFbCorrect}/{linearFbCount})
              </span>
            </p>
            <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
              {tx(
                "learner.practiceTests.run.sessionStudyPulseMissed",
                "Missed items",
              )}
              :{" "}
              <span className="font-semibold tabular-nums text-[var(--semantic-text-primary)]">
                {linearFbMissed}
              </span>
            </p>
          </div>
        </div>
      ) : null}

      {confidenceTrackingEnabled && Object.keys(confidence).length > 0 ? (
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-8">
          <div className="nn-cat-question-card nn-premium-cat-results-panel border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_16%,var(--semantic-surface))] shadow-sm">
            <h3 className="mb-5 font-semibold text-[var(--semantic-text-primary)]">
              Confidence Analysis
            </h3>
            <ConfidenceAnalyticsBlock
              confidence={confidence}
              correctness={correctnessMap}
              questionMeta={questionMetaMap}
              isEntitled={isEntitled}
            />
          </div>
        </div>
      ) : null}

      {Object.keys(linearPracticeFeedback).length > 0 ? (
        <SmartReviewResults
          confidence={confidence}
          confidenceTrackingEnabled={confidenceTrackingEnabled}
          isEntitled={isEntitled}
          linearPracticeFeedback={linearPracticeFeedback}
          questionCache={questionCache}
          questionIds={questionIds}
        />
      ) : null}

      {adaptivePlanEnabled ? (
        <AdaptiveStudyPlanResults
          activePathwayId={activePathwayId}
          confidence={confidence}
          correctnessMap={correctnessMap}
          isEntitled={isEntitled}
          results={results}
          testConfig={testConfig}
          testId={testId}
        />
      ) : (
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-8">
          <div className="nn-cat-question-card space-y-3">
            <h3 className="font-semibold text-[var(--semantic-text-primary)]">
              Continue your study your way
            </h3>
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              Adaptive planning is turned off in your study settings, so this
              session ends with neutral next steps instead of an auto-generated
              plan.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/app/questions"
                className="nn-btn-primary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none"
              >
                Open question bank
              </Link>
              <Link
                href="/app/lessons"
                className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold"
              >
                Browse lessons
              </Link>
            </div>
          </div>
        </div>
      )}

      {adaptivePlanEnabled ? (
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-6">
          <PracticeTestStudyLoopNext
            results={results}
            pathwayId={testConfig?.pathwayId ?? null}
            coach={results.catCoach ?? null}
          />
        </div>
      ) : null}

      {teachingReviewItems != null && teachingReviewItems.length > 0 ? (
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-8">
          <div className="nn-cat-question-card nn-premium-cat-results-panel space-y-3 border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))] shadow-sm">
            <h3 className="font-semibold text-[var(--semantic-text-primary)]">
              Teaching review
            </h3>
            <PracticeTestTeachingReviewPanel items={teachingReviewItems} />
          </div>
        </div>
      ) : teachingReviewItems != null && teachingReviewItems.length === 0 ? (
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-8">
          <p className="text-sm text-[var(--semantic-text-muted)]">
            No review items available for this session.
          </p>
        </div>
      ) : null}

      <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-8">
        <StudyNotesPanel
          userId={userId}
          scope="PRACTICE_TEST"
          contextId={testId}
          topic={(results.weakAreas ?? [])[0] ?? null}
          sourceLabel={`Practice test ${testId.slice(0, 8)}…`}
          userLabel={userLabel}
          flags={protectionFlags}
        />
      </div>
    </div>
  );
}

function SmartReviewResults({
  confidence,
  confidenceTrackingEnabled,
  isEntitled,
  linearPracticeFeedback,
  questionCache,
  questionIds,
}: {
  confidence: Record<string, ConfidenceLevel>;
  confidenceTrackingEnabled: boolean;
  isEntitled: boolean;
  linearPracticeFeedback: LinearPracticeFeedbackByQuestion;
  questionCache: Record<string, ResultsQuestionRow>;
  questionIds: string[];
}) {
  const smartReviewItems: SmartReviewItem[] = [];
  for (let i = 0; i < questionIds.length; i++) {
    const qid = questionIds[i];
    if (!qid) continue;
    const fb = linearPracticeFeedback[qid];
    if (!fb) continue;
    const q = questionCache[qid];
    smartReviewItems.push({
      id: qid,
      index: i,
      stem: q?.stem ?? "Question not available",
      topic: q?.topic ?? null,
      subtopic: q?.subtopic ?? null,
      isCorrect: fb.isCorrect,
      confidence: confidenceTrackingEnabled ? (confidence[qid] ?? null) : null,
      rationale: fb.rationale,
      correctAnswerExplanation: fb.correctAnswerExplanation ?? null,
      relatedLessons: fb.relatedLessons ?? [],
    });
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-8">
      <div className="nn-cat-question-card nn-premium-cat-results-panel border border-[color-mix(in_srgb,var(--semantic-chart-4)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_14%,var(--semantic-surface))] shadow-sm">
        <h3 className="mb-5 font-semibold text-[var(--semantic-text-primary)]">
          Smart Review
        </h3>
        <SmartReviewLayout items={smartReviewItems} isEntitled={isEntitled} />
      </div>
    </div>
  );
}

function AdaptiveStudyPlanResults({
  confidence,
  correctnessMap,
  isEntitled,
  results,
  testConfig,
  testId,
}: {
  activePathwayId: string | null;
  confidence: Record<string, ConfidenceLevel>;
  correctnessMap: Record<string, boolean>;
  isEntitled: boolean;
  results: PracticeTestResultsJson;
  testConfig: PracticeTestConfigJson | null;
  testId: string;
}) {
  const readinessScore = results.catReport?.readinessScore ?? results.accuracyPct;
  const weakAreas = results.catReport?.weakAreas ?? results.weakAreas ?? [];
  let overconfidentCount = 0;
  let uncertainCorrectCount = 0;
  for (const [qid, lvl] of Object.entries(confidence)) {
    const isCorrect = correctnessMap[qid];
    if (lvl === "high" && isCorrect === false) overconfidentCount++;
    if ((lvl === "low" || lvl === "medium") && isCorrect === true)
      uncertainCorrectCount++;
  }
  const totalRated = Object.keys(confidence).length;
  const hasOverconfidence =
    totalRated > 0 && overconfidentCount / totalRated >= 0.2;
  const hasManyUncertainCorrect =
    totalRated > 0 && uncertainCorrectCount / totalRated >= 0.25;

  if (weakAreas.length === 0 && Object.keys(results.byTopic).length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 sm:px-6 pb-8">
      <div className="nn-cat-question-card nn-premium-cat-results-panel border border-[color-mix(in_srgb,var(--semantic-chart-1)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--semantic-surface))] shadow-sm">
        <StudyPlanFromResults
          readinessScore={readinessScore}
          byTopic={results.byTopic}
          weakAreas={weakAreas}
          hasOverconfidence={hasOverconfidence}
          hasManyUncertainCorrect={hasManyUncertainCorrect}
          pathwayId={testConfig?.pathwayId ?? null}
          testId={testId}
          isEntitled={isEntitled}
        />
      </div>
    </div>
  );
}
