import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { getTierConfig } from "@shared/tier-config";
import { getExamNameForTier, type Region } from "@shared/constants";
import {
  resolveLifecycleState,
  getStateInfo,
  type LifecycleState,
  type LifecycleData,
} from "@/lib/lifecycle-state";
import {
  Calendar,
  Flame,
  TrendingUp,
  Target,
  ArrowRight,
  Clock,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Brain,
  RefreshCw,
  Heart,
  Stethoscope,
  AlertTriangle,
  Briefcase,
  CalendarClock,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/lib/i18n";
type DailyGoals = {
  lessonsTarget: number;
  lessonsCompleted: number;
  questionsTarget: number;
  questionsCompleted: number;
  minutesTarget: number;
  minutesCompleted: number;
};

type ExamReadiness = {
  readiness: number;
  accuracy: number;
  totalAnswered: number;
  confidenceScore: number;
  coverageEstimate: number;
  streak: number;
};

type PlanData = {
  hasPlan: boolean;
  plan?: {
    phase?: { phase: string; label: string; daysRemaining: number };
    pacingTargets?: {
      questionsPerDay: number;
      flashcardsPerWeek: number;
      studyMinutesPerDay: number;
      mocksToTake: number;
    };
    onTrackStatus?: string;
    onTrackMessage?: string;
    recommendations?: Array<{ title: string }>;
  };
  settings?: any;
};

type WeakArea = {
  bodySystem: string;
  topic: string;
  accuracy: number;
  total: number;
};

type CommandCenterData = {
  lifecycleData: LifecycleData;
  readiness: ExamReadiness | null;
  goals: DailyGoals | null;
  planData: PlanData | null;
  weakAreas: WeakArea[];
};

function GoalMiniBar({ completed, target, label }: { completed: number; target: number; label: string }) {
  const { t } = useI18n();
  const pct = target > 0 ? Math.min(100, Math.round((completed / target) * 100)) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct >= 100 ? "#10b981" : "#BFA6F6",
          }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 w-10 text-right">{completed}/{target}</span>
    </div>
  );
}

function StatPill({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center p-2.5 rounded-xl bg-white/60 border border-gray-100/80 min-w-0">
      <p className={`text-lg font-bold ${color}`} data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">{label}</p>
    </div>
  );
}

