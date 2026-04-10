import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StatusBadge } from "@/components/ui/study-card";
import {
  buildPathwayLessonSystemSections,
  type PathwayLessonSystemSection,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type Props = {
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
  canShowProgressMap?: boolean;
  showLockedState?: boolean;
};

function examRelevanceLabel(value: PathwayLessonRecord["examRelevance"]): string | null {
  switch (value) {
    case "high_yield":
      return "High yield";
    case "core":
      return "Core";
    case "specialty":
      return "Specialty";
    default:
      return null;
  }
}

function cardActionLabel(status: PathwayLessonProgressStatus): string {
  return status === "in_progress" ? "Resume" : "Start";
}

function descriptorForLesson(lesson: PathwayLessonRecord): string {
  const text = lesson.seoDescription?.trim();
  if (text) return text;
  const fallback = [lesson.topic?.trim(), lesson.bodySystem?.trim()].filter(Boolean).join(" · ");
  return fallback || "Open this lesson to continue the pathway curriculum.";
}

function LessonSection({
  section,
  lessonsBasePath,
  progressMap,
  showProgress,
  showLockedState,
  sectionIndex,
}: {
  section: PathwayLessonSystemSection;
  lessonsBasePath: string;
  progressMap: Record<string, PathwayLessonProgressStatus>;
  showProgress: boolean;
  showLockedState: boolean;
  sectionIndex: number;
}) {
  return (
    <AccordionItem
      value={section.id}
      className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]"
    >
      <AccordionTrigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[var(--semantic-panel-muted)]">
        <div>
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)] sm:text-lg">{section.label}</h2>
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
            {section.count} lesson{section.count === 1 ? "" : "s"}
          </p>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-[var(--theme-muted-text)] transition-transform data-[state=open]:rotate-180" />
      </AccordionTrigger>
      <AccordionContent className="border-t border-[var(--semantic-border-soft)] px-5 pb-5 pt-4">
        <ul className="grid list-none gap-3 p-0">
          {section.lessons.map((lesson, lessonIndex) => {
            const href = pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
            if (!href) return null;
            const progressStatus = progressMap[lesson.slug] ?? "not_started";
            const examRelevance = examRelevanceLabel(lesson.examRelevance);

            return (
              <li
                key={lesson.slug}
                data-nn-qa-primary-lesson={sectionIndex === 0 && lessonIndex === 0 ? "true" : undefined}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={href}
                      className="text-base font-semibold text-[var(--theme-heading-text)] underline-offset-4 transition hover:text-primary hover:underline"
                    >
                      {lesson.title}
                    </Link>
                    <p className="mt-2 line-clamp-1 text-sm text-[var(--theme-muted-text)]">{descriptorForLesson(lesson)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {showProgress ? <PathwayLessonProgressBadge status={progressStatus} /> : null}
                      {showLockedState ? <StatusBadge status="locked" size="xs" /> : null}
                      {examRelevance ? (
                        <span className="inline-flex min-h-[1.5rem] items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--semantic-text-secondary)]">
                          {examRelevance}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Link
                    href={href}
                    className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
                  >
                    {cardActionLabel(progressStatus)}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

export function PathwayLessonsCurriculumHub({
  lessons,
  lessonsBasePath,
  progressMap = {},
  canShowProgressMap = false,
  showLockedState = false,
}: Props) {
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const sections = buildPathwayLessonSystemSections(safeLessons);

  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <p className="text-sm text-[var(--theme-muted-text)]">No lessons are available in this pathway yet.</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={sections.map((section) => section.id)} className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <LessonSection
          key={section.id}
          section={section}
          lessonsBasePath={lessonsBasePath}
          progressMap={progressMap}
          showProgress={canShowProgressMap}
          showLockedState={showLockedState}
          sectionIndex={sectionIndex}
        />
      ))}
    </Accordion>
  );
}
