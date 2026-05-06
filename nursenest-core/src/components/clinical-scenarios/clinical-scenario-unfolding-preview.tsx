"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import {
  aggregateTrajectoryLabel,
  applyChoiceToBranchingState,
  BRANCHING_DETERIORATION_BANNER,
  initialBranchingEngineState,
  narrativeScenarioText,
  optionsJsonUsesBranchingEngine,
  parseBranchingOptions,
  visibleOptionsForStage,
  type BranchingStageView,
  type ParsedBranchingOption,
} from "@/lib/clinical-scenarios/branching-scenario-engine";
import { computeScenarioOutcome } from "@/lib/clinical-scenarios/clinical-scenario-outcome-engine";
import {
  patientTrajectoryFromConsequence,
  trajectoryLabelText,
  type PatientTrajectory,
} from "@/lib/clinical-scenarios/clinical-scenario-trajectory";
import { clinicalScenarioTierNarrative } from "@/lib/clinical-scenarios/clinical-scenario-tier-focus";
import type { ClinicalScenarioCompletionStudyBundle } from "@/lib/clinical-scenarios/clinical-scenario-completion-study-links";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";

export type ClinicalScenarioStagePreview = {
  id: string;
  orderIndex: number;
  scenarioText: string;
  vitals: unknown;
  assessmentFindings: string;
  labUpdates: unknown | null;
  questionStem: string;
  optionsJson: unknown;
  correctOptionId: string;
  rationale: string;
  whyWrongByOptionId: unknown;
  clinicalJudgmentFocus: string;
  consequencesByOptionId: unknown;
  nextStageOrder: number | null;
};

export type ClinicalScenarioPreviewModel = {
  id: string;
  title: string;
  pathwayId: string;
  canonicalCategoryId: string;
  tierFocus: string;
  difficulty: string;
  patientAgeContext: string;
  presentingConcern: string;
  briefHistory: string;
  medicationsAllergies: string | null;
  initialVitals: unknown;
  assessmentFindings: string;
  labsDiagnostics: unknown | null;
  publishStatus: string;
  /** Premium simulation: free tier may preview stage 1 only. */
  isPremium?: boolean;
  stages: ClinicalScenarioStagePreview[];
};

function asOptionList(raw: unknown): { id: string; label: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { id: string; label: string }[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id : "";
    const label =
      typeof o.label === "string" && o.label.trim()
        ? o.label
        : typeof o.text === "string" && o.text.trim()
          ? o.text
          : "";
    if (id && label) out.push({ id, label });
  }
  return out;
}