export function CommandCenter() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [data, setData] = useState<CommandCenterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    Promise.allSettled([
      fetch("/api/exam-planner/settings", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`/api/exam-readiness/${user.id}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`/api/daily-goals/${user.id}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch("/api/exam-planner/plan", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`/api/weak-areas/${user.id}`).then((r) =>
        r.ok ? r.json() : []
      ),
    ]).then(([settingsR, readinessR, goalsR, planR, weakR]) => {
      const settings =
        settingsR.status === "fulfilled" ? settingsR.value : null;
      const readiness =
        readinessR.status === "fulfilled" ? readinessR.value : null;
      const goals = goalsR.status === "fulfilled" ? goalsR.value : null;
      const planData = planR.status === "fulfilled" ? planR.value : null;
      const weakAreas =
        weakR.status === "fulfilled" ? weakR.value || [] : [];

      let daysRemaining: number | null = null;
      if (settings?.exam_date) {
        daysRemaining = Math.ceil(
          (new Date(settings.exam_date).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        );
      }

      const lifecycleData: LifecycleData = {
        examDate: settings?.exam_date || null,
        examDateType: settings?.exam_date_type || null,
        examResultStatus: settings?.exam_result_status || null,
        examFollowupCompleted: settings?.exam_followup_completed || false,
        examPostponed: settings?.exam_postponed || false,
        careerStage: settings?.career_stage || "student",
        newGradResourcesActivated:
          settings?.new_grad_resources_activated || false,
        examCountdownHidden: settings?.exam_countdown_hidden || false,
        studyPlannerHidden: settings?.study_planner_hidden || false,
        studyPlanIntensity: settings?.study_plan_intensity || "balanced",
        daysRemaining,
        tier: user.tier || null,
      };

      setData({ lifecycleData, readiness, goals, planData, weakAreas });
    }).finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) return null;

  if (loading) {
    return (
      <div
        data-testid="command-center-loading"
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse"
      >
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-24 bg-gray-100 rounded mb-3" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    );
  }

  if (!data) return null;

  const state = resolveLifecycleState(data.lifecycleData);
  const stateInfo = getStateInfo(state);
  const tierConfig = getTierConfig(user.tier || "free");
  const examLabel =
    getExamNameForTier(
      user.tier || "",
      (user.region as Region) || "US"
    ) || tierConfig.examPrepLabel;

  return (
    <div
      data-testid="command-center"
      className={`rounded-2xl border ${stateInfo.borderColor} bg-gradient-to-br ${stateInfo.gradientFrom} ${stateInfo.gradientTo} to-white p-5 sm:p-6 shadow-sm transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${stateInfo.badgeColor}`}
            data-testid="badge-lifecycle-state"
          >
            {stateInfo.label}
          </span>
          {user.tier && user.tier !== "free" && (
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              {tierConfig.shortLabel}
            </span>
          )}
        </div>
      </div>

      {state === "no_exam_date" && (
        <NoExamDateContent navigate={navigate} examLabel={examLabel} />
      )}
      {state === "exam_upcoming" && (
        <ExamUpcomingContent
          data={data}
          navigate={navigate}
          examLabel={examLabel}
        />
      )}
      {state === "exam_approaching_soon" && (
        <ExamApproachingSoonContent
          data={data}
          navigate={navigate}
          examLabel={examLabel}
        />
      )}
      {state === "awaiting_results" && (
        <AwaitingResultsContent navigate={navigate} examLabel={examLabel} />
      )}
      {state === "passed" && (
        <PassedContent navigate={navigate} />
      )}
      {state === "did_not_pass" && (
        <DidNotPassContent data={data} navigate={navigate} examLabel={examLabel} />
      )}
      {state === "postponed" && (
        <PostponedContent navigate={navigate} examLabel={examLabel} />
      )}
      {state === "new_grad_active" && (
        <NewGradActiveContent navigate={navigate} />
      )}
    </div>
  );
}

function NoExamDateContent({
  navigate,
  examLabel,
}: {
  navigate: (path: string) => void;
  examLabel: string;
}) {
  return (
    <div data-testid="command-center-no-exam-date">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Set your {examLabel} exam date
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Get a personalized study plan with daily targets, phase-based pacing,
            and smart recommendations tailored to your timeline.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => navigate("/study-plan")}
          className="rounded-full shadow-sm"
          data-testid="button-cc-set-exam-date"
        >
          <CalendarClock className="w-4 h-4 mr-1.5" /> Set Exam Date
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/study-plan")}
          className="rounded-full"
          data-testid="button-cc-plan-without-date"
        >
          <BookOpen className="w-4 h-4 mr-1.5" /> Plan Without a Date
        </Button>
      </div>
    </div>
  );
}

