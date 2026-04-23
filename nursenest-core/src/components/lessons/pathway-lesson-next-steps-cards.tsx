"use client";

import { BookOpen, ClipboardList, Layers } from "lucide-react";
import { ActionCardLink } from "@/components/ui/action-card";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";

/**
 * In-article “Next steps” — three action targets only (no long prose).
 * Parents supply localized labels and final hrefs.
 */
export function PathwayLessonNextStepsCards({
  practiceHref,
  lessonsHref,
  flashcardsHref,
  practiceLabel,
  lessonsLabel,
  flashcardsLabel,
  pathwayId,
  analyticsSurface = "marketing_lesson",
}: {
  practiceHref: string;
  lessonsHref: string;
  flashcardsHref: string;
  practiceLabel: string;
  lessonsLabel: string;
  flashcardsLabel: string;
  /** When set, conversion analytics include pathway scope (PostHog; skipped during admin QA simulation). */
  pathwayId?: string;
  analyticsSurface?: "marketing_lesson" | "app_lesson";
}) {
  const base = pathwayId ? { pathway_id: pathwayId, surface: analyticsSurface } : { surface: analyticsSurface };

  return (
    <div className="lv-action-grid" data-nn-qa-lesson-next-steps="true" role="list">
      <ActionCardLink
        href={practiceHref}
        role="listitem"
        variant="primary"
        icon={ClipboardList}
        title={practiceLabel}
        onClick={() =>
          trackProductEvent(PH.conversionCtaClick, {
            ...base,
            contextual_variant: "post_lesson_practice_topic",
            destination_kind: "practice",
          })
        }
      />
      <ActionCardLink
        href={lessonsHref}
        role="listitem"
        variant="secondary"
        warmth="cool"
        icon={BookOpen}
        title={lessonsLabel}
        onClick={() =>
          trackProductEvent(PH.conversionCtaClick, {
            ...base,
            contextual_variant: "post_lesson_related_lessons",
            destination_kind: "lessons",
          })
        }
      />
      <ActionCardLink
        href={flashcardsHref}
        role="listitem"
        variant="secondary"
        warmth="warm"
        icon={Layers}
        title={flashcardsLabel}
        onClick={() =>
          trackProductEvent(PH.conversionCtaClick, {
            ...base,
            contextual_variant: "post_lesson_flashcards",
            destination_kind: "flashcards",
          })
        }
      />
    </div>
  );
}
