"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ClipboardList, LineChart, PlayCircle } from "lucide-react";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import { LearnerStudyPageShell } from "@/components/learner-study-ui";
import {
  discoveryTopicsForCanonicalFilters,
  getQuestionCountsByBodySystem,
  type CanonicalBodySystemId,
} from "@/lib/learner-study-hub/body-system-data";
import { buildCatExamStartPayload } from "@/lib/practice-tests/cat-exam-start-payload";
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
import { useHubPrefetch } from "@/lib/learner/use-hub-prefetch";

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
  initialDiscovery?: { buckets: TopicBucket[]; total: number } | null;
  initialCatMode?: boolean;
};

const PRACTICE_RESUME_STORAGE_KEY = "nursenest.practiceTests.resume.v1";
const PRACTICE_COUNT_MIN = 5;
const PRACTICE_COUNT_MAX = 100;
const CAT_COUNT_MIN = 25;
const CAT_COUNT_MAX = 75;

const CATEGORY_CARD_CLASS =
  "group relative flex min-h-[104px] w-full flex-col items-center justify-center gap-2 rounded-[1.25rem] border p-4 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_42%,transparent)]";

const SURFACE_CLASS =
  "rounded-[1.25rem] border border-[rgba(15,23,42,0.06)] bg-[rgba(255,255,255,0.85)] shadow-[0_16px_40px_rgba(15,23,42,0.06)]";

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

function clampQuestionCount(raw: string | null, mode: ExamMode): number | null {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) return null;
  const min = mode === "cat" ? CAT_COUNT_MIN : PRACTICE_COUNT_MIN;
  const max = mode === "cat" ? CAT_COUNT_MAX : PRACTICE_COUNT_MAX;
  return Math.max(min, Math.min(max, parsed));
}