function ExamUpcomingContent({
  data,
  navigate,
  examLabel,
}: {
  data: CommandCenterData;
  navigate: (path: string) => void;
  examLabel: string;
}) {
  const days = data.lifecycleData.daysRemaining || 0;
  const streak = data.readiness?.streak || 0;
  const readiness = data.readiness?.readiness || 0;
  const plan = data.planData?.plan;
  const pacing = plan?.pacingTargets;
  const phase = plan?.phase;

  const phaseLabel = phase?.label || "Study Phase";
  const questionsToday = pacing?.questionsPerDay || 0;

  let integratedMessage = `${days} days until your exam.`;
  if (phase) integratedMessage += ` You're in ${phaseLabel.toLowerCase()} phase.`;
  if (streak > 0)
    integratedMessage += ` Maintain your ${streak}-day streak`;
  if (questionsToday > 0)
    integratedMessage += ` and aim for ${questionsToday} questions today.`;
  else if (streak > 0) integratedMessage += ".";

  return (
    <div data-testid="command-center-exam-upcoming">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {examLabel} Prep
          </h3>
          <p
            className="text-sm text-gray-600 leading-relaxed"
            data-testid="text-cc-message"
          >
            {integratedMessage}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <StatPill value={`${days}`} label={t("components.commandCenter.daysLeft")} color="text-primary" />
        <StatPill
          value={`${readiness}%`}
          label={t("components.commandCenter.readiness")}
          color={
            readiness >= 70
              ? "text-emerald-600"
              : readiness >= 50
              ? "text-amber-600"
              : "text-red-500"
          }
        />
        <StatPill
          value={`${streak}`}
          label={t("components.commandCenter.dayStreak")}
          color={streak > 0 ? "text-orange-500" : "text-gray-400"}
        />
        {pacing && (
          <StatPill
            value={`${pacing.questionsPerDay}`}
            label={t("components.commandCenter.qdayTarget")}
            color="text-primary"
          />
        )}
      </div>

      {data.goals && (
        <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-white/60 border border-gray-100/80">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Today's Progress
          </p>
          <GoalMiniBar
            completed={data.goals.lessonsCompleted}
            target={data.goals.lessonsTarget}
            label={t("components.commandCenter.lessons")}
          />
          <GoalMiniBar
            completed={data.goals.questionsCompleted}
            target={data.goals.questionsTarget}
            label={t("components.commandCenter.questions")}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => navigate("/study-plan")}
          className="rounded-full shadow-sm"
          data-testid="button-cc-view-plan"
        >
          <Sparkles className="w-4 h-4 mr-1.5" /> View Study Plan
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/mock-exams")}
          className="rounded-full"
          data-testid="button-cc-practice"
        >
          <Brain className="w-4 h-4 mr-1.5" /> Practice
        </Button>
      </div>
    </div>
  );
}

function ExamApproachingSoonContent({
  data,
  navigate,
  examLabel,
}: {
  data: CommandCenterData;
  navigate: (path: string) => void;
  examLabel: string;
}) {
  const days = data.lifecycleData.daysRemaining || 0;
  const readiness = data.readiness?.readiness || 0;
  const weakAreas = data.weakAreas.slice(0, 3);

  return (
    <div data-testid="command-center-approaching-soon">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6 text-amber-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {days} {days === 1 ? "Day" : "Days"} Until Your {examLabel}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            You're in the final stretch. Focus on your weak areas and take a
            full-length mock exam to build confidence. You've got this.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatPill value={`${days}`} label={t("components.commandCenter.daysLeft2")} color="text-amber-600" />
        <StatPill
          value={`${readiness}%`}
          label={t("components.commandCenter.readiness2")}
          color={
            readiness >= 70
              ? "text-emerald-600"
              : readiness >= 50
              ? "text-amber-600"
              : "text-red-500"
          }
        />
      </div>

      {weakAreas.length > 0 && (
        <div className="p-3 rounded-xl bg-white/60 border border-amber-100/80 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
              Focus Areas
            </p>
          </div>
          <div className="space-y-1.5">
            {weakAreas.map((area, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-700 truncate">
                  {area.topic || area.bodySystem}
                </span>
                <span
                  className={`font-medium ${
                    area.accuracy >= 50 ? "text-amber-600" : "text-red-500"
                  }`}
                >
                  {area.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => navigate("/mock-exams")}
          className="rounded-full shadow-sm bg-amber-500 hover:bg-amber-600 text-white"
          data-testid="button-cc-take-mock"
        >
          <Brain className="w-4 h-4 mr-1.5" /> Take Mock Exam
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/study-plan")}
          className="rounded-full"
          data-testid="button-cc-review-plan"
        >
          <Target className="w-4 h-4 mr-1.5" /> Review Plan
        </Button>
      </div>
    </div>
  );
}

function AwaitingResultsContent({
  navigate,
  examLabel,
}: {
  navigate: (path: string) => void;
  examLabel: string;
}) {
  return (
    <div data-testid="command-center-awaiting-results">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6 text-sky-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Awaiting Your {examLabel} Results
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            You've put in the work — now take a breath. While you wait, you can
            do some light review to keep your knowledge fresh, or explore career
            resources.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/lessons")}
          className="rounded-full"
          data-testid="button-cc-light-review"
        >
          <BookOpen className="w-4 h-4 mr-1.5" /> Light Review
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/new-grad")}
          className="rounded-full"
          data-testid="button-cc-explore-career"
        >
          <Briefcase className="w-4 h-4 mr-1.5" /> Explore Career Resources
        </Button>
      </div>
    </div>
  );
}

function PassedContent({
  navigate,
}: {
  navigate: (path: string) => void;
}) {
  return (
    <div data-testid="command-center-passed">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <PartyPopper className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Congratulations — You Passed!
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your hard work paid off. Now it's time to transition into your
            nursing career. Explore our new grad resources to prepare for your
            first clinical role.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => navigate("/new-grad")}
          className="rounded-full shadow-sm bg-emerald-500 hover:bg-emerald-600 text-white"
          data-testid="button-cc-new-grad-hub"
        >
          <GraduationCap className="w-4 h-4 mr-1.5" /> New Grad Hub
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/newgrad/guides")}
          className="rounded-full"
          data-testid="button-cc-career-guides"
        >
          <Briefcase className="w-4 h-4 mr-1.5" /> Career Guides
        </Button>
      </div>
    </div>
  );
}

function DidNotPassContent({
  data,
  navigate,
  examLabel,
}: {
  data: CommandCenterData;
  navigate: (path: string) => void;
  examLabel: string;
}) {
  const weakAreas = data.weakAreas.slice(0, 3);

  return (
    <div data-testid="command-center-did-not-pass">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
          <Heart className="w-6 h-6 text-rose-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Your Next Step Forward
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Many successful nurses needed more than one attempt. Let's build a
            focused recovery plan targeting your weak areas so you come back
            stronger and more confident.
          </p>
        </div>
      </div>

      {weakAreas.length > 0 && (
        <div className="p-3 rounded-xl bg-white/60 border border-rose-100/80 mb-4">
          <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider mb-2">
            Areas to Strengthen
          </p>
          <div className="space-y-1.5">
            {weakAreas.map((area, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-700 truncate">
                  {area.topic || area.bodySystem}
                </span>
                <span className="font-medium text-rose-500">
                  {area.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => navigate("/study-plan")}
          className="rounded-full shadow-sm"
          data-testid="button-cc-rebuild-plan"
        >
          <RefreshCw className="w-4 h-4 mr-1.5" /> Build Recovery Plan
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/lessons")}
          className="rounded-full"
          data-testid="button-cc-review-lessons"
        >
          <BookOpen className="w-4 h-4 mr-1.5" /> Review Lessons
        </Button>
      </div>
    </div>
  );
}

function PostponedContent({
  navigate,
  examLabel,
}: {
  navigate: (path: string) => void;
  examLabel: string;
}) {
  return (
    <div data-testid="command-center-postponed">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          <CalendarClock className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Exam Postponed
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            No worries — sometimes plans change. Update your new {examLabel} exam
            date when you're ready, and we'll refresh your study plan to match
            your new timeline.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => navigate("/study-plan")}
          className="rounded-full shadow-sm"
          data-testid="button-cc-update-date"
        >
          <CalendarClock className="w-4 h-4 mr-1.5" /> Update Exam Date
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/lessons")}
          className="rounded-full"
          data-testid="button-cc-continue-studying"
        >
          <BookOpen className="w-4 h-4 mr-1.5" /> Continue Studying
        </Button>
      </div>
    </div>
  );
}

function NewGradActiveContent({
  navigate,
}: {
  navigate: (path: string) => void;
}) {
  return (
    <div data-testid="command-center-new-grad-active">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Your Career Launch Dashboard
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Access clinical support resources, shift preparation tools, and
            career development guides designed for your first year as a nurse.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => navigate("/newgrad/guides")}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/60 border border-indigo-100/80 hover:bg-indigo-50/40 transition-colors"
          data-testid="button-cc-survival-guides"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-gray-700">{t("components.commandCenter.survivalGuides")}</span>
        </button>
        <button
          onClick={() => navigate("/newgrad/interview")}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/60 border border-indigo-100/80 hover:bg-indigo-50/40 transition-colors"
          data-testid="button-cc-interview-prep"
        >
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-gray-700">{t("components.commandCenter.interviewPrep")}</span>
        </button>
        <button
          onClick={() => navigate("/newgrad/certifications")}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/60 border border-indigo-100/80 hover:bg-indigo-50/40 transition-colors"
          data-testid="button-cc-certifications"
        >
          <Stethoscope className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-gray-700">{t("components.commandCenter.certifications")}</span>
        </button>
      </div>
      <Button
        size="sm"
        onClick={() => navigate("/new-grad")}
        className="rounded-full shadow-sm w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white"
        data-testid="button-cc-new-grad-hub"
      >
        <GraduationCap className="w-4 h-4 mr-1.5" /> Go to New Grad Hub
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </Button>
    </div>
  );
}
