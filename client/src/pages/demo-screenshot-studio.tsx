// Demo Screenshot Studio - Admin-only hub for all marketing screenshot pages.
// NOT real learner data - for marketing screenshots and presentations only.

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3, Layers, BookOpen, Brain, Target, Eye, Calendar,
  GraduationCap, Crown, Award, Monitor, Flame, TrendingUp,
  Layout, FileText, Stethoscope, ArrowRight,
} from "lucide-react";
import { DemoPageWrapper, SectionCard } from "@/components/demo-shared";
import { demoProfiles } from "@/data/demo-adaptive-profiles";

import { useI18n } from "@/lib/i18n";
const screens = [
  { id: "adaptive-dashboard", title: "Adaptive Performance Dashboard", description: "Full analytics with readiness gauge, growth trend, category breakdown, and recommendations", icon: <BarChart3 className="w-5 h-5" />, path: "/admin/demo-adaptive-report", color: "bg-violet-50 text-violet-500" },
  { id: "exam-review", title: "Exam Review / Session Analysis", description: "Post-exam analytics with score summary, category performance, confidence analysis", icon: <Target className="w-5 h-5" />, path: "/admin/demo-exam-review", color: "bg-sky-50 text-sky-500" },
  { id: "flashcard-mastery", title: "Flashcard Mastery", description: "Spaced repetition analytics with retention trends, topic mastery, and weak concepts", icon: <Layers className="w-5 h-5" />, path: "/admin/demo-flashcard-mastery", color: "bg-emerald-50 text-emerald-500" },
  { id: "study-plan", title: "Personalized Study Plan", description: "Weekly plan with daily tasks, high-yield topics, and progress tracking", icon: <Calendar className="w-5 h-5" />, path: "/admin/demo-study-plan-screenshot", color: "bg-amber-50 text-amber-500" },
  { id: "lesson-rationale", title: "Lesson / Rationale Detail", description: "Premium question display with rationale, clinical pearls, and linked content", icon: <BookOpen className="w-5 h-5" />, path: "/admin/demo-lesson-rationale", color: "bg-rose-50 text-rose-500" },
  { id: "student-overview", title: "Student Overview / Account", description: "Profile dashboard with resume studying card, milestones, and daily goal", icon: <GraduationCap className="w-5 h-5" />, path: "/admin/demo-student-overview", color: "bg-indigo-50 text-indigo-500" },
  { id: "heatmap", title: "Topic Mastery Heatmap", description: "Multi-dimensional performance grid across content domains", icon: <Layout className="w-5 h-5" />, path: "/admin/demo-heatmap-grid", color: "bg-teal-50 text-teal-500" },
  { id: "cat-exam", title: "CAT Exam In-Progress", description: "Realistic adaptive exam interface with MCQ and SATA question types", icon: <FileText className="w-5 h-5" />, path: "/admin/demo-cat-exam", color: "bg-orange-50 text-orange-500" },
  { id: "ngn-case-study", title: "NGN Case Study", description: "Next-gen clinical judgment item with patient data, vitals, labs, and bowtie format", icon: <Stethoscope className="w-5 h-5" />, path: "/admin/demo-ngn-case-study", color: "bg-pink-50 text-pink-500" },
  { id: "premium-value", title: "Premium Subscription Value", description: "Feature comparison table with stats and pricing for conversion screenshots", icon: <Crown className="w-5 h-5" />, path: "/admin/demo-premium-value", color: "bg-violet-50 text-violet-500" },
  { id: "streak", title: "Study Streak & Consistency", description: "Streak analytics with activity calendar, milestone badges, and weekly hours", icon: <Flame className="w-5 h-5" />, path: "/admin/demo-streak-analytics", color: "bg-orange-50 text-orange-500" },
  { id: "comparison", title: "Session Comparison", description: "Side-by-side comparison of last 3 adaptive sessions with category trends", icon: <TrendingUp className="w-5 h-5" />, path: "/admin/demo-session-comparison", color: "bg-emerald-50 text-emerald-500" },
  { id: "hero-showcase", title: "Hero Showcase Strip", description: "Optimized layout of dashboard cards arranged for hero banner crops", icon: <Monitor className="w-5 h-5" />, path: "/admin/demo-hero-showcase", color: "bg-indigo-50 text-indigo-500" },
];

export default function DemoScreenshotStudio() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  if (!user || !isAdmin) {
    return (
      <DemoPageWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-slate-500">{t("pages.demoScreenshotStudio.adminAccessRequired")}</p>
        </div>
      </DemoPageWrapper>
    );
  }

  return (
    <DemoPageWrapper>
      <main className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-4">
            <Eye className="w-3.5 h-3.5" /> Demo Screenshot Mode
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">{t("pages.demoScreenshotStudio.screenshotStudio")}</h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Premium demo screens for marketing screenshots, hero banners, and landing page visuals. All data is hardcoded and does not affect production.
          </p>
        </div>

        <SectionCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">{t("pages.demoScreenshotStudio.demoProfiles")}</h3>
            <span className="text-[10px] text-slate-400">{t("pages.demoScreenshotStudio.defaultProfileIsUsedOn")}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {demoProfiles.map((dp, i) => (
              <div key={dp.id} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors",
                i === 0 ? "bg-violet-50/50 border-violet-200" : "bg-white border-slate-100"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
                  i === 0 ? "bg-gradient-to-br from-violet-400 to-indigo-500 text-white shadow-md shadow-violet-200/50" : "bg-slate-100 text-slate-500"
                )}>{dp.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{dp.name}</p>
                  <p className="text-xs text-slate-500">{dp.track}</p>
                </div>
                {i === 0 && <span className="ml-auto text-[9px] font-semibold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded">{t("pages.demoScreenshotStudio.default")}</span>}
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => setLocation(screen.path)}
              className="text-left bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md hover:border-violet-200 transition-all group"
              data-testid={`screen-${screen.id}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", screen.color)}>
                  {screen.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-700 group-hover:text-violet-700 transition-colors">{screen.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{screen.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-end text-xs text-slate-400 group-hover:text-violet-500 transition-colors">
                <span>{t("pages.demoScreenshotStudio.openScreen")}</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </button>
          ))}
        </div>
      </main>
    </DemoPageWrapper>
  );
}
