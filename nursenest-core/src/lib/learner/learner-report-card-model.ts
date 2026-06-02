import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { buildAppFlashcardsTopicHref, buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";
import { coerceSafeLearnerNavHref } from "@/lib/learner/safe-app-href";
import { normalizeTopicSlugInput } from "@/lib/study/topic-slug-normalize";
import type { ContinueStudyCheckpoint } from "@/lib/learner/continue-study-types";

export type LearnerReportCardLink = { label: string; href: string };

export type LearnerReportCardViewModel = {
  pathwayId: string;
  readinessLabel: string;
  readinessPct: number | null;
  lessonsCompleted: number;
  lessonsTotal: number;
  /** Clinical Lab Workstation completion (track-scoped labs lessons). */
  labsLessonsCompleted?: number;
  labsLessonsTotal?: number;
  weakTopics: string[];
  strongTopics: string[];
  recentSummary: string | null;
  recommendedActions: string[];
  links: LearnerReportCardLink[];
  continueCta: LearnerReportCardLink | null;
  simulationSummary?: LearnerReportCardSimulationSummary;
};

export type LearnerReportCardSimulationSummary = {
  simulationGpa: number | null;
  readinessScore: number | null;
  readinessTrend: "improving" | "declining" | "stable" | null;
  ncjmmTrend: "improving" | "declining" | "stable" | null;
  completionRate: number | null;
  clearancesEarned: string[];
  clearanceProgress: Array<{ label: string; progress: number; nearestGap: string }>;
  patientHarmReductionTrend: "improving" | "declining" | "stable" | null;
  topConditions: string[];
  weakConditions: string[];
  recommendedSimulations: LearnerReportCardLink[];
};

function readinessPctFromSnapshot(s: PremiumDashboardSnapshot): number | null {
  const v = s.readiness?.score;
  if (typeof v !== "number" || Number.isNaN(v)) return null;
  return Math.max(0, Math.min(100, Math.round(v)));
}

/**
 * Builds a pathway-scoped report card from existing dashboard + study snapshots (no extra DB reads).
 */
export function buildLearnerReportCardViewModel(input: {
  pathwayId: string;
  snapshot: PremiumDashboardSnapshot;
  studySnap: LearnerStudySnapshot | null;
  /** Optional inferred “continue” row — href must already include pathwayId. */
  continueCheckpoint?: ContinueStudyCheckpoint | null;
  labsLessonsCompleted?: number;
  labsLessonsTotal?: number;
  simulationSummary?: LearnerReportCardSimulationSummary;
}): LearnerReportCardViewModel {
  const { pathwayId, snapshot, studySnap, continueCheckpoint, labsLessonsCompleted, labsLessonsTotal, simulationSummary } = input;
  const pid = pathwayId.trim();
  const pct = readinessPctFromSnapshot(snapshot);
  const readinessLabel =
    pct != null ? `${pct}% readiness` : snapshot.examReadyHeadline?.trim() || "Readiness building";

  const weakTopics = (studySnap?.weakTopics ?? []).slice(0, 6).map((w) => w.topic);
  const strongTopics = (studySnap?.strongTopicsHighlight ?? []).slice(0, 6).map((w) => w.topic);

  const recentParts: string[] = [];
  if (snapshot.studyStreakDays > 0) recentParts.push(`${snapshot.studyStreakDays}-day study streak`);
  if (snapshot.practice.sessionCount > 0) {
    recentParts.push(`${snapshot.practice.sessionCount} practice sessions`);
  }
  const recentSummary = recentParts.length > 0 ? recentParts.join(" · ") : null;

  const recommendedActions: string[] = [];
  if (weakTopics.length > 0) recommendedActions.push("Drill your weakest topics");
  if (
    typeof labsLessonsCompleted === "number" &&
    typeof labsLessonsTotal === "number" &&
    labsLessonsTotal > 0 &&
    labsLessonsCompleted < labsLessonsTotal
  ) {
    recommendedActions.push("Continue the clinical lab workstation");
  }
  if ((snapshot.overallLessons.pct ?? 0) < 40) recommendedActions.push("Complete more pathway lessons");
  if (snapshot.practice.accuracyPct != null && snapshot.practice.accuracyPct < 65) {
    recommendedActions.push("Review rationales on missed bank items");
  }
  if (simulationSummary?.recommendedSimulations.length) {
    recommendedActions.push("Complete your recommended simulation");
  }
  if (recommendedActions.length === 0) recommendedActions.push("Keep your daily streak");

  const links: LearnerReportCardLink[] = [];
  links.push({ label: "Clinical labs", href: "/app/labs" });
  const topWeak = studySnap?.topWeak?.topic?.trim();
  const topicSlug = topWeak ? normalizeTopicSlugInput(topWeak) : "";
  if (topWeak && topicSlug) {
    links.push({ label: "Review lesson", href: `/app/lessons?pathwayId=${encodeURIComponent(pid)}&topicSlug=${encodeURIComponent(topicSlug)}` });
    links.push({ label: "Study flashcards", href: buildAppFlashcardsTopicHref(pid, topicSlug) });
    links.push({ label: "Practice questions", href: buildAppPracticeTestsTopicHref(pid, topicSlug) });
  } else if (studySnap?.pathwayNext?.href) {
    links.push({ label: "Next lesson", href: studySnap.pathwayNext.href });
  } else if (snapshot.continueLesson?.href) {
    links.push({ label: "Continue lesson", href: snapshot.continueLesson.href });
  } else {
    links.push({ label: "Lessons hub", href: `/app/lessons?pathwayId=${encodeURIComponent(pid)}` });
    links.push({ label: "Question bank", href: `/app/questions?pathwayId=${encodeURIComponent(pid)}` });
  }

  const wpl = studySnap?.weakTopicPathwayLesson;
  if (wpl?.href?.trim() && wpl.pathwayId === pid) {
    links.unshift({ label: "Review lesson", href: wpl.href.trim() });
  }

  const dedup = new Set<string>();
  const linksDeduped = links
    .map((l) => ({ ...l, href: coerceSafeLearnerNavHref(l.href) }))
    .filter((l) => {
      const h = l.href.trim();
      if (!h || dedup.has(h)) return false;
      dedup.add(h);
      return true;
    });

  const continueCta =
    continueCheckpoint &&
    continueCheckpoint.pathwayId === pid &&
    continueCheckpoint.href.trim().startsWith("/app/")
      ? {
          label: "Continue where you left off",
          href: coerceSafeLearnerNavHref(continueCheckpoint.href.trim()),
        }
      : null;

  return {
    pathwayId: pid,
    readinessLabel,
    readinessPct: pct,
    lessonsCompleted: snapshot.overallLessons.completed,
    lessonsTotal: snapshot.overallLessons.total,
    labsLessonsCompleted,
    labsLessonsTotal,
    weakTopics,
    strongTopics,
    recentSummary,
    recommendedActions: recommendedActions.slice(0, 4),
    links: linksDeduped.slice(0, 6),
    continueCta,
    simulationSummary,
  };
}
