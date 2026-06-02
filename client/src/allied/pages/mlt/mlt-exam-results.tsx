import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Trophy, TrendingUp, AlertTriangle, CheckCircle, XCircle, BarChart3, Target, ArrowRight, Microscope, BookOpen } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface ExamReport {
  sessionId: string;
  mode: string;
  country: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  timeSpent: number;
  abilityEstimate: number;
  passed: boolean;
  categoryBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  difficultyProgression: { index: number; difficulty: string; correct: boolean; ability: number }[];
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
  abilityBand?: string;
}

export default function MltExamResults() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const { sessionId } = useParams();
  const [report, setReport] = useState<ExamReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  async function loadResults() {
    try {
      const res = await fetch(`/api/mlt/exam/${sessionId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.session.report) {
        setReport(data.session.report);
      } else {
        const completeRes = await fetch(`/api/mlt/exam/${sessionId}/complete`, { method: "POST" });
        const completeData = await completeRes.json();
        if (completeRes.ok) {
          setReport(completeData.report);
        }
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">{t("allied.mltMltExamResults.loadingResults")}</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t("allied.mltMltExamResults.resultsUnavailable")}</h2>
        <p className="text-gray-600 mb-4">{error || "No results found for this session."}</p>
        <button onClick={() => setLocation("/allied-health/mlt/exams")} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700" data-testid="button-back-to-hub-results">
          Back to Exam Hub
        </button>
      </div>
    );
  }

  const modeLabels: Record<string, string> = {
    canada_realistic: "CSMLS Exam",
    usa_cat: "ASCP CAT Exam",
    adaptive_practice: "Adaptive Practice",
    practice_exam: "Practice Exam",
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const categories = Object.entries(report.categoryBreakdown).sort((a, b) => a[1].percentage - b[1].percentage);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className={`rounded-3xl p-8 mb-8 text-center ${report.passed ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200" : "bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200"}`}>
        <div className="mb-4">
          {report.passed ? (
            <Trophy className="w-16 h-16 text-green-500 mx-auto" />
          ) : (
            <Target className="w-16 h-16 text-orange-500 mx-auto" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-result-title">
          {modeLabels[report.mode] || report.mode} Results
        </h1>
        <p className="text-gray-600 mb-4">
          {report.country === "CA" ? "🇨🇦 Canada" : "🇺🇸 USA"} · {formatTime(report.timeSpent)}
        </p>

        <div className="flex items-center justify-center gap-8">
          <div>
            <p className="text-5xl font-black text-gray-900" data-testid="text-result-score">{report.score}%</p>
            <p className="text-sm text-gray-500">{t("allied.mltMltExamResults.overallScore")}</p>
          </div>
          <div className="h-16 w-px bg-gray-200" />
          <div>
            <p className="text-3xl font-bold text-gray-900">{report.correctCount}/{report.totalQuestions}</p>
            <p className="text-sm text-gray-500">{t("allied.mltMltExamResults.correct")}</p>
          </div>
          {report.abilityBand && (
            <>
              <div className="h-16 w-px bg-gray-200" />
              <div>
                <p className="text-lg font-bold text-gray-900" data-testid="text-ability-band">{report.abilityBand}</p>
                <p className="text-sm text-gray-500">{t("allied.mltMltExamResults.abilityBand")}</p>
              </div>
            </>
          )}
        </div>

        {report.passed ? (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Passing Score Achieved
          </div>
        ) : (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" /> Below Passing Threshold
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {categories.map(([cat, stats]) => (
              <div key={cat} data-testid={`category-${cat}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{cat}</span>
                  <span className="text-sm font-bold text-gray-900">{stats.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${stats.percentage >= 70 ? "bg-green-500" : stats.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{stats.correct} / {stats.total} correct</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {report.weakAreas.length > 0 && (
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Weak Areas
              </h3>
              <div className="space-y-2">
                {report.weakAreas.map((area) => (
                  <div key={area} className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl text-sm text-red-800" data-testid={`weak-area-${area}`}>
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {area}
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.strongAreas.length > 0 && (
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Strong Areas
              </h3>
              <div className="space-y-2">
                {report.strongAreas.map((area) => (
                  <div key={area} className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl text-sm text-green-800" data-testid={`strong-area-${area}`}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {area}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {report.mode === "usa_cat" && report.difficultyProgression.length > 0 && (
        <div className="bg-white rounded-2xl border p-6 shadow-sm mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Difficulty Progression
          </h3>
          <div className="flex items-end gap-1 h-40">
            {report.difficultyProgression.map((p, i) => {
              const height = ((p.ability + 3) / 6) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end" title={`Q${i + 1}: ${p.difficulty} - ${p.correct ? "Correct" : "Incorrect"}`}>
                  <div
                    className={`w-full rounded-t ${p.correct ? "bg-green-400" : "bg-red-400"}`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Q1</span>
            <span>Q{report.difficultyProgression.length}</span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded" /> {t("allied.mltMltExamResults.correct2")}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded" /> {t("allied.mltMltExamResults.incorrect")}</span>
          </div>
        </div>
      )}

      {report.recommendations.length > 0 && (
        <div className="bg-white rounded-2xl border p-6 shadow-sm mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Recommended Next Steps
          </h3>
          <div className="space-y-3">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-teal-50 rounded-xl" data-testid={`recommendation-${i}`}>
                <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-teal-800">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setLocation("/allied-health/mlt/exams")}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200"
          data-testid="button-back-to-hub-from-results"
        >
          Back to Exam Hub
        </button>
        <button
          onClick={() => {
            if (report.mode === "usa_cat") setLocation("/allied-health/mlt/exam/usa_cat?country=US");
            else if (report.mode === "canada_realistic") setLocation("/allied-health/mlt/exam/canada_realistic?country=CA");
            else setLocation("/allied-health/mlt/exams");
          }}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700"
          data-testid="button-retake-exam"
        >
          Take Another Exam
        </button>
      </div>
    </div>
  );
}
