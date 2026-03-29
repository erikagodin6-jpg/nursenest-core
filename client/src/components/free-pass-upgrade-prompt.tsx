import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, BookOpen, Brain, Target } from "lucide-react";
import { useAuth } from "@/lib/auth";

import { useI18n } from "@/lib/i18n";
interface FreePassUpgradePromptProps {
  questionsCompleted?: number;
  flashcardsStudied?: number;
  lessonsViewed?: number;
  variant?: "inline" | "modal";
  onDismiss?: () => void;
}

export function FreePassUpgradePrompt({
  questionsCompleted = 0,
  flashcardsStudied = 0,
  lessonsViewed = 0,
  variant = "inline",
  onDismiss,
}: FreePassUpgradePromptProps) {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (user && user.tier !== "free") return null;

  const hasProgress = questionsCompleted > 0 || flashcardsStudied > 0 || lessonsViewed > 0;

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <Card
      className={`border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white overflow-hidden ${
        variant === "modal" ? "max-w-lg mx-auto shadow-xl" : "shadow-[var(--shadow-card)]"
      }`}
      data-testid="free-pass-upgrade-prompt"
    >
      <CardContent className="p-6 relative">
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            aria-label={t("components.freePassUpgradePrompt.dismiss")}
            data-testid="button-dismiss-upgrade"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900" data-testid="text-upgrade-title">
              {hasProgress
                ? "Your progress is saved. Upgrade to keep practicing."
                : "Upgrade to unlock full access"}
            </h3>
          </div>
        </div>

        {hasProgress && (
          <div className="grid grid-cols-3 gap-3 mb-4" data-testid="progress-summary">
            {questionsCompleted > 0 && (
              <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                <Target className="w-4 h-4 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900" data-testid="text-questions-completed">{questionsCompleted}</div>
                <div className="text-xs text-gray-500">{t("components.freePassUpgradePrompt.questions")}</div>
              </div>
            )}
            {flashcardsStudied > 0 && (
              <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                <Brain className="w-4 h-4 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900" data-testid="text-flashcards-studied">{flashcardsStudied}</div>
                <div className="text-xs text-gray-500">{t("components.freePassUpgradePrompt.flashcards")}</div>
              </div>
            )}
            {lessonsViewed > 0 && (
              <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900" data-testid="text-lessons-viewed">{lessonsViewed}</div>
                <div className="text-xs text-gray-500">{t("components.freePassUpgradePrompt.lessons")}</div>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4">
          {questionsCompleted > 0
            ? `You've completed ${questionsCompleted} questions. Upgrade to continue practicing.`
            : "You've already started preparing for your exam. Unlock full access to continue your progress."}
        </p>

        <Button
          className="w-full rounded-full font-semibold bg-primary hover:brightness-110 text-white shadow-lg shadow-primary/20 h-11"
          onClick={() => navigate("/pricing")}
          data-testid="button-unlock-full-access"
        >
          Unlock Full Access
        </Button>
      </CardContent>
    </Card>
  );
}
