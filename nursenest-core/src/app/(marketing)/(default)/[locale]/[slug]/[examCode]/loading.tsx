import { HubPageSkeleton } from "@/components/skeletons/hub-page-skeleton";

/**
 * Streaming fallback for the exam pathway hub page.
 * Prevents a slow DB or auth check from producing a 500; shows a content-shaped skeleton instead.
 */
export default function ExamPathwayHubLoading() {
  return <HubPageSkeleton />;
}
