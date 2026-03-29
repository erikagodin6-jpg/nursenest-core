import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, TrendingUp, Brain, Sparkles, BookOpen, Target } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { shouldShowPopup, suppressPopup } from "@/lib/popup-suppression";

type MilestoneType = "lessons_completed" | "test_score" | "study_streak" | "first_lesson" | "deep_engagement";

interface MilestoneConfig {
  type: MilestoneType;
  title: string;
  message: string;
  cta: string;
  icon: typeof TrendingUp;
}

const milestones: MilestoneConfig[] = [
  {
    type: "first_lesson",
    title: "You've taken the first step",
    message: "Understanding mechanisms at this level changes how you approach clinical questions. Subscribers access the full pathophysiology library across every body system.",
    cta: "Explore Full Access",
    icon: BookOpen,
  },
  {
    type: "lessons_completed",
    title: "Your clinical reasoning is growing",
    message: "You've completed multiple lessons and demonstrated real engagement with mechanistic thinking. The next step in your progression: deeper pharmacology, advanced clinical scenarios, and targeted exam preparation.",
    cta: "Continue Growing",
    icon: TrendingUp,
  },
  {
    type: "test_score",
    title: "Strong performance: ready for more depth?",
    message: "Your test scores suggest you're building solid clinical reasoning. Full access unlocks advanced pathophysiology, drug interaction analysis, and condition-specific clinical pearls that strengthen exam confidence.",
    cta: "Unlock Advanced Content",
    icon: Target,
  },
  {
    type: "study_streak",
    title: "Consistency builds mastery",
    message: "You've returned to study multiple times: that kind of discipline is what separates confident clinicians from uncertain ones. Full access ensures every study session builds toward deeper understanding.",
    cta: "Support Your Momentum",
    icon: Sparkles,
  },
  {
    type: "deep_engagement",
    title: "You're thinking like a clinician",
    message: "The way you're engaging with mechanisms and clinical reasoning reflects genuine growth. Full subscribers access every lesson, every body system, and every pharmacology module without restriction.",
    cta: "See Subscription Options",
    icon: Brain,
  },
];

function getMilestoneKey(type: MilestoneType): string {
  return `nursenest-milestone-dismissed-${type}`;
}

function getSessionMilestones(): Record<string, number> {
  try {
    const stored = localStorage.getItem("nursenest-session-milestones");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setSessionMilestone(key: string, value: number) {
  const current = getSessionMilestones();
  current[key] = value;
  localStorage.setItem("nursenest-session-milestones", JSON.stringify(current));
}

export function trackMilestone(event: "lesson_view" | "test_complete" | "session_start", data?: { score?: number }) {
  const milestones = getSessionMilestones();

  if (event === "lesson_view") {
    const count = (milestones.lesson_views || 0) + 1;
    setSessionMilestone("lesson_views", count);
  }
  if (event === "test_complete" && data?.score !== undefined) {
    setSessionMilestone("last_test_score", data.score);
    const testCount = (milestones.test_count || 0) + 1;
    setSessionMilestone("test_count", testCount);
  }
  if (event === "session_start") {
    const sessions = (milestones.session_count || 0) + 1;
    setSessionMilestone("session_count", sessions);
    setSessionMilestone("last_session", Date.now());
  }
}

function getActiveMilestone(): MilestoneConfig | null {
  const data = getSessionMilestones();

  const lessonViews = data.lesson_views || 0;
  const testCount = data.test_count || 0;
  const lastScore = data.last_test_score || 0;
  const sessions = data.session_count || 0;

  if (lessonViews === 1 && !localStorage.getItem(getMilestoneKey("first_lesson"))) {
    return milestones.find((m) => m.type === "first_lesson")!;
  }
  if (lastScore >= 70 && testCount >= 1 && !localStorage.getItem(getMilestoneKey("test_score"))) {
    return milestones.find((m) => m.type === "test_score")!;
  }
  if (lessonViews >= 3 && !localStorage.getItem(getMilestoneKey("lessons_completed"))) {
    return milestones.find((m) => m.type === "lessons_completed")!;
  }
  if (sessions >= 3 && !localStorage.getItem(getMilestoneKey("study_streak"))) {
    return milestones.find((m) => m.type === "study_streak")!;
  }
  if (lessonViews >= 5 && testCount >= 2 && !localStorage.getItem(getMilestoneKey("deep_engagement"))) {
    return milestones.find((m) => m.type === "deep_engagement")!;
  }

  return null;
}

const UPGRADE_PROMPT_POPUP_ID = "upgrade_prompt";

export function UpgradePrompt() {
  const [visible, setVisible] = useState(false);
  const [milestone, setMilestone] = useState<MilestoneConfig | null>(null);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (user.tier !== "free") return;
    if (!shouldShowPopup(UPGRADE_PROMPT_POPUP_ID)) return;

    const timer = setTimeout(() => {
      const active = getActiveMilestone();
      if (active) {
        setMilestone(active);
        setVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user]);

  if (!visible || !milestone) return null;

  const Icon = milestone.icon;

  const handleDismiss = () => {
    localStorage.setItem(getMilestoneKey(milestone.type), "true");
    if (dontShowToday) {
      suppressPopup(UPGRADE_PROMPT_POPUP_ID);
    }
    setVisible(false);
  };

  const handleCta = () => {
    handleDismiss();
    navigate("/pricing");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500" data-testid="upgrade-prompt">
      <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{milestone.title}</h3>
                <button
                  onClick={handleDismiss}
                  className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
                  data-testid="button-dismiss-upgrade"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mt-2">{milestone.message}</p>
              <div className="flex items-center gap-4 mt-3">
                <Button
                  size="sm"
                  className="rounded-full text-xs h-8 px-4"
                  onClick={handleCta}
                  data-testid="button-upgrade-cta"
                >
                  {milestone.cta}
                </Button>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="prompt-dont-show-today"
                    checked={dontShowToday}
                    onCheckedChange={(checked) => setDontShowToday(checked === true)}
                    className="h-3.5 w-3.5"
                    data-testid="checkbox-prompt-dont-show-today"
                  />
                  <Label htmlFor="prompt-dont-show-today" className="text-[10px] text-gray-400 cursor-pointer whitespace-nowrap">
                    Not today
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
