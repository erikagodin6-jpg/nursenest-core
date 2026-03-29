import { LocaleLink } from "@/lib/LocaleLink";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { getTierConfig } from "@shared/tier-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useProtectedFetch } from "@/components/protected-access-recovery";
import {
  LayoutDashboard, BookOpen, FlaskConical, Brain, FileText,
  TrendingUp, Plus, X, Eye, EyeOff,
  Stethoscope, Pill, Activity, ClipboardList, Award, Target,
  ChevronUp, ChevronDown, BarChart3, Bookmark, Clock,
  Sparkles, ArrowRight, CheckCircle2, PlayCircle, Flame,
  RotateCcw, Lock, Bot, Gauge, Lightbulb, CalendarClock, AlertTriangle, BarChart,
  Zap, SlidersHorizontal, Trophy, PartyPopper, RefreshCw
} from "lucide-react";
import { canAccessFeature, type Feature } from "@/lib/entitlements";
import { TrialDashboardWidget } from "@/components/trial-dashboard-widget";
import {
  PostExamFollowupModal,
  NewGradTransitionCard,
  RecoveryPlanCard,
  ResultsPendingCard,
  PostponedCountdownCard,
  usePostExamCheck,
} from "@/components/post-exam-followup";
import { CommandCenter } from "@/components/command-center";
import { getAuthHeaders } from "@/lib/queryClient";
import {
  readApiJsonResponse,
  getLearnerMessageForCode,
  BackendErrorCodes,
  isAuthRequiredCode,
} from "@/lib/api-error";

type WidgetConfig = {
  widgetType: string;
  position: number;
  visible: boolean;
  config?: any;
};

const WIDGET_ICONS: Record<string, any> = {
  welcome: LayoutDashboard,
  continue_where_left_off: RefreshCw,
  progress: TrendingUp,
  recent_lessons: BookOpen,
  quick_links: Target,
  exam_stats: Award,
  study_streak: Flame,
  qotd_teaser: Target,
  flashcard_review: Brain,
  clinical_tools: Stethoscope,
  recommended: Sparkles,
  pass_probability: Gauge,
  adaptive_engine: Brain,
  ai_study_coach: Bot,
  intelligent_recommendations: Lightbulb,
  study_workload: CalendarClock,
  quick_study: PlayCircle,
  review_due: RotateCcw,
  topic_mastery: BarChart,
  exam_readiness: Gauge,
  weak_topics: AlertTriangle,
  bookmarks_preview: Bookmark,
  recent_activity: Activity,
  performance_overview: BarChart3,
  post_exam_new_grad: PartyPopper,
  post_exam_recovery: Target,
  post_exam_pending: Clock,
  post_exam_postponed: CalendarClock,
};

const WIDGET_COMPONENTS: Record<string, React.FC<{ user: any }>> = {
  welcome: WelcomeWidget,
  continue_where_left_off: ContinueWhereYouLeftOffWidget,
  progress: ProgressWidget,
  recent_lessons: RecentLessonsWidget,
  quick_links: QuickLinksWidget,
  exam_stats: ExamStatsWidget,
  study_streak: StudyStreakWidget,
  qotd_teaser: QotdTeaserWidget,
  flashcard_review: FlashcardReviewWidget,
  clinical_tools: ClinicalToolsWidget,
  recommended: RecommendedWidget,
  pass_probability: PassProbabilityWidget,
  adaptive_engine: AdaptiveEngineWidget,
  ai_study_coach: AiStudyCoachWidget,
  intelligent_recommendations: IntelligentRecommendationsWidget,
  study_workload: StudyWorkloadWidget,
  quick_study: QuickStudyWidget,
  review_due: ReviewDueWidget,
  topic_mastery: TopicMasteryWidget,
  exam_readiness: ExamReadinessWidget,
  weak_topics: WeakTopicsWidget,
  bookmarks_preview: BookmarksPreviewWidget,
  recent_activity: RecentActivityWidget,
  performance_overview: PerformanceOverviewWidget,
  post_exam_new_grad: PostExamNewGradWidget,
  post_exam_recovery: PostExamRecoveryWidget,
  post_exam_pending: PostExamPendingWidget,
  post_exam_postponed: PostExamPostponedWidget,
};

const WIDGET_I18N_KEYS: Record<string, { label: string; desc: string }> = {
  welcome: { label: "dashboard.widget.welcome", desc: "dashboard.widget.welcomeDesc" },
  continue_where_left_off: { label: "Continue Where You Left Off", desc: "Resume in-progress exams and quizzes" },
  progress: { label: "dashboard.widget.progress", desc: "dashboard.widget.progressDesc" },
  recent_lessons: { label: "dashboard.widget.recentLessons", desc: "dashboard.widget.recentLessonsDesc" },
  quick_links: { label: "dashboard.widget.quickLinks", desc: "dashboard.widget.quickLinksDesc" },
  exam_stats: { label: "dashboard.widget.examStats", desc: "dashboard.widget.examStatsDesc" },
  study_streak: { label: "dashboard.widget.studyStreak", desc: "dashboard.widget.studyStreakDesc" },
  qotd_teaser: { label: "Question of the Day", desc: "Daily practice question with streak tracking" },
  flashcard_review: { label: "dashboard.widget.flashcardReview", desc: "dashboard.widget.flashcardReviewDesc" },
  clinical_tools: { label: "dashboard.widget.clinicalTools", desc: "dashboard.widget.clinicalToolsDesc" },
  recommended: { label: "dashboard.widget.recommended", desc: "dashboard.widget.recommendedDesc" },
  pass_probability: { label: "dashboard.widget.passProbability", desc: "dashboard.widget.passProbabilityDesc" },
  adaptive_engine: { label: "dashboard.widget.adaptiveEngine", desc: "dashboard.widget.adaptiveEngineDesc" },
  ai_study_coach: { label: "dashboard.widget.aiStudyCoach", desc: "dashboard.widget.aiStudyCoachDesc" },
  intelligent_recommendations: { label: "dashboard.widget.smartRecommendations", desc: "dashboard.widget.smartRecommendationsDesc" },
  study_workload: { label: "dashboard.widget.studyWorkload", desc: "dashboard.widget.studyWorkloadDesc" },
  quick_study: { label: "dashboard.widget.quickStudy", desc: "dashboard.widget.quickStudyDesc" },
  review_due: { label: "dashboard.widget.reviewDue", desc: "dashboard.widget.reviewDueDesc" },
  topic_mastery: { label: "dashboard.widget.topicMastery", desc: "dashboard.widget.topicMasteryDesc" },
  exam_readiness: { label: "dashboard.widget.examReadiness", desc: "dashboard.widget.examReadinessDesc" },
  weak_topics: { label: "dashboard.widget.weakTopics", desc: "dashboard.widget.weakTopicsDesc" },
  bookmarks_preview: { label: "dashboard.widget.bookmarks", desc: "dashboard.widget.bookmarksDesc" },
  recent_activity: { label: "dashboard.widget.recentActivity", desc: "dashboard.widget.recentActivityDesc" },
  performance_overview: { label: "dashboard.widget.performanceOverview", desc: "dashboard.widget.performanceOverviewDesc" },
  post_exam_new_grad: { label: "dashboard.widget.newGradTransition", desc: "dashboard.widget.newGradTransitionDesc" },
  post_exam_recovery: { label: "dashboard.widget.recoveryPlan", desc: "dashboard.widget.recoveryPlanDesc" },
  post_exam_pending: { label: "dashboard.widget.resultsPending", desc: "dashboard.widget.resultsPendingDesc" },
  post_exam_postponed: { label: "dashboard.widget.examPostponed", desc: "dashboard.widget.examPostponedDesc" },
};

const PREMIUM_WIDGET_FEATURES: Record<string, Feature> = {
  pass_probability: "pass_probability_model",
  adaptive_engine: "adaptive_engine",
  ai_study_coach: "ai_study_coach",
  intelligent_recommendations: "intelligent_recommendations",
};

const PREMIUM_WIDGET_MESSAGE_KEYS: Record<string, string> = {
  pass_probability: "dashboard.premiumPassProbability",
  adaptive_engine: "dashboard.premiumAdaptiveEngine",
  ai_study_coach: "dashboard.premiumAiStudyCoach",
  intelligent_recommendations: "dashboard.premiumIntelligentRecommendations",
};

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { widgetType: "continue_where_left_off", position: 0, visible: true },
  { widgetType: "progress", position: 1, visible: true },
  { widgetType: "qotd_teaser", position: 2, visible: true },
  { widgetType: "recommended", position: 3, visible: true },
  { widgetType: "adaptive_engine", position: 4, visible: true },
  { widgetType: "recent_lessons", position: 5, visible: true },
  { widgetType: "quick_links", position: 6, visible: true },
  { widgetType: "exam_stats", position: 7, visible: true },
  { widgetType: "flashcard_review", position: 8, visible: true },
  { widgetType: "clinical_tools", position: 9, visible: true },
  { widgetType: "ai_study_coach", position: 10, visible: true },
  { widgetType: "intelligent_recommendations", position: 11, visible: true },
  { widgetType: "quick_study", position: 12, visible: true },
  { widgetType: "review_due", position: 13, visible: true },
  { widgetType: "topic_mastery", position: 14, visible: true },
  { widgetType: "bookmarks_preview", position: 15, visible: true },
  { widgetType: "recent_activity", position: 16, visible: true },
  { widgetType: "performance_overview", position: 17, visible: true },
];

