import type { EduGraphStep, EducationalGraphTraversal } from "@/lib/educational-graph/graph-step-contract";

export type DashboardGraphAction = Pick<EduGraphStep, "title" | "href" | "stepKind" | "topicSlug">;

export function dashboardGraphActionsFromTraversal(
  traversal: EducationalGraphTraversal,
  limit = 3,
): DashboardGraphAction[] {
  return traversal.steps.slice(0, Math.max(0, limit)).map((step) => ({
    title: step.title,
    href: step.href,
    stepKind: step.stepKind,
    topicSlug: step.topicSlug,
  }));
}
