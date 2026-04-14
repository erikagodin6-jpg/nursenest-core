import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { examTakeawaysHeadingForPathway } from "@/lib/lessons/exam-takeaways-heading";

/**
 * High-yield takeaways — rendered twice (top + bottom) when items exist.
 */
export function PathwayLessonStudyTakeawaysStrip({
  pathway,
  items,
  position,
}: {
  pathway: ExamPathwayDefinition;
  items: string[];
  position: "top" | "bottom";
}) {
  if (items.length < 2) return null;
  const label = examTakeawaysHeadingForPathway(pathway);
  const headingId = `lesson-takeaways-${position}`;
  return (
    <section
      className={`nn-lesson-hy-takeaways nn-lesson-hy-takeaways--${position}`}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="nn-lesson-hy-takeaways__title">
        {position === "top" ? label : `${label} · review`}
      </h2>
      <ul className="nn-lesson-hy-takeaways__list">
        {items.map((line, i) => (
          <li key={`tw-${position}-${i}`} className="nn-lesson-hy-takeaways__item">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Soft-warning panel for traps / distractors (no alarm styling). */
export function PathwayLessonCommonTrapsStrip({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="nn-lesson-hy-traps" aria-labelledby="lesson-common-traps-heading">
      <h2 id="lesson-common-traps-heading" className="nn-lesson-hy-traps__title">
        Common traps on the exam
      </h2>
      <p className="nn-lesson-hy-traps__lede text-sm text-[var(--theme-muted-text)]">
        How items try to steer you toward unsafe or “almost right” choices.
      </p>
      <ul className="nn-lesson-hy-traps__list">
        {items.map((line, i) => (
          <li key={`trap-${i}`} className="nn-lesson-hy-traps__item">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PathwayLessonMemoryAnchorStrip({ text }: { text: string }) {
  const t = text.trim();
  if (!t) return null;
  return (
    <aside className="nn-lesson-hy-memory" aria-label="Memory anchor">
      <p className="nn-lesson-hy-memory__label">If you only remember one thing</p>
      <p className="nn-lesson-hy-memory__text">{t}</p>
    </aside>
  );
}
