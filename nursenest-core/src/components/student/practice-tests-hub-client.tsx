"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import type {
  CatAdaptiveSessionType,
  CatExamFeedbackMode,
  CatPresentationMode,
  CatSelectionBasis,
  PracticeTestPathwayOption,
  PracticeTestSelectionMode,
} from "@/lib/practice-tests/types";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { CatAmbiguityPathwayPicker } from "@/components/student/cat-ambiguity-pathway-picker";
import {
  catEligiblePathwayOptions,
  hubCatStartBlocked,
  pathwayIdWhenEnteringCatMode,
  pathwayIdWhenLeavingCatMode,
} from "@/lib/practice-tests/practice-tests-hub-cat-pathway";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import {
  isWithinRecentWindow,
  isPriorityWinner,
  resolvePracticeHistoryEmphasis,
  resolveInteractionPriority,
  resolvePriorityMessage,
} from "@/lib/student/interaction-priority";
import { buildPracticeExamStartPayload } from "@/lib/practice-tests/practice-exam-start-payload";
import { ExamPreExamCustomizeModal } from "@/components/exam/exam-study-theme-modal";

type TestListRow = {
  id: string;
  title: string | null;
  status: string;
  questionCount: number;
  selectionMode: string | null;
  catPresentationMode?: string | null;
  catExamFeedbackMode?: string | null;
  timedMode: boolean;
  timeLimitSec: number | null;
  elapsedMs: number | null;
  startedAt: string;
  completedAt: string | null;
  accuracyPct: number | null;
  scoreCorrect: number | null;
  scoreTotal: number | null;
  updatedAt: string;
};

