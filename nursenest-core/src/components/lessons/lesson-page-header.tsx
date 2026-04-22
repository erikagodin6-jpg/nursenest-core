import type { ReactNode } from "react";
import Link from "next/link";
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
    <header className="nn-lesson-page-header">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          {breadcrumbSlot ? <div className="mb-1.5 min-w-0">{breadcrumbSlot}</div> : null}
          <nav aria-label="Lesson context" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            <Link
              href="/app/lessons"
              className="text-[var(--semantic-text-secondary)] transition-colors hover:text-[var(--semantic-text-primary)] hover:underline"
            >
              Lessons
            </Link>
            {pathwayLine ? (
              <>
                <span aria-hidden className="text-[var(--semantic-border-soft)]">
                  /
                </span>
                <span className="max-w-[14rem] truncate sm:max-w-none">{pathwayLine}</span>
              </>
            ) : null}
            {topic ? (
              <>
                <span aria-hidden className="text-[var(--semantic-border-soft)]">
                  /
                </span>
                <span className="max-w-[18rem] truncate text-[var(--semantic-text-secondary)] sm:max-w-none">{topic}</span>
              </>
            ) : null}
          </nav>

          <h1
            className="mt-2.5 text-balance font-semibold tracking-tight text-[var(--semantic-text-primary)]"
            style={{
              fontSize: "clamp(1.5rem, 1.25rem + 1.1vw, 2rem)",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>

          {purposeLine ? (
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--semantic-text-secondary)]">
              {purposeLine}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8125rem] text-[var(--semantic-text-muted)]">
            {examRelevance ? (
              <span className="inline-flex items-center gap-1 font-medium text-[var(--semantic-text-secondary)]">
                <BookMarked className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                {relevancePhrase(examRelevance)}
              </span>
            ) : null}
            {bodyLabel ? <span className="capitalize">{bodyLabel}</span> : null}
            {audience ? <span>{audience}</span> : null}
            <span className="tabular-nums">
              {sectionCount} section{sectionCount !== 1 ? "s" : ""}
            </span>
            {assessmentHint ? (
              <span className="font-medium text-[var(--semantic-info)]">{assessmentHint}</span>
            ) : null}
          </div>
        </div>
        <div className="shrink-0 pt-0.5 sm:pt-1">
          <ProgressPill progress={progress} />
        </div>
      </div>
    </header>
  );
}
