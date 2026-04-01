import { FlashcardsHubClient } from "@/components/flashcards/flashcards-hub-client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

export default function FlashcardsPage() {
  const pathwayOptions = EXAM_PATHWAYS.map((p) => ({ id: p.id, label: p.displayName }));
  return <FlashcardsHubClient pathwayOptions={pathwayOptions} />;
}
