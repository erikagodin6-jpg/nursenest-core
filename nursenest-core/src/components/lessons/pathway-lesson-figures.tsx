import type { PathwayLessonFigure } from "@/lib/lessons/pathway-lesson-types";

/**
 * Lazy-loaded figures for pathway lesson sections (HTTPS only; no decorative stock imagery).
 */
export function PathwayLessonFigures({ figures }: { figures: PathwayLessonFigure[] }) {
  if (figures.length === 0) return null;
  return (
    <div className="mt-4 space-y-4">
      {figures.map((f) => (
        <figure key={f.id} className="overflow-hidden rounded-xl border border-border bg-[var(--theme-muted-surface)]/40">
          {/* eslint-disable-next-line @next/next/no-img-element -- bounded educational URLs; avoids remotePatterns churn */}
          <img
            src={f.url}
            alt={f.alt}
            loading="lazy"
            decoding="async"
            className="max-h-[min(70vh,520px)] w-full object-contain"
          />
          {f.caption ? (
            <figcaption className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              {f.caption}
              {f.kind ? (
                <span className="ml-2 rounded bg-muted px-1.5 py-0.5 font-medium text-[10px] uppercase tracking-wide text-muted-foreground">
                  {f.kind.replace(/_/g, " ")}
                </span>
              ) : null}
            </figcaption>
          ) : f.kind ? (
            <figcaption className="border-t border-border px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {f.kind.replace(/_/g, " ")}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
