import Link from "next/link";
import { CheckCircle, Clock, BookOpen, Zap, GraduationCap } from "lucide-react";
import type { PathwayLessonExamRelevance, PathwayLessonAudienceTier } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type Props = {
  title: string;
  topic: string;
  bodySystem?: string | null;
  topicSlug?: string | null;
  pathwayId?: string | null;
  examFramingLabel?: string | null;
  sectionCount: number;
  examRelevance?: PathwayLessonExamRelevance | null;
  audienceTiers?: PathwayLessonAudienceTier[] | null;
  progress: PathwayLessonProgressStatus;
};

const AUDIENCE_LABEL: Record<PathwayLessonAudienceTier, string> = {
  rn: "RN",
  pn: "PN",
  np: "NP",
};

function ProgressBadge({ progress }: { progress: PathwayLessonProgressStatus }) {
  if (progress === "completed") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
        style={{
          background: "color-mix(in srgb, var(--semantic-success) 12%, var(--bg-card))",
          color: "var(--semantic-success)",
          border: "1px solid color-mix(in srgb, var(--semantic-success) 22%, transparent)",
        }}
      >
        <CheckCircle className="h-3 w-3" aria-hidden="true" />
        Completed
      </span>
    );
  }
  if (progress === "in_progress") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
        style={{
          background: "color-mix(in srgb, var(--semantic-warning) 12%, var(--bg-card))",
          color: "color-mix(in srgb, var(--semantic-warning) 80%, var(--semantic-text-primary))",
          border: "1px solid color-mix(in srgb, var(--semantic-warning) 22%, transparent)",
        }}
      >
        <Clock className="h-3 w-3" aria-hidden="true" />
        In Progress
      </span>
    );
  }
  return null;
}

function ExamRelevanceBadge({ relevance }: { relevance: PathwayLessonExamRelevance }) {
  if (relevance === "high_yield") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
        style={{
          background: "color-mix(in srgb, var(--semantic-warning) 14%, var(--bg-card))",
          color: "color-mix(in srgb, var(--semantic-warning) 85%, var(--semantic-text-primary))",
          border: "1px solid color-mix(in srgb, var(--semantic-warning) 28%, transparent)",
        }}
      >
        <Zap className="h-3 w-3" aria-hidden="true" />
        High Yield
      </span>
    );
  }
  if (relevance === "specialty") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
        style={{
          background: "color-mix(in srgb, var(--semantic-chart-5) 12%, var(--bg-card))",
          color: "color-mix(in srgb, var(--semantic-chart-5) 80%, var(--semantic-text-primary))",
          border: "1px solid color-mix(in srgb, var(--semantic-chart-5) 22%, transparent)",
        }}
      >
        <GraduationCap className="h-3 w-3" aria-hidden="true" />
        Specialty
      </span>
    );
  }
  return null;
}

/**
 * Premium compact lesson page header.
 * Shows breadcrumb, metadata badges, title, and progress indicator.
 * Does NOT show seoDescription — that's for crawlers, not learners.
 */
export function LessonPageHeader({
  title,
  topic,
  bodySystem,
  pathwayId: _pathwayId,
  examFramingLabel,
  sectionCount,
  examRelevance,
  audienceTiers,
  progress,
}: Props) {
  return (
    <header className="nn-lesson-page-header">
      {/* Breadcrumb */}
      <nav aria-label="Lesson navigation" className="flex items-center gap-1.5 text-xs">
        <Link
          href="/app/lessons"
          className="font-medium transition-colors hover:underline"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          All Lessons
        </Link>
        {topic ? (
          <>
            <span style={{ color: "var(--semantic-border-soft)" }} aria-hidden="true">
              /
            </span>
            <span className="font-medium" style={{ color: "var(--semantic-text-secondary)" }}>
              {topic}
            </span>
          </>
        ) : null}
      </nav>

      {/* Badge row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Topic badge */}
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--bg-card))",
            color: "var(--semantic-brand)",
            border: "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
          }}
        >
          <BookOpen className="h-3 w-3" aria-hidden="true" />
          {topic}
        </span>

        {/* Body system badge */}
        {bodySystem ? (
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize"
            style={{
              background: "color-mix(in srgb, var(--semantic-info) 10%, var(--bg-card))",
              color: "var(--semantic-info)",
              border: "1px solid color-mix(in srgb, var(--semantic-info) 20%, transparent)",
            }}
          >
            {bodySystem.replace(/_/g, " ")}
          </span>
        ) : null}

        {/* Exam alignment label */}
        {examFramingLabel ? (
          <span
            className="rounded-md px-2 py-0.5 text-xs font-medium"
            style={{
              background: "var(--semantic-surface)",
              color: "var(--semantic-text-muted)",
              border: "1px solid var(--semantic-border-soft)",
            }}
          >
            {examFramingLabel}
          </span>
        ) : null}

        {/* Audience tiers */}
        {audienceTiers && audienceTiers.length > 0 ? (
          <span
            className="rounded-md px-2 py-0.5 text-xs font-medium"
            style={{
              background: "var(--semantic-surface)",
              color: "var(--semantic-text-muted)",
              border: "1px solid var(--semantic-border-soft)",
            }}
          >
            {audienceTiers.map((t) => AUDIENCE_LABEL[t] ?? t.toUpperCase()).join(" · ")}
          </span>
        ) : null}

        {/* Exam relevance */}
        {examRelevance ? <ExamRelevanceBadge relevance={examRelevance} /> : null}
      </div>

      {/* Title */}
      <h1
        className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
        style={{ color: "var(--semantic-text-primary)" }}
      >
        {title}
      </h1>

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          {sectionCount} section{sectionCount !== 1 ? "s" : ""}
        </span>
        <ProgressBadge progress={progress} />
      </div>
    </header>
  );
}
