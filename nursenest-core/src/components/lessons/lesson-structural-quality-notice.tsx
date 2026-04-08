import type { PathwayLessonStructuralGate } from "@/lib/lessons/pathway-lesson-types";

/** Shown when a lesson fails structural / linking gates (premium spine or strict legacy). */
export function LessonStructuralQualityNotice({ gate }: { gate: PathwayLessonStructuralGate | undefined }) {
  if (!gate || gate.publicComplete) return null;
  return (
    <aside className="nn-card border-dashed border-amber-200/80 bg-amber-50/40 p-3 text-xs text-muted-foreground dark:border-amber-900/50 dark:bg-amber-950/20">
      <p className="font-medium text-foreground">Content expansion in progress</p>
      <p className="mt-1">
        This page is not yet at our full structural standard (section depth, internal study links, or related-topic
        metadata). What you see is still accurate and usable; we are strengthening outlines and cross-links.
      </p>
      {process.env.NODE_ENV !== "production" && gate.issues.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {gate.issues.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
