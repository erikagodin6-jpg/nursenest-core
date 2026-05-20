import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRoute, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { apiRequest } from "@/lib/queryClient";
import {
  Clock, Flag, ChevronLeft, ChevronRight, Play, CheckCircle2, XCircle,
  BarChart3, AlertTriangle, ArrowLeft, ArrowRight, Target, BookOpen,
  Zap, FileText, Image as ImageIcon, PanelLeftClose, PanelLeftOpen,
  Send, X, GripVertical, RotateCcw, Settings, Timer, TrendingUp,
  Award, Brain, Stethoscope, Shield, Layers, ListChecks
} from "lucide-react";
import { ExamCalculator } from "@/components/exam-calculator";

import { useI18n } from "@/lib/i18n";
const EXAM_LENGTHS = [
  { value: 25, label: "Quick Practice", time: 30, desc: "25 questions in 30 minutes" },
  { value: 50, label: "Standard", time: 60, desc: "50 questions in 60 minutes" },
  { value: 75, label: "Extended", time: 90, desc: "75 questions in 90 minutes" },
  { value: 100, label: "Full Mock", time: 120, desc: "100 questions in 120 minutes" },
  { value: 200, label: "Certification Simulation", time: 240, desc: "Full-length 200-question exam" },
];

const EXAM_MODES = [
  { value: "adaptive", label: "Adaptive Exam", desc: "Difficulty adjusts based on your performance", icon: Brain },
  { value: "practice", label: "Practice Adaptive", desc: "Adaptive mode with instant feedback", icon: BookOpen },
  { value: "mock", label: "Full Mock Certification", desc: "Strict timed exam, no back navigation in strict mode", icon: Shield },
];

type Phase = "setup" | "exam" | "review" | "report";

interface QuestionData {
  id: string;
  question: string;
  options: string[];
  questionType?: string;
  category?: string;
  topic?: string;
  modality?: string;
  bodyPart?: string;
  difficulty?: number;
  questionIndex: number;
  rationale?: string;
  correctAnswer?: string;
  imageUrl?: string | null;
}

interface AnswerResult {
  isCorrect: boolean;
  newDifficulty: number;
  questionsAnswered: number;
  totalQuestions: number;
  rationale?: string;
  correctAnswer?: string;
}

interface ExamReport {
  overallScore: number;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  readinessBand: string;
  topicBreakdown: Record<string, { correct: number; total: number; percent: number }>;
  difficultyBreakdown: Record<string, { correct: number; total: number; percent: number }>;
  imageQuestionPerformance: { correct: number; total: number; percent: number };
  timeSpent: number;
  averageTimePerQuestion: number;
  abilityEstimate: number;
  recommendations: string[];
}

