import { useState, useEffect } from "react";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { SEO } from "@/components/seo";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, Check, ChevronDown, ChevronRight, Clock, Target,
  RefreshCw, GraduationCap, Loader2, Calendar, BarChart3,
  Sparkles, ArrowRight, Settings, Eye, EyeOff, Zap, Brain,
  CheckCircle2, AlertTriangle, TrendingUp, X
} from "lucide-react";

type Intensity = "light" | "balanced" | "intensive";

interface PlannerData {
  settings: any;
  plan: any;
  hasExamDate: boolean;
  hasPlan: boolean;
}

export default function StudyPlanPage() {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [data, setData] = useState<PlannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [showFullPlan, setShowFullPlan] = useState(false);

  const [examDate, setExamDate] = useState("");
  const [examDateType, setExamDateType] = useState<"booked" | "target">("target");
  const [intensity, setIntensity] = useState<Intensity>("balanced");
  const [planWithoutDate, setPlanWithoutDate] = useState(false);
  const [planWithoutDateWeeks, setPlanWithoutDateWeeks] = useState(8);

  useEffect(() => {
    if (!user) return;
    fetchPlan();
  }, [user]);

  async function fetchPlan() {
    try {
      const res = await fetch("/api/exam-planner/plan", { credentials: "include" });
      if (res.ok) {
        const d = await res.json();
        setData(d);
        if (d.settings) {
          if (d.settings.exam_date) {
            setExamDate(new Date(d.settings.exam_date).toISOString().slice(0, 10));
          }
          setExamDateType(d.settings.exam_date_type || "target");
          setIntensity(d.settings.study_plan_intensity || "balanced");
          setPlanWithoutDate(d.settings.plan_without_date || false);
          setPlanWithoutDateWeeks(d.settings.plan_without_date_weeks || 8);
        }
      }
    } catch (err) {
      console.error("Failed to fetch plan:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGeneratePlan() {
    if (!user) return;
    setGenerating(true);
    try {
      const body: any = { intensity };
      if (planWithoutDate) {
        body.planWithoutDate = true;
        body.planWithoutDateWeeks = planWithoutDateWeeks;
      } else if (examDate) {
        body.examDate = new Date(examDate).toISOString();
        body.examDateType = examDateType;
      }
      const res = await fetch("/api/exam-planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const d = await res.json();
        setData({ ...data, ...d, settings: { ...data?.settings, ...body } } as PlannerData);
        setShowSettings(false);
      }
    } catch (err) {
      console.error("Failed to generate plan:", err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleRegenerate() {
    if (!user) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/exam-planner/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const d = await res.json();
        setData({ ...data, ...d } as PlannerData);
      }
    } catch (err) {
      console.error("Failed to regenerate:", err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleResetPlan() {
    if (!user) return;
    try {
      await fetch("/api/exam-planner/plan", {
        method: "DELETE",
        credentials: "include",
      });
      setData(null);
      setExamDate("");
      setPlanWithoutDate(false);
      setShowSettings(false);
      await fetchPlan();
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  }

  async function handleUpdateSettings(updates: Record<string, any>) {
    try {
      await fetch("/api/exam-planner/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      await fetchPlan();
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-none shadow-xl">
            <CardContent className="p-8 text-center space-y-4">
              <GraduationCap className="w-12 h-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">{t("pages.studyPlan.signInRequired")}</h2>
              <p className="text-gray-500">{t("pages.studyPlan.pleaseLogInToView")}</p>
              <Button onClick={() => navigate("/login")} className="rounded-full px-8" data-testid="button-login-redirect">
                Log In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  const hasPlan = data?.hasPlan && data?.plan;
  const plan = data?.plan;
  const settings = data?.settings;

  const phaseColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    foundation: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "bg-blue-100 text-blue-800" },
    practice: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-100 text-purple-800" },
    timed_review: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", badge: "bg-amber-100 text-amber-800" },
    final_review: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800" },
  };

  const phaseIcons: Record<string, any> = {
    foundation: BookOpen,
    practice: Target,
    timed_review: Clock,
    final_review: CheckCircle2,
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <Navigation />
      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <BreadcrumbNav />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" data-testid="text-study-plan-title">
                Your Study Plan
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Personalized exam prep powered by your progress
              </p>
            </div>
            {hasPlan && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="rounded-full text-sm"
                  data-testid="button-plan-settings"
                >
                  <Settings className="w-4 h-4 mr-1.5" /> Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={generating}
                  className="rounded-full text-sm"
                  data-testid="button-regenerate-plan"
                >
                  {generating ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1.5" />}
                  Regenerate
                </Button>
              </div>
            )}
          </div>

          {showSettings && hasPlan && (
            <Card className="border-none shadow-md mb-6" data-testid="card-plan-settings">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-base">{t("pages.studyPlan.planSettings")}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <PlanSettingsForm
                  examDate={examDate}
                  setExamDate={setExamDate}
                  examDateType={examDateType}
                  setExamDateType={setExamDateType}
                  intensity={intensity}
                  setIntensity={setIntensity}
                  planWithoutDate={planWithoutDate}
                  setPlanWithoutDate={setPlanWithoutDate}
                  planWithoutDateWeeks={planWithoutDateWeeks}
                  setPlanWithoutDateWeeks={setPlanWithoutDateWeeks}
                  onGenerate={handleGeneratePlan}
                  generating={generating}
                  showReset
                  onReset={handleResetPlan}
                  countdownHidden={settings?.exam_countdown_hidden}
                  plannerHidden={settings?.study_planner_hidden}
                  onToggleCountdown={() => handleUpdateSettings({ examCountdownHidden: !settings?.exam_countdown_hidden })}
                  onTogglePlanner={() => handleUpdateSettings({ studyPlannerHidden: !settings?.study_planner_hidden })}
                />
              </CardContent>
            </Card>
          )}

          {!hasPlan && (
            <Card className="border-none shadow-xl mb-8" data-testid="card-create-plan">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">{t("pages.studyPlan.createYourStudyPlan")}</h2>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Get a personalized study plan with weekly goals, pacing targets, and smart recommendations based on your progress.
                  </p>
                </div>

                <PlanSettingsForm
                  examDate={examDate}
                  setExamDate={setExamDate}
                  examDateType={examDateType}
                  setExamDateType={setExamDateType}
                  intensity={intensity}
                  setIntensity={setIntensity}
                  planWithoutDate={planWithoutDate}
                  setPlanWithoutDate={setPlanWithoutDate}
                  planWithoutDateWeeks={planWithoutDateWeeks}
                  setPlanWithoutDateWeeks={setPlanWithoutDateWeeks}
                  onGenerate={handleGeneratePlan}
                  generating={generating}
                />
              </CardContent>
            </Card>
          )}

          {hasPlan && plan && (
            <div className="space-y-6">
              {(() => {
                const phase = plan.phase;
                const pStyle = phaseColors[phase?.phase || "foundation"] || phaseColors.foundation;
                const PhaseIcon = phaseIcons[phase?.phase || "foundation"] || BookOpen;
                const daysRemaining = phase?.daysRemaining || 0;

                return (
                  <Card className={`border-none shadow-md ${pStyle.bg}`} data-testid="card-phase-overview">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-full ${pStyle.bg} border ${pStyle.border} flex items-center justify-center`}>
                            <PhaseIcon className={`w-6 h-6 ${pStyle.text}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className={`font-bold text-lg ${pStyle.text}`} data-testid="text-phase-label">{phase?.label}</h3>
                              <Badge className={`text-xs ${pStyle.badge}`} data-testid="badge-phase-name">
                                {phase?.phase?.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{phase?.description}</p>
                          </div>
                        </div>
                        {!settings?.exam_countdown_hidden && daysRemaining > 0 && (
                          <div className="text-center sm:text-right flex-shrink-0">
                            <p className="text-3xl font-bold text-primary" data-testid="text-countdown-days">{daysRemaining}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{t("pages.studyPlan.daysUntilExam")}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              <Card className="border-none shadow-md" data-testid="card-on-track-status">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    {plan.onTrackStatus === "ahead" && <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {plan.onTrackStatus === "on_track" && <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                    {plan.onTrackStatus === "slightly_behind" && <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
                    {plan.onTrackStatus === "needs_attention" && <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-sm font-medium mb-0.5" data-testid="text-on-track-status">
                        {plan.onTrackStatus === "ahead" && "Ahead of Schedule"}
                        {plan.onTrackStatus === "on_track" && "On Track"}
                        {plan.onTrackStatus === "slightly_behind" && "A Little Behind"}
                        {plan.onTrackStatus === "needs_attention" && "Needs Attention"}
                      </p>
                      <p className="text-xs text-gray-500">{plan.onTrackMessage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md" data-testid="card-pacing-targets">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> Your Pacing Targets
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <PacingBox label={t("pages.studyPlan.questionsday")} value={plan.pacingTargets?.questionsPerDay} icon={Target} color="text-purple-600" testId="pacing-questions" />
                    <PacingBox label={t("pages.studyPlan.flashcardsweek")} value={plan.pacingTargets?.flashcardsPerWeek} icon={Brain} color="text-amber-600" testId="pacing-flashcards" />
                    <PacingBox label={t("pages.studyPlan.mockExams")} value={plan.pacingTargets?.mocksToTake} icon={BarChart3} color="text-blue-600" testId="pacing-mocks" />
                    <PacingBox label={t("pages.studyPlan.lessonsweek")} value={plan.pacingTargets?.lessonsPerWeek} icon={BookOpen} color="text-emerald-600" testId="pacing-lessons" />
                    <PacingBox label={t("pages.studyPlan.weakAreas")} value={plan.pacingTargets?.weakAreasToReview} icon={AlertTriangle} color="text-red-600" testId="pacing-weak" />
                    <PacingBox label={t("pages.studyPlan.minday")} value={plan.pacingTargets?.studyMinutesPerDay} icon={Clock} color="text-gray-600" testId="pacing-minutes" />
                  </div>
                </CardContent>
              </Card>

              {plan.recommendations && plan.recommendations.length > 0 && (
                <Card className="border-none shadow-md" data-testid="card-recommendations">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" /> Recommended Next Actions
                    </h3>
                    <div className="space-y-3">
                      {plan.recommendations.map((rec: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors" data-testid={`recommendation-${i}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            rec.priority === "high" ? "bg-red-100" : rec.priority === "medium" ? "bg-amber-100" : "bg-emerald-100"
                          }`}>
                            {rec.type === "next_action" && <ArrowRight className={`w-4 h-4 ${rec.priority === "high" ? "text-red-600" : rec.priority === "medium" ? "text-amber-600" : "text-emerald-600"}`} />}
                            {rec.type === "area_focus" && <Target className="w-4 h-4 text-purple-600" />}
                            {rec.type === "content_mix" && <BarChart3 className="w-4 h-4 text-blue-600" />}
                            {rec.type === "intensity_tip" && <Zap className="w-4 h-4 text-amber-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{rec.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{rec.description}</p>
                          </div>
                          {rec.actionUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full text-xs flex-shrink-0"
                              onClick={() => navigate(rec.actionUrl)}
                              data-testid={`button-rec-action-${i}`}
                            >
                              {rec.actionLabel || "Go"} <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {plan.contentMix && plan.contentMix.length > 0 && (
                <Card className="border-none shadow-md" data-testid="card-content-mix">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" /> Recommended Content Mix
                    </h3>
                    <div className="space-y-2">
                      {plan.contentMix.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-3" data-testid={`content-mix-${i}`}>
                          <span className="text-xs text-gray-500 w-24 text-right">{item.type}</span>
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                i === 0 ? "bg-primary" : i === 1 ? "bg-purple-500" : i === 2 ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium w-10">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(plan.weakestAreas?.length > 0 || plan.strongestAreas?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.weakestAreas?.length > 0 && (
                    <Card className="border-none shadow-md" data-testid="card-weak-areas">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" /> Areas to Strengthen
                        </h3>
                        <div className="space-y-1.5">
                          {plan.weakestAreas.map((area: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs" data-testid={`weak-area-${i}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span className="text-gray-600">{area}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {plan.strongestAreas?.length > 0 && (
                    <Card className="border-none shadow-md" data-testid="card-strong-areas">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Your Strengths
                        </h3>
                        <div className="space-y-1.5">
                          {plan.strongestAreas.map((area: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs" data-testid={`strong-area-${i}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-gray-600">{area}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              <Card className="border-none shadow-md" data-testid="card-weekly-plan">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> Weekly Plan
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullPlan(!showFullPlan)}
                      className="text-xs"
                      data-testid="button-toggle-full-plan"
                    >
                      {showFullPlan ? "Show Less" : "View All Weeks"}
                      <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showFullPlan ? "rotate-180" : ""}`} />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(showFullPlan ? plan.weeklyPlan : plan.weeklyPlan?.slice(0, 4))?.map((week: any) => {
                      const wPhase = phaseColors[week.phase] || phaseColors.foundation;
                      const isExpanded = expandedWeek === week.weekNumber;

                      return (
                        <div key={week.weekNumber} className="border rounded-lg overflow-hidden" data-testid={`week-${week.weekNumber}`}>
                          <button
                            onClick={() => setExpandedWeek(isExpanded ? null : week.weekNumber)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                            data-testid={`button-toggle-week-${week.weekNumber}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${wPhase.bg} flex items-center justify-center`}>
                                <Calendar className={`w-4 h-4 ${wPhase.text}`} />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Week {week.weekNumber}</p>
                                <Badge className={`text-[10px] ${wPhase.badge}`}>{week.phase?.replace("_", " ")}</Badge>
                              </div>
                            </div>
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                          </button>

                          {isExpanded && (
                            <div className="border-t px-4 py-3 space-y-3 bg-gray-50/50">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <WeekTarget label={t("pages.studyPlan.questions")} value={week.questionsTarget} />
                                <WeekTarget label={t("pages.studyPlan.flashcards")} value={week.flashcardsTarget} />
                                <WeekTarget label={t("pages.studyPlan.lessons")} value={week.lessonsTarget} />
                                <WeekTarget label={t("pages.studyPlan.mockExams2")} value={week.mockExamsTarget} />
                              </div>

                              {week.focusAreas?.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t("pages.studyPlan.focusAreas")}</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {week.focusAreas.map((area: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-[10px]" data-testid={`focus-area-${week.weekNumber}-${i}`}>
                                        {area}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {week.studyRhythm && (
                                <div>
                                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("pages.studyPlan.studyRhythm")}</p>
                                  <p className="text-xs text-gray-600">{week.studyRhythm}</p>
                                </div>
                              )}

                              {week.recommendations?.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t("pages.studyPlan.tips")}</p>
                                  <div className="space-y-1">
                                    {week.recommendations.map((tip: string, i: number) => (
                                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                        <Sparkles className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{tip}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {plan.generatedAt && (
                <p className="text-[10px] text-gray-400 text-center">
                  Plan generated {new Date(plan.generatedAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PacingBox({ label, value, icon: Icon, color, testId }: {
  label: string;
  value: number | undefined;
  icon: any;
  color: string;
  testId: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 text-center" data-testid={testId}>
      <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
      <p className="text-xl font-bold">{value ?? 0}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function WeekTarget({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="p-2 rounded bg-white text-center border">
      <p className="text-base font-bold text-primary">{value ?? 0}</p>
      <p className="text-[9px] text-gray-500 uppercase">{label}</p>
    </div>
  );
}

function PlanSettingsForm({
  examDate, setExamDate,
  examDateType, setExamDateType,
  intensity, setIntensity,
  planWithoutDate, setPlanWithoutDate,
  planWithoutDateWeeks, setPlanWithoutDateWeeks,
  onGenerate, generating,
  showReset, onReset,
  countdownHidden, plannerHidden,
  onToggleCountdown, onTogglePlanner,
}: {
  examDate: string;
  setExamDate: (v: string) => void;
  examDateType: "booked" | "target";
  setExamDateType: (v: "booked" | "target") => void;
  intensity: Intensity;
  setIntensity: (v: Intensity) => void;
  planWithoutDate: boolean;
  setPlanWithoutDate: (v: boolean) => void;
  planWithoutDateWeeks: number;
  setPlanWithoutDateWeeks: (v: number) => void;
  onGenerate: () => void;
  generating: boolean;
  showReset?: boolean;
  onReset?: () => void;
  countdownHidden?: boolean;
  plannerHidden?: boolean;
  onToggleCountdown?: () => void;
  onTogglePlanner?: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium mb-2 block">{t("pages.studyPlan.examDate")}</label>
        <div className="flex items-center gap-2 mb-3">
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="radio"
              checked={!planWithoutDate}
              onChange={() => setPlanWithoutDate(false)}
              className="accent-primary"
              data-testid="radio-has-date"
            />
            I have a date
          </label>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="radio"
              checked={planWithoutDate}
              onChange={() => setPlanWithoutDate(true)}
              className="accent-primary"
              data-testid="radio-no-date"
            />
            Plan without a date
          </label>
        </div>

        {!planWithoutDate ? (
          <div className="space-y-3">
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="input-exam-date"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setExamDateType("booked")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  examDateType === "booked" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                data-testid="button-date-type-booked"
              >
                Booked Date
              </button>
              <button
                onClick={() => setExamDateType("target")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                  examDateType === "target" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                data-testid="button-date-type-target"
              >
                Target Date
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-500 mb-2">{t("pages.studyPlan.chooseATimeframeForYour")}</p>
            <div className="grid grid-cols-4 gap-2">
              {[4, 8, 12].map((weeks) => (
                <button
                  key={weeks}
                  onClick={() => setPlanWithoutDateWeeks(weeks)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
                    planWithoutDateWeeks === weeks ? "bg-primary text-white border-primary" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  data-testid={`button-weeks-${weeks}`}
                >
                  {weeks} weeks
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={![4, 8, 12].includes(planWithoutDateWeeks) ? planWithoutDateWeeks : ""}
                  onChange={(e) => setPlanWithoutDateWeeks(parseInt(e.target.value) || 8)}
                  placeholder={t("pages.studyPlan.custom")}
                  className="w-full py-2 px-2 rounded-lg text-xs font-medium border text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                  data-testid="input-custom-weeks"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">{t("pages.studyPlan.studyIntensity")}</label>
        <div className="grid grid-cols-3 gap-2">
          {(["light", "balanced", "intensive"] as Intensity[]).map((level) => (
            <button
              key={level}
              onClick={() => setIntensity(level)}
              className={`py-3 px-2 rounded-lg text-xs font-medium border transition-colors text-center ${
                intensity === level ? "bg-primary text-white border-primary" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              data-testid={`button-intensity-${level}`}
            >
              {level === "light" && "☀️ "}
              {level === "balanced" && "⚖️ "}
              {level === "intensive" && "🔥 "}
              {level.charAt(0).toUpperCase() + level.slice(1)}
              <p className={`text-[10px] mt-0.5 ${intensity === level ? "text-white/80" : "text-gray-400"}`}>
                {level === "light" && "~45 min/day"}
                {level === "balanced" && "~75 min/day"}
                {level === "intensive" && "~120 min/day"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {showReset && (
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{t("pages.studyPlan.showExamCountdown")}</span>
            <button
              onClick={onToggleCountdown}
              className="text-xs text-primary font-medium"
              data-testid="button-toggle-countdown"
            >
              {countdownHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{t("pages.studyPlan.showStudyPlannerOnDashboard")}</span>
            <button
              onClick={onTogglePlanner}
              className="text-xs text-primary font-medium"
              data-testid="button-toggle-planner"
            >
              {plannerHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={onGenerate}
          disabled={generating || (!planWithoutDate && !examDate)}
          className="flex-1 rounded-full"
          data-testid="button-generate-plan"
        >
          {generating ? (
            <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> {t("pages.studyPlan.generating")}</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-1.5" /> {showReset ? "Update Plan" : "Generate My Plan"}</>
          )}
        </Button>
        {showReset && (
          <Button
            variant="outline"
            onClick={onReset}
            className="rounded-full text-xs"
            data-testid="button-reset-plan"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
