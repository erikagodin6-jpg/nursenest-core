// Demo screenshot component - NOT real learner data.
// Marketing-only visual for hero page and landing screenshots.

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  CheckCircle2, XCircle, Clock, Target, TrendingUp, BookOpen,
  BarChart3, Award, ArrowRight, Zap, Brain, AlertTriangle, Layers,
} from "lucide-react";
import { DemoPageWrapper, DemoHeader, SectionCard, SectionTitle, MasteryBar, StatCard } from "@/components/demo-shared";
import { examReviewData as d } from "@/data/demo-screenshot-data";

import { useI18n } from "@/lib/i18n";
export default function DemoExamReview() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoExamReview.adminAccessRequired")}</p></div></DemoPageWrapper>;

  const confColors = d.confidenceBreakdown.map(c => c.color);
  const timeData = d.timeDistribution.map(t => ({ ...t }));

  return (
    <DemoPageWrapper>
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <DemoHeader
          title={t("pages.demoExamReview.adaptiveSessionAnalysis")}
          subtitle={t("pages.demo_exam_review.readinessCheckCompletedMarch11")}
          rightContent={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                <Target className="w-3.5 h-3.5" /> Borderline - Improving
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100">
                <Award className="w-3.5 h-3.5" /> 72nd Percentile
              </span>
            </div>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard icon={<BarChart3 className="w-4 h-4" />} label={t("pages.demoExamReview.score")} value={`${d.score}%`} sub={`${d.correctAnswers}/${d.totalQuestions} correct`} />
          <StatCard icon={<Clock className="w-4 h-4" />} label={t("pages.demoExamReview.timeUsed")} value={d.timeUsed} sub={`${d.avgTimePerQuestion} avg`} />
          <StatCard icon={<Brain className="w-4 h-4" />} label={t("pages.demoExamReview.difficulty")} value={d.difficultyMix} accent="bg-indigo-50 text-indigo-500" />
          <StatCard icon={<Target className="w-4 h-4" />} label={t("pages.demoExamReview.passReadiness")} value={d.passReadiness} accent="bg-amber-50 text-amber-500" />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} label={t("pages.demoExamReview.percentile")} value={`${d.percentileRank}nd`} accent="bg-emerald-50 text-emerald-500" />
          <StatCard icon={<Layers className="w-4 h-4" />} label={t("pages.demoExamReview.questions")} value={`${d.totalQuestions}`} sub="Adaptive mix" />
        </div>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 lg:col-span-7">
            <SectionCard>
              <SectionTitle title={t("pages.demoExamReview.categoryPerformance")} subtitle={t("pages.demo_exam_review.accuracyByContentDomain")} />
              <div className="space-y-3">
                {d.categoryResults.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <span className="w-[150px] text-sm font-medium text-slate-700 truncate">{cat.name}</span>
                    <MasteryBar value={cat.pct} className="flex-1" />
                    <span className="w-12 text-right text-sm font-semibold text-slate-700">{cat.pct}%</span>
                    <span className="text-[10px] text-slate-400 w-14 text-right">{cat.correct}/{cat.total}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <SectionCard className="h-full">
              <SectionTitle title={t("pages.demoExamReview.confidenceAnalysis")} subtitle={t("pages.demo_exam_review.selfassessmentVsActualPerformance")} />
              <div className="flex justify-center mb-4">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={d.confidenceBreakdown} dataKey="pct" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} strokeWidth={0}>
                      {d.confidenceBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {d.confidenceBreakdown.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 truncate">{item.label}</span>
                    <span className="ml-auto font-semibold text-slate-700">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 lg:col-span-6">
            <SectionCard>
              <SectionTitle title={t("pages.demoExamReview.questionTypeBreakdown")} subtitle={t("pages.demo_exam_review.performanceByItemFormat")} />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={d.questionTypeResults} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="type" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />
                  <Bar dataKey="pct" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <SectionCard>
              <SectionTitle title={t("pages.demoExamReview.timeDistribution")} subtitle={t("pages.demo_exam_review.responseTimePerQuestion")} />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={timeData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />
                  <Bar dataKey="count" fill="#c4b5fd" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 md:col-span-6">
            <SectionCard>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoExamReview.mostMissedTopics")}</h3>
              </div>
              <div className="space-y-2.5">
                {d.commonMisses.map((miss, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-rose-50/50 border border-rose-100/60">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                    <span className="text-sm text-slate-700 font-medium">{miss}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 md:col-span-6">
            <SectionCard>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoExamReview.recommendedReview")}</h3>
              </div>
              <div className="space-y-2.5">
                {d.reviewNext.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-50/50 border border-violet-100/60 group cursor-pointer hover:bg-violet-50 transition-colors">
                    <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                      item.type === "lesson" ? "bg-sky-100 text-sky-600" : "bg-violet-100 text-violet-600"
                    )}>{item.type}</span>
                    <span className="text-sm text-slate-700 font-medium flex-1">{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-500 transition-colors" />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <SectionCard className="bg-gradient-to-r from-violet-50 via-white to-indigo-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-200/50">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{t("pages.demoExamReview.keepTheMomentumGoing")}</p>
                <p className="text-xs text-slate-500">{t("pages.demoExamReview.yourNextSessionShouldFocus")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 h-9 gap-1.5 shadow-md shadow-violet-200/40">
                <Zap className="w-3.5 h-3.5" /> Start Next Session
              </Button>
              <Button variant="outline" className="rounded-xl text-xs font-semibold px-4 h-9 gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50">
                <BookOpen className="w-3.5 h-3.5" /> Review Missed Items
              </Button>
            </div>
          </div>
        </SectionCard>
      </main>
    </DemoPageWrapper>
  );
}