function formatTime(seconds: number): string {

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ReadinessBadge({ band }: { band: string }) {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    "Strong Exam Readiness": { bg: "bg-emerald-100", text: "text-emerald-800", icon: Award },
    "Likely Exam Ready": { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
    "Approaching Readiness": { bg: "bg-amber-100", text: "text-amber-800", icon: TrendingUp },
    "Needs Review": { bg: "bg-red-100", text: "text-red-800", icon: AlertTriangle },
  };
  const c = config[band] || config["Needs Review"];
  const Icon = c.icon;
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${c.bg} ${c.text}`} data-testid="text-readiness-band">
      <Icon className="w-4 h-4" />
      {band}
    </div>
  );
}

export default function ImagingExamSimulatorPage() {
  const [, params] = useRoute("/medical-imaging/:country/exam-simulator");
  const country = params?.country || "canada";
  const examType = country === "usa" ? "arrt" : "camrt";
  const examLabel = country === "usa" ? "ARRT" : "CAMRT";
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedLength, setSelectedLength] = useState(50);
  const [selectedMode, setSelectedMode] = useState("adaptive");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState<Array<{ id: string; answer: string; isCorrect: boolean; category?: string }>>([]);
  const [servedQuestions, setServedQuestions] = useState<QuestionData[]>([]);
  const [navOpen, setNavOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [examReport, setExamReport] = useState<ExamReport | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(3);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: pastSessions = [] } = useQuery({
    queryKey: ["/api/imaging/exam-sessions/user/me"],
    queryFn: () => fetch("/api/imaging/exam-sessions/user/me", { credentials: "include" }).then(r => r.json()),
    enabled: !!user,
  });

  useEffect(() => {
    if (phase === "exam" && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, timeRemaining > 0]);

  const startExam = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/imaging/exam-sessions", {
        country,
        examType,
        mode: selectedMode,
        examLength: selectedLength,
      });
      const session = await res.json();
      setSessionId(session.id);
      setTotalQuestions(session.totalQuestions);
      setTimeRemaining(session.timeLimit || selectedLength * 90);
      setPhase("exam");
      setQuestionsAnswered(0);
      setAnsweredQuestions([]);
      setServedQuestions([]);
      setFlaggedIds(new Set());
      setCurrentDifficulty(3);
      setTimeElapsed(0);
      await fetchNextQuestion(session.id);
    } catch (e: any) {
      console.error("Start exam error:", e);
    } finally {
      setLoading(false);
    }
  }, [user, country, examType, selectedMode, selectedLength]);

  const fetchNextQuestion = useCallback(async (sid: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/imaging/exam-sessions/${sid}/next-question`, { credentials: "include" });
      const data = await res.json();
      if (data.done) {
        setShowSubmitModal(true);
        setCurrentQuestion(null);
      } else {
        setCurrentQuestion(data.question);
        setServedQuestions(prev => {
          if (prev.find(q => q.id === data.question.id)) return prev;
          return [...prev, data.question];
        });
        setSelectedAnswer(null);
        setAnswerResult(null);
        setIsAnswerSubmitted(false);
        setQuestionStartTime(Date.now());
      }
    } catch (e: any) {
      console.error("Fetch question error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async () => {
    if (!sessionId || !currentQuestion || !selectedAnswer) return;
    setLoading(true);
    try {
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      const res = await apiRequest("POST", `/api/imaging/exam-sessions/${sessionId}/answer`, {
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        timeSpent,
      });
      const result: AnswerResult = await res.json();
      setAnswerResult(result);
      setIsAnswerSubmitted(true);
      setCurrentDifficulty(result.newDifficulty);
      setQuestionsAnswered(result.questionsAnswered);

      setAnsweredQuestions(prev => [
        ...prev,
        {
          id: currentQuestion.id,
          answer: selectedAnswer,
          isCorrect: result.isCorrect,
          category: currentQuestion.category,
        },
      ]);

      if (selectedMode !== "practice") {
        setTimeout(() => {
          fetchNextQuestion(sessionId);
        }, 300);
      }
    } catch (e: any) {
      console.error("Submit answer error:", e);
    } finally {
      setLoading(false);
    }
  }, [sessionId, currentQuestion, selectedAnswer, questionStartTime, selectedMode, fetchNextQuestion]);

  const handleNextAfterPractice = useCallback(() => {
    if (!sessionId) return;
    fetchNextQuestion(sessionId);
  }, [sessionId, fetchNextQuestion]);

  const navigateToQuestion = useCallback((index: number) => {
    if (index >= servedQuestions.length) return;
    const q = servedQuestions[index];
    setCurrentQuestion(q);
    const answered = answeredQuestions.find(a => a.id === q.id);
    if (answered) {
      setSelectedAnswer(answered.answer);
      setIsAnswerSubmitted(true);
    } else {
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setAnswerResult(null);
    }
    setQuestionStartTime(Date.now());
  }, [servedQuestions, answeredQuestions]);

  const toggleFlag = useCallback(async () => {
    if (!sessionId || !currentQuestion) return;
    try {
      await apiRequest("POST", `/api/imaging/exam-sessions/${sessionId}/flag`, {
        questionId: currentQuestion.id,
      });
      setFlaggedIds(prev => {
        const next = new Set(prev);
        if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
        else next.add(currentQuestion.id);
        return next;
      });
    } catch {}
  }, [sessionId, currentQuestion]);

  const handleSubmitExam = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setShowSubmitModal(false);
    try {
      const res = await apiRequest("POST", `/api/imaging/exam-sessions/${sessionId}/submit`, {
        timeSpent: timeElapsed,
      });
      const data = await res.json();
      setExamReport(data.report);
      setPhase("report");
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (e: any) {
      console.error("Submit exam error:", e);
    } finally {
      setLoading(false);
    }
  }, [sessionId, timeElapsed]);

  const handleExitExam = useCallback(() => {
    setShowExitModal(false);
    setPhase("setup");
    setSessionId(null);
    setCurrentQuestion(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "exam" || !currentQuestion) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key >= "1" && e.key <= "4") {
        const labels = ["A", "B", "C", "D"];
        const idx = parseInt(e.key) - 1;
        if (idx < currentQuestion.options.length && !isAnswerSubmitted) {
          setSelectedAnswer(labels[idx]);
        }
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFlag();
      }
      if (e.key === "Enter" && selectedAnswer && !isAnswerSubmitted) {
        e.preventDefault();
        submitAnswer();
      }
      if (e.key === "Enter" && isAnswerSubmitted && selectedMode === "practice") {
        e.preventDefault();
        handleNextAfterPractice();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, currentQuestion, selectedAnswer, isAnswerSubmitted, selectedMode, toggleFlag, submitAnswer, handleNextAfterPractice]);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Medical Imaging", url: "/medical-imaging" },
    { name: country === "usa" ? "USA (ARRT)" : "Canada (CAMRT)", url: `/medical-imaging/${country}` },
    { name: "Exam Simulator", url: `/medical-imaging/${country}/exam-simulator` },
  ];

  if (phase === "setup") {
    const completedSessions = pastSessions.filter((s: any) => s.status === "completed");
    const inProgressSessions = pastSessions.filter((s: any) => s.status === "in_progress");

    return (
      <div data-testid="imaging-exam-simulator-page">
        <SEO
          title={`${examLabel} Exam Simulator - Adaptive Radiography Practice`}
          description={`Prepare for your ${examLabel} certification with adaptive exam simulation. Realistic testing interface with timed sessions, question flagging, and detailed performance analytics.`}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Link href={`/medical-imaging/${country}`} className="text-indigo-600 hover:text-indigo-700" data-testid="link-back">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-simulator-title">{examLabel} Exam Simulator</h1>
              <p className="text-gray-500 text-sm">{t("pages.imagingExamSimulator.adaptiveCertificationExamPreparation")}</p>
            </div>
          </div>

          {!user && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3" data-testid="auth-required-banner">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">{t("pages.imagingExamSimulator.signInRequired")}</p>
                <p className="text-xs text-amber-600">{t("pages.imagingExamSimulator.createAnAccountToTrack")}</p>
              </div>
              <Link href="/auth" className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700" data-testid="link-sign-in">
                Sign In
              </Link>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" /> Exam Mode
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {EXAM_MODES.map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.value}
                      onClick={() => setSelectedMode(mode.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedMode === mode.value
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-100 hover:border-indigo-200"
                      }`}
                      data-testid={`button-mode-${mode.value}`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${selectedMode === mode.value ? "text-indigo-600" : "text-gray-400"}`} />
                      <p className="font-semibold text-gray-900 text-sm">{mode.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{mode.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" /> Exam Length
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {EXAM_LENGTHS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedLength(opt.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedLength === opt.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-100 hover:border-indigo-200"
                    }`}
                    data-testid={`button-length-${opt.value}`}
                  >
                    <p className="text-lg font-bold text-gray-900">{opt.value}</p>
                    <p className="text-xs text-gray-500">{opt.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{opt.time} min</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startExam}
              disabled={!user || loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
              data-testid="button-start-exam"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Starting...
                </span>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start {EXAM_MODES.find(m => m.value === selectedMode)?.label} — {selectedLength} Questions
                </>
              )}
            </button>

            {inProgressSessions.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-2">
                  <Timer className="w-4 h-4" /> Resume In-Progress Exam
                </h3>
                {inProgressSessions.slice(0, 3).map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-t border-amber-100 first:border-0" data-testid={`resume-session-${s.id}`}>
                    <div className="text-xs text-amber-700">
                      {s.mode} — {s.questionIds?.length || 0}/{s.totalQuestions} answered
                    </div>
                    <button
                      onClick={async () => {
                        const res = await fetch(`/api/imaging/exam-sessions/${s.id}/resume`, { credentials: "include" });
                        if (res.ok) {
                          const session = await res.json();
                          setSessionId(session.id);
                          setTotalQuestions(session.totalQuestions);
                          setTimeRemaining(session.timeLimit - (session.timeSpent || 0));
                          setQuestionsAnswered(session.questionIds?.length || 0);
                          setCurrentDifficulty(session.currentDifficulty || 3);
                          setFlaggedIds(new Set(session.flaggedIds || []));
                          setSelectedMode(session.mode);
                          setPhase("exam");
                          fetchNextQuestion(session.id);
                        }
                      }}
                      className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700"
                      data-testid={`button-resume-${s.id}`}
                    >
                      Resume
                    </button>
                  </div>
                ))}
              </div>
            )}

            {completedSessions.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" /> Recent Exam History
                </h3>
                <div className="space-y-2">
                  {completedSessions.slice(0, 5).map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0" data-testid={`history-session-${s.id}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          (s.score || 0) >= 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {s.score || 0}%
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{s.mode} — {s.totalQuestions} questions</p>
                          <p className="text-xs text-gray-500">{new Date(s.startedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSessionId(s.id);
                          setExamReport(s.report);
                          setTotalQuestions(s.totalQuestions);
                          setPhase("report");
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        data-testid={`button-view-report-${s.id}`}
                      >
                        View Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "exam" && currentQuestion) {
    const isFlagged = flaggedIds.has(currentQuestion.id);
    const optionLabels = ["A", "B", "C", "D"];
    const progressPct = totalQuestions > 0 ? Math.round((questionsAnswered / totalQuestions) * 100) : 0;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="exam-session-active">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 h-12">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitModal(true)}
                className="text-gray-400 hover:text-gray-600"
                data-testid="button-exit-exam"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-gray-700" data-testid="text-exam-type">
                {examLabel} {selectedMode === "mock" ? "Mock" : selectedMode === "practice" ? "Practice" : "Adaptive"} Exam
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm" data-testid="text-exam-timer">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className={`font-mono font-semibold ${timeRemaining < 300 ? "text-red-600" : "text-gray-700"}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <span className="text-sm text-gray-500" data-testid="text-exam-progress">
                {questionsAnswered + 1} / {totalQuestions}
              </span>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleFlag}
                className={`p-2 rounded-lg transition-all ${isFlagged ? "bg-amber-100 text-amber-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                data-testid="button-flag-question"
              >
                <Flag className="w-4 h-4" />
              </button>
              <button
                onClick={() => setNavOpen(!navOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                data-testid="button-toggle-navigator"
              >
                {navOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className={`p-2 rounded-lg transition-all ${showCalculator ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                data-testid="button-toggle-calculator"
              >
                <ListChecks className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {navOpen && (
            <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 p-4" data-testid="question-navigator-panel">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("pages.imagingExamSimulator.questionNavigator")}</h3>
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: totalQuestions }, (_, i) => {
                  const served = servedQuestions[i];
                  const qId = served?.id;
                  const aq = qId ? answeredQuestions.find(a => a.id === qId) : undefined;
                  const isAnsweredQ = !!aq;
                  const isFlaggedQ = qId ? flaggedIds.has(qId) : false;
                  const isCurrent = currentQuestion && qId === currentQuestion.id;
                  const isClickable = i < servedQuestions.length;

                  let bg = "bg-gray-100 text-gray-500";
                  if (isCurrent) bg = "bg-indigo-500 text-white";
                  else if (isAnsweredQ) bg = aq.isCorrect && selectedMode === "practice" ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700";

                  return (
                    <button
                      key={i}
                      onClick={() => isClickable && navigateToQuestion(i)}
                      disabled={!isClickable}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold relative ${bg} ${isClickable ? "cursor-pointer hover:ring-2 hover:ring-indigo-300" : "cursor-default"}`}
                      data-testid={`nav-question-${i}`}
                    >
                      {i + 1}
                      {isFlaggedQ && (
                        <Flag className="w-2.5 h-2.5 text-amber-500 absolute -top-0.5 -right-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-indigo-500" /> Current
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-indigo-100" /> Answered
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-100" /> Unanswered
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-3 h-3 text-amber-500" /> Flagged
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{t("pages.imagingExamSimulator.difficultyLevel")}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(d => (
                    <div
                      key={d}
                      className={`w-6 h-2 rounded-full ${d <= Math.round(currentDifficulty) ? "bg-indigo-500" : "bg-gray-200"}`}
                    />
                  ))}
                  <span className="text-xs font-mono text-gray-500 ml-1">{currentDifficulty.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
              <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {currentQuestion.category && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium" data-testid="text-question-category">
                      {currentQuestion.category}
                    </span>
                  )}
                  {selectedMode !== "adaptive" && selectedMode !== "mock" && currentQuestion.topic && currentQuestion.topic !== currentQuestion.category && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {currentQuestion.topic}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs font-mono" data-testid="text-question-number">
                    Q{questionsAnswered + 1}
                  </span>
                </div>

                {currentQuestion.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-900" style={{ minHeight: "200px" }} data-testid="question-image-container">
                    <img
                      src={currentQuestion.imageUrl}
                      alt={t("pages.imagingExamSimulator.radiographicImageForThisQuestion")}
                      className="max-w-full max-h-80 mx-auto object-contain"
                      loading="lazy"
                      decoding="async"
                      data-testid="img-question"
                    />
                  </div>
                )}

                {currentQuestion.questionType && currentQuestion.questionType !== "single_best_answer" && (
                  <div className="mb-3 px-3 py-1.5 bg-blue-50 rounded-lg text-xs font-medium text-blue-700 inline-block" data-testid="text-question-type">
                    {currentQuestion.questionType === "multiple_response" ? "Select all that apply" :
                     currentQuestion.questionType === "image_interpretation" ? "Image Interpretation" :
                     currentQuestion.questionType === "sequencing" ? "Arrange in correct order" :
                     currentQuestion.questionType === "case_based" ? "Case-Based Question" :
                     currentQuestion.questionType === "comparison" ? "Side-by-Side Comparison" :
                     currentQuestion.questionType}
                  </div>
                )}

                <p className="text-gray-900 leading-relaxed mb-6 text-base" data-testid="text-question-stem">
                  {currentQuestion.question}
                </p>

                <div className="space-y-3">
                  {currentQuestion.options.map((opt, idx) => {
                    const label = optionLabels[idx];
                    const isSelected = selectedAnswer === label;
                    let optClass = "border-gray-200 hover:border-indigo-300 bg-white";

                    if (isAnswerSubmitted && selectedMode === "practice") {
                      if (label === answerResult?.correctAnswer) {
                        optClass = "border-green-400 bg-green-50";
                      } else if (isSelected && !answerResult?.isCorrect) {
                        optClass = "border-red-400 bg-red-50";
                      }
                    } else if (isSelected) {
                      optClass = "border-indigo-500 bg-indigo-50";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!isAnswerSubmitted) setSelectedAnswer(label);
                        }}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${optClass}`}
                        data-testid={`button-option-${label}`}
                      >
                        <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isSelected ? "border-indigo-500 bg-indigo-500 text-white" : "border-gray-300 text-gray-500"
                        }`}>
                          {label}
                        </span>
                        <span className="text-sm text-gray-800 pt-0.5">{opt}</span>
                        {isAnswerSubmitted && selectedMode === "practice" && label === answerResult?.correctAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0 mt-0.5" />
                        )}
                        {isAnswerSubmitted && selectedMode === "practice" && isSelected && !answerResult?.isCorrect && label !== answerResult?.correctAnswer && (
                          <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswerSubmitted && selectedMode === "practice" && answerResult?.rationale && (
                  <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100" data-testid="text-rationale">
                    <p className="text-sm font-semibold text-indigo-800 mb-1">{t("pages.imagingExamSimulator.explanation")}</p>
                    <p className="text-sm text-indigo-700 leading-relaxed">{answerResult.rationale}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="text-xs text-gray-400">
              {isFlagged && <span className="text-amber-500 font-medium">{t("pages.imagingExamSimulator.flaggedForReview")}</span>}
            </div>
            <div className="flex items-center gap-3">
              {!isAnswerSubmitted ? (
                <button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer || loading}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  data-testid="button-submit-answer"
                >
                  {loading ? "..." : <>Confirm Answer <Send className="w-4 h-4" /></>}
                </button>
              ) : selectedMode === "practice" ? (
                <button
                  onClick={handleNextAfterPractice}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"
                  data-testid="button-next-question"
                >
                  Next Question <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}
              {questionsAnswered >= totalQuestions - 1 && isAnswerSubmitted && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 flex items-center gap-2"
                  data-testid="button-finish-exam"
                >
                  Submit Exam <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {showCalculator && <ExamCalculator onClose={() => setShowCalculator(false)} />}

        {showExitModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="exit-modal">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t("pages.imagingExamSimulator.exitExam")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("pages.imagingExamSimulator.yourProgressWillBeSaved")}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowExitModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50" data-testid="button-cancel-exit">
                  Continue Exam
                </button>
                <button onClick={handleExitExam} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700" data-testid="button-confirm-exit">
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {showSubmitModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="submit-modal">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t("pages.imagingExamSimulator.submitExam")}</h3>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <p className="text-gray-500">{t("pages.imagingExamSimulator.answered")}</p>
                    <p className="text-lg font-bold text-gray-900" data-testid="text-submit-answered">{questionsAnswered}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t("pages.imagingExamSimulator.flagged")}</p>
                    <p className="text-lg font-bold text-amber-600" data-testid="text-submit-flagged">{flaggedIds.size}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t("pages.imagingExamSimulator.unanswered")}</p>
                    <p className="text-lg font-bold text-red-600" data-testid="text-submit-unanswered">{totalQuestions - questionsAnswered}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{t("pages.imagingExamSimulator.onceSubmittedYouCannotChange")}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50" data-testid="button-cancel-submit">
                  Continue Exam
                </button>
                <button onClick={handleSubmitExam} disabled={loading} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50" data-testid="button-confirm-submit">
                  {loading ? "Submitting..." : "Submit Exam"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (phase === "exam" && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="exam-loading">
        <div className="text-center">
          {showSubmitModal ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-2">{t("pages.imagingExamSimulator.submitExam2")}</h3>
              <p className="text-gray-600 text-sm mb-6">You have answered all {totalQuestions} questions. Ready to submit?</p>
              <div className="flex gap-3">
                <button onClick={handleSubmitExam} disabled={loading} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50" data-testid="button-confirm-submit-final">
                  {loading ? "Submitting..." : "Submit Exam"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">{t("pages.imagingExamSimulator.loadingQuestion")}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (phase === "report" && examReport) {
    return (
      <div data-testid="exam-report-page">
        <SEO title={`${examLabel} Exam Report`} description={t("pages.imagingExamSimulator.yourDetailedExamPerformanceReport")} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 ${
              examReport.scorePercent >= 70 ? "border-green-500 bg-green-50" : "border-red-400 bg-red-50"
            }`}>
              <span className={`text-3xl font-bold ${examReport.scorePercent >= 70 ? "text-green-700" : "text-red-700"}`} data-testid="text-final-score">
                {examReport.scorePercent}%
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.imagingExamSimulator.examComplete")}</h1>
            <p className="text-gray-500 mb-4">{examReport.correctCount} of {examReport.totalQuestions} correct</p>
            <ReadinessBadge band={examReport.readinessBand} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900" data-testid="text-time-spent">{formatTime(examReport.timeSpent)}</p>
              <p className="text-xs text-gray-500">{t("pages.imagingExamSimulator.totalTime")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <Timer className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900" data-testid="text-avg-time">{examReport.averageTimePerQuestion}s</p>
              <p className="text-xs text-gray-500">{t("pages.imagingExamSimulator.avgPerQuestion")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <TrendingUp className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900" data-testid="text-ability-est">{examReport.abilityEstimate.toFixed(1)}</p>
              <p className="text-xs text-gray-500">{t("pages.imagingExamSimulator.abilityEstimate")}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> Topic Performance
            </h3>
            <div className="space-y-3">
              {Object.entries(examReport.topicBreakdown).map(([topic, data]) => (
                <div key={topic} data-testid={`topic-breakdown-${topic}`}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{topic}</span>
                    <span className="text-gray-500 font-medium">{data.correct}/{data.total} ({data.percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${data.percent >= 70 ? "bg-green-500" : data.percent >= 50 ? "bg-amber-500" : "bg-red-400"}`}
                      style={{ width: `${data.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" /> Difficulty Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(examReport.difficultyBreakdown).map(([diff, data]) => (
                  <div key={diff} data-testid={`diff-breakdown-${diff}`}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{diff}</span>
                      <span className="text-gray-500">{data.correct}/{data.total} ({data.percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${data.percent >= 70 ? "bg-green-500" : "bg-amber-500"}`}
                        style={{ width: `${data.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {examReport.imageQuestionPerformance.total > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" /> Image Question Performance
                </h3>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-gray-900" data-testid="text-image-score">
                    {examReport.imageQuestionPerformance.percent}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {examReport.imageQuestionPerformance.correct}/{examReport.imageQuestionPerformance.total} correct
                  </p>
                </div>
              </div>
            )}
          </div>

          {examReport.recommendations.length > 0 && (
            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6 mb-6">
              <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-600" /> Recommended Next Steps
              </h3>
              <ul className="space-y-2">
                {examReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-indigo-800" data-testid={`recommendation-${i}`}>
                    <ArrowRight className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 mt-4">
                <Link
                  href={`/medical-imaging/${country}/flashcards`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                  data-testid="link-flashcards"
                >
                  Study Flashcards
                </Link>
                <Link
                  href={`/medical-imaging/${country}/lessons`}
                  className="px-4 py-2 bg-white text-indigo-700 border border-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-50"
                  data-testid="link-lessons"
                >
                  Review Lessons
                </Link>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setPhase("setup");
                setSessionId(null);
                setExamReport(null);
                setCurrentQuestion(null);
                setAnsweredQuestions([]);
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"
              data-testid="button-new-exam"
            >
              <RotateCcw className="w-4 h-4" /> Take Another Exam
            </button>
            <Link
              href={`/medical-imaging/${country}`}
              className="px-6 py-3 bg-white text-indigo-700 border border-indigo-200 rounded-xl text-sm font-semibold hover:bg-indigo-50"
              data-testid="button-back-to-prep"
            >
              Back to {examLabel} Prep
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{t("pages.imagingExamSimulator.loading")}</p>
      </div>
    </div>
  );
}
