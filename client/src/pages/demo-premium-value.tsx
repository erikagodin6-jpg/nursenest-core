// Demo screenshot component - NOT real learner data.

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, Crown, Shield, Zap, Star, Award,
  BookOpen, Brain, BarChart3, Layers, ArrowRight, Sparkles,
} from "lucide-react";
import { DemoPageWrapper, DemoHeader, SectionCard, SectionTitle } from "@/components/demo-shared";
import { premiumPlanData as d } from "@/data/demo-screenshot-data";

import { useI18n } from "@/lib/i18n";
export default function DemoPremiumValue() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoPremiumValue.adminAccessRequired")}</p></div></DemoPageWrapper>;

  return (
    <DemoPageWrapper>
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-xs font-semibold mb-4">
            <Crown className="w-3.5 h-3.5" /> Premium Plan
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">{t("pages.demoPremiumValue.everythingYouNeedToPass")}</h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Comprehensive adaptive exam preparation with personalized analytics, mastery tracking, and intelligent study plans.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Pass Rate", value: d.stats.passRate, icon: <Shield className="w-4 h-4" />, accent: "bg-emerald-50 text-emerald-500" },
            { label: "Score Improvement", value: d.stats.avgScoreImprovement, icon: <BarChart3 className="w-4 h-4" />, accent: "bg-violet-50 text-violet-500" },
            { label: "Students Enrolled", value: d.stats.studentsEnrolled, icon: <Star className="w-4 h-4" />, accent: "bg-amber-50 text-amber-500" },
            { label: "Satisfaction", value: d.stats.satisfaction, icon: <Award className="w-4 h-4" />, accent: "bg-sky-50 text-sky-500" },
          ].map((s) => (
            <SectionCard key={s.label} className="text-center py-5">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2", s.accent)}>{s.icon}</div>
              <p className="text-2xl font-bold text-slate-800 mb-0.5">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </SectionCard>
          ))}
        </div>

        <SectionCard className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm font-semibold text-slate-700 pb-4 pr-4">{t("pages.demoPremiumValue.feature")}</th>
                  <th className="text-center text-sm font-semibold text-slate-500 pb-4 w-32">{t("pages.demoPremiumValue.free")}</th>
                  <th className="text-center pb-4 w-40">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold">
                      <Crown className="w-3 h-3" /> Premium
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {d.features.map((f, i) => (
                  <tr key={f.name} className={cn("border-t border-slate-50", i % 2 === 0 && "bg-slate-50/30")}>
                    <td className="py-3 pr-4">
                      <span className="text-sm text-slate-700 font-medium">{f.name}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-sm text-slate-400">{f.free}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-sm text-violet-700 font-semibold">{f.premium}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="text-center">
          <SectionCard className="inline-block bg-gradient-to-r from-violet-50 via-white to-indigo-50 max-w-xl">
            <div className="py-4">
              <p className="text-sm text-slate-500 mb-1">{t("pages.demoPremiumValue.startingAt")}</p>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-800">${d.yearlyPrice}</span>
                <span className="text-sm text-slate-500">/year</span>
              </div>
              <p className="text-xs text-slate-400 mb-5">or ${d.monthlyPrice}/month</p>
              <div className="flex items-center justify-center gap-3">
                <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold px-8 h-11 gap-2 shadow-lg shadow-violet-200/50">
                  <Sparkles className="w-4 h-4" /> Start Premium
                </Button>
                <Button variant="outline" className="rounded-xl text-sm font-semibold px-6 h-11 gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50">
                  Start Free Trial
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 mt-3">{t("pages.demoPremiumValue.14dayFreeTrialCancelAnytime")}</p>
            </div>
          </SectionCard>
        </div>
      </main>
    </DemoPageWrapper>
  );
}
