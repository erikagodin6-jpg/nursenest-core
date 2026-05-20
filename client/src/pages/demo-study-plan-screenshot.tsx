// Demo screenshot component - NOT real learner data.

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, Circle, Calendar, Target, BookOpen, Brain,
  Clock, Flame, Zap, TrendingUp, ArrowRight, AlertTriangle, Star,
} from "lucide-react";
import { DemoPageWrapper, DemoHeader, SectionCard, SectionTitle, StatCard, MasteryBar, PriorityBadge } from "@/components/demo-shared";
import { studyPlanData as d } from "@/data/demo-screenshot-data";

import { useI18n } from "@/lib/i18n";
export default function DemoStudyPlanScreenshot() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoStudyPlanScreenshot.adminAccessRequired")}</p></div></DemoPageWrapper>;

  const progressPct = Math.round((d.completedThisWeek / d.estimatedHoursThisWeek) * 100);

  return (
    <DemoPageWrapper>
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <DemoHeader
          title={t("pages.demoStudyPlanScreenshot.personalizedStudyPlan")}
          subtitle={`Week ${d.weekNumber} of ${d.totalWeeks} - ${d.weekFocus}`}
          rightContent={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                <Target className="w-3.5 h-3.5" /> Target: {d.targetReadiness}% Readiness
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100">
                <Brain className="w-3.5 h-3.5" /> Adaptive Plan Active
              </span>
            </div>
          }
        />

        <SectionCard className="mb-6 bg-gradient-to-r from-violet-50 via-white to-indigo-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-200/50">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{t("pages.demoStudyPlanScreenshot.nextMilestone")}</p>
                <p className="text-xs text-slate-500">{d.nextMilestone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500">{t("pages.demoStudyPlanScreenshot.thisWeek")}</p>
                <p className="text-sm font-bold text-slate-700">{d.completedThisWeek}h / {d.estimatedHoursThisWeek}h</p>
              </div>
              <div className="w-24">
                <MasteryBar value={progressPct} height={6} />
                <p className="text-[10px] text-slate-400 mt-1 text-center">{progressPct}% complete</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="grid grid-cols-12 gap-5 mb-6">
          <div className="col-span-12 lg:col-span-8">
            <SectionCard>
              <SectionTitle title={t("pages.demoStudyPlanScreenshot.weeklySchedule")} subtitle={`Week ${d.weekNumber} daily plan`} />
              <div className="space-y-2.5">
                {d.dailyPlan.map((day) => (
                  <div key={day.day} className={cn("flex items-start gap-3 px-4 py-3 rounded-xl border transition-colors",
                    day.completed ? "bg-emerald-50/40 border-emerald-100" : "bg-white border-slate-100"
                  )}>
                    <div className="mt-0.5">
                      {day.completed
                        ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                        : <Circle className="w-4.5 h-4.5 text-slate-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-sm font-semibold", day.completed ? "text-emerald-700" : "text-slate-700")}>{day.day}</span>
                        <span className="text-[10px] text-slate-400">{day.hours}h estimated</span>
                        {day.completed && <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">{t("pages.demoStudyPlanScreenshot.done")}</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {day.tasks.map((task, i) => (
                          <span key={i} className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium",
                            day.completed ? "bg-emerald-100/50 text-emerald-600" : "bg-slate-100 text-slate-600"
                          )}>{task}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-5">
            <SectionCard>
              <SectionTitle title={t("pages.demoStudyPlanScreenshot.thisWeeksFocus")} />
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-violet-50/50 border border-violet-100/60">
                  <p className="text-xl font-bold text-violet-700">{d.weeklyMix.questions}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{t("pages.demoStudyPlanScreenshot.questions")}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-sky-50/50 border border-sky-100/60">
                  <p className="text-xl font-bold text-sky-700">{d.weeklyMix.flashcards}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{t("pages.demoStudyPlanScreenshot.flashcards")}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
                  <p className="text-xl font-bold text-emerald-700">{d.weeklyMix.lessons}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{t("pages.demoStudyPlanScreenshot.lessons")}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-amber-50/50 border border-amber-100/60">
                  <p className="text-xl font-bold text-amber-700">{d.weeklyMix.caseStudies}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{t("pages.demoStudyPlanScreenshot.caseStudies")}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionTitle title={t("pages.demoStudyPlanScreenshot.highyieldTopics")} subtitle="Priority review areas" />
              <div className="space-y-2.5">
                {d.highYieldTopics.map((t) => (
                  <div key={t.topic} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-sm text-slate-700 font-medium">{t.topic}</span>
                    <PriorityBadge priority={t.urgency} />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard className="bg-gradient-to-br from-violet-50 to-indigo-50">
              <div className="text-center py-2">
                <Calendar className="w-8 h-8 text-violet-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 mb-1">Week {d.weekNumber} of {d.totalWeeks}</p>
                <p className="text-xs text-slate-500">
                  {d.currentReadiness}% current - {d.targetReadiness}% target
                </p>
                <div className="mt-3">
                  <MasteryBar value={Math.round((d.currentReadiness / d.targetReadiness) * 100)} height={6} />
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </DemoPageWrapper>
  );
}
