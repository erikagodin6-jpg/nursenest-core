// Demo screenshot component - NOT real learner data.
// Optimized layout for hero banner crops and marketing screenshots.

import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  TrendingUp, Target, Brain, Flame, BookOpen, CheckCircle2,
  Star, AlertTriangle, Zap, Layers, Award, Clock, BarChart3,
} from "lucide-react";
import { DemoPageWrapper, SectionCard, ProgressRing, MasteryBar } from "@/components/demo-shared";
import { demoProfiles } from "@/data/demo-adaptive-profiles";

import { useI18n } from "@/lib/i18n";
export default function DemoHeroShowcase() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoHeroShowcase.adminAccessRequired")}</p></div></DemoPageWrapper>;

  const p = demoProfiles[0];
  const chartData = p.growthTrend.map((v, i) => ({ w: `W${i + 1}`, s: v }));

  return (
    <DemoPageWrapper>
      <main className="max-w-7xl mx-auto px-8 pt-8 pb-12">
        <div className="grid grid-cols-12 gap-4">
          {/* Readiness */}
          <div className="col-span-4">
            <SectionCard className="h-full flex flex-col items-center justify-center py-6">
              <ProgressRing value={78} size={96} strokeWidth={7} />
              <h3 className="text-sm font-semibold text-slate-700 mt-3 mb-0.5">{t("pages.demoHeroShowcase.examReadiness")}</h3>
              <p className="text-[10px] text-slate-500">{t("pages.demoHeroShowcase.nclexrn")}</p>
              <div className="flex items-center gap-1.5 mt-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-semibold border border-emerald-100">
                  <CheckCircle2 className="w-2.5 h-2.5" /> On Track
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[9px] font-semibold border border-violet-100">
                  <Brain className="w-2.5 h-2.5" /> Adaptive
                </span>
              </div>
            </SectionCard>
          </div>

          {/* Growth Chart */}
          <div className="col-span-8">
            <SectionCard className="h-full">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoHeroShowcase.adaptiveGrowth")}</h3>
                  <p className="text-[10px] text-slate-400">{t("pages.demoHeroShowcase.8weekReadinessProgression")}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-2.5 h-2.5" /> +20pts
                </span>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                  <defs>
                    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="w" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[50, 90]} />
                  <Area type="monotone" dataKey="s" stroke="#8b5cf6" strokeWidth={2} fill="url(#hg)" dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 2.5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>

          {/* Category Performance */}
          <div className="col-span-6">
            <SectionCard>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">{t("pages.demoHeroShowcase.categoryMastery")}</h3>
              <div className="space-y-2.5">
                {p.categoryBreakdown.slice(0, 5).map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2.5">
                    <span className="w-[120px] text-xs font-medium text-slate-600 truncate">{cat.name}</span>
                    <MasteryBar value={cat.score} className="flex-1" height={6} />
                    <span className="text-xs font-semibold text-slate-700 w-8 text-right">{cat.score}%</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Stats + Recommendations */}
          <div className="col-span-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <BarChart3 className="w-3.5 h-3.5" />, label: "Questions", value: "1,284", bg: "bg-violet-50 text-violet-500" },
                { icon: <Flame className="w-3.5 h-3.5" />, label: "Streak", value: "18 days", bg: "bg-orange-50 text-orange-500" },
                { icon: <Target className="w-3.5 h-3.5" />, label: "Pass Prob.", value: "84%", bg: "bg-emerald-50 text-emerald-500" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-1", s.bg)}>{s.icon}</div>
                  <p className="text-sm font-bold text-slate-800">{s.value}</p>
                  <p className="text-[9px] text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>

            <SectionCard>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">{t("pages.demoHeroShowcase.nextBestActions")}</h3>
              <div className="space-y-1.5">
                {p.recommendations.slice(0, 3).map((r, i) => {
                  const colors = ["bg-rose-50 border-rose-100", "bg-amber-50 border-amber-100", "bg-emerald-50 border-emerald-100"];
                  const icons = [<AlertTriangle className="w-3 h-3 text-rose-500" />, <Target className="w-3 h-3 text-amber-500" />, <Zap className="w-3 h-3 text-emerald-500" />];
                  return (
                    <div key={i} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", colors[i])}>
                      {icons[i]}
                      <span className="text-xs text-slate-700 font-medium truncate">{r.label}</span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          {/* Strengths / Weaknesses */}
          <div className="col-span-6">
            <SectionCard>
              <div className="flex items-center gap-1.5 mb-2"><Star className="w-3.5 h-3.5 text-emerald-500" /><h3 className="text-sm font-semibold text-slate-700">{t("pages.demoHeroShowcase.strengths")}</h3></div>
              <div className="space-y-1.5">
                {p.strongestAreas.map((a) => (
                  <div key={a} className="px-3 py-1.5 rounded-lg bg-emerald-50/60 border border-emerald-100/60 text-xs text-slate-700 font-medium">{a}</div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="col-span-6">
            <SectionCard>
              <div className="flex items-center gap-1.5 mb-2"><Target className="w-3.5 h-3.5 text-rose-500" /><h3 className="text-sm font-semibold text-slate-700">{t("pages.demoHeroShowcase.focusAreas")}</h3></div>
              <div className="space-y-1.5">
                {p.weakestAreas.map((a) => (
                  <div key={a} className="px-3 py-1.5 rounded-lg bg-rose-50/60 border border-rose-100/60 text-xs text-slate-700 font-medium">{a}</div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </DemoPageWrapper>
  );
}
