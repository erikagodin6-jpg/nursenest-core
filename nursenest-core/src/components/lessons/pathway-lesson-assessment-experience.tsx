"use client";

import { LessonAssessmentFlow } from "@/components/lessons/lesson-assessment-flow";
import { syntheticPathwayLessonId } from "@/lib/lessons/pathway-lesson-progress-keys";
import type { MarketingPathwayLessonAssessmentShellProps } from "@/lib/lessons/marketing-pathway-lesson-client-contract";

/**
 * Marketing pathway lesson assessments — same premium pre/post flow as the learner app:
 * toggle → pre-test (gates article) → lesson content → post-test (after completion).
 */
export function PathwayLessonAssessmentExperience({
  userId,
  pathwayId,
  lessonSlug,
  topic,
  initialProgress,
  preTest,
  postTest,
  fullAccess,
  assessmentsEnabled = true,
  children,
}: MarketingPathwayLessonAssessmentShellProps) {
  const hasPre = Boolean(preTest?.length);
  const hasPost = Boolean(postTest?.length);
  const hasAnyAssessments = hasPre || hasPost;

  if (!hasAnyAssessments) {
    return <>{children}</>;
  }

  return (
    <LessonAssessmentFlow
      userId={userId}
      lessonId={syntheticPathwayLessonId(pathwayId, lessonSlug)}
      pathwayId={pathwayId}
      lessonSlug={lessonSlug}
      topic={topic}
      initialProgress={initialProgress}
      preTest={fullAccess ? preTest : undefined}
      postTest={fullAccess ? postTest : undefined}
      assessmentsEnabled={assessmentsEnabled}
    >
      {children}
    </LessonAssessmentFlow>
  );
}
