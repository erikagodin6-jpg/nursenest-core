import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { PooledQuestion } from "@/lib/question-pool";
import {
  initCAT, selectNextItem, updateAbility, shouldStop,
  getPassFailResult, getDomainBands, computeScaledScore,
  getReadinessScore, getWeakAreas, getStrengthAreas, getDifficultyDistribution,
  type CATState
} from "@/lib/cat-engine";
import { EXAM_BLUEPRINTS } from "@/lib/question-pool";
import { ExamErrorBoundary, ExamReportButton, QuestionErrorBoundary } from "@/components/exam-error-boundary";
import { createCheckpointManager } from "@/lib/session-checkpoint";
import { clearExamCheckpoint } from "@/lib/exam-session-checkpoint";
import { generateIncidentId } from "@/lib/resilience";
import {
  classifyHttpError, classifyClientError,
  type ClassifiedExamError, type RecoveryStage,
  RECOVERY_STAGES, getRecoveryStageInfo,
  EXAM_FAILURE_CODES,
  EXAM_ERROR_USER_MESSAGES,
} from "../../../shared/exam-error-codes";
import { getAuthHeaders as getSessionAuthHeaders } from "@/lib/queryClient";

const EXAM_FETCH_DEFAULTS = { credentials: "include" as const };

/** Session/JWT headers plus legacy basic-auth-style headers; matches app-wide `getAuthHeaders` + nursenest-credentials. */
function buildMockExamHeaders(jsonBody = false): Record<string, string> {
  const headers: Record<string, string> = { ...getSessionAuthHeaders() };
  try {
    const creds = localStorage.getItem("nursenest-credentials");
    if (creds) {
      const { username, password } = JSON.parse(creds);
      if (username != null) headers["x-username"] = String(username);
      if (password != null) headers["x-password"] = String(password);
    }
  } catch {
    /* ignore */
  }
  if (jsonBody) headers["Content-Type"] = "application/json";
  return headers;
}
import {
  Clock, Flag, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Pause, Play, AlertTriangle, Send, SkipForward, Shield, Eye, Coffee,
  ShieldCheck, BookOpen, Printer, Home, RefreshCw, MessageSquare, Loader2, FileText
} from "lucide-react";
import { QuestionGuard, MediaGuard, TranslationGuard, RationaleGuard, SafeExamPlayer, StudyModeFallback, PrintableBackup, BackupPracticeSet, SessionRecoveryPrompt, FallbackErrorBoundary } from "@/components/exam-fallbacks";

function getExamAccentColor(): string {
  return localStorage.getItem("examThemeColor") || "#C7B8FF";
}

