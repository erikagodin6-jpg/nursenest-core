import type { ReactNode } from "react";
import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";
import { getLessonSectionTheme } from "@/lib/ui/lesson-section-theme";

/**
 * Reusable semantic study card for pathway lesson sections.
 *
 * Color is driven by `kind` → role → CSS custom properties on `.nn-lesson-section-card[data-lsc-role]`.
 * The same kind always renders the same color family across all lessons, all pages.
 *
 * Chip label ("Signs & Symptoms", "Nursing Care", etc.) is auto-derived from the kind mapping
 * in `lib/ui/lesson-section-theme.ts`. Override via `chipLabel` if needed for a specific section.
 */
export function LessonSectionCard({
  id,
  heading,
  kind,
  chipLabel: chipLabelOverride,
  children,
}: {
  id: string;
  heading: string;
  kind: PathwayLessonSectionKind | undefined | null;
  /** Override the auto-derived chip label from the section kind. */
  chipLabel?: string;
  children: ReactNode;
}) {
  const { chipLabel: derivedChipLabel, dataRole } = getLessonSectionTheme(kind);
  const chipLabel = chipLabelOverride ?? derivedChipLabel;

  return (
    <section
      id={id}
      className="nn-lesson-section-card scroll-mt-24"
      data-lsc-role={dataRole}
      aria-label={heading?.trim() || "Lesson section"}
    >
      <span className="nn-lesson-section-chip" aria-hidden="true">
        {chipLabel}
      </span>
      <h2 className="nn-marketing-h3 mt-3 text-[var(--palette-heading)]">
        {heading?.trim() || "Section"}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
