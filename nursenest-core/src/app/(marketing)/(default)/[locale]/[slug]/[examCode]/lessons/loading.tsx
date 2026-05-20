import { LessonsHubSkeleton } from "@/components/skeletons/hub-page-skeleton";

/**
 * Suspense / Next.js loading fallback for the pathway lessons hub.
 * Shows a shimmer skeleton that matches the real page layout.
 */
export default function ExamPathwayLessonsSegmentLoading() {
  return <LessonsHubSkeleton />;
}
