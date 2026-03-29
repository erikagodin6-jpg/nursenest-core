// Demo screenshot component - NOT real learner data.

import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  TrendingUp, Calendar, Clock, Target, Brain, Zap, BarChart3, ArrowUp,
} from "lucide-react";
import { DemoPageWrapper, DemoHeader, SectionCard, SectionTitle, StatCard, MasteryBar } from "@/components/demo-shared";
import { sessionComparisonData as d } from "@/data/demo-screenshot-data";

import { useI18n } from "@/lib/i18n";
export default function DemoSessionComparison() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoSessionComparison.adminAccessRequired")}</p></div></DemoPageWrapper>;

  return (
    <DemoPageWrapper>
      <main className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <DemoHeader
          title={t("pages.demoSessionComparison.adaptiveSessionComparison")}
          subtitle={t("pages.demo_session_comparison.trackYourGrowthAcrossYour")}
          rightContent={
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" /> +8% improvement
            </span>
          }
        />

        <div className="grid grid-cols-3 gap-4 mb-6">
          {d.sessions.map((s, i) => (
            <SectionCard key={s.id} className={cn(i === 2 && "ring-2 ring-violet-200 ring-offset-2")}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Session {s.id}</p>
                  <p className="text-sm font-semibold text-slate-700">{s.date}, 2026</p>
                </div>
                {i === 2 && <span className="text-[9px] font-semibold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded">{t("pages.demoSessionComparison.latest")}</span>}
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-slate-800">{s.score}%</span>
                {i > 0 && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                    <ArrowUp className="w-3 h-3" />+{s.score - d.sessions[i - 1].score}
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">{t("pages.demoSessionComparison.questions")}</span><span className="font-semibold text-slate-700">{s.questions}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">{t("pages.demoSessionComparison.time")}</span><span className="font-semibold text-slate-700">{s.time}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">{t("pages.demoSessionComparison.difficulty")}</span><span className="font-semibold text-slate-700">{s.difficulty}/10</span></div>
                <div className="flex justify-between"><span className="text-slate-500">{t("pages.demoSessionComparison.topArea")}</span><span className="font-semibold text-emerald-600">{s.topCategory}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">{t("pages.demoSessionComparison.weakArea")}</span><span className="font-semibold text-rose-500">{s.weakCategory}</span></div>
              </div>
            </SectionCard>
          ))}
        </div>

        <SectionCard className="mb-6">
          <SectionTitle title={t("pages.demoSessionComparison.categoryTrendComparison")} subtitle={t("pages.demo_session_comparison.scoreProgressionAcrossSessionsBy")} />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={d.categoryTrends} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[40, 100]} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="s1" name="Session 1" fill="#e9d8fd" radius={[3, 3, 0, 0]} barSize={18} />
              <Bar dataKey="s2" name="Session 2" fill="#c4b5fd" radius={[3, 3, 0, 0]} barSize={18} />
              <Bar dataKey="s3" name="Session 3" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard className="bg-gradient-to-r from-violet-50 via-white to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-200/50">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{t("pages.demoSessionComparison.consistentGrowthDetected")}</p>
              <p className="text-xs text-slate-500">{t("pages.demoSessionComparison.yourScoresAreImprovingSteadily")}</p>
            </div>
          </div>
        </SectionCard>
      </main>
    </DemoPageWrapper>
  );
}
