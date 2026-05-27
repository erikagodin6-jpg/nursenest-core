"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClipboardCheck, LineChart, PlayCircle, Shuffle, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import {
  LearnerCategorySelector,
  LearnerFilterBar,
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

const PRACTICE_COUNTS = [10, 25, 50, 75, 100] as const;
const CAT_COUNTS = [25, 50, 75] as const;
const PRACTICE_COUNT_MIN = 5;
const PRACTICE_COUNT_MAX = 100;
const CAT_COUNT_MIN = 25;
const CAT_COUNT_MAX = 75;
const CAT_EXAM_QUESTION_COUNT = 85;
const CAT_EXAM_TIME_LIMIT_SEC = 300 * 60;
const PRACTICE_RESUME_STORAGE_KEY = "nursenest.practiceTests.resume.v1";

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
  pathwayOptions = [],
  defaultPathwayId = null,
  pathwayDisplayName = "",
  catEligiblePathwayIds = [],
  hubBootstrapSource = "primary",
  initialCatMode = false,
}: PracticeTestsHubClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamString = useMemo(() => searchParams.toString(), [searchParams]);

  const fallbackPathwayId = defaultPathwayId ?? pathwayOptions[0]?.id ?? "";
  const [pathwayId, setPathwayId] = useState(fallbackPathwayId);
  const [examMode, setExamMode] = useState<ExamMode>(() => (initialCatMode ? "cat" : "practice"));
  const [focusMode, setFocusMode] = useState<FocusMode>("all");
  const [questionCount, setQuestionCount] = useState(() => (initialCatMode ? CAT_COUNTS[0] : 50));
  const [selectedCanonicalIds, setSelectedCanonicalIds] = useState<CanonicalBodySystemId[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [topics, setTopics] = useState<TopicBucket[]>([]);
  const [discoveryTotal, setDiscoveryTotal] = useState<number | null>(null);
  const [discoveryReady, setDiscoveryReady] = useState(false);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
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
      setQuestionCount((current) => (CAT_COUNTS as readonly number[]).includes(current) ? current : CAT_COUNTS[0]);
    }
    const urlPathwayId = qp.get("pathwayId")?.trim();
    if (urlPathwayId && pathwayOptions.some((option) => option.id === urlPathwayId)) {
      setPathwayId(urlPathwayId);
    }
    const incomingCount = clampQuestionCount(qp.get("count"), catLaunch === "1" || catLaunch === "true" ? "cat" : "practice");
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
    setDiscoveryLoading(true);
    if (!pid) {
      setTopics([]);
      setDiscoveryTotal(null);
      setDiscoveryReady(true);
      setDiscoveryLoading(false);
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
            setDiscoveryLoading(false);
          }
          return;
        }
        const data = (await res.json()) as { buckets?: TopicBucket[]; total?: number };
        if (!cancelled) {
          setTopics(Array.isArray(data.buckets) ? data.buckets : []);
          setDiscoveryTotal(typeof data.total === "number" ? data.total : null);
          setDiscoveryReady(true);
          setDiscoveryLoading(false);
        }
      } catch {
        if (!cancelled) {
          setDiscoveryReady(true);
          setDiscoveryLoading(false);
        }
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

      const selectedCategories =
        selectedCanonicalIds.length === 0 ||
        selectedCanonicalIds.length >= allCanonicalIds.length
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
          ? {
              title: "CAT Exam Simulation",
              questionCount: CAT_EXAM_QUESTION_COUNT,
              topicNames: [],
              difficultyMin: null,
              difficultyMax: null,
              selectionMode: "cat" as const,
              catSelectionBasis: focusToCatBasis(focusMode),
              catPresentationMode: "exam_simulation" as const,
              catExamFeedbackMode: "test" as const,
              pathwayId: trimmedPathwayId,
              timedMode: true,
              timeLimitSec: CAT_EXAM_TIME_LIMIT_SEC,
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
            mode: "practice",
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
  const poolLikelyEmpty = discoveryReady && !discoveryLoading && (discoveryTotal ?? 0) === 0 && topics.length === 0;

  const isLaunching = Boolean(launchingHref);
  const startDisabled = creating || isLaunching || !pathwayId.trim() || (examMode === "cat" && !catAvailableForPathway);
  const modeLabel = examMode === "cat" ? "CAT" : "Practice Exam";
  const setupSummary =
    discoveryReady && discoveryTotal !== null
      ? `${questionCount} questions · ${categorySummary} · ${discoveryTotal} available`
      : `${questionCount} questions · ${categorySummary}`;
  const heroEyebrow = formatPathwayLabel(selectedPathway, pathwayDisplayName);
  const heroTitle = `${modeLabel} study`;
  const heroSubtitle =
    "Build a focused exam session from the same pathway and body-system setup used across NurseNest study tools.";
  const sessionPreviewCopy =
    examMode === "cat"
      ? `${questionCount} adaptive questions tuned to your selected systems.`
      : `${questionCount} practice questions with review-ready scoring and rationales.`;
  const ctaSubline =
    discoveryReady && discoveryTotal !== null
      ? `${categorySummary} · ${discoveryTotal} available questions`
      : `${categorySummary} · pathway pool syncing`;
  const catLandingFeatures: Array<{ icon: LucideIcon; title: string; body: string }> = [
    {
      icon: Shuffle,
      title: "Real adaptive logic",
      body: "Correct answers raise difficulty. Misses recalibrate the next item.",
    },
    {
      icon: ClipboardCheck,
      title: "NGN formats",
      body: "Modern item types appear in the same focused exam workspace.",
    },
    {
      icon: Target,
      title: "Domain tracking",
      body: "Results summarize readiness across NCLEX client-needs categories.",
    },
  ];
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

  if (examMode !== "cat") return (
    <SharedStudySetupLayout
      mode="practice-exam"
      className="nn-practice-tests-hub-premium space-y-5 py-2 pb-24 sm:space-y-6 sm:py-3 md:pb-6"
      data-nn-e2e-practice-tests-hub
      data-nn-e2e-practice-single-landing
      data-nn-learner-area="practice-tests"
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="practice-tests"
    >
      {hubBootstrapSource === "secondary" ? <LearnerStudyLiveSyncBanner /> : null}

      <h1 className="sr-only">Practice Questions</h1>

      <header
        className="nn-flashcards-hub-workspace nn-flashcards-hub-hero relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--semantic-panel-positive)_14%,var(--semantic-surface))_0%,var(--semantic-surface)_48%,color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))_100%)] px-5 py-6 sm:px-8 sm:py-8"
        data-nn-e2e-practice-compact-header
      >
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-1)_12%,transparent)] blur-3xl"
          aria-hidden
        />
        <div className="relative space-y-6 sm:space-y-7">
          <div className="space-y-4">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-3)_85%,var(--semantic-text-secondary))]">
                {heroEyebrow}
              </p>
              <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.85rem]">
                Practice Questions
              </h2>
              <p className="mt-2 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-[0.9375rem]">
                Start a focused NCLEX-style practice run with the modern exam workspace, answer locking, and rationales after each item.
              </p>
            </div>
          </div>

          <div
            className="nn-flashcards-hero-action-row border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_65%,transparent)] pt-5"
            data-nn-e2e-practice-exam-band
          >
            <p
              className="max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)]"
              data-nn-e2e-practice-session-preview
            >
              {questionCount} NCLEX-style questions · immediate rationales · {heroEyebrow}
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={createTest}
                  disabled={startDisabled}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--semantic-brand)] px-8 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
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
                      Starting…
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" aria-hidden />
                      Start
                    </>
                  )}
                </button>
                <p
                  className="mt-2 text-center text-xs text-[var(--semantic-text-muted)] sm:text-left"
                  data-nn-e2e-practice-cta-subline
                >
                  {ctaSubline}
                </p>
              </div>
              <div className="nn-flashcards-deck-match-inline flex items-center gap-3 text-xs text-[var(--semantic-text-secondary)] lg:shrink-0">
                <span>
                  <span className="font-semibold text-[var(--semantic-text-primary)]">Question pool </span>
                  <span className="tabular-nums text-base font-bold text-[var(--semantic-text-primary)]">
                    {discoveryTotal != null ? discoveryTotal : "—"}
                  </span>
                </span>
                <span className="hidden h-4 w-px bg-[var(--semantic-border-soft)] sm:inline" aria-hidden />
                <span className="hidden sm:inline">{setupSummary}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {error ? (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)]"
          role="alert"
        >
          {error}
        </div>
      ) : null}
    </SharedStudySetupLayout>
  );

  if (examMode === "cat") {
    return (
      <SharedStudySetupLayout
        mode="cat"
        className="nn-practice-tests-hub-premium space-y-0 py-0 pb-0"
        data-nn-e2e-practice-tests-hub
        data-nn-e2e-cat-simple-landing
        data-nn-learner-area="practice-tests"
        data-nn-premium-full-platform-convergence=""
        data-nn-premium-platform-family="exam-study"
        data-nn-premium-platform-module="practice-tests"
      >
        {hubBootstrapSource === "secondary" ? (
          <div className="mb-4" data-nn-practice-hub-bootstrap-source="secondary">
            <LearnerStudyLiveSyncBanner />
          </div>
        ) : null}

        <section className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] shadow-[0_24px_80px_color-mix(in_srgb,var(--semantic-info)_10%,transparent)]">
          <div className="grid min-h-[34rem] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
            <div className="relative flex min-h-[30rem] items-center overflow-hidden bg-[color-mix(in_srgb,var(--semantic-info)_13%,var(--semantic-surface))] px-6 py-12 sm:px-10 lg:px-14">
              <div
                className="pointer-events-none absolute inset-y-0 right-[-12%] hidden w-[22%] skew-x-[-4deg] bg-[var(--semantic-surface)] lg:block"
                aria-hidden
              />
              <div className="relative max-w-xl">
                <p className="inline-flex rounded-full bg-[var(--semantic-surface)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-info)] shadow-sm">
                  NCLEX · CAT exam prep
                </p>
                <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-[var(--semantic-text-primary)] sm:text-5xl">
                  Adaptive questions that make the real{" "}
                  <span className="text-[var(--semantic-info)]">exam feel familiar.</span>
                </h1>
                <p className="mt-6 max-w-prose text-base leading-8 text-[var(--semantic-text-secondary)] sm:text-lg">
                  NurseNest mirrors NCLEX-style adaptive delivery: answer, submit, and move forward in a focused exam interface without mid-exam rationales.
                </p>
                <button
                  type="button"
                  onClick={createTest}
                  disabled={startDisabled}
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--semantic-brand)] px-8 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-brand)_24%,transparent)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
                  data-nn-e2e-cat-start-exam
                >
                  {isLaunching ? (
                    <>
                      <LineChart className="mr-2 h-4 w-4 animate-pulse" aria-hidden />
                      Opening…
                    </>
                  ) : creating ? (
                    <>
                      <LineChart className="mr-2 h-4 w-4 animate-pulse" aria-hidden />
                      Starting…
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" aria-hidden />
                      Start
                    </>
                  )}
                </button>
                {!catAvailableForPathway ? (
                  <p className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
                    CAT is not available for this pathway yet.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-center bg-[var(--semantic-surface)] px-6 py-12 sm:px-10 lg:px-14">
              <div className="w-full max-w-lg rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-6 shadow-[0_24px_70px_color-mix(in_srgb,var(--semantic-info)_13%,transparent)]">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] px-3 py-1.5 text-xs font-bold uppercase text-[var(--semantic-info)]">
                    Basic care & comfort
                  </span>
                  <span className="text-xs font-medium text-[var(--semantic-text-muted)]">Adaptive item</span>
                </div>
                <p className="text-base font-semibold leading-7 text-[var(--semantic-text-primary)]">
                  A nurse is caring for a client who is 1 day postpartum and breastfeeding. Which instruction does the nurse give first?
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    ["A", "Apply lanolin cream after each feeding", false],
                    ["B", "Assess latch position and technique with the next feeding", true],
                    ["C", "Alternate breast and formula feeding to rest nipples", false],
                    ["D", "Apply warm compresses for 10 minutes before feeding", false],
                  ].map(([letter, text, selected]) => (
                    <div
                      key={String(letter)}
                      className={
                        selected
                          ? "flex min-h-11 items-center gap-3 rounded-xl border border-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] px-3 text-sm font-semibold text-[var(--semantic-text-primary)]"
                          : "flex min-h-11 items-center gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-secondary)]"
                      }
                    >
                      <span
                        className={
                          selected
                            ? "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--semantic-success)] text-xs font-bold text-white"
                            : "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_70%,var(--semantic-surface))] text-xs font-bold text-[var(--semantic-text-muted)]"
                        }
                      >
                        {letter}
                      </span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-[var(--semantic-border-soft)] pt-4 text-xs font-medium text-[var(--semantic-text-muted)]">
                  No rationales during the exam · Next item adapts after you submit
                </div>
              </div>
            </div>
          </div>

          <div className="grid border-t border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-center sm:grid-cols-4">
            {[
              ["2,400+", "Questions"],
              ["CAT", "Adaptive engine"],
              ["NGN", "Formats"],
              [heroEyebrow, "Current pathway"],
            ].map(([value, label]) => (
              <div key={`${value}-${label}`} className="border-b border-[var(--semantic-border-soft)] px-4 py-6 sm:border-b-0 sm:border-r last:border-r-0">
                <p className="text-3xl font-extrabold text-[var(--semantic-text-primary)]">{value}</p>
                <p className="mt-1 text-xs font-medium text-[var(--semantic-text-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] px-0 py-8 md:grid-cols-3">
          {catLandingFeatures.map(({ icon: Icon, title, body }) => (
            <article
              key={String(title)}
              className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-6 shadow-sm"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-info)]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-base font-bold text-[var(--semantic-text-primary)]">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
            </article>
          ))}
        </section>

        {error ? (
          <div
            className="mt-5 rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)]"
            role="alert"
          >
            {showCatPoolWarning
              ? "This CAT pool is not ready yet. Try again shortly."
              : error}
          </div>
        ) : null}
      </SharedStudySetupLayout>
    );
  }

  return (
    <SharedStudySetupLayout
      mode="practice-exam"
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
        className="nn-flashcards-hub-workspace nn-flashcards-hub-hero relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--semantic-panel-positive)_14%,var(--semantic-surface))_0%,var(--semantic-surface)_48%,color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))_100%)] px-5 py-6 sm:px-8 sm:py-8"
        data-nn-e2e-practice-compact-header
      >
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-1)_12%,transparent)] blur-3xl"
          aria-hidden
        />
        <div className="relative space-y-6 sm:space-y-7">
          <div className="space-y-4">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-3)_85%,var(--semantic-text-secondary))]">
                {heroEyebrow}
              </p>
              <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.85rem]">
                {heroTitle}
              </h2>
              <p className="mt-2 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-[0.9375rem]">
                {heroSubtitle}
              </p>
            </div>
          </div>

          <div
            className="nn-flashcards-hero-action-row border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_65%,transparent)] pt-5"
            data-nn-e2e-practice-exam-band
          >
            <p
              className="max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)]"
              data-nn-e2e-practice-session-preview
            >
              {sessionPreviewCopy}
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={createTest}
                  disabled={startDisabled}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--semantic-brand)] px-8 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
                  data-nn-qa-practice-hub-start-test
                >
                  {isLaunching ? (
                    <>
                      <LineChart className="mr-2 h-4 w-4 animate-pulse" aria-hidden />
                      Opening {modeLabel}…
                    </>
                  ) : creating ? (
                    <>
                      <LineChart className="mr-2 h-4 w-4 animate-pulse" aria-hidden />
                      Starting…
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" aria-hidden />
                      Start
                    </>
                  )}
                </button>
                <p
                  className="mt-2 text-center text-xs text-[var(--semantic-text-muted)] sm:text-left"
                  data-nn-e2e-practice-cta-subline
                >
                  {ctaSubline}
                </p>
              </div>
              <div className="nn-flashcards-deck-match-inline flex items-center gap-3 text-xs text-[var(--semantic-text-secondary)] lg:shrink-0">
                <span>
                  <span className="font-semibold text-[var(--semantic-text-primary)]">Question pool </span>
                  <span className="tabular-nums text-base font-bold text-[var(--semantic-text-primary)]">
                    {discoveryTotal != null ? discoveryTotal : "—"}
                  </span>
                </span>
                <span className="hidden h-4 w-px bg-[var(--semantic-border-soft)] sm:inline" aria-hidden />
                <span className="hidden sm:inline">{setupSummary}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SharedStudySetupSurface
        className="nn-flashcards-deck-library-surface"
        aria-labelledby="nn-practice-categories-heading"
        data-nn-e2e-practice-exams-builder
        data-nn-e2e-practice-canonical-grid
      >
        {!discoveryReady ? (
          <div className="space-y-4" aria-label="Loading categories" aria-busy="true">
            <div className="h-7 w-64 animate-pulse rounded-lg bg-[rgba(15,23,42,0.06)]" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-[rgba(15,23,42,0.045)]" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="min-h-[122px] animate-pulse rounded-2xl bg-[rgba(15,23,42,0.045)]" />
              ))}
            </div>
          </div>
        ) : (
          <div
            className={
              discoveryLoading
                ? "pointer-events-none opacity-50 transition-opacity duration-200"
                : "transition-opacity duration-200"
            }
            aria-busy={discoveryLoading}
          >
            <LearnerCategorySelector
              countsBySystem={countsByCanonical}
              selectedCanonicalIds={selectedCanonicalIds}
              onToggleCanonical={toggleCategory}
              search={categorySearch}
              onSearchChange={setCategorySearch}
              heading="Select categories"
              headingId="nn-practice-categories-heading"
              searchPlaceholder="Search systems…"
              intro="Systems adapt to your performance — weak areas, suggested focus, and question depth appear on each tile."
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
          </div>
        )}

        {poolLikelyEmpty ? (
          <div className="mt-5 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_24%,rgba(15,23,42,0.06))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,white)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
            This pathway is still syncing question discovery. You can start an exam, and the server will validate the available pool.
          </div>
        ) : null}
      </SharedStudySetupSurface>

      <details
        className="nn-flashcards-setup-panel nn-flashcards-hub-setup-panel nn-flashcards-collapsed-panel rounded-2xl border shadow-[var(--semantic-shadow-soft)]"
        data-nn-e2e-practice-setup-panel
      >
        <summary className="cursor-pointer list-none rounded-xl px-4 py-3.5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,transparent)] sm:px-5">
          Fine-tune session length &amp; filters
          <span className="mt-0.5 block text-xs font-normal text-[var(--semantic-text-muted)]">
            Optional — most learners start with the defaults
          </span>
        </summary>
        <div className="space-y-6 border-t border-[var(--semantic-border-soft)] px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
            <LearnerFilterBar
              title="Exam mode"
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-none sm:p-5"
            >
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
                      className="nn-flashcards-study-chip inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-secondary)] disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-9"
                    >
                      {mode === "cat" ? "CAT Adaptive" : "Practice Exam"}
                    </button>
                  );
                })}
              </div>
            </LearnerFilterBar>

            <LearnerFilterBar
              title="Focus"
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-none sm:p-5"
            >
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["all", "All questions"],
                    ["weak", "Weak areas"],
                    ["missed", "Incorrect"],
                    ...(examMode === "practice" ? ([["unseen", "Unstudied"]] as const) : []),
                  ] as const
                ).map(([value, label]) => {
                  const active = focusMode === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFocusMode(value as FocusMode)}
                      data-active={active}
                      aria-pressed={active}
                      className="nn-flashcards-study-chip inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-secondary)] sm:min-h-9"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </LearnerFilterBar>
          </div>

          <div
            className="space-y-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-none sm:p-5"
            data-nn-e2e-practice-session-size
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Question count</p>
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-secondary)]">
                {questionCount} questions
              </span>
            </div>
            <div
              className="nn-flashcards-session-segmented flex flex-col gap-2 sm:flex-row sm:flex-wrap"
              role="group"
              aria-label="Question count"
            >
              {availableCounts.map((count) => {
                const active = questionCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    data-active={active}
                    aria-pressed={active}
                    onClick={() => setQuestionCount(count)}
                    className="nn-flashcards-session-segment min-h-10 flex-1 rounded-xl border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] sm:min-w-[4.5rem] sm:flex-none"
                  >
                    {count}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--semantic-text-muted)]">
              <label className="font-medium" htmlFor="practice-exam-count">
                Custom
              </label>
              <input
                id="practice-exam-count"
                data-nn-e2e-question-count
                type="number"
                min={PRACTICE_COUNT_MIN}
                max={PRACTICE_COUNT_MAX}
                value={questionCount}
                onChange={(event) =>
                  setQuestionCount(
                    Math.max(
                      PRACTICE_COUNT_MIN,
                      Math.min(PRACTICE_COUNT_MAX, Number(event.target.value) || 50),
                    ),
                  )
                }
                className="nn-flashcards-custom-limit-input h-9 w-24 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm font-semibold text-[var(--semantic-text-primary)]"
              />
              <span>
                {PRACTICE_COUNT_MIN}-{PRACTICE_COUNT_MAX} allowed
              </span>
            </div>
          </div>
        </div>
      </details>

      <div
        className="nn-flashcards-sticky-start hidden fixed inset-x-0 bottom-0 z-20 border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,transparent)] px-4 py-3 shadow-[0_-8px_24px_color-mix(in_srgb,var(--semantic-text-primary)_6%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--semantic-surface)_85%,transparent)] sm:px-6 md:hidden"
        data-nn-e2e-practice-sticky-cta
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <p className="mb-2 line-clamp-2 text-center text-[11px] text-[var(--semantic-text-muted)]">{ctaSubline}</p>
        {resumeHref ? (
          <button
            type="button"
            onClick={resumeSession}
            disabled={creating || isLaunching}
            data-nn-e2e-practice-resume-bottom
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--semantic-brand)] px-8 text-base font-bold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLaunching ? `Opening ${modeLabel}...` : "Resume session"}
          </button>
        ) : (
          <button
            type="button"
            onClick={createTest}
            disabled={startDisabled}
            data-nn-e2e-practice-start-bottom
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--semantic-brand)] px-8 text-base font-bold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isLaunching ? `Opening ${modeLabel}...` : creating ? "Starting..." : `Start ${modeLabel}`}
          </button>
        )}
      </div>

      {/* Error display */}
      {error ? (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)]"
          role="alert"
        >
          <p>
            {showCatPoolWarning
              ? "This CAT pool is not ready for that setup yet. Try Practice Exam or broaden the categories."
              : error}
          </p>
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

      {pathwayOptions.length > 1 ? (
        <details
          className="nn-flashcards-recovery-filters nn-flashcards-collapsed-panel rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] bg-transparent px-1 py-1"
          data-nn-e2e-practice-advanced-options
        >
          <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium text-[var(--semantic-text-muted)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,transparent)]">
            Advanced options
          </summary>
          <div className="space-y-5 border-t border-[var(--semantic-border-soft)] px-3 pb-4 pt-4">
            {pathwayOptions.length > 1 ? (
              <div>
                <label htmlFor="practice-exam-pathway" className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  Exam pathway
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
          </div>
        </details>
      ) : null}
    </SharedStudySetupLayout>
  );
}
