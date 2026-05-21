/**
 * Learner-state-aware navigation — visible trails only (no BreadcrumbList).
 */

import type { BreadcrumbCrumb } from "@/lib/breadcrumbs/breadcrumb-types";
import type { EducationalHierarchyNode } from "@/lib/breadcrumbs/navigation-ontology";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { RECOMMENDED_MAX_VISIBLE_CRUMBS } from "@/lib/breadcrumbs/navigation-ontology";

export const LEARNER_HOME: BreadcrumbCrumb = { name: "Home", href: "/app" };

export type LearnerNavContext = {
  sectionLabel: string;
  sectionHref?: string;
  topicLabel?: string;
  topicHref?: string;
  currentLabel: string;
};

/** Cap visible learner crumbs for mobile-safe UX. */
export function truncateLearnerCrumbs(crumbs: BreadcrumbCrumb[], max = RECOMMENDED_MAX_VISIBLE_CRUMBS): BreadcrumbCrumb[] {
  if (crumbs.length <= max) return crumbs;
  const home = crumbs[0];
  const current = crumbs[crumbs.length - 1]!;
  const middle = crumbs.slice(1, -1);
  const slots = max - 2;
  if (slots <= 0) return [home, current];
  const collapsed =
    middle.length > slots
      ? [{ name: "…", href: undefined }, ...middle.slice(-(slots - 1))]
      : middle;
  return [home, ...collapsed, current];
}

export function learnerStudyTrailCrumbs(ctx: LearnerNavContext): BreadcrumbCrumb[] {
  const crumbs: BreadcrumbCrumb[] = [LEARNER_HOME, { name: ctx.sectionLabel, href: ctx.sectionHref }];
  if (ctx.topicLabel) crumbs.push({ name: ctx.topicLabel, href: ctx.topicHref });
  crumbs.push({ name: ctx.currentLabel, href: undefined });
  return truncateLearnerCrumbs(crumbs);
}

export function learnerNodesFromContext(ctx: LearnerNavContext): EducationalHierarchyNode[] {
  const nodes: EducationalHierarchyNode[] = [
    { layer: "site", label: "Home", href: "/app" },
    { layer: "learner_session", label: ctx.sectionLabel, href: ctx.sectionHref },
  ];
  if (ctx.topicLabel) {
    nodes.push({ layer: "remediation", label: ctx.topicLabel, href: ctx.topicHref, slug: ctx.topicLabel });
  }
  nodes.push({ layer: "lesson", label: ctx.currentLabel });
  return nodes;
}

export function learnerDashboardCrumbs(): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([LEARNER_HOME, { name: "Dashboard", href: undefined }]);
}

export function learnerLabsHubCrumbs(): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Labs", href: undefined },
  ]);
}

export function learnerLabsCategoryCrumbs(categoryLabel: string): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Labs", href: "/app/labs" },
    { name: categoryLabel, href: undefined },
  ]);
}

export function learnerLabsLessonCrumbs(categoryLabel: string, lessonTitle: string): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Labs", href: "/app/labs" },
    { name: categoryLabel, href: undefined },
    { name: lessonTitle, href: undefined },
  ]);
}

export function learnerPracticeTestsCrumbs(leafLabel?: string): BreadcrumbCrumb[] {
  const base: BreadcrumbCrumb[] = [
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Practice tests", href: "/app/practice-tests" },
  ];
  if (leafLabel) base.push({ name: leafLabel, href: undefined });
  else base[base.length - 1] = { name: "Practice tests", href: undefined };
  return truncateLearnerCrumbs(base);
}

export function learnerCoachCrumbs(): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Study coach", href: undefined },
  ]);
}

export function learnerReviewCrumbs(): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Smart review", href: undefined },
  ]);
}

export function learnerExamPlanCrumbs(): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Exam plan", href: undefined },
  ]);
}

export function learnerExamAttemptCrumbs(attemptLabel: string): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Practice exams", href: "/app/exams" },
    { name: attemptLabel, href: undefined },
  ]);
}

export function learnerGuidedStudyCrumbs(): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Guided study", href: undefined },
  ]);
}

export function learnerClinicalSkillsHubCrumbs(): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Clinical skills", href: undefined },
  ]);
}

export function learnerClinicalSkillCrumbs(skillTitle: string): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Clinical skills", href: "/app/clinical-skills" },
    { name: skillTitle, href: undefined },
  ]);
}

export function learnerMedCalHubCrumbs(): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Med calculations", href: undefined },
  ]);
}

