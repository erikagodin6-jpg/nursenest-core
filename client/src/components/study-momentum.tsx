import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { LocaleLink } from "@/lib/LocaleLink";
import { useLocation } from "wouter";
import { getExamNameForTier, type Region } from "@shared/constants";
import { useI18n } from "@/lib/i18n";
import {
  Flame,
  Target,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

type DailyGoals = {
  lessonsTarget: number;
  lessonsCompleted: number;
  questionsTarget: number;
  questionsCompleted: number;
  minutesTarget: number;
  minutesCompleted: number;
};

type WeakArea = {
  bodySystem: string;
  topic: string;
  accuracy: number;
  total: number;
  guessingCount: number;
};

type ReviewQueueSummary = {
  questionCount: number;
  lessonCount: number;
  total: number;
};

type ExamReadiness = {
  readiness: number;
  accuracy: number;
  totalAnswered: number;
  confidenceScore: number;
  coverageEstimate: number;
  streak: number;
};

function GoalProgressBar({ completed, target, label }: { completed: number; target: number; label: string }) {
  const { t } = useI18n();
  const pct = target > 0 ? Math.min(100, Math.round((completed / target) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{completed}/{target}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct >= 100 ? "#10b981" : "#BFA6F6",
          }}
        />
      </div>
    </div>
  );
}