export function PracticeTestsHubClient({
  examSimulationEnabled = false,
  pathwayOptions = [],
  defaultPathwayId = null,
  catEligiblePathwayIds = [],
}: {
  examSimulationEnabled?: boolean;
  pathwayOptions?: PracticeTestPathwayOption[];
  defaultPathwayId?: string | null;
  /** Pathway ids that support CAT adaptive start (server-aligned with POST /api/practice-tests). */
  catEligiblePathwayIds?: string[];
}) {
  const { t } = useMarketingI18n();
  const searchParams = useSearchParams();
  const [topics, setTopics] = useState<{ topic: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<TestListRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [questionCount, setQuestionCount] = useState(20);
  const [selectionMode, setSelectionMode] = useState<PracticeTestSelectionMode>("random");
  const [catSelectionBasis, setCatSelectionBasis] = useState<CatSelectionBasis>("random");
  const [catPresentationMode, setCatPresentationMode] = useState<CatPresentationMode>("practice");
  const [catExamFeedbackMode, setCatExamFeedbackMode] = useState<CatExamFeedbackMode>("test");
  const [catAdaptiveSessionType, setCatAdaptiveSessionType] = useState<CatAdaptiveSessionType>("cat");
  const [topicPicks, setTopicPicks] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [difficultyMin, setDifficultyMin] = useState<number | "">("");
  const [difficultyMax, setDifficultyMax] = useState<number | "">("");
  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitMin, setTimeLimitMin] = useState(45);
  const [linearDeliveryMode, setLinearDeliveryMode] = useState<"practice" | "exam">("practice");
  const [linearRationaleVisibility, setLinearRationaleVisibility] = useState<"after_each" | "end_of_exam">("after_each");
  const [pathwayId, setPathwayId] = useState(
    () => defaultPathwayId ?? pathwayOptions[0]?.id ?? "",
  );
  const nowMs = Date.now();

  const catOptions = useMemo(
    () => catEligiblePathwayOptions(pathwayOptions, catEligiblePathwayIds),
    [pathwayOptions, catEligiblePathwayIds],
  );
  const pathwayOptionsForSelect = useMemo(
    () => (selectionMode === "cat" ? catOptions : pathwayOptions),
    [selectionMode, catOptions, pathwayOptions],
  );
  const selectedPathway =
    pathwayOptionsForSelect.find((p) => p.id === pathwayId) ?? pathwayOptions.find((p) => p.id === pathwayId);
  const isNpPathway = selectedPathway?.examFamily === "NP";
  const selectedExamLabel = selectedPathway?.examCodeLabel?.trim()
    ? selectedPathway.examCodeLabel.trim()
    : null;
  const selectedExamContext = useMemo(
    () => buildGlobalExamContext(pathwayId.trim() || defaultPathwayId || null, "en"),
    [defaultPathwayId, pathwayId],
  );
  const hasInProgressActivity = list.some((row) => row.status === "IN_PROGRESS");
  const hasRecentCompletion = list.some((row) => row.status === "COMPLETED" && isWithinRecentWindow(row.completedAt, nowMs));
  const hasWeakFocus = selectionMode === "weak" || (selectionMode === "cat" && catSelectionBasis === "weak");
  const hubPriority = resolveInteractionPriority({
    hasResume: hasInProgressActivity,
    hasWeakFocus,
    hasRecentCompletion,
  });
  const historyPriorityMessage = resolvePriorityMessage(hubPriority, {
    resume: t("learner.practiceTests.hub.resumeHint"),
    review_recent: t("learner.practiceTests.hub.reviewRecentHint"),
  });
  const prevSelectionModeRef = useRef(selectionMode);

  useEffect(() => {
    const prev = prevSelectionModeRef.current;
    if (prev !== "cat" && selectionMode === "cat") {
      const urlPid = searchParams.get("pathwayId");
      setPathwayId(
        pathwayIdWhenEnteringCatMode({
          catEligibleOptions: catOptions,
          pathwayIdFromUrl: urlPid,
        }),
      );
    } else if (prev === "cat" && selectionMode !== "cat") {
      setPathwayId(pathwayIdWhenLeavingCatMode(defaultPathwayId, pathwayOptions));
      setCatAdaptiveSessionType("cat");
    }
    prevSelectionModeRef.current = selectionMode;
  }, [selectionMode, catOptions, defaultPathwayId, pathwayOptions, searchParams]);

  const loadList = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/practice-tests");
      const data = (await res.json()) as { tests?: TestListRow[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? t("learner.practiceTests.hub.error.loadTests"));
      setList(data.tests ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("learner.practiceTests.hub.error.generic"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  function applyExamSimulationDefaultsForPathway(nextPathwayId: string) {
    const np = pathwayOptions.find((p) => p.id === nextPathwayId)?.examFamily === "NP";
    if (np) {
      setTimeLimitMin(180);
      setQuestionCount((q) => Math.min(150, Math.max(75, q)));
    } else {
      setTimeLimitMin(300);
      setQuestionCount((q) => Math.min(145, Math.max(75, q)));
    }
  }

  useEffect(() => {
    const pid = searchParams.get("pathwayId")?.trim();
    if (pid && pathwayOptions.some((p) => p.id === pid)) {
      setPathwayId(pid);
    }
    const cat = searchParams.get("cat");
    if (cat === "1" || cat === "true") {
      setSelectionMode("cat");
    }
    const startMode = searchParams.get("startMode");
    if (startMode === "practice_exam") {
      setSelectionMode("random");
      setLinearDeliveryMode("practice");
      setLinearRationaleVisibility("after_each");
    }
    if (searchParams.get("focus") !== "weak") return;
    setSelectionMode((prev) => {
      if (prev === "cat") {
        setCatSelectionBasis("weak");
        return prev;
      }
      return "weak";
    });
  }, [searchParams, pathwayOptions]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const qp = new URLSearchParams();
        if (selectedExamContext?.pathwayId) {
          qp.set("pathwayId", selectedExamContext.pathwayId);
          qp.set("language", selectedExamContext.language);
        }
        const discoveryUrl = qp.size > 0 ? `/api/questions/discovery?${qp.toString()}` : "/api/questions/discovery";
        const res = await fetch(discoveryUrl);
        if (!res.ok) return;
        const data = (await res.json()) as { buckets?: { topic: string; count: number }[] };
        if (!cancelled && data.buckets) setTopics(data.buckets);
      } catch {
        /* optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedExamContext]);

  function addTopicFromMenu(topicValue: string) {
    if (!topicValue || topicPicks.includes(topicValue)) return;
    setTopicPicks((prev) => [...prev, topicValue]);
  }

  function removeTopic(t: string) {
    setTopicPicks((prev) => prev.filter((x) => x !== t));
  }

  function addCustomTopic() {
    const t = topicInput.trim();
    if (!t || topicPicks.includes(t)) return;
    setTopicPicks((prev) => [...prev, t]);
    setTopicInput("");
  }

  async function createTest() {
    setCreating(true);
    setError(null);
    setErrorCode(null);
    try {
      if (selectionMode === "cat") {
        if (catOptions.length === 0) {
          throw new Error(t("learner.practiceTests.hub.error.noAdaptive"));
        }
        if (!pathwayId.trim()) {
          throw new Error(t("learner.practiceTests.hub.error.pathwayRequired"));
        }
      }
      const linearPayload = buildPracticeExamStartPayload({
        title: title.trim() || null,
        questionCount,
        selectionMode: selectionMode === "targeted" ? "targeted" : selectionMode === "weak" ? "weak" : "random",
        topicNames: topicPicks,
        pathwayId: pathwayId.trim() || null,
        timedMode,
        timeLimitSec: timedMode ? Math.round(timeLimitMin * 60) : null,
        difficultyMin: difficultyMin === "" ? null : difficultyMin,
        difficultyMax: difficultyMax === "" ? null : difficultyMax,
        sessionMode: linearDeliveryMode === "exam" ? "exam" : "tutor",
        rationaleVisibilityMode: linearRationaleVisibility === "after_each" ? "immediate" : "review",
      });
      const payload =
        selectionMode === "cat"
          ? {
              title: title.trim() || undefined,
              questionCount: Math.max(10, questionCount),
              topicNames: topicPicks,
              difficultyMin: difficultyMin === "" ? null : difficultyMin,
              difficultyMax: difficultyMax === "" ? null : difficultyMax,
              selectionMode,
              catSelectionBasis,
              catPresentationMode,
              catExamFeedbackMode:
                catPresentationMode === "practice" ? catExamFeedbackMode : ("test" satisfies CatExamFeedbackMode),
              catAdaptiveSessionType: catPresentationMode === "practice" ? catAdaptiveSessionType : "cat",
              pathwayId: pathwayId.trim() || null,
              timedMode,
              timeLimitSec: timedMode ? Math.round(timeLimitMin * 60) : null,
            }
          : linearPayload;
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string; code?: string };
      if (!res.ok) {
        setErrorCode(typeof data.code === "string" ? data.code : null);
        throw new Error(data.error ?? t("learner.practiceTests.hub.error.createTest"));
      }
      if (data.id) {
        window.location.href = `/app/practice-tests/${data.id}`;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("learner.practiceTests.hub.error.generic"));
    } finally {
      setCreating(false);
    }
  }

  function formatDuration(ms: number | null): string {
    if (ms == null) return t("learner.practiceTests.hub.notApplicable");
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}m ${r}s`;
  }

  return (
    <div className="space-y-8">
      <section
        className={`nn-card nn-student-card-lift p-6 sm:p-7 ${
          isPriorityWinner(hubPriority, "weak_focus")
            ? "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))]"
            : "border-[var(--semantic-border-soft)]"
        }`}
      >
        <h2 className="text-xl font-bold tracking-tight text-[var(--theme-heading-text)]">
          {t("learner.practiceTests.hub.builderTitle")}
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t("learner.practiceTests.hub.builderIntro")}</p>
        {isPriorityWinner(hubPriority, "weak_focus") ? (
          <p className="mt-2 text-xs font-medium text-[var(--semantic-warning-contrast)]">
            {t("learner.practiceTests.hub.weakFocusBanner")}
          </p>
        ) : null}

        {pathwayOptions.length > 0 ? (
          <div className="mt-4">
            <label className="block text-sm">
              <span className="text-muted-foreground">{t("learner.practiceTests.hub.pathwayLabel")}</span>
              <select
                data-nn-qa-practice-hub-pathway-select
                className="mt-1 w-full max-w-xl rounded-lg border border-border px-3 py-2 text-sm"
                value={pathwayId}
                onChange={(e) => {
                  const next = e.target.value;
                  setPathwayId(next);
                  if (selectionMode === "cat" && catPresentationMode === "exam_simulation") {
                    applyExamSimulationDefaultsForPathway(next);
                  }
                }}
              >
                {selectionMode === "cat" && catOptions.length > 1 ? (
                  <option value="">{t("learner.practiceTests.hub.pathwayPlaceholder")}</option>
                ) : null}
                {pathwayOptionsForSelect.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
              {isNpPathway
                ? t("learner.practiceTests.hub.pathwayNpHint")
                : selectedExamLabel
                  ? t("learner.practiceTests.hub.pathwayExamHint", { exam: selectedExamLabel })
                  : t("learner.practiceTests.hub.pathwayGenericHint")}
            </p>
            {selectionMode === "cat" && catOptions.length > 1 ? (
              <>
                <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.multiPathwayHint")}</p>
                <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.multiPathwaySub")}</p>
              </>
            ) : null}
            {selectionMode === "cat" && catOptions.length === 0 ? (
              <p className="mt-2 text-xs text-[var(--semantic-warning-contrast)]">{t("learner.practiceTests.hub.catUnavailableBody")}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">{t("learner.practiceTests.hub.titleOptionalLabel")}</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("learner.practiceTests.hub.titlePlaceholder")}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">
              {selectionMode === "cat"
                ? catPresentationMode === "exam_simulation"
                  ? isNpPathway
                    ? t("learner.practiceTests.hub.questionCount.catExamNp")
                    : t("learner.practiceTests.hub.questionCount.catExamRn", {
                        exam: selectedExamLabel ?? t("learner.practiceTests.hub.defaultExamLabel"),
                      })
                  : t("learner.practiceTests.hub.questionCount.catCap")
                : t("learner.practiceTests.hub.questionCount.linear")}
            </span>
            <input
              type="number"
              min={selectionMode === "cat" ? 10 : 5}
              max={
                selectionMode === "cat" && catPresentationMode === "exam_simulation"
                  ? isNpPathway
                    ? 150
                    : 145
                  : selectionMode === "cat"
                    ? 75
                    : 100
              }
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            />
            {selectionMode !== "cat" ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">{t("learner.practiceTests.hub.quickPicksLabel")}</span>
                {([10, 25, 50, 75, 100] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQuestionCount(n)}
                    data-selected={questionCount === n}
                    className="nn-chip px-3 py-1 text-xs font-medium"
                  >
                    {n}
                  </button>
                ))}
              </div>
            ) : null}
          </label>
        </div>

        <div className="mt-4">
          <span className="text-sm text-muted-foreground">{t("learner.practiceTests.hub.selectionLabel")}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["random", t("learner.practiceTests.hub.selection.random")],
                ["targeted", t("learner.practiceTests.hub.selection.targeted")],
                ["weak", t("learner.practiceTests.hub.selection.weak")],
                ["cat", t("learner.practiceTests.hub.selection.cat")],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setSelectionMode(v);
                  if (v !== "cat") {
                    setCatPresentationMode("practice");
                    setQuestionCount((q) => (q > 100 ? 100 : q));
                  } else if (catPresentationMode === "practice") {
                    setQuestionCount((q) => (q > 75 ? 75 : q));
                  }
                }}
                data-active={selectionMode === v}
                className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {selectionMode === "targeted"
              ? t("learner.practiceTests.hub.selectionHelp.targeted")
              : selectionMode === "weak"
                ? t("learner.practiceTests.hub.selectionHelp.weak")
                : selectionMode === "cat"
                  ? catPresentationMode === "exam_simulation"
                    ? isNpPathway
                      ? t("learner.practiceTests.hub.selectionHelp.cat.examSim.np")
                      : t("learner.practiceTests.hub.selectionHelp.cat.examSim.rn")
                    : t("learner.practiceTests.hub.selectionHelp.cat.practice")
                  : t("learner.practiceTests.hub.selectionHelp.linear")}
          </p>
        </div>

        {selectionMode !== "cat" ? (
          <div className="mt-4 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 shadow-sm">
            <span className="text-sm font-medium text-foreground">{t("learner.practiceTests.hub.sessionModeLabel")}</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setLinearDeliveryMode("practice");
                  setLinearRationaleVisibility("after_each");
                }}
                data-active={linearDeliveryMode === "practice"}
                className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
              >
                {t("learner.practiceTests.hub.sessionMode.tutor")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLinearDeliveryMode("exam");
                  setLinearRationaleVisibility("end_of_exam");
                }}
                data-active={linearDeliveryMode === "exam"}
                className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
              >
                {t("learner.practiceTests.hub.sessionMode.exam")}
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <span className="text-sm font-medium text-foreground">{t("learner.practiceTests.hub.rationaleVisibilityLabel")}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLinearRationaleVisibility("after_each");
                    setLinearDeliveryMode("practice");
                  }}
                  data-active={linearRationaleVisibility === "after_each"}
                  className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                >
                  {t("learner.practiceTests.hub.rationale.afterEach")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinearRationaleVisibility("end_of_exam");
                    setLinearDeliveryMode("exam");
                  }}
                  data-active={linearRationaleVisibility === "end_of_exam"}
                  className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                >
                  {t("learner.practiceTests.hub.rationale.endOnly")}
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t("learner.practiceTests.hub.sessionModeHelp")}</p>
          </div>
        ) : null}

        {selectionMode === "cat" && examSimulationEnabled ? (
          <div className="mt-4 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 shadow-sm">
            <span className="text-sm font-medium text-foreground">{t("learner.practiceTests.hub.catFormatLabel")}</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCatPresentationMode("practice");
                  if (questionCount > 75) setQuestionCount(75);
                  setCatAdaptiveSessionType("cat");
                }}
                data-active={catPresentationMode === "practice"}
                className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
              >
                {t("learner.practiceTests.hub.catFormat.practice")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCatPresentationMode("exam_simulation");
                  setCatAdaptiveSessionType("cat");
                  setCatSelectionBasis("random");
                  setTimedMode(true);
                  const np =
                    (pathwayId.trim() ? pathwayOptions.find((p) => p.id === pathwayId) : undefined)?.examFamily === "NP";
                  if (np) {
                    setTimeLimitMin(180);
                    setQuestionCount((q) => (q < 75 ? 150 : Math.min(150, Math.max(75, q))));
                  } else {
                    setTimeLimitMin(300);
                    setQuestionCount((q) => (q < 75 ? 145 : Math.min(145, Math.max(75, q))));
                  }
                }}
                data-active={catPresentationMode === "exam_simulation"}
                className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
              >
                {t("learner.practiceTests.hub.catFormat.examSim")}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t("learner.practiceTests.hub.catFormatHelp")}</p>
          </div>
        ) : null}

        {selectionMode === "cat" && catPresentationMode === "practice" ? (
          <div className="mt-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">{t("learner.practiceTests.hub.catSessionStyleLabel")}</span>
              <p className="text-xs text-muted-foreground">{t("learner.practiceTests.hub.catSessionStyleIntro")}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setCatAdaptiveSessionType("cat")}
                  className={`rounded-2xl border p-3 text-left text-sm transition ${
                    catAdaptiveSessionType === "cat"
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_36%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]"
                      : "border-[var(--semantic-border-soft)] hover:bg-[var(--semantic-panel-muted)]"
                  }`}
                >
                  <span className="font-semibold text-foreground">{t("learner.practiceTests.hub.catSessionStyleAdaptiveTitle")}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{t("learner.practiceTests.hub.catSessionStyleAdaptiveDesc")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCatAdaptiveSessionType("practice");
                    setCatExamFeedbackMode("study");
                  }}
                  className={`rounded-2xl border p-3 text-left text-sm transition ${
                    catAdaptiveSessionType === "practice"
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]"
                      : "border-[var(--semantic-border-soft)] hover:bg-[var(--semantic-panel-muted)]"
                  }`}
                >
                  <span className="font-semibold text-foreground">{t("learner.practiceTests.hub.catSessionStyleGuidedTitle")}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{t("learner.practiceTests.hub.catSessionStyleGuidedDesc")}</span>
                </button>
              </div>
            </div>
            <span className="mt-6 block text-sm text-muted-foreground">{t("learner.practiceTests.hub.poolLabel")}</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["random", t("learner.practiceTests.hub.poolBroadMix")],
                  ["targeted", t("learner.practiceTests.hub.poolFiltered")],
                  ["weak", t("learner.practiceTests.hub.poolWeakFirst")],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCatSelectionBasis(v)}
                  data-active={catSelectionBasis === v}
                  className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t("learner.practiceTests.hub.poolHelp")}</p>
            {catAdaptiveSessionType === "cat" ? (
              <div className="mt-4 space-y-2">
                <span className="text-sm font-medium text-foreground">{t("learner.practiceTests.hub.catFeedbackHeading")}</span>
                <p className="text-xs text-muted-foreground">{t("learner.practiceTests.hub.catFeedbackIntro")}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setCatExamFeedbackMode("study")}
                    className={`rounded-2xl border p-3 text-left text-sm transition ${
                      catExamFeedbackMode === "study"
                        ? "border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]"
                        : "border-[var(--semantic-border-soft)] hover:bg-[var(--semantic-panel-muted)]"
                    }`}
                  >
                    <span className="font-semibold text-foreground">{t("learner.practiceTests.hub.catCardLearnTitle")}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{t("learner.practiceTests.hub.catCardLearnDesc")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCatExamFeedbackMode("test")}
                    className={`rounded-2xl border p-3 text-left text-sm transition ${
                      catExamFeedbackMode === "test"
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_36%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]"
                        : "border-[var(--semantic-border-soft)] hover:bg-[var(--semantic-panel-muted)]"
                    }`}
                  >
                    <span className="font-semibold text-foreground">{t("learner.practiceTests.hub.catCardBoardTitle")}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{t("learner.practiceTests.hub.catCardBoardDesc")}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {(selectionMode === "random" || selectionMode === "targeted" || selectionMode === "cat") && (
          <div className="mt-4 space-y-2">
            <span className="text-sm text-muted-foreground">{t("learner.practiceTests.hub.topicsLabel")}</span>
            <div className="flex flex-wrap gap-2">
              {topicPicks.map((pickedTopic) => (
                <button
                  key={pickedTopic}
                  type="button"
                  className="nn-chip px-3 py-1 text-xs font-medium"
                  data-selected="true"
                  onClick={() => removeTopic(pickedTopic)}
                >
                  {pickedTopic} ✕
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                value=""
                onChange={(e) => {
                  addTopicFromMenu(e.target.value);
                  e.target.value = "";
                }}
              >
                <option value="">{t("learner.practiceTests.hub.addFromBank")}</option>
                {topics.map((b) => (
                  <option key={b.topic} value={b.topic}>
                    {b.topic} ({b.count})
                  </option>
                ))}
              </select>
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                placeholder={t("learner.practiceTests.hub.customTopicPlaceholder")}
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTopic())}
              />
              <button type="button" className="nn-premium-action-chip rounded-lg border border-border px-3 py-1.5 text-sm" onClick={addCustomTopic}>
                {t("learner.practiceTests.hub.add")}
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">{t("learner.practiceTests.hub.difficultyMin")}</span>
            <input
              type="number"
              min={1}
              max={5}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={difficultyMin}
              onChange={(e) => setDifficultyMin(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">{t("learner.practiceTests.hub.difficultyMax")}</span>
            <input
              type="number"
              min={1}
              max={5}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={difficultyMax}
              onChange={(e) => setDifficultyMax(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </label>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{t("learner.practiceTests.hub.difficultyFootnote")}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--semantic-border-soft)] pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={timedMode} onChange={(e) => setTimedMode(e.target.checked)} />
            {t("learner.practiceTests.hub.timedMode")}
          </label>
          {timedMode ? (
            <label className="text-sm">
              <span className="text-muted-foreground">{t("learner.practiceTests.hub.timeLimitMinutes")}</span>
              <input
                type="number"
                min={2}
                max={selectionMode === "cat" && catPresentationMode === "exam_simulation" ? 400 : 240}
                className="ml-2 rounded-lg border border-border px-2 py-1 text-sm"
                value={timeLimitMin}
                onChange={(e) => setTimeLimitMin(Number(e.target.value))}
              />
            </label>
          ) : (
            <span className="text-xs text-muted-foreground">{t("learner.practiceTests.hub.untimedHint")}</span>
          )}
        </div>

        {error ? (
          <div className="mt-4">
            <p className="text-sm text-[var(--semantic-warning-contrast)]">{error}</p>
            {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous ? (
              <CatAmbiguityPathwayPicker catEligibleOptions={catOptions} surface="practice_hub" className="mt-3" />
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          data-nn-qa-practice-hub-start-test
          disabled={
            creating ||
            hubCatStartBlocked({
              selectionMode,
              pathwayId,
              catEligibleOptionCount: catOptions.length,
            })
          }
          onClick={() => setCustomizeOpen(true)}
          className="nn-btn-primary mt-6 px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {creating ? t("learner.practiceTests.hub.building") : t("learner.practiceTests.hub.startCta")}
        </button>

        <ExamPreExamCustomizeModal
          open={customizeOpen}
          onClose={() => setCustomizeOpen(false)}
          onBegin={() => {
            setCustomizeOpen(false);
            void createTest();
          }}
          starting={creating}
        />
      </section>

      <section>
        <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)]">{t("learner.practiceTests.hub.savedHistoryTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.practiceTests.hub.savedHistoryIntro")}</p>
        {historyPriorityMessage ? <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{historyPriorityMessage}</p> : null}
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("learner.practiceTests.hub.loading")}</p>
        ) : list.length === 0 ? (
          <div className="mt-4">
            <PremiumEmptyState
              data-nn-empty="practice-tests-history"
              tone="early"
              density="compact"
              visualLayout="stack"
              headline={t("learner.practiceTests.hub.emptyHeadline")}
              body={t("learner.practiceTests.hub.emptyBody")}
              primaryCta={{ label: t("learner.practiceTests.hub.emptyStateCta"), href: "/app/practice-tests", variant: "primary" }}
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {list.map((row) => {
              const emphasis = resolvePracticeHistoryEmphasis(hubPriority, row, nowMs);
              const selectionLabel =
                row.selectionMode === "random"
                  ? t("learner.practiceTests.hub.selection.random")
                  : row.selectionMode === "targeted"
                    ? t("learner.practiceTests.hub.selection.targeted")
                    : row.selectionMode === "weak"
                      ? t("learner.practiceTests.hub.selection.weak")
                      : row.selectionMode === "cat"
                        ? t("learner.practiceTests.hub.selection.cat")
                        : row.selectionMode ?? t("learner.practiceTests.hub.notApplicable");
              const timedPart = row.timedMode
                ? `${t("learner.practiceTests.hub.rowTimed")}${row.timeLimitSec ? ` ${Math.round(row.timeLimitSec / 60)} min` : ""}`
                : t("learner.practiceTests.hub.rowUntimed");
              const adaptiveExtras: string[] = [];
              if (row.catPresentationMode === "exam_simulation") {
                adaptiveExtras.push(t("learner.practiceTests.hub.rowBadge.readinessSim"));
              } else if (row.selectionMode === "cat") {
                if (row.catExamFeedbackMode === "study") {
                  adaptiveExtras.push(t("learner.practiceTests.hub.rowBadge.adaptiveLearn"));
                } else if (row.catExamFeedbackMode === "test") {
                  adaptiveExtras.push(t("learner.practiceTests.hub.rowBadge.adaptiveBoard"));
                }
              }
              const metaBits = [
                t("learner.practiceTests.hub.rowQuestionCount", { count: row.questionCount }),
                selectionLabel,
                ...adaptiveExtras,
                timedPart,
              ];
              if (row.status === "COMPLETED" && row.accuracyPct != null) {
                metaBits.push(`${row.accuracyPct}% (${row.scoreCorrect}/${row.scoreTotal})`);
              }
              if (row.status === "IN_PROGRESS") metaBits.push(t("learner.practiceTests.hub.rowInProgress"));
              if (row.status === "ABANDONED") metaBits.push(t("learner.practiceTests.hub.rowAbandoned"));

              return (
                <li
                  key={row.id}
                  className={`nn-card nn-student-card-lift flex flex-wrap items-center justify-between gap-3 p-4 text-sm transition-colors hover:bg-[var(--semantic-panel-muted)] ${
                    emphasis.rowEmphasis === "resume"
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))]"
                      : emphasis.rowEmphasis === "review_recent"
                        ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))]"
                        : ""
                  }`}
                >
                <div>
                  <p className="font-medium text-foreground">{row.title || t("learner.practiceTests.hub.rowUntitled")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{metaBits.join(" · ")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(row.startedAt).toLocaleString()}
                    {row.elapsedMs != null ? ` · ${formatDuration(row.elapsedMs)}` : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  {row.status === "IN_PROGRESS" ? (
                    <Link
                      href={`/app/practice-tests/${row.id}`}
                      className={`nn-btn-primary px-4 py-2 text-xs font-semibold ${
                        emphasis.actionEmphasis === "resume"
                          ? "shadow-[0_6px_16px_color-mix(in_srgb,var(--semantic-info)_18%,transparent)]"
                          : ""
                      }`}
                    >
                      {t("learner.practiceTests.hub.resumeCta")}
                    </Link>
                  ) : row.status === "COMPLETED" ? (
                    <Link
                      href={`/app/practice-tests/${row.id}`}
                      className={`nn-premium-action-chip rounded-full border px-4 py-2 text-xs font-semibold hover:bg-muted ${
                        emphasis.actionEmphasis === "review_recent"
                          ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))]"
                          : "border-border"
                      }`}
                    >
                      {t("learner.practiceTests.hub.reviewCta")}
                    </Link>
                  ) : null}
                </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
