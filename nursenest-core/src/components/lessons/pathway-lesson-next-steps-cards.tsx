import { BookOpen, ClipboardList, Layers } from "lucide-react";
import { ActionCardLink } from "@/components/ui/action-card";

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
}: {
  practiceHref: string;
  lessonsHref: string;
  flashcardsHref: string;
  practiceLabel: string;
  lessonsLabel: string;
  flashcardsLabel: string;
}) {
  return (
    <div className="lv-action-grid" data-nn-qa-lesson-next-steps="true" role="list">
      <ActionCardLink
        href={practiceHref}
        role="listitem"
        variant="primary"
        icon={ClipboardList}
        title={practiceLabel}
      />
      <ActionCardLink href={lessonsHref} role="listitem" variant="secondary" warmth="cool" icon={BookOpen} title={lessonsLabel} />
      <ActionCardLink
        href={flashcardsHref}
        role="listitem"
        variant="secondary"
        warmth="warm"
        icon={Layers}
        title={flashcardsLabel}
      />
    </div>
  );
}