function asStringMap(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

function toBranchingStageView(s: ClinicalScenarioStagePreview): BranchingStageView {
  return { ...s };
}

function correctPathwayLines(stages: ClinicalScenarioStagePreview[]): string[] {
  return stages.map((s, idx) => {
    const ok = parseBranchingOptions(s.optionsJson).find((o) => o.isCorrect);
    return `Stage ${idx + 1}: ${ok?.label ?? s.correctOptionId}`;
  });
}

function scenarioUsesBranchingEngine(stages: ClinicalScenarioStagePreview[]): boolean {
  return stages.some((s) => optionsJsonUsesBranchingEngine(s.optionsJson));
}

function renderKeyValuePanel(title: string, data: unknown) {
  if (data == null) return null;
  const entries =
    typeof data === "object" && !Array.isArray(data) && data !== null
      ? Object.entries(data as Record<string, unknown>).filter(([, v]) => v != null && String(v).trim() !== "")
      : [];
  if (!entries.length) return null;
  return (
    <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--bg-card))] p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">{title}</h3>
      <dl className="mt-2 grid gap-2 text-sm text-[var(--semantic-text-primary)] sm:grid-cols-2">
        {entries.map(([k, v]) => (
          <div key={k} className="rounded-md bg-[var(--bg-muted)]/60 px-2 py-1">
            <dt className="text-[10px] font-semibold uppercase text-[var(--theme-body-text)]">{k}</dt>
            <dd className="text-[var(--semantic-text-primary)]">{String(v)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ClinicalScenarioStudyFollowupBlock({ links }: { links: ClinicalScenarioCompletionStudyBundle }) {
  return (
    <div className="mt-4 space-y-3 rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_8%,var(--bg-card))] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-chart-1)]">Continue studying</p>
      {links.relatedLessons.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-[var(--semantic-info)]">Related lessons (same topic family)</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {links.relatedLessons.map((l) => (
              <li key={l.slug}>
                <Link
                  href={l.href}
                  className="text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-[var(--theme-body-text)]">No extra catalog lessons matched this case category yet.</p>
      )}
      <p className="text-sm">
        <Link
          href={links.weakFlashcardsHref}
          className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
        >
          Flashcards for weak areas in this topic
        </Link>
        <span className="text-[var(--theme-body-text)]"> — opens your flashcards hub with the weak filter.</span>
      </p>
    </div>
  );
}

export function ClinicalScenarioUnfoldingPreview({
  scenario,
  premiumUnlocked = true,
  allowStaffFullPreview = false,
  studyCompletionLinks = null,
}: {
  scenario: ClinicalScenarioPreviewModel;
  premiumUnlocked?: boolean;
  /** Staff / admin preview: full multi-stage access even for premium scenarios without a subscription. */
  allowStaffFullPreview?: boolean;
  /** Catalog lesson slugs + weak flashcards deep link — computed server-side; no duplicated bodies. */
  studyCompletionLinks?: ClinicalScenarioCompletionStudyBundle | null;
}) {
  const branching = useMemo(() => scenarioUsesBranchingEngine(scenario.stages), [scenario.stages]);
  const branchStages = useMemo(() => scenario.stages.map(toBranchingStageView), [scenario.stages]);
  const isPremiumScenario = scenario.isPremium === true;
  const fullScenarioAccess = premiumUnlocked || !isPremiumScenario || allowStaffFullPreview;

  const [legacyStageIdx, setLegacyStageIdx] = useState(0);
  const [legacyPicked, setLegacyPicked] = useState<string | null>(null);

  const [branchState, setBranchState] = useState(() => initialBranchingEngineState(0));
  const [branchPending, setBranchPending] = useState<ParsedBranchingOption | null>(null);
  const [branchFreeDone, setBranchFreeDone] = useState(false);

  const resetBranching = useCallback(() => {
    setBranchState(initialBranchingEngineState(0));
    setBranchPending(null);
    setBranchFreeDone(false);
  }, []);

  const legacyStage = scenario.stages[legacyStageIdx];
  const legacyOptions = useMemo(() => (legacyStage ? asOptionList(legacyStage.optionsJson) : []), [legacyStage]);
  const legacyConsequences = useMemo(() => (legacyStage ? asStringMap(legacyStage.consequencesByOptionId) : {}), [legacyStage]);
  const legacyWhyWrong = useMemo(() => (legacyStage ? asStringMap(legacyStage.whyWrongByOptionId) : {}), [legacyStage]);

  const branchOrderIdx = branchState.currentOrderIndex;
  const branchStage =
    branchOrderIdx >= 0 && branchOrderIdx < scenario.stages.length ? scenario.stages[branchOrderIdx] : undefined;
  const branchHidden = branchState.hiddenOptionIdsByStageOrder[branchOrderIdx];
  const branchVisible = useMemo(
    () => visibleOptionsForStage(branchStage ? toBranchingStageView(branchStage) : undefined, branchHidden),
    [branchStage, branchHidden, branchOrderIdx],
  );

  const branchComplete =
    branching && ((!fullScenarioAccess && branchFreeDone) || branchOrderIdx >= scenario.stages.length);

  const branchOutcome = useMemo(() => {
    if (!branching || !branchComplete) return null;
    return computeScenarioOutcome({
      trajectoryPath: branchState.trajectoryPath,
      incorrectCount: branchState.incorrectCount,
      incorrectWeight: branchState.incorrectWeight,
      totalStages: scenario.stages.length,
      mistakeLabels: branchState.mistakeLabels,
    });
  }, [
    branching,
    branchComplete,
    branchState.trajectoryPath,
    branchState.incorrectCount,
    branchState.incorrectWeight,
    branchState.mistakeLabels,
    scenario.stages.length,
  ]);

  const trajectoryLegacy: PatientTrajectory | null = useMemo(() => {
    if (!legacyStage || !legacyPicked) return null;
    return patientTrajectoryFromConsequence(legacyConsequences[legacyPicked]);
  }, [legacyPicked, legacyStage, legacyConsequences]);

  const aggregateBranchTrajectory = useMemo(
    () => aggregateTrajectoryLabel(branchState.trajectoryPath),
    [branchState.trajectoryPath],
  );

  const categoryLabel =
    CANONICAL_STUDY_CATEGORIES.find((c) => c.id === scenario.canonicalCategoryId)?.label ?? scenario.canonicalCategoryId;
  const tierNarrative = clinicalScenarioTierNarrative(scenario.tierFocus);

  const commitBranchChoice = useCallback(() => {
    if (!branchPending || !branchStage) return;
    const picked = branchPending;

    const trajStr =
      picked.trajectory === "improves"
        ? "patient improves"
        : picked.trajectory === "deteriorates"
          ? "patient deteriorates"
          : "patient unchanged";

    const sendAnalytics = (args: {
      trajectoryPath: PatientTrajectory[];
      incorrectSoFar: number;
      incorrectWeightSoFar: number;
      reachedStageOrder: number;
      completed: boolean;
    }) => {
      const trajAgg = aggregateTrajectoryLabel(args.trajectoryPath);
      const reached = Math.min(args.reachedStageOrder, Math.max(0, scenario.stages.length - 1));
      void fetch("/api/learner/clinical-scenario-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          pathwayId: scenario.pathwayId,
          tierFocus: scenario.tierFocus,
          stageOrder: branchStage.orderIndex,
          optionId: picked.id,
          isCorrect: picked.isCorrect,
          incorrectSoFar: args.incorrectSoFar,
          incorrectWeight: args.incorrectWeightSoFar,
          trajectoryPath: args.trajectoryPath,
          trajectoryAggregate: trajAgg,
          reachedStageOrder: reached,
          maxStageOrderReached: reached,
          premiumUnlocked,
          completedScenario: args.completed,
          isPremiumScenario: isPremiumScenario,
        }),
      }).catch(() => {});
    };

    if (!fullScenarioAccess && branchState.currentOrderIndex === 0) {
      const wrongW = !picked.isCorrect ? (picked.effect === "delay" ? 2 : 1) : 0;
      let consequenceStr = trajStr;
      if (!picked.isCorrect && picked.effect === "delay") {
        consequenceStr = "patient deteriorates";
      }
      const traj = patientTrajectoryFromConsequence(consequenceStr);
      const incorrect = branchState.incorrectCount + (picked.isCorrect ? 0 : 1);
      const incorrectWeight = branchState.incorrectWeight + wrongW;
      const newPath = [...branchState.trajectoryPath, traj];
      const nextOrder = 1;
      setBranchState((prev) => {
        const deteriorationBannerByStageOrder = { ...prev.deteriorationBannerByStageOrder };
        if (picked.trajectory === "deteriorates" && scenario.stages.length > nextOrder) {
          const prevB = deteriorationBannerByStageOrder[nextOrder] ?? "";
          deteriorationBannerByStageOrder[nextOrder] = prevB ? `${prevB}\n${BRANCHING_DETERIORATION_BANNER}` : BRANCHING_DETERIORATION_BANNER;
        }
        return {
          ...prev,
          trajectoryPath: newPath,
          rationaleTrail: [...prev.rationaleTrail, picked.rationale || ""].filter((s) => s.trim().length > 0),
          incorrectCount: incorrect,
          incorrectWeight,
          mistakeLabels: !picked.isCorrect ? [...prev.mistakeLabels, picked.label] : [...prev.mistakeLabels],
          deteriorationBannerByStageOrder,
        };
      });
      setBranchFreeDone(true);
      setBranchPending(null);
      sendAnalytics({
        trajectoryPath: newPath,
        incorrectSoFar: incorrect,
        incorrectWeightSoFar: incorrectWeight,
        reachedStageOrder: 0,
        completed: false,
      });
      return;
    }

    const next = applyChoiceToBranchingState({
      state: branchState,
      stages: branchStages,
      picked,
    });
    setBranchState(next);
    setBranchPending(null);
    const completed = next.currentOrderIndex >= scenario.stages.length;
    sendAnalytics({
      trajectoryPath: next.trajectoryPath,
      incorrectSoFar: next.incorrectCount,
      incorrectWeightSoFar: next.incorrectWeight,
      reachedStageOrder: next.currentOrderIndex,
      completed,
    });
  }, [
    branchPending,
    branchStage,
    branchState,
    branchStages,
    fullScenarioAccess,
    isPremiumScenario,
    premiumUnlocked,
    scenario,
  ]);

  if (branching) {
    if (!branchStage && !branchFreeDone && branchOrderIdx < scenario.stages.length) {
      return <p className="text-sm text-[var(--theme-body-text)]">This scenario has no stages yet.</p>;
    }

    const showSummary = branchComplete;

    return (
      <div className="space-y-4">
        <header className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,var(--bg-card))] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-success)]">Clinical simulation</p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--semantic-text-primary)]">{scenario.title}</h2>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">
            {scenario.pathwayId} · {categoryLabel} · {scenario.tierFocus.replace(/_/g, " ")} · {scenario.difficulty}
          </p>
          <p className="mt-1 text-xs text-[var(--semantic-chart-3)]">Status: {scenario.publishStatus}</p>
          {!fullScenarioAccess && isPremiumScenario ? (
            <p className="mt-2 text-xs text-[var(--semantic-warning)]">
              Premium simulation: Free includes stage 1 only. Upgrade for the full multi-stage case with branching consequences.
            </p>
          ) : null}
          {tierNarrative ? (
            <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-info)]">{tierNarrative}</p>
          ) : null}
        </header>

        <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-chart-2)]">Patient snapshot</h3>
          <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">
            <span className="font-semibold">Age / context:</span> {scenario.patientAgeContext}
          </p>
          <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">
            <span className="font-semibold">Presenting concern:</span> {scenario.presentingConcern}
          </p>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">{scenario.briefHistory}</p>
          {scenario.medicationsAllergies ? (
            <p className="mt-2 text-sm text-[var(--semantic-warning)]">
              <span className="font-semibold">Meds / allergies:</span> {scenario.medicationsAllergies}
            </p>
          ) : null}
        </section>

        {renderKeyValuePanel("Initial vitals (case baseline)", scenario.initialVitals)}
        {renderKeyValuePanel("Admission assessment", { "Key findings": scenario.assessmentFindings })}
        {renderKeyValuePanel("Labs & diagnostics", scenario.labsDiagnostics)}

        {showSummary ? (
          <section
            className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--bg-card))] p-4"
            data-testid="clinical-scenario-summary"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-success)]">Case outcome</h3>
            <p className="mt-2 text-sm font-medium text-[var(--semantic-text-primary)]">
              Overall trajectory: {trajectoryLabelText(aggregateBranchTrajectory)}
            </p>
            <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">
              Incorrect decisions: {branchState.incorrectCount} (weighted burden: {branchState.incorrectWeight})
            </p>
            {branchOutcome ? (
              <div
                className="mt-4 space-y-3 rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--bg-card))] p-4"
                data-testid="clinical-scenario-outcome-screen"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Simulation debrief</p>
                <p className="text-sm font-semibold capitalize text-[var(--semantic-text-primary)]">
                  Outcome: {branchOutcome.outcome}
                </p>
                <p className="text-sm text-[var(--theme-body-text)]">{branchOutcome.summary}</p>
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--semantic-info)]">Rationale highlights</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-[var(--theme-body-text)]">
                    {branchState.rationaleTrail.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ol>
                </div>
                {branchOutcome.keyMistakes.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase text-[var(--semantic-danger)]">Mistakes to review</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--theme-body-text)]">
                      {branchOutcome.keyMistakes.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--semantic-success)]">Correct pathway (ideal choices)</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-[var(--semantic-text-primary)]">
                    {correctPathwayLines(scenario.stages).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--semantic-chart-2)]">Clinical pearls</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--theme-body-text)]">
                    {branchOutcome.clinicalPearls.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
            {showSummary && studyCompletionLinks ? (
              <ClinicalScenarioStudyFollowupBlock links={studyCompletionLinks} />
            ) : null}
            {!fullScenarioAccess && isPremiumScenario ? (
              <div className="mt-6" data-testid="clinical-scenario-paywall">
                <SubscriptionPaywall context="lessons" />
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--semantic-success)]">End of case — review takeaways with your educator.</p>
            )}
            <button
              type="button"
              className="mt-4 rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]"
              onClick={resetBranching}
            >
              Restart simulation
            </button>
          </section>
        ) : branchStage ? (
          <>
            <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--bg-card))] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-warning)]">
                  Stage {branchStage.orderIndex + 1} of {scenario.stages.length}
                </h3>
                <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-primary)]">
                  Trajectory: {trajectoryLabelText(aggregateBranchTrajectory)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
                {narrativeScenarioText(toBranchingStageView(branchStage), branchState)}
              </p>
              {renderKeyValuePanel("Vitals (stage)", branchStage.vitals)}
              <p className="mt-3 text-sm text-[var(--semantic-text-primary)]">
                <span className="font-semibold">Assessment:</span> {branchStage.assessmentFindings}
              </p>
              {renderKeyValuePanel("Lab / diagnostic updates", branchStage.labUpdates)}
            </section>

            <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Clinical judgment check</h3>
              <p className="mt-2 text-sm font-medium text-[var(--semantic-text-primary)]">{branchStage.questionStem}</p>
              <p className="mt-1 text-xs text-[var(--theme-body-text)]">Focus: {branchStage.clinicalJudgmentFocus}</p>
              <div className="mt-3 flex flex-col gap-2">
                {branchVisible.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      branchPending?.id === o.id
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--bg-muted))]"
                        : "border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/40 hover:border-[color-mix(in_srgb,var(--semantic-info)_40%,var(--semantic-border-soft))]"
                    }`}
                    onClick={() => setBranchPending(o)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </section>

            {branchPending ? (
              <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--bg-card))] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">Selected option</h3>
                <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">{branchPending.rationale}</p>
                <button
                  type="button"
                  className="mt-4 rounded-full bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-on-brand)]"
                  onClick={commitBranchChoice}
                >
                  Commit & continue
                </button>
              </section>
            ) : null}
          </>
        ) : null}

        <section className="rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/30 p-3 text-xs text-[var(--theme-body-text)]">
          <p className="font-semibold text-[var(--semantic-text-primary)]">Case timeline</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            {scenario.stages.map((s, i) => (
              <li key={s.id} className={i === branchOrderIdx ? "font-semibold text-[var(--semantic-text-primary)]" : ""}>
                Stage {i + 1}: {s.questionStem.slice(0, 72)}
                {s.questionStem.length > 72 ? "…" : ""}
              </li>
            ))}
          </ol>
        </section>
      </div>
    );
  }

  if (!legacyStage) {
    return <p className="text-sm text-[var(--theme-body-text)]">This scenario has no stages yet.</p>;
  }

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,var(--bg-card))] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-success)]">Scenario intro</p>
        <h2 className="mt-1 text-xl font-semibold text-[var(--semantic-text-primary)]">{scenario.title}</h2>
        <p className="mt-2 text-sm text-[var(--theme-body-text)]">
          {scenario.pathwayId} · {categoryLabel} · {scenario.tierFocus.replace(/_/g, " ")} · {scenario.difficulty}
        </p>
        <p className="mt-1 text-xs text-[var(--semantic-chart-3)]">Status: {scenario.publishStatus}</p>
        {tierNarrative ? (
          <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-info)]">{tierNarrative}</p>
        ) : null}
      </header>

      <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-chart-2)]">Patient snapshot</h3>
        <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">
          <span className="font-semibold">Age / context:</span> {scenario.patientAgeContext}
        </p>
        <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">
          <span className="font-semibold">Presenting concern:</span> {scenario.presentingConcern}
        </p>
        <p className="mt-2 text-sm text-[var(--theme-body-text)]">{scenario.briefHistory}</p>
        {scenario.medicationsAllergies ? (
          <p className="mt-2 text-sm text-[var(--semantic-warning)]">
            <span className="font-semibold">Meds / allergies:</span> {scenario.medicationsAllergies}
          </p>
        ) : null}
      </section>

      {renderKeyValuePanel("Initial vitals (case baseline)", scenario.initialVitals)}
      {renderKeyValuePanel("Admission assessment", { "Key findings": scenario.assessmentFindings })}
      {renderKeyValuePanel("Labs & diagnostics", scenario.labsDiagnostics)}

      <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--bg-card))] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-warning)]">
            Case stage {legacyStage.orderIndex + 1} of {scenario.stages.length}
          </h3>
          {trajectoryLegacy ? (
            <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-primary)]">
              Trajectory: {trajectoryLabelText(trajectoryLegacy)}
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-primary)]">{legacyStage.scenarioText}</p>
        {renderKeyValuePanel("Vitals (stage)", legacyStage.vitals)}
        <p className="mt-3 text-sm text-[var(--semantic-text-primary)]">
          <span className="font-semibold">Assessment:</span> {legacyStage.assessmentFindings}
        </p>
        {renderKeyValuePanel("Lab / diagnostic updates", legacyStage.labUpdates)}
      </section>

      <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Clinical judgment check</h3>
        <p className="mt-2 text-sm font-medium text-[var(--semantic-text-primary)]">{legacyStage.questionStem}</p>
        <p className="mt-1 text-xs text-[var(--theme-body-text)]">Focus: {legacyStage.clinicalJudgmentFocus}</p>
        <div className="mt-3 flex flex-col gap-2">
          {legacyOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                legacyPicked === o.id
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--bg-muted))]"
                  : "border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/40 hover:border-[color-mix(in_srgb,var(--semantic-info)_40%,var(--semantic-border-soft))]"
              }`}
              onClick={() => setLegacyPicked(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>

      {legacyPicked ? (
        <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--bg-card))] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">Rationale</h3>
          <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">{legacyStage.rationale}</p>
          {legacyWhyWrong[legacyPicked] && legacyPicked !== legacyStage.correctOptionId ? (
            <p className="mt-2 text-sm text-[var(--semantic-danger)]">
              <span className="font-semibold">Why this option is wrong:</span> {legacyWhyWrong[legacyPicked]}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {legacyStageIdx < scenario.stages.length - 1 ? (
              <button
                type="button"
                className="rounded-full bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-on-brand)]"
                onClick={() => {
                  setLegacyStageIdx((i) => i + 1);
                  setLegacyPicked(null);
                }}
              >
                Next stage
              </button>
            ) : (
              <p className="text-sm font-medium text-[var(--semantic-success)]">End-of-case — review takeaways with your educator.</p>
            )}
          </div>
          {legacyStageIdx >= scenario.stages.length - 1 && legacyPicked && studyCompletionLinks ? (
            <ClinicalScenarioStudyFollowupBlock links={studyCompletionLinks} />
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/30 p-3 text-xs text-[var(--theme-body-text)]">
        <p className="font-semibold text-[var(--semantic-text-primary)]">Case timeline</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {scenario.stages.map((s, i) => (
            <li key={s.id} className={i === legacyStageIdx ? "font-semibold text-[var(--semantic-text-primary)]" : ""}>
              Stage {i + 1}: {s.questionStem.slice(0, 72)}
              {s.questionStem.length > 72 ? "…" : ""}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