function useDashboardSummary(userId: string | undefined) {
  const [summary, setSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<{ code?: string; message: string } | null>(null);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    let cancelled = false;
    setSummaryLoading(true);
    setSummaryError(null);
    (async () => {
      try {
        const res = await fetch("/api/dashboard/summary", {
          headers: { ...getAuthHeaders(), "x-user-id": userId },
          credentials: "include",
          signal: controller.signal,
        });
        const parsed = await readApiJsonResponse(res);
        if (cancelled) return;
        if (!parsed.ok) {
          setSummary(null);
          if (isAuthRequiredCode(parsed.code, parsed.status)) {
            setSummaryError({
              code: parsed.code || BackendErrorCodes.AUTH_REQUIRED,
              message: getLearnerMessageForCode(parsed.code, parsed.message),
            });
          } else {
            setSummaryError({
              code: parsed.code,
              message: getLearnerMessageForCode(parsed.code, parsed.message),
            });
          }
          return;
        }
        setSummary(parsed.data);
      } catch (e: unknown) {
        if (cancelled || (e instanceof Error && e.name === "AbortError")) return;
        setSummary(null);
        setSummaryError({ message: "Could not load dashboard summary." });
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userId]);

  return { summary, summaryLoading, summaryError };
}

const DashboardSummaryContext = React.createContext<any>(null);

export default function DashboardPage() {
  const { user, effectiveTier } = useAuth();
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const protectedFetch = useProtectedFetch("dashboard");
  const [widgets, setWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const { summary, summaryLoading, summaryError } = useDashboardSummary(user?.id);

  const {
    shouldShowModal,
    postExamStatus,
    submitResult,
    setShouldShowModal,
    reopenModal,
    refresh: refreshPostExam,
  } = usePostExamCheck(user?.id);

  useEffect(() => {
    const handler = () => reopenModal();
    window.addEventListener("post-exam-reopen-modal", handler);
    return () => window.removeEventListener("post-exam-reopen-modal", handler);
  }, [reopenModal]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    let cancelled = false;
    protectedFetch("/api/dashboard-widgets", {
      headers: { "x-user-id": user.id },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data: any[]) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
          const loaded = sorted.map((d) => ({
            widgetType: d.widgetType,
            position: d.position,
            visible: d.visible,
            config: d.config,
          }));
          const existingTypes = new Set(loaded.map((w) => w.widgetType));
          const missing = DEFAULT_WIDGETS.filter((dw) => !existingTypes.has(dw.widgetType));
          if (missing.length > 0) {
            const maxPos = Math.max(...loaded.map((w) => w.position), -1);
            missing.forEach((m, i) => {
              loaded.push({ ...m, position: maxPos + 1 + i });
            });
          }
          setWidgets(loaded);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const saveWidgets = useCallback(async (newWidgets: WidgetConfig[]) => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard-widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ widgets: newWidgets }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: t("dashboard.savedTitle"), description: t("dashboard.savedDesc") });
    } catch {
      toast({ title: t("dashboard.errorTitle"), description: t("dashboard.errorDesc"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [user, toast]);

  function moveWidget(index: number, direction: "up" | "down") {
    const newWidgets = [...widgets];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
    const reindexed = newWidgets.map((w, i) => ({ ...w, position: i }));
    setWidgets(reindexed);
  }

  function toggleWidget(index: number) {
    const newWidgets = [...widgets];
    newWidgets[index] = { ...newWidgets[index], visible: !newWidgets[index].visible };
    setWidgets(newWidgets);
  }

  function addWidget(widgetType: string) {
    if (widgets.find((w) => w.widgetType === widgetType)) return;
    const newWidgets = [...widgets, { widgetType, position: widgets.length, visible: true }];
    setWidgets(newWidgets);
  }

  function removeWidget(index: number) {
    const newWidgets = widgets.filter((_, i) => i !== index).map((w, i) => ({ ...w, position: i }));
    setWidgets(newWidgets);
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newWidgets = [...widgets];
    const [moved] = newWidgets.splice(dragIndex, 1);
    newWidgets.splice(index, 0, moved);
    const reindexed = newWidgets.map((w, i) => ({ ...w, position: i }));
    setWidgets(reindexed);
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  async function handleSave() {
    await saveWidgets(widgets);
    setEditing(false);
  }

  async function handleReset() {
    setWidgets(DEFAULT_WIDGETS);
    await saveWidgets(DEFAULT_WIDGETS);
    setEditing(false);
  }

  if (!user) return null;

  const postExamWidgetTypes = ["post_exam_new_grad", "post_exam_recovery", "post_exam_pending", "post_exam_postponed"];
  const postExamWidgetType = postExamStatus?.hasResult
    ? postExamStatus.status === "passed" ? "post_exam_new_grad"
    : postExamStatus.status === "didnt_pass" ? "post_exam_recovery"
    : postExamStatus.status === "waiting" ? "post_exam_pending"
    : postExamStatus.status === "postponed" ? "post_exam_postponed"
    : null
    : null;

  const baseWidgets = widgets.filter((w) => !postExamWidgetTypes.includes(w.widgetType));
  const activeWidgets = postExamWidgetType
    ? [
        ...baseWidgets.slice(0, 1),
        { widgetType: postExamWidgetType, position: 0.5, visible: true },
        ...baseWidgets.slice(1),
      ]
    : baseWidgets;

  const visibleWidgets = activeWidgets.filter((w) => w.visible && WIDGET_COMPONENTS[w.widgetType]);
  const availableToAdd = Object.keys(WIDGET_COMPONENTS).filter(
    (key) => !activeWidgets.find((w) => w.widgetType === key) && !postExamWidgetTypes.includes(key)
  );

  const WIDGET_SECTIONS: Record<string, { labelKey: string; types: Set<string> }> = {
    post_exam: { labelKey: "dashboard.sectionPostExam", types: new Set(["post_exam_new_grad", "post_exam_recovery", "post_exam_pending", "post_exam_postponed"]) },
    progress: { labelKey: "dashboard.sectionProgress", types: new Set(["progress", "exam_stats", "performance_overview"]) },
    study: { labelKey: "dashboard.sectionStudyTools", types: new Set(["quick_links", "quick_study", "flashcard_review", "review_due", "recent_lessons", "bookmarks_preview", "qotd_teaser"]) },
    smart: { labelKey: "dashboard.sectionSmartInsights", types: new Set(["recommended", "adaptive_engine", "ai_study_coach", "intelligent_recommendations", "topic_mastery", "clinical_tools"]) },
  };

  function getWidgetSection(widgetType: string): string {
    for (const [key, section] of Object.entries(WIDGET_SECTIONS)) {
      if (section.types.has(widgetType)) return key;
    }
    return "smart";
  }

  return (
    <DashboardSummaryContext.Provider value={summary}>
    <div className="min-h-screen bg-background animate-page-enter" data-testid="dashboard-page">
      <SEO
        title={t("pages.dashboard.myDashboardPersonalizedLearningHub")}
        description={t("pages.dashboard.yourPersonalizedNursingLearningDashboard")}
        keywords="nursing dashboard, NCLEX study tracker, nursing education progress, clinical learning tools"
        canonicalPath="/dashboard"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "NurseNest Dashboard",
          "description": "Personalized nursing student learning dashboard with progress tracking, exam stats, and clinical tools.",
          "url": "https://www.nursenest.ca/dashboard",
          "isPartOf": { "@type": "WebSite", "name": "NurseNest", "url": "https://www.nursenest.ca" },
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Dashboard", url: "https://www.nursenest.ca/dashboard" },
        ]}
      />
      <Navigation />
      <PostExamFollowupModal
        isOpen={shouldShowModal}
        onClose={() => setShouldShowModal(false)}
        onSubmit={submitResult}
      />
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl" role="main" aria-label={t("pages.dashboard.learningDashboard")}>
        <nav aria-label={t("pages.dashboard.breadcrumb")} className="mb-4">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><LocaleLink href="/" className="hover:text-primary transition-colors" data-testid="link-breadcrumb-home">{t("dashboard.breadcrumbHome")}</LocaleLink></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-foreground">{t("dashboard.breadcrumbDashboard")}</li>
          </ol>
        </nav>

        <div className="mb-6">
          <CommandCenter />
        </div>

        {!summaryLoading && summary && (summary.isNewUser || (
          (summary.continueWhereYouLeftOff?.length ?? 0) === 0 &&
          (summary.progress?.overallStats?.totalQuestionsAnswered ?? 0) < 25
        )) && (
          <Card className="mb-6 border-primary/25 bg-gradient-to-r from-primary/5 to-transparent" data-testid="dashboard-next-step">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {t("dashboard.nextStepTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("dashboard.nextStepEmptyDesc")}</p>
              {summary.recommendedNextAction?.path ? (
                <Button size="sm" className="w-full sm:w-auto" asChild>
                  <LocaleLink href={summary.recommendedNextAction.path}>{summary.recommendedNextAction.action}</LocaleLink>
                </Button>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild>
                  <LocaleLink href="/lessons">{t("dashboard.nextStepBrowseLessons")}</LocaleLink>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <LocaleLink href="/flashcards">{t("dashboard.nextStepOpenFlashcards")}</LocaleLink>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <LocaleLink href="/mock-exams">{t("dashboard.nextStepMockExams")}</LocaleLink>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <LocaleLink href="/question-bank">{t("dashboard.nextStepQuestionBank")}</LocaleLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <TrialDashboardWidget />

        {summaryError && (
          <div
            className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            role="alert"
            data-testid="dashboard-summary-warning"
          >
            <div className="flex gap-2 items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Some dashboard data did not load</p>
                <p className="text-sm text-amber-800">{summaryError.message}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {summaryError.code === BackendErrorCodes.AUTH_REQUIRED ? (
                <Button size="sm" onClick={() => navigate("/login?returnUrl=/dashboard")}>
                  Sign in
                </Button>
              ) : null}
              <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                Refresh page
              </Button>
              {summaryError.code !== BackendErrorCodes.AUTH_REQUIRED ? (
                <Button size="sm" variant="ghost" asChild>
                  <LocaleLink href="/lessons">{t("dashboard.summaryErrorSecondary")}</LocaleLink>
                </Button>
              ) : null}
            </div>
          </div>
        )}

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" data-testid="text-dashboard-title">{t("dashboard.pageTitle")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t("dashboard.pageSubtitle")}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {editing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-reset-dashboard" aria-label={t("pages.dashboard.resetDashboardToDefaultLayout")}>
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">{t("dashboard.reset")}</span>
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving} data-testid="button-save-dashboard">
                  {saving ? t("dashboard.saving") : t("dashboard.saveLayout")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)} data-testid="button-cancel-edit" aria-label={t("pages.dashboard.cancelEditing")}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="text-muted-foreground" data-testid="button-customize-dashboard" aria-label={t("pages.dashboard.customizeDashboardLayout")}>
                <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                {t("dashboard.customize")}
              </Button>
            )}
          </div>
        </header>

        {editing && availableToAdd.length > 0 && (
          <section className="mb-6" aria-label={t("pages.dashboard.addWidgets")}>
            <Card className="border-dashed border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" /> {t("dashboard.addWidgets")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availableToAdd.map((key) => {
                    const keys = WIDGET_I18N_KEYS[key];
                    const Icon = WIDGET_ICONS[key];
                    const label = t(keys.label);
                    return (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() => addWidget(key)}
                        className="gap-1.5"
                        data-testid={`button-add-widget-${key}`}
                        aria-label={`Add ${label} widget`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" aria-busy="true" aria-label={t("pages.dashboard.loadingDashboard")}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="skeleton-text w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="skeleton-text w-full" />
                    <div className="skeleton-text w-3/4" />
                    <div className="skeleton-text w-1/2" />
                    <div className="flex gap-2 mt-4">
                      <div className="skeleton-block h-8 w-20" />
                      <div className="skeleton-block h-8 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <section className="space-y-8" aria-label={t("pages.dashboard.dashboardWidgets")}>
            {(() => {
              const displayWidgets = editing ? widgets : visibleWidgets;
              const sectionOrder = ["post_exam", "progress", "study", "smart"];
              
              if (editing) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {displayWidgets.map((widget, index) => {
                      const WidgetComponent = WIDGET_COMPONENTS[widget.widgetType];
                      const keys = WIDGET_I18N_KEYS[widget.widgetType];
                      if (!WidgetComponent || !keys) return null;
                      const Icon = WIDGET_ICONS[widget.widgetType];
                      const widgetLabel = t(keys.label);
                      const isFullWidth = widget.widgetType === "recommended";
                      return (
                        <article key={widget.widgetType} className={`relative cursor-move ${!widget.visible ? "opacity-50" : ""} ${isFullWidth ? "md:col-span-2" : ""}`} aria-label={`${widgetLabel} widget`} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} data-testid={`widget-${widget.widgetType}`}>
                          <Card className="h-full transition-all duration-200 premium-card ring-2 ring-primary/20 hover:ring-primary/40">
                            <div className="absolute top-2 right-2 flex items-center gap-0.5 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-0.5">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveWidget(index, "up")} disabled={index === 0} data-testid={`button-move-up-${widget.widgetType}`} aria-label={`Move ${widgetLabel} up`}><ChevronUp className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveWidget(index, "down")} disabled={index === displayWidgets.length - 1} data-testid={`button-move-down-${widget.widgetType}`} aria-label={`Move ${widgetLabel} down`}><ChevronDown className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidget(index)} data-testid={`button-toggle-${widget.widgetType}`} aria-label={widget.visible ? `Hide ${widgetLabel}` : `Show ${widgetLabel}`}>
                                {widget.visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeWidget(index)} data-testid={`button-remove-${widget.widgetType}`} aria-label={`Remove ${widgetLabel}`}><X className="h-3 w-3" /></Button>
                            </div>
                            <CardHeader className="pb-2 pt-4">
                              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                {Icon && <Icon className="h-4 w-4 text-primary/60" />}
                                {widgetLabel}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {(() => {
                                const featureKey = PREMIUM_WIDGET_FEATURES[widget.widgetType];
                                if (featureKey && !canAccessFeature(effectiveTier, featureKey)) return <PremiumLockedWidget widgetType={widget.widgetType} />;
                                return <WidgetComponent user={user} />;
                              })()}
                            </CardContent>
                          </Card>
                        </article>
                      );
                    })}
                  </div>
                );
              }

              const grouped: Record<string, typeof displayWidgets> = {};
              displayWidgets.forEach((w) => {
                const section = getWidgetSection(w.widgetType);
                if (!grouped[section]) grouped[section] = [];
                grouped[section].push(w);
              });

              return sectionOrder.map((sectionKey) => {
                const sectionWidgets = grouped[sectionKey];
                if (!sectionWidgets || sectionWidgets.length === 0) return null;
                const sectionConfig = WIDGET_SECTIONS[sectionKey];
                const sectionLabel = sectionConfig.labelKey ? t(sectionConfig.labelKey) : null;
                return (
                  <div key={sectionKey} className="dashboard-module rounded-xl">
                    {sectionLabel && (
                      <div className="flex items-center gap-2 mb-4 px-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{sectionLabel}</h2>
                        <div className="flex-1 h-px bg-border/50" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      {sectionWidgets.map((widget) => {
                        const WidgetComponent = WIDGET_COMPONENTS[widget.widgetType];
                        const keys = WIDGET_I18N_KEYS[widget.widgetType];
                        if (!WidgetComponent || !keys) return null;
                        const Icon = WIDGET_ICONS[widget.widgetType];
                        const widgetLabel = t(keys.label);
                        const isFullWidth = widget.widgetType === "recommended";
                        return (
                          <article key={widget.widgetType} className={`relative ${isFullWidth ? "md:col-span-2" : ""}`} aria-label={`${widgetLabel} widget`} data-testid={`widget-${widget.widgetType}`}>
                            <Card className="h-full transition-all duration-200 premium-card border-gray-200/60 hover:shadow-lg hover:shadow-gray-100/50">
                              <CardHeader className="pb-2 pt-4">
                                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                  {Icon && <Icon className="h-4 w-4 text-primary/60" />}
                                  {widgetLabel}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {(() => {
                                  const featureKey = PREMIUM_WIDGET_FEATURES[widget.widgetType];
                                  if (featureKey && !canAccessFeature(effectiveTier, featureKey)) return <PremiumLockedWidget widgetType={widget.widgetType} />;
                                  return <WidgetComponent user={user} />;
                                })()}
                              </CardContent>
                            </Card>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </section>
        )}
      </main>
      <Footer />
    </div>
    </DashboardSummaryContext.Provider>
  );
}

function WelcomeWidget({ user }: { user: any }) {
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("dashboard.greeting.morning") : hour < 17 ? t("dashboard.greeting.afternoon") : t("dashboard.greeting.evening");
  const config = getTierConfig(user.tier || "free");

  const tierQuickActions: Record<string, Array<{ label: string; path: string; icon: any; variant?: "default" | "outline" }>> = {
    free: [
      { label: "Try Free Practice", path: "/test-bank", icon: FlaskConical, variant: "default" },
      { label: "Browse Lessons", path: "/lessons", icon: BookOpen, variant: "outline" },
      { label: "View Plans", path: "/pricing", icon: Award, variant: "outline" },
    ],
    rpn: [
      { label: config.examNames.practice, path: "/mock-exams", icon: ClipboardList, variant: "default" },
      { label: "Test Bank", path: "/test-bank", icon: FlaskConical, variant: "outline" },
      { label: "Flashcards", path: "/flashcard-study", icon: Brain, variant: "outline" },
      { label: "Lessons", path: "/lessons", icon: BookOpen, variant: "outline" },
    ],
    rn: [
      { label: config.examNames.practice, path: "/mock-exams", icon: ClipboardList, variant: "default" },
      { label: "Test Bank", path: "/test-bank", icon: FlaskConical, variant: "outline" },
      { label: "Flashcards", path: "/flashcard-study", icon: Brain, variant: "outline" },
      { label: "Question of the Day", path: "/question-of-the-day", icon: Target, variant: "outline" },
    ],
    np: [
      { label: config.examNames.practice, path: "/mock-exams", icon: ClipboardList, variant: "default" },
      { label: "Test Bank", path: "/test-bank", icon: FlaskConical, variant: "outline" },
      { label: "Flashcards", path: "/flashcard-study", icon: Brain, variant: "outline" },
      { label: "Question of the Day", path: "/question-of-the-day", icon: Target, variant: "outline" },
    ],
    admin: [
      { label: "Mock Exams", path: "/mock-exams", icon: ClipboardList, variant: "default" },
      { label: "Test Bank", path: "/test-bank", icon: FlaskConical, variant: "outline" },
      { label: "Admin Panel", path: "/admin", icon: Activity, variant: "outline" },
      { label: "Question of the Day", path: "/question-of-the-day", icon: Target, variant: "outline" },
    ],
  };

  const actions = tierQuickActions[user.tier] || tierQuickActions.free;

  return (
    <div className="dashboard-hero rounded-xl p-1" data-testid="widget-content-welcome">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight mb-1">{greeting}, {user.username}!</p>
          <p className="text-sm text-muted-foreground">
            {config.dashboardSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="dashboard-stat-card px-4 py-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t("dashboard.plan")}</p>
            <p className="text-sm font-bold text-primary">{config.displayName}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button key={action.path} size="sm" variant={action.variant || "outline"} onClick={() => navigate(action.path)} className={action.variant === "default" ? "shadow-sm shadow-primary/15" : ""} data-testid={`button-go-${action.path.replace(/\//g, "")}`}>
            <action.icon className="h-4 w-4 mr-1.5" /> {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ContinueWhereYouLeftOffWidget({ user }: { user: any }) {
  const summary = useContext(DashboardSummaryContext);
  const [fallbackSessions, setFallbackSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  const summaryItems = summary?.continueWhereYouLeftOff;

  useEffect(() => {
    if (summaryItems && summaryItems.length > 0) {
      setLoading(false);
      return;
    }
    if (!user?.id) { setLoading(false); return; }
    const headers: Record<string, string> = {};
    try {
      const creds = localStorage.getItem("nursenest-credentials");
      if (creds) {
        const { username, password } = JSON.parse(creds);
        headers["x-username"] = username;
        headers["x-password"] = password;
      }
    } catch {}
    fetch("/api/session-checkpoint/active", { headers })
      .then((r) => r.ok ? r.json() : { sessions: [] })
      .then((data) => setFallbackSessions(data.sessions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, summaryItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6" data-testid="widget-continue-loading">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (summaryItems && summaryItems.length > 0) {
    const typeLabel = (type: string) => {
      if (type === "cat_session" || type === "cat_exam") return "CAT Exam";
      if (type === "mock_exam") return "Mock Exam";
      if (type === "lesson") return "Lesson";
      if (type === "test_bank") return "Test Bank";
      return type.replace(/[_-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    };

    const formatTimeAgo = (dateStr: string) => {
      if (!dateStr) return "";
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    };

    return (
      <div data-testid="widget-content-continue">
        <div className="space-y-2">
          {summaryItems.slice(0, 4).map((item: any, i: number) => (
            <button
              key={`${item.type}-${item.id}-${i}`}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.07] transition-all text-left group"
              onClick={() => navigate(item.resumePath || "/dashboard")}
              data-testid={`link-resume-session-${i}`}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                <RefreshCw className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" data-testid={`text-session-type-${i}`}>{typeLabel(item.type)}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  {item.progress && <span data-testid={`text-session-progress-${i}`}>{item.progress}</span>}
                  {item.isPaused && <span className="text-amber-600 font-medium">Paused</span>}
                  {item.lastAccessed && <span data-testid={`text-session-ago-${i}`}>{formatTimeAgo(item.lastAccessed)}</span>}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (fallbackSessions.length === 0) {
    if (summary?.isNewUser) {
      return (
        <div className="text-center py-4" data-testid="widget-content-continue-empty">
          <PlayCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">No sessions in progress yet</p>
          <Button size="sm" variant="link" onClick={() => navigate("/lessons")} data-testid="button-start-first-session">
            Start your first lesson <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      );
    }
    return null;
  }

  const sessionTypeLabel = (type: string) => {
    if (type === "qbank-exam") return "QBank Exam";
    if (type === "mock-exam") return "Mock Exam";
    if (type === "cat-exam") return "CAT Exam";
    if (type === "lesson-quiz") return "Lesson Quiz";
    return type.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  };

  const sessionResumePath = (type: string, _id: string) => {
    if (type === "qbank-exam") return "/qbank-exam";
    if (type === "mock-exam" || type === "cat-exam") return "/mock-exams";
    if (type === "lesson-quiz") return "/lessons";
    return "/practice";
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return "1d ago";
  };

  const formatElapsed = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div data-testid="widget-content-continue">
      <div className="space-y-2">
        {fallbackSessions.slice(0, 3).map((s, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.07] transition-all text-left group"
            onClick={() => navigate(sessionResumePath(s.sessionType, s.sessionId))}
            data-testid={`link-resume-session-${i}`}
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
              <RefreshCw className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" data-testid={`text-session-type-${i}`}>{sessionTypeLabel(s.sessionType)}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                {s.answeredCount > 0 && (
                  <span data-testid={`text-session-answered-${i}`}>Q{s.currentIndex + 1} · {s.answeredCount} answered</span>
                )}
                {s.timeSpent > 0 && (
                  <span data-testid={`text-session-time-${i}`}>{formatElapsed(s.timeSpent)}</span>
                )}
                <span data-testid={`text-session-ago-${i}`}>{formatTimeAgo(s.updatedAt)}</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}

const progressCache = new Map<string, { data: any[]; ts: number }>();
const progressInflight = new Map<string, Promise<any[]>>();
function useSharedProgress(userId: string) {
  const [progress, setProgress] = useState<any[]>(() => {
    const cached = progressCache.get(userId);
    return cached && Date.now() - cached.ts < 30000 ? cached.data : [];
  });
  useEffect(() => {
    const cached = progressCache.get(userId);
    if (cached && Date.now() - cached.ts < 30000) {
      setProgress(cached.data);
      return;
    }
    let pending = progressInflight.get(userId);
    if (!pending) {
      pending = fetch(`/api/progress/${userId}`)
        .then((r) => r.json())
        .then((data: any[]) => {
          progressCache.set(userId, { data, ts: Date.now() });
          progressInflight.delete(userId);
          return data;
        })
        .catch(() => {
          progressInflight.delete(userId);
          return [] as any[];
        });
      progressInflight.set(userId, pending);
    }
    pending.then(setProgress);
  }, [userId]);
  return progress;
}

function ProgressWidget({ user }: { user: any }) {
  const progress = useSharedProgress(user.id);
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const summary = useContext(DashboardSummaryContext);

  const summaryLessons = summary?.progress?.lessons;
  const summaryOverall = summary?.progress?.overallStats;

  const completed = summaryLessons?.completed ?? progress.filter((p: any) => p.completed).length;
  const total = summaryLessons?.accessed ?? progress.length ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const hasNoData = completed === 0 && total === 0 && progress.length === 0;

  if (hasNoData) {
    return (
      <div className="text-center py-4" data-testid="widget-content-progress-empty">
        <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-2">{t("dashboard.progressEmpty")}</p>
        <Button size="sm" variant="link" onClick={() => navigate("/lessons")} data-testid="button-progress-browse">
          {t("dashboard.progressBrowse")} <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div data-testid="widget-content-progress">
      <div className="flex items-center gap-4 mb-3">
        <div className="relative h-16 w-16 flex-shrink-0" role="img" aria-label={`${pct}% complete`}>
          <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${pct}, 100`}
              className="text-primary transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{pct}%</span>
        </div>
        <div>
          <p className="text-2xl font-bold">{completed}</p>
          <p className="text-xs text-muted-foreground">{t("dashboard.lessonsCompleted")}</p>
          {summaryOverall && summaryOverall.totalQuestionsAnswered > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-overall-accuracy">
              {summaryOverall.overallAccuracy}% accuracy ({summaryOverall.totalQuestionsAnswered} Q)
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <span>{Math.max(0, total - completed)} {t("dashboard.lessonsLeft")}</span>
      </div>
    </div>
  );
}

function RecentLessonsWidget({ user }: { user: any }) {
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const allProgress = useSharedProgress(user.id);
  const progress = allProgress.slice(0, 5);

  if (progress.length === 0) {
    return (
      <div className="text-center py-4" data-testid="widget-content-recent-empty">
        <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-2">{t("dashboard.recentEmpty")}</p>
        <Button size="sm" variant="link" onClick={() => navigate("/lessons")} data-testid="button-recent-browse">
          {t("dashboard.recentBrowse")} <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5" data-testid="widget-content-recent">
      {progress.map((p: any, i: number) => (
        <button
          key={i}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
          onClick={() => navigate(`/lessons/${p.lessonId || ""}`)}
          data-testid={`link-recent-lesson-${i}`}
          aria-label={`Continue ${p.lessonId || "lesson"}`}
        >
          {p.completed ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
          ) : (
            <PlayCircle className="h-4 w-4 text-primary flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {(p.lessonId || "Lesson").replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
            </p>
            <p className="text-xs text-muted-foreground">{p.completed ? t("dashboard.completed") : t("dashboard.inProgress")}</p>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}

function QuickLinksWidget({ user }: { user: any }) {
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const links = [
    { label: t("dashboard.quickMedMath"), icon: FlaskConical, path: "/med-math", desc: t("dashboard.quickMedMathDesc") },
    { label: t("dashboard.quickLabValues"), icon: Activity, path: "/lab-values", desc: t("dashboard.quickLabValuesDesc") },
    { label: t("dashboard.quickClinicalClarity"), icon: Stethoscope, path: "/clinical-clarity", desc: t("dashboard.quickClinicalClarityDesc") },
    { label: t("dashboard.quickTestBank"), icon: ClipboardList, path: "/test-bank", desc: t("dashboard.quickTestBankDesc") },
    { label: t("dashboard.quickPharmacology"), icon: Pill, path: "/flashcards", desc: t("dashboard.quickPharmacologyDesc") },
    { label: t("dashboard.quickBlog"), icon: FileText, path: "/blog", desc: t("dashboard.quickBlogDesc") },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" data-testid="widget-content-quick-links">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <button
            key={link.path}
            className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-gray-200/60 hover:bg-primary/[0.03] hover:border-primary/30 transition-all duration-200 text-center group"
            onClick={() => navigate(link.path)}
            data-testid={`link-quick-${link.path.slice(1)}`}
            aria-label={`${link.label}: ${link.desc}`}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-medium leading-tight text-gray-700">{link.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ExamStatsWidget({ user }: { user: any }) {
  const [stats, setStats] = useState<any[]>([]);
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const summary = useContext(DashboardSummaryContext);

  useEffect(() => {
    if (summary?.progress?.mockExams?.recentScores?.length > 0) {
      setStats(summary.progress.mockExams.recentScores.slice(0, 5));
      return;
    }
    import("@/lib/qbank-api").then(({ getAuthHeaders }) => {
      fetch(`/api/mock-exams/history/${user.id}`, { headers: getAuthHeaders() })
        .then((r) => r.json())
        .then((data: any[]) => setStats(data.slice(0, 5)))
        .catch(() => {});
    });
  }, [user.id, summary]);

  if (stats.length === 0) {
    return (
      <div className="text-center py-4" data-testid="widget-content-exam-empty">
        <Award className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-2">{t("dashboard.examEmpty")}</p>
        <Button size="sm" variant="link" onClick={() => navigate("/mock-exams")} data-testid="button-exam-start">
          {t("dashboard.examStart")} <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    );
  }

  const avgScore = Math.round(stats.reduce((sum, s) => sum + (s.score || 0), 0) / stats.length);
  const bestScore = Math.max(...stats.map((s) => s.score || 0));

  return (
    <div data-testid="widget-content-exam-stats">
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        <div className="dashboard-stat-card">
          <p className="text-2xl font-bold text-primary">{avgScore}%</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{t("dashboard.examAverage")}</p>
        </div>
        <div className="text-center p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/60">
          <p className="text-2xl font-bold text-emerald-600">{bestScore}%</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{t("dashboard.examBest")}</p>
        </div>
        <div className="text-center p-2.5 rounded-xl bg-muted/50 border border-gray-200/40">
          <p className="text-2xl font-bold">{stats.length}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{t("dashboard.examTaken")}</p>
        </div>
      </div>
      <Button size="sm" variant="outline" className="w-full" onClick={() => navigate("/mock-exams")} data-testid="button-view-exams">
        <BarChart3 className="h-4 w-4 mr-1.5" /> {t("dashboard.examViewAll")}
      </Button>
    </div>
  );
}

function StudyStreakWidget({ user }: { user: any }) {
  const [streakData, setStreakData] = useState<any>(null);
  const { t } = useI18n();
  const summary = useContext(DashboardSummaryContext);

  useEffect(() => {
    fetch(`/api/readiness/${user.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setStreakData)
      .catch(() => {});
  }, [user.id, summary]);

  const streak = streakData?.streak || 0;
  const longestStreak = streakData?.longestStreak || streak;

  const milestones = [
    { threshold: 7, label: "1 Week!", emoji: "🔥" },
    { threshold: 14, label: "2 Weeks!", emoji: "⭐" },
    { threshold: 30, label: "1 Month!", emoji: "🏆" },
    { threshold: 60, label: "2 Months!", emoji: "💎" },
    { threshold: 100, label: "100 Days!", emoji: "👑" },
  ];
  const activeMilestone = milestones.filter((m) => streak >= m.threshold).pop();

  const motivationMessages = [
    { min: 0, max: 0, msg: "Start studying to begin your streak!" },
    { min: 1, max: 2, msg: "Great start! Keep the momentum going." },
    { min: 3, max: 6, msg: "You're building a habit — keep it up!" },
    { min: 7, max: 13, msg: "One week strong! 💪 You're on fire!" },
    { min: 14, max: 29, msg: "Two weeks and counting! Incredible discipline." },
    { min: 30, max: 999, msg: "A whole month! You're unstoppable! 🎯" },
  ];
  const motivation = motivationMessages.find((m) => streak >= m.min && streak <= m.max) || motivationMessages[0];

  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const dayLabels = [t("dashboard.daySun"), t("dashboard.dayMon"), t("dashboard.dayTue"), t("dashboard.dayWed"), t("dashboard.dayThu"), t("dashboard.dayFri"), t("dashboard.daySat")];

  return (
    <div data-testid="widget-content-streak">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`relative ${streak > 0 ? "animate-pulse" : ""}`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
              <Flame className="h-6 w-6 text-white" />
            </div>
            {streak >= 7 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px] shadow-sm">
                {activeMilestone?.emoji || "🔥"}
              </div>
            )}
          </div>
          <div>
            <p className="text-2xl font-bold" data-testid="text-streak-count">{streak}</p>
            <p className="text-xs text-muted-foreground">{t("pages.dashboard.dayStreak")}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{t("pages.dashboard.longest")}</p>
          <p className="text-sm font-semibold" data-testid="text-longest-streak">{longestStreak} days</p>
        </div>
      </div>

      {activeMilestone && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100" data-testid="streak-milestone">
          <p className="text-xs font-medium text-amber-700">
            {activeMilestone.emoji} {streak} Day Study Streak — {activeMilestone.label}
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-3 italic" data-testid="text-motivation">{motivation.msg}</p>

      <div className="flex justify-between gap-1" role="group" aria-label={t("dashboard.weeklyActivity")}>
        {days.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString();
          const dayInStreak = i >= (7 - Math.min(streak, 7));
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isToday
                    ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-sm"
                    : dayInStreak
                    ? "bg-orange-100 text-orange-700"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-label={`${dayLabels[d.getDay()]} ${d.getDate()}${isToday ? ` (${t("dashboard.today")})` : ""}`}
              >
                {dayLabels[d.getDay()]}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {d.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FlashcardReviewWidget({ user }: { user: any }) {
  const [cards, setCards] = useState<any[]>([]);
  const [, navigate] = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    fetch(`/api/user-flashcards/${user.id}`)
      .then((r) => r.json())
      .then((data: any[]) => setCards(data.slice(0, 3)))
      .catch(() => {});
  }, [user.id]);

  if (cards.length === 0) {
    return (
      <div className="text-center py-4" data-testid="widget-content-flashcard-empty">
        <Brain className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-2">{t("dashboard.flashcardEmpty")}</p>
        <Button size="sm" variant="link" onClick={() => navigate("/profile")} data-testid="button-flashcard-create">
          {t("dashboard.flashcardCreate")} <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="widget-content-flashcard-review">
      {cards.map((card: any, i: number) => (
        <div key={i} className="p-2.5 rounded-lg bg-muted/60 border border-transparent hover:border-primary/20 transition-colors">
          <p className="text-sm font-medium truncate">{card.question}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{card.category || t("dashboard.flashcardGeneral")}</p>
        </div>
      ))}
      <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => navigate("/flashcards")} data-testid="button-study-flashcards">
        <Bookmark className="h-4 w-4 mr-1.5" /> {t("dashboard.flashcardStudyAll")}
      </Button>
    </div>
  );
}

function ClinicalToolsWidget({ user }: { user: any }) {
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const tools = [
    { label: t("dashboard.clinicalFirstAction"), path: "/first-action-simulator", icon: Target, desc: t("dashboard.clinicalFirstActionDesc") },
    { label: t("dashboard.clinicalIV"), path: "/iv-complications-simulator", icon: Activity, desc: t("dashboard.clinicalIVDesc") },
    { label: t("dashboard.clinicalSafety"), path: "/safety-hazard-simulator", icon: Stethoscope, desc: t("dashboard.clinicalSafetyDesc") },
    { label: t("dashboard.clinicalDeteriorating"), path: "/deteriorating-patient-simulator", icon: TrendingUp, desc: t("dashboard.clinicalDeterioratingDesc") },
  ];

  return (
    <div className="grid grid-cols-2 gap-2" data-testid="widget-content-clinical-tools">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.path}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border hover:bg-muted hover:border-primary/30 transition-all text-center group"
            onClick={() => navigate(tool.path)}
            data-testid={`link-clinical-${tool.path.slice(1)}`}
            aria-label={`${tool.label}: ${tool.desc}`}
          >
            <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium leading-tight">{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function RecommendedWidget({ user }: { user: any }) {
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const summary = useContext(DashboardSummaryContext);
  const [serverRecs, setServerRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch(`/api/study-recommendations/${user.id}`)
      .then((r) => r.ok ? r.json() : { recommendations: [] })
      .then((data) => setServerRecs(data.recommendations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6" data-testid="widget-recommended-loading">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (serverRecs.length === 0) {
    const summaryRec = summary?.recommendedNextAction;

    const fallbacks = [
      { text: t("dashboard.recQotd"), action: t("dashboard.recTryQotd"), path: "/question-of-the-day", icon: Target },
      { text: t("dashboard.recStartLesson"), action: t("dashboard.recBeginLearning"), path: "/lessons", icon: BookOpen },
      { text: t("dashboard.recTrySimulator"), action: t("dashboard.recSimulate"), path: "/first-action-simulator", icon: Stethoscope },
    ];

    return (
      <div data-testid="widget-content-recommended">
        {summaryRec && summaryRec.action && (
          <button
            className="w-full flex items-start gap-3 p-3.5 mb-3 rounded-lg border-2 border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.07] transition-all text-left group"
            onClick={() => navigate(summaryRec.path || "/dashboard")}
            data-testid="link-recommended-action"
          >
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0 group-hover:bg-primary/15 transition-colors">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug mb-0.5">{summaryRec.action}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{summaryRec.description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-1 opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {fallbacks.map((rec, i) => {
            const Icon = rec.icon;
            return (
              <button
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted hover:border-primary/30 transition-all text-left group"
                onClick={() => navigate(rec.path)}
                data-testid={`link-recommendation-${i}`}
              >
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug mb-1">{rec.text}</p>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    {rec.action} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="widget-content-recommended">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {serverRecs.slice(0, 3).map((rec, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border bg-card"
            data-testid={`link-recommendation-${i}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{rec.category}</span>
              <span className={`text-xs font-semibold ${rec.accuracy >= 50 ? "text-amber-600" : "text-red-600"}`}>
                {rec.accuracy}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(rec.links.lessons)}
                className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 hover:underline"
                data-testid={`link-rec-lessons-${i}`}
              >
                <BookOpen className="h-3 w-3" /> Lessons
              </button>
              <button
                onClick={() => navigate(rec.links.flashcards)}
                className="flex items-center gap-1 text-[10px] text-purple-600 hover:text-purple-800 hover:underline"
                data-testid={`link-rec-flashcards-${i}`}
              >
                <Brain className="h-3 w-3" /> Flashcards
              </button>
              <button
                onClick={() => navigate(rec.links.practice)}
                className="flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-800 hover:underline"
                data-testid={`link-rec-practice-${i}`}
              >
                <Target className="h-3 w-3" /> Practice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PremiumLockedWidget({ widgetType }: { widgetType: string }) {
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const Icon = WIDGET_ICONS[widgetType] || Lock;
  const messageKey = PREMIUM_WIDGET_MESSAGE_KEYS[widgetType] || "dashboard.premiumDefault";

  return (
    <div className="text-center py-4 space-y-3" data-testid={`widget-locked-${widgetType}`}>
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("dashboard.premium")}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{t(messageKey)}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="rounded-full px-4 gap-1.5"
        onClick={() => navigate("/pricing")}
        data-testid={`button-upgrade-widget-${widgetType}`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {t("dashboard.viewPlans")}
      </Button>
    </div>
  );
}

function PassProbabilityWidget({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const { t } = useI18n();

  useEffect(() => {
    fetch(`/api/pass-probability/${user.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {});
  }, [user.id]);

  if (!data) {
    return (
      <div className="text-center py-4" data-testid="widget-content-pass-probability-empty">
        <Gauge className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-1">{t("dashboard.passProbabilityEmpty")}</p>
        <p className="text-xs text-muted-foreground">{t("dashboard.passProbabilityEmptyDesc")}</p>
      </div>
    );
  }

  const probability = data.probability || 0;
  const readinessTier = data.readinessTier || "Not Ready";

  const gaugeColor = probability >= 85 ? "#10b981" : probability >= 70 ? "#3b82f6" : probability >= 40 ? "#f59e0b" : "#ef4444";
  const tierColors: Record<string, string> = {
    "Strong Pass": "bg-emerald-100 text-emerald-700",
    "Likely Pass": "bg-blue-100 text-blue-700",
    "Developing": "bg-amber-100 text-amber-700",
    "Not Ready": "bg-red-100 text-red-700",
  };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (probability / 100) * circumference;

  return (
    <div data-testid="widget-content-pass-probability">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-shrink-0" style={{ width: 96, height: 96 }}>
          <svg width={96} height={96} className="transform -rotate-90">
            <circle cx={48} cy={48} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={7} />
            <circle
              cx={48} cy={48} r={radius} fill="none" stroke={gaugeColor} strokeWidth={7}
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: gaugeColor }} data-testid="text-pass-probability">{probability}%</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground" data-testid="text-pass-label">{probability}% Likely to Pass</p>
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${tierColors[readinessTier] || "bg-gray-100 text-gray-700"}`} data-testid="text-risk-tier">
            {readinessTier}
          </span>
          <p className="text-[10px] text-muted-foreground mt-1">{t("dashboard.estimatedPassProbability")}</p>
        </div>
      </div>
    </div>
  );
}

function AdaptiveEngineWidget({ user }: { user: any }) {
  const [, navigate] = useLocation();
  const { t } = useI18n();

  return (
    <div data-testid="widget-content-adaptive-engine">
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <Brain className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{t("dashboard.adaptiveLearningActive")}</p>
            <p className="text-xs text-muted-foreground">{t("dashboard.adaptiveLearningDesc")}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-muted/50 text-center">
            <p className="text-lg font-bold text-primary">--</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("dashboard.weakAreas")}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/50 text-center">
            <p className="text-lg font-bold text-emerald-600">--</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("dashboard.mastered")}</p>
          </div>
        </div>
        <Button size="sm" variant="link" className="w-full" onClick={() => navigate("/lessons")} data-testid="button-adaptive-lessons">
          {t("dashboard.viewPersonalizedPath")} <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function AiStudyCoachWidget({ user }: { user: any }) {
  const { t } = useI18n();
  return (
    <div data-testid="widget-content-ai-study-coach">
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 border border-violet-100">
          <Bot className="w-5 h-5 text-violet-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{t("dashboard.aiStudyCoachTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("dashboard.aiStudyCoachDesc")}</p>
          </div>
        </div>
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">{t("dashboard.aiStudyCoachHelp")}</p>
        </div>
      </div>
    </div>
  );
}

function IntelligentRecommendationsWidget({ user }: { user: any }) {
  const [, navigate] = useLocation();
  const { t } = useI18n();

  return (
    <div data-testid="widget-content-intelligent-recommendations">
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{t("dashboard.smartStudySuggestions")}</p>
            <p className="text-xs text-muted-foreground">{t("dashboard.smartStudySuggestionsDesc")}</p>
          </div>
        </div>
        <Button size="sm" variant="link" className="w-full" onClick={() => navigate("/lessons")} data-testid="button-smart-recommendations">
          {t("dashboard.viewRecommendations")} <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function StudyWorkloadWidget({ user }: { user: any }) {
  const [planData, setPlanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/exam-planner/plan", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setPlanData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6" data-testid="widget-content-study-workload-loading">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!planData || !planData.hasPlan) {
    const hasExamDate = planData?.hasExamDate;
    const examDate = planData?.settings?.exam_date;
    const examPassed = examDate && new Date(examDate) <= new Date();

    if (examPassed) {
      return (
        <div className="text-center py-4" data-testid="widget-content-study-workload-passed">
          <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
          <p className="text-sm font-medium">{t("pages.dashboard.yourExamDateHasPassed")}</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">{t("pages.dashboard.setANewExamDate")}</p>
          <Button size="sm" variant="outline" onClick={() => navigate("/study-plan")} data-testid="button-new-exam-date">
            Set New Date
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center py-4" data-testid="widget-content-study-workload-empty">
        <CalendarClock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium mb-1">{t("pages.dashboard.yourStudyPlan")}</p>
        <p className="text-xs text-muted-foreground mb-3">{t("pages.dashboard.setYourExamDateAnd")}</p>
        <Button size="sm" onClick={() => navigate("/study-plan")} className="rounded-full" data-testid="button-set-exam-date">
          <CalendarClock className="h-4 w-4 mr-1.5" /> Create Study Plan
        </Button>
      </div>
    );
  }

  const plan = planData.plan;
  const phase = plan?.phase;
  const pacing = plan?.pacingTargets;
  const recs = plan?.recommendations || [];
  const settings = planData.settings;

  const phaseColors: Record<string, { bg: string; text: string; badge: string }> = {
    foundation: { bg: "bg-blue-50 border-blue-100", text: "text-blue-700", badge: "bg-blue-100 text-blue-800" },
    practice: { bg: "bg-purple-50 border-purple-100", text: "text-purple-700", badge: "bg-purple-100 text-purple-800" },
    timed_review: { bg: "bg-amber-50 border-amber-100", text: "text-amber-700", badge: "bg-amber-100 text-amber-800" },
    final_review: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" },
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    ahead: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
    on_track: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
    slightly_behind: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
    needs_attention: { bg: "bg-red-50 border-red-200", text: "text-red-700" },
  };

  const phaseStyle = phaseColors[phase?.phase || "foundation"] || phaseColors.foundation;
  const statusStyle = statusColors[plan?.onTrackStatus || "on_track"] || statusColors.on_track;
  const daysRemaining = phase?.daysRemaining || 0;

  const countdownHidden = settings?.exam_countdown_hidden;

  return (
    <div data-testid="widget-content-study-workload">
      <div className="space-y-3">
        {!countdownHidden && daysRemaining > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${phaseStyle.badge}`} data-testid="badge-study-phase">
                {phase?.label}
              </span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary" data-testid="text-days-remaining">{daysRemaining}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{t("pages.dashboard.daysLeft")}</p>
            </div>
          </div>
        )}

        <div className={`p-2.5 rounded-lg border ${statusStyle.bg}`}>
          <p className={`text-xs font-medium leading-relaxed ${statusStyle.text}`} data-testid="text-workload-message">
            {plan?.onTrackMessage}
          </p>
        </div>

        {pacing && (
          <div className="grid grid-cols-3 gap-1.5">
            <div className="p-2 rounded-lg bg-muted/50 text-center">
              <p className="text-base font-bold text-primary" data-testid="text-daily-questions">{pacing.questionsPerDay}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{t("pages.dashboard.qday")}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50 text-center">
              <p className="text-base font-bold text-primary" data-testid="text-weekly-flashcards">{pacing.flashcardsPerWeek}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{t("pages.dashboard.cardswk")}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50 text-center">
              <p className="text-base font-bold text-primary" data-testid="text-mocks-target">{pacing.mocksToTake}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{t("pages.dashboard.mocks")}</p>
            </div>
          </div>
        )}

        {recs.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("pages.dashboard.nextSteps")}</p>
            {recs.slice(0, 2).map((rec: any, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs" data-testid={`rec-item-${i}`}>
                <Sparkles className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{rec.title}</span>
              </div>
            ))}
          </div>
        )}

        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-full text-xs"
          onClick={() => navigate("/study-plan")}
          data-testid="button-view-full-plan"
        >
          View Full Plan <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function QuickStudyWidget({ user }: { user: any }) {
  const [, navigate] = useLocation();

  return (
    <div className="text-center py-3" data-testid="widget-content-quick-study">
      <div className="w-14 h-14 rounded-full bg-[#BFA6F6]/15 flex items-center justify-center mx-auto mb-3">
        <PlayCircle className="h-7 w-7 text-[#BFA6F6]" />
      </div>
      <h3 className="text-sm font-semibold mb-1">{t("pages.dashboard.quickStudy")}</h3>
      <p className="text-xs text-muted-foreground mb-4">{t("pages.dashboard.10minuteFocusedSessionFromYour")}</p>
      <Button
        size="sm"
        onClick={() => navigate("/quick-study")}
        className="bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white rounded-xl px-6"
        data-testid="button-start-quick-study"
      >
        <PlayCircle className="h-4 w-4 mr-1.5" /> Start Session
      </Button>
    </div>
  );
}

function ReviewDueWidget({ user }: { user: any }) {
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch(`/api/flashcard-review-due/${user.id}`)
      .then((r) => r.json())
      .then((data) => { setDueCount(data.count || 0); setLoading(false); })
      .catch(() => { setDueCount(null); setLoading(false); });
  }, [user?.id]);

  if (loading) {
    return (
      <div className="text-center py-6" data-testid="widget-content-review-due-loading">
        <p className="text-xs text-muted-foreground">{t("pages.dashboard.loadingReviewStatus")}</p>
      </div>
    );
  }

  if (dueCount === null || dueCount === 0) {
    return (
      <div className="text-center py-4" data-testid="widget-content-review-due-empty">
        <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
        <p className="text-sm font-medium text-emerald-700">{t("pages.dashboard.allCaughtUp")}</p>
        <p className="text-xs text-muted-foreground mt-1">{t("pages.dashboard.noFlashcardsDueForReview")}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-3" data-testid="widget-content-review-due">
      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
        <RotateCcw className="h-7 w-7 text-amber-600" />
      </div>
      <h3 className="text-sm font-semibold mb-1">{t("pages.dashboard.reviewDueToday")}</h3>
      <p className="text-2xl font-bold text-amber-600 mb-1">{dueCount}</p>
      <p className="text-xs text-muted-foreground mb-4">flashcard{dueCount !== 1 ? "s" : ""} ready for review</p>
      <Button
        size="sm"
        onClick={() => navigate("/flashcards")}
        className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6"
        data-testid="button-start-review"
      >
        <RotateCcw className="h-4 w-4 mr-1.5" /> Start Review
      </Button>
    </div>
  );
}

type MasteryData = { bodySystem: string; accuracy: number; total: number; status?: string };

function TopicMasteryWidget({ user }: { user: any }) {
  const [data, setData] = useState<MasteryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch(`/api/topic-mastery/${user.id}`)
      .then((r) => r.json())
      .then((d) => { setData(d.systems || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="text-center py-6" data-testid="widget-topic-mastery-loading">
        <p className="text-xs text-muted-foreground">{t("pages.dashboard.loadingMasteryData")}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-5" data-testid="widget-topic-mastery-empty">
        <BarChart className="h-8 w-8 mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-muted-foreground">{t("pages.dashboard.completePracticeQuestionsToSee")}</p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/mock-exams")}
          className="mt-3 rounded-xl"
          data-testid="button-start-practice"
        >
          Start Practicing
        </Button>
      </div>
    );
  }

  const heatmapColor = (accuracy: number, status?: string) => {
    if (status === "untested") return "bg-gray-100 border-gray-200 text-gray-400";
    if (accuracy >= 70) return "bg-emerald-100 border-emerald-300 text-emerald-800";
    if (accuracy >= 50) return "bg-amber-100 border-amber-300 text-amber-800";
    return "bg-red-100 border-red-300 text-red-800";
  };

  const heatmapDot = (accuracy: number, status?: string) => {
    if (status === "untested") return "bg-gray-300";
    if (accuracy >= 70) return "bg-emerald-500";
    if (accuracy >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div data-testid="widget-topic-mastery">
      <div className="grid grid-cols-3 gap-2 mb-3" data-testid="heatmap-grid">
        {data.map((sys) => (
          <button
            key={sys.bodySystem}
            onClick={() => navigate(`/practice?topics=${encodeURIComponent(sys.bodySystem)}`)}
            className={`p-2 rounded-lg border text-left transition-all hover:shadow-md cursor-pointer ${heatmapColor(sys.accuracy, sys.status)}`}
            data-testid={`heatmap-cell-${sys.bodySystem}`}
          >
            <div className="flex items-center gap-1 mb-1">
              <div className={`w-2 h-2 rounded-full ${heatmapDot(sys.accuracy, sys.status)}`} />
              <span className="text-[10px] font-medium truncate">{sys.bodySystem}</span>
            </div>
            <p className="text-sm font-bold">{sys.status === "untested" ? "—" : `${Math.round(sys.accuracy)}%`}</p>
            {sys.total > 0 && <p className="text-[9px] opacity-70">{sys.total} Q</p>}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {t("pages.dashboard.strong")}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> {t("pages.dashboard.moderate")}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> {t("pages.dashboard.weak")}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" /> {t("pages.dashboard.untested")}</span>
      </div>
    </div>
  );
}

function ExamReadinessWidget({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();
  const isPremium = canAccessFeature(user?.tier || "free", "reports");

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch(`/api/readiness/${user.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6" data-testid="widget-exam-readiness-loading">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const readiness = data?.readinessScore || data?.readiness || 0;
  const accuracy = data?.factors?.accuracy || data?.accuracy || 0;
  const totalAnswered = data?.factors?.totalAnswered || data?.totalAnswered || 0;
  const passProbability = data?.passProbability || 0;

  const tiers = [
    { label: "Not Ready", range: "0–40%", min: 0, max: 40, color: "bg-red-400", active: "bg-red-500", badge: "bg-red-100 text-red-700" },
    { label: "Developing", range: "40–70%", min: 40, max: 70, color: "bg-amber-300", active: "bg-amber-500", badge: "bg-amber-100 text-amber-700" },
    { label: "Likely Pass", range: "70–85%", min: 70, max: 85, color: "bg-blue-300", active: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
    { label: "Strong Pass", range: "85–100%", min: 85, max: 100, color: "bg-emerald-300", active: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  ];

  const currentTier = tiers.find(t => readiness >= t.min && readiness < t.max) || tiers[tiers.length - 1];
  const tierIndex = tiers.indexOf(currentTier);

  const gaugeColor = readiness >= 85 ? "#10b981" : readiness >= 70 ? "#3b82f6" : readiness >= 40 ? "#f59e0b" : "#ef4444";
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const gaugeOffset = circumference - (readiness / 100) * circumference;

  const motivational = readiness >= 85 ? "Excellent! You're exam-ready." : readiness >= 70 ? "Great progress — keep going!" : readiness >= 40 ? "Building momentum — focus on weak areas." : "Keep practicing daily!";

  return (
    <div data-testid="widget-content-exam-readiness">
      <div className="flex items-center gap-4 mb-3">
        <div className="relative flex-shrink-0" style={{ width: 84, height: 84 }}>
          <svg width={84} height={84} className="transform -rotate-90">
            <circle cx={42} cy={42} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={6} />
            <circle cx={42} cy={42} r={radius} fill="none" stroke={gaugeColor} strokeWidth={6}
              strokeDasharray={circumference} strokeDashoffset={gaugeOffset} strokeLinecap="round"
              className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold" style={{ color: gaugeColor }} data-testid="text-readiness-score">{readiness}%</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${currentTier.badge}`} data-testid="badge-readiness-tier">
              {currentTier.label}
            </span>
          </div>
          {isPremium && passProbability > 0 && (
            <p className="text-sm font-semibold text-foreground" data-testid="text-pass-probability">{passProbability}% pass probability</p>
          )}
          {isPremium && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{motivational}</p>
          )}
        </div>
      </div>
      {isPremium && (
        <>
          <div className="flex gap-1 mb-2" data-testid="readiness-meter">
            {tiers.map((tier, i) => {
              const isActive = i <= tierIndex;
              let fillPercent = 0;
              if (readiness >= tier.max) fillPercent = 100;
              else if (readiness > tier.min) fillPercent = ((readiness - tier.min) / (tier.max - tier.min)) * 100;
              return (
                <div key={tier.label} className="flex-1" data-testid={`readiness-segment-${i}`}>
                  <div className={`h-2.5 rounded-full overflow-hidden ${i === 0 ? "rounded-l-full" : ""} ${i === tiers.length - 1 ? "rounded-r-full" : ""} bg-gray-100`}>
                    <div className={`h-full rounded-full transition-all duration-700 ${isActive ? tier.active : tier.color}`} style={{ width: `${fillPercent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 px-1">
            <span>{accuracy}% accuracy</span>
            <span>{totalAnswered} questions</span>
          </div>
        </>
      )}
      {isPremium ? (
        <Button size="sm" variant="outline" className="w-full" onClick={() => navigate("/exam-readiness")} data-testid="button-view-full-report">
          <BarChart3 className="h-4 w-4 mr-1.5" /> View Full Report
        </Button>
      ) : (
        <Button size="sm" variant="outline" className="w-full" onClick={() => navigate("/pricing")} data-testid="button-upgrade-readiness">
          <Lock className="h-4 w-4 mr-1.5" /> Upgrade for Full Analysis
        </Button>
      )}
    </div>
  );
}

function WeakTopicsWidget({ user }: { user: any }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch(`/api/study-recommendations/${user.id}`)
      .then((r) => r.ok ? r.json() : { recommendations: [] })
      .then((data) => setRecommendations(data.recommendations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6" data-testid="widget-weak-topics-loading">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-4" data-testid="widget-weak-topics-empty">
        <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
        <p className="text-sm font-medium text-emerald-700">{t("pages.dashboard.noWeakAreasDetected")}</p>
        <p className="text-xs text-muted-foreground mt-1">{t("pages.dashboard.keepPracticingToMaintainYour")}</p>
      </div>
    );
  }

  const accuracyColor = (pct: number) =>
    pct >= 50 ? "text-amber-600" : "text-red-600";
  const dotColor = (pct: number) =>
    pct >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div data-testid="widget-content-weak-topics">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3" data-testid="text-recommended-focus-heading">{t("pages.dashboard.recommendedFocus")}</p>
      <div className="space-y-3 mb-3">
        {recommendations.map((rec, i) => (
          <div key={i} className="p-2.5 rounded-lg border bg-card" data-testid={`weak-topic-${i}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor(rec.accuracy)}`} />
                <span className="text-sm font-medium text-foreground">{rec.category}</span>
              </div>
              <span className={`text-xs font-semibold ${accuracyColor(rec.accuracy)}`}>
                {rec.accuracy}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(rec.links.lessons)}
                className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 hover:underline"
                data-testid={`link-lessons-${i}`}
              >
                <BookOpen className="h-3 w-3" /> Lessons
              </button>
              <button
                onClick={() => navigate(rec.links.flashcards)}
                className="flex items-center gap-1 text-[10px] text-purple-600 hover:text-purple-800 hover:underline"
                data-testid={`link-flashcards-${i}`}
              >
                <Brain className="h-3 w-3" /> Flashcards
              </button>
              <button
                onClick={() => navigate(rec.links.practice)}
                className="flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-800 hover:underline"
                data-testid={`link-practice-${i}`}
              >
                <Target className="h-3 w-3" /> Practice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookmarksPreviewWidget({ user }: { user: any }) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch("/api/bookmarks/count", { headers: { "x-user-id": user.id } })
      .then((r) => r.ok ? r.json() : { count: 0 })
      .then((data) => setCount(data.count || 0))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-center py-3" data-testid="widget-content-bookmarks-preview">
      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
        <Bookmark className="h-7 w-7 text-amber-600" />
      </div>
      <p className="text-2xl font-bold text-foreground mb-1" data-testid="text-bookmark-count">{count}</p>
      <p className="text-xs text-muted-foreground mb-4">bookmarked question{count !== 1 ? "s" : ""}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate("/bookmarks")} data-testid="button-view-bookmarks">
          View All
        </Button>
        {count > 0 && (
          <Button size="sm" className="flex-1 gap-1" onClick={() => navigate("/practice?source=bookmarks")} data-testid="button-review-bookmarks">
            <PlayCircle className="h-3.5 w-3.5" /> Review
          </Button>
        )}
      </div>
    </div>
  );
}

function RecentActivityWidget({ user }: { user: any }) {
  const summary = useContext(DashboardSummaryContext);
  const recentActivity = summary?.recentActivity || [];

  if (recentActivity.length === 0) {
    return (
      <div data-testid="widget-content-recent-activity" className="text-center py-4 text-muted-foreground text-sm">
        No recent activity yet. Start studying to see your activity here.
      </div>
    );
  }

  const formatEventType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const platformIcon = (platform?: string) => {
    if (platform === "ios" || platform === "android") return "📱";
    return "💻";
  };

  return (
    <div data-testid="widget-content-recent-activity" className="space-y-2 max-h-[280px] overflow-y-auto">
      {recentActivity.slice(0, 10).map((item: any, i: number) => (
        <div
          key={i}
          className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          data-testid={`activity-item-${i}`}
        >
          <span className="text-sm flex-shrink-0 mt-0.5">{platformIcon(item.platform)}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{formatEventType(item.eventType)}</p>
            {item.entityType && (
              <p className="text-xs text-muted-foreground truncate">{item.entityType}{item.entityId ? `: ${item.entityId}` : ""}</p>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground flex-shrink-0 whitespace-nowrap">
            {formatTimeAgo(item.createdAt)}
          </span>
        </div>
      ))}
    </div>
  );
}

function PerformanceOverviewWidget({ user }: { user: any }) {
  const summary = useContext(DashboardSummaryContext);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (summary?.progress?.overallStats) {
      setStats({
        totalQuestions: summary.progress.overallStats.totalQuestionsAnswered,
        overallAccuracy: summary.progress.overallStats.overallAccuracy,
        mockExamsCompleted: summary.progress.mockExams?.completed || 0,
        studyTimeHours: 0,
      });
      setLoading(false);
      return;
    }
    if (!user?.id) { setLoading(false); return; }
    fetch(`/api/performance-analytics?period=30d`, { headers: { "x-user-id": user.id } })
      .then((r) => r.ok ? r.json() : null)
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, summary]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalQuestions = stats?.totalQuestions || 0;
  const overallAccuracy = stats?.overallAccuracy || 0;
  const studyTimeHours = stats?.studyTimeHours || 0;
  const mockExamsCompleted = stats?.mockExamsCompleted || 0;

  return (
    <div data-testid="widget-content-performance-overview">
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2.5 rounded-lg bg-blue-50 text-center">
          <p className="text-lg font-bold text-blue-700" data-testid="perf-total-questions">{totalQuestions}</p>
          <p className="text-[10px] text-muted-foreground">{t("pages.dashboard.questions")}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-green-50 text-center">
          <p className="text-lg font-bold text-green-700" data-testid="perf-accuracy">{overallAccuracy}%</p>
          <p className="text-[10px] text-muted-foreground">{t("pages.dashboard.accuracy")}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-50 text-center">
          <p className="text-lg font-bold text-amber-700" data-testid="perf-study-time">{studyTimeHours}h</p>
          <p className="text-[10px] text-muted-foreground">{t("pages.dashboard.studyTime")}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-purple-50 text-center">
          <p className="text-lg font-bold text-purple-700" data-testid="perf-exams">{mockExamsCompleted}</p>
          <p className="text-[10px] text-muted-foreground">{t("pages.dashboard.mockExams")}</p>
        </div>
      </div>
      <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => navigate("/performance-analytics")} data-testid="button-full-analytics">
        <BarChart3 className="h-4 w-4" /> Full Analytics Dashboard
      </Button>
    </div>
  );
}

function QotdTeaserWidget({ user }: { user: any }) {
  const [, navigate] = useLocation();
  const summary = useContext(DashboardSummaryContext);
  const [qotd, setQotd] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (summary?.streak) {
      setStreak(summary.streak);
    }
  }, [summary]);

  useEffect(() => {
    fetch("/api/qotd/today")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setQotd(data))
      .catch(() => {});

    if (user?.id) {
      if (!summary?.streak) {
        fetch("/api/qotd/streak", { headers: { Authorization: `Bearer ${user.id}` } })
          .then((r) => r.ok ? r.json() : null)
          .then((data) => { if (data) setStreak(data); })
          .catch(() => {});
      }

      fetch("/api/qotd/my-answer", { headers: { Authorization: `Bearer ${user.id}` } })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data?.answer) setAnswered(true); })
        .catch(() => {});
    }
  }, [user?.id, summary]);

  return (
    <div data-testid="widget-content-qotd">
      {streak && streak.currentStreak > 0 && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-semibold text-orange-700" data-testid="text-qotd-widget-streak">
            {streak.currentStreak}-day streak!
          </span>
          {streak.totalAnswered > 0 && (
            <span className="text-xs text-muted-foreground ml-auto">
              {Math.round((streak.totalCorrect / streak.totalAnswered) * 100)}% accuracy
            </span>
          )}
        </div>
      )}
      {qotd ? (
        <div>
          <p className="text-sm line-clamp-2 mb-3" data-testid="text-qotd-widget-question">
            {qotd.question}
          </p>
          <Button
            size="sm"
            className="w-full gap-1.5"
            onClick={() => navigate("/question-of-the-day")}
            data-testid="button-qotd-widget-answer"
          >
            {answered ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> View Today's Answer
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" /> Answer Today's Question
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">{t("pages.dashboard.loadingTodaysQuestion")}</p>
        </div>
      )}
    </div>
  );
}

function PostExamNewGradWidget({ user }: { user: any }) {
  return <NewGradTransitionCard user={user} careerType={user?.careerType} />;
}

function PostExamRecoveryWidget({ user }: { user: any }) {
  const [readinessData, setReadinessData] = useState<any>(null);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/post-exam/status", { headers: { "x-user-id": user.id } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.readinessData) setReadinessData(data.readinessData);
        if (data?.weakAreas && Array.isArray(data.weakAreas)) setWeakAreas(data.weakAreas);
      })
      .catch(() => {});
  }, [user?.id]);

  return <RecoveryPlanCard user={user} readinessData={readinessData} weakAreas={weakAreas} />;
}

function PostExamPendingWidget({ user }: { user: any }) {
  const handleUpdateResult = () => {
    window.dispatchEvent(new CustomEvent("post-exam-reopen-modal"));
  };
  return <ResultsPendingCard user={user} onUpdateResult={handleUpdateResult} />;
}

function PostExamPostponedWidget({ user }: { user: any }) {
  const [newExamDate, setNewExamDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/post-exam/status", { headers: { "x-user-id": user.id } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.newExamDate) setNewExamDate(data.newExamDate);
        else if (data?.examDate) setNewExamDate(data.examDate);
      })
      .catch(() => {});
  }, [user?.id]);

  return <PostponedCountdownCard user={user} newExamDate={newExamDate} />;
}
