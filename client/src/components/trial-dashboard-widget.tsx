import { useState, useEffect } from "react";
import { useTrialStatus } from "@/hooks/use-trial-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Eye, Lock, ArrowUpRight, AlertCircle, BookOpen, Layers, FileText, Beaker } from "lucide-react";
import { useLocation } from "wouter";

import { useI18n } from "@/lib/i18n";
function formatCountdown(ms: number): string {

  if (ms <= 0) return "Expired";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TrialDashboardWidget() {
  const { t } = useI18n();
  const trialStatus = useTrialStatus();
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState("");
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!trialStatus.isOnTrial || !trialStatus.trialEndsAt) return;

    function tick() {
      const ms = Math.max(0, new Date(trialStatus.trialEndsAt!).getTime() - Date.now());
      setRemainingMs(ms);
      setCountdown(formatCountdown(ms));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [trialStatus.isOnTrial, trialStatus.trialEndsAt]);

  if (trialStatus.isLoading || !trialStatus.isOnTrial) return null;

  const counters = trialStatus.consumptionCounters || { questions: 0, flashcards: 0, lessons: 0, mockExams: 0 };
  const limits = trialStatus.consumptionLimits || { questions: 50, flashcards: 30, lessons: 5, mockExams: 2 };

  const totalHours = trialStatus.trialStartedAt && trialStatus.trialEndsAt
    ? (new Date(trialStatus.trialEndsAt).getTime() - new Date(trialStatus.trialStartedAt).getTime()) / (1000 * 60 * 60)
    : 24;
  const elapsedPercent = totalHours > 0
    ? Math.min(100, Math.max(0, ((totalHours * 3600000 - remainingMs) / (totalHours * 3600000)) * 100))
    : 0;

  const consumptionItems = [
    { label: "Questions", icon: FileText, used: counters.questions, max: limits.questions },
    { label: "Flashcards", icon: Layers, used: counters.flashcards, max: limits.flashcards },
    { label: "Lessons", icon: BookOpen, used: counters.lessons, max: limits.lessons },
    { label: "Mock Exams", icon: Beaker, used: counters.mockExams, max: limits.mockExams },
  ];

  const tierLabel = (trialStatus.selectedTier || "").toUpperCase();

  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-lg" data-testid="widget-trial-dashboard">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-amber-600" />
            Free Trial Active
          </CardTitle>
          <Badge className="bg-amber-100 text-amber-700 border-amber-200" data-testid="badge-trial-tier">
            {tierLabel} Trial
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-center" data-testid="section-trial-countdown">
          <p className="text-xs text-gray-500 mb-1">{t("components.trialDashboardWidget.timeRemaining")}</p>
          <p className="text-4xl font-bold font-mono text-amber-700 tracking-wider" data-testid="text-trial-countdown">
            {countdown}
          </p>
          <Progress value={elapsedPercent} className="h-2 mt-3" data-testid="progress-trial-time" />
          <p className="text-xs text-gray-400 mt-1">{Math.round(elapsedPercent)}% elapsed</p>
        </div>

        <div className="space-y-2" data-testid="section-trial-consumption">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("components.trialDashboardWidget.contentUsage")}</p>
          {consumptionItems.map(({ label, icon: Icon, used, max }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-mono text-gray-500" data-testid={`text-consumption-${label.toLowerCase()}`}>
                    {used}/{max}
                  </span>
                </div>
                <Progress value={(used / max) * 100} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100" data-testid="notice-trial-view-only">
          <Eye className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-blue-700">{t("components.trialDashboardWidget.viewonlyDuringTrial")}</p>
            <p className="text-xs text-blue-600/80 mt-0.5">
              Content is available for viewing only. Exports, downloads, and printing are unavailable during the trial period.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100" data-testid="notice-trial-cancel">
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Your card will be charged after the trial ends. Cancel anytime before your trial expires to avoid charges.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-primary hover:brightness-110 text-white rounded-full font-semibold shadow-md"
            onClick={() => navigate("/pricing")}
            data-testid="button-trial-upgrade"
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Upgrade Now
          </Button>
          <Button
            variant="outline"
            className="rounded-full text-gray-500"
            onClick={async () => {
              try {
                await fetch("/api/trial-sub/cancel", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("nursenest-user-token") || ""}`,
                  },
                });
                trialStatus.refetch();
              } catch {}
            }}
            data-testid="button-trial-cancel"
          >
            <Lock className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
