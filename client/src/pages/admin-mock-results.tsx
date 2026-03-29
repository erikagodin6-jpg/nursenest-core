// Admin Mock Results - NOT real learner data.
// Hardcoded demo profiles for marketing screenshots only.

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  DemoPageWrapper, DemoHeader, SectionCard, SectionTitle,
  StatCard, ProgressRing, MasteryBar, PriorityBadge,
} from "@/components/demo-shared";
import { mockResultProfiles, type MockResultProfile } from "@/data/mock-results-profiles";
import { useI18n } from "@/lib/i18n";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import {
  CheckCircle2, XCircle, MinusCircle, Award, Clock, Target,
  Flame, BookOpen, Brain, TrendingUp, Star, Zap, AlertTriangle,
  Eye, EyeOff, Maximize2, Minimize2, Palette, FileText,
  Activity, GraduationCap, ArrowRight, BarChart3, Sparkles,
} from "lucide-react";

function PassFailBadge({ passed }: { passed: boolean }) {
  const { t } = useI18n();
  return passed ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200" data-testid="badge-pass-fail">
      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200" data-testid="badge-pass-fail">
      <XCircle className="w-3.5 h-3.5" /> NEEDS IMPROVEMENT
    </span>
  );
}

function ScoreGauge({ score, size = 120 }: { score: number; size?: number }) {
  const color = score >= 80 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444";
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f0fb" strokeWidth={10} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">{score}%</span>
        <span className="text-[9px] text-slate-400 font-medium">SCORE</span>
      </div>
    </div>
  );
}

