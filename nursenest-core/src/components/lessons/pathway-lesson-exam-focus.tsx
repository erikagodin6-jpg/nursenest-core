import { PathwayLessonBody } from "@/components/lessons/pathway-lesson-body";
import type { PathwayLessonExamFocus } from "@/lib/lessons/pathway-lesson-types";

export function PathwayLessonExamFocusPanel({
  heading,
  examFocus,
  fallbackBody,
}: {
  heading: string;
  examFocus?: PathwayLessonExamFocus;
  fallbackBody?: string;
}) {
  const hasStructured =
    examFocus &&
    (examFocus.howTested?.trim() ||
      examFocus.commonTraps?.trim() ||
      examFocus.prioritizationCues?.trim());

  if (!hasStructured && fallbackBody?.trim()) {
    return (
      <section className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
        <h2 className="nn-marketing-h3">{heading}</h2>
        <div className="mt-3">
          <PathwayLessonBody text={fallbackBody} />
        </div>
      </section>
    );
  }

  if (!hasStructured) return null;

  const blocks: { title: string; text: string }[] = [];
  if (examFocus!.howTested?.trim()) {
    blocks.push({ title: "How this concept is tested", text: examFocus!.howTested! });
  }
  if (examFocus!.commonTraps?.trim()) {
    blocks.push({ title: "Common traps", text: examFocus!.commonTraps! });
  }
  if (examFocus!.prioritizationCues?.trim()) {
    blocks.push({ title: "Prioritization cues", text: examFocus!.prioritizationCues! });
  }

  return (
    <section className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
      <h2 className="nn-marketing-h3">{heading}</h2>
      <div className="mt-4 space-y-5">
        {blocks.map((b) => (
          <div key={b.title}>
            <h3 className="nn-marketing-label nn-marketing-label--accent">{b.title}</h3>
            <div className="mt-2">
              <PathwayLessonBody text={b.text} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
