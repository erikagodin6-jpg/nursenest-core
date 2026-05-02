import type { PathwayLessonFigure } from "@/lib/lessons/pathway-lesson-types";
import { hasRenderableLessonFigure } from "@/lib/lessons/has-renderable-lesson-image";
import { SafeLessonRemoteImage } from "@/components/lessons/safe-lesson-remote-image";

/**
 * Lazy-loaded figures for pathway lesson sections (HTTPS only; no decorative stock imagery).
 *
 * When rendered inside a `.nn-lesson-section-card`, the figure border and background
 * are tinted by the section's `--lsc-color` via CSS in globals.css (`.nn-lesson-section-card figure`).
 */
export function PathwayLessonFigures({ figures }: { figures: PathwayLessonFigure[] }) {
  const usable = figures.filter(hasRenderableLessonFigure);
  if (usable.length === 0) return null;
  return (
    <div className="mt-5 space-y-5">
      {usable.map((f) => (
        <figure key={f.id} className="overflow-hidden rounded-2xl border border-border bg-[var(--theme-muted-surface)]/40 shadow-sm">
          <SafeLessonRemoteImage
            src={f.url}
            alt={f.alt?.trim() ? f.alt : "Lesson illustration"}
            className="max-h-[min(65vh,480px)] w-full object-contain p-2"
          />
          {(f.caption || f.kind) ? (
            <figcaption className="border-t border-border px-4 py-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {f.caption ? <span>{f.caption}</span> : null}
              {f.kind ? (
                <span className={`${f.caption ? "ml-2 " : ""}rounded-md bg-muted px-1.5 py-0.5 font-semibold text-[0.6875rem] uppercase tracking-wide text-muted-foreground`}>
                  {f.kind.replace(/_/g, " ")}
                </span>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
