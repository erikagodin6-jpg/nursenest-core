import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import {
  ChevronLeft, ChevronRight, Flag, Clock, CheckCircle2, XCircle,
  AlertTriangle, ArrowRight, Zap, Brain, BarChart3, Menu, X
} from "lucide-react";

interface SessionAnswer {
  selectedIndex: number;
  timeSpent: number;
  isCorrect?: boolean;
  rationale?: string;
  correctIndex?: number;
}

interface QuestionData {
  id: string;
  stem: string;
  options: string[];
  category: string;
  topic: string;
  difficulty: number;
  correctIndex?: number;
  rationale?: string;
}

interface SessionState {
  id: string;
  mode: string;
  examType: string;
  totalQuestions: number;
  timeLimit: number | null;
  status: string;
  currentIndex: number;
  questionIds: string[];
  answers: Record<string, SessionAnswer>;
  flaggedIds: string[];
  abilityEstimate: number;
  drillTopic: string | null;
  drillStreak: number;
  drillBestStreak: number;
  startedAt: string;
  questions: QuestionData[];
}

const EXAM_CONFIGS: Record<string, { questions: number; timeMinutes: number; label: string }> = {
  nremt: { questions: 100, timeMinutes: 120, label: "NREMT Paramedic" },
  "copr-pcp": { questions: 80, timeMinutes: 120, label: "COPR PCP" },
  "copr-acp": { questions: 100, timeMinutes: 150, label: "COPR ACP" },
};

