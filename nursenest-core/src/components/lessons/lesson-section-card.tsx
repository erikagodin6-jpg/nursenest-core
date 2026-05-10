import type { CSSProperties, ReactNode } from "react";
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
  Pill,
  ShieldAlert,
  Stethoscope,
  Target,
  Thermometer,
} from "lucide-react";
import type { PathwayLessonFigure, PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";
import { LessonSectionOptionalImage } from "@/components/lessons/lesson-section-optional-image";
import { getLessonSectionTheme } from "@/lib/ui/lesson-section-theme";
import { LearnerSectionContainer } from "@/components/learner-ui/learner-section-container";

const SPINE_ACCENT_CLASS: Partial<Record<PathwayLessonSectionKind, string>> = {
  /** Overview / framing — Phase 6 “why it matters” lane */
  introduction: "nn-lesson-section-card--spine-overview",
  intro: "nn-lesson-section-card--spine-overview",
  clinical_meaning: "nn-lesson-section-card--spine-clinical-meaning",
  pathophysiology_overview: "nn-lesson-section-card--spine-pathophysiology",
  core_concept: "nn-lesson-section-card--spine-core-concept",
  core: "nn-lesson-section-card--spine-core-concept",
  signs_symptoms: "nn-lesson-section-card--spine-signs-symptoms",
  clinical_manifestations: "nn-lesson-section-card--spine-signs-symptoms",
  labs_diagnostics: "nn-lesson-section-card--spine-labs-diagnostics",
  treatment_management: "nn-lesson-section-card--spine-treatment-meds",
  nursing_assessment_interventions: "nn-lesson-section-card--spine-nursing-care",
  nursing_priorities: "nn-lesson-section-card--spine-nursing-care",
  clinical_application: "nn-lesson-section-card--spine-nursing-care",
  complications: "nn-lesson-section-card--spine-complications",
  red_flags: "nn-lesson-section-card--spine-complications",
  client_education: "nn-lesson-section-card--spine-client-education",
  clinical_pearls: "nn-lesson-section-card--spine-clinical-pearls",
  exam_relevance: "nn-lesson-section-card--spine-exam-relevance",
  exam_tips: "nn-lesson-section-card--spine-exam-focus",
  exam_focus: "nn-lesson-section-card--spine-exam-focus",
  tier_specific_relevance: "nn-lesson-section-card--spine-exam-focus",
  clinical_scenario: "nn-lesson-section-card--spine-clinical-scenario",
  takeaways: "nn-lesson-section-card--spine-takeaways",
  related_next_steps: "nn-lesson-section-card--spine-related-next",
  country_specific_notes: "nn-lesson-section-card--spine-regional",
};

function spineAccentClass(kind: PathwayLessonSectionKind | undefined | null): string {
  if (!kind) return "";
  return SPINE_ACCENT_CLASS[kind] ?? "";
}

export function lessonSectionSurface(kind: PathwayLessonSectionKind | undefined | null): "editorial" | "callout" {
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
    /** Linked learning / continuation — framed like a study CTA without inventing content */
    "related_next_steps",
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
  /** Zero-based count among editorial-only sections for alternating soft bands. */
  editorialRhythmIndex,
  tierRelevanceLearnerSection = false,
  /** First section figure rendered as a lead visual under the heading (remaining figures stay in body). */
  sectionLeadFigure = null,
  children,
}: {
  id: string;
  heading: string;
  kind: PathwayLessonSectionKind | undefined | null;
  /** Override the auto-derived chip label from the section kind. */
  chipLabel?: string;
  /** Grid column span etc. — parent controls responsive layout. */
  className?: string;
  editorialRhythmIndex?: number;
  /**
   * Pathway marketing lesson detail only: tier-specific relevance uses `LearnerSectionContainer`
   * instead of stacked `nn-lesson-section-card--callout` framing.
   */
  tierRelevanceLearnerSection?: boolean;
  sectionLeadFigure?: PathwayLessonFigure | null;
  children: ReactNode;
}) {
  const theme = getLessonSectionTheme(kind, heading);
  const { chipLabel: derivedChipLabel, dataRole, role } = theme;
  const chipLabel = chipLabelOverride ?? derivedChipLabel;
  const surface = lessonSectionSurface(kind);
  const tierCrosswalk = kind === "tier_specific_relevance";
  const spineClass = spineAccentClass(kind);
  const rhythmClass =
    spineClass
      ? ""
      : surface === "editorial" && typeof editorialRhythmIndex === "number"
        ? editorialRhythmIndex % 2 === 0
          ? "nn-lesson-section-card--rhythm-a"
          : "nn-lesson-section-card--rhythm-b"
        : "";
  const ROLE_ICON = {
    info: Lightbulb,
    warning: Thermometer,
    concept: BookOpen,
    action: Stethoscope,
    diagnostic: FlaskConical,
    danger: ShieldAlert,
    success: Pill,
    education: GraduationCap,
    application: BriefcaseMedical,
    review: Target,
    cta: NotebookPen,
  } as const;
  const ChipIcon = ROLE_ICON[role];
  const style = { "--lsc-accent": theme.accent } as CSSProperties;

  const chipRow =
    surface === "callout" ? (
      <span className="nn-lesson-section-chip inline-flex items-center gap-1.5" aria-hidden="true">
        <ChipIcon className="nn-icon-sm" aria-hidden="true" />
        {chipLabel}
      </span>
    ) : (
      <p className="nn-lesson-section-eyebrow">{chipLabel}</p>
    );
  const headingId = `${id}-heading`;
  const bodyGap = surface === "callout" ? "mt-4" : "mt-3.5";

  if (tierRelevanceLearnerSection && tierCrosswalk) {
    return (
      <LearnerSectionContainer
        id={id}
        variant="tint-primary"
        aria-labelledby={headingId}
        lessonSectionDataset={{ kind: kind ?? undefined, role: dataRole }}
        className={["scroll-mt-24 mb-0", className].filter(Boolean).join(" ")}
      >
        {chipRow}
        <h2 id={headingId} className="nn-lesson-section-heading mt-2 text-[var(--theme-heading-text)]">
          {heading?.trim() || "Section"}
        </h2>
        <LessonSectionOptionalImage figure={sectionLeadFigure} />
        <div className={bodyGap}>{children}</div>
      </LearnerSectionContainer>
    );
  }

  return (
    <section
      id={id}
      className={[
        "nn-lesson-section-card scroll-mt-24",
        surface === "editorial" ? "nn-lesson-section-card--editorial" : "nn-lesson-section-card--callout",
        tierCrosswalk ? "nn-lesson-section-card--tier-callout" : "",
        spineClass,
        rhythmClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-lsc-role={dataRole}
      data-lsc-theme={theme.themeKey}
      data-lsc-kind={kind ?? undefined}
      aria-label={heading?.trim() || "Lesson section"}
      style={style}
    >
      {chipRow}
      <h2 className="nn-lesson-section-heading mt-2 text-[var(--theme-heading-text)]">
        {heading?.trim() || "Section"}
      </h2>
      <LessonSectionOptionalImage figure={sectionLeadFigure} />
      <div className={bodyGap}>{children}</div>
    </section>
  );
}
