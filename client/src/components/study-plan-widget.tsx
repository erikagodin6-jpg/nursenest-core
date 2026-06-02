import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  Calendar, CheckCircle2, Clock, Target, BookOpen,
  TrendingUp, ArrowRight, GraduationCap, Sparkles, Brain
} from "lucide-react";

export function StudyPlanWidget({ user }: { user: any }) {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/exam-planner/plan", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <Card data-testid="widget-study-plan-loading">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">{t("components.studyPlanWidget.loadingStudyPlan")}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.hasPlan) {
    return (
      <Card data-testid="widget-study-plan-empty">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Study Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground mb-3">
            Get a personalized study plan with weekly goals, pacing targets, and smart recommendations.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full rounded-full"
            onClick={() => navigate("/study-plan")}
            data-testid="button-widget-create-plan"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Create Study Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  const plan = data.plan;
  const phase = plan?.phase;
  const pacing = plan?.pacingTargets;
  const recs = plan?.recommendations || [];

  const phaseColors: Record<string, string> = {
    foundation: "bg-blue-100 text-blue-800",
    practice: "bg-purple-100 text-purple-800",
    timed_review: "bg-amber-100 text-amber-800",
    final_review: "bg-emerald-100 text-emerald-800",
  };

  const statusIcons: Record<string, any> = {
    ahead: TrendingUp,
    on_track: CheckCircle2,
    slightly_behind: Clock,
    needs_attention: Target,
  };

  const StatusIcon = statusIcons[plan?.onTrackStatus || "on_track"] || CheckCircle2;

  return (
    <Card data-testid="widget-study-plan">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Your Study Plan
          </CardTitle>
          {phase && (
            <Badge className={`text-xs ${phaseColors[phase.phase] || "bg-gray-100"}`} data-testid="widget-plan-phase">
              {phase.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        {phase?.daysRemaining > 0 && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              <strong className="text-primary">{phase.daysRemaining}</strong> days until exam
            </span>
          </div>
        )}

        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50">
          <StatusIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-relaxed">{plan?.onTrackMessage}</p>
        </div>

        {pacing && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold text-primary" data-testid="widget-plan-questions">{pacing.questionsPerDay}</p>
              <p className="text-[10px] text-muted-foreground">{t("components.studyPlanWidget.qday")}</p>
            </div>
            <div className="p-2 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold text-primary" data-testid="widget-plan-flashcards">{pacing.flashcardsPerWeek}</p>
              <p className="text-[10px] text-muted-foreground">{t("components.studyPlanWidget.cardswk")}</p>
            </div>
            <div className="p-2 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold text-primary" data-testid="widget-plan-minutes">{pacing.studyMinutesPerDay}</p>
              <p className="text-[10px] text-muted-foreground">{t("components.studyPlanWidget.minday")}</p>
            </div>
          </div>
        )}

        {recs.length > 0 && (
          <div className="space-y-1.5">
            {recs.slice(0, 2).map((rec: any, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <Sparkles className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{rec.title}</span>
              </div>
            ))}
          </div>
        )}

        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-full"
          onClick={() => navigate("/study-plan")}
          data-testid="button-widget-view-plan"
        >
          View Full Plan
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
