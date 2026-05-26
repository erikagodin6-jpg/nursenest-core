"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LineChart, PlayCircle } from "lucide-react";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import {
  LearnerCategorySelector,
  LearnerFilterBar,
  LearnerSessionStartPanel,
  SharedStudySetupLayout,
  SharedStudySetupSurface,
} from "@/components/learner-study-ui";
import {
  discoveryTopicsForCanonicalFilters,
  getQuestionCountsByBodySystem,
  type CanonicalBodySystemId,
} from "@/lib/learner-study-hub/body-system-data";
import type { PathwayLessonPracticeHubSnapshot } from "@/lib/learner-study-hub/pathway-lesson-study-materials";
import { buildPracticeExamStartPayload } from "@/lib/practice-tests/practice-exam-start-payload";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import type {
  CatSelectionBasis,
  PracticeTestPathwayOption,
  PracticeTestSelectionMode,
  StudyLaunchPayload,
} from "@/lib/practice-tests/types";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import { emitRuntimeEvent } from "@/lib/runtime/client-runtime-event";
import { safeRouterReplace } from "@/lib/runtime/client-navigation";

type ExamMode = "practice" | "cat";
type FocusMode = "all" | "weak" | "missed" | "unseen";
type TopicBucket = { topic: string; count: number };

type PracticeTestsHubClientProps = {
  examSimulationEnabled?: boolean;
  pathwayOptions?: PracticeTestPathwayOption[];
  defaultPathwayId?: string | null;
  pathwayDisplayName?: string;
  catEligiblePathwayIds?: string[];
  hubBootstrapSource?: "primary" | "secondary";
  catHref?: string;
  pathwayLessonPractice?: PathwayLessonPracticeHubSnapshot | null;
  initialCatMode?: boolean;
};

const PRACTICE_COUNTS = [25, 50, 75, 100] as const;
const CAT_COUNTS = [25, 50, 75] as const;

function focusToSelectionMode(focusMode: FocusMode): Exclude<PracticeTestSelectionMode, "cat" | "targeted" | "starred"> {
  if (focusMode === "weak") return "weak";
  if (focusMode === "missed") return "missed";
  if (focusMode === "unseen") return "unseen";
  return "random";
}

function focusToCatBasis(focusMode: FocusMode): CatSelectionBasis {
  if (focusMode === "weak") return "weak";
  if (focusMode === "missed") return "missed";
  return "random";
}

function formatPathwayLabel(option: PracticeTestPathwayOption | undefined, fallback: string): string {
  if (!option) return fallback.trim() || "Practice Exam";
  if (option.examCodeLabel?.trim()) return option.examCodeLabel.trim();
  return option.label.trim() || fallback.trim() || "Practice Exam";
}

function inferRuntimeNursingTier(pathwayId: string): string {
  if (pathwayId.includes("-rn-")) return "rn";
  if (pathwayId.includes("-lpn-") || pathwayId.includes("-rpn-")) return "pn";
  if (pathwayId.includes("-np-")) return "np";
  if (pathwayId.includes("allied")) return "allied";
  return "";
}

