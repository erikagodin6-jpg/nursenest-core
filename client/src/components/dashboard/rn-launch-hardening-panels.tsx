import React from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  Gauge,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";

export type DashboardCTA = {
  label: string;
  href: string;
};

export type ResumeHeroProps = {
  title?: string;
  subtitle?: string;
  progressLabel?: string;
  primaryAction: DashboardCTA;
  secondaryAction?: DashboardCTA;
};

export type WeakAreaAction = {
  id: string;
  title: string;
  issueSummary?: string;
  accuracy?: number;
  action: DashboardCTA;
};

export type ReadinessSummaryProps = {
  readinessLabel: string;
  readinessScore?: number;
  strongestArea?: string;
  nextFocus?: string;
  recommendation?: DashboardCTA;
};

export type RNContextHeaderProps = {
  pathway?: string;
  readinessLabel?: string;
  readinessScore?: number;
  currentFocus?: string;
  resumeAction?: DashboardCTA;
};

export function RNContextHeader({
  pathway = "RN Exam Pathway",
  readinessLabel = "Readiness building",
  readinessScore,
  currentFocus,
  resumeAction,
}: RNContextHeaderProps) {
  return (
    <section
      className="mb-4 rounded-2xl border border-primary/10 bg-primary/[0.03] px-4 py-3 sm:px-5"
      aria-label="RN learner context"
      data-testid="rn-context-header"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current pathway</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-foreground truncate">{pathway}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {readinessScore ? `${readinessScore}%` : readinessLabel}
            </span>
            {currentFocus ? (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary font-medium truncate">Focus: {currentFocus}</span>
              </>
            ) : null}
          </div>
        </div>
        {resumeAction ? (
          <Button size="sm" asChild className="min-h-11 w-full sm:w-auto">
            <LocaleLink href={resumeAction.href}>{resumeAction.label}</LocaleLink>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export function ResumeHero({
  title = "Continue Studying",
  subtitle,
  progressLabel,
  primaryAction,
  secondaryAction,
}: ResumeHeroProps) {
  return (
    <Card className="mb-5 overflow-hidden border-primary/20 bg-gradient-to-r from-primary/[0.08] to-background" data-testid="rn-resume-hero">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wide">Next best action</p>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
              {progressLabel ? <p className="mt-1 text-sm font-medium text-foreground">{progressLabel}</p> : null}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-44">
            <Button asChild className="min-h-11 w-full gap-2" data-testid="button-rn-resume-primary">
              <LocaleLink href={primaryAction.href}>
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
                {primaryAction.label}
              </LocaleLink>
            </Button>
            {secondaryAction ? (
              <Button asChild variant="outline" className="min-h-11 w-full" data-testid="button-rn-resume-secondary">
                <LocaleLink href={secondaryAction.href}>{secondaryAction.label}</LocaleLink>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeakAreasInterventionPanel({ areas }: { areas: WeakAreaAction[] }) {
  const visibleAreas = areas.slice(0, 3);

  return (
    <Card className="mb-5 border-amber-200/70 bg-amber-50/35" data-testid="rn-weak-areas-panel">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
          Priority weak areas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleAreas.length === 0 ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              No priority weak areas detected yet.
            </div>
            <p className="mt-1 text-xs text-emerald-700">Complete a question set or CAT to generate targeted recommendations.</p>
          </div>
        ) : (
          visibleAreas.map((area, index) => (
            <div key={area.id} className="rounded-xl border bg-background p-3" data-testid={`rn-weak-area-${index}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{index + 1}. {area.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {area.issueSummary || "Targeted review recommended to strengthen confidence."}
                  </p>
                  {typeof area.accuracy === "number" ? (
                    <p className="mt-1 text-xs font-medium text-amber-700">Current accuracy: {area.accuracy}%</p>
                  ) : null}
                </div>
                <Button asChild size="sm" className="min-h-10 w-full sm:w-auto" data-testid={`button-rn-weak-area-${index}`}>
                  <LocaleLink href={area.action.href}>{area.action.label}</LocaleLink>
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function PrimaryStudyModesGrid() {
  const modes = [
    { title: "Questions", label: "Tactical practice", href: "/question-bank", icon: Target, cta: "Practice" },
    { title: "CAT", label: "Exam simulation", href: "/practice-exams", icon: ClipboardList, cta: "Launch CAT" },
    { title: "Lessons", label: "Structured review", href: "/lessons", icon: BookOpen, cta: "Continue" },
    { title: "Flashcards", label: "Rapid recall", href: "/flashcards", icon: Brain, cta: "Review" },
  ];

  return (
    <section className="mb-5" aria-labelledby="rn-study-modes-title" data-testid="rn-study-modes-grid">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="rn-study-modes-title" className="text-base font-bold">Primary study modes</h2>
        <p className="hidden text-xs text-muted-foreground sm:block">Choose one focused path.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <LocaleLink
              key={mode.title}
              href={mode.href}
              className="group rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              data-testid={`rn-study-mode-${mode.title.toLowerCase()}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{mode.title}</p>
                  <p className="text-xs text-muted-foreground">{mode.label}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  {mode.cta}
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </div>
            </LocaleLink>
          );
        })}
      </div>
    </section>
  );
}

export function ReadinessActionSummary({
  readinessLabel,
  readinessScore,
  strongestArea,
  nextFocus,
  recommendation,
}: ReadinessSummaryProps) {
  return (
    <Card className="mb-5" data-testid="rn-readiness-action-summary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4 text-primary" aria-hidden="true" />
          Readiness summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-lg font-bold text-foreground">
              {readinessScore ? `${readinessScore}% — ` : ""}{readinessLabel}
            </p>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              {strongestArea ? <p>Strongest area: <span className="font-medium text-foreground">{strongestArea}</span></p> : null}
              {nextFocus ? <p>Focus next: <span className="font-medium text-foreground">{nextFocus}</span></p> : null}
            </div>
          </div>
          {recommendation ? (
            <Button asChild className="min-h-11 w-full sm:w-auto" data-testid="button-rn-readiness-recommendation">
              <LocaleLink href={recommendation.href}>
                {recommendation.label}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </LocaleLink>
            </Button>
          ) : (
            <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
              <LocaleLink href="/exam-readiness">
                <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                View readiness
              </LocaleLink>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function buildWeakAreaActions(recommendations: any[] = []): WeakAreaAction[] {
  return recommendations.slice(0, 3).map((rec, index) => ({
    id: String(rec.id || rec.category || index),
    title: rec.category || rec.title || "Targeted review",
    issueSummary: rec.description || "Targeted practice is recommended for this area.",
    accuracy: typeof rec.accuracy === "number" ? rec.accuracy : undefined,
    action: {
      label: "Start targeted review",
      href: rec.links?.practice || rec.path || "/question-bank",
    },
  }));
}

export function getReadinessLabel(score?: number): string {
  if (typeof score !== "number") return "Readiness building";
  if (score >= 85) return "Exam ready";
  if (score >= 70) return "Approaching exam ready";
  if (score >= 40) return "Progressing consistently";
  return "Building foundation";
}
