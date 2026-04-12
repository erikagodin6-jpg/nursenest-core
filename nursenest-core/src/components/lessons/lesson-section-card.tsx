import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  BriefcaseMedical,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  NotebookPen,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
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
  const { chipLabel: derivedChipLabel, dataRole, role } = getLessonSectionTheme(kind);
  const chipLabel = chipLabelOverride ?? derivedChipLabel;
  const ROLE_ICON = {
    info: Lightbulb,
    warning: AlertTriangle,
    concept: BookOpen,
    action: Stethoscope,
    diagnostic: FlaskConical,
    danger: ShieldAlert,
    success: HeartPulse,
    education: GraduationCap,
    application: BriefcaseMedical,
    review: Activity,
    cta: NotebookPen,
  } as const;
  const ChipIcon = ROLE_ICON[role];

  return (
    <section
      id={id}
      className="nn-lesson-section-card scroll-mt-24"
      data-lsc-role={dataRole}
      aria-label={heading?.trim() || "Lesson section"}
    >
      <span className="nn-lesson-section-chip inline-flex items-center gap-1.5" aria-hidden="true">
        <ChipIcon className="nn-icon-sm" aria-hidden="true" />
        {chipLabel}
      </span>
      <h2
        className="nn-marketing-h3 mt-3 tracking-tight"
        style={{ color: "var(--lsc-contrast, var(--palette-heading))", fontWeight: 700 }}
      >
        {heading?.trim() || "Section"}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
