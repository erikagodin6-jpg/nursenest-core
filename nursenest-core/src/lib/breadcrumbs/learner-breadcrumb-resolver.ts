/**
 * Central learner breadcrumb resolver — surface-derived intent (no JSON-LD).
 */

import type { BreadcrumbCrumb, BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import {
  learnerAccountHubCrumbs,
  learnerAccountLeafCrumbs,
  learnerAiTutorCrumbs,
  learnerClinicalSkillCrumbs,
  learnerClinicalSkillsHubCrumbs,
  learnerCoachCrumbs,
  learnerDashboardCrumbs,
  learnerExamAttemptCrumbs,
  learnerExamPlanCrumbs,
  learnerGuidedStudyCrumbs,
  learnerInterpretationStudyCrumbs,
  learnerLabsCategoryCrumbs,
  learnerLabsHubCrumbs,
  learnerLabsLessonCrumbs,
  learnerMedCalHubCrumbs,
  learnerMedCalLessonCrumbs,
  learnerPracticeTestsCrumbs,
  learnerRemediationLadderCrumbs,
  learnerReviewCrumbs,
  learnerSessionRecoveryCrumbs,
  learnerStudyTrailCrumbs,
  learnerWeakAreaCrumbs,
  type LearnerNavContext,
} from "@/lib/breadcrumbs/learner-navigation";
import { applyGovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";
import { resolveSurfaceFromLearnerKind } from "@/lib/breadcrumbs/breadcrumb-surface";

export type LearnerBreadcrumbKind =
  | "dashboard"
  | "labs-hub"
  | "labs-category"
  | "labs-lesson"
  | "practice-tests"
  | "practice-test-leaf"
  | "coach"
  | "review"
  | "exam-plan"
  | "exam-attempt"
  | "guided"
  | "clinical-skills-hub"
  | "clinical-skill"
  | "med-cal-hub"
  | "med-cal-lesson"
  | "account-hub"
  | "account-leaf"
  | "study-trail"
  | "weak-area"
  | "remediation-ladder"
  | "interpretation-study"
  | "ai-tutor"
  | "session-recovery"
  | "focus-areas"
  | "focus-area-detail";

export type LearnerBreadcrumbInput =
  | { kind: "dashboard" }
  | { kind: "labs-hub" }
  | { kind: "labs-category"; categoryLabel: string }
  | { kind: "labs-lesson"; categoryLabel: string; lessonTitle: string }
  | { kind: "practice-tests" }
  | { kind: "practice-test-leaf"; leafLabel: string }
  | { kind: "coach" }
  | { kind: "review" }
  | { kind: "exam-plan" }
  | { kind: "exam-attempt"; attemptLabel: string }
  | { kind: "guided" }
  | { kind: "clinical-skills-hub" }
  | { kind: "clinical-skill"; skillTitle: string }
  | { kind: "med-cal-hub" }
  | { kind: "med-cal-lesson"; categoryLabel: string; lessonTitle: string }
  | { kind: "account-hub" }
  | { kind: "account-leaf"; leafLabel: string }
  | { kind: "study-trail"; context: LearnerNavContext }
  | {
      kind: "weak-area";
      topicSlug: string;
      topicLabel: string;
      currentLabel: string;
      currentHref?: string;
    }
  | { kind: "remediation-ladder"; topic: string; pathwayId: string | null; currentStepTitle: string }
  | {
      kind: "interpretation-study";
      interpretationLabel: string;
      topicLabel: string;
      currentLabel: string;
    }
  | { kind: "ai-tutor"; sessionLabel: string }
  | { kind: "session-recovery"; resumeLabel: string }
  | {
      kind: "focus-areas";
      primaryTopicSlug: string | null;
      primaryTopicLabel?: string | null;
      pathwayId?: string | null;
      persistentWeakTopics?: readonly string[];
    }
  | {
      kind: "focus-area-detail";
      topicSlug: string;
      topicLabel: string;
      pathwayId?: string | null;
      persistentWeakTopics?: readonly string[];
      currentStepHref?: string;
    };

function learnerPathname(kind: LearnerBreadcrumbKind): string {
  if (kind === "focus-areas") return "/app/account/focus-areas";
  if (kind === "focus-area-detail") return "/app/account/focus-areas";
  return `/app/${kind.replace(/_/g, "-")}`;
}

function learnerResolution(crumbs: BreadcrumbCrumb[], kind: LearnerBreadcrumbKind): BreadcrumbResolution {
  const surface = resolveSurfaceFromLearnerKind(kind);
  return applyGovernedBreadcrumbResolution({
    resolution: { crumbs, schemaItems: [] },
    surface,
    pathname: learnerPathname(kind),
    canonicalRootId: "lessons",
  });
}

export function resolveLearnerBreadcrumbCrumbs(input: LearnerBreadcrumbInput): BreadcrumbCrumb[] {
  return resolveLearnerBreadcrumbResolution(input).crumbs;
}

export function resolveLearnerBreadcrumbResolution(input: LearnerBreadcrumbInput): BreadcrumbResolution {
  switch (input.kind) {
    case "dashboard":
      return learnerResolution(learnerDashboardCrumbs(), input.kind);
    case "labs-hub":
      return learnerResolution(learnerLabsHubCrumbs(), input.kind);
    case "labs-category":
      return learnerResolution(learnerLabsCategoryCrumbs(input.categoryLabel), input.kind);
    case "labs-lesson":
      return learnerResolution(learnerLabsLessonCrumbs(input.categoryLabel, input.lessonTitle), input.kind);
    case "practice-tests":
      return learnerResolution(learnerPracticeTestsCrumbs(), input.kind);
    case "practice-test-leaf":
      return learnerResolution(learnerPracticeTestsCrumbs(input.leafLabel), input.kind);
    case "coach":
      return learnerResolution(learnerCoachCrumbs(), input.kind);
    case "review":
      return learnerResolution(learnerReviewCrumbs(), input.kind);
    case "exam-plan":
      return learnerResolution(learnerExamPlanCrumbs(), input.kind);
    case "exam-attempt":
      return learnerResolution(learnerExamAttemptCrumbs(input.attemptLabel), input.kind);
    case "guided":
      return learnerResolution(learnerGuidedStudyCrumbs(), input.kind);
    case "clinical-skills-hub":
      return learnerResolution(learnerClinicalSkillsHubCrumbs(), input.kind);
    case "clinical-skill":
      return learnerResolution(learnerClinicalSkillCrumbs(input.skillTitle), input.kind);
    case "med-cal-hub":
      return learnerResolution(learnerMedCalHubCrumbs(), input.kind);
    case "med-cal-lesson":
      return learnerResolution(learnerMedCalLessonCrumbs(input.categoryLabel, input.lessonTitle), input.kind);
    case "account-hub":
      return learnerResolution(learnerAccountHubCrumbs(), input.kind);
    case "account-leaf":
      return learnerResolution(learnerAccountLeafCrumbs(input.leafLabel), input.kind);
    case "study-trail":
      return learnerResolution(learnerStudyTrailCrumbs(input.context), input.kind);
    case "weak-area":
      return learnerResolution(learnerWeakAreaCrumbs(input), input.kind);
    case "remediation-ladder":
      return learnerResolution(learnerRemediationLadderCrumbs(input), input.kind);
    case "interpretation-study":
      return learnerResolution(learnerInterpretationStudyCrumbs(input), input.kind);
    case "ai-tutor":
      return learnerResolution(learnerAiTutorCrumbs(input.sessionLabel), input.kind);
    case "session-recovery":
      return learnerResolution(learnerSessionRecoveryCrumbs(input.resumeLabel), input.kind);
    case "focus-areas":
      return learnerResolution(
        learnerFocusAreasHubCrumbs({
          primaryTopicSlug: input.primaryTopicSlug,
          primaryTopicLabel: input.primaryTopicLabel ?? null,
          pathwayId: input.pathwayId,
          persistentWeakTopics: input.persistentWeakTopics,
        }),
        input.kind,
      );
    case "focus-area-detail":
      return learnerResolution(
        learnerWeakAreaCrumbs({
          topicSlug: input.topicSlug,
          topicLabel: input.topicLabel,
          pathwayId: input.pathwayId,
          persistentWeakTopics: input.persistentWeakTopics,
          currentLabel: input.topicLabel,
          currentHref: `/app/account/focus-areas/${input.topicSlug}`,
          currentStepHref: input.currentStepHref,
          sourceSurface: "dashboard_feed",
        }),
        input.kind,
      );
    default:
      return learnerResolution(learnerDashboardCrumbs(), "dashboard");
  }
}