export function PracticeTestsHubClient({
  examSimulationEnabled = false,
  pathwayOptions = [],
  defaultPathwayId = null,
  pathwayDisplayName = "",
  catEligiblePathwayIds = [],
  hubBootstrapSource = "primary",
  pathwayLessonPractice = null,
  initialCatMode = false,
}: PracticeTestsHubClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamString = useMemo(() => searchParams.toString(), [searchParams]);

  const fallbackPathwayId = defaultPathwayId ?? pathwayOptions[0]?.id ?? "";
  const [pathwayId, setPathwayId] = useState(fallbackPathwayId);
  const [examMode, setExamMode] = useState<ExamMode>(initialCatMode ? "cat" : "practice");
  const [focusMode, setFocusMode] = useState<FocusMode>("all");
  const [questionCount, setQuestionCount] = useState(50);
  const [selectedCanonicalIds, setSelectedCanonicalIds] = useState<CanonicalBodySystemId[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [topics, setTopics] = useState<TopicBucket[]>([]);
  const [discoveryTotal, setDiscoveryTotal] = useState<number | null>(null);
  const [discoveryReady, setDiscoveryReady] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const createInFlightRef = useRef(false);

  const selectedPathway = useMemo(
    () => pathwayOptions.find((option) => option.id === pathwayId) ?? pathwayOptions[0],
    [pathwayId, pathwayOptions],
  );
  const catEligibleOptions = useMemo(
    () => pathwayOptions.filter((option) => catEligiblePathwayIds.includes(option.id)),
    [catEligiblePathwayIds, pathwayOptions],
  );
  const catAvailableForPathway = Boolean(pathwayId && catEligiblePathwayIds.includes(pathwayId));
  const availableCounts = examMode === "cat" ? CAT_COUNTS : PRACTICE_COUNTS;
  const allCanonicalIds = useMemo(
    () => CANONICAL_STUDY_CATEGORIES.map((category) => category.id as CanonicalBodySystemId),
    [],
  );

  useEffect(() => {
    const qp = new URLSearchParams(searchParamString);
    const urlPathwayId = qp.get("pathwayId")?.trim();
    if (urlPathwayId && pathwayOptions.some((option) => option.id === urlPathwayId)) {
      setPathwayId(urlPathwayId);
    }
    if (qp.get("cat") === "1" || qp.get("cat") === "true") {
      setExamMode("cat");
    }
    const focus = qp.get("focus");
    if (focus === "weak" || focus === "missed" || focus === "unseen") {
      setFocusMode(focus);
    }
  }, [pathwayOptions, searchParamString]);

  useEffect(() => {
    if (examMode !== "cat") return;
    if (catAvailableForPathway) return;
    const firstCatPathway = catEligibleOptions[0]?.id;
    if (firstCatPathway) {
      setPathwayId(firstCatPathway);
    }
    if (focusMode === "unseen") {
      setFocusMode("all");
    }
  }, [catAvailableForPathway, catEligibleOptions, examMode, focusMode]);

  useEffect(() => {
    if (!availableCounts.includes(questionCount as (typeof availableCounts)[number])) {
      setQuestionCount(availableCounts[0]);
    }
  }, [availableCounts, questionCount]);

  useEffect(() => {
    let cancelled = false;
    const pid = pathwayId.trim();
    setDiscoveryReady(false);
    setTopics([]);
    setDiscoveryTotal(null);
    if (!pid) {
      setDiscoveryReady(true);
      return;
    }

    (async () => {
      try {
        const qp = new URLSearchParams({ pathwayId: pid, language: "en" });
        const res = await fetch(`/api/questions/discovery?${qp.toString()}`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) {
          if (!cancelled) {
            setDiscoveryReady(true);
          }
          return;
        }
        const data = (await res.json()) as { buckets?: TopicBucket[]; total?: number };
        if (!cancelled) {
          setTopics(Array.isArray(data.buckets) ? data.buckets : []);
          setDiscoveryTotal(typeof data.total === "number" ? data.total : null);
          setDiscoveryReady(true);
        }
      } catch {
        if (!cancelled) setDiscoveryReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathwayId]);

  const countsByCanonical = useMemo(() => {
    const pid = pathwayId.trim();
    if (!pid || topics.length === 0) {
      return Object.fromEntries(CANONICAL_STUDY_CATEGORIES.map((category) => [category.id, 0])) as Record<
        CanonicalBodySystemId,
        number
      >;
    }
    return getQuestionCountsByBodySystem(pid, topics);
  }, [pathwayId, topics]);

  const selectedTopicNames = useMemo(() => {
    const pid = pathwayId.trim();
    if (!pid || selectedCanonicalIds.length === 0 || selectedCanonicalIds.length >= allCanonicalIds.length) {
      return [];
    }
    return discoveryTopicsForCanonicalFilters(pid, topics, new Set(selectedCanonicalIds));
  }, [allCanonicalIds.length, pathwayId, selectedCanonicalIds, topics]);

  const categorySummary = useMemo(() => {
    if (selectedCanonicalIds.length === 0) return "All categories";
    if (selectedCanonicalIds.length === 1) {
      return CANONICAL_STUDY_CATEGORIES.find((category) => category.id === selectedCanonicalIds[0])?.label ?? "1 category";
    }
    return `${selectedCanonicalIds.length} categories`;
  }, [selectedCanonicalIds]);

  const metaBySystem = useMemo(
    () =>
      Object.fromEntries(
        CANONICAL_STUDY_CATEGORIES.map((category) => {
          const id = category.id as CanonicalBodySystemId;
          const count = countsByCanonical[id] ?? 0;
          return [id, count > 0 ? `${count} ${count === 1 ? "question" : "questions"} in pool` : "Syncing question pool"];
        }),
      ) as Partial<Record<CanonicalBodySystemId, string>>,
    [countsByCanonical],
  );

  const toggleCategory = useCallback((id: CanonicalBodySystemId) => {
    setSelectedCanonicalIds((current) => {
      if (current.length === 0) return [id];
      if (current.includes(id)) return current.filter((item) => item !== id);
      return [...current, id];
    });
  }, []);

  const resetCategorySelection = useCallback(() => {
    setSelectedCanonicalIds([]);
  }, []);

  const createTest = useCallback(async () => {
    if (creating || createInFlightRef.current) return;
    createInFlightRef.current = true;
    setCreating(true);
    setError(null);
    setErrorCode(null);
    setSessionExpired(false);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 28_000);

    try {
      const trimmedPathwayId = pathwayId.trim();
      if (!trimmedPathwayId) {
        throw new Error("Choose an exam pathway before starting.");
      }
      if (examMode === "cat" && !catEligiblePathwayIds.includes(trimmedPathwayId)) {
        throw new Error("CAT is not available for this pathway yet. Choose Practice Exam or another pathway.");
      }
      if (examMode === "cat") {
        const pathwayOption = pathwayOptions.find((option) => option.id === trimmedPathwayId);
        emitRuntimeEvent("cat_start_clicked", {
          pathwayId: trimmedPathwayId,
          nursingTier: inferRuntimeNursingTier(trimmedPathwayId),
          examType: pathwayOption?.examCodeLabel ?? "",
          examFamily: pathwayOption?.examFamily ?? "",
          runtimeMode: "cat",
          bootstrapSurface: "practice_tests_hub",
          surface: "practice_tests_hub",
        });
      }

      const selectedCategories =
        selectedCanonicalIds.length === 0 || selectedCanonicalIds.length >= allCanonicalIds.length
          ? []
          : selectedCanonicalIds;
      const filterLabel =
        focusMode === "weak"
          ? "weak"
          : focusMode === "missed"
            ? "incorrect"
            : focusMode === "unseen"
              ? "unseen"
              : selectedCategories.length > 0
                ? "targeted"
                : "all";

      const studyLaunchPayload: StudyLaunchPayload = {
        pathwayId: trimmedPathwayId,
        mode: examMode === "cat" ? "cat" : "practice_exam",
        selectedCategories,
        filters: {
          hubFilter: filterLabel,
          ...(examMode === "cat" ? { catSelectionBasis: focusToCatBasis(focusMode) } : {}),
        },
        count: questionCount,
        shuffle: true,
      };

      const payload =
        examMode === "cat"
          ? {
              questionCount,
              topicNames: selectedTopicNames,
              difficultyMin: null,
              difficultyMax: null,
              selectionMode: "cat" satisfies PracticeTestSelectionMode,
              catSelectionBasis: focusToCatBasis(focusMode),
              catPresentationMode: examSimulationEnabled ? "exam_simulation" : "practice",
              catExamFeedbackMode: examSimulationEnabled ? "test" : "study",
              catAdaptiveSessionType: "cat",
              pathwayId: trimmedPathwayId,
              timedMode: examSimulationEnabled,
              timeLimitSec: examSimulationEnabled ? Math.round(300 * 60) : null,
              studyLaunchPayload,
            }
          : {
              ...buildPracticeExamStartPayload({
                questionCount,
                selectionMode: focusToSelectionMode(focusMode),
                topicNames: selectedTopicNames,
                pathwayId: trimmedPathwayId,
                timedMode: false,
                timeLimitSec: null,
                difficultyMin: null,
                difficultyMax: null,
                sessionMode: "exam",
                rationaleVisibilityMode: "review",
              }),
              studyLaunchPayload,
            };

      const res = await fetch("/api/practice-tests", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-nn-study-launch-surface": "practice_exams",
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        id?: string;
        error?: string;
        code?: string;
      };

      if (res.status === 401 || res.status === 403) {
        setSessionExpired(true);
        throw new Error("We could not verify your learner session. Retry from this page once your session finishes refreshing.");
      }

      if (!res.ok) {
        setErrorCode(typeof data.code === "string" ? data.code : null);
        emitRuntimeEvent(examMode === "cat" ? "cat_session_create_result" : "practice_exam_session_create_result", {
          pathwayId: trimmedPathwayId,
          nursingTier: inferRuntimeNursingTier(trimmedPathwayId),
          runtimeMode: examMode === "cat" ? "cat" : "practice_exam",
          bootstrapSurface: "practice_tests_hub",
          status: res.status,
          ok: false,
          errorCode: typeof data.code === "string" ? data.code : "",
          surface: "practice_tests_hub",
        });
        throw new Error(data.error ?? "We could not start this exam. Adjust your setup and try again.");
      }
      if (!data.id) {
        throw new Error("The exam was created without a session id. Please retry from this page.");
      }

      emitRuntimeEvent(examMode === "cat" ? "cat_session_create_result" : "practice_exam_session_create_result", {
        pathwayId: trimmedPathwayId,
        sessionId: data.id,
        nursingTier: inferRuntimeNursingTier(trimmedPathwayId),
        runtimeMode: examMode === "cat" ? "cat" : "practice_exam",
        bootstrapSurface: "practice_tests_hub",
        status: res.status,
        ok: true,
        surface: "practice_tests_hub",
      });
      safeRouterReplace(router, `/app/practice-tests/${encodeURIComponent(data.id)}?pathwayId=${encodeURIComponent(trimmedPathwayId)}`, {
        fallbackDelayMs: 1200,
        context: {
          feature: examMode === "cat" ? "cat_hub_launch" : "practice_tests_hub_launch",
          pathwayId: trimmedPathwayId,
          sessionId: data.id,
        },
      });
    } catch (cause) {
      const aborted = cause instanceof DOMException && cause.name === "AbortError";
      setError(
        aborted
          ? "Starting this exam timed out. Your progress is safe; check your connection and try again."
          : cause instanceof Error ? cause.message : "We could not start this exam. Please try again.",
      );
    } finally {
      window.clearTimeout(timeout);
      setCreating(false);
      createInFlightRef.current = false;
    }
  }, [
    allCanonicalIds.length,
    catEligiblePathwayIds,
    creating,
    examMode,
    examSimulationEnabled,
    focusMode,
    pathwayId,
    pathwayOptions,
    questionCount,
    router,
    selectedCanonicalIds,
    selectedTopicNames,
  ]);

  const showCatPoolWarning =
    errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid ||
    errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pick_failed;
  const poolLikelyEmpty = discoveryReady && (discoveryTotal ?? 0) === 0 && topics.length === 0;

  const startDisabled = creating || !pathwayId.trim() || (examMode === "cat" && !catAvailableForPathway);
  const modeLabel = examMode === "cat" ? "CAT" : "Practice Exam";
  const setupSummary =
    discoveryReady && discoveryTotal !== null
      ? `${questionCount} questions · ${categorySummary} · ${discoveryTotal} available`
      : `${questionCount} questions · ${categorySummary}`;

  return (
    <SharedStudySetupLayout
      mode={examMode === "cat" ? "cat" : "practice-exam"}
      className="nn-practice-tests-hub-premium space-y-5 py-2 pb-24 sm:space-y-6 sm:py-3 md:pb-6"
      data-nn-e2e-practice-tests-hub
      data-nn-learner-area="practice-tests"
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="practice-tests"
    >
      {hubBootstrapSource === "secondary" ? (
        <div data-nn-practice-hub-bootstrap-source="secondary">
          <LearnerStudyLiveSyncBanner />
        </div>
      ) : null}

      <h1 className="sr-only">Practice Exam</h1>

      <header
        className="nn-flashcards-hub-workspace nn-premium-practice-hub-hero relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--semantic-panel-positive)_14%,var(--semantic-surface))_0%,var(--semantic-surface)_48%,color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))_100%)] px-5 py-6 sm:px-8 sm:py-8"
        data-nn-e2e-practice-compact-header
      >
        <div className="relative space-y-5">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-3)_85%,var(--semantic-text-secondary))]">
              {formatPathwayLabel(selectedPathway, pathwayDisplayName)}
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.85rem]">
              Build a {modeLabel} session
            </h2>
            <p className="mt-2 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-[0.9375rem]">
              Choose content the same way you build flashcards, then launch the exam workspace.
            </p>
          </div>
          <div
            className="border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_65%,transparent)] pt-5"
            data-nn-e2e-practice-session-preview
          >
            <p className="max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {setupSummary}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={createTest}
                disabled={startDisabled}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--semantic-brand)] px-8 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
                data-nn-qa-practice-hub-start-test
              >
                {creating ? (
                  <>
                    <LineChart className="mr-2 h-4 w-4 animate-pulse" aria-hidden />
                    Starting
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" aria-hidden />
                    Start
                  </>
                )}
              </button>
              <p className="text-xs text-[var(--semantic-text-muted)]">
                {examMode === "cat" ? "Adaptive rules apply after launch." : "Rationales appear in the focused exam workspace."}
              </p>
            </div>
          </div>
        </div>
      </header>

      <SharedStudySetupSurface
        className="nn-premium-practice-hub-builder"
        aria-labelledby="nn-practice-categories-heading"
        data-nn-e2e-practice-exams-builder
        data-nn-e2e-practice-canonical-grid
      >
        {!discoveryReady ? (
          <div className="space-y-4" aria-label="Loading categories">
            <div className="h-7 w-64 animate-pulse rounded-lg bg-[rgba(15,23,42,0.06)]" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-[rgba(15,23,42,0.045)]" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="min-h-[122px] animate-pulse rounded-2xl bg-[rgba(15,23,42,0.045)]" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <LearnerCategorySelector
              countsBySystem={countsByCanonical}
              selectedCanonicalIds={selectedCanonicalIds}
              onToggleCanonical={toggleCategory}
              search={categorySearch}
              onSearchChange={setCategorySearch}
              heading="Exam categories & body systems"
              headingId="nn-practice-categories-heading"
              intro="Use the same body-system picker as flashcards. Empty selection starts from the full question pool."
              searchPlaceholder="Search systems..."
              metaBySystem={metaBySystem}
            />

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)] pt-4">
              <button
                type="button"
                onClick={resetCategorySelection}
                data-active={selectedCanonicalIds.length === 0}
                aria-pressed={selectedCanonicalIds.length === 0}
                className="nn-flashcards-all-systems-btn inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] sm:min-h-9 sm:text-xs"
              >
                All systems
                {selectedCanonicalIds.length === 0 ? (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-surface))] text-[10px]" aria-hidden>
                    ✓
                  </span>
                ) : null}
              </button>
              {selectedCanonicalIds.length > 0 ? (
                <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_40%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)]">
                  {selectedCanonicalIds.length} system{selectedCanonicalIds.length === 1 ? "" : "s"} selected
                </span>
              ) : (
                <span className="text-xs text-[var(--semantic-text-muted)]">Tap systems below to focus your exam</span>
              )}
            </div>
          </>
        )}

        {poolLikelyEmpty ? (
          <div className="mt-5 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_24%,rgba(15,23,42,0.06))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,white)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
            This pathway is still syncing question discovery. You can start an exam, and the server will validate the available pool.
          </div>
        ) : null}
      </SharedStudySetupSurface>

      <details
        className="nn-flashcards-setup-panel nn-premium-practice-hub-builder nn-flashcards-collapsed-panel rounded-2xl border shadow-[var(--semantic-shadow-soft)]"
        data-nn-e2e-practice-setup-panel
        open
      >
        <summary className="cursor-pointer list-none rounded-xl px-4 py-3.5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,transparent)] sm:px-5">
          Fine-tune session length &amp; filters
          <span className="mt-0.5 block text-xs font-normal text-[var(--semantic-text-muted)]">
            Same setup pattern as flashcards; only the study mode changes
          </span>
        </summary>
        <div className="space-y-6 border-t border-[var(--semantic-border-soft)] px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
          {pathwayOptions.length > 1 ? (
            <div>
              <label htmlFor="practice-exam-pathway" className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                Exam Pathway
              </label>
              <select
                id="practice-exam-pathway"
                value={pathwayId}
                onChange={(event) => setPathwayId(event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-medium text-[var(--semantic-text-primary)] shadow-sm outline-none focus:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))]"
              >
                {pathwayOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <LearnerFilterBar title="Study mode" className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-none sm:p-5">
            <div className="flex flex-wrap gap-2">
              {(["practice", "cat"] as const).map((mode) => {
                const active = examMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setExamMode(mode)}
                    disabled={mode === "cat" && catEligibleOptions.length === 0}
                    data-active={active}
                    aria-pressed={active}
                    className="nn-flashcards-study-chip inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-9"
                  >
                    {mode === "cat" ? "CAT" : "Practice Exam"}
                  </button>
                );
              })}
            </div>
          </LearnerFilterBar>

          <LearnerFilterBar title="Study focus" className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-none sm:p-5">
            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All questions"],
                ["weak", "Weak areas"],
                ["missed", "Incorrect"],
                ...(examMode === "practice" ? ([["unseen", "Unstudied"]] as const) : []),
              ].map(([value, label]) => {
                const active = focusMode === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFocusMode(value as FocusMode)}
                    data-active={active}
                    aria-pressed={active}
                    className="nn-flashcards-study-chip inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] sm:min-h-9"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </LearnerFilterBar>

          <div className="space-y-4" data-nn-e2e-practice-session-size>
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Question count</p>
            <div className="nn-flashcards-session-segmented flex flex-col gap-2 sm:flex-row sm:flex-wrap" role="group" aria-label="Question count">
              {availableCounts.map((count) => {
                const active = questionCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    data-active={active}
                    aria-pressed={active}
                    onClick={() => setQuestionCount(count)}
                    className="nn-flashcards-session-segment min-h-12 flex-1 rounded-xl border border-[var(--semantic-border-soft)] px-4 py-3 text-sm font-bold text-[var(--semantic-text-secondary)] sm:min-w-[4.5rem] sm:flex-none"
                  >
                    {count}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3">
              <label className="text-sm font-medium text-[var(--semantic-text-secondary)]" htmlFor="practice-exam-count">
                Custom
              </label>
              <input
                id="practice-exam-count"
                data-nn-e2e-question-count
                type="number"
                min={examMode === "cat" ? 25 : 5}
                max={examMode === "cat" ? 75 : 100}
                value={questionCount}
                onChange={(event) => setQuestionCount(Math.max(5, Math.min(100, Number(event.target.value) || 50)))}
                className="nn-flashcards-custom-limit-input"
              />
              <span className="text-xs text-[var(--semantic-text-muted)]">
                {examMode === "cat" ? "25-75 questions" : "5-100 questions"}
              </span>
            </div>
          </div>

          {examMode === "cat" && !catAvailableForPathway ? (
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_24%,rgba(15,23,42,0.06))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,white)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
              CAT requires an eligible pathway. Choose an eligible pathway or switch to Practice Exam.
            </div>
          ) : null}

          {pathwayLessonPractice ? (
            <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--semantic-text-secondary)]">
              <span className="rounded-full border border-[rgba(15,23,42,0.06)] bg-white/70 px-3 py-1.5">
                {pathwayLessonPractice.practiceQuestionCount}
                {pathwayLessonPractice.practiceTruncated ? "+" : ""} linked questions
              </span>
              <span className="rounded-full border border-[rgba(15,23,42,0.06)] bg-white/70 px-3 py-1.5">
                {pathwayLessonPractice.publishedLessonCount} lessons
              </span>
            </div>
          ) : null}
        </div>
      </details>

      {error ? (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)]"
          role="alert"
        >
          <p>{showCatPoolWarning ? "This CAT pool is not ready for that setup yet. Try Practice Exam or broaden the categories." : error}</p>
          {sessionExpired ? (
            <button
              type="button"
              onClick={createTest}
              className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-semibold text-white"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      <LearnerSessionStartPanel
        primary={
          <button
            type="button"
            onClick={createTest}
            disabled={startDisabled}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--semantic-brand)] px-8 text-base font-bold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
            data-nn-qa-practice-hub-start-test-bottom
          >
            {creating ? (
              <>
                <LineChart className="mr-2 h-4 w-4 animate-pulse" aria-hidden />
                Starting
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" aria-hidden />
                Start
              </>
            )}
          </button>
        }
        secondary={<span className="text-xs text-[var(--semantic-text-muted)]">{setupSummary}</span>}
        className="md:hidden"
      />
    </SharedStudySetupLayout>
  );
}
