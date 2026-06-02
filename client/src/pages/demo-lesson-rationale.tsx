// Demo screenshot component - NOT real learner data.

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, XCircle, BookOpen, Lightbulb, Tag, Clock,
  Bookmark, ArrowRight, Layers, GraduationCap, Brain, Star,
} from "lucide-react";
import { DemoPageWrapper, SectionCard } from "@/components/demo-shared";
import { lessonRationaleData as d } from "@/data/demo-screenshot-data";

import { useI18n } from "@/lib/i18n";
export default function DemoLessonRationale() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoLessonRationale.adminAccessRequired")}</p></div></DemoPageWrapper>;

  return (
    <DemoPageWrapper>
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-5">
            <SectionCard>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 text-[10px] font-bold uppercase">{d.difficulty}</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">{d.category}</span>
                <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-400"><Clock className="w-3 h-3" /> {d.estimatedTime}</span>
              </div>

              <h2 className="text-base font-semibold text-slate-800 leading-relaxed mb-5">
                {d.questionStem}
              </h2>

              <div className="space-y-2.5 mb-6">
                {d.choices.map((c) => (
                  <div key={c.letter} className={cn("flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-colors",
                    c.correct ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"
                  )}>
                    <span className={cn("flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold",
                      c.correct ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                    )}>{c.letter}</span>
                    <span className={cn("text-sm leading-relaxed pt-0.5", c.correct ? "text-emerald-800 font-medium" : "text-slate-600")}>
                      {c.text}
                    </span>
                    {c.correct && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mt-0.5 ml-auto flex-shrink-0" />}
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-5 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-emerald-800">{t("pages.demoLessonRationale.rationale")}</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{d.rationale}</p>
              </div>

              <div className="space-y-3">
                {d.incorrectExplanations.map((ie) => (
                  <div key={ie.letter} className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500">Option {ie.letter}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{ie.text}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-100 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-800 mb-1">{t("pages.demoLessonRationale.clinicalPearl")}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{d.clinicalPearl}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-5">
            <SectionCard>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoLessonRationale.examBlueprint")}</h3>
              </div>
              <div className="space-y-2">
                <div className="px-3 py-2 rounded-lg bg-violet-50/50 border border-violet-100/60">
                  <p className="text-[10px] text-slate-400 font-medium">{t("pages.demoLessonRationale.category")}</p>
                  <p className="text-xs text-slate-700 font-semibold">{d.category}</p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-violet-50/50 border border-violet-100/60">
                  <p className="text-[10px] text-slate-400 font-medium">{t("pages.demoLessonRationale.subcategory")}</p>
                  <p className="text-xs text-slate-700 font-semibold">{d.subcategory}</p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-violet-50/50 border border-violet-100/60">
                  <p className="text-[10px] text-slate-400 font-medium">{t("pages.demoLessonRationale.cognitiveSkill")}</p>
                  <p className="text-xs text-slate-700 font-semibold">{d.cognitiveSkill}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoLessonRationale.linkedLesson")}</h3>
              </div>
              <div className="px-3 py-3 rounded-xl bg-sky-50/50 border border-sky-100/60 group cursor-pointer hover:bg-sky-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 font-medium">{d.linkedLesson}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition-colors" />
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoLessonRationale.relatedFlashcards")}</h3>
              </div>
              <div className="space-y-2">
                {d.linkedFlashcards.map((fc) => (
                  <div key={fc} className="px-3 py-2.5 rounded-xl bg-violet-50/50 border border-violet-100/60 group cursor-pointer hover:bg-violet-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 font-medium">{fc}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl text-xs font-semibold h-9 gap-1.5 border-slate-200 text-slate-600">
                <Bookmark className="w-3.5 h-3.5" /> Save for Later
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl text-xs font-semibold h-9 gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50">
                <Brain className="w-3.5 h-3.5" /> Study Again
              </Button>
            </div>
          </div>
        </div>
      </main>
    </DemoPageWrapper>
  );
}
