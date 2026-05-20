/**
 * Legacy app-shell sections → governed learner breadcrumb resolution.
 * @deprecated Call `resolveLearnerBreadcrumbResolution` directly from pages.
 */

import type { BreadcrumbCrumb } from "@/lib/breadcrumbs/breadcrumb-types";
import {
  resolveLearnerBreadcrumbCrumbs,
  type LearnerBreadcrumbInput,
} from "@/lib/breadcrumbs/learner-breadcrumb-resolver";

export type AppShellBreadcrumbSection =
  | "dashboard"
  | "lessons"
  | "questions"
  | "exams"
  | "practice-tests";

function learnerInputForSection(section: AppShellBreadcrumbSection): LearnerBreadcrumbInput {
  switch (section) {
    case "dashboard":
      return { kind: "dashboard" };
    case "lessons":
      return {
        kind: "study-trail",
        context: {
          sectionLabel: "Lessons",
          sectionHref: "/app/lessons",
          currentLabel: "Lessons",
        },
      };
    case "questions":
      return {
        kind: "study-trail",
        context: {
          sectionLabel: "Question Bank",
          sectionHref: "/app/questions",
          currentLabel: "Question Bank",
        },
      };
    case "exams":
      return {
        kind: "study-trail",
        context: {
          sectionLabel: "Practice Exams",
          sectionHref: "/app/exams",
          currentLabel: "Practice Exams",
        },
      };
    case "practice-tests":
      return { kind: "practice-tests" };
    default:
      return { kind: "dashboard" };
  }
}

export function resolveAppShellBreadcrumbCrumbs(section: AppShellBreadcrumbSection): BreadcrumbCrumb[] {
  return resolveLearnerBreadcrumbCrumbs(learnerInputForSection(section));
}