export function StudyMomentumPanel() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [goals, setGoals] = useState<DailyGoals | null>(null);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueSummary | null>(null);
  const [readiness, setReadiness] = useState<ExamReadiness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }

    Promise.allSettled([
      fetch(`/api/daily-goals/${user.id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/weak-areas/${user.id}`).then(r => r.ok ? r.json() : []),
      fetch(`/api/review-queue/${user.id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/exam-readiness/${user.id}`).then(r => r.ok ? r.json() : null),
    ]).then(([goalsR, weakR, reviewR, readinessR]) => {
      if (goalsR.status === "fulfilled") setGoals(goalsR.value);
      if (weakR.status === "fulfilled") setWeakAreas(weakR.value || []);
      if (reviewR.status === "fulfilled") setReviewQueue(reviewR.value);
      if (readinessR.status === "fulfilled") setReadiness(readinessR.value);
    }).finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) return null;
  if (loading) {
    return (
      <div data-testid="study-momentum-loading" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-20 bg-gray-100 rounded" />
      </div>
    );
  }

  const streak = readiness?.streak || 0;
  const tierLabel = getExamNameForTier(user.tier || "", (user.region as Region) || "US") || "Exam";

  return (
    <div data-testid="study-momentum-panel" className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-testid="card-study-streak" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{t("components.studyMomentum.studyStreak")}</p>
              <p data-testid="text-streak-count" className="text-2xl font-bold text-gray-900">{streak} <span className="text-sm font-normal text-gray-500">{t("components.studyMomentum.days")}</span></p>
            </div>
          </div>
          {streak >= 7 && <p className="text-xs text-orange-600 font-medium">{t("components.studyMomentum.keepItUpYoureOn")}</p>}
          {streak === 0 && <p className="text-xs text-gray-400">{t("components.studyMomentum.startStudyingToBeginYour")}</p>}
        </div>

        <div data-testid="card-exam-readiness" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{tierLabel} Readiness</p>
              <p data-testid="text-readiness-score" className="text-2xl font-bold text-gray-900">{readiness?.readiness || 0}<span className="text-sm font-normal text-gray-500">%</span></p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${readiness?.readiness || 0}%`,
                background: (readiness?.readiness || 0) >= 70 ? "#10b981" : (readiness?.readiness || 0) >= 50 ? "#f59e0b" : "#ef4444",
              }}
            />
          </div>
        </div>

        <div data-testid="card-review-due" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{t("components.studyMomentum.reviewDueToday")}</p>
              <p data-testid="text-review-count" className="text-2xl font-bold text-gray-900">{reviewQueue?.total || 0} <span className="text-sm font-normal text-gray-500">{t("components.studyMomentum.items")}</span></p>
            </div>
          </div>
          {(reviewQueue?.total || 0) > 0 && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{reviewQueue?.questionCount || 0} Questions</span>
              <span>{reviewQueue?.lessonCount || 0} Lessons</span>
            </div>
          )}
          {(reviewQueue?.total || 0) > 0 && (
            <button
              data-testid="button-start-review"
              onClick={() => setLocation("/dashboard")}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Start Review <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div data-testid="card-daily-goals" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs text-gray-500 font-medium">{t("components.studyMomentum.todaysGoals")}</p>
          </div>
          {goals && (
            <div className="space-y-2">
              <GoalProgressBar completed={goals.lessonsCompleted} target={goals.lessonsTarget} label={t("components.studyMomentum.lessons")} />
              <GoalProgressBar completed={goals.questionsCompleted} target={goals.questionsTarget} label={t("components.studyMomentum.questions")} />
            </div>
          )}
        </div>
      </div>

      {weakAreas.length > 0 && (
        <div data-testid="panel-weak-areas" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-800">{t("components.studyMomentum.needsReview")}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {weakAreas.slice(0, 6).map((area, idx) => (
              <div key={idx} data-testid={`weak-area-${idx}`} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{area.topic || area.bodySystem}</p>
                  <p className="text-xs text-gray-500">{area.accuracy}% accuracy ({area.total} questions)</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    data-testid={`button-review-lesson-${idx}`}
                    onClick={() => setLocation("/lessons")}
                    className="text-[10px] font-medium px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    Lesson
                  </button>
                  <button
                    data-testid={`button-practice-questions-${idx}`}
                    onClick={() => setLocation("/free-practice")}
                    className="text-[10px] font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ConfidenceRatingModal({
  questionId,
  wasCorrect,
  topic,
  bodySystem,
  onClose,
}: {
  questionId: string;
  wasCorrect: boolean;
  topic?: string;
  bodySystem?: string;
  onClose: (confidence: string) => void;
}) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selected || !user?.id) return;
    try {
      await fetch("/api/confidence-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, questionId, confidence: selected, wasCorrect, topic, bodySystem }),
      });
    } catch (e) {}
    onClose(selected);
  };

  const options = [
    { value: "very_confident", label: "Very confident", color: "border-emerald-200 bg-emerald-50 hover:border-emerald-400 text-emerald-700" },
    { value: "somewhat", label: "Somewhat confident", color: "border-amber-200 bg-amber-50 hover:border-amber-400 text-amber-700" },
    { value: "guessing", label: "Guessing", color: "border-red-200 bg-red-50 hover:border-red-400 text-red-700" },
  ];

  return (
    <div data-testid="confidence-rating-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">{t("components.studyMomentum.howConfidentWereYou")}</h3>
        </div>
        <div className="space-y-2 mb-5">
          {options.map((opt) => (
            <button
              key={opt.value}
              data-testid={`button-confidence-${opt.value}`}
              onClick={() => setSelected(opt.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                selected === opt.value ? opt.color + " ring-2 ring-offset-1 ring-primary/30" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          data-testid="button-submit-confidence"
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-2.5 rounded-full bg-primary text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export function InlineConfidenceRating({
  questionId,
  wasCorrect,
  topic,
  bodySystem,
  onClose,
}: {
  questionId: string;
  wasCorrect: boolean;
  topic?: string;
  bodySystem?: string;
  onClose?: (confidence: string) => void;
}) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || submitted) return null;

  const handleSubmit = async (value: string) => {
    setSelected(value);
    setSubmitted(true);
    if (user?.id) {
      try {
        await fetch("/api/confidence-rating", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, questionId, confidence: value, wasCorrect, topic, bodySystem }),
        });
      } catch (e) {}
    }
    onClose?.(value);
  };

  const options = [
    { value: "very_confident", label: "Confident", emoji: "✓", cls: "hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700" },
    { value: "somewhat", label: "Somewhat", emoji: "~", cls: "hover:border-amber-400 hover:bg-amber-50 text-amber-700" },
    { value: "guessing", label: "Guessing", emoji: "?", cls: "hover:border-red-400 hover:bg-red-50 text-red-700" },
  ];

  return (
    <div data-testid="inline-confidence-rating" className="flex items-center gap-2 py-2 px-1">
      <span className="text-xs text-gray-500 shrink-0">{t("components.studyMomentum.confidence")}</span>
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            data-testid={`button-inline-confidence-${opt.value}`}
            onClick={() => handleSubmit(opt.value)}
            className={`px-3 py-1 rounded-lg border border-gray-200 text-xs font-medium transition-all ${opt.cls}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        data-testid="button-dismiss-confidence"
        onClick={() => { setDismissed(true); onClose?.("skipped"); }}
        className="text-xs text-gray-400 hover:text-gray-600 ml-auto"
      >
        Skip
      </button>
    </div>
  );
}
