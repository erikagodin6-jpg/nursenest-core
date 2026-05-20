import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ExamTakeawaysBlock } from "@/components/lessons/exam-takeaways-block";

/** Alias for {@link ExamTakeawaysBlock} — stable import path for existing callers. */
export function PathwayLessonStudyTakeawaysStrip(props: {
  pathway: ExamPathwayDefinition;
  items: string[];
  position: "top" | "bottom";
  alliedProfessionLabel?: string | null;
}) {
  return <ExamTakeawaysBlock {...props} />;
}

export { ExamTakeawaysBlock } from "@/components/lessons/exam-takeaways-block";

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
