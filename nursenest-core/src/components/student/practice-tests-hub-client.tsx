"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import type {
  CatExamFeedbackMode,
  CatPresentationMode,
  CatSelectionBasis,
  PracticeTestPathwayOption,
  PracticeTestSelectionMode,
} from "@/lib/practice-tests/types";
import { catPathwayExamCodeLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { CatAmbiguityPathwayPicker } from "@/components/student/cat-ambiguity-pathway-picker";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
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
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

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
  const searchParams = useSearchParams();
  const [topics, setTopics] = useState<{ topic: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<TestListRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [questionCount, setQuestionCount] = useState(20);
  const [selectionMode, setSelectionMode] = useState<PracticeTestSelectionMode>("random");
  const [catSelectionBasis, setCatSelectionBasis] = useState<CatSelectionBasis>("random");
  const [catPresentationMode, setCatPresentationMode] = useState<CatPresentationMode>("practice");
  const [catExamFeedbackMode, setCatExamFeedbackMode] = useState<CatExamFeedbackMode>("test");
  const [topicPicks, setTopicPicks] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [difficultyMin, setDifficultyMin] = useState<number | "">("");
  const [difficultyMax, setDifficultyMax] = useState<number | "">("");
  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitMin, setTimeLimitMin] = useState(45);
  const [linearDeliveryMode, setLinearDeliveryMode] = useState<"practice" | "exam">("practice");
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
  const selectedPathwayDef = pathwayId.trim() ? getExamPathwayById(pathwayId.trim()) : undefined;
  const selectedExamLabel = selectedPathwayDef ? catPathwayExamCodeLabel(selectedPathwayDef) : null;
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
    resume: "You have an in-progress test ready to resume.",
    review_recent: "Recent completions are highlighted for quick review.",
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
    }
    prevSelectionModeRef.current = selectionMode;
  }, [selectionMode, catOptions, defaultPathwayId, pathwayOptions, searchParams]);

  const loadList = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/practice-tests");
      const data = (await res.json()) as { tests?: TestListRow[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not load tests.");
      setList(data.tests ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

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

  function addTopicFromMenu(t: string) {
    if (!t || topicPicks.includes(t)) return;
    setTopicPicks((prev) => [...prev, t]);
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
          throw new Error("No adaptive (CAT) exam tracks are available for your plan right now.");
        }
        if (!pathwayId.trim()) {
          throw new Error("Choose which exam pathway you want to practice before starting adaptive (CAT).");
        }
      }
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          title: title.trim() || undefined,
          questionCount: selectionMode === "cat" ? Math.max(10, questionCount) : questionCount,
          topicNames: topicPicks,
          difficultyMin: difficultyMin === "" ? null : difficultyMin,
          difficultyMax: difficultyMax === "" ? null : difficultyMax,
          selectionMode,
          ...(selectionMode === "cat"
            ? {
                catSelectionBasis,
                catPresentationMode,
                catExamFeedbackMode:
                  catPresentationMode === "practice" ? catExamFeedbackMode : ("test" satisfies CatExamFeedbackMode),
              }
            : { linearDeliveryMode }),
          pathwayId: pathwayId.trim() || null,
          timedMode,
          timeLimitSec: timedMode ? Math.round(timeLimitMin * 60) : null,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string; code?: string };
      if (!res.ok) {
        setErrorCode(typeof data.code === "string" ? data.code : null);
        throw new Error(data.error ?? "Could not create test.");
      }
      if (data.id) {
        window.location.href = `/app/practice-tests/${data.id}`;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setCreating(false);
    }
  }

  function formatDuration(ms: number | null): string {
    if (ms == null) return "N/A";
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
        <h2 className="text-xl font-bold tracking-tight text-[var(--theme-heading-text)]">Build a practice test</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Questions are drawn only from your plan’s tier and region. Choose a linear test or{" "}
          <strong className="text-foreground">adaptive (CAT)</strong> that adjusts difficulty from your performance and
          weak-area history.
        </p>
        {isPriorityWinner(hubPriority, "weak_focus") ? (
          <p className="mt-2 text-xs font-medium text-[var(--semantic-warning-contrast)]">
            Weak-area focus is active so recommendations stay targeted.
          </p>
        ) : null}

        {pathwayOptions.length > 0 ? (
          <div className="mt-4">
            <label className="block text-sm">
              <span className="text-muted-foreground">Exam pathway (filters the question pool)</span>
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
                  <option value="">Choose which exam pathway you want to practice…</option>
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
                ? "NP tracks use the NP question bank and AANP-style blueprint when you run exam simulation."
                : selectedExamLabel
                  ? `${selectedExamLabel} uses the pathway-scoped bank and tagged blueprint when you run exam simulation.`
                  : "Each exam track uses its own pathway-scoped bank and tagged blueprint when you run exam simulation."}
            </p>
            {selectionMode === "cat" && catOptions.length > 1 ? (
              <>
                <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">
                  Your plan includes more than one adaptive exam track —{" "}
                  <span className="font-medium text-[var(--semantic-text-primary)]">
                    pick which pathway this CAT session is for
                  </span>{" "}
                  before starting so items stay exam-scoped.
                </p>
                <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">
                  We need your pathway before starting CAT so the adaptive pool matches the right exam.
                </p>
              </>
            ) : null}
            {selectionMode === "cat" && catOptions.length === 0 ? (
              <p className="mt-2 text-xs text-[var(--semantic-warning-contrast)]">
                Adaptive (CAT) is not available for your current pathways yet. Use linear practice or pick a track with
                an active CAT pool.
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">Title (optional)</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cardio sprint"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">
              {selectionMode === "cat"
                ? catPresentationMode === "exam_simulation"
                  ? isNpPathway
                    ? "Maximum length (AANP-style NP sim: 75–150)"
                    : `Maximum length (${selectedExamLabel ?? "NCLEX-style"} exam sim: 75–145)`
                  : "Maximum questions (cap, 10–75)"
                : "Number of questions (5–100)"}
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
                <span className="text-xs text-muted-foreground">Quick:</span>
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
          <span className="text-sm text-muted-foreground">Selection</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["random", "Random mix"],
                ["targeted", "Targeted topics"],
                ["weak", "Target weak areas"],
                ["cat", "Adaptive (CAT)"],
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
              ? "Pick one or more topics below (required)."
              : selectionMode === "weak"
                ? "Uses topics you’ve missed on recent scored practice exams."
                : selectionMode === "cat"
                  ? catPresentationMode === "exam_simulation"
                    ? isNpPathway
                      ? "AANP-style NP exam simulation: 75–150 items, four-domain blueprint when questions are tagged, adaptive readiness (theta + confidence stops). Not the live AANP format."
                      : `${selectedExamLabel ?? "NCLEX-style"} exam simulation: length and blueprint follow your selected pathway when questions are tagged, with adaptive stops. Not an official licensure result.`
                    : "CAT starts near mid difficulty, then moves up or down; may stop early when the estimate stabilizes."
                  : "Optional topic filters narrow the pool; leave empty for a broad mix."}
          </p>
        </div>

        {selectionMode !== "cat" ? (
          <div className="mt-4 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 shadow-sm">
            <span className="text-sm font-medium text-foreground">Linear session style</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLinearDeliveryMode("practice")}
                data-active={linearDeliveryMode === "practice"}
                className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
              >
                Practice (per-item feedback)
              </button>
              <button
                type="button"
                onClick={() => setLinearDeliveryMode("exam")}
                data-active={linearDeliveryMode === "exam"}
                className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
              >
                Exam (lock until end)
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Practice shows rationales after each submitted answer. Exam locks choices and hides rationales until you
              finish the full run.
            </p>
          </div>
        ) : null}

        {selectionMode === "cat" && examSimulationEnabled ? (
          <div className="mt-4 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 shadow-sm">
            <span className="text-sm font-medium text-foreground">CAT format</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCatPresentationMode("practice");
                  if (questionCount > 75) setQuestionCount(75);
                }}
                data-active={catPresentationMode === "practice"}
                className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
              >
                Practice CAT
              </button>
              <button
                type="button"
                onClick={() => {
                  setCatPresentationMode("exam_simulation");
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
                Exam simulation
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Practice CAT keeps shorter runs and weak-area boosts. Exam simulation uses your selected pathway:{" "}
              {isNpPathway ? (
                <>
                  <strong className="text-foreground">{selectedExamLabel ?? "NP"}</strong> — 75–150 items, default{" "}
                  <strong className="text-foreground">3 hours</strong> timed, AANP-style four-domain blueprint.
                </>
              ) : (
                <>
                  <strong className="text-foreground">{selectedExamLabel ?? "NCLEX-style"}</strong> — defaults follow your
                  track in the builder (timed length and item cap), with blueprint coverage when items are tagged.
                </>
              )}{" "}
              Enable with{" "}
              <code className="rounded bg-muted px-1">CAT_EXAM_SIMULATION_ENABLED=1</code> on the server (and optional{" "}
              <code className="rounded bg-muted px-1">NEXT_PUBLIC_CAT_EXAM_SIMULATION=1</code> for this UI).
            </p>
          </div>
        ) : null}

        {selectionMode === "cat" && catPresentationMode === "practice" ? (
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">Pool for adaptive draws</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["random", "Broad mix"],
                  ["targeted", "Filtered topics"],
                  ["weak", "Weak areas first"],
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
            <p className="mt-2 text-xs text-muted-foreground">
              Same tier rules apply. Weak-area mode needs prior scored exam history.
            </p>
            <div className="mt-4 space-y-2">
              <span className="text-sm font-medium text-foreground">CAT mode</span>
              <p className="text-xs text-muted-foreground">
                Same adaptive engine for both — choose whether you want teaching after each item or a stricter run.
              </p>
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
                  <span className="font-semibold text-foreground">Study Mode</span>
                  <span className="mt-1 block text-xs text-muted-foreground">Rationales as you go · adaptive learning</span>
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
                  <span className="font-semibold text-foreground">Test Mode</span>
                  <span className="mt-1 block text-xs text-muted-foreground">No hints until the end · exam-style</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {(selectionMode === "random" || selectionMode === "targeted" || selectionMode === "cat") && (
          <div className="mt-4 space-y-2">
            <span className="text-sm text-muted-foreground">Topics (optional unless targeted)</span>
            <div className="flex flex-wrap gap-2">
              {topicPicks.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="nn-chip px-3 py-1 text-xs font-medium"
                  data-selected="true"
                  onClick={() => removeTopic(t)}
                >
                  {t} ✕
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
                <option value="">Add from bank…</option>
                {topics.map((b) => (
                  <option key={b.topic} value={b.topic}>
                    {b.topic} ({b.count})
                  </option>
                ))}
              </select>
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                placeholder="Custom topic label"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTopic())}
              />
              <button type="button" className="nn-premium-action-chip rounded-lg border border-border px-3 py-1.5 text-sm" onClick={addCustomTopic}>
                Add
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">Difficulty min (1–5, optional)</span>
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
            <span className="text-muted-foreground">Difficulty max (1–5, optional)</span>
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
        <p className="mt-1 text-xs text-muted-foreground">
          Bank uses numeric difficulty when set; items without a level still qualify when filters are loose.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--semantic-border-soft)] pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={timedMode} onChange={(e) => setTimedMode(e.target.checked)} />
            Timed mode
          </label>
          {timedMode ? (
            <label className="text-sm">
              <span className="text-muted-foreground">Time limit (minutes)</span>
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
            <span className="text-xs text-muted-foreground">Untimed. Elapsed time is still recorded when you finish.</span>
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
          onClick={() => void createTest()}
          className="nn-btn-primary mt-6 px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {creating ? "Building…" : "Start test"}
        </button>
      </section>

      <section>
        <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)]">Saved tests & history</h2>
        <p className="mt-1 text-sm text-muted-foreground">Resume in-progress sessions or review completed scores.</p>
        {historyPriorityMessage ? <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{historyPriorityMessage}</p> : null}
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : list.length === 0 ? (
          <div className="mt-4">
            <PremiumEmptyState
              data-nn-empty="practice-tests-history"
              tone="early"
              density="compact"
              visualLayout="stack"
              headline={emptyStateCopy.noHistoryYet({ area: "saved tests" }).headline}
              body="You haven’t saved any practice tests yet. Start a new test and your in-progress sessions and recent scores will show up here."
              hint={emptyStateCopy.noHistoryYet({ area: "saved tests" }).body}
              primaryCta={{ label: "Start test", href: "/app/practice-tests/start", variant: "primary" }}
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {list.map((t) => {
              const emphasis = resolvePracticeHistoryEmphasis(hubPriority, t, nowMs);
              return (
                <li
                  key={t.id}
                  className={`nn-card nn-student-card-lift flex flex-wrap items-center justify-between gap-3 p-4 text-sm transition-colors hover:bg-[var(--semantic-panel-muted)] ${
                    emphasis.rowEmphasis === "resume"
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))]"
                      : emphasis.rowEmphasis === "review_recent"
                        ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))]"
                        : ""
                  }`}
                >
                <div>
                  <p className="font-medium text-foreground">{t.title || "Practice test"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.questionCount} Q · {t.selectionMode ?? "N/A"}
                    {t.catPresentationMode === "exam_simulation" ? " · Exam sim" : ""}
                    {t.catExamFeedbackMode === "study" ? " · CAT study mode" : ""}
                    {t.selectionMode === "cat" &&
                    t.catExamFeedbackMode === "test" &&
                    t.catPresentationMode !== "exam_simulation"
                      ? " · CAT test mode"
                      : ""}
                    {" · "}
                    {t.timedMode ? `timed ${t.timeLimitSec ? `${Math.round(t.timeLimitSec / 60)} min` : ""}` : "untimed"}
                    {t.status === "COMPLETED" && t.accuracyPct != null ? ` · ${t.accuracyPct}% (${t.scoreCorrect}/${t.scoreTotal})` : null}
                    {t.status === "IN_PROGRESS" ? " · in progress" : null}
                    {t.status === "ABANDONED" ? " · abandoned" : null}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(t.startedAt).toLocaleString()}
                    {t.elapsedMs != null ? ` · ${formatDuration(t.elapsedMs)}` : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  {t.status === "IN_PROGRESS" ? (
                    <Link
                      href={`/app/practice-tests/${t.id}`}
                      className={`nn-btn-primary px-4 py-2 text-xs font-semibold ${
                        emphasis.actionEmphasis === "resume"
                          ? "shadow-[0_6px_16px_color-mix(in_srgb,var(--semantic-info)_18%,transparent)]"
                          : ""
                      }`}
                    >
                      Resume
                    </Link>
                  ) : t.status === "COMPLETED" ? (
                    <Link
                      href={`/app/practice-tests/${t.id}`}
                      className={`nn-premium-action-chip rounded-full border px-4 py-2 text-xs font-semibold hover:bg-muted ${
                        emphasis.actionEmphasis === "review_recent"
                          ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))]"
                          : "border-border"
                      }`}
                    >
                      Review
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
