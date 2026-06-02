import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Clock, Flag, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, X } from "lucide-react";

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

interface ExamSession {
  id: string;
  totalQuestions: number;
  timeLimit: number;
  questionIds: string[];
  currentIndex: number;
  flaggedIds: string[];
  responseHistory: any[];
}

export default function MltCanadaExam() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [error, setError] = useState("");
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
      const res = await fetch("/api/mlt/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "canada_realistic", country: "CA" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSession(data.session);
      setCurrentQuestion(data.question);
      setTimeLeft(data.session.timeLimit * 60);
      setLoading(false);
      startTimeRef.current = Date.now();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!session || !currentQuestion || !selectedAnswer) return;
    setSubmitting(true);

    const elapsed = Date.now() - startTimeRef.current;
    startTimeRef.current = Date.now();

    try {
      const res = await fetch(`/api/mlt/exam/${session.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedAnswer,
          responseTimeMs: elapsed,
          flagged: flaggedIds.includes(currentQuestion.id),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedAnswer }));

      if (data.completed) {
        setLocation(`/allied-health/mlt/exam/results/${session.id}`);
        return;
      }

      if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
        setCurrentIndex(data.currentIndex);
        setSelectedAnswer(answers[data.nextQuestion.id] || null);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setSubmitting(false);
  }

  async function navigateToQuestion(idx: number) {
    if (!session) return;
    try {
      const res = await fetch(`/api/mlt/exam/${session.id}/question/${idx}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCurrentQuestion(data.question);
      setCurrentIndex(idx);
      setSelectedAnswer(data.previousAnswer || answers[data.question.id] || null);
      setShowNav(false);
      startTimeRef.current = Date.now();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function toggleFlag() {
    if (!session || !currentQuestion) return;
    const isFlagged = flaggedIds.includes(currentQuestion.id);
    const newFlagged = isFlagged
      ? flaggedIds.filter((id) => id !== currentQuestion.id)
      : [...flaggedIds, currentQuestion.id];
    setFlaggedIds(newFlagged);

    await fetch(`/api/mlt/exam/${session.id}/flag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: currentQuestion.id, flagged: !isFlagged }),
    });
  }

  async function handleComplete() {
    if (!session) return;
    try {
      const res = await fetch(`/api/mlt/exam/${session.id}/complete`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setLocation(`/allied-health/mlt/exam/results/${session.id}`);
      }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">{t("allied.mltMltCanadaExam.preparingCsmlsExam")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t("allied.mltMltCanadaExam.examError")}</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => setLocation("/allied-health/mlt/exams")} className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700" data-testid="button-back-to-hub">
          Back to Exam Hub
        </button>
      </div>
    );
  }

  if (!session || !currentQuestion) return null;

  const totalQ = session.questionIds?.length || session.totalQuestions;
  const progress = ((currentIndex + 1) / totalQ) * 100;
  const isFlagged = flaggedIds.includes(currentQuestion.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900" data-testid="text-question-counter">
              Q {currentIndex + 1} / {totalQ}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
              {currentQuestion.category}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`} data-testid="text-timer">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => setShowNav(!showNav)}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 rounded-lg hover:bg-gray-200"
              data-testid="button-toggle-nav"
            >
              Navigator
            </button>
            <button
              onClick={handleComplete}
              className="px-4 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
              data-testid="button-end-exam"
            >
              End Exam
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-red-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {showNav && (
        <div className="fixed inset-0 z-30 bg-black/30 flex items-center justify-center" onClick={() => setShowNav(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 max-h-[70vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{t("allied.mltMltCanadaExam.questionNavigator")}</h3>
              <button onClick={() => setShowNav(false)} data-testid="button-close-nav"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: totalQ }, (_, i) => {
                const qId = session.questionIds?.[i];
                const isAnswered = qId && answers[qId];
                const isFlag = qId && flaggedIds.includes(qId);
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={i}
                    onClick={() => navigateToQuestion(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold border-2 transition-all
                      ${isCurrent ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200"}
                      ${isAnswered ? "bg-green-50 text-green-700" : ""}
                      ${isFlag ? "ring-2 ring-yellow-400" : ""}
                    `}
                    data-testid={`button-nav-q-${i}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-50 border-2 border-gray-200 rounded" /> {t("allied.mltMltCanadaExam.answered")}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-white border-2 border-gray-200 rounded ring-2 ring-yellow-400" /> {t("allied.mltMltCanadaExam.flagged")}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-50 border-2 border-red-500 rounded" /> {t("allied.mltMltCanadaExam.current")}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-400 uppercase">
              {currentQuestion.difficulty} · {currentQuestion.category}
            </span>
            <button
              onClick={toggleFlag}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${isFlagged ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500 hover:bg-yellow-50"}
              `}
              data-testid="button-flag-question"
            >
              <Flag className="w-4 h-4" />
              {isFlagged ? "Flagged" : "Flag"}
            </button>
          </div>

          <p className="text-gray-900 text-lg leading-relaxed mb-6" data-testid="text-question-stem">
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
                onClick={() => setSelectedAnswer(opt.key)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all
                  ${selectedAnswer === opt.key
                    ? "border-red-500 bg-red-50 text-red-900"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
                data-testid={`button-option-${opt.key}`}
              >
                <span className="font-bold mr-2">{opt.key}.</span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => currentIndex > 0 && navigateToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-xl hover:bg-gray-50 disabled:opacity-40"
            data-testid="button-prev-question"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer || submitting}
            className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-40"
            data-testid="button-submit-answer"
          >
            {submitting ? "Submitting..." : currentIndex >= totalQ - 1 ? "Submit & Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
