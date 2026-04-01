import { Suspense } from "react";
import { FlashcardsHubClient } from "@/components/flashcards/flashcards-hub-client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

export default function FlashcardsPage() {
  const pathwayOptions = EXAM_PATHWAYS.map((p) => ({ id: p.id, label: p.displayName }));
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-[var(--theme-muted-text)]">Loading flashcards…</div>
      }
    >
      <FlashcardsHubClient pathwayOptions={pathwayOptions} />
    </Suspense>
  );
}
