import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { examTakeawaysHeadingForPathway } from "@/lib/lessons/exam-takeaways-heading";
import { examTakeawayLinesFromLessonInput } from "@/lib/lessons/exam-takeaways-items";

/**
 * High-yield exam summary — shared by marketing pathway, allied, and app learner lesson pages.
 * Data source: `PathwayLessonRecord.studyTakeaways` (string[]). Renders nothing when empty after trim.
 */
export function ExamTakeawaysBlock({
  pathway,
  items,
  position,
  /** Optional shorter label for allied pages, e.g. profession display name. */
  alliedProfessionLabel,
}: {
  pathway: ExamPathwayDefinition;
  items: string[] | undefined | null;
  position: "top" | "bottom";
  alliedProfessionLabel?: string | null;
}) {
  const lines = examTakeawayLinesFromLessonInput(items);
  if (lines.length === 0) return null;

  const label = examTakeawaysHeadingForPathway(pathway, {
    alliedProfessionLabel: alliedProfessionLabel?.trim() || undefined,
  });
  const headingId = `lesson-takeaways-${position}`;

  return (
    <section
      className={`nn-lesson-hy-takeaways nn-lesson-hy-takeaways--${position}`}
      aria-labelledby={headingId}
      data-nn-exam-takeaways={position}
    >
      <h2 id={headingId} className="nn-lesson-hy-takeaways__title">
        {position === "bottom" ? `${label} · review` : label}
      </h2>
      <ul className="nn-lesson-hy-takeaways__list">
        {lines.map((line, i) => (
          <li key={`et-${position}-${i}`} className="nn-lesson-hy-takeaways__item">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
