"use client";

import { LearnerNoteScope } from "@prisma/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { StudyNotesPanel } from "@/components/student/study-notes-panel";
import type { RationaleQualityClient } from "@/components/student/premium-rationale-panel";
import type { RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";
import type { NormalizedTeachingPayload, TeachingMediaBundle } from "@/lib/content-quality/teaching-payload";
import {
  questionIdsWithIncorrectAttempts,
  readQuestionPerformanceEvents,
  recordQuestionPerformanceEvent,
} from "@/lib/learner/question-performance-events";
import { PremiumRationalePanel } from "@/components/student/premium-rationale-panel";
import { QuestionReviewActionStrip } from "@/components/study/question-review-rationale-blocks";
import type { QuestionListEmptyDiagnostics } from "@/lib/questions/question-list-empty-diagnostics";
import type { EmptyCopyI18n } from "@/lib/student/gated-state-messages-i18n";
import { readLearnerStudyDefaults } from "@/lib/student/learner-study-defaults";
import {
  discoveryFailureKey,
  questionBankEmptyKeys,
  questionsApiFailureKey,
} from "@/lib/student/gated-state-messages-i18n";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { readMarketingRegionFromDocument } from "@/lib/observability/learner-analytics-context.client";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { QuestionChoiceLetter } from "@/components/student/question-choice-letter";
import { QuestionSessionStudyLoopPanel } from "@/components/student/question-session-study-loop-panel";
import { ExamProgressBar, ExamSessionShell, ExamSessionTopBar } from "@/components/exam/exam-session-shell";
import type {
  QuestionBankDifficultyBand,
  QuestionBankDiscoveryResponse,
  QuestionBankGradedStateMap,
  QuestionBankPreset,
  RationaleLessonLinkClient,
  SavedQuestionBankPreset,
} from "@/lib/questions/question-bank-client-types";
import {
  normalizeQuestionBankDifficultyBand,
  parsePersistedQuestionBankSessionJson,
  parseSavedQuestionBankPresetsJson,
} from "@/lib/questions/question-bank-client-types";
import { mergeRationaleLessonLinksWithTopicFallback } from "@/lib/questions/merge-rationale-lesson-links";
import { parseCommaSeparatedQuestionIds } from "@/lib/questions/question-id-list-param";
import { resolveMeasurementSystemForLearnerPathway } from "@/lib/measurements/measurement-system";
import { resolveMeasurementTokens } from "@/lib/measurements/measurement-tokens";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { examContextAnalyticsProps } from "@/lib/exam-context/global-exam-context";
import type { StudySettings } from "@/lib/learner/study-settings";

export type { QuestionBankDifficultyBand, QuestionBankPreset, SavedQuestionBankPreset } from "@/lib/questions/question-bank-client-types";

type QFull = {
  id: string;
  stem: string;
  questionType: string;
  rationale?: string | null;
  options?: unknown;
  /** Localized labels aligned to `options` (canonical English strings for grading). */
  displayOptions?: string[] | null;
  topic?: string | null;
  subtopic?: string | null;
  exam?: string | null;
};

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

/** Calm clinical row states; uses `correctKeys` from grade API when present. */
function gradedAnswerSurfaceClass(
  graded: boolean,
  grade: { correct: boolean; correctKeys?: string[] } | undefined,
  canonical: string,
  picked: boolean,
): string {
  const base = "nn-qopt-surface";
  if (!graded || !grade) return base;
  const keys = grade.correctKeys;
  if (keys && keys.length > 0) {
    const ck = new Set(keys);
    if (ck.has(canonical)) return `${base} nn-qopt-surface--correct`;
    if (picked) return `${base} nn-qopt-surface--incorrect`;
    return `${base} nn-qopt-surface--dim`;
  }
  if (picked) {
    return grade.correct ? `${base} nn-qopt-surface--correct` : `${base} nn-qopt-surface--incorrect`;
  }
  return `${base} nn-qopt-surface--dim`;
}

function activeAnswerSurfaceClass(picked: boolean, highlight: boolean, struck: boolean): string {
  const parts = ["nn-qopt-surface", "nn-qopt-surface--interactive"];
  if (picked) parts.push("nn-qopt-surface--selected");
  if (highlight) parts.push("nn-qopt-surface--highlight");
  if (struck) parts.push("line-through opacity-[0.72]");
  return parts.join(" ");
}

function sessionKey(userId: string) {
  return `nn_qbank_session_${userId}`;
}

function presetsStorageKey(userId: string) {
  return `nn_qbank_presets_${userId}`;
}

function difficultyQueryBounds(band: QuestionBankDifficultyBand): { min: number | null; max: number | null } {
  switch (band) {
    case "easy":
      return { min: 1, max: 2 };
    case "moderate":
      return { min: 3, max: 3 };
    case "hard":
      return { min: 4, max: 5 };
    default:
      return { min: null, max: null };
  }
}

function rollupsKey(userId: string) {
  return `nn_qbank_rollups_${userId}`;
}

function appendRollup(
  userId: string,
  topic: string | null | undefined,
  correct: boolean,
  meta: {
    questionId: string;
    subtopic?: string | null;
    pathwayId?: string | null;
    exam?: string | null;
    timeSpentMs?: number;
  },
) {
  try {
    const k = rollupsKey(userId);
    let raw: string | null;
    try {
      raw = localStorage.getItem(k);
    } catch {
      raw = null;
    }
    let data: { events: Array<{ topic?: string | null; correct: boolean; at: string }> };
    try {
      data = raw
        ? (JSON.parse(raw) as { events: Array<{ topic?: string | null; correct: boolean; at: string }> })
        : { events: [] };
      if (!Array.isArray(data.events)) data.events = [];
    } catch {
      data = { events: [] };
    }
    data.events.push({ topic: topic ?? null, correct, at: new Date().toISOString() });
    data.events = data.events.slice(-120);
    localStorage.setItem(k, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
  recordQuestionPerformanceEvent(userId, {
    questionId: meta.questionId,
    topic: topic ?? null,
    subtopic: meta.subtopic ?? null,
    pathwayId: meta.pathwayId ?? null,
    exam: meta.exam ?? null,
    correct,
    ...(typeof meta.timeSpentMs === "number" && meta.timeSpentMs >= 0 ? { timeSpentMs: meta.timeSpentMs } : {}),
  });
}

function sameIdListOrderIndependent(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

export function QuestionBankPracticeClient({
  userId,
  userLabel,
  protectionFlags,
  pathwayOptions = [],
  defaultPathwayId = null,
  pathwayExamKeysByPathwayId = {},
  pathwayCountryByPathwayId = {},
  studySettings,
}: {
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  pathwayOptions?: { id: string; label: string }[];
  defaultPathwayId?: string | null;
  /** Maps pathway id → content exam keys (RN vs PN vs NP scope for exam-family filter). */
  pathwayExamKeysByPathwayId?: Record<string, string[]>;
  /** Maps pathway id → country code (US/CA/…) for region-aware clinical units in stems and rationales. */
  pathwayCountryByPathwayId?: Record<string, string>;
  studySettings: StudySettings;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useMarketingI18n();
  const includeIdsFromUrl = useMemo(
    () => parseCommaSeparatedQuestionIds(searchParams.get("includeIds")),
    [searchParams],
  );
  const [phase, setPhase] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [softNotice, setSoftNotice] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QFull[]>([]);
  const [topic, setTopic] = useState<string | null>(null);
  const [topicCodeFilter, setTopicCodeFilter] = useState<string | null>(null);
  const [pathwayIdFilter, setPathwayIdFilter] = useState<string | null>(null);
  const selectedExamContext = useMemo(
    () => buildGlobalExamContext(pathwayIdFilter ?? defaultPathwayId ?? null, "en"),
    [defaultPathwayId, pathwayIdFilter],
  );
  const [preset, setPreset] = useState<QuestionBankPreset>("pathway_mixed");
  const seenIdsRef = useRef<string[]>([]);
  const [topics, setTopics] = useState<{ topic: string; count: number }[]>([]);
  const [examBuckets, setExamBuckets] = useState<{ exam: string | null; count: number }[]>([]);
  const [topicMenuTruncationNotice, setTopicMenuTruncationNotice] = useState<string | null>(null);
  const [discoveryNotice, setDiscoveryNotice] = useState<string | null>(null);
  const [efficiencyMode, setEfficiencyMode] = useState<string | null>(null);
  /** Exam-style bank: suppress rich rationale until learner opts in (reduces “open-book” feel). */
  const [examShell, setExamShell] = useState(false);
  const [examShowExplanation, setExamShowExplanation] = useState(false);
  const [difficultyBand, setDifficultyBand] = useState<QuestionBankDifficultyBand>("");
  const [sessionSize, setSessionSize] = useState(20);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [examFilter, setExamFilter] = useState<string | null>(null);
  const [savedPresets, setSavedPresets] = useState<SavedQuestionBankPreset[]>([]);
  const [presetNameDraft, setPresetNameDraft] = useState("");
  const [emptyCopy, setEmptyCopy] = useState<EmptyCopyI18n | "pick_topic" | "no_mistakes" | null>(null);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [graded, setGraded] = useState<QuestionBankGradedStateMap>({});
  const [grading, setGrading] = useState(false);
  const questionOpenedAtMsRef = useRef<number | null>(null);
  /** One completion event per fresh batch (reset when `loadBatch(false)` clears graded). */
  const qbankSessionCompleteSentRef = useRef(false);
  /** Per-option exam tools (reset each item). */
  const [strikeOut, setStrikeOut] = useState<Record<string, boolean>>({});
  const [highlightOn, setHighlightOn] = useState<Record<string, boolean>>({});
  /** Session-local mark for review (exam-style bank); not persisted server-side. */
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  /** Mistake notebook: question ids saved this session via review strip. */
  const [mistakeNotebookByQuestion, setMistakeNotebookByQuestion] = useState<Record<string, boolean>>({});
  const [mistakeNotebookSaving, setMistakeNotebookSaving] = useState(false);
  /** Per-question confidence self-rating (low/medium/high) — UI-only, analytics only. */
  const [confidence, setConfidence] = useState<Record<string, "low" | "medium" | "high" | undefined>>({});
  const feedbackAnchorRef = useRef<HTMLDivElement | null>(null);
  const feedbackScrollMarkerRef = useRef<string | null>(null);

  const incorrectMistakeIds = useMemo(() => {
    void graded;
    if (!incorrectOnly) return [];
    const events = readQuestionPerformanceEvents(userId, 220);
    return questionIdsWithIncorrectAttempts(events, 200);
  }, [incorrectOnly, userId, graded]);

  const pathwayExamKeySet = useMemo(() => {
    if (!pathwayIdFilter) return null;
    const keys = pathwayExamKeysByPathwayId[pathwayIdFilter];
    if (!keys?.length) return null;
    return new Set(keys);
  }, [pathwayIdFilter, pathwayExamKeysByPathwayId]);

  const examBucketsForPathway = useMemo(() => {
    if (!pathwayExamKeySet || pathwayExamKeySet.size === 0) return examBuckets;
    return examBuckets.filter((b) => b.exam != null && pathwayExamKeySet.has(b.exam));
  }, [examBuckets, pathwayExamKeySet]);

  const measurementSystem = useMemo(
    () => resolveMeasurementSystemForLearnerPathway(pathwayIdFilter ?? defaultPathwayId, pathwayCountryByPathwayId),
    [pathwayIdFilter, defaultPathwayId, pathwayCountryByPathwayId],
  );

  const current = questions[idx];
  const total = questions.length;

  useEffect(() => {
    if (current?.id) questionOpenedAtMsRef.current = Date.now();
  }, [current?.id]);

  useEffect(() => {
    const d = readLearnerStudyDefaults(userId);
    setSessionSize(studySettings.preferredSessionLength ?? d.questionBank.sessionSize);
    setExamShell(d.questionBank.examShell);
    setExamShowExplanation(!d.questionBank.examShell);
  }, [studySettings.preferredSessionLength, userId]);

  useEffect(() => {
    setStrikeOut({});
    setHighlightOn({});
  }, [current?.id]);

  /** Reset confidence selection when moving to a new question that hasn't been answered yet. */
  useEffect(() => {
    const id = current?.id;
    if (!id || graded[id]) return;
  }, [current?.id, graded]);

  useEffect(() => {
    feedbackScrollMarkerRef.current = null;
  }, [current?.id]);

  /** Scroll feedback into view once per question after grading (smooth unless reduced motion). */
  useEffect(() => {
    const id = current?.id;
    if (!id || !graded[id]) return;
    if (feedbackScrollMarkerRef.current === id) return;
    feedbackScrollMarkerRef.current = id;
    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = window.requestAnimationFrame(() => {
      feedbackAnchorRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "nearest",
        inline: "nearest",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [graded, current?.id]);

  /** Optional topic narrow for any preset; topic drill still uses “recent” sort below. */
  const topicForApi = topic && topic.trim().length > 0 ? topic.trim() : null;
  const sortForApi = preset === "topic_drill" ? "recent" : "random";

  /** Avoid one request without pathway when mixed mode will apply learner pathway on next tick. */
  const pathwayMixedReady =
    preset !== "pathway_mixed" || pathwayOptions.length === 0 || pathwayIdFilter != null;

  const loadBatch = useCallback(
    async (append: boolean) => {
      setPhase("loading");
      setError(null);
      try {
        if (preset === "topic_drill" && !topic && includeIdsFromUrl.length === 0) {
          setQuestions([]);
          setEmptyCopy("pick_topic");
          setPhase("empty");
          return;
        }
        if (incorrectOnly && incorrectMistakeIds.length === 0) {
          setQuestions([]);
          setEmptyCopy("no_mistakes");
          setPhase("empty");
          seenIdsRef.current = [];
          return;
        }

        const qs = new URLSearchParams({
          mode: "preview",
          page: "1",
          pageSize: String(sessionSize),
          sort: sortForApi,
        });
        if (topicForApi) qs.set("topic", topicForApi);
        if (topicCodeFilter) qs.set("topicCode", topicCodeFilter);
        if (pathwayIdFilter) qs.set("pathwayId", pathwayIdFilter);
        if (efficiencyMode) qs.set("studyMode", efficiencyMode);
        const dBounds = difficultyQueryBounds(difficultyBand);
        if (dBounds.min != null) qs.set("difficultyMin", String(dBounds.min));
        if (dBounds.max != null) qs.set("difficultyMax", String(dBounds.max));
        if (examFilter) qs.set("exam", examFilter);
        if (incorrectMistakeIds.length > 0) qs.set("mistakeIds", incorrectMistakeIds.join(","));
        if (!append && includeIdsFromUrl.length > 0) qs.set("includeIds", includeIdsFromUrl.join(","));
        if (append && seenIdsRef.current.length > 0) {
          qs.set("excludeIds", seenIdsRef.current.join(","));
        }

        const res = await fetch(`/api/questions?${qs.toString()}`);
        let data = {} as {
          questions?: QFull[];
          error?: string;
          code?: string;
          topicRelaxed?: boolean;
          topicRequested?: string | null;
          studyModeNote?: string | null;
          weakTopicConfidence?: "high" | "medium" | "low" | null;
          diagnostics?: QuestionListEmptyDiagnostics;
        };
        try {
          data = (await res.json()) as typeof data;
        } catch {
          /* non-JSON body */
        }
        if (!res.ok) {
          setPhase("error");
          setEmptyCopy(null);
          setError(t(questionsApiFailureKey(res.status, data.code)));
          return;
        }
        if (data.topicRelaxed && data.topicRequested) {
          setSoftNotice(t("learner.qbank.notice.topicRelaxed", { topic: data.topicRequested }));
        } else if (data.studyModeNote === "weak_topic_unavailable") {
          setSoftNotice(t("learner.qbank.notice.weakUnavailable"));
        } else if (data.studyModeNote === "weak_topic_low_confidence") {
          setSoftNotice(t("learner.qbank.notice.weakLowConfidence"));
        } else {
          setSoftNotice(null);
        }
        const list = data.questions ?? [];
        if (list.length === 0) {
          if (!append) {
            setQuestions([]);
            setEmptyCopy(questionBankEmptyKeys(data.diagnostics));
            setPhase("empty");
            seenIdsRef.current = [];
          }
          return;
        }
        setEmptyCopy(null);

        if (append) {
          setQuestions((prev) => {
            const prevIds = new Set(prev.map((q) => q.id));
            const merged = [...prev];
            for (const q of list) {
              if (!prevIds.has(q.id)) {
                merged.push(q);
                prevIds.add(q.id);
              }
            }
            return merged;
          });
          seenIdsRef.current = [...new Set([...seenIdsRef.current, ...list.map((q) => q.id)])];
        } else {
          setQuestions(list);
          seenIdsRef.current = list.map((q) => q.id);
          setIdx(0);
          setAnswer(null);
          setGraded({});
          qbankSessionCompleteSentRef.current = false;

          const sk = sessionKey(userId);
          const saved = parsePersistedQuestionBankSessionJson(localStorage.getItem(sk));
          if (saved) {
            const listIds = list.map((q) => q.id);
            const bandMatches =
              normalizeQuestionBankDifficultyBand(saved.difficultyBand ?? "") === difficultyBand;
            if (
              saved.preset === preset &&
              (saved.topic ?? null) === (topicForApi ?? null) &&
              (saved.pathwayId ?? null) === (pathwayIdFilter ?? null) &&
              (saved.sessionSize ?? 20) === sessionSize &&
              bandMatches &&
              (saved.examFilter ?? null) === (examFilter ?? null) &&
              Boolean(saved.incorrectOnly) === incorrectOnly &&
              Boolean(saved.examShell) === examShell &&
              saved.ids &&
              sameIdListOrderIndependent(saved.ids, listIds)
            ) {
              setIdx(Math.min(saved.idx ?? 0, list.length - 1));
              if (saved.graded) setGraded(saved.graded);
            }
          }
        }

        if (!append && list.length > 0) {
          trackClientEvent(PH.learnerQuestionBankSessionStarted, {
            actor: "authenticated",
            country: readMarketingRegionFromDocument(),
            pathway_id: pathwayIdFilter ?? undefined,
            preset,
            session_size: sessionSize,
            topic_set: Boolean(topicForApi),
            ...examContextAnalyticsProps(selectedExamContext),
          });
        }

        setPhase("ready");
      } catch {
        setPhase("error");
        setEmptyCopy(null);
        setError(t("learner.qbank.networkError"));
      }
    },
    [
      userId,
      preset,
      topicForApi,
      topicCodeFilter,
      topic,
      pathwayIdFilter,
      sortForApi,
      efficiencyMode,
      sessionSize,
      difficultyBand,
      examFilter,
      incorrectOnly,
      incorrectMistakeIds,
      includeIdsFromUrl,
      examShell,
      selectedExamContext,
      t,
    ],
  );

  useEffect(() => {
    const tp = searchParams.get("topic")?.trim();
    const tpc = searchParams.get("topicCode")?.trim().toLowerCase();
    const pid = searchParams.get("pathwayId")?.trim();
    const pr = searchParams.get("preset")?.trim();
    const sm = searchParams.get("studyMode")?.trim().toLowerCase();
    if (tp) setTopic(tp);
    if (tpc) setTopicCodeFilter(tpc);
    if (pid) setPathwayIdFilter(pid);
    if (pr === "random" || pr === "random_bank") setPreset("random_bank");
    else if (pr === "topic" || pr === "topic_drill") setPreset("topic_drill");
    else if (pr === "mixed" || pr === "pathway_mixed") setPreset("pathway_mixed");
    const okSm = sm && ["weak", "high_yield", "rapid", "final_prep"].includes(sm);
    setEfficiencyMode(okSm ? sm : null);
    const ex = searchParams.get("examShell");
    if (ex === "1" || ex === "true") {
      setExamShell(true);
      setExamShowExplanation(false);
    } else if (ex === "0" || ex === "false") {
      setExamShell(false);
      setExamShowExplanation(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (phase !== "ready") return;
    const n = questions.length;
    if (n === 0) return;
    const target = Math.min(sessionSize, n);
    const gradedCount = Object.keys(graded).length;
    if (gradedCount < target || qbankSessionCompleteSentRef.current) return;
    qbankSessionCompleteSentRef.current = true;
    trackClientEvent(PH.learnerQuestionBankSessionCompleted, {
      actor: "authenticated",
      country: readMarketingRegionFromDocument(),
      pathway_id: pathwayIdFilter ?? undefined,
      preset,
      session_target: target,
      ...examContextAnalyticsProps(selectedExamContext),
    });
  }, [phase, questions.length, graded, sessionSize, pathwayIdFilter, preset, selectedExamContext]);

  useEffect(() => {
    if (preset === "random_bank") return;
    if (defaultPathwayId && pathwayIdFilter === null) {
      setPathwayIdFilter(defaultPathwayId);
    }
  }, [defaultPathwayId, pathwayIdFilter, preset]);

  useEffect(() => {
    if (preset !== "pathway_mixed") return;
    if (pathwayIdFilter) return;
    if (pathwayOptions.length > 0) setPathwayIdFilter(pathwayOptions[0]!.id);
  }, [preset, pathwayIdFilter, pathwayOptions]);

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
        if (!res.ok) {
          let code: string | undefined;
          try {
            const err = (await res.json()) as { code?: string };
            code = err.code;
          } catch {
            /* ignore */
          }
          if (!cancelled) {
            setTopicMenuTruncationNotice(null);
            setDiscoveryNotice(t(discoveryFailureKey(res.status, code)));
          }
          return;
        }
        const data = (await res.json()) as QuestionBankDiscoveryResponse;
        if (cancelled) return;
        setDiscoveryNotice(null);
        if (data.buckets) setTopics(data.buckets);
        if (data.examFamily) setExamBuckets(data.examFamily);
        if (data.limits?.topicsTruncated) {
          const cap = data.limits.topicBucketCap ?? 250;
          const omitted = data.limits.topicsOmittedCount ?? 0;
          setTopicMenuTruncationNotice(t("learner.qbank.notice.topicMenuTruncated", { cap, omitted }));
        } else {
          setTopicMenuTruncationNotice(null);
        }
      } catch {
        /* optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedExamContext, t]);

  useEffect(() => {
    if (!pathwayMixedReady) return;
    void loadBatch(false);
  }, [loadBatch, pathwayMixedReady]);

  useEffect(() => {
    setSavedPresets(parseSavedQuestionBankPresetsJson(localStorage.getItem(presetsStorageKey(userId))));
  }, [userId]);

  useEffect(() => {
    if (!examFilter) return;
    if (examBucketsForPathway.length === 0) return;
    const ok = examBucketsForPathway.some((b) => b.exam === examFilter);
    if (!ok) setExamFilter(null);
  }, [examFilter, examBucketsForPathway]);

  useEffect(() => {
    if (phase !== "ready" || questions.length === 0) return;
    try {
      localStorage.setItem(
        sessionKey(userId),
        JSON.stringify({
          ids: questions.map((q) => q.id),
          idx,
          topic: topicForApi,
          pathwayId: pathwayIdFilter,
          preset,
          graded,
          sessionSize,
          difficultyBand,
          examFilter,
          incorrectOnly,
          examShell,
          savedAt: Date.now(),
        }),
      );
    } catch {
      /* ignore */
    }
  }, [
    phase,
    questions,
    idx,
    topicForApi,
    pathwayIdFilter,
    preset,
    graded,
    userId,
    sessionSize,
    difficultyBand,
    examFilter,
    incorrectOnly,
    examShell,
  ]);

  const optsCanonical = useMemo(() => (current ? parseOptions(current.options) : []), [current]);
  const optsDisplay = useMemo(() => {
    if (!current) return [];
    const d = current.displayOptions;
    if (Array.isArray(d) && d.length === optsCanonical.length) return d.map((x) => String(x));
    return optsCanonical;
  }, [current, optsCanonical]);

  const stemDisplay = useMemo(
    () => (current ? resolveMeasurementTokens(current.stem, measurementSystem) : ""),
    [current, measurementSystem],
  );
  const optsDisplayClinical = useMemo(
    () => optsDisplay.map((o) => resolveMeasurementTokens(String(o), measurementSystem)),
    [optsDisplay, measurementSystem],
  );

  const g = current ? graded[current.id] : undefined;
  const gradedRationaleForPanel = useMemo(() => {
    if (!g) return null;
    return {
      rationale: g.rationale ? resolveMeasurementTokens(g.rationale, measurementSystem) : null,
      rationaleSections: g.rationaleSections
        ? g.rationaleSections.map((s) => ({
            ...s,
            heading: resolveMeasurementTokens(s.heading, measurementSystem),
            body: resolveMeasurementTokens(s.body, measurementSystem),
          }))
        : null,
    };
  }, [g, measurementSystem]);
  const rationaleLessonLinksMerged = useMemo(
    () => mergeRationaleLessonLinksWithTopicFallback(g?.rationaleLessonLinks, current?.topic ?? null, pathwayIdFilter),
    [g?.rationaleLessonLinks, current?.topic, pathwayIdFilter],
  );

  const scrollToQuestionNotes = useCallback(() => {
    document.getElementById("qbank-question-notes")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const addCurrentToMistakeNotebook = useCallback(async () => {
    if (!current) return;
    const qid = current.id;
    if (mistakeNotebookByQuestion[qid]) return;
    setMistakeNotebookSaving(true);
    try {
      const res = await fetch("/api/learner/mistakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: qid,
          reason: "knowledge_gap",
          note: "Added from question bank review",
          topic: current.topic ?? undefined,
        }),
      });
      if (res.ok) {
        setMistakeNotebookByQuestion((prev) => ({ ...prev, [qid]: true }));
      }
    } finally {
      setMistakeNotebookSaving(false);
    }
  }, [current, mistakeNotebookByQuestion]);

  const learningLoopRecommendations = useMemo(() => {
    if (!g?.learningLoop) return null;
    const ll = g.learningLoop;
    const showLesson = Boolean(ll.lessonHref && rationaleLessonLinksMerged.length === 0);
    if (!showLesson && !ll.flashcardsHref && !ll.topicDrillHref) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {showLesson && ll.lessonHref ? (
          <Link
            href={ll.lessonHref}
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-xs font-semibold text-[var(--semantic-text-primary)] shadow-sm hover:bg-[var(--semantic-panel-muted)]"
          >
            {t("learner.qbank.ui.relatedLesson")}
          </Link>
        ) : null}
        {ll.flashcardsHref ? (
          <Link
            href={ll.flashcardsHref}
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-xs font-semibold text-[var(--semantic-text-primary)] shadow-sm hover:bg-[var(--semantic-panel-muted)]"
          >
            {t("learner.qbank.ui.reviewFlashcards")}
          </Link>
        ) : null}
        {ll.topicDrillHref ? (
          <Link
            href={ll.topicDrillHref}
            className="inline-flex min-h-11 items-center rounded-full px-4 text-xs font-semibold text-[var(--role-cta-foreground)]"
            style={{ background: "var(--role-cta)" }}
          >
            {t("learner.qbank.ui.topicDrillSameCode")}
          </Link>
        ) : null}
      </div>
    );
  }, [g?.learningLoop, rationaleLessonLinksMerged.length, t]);

  async function checkAnswer() {
    if (!current) return;
    if (answer === null || (Array.isArray(answer) && answer.length === 0)) return;
    setGrading(true);
    try {
      const res = await fetch("/api/questions/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: current.id,
          answer,
          pathwayId: pathwayIdFilter ?? undefined,
        }),
      });
      const data = (await res.json()) as {
        correct?: boolean;
        correctKeys?: unknown;
        rationale?: string | null;
        rationaleQuality?: RationaleQualityClient | null;
        rationaleSections?: Array<{ heading: string; body: string }> | null;
        referenceMedia?: RationaleReferenceMedia[] | null;
        teaching?: NormalizedTeachingPayload | null;
        teachingMedia?: TeachingMediaBundle | null;
        rationaleLessonLinks?: RationaleLessonLinkClient[] | null;
        learningLoop?: {
          topicCode: string | null;
          confidence: "high" | "medium" | "low";
          lessonHref: string | null;
          flashcardsHref: string | null;
          topicDrillHref: string | null;
        } | null;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error?.trim() || t("learner.qbank.gradeFailed"));
        return;
      }
      const correct = Boolean(data.correct);
      const ckRaw = data.correctKeys;
      const correctKeys =
        Array.isArray(ckRaw) && ckRaw.every((x) => typeof x === "string") ? (ckRaw as string[]) : undefined;
      setGraded((prev) => ({
        ...prev,
        [current.id]: {
          correct,
          ...(correctKeys && correctKeys.length > 0 ? { correctKeys } : {}),
          rationale: data.rationale ?? null,
          rationaleQuality: data.rationaleQuality ?? null,
          rationaleSections: data.rationaleSections ?? null,
          referenceMedia: data.referenceMedia ?? null,
          teaching: data.teaching ?? null,
          teachingMedia: data.teachingMedia ?? null,
          learningLoop: data.learningLoop ?? null,
          rationaleLessonLinks: data.rationaleLessonLinks ?? null,
        },
      }));
      const opened = questionOpenedAtMsRef.current;
      const timeSpentMs =
        typeof opened === "number" ? Math.min(1_800_000, Math.max(0, Date.now() - opened)) : undefined;
      appendRollup(userId, current.topic, correct, {
        questionId: current.id,
        subtopic: current.subtopic,
        pathwayId: pathwayIdFilter,
        exam: current.exam,
        timeSpentMs,
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("nn-topic-stats-updated"));
        window.dispatchEvent(new CustomEvent("nn-learner-stats-updated"));
      }
    } finally {
      setGrading(false);
    }
  }

  function applySavedPreset(id: string) {
    const p = savedPresets.find((x) => x.id === id);
    if (!p) return;
    setPreset(p.preset);
    setPathwayIdFilter(p.pathwayId);
    setTopic(p.topic);
    setExamFilter(p.exam);
    setDifficultyBand(normalizeQuestionBankDifficultyBand(p.difficultyBand));
    setIncorrectOnly(p.incorrectOnly);
    setSessionSize(p.sessionSize);
    setExamShell(p.examShell);
    setExamShowExplanation(!p.examShell);
    setEfficiencyMode(p.efficiencyMode);
  }

  function deleteSavedPreset(id: string) {
    const next = savedPresets.filter((x) => x.id !== id);
    setSavedPresets(next);
    try {
      localStorage.setItem(presetsStorageKey(userId), JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function saveNamedPreset() {
    const name = presetNameDraft.trim();
    if (!name) return;
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `preset_${Date.now()}`;
    const row: SavedQuestionBankPreset = {
      id,
      name,
      savedAt: Date.now(),
      preset,
      pathwayId: pathwayIdFilter,
      topic,
      exam: examFilter,
      difficultyBand,
      incorrectOnly,
      sessionSize,
      examShell,
      efficiencyMode,
    };
    const next = [...savedPresets, row].slice(-15);
    setSavedPresets(next);
    try {
      localStorage.setItem(presetsStorageKey(userId), JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setPresetNameDraft("");
  }

  function next() {
    setAnswer(null);
    setIdx((i) => Math.min(total - 1, i + 1));
  }

  function prev() {
    setAnswer(null);
    setIdx((i) => Math.max(0, i - 1));
  }

  if (phase === "loading") {
    return (
      <div className="mt-6 nn-qbank-skeleton" aria-busy="true" aria-label={t("learner.qbank.loading")}>
        {/* Top bar skeleton */}
        <div className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] px-4 py-3">
          <div className="flex justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="nn-qbank-skeleton__bar h-3 w-24 rounded" />
              <div className="nn-qbank-skeleton__bar h-4 w-40 rounded" />
            </div>
            <div className="nn-qbank-skeleton__bar h-3 w-16 rounded self-center" />
          </div>
        </div>
        {/* Progress bar skeleton */}
        <div className="border-b border-[var(--semantic-border-soft)] px-4 py-2.5">
          <div className="nn-qbank-skeleton__bar h-2 w-full rounded-full" />
        </div>
        {/* Content skeleton */}
        <div className="p-5 space-y-6">
          {/* Stem */}
          <div className="space-y-2.5">
            <div className="nn-qbank-skeleton__bar h-4 w-full rounded" />
            <div className="nn-qbank-skeleton__bar h-4 w-11/12 rounded" />
            <div className="nn-qbank-skeleton__bar h-4 w-9/12 rounded" />
            <div className="nn-qbank-skeleton__bar h-4 w-10/12 rounded" />
          </div>
          {/* Options */}
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="nn-qbank-skeleton__bar h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="nn-card mt-4 space-y-3 p-6">
        <p className="text-sm text-muted">{error ?? t("learner.qbank.genericError")}</p>
        <button
          type="button"
          className="rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground"
          onClick={() => void loadBatch(false)}
        >
          {t("learner.qbank.retry")}
        </button>
      </div>
    );
  }

  if (phase === "empty") {
    const keys: EmptyCopyI18n =
      emptyCopy === "pick_topic"
        ? { titleKey: "learner.qbank.pickTopic.title", bodyKey: "learner.qbank.pickTopic.body" }
        : emptyCopy === "no_mistakes"
          ? { titleKey: "learner.qbank.filters.noMistakesTitle", bodyKey: "learner.qbank.filters.noMistakesBody" }
          : (emptyCopy ?? questionBankEmptyKeys(undefined));
    const title = t(keys.titleKey, keys.bodyParams);
    const body = t(keys.bodyKey, keys.bodyParams);
    return (
      <div className="nn-card mt-4 p-6 text-sm text-muted">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-2">{body}</p>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  const isSata = current.questionType.toUpperCase() === "SATA" || current.questionType.toUpperCase() === "SELECT_ALL_THAT_APPLY";
  const raw = answer;

  const sessionRight = Object.values(graded).filter((x) => x.correct).length;
  const sessionTotal = Object.keys(graded).length;

  return (
    <div className="mt-6 space-y-4">
      {discoveryNotice ? (
        <p className="rounded-lg border border-role-warning-border bg-role-warning-soft px-3 py-2 text-sm text-role-warning-text">{discoveryNotice}</p>
      ) : null}
      {topicMenuTruncationNotice ? (
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {topicMenuTruncationNotice}
        </p>
      ) : null}
      {softNotice ? (
        <p className="rounded-lg border border-role-warning-border bg-role-warning-soft px-3 py-2 text-sm text-role-warning-text">{softNotice}</p>
      ) : null}

      <details className="nn-card mb-4 overflow-hidden rounded-xl border border-border">
        <summary className="cursor-pointer px-4 py-3.5 text-sm font-semibold text-foreground outline-none hover:bg-muted/30">
          {t("learner.qbank.examUi.sessionSetup")}
        </summary>
        <div className="space-y-6 border-t border-border bg-muted/10 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.qbank.filters.sessionBuilderHeading")}
            </p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
              <label className="block min-w-[min(100%,160px)] text-sm">
                <span className="text-muted-foreground">{t("learner.qbank.filters.sessionSize")}</span>
                <select
                  className="mt-1 w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                  value={sessionSize}
                  onChange={(e) => setSessionSize(Number(e.target.value))}
                >
                  {[10, 15, 20, 30, 40, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block min-w-[min(100%,220px)] text-sm">
                <span className="text-muted-foreground">{t("learner.qbank.filters.practiceMode")}</span>
                <select
                  className="mt-1 w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                  value={examShell ? "exam" : "practice"}
                  onChange={(e) => {
                    const exam = e.target.value === "exam";
                    setExamShell(exam);
                    setExamShowExplanation(!exam);
                  }}
                >
                  <option value="practice">{t("learner.qbank.filters.modePractice")}</option>
                  <option value="exam">{t("learner.qbank.filters.modeExam")}</option>
                </select>
              </label>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.qbank.filters.filtersHeading")}
            </p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
              <label className="block min-w-[min(100%,200px)] text-sm">
                <span className="text-muted-foreground">{t("learner.qbank.ui.studyMode")}</span>
                <select
                  className="mt-1 w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                  value={preset}
                  onChange={(e) => {
                    const v = e.target.value as QuestionBankPreset;
                    setPreset(v);
                    if (v === "random_bank") {
                      setTopic(null);
                      setPathwayIdFilter(null);
                    }
                    if (v === "pathway_mixed" && pathwayOptions[0]) setPathwayIdFilter(pathwayOptions[0].id);
                  }}
                >
                  <option value="pathway_mixed">{t("learner.qbank.preset.pathwayMixed")}</option>
                  <option value="topic_drill">{t("learner.qbank.preset.topicDrill")}</option>
                  <option value="random_bank">{t("learner.qbank.preset.randomBank")}</option>
                </select>
              </label>
              {pathwayOptions.length > 0 ? (
                <label className="block min-w-[min(100%,240px)] text-sm">
                  <span className="text-muted-foreground">{t("learner.qbank.ui.pathwayFilter")}</span>
                  <select
                    className="mt-1 w-full max-w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                    value={pathwayIdFilter ?? ""}
                    onChange={(e) => setPathwayIdFilter(e.target.value === "" ? null : e.target.value)}
                    disabled={preset === "random_bank"}
                  >
                    {preset === "random_bank" || preset === "topic_drill" ? (
                      <option value="">{t("learner.qbank.ui.pathwayAll")}</option>
                    ) : null}
                    {pathwayOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <label className="block min-w-[min(100%,240px)] text-sm">
                <span className="text-muted-foreground">{t("learner.qbank.filters.topicOptional")}</span>
                <select
                  className="mt-1 w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                  value={topic ?? ""}
                  onChange={(e) => setTopic(e.target.value === "" ? null : e.target.value)}
                >
                  <option value="">
                    {preset === "topic_drill" ? t("learner.qbank.ui.selectTopic") : t("learner.qbank.filters.anyTopic")}
                  </option>
                  {topics.map((b) => (
                    <option key={b.topic} value={b.topic}>
                      {b.topic} ({b.count})
                    </option>
                  ))}
                </select>
              </label>
              {examBucketsForPathway.length > 0 ? (
                <label className="block min-w-[min(100%,220px)] text-sm">
                  <span className="text-muted-foreground">{t("learner.qbank.filters.examFamily")}</span>
                  <select
                    className="mt-1 w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                    value={examFilter ?? ""}
                    onChange={(e) => setExamFilter(e.target.value === "" ? null : e.target.value)}
                  >
                    <option value="">{t("learner.qbank.filters.anyExam")}</option>
                    {examBucketsForPathway.map((b) =>
                      b.exam ? (
                        <option key={b.exam} value={b.exam}>
                          {b.exam} ({b.count})
                        </option>
                      ) : null,
                    )}
                  </select>
                </label>
              ) : null}
              <label className="block min-w-[min(100%,200px)] text-sm">
                <span className="text-muted-foreground">{t("learner.qbank.filters.difficulty")}</span>
                <select
                  className="mt-1 w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                  value={difficultyBand}
                  onChange={(e) => setDifficultyBand(e.target.value as QuestionBankDifficultyBand)}
                >
                  <option value="">{t("learner.qbank.filters.difficultyAny")}</option>
                  <option value="easy">{t("learner.qbank.filters.difficultyEasy")}</option>
                  <option value="moderate">{t("learner.qbank.filters.difficultyModerate")}</option>
                  <option value="hard">{t("learner.qbank.filters.difficultyHard")}</option>
                </select>
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm sm:min-w-[220px]">
                <input
                  type="checkbox"
                  className="size-5 rounded border-border"
                  checked={incorrectOnly}
                  onChange={(e) => setIncorrectOnly(e.target.checked)}
                />
                <span className="text-foreground">{t("learner.qbank.filters.incorrectOnly")}</span>
              </label>
              <label className="block min-w-[min(100%,200px)] text-sm">
                <span className="text-muted-foreground">{t("learner.qbank.ui.efficiencyMode")}</span>
                <select
                  className="mt-1 w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                  value={efficiencyMode ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEfficiencyMode(v || null);
                    const qs = new URLSearchParams(searchParams.toString());
                    if (v) qs.set("studyMode", v);
                    else qs.delete("studyMode");
                    router.replace(`${pathname}?${qs.toString()}`);
                  }}
                >
                  <option value="">{t("learner.qbank.efficiency.off")}</option>
                  <option value="weak">{t("learner.qbank.efficiency.weak")}</option>
                  <option value="high_yield">{t("learner.qbank.efficiency.highYield")}</option>
                  <option value="rapid">{t("learner.qbank.efficiency.rapid")}</option>
                  <option value="final_prep">{t("learner.qbank.efficiency.finalPrep")}</option>
                </select>
              </label>
            </div>
            {incorrectOnly ? (
              <p className="mt-2 text-xs text-muted-foreground">{t("learner.qbank.filters.incorrectOnlyHint")}</p>
            ) : null}
          </div>

          <div className="rounded-lg border border-border/80 bg-card/40 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.qbank.filters.presetsHeading")}
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              <label className="block min-w-[min(100%,200px)] flex-1 text-sm">
                <span className="text-muted-foreground">{t("learner.qbank.filters.presetName")}</span>
                <input
                  type="text"
                  value={presetNameDraft}
                  onChange={(e) => setPresetNameDraft(e.target.value)}
                  placeholder={t("learner.qbank.filters.presetNamePlaceholder")}
                  className="mt-1 w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                />
              </label>
              <button
                type="button"
                className="min-h-11 rounded-full border-2 border-border px-4 text-sm font-semibold hover:bg-muted/60"
                onClick={() => saveNamedPreset()}
              >
                {t("learner.qbank.filters.savePreset")}
              </button>
              {savedPresets.length > 0 ? (
                <div className="flex min-w-[min(100%,280px)] flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                  <label className="block flex-1 text-sm">
                    <span className="text-muted-foreground">{t("learner.qbank.filters.loadPreset")}</span>
                    <select
                      className="mt-1 w-full min-h-11 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                      defaultValue=""
                      onChange={(e) => {
                        const id = e.target.value;
                        if (id) applySavedPreset(id);
                        e.target.value = "";
                      }}
                    >
                      <option value="">{t("learner.qbank.filters.selectPreset")}</option>
                      {savedPresets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}
            </div>
            {savedPresets.length > 0 ? (
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {savedPresets.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2 rounded-md bg-muted/30 px-2 py-1">
                    <span className="truncate font-medium text-foreground">{p.name}</span>
                    <button
                      type="button"
                      className="shrink-0 rounded-md px-2 py-1 text-destructive hover:underline"
                      onClick={() => deleteSavedPreset(p.id)}
                    >
                      {t("learner.qbank.filters.removePreset")}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <p className="text-xs text-muted-foreground">
            {sessionTotal > 0
              ? t("learner.qbank.ui.sessionLine", { correct: sessionRight, total: sessionTotal })
              : t("learner.qbank.ui.sessionLineIdle")}
          </p>
        </div>
      </details>

      <ProtectedPremiumContent userLabel={userLabel} flags={protectionFlags} telemetrySurface="question_bank">
        <ExamSessionShell neutralPalette className="overflow-hidden shadow-md">
          <ExamSessionTopBar
            left={
              <div className="space-y-1">
                <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  {t("learner.qbank.ui.questionOf", { n: idx + 1, total })}
                </p>
                {current.topic ? (
                  <p className="line-clamp-1 nn-marketing-body-sm font-medium text-[var(--theme-heading-text)]">
                    {current.topic}
                  </p>
                ) : null}
              </div>
            }
            center={
              sessionTotal > 0 ? (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 nn-marketing-caption font-semibold tabular-nums ${
                    sessionTotal > 0 && sessionRight / sessionTotal >= 0.8
                      ? "border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] text-[var(--semantic-success-contrast,var(--semantic-success))]"
                      : sessionTotal > 0 && sessionRight / sessionTotal >= 0.6
                        ? "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] text-[var(--semantic-warning-contrast)]"
                        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-muted)]"
                  }`}
                  title={`${sessionRight} of ${sessionTotal} correct so far`}
                >
                  <span aria-hidden>✓</span>
                  {sessionRight}/{sessionTotal}
                </span>
              ) : (
                <span className="nn-marketing-caption font-semibold text-[var(--theme-muted-text)]">
                  {sortForApi === "random" ? t("learner.qbank.ui.sortRandom") : t("learner.qbank.ui.sortRecent")}
                </span>
              )
            }
            right={
              <div className="flex flex-col items-end gap-1">
                <span className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  {current.questionType}
                </span>
                {markedForReview[current.id] ? (
                  <span className="nn-marketing-caption font-semibold text-[var(--semantic-warning-contrast)] uppercase tracking-wide">
                    Flagged
                  </span>
                ) : null}
              </div>
            }
          />
          <ExamProgressBar current={idx + 1} total={total} answeredCount={sessionTotal} />

          <div className="nn-question-session space-y-8">
            <div className="nn-question-stem-card">
              {current.subtopic ? (
                <p className="mb-2 nn-marketing-caption font-medium text-[var(--semantic-text-muted)]">{current.subtopic}</p>
              ) : null}
              <div className="nn-question-stem-wrap">
                <p className="nn-question-stem">{stemDisplay}</p>
              </div>
            </div>

            <div>
              <p className="nn-question-options-label">{t("learner.qbank.examUi.answersHeading")}</p>
              {!g ? (
                <p className="mb-3 text-xs text-muted-foreground">{t("learner.qbank.examUi.toolsHint")}</p>
              ) : null}

              {isSata ? (
                <ul className="nn-qopt-list" role="group" aria-label={t("learner.qbank.examUi.answersHeading")}>
                  {optsCanonical.map((canonical, i) => {
                    const label = optsDisplayClinical[i] ?? optsDisplay[i] ?? canonical;
                    const selected = Array.isArray(raw) ? raw.includes(canonical) : false;
                    const struck = Boolean(strikeOut[canonical]);
                    const hi = Boolean(highlightOn[canonical]);
                    const rowClass = g
                      ? gradedAnswerSurfaceClass(true, g, canonical, selected)
                      : activeAnswerSurfaceClass(selected, hi, false);
                    return (
                      <li key={canonical}>
                        <div className={`flex min-w-0 gap-1.5 sm:gap-2 ${rowClass}`}>
                          <label
                            className={`flex min-h-[3.25rem] min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-[inherit] px-3 py-2.5 sm:min-h-[3.5rem] sm:px-4 ${g ? "cursor-default" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              disabled={!!g}
                              onChange={(e) => {
                                const prevAns = Array.isArray(raw) ? [...raw] : [];
                                const next = e.target.checked ? [...prevAns, canonical] : prevAns.filter((x) => x !== canonical);
                                setAnswer(next);
                              }}
                              className="mt-1 size-[1.125rem] shrink-0 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary/30 sm:size-5"
                            />
                            <QuestionChoiceLetter index={i} />
                            <span
                              className={`min-w-0 flex-1 text-base leading-relaxed text-[var(--theme-body-text)] ${struck && !g ? "text-muted-foreground line-through" : ""}`}
                            >
                              {label}
                            </span>
                          </label>
                          {!g ? (
                            <div className="flex shrink-0 flex-col gap-1 pr-1 sm:flex-row sm:items-center sm:pr-2">
                              <button
                                type="button"
                                aria-label={t("learner.qbank.examUi.ariaStrike")}
                                title={t("learner.qbank.examUi.ariaStrike")}
                                onClick={() => setStrikeOut((p) => ({ ...p, [canonical]: !p[canonical] }))}
                                className="nn-qopt-tool text-base"
                              >
                                ∅
                              </button>
                              <button
                                type="button"
                                aria-label={t("learner.qbank.examUi.ariaHighlight")}
                                title={t("learner.qbank.examUi.ariaHighlight")}
                                onClick={() => setHighlightOn((p) => ({ ...p, [canonical]: !p[canonical] }))}
                                className="nn-qopt-tool nn-qopt-tool--mark text-xs font-bold"
                              >
                                H
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="nn-qopt-list" role="radiogroup" aria-label={t("learner.qbank.examUi.answersHeading")}>
                  {optsCanonical.map((canonical, i) => {
                    const label = optsDisplayClinical[i] ?? optsDisplay[i] ?? canonical;
                    const struck = Boolean(strikeOut[canonical]);
                    const hi = Boolean(highlightOn[canonical]);
                    const picked = raw === canonical;
                    const surface = g
                      ? gradedAnswerSurfaceClass(true, g, canonical, picked)
                      : activeAnswerSurfaceClass(picked, hi, struck);
                    return (
                      <li key={canonical} className="flex gap-2.5 sm:gap-3">
                        <button
                          type="button"
                          disabled={!!g}
                          onClick={() => setAnswer(canonical)}
                          className={`flex flex-1 items-start gap-3 px-4 py-4 text-left text-base font-normal leading-relaxed text-[var(--theme-body-text)] transition sm:px-5 ${surface}`}
                        >
                          <QuestionChoiceLetter index={i} />
                          <span className="min-w-0 flex-1">{label}</span>
                        </button>
                        {!g ? (
                          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-stretch">
                            <button
                              type="button"
                              aria-label={t("learner.qbank.examUi.ariaStrike")}
                              title={t("learner.qbank.examUi.ariaStrike")}
                              onClick={(e) => {
                                e.preventDefault();
                                setStrikeOut((p) => ({ ...p, [canonical]: !p[canonical] }));
                              }}
                              className="nn-qopt-tool text-lg leading-none"
                            >
                              ∅
                            </button>
                            <button
                              type="button"
                              aria-label={t("learner.qbank.examUi.ariaHighlight")}
                              title={t("learner.qbank.examUi.ariaHighlight")}
                              onClick={(e) => {
                                e.preventDefault();
                                setHighlightOn((p) => ({ ...p, [canonical]: !p[canonical] }));
                              }}
                              className="nn-qopt-tool nn-qopt-tool--mark text-sm font-bold"
                            >
                              H
                            </button>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {!g ? (
              <div className="space-y-4">
                {/* Confidence rating — support tool, UI only */}
                {studySettings.enableConfidenceTracking ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)] shrink-0">
                      Confidence
                    </span>
                    <div className="nn-confidence-row">
                      {(["low", "medium", "high"] as const).map((level) => {
                        const sel = confidence[current.id] === level;
                        const labels: Record<string, string> = { low: "Not sure", medium: "Probably", high: "Confident" };
                        return (
                          <button
                            key={level}
                            type="button"
                            aria-pressed={sel}
                            onClick={() =>
                              setConfidence((prev) => ({ ...prev, [current.id]: sel ? undefined : level }))
                            }
                            className={`nn-confidence-chip nn-confidence-chip--${level} ${sel ? "nn-confidence-chip--selected" : ""}`}
                          >
                            {labels[level]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-[var(--semantic-text-muted)]">
                    Confidence-based review is off in your study settings, so this session uses correctness-only review.
                  </p>
                )}

                <div className="nn-question-nav-actions !flex-col !items-stretch sm:!flex-row sm:!items-center">
                  {examShell ? (
                    <button
                      type="button"
                      aria-pressed={Boolean(markedForReview[current.id])}
                      className={`order-first inline-flex min-h-[2.75rem] shrink-0 items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition sm:order-none ${
                        markedForReview[current.id]
                          ? "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] text-[var(--semantic-warning-contrast)]"
                          : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)] hover:bg-[var(--semantic-panel-muted)]"
                      }`}
                      onClick={() => setMarkedForReview((f) => ({ ...f, [current.id]: !f[current.id] }))}
                    >
                      {markedForReview[current.id] ? t("learner.qbank.examUi.markedReview") : t("learner.qbank.examUi.markReview")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={grading || answer === null || (Array.isArray(answer) && answer.length === 0)}
                    className="nn-btn-primary inline-flex min-h-[3rem] w-full items-center justify-center rounded-full px-8 text-base font-semibold shadow-none disabled:opacity-50 sm:w-auto sm:px-10"
                    onClick={() => void checkAnswer()}
                  >
                    {grading ? t("learner.qbank.ui.checking") : t("learner.qbank.ui.checkAnswer")}
                  </button>
                  <div className="flex w-full gap-2 sm:ml-auto sm:w-auto">
                    <button
                      type="button"
                      disabled={idx === 0}
                      className="nn-btn-secondary min-h-[3rem] flex-1 rounded-full px-4 text-sm font-semibold disabled:opacity-40 sm:flex-none sm:px-5"
                      onClick={prev}
                    >
                      {t("learner.qbank.ui.previous")}
                    </button>
                    <button
                      type="button"
                      disabled={idx >= total - 1}
                      className="nn-btn-secondary min-h-[3rem] flex-1 rounded-full px-4 text-sm font-semibold disabled:opacity-40 sm:flex-none sm:px-5"
                      onClick={next}
                    >
                      {t("learner.qbank.ui.skipForNow")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div ref={feedbackAnchorRef} className="flex flex-col gap-4">
                {examShell && !examShowExplanation ? (
                  <div className="nn-question-rationale-card">
                    <div
                      className={`nn-question-rationale-card__verdict ${
                        g.correct ? "nn-question-rationale-card__verdict--ok" : "nn-question-rationale-card__verdict--miss"
                      }`}
                    >
                      <p
                        className={`text-base font-semibold sm:text-lg ${
                          g.correct ? "text-[var(--role-success-text)]" : "text-[var(--theme-heading-text)]"
                        }`}
                        role="status"
                      >
                        {g.correct ? t("learner.qbank.ui.correct") : t("learner.qbank.ui.incorrect")}
                      </p>
                    </div>
                    <div className="space-y-3 px-4 py-4 sm:px-6 sm:py-5">
                      <p className="nn-marketing-body-sm text-[var(--theme-muted-text)]">{t("learner.qbank.ui.examShellHint")}</p>
                      <button
                        type="button"
                        className="nn-btn-secondary inline-flex min-h-[3rem] w-full items-center justify-center rounded-full px-6 text-sm font-semibold sm:w-auto"
                        onClick={() => setExamShowExplanation(true)}
                      >
                        {t("learner.qbank.ui.showExplanation")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <PremiumRationalePanel
                    correct={g.correct}
                    rationale={gradedRationaleForPanel?.rationale ?? g.rationale}
                    rationaleQuality={g.rationaleQuality}
                    rationaleSections={gradedRationaleForPanel?.rationaleSections ?? g.rationaleSections}
                    referenceMedia={g.referenceMedia}
                    teaching={g.teaching}
                    teachingMedia={g.teachingMedia}
                    rationaleLessonLinks={rationaleLessonLinksMerged}
                    variant="exam"
                    defaultOpenExplanation={!g.correct}
                    reviewActionStrip={
                      <QuestionReviewActionStrip
                        bookmarked={Boolean(markedForReview[current.id])}
                        onToggleBookmark={() =>
                          setMarkedForReview((f) => ({ ...f, [current.id]: !f[current.id] }))
                        }
                        showMistakeCta={!g.correct}
                        onAddToMistakeNotebook={addCurrentToMistakeNotebook}
                        mistakeAdded={Boolean(mistakeNotebookByQuestion[current.id])}
                        mistakeBusy={mistakeNotebookSaving}
                        onJumpToNotes={scrollToQuestionNotes}
                      />
                    }
                    recommendationsSlot={learningLoopRecommendations}
                  />
                )}
                <div className="nn-question-nav-actions">
                  {examShell ? (
                    <button
                      type="button"
                      aria-pressed={Boolean(markedForReview[current.id])}
                      className={`inline-flex min-h-[2.75rem] shrink-0 items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        markedForReview[current.id]
                          ? "border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                          : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)] hover:bg-[var(--semantic-panel-muted)]"
                      }`}
                      onClick={() => setMarkedForReview((f) => ({ ...f, [current.id]: !f[current.id] }))}
                    >
                      {markedForReview[current.id] ? t("learner.qbank.examUi.markedReview") : t("learner.qbank.examUi.markReview")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={idx === 0}
                    className="nn-btn-secondary min-h-[3rem] rounded-full px-5 text-sm font-semibold disabled:opacity-40"
                    onClick={prev}
                  >
                    {t("learner.qbank.ui.previous")}
                  </button>
                  {idx < total - 1 ? (
                    <button
                      type="button"
                      className="nn-btn-primary nn-question-nav-actions__next inline-flex items-center justify-center rounded-full px-8 text-base font-semibold shadow-none"
                      onClick={next}
                    >
                      {t("learner.qbank.ui.nextQuestion")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="nn-btn-secondary nn-question-nav-actions__next inline-flex items-center justify-center rounded-full px-6 text-base font-semibold"
                      onClick={() => void loadBatch(true)}
                    >
                      {t("learner.qbank.ui.loadMore")}
                    </button>
                  )}
                </div>
                <QuestionSessionStudyLoopPanel
                  questions={questions}
                  graded={graded}
                  pathwayId={pathwayIdFilter}
                  visible={idx === total - 1 && !!g}
                />
              </div>
            )}
          </div>
        </ExamSessionShell>
      </ProtectedPremiumContent>
      <div id="qbank-question-notes" className="scroll-mt-24">
        <StudyNotesPanel
          userId={userId}
          scope={LearnerNoteScope.QUESTION_BANK}
          contextId={current.id}
          topic={current.topic}
          sourceLabel={`Question ${current.id.slice(0, 8)}…${current.topic ? ` · ${current.topic}` : ""}`}
          userLabel={userLabel}
          flags={protectionFlags}
        />
      </div>
    </div>
  );
}
