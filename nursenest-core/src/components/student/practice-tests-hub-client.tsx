"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Brain,
  ClipboardList,
  GraduationCap,
  Layers,
  LayoutList,
  LineChart,
  ListTodo,
  PlayCircle,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import {
  LearnerCategorySelector,
  LearnerSessionStartPanel,
  LearnerStudyModeCard,
  LearnerStudyPageShell,
} from "@/components/learner-study-ui";
import {
  discoveryTopicsForCanonicalFilters,
  getQuestionCountsByBodySystem,
  type CanonicalBodySystemId,
} from "@/lib/learner-study-hub/body-system-data";
import type { PathwayLessonPracticeHubSnapshot } from "@/lib/learner-study-hub/pathway-lesson-study-materials";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
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
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import { TrackedStudyLoopCatLink } from "@/components/student/tracked-study-loop-cat-link";
import type { StudyLaunchPayload } from "@/lib/practice-tests/types";
import { buildAppFlashcardsTopicHref } from "@/lib/learner/app-study-internal-links";
import { humanizeTopicSlug } from "@/components/lessons/pathway-lesson-link-practice";

type SessionBuilderKind = "cat_exam" | "practice_exam" | "practice_questions";

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
  pathwayDisplayName = "",
  catEligiblePathwayIds = [],
  hubBootstrapSource = "primary",
  catHref,
  pathwayLessonPractice = null,
}: {
  examSimulationEnabled?: boolean;
  pathwayOptions?: PracticeTestPathwayOption[];
  defaultPathwayId?: string | null;
  /** Resolved pathway label for hub chrome (matches flashcards hub: catalog → options → id). */
  pathwayDisplayName?: string;
  /** Pathway ids that support CAT adaptive start (server-aligned with POST /api/practice-tests). */
  catEligiblePathwayIds?: string[];
  /** When hub pathway bootstrap used a published snapshot (DB degraded). */
  hubBootstrapSource?: "primary" | "secondary";
  /** Pre-resolved CAT entry URL for this pathway (includes pathwayId when known). */
  catHref?: string;
  /** PathwayLesson-derived practice + lesson counts (published catalog only). */
  pathwayLessonPractice?: PathwayLessonPracticeHubSnapshot | null;
}) {
  const { t } = useMarketingI18n();
  const searchParams = useSearchParams();
  /** Stable dependency so URL-driven effects do not re-fire on unrelated `useSearchParams` identity churn. */
  const searchParamString = useMemo(() => searchParams.toString(), [searchParams]);
  const topicSlugFromUrl = useMemo(() => {
    const qp = new URLSearchParams(searchParamString);
    return qp.get("topic")?.trim().toLowerCase() || null;
  }, [searchParamString]);
  const [topics, setTopics] = useState<{ topic: string; count: number }[]>([]);
  /** Total matching exam bank rows for pathway (from discovery API). Used for learner-safe messaging only — never as a shaming zero callout. */
  const [discoveryTotal, setDiscoveryTotal] = useState<number | null>(null);
  const [discoveryReady, setDiscoveryReady] = useState(false);
  const builderSectionRef = useRef<HTMLDivElement | null>(null);
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
  const [selectedCanonicalIds, setSelectedCanonicalIds] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [difficultyMin, setDifficultyMin] = useState<number | "">("");
  const [difficultyMax, setDifficultyMax] = useState<number | "">("");
  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitMin, setTimeLimitMin] = useState(45);
  const [linearDeliveryMode, setLinearDeliveryMode] = useState<"practice" | "exam">("practice");
  const [linearRationaleVisibility, setLinearRationaleVisibility] = useState<"after_each" | "end_of_exam">("after_each");
  const [linearAllowReviewNavigation, setLinearAllowReviewNavigation] = useState(false);
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
  const heroPathwayEyebrow = useMemo(() => {
    const urlDefault = (defaultPathwayId ?? "").trim();
    const pid = pathwayId.trim();
    if (pid === urlDefault && pathwayDisplayName.trim()) {
      return pathwayDisplayName.trim();
    }
    const sp = selectedPathway;
    if (!sp) return pathwayDisplayName.trim() || pid;
    if (sp.label.includes("—")) return sp.label.split("—").slice(1).join("—").trim();
    return sp.examCodeLabel?.trim() || sp.label.trim() || pid;
  }, [defaultPathwayId, pathwayDisplayName, pathwayId, selectedPathway]);
  const selectedExamContext = useMemo(
    () => buildGlobalExamContext(pathwayId.trim() || defaultPathwayId || null, "en"),
    [defaultPathwayId, pathwayId],
  );

  const countsByCanonical = useMemo(() => {
    const pid = pathwayId.trim();
    if (!pid || topics.length === 0) {
      return Object.fromEntries(CANONICAL_STUDY_CATEGORIES.map((c) => [c.id, 0])) as Record<
        CanonicalBodySystemId,
        number
      >;
    }
    return getQuestionCountsByBodySystem(pid, topics);
  }, [pathwayId, topics]);

  const discoveryStats = useMemo(() => {
    const totalIndexed = topics.reduce((n, b) => n + b.count, 0);
    return { topicBuckets: topics.length, totalIndexed };
  }, [topics]);

  const resumeSession = useMemo(() => {
    const rows = list.filter((r) => r.status === "IN_PROGRESS");
    rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return rows[0] ?? null;
  }, [list]);

  const recentCompletedSession = useMemo(() => {
    const rows = list.filter((r) => r.status === "COMPLETED");
    rows.sort((a, b) => {
      const tb = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      const ta = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      return tb - ta;
    });
    return rows[0] ?? null;
  }, [list]);

  const poolLikelyEmpty =
    discoveryReady && discoveryStats.totalIndexed === 0 && (discoveryTotal ?? 0) === 0;

  const catExamStartHref = useMemo(() => {
    if (!catHref?.trim()) return null;
    try {
      const u = new URL(catHref.trim(), typeof window !== "undefined" ? window.location.origin : "https://nursenest.local");
      u.searchParams.set("mode", "cat");
      if (pathwayId.trim()) u.searchParams.set("pathwayId", pathwayId.trim());
      return `${u.pathname}${u.search}`;
    } catch {
      return catHref.trim();
    }
  }, [catHref, pathwayId]);
  const hasInProgressActivity = list.some((row) => row.status === "IN_PROGRESS");
  const hasRecentCompletion = list.some((row) => row.status === "COMPLETED" && isWithinRecentWindow(row.completedAt, nowMs));
  const hasWeakFocus =
    selectionMode === "weak" ||
    selectionMode === "missed" ||
    selectionMode === "starred" ||
    (selectionMode === "cat" &&
      (catSelectionBasis === "weak" || catSelectionBasis === "missed" || catSelectionBasis === "starred"));
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
  const bootstrappedHubTopicKeyRef = useRef<string | null>(null);
  const prevPathwayIdForTopicBootstrapRef = useRef(pathwayId);

  useEffect(() => {
    if (prevPathwayIdForTopicBootstrapRef.current !== pathwayId) {
      bootstrappedHubTopicKeyRef.current = null;
      prevPathwayIdForTopicBootstrapRef.current = pathwayId;
    }
  }, [pathwayId]);

  useEffect(() => {
    const slug = topicSlugFromUrl;
    if (!slug || topics.length === 0) return;
    const key = `${pathwayId.trim()}|${slug}`;
    if (bootstrappedHubTopicKeyRef.current === key) return;
    const dashed = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");
    const labelHit = humanizeTopicSlug(slug).toLowerCase();
    const hit =
      topics.find((b) => dashed(b.topic) === slug) ??
      topics.find((b) => b.topic.trim().toLowerCase() === labelHit);
    if (hit) {
      bootstrappedHubTopicKeyRef.current = key;
      setTopicPicks((prev) => (prev.includes(hit.topic) ? prev : [...prev, hit.topic]));
    }
  }, [topicSlugFromUrl, topics, pathwayId]);

  useEffect(() => {
    const prev = prevSelectionModeRef.current;
    const qp = new URLSearchParams(searchParamString);
    const urlPid = qp.get("pathwayId");
    if (prev !== "cat" && selectionMode === "cat") {
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
  }, [selectionMode, catOptions, defaultPathwayId, pathwayOptions, searchParamString]);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/practice-tests");
      const data = (await res.json()) as { tests?: TestListRow[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? t("learner.practiceTests.hub.error.loadTests"));
      if (!Array.isArray(data.tests)) {
        throw new Error(
          data.error?.trim() ||
            `${t("learner.practiceTests.hub.error.loadTests")} (invalid response shape — refresh to retry; this is not a trusted empty list).`,
        );
      }
      setList(data.tests);
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

  const sessionBuilderKind = useMemo((): SessionBuilderKind => {
    if (selectionMode === "cat") return "cat_exam";
    return linearDeliveryMode === "exam" ? "practice_exam" : "practice_questions";
  }, [selectionMode, linearDeliveryMode]);

  const applySessionBuilderKind = useCallback(
    (kind: SessionBuilderKind) => {
      if (kind === "cat_exam") {
        setSelectionMode("cat");
        if (examSimulationEnabled) {
          setCatPresentationMode("exam_simulation");
          setCatAdaptiveSessionType("cat");
          setTimedMode(true);
          applyExamSimulationDefaultsForPathway(pathwayId.trim());
        } else {
          setCatPresentationMode("practice");
          setCatAdaptiveSessionType("cat");
          setCatExamFeedbackMode("study");
          setQuestionCount((q) => (q > 75 ? 75 : q));
        }
        return;
      }
      if (selectionMode === "cat") {
        setSelectionMode("random");
      }
      if (kind === "practice_exam") {
        setLinearDeliveryMode("exam");
        setLinearRationaleVisibility("end_of_exam");
        setLinearAllowReviewNavigation(false);
      } else {
        setLinearDeliveryMode("practice");
        setLinearRationaleVisibility("after_each");
      }
    },
    [examSimulationEnabled, pathwayId, selectionMode],
  );

  const questionQuickPicks = useMemo<readonly number[]>(() => {
    if (selectionMode !== "cat") return [10, 25, 50, 75, 100];
    if (catPresentationMode === "exam_simulation") {
      return isNpPathway ? [75, 100, 125, 150] : [75, 100, 115, 145];
    }
    return [10, 25, 50, 75];
  }, [selectionMode, catPresentationMode, isNpPathway]);

  const primaryStartLabel = useMemo(() => {
    if (creating) return t("learner.practiceTests.hub.building");
    if (selectionMode === "cat") {
      return catPresentationMode === "exam_simulation"
        ? t("learner.practiceTests.hub.startCatExam")
        : t("learner.practiceTests.hub.startCatAdaptive");
    }
    return linearDeliveryMode === "exam"
      ? t("learner.practiceTests.hub.startPracticeExam")
      : t("learner.practiceTests.hub.startPracticeQuestions");
  }, [creating, selectionMode, catPresentationMode, linearDeliveryMode, t]);

  useEffect(() => {
    const qp = new URLSearchParams(searchParamString);
    const pid = qp.get("pathwayId")?.trim();
    if (pid && pathwayOptions.some((p) => p.id === pid)) {
      setPathwayId(pid);
    }
    const cat = qp.get("cat");
    if (cat === "1" || cat === "true") {
      setSelectionMode("cat");
    }
    const startMode = qp.get("startMode");
    if (startMode === "practice_exam") {
      setSelectionMode("random");
      setLinearDeliveryMode("exam");
      setLinearRationaleVisibility("end_of_exam");
    }
    const focus = qp.get("focus");
    if (focus === "weak") {
      setSelectionMode((prev) => {
        if (prev === "cat") {
          setCatSelectionBasis("weak");
          return prev;
        }
        return "weak";
      });
    }
    if (focus === "missed") {
      setSelectionMode((prev) => {
        if (prev === "cat") {
          setCatSelectionBasis("missed");
          return prev;
        }
        return "missed";
      });
    }
    if (focus === "starred") {
      setSelectionMode((prev) => {
        if (prev === "cat") {
          setCatSelectionBasis("starred");
          return prev;
        }
        return "starred";
      });
    }
  }, [searchParamString, pathwayOptions]);

  useEffect(() => {
    let cancelled = false;
    setDiscoveryReady(false);
    (async () => {
      try {
        const qp = new URLSearchParams();
        if (selectedExamContext?.pathwayId) {
          qp.set("pathwayId", selectedExamContext.pathwayId);
          qp.set("language", selectedExamContext.language);
        }
        const discoveryUrl = qp.size > 0 ? `/api/questions/discovery?${qp.toString()}` : "/api/questions/discovery";
        const res = await fetch(discoveryUrl);
        if (!res.ok) {
          if (!cancelled) {
            setDiscoveryTotal(null);
            setDiscoveryReady(true);
          }
          return;
        }
        const data = (await res.json()) as {
          buckets?: { topic: string; count: number }[];
          total?: number;
        };
        if (!cancelled) {
          if (Array.isArray(data.buckets)) setTopics(data.buckets);
          setDiscoveryTotal(typeof data.total === "number" ? data.total : null);
          setDiscoveryReady(true);
        }
      } catch {
        if (!cancelled) {
          setDiscoveryTotal(null);
          setDiscoveryReady(true);
        }
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

  function toggleTopicBucket(topic: string) {
    setTopicPicks((prev) => (prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic]));
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
      const pathwayTrim = pathwayId.trim();
      const allCanon = CANONICAL_STUDY_CATEGORIES.map((c) => c.id);
      const canonFilterActive =
        pathwayTrim &&
        topics.length > 0 &&
        selectedCanonicalIds.length > 0 &&
        selectedCanonicalIds.length < allCanon.length;
      const allowedTopicSet = canonFilterActive
        ? new Set(
            discoveryTopicsForCanonicalFilters(
              pathwayTrim,
              topics,
              new Set(selectedCanonicalIds as CanonicalBodySystemId[]),
            ),
          )
        : null;
      const effectiveTopicNames =
        allowedTopicSet && topicPicks.length > 0
          ? topicPicks.filter((x) => allowedTopicSet.has(x))
          : allowedTopicSet && topicPicks.length === 0
            ? Array.from(allowedTopicSet)
            : topicPicks;

      const filterRecord: NonNullable<StudyLaunchPayload["filters"]> = {
        hubFilter:
          selectionMode === "random" && effectiveTopicNames.length === 0 && !canonFilterActive
            ? "all"
            : selectionMode === "weak"
              ? "weak"
              : selectionMode === "missed"
                ? "incorrect"
                : selectionMode === "starred"
                  ? "bookmarked"
                  : selectionMode === "unseen"
                    ? "unseen"
                    : selectionMode === "targeted"
                      ? "targeted"
                      : "mixed",
      };
      if (selectionMode === "cat") {
        filterRecord.catSelectionBasis = catSelectionBasis;
      }
      const studyLaunchPayload: StudyLaunchPayload = {
        pathwayId: pathwayTrim || null,
        mode: selectionMode === "cat" ? "cat" : linearDeliveryMode === "exam" ? "practice_exam" : "practice_linear",
        selectedCategories:
          !canonFilterActive || selectedCanonicalIds.length >= allCanon.length ? [] : [...selectedCanonicalIds],
        filters: filterRecord,
        count: questionCount,
        shuffle: true,
      };

      const linearPayload = buildPracticeExamStartPayload({
        title: title.trim() || null,
        questionCount,
        selectionMode:
          selectionMode === "targeted"
            ? "targeted"
            : selectionMode === "weak"
              ? "weak"
              : selectionMode === "missed"
                ? "missed"
                : selectionMode === "starred"
                  ? "starred"
                  : selectionMode === "unseen"
                    ? "unseen"
                    : "random",
        topicNames: effectiveTopicNames,
        pathwayId: pathwayTrim || null,
        timedMode,
        timeLimitSec: timedMode ? Math.round(timeLimitMin * 60) : null,
        difficultyMin: difficultyMin === "" ? null : difficultyMin,
        difficultyMax: difficultyMax === "" ? null : difficultyMax,
        sessionMode: linearDeliveryMode === "exam" ? "exam" : "tutor",
        rationaleVisibilityMode: linearRationaleVisibility === "after_each" ? "immediate" : "review",
        linearAllowReviewNavigation: linearDeliveryMode === "practice" ? linearAllowReviewNavigation : false,
      });
      const payload =
        selectionMode === "cat"
          ? {
              title: title.trim() || undefined,
              questionCount: Math.max(10, questionCount),
              topicNames: effectiveTopicNames,
              difficultyMin: difficultyMin === "" ? null : difficultyMin,
              difficultyMax: difficultyMax === "" ? null : difficultyMax,
              selectionMode,
              catSelectionBasis,
              catPresentationMode,
              catExamFeedbackMode:
                catPresentationMode === "practice" ? catExamFeedbackMode : ("test" satisfies CatExamFeedbackMode),
              catAdaptiveSessionType: catPresentationMode === "practice" ? catAdaptiveSessionType : "cat",
              pathwayId: pathwayTrim || null,
              timedMode,
              timeLimitSec: timedMode ? Math.round(timeLimitMin * 60) : null,
              studyLaunchPayload,
            }
          : { ...linearPayload, studyLaunchPayload };
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-nn-study-launch-surface": "practice_exams",
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string; code?: string };
      if (!res.ok) {
        setErrorCode(typeof data.code === "string" ? data.code : null);
        throw new Error(data.error ?? t("learner.practiceTests.hub.error.createTest"));
      }
      if (!data.id) {
        throw new Error(
          `${t("learner.practiceTests.hub.error.createTest")} (missing session id — stay on this page and retry; we will not send you to the dashboard.)`,
        );
      }
      const pid = pathwayId.trim();
      window.location.href = `/app/practice-tests/${encodeURIComponent(data.id)}${
        pid ? `?pathwayId=${encodeURIComponent(pid)}` : ""
      }`;
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

  const pathwayScopedQs = useMemo(() => {
    const pid = pathwayId.trim();
    return pid ? `?pathwayId=${encodeURIComponent(pid)}` : "";
  }, [pathwayId]);
  const questionsHubHref = `/app/questions${pathwayScopedQs}`;
  const lessonsHubHref = `/app/lessons${pathwayScopedQs}`;
  const flashcardsHubHref = `/app/flashcards${pathwayScopedQs}`;
  const catEntryHref = (catHref?.trim() || catExamStartHref || "/app/practice-tests/start").trim();

  const studyToolsRailNav = useMemo(() => {
    const rowClass =
      "flex min-h-10 items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_45%,var(--semantic-surface))] px-3 py-2 text-left text-xs font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_70%,var(--semantic-surface))]";
    const iconWrap = "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--semantic-surface)] text-[var(--semantic-chart-3)] shadow-sm";
    return (
      <nav className="space-y-2" aria-label={t("learner.practiceTests.examFirst.studyToolsRailTitle")}>
        <TrackedStudyLoopCatLink
          href={catEntryHref}
          sourceSurface="study_quick_links"
          className={rowClass}
          studyAccent="cat"
        >
          <span className={iconWrap} aria-hidden>
            <LineChart className="h-4 w-4 text-[var(--semantic-brand)]" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("learner.profile.quickLinks.catPractice")}</span>
        </TrackedStudyLoopCatLink>
        <Link href="/app/exams" className={rowClass}>
          <span className={iconWrap} aria-hidden>
            <GraduationCap className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("nav.practiceExams")}</span>
        </Link>
        <Link href={questionsHubHref} className={rowClass}>
          <span className={iconWrap} aria-hidden>
            <LayoutList className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("nav.questionBank")}</span>
        </Link>
        <Link href={lessonsHubHref} className={rowClass}>
          <span className={iconWrap} aria-hidden>
            <BookOpen className="h-4 w-4 text-[var(--semantic-success)]" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("learner.profile.quickLinks.lessons")}</span>
        </Link>
        <Link href={flashcardsHubHref} className={rowClass}>
          <span className={iconWrap} aria-hidden>
            <Brain className="h-4 w-4 text-[var(--semantic-info)]" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("learner.profile.quickLinks.flashcards")}</span>
        </Link>
        <Link href="/app/study-plan" className={rowClass}>
          <span className={iconWrap} aria-hidden>
            <ListTodo className="h-4 w-4 text-[var(--semantic-chart-2)]" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("learner.profile.quickLinks.studyPlanner")}</span>
        </Link>
        <Link href="/app/account/report" className={rowClass}>
          <span className={iconWrap} aria-hidden>
            <BarChart3 className="h-4 w-4 text-[var(--semantic-chart-4)]" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("learner.account.nav.report")}</span>
        </Link>
        <Link href="/app/account/readiness" className={rowClass}>
          <span className={iconWrap} aria-hidden>
            <Target className="h-4 w-4 text-[var(--semantic-warning)]" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("learner.account.nav.readiness")}</span>
        </Link>
        <Link href="/app/account/review-queue" className={rowClass}>
          <span className={iconWrap} aria-hidden>
            <ClipboardList className="h-4 w-4 text-[var(--semantic-chart-5)]" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("learner.account.nav.reviewQueue")}</span>
        </Link>
        <Link
          href="/app/practice-tests/cat-insights"
          className={rowClass}
          aria-label={t("learner.practiceTests.examFirst.ctaReviewAria")}
          data-nn-e2e-exam-first-cta-review
        >
          <span className={iconWrap} aria-hidden>
            <BarChart3 className="h-4 w-4 text-[var(--semantic-chart-3)]" strokeWidth={2} />
          </span>
          <span className="min-w-0 leading-snug">{t("learner.practiceTests.examFirst.ctaReview")}</span>
        </Link>
        {recentCompletedSession ? (
          <Link
            href={`/app/practice-tests/${encodeURIComponent(recentCompletedSession.id)}${
              pathwayId.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : ""
            }`}
            className={`${rowClass} border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))]`}
          >
            <span className={iconWrap} aria-hidden>
              <PlayCircle className="h-4 w-4 text-[var(--semantic-brand)]" strokeWidth={2} />
            </span>
            <span className="min-w-0 leading-snug">{t("learner.practiceTests.examFirst.openLastCompleted")}</span>
          </Link>
        ) : null}
      </nav>
    );
  }, [
    t,
    catEntryHref,
    questionsHubHref,
    lessonsHubHref,
    flashcardsHubHref,
    pathwayId,
    recentCompletedSession,
  ]);

  return (
    <LearnerStudyPageShell
      className="nn-practice-tests-hub-premium space-y-5 py-2 sm:space-y-6 sm:py-4"
      data-nn-learner-area="practice-tests"
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="practice-tests"
    >
      {hubBootstrapSource === "secondary" ? (
        <div className="max-w-3xl" data-nn-practice-hub-bootstrap-source="secondary">
          <LearnerStudyLiveSyncBanner />
        </div>
      ) : null}
      <h1 className="sr-only">{t("learner.practiceTests.title")}</h1>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] lg:items-start lg:gap-10">
        <div className="min-w-0 space-y-6 sm:space-y-7">
      <header
        className="nn-premium-practice-hub-hero relative overflow-hidden rounded-[1.75rem] border-2 border-[color-mix(in_srgb,var(--semantic-brand)_45%,var(--semantic-border-soft))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))_0%,var(--semantic-surface)_38%,color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))_100%)] p-6 text-[var(--semantic-text-primary)] shadow-[0_22px_48px_color-mix(in_srgb,var(--semantic-brand)_12%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--semantic-info)_22%,transparent)] sm:p-8"
        data-nn-e2e-practice-exam-first-hero
        data-nn-premium-platform-sticky-controls
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-1)_18%,transparent)] blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--semantic-surface)] text-[var(--semantic-brand)] shadow-[var(--semantic-shadow-soft)] ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))]">
            <Sparkles className="h-6 w-6" aria-hidden strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-3)_85%,var(--semantic-text-secondary))]">
              {heroPathwayEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold leading-[1.12] tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
              {t("learner.practiceTests.examFirst.heroTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-[0.95rem]">
              {t("learner.practiceTests.examFirst.heroSubtitle")}
            </p>
            {poolLikelyEmpty ? (
              <p
                className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_85%,var(--semantic-surface))] px-4 py-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]"
                data-nn-practice-pool-fallback
              >
                {t("learner.practiceTests.examFirst.poolBuilding")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative mt-8 space-y-4">
          {catExamStartHref && catOptions.length > 0 ? (
            <Link
              href={catExamStartHref}
              className="nn-btn-primary group flex min-h-[3.75rem] w-full flex-col justify-center gap-1 rounded-2xl px-5 py-4 text-left text-base font-bold shadow-[0_14px_32px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] transition hover:brightness-[1.03] active:brightness-[0.98]"
              data-nn-e2e-exam-first-cta-cat
            >
              <span className="flex items-center gap-2.5">
                <PlayCircle className="h-7 w-7 shrink-0 opacity-95" aria-hidden />
                {t("learner.practiceTests.examFirst.ctaCat")}
              </span>
              <span className="text-xs font-medium opacity-95">
                {t("learner.practiceTests.examFirst.ctaCatSublabel")}
              </span>
            </Link>
          ) : (
            <div className="flex min-h-[3.25rem] flex-col justify-center rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_40%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
              {t("learner.practiceTests.hub.catUnavailableBody")}
            </div>
          )}

          <div className={`grid gap-3 ${resumeSession ? "sm:grid-cols-2" : ""}`}>
            <button
              type="button"
              className="flex min-h-[3.5rem] flex-col justify-center gap-1 rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,var(--semantic-surface))] px-4 py-3.5 text-left shadow-[var(--semantic-shadow-soft)] transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--semantic-surface))] sm:min-h-[3.25rem]"
              data-nn-e2e-exam-first-cta-custom
              onClick={() => builderSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <span className="flex items-center gap-2 text-sm font-bold text-[var(--semantic-text-primary)]">
                <Wrench className="h-5 w-5 shrink-0 text-[var(--semantic-info)]" aria-hidden />
                {t("learner.practiceTests.examFirst.ctaCustom")}
              </span>
              <span className="text-xs font-medium text-[var(--semantic-text-secondary)]">
                {t("learner.practiceTests.examFirst.ctaCustomSublabel")}
              </span>
            </button>

            {resumeSession ? (
              <Link
                href={`/app/practice-tests/${encodeURIComponent(resumeSession.id)}${
                  pathwayId.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : ""
                }`}
                className="flex min-h-[3.5rem] flex-col justify-center gap-1 rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-success)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_55%,var(--semantic-surface))] px-4 py-3.5 text-left shadow-[var(--semantic-shadow-soft)] transition hover:brightness-[1.02] sm:min-h-[3.25rem]"
                data-nn-e2e-exam-first-cta-continue
              >
                <span className="flex items-center gap-2 text-sm font-bold text-[var(--semantic-text-primary)]">
                  <LineChart className="h-5 w-5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  {t("learner.practiceTests.examFirst.ctaContinue")}
                </span>
                <span className="truncate text-xs font-medium text-[var(--semantic-text-secondary)]">
                  {resumeSession.title?.trim() || t("learner.practiceTests.examFirst.resumeUntitled")}
                </span>
              </Link>
            ) : null}
          </div>
          {!resumeSession ? (
            <p className="text-xs font-medium leading-snug text-[var(--semantic-text-secondary)]">
              {t("learner.practiceTests.examFirst.continueUnavailable")}
            </p>
          ) : null}
        </div>
      </header>

      {topicSlugFromUrl && pathwayId.trim() ? (
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link
            href={buildAppFlashcardsTopicHref(pathwayId.trim(), topicSlugFromUrl)}
            className="font-semibold text-[var(--semantic-info)] underline underline-offset-2"
            data-testid="practice-tests-hub-link-flashcards-topic"
            data-nn-pathway-id={pathwayId.trim()}
          >
            {t("learner.studyLoop.studyFlashcardsThisTopic")}
          </Link>
        </div>
      ) : null}

      {pathwayLessonPractice &&
      (pathwayLessonPractice.publishedLessonCount > 0 ||
        pathwayLessonPractice.practiceQuestionCount > 0 ||
        pathwayLessonPractice.lessonLinkedVirtualCards > 0) ? (
        <details
          className="nn-card nn-student-card-lift border-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-5 sm:p-6"
          data-nn-e2e-pathway-lesson-practice-strip
        >
          <summary className="cursor-pointer text-base font-bold text-[var(--semantic-text-primary)] marker:text-[var(--semantic-text-secondary)]">
            {t("learner.practiceTests.examFirst.optionalLessonInventory")}
          </summary>
          <div className="mt-4">
          <h2 className="sr-only">{t("learner.practiceTests.examFirst.lessonInventorySrHeading")}</h2>
          <p className="mt-1 max-w-3xl text-sm text-[var(--semantic-text-secondary)]">
            {t("learner.practiceTests.examFirst.lessonInventoryIntro")}
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {t("learner.practiceTests.examFirst.publishedLessonsLabel")}
              </dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums text-[var(--semantic-text-primary)]">
                {pathwayLessonPractice.publishedLessonCount}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {t("learner.practiceTests.examFirst.lessonLinkedMcqsLabel")}
              </dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums text-[var(--semantic-text-primary)]">
                {pathwayLessonPractice.practiceQuestionCount}
                {pathwayLessonPractice.practiceTruncated ? "+" : ""}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {t("learner.practiceTests.examFirst.lessonLinkedFlashcardsLabel")}
              </dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums text-[var(--semantic-text-primary)]">
                {pathwayLessonPractice.lessonLinkedVirtualCards}
              </dd>
            </div>
          </dl>
          {pathwayLessonPractice.topSystems.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {t("learner.practiceTests.examFirst.lessonsBySystemLabel")}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {pathwayLessonPractice.topSystems.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-2)_14%,var(--semantic-surface))] px-3 py-1 text-xs font-medium text-[var(--semantic-text-primary)]"
                  >
                    {s.label}{" "}
                    <span className="tabular-nums text-[var(--semantic-text-secondary)]">({s.count})</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href={`/app/questions/bank?pathwayId=${encodeURIComponent(pathwayLessonPractice.pathwayId)}`}
              className="inline-flex min-h-11 items-center sm:min-h-10 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-4 font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
            >
              {t("learner.practiceTests.examFirst.openPathwayQuestionBank")}
            </Link>
            <Link
              href={`/app/flashcards?pathwayId=${encodeURIComponent(pathwayLessonPractice.pathwayId)}`}
              className="inline-flex min-h-11 items-center sm:min-h-10 rounded-full border border-[var(--semantic-border-soft)] px-4 font-semibold text-[var(--semantic-text-primary)] underline-offset-2 hover:underline"
            >
              {t("learner.practiceTests.examFirst.flashcardsHubCta")}
            </Link>
          </div>
          </div>
        </details>
      ) : null}

      <section
        ref={builderSectionRef}
        id="practice-exam-builder"
        data-nn-e2e-practice-exams-builder
        data-nn-practice-exam-hub-convergence=""
        className={[
          "nn-premium-practice-hub-builder scroll-mt-20 space-y-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,var(--semantic-panel-cool))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-7",
          isPriorityWinner(hubPriority, "weak_focus")
            ? "border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] shadow-[var(--semantic-shadow-soft)]"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
            {t("learner.practiceTests.hub.builderEyebrow")}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
            {t("learner.practiceTests.hub.builderHeadline")}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.builderIntro")}</p>
        </div>
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

        <div className="mt-8 space-y-10">
          <section aria-labelledby="practice-builder-mode">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                  {t("learner.practiceTests.hub.stepSessionType")}
                </p>
                <h3 id="practice-builder-mode" className="text-xl font-bold text-[var(--semantic-text-primary)]">
                  {t("learner.practiceTests.hub.stepChooseMode")}
                </h3>
              </div>
              <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-brand)] ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))]">
                {t("learner.practiceTests.hub.catExamBadge")}
              </span>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.25fr_1fr_1fr]">
              <div
                data-active={sessionBuilderKind === "cat_exam"}
                className="group relative overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--semantic-brand)_36%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] p-5 text-left shadow-[var(--semantic-shadow-soft)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_17%,var(--semantic-surface))] data-[active=true]:ring-2 data-[active=true]:ring-[color-mix(in_srgb,var(--semantic-brand)_32%,transparent)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--semantic-surface)] text-[var(--semantic-brand)] shadow-sm">
                    <LineChart className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
                    {t("learner.practiceTests.hub.catExamBadge")}
                  </span>
                </div>
                <h4 className="mt-4 text-xl font-bold text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.kind.catExam")}</h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {t("learner.practiceTests.hub.kind.catExamDesc")}
                </p>
                {catOptions.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applySessionBuilderKind("cat_exam")}
                      className="inline-flex min-h-11 items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_36%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-5 text-sm font-bold text-[var(--semantic-brand)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-surface))]"
                    >
                      {t("learner.practiceTests.hub.catConfigureCta")}
                    </button>
                    {catExamStartHref ? (
                      <Link
                        href={catExamStartHref}
                        className="inline-flex min-h-11 items-center rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-bold text-[var(--semantic-brand-contrast)] shadow-sm transition hover:opacity-95"
                        data-nn-e2e-practice-hub-cat-exam
                      >
                        {t("learner.practiceTests.hub.startCatExam")}
                      </Link>
                    ) : null}
                  </div>
                ) : (
                  <span className="mt-4 block text-xs font-medium text-[var(--semantic-warning-contrast)]">
                    {t("learner.practiceTests.hub.catUnavailableBody")}
                  </span>
                )}
              </div>

              <LearnerStudyModeCard
                title={t("learner.practiceTests.hub.kind.practiceExam")}
                description={t("learner.practiceTests.hub.kind.practiceExamDesc")}
                icon={ClipboardList}
                selected={sessionBuilderKind === "practice_exam"}
                onSelect={() => {
                  applySessionBuilderKind("practice_exam");
                  setQuestionCount((q) => (q > 100 ? 100 : q));
                }}
                className="min-h-[13rem]"
              />
              <LearnerStudyModeCard
                title={t("learner.practiceTests.hub.kind.practiceQuestions")}
                description={t("learner.practiceTests.hub.kind.practiceQuestionsDesc")}
                icon={Layers}
                selected={sessionBuilderKind === "practice_questions"}
                onSelect={() => {
                  applySessionBuilderKind("practice_questions");
                  setQuestionCount((q) => (q > 100 ? 100 : q));
                }}
                className="min-h-[13rem]"
              />
            </div>
          </section>

          {selectionMode === "cat" && examSimulationEnabled ? (
            <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_30%,var(--semantic-surface))] p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">
                    {t("learner.practiceTests.hub.catFormatLabel")}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.catFormatHelp")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
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
              </div>
            </section>
          ) : null}

          {topics.length > 0 ? (
          <section className="space-y-4" data-nn-e2e-practice-canonical-grid>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {t("learner.practiceTests.hub.stepCategories")}
              </p>
            </div>
            <LearnerCategorySelector
              countsBySystem={countsByCanonical}
              selectedCanonicalIds={selectedCanonicalIds}
              onToggleCanonical={(id) => {
                const all = CANONICAL_STUDY_CATEGORIES.map((c) => c.id);
                if (selectedCanonicalIds.length === 0) {
                  setSelectedCanonicalIds(all.filter((x) => x !== id));
                  return;
                }
                if (selectedCanonicalIds.includes(id)) {
                  const next = selectedCanonicalIds.filter((x) => x !== id);
                  setSelectedCanonicalIds(next.length === 0 ? [] : next);
                } else {
                  const next = [...selectedCanonicalIds, id];
                  if (next.length >= all.length) setSelectedCanonicalIds([]);
                  else setSelectedCanonicalIds(next);
                }
              }}
              search={categorySearch}
              onSearchChange={setCategorySearch}
              heading={t("learner.practiceTests.hub.categoriesHeading")}
              intro={t("learner.practiceTests.hub.categoriesIntro")}
              searchPlaceholder={t("learner.practiceTests.hub.categoriesSearchPlaceholder")}
            />
            {topicPicks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                <span className="w-full text-xs font-medium text-muted-foreground">{t("learner.practiceTests.hub.topicPicksLabel")}</span>
                {topicPicks.map((pickedTopic) => (
                  <button
                    key={pickedTopic}
                    type="button"
                    className="nn-chip px-3 py-1 text-xs font-medium"
                    data-selected="true"
                    onClick={() => removeTopic(pickedTopic)}
                  >
                    {pickedTopic} x
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

          <section aria-labelledby="practice-builder-count">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {t("learner.practiceTests.hub.stepQuestionCount")}
              </p>
              <h3 id="practice-builder-count" className="text-xl font-bold text-[var(--semantic-text-primary)]">
                {t("learner.practiceTests.hub.questionCountLabel")}
              </h3>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                {selectionMode === "cat"
                  ? catPresentationMode === "exam_simulation"
                    ? isNpPathway
                      ? t("learner.practiceTests.hub.questionCount.catExamNp")
                      : t("learner.practiceTests.hub.questionCount.catExamRn", {
                          exam: selectedExamLabel ?? t("learner.practiceTests.hub.defaultExamLabel"),
                        })
                    : t("learner.practiceTests.hub.questionCount.catCap")
                  : t("learner.practiceTests.hub.questionCount.linear")}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {questionQuickPicks.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQuestionCount(n)}
                  data-selected={questionCount === n}
                  className="nn-chip min-h-11 px-5 py-2 text-sm font-bold"
                >
                  {n}
                </button>
              ))}
            </div>
            <label className="mt-4 block max-w-xs text-sm">
              <span className="text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.customCountLabel")}</span>
              <input
                type="number"
                data-nn-e2e-question-count
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
                className="mt-1 w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
              />
            </label>
          </section>

          <details className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_65%,var(--semantic-surface))] p-4 text-sm sm:p-5">
            <summary className="cursor-pointer text-base font-bold text-[var(--semantic-text-primary)] marker:text-[var(--semantic-text-secondary)]">
              {t("learner.practiceTests.hub.customizeSessionTitle")}
            </summary>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.optionalTitleLabel")}</span>
                <input
                  className="mt-1 w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("learner.practiceTests.hub.titlePlaceholder")}
                />
              </label>
              <div className="space-y-2">
                <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.timingLabel")}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTimedMode(false)}
                    data-active={!timedMode}
                    className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                  >
                    {t("learner.practiceTests.hub.untimedShort")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimedMode(true)}
                    data-active={timedMode}
                    className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                  >
                    {t("learner.practiceTests.hub.timedShort")}
                  </button>
                </div>
                {timedMode ? (
                  <label className="block max-w-xs text-sm">
                    <span className="text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.timeLimitMinutes")}</span>
                    <input
                      type="number"
                      min={2}
                      max={selectionMode === "cat" && catPresentationMode === "exam_simulation" ? 400 : 240}
                      className="mt-1 w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
                      value={timeLimitMin}
                      onChange={(e) => setTimeLimitMin(Number(e.target.value))}
                    />
                  </label>
                ) : (
                  <p className="text-xs text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.untimedHint")}</p>
                )}
              </div>

              {selectionMode !== "cat" ? (
                <div className="space-y-3 md:col-span-2">
                  <div>
                    <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.sessionFeelLabel")}</span>
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
                          setLinearAllowReviewNavigation(false);
                        }}
                        data-active={linearDeliveryMode === "exam"}
                        className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                      >
                        {t("learner.practiceTests.hub.sessionMode.exam")}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.rationalesShortLabel")}</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLinearRationaleVisibility("after_each");
                          setLinearDeliveryMode("practice");
                        }}
                        data-active={linearRationaleVisibility === "after_each"}
                        className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                      >
                        {t("learner.practiceTests.hub.afterEachShort")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLinearRationaleVisibility("end_of_exam");
                          setLinearDeliveryMode("exam");
                          setLinearAllowReviewNavigation(false);
                        }}
                        data-active={linearRationaleVisibility === "end_of_exam"}
                        className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                      >
                        {t("learner.practiceTests.hub.atEndShort")}
                      </button>
                    </div>
                  </div>
                  {linearDeliveryMode === "practice" ? (
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-3 text-sm text-foreground shadow-sm">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border"
                        checked={linearAllowReviewNavigation}
                        onChange={(e) => setLinearAllowReviewNavigation(e.target.checked)}
                        data-nn-qa-practice-hub-linear-allow-review-nav
                      />
                      <span>
                        <span className="font-medium">{t("learner.practiceTests.hub.linearAllowReviewNavLabel")}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {t("learner.practiceTests.hub.linearAllowReviewNavHelp")}
                        </span>
                      </span>
                    </label>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-4 md:col-span-2">
                  {catPresentationMode === "practice" ? (
                    <>
                      <div>
                        <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.adaptiveStyleLabel")}</span>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
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
                      {catAdaptiveSessionType === "cat" ? (
                        <div>
                          <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.rationalesShortLabel")}</span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setCatExamFeedbackMode("study")}
                              data-active={catExamFeedbackMode === "study"}
                              className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                            >
                              {t("learner.practiceTests.hub.afterEachShort")}
                            </button>
                            <button
                              type="button"
                              onClick={() => setCatExamFeedbackMode("test")}
                              data-active={catExamFeedbackMode === "test"}
                              className="nn-tab-pill px-4 py-1.5 text-sm font-medium"
                            >
                              {t("learner.practiceTests.hub.atEndShort")}
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </details>

          <details className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm shadow-sm sm:p-5">
            <summary className="cursor-pointer text-base font-bold text-[var(--semantic-text-primary)] marker:text-[var(--semantic-text-secondary)]">
              {t("learner.practiceTests.hub.advancedFiltersTitle")}
            </summary>
            <div className="mt-5 space-y-5">
              <div>
                <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.questionFocusSection")}</span>
                <div className="mt-2 flex flex-wrap gap-2" data-nn-e2e-practice-pool-presets>
                  {selectionMode !== "cat" ? (
                    <>
                      <button
                        type="button"
                        data-selected={selectionMode === "random" && topicPicks.length === 0}
                        className="nn-chip px-3 py-1.5 text-xs font-medium"
                        onClick={() => {
                          setSelectionMode("random");
                          setCatSelectionBasis("random");
                          setTopicPicks([]);
                        }}
                      >
                        {t("learner.practiceTests.hub.poolPresetAllQuestions")}
                      </button>
                      <button
                        type="button"
                        data-selected={selectionMode === "weak"}
                        className="nn-chip px-3 py-1.5 text-xs font-medium"
                        onClick={() => {
                          setSelectionMode("weak");
                          setCatSelectionBasis("weak");
                        }}
                      >
                        {t("learner.practiceTests.hub.selection.weak")}
                      </button>
                      <button
                        type="button"
                        data-selected={selectionMode === "missed"}
                        className="nn-chip px-3 py-1.5 text-xs font-medium"
                        onClick={() => {
                          setSelectionMode("missed");
                          setCatSelectionBasis("missed");
                        }}
                      >
                        {t("learner.practiceTests.hub.selection.missed")}
                      </button>
                      <button
                        type="button"
                        data-selected={selectionMode === "starred"}
                        className="nn-chip px-3 py-1.5 text-xs font-medium"
                        data-nn-e2e-practice-pool-starred
                        onClick={() => {
                          setSelectionMode("starred");
                          setCatSelectionBasis("starred");
                        }}
                      >
                        {t("learner.practiceTests.hub.selection.starred")}
                      </button>
                      <button
                        type="button"
                        data-selected={selectionMode === "unseen"}
                        className="nn-chip px-3 py-1.5 text-xs font-medium"
                        onClick={() => setSelectionMode("unseen")}
                      >
                        {t("learner.practiceTests.hub.selection.unseen")}
                      </button>
                    </>
                  ) : (
                    ([
                      ["random", t("learner.practiceTests.hub.poolBroadMix")],
                      ["targeted", t("learner.practiceTests.hub.poolFiltered")],
                      ["weak", t("learner.practiceTests.hub.poolWeakFirst")],
                      ["missed", t("learner.practiceTests.hub.poolMissedReview")],
                      ["starred", t("learner.practiceTests.hub.selection.starred")],
                    ] as const).map(([v, label]) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setCatSelectionBasis(v)}
                        data-selected={catSelectionBasis === v}
                        className="nn-chip px-3 py-1.5 text-xs font-medium"
                      >
                        {label}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {topics.length > 0 ? (
                <div className="space-y-3">
                  <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.topicLabelsSection")}</span>
                  <div className="flex flex-wrap gap-2">
                    {(selectedCanonicalIds.length === 0 || selectedCanonicalIds.length >= CANONICAL_STUDY_CATEGORIES.length
                      ? topics
                      : topics.filter((b) =>
                          discoveryTopicsForCanonicalFilters(
                            pathwayId.trim(),
                            topics,
                            new Set(selectedCanonicalIds as CanonicalBodySystemId[]),
                          ).includes(b.topic),
                        )
                    ).map((b) => {
                      const picked = topicPicks.includes(b.topic);
                      return (
                        <button
                          key={b.topic}
                          type="button"
                          data-nn-e2e-practice-topic-chip={b.topic}
                          data-selected={picked}
                          onClick={() => toggleTopicBucket(b.topic)}
                          className="nn-chip px-3 py-1 text-xs font-medium data-[selected=true]:ring-2 data-[selected=true]:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
                        >
                          {formatTitleCase(b.topic)} ({b.count})
                        </button>
                      );
                    })}
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
                    <button
                      type="button"
                      className="nn-premium-action-chip rounded-lg border border-border px-3 py-1.5 text-sm"
                      onClick={addCustomTopic}
                    >
                      {t("learner.practiceTests.hub.add")}
                    </button>
                  </div>
                </div>
              ) : null}

              <div>
                <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.difficultySection")}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["", 1, 2, 3, 4, 5] as const).map((level) => (
                    <button
                      key={level === "" ? "any" : level}
                      type="button"
                      data-selected={level === "" ? difficultyMin === "" && difficultyMax === "" : difficultyMin === level && difficultyMax === level}
                      className="nn-chip px-3 py-1.5 text-xs font-medium"
                      onClick={() => {
                        setDifficultyMin(level);
                        setDifficultyMax(level);
                      }}
                    >
                      {level === "" ? t("learner.practiceTests.hub.difficultyAny") : t("learner.practiceTests.hub.difficultyLevel", { level })}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.difficultyMin")}</span>
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
                    <span className="text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.difficultyMax")}</span>
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
              </div>
            </div>
          </details>
        </div>

        {error ? (
          <div className="mt-4">
            <p className="text-sm text-[var(--semantic-warning-contrast)]">{error}</p>
            {errorCode === PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous ? (
              <CatAmbiguityPathwayPicker catEligibleOptions={catOptions} surface="practice_hub" className="mt-3" />
            ) : null}
          </div>
        ) : null}

        <LearnerSessionStartPanel
          primary={
            <>
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
                className="nn-btn-primary px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {primaryStartLabel}
              </button>
            </>
          }
          footnote={t("learner.practiceTests.hub.startFootnote")}
        />

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
        <h2 className="text-lg font-bold tracking-tight text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.savedHistoryTitle")}</h2>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.hub.savedHistoryIntro")}</p>
        {historyPriorityMessage ? <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{historyPriorityMessage}</p> : null}
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("learner.practiceTests.hub.loading")}</p>
        ) : error ? (
          <div
            className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,transparent)] p-4 text-sm text-[var(--semantic-text-secondary)]"
            role="alert"
            data-nn-practice-tests-history-load-error="1"
          >
            <p className="font-semibold text-[var(--semantic-text-primary)]">{t("learner.practiceTests.hub.error.loadTests")}</p>
            <p className="mt-2">{error}</p>
            <button
              type="button"
              className="mt-3 inline-flex min-h-11 items-center sm:min-h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
              onClick={() => {
                setLoading(true);
                void loadList();
              }}
            >
              Retry
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] px-4 py-5 sm:px-5">
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
                      : row.selectionMode === "missed"
                        ? t("learner.practiceTests.hub.selection.missed")
                        : row.selectionMode === "starred"
                          ? t("learner.practiceTests.hub.selection.starred")
                          : row.selectionMode === "unseen"
                            ? t("learner.practiceTests.hub.rowUnseen")
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

      <details className="nn-card rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))] p-4 shadow-sm lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-bold text-[var(--semantic-text-primary)] marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="inline-flex w-full items-center justify-between gap-2">
            <span>{t("learner.practiceTests.examFirst.mobileStudyToolsSummary")}</span>
            <span className="text-xs font-semibold text-[var(--semantic-chart-3)]" aria-hidden>
              +
            </span>
          </span>
        </summary>
        <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.examFirst.studyToolsRailIntro")}</p>
        <div className="mt-4">{studyToolsRailNav}</div>
      </details>
        </div>

        <aside
          className="mt-8 max-lg:hidden lg:mt-0 lg:sticky lg:top-24"
          aria-label={t("learner.practiceTests.examFirst.studyToolsRailTitle")}
        >
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] ring-1 ring-[color-mix(in_srgb,var(--semantic-info)_12%,transparent)]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
              {t("learner.practiceTests.examFirst.studyToolsRailTitle")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {t("learner.practiceTests.examFirst.studyToolsRailIntro")}
            </p>
            <div className="mt-4">{studyToolsRailNav}</div>
          </div>
        </aside>
      </div>
    </LearnerStudyPageShell>
  );
}