function TestResultSummary({ profile }: { profile: MockResultProfile }) {
  return (
    <SectionCard className="mb-6" data-testid="section-test-result-summary">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-1" data-testid="text-exam-title">{profile.examTitle}</h2>
              <p className="text-xs text-slate-400">{profile.examMode} · {profile.difficultyLabel} · {profile.categoryTier}</p>
            </div>
            <PassFailBadge passed={profile.passed} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-emerald-50/60 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] text-slate-500 font-medium">{t("pages.adminMockResults.correct")}</span>
              </div>
              <p className="text-xl font-bold text-emerald-700" data-testid="text-correct-count">{profile.correct}</p>
            </div>
            <div className="bg-rose-50/60 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] text-slate-500 font-medium">{t("pages.adminMockResults.incorrect")}</span>
              </div>
              <p className="text-xl font-bold text-rose-700" data-testid="text-incorrect-count">{profile.incorrect}</p>
            </div>
            <div className="bg-slate-50/60 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MinusCircle className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] text-slate-500 font-medium">{t("pages.adminMockResults.skipped")}</span>
              </div>
              <p className="text-xl font-bold text-slate-600" data-testid="text-skipped-count">{profile.skipped}</p>
            </div>
            <div className="bg-violet-50/60 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-[10px] text-slate-500 font-medium">{t("pages.adminMockResults.timeUsed")}</span>
              </div>
              <p className="text-xl font-bold text-violet-700" data-testid="text-time-used">{profile.timeUsed}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm">
              <Target className="w-5 h-5 text-violet-500" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">{t("pages.adminMockResults.percentile")}</p>
                <p className="text-lg font-bold text-slate-800" data-testid="text-percentile">{profile.percentile}th</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm">
              <Zap className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">{t("pages.adminMockResults.readinessScore")}</p>
                <p className="text-lg font-bold text-slate-800" data-testid="text-readiness-score">{profile.readinessScore}%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {profile.badges.map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-semibold border border-violet-100" data-testid={`badge-${badge.toLowerCase().replace(/\s+/g, "-")}`}>
                <Award className="w-2.5 h-2.5" /> {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center lg:border-l lg:border-slate-100 lg:pl-6">
          <ScoreGauge score={profile.score} />
          <p className="text-xs text-slate-400 mt-2">{profile.totalQuestions} questions</p>
        </div>
      </div>
    </SectionCard>
  );
}

function ReportCard({ profile }: { profile: MockResultProfile }) {
  return (
    <SectionCard className="mb-6" data-testid="section-report-card">
      <SectionTitle title={t("pages.adminMockResults.reportCard")} subtitle={t("pages.admin_mock_results.competencyBreakdownByDomain")} right={
        <span className="text-[10px] text-slate-400">Exam ID: {profile.examId}</span>
      } />

      <div className="flex flex-wrap gap-4 mb-5 text-xs text-slate-500">
        <div><span className="font-semibold text-slate-700">{t("pages.adminMockResults.student")}</span> {profile.name}</div>
        <div><span className="font-semibold text-slate-700">{t("pages.adminMockResults.track")}</span> {profile.track}</div>
        <div><span className="font-semibold text-slate-700">{t("pages.adminMockResults.examDate")}</span> {profile.examDate}</div>
        <div><span className="font-semibold text-slate-700">{t("pages.adminMockResults.readiness")}</span> {profile.readinessScore}%</div>
        <div><span className="font-semibold text-slate-700">{t("pages.adminMockResults.percentile2")}</span> {profile.percentile}th</div>
      </div>

      <div className="overflow-x-auto mb-5">
        <table className="w-full text-sm" data-testid="table-domain-breakdown">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t("pages.adminMockResults.domain")}</th>
              <th className="text-center py-2.5 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t("pages.adminMockResults.correct2")}</th>
              <th className="text-center py-2.5 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t("pages.adminMockResults.avgTime")}</th>
              <th className="text-center py-2.5 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t("pages.adminMockResults.benchmark")}</th>
              <th className="text-center py-2.5 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t("pages.adminMockResults.status")}</th>
            </tr>
          </thead>
          <tbody>
            {profile.domainBreakdown.map((d, i) => (
              <tr key={d.domain} className={cn("border-b border-slate-50 hover:bg-slate-50/50 transition-colors")} data-testid={`domain-row-${i}`}>
                <td className="py-2.5 px-3 font-medium text-slate-700">{d.domain}</td>
                <td className="py-2.5 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <MasteryBar value={d.correctPct} height={6} className="w-16" />
                    <span className="text-sm font-semibold text-slate-700 w-10 text-right">{d.correctPct}%</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center text-slate-500">{d.avgTime}</td>
                <td className="py-2.5 px-3 text-center text-slate-400">{d.benchmark}%</td>
                <td className="py-2.5 px-3 text-center">
                  {d.status === "above" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Above
                    </span>
                  )}
                  {d.status === "at" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-100">
                      <MinusCircle className="w-2.5 h-2.5" /> At Benchmark
                    </span>
                  )}
                  {d.status === "below" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-semibold border border-rose-100">
                      <AlertTriangle className="w-2.5 h-2.5" /> Below
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-violet-50/40 rounded-xl p-4 border border-violet-100/50" data-testid="section-ai-summary">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <h4 className="text-xs font-semibold text-violet-700">{t("pages.adminMockResults.aiPerformanceSummary")}</h4>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{profile.aiSummary}</p>
      </div>
    </SectionCard>
  );
}

function PerformanceAnalytics({ profile }: { profile: MockResultProfile }) {
  return (
    <div data-testid="section-performance-analytics">
      <SectionTitle title={t("pages.adminMockResults.performanceAnalytics")} subtitle={t("pages.admin_mock_results.detailedInsightsAndTrends")} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard data-testid="chart-score-trend">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-500" /> Score Trend
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={profile.scoreTrend}>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard data-testid="chart-category-performance">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-500" /> Category Performance
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={profile.categoryPerformance}>
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={32}>
                {profile.categoryPerformance.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectionCard data-testid="chart-readiness-donut">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" /> Readiness Breakdown
          </h4>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={profile.readinessDonut}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90} endAngle={-270}
                >
                  {profile.readinessDonut.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-1">
            {profile.readinessDonut.map((d) => (
              <div key={d.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.label} ({d.value}%)
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="lg:col-span-2" data-testid="section-stat-cards">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" /> Key Statistics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard icon={<Flame className="w-4 h-4" />} label={t("pages.adminMockResults.studyStreak")} value={`${profile.stats.studyStreak} days`} accent="bg-orange-50 text-orange-500" />
            <StatCard icon={<BookOpen className="w-4 h-4" />} label={t("pages.adminMockResults.totalQuestions")} value={profile.stats.totalQuestions.toLocaleString()} accent="bg-sky-50 text-sky-500" />
            <StatCard icon={<Zap className="w-4 h-4" />} label={t("pages.adminMockResults.thisWeek")} value={`${profile.stats.questionsThisWeek}`} accent="bg-violet-50 text-violet-500" />
            <StatCard icon={<Star className="w-4 h-4" />} label={t("pages.adminMockResults.strongest")} value={profile.stats.strongestSubject} accent="bg-emerald-50 text-emerald-500" />
            <StatCard icon={<AlertTriangle className="w-4 h-4" />} label={t("pages.adminMockResults.weakest")} value={profile.stats.weakestSubject} accent="bg-rose-50 text-rose-500" />
            <StatCard icon={<Clock className="w-4 h-4" />} label={t("pages.adminMockResults.avgExamTime")} value={profile.stats.avgExamTime} accent="bg-amber-50 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-[10px] text-slate-400 font-medium">{t("pages.adminMockResults.confidenceScore")}</span>
              <span className="text-sm font-bold text-slate-700">{profile.stats.confidenceScore}%</span>
            </div>
            <MasteryBar value={profile.stats.confidenceScore} height={8} />
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard data-testid="section-recent-activity">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" /> Recent Activity
          </h4>
          <div className="space-y-3">
            {profile.recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0" data-testid={`activity-item-${i}`}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                  a.type === "exam" ? "bg-violet-50 text-violet-500" :
                  a.type === "study" ? "bg-sky-50 text-sky-500" :
                  a.type === "milestone" ? "bg-amber-50 text-amber-500" :
                  "bg-rose-50 text-rose-500"
                )}>
                  {a.type === "exam" ? <FileText className="w-3.5 h-3.5" /> :
                   a.type === "study" ? <BookOpen className="w-3.5 h-3.5" /> :
                   a.type === "milestone" ? <Award className="w-3.5 h-3.5" /> :
                   <Brain className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{a.action}</p>
                  <p className="text-xs text-slate-400">{a.detail}</p>
                </div>
                <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap">{a.date}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard data-testid="section-recommendations">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Remediation Recommendations
            </h4>
            <div className="space-y-2.5">
              {profile.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100" data-testid={`recommendation-${i}`}>
                  <PriorityBadge priority={r.priority} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700">{r.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard data-testid="section-next-lessons">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-violet-500" /> Next Best Lessons
            </h4>
            <div className="space-y-2">
              {profile.nextBestLessons.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-violet-50/40 border border-violet-100/50 hover:bg-violet-50/70 transition-colors" data-testid={`next-lesson-${i}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">{l.title}</p>
                    <p className="text-[10px] text-slate-400">{l.category} · {l.estimatedTime}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-violet-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default function AdminMockResults() {
  const { user, isAdmin } = useAuth();
  const [activeProfileId, setActiveProfileId] = useState(mockResultProfiles[0].id);
  const [hideSidebar, setHideSidebar] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [compact, setCompact] = useState(false);
  const [pastelTheme, setPastelTheme] = useState(false);

  const profile = mockResultProfiles.find(p => p.id === activeProfileId) || mockResultProfiles[0];

  useEffect(() => {
    if (hideSidebar) {
      const style = document.createElement("style");
      style.id = "mock-results-hide-nav";
      style.textContent = `nav, [data-testid="toolbar-screenshot-helpers"] { display: none !important; }`;
      document.head.appendChild(style);
      return () => { style.remove(); };
    }
    const existing = document.getElementById("mock-results-hide-nav");
    if (existing) existing.remove();
  }, [hideSidebar]);

  if (!user || !isAdmin) {
    return (
      <DemoPageWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-slate-500" data-testid="text-access-denied">{t("pages.adminMockResults.adminAccessRequired")}</p>
        </div>
      </DemoPageWrapper>
    );
  }

  return (
    <DemoPageWrapper className={cn(pastelTheme && "bg-gradient-to-br from-violet-50/50 via-white to-sky-50/30")}>
      <div className={cn("sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm")} data-testid="toolbar-screenshot-helpers">
        <div className={cn("mx-auto flex items-center justify-between gap-3 px-4 py-2", fullWidth ? "max-w-none" : "max-w-7xl")}>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-[10px] font-semibold">
              <Eye className="w-3 h-3" /> Mock Results
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setHideSidebar(!hideSidebar)}
              className={cn("px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors border",
                hideSidebar ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              )}
              data-testid="toggle-hide-sidebar"
            >
              {hideSidebar ? <EyeOff className="w-3 h-3 inline mr-1" /> : <Eye className="w-3 h-3 inline mr-1" />}
              Sidebar
            </button>
            <button
              onClick={() => setFullWidth(!fullWidth)}
              className={cn("px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors border",
                fullWidth ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              )}
              data-testid="toggle-full-width"
            >
              {fullWidth ? <Minimize2 className="w-3 h-3 inline mr-1" /> : <Maximize2 className="w-3 h-3 inline mr-1" />}
              Full Width
            </button>
            <button
              onClick={() => setCompact(!compact)}
              className={cn("px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors border",
                compact ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              )}
              data-testid="toggle-compact"
            >
              Compact
            </button>
            <button
              onClick={() => setPastelTheme(!pastelTheme)}
              className={cn("px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors border",
                pastelTheme ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              )}
              data-testid="toggle-pastel-theme"
            >
              <Palette className="w-3 h-3 inline mr-1" />
              Pastel
            </button>
          </div>
        </div>
      </div>

      <main className={cn("mx-auto px-6 pb-16", fullWidth ? "max-w-none" : "max-w-7xl", compact ? "py-4" : "py-8")} data-testid="mock-results-page">
        <div className={cn("flex flex-wrap gap-2 mb-6 p-1 bg-slate-100/60 rounded-xl")} data-testid="profile-switcher">
          {mockResultProfiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProfileId(p.id)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                activeProfileId === p.id
                  ? "bg-white text-violet-700 shadow-sm border border-violet-100"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
              data-testid={`profile-tab-${p.id}`}
            >
              <span className={cn(
                "inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold mr-1.5",
                activeProfileId === p.id
                  ? "bg-gradient-to-br from-violet-400 to-indigo-500 text-white"
                  : "bg-slate-200 text-slate-500"
              )}>
                {p.initials}
              </span>
              {p.label}
            </button>
          ))}
        </div>

        <DemoHeader
          title={`${profile.name} — ${profile.track}`}
          subtitle={`${profile.institution} · ${profile.examDate}`}
          rightContent={
            <ProgressRing value={profile.readinessScore} size={64} strokeWidth={5} label={t("pages.adminMockResults.ready")} />
          }
        />

        <TestResultSummary profile={profile} />
        <ReportCard profile={profile} />
        <PerformanceAnalytics profile={profile} />
      </main>
    </DemoPageWrapper>
  );
}
