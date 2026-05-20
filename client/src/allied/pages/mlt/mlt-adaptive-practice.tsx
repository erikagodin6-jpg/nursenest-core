import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { Zap, Target, Shuffle, Image, Clock, CheckCircle, XCircle, ArrowRight, AlertCircle } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const SUB_MODES = [
  { id: "quick_quiz", title: "Quick Adaptive Quiz", description: "20 questions adapting to your level", icon: Zap, color: "bg-purple-500" },
  { id: "weak_area_drill", title: "Weak Area Drill", description: "Focus on your weakest topics", icon: Target, color: "bg-red-500" },
  { id: "mixed_discipline", title: "Mixed Discipline", description: "Random mix across all domains", icon: Shuffle, color: "bg-teal-500" },
  { id: "image_drill", title: "Image Question Drill", description: "Practice image-based questions", icon: Image, color: "bg-orange-500" },
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

export default function MltAdaptivePractice() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const country = params.get("country") || "US";

  const [step, setStep] = useState<"select" | "active" | "result">("select");
  const [selectedSubMode, setSelectedSubMode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; correctAnswer: string; rationale?: string } | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = useRef(Date.now());

  async function startPractice(subMode: string) {
    setSelectedSubMode(subMode);
    setLoading(true);
    setError("");

    try {
      const qCount = subMode === "quick_quiz" ? 20 : subMode === "weak_area_drill" ? 15 : 25;

      const res = await fetch("/api/mlt/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "adaptive_practice",
          country,
          subMode,
          totalQuestions: qCount,
          timeLimit: 30,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSessionId(data.session.id);
      setCurrentQuestion(data.question);
      setTotalQuestions(qCount);
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

      setLastResult({
        isCorrect: data.isCorrect,
        correctAnswer: data.correctAnswer,
        rationale: data.rationale,
      });
      setScore(data.score);
      setCorrectCount(data.correctCount);

      if (data.completed) {
        setTimeout(() => {
          setLocation(`/allied-health/mlt/exam/results/${sessionId}`);
        }, 2000);
        return;
      }

      setTimeout(() => {
        if (data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setQuestionNumber(data.currentIndex + 1);
          setSelectedAnswer(null);
          setLastResult(null);
        }
      }, 2000);
    } catch (e: any) {
      setError(e.message);
    }
    setSubmitting(false);
  }

  if (step === "select") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-adaptive-practice-title">
            Adaptive Practice – {country === "CA" ? "🇨🇦 Canada" : "🇺🇸 USA"}
          </h1>
          <p className="text-gray-600">{t("allied.mltMltAdaptivePractice.chooseAPracticeModeQuestions")}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 inline mr-1" /> {error}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {SUB_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => startPractice(mode.id)}
                disabled={loading}
                className="text-left p-5 rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all disabled:opacity-50"
                data-testid={`button-submode-${mode.id}`}
              >
                <div className={`w-10 h-10 rounded-xl ${mode.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{mode.title}</h3>
                <p className="text-sm text-gray-500">{mode.description}</p>
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="text-center mt-6">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">{t("allied.mltMltAdaptivePractice.preparingQuestions")}</p>
          </div>
        )}
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900" data-testid="text-practice-counter">
            Q {questionNumber} / {totalQuestions}
          </span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">Score: {score}%</span>
            <span className="text-green-600">{correctCount} correct</span>
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-purple-500 transition-all" style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} />
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

          <p className="text-gray-900 text-lg leading-relaxed mb-6" data-testid="text-practice-question">
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
              const showResult = lastResult !== null;
              const isCorrectOpt = showResult && opt.key === lastResult.correctAnswer;
              const isWrongSelected = showResult && isSelected && !lastResult.isCorrect;

              return (
                <button
                  key={opt.key}
                  onClick={() => !lastResult && setSelectedAnswer(opt.key)}
                  disabled={!!lastResult}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all
                    ${isCorrectOpt ? "border-green-500 bg-green-50" : ""}
                    ${isWrongSelected ? "border-red-500 bg-red-50" : ""}
                    ${!showResult && isSelected ? "border-purple-500 bg-purple-50" : ""}
                    ${!showResult && !isSelected ? "border-gray-200 hover:border-gray-300" : ""}
                    ${showResult && !isCorrectOpt && !isWrongSelected ? "border-gray-200 opacity-60" : ""}
                  `}
                  data-testid={`button-practice-option-${opt.key}`}
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

          {lastResult && lastResult.rationale && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">{t("allied.mltMltAdaptivePractice.rationale")}</p>
              <p className="text-sm text-blue-800">{lastResult.rationale}</p>
            </div>
          )}
        </div>

        {!lastResult && (
          <div className="flex justify-end">
            <button
              onClick={submitAnswer}
              disabled={!selectedAnswer || submitting}
              className="px-8 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-40"
              data-testid="button-practice-submit"
            >
              {submitting ? "Checking..." : "Submit Answer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
