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

function lessonSectionSurface(kind: PathwayLessonSectionKind | undefined | null): "editorial" | "callout" {
  if (!kind) return "editorial";
  const callout: PathwayLessonSectionKind[] = [
    "clinical_pearls",
    "red_flags",
    "takeaways",
    "exam_tips",
    "exam_focus",
    "exam_relevance",
    "clinical_scenario",
    "tier_specific_relevance",
  ];
  return callout.includes(kind) ? "callout" : "editorial";
}

/**
 * Reusable semantic study card for pathway lesson sections.
 *
 * Color is driven by `kind` → role → CSS custom properties on `.nn-lesson-section-card[data-lsc-role]`.
 * Editorial sections use a flat, continuous-reading surface; high-yield kinds use a subtle callout frame.
 */
export function LessonSectionCard({
  id,
  heading,
  kind,
  chipLabel: chipLabelOverride,
  className,
  children,
}: {
  id: string;
  heading: string;
  kind: PathwayLessonSectionKind | undefined | null;
  /** Override the auto-derived chip label from the section kind. */
  chipLabel?: string;
  /** Grid column span etc. — parent controls responsive layout. */
  className?: string;
  children: ReactNode;
}) {
  const { chipLabel: derivedChipLabel, dataRole, role } = getLessonSectionTheme(kind);
  const chipLabel = chipLabelOverride ?? derivedChipLabel;
  const surface = lessonSectionSurface(kind);
  const tierCrosswalk = kind === "tier_specific_relevance";
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
      className={[
        "nn-lesson-section-card scroll-mt-24",
        surface === "editorial" ? "nn-lesson-section-card--editorial" : "nn-lesson-section-card--callout",
        tierCrosswalk ? "nn-lesson-section-card--tier-callout" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-lsc-role={dataRole}
      data-lsc-kind={kind ?? undefined}
      aria-label={heading?.trim() || "Lesson section"}
    >
      {surface === "callout" ? (
        <span className="nn-lesson-section-chip inline-flex items-center gap-1.5" aria-hidden="true">
          <ChipIcon className="nn-icon-sm" aria-hidden="true" />
          {chipLabel}
        </span>
      ) : (
        <p className="nn-lesson-section-eyebrow">{chipLabel}</p>
      )}
      <h2 className="nn-lesson-section-heading mt-2 text-[var(--theme-heading-text)]">
        {heading?.trim() || "Section"}
      </h2>
      <div className={surface === "callout" ? "mt-4" : "mt-3.5"}>{children}</div>
    </section>
  );
}
