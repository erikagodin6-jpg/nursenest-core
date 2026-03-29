// Demo screenshot component - NOT real learner data.

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Flag, Clock, Calculator, Beaker, ChevronLeft, ChevronRight,
  BookOpen, BarChart3, Pause, AlertTriangle,
} from "lucide-react";
import { DemoPageWrapper, SectionCard } from "@/components/demo-shared";
import { catExamData as d } from "@/data/demo-screenshot-data";

import { useI18n } from "@/lib/i18n";
export default function DemoCatExam() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  const [mode, setMode] = useState<"mcq" | "sata">("mcq");

  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoCatExam.adminAccessRequired")}</p></div></DemoPageWrapper>;

  return (
    <DemoPageWrapper>
      <div className="border-b border-slate-100 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-violet-700">NurseNest</span>
            <span className="text-xs text-slate-400">{t("pages.demoCatExam.adaptiveReadinessCheck")}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-semibold">{d.timeElapsed}</span>
              <span className="text-[10px] text-slate-400 ml-1">{t("pages.demoCatExam.of20000")}</span>
            </div>
            <div className="w-px h-5 bg-slate-200" />
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 gap-1 h-7">
              <Pause className="w-3 h-3" /> Pause
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500 font-medium">Question {d.currentQuestion} of ~{d.totalEstimate}</span>
            <span className="text-xs text-slate-400">{d.flaggedCount} flagged</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(d.currentQuestion / d.totalEstimate) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 border-b border-slate-50">
        <button onClick={() => setMode("mcq")} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all", mode === "mcq" ? "bg-violet-100 text-violet-700" : "text-slate-500 hover:bg-slate-50")}>{t("pages.demoCatExam.multipleChoice")}</button>
        <button onClick={() => setMode("sata")} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all", mode === "sata" ? "bg-violet-100 text-violet-700" : "text-slate-500 hover:bg-slate-50")}>SATA</button>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {mode === "mcq" ? (
          <div>
            <h2 className="text-base font-semibold text-slate-800 leading-relaxed mb-6 max-w-3xl">
              {d.questionStem}
            </h2>
            <div className="space-y-3 max-w-3xl">
              {d.choices.map((c, i) => (
                <div key={c.letter} className={cn(
                  "flex items-start gap-3.5 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all",
                  i === 2 ? "bg-violet-50 border-violet-200 shadow-sm" : "bg-white border-slate-100 hover:border-violet-200 hover:bg-violet-50/30"
                )}>
                  <span className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                    i === 2 ? "bg-violet-500 text-white" : "bg-slate-100 text-slate-500"
                  )}>{c.letter}</span>
                  <span className={cn("text-sm leading-relaxed pt-1", i === 2 ? "text-violet-800 font-medium" : "text-slate-600")}>
                    {c.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-semibold mb-4 border border-amber-100">
              <AlertTriangle className="w-3 h-3" /> Select All That Apply
            </div>
            <h2 className="text-base font-semibold text-slate-800 leading-relaxed mb-6 max-w-3xl">
              {d.sataQuestion.stem}
            </h2>
            <div className="space-y-3 max-w-3xl">
              {d.sataQuestion.choices.map((c, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-3.5 px-5 py-3.5 rounded-xl border-2 cursor-pointer transition-all",
                  c.selected ? "bg-violet-50 border-violet-200" : "bg-white border-slate-100 hover:border-violet-200"
                )}>
                  <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                    c.selected ? "bg-violet-500 border-violet-500" : "border-slate-300"
                  )}>
                    {c.selected && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <span className={cn("text-sm leading-relaxed", c.selected ? "text-violet-800 font-medium" : "text-slate-600")}>
                    {c.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 gap-1 h-8">
              <Flag className="w-3 h-3" /> Flag
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 gap-1 h-8">
              <Calculator className="w-3 h-3" /> Calculator
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 gap-1 h-8">
              <Beaker className="w-3 h-3" /> Lab Values
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs h-8 gap-1 rounded-lg">
              <ChevronLeft className="w-3 h-3" /> Previous
            </Button>
            <Button size="sm" className="text-xs h-8 gap-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white">
              Next <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </DemoPageWrapper>
  );
}