function createOptionShuffleMap(questions: PooledQuestion[]): Record<string, number[]> {
  const map: Record<string, number[]> = {};
  for (const q of questions) {
    if (!q.options || q.options.length <= 1) continue;
    const indices = q.options.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    map[q.id] = indices;
  }
  return map;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface BlueprintMeta {
  examCode: string;
  examName: string;
  passingThreshold: number;
  domainPassThreshold: number;
  domains: { name: string; weight: number }[];
  timeLimit: number;
  domainAssignments?: Record<string, string>;
  examType?: "cat" | "linear-scaled" | "readiness";
  scaledScoreRange?: { min: number; max: number; passScore: number };
  minQuestions?: number;
  maxQuestions?: number;
  showQuestionCount?: boolean;
}

function isQuestionAnswerable(q: PooledQuestion): boolean {
  if (!q || !q.id || !q.question) return false;
  if (!Array.isArray(q.options) || q.options.length < 2) return false;
  if (q.correct === undefined || q.correct === null || q.correct < 0 || q.correct >= q.options.length) return false;
  return true;
}

function computeReport(
  questions: PooledQuestion[],
  answers: Record<string, number>,
  blueprintMeta?: BlueprintMeta | null,
  catState?: CATState | null
) {
  let correct = 0;
  const systemScores: Record<string, { correct: number; total: number }> = {};
  const domainScores: Record<string, { correct: number; total: number }> = {};
  const questionReview: Array<{
    id: string;
    question: string;
    options: string[];
    correct: number;
    selected: number;
    isCorrect: boolean;
    rationale: string;
    bodySystem: string;
    lessonId: string;
    domain?: string;
    skipped?: boolean;
  }> = [];

  if (blueprintMeta?.domains) {
    for (const d of blueprintMeta.domains) {
      domainScores[d.name] = { correct: 0, total: 0 };
    }
  }

  for (const q of questions) {
    if (!isQuestionAnswerable(q)) {
      questionReview.push({
        id: q.id,
        question: q.question || "",
        options: q.options || [],
        correct: q.correct,
        selected: -1,
        isCorrect: false,
        rationale: q.rationale || "",
        bodySystem: q.bodySystem || "General",
        lessonId: q.lessonId,
        skipped: true,
      });
      continue;
    }
    const bodySystem = q.bodySystem || "General";
    if (!systemScores[bodySystem]) {
      systemScores[bodySystem] = { correct: 0, total: 0 };
    }
    systemScores[bodySystem].total++;

    const domainName = blueprintMeta?.domainAssignments?.[q.id];
    if (domainName) {
      if (!domainScores[domainName]) domainScores[domainName] = { correct: 0, total: 0 };
      domainScores[domainName].total++;
    }

    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct;
    if (isCorrect) {
      correct++;
      systemScores[bodySystem].correct++;
      if (domainName && domainScores[domainName]) {
        domainScores[domainName].correct++;
      }
    }

    questionReview.push({
      id: q.id,
      question: q.question || "",
      options: q.options || [],
      correct: q.correct,
      selected: userAnswer ?? -1,
      isCorrect,
      rationale: q.rationale || "",
      bodySystem,
      lessonId: q.lessonId,
      domain: domainName || undefined,
    });
  }

  const weakAreas = Object.entries(systemScores)
    .filter(([_, s]) => s.total >= 2 && (s.correct / s.total) < 0.6)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
    .map(([system, s]) => ({
      system,
      score: Math.round((s.correct / s.total) * 100),
      correct: s.correct,
      total: s.total,
    }));

  const answerableCount = questionReview.filter(qr => !qr.skipped).length;
  const overallPercentage = answerableCount > 0 ? Math.round((correct / answerableCount) * 100) : 0;
  const examType = blueprintMeta?.examType || null;

  let isOfficialMode = false;
  let overallPass = true;
  let failedDomains: string[] = [];
  let domainBreakdown: { name: string; correct: number; total: number; percentage: number; passed: boolean; weight: number }[] = [];
  let scaledScore: number | null = null;
  let domainBands: ReturnType<typeof getDomainBands> | null = null;

  if (examType === "cat" && catState) {
    isOfficialMode = true;
    const catResult = getPassFailResult(catState);
    overallPass = catResult.passed;
    domainBands = getDomainBands(domainScores);
    domainBreakdown = blueprintMeta!.domains.map(d => {
      const ds = domainScores[d.name] || { correct: 0, total: 0 };
      const pct = ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : 0;
      const passed = pct >= 50;
      if (!passed) failedDomains.push(d.name);
      return { name: d.name, correct: ds.correct, total: ds.total, percentage: pct, passed, weight: d.weight };
    });
  } else if (examType === "linear-scaled" && blueprintMeta?.scaledScoreRange) {
    isOfficialMode = true;
    const scaled = computeScaledScore(overallPercentage, blueprintMeta.scaledScoreRange);
    scaledScore = scaled.scaledScore;
    overallPass = scaled.passed;
    domainBreakdown = blueprintMeta.domains.map(d => {
      const ds = domainScores[d.name] || { correct: 0, total: 0 };
      const pct = ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : 0;
      const passed = pct >= (blueprintMeta.domainPassThreshold || 50);
      if (!passed) failedDomains.push(d.name);
      return { name: d.name, correct: ds.correct, total: ds.total, percentage: pct, passed, weight: d.weight };
    });
  } else if (blueprintMeta && blueprintMeta.domains) {
    if (examType !== "readiness") {
      isOfficialMode = true;
    }
    domainBreakdown = blueprintMeta.domains.map(d => {
      const ds = domainScores[d.name] || { correct: 0, total: 0 };
      const pct = ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : 0;
      const passed = pct >= blueprintMeta.domainPassThreshold;
      if (!passed) failedDomains.push(d.name);
      return { name: d.name, correct: ds.correct, total: ds.total, percentage: pct, passed, weight: d.weight };
    });
    overallPass = overallPercentage >= blueprintMeta.passingThreshold && failedDomains.length === 0;
  }

  const readiness = catState ? getReadinessScore(catState) : null;
  const catWeakAreas = catState ? getWeakAreas(catState) : [];
  const difficultyDist = catState ? getDifficultyDistribution(catState) : null;

  return {
    score: correct,
    totalQuestions: answerableCount,
    percentage: overallPercentage,
    systemBreakdown: Object.entries(systemScores).map(([system, s]) => ({
      system,
      correct: s.correct,
      total: s.total,
      percentage: Math.round((s.correct / s.total) * 100),
    })).sort((a, b) => a.percentage - b.percentage),
    weakAreas,
    questionReview,
    isOfficialMode,
    overallPass,
    failedDomains,
    domainBreakdown,
    blueprintCode: blueprintMeta?.examCode || null,
    blueprintName: blueprintMeta?.examName || null,
    passingThreshold: blueprintMeta?.passingThreshold || null,
    domainPassThreshold: blueprintMeta?.domainPassThreshold || null,
    examType,
    scaledScore,
    domainBands,
    readiness,
    catWeakAreas,
    difficultyDist,
  };
}

export default function MockExamSessionWithBoundary() {
  return (
    <ExamErrorBoundary examContext={{ examType: "mock-exam" }}>
      <MockExamSessionInner />
    </ExamErrorBoundary>
  );
}

function MockExamSessionInner() {
  const { id: attemptId } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useI18n();

  const backToExamsPath = useMemo(() => {
    const path = window.location.pathname;
    const match = path.match(/^(\/[^/]+)\/mock-exams\//);
    return match ? `${match[1]}/mock-exams` : "/mock-exams";
  }, []);

  const [questions, setQuestions] = useState<PooledQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [classifiedError, setClassifiedError] = useState<ClassifiedExamError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [recoveryStage, setRecoveryStage] = useState<RecoveryStage | null>(null);
  const [recoveryInProgress, setRecoveryInProgress] = useState(false);
  const [incidentRef] = useState(() => generateIncidentId());
  const loadStartTimeRef = useRef<number>(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [blueprintMeta, setBlueprintMeta] = useState<BlueprintMeta | null>(null);
  const [catState, setCatState] = useState<CATState | null>(null);
  const [catFinished, setCatFinished] = useState(false);
  const [allPoolQuestions, setAllPoolQuestions] = useState<PooledQuestion[]>([]);
  const [optionShuffleMap, setOptionShuffleMap] = useState<Record<string, number[]>>({});
  const [completionData, setCompletionData] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "flagged">("all");
  const [fullQuestions, setFullQuestions] = useState<PooledQuestion[]>([]);
  const [totalServerQuestions, setTotalServerQuestions] = useState<number>(0);
  const [loadedAllQuestions, setLoadedAllQuestions] = useState(false);
  const [translationMap, setTranslationMap] = useState<Record<string, Record<string, string>>>({});
  const lastBreakRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>(undefined);
  const [accentColor] = useState(() => getExamAccentColor());
  const [fallbackMode, setFallbackMode] = useState<"safe" | "study" | "printable" | "backup-practice" | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fb = params.get("fallback");
      if (fb === "safe" || fb === "study" || fb === "printable" || fb === "backup-practice") return fb;
    } catch {
    }
    return null;
  });
  const [reducedLoadMode] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get("reduced_load") === "1";
    } catch { return false; }
  });
  const [resumeFromLast] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get("resume") === "last";
    } catch { return false; }
  });
  const [circuitOpen, setCircuitOpen] = useState(false);
  const [sessionRecovery, setSessionRecovery] = useState<{
    show: boolean;
    answeredCount: number;
    totalQuestions: number;
    timeSpent: number;
    currentQuestion?: number;
  } | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--exam-accent", accentColor);
    document.documentElement.style.setProperty("--exam-chrome-color", accentColor);
    return () => {
      document.documentElement.style.removeProperty("--exam-accent");
    };
  }, [accentColor]);

  const isCATExam = blueprintMeta?.examType === "cat";
  const isLinearScaled = blueprintMeta?.examType === "linear-scaled";
  const isReadiness = blueprintMeta?.examType === "readiness";

  useEffect(() => {
    if (!attemptId) return;
    const isStrict = localStorage.getItem(`strict-mode-${attemptId}`) === "true";
    setStrictMode(isStrict);

    let parsedBp: BlueprintMeta | null = null;
    try {
      const bpData = localStorage.getItem(`blueprint-${attemptId}`);
      if (bpData) {
        parsedBp = JSON.parse(bpData);
        setBlueprintMeta(parsedBp);
      }
    } catch (e) {
      console.warn("[ExamSession] Failed to parse blueprint localStorage, continuing with defaults:", e);
      try { localStorage.removeItem(`blueprint-${attemptId}`); } catch {}
    }

    try {
      const specialtyData = localStorage.getItem(`specialty-mock-${attemptId}`);
      if (specialtyData && !parsedBp) {
        const sp = JSON.parse(specialtyData);
        const sections = sp.sections || [];
        setBlueprintMeta({
          examCode: `specialty-${sp.specialty}`,
          examName: sp.examTitle || "Specialty Mock Exam",
          passingThreshold: 65,
          domainPassThreshold: 50,
          domains: sections.map((s: any) => ({ name: s.name, weight: s.questionCount || 15 })),
          timeLimit: sp.timeLimit || 150,
        });
      }
    } catch (e) {
      console.warn("[ExamSession] Failed to parse specialty-mock localStorage, continuing with defaults:", e);
      try { localStorage.removeItem(`specialty-mock-${attemptId}`); } catch {}
    }

    let fallbackToastShown = false;
    try {
      const catFallbackData = localStorage.getItem(`cat-fallback-${attemptId}`);
      if (catFallbackData) {
        const fb = JSON.parse(catFallbackData);
        if (fb.fallbackMessage) {
          toast({
            title: "Exam Mode Changed",
            description: fb.fallbackMessage,
            variant: "default",
            duration: 8000,
          });
          fallbackToastShown = true;
        }
        localStorage.removeItem(`cat-fallback-${attemptId}`);
      }
    } catch (e) {
      console.warn("[ExamSession] Failed to parse cat-fallback localStorage:", e);
      try { localStorage.removeItem(`cat-fallback-${attemptId}`); } catch {}
    }

    try {
      const savedCat = localStorage.getItem(`cat-state-${attemptId}`);
      if (savedCat) {
        const parsed = JSON.parse(savedCat);
        if (parsed && typeof parsed === "object" && typeof parsed.itemsAdministered === "number") {
          setCatState(parsed);
        } else {
          console.warn("[ExamSession] Corrupted cat-state in localStorage, ignoring");
          try { localStorage.removeItem(`cat-state-${attemptId}`); } catch {}
        }
      }
    } catch (e) {
      console.warn("[ExamSession] Failed to parse cat-state localStorage, continuing with defaults:", e);
      try { localStorage.removeItem(`cat-state-${attemptId}`); } catch {}
    }

    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => { timedOut = true; controller.abort(); }, 30000);

    loadStartTimeRef.current = Date.now();

    fetch(`/api/mock-exams/${attemptId}`, { ...EXAM_FETCH_DEFAULTS, headers: buildMockExamHeaders(), signal: controller.signal })
      .then(async (r) => {
        clearTimeout(timeoutId);
        if (!r.ok) {
          let body: any;
          try { body = await r.json(); } catch { body = null; }
          const classified = classifyHttpError(r.status, body);
          const err = new Error(classified.message);
          (err as any).classifiedError = classified;
          throw err;
        }
        return r.json();
      })
      .then(async (data) => {
        if (data.fallbackMode) {
          setCircuitOpen(!!data.circuitOpen);
          if (data.fallbackMode === "safe" || data.fallbackMode === "study" || data.fallbackMode === "printable" || data.fallbackMode === "backup-practice") {
            setFallbackMode(data.fallbackMode);
          }
          if (data.fallbackMessage && !fallbackToastShown) {
            toast({
              title: "Exam Mode Changed",
              description: data.fallbackMessage,
              variant: "default",
              duration: 8000,
            });
          }
        }
        if (data.circuitOpen) {
          setCircuitOpen(true);
          if (!data.fallbackMode) {
            setFallbackMode("safe");
          }
        }

        if (data.status === "completed") {
          navigate(`/mock-exams/${attemptId}/report`);
          return;
        }

        try {
        const savedAnswers = data.answers || {};
        const savedTimeSpent = data.timeSpent || data.time_spent || 0;
        const isShellResponse = data.shell === true;

        if (data.reasonCode === "zero_questions") {
          setLoadError("zero_questions");
          setClassifiedError({
            code: EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING,
            message: data.error || "No questions could be loaded for this exam.",
            recoverable: true,
            timestamp: new Date().toISOString(),
          });
          setLoading(false);
          return;
        }

        const totalQ = data.total_questions || data.totalQuestions || (data.questions || []).length;

        if (data.total_questions || data.totalQuestions) {
          setTotalServerQuestions(totalQ);
        }

        if (isShellResponse && data.status === "in_progress" && totalQ > 0) {
          if (data.blueprintMeta) {
            setBlueprintMeta(data.blueprintMeta);
          }
          setAnswers(savedAnswers);
          setFlagged(data.flagged || []);
          setTimeSpent(savedTimeSpent);

          if (data.catState) {
            try {
              if (typeof data.catState === "object" && typeof data.catState.itemsAdministered === "number") {
                setCatState(data.catState);
              }
            } catch {}
          }

          const answeredCount = Object.keys(savedAnswers).length;
          if (answeredCount > 0) {
            setSessionRecovery({
              show: true,
              answeredCount,
              totalQuestions: totalQ,
              timeSpent: savedTimeSpent,
              currentQuestion: answeredCount,
            });
          }

          try {
            const batchSize = 25;
            const firstBatchRes = await fetch(`/api/mock-exams/${attemptId}/questions?offset=0&limit=${batchSize}`, {
              ...EXAM_FETCH_DEFAULTS,
              headers: buildMockExamHeaders(),
            });
            const firstBatchText = await firstBatchRes.text();
            let firstBatchParsed: unknown = null;
            try {
              firstBatchParsed = firstBatchText.trim() ? JSON.parse(firstBatchText) : null;
            } catch {
              firstBatchParsed = null;
            }
            if (!firstBatchRes.ok) {
              const classified = classifyHttpError(firstBatchRes.status, firstBatchParsed);
              const batchErr = new Error(classified.message);
              (batchErr as any).classifiedError = classified;
              throw batchErr;
            }
            const firstBatch = (firstBatchParsed && typeof firstBatchParsed === "object"
              ? firstBatchParsed
              : {}) as { questions?: unknown[] };
            const batchQuestions: PooledQuestion[] = (firstBatch.questions || []).map((q: any, idx: number) => {
              if (!q) return { id: `placeholder-${idx}`, question: "", options: [], correct: -1, lessonId: "", bodySystem: "", tier: "", rationale: "", source: "quiz" as const };
              if (!q.id) return { ...q, id: `auto-${idx}` };
              return q;
            });

            if (batchQuestions.length === 0) {
              setLoadError("zero_questions");
              setClassifiedError({
                code: EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING,
                message: "No questions could be loaded for this exam.",
                recoverable: true,
                timestamp: new Date().toISOString(),
              });
              setLoading(false);
              return;
            }

            if (parsedBp?.examType === "cat") {
              let catPool = batchQuestions;
              if (totalQ > batchQuestions.length) {
                try {
                  const allRes = await fetch(`/api/mock-exams/${attemptId}/questions?offset=0&limit=${totalQ}`, {
                    ...EXAM_FETCH_DEFAULTS,
                    headers: buildMockExamHeaders(),
                  });
                  if (allRes.ok) {
                    const allData = await allRes.json();
                    const fullPool: PooledQuestion[] = (allData.questions || []).filter((q: any) => q && q.id);
                    if (fullPool.length > catPool.length) {
                      catPool = fullPool;
                    }
                  }
                } catch {}
              }
              setAllPoolQuestions(catPool);
              const fullBlueprint = parsedBp?.examCode ? EXAM_BLUEPRINTS[parsedBp.examCode] : undefined;
              let existingCat: CATState | null = null;

              if (data.catState && typeof data.catState === "object" && typeof data.catState.itemsAdministered === "number") {
                existingCat = data.catState;
              }

              if (existingCat && existingCat.itemsAdministered > 0) {
                const administeredIds = new Set(existingCat.responses.map(r => r.itemId));
                const administeredQuestions = catPool.filter(q => administeredIds.has(q.id));
                setQuestions(administeredQuestions.length > 0 ? administeredQuestions : [catPool[0]]);
                setOptionShuffleMap(createOptionShuffleMap(administeredQuestions.length > 0 ? administeredQuestions : [catPool[0]]));
                setCurrentQ(administeredQuestions.length > 0 ? administeredQuestions.length - 1 : 0);
                setCatState(existingCat);
              } else {
                const freshCat = initCAT(fullBlueprint);
                const domainMap = parsedBp?.domainAssignments || {};
                const firstItem = selectNextItem(freshCat, catPool, fullBlueprint, domainMap);
                if (firstItem) {
                  setQuestions([firstItem]);
                  setOptionShuffleMap(createOptionShuffleMap([firstItem]));
                  setCurrentQ(0);
                }
                setCatState(freshCat);
                try { localStorage.setItem(`cat-state-${attemptId}`, JSON.stringify(freshCat)); } catch {}
              }
            } else {
              setQuestions(batchQuestions);
              setOptionShuffleMap(createOptionShuffleMap(batchQuestions));
              if (resumeFromLast && answeredCount > 0) {
                setCurrentQ(Math.min(answeredCount, batchQuestions.length - 1));
              }
            }

            setLoading(false);
          } catch (fetchErr: any) {
            console.error("[ExamSession] Failed to fetch initial questions from shell:", fetchErr);
            const fromClassified = fetchErr?.classifiedError as ClassifiedExamError | undefined;
            setLoadError("question_fetch_failed");
            setClassifiedError(
              fromClassified ?? {
                code: EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING,
                message: fetchErr?.message || "Failed to load exam questions. Please try again.",
                recoverable: true,
                timestamp: new Date().toISOString(),
              },
            );
            setLoading(false);
          }
          return;
        }

        if (!Array.isArray(data.questions) && data.status === "in_progress") {
          setLoadError("zero_questions");
          setClassifiedError({
            code: EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING,
            message: data.error || "No questions could be loaded for this exam.",
            recoverable: true,
            timestamp: new Date().toISOString(),
          });
          setLoading(false);
          return;
        }

        const answeredCount = Object.keys(savedAnswers).length;
        if (answeredCount > 0 && data.status === "in_progress" && totalQ > 0) {
          setSessionRecovery({
            show: true,
            answeredCount,
            totalQuestions: totalQ,
            timeSpent: savedTimeSpent,
            currentQuestion: answeredCount,
          });
        }

        const rawQuestionData: PooledQuestion[] = data.questions || [];
        const allQuestions = rawQuestionData.map((q, idx) => {
          if (!q) return { id: `placeholder-${idx}`, question: "", options: [], correct: -1, lessonId: "", bodySystem: "", tier: "", rationale: "", source: "quiz" as const };
          if (!q.id) return { ...q, id: `auto-${idx}` };
          return q;
        });

        if (allQuestions.length === 0 && data.status === "in_progress") {
          setLoadError("zero_questions");
          setClassifiedError({
            code: EXAM_FAILURE_CODES.QUESTION_BATCH_MISSING,
            message: "No questions could be loaded for this exam. The question data may be missing or corrupted.",
            recoverable: true,
            timestamp: new Date().toISOString(),
          });
          setLoading(false);
          return;
        }

        const invalidQuestionIds = allQuestions
          .filter(q => !q.question || !Array.isArray(q.options) || q.options.length < 2 || q.correct === undefined || q.correct === null || q.correct < 0)
          .map(q => q.id);
        if (invalidQuestionIds.length > 0) {
          console.warn("[ExamSession] Detected invalid questions (guarded in-place by QuestionGuard):", {
            attemptId,
            invalidCount: invalidQuestionIds.length,
            totalRaw: rawQuestionData.length,
            invalidIds: invalidQuestionIds.slice(0, 10),
          });
          try {
            fetch("/api/exam-incident-report", {
              method: "POST",
              ...EXAM_FETCH_DEFAULTS,
              headers: buildMockExamHeaders(true),
              body: JSON.stringify({
                examType: parsedBp?.examCode || "mock-exam",
                tier: parsedBp?.examCode || "unknown",
                route: window.location.pathname,
                errorMessage: `Detected ${invalidQuestionIds.length} invalid questions (guarded in-place)`,
                additionalContext: {
                  attemptId,
                  invalidCount: invalidQuestionIds.length,
                  totalCount: allQuestions.length,
                  invalidIds: invalidQuestionIds.slice(0, 10),
                },
              }),
            }).catch(() => {});
          } catch {
          }
        }

        if (parsedBp?.examType === "cat") {
          setAllPoolQuestions(allQuestions);

          const fullBlueprint = parsedBp?.examCode ? EXAM_BLUEPRINTS[parsedBp.examCode] : undefined;

          const savedCatStr = localStorage.getItem(`cat-state-${attemptId}`);
          let existingCat: CATState | null = null;
          try {
            if (savedCatStr) {
              const parsed = JSON.parse(savedCatStr);
              if (parsed && typeof parsed === "object" && typeof parsed.itemsAdministered === "number") {
                existingCat = parsed;
              } else {
                console.warn("[ExamSession] Corrupted cat-state during hydration, ignoring");
                try { localStorage.removeItem(`cat-state-${attemptId}`); } catch {}
              }
            }
          } catch (e) {
            console.warn("[ExamSession] Failed to parse cat-state during hydration:", e);
            try { localStorage.removeItem(`cat-state-${attemptId}`); } catch {}
          }

          if (data.cat_state) {
            const serverItems = data.cat_state.itemsAdministered || 0;
            const localItems = existingCat?.itemsAdministered || 0;
            if (serverItems >= localItems) {
              existingCat = data.cat_state;
            }
          }

          if (existingCat && existingCat.itemsAdministered > 0) {
            const administeredIds = new Set(existingCat.responses.map(r => r.itemId));
            const administeredQuestions = allQuestions.filter(q => administeredIds.has(q.id));
            setQuestions(administeredQuestions);
            setOptionShuffleMap(createOptionShuffleMap(administeredQuestions));
            setCurrentQ(administeredQuestions.length - 1);
            setCatState(existingCat);
          } else {
            const freshCat = initCAT(fullBlueprint);
            const domainMap = parsedBp?.domainAssignments || {};
            const firstItem = selectNextItem(freshCat, allQuestions, fullBlueprint, domainMap);
            if (firstItem) {
              setQuestions([firstItem]);
              setOptionShuffleMap(createOptionShuffleMap([firstItem]));
              setCurrentQ(0);
            }
            setCatState(freshCat);
            try {
              localStorage.setItem(`cat-state-${attemptId}`, JSON.stringify(freshCat));
            } catch (e) {
              console.warn("[ExamSession] Failed to save cat-state to localStorage:", e);
            }
          }
        } else {
          setQuestions(allQuestions);
          setOptionShuffleMap(createOptionShuffleMap(allQuestions));
        }

        setAnswers(data.answers || {});
        setFlagged(data.flagged || []);
        setTimeSpent(data.time_spent || 0);

        if (resumeFromLast) {
          const answeredCount = Object.keys(data.answers || {}).length;
          if (answeredCount > 0) {
            setCurrentQ(Math.min(answeredCount, allQuestions.length - 1));
          }
        }

        if (reducedLoadMode && allQuestions.length > 0 && parsedBp?.examType !== "cat") {
          const answeredCount = Object.keys(data.answers || {}).length;
          const nextIdx = Math.min(answeredCount, allQuestions.length - 1);
          setQuestions([allQuestions[nextIdx]]);
          setOptionShuffleMap(createOptionShuffleMap([allQuestions[nextIdx]]));
          setCurrentQ(0);
          setFullQuestions(allQuestions);
        }

        setLoading(false);
        } catch (processingError: any) {
          console.error("[ExamSession] Data processing pipeline error:", processingError);
          setFallbackMode("safe");
          setLoadError("frontend_parse_failure");
          setClassifiedError({
            code: EXAM_FAILURE_CODES.FRONTEND_PARSE_FAILURE,
            message: "An error occurred while processing exam data. Entering safe mode.",
            recoverable: true,
            timestamp: new Date().toISOString(),
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err.name === "AbortError" && !timedOut) return;
        const classified = (err as any).classifiedError || classifyClientError(err);
        const elapsed = Date.now() - loadStartTimeRef.current;

        console.error("[ExamSession] Load failed:", {
          attemptId,
          code: classified.code,
          message: classified.message,
          elapsed,
          retryCount,
          incidentRef,
        });

        toast({
          title: classified.code === "network_timeout" ? "Request Timed Out" : "Error Loading Exam",
          description: classified.code === "network_timeout"
            ? "The exam took too long to load. Please try again."
            : "Could not load this exam. Your progress is safe.",
          variant: "destructive",
        });

        setClassifiedError(classified);
        setLoadError(classified.code);
        setLoading(false);

        submitExamIncidentReport(classified, elapsed);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [attemptId, retryCount]);

  useEffect(() => {
    if (!attemptId || loading || loadedAllQuestions || totalServerQuestions <= 0 || isCATExam) return;
    if (questions.length >= totalServerQuestions) {
      setLoadedAllQuestions(true);
      return;
    }

    let cancelled = false;
    const loadRemainingQuestions = async () => {
      const batchSize = 25;
      let offset = questions.length;
      const allLoaded = [...questions];

      while (offset < totalServerQuestions && !cancelled) {
        try {
          const res = await fetch(`/api/mock-exams/${attemptId}/questions?offset=${offset}&limit=${batchSize}`, {
            ...EXAM_FETCH_DEFAULTS,
            headers: buildMockExamHeaders(),
          });
          if (!res.ok) break;
          const data = await res.json();
          if (!data.questions || data.questions.length === 0) break;

          const newQuestions = data.questions.map((q: any) => {
            if (!q.id) return { ...q, id: `auto-${offset}` };
            return q;
          });
          allLoaded.push(...newQuestions);
          offset += data.questions.length;

          if (!cancelled) {
            setQuestions([...allLoaded]);
            setOptionShuffleMap(createOptionShuffleMap(allLoaded));
          }

          if (!data.hasMore) break;
        } catch (err) {
          console.warn("[ExamSession] Background question loading error:", err);
          break;
        }
      }

      if (!cancelled) {
        setLoadedAllQuestions(true);
      }
    };

    const timer = setTimeout(loadRemainingQuestions, 500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [attemptId, loading, totalServerQuestions, loadedAllQuestions]);

  const submitExamIncidentReport = useCallback((classified: ClassifiedExamError, elapsed: number) => {
    if (!attemptId) return;
    fetch("/api/exam-load-incidents", {
      method: "POST",
      ...EXAM_FETCH_DEFAULTS,
      headers: buildMockExamHeaders(true),
      body: JSON.stringify({
        incidentRef,
        attemptId,
        failureCode: classified.code,
        failureMessage: classified.message,
        httpStatus: classified.httpStatus,
        recoveryAttempts: retryCount,
        browserInfo: navigator.userAgent,
        elapsedMs: elapsed,
        route: window.location.pathname,
        requestSummary: {
          online: navigator.onLine,
          screenWidth: window.innerWidth,
        },
      }),
    }).catch(() => {});
  }, [attemptId, incidentRef, retryCount]);

  const clearStaleExamCache = useCallback(() => {
    if (!attemptId) return;
    const keysToCheck = [
      `cat-state-${attemptId}`,
      `blueprint-${attemptId}`,
      `specialty-mock-${attemptId}`,
      `strict-mode-${attemptId}`,
      `nursenest-exam-checkpoint-${attemptId}`,
      `session-checkpoint-mock-exam-${attemptId}`,
    ];
    let cleared = 0;
    for (const key of keysToCheck) {
      try {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          cleared++;
        }
      } catch {}
    }
    console.log(`[ExamRecovery] Cleared ${cleared} stale localStorage keys for attempt ${attemptId}`);
  }, [attemptId]);

  const performMultiStageRecovery = useCallback(async () => {
    if (!attemptId || recoveryInProgress) return;
    setRecoveryInProgress(true);
    const currentRetry = retryCount + 1;

    if (currentRetry > 2) {
      setRecoveryStage(RECOVERY_STAGES.SAFE_EXIT);
      setLoading(false);
      setLoadError("All automatic recovery attempts exhausted");
      setClassifiedError(classifiedError || { code: "retries_exhausted", message: "All retries exhausted", recoverable: false, timestamp: new Date().toISOString() });
      submitExamIncidentReport(
        classifiedError || { code: "retries_exhausted", message: "All retries exhausted", recoverable: false, timestamp: new Date().toISOString() },
        Date.now() - loadStartTimeRef.current
      );
      setRecoveryInProgress(false);
      return;
    }

    try {
      const backoff = currentRetry === 1 ? 2000 : 4000;
      setRecoveryStage(currentRetry === 1 ? RECOVERY_STAGES.CLEAR_CACHE : RECOVERY_STAGES.CALL_RECOVERY);

      if (currentRetry === 1) {
        clearStaleExamCache();
      }

      await new Promise(r => setTimeout(r, backoff));
      setRetryCount(currentRetry);
    } catch (err) {
      console.error("[ExamRecovery] Recovery error:", err);
      setLoading(false);
      setLoadError("Recovery failed unexpectedly");
    }
    setRecoveryInProgress(false);
  }, [attemptId, retryCount, recoveryInProgress, classifiedError, incidentRef, clearStaleExamCache, submitExamIncidentReport, toast]);

  const questionIdSignature = useMemo(() => questions.map(q => q.id).join(","), [questions]);

  useEffect(() => {
    if (language === "en" || loading || questions.length === 0) {
      setTranslationMap({});
      return;
    }
    const questionIds = questions.map(q => q.id);
    fetch("/api/exam-questions/translated-batch", {
      method: "POST",
      ...EXAM_FETCH_DEFAULTS,
      headers: buildMockExamHeaders(true),
      body: JSON.stringify({ questionIds, lang: language }),
    })
      .then(r => {
        if (!r.ok) throw new Error("Translation fetch failed");
        return r.json();
      })
      .then(data => {
        if (data.translations) setTranslationMap(data.translations);
      })
      .catch(() => { setTranslationMap({}); });
  }, [language, loading, questionIdSignature]);

  const getTranslatedQuestion = useCallback((q: PooledQuestion): PooledQuestion => {
    if (language === "en" || !translationMap[q.id]) return q;
    const t = translationMap[q.id];
    const translated = { ...q };
    if (t.stem) translated.question = t.stem;
    if (t.options) {
      try {
        const parsedOptions = JSON.parse(t.options);
        if (Array.isArray(parsedOptions)) {
          translated.options = parsedOptions.map((o: any) =>
            typeof o === "object" ? (o.text || String(o)) : String(o)
          );
        }
      } catch {}
    }
    if (t.rationale) (translated as any).rationale = t.rationale;
    if (t.scenario) (translated as any).scenario = t.scenario;
    if (t.clinicalPearl) (translated as any).clinicalPearl = t.clinicalPearl;
    if (t.examStrategy) (translated as any).examStrategy = t.examStrategy;
    if (t.memoryHook) (translated as any).memoryHook = t.memoryHook;
    if (t.correctAnswerExplanation) (translated as any).correctAnswerExplanation = t.correctAnswerExplanation;
    if (t.clinicalReasoning) (translated as any).clinicalReasoning = t.clinicalReasoning;
    if (t.keyTakeaway) (translated as any).keyTakeaway = t.keyTakeaway;
    if (t.mnemonic) (translated as any).mnemonic = t.mnemonic;
    if (t.distractorRationales) {
      try {
        (translated as any).distractorRationales = JSON.parse(t.distractorRationales);
      } catch {}
    }
    if (t.incorrectAnswerRationale) {
      try {
        (translated as any).incorrectAnswerRationale = JSON.parse(t.incorrectAnswerRationale);
      } catch {}
    }
    return translated;
  }, [language, translationMap]);

  useEffect(() => {
    if (!strictMode || loading) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        setShowTabWarning(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [strictMode, loading]);

  useEffect(() => {
    if (!strictMode || loading) return;
    const BREAK_INTERVAL = 3600;
    if (timeSpent > 0 && timeSpent - lastBreakRef.current >= BREAK_INTERVAL) {
      lastBreakRef.current = timeSpent;
      setShowBreakPrompt(true);
    }
  }, [strictMode, loading, timeSpent]);

  useEffect(() => {
    if (loading || paused) return;
    timerRef.current = setInterval(() => {
      setTimeSpent((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [loading, paused]);

  const latestStateRef = useRef({ answers, flagged, timeSpent, currentQ });
  latestStateRef.current = { answers, flagged, timeSpent, currentQ };

  const checkpointManagerRef = useRef<ReturnType<typeof createCheckpointManager> | null>(null);

  const autoSaveFailCountRef = useRef(0);
  const autoSaveWarningShownRef = useRef(false);

  useEffect(() => {
    if (loading || !attemptId) return;
    const interval = setInterval(() => {
      const { answers: a, flagged: f, timeSpent: t } = latestStateRef.current;
      try {
        fetch(`/api/mock-exams/${attemptId}/progress`, {
          method: "PUT",
          ...EXAM_FETCH_DEFAULTS,
          headers: buildMockExamHeaders(true),
          body: JSON.stringify({
            answers: a, flagged: f, timeSpent: t,
            catState: catState || undefined,
            timerState: { elapsed: t, paused },
          }),
        }).then((res) => {
          if (res.ok) {
            autoSaveFailCountRef.current = 0;
            autoSaveWarningShownRef.current = false;
          } else {
            autoSaveFailCountRef.current++;
            if (autoSaveFailCountRef.current >= 3 && !autoSaveWarningShownRef.current) {
              autoSaveWarningShownRef.current = true;
              toast({
                title: "Auto-Save Issue",
                description: "Progress auto-save is having trouble. Your answers are still saved locally. Please check your connection.",
                variant: "destructive",
              });
            }
          }
        }).catch(() => {
          autoSaveFailCountRef.current++;
          if (autoSaveFailCountRef.current >= 3 && !autoSaveWarningShownRef.current) {
            autoSaveWarningShownRef.current = true;
            toast({
              title: "Auto-Save Issue",
              description: "Progress auto-save is having trouble. Your answers are still saved locally. Please check your connection.",
              variant: "destructive",
            });
          }
        });
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [loading, attemptId, catState, paused, toast]);

  useEffect(() => {
    if (loading || !attemptId) return;
    const mgr = createCheckpointManager("mock-exam", attemptId);
    checkpointManagerRef.current = mgr;
    mgr.startAutoSave(() => {
      const { answers: a, flagged: f, timeSpent: t, currentQ: idx } = latestStateRef.current;
      return {
        currentIndex: idx,
        answers: a,
        flagged: f,
        timeSpent: t,
        metadata: { catState: catState || undefined, paused },
      };
    });
    return () => { mgr.stopAutoSave(); };
  }, [loading, attemptId, catState, paused]);

  const rawQuestion = questions[currentQ] ?? null;
  const question = rawQuestion ? getTranslatedQuestion(rawQuestion) : null;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  useEffect(() => {
    if (!rawQuestion && questions.length > 0 && currentQ >= questions.length) {
      setCurrentQ(Math.max(0, questions.length - 1));
    }
  }, [rawQuestion, questions.length, currentQ]);

  const unsyncedAnswersRef = useRef<Map<string, { questionId: string; selectedOption: number; timeSpentSeconds: number; sequence: number }>>(new Map());
  const answerSaveInFlightRef = useRef<Set<string>>(new Set());

  const saveAnswerToServer = useCallback((questionId: string, selectedOption: number, seq: number): Promise<boolean> => {
    if (!attemptId) return Promise.resolve(false);
    if (answerSaveInFlightRef.current.has(questionId)) return Promise.resolve(true);
    answerSaveInFlightRef.current.add(questionId);
    const payload = {
      questionId,
      selectedOption,
      timeSpentSeconds: 0,
      sequence: seq,
      clientTimestamp: new Date().toISOString(),
    };
    return fetch(`/api/mock-exams/${attemptId}/answer`, {
      method: "POST",
      ...EXAM_FETCH_DEFAULTS,
      headers: buildMockExamHeaders(true),
      body: JSON.stringify(payload),
    })
      .then((r) => {
        answerSaveInFlightRef.current.delete(questionId);
        if (r.ok) {
          unsyncedAnswersRef.current.delete(questionId);
          return true;
        } else {
          unsyncedAnswersRef.current.set(questionId, payload);
          return false;
        }
      })
      .catch(() => {
        answerSaveInFlightRef.current.delete(questionId);
        unsyncedAnswersRef.current.set(questionId, payload);
        return false;
      });
  }, [attemptId]);

  const flushUnsyncedAnswers = useCallback(async (): Promise<void> => {
    if (!attemptId) return;
    const entries = Array.from(unsyncedAnswersRef.current.entries());
    if (entries.length === 0) return;
    await Promise.allSettled(
      entries.map(([qId, payload]) =>
        saveAnswerToServer(qId, payload.selectedOption, payload.sequence)
      )
    );
  }, [attemptId, saveAnswerToServer]);

  const selectAnswer = (questionId: string, optionIndex: number) => {
    if (strictMode && answers[questionId] !== undefined) {
      toast({ title: "Answer Locked", description: "In strict mode, you cannot change your answer once selected.", variant: "destructive" });
      return;
    }
    if (isCATExam && answers[questionId] !== undefined) {
      return;
    }
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));

    saveAnswerToServer(questionId, optionIndex, answeredCount + 1);
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const advanceCAT = useCallback(() => {
    if (!isCATExam || !catState || !attemptId) return;

    const currentQuestion = questions[currentQ];
    if (!currentQuestion) return;

    if (!isQuestionAnswerable(currentQuestion)) {
      const administeredIds = new Set(catState.responses.map(r => r.itemId));
      const remaining = allPoolQuestions.filter(q => !administeredIds.has(q.id) && q.id !== currentQuestion.id);
      const fullBlueprint = blueprintMeta?.examCode ? EXAM_BLUEPRINTS[blueprintMeta.examCode] : null;
      const domainMap = blueprintMeta?.domainAssignments || {};
      const nextItem = selectNextItem(catState, remaining, fullBlueprint || undefined, domainMap);
      if (nextItem) {
        setQuestions(prev => [...prev, nextItem]);
        setOptionShuffleMap(prev => ({ ...prev, ...createOptionShuffleMap([nextItem]) }));
        setCurrentQ(prev => prev + 1);
      } else {
        setCatFinished(true);
        setTimeout(() => {
          submitExamWithState(catState, "pool_exhausted");
        }, 0);
      }
      return;
    }

    const userAnswer = answers[currentQuestion.id];
    if (userAnswer === undefined) return;

    const isCorrect = userAnswer === currentQuestion.correct;
    const domainName = blueprintMeta?.domainAssignments?.[currentQuestion.id];
    const newState = updateAbility(catState, currentQuestion, isCorrect, domainName || undefined);

    const fullBlueprint = blueprintMeta?.examCode ? EXAM_BLUEPRINTS[blueprintMeta.examCode] : null;
    const blueprintForStop = fullBlueprint || {
      totalQuestions: blueprintMeta?.maxQuestions || 150,
      minQuestions: blueprintMeta?.minQuestions || 85,
      maxQuestions: blueprintMeta?.maxQuestions || 150,
      domains: blueprintMeta?.domains || [],
      examType: "cat" as const,
    };

    const stopResult = shouldStop(newState, blueprintForStop as any);
    if (stopResult.stop) {
      setCatState(newState);
      setCatFinished(true);
      localStorage.setItem(`cat-state-${attemptId}`, JSON.stringify(newState));
      saveProgressToServer(newState);
      setTimeout(() => {
        submitExamWithState(newState, stopResult.reason);
      }, 0);
      return;
    }

    const administeredIds = new Set(newState.responses.map(r => r.itemId));
    const remaining = allPoolQuestions.filter(q => !administeredIds.has(q.id));
    const domainMap = blueprintMeta?.domainAssignments || {};
    const nextItem = selectNextItem(newState, remaining, fullBlueprint || undefined, domainMap);

    if (nextItem) {
      setQuestions(prev => [...prev, nextItem]);
      setOptionShuffleMap(prev => ({ ...prev, ...createOptionShuffleMap([nextItem]) }));
      setCurrentQ(prev => prev + 1);
    } else {
      setCatFinished(true);
      setTimeout(() => {
        submitExamWithState(newState, "pool_exhausted");
      }, 0);
    }

    setCatState(newState);
    localStorage.setItem(`cat-state-${attemptId}`, JSON.stringify(newState));
    saveProgressToServer(newState);
  }, [isCATExam, catState, attemptId, questions, currentQ, answers, blueprintMeta, allPoolQuestions]);

  const saveProgressToServer = useCallback((currentCatState?: CATState) => {
    if (!attemptId) return;
    const state = currentCatState || catState;
    try {
      fetch(`/api/mock-exams/${attemptId}/progress`, {
        method: "PUT",
        ...EXAM_FETCH_DEFAULTS,
        headers: buildMockExamHeaders(true),
        body: JSON.stringify({
          answers,
          flagged,
          timeSpent,
          catState: state,
          timerState: { elapsed: timeSpent, paused },
        }),
      }).catch((err) => {
        console.warn("[ExamSession] saveProgressToServer failed:", err?.message);
      });
    } catch (err: any) {
      console.warn("[ExamSession] saveProgressToServer error:", err?.message);
    }
  }, [attemptId, answers, flagged, timeSpent, catState, paused]);

  const [submissionPhase, setSubmissionPhase] = useState<"idle" | "saving" | "submitting" | "processing" | "done">("idle");

  const pollForResult = useCallback(async (aid: string, localReport: any, localCatState: CATState | null): Promise<void> => {
    setSubmissionPhase("processing");
    const maxPolls = 30;
    const pollInterval = 2000;
    for (let i = 0; i < maxPolls; i++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      try {
        const pollRes = await fetch(`/api/mock-exams/${aid}/result`, {
          ...EXAM_FETCH_DEFAULTS,
          headers: buildMockExamHeaders(),
        });
        if (!pollRes.ok) continue;
        const data = await pollRes.json();
        if (data.status === "completed") {
          clearExamCheckpoint(aid);
          setCompletionData({ report: data.report || localReport, catState: localCatState });
          setSubmissionPhase("done");
          fetchFullQuestions();
          return;
        }
        if (data.status === "failed") {
          continue;
        }
      } catch {
        continue;
      }
    }
    toast({ title: "Processing", description: "Your exam is still being processed. Your answers are safe — please check back shortly." });
    setSubmitting(false);
    setSubmissionPhase("idle");
  }, [toast]);

  const submitExamWithState = async (finalCatState?: CATState, stoppingReason?: string) => {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    setSubmissionPhase("saving");
    checkpointManagerRef.current?.clear().catch(() => {});

    await flushUnsyncedAnswers();

    try {
      setSubmissionPhase("submitting");
      const report = computeReport(questions, answers, blueprintMeta, finalCatState || catState);
      const res = await fetch(`/api/mock-exams/${attemptId}/complete`, {
        method: "POST",
        ...EXAM_FETCH_DEFAULTS,
        headers: buildMockExamHeaders(true),
        body: JSON.stringify({
          flagged,
          timeSpent,
          catState: finalCatState || catState,
          stoppingReason,
        }),
      });

      if (!res.ok) {
        throw new Error("Server returned error");
      }

      const data = await res.json();

      if (data.status === "processing") {
        await pollForResult(attemptId, report, finalCatState || catState);
        return;
      }

      clearExamCheckpoint(attemptId);
      setCompletionData({ report: data.report || report, stoppingReason, catState: finalCatState || catState });
      setSubmissionPhase("done");
      fetchFullQuestions();
    } catch (e: any) {
      console.error("[ExamSession] Submit failed:", e?.message);
      toast({
        title: "Processing Your Exam",
        description: "Your answers are saved. We're processing your results — please wait.",
      });
      if (attemptId) {
        await pollForResult(attemptId, computeReport(questions, answers, blueprintMeta, finalCatState || catState), finalCatState || catState);
      } else {
        setSubmitting(false);
        setSubmissionPhase("idle");
      }
    }
  };

  const submitExam = async () => {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    setSubmissionPhase("saving");
    checkpointManagerRef.current?.clear().catch(() => {});

    await flushUnsyncedAnswers();

    try {
      setSubmissionPhase("submitting");
      const report = computeReport(questions, answers, blueprintMeta, catState);
      const res = await fetch(`/api/mock-exams/${attemptId}/complete`, {
        method: "POST",
        ...EXAM_FETCH_DEFAULTS,
        headers: buildMockExamHeaders(true),
        body: JSON.stringify({ flagged, timeSpent }),
      });

      if (!res.ok) {
        throw new Error("Server returned error");
      }

      const data = await res.json();

      if (data.status === "processing") {
        await pollForResult(attemptId, report, catState);
        return;
      }

      clearExamCheckpoint(attemptId);
      setCompletionData({ report: data.report || report, catState });
      setSubmissionPhase("done");
      fetchFullQuestions();
    } catch (e: any) {
      console.error("[ExamSession] Submit failed:", e?.message);
      toast({
        title: "Processing Your Exam",
        description: "Your answers are saved. We're processing your results — please wait.",
      });
      if (attemptId) {
        await pollForResult(attemptId, computeReport(questions, answers, blueprintMeta, catState), catState);
      } else {
        setSubmitting(false);
        setSubmissionPhase("idle");
      }
    }
  };

  const fetchFullQuestions = async () => {
    if (!attemptId) return;
    try {
      const [examRes, rationalesRes] = await Promise.all([
        fetch(`/api/mock-exams/${attemptId}`, { ...EXAM_FETCH_DEFAULTS, headers: buildMockExamHeaders() }),
        fetch(`/api/mock-exams/${attemptId}/rationales`, { ...EXAM_FETCH_DEFAULTS, headers: buildMockExamHeaders() }).catch(() => null),
      ]);
      const data = await examRes.json();
      let rationales: Record<string, any> = {};
      try {
        if (rationalesRes && rationalesRes.ok) {
          const rationalesData = await rationalesRes.json();
          rationales = rationalesData.rationales || {};
        }
      } catch {}
      if (data.questions) {
        const enrichedQuestions = data.questions.map((q: any) => {
          if (q && q.id && rationales[q.id]) {
            return { ...q, ...rationales[q.id] };
          }
          return q;
        });
        setFullQuestions(enrichedQuestions);
      }
    } catch {}
  };

  const enterReviewMode = () => {
    setReviewMode(true);
    setCurrentQ(0);
    setSubmitting(false);
  };

  const handleNextQuestion = () => {
    if (isCATExam) {
      advanceCAT();
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  if (fallbackMode === "safe") {
    return (
      <FallbackErrorBoundary onExit={() => navigate(backToExamsPath)}>
        <SafeExamPlayer
          questions={questions}
          answers={answers}
          examTitle={blueprintMeta?.examName}
          onComplete={(finalAnswers) => {
            setAnswers(finalAnswers);
          }}
          onExit={() => navigate(backToExamsPath)}
        />
      </FallbackErrorBoundary>
    );
  }

  if (fallbackMode === "study") {
    return (
      <FallbackErrorBoundary onExit={() => navigate(backToExamsPath)}>
        <StudyModeFallback
          questions={questions}
          examTitle={blueprintMeta?.examName}
          onExit={() => navigate(backToExamsPath)}
        />
      </FallbackErrorBoundary>
    );
  }

  if (fallbackMode === "backup-practice") {
    return (
      <FallbackErrorBoundary onExit={() => navigate(backToExamsPath)}>
        <BackupPracticeSet
          originalExamTier={blueprintMeta?.examCode?.includes("PN") ? "rpn" : blueprintMeta?.examCode?.includes("RN") ? "rn" : "rpn"}
          originalExamCode={blueprintMeta?.examCode}
          onStart={(backupQuestions) => {
            setQuestions(backupQuestions);
            setFallbackMode("safe");
          }}
          onExit={() => navigate(backToExamsPath)}
        />
      </FallbackErrorBoundary>
    );
  }

  if (fallbackMode === "printable") {
    return (
      <FallbackErrorBoundary onExit={() => navigate(backToExamsPath)}>
        <PrintableBackup
          questions={questions}
          examTitle={blueprintMeta?.examName}
          tier={blueprintMeta?.examCode}
          onExit={() => navigate(backToExamsPath)}
        />
      </FallbackErrorBoundary>
    );
  }

  if (sessionRecovery?.show && !loading) {
    return (
      <SessionRecoveryPrompt
        attemptId={attemptId || ""}
        savedProgress={{
          answeredCount: sessionRecovery.answeredCount,
          totalQuestions: sessionRecovery.totalQuestions,
          timeSpent: sessionRecovery.timeSpent,
          currentQuestion: sessionRecovery.currentQuestion,
        }}
        onRestore={() => {
          setSessionRecovery(null);
          if (sessionRecovery.currentQuestion) {
            setCurrentQ(Math.min(sessionRecovery.currentQuestion, questions.length - 1));
          }
        }}
        onRestartSafe={() => {
          setSessionRecovery(null);
          setFallbackMode("safe");
        }}
        onDiscard={() => {
          setSessionRecovery(null);
          setAnswers({});
          setFlagged([]);
          setTimeSpent(0);
          setCurrentQ(0);
          fetch(`/api/mock-exams/${attemptId}/reset`, {
            method: "POST",
            ...EXAM_FETCH_DEFAULTS,
            headers: buildMockExamHeaders(),
          }).catch(() => {});
        }}
      />
    );
  }

  if (loadError) {
    const isSubscriber = user && user.tier !== "free";
    const failureCode = classifiedError?.code;
    const mapped =
      failureCode && EXAM_ERROR_USER_MESSAGES[failureCode]
        ? EXAM_ERROR_USER_MESSAGES[failureCode]
        : null;
    const errorTitle = mapped?.title ?? "We're having trouble loading this exam";
    const errorDescription =
      mapped?.description ??
      "Your progress and subscription are safe. Choose an option below to continue.";

    const canRetry = retryCount < 2 && classifiedError?.recoverable !== false;
    const showRecoveryProgress = recoveryInProgress && recoveryStage;
    const stageInfo = recoveryStage ? getRecoveryStageInfo(recoveryStage) : null;

    const answeredCount = Object.keys(answers).length;
    const canResumeFromLastQuestion = answeredCount > 0 && questions.length > 0;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4" data-testid="exam-load-error">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800" data-testid="text-load-error-title">
                {errorTitle}
              </h2>
              {isSubscriber && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-medium" data-testid="text-load-error-access-protected">Your access is protected.</span>
                </div>
              )}
              <p className="text-gray-600 text-sm">{errorDescription}</p>
              {classifiedError && (
                <p className="text-xs text-gray-400" data-testid="text-failure-code">
                  Error: {classifiedError.code}
                </p>
              )}
            </div>

            {showRecoveryProgress && stageInfo && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-2" data-testid="container-recovery-progress">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">{stageInfo.message}</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((stageInfo.stageIndex + 1) / stageInfo.totalStages) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-blue-600">
                  Step {stageInfo.stageIndex + 1} of {stageInfo.totalStages}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {canRetry && (
                <Button
                  onClick={() => {
                    setLoadError(null);
                    setClassifiedError(null);
                    setLoading(true);
                    performMultiStageRecovery();
                  }}
                  disabled={recoveryInProgress}
                  className="w-full gap-2"
                  data-testid="button-retry-exam"
                >
                  {recoveryInProgress ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {retryCount === 0 ? "Retry" : "Try Again"}
                </Button>
              )}

              {canResumeFromLastQuestion && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoadError(null);
                    setClassifiedError(null);
                    setCurrentQ(Math.min(answeredCount, questions.length - 1));
                    setLoading(false);
                  }}
                  className="w-full gap-2"
                  data-testid="button-resume-last-question"
                >
                  <SkipForward className="w-4 h-4" /> Resume from Question {answeredCount + 1}
                </Button>
              )}

              {questions.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => { setLoadError(null); setClassifiedError(null); setFallbackMode("safe"); }}
                    className="w-full gap-2"
                    data-testid="button-load-error-safe-mode"
                  >
                    <Shield className="w-4 h-4" /> Safe Exam Player
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setLoadError(null); setClassifiedError(null); setFallbackMode("study"); }}
                    className="w-full gap-2"
                    data-testid="button-load-error-study-mode"
                  >
                    <BookOpen className="w-4 h-4" /> Study Mode
                  </Button>
                  {isSubscriber && (
                    <Button
                      variant="outline"
                      onClick={() => { setLoadError(null); setClassifiedError(null); setFallbackMode("printable"); }}
                      className="w-full gap-2"
                      data-testid="button-load-error-printable"
                    >
                      <Printer className="w-4 h-4" /> Printable Backup
                    </Button>
                  )}
                </>
              )}

              <BackupPracticeSet
                originalExamTier={blueprintMeta?.examCode?.includes("PN") ? "rpn" : blueprintMeta?.examCode?.includes("RN") ? "rn" : "rpn"}
                originalExamCode={blueprintMeta?.examCode}
                onStart={(backupQuestions) => {
                  setQuestions(backupQuestions);
                  setFallbackMode("safe");
                  setLoadError(null);
                  setClassifiedError(null);
                }}
                onExit={() => navigate(backToExamsPath)}
                inline
              />

              <div className="border-t pt-3 mt-2">
                <p className="text-xs text-gray-500 mb-2 font-medium">Try a different exam:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(backToExamsPath)}
                    className="text-xs gap-1"
                    data-testid="link-browse-exams"
                  >
                    <BookOpen className="w-3 h-3" /> Browse All Exams
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(backToExamsPath.replace("/mock-exams", "/practice"))}
                    className="text-xs gap-1"
                    data-testid="link-practice-questions"
                  >
                    <FileText className="w-3 h-3" /> Practice Questions
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate(backToExamsPath)}
                className="w-full gap-2"
                data-testid="button-back-exams"
              >
                <Home className="w-4 h-4" /> Return to Dashboard
              </Button>
            </div>

            {retryCount >= 3 && (
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2" data-testid="container-exhausted-tips">
                <p className="font-medium">All automatic recovery attempts exhausted</p>
                <ul className="text-left text-xs space-y-1 text-slate-500">
                  <li>• Your entitlement is safe — you can restart this exam without losing credit</li>
                  <li>• Try refreshing the full page</li>
                  <li>• Clear your browser cache and cookies</li>
                  <li>• Try using a different browser or device</li>
                </ul>
              </div>
            )}

            <div className="text-center space-y-1">
              <ExamReportButton examType="mock-exam" tier={blueprintMeta?.examCode} />
              <p className="text-xs text-gray-400" data-testid="text-load-error-incident-id">
                Reference: {incidentRef}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">{t("pages.mockExamSession.loadingExam")}</p>
        </div>
      </div>
    );
  }

  if (reviewMode) {
    const rawQuestions = fullQuestions.length > 0 ? fullQuestions : questions;
    const answeredIds = new Set(Object.keys(answers));
    const reviewQuestions = rawQuestions.filter(q => answeredIds.has(q.id)).map(q => getTranslatedQuestion(q));
    const filteredIndices = reviewQuestions.map((_, i) => i).filter(i => {
      const q = reviewQuestions[i];
      if (reviewFilter === "incorrect") return answers[q.id] !== q.correct;
      if (reviewFilter === "flagged") return flagged.includes(q.id);
      return true;
    });
    const reviewIdx = filteredIndices.indexOf(currentQ) >= 0 ? currentQ : (filteredIndices[0] ?? 0);
    const rq = filteredIndices.length > 0 ? reviewQuestions[reviewIdx] : null;
    const userAnswer = rq ? answers[rq.id] : undefined;
    const isCorrect = rq ? userAnswer === rq.correct : false;

    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900" data-testid="review-mode">
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-gray-900">{t("pages.mockExamSession.reviewMode")}</h2>
              <span className="text-xs text-gray-400">Q {reviewIdx + 1} of {reviewQuestions.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={reviewFilter}
                onChange={(e) => { setReviewFilter(e.target.value as any); setCurrentQ(0); }}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                data-testid="select-review-filter"
              >
                <option value="all">{t("pages.mockExamSession.allQuestions")}</option>
                <option value="incorrect">{t("pages.mockExamSession.incorrectOnly")}</option>
                <option value="flagged">{t("pages.mockExamSession.flaggedOnly")}</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/mock-exams/${attemptId}/report`)}
                data-testid="button-view-full-report"
              >
                Full Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setReviewMode(false); setCompletionData(completionData); }}
                data-testid="button-back-to-results"
              >
                Back to Results
              </Button>
            </div>
          </div>
        </div>

        <div className="fixed left-0 top-14 bottom-0 w-16 bg-white border-r border-gray-100 overflow-y-auto hidden md:block z-40">
          <div className="p-2 space-y-1">
            {filteredIndices.map((idx) => {
              const q = reviewQuestions[idx];
              const correct = answers[q.id] === q.correct;
              const isFl = flagged.includes(q.id);
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQ(idx)}
                  className={`w-full h-8 rounded text-xs font-bold flex items-center justify-center transition-all ${
                    idx === reviewIdx ? "ring-2 ring-primary ring-offset-1" : ""
                  } ${
                    isFl ? "bg-amber-100 text-amber-700" :
                    correct ? "bg-emerald-100 text-emerald-700" :
                    "bg-red-100 text-red-700"
                  }`}
                  data-testid={`button-review-nav-${idx}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 md:ml-20">
          {!rq && (
            <div className="text-center py-12 text-gray-400" data-testid="review-empty-state">
              <p className="text-lg font-medium">{t("pages.mockExamSession.noQuestionsMatchThisFilter")}</p>
              <p className="text-sm mt-1">{t("pages.mockExamSession.trySwitchingToAllQuestions")}</p>
              <Button variant="outline" className="mt-4" onClick={() => setReviewFilter("all")}>{t("pages.mockExamSession.showAllQuestions")}</Button>
            </div>
          )}
          {rq && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {isCorrect ? "CORRECT" : "INCORRECT"}
                </span>
                <span className="text-xs text-gray-400">{rq.bodySystem}</span>
                {flagged.includes(rq.id) && (
                  <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <Flag className="w-3 h-3" /> Flagged
                  </span>
                )}
              </div>

              <h2 className="text-lg font-semibold text-gray-900 leading-relaxed" data-testid="text-review-question">
                {rq.question}
              </h2>

              <div className="space-y-2">
                {(rq.options || []).map((rawOpt, oi) => {
                  const optionText = typeof rawOpt === "object" && rawOpt !== null && typeof rawOpt.text === "string" ? rawOpt.text : String(rawOpt ?? "");
                  const isUserAnswer = userAnswer === oi;
                  const isCorrectOption = rq.correct === oi;
                  const letterLabel = String.fromCharCode(65 + oi);
                  return (
                    <div
                      key={oi}
                      className={`px-4 py-3 rounded-lg border-2 flex items-start gap-3 ${
                        isCorrectOption ? "border-emerald-400 bg-emerald-50" :
                        isUserAnswer && !isCorrectOption ? "border-red-400 bg-red-50" :
                        "border-gray-200"
                      }`}
                      data-testid={`review-option-${oi}`}
                    >
                      <span className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isCorrectOption ? "border-emerald-500 bg-emerald-500" :
                        isUserAnswer ? "border-red-500 bg-red-500" :
                        "border-gray-300"
                      }`}>
                        {(isCorrectOption || isUserAnswer) && (
                          isCorrectOption
                            ? <CheckCircle2 className="w-3 h-3 text-white" />
                            : <XCircle className="w-3 h-3 text-white" />
                        )}
                      </span>
                      <div className="flex-1">
                        <span className="text-sm">
                          <span className="font-semibold mr-1">{letterLabel}.</span>
                          {optionText}
                        </span>
                        {isCorrectOption && <span className="text-xs text-emerald-600 ml-2 font-medium">{t("pages.mockExamSession.correctAnswer")}</span>}
                        {isUserAnswer && !isCorrectOption && <span className="text-xs text-red-600 ml-2 font-medium">{t("pages.mockExamSession.yourAnswer")}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <RationaleGuard rationale={rq.rationale || rq.explanation} questionIndex={reviewIdx} />

              {(rq as any).clinicalPearl && (
                <Card className="border-none shadow-sm bg-amber-50/50" data-testid="review-clinical-pearl">
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t("pages.mockExamSession.clinicalPearl")}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{(rq as any).clinicalPearl}</p>
                  </CardContent>
                </Card>
              )}

              {(rq as any).examStrategy && (
                <Card className="border-none shadow-sm bg-violet-50/50" data-testid="review-exam-strategy">
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">{t("pages.mockExamSession.examStrategy")}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{(rq as any).examStrategy}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between md:ml-20">
            <Button
              variant="ghost"
              onClick={() => {
                const curIdx = filteredIndices.indexOf(reviewIdx);
                if (curIdx > 0) setCurrentQ(filteredIndices[curIdx - 1]);
              }}
              disabled={filteredIndices.indexOf(reviewIdx) <= 0}
              className="gap-1"
              data-testid="button-review-prev"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <span className="text-xs text-gray-400">
              {filteredIndices.indexOf(reviewIdx) + 1} of {filteredIndices.length} ({reviewFilter})
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                const curIdx = filteredIndices.indexOf(reviewIdx);
                if (curIdx < filteredIndices.length - 1) setCurrentQ(filteredIndices[curIdx + 1]);
              }}
              disabled={filteredIndices.indexOf(reviewIdx) >= filteredIndices.length - 1}
              className="gap-1"
              data-testid="button-review-next"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (submissionPhase === "processing" || submissionPhase === "saving" || submissionPhase === "submitting") {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex items-center justify-center" data-testid="processing-screen">
        <div className="max-w-md w-full mx-4">
          <Card className="border-none shadow-xl">
            <CardContent className="p-8 space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800" data-testid="text-processing-title">
                {submissionPhase === "saving" ? "Saving Your Answers" :
                 submissionPhase === "submitting" ? "Submitting Your Exam" :
                 "Processing Your Results"}
              </h2>
              <p className="text-sm text-gray-500">
                {submissionPhase === "processing"
                  ? "Your answers are saved and your results are being calculated. This page will update automatically."
                  : "Please wait while we save your progress. Do not close or refresh this page."}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Your exam data is safe</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (completionData) {
    const report = completionData.report;
    const cState = completionData.catState as CATState | null;
    const isCatCompletion = report?.examType === "cat";
    const strengthAreas = cState ? getStrengthAreas(cState) : [];
    const weakAreasList = cState ? getWeakAreas(cState) : (report?.weakAreas || []);

    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex items-center justify-center" data-testid="completion-screen">
        <div className="max-w-lg w-full mx-4 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="h-2" style={{ backgroundColor: isCatCompletion ? (report?.overallPass ? "#10b981" : "#ef4444") : accentColor }} />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-3">
                {isCatCompletion ? (
                  <>
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${report?.overallPass ? "bg-emerald-100" : "bg-red-100"}`}>
                      {report?.overallPass ? <CheckCircle2 className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
                    </div>
                    <h1 className="text-2xl font-bold" data-testid="text-completion-title">
                      {report?.overallPass ? "Above Passing Standard" : "Below Passing Standard"}
                    </h1>
                    <p className="text-sm text-gray-500">
                      CAT Exam Complete &middot; {report?.totalQuestions} questions administered
                    </p>
                    {completionData.stoppingReason && (
                      <p className="text-xs text-gray-400">
                        Stopping rule: {completionData.stoppingReason.replace(/_/g, " ")}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                      (report?.percentage || 0) >= 80 ? "bg-emerald-100" :
                      (report?.percentage || 0) >= 60 ? "bg-amber-100" : "bg-red-100"
                    }`}>
                      <span className={`text-2xl font-bold ${
                        (report?.percentage || 0) >= 80 ? "text-emerald-600" :
                        (report?.percentage || 0) >= 60 ? "text-amber-600" : "text-red-600"
                      }`}>{report?.percentage}%</span>
                    </div>
                    <h1 className="text-2xl font-bold" data-testid="text-completion-title">
                      Exam Complete
                    </h1>
                    <p className="text-sm text-gray-500">
                      {report?.score}/{report?.totalQuestions} correct &middot; {formatTime(timeSpent)} elapsed
                    </p>
                  </>
                )}
              </div>

              {report?.domainBreakdown && report.domainBreakdown.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("pages.mockExamSession.categoryBreakdown")}</p>
                  {report.domainBreakdown.map((d: any) => (
                    <div key={d.name} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-gray-700 flex-1">{d.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${d.passed ? "bg-emerald-500" : "bg-red-400"}`}
                            style={{ width: `${d.percentage}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-10 text-right ${d.passed ? "text-emerald-600" : "text-red-500"}`}>
                          {d.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {strengthAreas.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{t("pages.mockExamSession.strengths")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {strengthAreas.slice(0, 3).map((area: any) => (
                      <span key={area.topic} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                        {area.topic} ({area.percentage}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {weakAreasList.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider">{t("pages.mockExamSession.areasToImprove")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {weakAreasList.slice(0, 3).map((area: any) => (
                      <span key={area.topic || area.system} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">
                        {area.topic || area.system} ({area.percentage || area.score}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <Button
                  className="w-full h-12 rounded-full gap-2 text-base font-semibold"
                  onClick={enterReviewMode}
                  data-testid="button-review-questions"
                >
                  <Eye className="w-5 h-5" /> Review Questions & Rationale
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 rounded-full gap-2"
                  onClick={() => navigate(`/mock-exams/${attemptId}/report`)}
                  data-testid="button-view-report"
                >
                  View Full Report
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-sm text-gray-500"
                  onClick={() => navigate(backToExamsPath)}
                  data-testid="button-back-to-exams"
                >
                  Back to Exams
                </Button>
                <div className="flex justify-center mt-2">
                  <ExamReportButton examType="mock-exam" tier={blueprintMeta?.examCode} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    const isSubscriber = user && user.tier !== "free";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4" data-testid="exam-no-questions">
        <div className="max-w-lg w-full space-y-4">
          <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800" data-testid="text-no-questions-title">
                No Questions Available
              </h2>
              {isSubscriber && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-medium">Your access is protected.</span>
                </div>
              )}
              <p className="text-gray-600 text-sm">
                This exam has no questions loaded. This may be a temporary issue.
              </p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => { setLoadError(null); setLoading(true); setRetryCount(c => c + 1); }}
                className="w-full gap-2"
                data-testid="button-retry-empty-exam"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </Button>
              <BackupPracticeSet
                originalExamTier={blueprintMeta?.examCode?.includes("PN") ? "rpn" : blueprintMeta?.examCode?.includes("RN") ? "rn" : "rpn"}
                originalExamCode={blueprintMeta?.examCode}
                onStart={(backupQuestions) => {
                  setQuestions(backupQuestions);
                  setFallbackMode("safe");
                }}
                onExit={() => navigate(backToExamsPath)}
                inline
              />
              <Button variant="outline" onClick={() => navigate(backToExamsPath)} className="w-full gap-2" data-testid="button-back-exams-empty">
                <Home className="w-4 h-4" /> Return to Dashboard
              </Button>
            </div>
            <div className="text-center pt-2">
              <ExamReportButton examType="mock-exam" tier={blueprintMeta?.examCode} questionId={attemptId} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressLabel = isCATExam
    ? `Item ${(catState?.itemsAdministered || 0) + 1} in Progress`
    : `Q ${currentQ + 1} of ${questions.length}`;

  const showProgressBar = !isCATExam;
  const disablePrevious = isCATExam || strictMode || currentQ === 0;

  return (
    <div className={`min-h-screen bg-gray-50 font-sans text-gray-900 ${user?.tier !== "admin" ? "select-none" : ""}`} onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}>
      <div className="sticky top-0 z-50 border-b border-black/5" style={{ backgroundColor: "var(--exam-chrome-color)" }} data-testid="exam-top-bar">
        {showProgressBar && (
          <div className="w-full h-1 bg-white/20" data-testid="exam-progress-bar-full">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%`, backgroundColor: "#2E3A59" }}
            />
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-sm font-semibold text-[#2E3A59]" data-testid="text-exam-progress">
              {progressLabel}
            </span>
            {showProgressBar && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#2E3A59]/70">
                <span data-testid="text-answered-count">{answeredCount}/{questions.length} answered</span>
                <span className="w-px h-3 bg-[#2E3A59]/20" />
                <span data-testid="text-flagged-count" className="flex items-center gap-0.5">
                  <Flag className="w-3 h-3" /> {flagged.length}
                </span>
              </div>
            )}
            {blueprintMeta?.timeLimit && (
              <div className="hidden sm:flex items-center gap-1 text-xs" data-testid="text-time-remaining">
                <span className={`font-medium ${
                  timeSpent > blueprintMeta.timeLimit * 60 * 0.9 ? "text-red-600" :
                  timeSpent > blueprintMeta.timeLimit * 60 * 0.75 ? "text-amber-600" : "text-[#2E3A59]/70"
                }`}>
                  {formatTime(Math.max(0, blueprintMeta.timeLimit * 60 - timeSpent))} left
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {strictMode && (
              <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50/80 px-2 py-0.5 rounded" data-testid="badge-strict-mode">
                <Shield className="w-3 h-3" /> STRICT
              </span>
            )}
            {strictMode && tabSwitchCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-600" data-testid="badge-tab-switches">
                <Eye className="w-3 h-3" /> {tabSwitchCount}
              </span>
            )}
            <button
              onClick={() => { if (!strictMode) setPaused(!paused); }}
              className={`flex items-center gap-1.5 text-sm ${strictMode ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700"}`}
              data-testid="button-pause-timer"
              disabled={strictMode}
              title={strictMode ? "Timer cannot be paused in strict mode" : undefined}
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span className={`font-mono text-sm font-semibold ${paused ? "text-amber-600" : "text-[#2E3A59]"}`}>
                {formatTime(timeSpent)}
              </span>
            </button>

            <button
              onClick={() => toggleFlag(questions[currentQ]?.id)}
              className={`p-1.5 rounded transition-colors ${
                questions[currentQ] && flagged.includes(questions[currentQ].id) ? "text-amber-500" : "text-gray-300 hover:text-amber-500"
              }`}
              data-testid="button-flag-topbar"
              aria-label={t("pages.mockExamSession.flagQuestion")}
            >
              <Flag className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowNav(!showNav)}
              className="text-sm text-[#2E3A59] font-medium transition-colors"
              style={{ ["--tw-hover-color" as any]: accentColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#2E3A59")}
              data-testid="button-question-nav"
            >
              Navigator
            </button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-xs border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200"
              onClick={() => setShowConfirmSubmit(true)}
              data-testid="button-submit-exam"
            >
              <Send className="w-3 h-3" /> End
            </Button>
          </div>
        </div>
      </div>

      {paused && (
        <div className="fixed inset-0 z-40 bg-gray-900/80 flex items-center justify-center">
          <Card className="border-none shadow-2xl max-w-sm">
            <CardContent className="p-8 text-center space-y-4">
              <Pause className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-bold">{t("pages.mockExamSession.examPaused")}</h2>
              <p className="text-gray-500 text-sm">{t("pages.mockExamSession.theTimerHasStoppedClick")}</p>
              <Button onClick={() => setPaused(false)} className="rounded-full px-8" data-testid="button-resume">
                <Play className="w-4 h-4 mr-2" /> Resume Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showNav && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center" onClick={() => setShowNav(false)}>
          <Card className="border-none shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="font-bold text-lg">{t("pages.mockExamSession.questionNavigator")}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500" /> {t("pages.mockExamSession.answered")}</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-500" /> {t("pages.mockExamSession.flagged")}</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-200" /> {t("pages.mockExamSession.unanswered")}</span>
                </div>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {questions.map((q, i) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isFlagged = flagged.includes(q.id);
                  const isCurrent = i === currentQ;
                  const disableNav = isCATExam || (strictMode && i < currentQ);
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        if (disableNav) return;
                        setCurrentQ(i);
                        setShowNav(false);
                      }}
                      disabled={disableNav}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        isCurrent ? "ring-2 ring-offset-1" : ""
                      } ${
                        disableNav ? "opacity-40 cursor-not-allowed" : ""
                      } ${
                        isFlagged ? "bg-amber-500 text-white" :
                        isAnswered ? "bg-emerald-500 text-white" :
                        "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      style={isCurrent ? { ["--tw-ring-color" as any]: accentColor } : undefined}
                      data-testid={`button-nav-q-${i}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="text-sm text-gray-500 pt-2">
                {answeredCount} answered, {flagged.length} flagged, {unansweredCount} remaining
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showConfirmSubmit && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <Card className="border-none shadow-2xl max-w-sm">
            <CardContent className="p-8 space-y-4">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-xl font-bold text-center">{t("pages.mockExamSession.submitExam")}</h2>
              {unansweredCount > 0 && (
                <p className="text-amber-600 text-sm text-center font-medium">
                  You have {unansweredCount} unanswered question{unansweredCount !== 1 ? "s" : ""}.
                </p>
              )}
              {flagged.length > 0 && (
                <p className="text-sm text-gray-500 text-center">
                  {flagged.length} question{flagged.length !== 1 ? "s" : ""} flagged for review.
                </p>
              )}
              <p className="text-sm text-gray-400 text-center">{t("pages.mockExamSession.onceSubmittedYouCannotChange")}</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirmSubmit(false)} data-testid="button-cancel-submit">
                  Go Back
                </Button>
                <Button className="flex-1" onClick={submitExam} disabled={submitting} data-testid="button-confirm-submit">
                  {submissionPhase === "saving" ? "Saving answers..." :
                   submissionPhase === "submitting" ? "Submitting..." :
                   submissionPhase === "processing" ? "Processing results..." :
                   submitting ? "Submitting..." : "Submit Exam"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showTabWarning && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <Card className="border-none shadow-2xl max-w-sm">
            <CardContent className="p-8 space-y-4 text-center">
              <Eye className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold">{t("pages.mockExamSession.tabSwitchDetected")}</h2>
              <p className="text-sm text-gray-500">
                You navigated away from the exam. This has been recorded.
              </p>
              <p className="text-xs text-red-600 font-medium">
                Total tab switches: {tabSwitchCount}
              </p>
              <Button onClick={() => setShowTabWarning(false)} className="rounded-full px-8" data-testid="button-dismiss-tab-warning">
                Return to Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showBreakPrompt && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <Card className="border-none shadow-2xl max-w-sm">
            <CardContent className="p-8 space-y-4 text-center">
              <Coffee className="w-12 h-12 text-blue-500 mx-auto" />
              <h2 className="text-xl font-bold">{t("pages.mockExamSession.scheduledBreak")}</h2>
              <p className="text-sm text-gray-500">
                You've been testing for {Math.floor(timeSpent / 3600)} hour{Math.floor(timeSpent / 3600) !== 1 ? "s" : ""}. Consider taking a short break.
              </p>
              <p className="text-xs text-gray-400">
                Note: The timer will continue running during the break.
              </p>
              <Button onClick={() => setShowBreakPrompt(false)} className="rounded-full px-8" data-testid="button-dismiss-break">
                Continue Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24">
        <QuestionErrorBoundary
          key={`qeb-${question?.id || currentQ}`}
          questionId={question?.id || `q-${currentQ}`}
          questionIndex={currentQ}
          onSkip={(qId) => {
            setAnswers((prev) => ({ ...prev, [qId]: -1 }));
            if (currentQ < questions.length - 1) {
              setCurrentQ(currentQ + 1);
            } else if (isCATExam) {
              submitExamWithState(catState, "question_render_failure");
            }
          }}
        >
        <QuestionGuard question={question ? rawQuestion : undefined} index={currentQ}>
          {question && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{question.bodySystem || "General"}</span>
                    {flagged.includes(question.id) && (
                      <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-medium">{t("pages.mockExamSession.flagged2")}</span>
                    )}
                  </div>
                  <TranslationGuard
                    translatedText={language !== "en" && rawQuestion ? (translationMap[rawQuestion.id]?.stem || null) : question.question}
                    originalText={rawQuestion?.question || ""}
                    questionIndex={currentQ}
                  >
                    <h2 className="text-lg sm:text-xl font-semibold text-[#2E3A59] leading-relaxed" data-testid="text-question">
                      {question.question}
                    </h2>
                  </TranslationGuard>
                </div>
                <button
                  onClick={() => toggleFlag(question.id)}
                  className={`p-2 rounded transition-colors ${
                    flagged.includes(question.id) ? "bg-amber-50 text-amber-600" : "text-gray-300 hover:text-amber-500"
                  }`}
                  data-testid="button-flag-question"
                  aria-label={flagged.includes(question.id) ? "Unflag question" : "Flag question for review"}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              <MediaGuard
                src={(rawQuestion && "imageUrl" in rawQuestion) ? String((rawQuestion as Record<string, unknown>).imageUrl) : undefined}
                questionIndex={currentQ}
              >
                <span />
              </MediaGuard>

              <div className="space-y-1" role="radiogroup" aria-label={t("pages.mockExamSession.answerOptions")}>
                {(optionShuffleMap[question.id] || (question.options || []).map((_, i) => i)).map((originalIdx, displayIdx) => {
                  const rawOption = (question.options || [])[originalIdx];
                  const option = typeof rawOption === "object" && rawOption !== null && typeof rawOption.text === "string" ? rawOption.text : String(rawOption ?? "");
                  const isSelected = answers[question.id] === originalIdx;
                  const isLocked = (strictMode || isCATExam) && answers[question.id] !== undefined;
                  const letterLabel = String.fromCharCode(65 + displayIdx);
                  return (
                    <button
                      key={originalIdx}
                      onClick={() => selectAnswer(question.id, originalIdx)}
                      disabled={isLocked && !isSelected}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Option ${letterLabel}: ${option}`}
                      className={`w-full text-left px-4 py-3.5 transition-colors flex items-start gap-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        isLocked && !isSelected ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"
                      }`}
                      style={isSelected ? {
                        backgroundColor: accentColor + "14",
                        borderLeft: `3px solid ${accentColor}`,
                        boxShadow: `inset 0 0 0 0 transparent`,
                      } : undefined}
                      data-testid={`button-option-${displayIdx}`}
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          !isSelected ? "border-gray-300" : ""
                        }`}
                        style={isSelected ? { borderColor: accentColor, backgroundColor: accentColor } : undefined}
                      >
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </span>
                      <span className={`text-sm sm:text-base leading-relaxed ${
                        isSelected ? "text-[#2E3A59] font-medium" : "text-gray-700"
                      }`}>
                        <span className="font-semibold mr-1.5">{letterLabel}.</span>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </QuestionGuard>
        </QuestionErrorBoundary>
      </main>

      {question && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5" style={{ backgroundColor: "var(--exam-chrome-color)" }} data-testid="exam-bottom-bar">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => { if (!disablePrevious) setCurrentQ(Math.max(0, currentQ - 1)); }}
              disabled={disablePrevious}
              className="gap-1 text-gray-600 hover:text-gray-900"
              data-testid="button-prev-question"
              title={isCATExam ? "Cannot go back in CAT mode" : strictMode ? "Cannot go back in strict mode" : undefined}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            <span className="text-xs text-gray-400 font-medium hidden sm:block">
              {answeredCount} of {questions.length} answered
            </span>

            {isCATExam ? (
              <Button
                onClick={handleNextQuestion}
                className="gap-1 text-white font-semibold"
                style={{ backgroundColor: accentColor, borderRadius: "10px" }}
                disabled={(answers[question.id] === undefined && isQuestionAnswerable(rawQuestion)) || catFinished}
                data-testid="button-next-question"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : currentQ < questions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                className="gap-1 text-white font-semibold"
                style={{ backgroundColor: accentColor, borderRadius: "10px" }}
                data-testid="button-next-question"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowConfirmSubmit(true)}
                className="gap-1 text-white font-semibold"
                style={{ backgroundColor: accentColor, borderRadius: "10px" }}
                data-testid="button-finish"
              >
                Finish <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="flex justify-center mt-2">
            <ExamReportButton examType="mock-exam" tier={blueprintMeta?.examCode} questionId={question?.id ? String(question.id) : undefined} />
          </div>
        </div>
      )}
    </div>
  );
}
