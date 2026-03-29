import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, CheckCircle2, XCircle, Clock, TrendingUp, Target,
  ArrowRight, ChevronDown, ChevronUp, Award, AlertTriangle, Zap, Brain, RotateCcw
} from "lucide-react";

interface DomainScore {
  correct: number;
  total: number;
}

interface MissedQuestion {
  id: string;
  stem: string;
  category: string;
  correctIndex: number;
  selectedIndex: number;
  rationale: string;
  options: string[];
}

interface Report {
  scorePercent: number;
  passed: boolean;
  passingScore: number;
  totalQuestions: number;
  correctCount: number;
  domainScores: Record<string, DomainScore>;
  missedQuestions: MissedQuestion[];
  avgTimePerQuestion: number;
  totalTimeSeconds: number;
  abilityEstimate?: number;
  drillStreak?: number;
}

interface HistoryItem {
  id: string;
  mode: string;
  examType: string;
  totalQuestions: number;
  score: number | null;
  correctCount: number | null;
  status: string;
  drillTopic: string | null;
  startedAt: string;
  completedAt: string | null;
}

export default function ParamedicExamResults() {
  const { t } = useI18n();
  const params = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [session, setSession] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMissed, setExpandedMissed] = useState<Set<string>>(new Set());
  const [showAllMissed, setShowAllMissed] = useState(false);

  useEffect(() => {
    if (!params.sessionId || !user) return;
    loadResults();
  }, [params.sessionId, user]);

  async function loadResults() {
    try {
      const [resSession, resHistory] = await Promise.all([
        apiRequest("GET", `/api/paramedic/exam-sessions/${params.sessionId}/results`),
        apiRequest("GET", `/api/paramedic/exam-history`),
      ]);
      const sessionData = await resSession.json();
      const historyData = await resHistory.json();
      setSession(sessionData);
      setHistory(historyData);
    } catch (e: any) {
      console.error("Load results error:", e);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="results-login-required">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("allied.paramedicParamedicExamResults.signInRequired")}</h2>
          <a href="/login" className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold">{t("allied.paramedicParamedicExamResults.signIn")}</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="results-loading">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">{t("allied.paramedicParamedicExamResults.loadingResults")}</p>
        </div>
      </div>
    );
  }

  if (!session?.report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="results-not-found">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("allied.paramedicParamedicExamResults.resultsNotAvailable")}</h2>
          <p className="text-gray-600 mb-6">{t("allied.paramedicParamedicExamResults.thisExamMayNotHave")}</p>
          <Link href="/allied-health/paramedic/practice-exams" className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold" data-testid="link-back-exams">
            Back to Practice Exams
          </Link>
        </div>
      </div>
    );
  }

  const report: Report = session.report;
  const modeLabel = { practice: "Practice", exam: "Exam", adaptive: "Adaptive", drill: "Drill" }[session.mode] || session.mode;
  const examLabel = { nremt: "NREMT Paramedic", "copr-pcp": "COPR PCP", "copr-acp": "COPR ACP" }[session.examType] || session.examType;

  const domainEntries = Object.entries(report.domainScores).sort(
    ([, a], [, b]) => (a.total > 0 ? a.correct / a.total : 0) - (b.total > 0 ? b.correct / b.total : 0)
  );

  const missedToShow = showAllMissed ? report.missedQuestions : report.missedQuestions.slice(0, 5);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const previousAttempts = history.filter(
    h => h.id !== session.id && h.examType === session.examType && h.mode === session.mode && h.status === "completed"
  );

  return (
    <div className="min-h-screen bg-gray-50" data-testid="paramedic-exam-results">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/allied-health/paramedic" className="hover:text-teal-600" data-testid="breadcrumb-paramedic">{t("allied.paramedicParamedicExamResults.paramedic")}</Link>
            <ArrowRight className="w-3 h-3" />
            <Link href="/allied-health/paramedic/practice-exams" className="hover:text-teal-600" data-testid="breadcrumb-practice-exams">{t("allied.paramedicParamedicExamResults.practiceExams")}</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-teal-700 font-medium">{t("allied.paramedicParamedicExamResults.results")}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${report.passed ? "bg-green-100" : "bg-amber-100"}`}>
              {report.passed ? (
                <Award className="w-10 h-10 text-green-600" />
              ) : (
                <Target className="w-10 h-10 text-amber-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-results-title">
                {modeLabel} Mode — {examLabel}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Completed {session.completedAt ? new Date(session.completedAt).toLocaleDateString() : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-2xl border p-6 ${report.passed ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`} data-testid="card-score">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{t("allied.paramedicParamedicExamResults.overallScore")}</div>
            <div className={`text-4xl font-bold ${report.passed ? "text-green-700" : "text-amber-700"}`}>{report.scorePercent}%</div>
            <div className={`text-sm font-medium mt-1 ${report.passed ? "text-green-600" : "text-amber-600"}`}>
              {report.passed ? "PASS" : "NEEDS IMPROVEMENT"} (≥{report.passingScore}% to pass)
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-correct">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{t("allied.paramedicParamedicExamResults.questionsCorrect")}</div>
            <div className="text-4xl font-bold text-gray-900">{report.correctCount}/{report.totalQuestions}</div>
            <div className="text-sm text-gray-500 mt-1">{report.missedQuestions.length} missed</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-time">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{t("allied.paramedicParamedicExamResults.timeStats")}</div>
            <div className="text-4xl font-bold text-gray-900">{formatTime(report.totalTimeSeconds)}</div>
            <div className="text-sm text-gray-500 mt-1">Avg: {report.avgTimePerQuestion}s/question</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="card-mode-specific">
            {session.mode === "adaptive" && report.abilityEstimate !== undefined && (
              <>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{t("allied.paramedicParamedicExamResults.abilityEstimate")}</div>
                <div className="text-4xl font-bold text-blue-700 flex items-center gap-2">
                  <Brain className="w-8 h-8" />
                  {report.abilityEstimate > 0 ? "+" : ""}{report.abilityEstimate.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 mt-1">{t("allied.paramedicParamedicExamResults.adaptiveScoring")}</div>
              </>
            )}
            {session.mode === "drill" && report.drillStreak !== undefined && (
              <>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{t("allied.paramedicParamedicExamResults.bestStreak")}</div>
                <div className="text-4xl font-bold text-purple-700 flex items-center gap-2">
                  <Zap className="w-8 h-8" />
                  {report.drillStreak}
                </div>
                <div className="text-sm text-gray-500 mt-1">{t("allied.paramedicParamedicExamResults.consecutiveCorrect")}</div>
              </>
            )}
            {(session.mode === "practice" || session.mode === "exam") && (
              <>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{t("allied.paramedicParamedicExamResults.prediction")}</div>
                <div className={`text-2xl font-bold ${report.passed ? "text-green-700" : "text-amber-700"}`}>
                  {report.passed ? "Likely to Pass" : "More Study Needed"}
                </div>
                <div className="text-sm text-gray-500 mt-1">{t("allied.paramedicParamedicExamResults.basedOnDomainAnalysis")}</div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="section-domain-breakdown">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-500" />
            Domain-Level Breakdown
          </h2>
          <div className="space-y-4">
            {domainEntries.map(([domain, scores]) => {
              const pct = scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;
              const isWeak = pct < 60;
              return (
                <div key={domain} data-testid={`domain-${domain.toLowerCase().replace(/[\s\/]+/g, "-")}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{domain}</span>
                    <span className={`text-sm font-semibold ${isWeak ? "text-red-600" : pct >= 80 ? "text-green-600" : "text-gray-700"}`}>
                      {pct}% ({scores.correct}/{scores.total})
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${isWeak ? "bg-red-400" : pct >= 80 ? "bg-green-500" : "bg-teal-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {report.missedQuestions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="section-missed-questions">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Missed Questions ({report.missedQuestions.length})
            </h2>
            <div className="space-y-3">
              {missedToShow.map((mq) => {
                const isExpanded = expandedMissed.has(mq.id);
                return (
                  <div key={mq.id} className="border border-gray-100 rounded-xl overflow-hidden" data-testid={`missed-${mq.id}`}>
                    <button
                      onClick={() => {
                        const next = new Set(expandedMissed);
                        if (isExpanded) next.delete(mq.id); else next.add(mq.id);
                        setExpandedMissed(next);
                      }}
                      className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 line-clamp-2">{mq.stem}</p>
                        <span className="text-xs text-gray-400 mt-1">{mq.category}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
                        {mq.options.map((opt, i) => (
                          <div key={i} className={`text-sm px-3 py-2 rounded-lg ${
                            i === mq.correctIndex ? "bg-green-50 text-green-700 font-medium" :
                            i === mq.selectedIndex ? "bg-red-50 text-red-600" :
                            "text-gray-500"
                          }`}>
                            <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                            {i === mq.correctIndex && <CheckCircle2 className="w-3.5 h-3.5 inline ml-1.5 text-green-500" />}
                            {i === mq.selectedIndex && i !== mq.correctIndex && <XCircle className="w-3.5 h-3.5 inline ml-1.5 text-red-400" />}
                          </div>
                        ))}
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">{mq.rationale}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {report.missedQuestions.length > 5 && (
              <button
                onClick={() => setShowAllMissed(!showAllMissed)}
                className="mt-4 text-sm text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1"
                data-testid="button-show-all-missed"
              >
                {showAllMissed ? "Show Less" : `Show All ${report.missedQuestions.length} Missed Questions`}
                {showAllMissed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}

        {previousAttempts.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="section-attempt-history">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Previous Attempts
            </h2>
            <div className="space-y-2">
              {previousAttempts.slice(0, 10).map((attempt) => (
                <Link
                  key={attempt.id}
                  href={`/allied-health/paramedic/exam-results/${attempt.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                  data-testid={`history-${attempt.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      (attempt.score || 0) >= 70 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {attempt.score || 0}%
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {attempt.correctCount}/{attempt.totalQuestions} correct
                      </p>
                      <p className="text-xs text-gray-400">
                        {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/allied-health/paramedic/practice-exams"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
            data-testid="button-take-another"
          >
            <RotateCcw className="w-4 h-4" /> Take Another Exam
          </Link>
          <Link
            href="/allied-health/paramedic"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            data-testid="button-back-hub"
          >
            Back to Paramedic Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
