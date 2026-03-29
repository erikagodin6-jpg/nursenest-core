// Demo screenshot component - NOT real learner data.
// This is a marketing-only visual for hero page screenshots.
// All data is hardcoded and does not connect to any live student records.

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Minus, Target, Brain, Clock, Flame,
  BookOpen, GraduationCap, Award, ChevronRight, Sparkles,
  Shield, Zap, BarChart3, ArrowRight, CheckCircle2, AlertTriangle,
  Star, Activity, Calendar, Eye,
} from "lucide-react";
import { demoProfiles, type DemoProfile } from "@/data/demo-adaptive-profiles";

import { useI18n } from "@/lib/i18n";
const statusColor = (status: string) => {
  switch (status) {
    case "Strong": case "Mastered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Improving": return "bg-sky-50 text-sky-700 border-sky-100";
    case "Stable": return "bg-slate-50 text-slate-600 border-slate-100";
    case "Moderate": return "bg-amber-50 text-amber-700 border-amber-100";
    case "Needs Review": case "Focus Area": return "bg-rose-50 text-rose-600 border-rose-100";
    default: return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

const statusBarColor = (score: number) => {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 70) return "bg-sky-400";
  if (score >= 65) return "bg-amber-400";
  return "bg-rose-400";
};

const confidenceColor = (conf: string) => {
  if (conf === "High") return "text-emerald-600 bg-emerald-50";
  if (conf === "Moderate" || conf === "Improving") return "text-sky-600 bg-sky-50";
  if (conf === "Developing") return "text-amber-600 bg-amber-50";
  return "text-rose-600 bg-rose-50";
};

const priorityStyle = (p: string) => {
  if (p === "High Priority") return { bg: "bg-rose-50 border-rose-100", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />, dot: "bg-rose-400" };
  if (p === "Quick Win") return { bg: "bg-emerald-50 border-emerald-100", icon: <Zap className="w-3.5 h-3.5 text-emerald-500" />, dot: "bg-emerald-400" };
  return { bg: "bg-amber-50 border-amber-100", icon: <Target className="w-3.5 h-3.5 text-amber-500" />, dot: "bg-amber-400" };
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-rose-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
};

function ReadinessGauge({ score }: { score: number }) {
  const { t } = useI18n();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const gradientId = "readiness-gradient";

  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f0fb" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-800">{score}%</span>
        <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">{t("pages.demoAdaptiveReport.readiness")}</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium leading-tight">{label}</p>
        <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ActivityHeatmap({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="grid grid-cols-7 gap-1">
      {data.map((v, i) => {
        const intensity = v / max;
        const bg = intensity > 0.8 ? "bg-violet-500" : intensity > 0.6 ? "bg-violet-400" : intensity > 0.4 ? "bg-violet-300" : intensity > 0.2 ? "bg-violet-200" : "bg-violet-100";
        return (
          <div
            key={i}
            className={cn("w-full aspect-square rounded-[3px]", bg)}
            title={`${v} questions`}
          />
        );
      })}
    </div>
  );
}

export default function DemoAdaptiveReport() {
  const { user, isAdmin } = useAuth();
  const [profileIndex, setProfileIndex] = useState(0);
  const [screenshotMode, setScreenshotMode] = useState(true);
  const p = demoProfiles[profileIndex];

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FCFAFF" }}>
        <p className="text-slate-500">{t("pages.demoAdaptiveReport.adminAccessRequired")}</p>
      </div>
    );
  }

  const chartData = p.growthTrend.map((v, i) => ({ week: `W${i + 1}`, score: v }));

  const matrixData = p.confidenceMatrix.map((c) => ({
    ...c,
    quadrant:
      c.confidence >= 65 && c.performance >= 70 ? "mastered" :
      c.confidence >= 65 && c.performance < 70 ? "overconfident" :
      c.confidence < 65 && c.performance >= 70 ? "underconfident" :
      "struggling",
  }));

  const matrixColors: Record<string, string> = {
    mastered: "#6ee7b7",
    underconfident: "#93c5fd",
    overconfident: "#fbbf24",
    struggling: "#fca5a5",
  };

  return (
    <div className="min-h-screen" style={{ background: "#FCFAFF", fontFamily: "'DM Sans', sans-serif" }}>
      {!screenshotMode && <Navigation />}

      {!screenshotMode && (
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-medium text-violet-600">{t("pages.demoAdaptiveReport.demoScreenshotMode")}</span>
            <button
              onClick={() => setScreenshotMode(!screenshotMode)}
              className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", screenshotMode ? "bg-violet-500" : "bg-slate-300")}
            >
              <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm", screenshotMode ? "translate-x-4" : "translate-x-1")} />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            {demoProfiles.map((dp, i) => (
              <button
                key={dp.id}
                onClick={() => setProfileIndex(i)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                  i === profileIndex ? "bg-violet-100 text-violet-700" : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                )}
              >
                {dp.initials} - {dp.track.split(" / ")[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className={cn("max-w-7xl mx-auto px-6", screenshotMode ? "pt-10 pb-16" : "pt-4 pb-16")}>

        <header className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-violet-200/50">
                {p.initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t("pages.demoAdaptiveReport.adaptivePerformanceReport")}</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {p.name} &middot; {p.track} &middot; {p.studyWindow}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" /> On Track
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100">
                <Brain className="w-3.5 h-3.5" /> Adaptive Plan Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100">
                <Activity className="w-3.5 h-3.5" /> High Engagement
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 max-w-2xl">
            Personalized mastery insights generated from adaptive practice activity. Target exam: {p.examDate}.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 lg:col-span-4">
            <Card className="border-0 shadow-md bg-white rounded-2xl h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                <ReadinessGauge score={p.readinessScore} />
                <h3 className="text-sm font-semibold text-slate-700 mt-4 mb-1">{t("pages.demoAdaptiveReport.examReadiness")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                  Above average progress. Continue focusing on pharmacology and prioritization questions to improve predicted pass outcome.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon={<Target className="w-4.5 h-4.5" />} label={t("pages.demoAdaptiveReport.passProbability")} value={`${p.predictedPassProbability}%`} sub="Based on adaptive trends" />
              <StatCard icon={<Brain className="w-4.5 h-4.5" />} label={t("pages.demoAdaptiveReport.difficultyLevel")} value={`${p.adaptiveDifficultyLevel} / 10`} sub="Adaptive scaling" />
              <StatCard icon={<Flame className="w-4.5 h-4.5" />} label={t("pages.demoAdaptiveReport.studyStreak")} value={`${p.studyStreak} days`} sub="Consecutive" />
              <StatCard icon={<BarChart3 className="w-4.5 h-4.5" />} label={t("pages.demoAdaptiveReport.questionsDone")} value={p.questionsCompleted.toLocaleString()} sub={`${p.overallAccuracy}% accuracy`} />
              <StatCard icon={<Clock className="w-4.5 h-4.5" />} label={t("pages.demoAdaptiveReport.timeStudied")} value={`${p.totalStudyHours}h`} sub={p.studyBehaviour.averageSessionLength + " avg"} />
              <StatCard icon={<BookOpen className="w-4.5 h-4.5" />} label={t("pages.demoAdaptiveReport.flashcards")} value={p.flashcardsReviewed.toLocaleString()} sub={`${p.lessonsCompleted} lessons`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 lg:col-span-8">
            <Card className="border-0 shadow-md bg-white rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoAdaptiveReport.adaptiveGrowthTrend")}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{t("pages.demoAdaptiveReport.readinessScoreProgressionOver8")}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" /> +{p.growthTrend[p.growthTrend.length - 1] - p.growthTrend[0]}pts
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                      formatter={(v: number) => [`${v}%`, "Readiness"]}
                    />
                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: "#7c3aed" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Card className="border-0 shadow-md bg-white rounded-2xl h-full">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">{t("pages.demoAdaptiveReport.studyActivity")}</h3>
                <p className="text-xs text-slate-400 mb-4">{t("pages.demoAdaptiveReport.last28Days")}</p>
                <ActivityHeatmap data={p.weeklyActivity} />
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{p.studyBehaviour.dailyAverageQuestions}</p>
                    <p className="text-[10px] text-slate-400">{t("pages.demoAdaptiveReport.avgDailyQuestions")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{p.studyBehaviour.weeklyConsistency}%</p>
                    <p className="text-[10px] text-slate-400">{t("pages.demoAdaptiveReport.weeklyConsistency")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{p.studyBehaviour.averageSessionLength}</p>
                    <p className="text-[10px] text-slate-400">{t("pages.demoAdaptiveReport.avgSession")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{p.studyBehaviour.reviewCompletionRate}%</p>
                    <p className="text-[10px] text-slate-400">{t("pages.demoAdaptiveReport.reviewCompletion")}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-violet-400" />
                  <span>Peak: {p.studyBehaviour.peakStudyWindow}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-6">
          <Card className="border-0 shadow-md bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoAdaptiveReport.categoryPerformance")}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{t("pages.demoAdaptiveReport.masteryLevelByContentDomain")}</p>
                </div>
              </div>
              <div className="space-y-3">
                {p.categoryBreakdown.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-[180px] flex-shrink-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{cat.name}</p>
                      <p className="text-[10px] text-slate-400">{cat.questions} questions</p>
                    </div>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", statusBarColor(cat.score))}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-semibold text-slate-700">{cat.score}%</span>
                    <span className={cn("flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border", statusColor(cat.status))}>
                      {cat.status}
                    </span>
                    <TrendIcon trend={cat.trend} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 md:col-span-6">
            <Card className="border-0 shadow-md bg-white rounded-2xl h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoAdaptiveReport.topStrengths")}</h3>
                </div>
                <div className="space-y-2.5">
                  {p.strongestAreas.map((area, i) => (
                    <div key={area} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                      <span className="text-sm text-slate-700 font-medium">{area}</span>
                      <span className="ml-auto text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">{t("pages.demoAdaptiveReport.confident")}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-6">
            <Card className="border-0 shadow-md bg-white rounded-2xl h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoAdaptiveReport.topFocusAreas")}</h3>
                </div>
                <div className="space-y-2.5">
                  {p.weakestAreas.map((area, i) => (
                    <div key={area} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-rose-50/50 border border-rose-100/60">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                      <span className="text-sm text-slate-700 font-medium">{area}</span>
                      <span className="ml-auto text-[10px] font-semibold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">{t("pages.demoAdaptiveReport.review")}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 lg:col-span-7">
            <Card className="border-0 shadow-md bg-white rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">{t("pages.demoAdaptiveReport.questionTypePerformance")}</h3>
                <p className="text-xs text-slate-400 mb-4">{t("pages.demoAdaptiveReport.accuracyAndConfidenceByQuestion")}</p>
                <div className="space-y-2.5">
                  {p.questionTypePerformance.map((qt) => (
                    <div key={qt.type} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50/50 transition-colors">
                      <span className="w-[140px] text-sm font-medium text-slate-700 truncate">{qt.type}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", statusBarColor(qt.score))} style={{ width: `${qt.score}%` }} />
                      </div>
                      <span className="w-10 text-right text-sm font-semibold text-slate-700">{qt.score}%</span>
                      <span className="text-[10px] text-slate-400 w-16 text-right">{qt.attempts} tries</span>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", confidenceColor(qt.confidence))}>
                        {qt.confidence}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <Card className="border-0 shadow-md bg-white rounded-2xl h-full">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">{t("pages.demoAdaptiveReport.confidenceVsPerformance")}</h3>
                <p className="text-xs text-slate-400 mb-3">{t("pages.demoAdaptiveReport.masteryQuadrantAnalysis")}</p>
                <ResponsiveContainer width="100%" height={210}>
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      type="number" dataKey="confidence" name="Confidence" unit="%"
                      tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                      domain={[35, 95]} label={{ value: "Confidence", position: "bottom", fontSize: 10, fill: "#94a3b8", offset: -2 }}
                    />
                    <YAxis
                      type="number" dataKey="performance" name="Performance" unit="%"
                      tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                      domain={[50, 90]} label={{ value: "Performance", angle: -90, position: "insideLeft", fontSize: 10, fill: "#94a3b8", offset: 15 }}
                    />
                    <Tooltip
                      contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                      formatter={(v: number, name: string) => [`${v}%`, name]}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.category || ""}
                    />
                    <Scatter data={matrixData} fill="#8b5cf6">
                      {matrixData.map((entry, i) => (
                        <Cell key={i} fill={matrixColors[entry.quadrant]} r={6} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2 h-2 rounded-full bg-[#6ee7b7]" /> {t("pages.demoAdaptiveReport.mastered")}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2 h-2 rounded-full bg-[#93c5fd]" /> {t("pages.demoAdaptiveReport.underconfident")}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2 h-2 rounded-full bg-[#fbbf24]" /> {t("pages.demoAdaptiveReport.overconfident")}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2 h-2 rounded-full bg-[#fca5a5]" /> {t("pages.demoAdaptiveReport.focusNeeded")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-6">
          <Card className="border-0 shadow-md bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoAdaptiveReport.nextBestActions")}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{t("pages.demoAdaptiveReport.personalizedRecommendationsBasedOnYour")}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {p.recommendations.map((rec, i) => {
                  const ps = priorityStyle(rec.priority);
                  return (
                    <div key={i} className={cn("flex items-start gap-3 px-4 py-3.5 rounded-xl border", ps.bg)}>
                      {ps.icon}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-700 font-medium leading-snug">{rec.label}</p>
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-slate-500">
                          <span className={cn("w-1.5 h-1.5 rounded-full", ps.dot)} />
                          {rec.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-violet-50 via-white to-indigo-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-200/50">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t("pages.demoAdaptiveReport.recommendedMilestone")}</p>
                  <p className="text-xs text-slate-500">Reach {Math.min(p.readinessScore + 4, 95)}% readiness before full CAT simulation</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 h-9 gap-1.5 shadow-md shadow-violet-200/40">
                  <Zap className="w-3.5 h-3.5" /> Start Adaptive Session
                </Button>
                <Button variant="outline" className="rounded-xl text-xs font-semibold px-4 h-9 gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50">
                  <Target className="w-3.5 h-3.5" /> Review Weak Areas
                </Button>
                <Button variant="outline" className="rounded-xl text-xs font-semibold px-4 h-9 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50">
                  <BookOpen className="w-3.5 h-3.5" /> Generate Study Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
