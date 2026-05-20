import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { BookOpen, Clock, Eye, RotateCcw, Filter, Play, AlertCircle, CheckCircle, XCircle, Pause } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const MLT_CATEGORIES = [
  "Hematology", "Clinical Chemistry", "Microbiology",
  "Immunohematology/Blood Banking", "Urinalysis & Body Fluids",
  "Laboratory Operations", "Hematology & Coagulation",
  "Transfusion Science", "Histotechnology", "Quality Management",
];

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

export default function MltPracticeExam() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const country = params.get("country") || "US";

  const [step, setStep] = useState<"config" | "active">("config");
  const [practiceMode, setPracticeMode] = useState<"timed" | "tutor" | "review">("timed");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(30);
  const [timeLimitMin, setTimeLimitMin] = useState(45);
  const [redoIncorrect, setRedoIncorrect] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showRationale, setShowRationale] = useState(false);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; correctAnswer: string; rationale?: string } | null>(null);
  const [paused, setPaused] = useState(false);
  const [pendingNextQuestion, setPendingNextQuestion] = useState<any>(null);
  const [pendingNextIndex, setPendingNextIndex] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (step !== "active" || practiceMode !== "timed" || timeLeft <= 0 || paused) return;
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
  }, [step, practiceMode, timeLeft > 0, paused]);

  function toggleTopic(topic: string) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  }

  async function startPractice() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mlt/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "practice_exam",
          country,
          practiceMode,
          topics: selectedTopics.length > 0 ? selectedTopics : undefined,
          totalQuestions: questionCount,
          timeLimit: practiceMode === "timed" ? timeLimitMin : 999,
          redoIncorrect,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSessionId(data.session.id);
      setCurrentQuestion(data.question);
      setTotalQuestions(data.session.totalQuestions);
      if (practiceMode === "timed") {
        setTimeLeft(timeLimitMin * 60);
      }
      setStep("active");
      startTimeRef.current = Date.now();
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function submitAnswer() {
    if (!sessionId || !currentQuestion || !selectedAnswer) return;
    setSubmitting(true);

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
      setCorrectCount(data.correctCount);

      if (practiceMode === "tutor" || practiceMode === "review") {
        setLastResult({
          isCorrect: data.isCorrect,
          correctAnswer: data.correctAnswer,
          rationale: data.rationale,
        });
        setShowRationale(true);

        if (data.completed) {
          setTimeout(() => setLocation(`/allied-health/mlt/exam/results/${sessionId}`), 3000);
          return;
        }

        if (data.nextQuestion) {
          setPendingNextQuestion(data.nextQuestion);
          setPendingNextIndex(data.currentIndex + 1);
        }
      } else {
        if (data.completed) {
          setLocation(`/allied-health/mlt/exam/results/${sessionId}`);
          return;
        }
        if (data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setQuestionNumber(data.currentIndex + 1);
          setSelectedAnswer(null);
        }
      }
    } catch (e: any) {
      setError(e.message);
    }
    setSubmitting(false);
  }

  function goNext() {
    setShowRationale(false);
    setLastResult(null);
    setSelectedAnswer(null);
    if (pendingNextQuestion) {
      setCurrentQuestion(pendingNextQuestion);
      setQuestionNumber(pendingNextIndex);
      setPendingNextQuestion(null);
      startTimeRef.current = Date.now();
    }
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
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (step === "config") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-practice-config-title">
          Practice Exam – {country === "CA" ? "🇨🇦 Canada" : "🇺🇸 USA"}
        </h1>
        <p className="text-gray-600 mb-8">{t("allied.mltMltPracticeExam.configureYourPracticeSession")}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 inline mr-1" /> {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t("allied.mltMltPracticeExam.mode")}</label>
            <div className="flex gap-3">
              {[
                { id: "timed" as const, label: "Timed", icon: Clock, desc: "Simulate real exam pressure" },
                { id: "tutor" as const, label: "Tutor", icon: BookOpen, desc: "See rationales after each answer" },
                { id: "review" as const, label: "Review", icon: Eye, desc: "Study mode with explanations" },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPracticeMode(m.id)}
                    className={`flex-1 p-4 rounded-xl border-2 text-left transition-all
                      ${practiceMode === m.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"}
                    `}
                    data-testid={`button-mode-${m.id}`}
                  >
                    <Icon className="w-5 h-5 text-teal-600 mb-1" />
                    <p className="font-bold text-sm text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t("allied.mltMltPracticeExam.topicsOptional")}</label>
            <div className="flex flex-wrap gap-2">
              {MLT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleTopic(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all
                    ${selectedTopics.includes(cat) ? "bg-teal-100 border-teal-400 text-teal-800" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}
                  `}
                  data-testid={`button-topic-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltPracticeExam.questions")}</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl text-sm"
                data-testid="select-question-count"
              >
                {[10, 20, 30, 50, 75, 100].map((n) => (
                  <option key={n} value={n}>{n} questions</option>
                ))}
              </select>
            </div>
            {practiceMode === "timed" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltPracticeExam.timeLimit")}</label>
                <select
                  value={timeLimitMin}
                  onChange={(e) => setTimeLimitMin(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  data-testid="select-time-limit"
                >
                  {[15, 30, 45, 60, 90, 120].map((n) => (
                    <option key={n} value={n}>{n} minutes</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={redoIncorrect}
              onChange={(e) => setRedoIncorrect(e.target.checked)}
              className="rounded border-gray-300"
              data-testid="checkbox-redo-incorrect"
            />
            <span className="text-sm text-gray-700">{t("allied.mltMltPracticeExam.redoIncorrectQuestionsAtThe")}</span>
          </label>

          <button
            onClick={startPractice}
            disabled={loading}
            className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
            data-testid="button-start-practice"
          >
            {loading ? "Preparing..." : <><Play className="w-4 h-4" /> {t("allied.mltMltPracticeExam.startPractice")}</>}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900" data-testid="text-practice-exam-counter">
            Q {questionNumber} / {totalQuestions}
          </span>
          <div className="flex items-center gap-3">
            {practiceMode === "timed" && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold ${timeLeft < 120 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            )}
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-lg capitalize">{practiceMode} mode</span>
            <span className="text-sm text-green-600">{correctCount}/{questionNumber - 1 + (lastResult ? 1 : 0)}</span>
            <button
              onClick={handleComplete}
              className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              data-testid="button-end-practice"
            >
              End
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-teal-500 transition-all" style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} />
        </div>
      </div>

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

          <p className="text-gray-900 text-lg leading-relaxed mb-6" data-testid="text-practice-exam-question">
            {currentQuestion.question}
          </p>

          <div className="space-y-3">
            {[
              { key: "A", text: currentQuestion.optionA },
              { key: "B", text: currentQuestion.optionB },
              { key: "C", text: currentQuestion.optionC },
              { key: "D", text: currentQuestion.optionD },
            ].map((opt) => {
              const isSelected = selectedAnswer === opt.key;
              const showResult = lastResult !== null && showRationale;
              const isCorrectOpt = showResult && opt.key === lastResult.correctAnswer;
              const isWrongSelected = showResult && isSelected && !lastResult.isCorrect;

              return (
                <button
                  key={opt.key}
                  onClick={() => !showRationale && setSelectedAnswer(opt.key)}
                  disabled={showRationale}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all
                    ${isCorrectOpt ? "border-green-500 bg-green-50" : ""}
                    ${isWrongSelected ? "border-red-500 bg-red-50" : ""}
                    ${!showResult && isSelected ? "border-teal-500 bg-teal-50" : ""}
                    ${!showResult && !isSelected ? "border-gray-200 hover:border-gray-300" : ""}
                    ${showResult && !isCorrectOpt && !isWrongSelected ? "border-gray-200 opacity-60" : ""}
                  `}
                  data-testid={`button-practice-exam-option-${opt.key}`}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="font-bold mr-2">{opt.key}.</span>
                      {opt.text}
                    </span>
                    {isCorrectOpt && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {isWrongSelected && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showRationale && lastResult?.rationale && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">{t("allied.mltMltPracticeExam.rationale")}</p>
              <p className="text-sm text-blue-800">{lastResult.rationale}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          {showRationale ? (
            <button
              onClick={goNext}
              className="px-8 py-2.5 text-sm font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700"
              data-testid="button-next-practice-question"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={submitAnswer}
              disabled={!selectedAnswer || submitting}
              className="px-8 py-2.5 text-sm font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 disabled:opacity-40"
              data-testid="button-submit-practice-answer"
            >
              {submitting ? "Checking..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
