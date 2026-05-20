// Demo screenshot component - NOT real learner data.

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  BookOpen, Brain, Flame, Target, TrendingUp, Layers,
  Clock, CheckCircle2, AlertTriangle, ArrowRight, Zap, RotateCcw,
} from "lucide-react";
import { DemoPageWrapper, DemoHeader, SectionCard, SectionTitle, ProgressRing, MasteryBar, StatCard } from "@/components/demo-shared";
import { flashcardMasteryData as d } from "@/data/demo-screenshot-data";

import { useI18n } from "@/lib/i18n";
export default function DemoFlashcardMastery() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoFlashcardMastery.adminAccessRequired")}</p></div></DemoPageWrapper>;

  const retentionChart = d.retentionTrend.map((v, i) => ({ week: `W${i + 1}`, retention: v }));

  return (
    <DemoPageWrapper>
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <DemoHeader
          title={t("pages.demoFlashcardMastery.flashcardMastery")}
          subtitle={`${d.deckTitle} - ${d.totalCards} cards - Spaced repetition active`}
          rightContent={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                <Flame className="w-3.5 h-3.5" /> {d.reviewStreak} day streak
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100">
                <Clock className="w-3.5 h-3.5" /> {d.dueToday} due today
              </span>
            </div>
          }
        />

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 lg:col-span-4">
            <SectionCard className="h-full flex flex-col items-center justify-center text-center py-8">
              <ProgressRing value={d.retentionEstimate} size={120} strokeWidth={8} color="#8b5cf6" label={t("pages.demoFlashcardMastery.retention")} />
              <h3 className="text-sm font-semibold text-slate-700 mt-5 mb-1">{t("pages.demoFlashcardMastery.overallRetention")}</h3>
              <p className="text-xs text-slate-500 max-w-[220px]">
                Estimated long-term retention based on spaced repetition performance and review consistency.
              </p>
              <div className="flex items-center gap-4 mt-5">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">{d.mastered}</p>
                  <p className="text-[10px] text-slate-400">{t("pages.demoFlashcardMastery.mastered")}</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-600">{d.inProgress}</p>
                  <p className="text-[10px] text-slate-400">{t("pages.demoFlashcardMastery.inProgress")}</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <p className="text-lg font-bold text-rose-500">{d.needsReview}</p>
                  <p className="text-[10px] text-slate-400">{t("pages.demoFlashcardMastery.needsReview")}</p>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <StatCard icon={<Layers className="w-4 h-4" />} label={t("pages.demoFlashcardMastery.totalCards")} value={d.totalCards.toString()} sub={d.deckTitle} />
              <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label={t("pages.demoFlashcardMastery.mastered2")} value={`${Math.round((d.mastered / d.totalCards) * 100)}%`} sub={`${d.mastered} cards`} accent="bg-emerald-50 text-emerald-500" />
              <StatCard icon={<Brain className="w-4 h-4" />} label={t("pages.demoFlashcardMastery.sessions")} value={d.studySessions.toString()} sub={`${d.avgSessionCards} cards avg`} />
              <StatCard icon={<Flame className="w-4 h-4" />} label={t("pages.demoFlashcardMastery.streak")} value={`${d.reviewStreak} days`} accent="bg-amber-50 text-amber-500" />
              <StatCard icon={<Clock className="w-4 h-4" />} label={t("pages.demoFlashcardMastery.dueToday")} value={d.dueToday.toString()} accent="bg-rose-50 text-rose-500" />
              <StatCard icon={<Target className="w-4 h-4" />} label={t("pages.demoFlashcardMastery.retention2")} value={`${d.retentionEstimate}%`} accent="bg-violet-50 text-violet-500" />
            </div>

            <SectionCard>
              <SectionTitle title={t("pages.demoFlashcardMastery.retentionTrend")} subtitle={t("pages.demo_flashcard_mastery.weeklyRetentionRateOverTime")}
                right={<span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><TrendingUp className="w-3 h-3" /> +14%</span>}
              />
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={retentionChart} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[60, 100]} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="retention" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#retGrad)" dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>
        </div>

        <SectionCard className="mb-6">
          <SectionTitle title={t("pages.demoFlashcardMastery.masteryByTopic")} subtitle={t("pages.demo_flashcard_mastery.cardMasteryDistributionAcrossSubtopics")} />
          <div className="space-y-3">
            {d.topicMastery.map((t) => (
              <div key={t.topic} className="flex items-center gap-3">
                <span className="w-[160px] text-sm font-medium text-slate-700 truncate">{t.topic}</span>
                <MasteryBar value={t.pct} className="flex-1" />
                <span className="w-10 text-right text-sm font-semibold text-slate-700">{t.pct}%</span>
                <span className="text-[10px] text-slate-400 w-16 text-right">{t.mastered}/{t.total}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 md:col-span-6">
            <SectionCard>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center"><AlertTriangle className="w-3.5 h-3.5 text-rose-500" /></div>
                <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoFlashcardMastery.weakConcepts")}</h3>
              </div>
              <div className="space-y-2.5">
                {d.weakConcepts.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-rose-50/50 border border-rose-100/60">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                    <span className="text-sm text-slate-700 font-medium">{c}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 md:col-span-6">
            <SectionCard className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center"><BookOpen className="w-3.5 h-3.5 text-violet-500" /></div>
                <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoFlashcardMastery.recommendedNext")}</h3>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-3">
                  <Layers className="w-6 h-6 text-violet-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">{d.recommendedNext}</p>
                <p className="text-xs text-slate-500 mb-4 max-w-[200px]">{t("pages.demoFlashcardMastery.continueBuildingMasteryWithRelated")}</p>
                <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-5 h-9 gap-1.5 shadow-md shadow-violet-200/40">
                  <ArrowRight className="w-3.5 h-3.5" /> Start Deck
                </Button>
              </div>
            </SectionCard>
          </div>
        </div>

        <SectionCard className="bg-gradient-to-r from-violet-50 via-white to-indigo-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-200/50">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{d.dueToday} cards due for review</p>
                <p className="text-xs text-slate-500">Maintain your {d.reviewStreak}-day streak with today's review session</p>
              </div>
            </div>
            <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-5 h-9 gap-1.5 shadow-md shadow-violet-200/40">
              <Zap className="w-3.5 h-3.5" /> Continue Review
            </Button>
          </div>
        </SectionCard>
      </main>
    </DemoPageWrapper>
  );
}
