import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Zap, Target, CheckCircle, XCircle, ArrowRight, AlertCircle,
  BarChart3, BookOpen, Brain, ChevronRight, Settings, TrendingUp,
  Award, StopCircle, Play, Layers, FileText,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  category: string;
  difficulty: string;
  difficultyNum: number;
}

interface SessionSettings {
  startDifficulty: number;
  weakAreaThreshold: number;
}

interface CategoryStat {
  total: number;
  correct: number;
  accuracy: number;
}

interface MasteryInfo {
  level: string;
  accuracy: number;
}

interface Analytics {
  totalAnswered: number;
  correctCount: number;
  score: number;
  categoryStats: Record<string, CategoryStat>;
  masteryLevels: Record<string, MasteryInfo>;
  weakAreas: string[];
  difficultyProgression: { index: number; difficulty: number; correct: boolean }[];
  recommendations: { type: string; slug: string; title: string; category?: string; path: string }[];
}

interface MasteryData {
  mastery: Record<string, { level: string; accuracy: number; total: number; correct: number }>;
  weakAreas: string[];
  totalSessions: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
}

const MASTERY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Advanced": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Proficient": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Developing": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Beginner": { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" },
};

const MASTERY_BAR_COLORS: Record<string, string> = {
  "Advanced": "bg-emerald-500",
  "Proficient": "bg-blue-500",
  "Developing": "bg-amber-500",
  "Beginner": "bg-gray-300",
};