export function learnerMedCalLessonCrumbs(categoryLabel: string, lessonTitle: string): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Med calculations", href: "/app/med-calculations" },
    { name: categoryLabel, href: undefined },
    { name: lessonTitle, href: undefined },
  ]);
}

export function learnerAccountHubCrumbs(): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Account", href: undefined },
  ]);
}

export function learnerAccountLeafCrumbs(leafLabel: string): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Account", href: "/app/account" },
    { name: leafLabel, href: undefined },
  ]);
}

export function learnerRemediationTrailCrumbs(args: {
  studyPlanHref?: string;
  weakAreaLabel: string;
  weakAreaHref?: string;
  interpretationLabel?: string;
  interpretationHref?: string;
  currentLabel: string;
}): BreadcrumbCrumb[] {
  const crumbs: BreadcrumbCrumb[] = [
    LEARNER_HOME,
    { name: "Study plan", href: args.studyPlanHref ?? "/app/exam-plan" },
    { name: args.weakAreaLabel, href: args.weakAreaHref },
  ];
  if (args.interpretationLabel) {
    crumbs.push({ name: args.interpretationLabel, href: args.interpretationHref });
  }
  crumbs.push({ name: args.currentLabel, href: undefined });
  return truncateLearnerCrumbs(crumbs);
}

export type LearnerWeakAreaContext = {
  topicSlug: string;
  topicLabel: string;
  currentLabel: string;
  currentHref?: string;
  currentStepHref?: string;
  studyPlanHref?: string;
  pathwayId?: string | null;
  learnerState?: RnLearnerStateSnapshot | null;
  persistentWeakTopics?: readonly string[];
  sourceSurface?: GraphSourceSurface;
  coachingModel?: CoachingModel;
};

/** Competency-labeled weak-area trail (client-safe fallback — no graph orchestration). */
export function learnerWeakAreaCrumbs(args: LearnerWeakAreaContext): BreadcrumbCrumb[] {
  const topicName = args.topicLabel ?? (args.topicSlug ? args.topicSlug.replace(/-/g, " ") : "");
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    ...(topicName ? [{ name: topicName, href: undefined }] : []),
    { name: args.currentLabel, href: args.currentHref ?? args.currentStepHref },
  ]);
}

/** Focus-areas hub with primary weak topic from performance data. */
export function learnerFocusAreasHubCrumbs(args: {
  primaryTopicSlug: string | null;
  primaryTopicLabel: string | null;
  pathwayId?: string | null;
  persistentWeakTopics?: readonly string[];
}): BreadcrumbCrumb[] {
  if (!args.primaryTopicSlug?.trim()) {
    return learnerAccountLeafCrumbs("Focus areas");
  }
  return learnerWeakAreaCrumbs({
    topicSlug: args.primaryTopicSlug,
    topicLabel: args.primaryTopicLabel ?? args.primaryTopicSlug.replace(/-/g, " "),
    currentLabel: "Focus areas",
    pathwayId: args.pathwayId,
    persistentWeakTopics: args.persistentWeakTopics,
    sourceSurface: "dashboard_feed",
  });
}

export function learnerInterpretationStudyCrumbs(args: {
  interpretationLabel: string;
  topicLabel: string;
  currentLabel: string;
}): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Study plan", href: "/app/exam-plan" },
    { name: args.interpretationLabel, href: undefined },
    { name: args.topicLabel, href: undefined },
    { name: args.currentLabel, href: undefined },
  ]);
}

export function learnerAiTutorCrumbs(sessionLabel: string): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Study coach", href: "/app/coach" },
    { name: sessionLabel, href: undefined },
  ]);
}

export function learnerSessionRecoveryCrumbs(resumeLabel: string): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: "Continue studying", href: "/app/start-studying" },
    { name: resumeLabel, href: undefined },
  ]);
}

/** Competency progression trail from remediation (client-safe fallback). */
export function learnerRemediationLadderCrumbs(args: {
  topic: string;
  pathwayId: string | null;
  currentStepTitle: string;
  currentStepHref?: string;
  learnerState?: RnLearnerStateSnapshot | null;
  persistentWeakTopics?: readonly string[];
  sourceSurface?: GraphSourceSurface;
}): BreadcrumbCrumb[] {
  return truncateLearnerCrumbs([
    LEARNER_HOME,
    { name: args.topic.replace(/-/g, " "), href: undefined },
    { name: args.currentStepTitle, href: args.currentStepHref },
  ]);
}
