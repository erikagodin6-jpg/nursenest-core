"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  Gem,
  Lightbulb,
  Pill,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";

/**
 * Semantic variants for inline lesson callout blocks.
 *
 *   exam       — high-yield exam tip (brand/review accent)
 *   clinical   — clinical insight/context (teal/action accent)
 *   pearl      — practitioner pearl from clinical_pearls pool (purple/application accent)
 *   priority   — nursing priority or priority action (amber/warning accent)
 *   safety     — safety alert, infection, isolation (rose/danger accent)
 *   pharm      — pharmacology / medication note (green/success accent)
 *
 * CSS classes are defined in globals.css under `.nn-lesson-callout--<variant>`.
 */
export type LessonCalloutVariant =
  | "exam"
  | "clinical"
  | "pearl"
  | "priority"
  | "safety"
  | "pharm";

const VARIANT_META: Record<
  LessonCalloutVariant,
  { label: string; Icon: typeof Lightbulb }
> = {
  exam: { label: "Exam Tip", Icon: Lightbulb },
  clinical: { label: "Clinical Insight", Icon: Stethoscope },
  pearl: { label: "Clinical Pearl", Icon: Gem },
  priority: { label: "Nursing Priority", Icon: AlertTriangle },
  safety: { label: "Safety Alert", Icon: ShieldAlert },
  pharm: { label: "Pharmacology Note", Icon: Pill },
};

export function LessonCallout({
  variant,
  children,
}: {
  variant: LessonCalloutVariant;
  children: ReactNode;
}) {
  const { label, Icon } = VARIANT_META[variant];
  return (
    <aside
      className={`nn-lesson-callout nn-lesson-callout--${variant}`}
      aria-label={label}
    >
      <p className="nn-lesson-callout__label">
        <Icon className="nn-lesson-callout__icon" aria-hidden="true" />
        {label}
      </p>
      <div className="nn-lesson-callout__body">{children}</div>
    </aside>
  );
}

/** @deprecated Use LessonCallout instead */
export function PathwayLessonCallout({
  kind,
  children,
}: {
  kind: "exam" | "clinical";
  children: ReactNode;
}) {
  return <LessonCallout variant={kind}>{children}</LessonCallout>;
}
