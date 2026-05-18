import type { ReactNode } from "react";
import { CheckCircle, Clock, BookMarked } from "lucide-react";
import type { PathwayLessonExamRelevance, PathwayLessonAudienceTier } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type Props = {
  title: string;
  topic: string;
  bodySystem?: string | null;
  /** Short pathway label, e.g. "NCLEX-RN" */
  pathwayShortName?: string | null;
  examFramingLabel?: string | null;
  sectionCount: number;
  examRelevance?: PathwayLessonExamRelevance | null;
  audienceTiers?: PathwayLessonAudienceTier[] | null;
  progress: PathwayLessonProgressStatus;
  /** Optional pathway breadcrumb row (e.g. `BreadcrumbTrail`) */
  breadcrumbSlot?: ReactNode;
  /** One-line study intent under the title */
  purposeLine?: string | null;
  /** e.g. "Readiness check (4) · Retention (3)" */
  assessmentHint?: string | null;
};

const AUDIENCE_LABEL: Record<PathwayLessonAudienceTier, string> = {
  rn: "RN",
  pn: "PN",
  np: "NP",
};

function relevancePhrase(relevance: PathwayLessonExamRelevance): string {
  if (relevance === "high_yield") return "High-yield exam focus";
  if (relevance === "specialty") return "Specialty depth";
  return "Core pathway topic";
}

function ProgressPill({ progress }: { progress: PathwayLessonProgressStatus }) {
  if (progress === "completed") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide"
        style={{
          background: "color-mix(in srgb, var(--semantic-success) 10%, transparent)",
          color: "var(--semantic-success)",
          border: "1px solid color-mix(in srgb, var(--semantic-success) 22%, transparent)",
        }}
      >
        <CheckCircle className="h-3 w-3" aria-hidden="true" />
        Done
      </span>
    );
  }
  if (progress === "in_progress") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide"
        style={{
          background: "color-mix(in srgb, var(--semantic-warning) 10%, transparent)",
          color: "color-mix(in srgb, var(--semantic-warning) 82%, var(--semantic-text-primary))",
          border: "1px solid color-mix(in srgb, var(--semantic-warning) 22%, transparent)",
        }}
      >
        <Clock className="h-3 w-3" aria-hidden="true" />
        In progress
      </span>
    );
  }
  return null;
}

/**
 * Learner pathway lesson — compact hero: context, title, purpose, quiet metadata.
 */
export function LessonPageHeader({
  title,
  topic,
  bodySystem,
  pathwayShortName,
  examFramingLabel,
  sectionCount,
  examRelevance,
  audienceTiers,
  progress,
  breadcrumbSlot,
  purposeLine,
  assessmentHint,
}: Props) {
  const pathwayLine = pathwayShortName?.trim() || examFramingLabel?.trim() || null;
  const audience =
    audienceTiers && audienceTiers.length > 0
      ? audienceTiers.map((t) => AUDIENCE_LABEL[t] ?? t.toUpperCase()).join(" · ")
      : null;
  const bodyLabel = bodySystem ? bodySystem.replace(/_/g, " ") : null;

  return (
    <header className="nn-lesson-page-header nn-premium-learner-lesson-hero">
      <div className="flex flex-col gap-5">
        <div className="min-w-0 flex-1">
          <p
            className="nn-lesson-hero-eyebrow"
            data-nn-premium-individual-lesson-header-meta
          >
            {[audience, pathwayLine, bodyLabel ?? topic].filter(Boolean).join(" · ") || "Clinical lesson"}
          </p>

          <h1
            className="nn-lesson-hero-title mt-4 text-balance font-semibold tracking-tight text-[var(--semantic-text-primary)]"
          >
            {title}
          </h1>

          {purposeLine ? (
            <p className="nn-lesson-hero-deck mt-5 text-[var(--semantic-text-secondary)]">
              {purposeLine}
            </p>
          ) : null}

          <div className="nn-lesson-hero-meta mt-6 flex flex-wrap items-center gap-2 text-[var(--semantic-text-muted)]">
            {examRelevance ? (
              <span className="nn-lesson-hero-chip inline-flex items-center gap-1 font-medium text-[var(--semantic-text-secondary)]">
                <BookMarked className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                {relevancePhrase(examRelevance)}
              </span>
            ) : null}
            {bodyLabel ? <span className="nn-lesson-hero-chip capitalize">{bodyLabel}</span> : null}
            {audience ? <span className="nn-lesson-hero-chip">{audience}</span> : null}
            <span className="nn-lesson-hero-chip tabular-nums">
              {sectionCount} section{sectionCount !== 1 ? "s" : ""}
            </span>
            {assessmentHint ? (
              <span className="nn-lesson-hero-chip font-medium text-[var(--semantic-info)]">{assessmentHint}</span>
            ) : null}
            <span className="nn-lesson-hero-progress" aria-hidden="true" data-progress={progress}>
              <span />
            </span>
            <ProgressPill progress={progress} />
          </div>
        </div>
      </div>
    </header>
  );
}
