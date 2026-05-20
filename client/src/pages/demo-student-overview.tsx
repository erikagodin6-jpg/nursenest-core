// Demo screenshot component - NOT real learner data.

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User, Crown, Target, Flame, BookOpen, Brain, BarChart3,
  ArrowRight, Layers, Clock, CheckCircle2, Zap, TrendingUp,
  Calendar, Award, Star,
} from "lucide-react";
import { DemoPageWrapper, SectionCard, SectionTitle, StatCard, MasteryBar, ProgressRing } from "@/components/demo-shared";
import { studentOverviewData as d } from "@/data/demo-screenshot-data";
import { demoProfiles } from "@/data/demo-adaptive-profiles";

import { useI18n } from "@/lib/i18n";
export default function DemoStudentOverview() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoStudentOverview.adminAccessRequired")}</p></div></DemoPageWrapper>;

  const p = demoProfiles[0];

  return (
    <DemoPageWrapper>
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <SectionCard className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold mx-auto shadow-lg shadow-violet-200/50 mb-3">
                {p.initials}
              </div>
              <h2 className="text-lg font-bold text-slate-800">{p.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{p.institution}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-xs font-semibold">
                  <Crown className="w-3 h-3" /> {d.tier}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100">
                  {d.examPath}
                </span>
              </div>
              <div className="mt-5">
                <ProgressRing value={p.readinessScore} size={100} strokeWidth={7} />
                <p className="text-xs text-slate-500 mt-2">{t("pages.demoStudentOverview.examReadiness")}</p>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionTitle title={t("pages.demoStudentOverview.monthlyProgress")} />
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-violet-50/50 border border-violet-100/60">
                  <p className="text-xl font-bold text-violet-700">{d.monthlyProgress.questionsThisMonth}</p>
                  <p className="text-[10px] text-slate-500">{t("pages.demoStudentOverview.questionsThisMonth")}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
                  <p className="text-xl font-bold text-emerald-600">+{d.monthlyProgress.readinessChange}%</p>
                  <p className="text-[10px] text-slate-500">{t("pages.demoStudentOverview.readinessChange")}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionTitle title={t("pages.demoStudentOverview.savedWeakAreas")} />
              <div className="space-y-2">
                {d.savedWeakAreas.map((area) => (
                  <div key={area} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-50/50 border border-rose-100/60 group cursor-pointer hover:bg-rose-50 transition-colors">
                    <span className="text-sm text-slate-700 font-medium">{area}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-5">
            <SectionCard className="bg-gradient-to-r from-violet-50 via-white to-indigo-50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-200/50 flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-700 mb-0.5">{t("pages.demoStudentOverview.resumeStudying")}</h3>
                  <p className="text-xs text-slate-500 mb-3">{t("pages.demoStudentOverview.pickUpWhereYouLeft")}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="px-3 py-2.5 rounded-xl bg-white/80 border border-slate-100 text-center">
                      <p className="text-xs text-slate-500">{t("pages.demoStudentOverview.lastSession")}</p>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{d.resumeCard.lastSessionDate}</p>
                    </div>
                    <div className="px-3 py-2.5 rounded-xl bg-white/80 border border-slate-100 text-center">
                      <p className="text-xs text-slate-500">{t("pages.demoStudentOverview.dueFlashcards")}</p>
                      <p className="text-lg font-bold text-rose-500">{d.resumeCard.dueFlashcards}</p>
                    </div>
                    <div className="px-3 py-2.5 rounded-xl bg-white/80 border border-slate-100 text-center">
                      <p className="text-xs text-slate-500">{t("pages.demoStudentOverview.weeklyTarget")}</p>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{d.resumeCard.weeklyCompleted}/{d.resumeCard.weeklyTarget}</p>
                    </div>
                    <div className="px-3 py-2.5 rounded-xl bg-white/80 border border-slate-100 text-center">
                      <p className="text-xs text-slate-500">{t("pages.demoStudentOverview.recommended")}</p>
                      <p className="text-xs font-semibold text-violet-600 mt-0.5">{t("pages.demoStudentOverview.quiz")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 h-8 gap-1.5 shadow-md shadow-violet-200/40">
                      <Zap className="w-3 h-3" /> Continue Session
                    </Button>
                    <Button variant="outline" className="rounded-xl text-xs font-semibold px-4 h-8 gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50">
                      <Layers className="w-3 h-3" /> Review Flashcards
                    </Button>
                  </div>
                </div>
              </div>
            </SectionCard>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              <StatCard icon={<BarChart3 className="w-4 h-4" />} label={t("pages.demoStudentOverview.questions")} value={d.completedContent.questions.toLocaleString()} />
              <StatCard icon={<Layers className="w-4 h-4" />} label={t("pages.demoStudentOverview.flashcards")} value={d.completedContent.flashcards.toLocaleString()} accent="bg-sky-50 text-sky-500" />
              <StatCard icon={<BookOpen className="w-4 h-4" />} label={t("pages.demoStudentOverview.lessons")} value={d.completedContent.lessons.toString()} accent="bg-emerald-50 text-emerald-500" />
              <StatCard icon={<Brain className="w-4 h-4" />} label={t("pages.demoStudentOverview.caseStudies")} value={d.completedContent.caseStudies.toString()} accent="bg-amber-50 text-amber-500" />
              <StatCard icon={<Target className="w-4 h-4" />} label={t("pages.demoStudentOverview.catSims")} value={d.completedContent.catSimulations.toString()} accent="bg-rose-50 text-rose-500" />
            </div>

            <SectionCard>
              <SectionTitle title={t("pages.demoStudentOverview.upcomingMilestones")} subtitle={t("pages.demo_student_overview.progressTowardYourNextGoals")} />
              <div className="space-y-3">
                {d.upcomingMilestones.map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-[200px] truncate">{m.label}</span>
                    <MasteryBar value={m.progress} className="flex-1" />
                    <span className="w-10 text-right text-sm font-semibold text-slate-700">{m.progress}%</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <SectionTitle title={t("pages.demoStudentOverview.dailyGoalCompleted")} />
              <div className="flex items-center gap-4 py-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t("pages.demoStudentOverview.43QuestionsCompletedToday")}</p>
                  <p className="text-xs text-slate-500">{t("pages.demoStudentOverview.youveExceededYourDailyTarget")}</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                  <Star className="w-3 h-3" /> Goal Met
                </span>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </DemoPageWrapper>
  );
}
