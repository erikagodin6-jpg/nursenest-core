"use client";

import { useCallback, useState } from "react";
import type { PathwayLessonFigure } from "@/lib/lessons/pathway-lesson-types";
import { hasRenderableLessonFigure } from "@/lib/lessons/has-renderable-lesson-image";
import { SafeLessonRemoteImage } from "@/components/lessons/safe-lesson-remote-image";

/**
 * Optional lead illustration inside a lesson section card (first catalog figure only).
 * Renders nothing when `figure` is absent. Remote HTTPS URLs use `<img>` like {@link PathwayLessonFigures}.
 * Hides the entire figure when the image fails to load (no empty bordered frame).
 */
export function LessonSectionOptionalImage({ figure }: { figure: PathwayLessonFigure | null | undefined }) {
  const [hidden, setHidden] = useState(false);
  const onHidden = useCallback(() => setHidden(true), []);

  if (!figure || !hasRenderableLessonFigure(figure) || hidden) return null;

  return (
    <figure className="nn-lesson-section-lead-figure not-prose mb-3 overflow-hidden rounded-xl border">
      <SafeLessonRemoteImage
        src={figure.url}
        alt={figure.alt?.trim() ? figure.alt : "Lesson illustration"}
        className="max-h-[min(52vh,420px)] h-auto w-full max-w-full object-contain p-2"
        onHidden={onHidden}
      />
      {figure.caption?.trim() ? (
        <figcaption className="border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-brand)_8%)] px-3 py-2 text-[0.8125rem] leading-relaxed text-[var(--semantic-text-secondary)]">
          {figure.caption.trim()}
        </figcaption>
      ) : null}
    </figure>
  );
}