export default function ParamedicExamSimulator() {
  const { t } = useI18n();
  const params = useParams<{ sessionId: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [session, setSession] = useState<SessionState | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [answers, setAnswers] = useState<Record<string, SessionAnswer>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showNav, setShowNav] = useState(false);
  const [abilityEstimate, setAbilityEstimate] = useState(0);
  const [drillStreak, setDrillStreak] = useState(0);
  const [drillBestStreak, setDrillBestStreak] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!params.sessionId || !user) return;
    loadSession();
  }, [params.sessionId, user]);

  async function loadSession() {
    try {
      setLoading(true);
      const res = await apiRequest("GET", `/api/paramedic/exam-sessions/${params.sessionId}`);
      const data = await res.json();
      setSession(data);
      setQuestions(data.questions || []);
      setCurrentIdx(data.currentIndex || 0);
      setAnswers(data.answers || {});
      setFlaggedIds(data.flaggedIds || []);
      setAbilityEstimate(data.abilityEstimate || 0);
      setDrillStreak(data.drillStreak || 0);
      setDrillBestStreak(data.drillBestStreak || 0);
      setQuestionStartTime(Date.now());

      if (data.timeLimit && data.status === "in_progress") {
        const elapsed = (Date.now() - new Date(data.startedAt).getTime()) / 1000;
        const remaining = Math.max(0, data.timeLimit * 60 - elapsed);
        setTimeRemaining(Math.floor(remaining));
      }

      if (data.status === "completed") {
        navigate(`/allied-health/paramedic/exam-results/${data.id}`);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load session");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleCompleteExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining !== null]);

  const questionIds = session?.questionIds || [];
  const currentQuestionId = questionIds[currentIdx];
  const currentQuestion = questions.find(q => q.id === currentQuestionId) || null;
  const totalQuestions = session?.mode === "adaptive"
    ? Math.max(session?.totalQuestions || 0, questionIds.length)
    : questionIds.length;

  const answeredCount = Object.keys(answers).length;
  const isAnswered = currentQuestionId ? !!answers[currentQuestionId] : false;
  const currentAnswer = currentQuestionId ? answers[currentQuestionId] : null;

  useEffect(() => {
    setSelectedAnswer(isAnswered ? answers[currentQuestionId]?.selectedIndex ?? null : null);
    setShowRationale(false);
    setQuestionStartTime(Date.now());
  }, [currentIdx, currentQuestionId]);

  useEffect(() => {
    if (isAnswered && (session?.mode === "practice" || session?.mode === "drill")) {
      setShowRationale(true);
    }
  }, [isAnswered, session?.mode]);

  const handleSelectAnswer = useCallback(async (index: number) => {
    if (!session || !currentQuestion || isAnswered) return;
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    setSelectedAnswer(index);

    try {
      const res = await apiRequest("PATCH", `/api/paramedic/exam-sessions/${session.id}/answer`, {
        questionId: currentQuestionId,
        selectedIndex: index,
        timeSpent,
      });
      const data = await res.json();

      const answerData: SessionAnswer = {
        selectedIndex: index,
        timeSpent,
        isCorrect: data.isCorrect,
        correctIndex: data.correctIndex,
        rationale: data.rationale,
      };

      const newAnswers = { ...answers, [currentQuestionId]: answerData };
      setAnswers(newAnswers);

      if ((session.mode === "practice" || session.mode === "drill") && data.correctIndex !== undefined) {
        setShowRationale(true);
      }

      if (session.mode === "drill" && data.isCorrect !== undefined) {
        const newStreak = data.isCorrect ? drillStreak + 1 : 0;
        const newBest = Math.max(drillBestStreak, newStreak);
        setDrillStreak(newStreak);
        setDrillBestStreak(newBest);
        try {
          await apiRequest("PATCH", `/api/paramedic/exam-sessions/${session.id}/adaptive`, {
            drillStreak: newStreak,
            drillBestStreak: newBest,
          });
        } catch {}
      }

      if (session.mode === "adaptive" && data.isCorrect !== undefined) {
        const answeredSoFar = Object.keys(newAnswers).length;
        const stepSize = Math.max(0.1, 0.5 / Math.sqrt(answeredSoFar));
        const delta = data.isCorrect ? stepSize : -stepSize;
        const newAbility = Math.max(-3, Math.min(3, abilityEstimate + delta));
        setAbilityEstimate(newAbility);

        try {
          const nextRes = await apiRequest("POST", `/api/paramedic/exam-sessions/${session.id}/next-adaptive`, {
            abilityEstimate: newAbility,
          });
          const nextData = await nextRes.json();

          if (!nextData.done && nextData.question) {
            setQuestions(prev => [...prev, nextData.question]);
            setSession(prev => prev ? { ...prev, questionIds: nextData.questionIds } : prev);
          }
        } catch {}
      }
    } catch {
      const fallbackAnswer: SessionAnswer = { selectedIndex: index, timeSpent };
      setAnswers(prev => ({ ...prev, [currentQuestionId]: fallbackAnswer }));
    }
  }, [session, currentQuestion, isAnswered, questionStartTime, answers, currentQuestionId,
      abilityEstimate, drillStreak, drillBestStreak]);

  const handleToggleFlag = useCallback(async () => {
    if (!session || !currentQuestionId) return;
    const newFlagged = flaggedIds.includes(currentQuestionId)
      ? flaggedIds.filter(id => id !== currentQuestionId)
      : [...flaggedIds, currentQuestionId];
    setFlaggedIds(newFlagged);

    try {
      await apiRequest("PATCH", `/api/paramedic/exam-sessions/${session.id}/flag`, {
        questionId: currentQuestionId,
      });
    } catch {}
  }, [session, currentQuestionId, flaggedIds]);

  const handleNavigate = useCallback(async (idx: number) => {
    if (!session) return;
    setCurrentIdx(idx);
    setShowNav(false);
    try {
      await apiRequest("PATCH", `/api/paramedic/exam-sessions/${session.id}/navigate`, {
        currentIndex: idx,
      });
    } catch {}
  }, [session]);

  const handleNext = useCallback(() => {
    if (currentIdx < totalQuestions - 1) {
      handleNavigate(currentIdx + 1);
    }
  }, [currentIdx, totalQuestions, handleNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      handleNavigate(currentIdx - 1);
    }
  }, [currentIdx, handleNavigate]);

  const handleCompleteExam = useCallback(async () => {
    if (!session || submitting) return;
    setSubmitting(true);

    try {
      await apiRequest("POST", `/api/paramedic/exam-sessions/${session.id}/complete`, {});
      navigate(`/allied-health/paramedic/exam-results/${session.id}`);
    } catch (e: any) {
      setError("Failed to submit exam: " + e.message);
    } finally {
      setSubmitting(false);
    }
  }, [session, submitting, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="exam-login-required">
        <div className="text-center max-w-md px-6">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("allied.paramedicParamedicExamSimulator.signInRequired")}</h2>
          <p className="text-gray-600 mb-6">{t("allied.paramedicParamedicExamSimulator.youNeedToBeSigned")}</p>
          <a href="/login" className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors" data-testid="link-login">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="exam-loading">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">{t("allied.paramedicParamedicExamSimulator.loadingExam")}</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="exam-error">
        <div className="text-center max-w-md px-6">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("allied.paramedicParamedicExamSimulator.error")}</h2>
          <p className="text-gray-600 mb-6">{error || "Session not found"}</p>
          <button onClick={() => navigate("/allied-health/paramedic/practice-exams")} className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors" data-testid="button-back-to-exams">
            Back to Practice Exams
          </button>
        </div>
      </div>
    );
  }

  const modeLabel = { practice: "Practice", exam: "Exam", adaptive: "Adaptive", drill: "Drill" }[session.mode] || session.mode;
  const isFlagged = flaggedIds.includes(currentQuestionId);
  const isExamMode = session.mode === "exam";
  const showImmediateRationale = session.mode === "practice" || session.mode === "drill";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="paramedic-exam-simulator">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowNav(!showNav)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg" data-testid="button-toggle-nav">
            {showNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">{modeLabel}</span>
              <span className="text-sm font-medium text-gray-700">{EXAM_CONFIGS[session.examType]?.label || session.examType}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Question {currentIdx + 1} of {totalQuestions} · {answeredCount} answered
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session.mode === "drill" && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg" data-testid="drill-streak">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-purple-700">Streak: {drillStreak}</span>
              <span className="text-xs text-purple-400">Best: {drillBestStreak}</span>
            </div>
          )}
          {session.mode === "adaptive" && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg" data-testid="adaptive-ability">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-700">
                Ability: {abilityEstimate > 0 ? "+" : ""}{abilityEstimate.toFixed(1)}
              </span>
            </div>
          )}
          {timeRemaining !== null && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${timeRemaining < 300 ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}`} data-testid="exam-timer">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold font-mono">
                {Math.floor(timeRemaining / 3600)}:{String(Math.floor((timeRemaining % 3600) / 60)).padStart(2, "0")}:{String(timeRemaining % 60).padStart(2, "0")}
              </span>
            </div>
          )}
          <button
            onClick={handleCompleteExam}
            disabled={submitting}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
            data-testid="button-submit-exam"
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${showNav ? "fixed inset-0 z-20 bg-black/50 lg:relative lg:bg-transparent" : "hidden"} lg:block`}>
          <div className={`${showNav ? "w-72 h-full" : "w-64"} bg-white border-r border-gray-200 p-4 overflow-y-auto h-full`} data-testid="question-navigator">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">{t("allied.paramedicParamedicExamSimulator.questionNavigator")}</h3>
              <button onClick={() => setShowNav(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded" data-testid="button-close-nav">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {questionIds.map((qId, idx) => {
                const isActive = idx === currentIdx;
                const isQAnswered = !!answers[qId];
                const isQFlagged = flaggedIds.includes(qId);
                let bgClass = "bg-gray-100 text-gray-600 hover:bg-gray-200";
                if (isActive) bgClass = "bg-teal-600 text-white ring-2 ring-teal-300";
                else if (isQFlagged && isQAnswered) bgClass = "bg-amber-100 text-amber-700 border border-amber-300";
                else if (isQFlagged) bgClass = "bg-amber-50 text-amber-600 border border-amber-200";
                else if (isQAnswered) bgClass = "bg-teal-100 text-teal-700";

                return (
                  <button
                    key={qId}
                    onClick={() => handleNavigate(idx)}
                    className={`w-full aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-all ${bgClass}`}
                    data-testid={`nav-question-${idx}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-teal-100 border border-teal-300" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" /> Flagged
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300" /> Unanswered
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 space-y-1">
                <p>Answered: {answeredCount}/{totalQuestions}</p>
                <p>Flagged: {flaggedIds.length}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentQuestion ? (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">Q{currentIdx + 1}</span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs font-medium">{currentQuestion.category}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                      Difficulty: {"★".repeat(currentQuestion.difficulty)}{"☆".repeat(Math.max(0, 5 - currentQuestion.difficulty))}
                    </span>
                  </div>
                  <button
                    onClick={handleToggleFlag}
                    className={`p-2 rounded-lg transition-colors ${isFlagged ? "bg-amber-100 text-amber-600" : "hover:bg-gray-100 text-gray-400"}`}
                    data-testid="button-flag-question"
                  >
                    <Flag className="w-5 h-5" fill={isFlagged ? "currentColor" : "none"} />
                  </button>
                </div>

                <p className="text-base sm:text-lg text-gray-900 mb-6 leading-relaxed" data-testid="text-question-stem">
                  {currentQuestion.stem}
                </p>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const correctIdx = currentAnswer?.correctIndex;
                    const isCorrectOpt = correctIdx !== undefined && idx === correctIdx;
                    const showResult = showRationale && isAnswered;

                    let optClass = "border-gray-200 hover:border-teal-300 hover:bg-teal-50/30 cursor-pointer";
                    if (isAnswered && !showResult) {
                      optClass = isSelected ? "border-teal-500 bg-teal-50" : "border-gray-200 opacity-70 cursor-default";
                    }
                    if (showResult) {
                      if (isCorrectOpt) optClass = "border-green-500 bg-green-50";
                      else if (isSelected && !isCorrectOpt) optClass = "border-red-400 bg-red-50";
                      else optClass = "border-gray-200 opacity-60 cursor-default";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !isAnswered && handleSelectAnswer(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${optClass}`}
                        data-testid={`option-${idx}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                            showResult && isCorrectOpt ? "bg-green-500 text-white" :
                            showResult && isSelected && !isCorrectOpt ? "bg-red-400 text-white" :
                            isSelected ? "bg-teal-500 text-white" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-sm text-gray-700 pt-0.5">{option}</span>
                          {showResult && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0 mt-0.5" />}
                          {showResult && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-red-400 ml-auto flex-shrink-0 mt-0.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showRationale && isAnswered && currentAnswer?.rationale && (
                  <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl" data-testid="rationale-panel">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Rationale
                    </h4>
                    <p className="text-sm text-blue-700 leading-relaxed">{currentAnswer.rationale}</p>
                    <p className="text-xs text-blue-500 mt-3">Topic: {currentQuestion.topic} · Category: {currentQuestion.category}</p>
                  </div>
                )}

                {isExamMode && isAnswered && !showRationale && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 text-center" data-testid="rationale-hidden">
                    Rationale will be shown after exam submission.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  data-testid="button-prev"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {showImmediateRationale && isAnswered && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors"
                    data-testid="button-next-after-answer"
                  >
                    Next Question <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {(!showImmediateRationale || !isAnswered) && (
                  <button
                    onClick={currentIdx === totalQuestions - 1 ? handleCompleteExam : handleNext}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      currentIdx === totalQuestions - 1
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    data-testid="button-next"
                  >
                    {currentIdx === totalQuestions - 1 ? "Finish Exam" : "Next"} <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{t("allied.paramedicParamedicExamSimulator.noQuestionAvailableAtThis")}</p>
              <button onClick={handleCompleteExam} className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold" data-testid="button-finish-early">
                Finish Exam
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export { EXAM_CONFIGS };
