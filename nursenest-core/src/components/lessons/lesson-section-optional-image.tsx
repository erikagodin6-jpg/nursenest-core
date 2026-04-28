import type { PathwayLessonFigure } from "@/lib/lessons/pathway-lesson-types";

/**
 * Optional lead illustration inside a lesson section card (first catalog figure only).
 * Renders nothing when `figure` is absent. Remote HTTPS URLs use `<img>` like {@link PathwayLessonFigures}.
 */
export function LessonSectionOptionalImage({ figure }: { figure: PathwayLessonFigure | null | undefined }) {
  if (!figure?.url?.trim()) return null;
  return (
    <figure className="nn-lesson-section-lead-figure not-prose mb-3 overflow-hidden rounded-xl border">
      {/* eslint-disable-next-line @next/next/no-img-element -- educational CDN; matches PathwayLessonFigures */}
      <img
        src={figure.url}
        alt={figure.alt}
        loading="lazy"
        decoding="async"
        className="max-h-[min(52vh,420px)] w-full object-contain p-2"
      />
      {figure.caption?.trim() ? (
        <figcaption className="border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-brand)_8%)] px-3 py-2 text-[0.8125rem] leading-relaxed text-[var(--semantic-text-secondary)]">
          {figure.caption.trim()}
        </figcaption>
      ) : null}
    </figure>
  );
}