function focusModeFromQuery(qp: URLSearchParams): FocusMode | null {
  const focus = qp.get("focus")?.trim().toLowerCase() || qp.get("studyFilter")?.trim().toLowerCase() || "";
  const source = qp.get("source")?.trim().toLowerCase() || "";
  const mode = qp.get("mode")?.trim().toLowerCase() || qp.get("studyMode")?.trim().toLowerCase() || "";
  if (focus === "weak" || source === "weak_areas" || mode === "weak" || mode === "weak_area") return "weak";
  if (focus === "missed" || focus === "incorrect" || source === "previously_incorrect") return "missed";
  if (focus === "unseen" || source === "not_studied") return "unseen";
  if (focus === "all") return "all";
  return null;
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
  initialDiscovery = null,
  initialCatMode = false,
}: PracticeTestsHubClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamString = useMemo(() => searchParams.toString(), [searchParams]);

  const fallbackPathwayId = defaultPathwayId ?? pathwayOptions[0]?.id ?? "";

  useHubPrefetch({
    pathwayId: defaultPathwayId,
    prefetch: ["questions", "flashcards", "lessons", "clinical-skills", "pharmacology", "ecg", "analytics", "readiness"],
  });

  const [pathwayId, setPathwayId] = useState(fallbackPathwayId);
  const [examMode, setExamMode] = useState<ExamMode>(() => (initialCatMode ? "cat" : "practice"));
  const [focusMode, setFocusMode] = useState<FocusMode>("all");
  const [questionCount, setQuestionCount] = useState(() => (initialCatMode ? CAT_COUNTS[0] : 50));
  const [selectedCanonicalIds, setSelectedCanonicalIds] = useState<CanonicalBodySystemId[]>([]);
  const [topics, setTopics] = useState<TopicBucket[]>(() => initialDiscovery?.buckets ?? []);
  const [discoveryTotal, setDiscoveryTotal] = useState<number | null>(() => initialDiscovery?.total ?? null);
  const [discoveryReady, setDiscoveryReady] = useState(() => initialDiscovery != null);
  const skipInitialDiscoveryFetchRef = useRef(initialDiscovery != null);
  const [creating, setCreating] = useState(false);
  const [launchingHref, setLaunchingHref] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [resumeHref, setResumeHref] = useState<string | null>(null);
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
    try {
      const raw = window.localStorage.getItem(PRACTICE_RESUME_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { href?: unknown; pathwayId?: unknown };
      const href = typeof parsed.href === "string" ? parsed.href.trim() : "";
      const storedPathwayId = typeof parsed.pathwayId === "string" ? parsed.pathwayId.trim() : "";
      if (href.startsWith("/app/practice-tests/") && (!storedPathwayId || storedPathwayId === pathwayId)) {
        setResumeHref(href);
      }
    } catch {
      setResumeHref(null);
    }
  }, [pathwayId]);

  useEffect(() => {
    const qp = new URLSearchParams(searchParamString);
    const catLaunch = qp.get("catLaunch")?.trim().toLowerCase();
    if (catLaunch === "1" || catLaunch === "true") {
      setExamMode("cat");
      setQuestionCount((current) => ((CAT_COUNTS as readonly number[]).includes(current) ? current : CAT_COUNTS[0]));
    }
    const urlPathwayId = qp.get("pathwayId")?.trim();
    if (urlPathwayId && pathwayOptions.some((option) => option.id === urlPathwayId)) {
      setPathwayId(urlPathwayId);
    }
    if (qp.get("startMode") === "practice_exam") {
      setExamMode("practice");
    }
    const incomingCount = clampQuestionCount(
      qp.get("count"),
      catLaunch === "1" || catLaunch === "true" ? "cat" : "practice",
    );
    if (incomingCount != null) {
      setQuestionCount(incomingCount);
    }
    const incomingFocus = focusModeFromQuery(qp);
    if (incomingFocus) {
      setFocusMode(incomingFocus);
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
    if (!(availableCounts as readonly number[]).includes(questionCount)) {
      setQuestionCount(availableCounts[0]);
    }
  }, [availableCounts, questionCount]);

  useEffect(() => {
    let cancelled = false;
    const pid = pathwayId.trim();
    if (!pid) {
      setTopics([]);
      setDiscoveryTotal(null);
      setDiscoveryReady(true);
      return;
    }

    if (skipInitialDiscoveryFetchRef.current) {
      skipInitialDiscoveryFetchRef.current = false;
      return;
    }

    setDiscoveryReady(false);
    setTopics([]);
    setDiscoveryTotal(null);

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

  const resumeSession = useCallback(() => {
    if (!resumeHref) return;
    setCreating(true);
    setLaunchingHref(resumeHref);
    setError(null);
    setErrorCode(null);
    setSessionExpired(false);
    safeRouterReplace(router, resumeHref, {
      fallbackDelayMs: 800,
      hardFallbackDelayMs: 5000,
      context: {
        feature: "practice_tests_resume",
        pathwayId,
      },
    });
  }, [pathwayId, resumeHref, router]);

  const createTest = useCallback(async () => {
    if (creating || createInFlightRef.current) return;
    createInFlightRef.current = true;
    setCreating(true);
    setLaunchingHref(null);
    setError(null);
    setErrorCode(null);
    setSessionExpired(false);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 28_000);
    let navigationStarted = false;

    try {
      const trimmedPathwayId = pathwayId.trim();
      if (!trimmedPathwayId) {
        throw new Error("Choose an exam pathway before starting.");
      }
      if (examMode === "cat" && !catEligiblePathwayIds.includes(trimmedPathwayId)) {
        throw new Error("CAT is not available for this pathway yet. Choose Practice Exam or another pathway.");
      }

      const selectedCategories =
        selectedCanonicalIds.length === 0 || selectedCanonicalIds.length >= allCanonicalIds.length
          ? []
          : selectedCanonicalIds;
      const filterLabel =
        examMode === "cat"
          ? "all"
          : focusMode === "weak"
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
        mode: examMode === "cat" ? "cat_exam" : "practice_exam",
        selectedCategories,
        filters: {
          hubFilter: filterLabel,
        },
        count: questionCount,
        shuffle: true,
      };

      const payload =
        examMode === "cat"
          ? buildCatExamStartPayload({
              pathwayId: trimmedPathwayId,
              catSelectionBasis: focusToCatBasis(focusMode),
              studyLaunchPayload,
            })
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
                sessionMode: "tutor",
                rationaleVisibilityMode: "immediate",
                linearAllowReviewNavigation: true,
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
        emitRuntimeEvent("practice_exam_session_create_result", {
          pathwayId: trimmedPathwayId,
          nursingTier: inferRuntimeNursingTier(trimmedPathwayId),
          runtimeMode: "practice_exam",
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

      emitRuntimeEvent("practice_exam_session_create_result", {
        pathwayId: trimmedPathwayId,
        sessionId: data.id,
        nursingTier: inferRuntimeNursingTier(trimmedPathwayId),
        runtimeMode: "practice_exam",
        bootstrapSurface: "practice_tests_hub",
        status: res.status,
        ok: true,
        surface: "practice_tests_hub",
      });
      const destination = `/app/practice-tests/${encodeURIComponent(data.id)}?pathwayId=${encodeURIComponent(trimmedPathwayId)}`;
      navigationStarted = true;
      setLaunchingHref(destination);
      try {
        window.localStorage.setItem(
          PRACTICE_RESUME_STORAGE_KEY,
          JSON.stringify({
            href: destination,
            pathwayId: trimmedPathwayId,
            mode: examMode,
            focusMode,
            questionCount,
            categoryIds: selectedCanonicalIds,
            savedAt: Date.now(),
          }),
        );
        setResumeHref(destination);
      } catch {
        /* local continuity is best-effort; the server session remains canonical. */
      }
      safeRouterReplace(router, destination, {
        fallbackDelayMs: 1200,
        hardFallbackDelayMs: 5000,
        context: {
          feature: examMode === "cat" ? "cat_hub_launch" : "practice_tests_hub_launch",
          pathwayId: trimmedPathwayId,
          sessionId: data.id,
        },
      });
    } catch (cause) {
      setLaunchingHref(null);
      const aborted = cause instanceof DOMException && cause.name === "AbortError";
      setError(
        aborted
          ? "Starting this exam timed out. Your progress is safe; check your connection and try again."
          : cause instanceof Error ? cause.message : "We could not start this exam. Please try again.",
      );
    } finally {
      window.clearTimeout(timeout);
      if (!navigationStarted) {
        setCreating(false);
        createInFlightRef.current = false;
      }
    }
  }, [
    allCanonicalIds.length,
    catEligiblePathwayIds,
    creating,
    examMode,
    focusMode,
    pathwayId,
    questionCount,
    router,
    selectedCanonicalIds,
    selectedTopicNames,
  ]);

  const showCatPoolWarning =
    errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid ||
    errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pick_failed;
  const poolLikelyEmpty = discoveryReady && (discoveryTotal ?? 0) === 0 && topics.length === 0;
  const isLaunching = Boolean(launchingHref);
  const startDisabled = creating || isLaunching || !pathwayId.trim() || (examMode === "cat" && !catAvailableForPathway);

  return (
    <LearnerStudyPageShell
      className="nn-practice-tests-hub-premium py-4 sm:py-6"
      data-nn-e2e-practice-tests-hub
      data-nn-practice-exam-hub-convergence=""
      data-nn-learner-area="practice-tests"
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="practice-tests"
    >
      {hubBootstrapSource === "secondary" ? (
        <div className="mx-auto max-w-4xl" data-nn-practice-hub-bootstrap-source="secondary">
          <LearnerStudyLiveSyncBanner />
        </div>
      ) : null}

      <header className="mx-auto max-w-4xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(15,23,42,0.06)] bg-white/85 text-[var(--semantic-brand)] shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <ClipboardList className="h-6 w-6" aria-hidden strokeWidth={2} />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">
          {formatPathwayLabel(selectedPathway, pathwayDisplayName)}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[var(--semantic-text-primary)] sm:text-4xl">
          Practice Exam
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--semantic-text-secondary)] sm:text-base">
          Select your categories, choose the exam type, and start a focused session.
        </p>
      </header>

      {resumeHref ? (
        <div
          className={`${SURFACE_CLASS} mx-auto max-w-5xl p-5 sm:p-6`}
          data-nn-e2e-practice-resume
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--semantic-info)]">
                Active session
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
                Continue where you left off
              </p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                {examMode === "cat" ? "CAT" : "Practice Exam"} · {questionCount} questions
              </p>
            </div>
            <button
              type="button"
              onClick={resumeSession}
              data-nn-e2e-practice-resume-session
              className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_88%,var(--semantic-text-primary))] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-info)_24%,transparent)] transition hover:brightness-[1.03]"
            >
              Resume session
            </button>
          </div>
        </div>
      ) : null}

      <section className={`${SURFACE_CLASS} mx-auto max-w-5xl p-5 sm:p-6`} data-nn-e2e-practice-exams-builder>
        <div className="flex flex-col gap-4 border-b border-[rgba(15,23,42,0.06)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Categories</h2>
            <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
              {categorySummary}
              {discoveryReady && discoveryTotal !== null ? ` · ${discoveryTotal} available questions` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={resetCategorySelection}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[rgba(15,23,42,0.08)] bg-white/80 px-4 text-sm font-medium text-[var(--semantic-text-secondary)] transition hover:bg-white"
          >
            All Categories
          </button>
        </div>

        {!discoveryReady ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Loading categories">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="min-h-[104px] animate-pulse rounded-[1.25rem] bg-[rgba(15,23,42,0.045)]" />
            ))}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" data-nn-e2e-practice-canonical-grid>
            {CANONICAL_STUDY_CATEGORIES.map((category) => {
              const id = category.id as CanonicalBodySystemId;
              const active = selectedCanonicalIds.length === 0 || selectedCanonicalIds.includes(id);
              const count = countsByCanonical[id] ?? 0;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleCategory(id)}
                  className={`${CATEGORY_CARD_CLASS} ${
                    active
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_28%,rgba(15,23,42,0.06))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,white)] shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
                      : "border-[rgba(15,23,42,0.06)] bg-white/80 hover:bg-white"
                  }`}
                >
                  <span
                    className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                      active
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)] bg-[var(--semantic-brand)] text-white"
                        : "border-[rgba(15,23,42,0.12)] bg-white"
                    }`}
                    aria-hidden
                  >
                    {active ? <Check className="h-3.5 w-3.5" strokeWidth={2.4} /> : null}
                  </span>
                  <span className="max-w-[11rem] text-sm font-semibold leading-5 text-[var(--semantic-text-primary)]">
                    {category.label}
                  </span>
                  <span className="text-xs font-medium text-[var(--semantic-text-secondary)]">
                    {count > 0 ? `${count} questions` : "Included"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {poolLikelyEmpty ? (
          <div className="mt-5 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_24%,rgba(15,23,42,0.06))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,white)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
            This pathway is still syncing question discovery. You can start an exam, and the server will validate the available pool.
          </div>
        ) : null}
      </section>

      <section
        className={`${SURFACE_CLASS} mx-auto max-w-5xl p-5 sm:p-6`}
        data-nn-e2e-practice-setup-panel
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-start">
          <div className="space-y-5">
            {pathwayOptions.length > 1 ? (
              <div>
                <label htmlFor="practice-exam-pathway" className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  Exam Pathway
                </label>
                <select
                  id="practice-exam-pathway"
                  value={pathwayId}
                  onChange={(event) => setPathwayId(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white px-4 text-sm font-medium text-[var(--semantic-text-primary)] shadow-sm outline-none focus:border-[color-mix(in_srgb,var(--semantic-brand)_40%,rgba(15,23,42,0.08))]"
                >
                  {pathwayOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Exam Mode</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(["practice", "cat"] as const).map((mode) => {
                  const active = examMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setExamMode(mode)}
                      disabled={mode === "cat" && catEligibleOptions.length === 0}
                      className={`flex h-12 items-center justify-center rounded-full border px-5 text-sm font-semibold transition ${
                        active
                          ? "border-[color-mix(in_srgb,var(--semantic-brand)_32%,rgba(15,23,42,0.06))] bg-[var(--semantic-brand)] text-white shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
                          : "border-[rgba(15,23,42,0.08)] bg-white/80 text-[var(--semantic-text-primary)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                      }`}
                    >
                      {mode === "cat" ? "CAT" : "Practice Exam"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Study Focus</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  ["all", "All Questions"],
                  ["weak", "Weak Areas"],
                  ["missed", "Incorrect"],
                  ...(examMode === "practice" ? ([["unseen", "Unstudied"]] as const) : []),
                ].map(([value, label]) => {
                  const active = focusMode === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFocusMode(value as FocusMode)}
                      className={`h-10 rounded-full border px-4 text-sm font-medium transition ${
                        active
                          ? "border-[color-mix(in_srgb,var(--semantic-brand)_32%,rgba(15,23,42,0.06))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,white)] text-[var(--semantic-text-primary)]"
                          : "border-[rgba(15,23,42,0.08)] bg-white/80 text-[var(--semantic-text-secondary)] hover:bg-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="rounded-[1.25rem] border border-[rgba(15,23,42,0.06)] bg-white/70 p-4"
            data-nn-e2e-practice-session-size
          >
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Question Count</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {availableCounts.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`h-11 rounded-full border text-sm font-semibold transition ${
                    questionCount === count
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_32%,rgba(15,23,42,0.06))] bg-[var(--semantic-brand)] text-white"
                      : "border-[rgba(15,23,42,0.08)] bg-white text-[var(--semantic-text-primary)] hover:bg-[rgba(255,255,255,0.92)]"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <label htmlFor="practice-exam-count" className="sr-only">
              Question count
            </label>
            <input
              id="practice-exam-count"
              data-nn-e2e-question-count
              type="number"
              min={examMode === "cat" ? CAT_COUNT_MIN : PRACTICE_COUNT_MIN}
              max={examMode === "cat" ? CAT_COUNT_MAX : PRACTICE_COUNT_MAX}
              value={questionCount}
              onChange={(event) =>
                setQuestionCount(
                  Math.max(
                    examMode === "cat" ? CAT_COUNT_MIN : PRACTICE_COUNT_MIN,
                    Math.min(
                      examMode === "cat" ? CAT_COUNT_MAX : PRACTICE_COUNT_MAX,
                      Number(event.target.value) || 50,
                    ),
                  ),
                )
              }
              className="mt-3 h-11 w-full rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-4 text-center text-sm font-semibold text-[var(--semantic-text-primary)]"
            />
            <p className="mt-3 text-center text-xs text-[var(--semantic-text-secondary)]">
              {questionCount} questions · {categorySummary}
            </p>
          </div>
        </div>

        {examMode === "cat" && !catAvailableForPathway ? (
          <div className="mt-5 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_24%,rgba(15,23,42,0.06))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,white)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
            CAT requires an eligible pathway. Choose an eligible pathway or switch to Practice Exam.
          </div>
        ) : null}
      </section>

      {error ? (
        <div
          className="mx-auto max-w-3xl rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-danger)_28%,rgba(15,23,42,0.06))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,white)] px-5 py-4 text-center text-sm text-[var(--semantic-text-primary)]"
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

      <div className="mx-auto flex max-w-5xl justify-center pb-3">
        <button
          type="button"
          onClick={createTest}
          disabled={startDisabled}
          className="inline-flex h-12 min-w-[160px] items-center justify-center whitespace-nowrap rounded-full bg-[var(--semantic-brand)] px-7 text-center text-sm font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.16)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55"
          data-nn-qa-practice-hub-start-test
        >
          {isLaunching ? (
            <>
              <LineChart className="mr-2 h-4 w-4 animate-pulse" aria-hidden />
              Opening…
            </>
          ) : creating ? (
            <>
              <LineChart className="mr-2 h-4 w-4 animate-pulse" aria-hidden />
              Starting
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" aria-hidden />
              Start Exam
            </>
          )}
        </button>
      </div>
    </LearnerStudyPageShell>
  );
}
