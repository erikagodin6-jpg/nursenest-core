import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { LocaleLink } from "@/lib/LocaleLink";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { getExamNameForTier } from "@shared/constants";
import { useRegion } from "@/hooks/use-region";
import { canonicalDisplayName } from "@/lib/canonical-display";

import { useI18n } from "@/lib/i18n";
type ProgressEntry = {
  lessonId: string;
  completed: boolean;
  lastAccessed: string;
};

type System = {
  id: string;
  title: string;
  diseases: Array<{ id: string; name: string }>;
};

type LessonProgressCardProps = {
  activeTier: string;
  systems: System[];
};

export function LessonProgressCard({ activeTier, systems }: LessonProgressCardProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const region = useRegion();
  const tierLabel = getExamNameForTier(activeTier, region) || activeTier.toUpperCase();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`/api/progress/${user.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ProgressEntry[]) => setProgress(Array.isArray(data) ? data : []))
      .catch(() => setProgress([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) {
    return (
      <div
        data-testid="lesson-progress-card-unauthenticated"
        className="rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br from-primary/5 to-teal-50/30 p-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 data-testid="text-progress-heading" className="text-lg font-semibold text-gray-800">
            Track Your Study Progress
          </h3>
        </div>
        <p data-testid="text-progress-subtext" className="text-sm text-gray-500 mb-4">
          Sign up to track your progress across all lessons and build exam confidence.
        </p>
        <LocaleLink href="/register">
          <button
            data-testid="button-start-free-trial"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </button>
        </LocaleLink>
      </div>
    );
  }

  const allLessonIds = systems.flatMap((s) => s.diseases.map((d) => d.id));
  const totalLessons = allLessonIds.length;
  const completedSet = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
  const completedCount = allLessonIds.filter((id) => completedSet.has(id)).length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const remainingLessons = totalLessons - completedCount;
  const remainingMinutes = remainingLessons * 8;
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;

  const lastAccessedEntry = progress
    .filter((p) => !p.completed && allLessonIds.includes(p.lessonId))
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())[0];

  const lastAccessedLessonName = lastAccessedEntry
    ? canonicalDisplayName(systems
        .flatMap((s) => s.diseases)
        .find((d) => d.id === lastAccessedEntry.lessonId)?.name || "")
    : null;

  const nextIncompleteId = allLessonIds.find((id) => !completedSet.has(id));


  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      data-testid="lesson-progress-card-authenticated"
      className="rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br from-primary/5 to-teal-50/30 p-6"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div data-testid="progress-ring" className="flex-shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              className="stroke-primary"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 40 40)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <text
              x="40"
              y="40"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-gray-800 text-xs font-bold"
              fontSize="14"
            >
              {loading ? "..." : `${percentage}%`}
            </text>
          </svg>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3 data-testid="text-tier-heading" className="text-base font-semibold text-gray-700 mb-1">
            {tierLabel} Study Progress
          </h3>
          <p data-testid="text-percentage" className="text-2xl font-bold text-gray-900">
            {percentage}% Complete
          </p>
          <p data-testid="text-completed-count" className="text-sm text-gray-500 mt-1">
            Completed: {completedCount} / {totalLessons} Lessons
          </p>
          <p data-testid="text-estimated-remaining" className="text-sm text-gray-500 flex items-center gap-1 justify-center sm:justify-start mt-0.5">
            <Clock className="h-3.5 w-3.5" />
            Estimated Remaining: {remainingHours}h {remainingMins}m
          </p>
        </div>
      </div>

      {lastAccessedEntry && lastAccessedLessonName && (
        <div
          data-testid="continue-where-left-off"
          className="mt-4 p-3 rounded-xl bg-white/60 border border-gray-100 flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{t("components.lessonProgressCard.continueWhereYouLeftOff")}</p>
            <p data-testid="text-last-accessed-lesson" className="text-sm font-medium text-gray-700 mt-0.5">
              {lastAccessedLessonName}
            </p>
          </div>
          <LocaleLink href={`/lessons/${lastAccessedEntry.lessonId}`}>
            <button
              data-testid="button-resume"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              Resume
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </LocaleLink>
        </div>
      )}

      {nextIncompleteId && (
        <div className="mt-4 flex justify-center sm:justify-start">
          <button
            data-testid="button-continue-learning"
            onClick={() => setLocation(`/lessons/${nextIncompleteId}`)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Continue Learning
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
