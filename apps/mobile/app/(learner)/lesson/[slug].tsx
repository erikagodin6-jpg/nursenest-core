import { useLocalSearchParams } from "expo-router";
import { PathwayLessonDetailScreen } from "@/components/PathwayLessonDetailScreen";
import { ScreenErrorBoundary } from "@/components/ScreenErrorBoundary";

/**
 * Native pathway lesson detail — `GET /api/learner/pathway-lesson` (see `buildPathwayLessonDetailPath` in mobile-shared).
 * Params: `slug` (path), optional `pathwayId`, optional `lessonId` (row id — skips pathway resolution).
 * Deep link examples: `nursenest:///(learner)/lesson/<slug>?pathwayId=<id>` or legacy id-only slugs.
 */
export default function LearnerLessonBySlugRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const screen = `lesson:${String(slug ?? "")}`;

  return (
    <ScreenErrorBoundary screen={screen}>
      <PathwayLessonDetailScreen />
    </ScreenErrorBoundary>
  );
}
