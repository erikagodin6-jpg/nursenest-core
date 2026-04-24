import { LessonCardChip } from "@/components/student/product/lesson-card";
import type {
  PathwayLessonAudienceTier,
  PathwayLessonCountryScope,
  PathwayLessonExamRelevance,
} from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonMarketingRecordChipsSource } from "@/lib/lessons/marketing-pathway-lesson-client-contract";

function examRelevanceLabel(r: PathwayLessonExamRelevance): string {
  switch (r) {
    case "high_yield":
      return "High yield";
    case "specialty":
      return "Specialty";
    default:
      return "Core exam focus";
  }
}

function audienceLabel(t: PathwayLessonAudienceTier): string {
  switch (t) {
    case "rn":
      return "RN";
    case "pn":
      return "PN · LPN · RPN";
    case "np":
      return "NP";
    default:
      return t;
  }
}

function countryScopeLabel(s: PathwayLessonCountryScope): string {
  switch (s) {
    case "us":
      return "US exam scope";
    case "ca":
      return "Canada exam scope";
    default:
      return "US & CA";
  }
}

/**
 * Standard metadata chips for pathway lesson cards — ties content to exam scope and category.
 * Accepts metadata fields only (no `sections` / bodies) — see `PathwayLessonMarketingRecordChipsSource`.
 */
export function PathwayLessonRecordChips({
  lesson,
  /** When true, skip topic (e.g. already shown as primary label). */
  omitTopic = false,
  className = "",
}: {
  lesson: PathwayLessonMarketingRecordChipsSource;
  omitTopic?: boolean;
  className?: string;
}) {
  const topic = lesson.topic?.trim();
  const body = lesson.bodySystem?.trim();

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {lesson.hubMarketingDegraded ? (
        <LessonCardChip variant="neutral">Preview</LessonCardChip>
      ) : null}
      {!omitTopic && topic ? <LessonCardChip variant="category">{topic}</LessonCardChip> : null}
      {body ? <LessonCardChip variant="body">{body}</LessonCardChip> : null}
      {lesson.examRelevance ? (
        <LessonCardChip variant="exam">{examRelevanceLabel(lesson.examRelevance)}</LessonCardChip>
      ) : null}
      {(lesson.audienceTiers ?? []).map((t) => (
        <LessonCardChip key={t} variant="pathway">
          {audienceLabel(t)}
        </LessonCardChip>
      ))}
      {lesson.countryScope ? (
        <LessonCardChip variant="neutral">{countryScopeLabel(lesson.countryScope)}</LessonCardChip>
      ) : null}
    </div>
  );
}
