import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ExamSessionGuard } from "@/components/exam-session-guard";
import { Clock, Lock, AlertCircle, Brain, BarChart3 } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  category: string;
  difficulty: string;
}

export default function MltUsaCatExam() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(130);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [abilityEstimate, setAbilityEstimate] = useState(0);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; rationale?: string } | null>(null);
  const [score, setScore] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startExam();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft > 0]);

  async function startExam() {
    try {
      const params = new URLSearchParams(window.location.search);
      const noBacktracking = params.get("strict") !== "false";

      const res = await fetch("/api/mlt/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "usa_cat",
          country: "US",
          noBacktracking,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSessionId(data.session.id);
      setCurrentQuestion(data.question);
      setTotalQuestions(data.session.totalQuestions);
      setTimeLeft(data.session.timeLimit * 60);
      setLoading(false);
      startTimeRef.current = Date.now();
    } catch (e: any) {
      console.error("[MLT-CAT] startExam failed:", { message: e.message, status: e.status });
      const msg = e.message || "Failed to start exam";
      if (msg.includes("Unable to create") || msg.includes("SCHEMA_DRIFT") || msg.includes("database") || msg.includes("500")) {
        setError("Unable to start exam session — please retry in a moment. If the issue persists, contact support.");
      } else if (msg.includes("No questions") || msg.includes("question bank")) {
        setError("No questions available for this exam configuration. Please try again later.");
      } else if (msg.includes("Upgrade required") || msg.includes("403") || msg.includes("subscription")) {
        setError("This feature requires a paid subscription. Please upgrade your plan.");
      } else if (msg.includes("Authentication") || msg.includes("401")) {
        setError("Please log in to start the exam.");
      } else {
        setError("Something went wrong — please try again.");
      }
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!sessionId || !currentQuestion || !selectedAnswer) return;
    setSubmitting(true);
    setAnswerLocked(true);

    const elapsed = Date.now() - startTimeRef.current;
    startTimeRef.current = Date.now();

    try {
      const res = await fetch(`/api/mlt/exam/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedAnswer,
          responseTimeMs: elapsed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setScore(data.score);
      setAbilityEstimate(data.abilityEstimate);

      if (data.completed) {
        setLocation(`/allied-health/mlt/exam/results/${sessionId}`);
        return;
      }

      setTimeout(() => {
        if (data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setQuestionNumber(data.currentIndex + 1);
          setSelectedAnswer(null);
          setAnswerLocked(false);
          setLastResult(null);
        }
      }, 300);
    } catch (e: any) {
      setError(e.message);
      setAnswerLocked(false);
    }
    setSubmitting(false);
  }

  async function handleComplete() {
    if (!sessionId) return;
    try {
      await fetch(`/api/mlt/exam/${sessionId}/complete`, { method: "POST" });
      setLocation(`/allied-health/mlt/exam/results/${sessionId}`);
    } catch (e: any) {
      setError(e.message);
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">{t("allied.mltMltUsaCatExam.preparingAscpCatExam")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t("allied.mltMltUsaCatExam.examError")}</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setError(""); setLoading(true); startExam(); }} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700" data-testid="button-retry-exam">
            Retry
          </button>
          <button onClick={() => setLocation("/allied-health/mlt/exams")} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700" data-testid="button-back-to-hub">
            Back to Exam Hub
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <ExamSessionGuard isActive={!!sessionId && !!currentQuestion && !loading} mode="cat" onSubmitAndExit={handleComplete} />
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-gray-900" data-testid="text-cat-question-counter">
                Question {questionNumber}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              Adaptive · No backtracking
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`} data-testid="text-cat-timer">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              data-testid="button-end-cat-exam"
            >
              End Exam
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${Math.min((questionNumber / totalQuestions) * 100, 100)}%` }} />
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-30 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-gray-900 mb-2">{t("allied.mltMltUsaCatExam.endExam")}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to end the exam? You have answered {questionNumber - 1} questions. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2 text-sm font-medium bg-gray-100 rounded-xl hover:bg-gray-200" data-testid="button-cancel-end">
                Continue Exam
              </button>
              <button onClick={handleComplete} className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700" data-testid="button-confirm-end">
                End Exam
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-full
              ${currentQuestion.difficulty === "hard" ? "bg-red-100 text-red-700" :
                currentQuestion.difficulty === "easy" ? "bg-green-100 text-green-700" :
                "bg-yellow-100 text-yellow-700"}`}
            >
              {currentQuestion.difficulty}
            </span>
            <span className="text-xs text-gray-400">{currentQuestion.category}</span>
          </div>

          <p className="text-gray-900 text-lg leading-relaxed mb-6" data-testid="text-cat-question-stem">
            {currentQuestion.question}
          </p>

          <div className="space-y-3">
            {[
              { key: "A", text: currentQuestion.optionA },
              { key: "B", text: currentQuestion.optionB },
              { key: "C", text: currentQuestion.optionC },
              { key: "D", text: currentQuestion.optionD },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => !answerLocked && setSelectedAnswer(opt.key)}
                disabled={answerLocked}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all
                  ${selectedAnswer === opt.key
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                  ${answerLocked ? "cursor-not-allowed opacity-70" : ""}
                `}
                data-testid={`button-cat-option-${opt.key}`}
              >
                <span className="font-bold mr-2">{opt.key}.</span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer || submitting || answerLocked}
            className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-40 flex items-center gap-2"
            data-testid="button-cat-submit-answer"
          >
            {submitting ? "Processing..." : "Submit & Next"}
            <Lock className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <BarChart3 className="w-4 h-4" />
            <span>{t("allied.mltMltUsaCatExam.adaptiveProgress")}</span>
          </div>
          <div className="text-xs text-blue-600">
            {questionNumber} of ~{totalQuestions} questions · Score: {score}%
          </div>
        </div>
      </div>
    </div>
  );
}
