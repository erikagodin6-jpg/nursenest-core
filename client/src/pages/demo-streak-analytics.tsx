// Demo screenshot component - NOT real learner data.

import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Flame, Calendar, Clock, Target, TrendingUp, Star,
  CheckCircle2, Award, Zap,
} from "lucide-react";
import { DemoPageWrapper, DemoHeader, SectionCard, SectionTitle, StatCard, MasteryBar } from "@/components/demo-shared";
import { streakData as d } from "@/data/demo-screenshot-data";

import { useI18n } from "@/lib/i18n";
export default function DemoStreakAnalytics() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoStreakAnalytics.adminAccessRequired")}</p></div></DemoPageWrapper>;

  const hoursChart = d.weeklyHours.map((h, i) => ({ week: `W${i + 1}`, hours: h }));

  return (
    <DemoPageWrapper>
      <main className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <DemoHeader
          title={t("pages.demoStreakAnalytics.studyStreakConsistency")}
          subtitle={t("pages.demo_streak_analytics.trackingYourDailyCommitmentTo")}
          rightContent={
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 text-amber-700 text-sm font-bold border border-amber-100 shadow-sm">
              <Flame className="w-4 h-4 text-orange-500" /> {d.currentStreak} Day Streak
            </span>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<Flame className="w-4 h-4" />} label={t("pages.demoStreakAnalytics.currentStreak")} value={`${d.currentStreak} days`} accent="bg-orange-50 text-orange-500" />
          <StatCard icon={<Award className="w-4 h-4" />} label={t("pages.demoStreakAnalytics.longestStreak")} value={`${d.longestStreak} days`} accent="bg-amber-50 text-amber-500" />
          <StatCard icon={<Target className="w-4 h-4" />} label={t("pages.demoStreakAnalytics.consistency")} value={`${d.consistencyScore}%`} accent="bg-emerald-50 text-emerald-500" />
          <StatCard icon={<Clock className="w-4 h-4" />} label={t("pages.demoStreakAnalytics.dailyAverage")} value={`${d.avgDailyMinutes} min`} accent="bg-violet-50 text-violet-500" />
        </div>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 lg:col-span-7">
            <SectionCard>
              <SectionTitle title={t("pages.demoStreakAnalytics.monthlyActivity")} subtitle={t("pages.demo_streak_analytics.studyDaysInTheLast")} />
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-[10px] text-slate-400 font-medium">{day}</div>
                ))}
                {d.monthlyActivity.map((active, i) => (
                  <div key={i} className={cn("aspect-square rounded-lg flex items-center justify-center transition-colors",
                    active ? "bg-violet-500" : "bg-slate-100"
                  )}>
                    {active ? <CheckCircle2 className="w-3 h-3 text-white" /> : null}
                  </div>
                ))}
                {Array.from({ length: (7 - d.monthlyActivity.length % 7) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-lg bg-slate-50" />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span>{d.totalStudyDays} study days total</span>
                <span>Best day: {d.bestDay}</span>
                <span>Peak: {d.bestTime}</span>
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <SectionCard className="h-full">
              <SectionTitle title={t("pages.demoStreakAnalytics.weeklyStudyHours")} subtitle={t("pages.demo_streak_analytics.hoursLoggedPerWeek")} />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hoursChart} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px" }} />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>
        </div>

        <SectionCard>
          <SectionTitle title={t("pages.demoStreakAnalytics.streakMilestones")} subtitle={t("pages.demo_streak_analytics.unlockAchievementsAsYouBuild")} />
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {d.milestones.map((m, i) => (
              <div key={m.days} className={cn("flex-shrink-0 flex flex-col items-center text-center px-5 py-4 rounded-2xl border-2 min-w-[120px] transition-colors",
                m.reached ? "bg-gradient-to-b from-violet-50 to-indigo-50 border-violet-200" : "bg-slate-50/50 border-slate-100"
              )}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-2",
                  m.reached ? "bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-200/50" : "bg-slate-200"
                )}>
                  {m.reached ? <Star className="w-5 h-5 text-white" /> : <Star className="w-5 h-5 text-slate-400" />}
                </div>
                <p className={cn("text-sm font-bold", m.reached ? "text-violet-700" : "text-slate-400")}>{m.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{m.days} days</p>
                {m.reached && <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded mt-1">{t("pages.demoStreakAnalytics.earned")}</span>}
              </div>
            ))}
          </div>
        </SectionCard>
      </main>
    </DemoPageWrapper>
  );
}