export default function PharmtechAdaptivePractice() {
  const { t } = useI18n();
  const [view, setView] = useState<"setup" | "active" | "results" | "mastery">("setup");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; correctAnswer: string; rationale?: string } | null>(null);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState(3);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [masteryData, setMasteryData] = useState<MasteryData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SessionSettings>({ startDifficulty: 3, weakAreaThreshold: 70 });
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    fetchMastery();
  }, []);

  async function fetchMastery() {
    try {
      const res = await fetch("/api/pharmtech/mastery");
      if (res.ok) {
        const data = await res.json();
        setMasteryData(data);
      }
    } catch (_) {}
  }

  async function startSession() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pharmtech/adaptive/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSessionId(data.session.id);
      setCurrentQuestion(data.question);
      setCurrentDifficulty(data.session.currentDifficulty);
      setTotalAnswered(0);
      setCorrectCount(0);
      setScore(0);
      setView("active");
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
      const res = await fetch(`/api/pharmtech/adaptive/${sessionId}/answer`, {
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

      setLastResult({ isCorrect: data.isCorrect, correctAnswer: data.correctAnswer, rationale: data.rationale });
      setScore(data.score);
      setCorrectCount(data.correctCount);
      setTotalAnswered(data.totalAnswered);
      setCurrentDifficulty(data.currentDifficulty);

      if (data.nextQuestion) {
        setTimeout(() => {
          setCurrentQuestion(data.nextQuestion);
          setSelectedAnswer(null);
          setLastResult(null);
        }, 2500);
      } else {
        setTimeout(() => {
          endSession();
        }, 2000);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setSubmitting(false);
  }

  async function endSession() {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pharmtech/adaptive/${sessionId}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAnalytics(data.analytics);
      setView("results");
      fetchMastery();
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  if (view === "mastery") {
    return <MasteryDashboard masteryData={masteryData} onBack={() => setView("setup")} />;
  }

  if (view === "results" && analytics) {
    return (
      <ResultsView
        analytics={analytics}
        onNewSession={() => {
          setView("setup");
          setAnalytics(null);
          setSessionId(null);
        }}
        onViewMastery={() => setView("mastery")}
      />
    );
  }

  if (view === "active" && currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50" data-testid="pharmtech-adaptive-active">
        <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-900" data-testid="text-practice-counter">
                Q {totalAnswered + 1}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                currentDifficulty <= 2 ? "bg-green-100 text-green-700" :
                currentDifficulty >= 4 ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`} data-testid="text-difficulty-badge">
                Difficulty {currentDifficulty}/5
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500" data-testid="text-score">Score: {score}%</span>
              <span className="text-green-600" data-testid="text-correct-count">{correctCount} correct</span>
              <button
                onClick={() => { if (totalAnswered > 0) endSession(); }}
                disabled={totalAnswered === 0 || loading}
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 disabled:opacity-40 flex items-center gap-1"
                data-testid="button-end-session"
              >
                <StopCircle className="w-3.5 h-3.5" /> End Session
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 inline mr-1" /> {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                currentQuestion.difficulty === "hard" ? "bg-red-100 text-red-700" :
                currentQuestion.difficulty === "easy" ? "bg-green-100 text-green-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
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
                      ${!showResult && isSelected ? "border-green-500 bg-green-50" : ""}
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
                <p className="text-sm font-medium text-blue-900 mb-1">{t("allied.pharmtechAdaptivePractice.rationale")}</p>
                <p className="text-sm text-blue-800">{lastResult.rationale}</p>
              </div>
            )}
          </div>

          {!lastResult && (
            <div className="flex justify-end">
              <button
                onClick={submitAnswer}
                disabled={!selectedAnswer || submitting}
                className="px-8 py-2.5 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-40"
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10" data-testid="pharmtech-adaptive-setup">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">{t("allied.pharmtechAdaptivePractice.pharmacyTechnician")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-green-700 font-medium">{t("allied.pharmtechAdaptivePractice.adaptivePractice")}</span>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          Adaptive Learning
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" data-testid="text-adaptive-practice-title">
          Adaptive Practice
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Questions adapt to your performance in real-time. Difficulty increases when you answer correctly
          and decreases when you miss. Practice as long as you want and end when you're ready.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 inline mr-1" /> {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => startSession()}
          disabled={loading}
          className="text-left p-6 rounded-2xl border-2 border-green-200 bg-green-50 hover:border-green-400 hover:shadow-md transition-all disabled:opacity-50"
          data-testid="button-start-practice"
        >
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center mb-3">
            <Play className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{t("allied.pharmtechAdaptivePractice.startAdaptivePractice")}</h3>
          <p className="text-sm text-gray-500">{t("allied.pharmtechAdaptivePractice.beginAContinuousPracticeSession")}</p>
        </button>

        <button
          onClick={() => setView("mastery")}
          className="text-left p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
          data-testid="button-view-mastery"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mb-3">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{t("allied.pharmtechAdaptivePractice.masteryDashboard")}</h3>
          <p className="text-sm text-gray-500">{t("allied.pharmtechAdaptivePractice.viewYourMasteryLevelAcross")}</p>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 w-full"
          data-testid="button-toggle-settings"
        >
          <Settings className="w-4 h-4" />
          Session Settings
          <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${showSettings ? "rotate-90" : ""}`} />
        </button>

        {showSettings && (
          <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("allied.pharmtechAdaptivePractice.startingDifficulty15")}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(d => (
                  <button
                    key={d}
                    onClick={() => setSettings({ ...settings, startDifficulty: d })}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      settings.startDifficulty === d
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    data-testid={`button-difficulty-${d}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {settings.startDifficulty <= 2 ? "Easy" : settings.startDifficulty >= 4 ? "Hard" : "Medium"} starting point
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weak Area Threshold: {settings.weakAreaThreshold}%
              </label>
              <input
                type="range"
                min={40}
                max={90}
                step={5}
                value={settings.weakAreaThreshold}
                onChange={(e) => setSettings({ ...settings, weakAreaThreshold: Number(e.target.value) })}
                className="w-full accent-green-600"
                data-testid="input-weak-threshold"
              />
              <p className="text-xs text-gray-400 mt-1">
                Categories below {settings.weakAreaThreshold}% accuracy will be flagged as weak areas
              </p>
            </div>
          </div>
        )}
      </div>

      {masteryData && masteryData.totalSessions > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" /> Quick Stats
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700" data-testid="text-total-sessions">{masteryData.totalSessions}</div>
              <div className="text-xs text-gray-500">{t("allied.pharmtechAdaptivePractice.sessions")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700" data-testid="text-total-questions">{masteryData.totalQuestionsAnswered}</div>
              <div className="text-xs text-gray-500">{t("allied.pharmtechAdaptivePractice.questions")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700" data-testid="text-overall-accuracy">{masteryData.overallAccuracy}%</div>
              <div className="text-xs text-gray-500">{t("allied.pharmtechAdaptivePractice.accuracy")}</div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center mt-6">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">{t("allied.pharmtechAdaptivePractice.preparingQuestions")}</p>
        </div>
      )}
    </div>
  );
}

function ResultsView({ analytics, onNewSession, onViewMastery }: {
  analytics: Analytics;
  onNewSession: () => void;
  onViewMastery: () => void;
}) {
  const passed = analytics.score >= 70;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-adaptive-results">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("allied.pharmtechAdaptivePractice.sessionResults")}</h1>

      <div className={`rounded-2xl p-8 text-center mb-8 ${passed ? "bg-green-50 border-2 border-green-200" : "bg-amber-50 border-2 border-amber-200"}`}>
        <div className={`text-5xl font-bold mb-2 ${passed ? "text-green-700" : "text-amber-700"}`} data-testid="text-final-score">
          {analytics.score}%
        </div>
        <div className={`text-lg font-medium ${passed ? "text-green-600" : "text-amber-600"}`}>
          {passed ? "Great Performance!" : "Keep Practicing!"}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          {analytics.correctCount} of {analytics.totalAnswered} correct
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.pharmtechAdaptivePractice.categoryBreakdown")}</h2>
      <div className="space-y-3 mb-8">
        {Object.entries(analytics.categoryStats).map(([cat, data]) => {
          const mastery = analytics.masteryLevels[cat];
          const colors = mastery ? MASTERY_COLORS[mastery.level] || MASTERY_COLORS["Beginner"] : MASTERY_COLORS["Beginner"];
          const barColor = mastery ? MASTERY_BAR_COLORS[mastery.level] || "bg-gray-300" : "bg-gray-300";

          return (
            <div key={cat} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`result-category-${cat}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{cat}</span>
                  {mastery && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
                      {mastery.level}
                    </span>
                  )}
                </div>
                <span className={`text-sm font-medium ${data.accuracy >= 70 ? "text-green-600" : "text-red-600"}`}>
                  {data.accuracy}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${data.accuracy}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{data.correct}/{data.total} correct</div>
            </div>
          );
        })}
      </div>

      {analytics.weakAreas.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" /> Weak Areas
          </h2>
          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <ul className="space-y-2">
              {analytics.weakAreas.map(area => (
                <li key={area} className="flex items-center gap-2 text-sm text-red-800">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {analytics.difficultyProgression.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" /> Difficulty Progression
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-end gap-1 h-24">
              {analytics.difficultyProgression.map((dp, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm transition-all ${dp.correct ? "bg-green-400" : "bg-red-300"}`}
                  style={{ height: `${(dp.difficulty / 5) * 100}%` }}
                  title={`Q${i + 1}: Difficulty ${dp.difficulty} - ${dp.correct ? "Correct" : "Incorrect"}`}
                  data-testid={`bar-progression-${i}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{t("allied.pharmtechAdaptivePractice.start")}</span>
              <span>{t("allied.pharmtechAdaptivePractice.end")}</span>
            </div>
          </div>
        </div>
      )}

      {analytics.recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-500" /> Recommended Study Materials
          </h2>
          <div className="space-y-2">
            {analytics.recommendations.map((rec, i) => (
              <Link
                key={i}
                href={rec.path}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all"
                data-testid={`link-recommendation-${i}`}
              >
                {rec.type === "lesson" && <BookOpen className="w-4 h-4 text-green-600 flex-shrink-0" />}
                {rec.type === "flashcard" && <Brain className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                {rec.type === "exam" && <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{rec.title}</div>
                  {rec.category && <div className="text-xs text-gray-400">{rec.category}</div>}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  rec.type === "lesson" ? "bg-green-50 text-green-700" :
                  rec.type === "flashcard" ? "bg-blue-50 text-blue-700" :
                  "bg-purple-50 text-purple-700"
                }`}>
                  {rec.type}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onNewSession}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700"
          data-testid="button-new-session"
        >
          New Practice Session
        </button>
        <button
          onClick={onViewMastery}
          className="flex-1 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-200 hover:bg-blue-100"
          data-testid="button-view-mastery-results"
        >
          View Mastery Dashboard
        </button>
      </div>
    </div>
  );
}

function MasteryDashboard({ masteryData, onBack }: {
  masteryData: MasteryData | null;
  onBack: () => void;
}) {
  if (!masteryData || Object.keys(masteryData.mastery).length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center" data-testid="pharmtech-mastery-dashboard">
        <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.pharmtechAdaptivePractice.masteryDashboard2")}</h1>
        <p className="text-gray-500 mb-6">{t("allied.pharmtechAdaptivePractice.completeAdaptivePracticeSessionsTo")}</p>
        <button onClick={onBack} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700" data-testid="button-back-setup">
          Start Practicing
        </button>
      </div>
    );
  }

  const masteryEntries = Object.entries(masteryData.mastery).sort((a, b) => b[1].accuracy - a[1].accuracy);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-mastery-dashboard">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("allied.pharmtechAdaptivePractice.masteryDashboard3")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("allied.pharmtechAdaptivePractice.trackYourProgressAcrossAll")}</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200" data-testid="button-back-setup-mastery">
          Back
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{masteryData.totalSessions}</div>
          <div className="text-xs text-gray-500">{t("allied.pharmtechAdaptivePractice.sessions2")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{masteryData.totalQuestionsAnswered}</div>
          <div className="text-xs text-gray-500">{t("allied.pharmtechAdaptivePractice.questions2")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-700">{masteryData.overallAccuracy}%</div>
          <div className="text-xs text-gray-500">{t("allied.pharmtechAdaptivePractice.accuracy2")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{masteryData.weakAreas.length}</div>
          <div className="text-xs text-gray-500">{t("allied.pharmtechAdaptivePractice.weakAreas")}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <span className="text-sm font-medium text-gray-500">{t("allied.pharmtechAdaptivePractice.masteryLevels")}</span>
        {["Advanced", "Proficient", "Developing", "Beginner"].map(level => {
          const colors = MASTERY_COLORS[level];
          return (
            <span key={level} className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
              {level}
            </span>
          );
        })}
      </div>

      <div className="space-y-3">
        {masteryEntries.map(([cat, data]) => {
          const colors = MASTERY_COLORS[data.level] || MASTERY_COLORS["Beginner"];
          const barColor = MASTERY_BAR_COLORS[data.level] || "bg-gray-300";

          return (
            <div key={cat} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`mastery-category-${cat}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{cat}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
                    {data.level}
                  </span>
                </div>
                <span className={`text-sm font-bold ${data.accuracy >= 70 ? "text-green-600" : data.accuracy >= 50 ? "text-amber-600" : "text-red-600"}`}>
                  {data.accuracy}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all ${barColor}`} style={{ width: `${data.accuracy}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1.5">
                {data.correct}/{data.total} correct
              </div>
            </div>
          );
        })}
      </div>

      {masteryData.weakAreas.length > 0 && (
        <div className="mt-8 bg-red-50 rounded-xl border border-red-200 p-4">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" /> Focus Areas
          </h3>
          <ul className="space-y-2">
            {masteryData.weakAreas.map(area => (
              <li key={area} className="flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                {area} — needs more practice
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
