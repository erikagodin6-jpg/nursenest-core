import { QuestionsHubSkeleton } from "@/components/skeletons/hub-page-skeleton";

/**
 * Suspense / Next.js loading fallback for the pathway questions hub.
 */
export default function ExamPathwayQuestionsLoading() {
  return <QuestionsHubSkeleton />;
}
