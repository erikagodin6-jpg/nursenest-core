"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MeasurementSystemToggle } from "@/components/measurements/measurement-system-toggle";
import { PathwayLessonQuizSet } from "@/components/lessons/pathway-lesson-quiz-set";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";
import { LabLessonContextRail } from "@/components/labs/lab-lesson-context-rail";
import { LabLessonArticle } from "@/components/labs/lab-lesson-article";
import { useLabLessonProgressActions } from "@/components/labs/lab-lesson-progress-client";
import { labLessonStatusLabel, labProgressStatusLabel } from "@/lib/labs/labs-display";
import { labQuestionsToPathwayQuizItems } from "@/lib/labs/lab-quiz-pathway-bridge";
import { formatDisplayTitle } from "@/lib/format/text-case";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import type {
  LabFlashcard,
  LabLessonDefinition,
  LabQuestion,
  LabTrack,
  LabsStudyLinks,
} from "@/lib/labs/labs-engine";

export type LabLessonPageProps = {
  lesson: LabLessonDefinition;
  hasAccess: boolean;
  trackLabel: string;
  labTrack: LabTrack;
  questions: LabQuestion[];
  flashcards: LabFlashcard[];
  studyLinks: LabsStudyLinks;
  initialProgress?: PathwayLessonProgressStatus;
};

export function LabLessonPreview({
  lesson,
  measurementSystem = "SI",
}: Pick<LabLessonPageProps, "lesson"> & { measurementSystem?: "US" | "SI" }) {
  return (
    <div className="space-y-4">
      <section className="nn-lab-block">
        <header className="nn-lab-block__head">
          <div>
            <p className="nn-lab-block__eyebrow">Preview</p>
            <h2 className="nn-lab-block__title">Clinical frame</h2>
          </div>
        </header>
        <div className="nn-lab-block__body space-y-3">
          <p className="text-sm text-[var(--semantic-text-secondary)]">{lesson.freePreviewBlurb}</p>
          <p className="text-sm font-medium text-[var(--semantic-text-primary)]">Normal range: {lesson.normalRange}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
            {lesson.physiology.slice(0, 1).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="nn-lab-block">
        <header className="nn-lab-block__head">
          <div>
            <p className="nn-lab-block__eyebrow">Locked activity</p>
            <h2 className="nn-lab-block__title">Included in RN Premium</h2>
          </div>
        </header>
        <div className="nn-lab-block__body space-y-3">
          <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Upgrade to access the full lab interpretation lesson, clinical cases, practice questions, rationales,
            flashcards, and report-card progress.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-[var(--semantic-text-secondary)]">
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-2.5 py-1">
              Difficulty: clinical reasoning
            </span>
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-2.5 py-1">
              Estimated time: 10-15 min
            </span>
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-2.5 py-1">
              Includes trends, escalation, and safety checks
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export function LabLessonPage({
  lesson,
  hasAccess,
  trackLabel,
  labTrack,
  questions,
  flashcards,
  studyLinks,
  initialProgress = "not_started",
}: LabLessonPageProps) {
  const { measurementSystem, preference } = useMeasurementPreference("SI");
  const [postMode, setPostMode] = useState<"practice" | "exam">("practice");
  const { progressStatus, onQuizFinished } = useLabLessonProgressActions({
    track: labTrack,
    category: lesson.category,
    lessonSlug: lesson.slug,
    hasAccess,
    initialStatus: initialProgress,
  });
  const quizItemsFull = useMemo(() => labQuestionsToPathwayQuizItems(questions), [questions]);

  return (
    <div className="nn-labs-lesson-workspace space-y-6">
      <header className="nn-labs-lesson-hero nn-learner-page-hero">
        <div className="space-y-2">
          <p className="nn-labs-lesson-hero__eyebrow">
            Labs · {lesson.category} · {labProgressStatusLabel(progressStatus)}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">{lesson.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.description}</p>
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Built for {trackLabel}. {hasAccess ? labLessonStatusLabel(true) : labLessonStatusLabel(false)} — interactive
            clinical reasoning with pathway-linked study loops.
          </p>
        </div>
        <div className="mt-4 max-w-sm">
          <MeasurementSystemToggle
            fallbackSystem="SI"
            initialPreference={preference}
            title="Lab unit display"
            description="Switch between metric and imperial anchors where conversions apply."
            compact
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href={`/app/labs/${lesson.category}`} className="nn-lab-study-loop-link">
            {lesson.category}
          </Link>
          <Link href="/app/labs" className="nn-lab-study-loop-link">
            {formatDisplayTitle("Labs overview")}
          </Link>
        </div>
      </header>

      <div className="nn-labs-lesson-workspace__grid">
        <div className="nn-labs-lesson-workspace__primary min-w-0 space-y-5">
          {hasAccess ? (
            <>
              <LabLessonArticle
                lesson={lesson}
                labTrack={labTrack}
                measurementSystem={measurementSystem}
                studyLinks={studyLinks}
              />
              <section className="nn-lab-quiz-module" id="lab-interactive-check" aria-labelledby="lab-quiz-heading">
                <header className="nn-lab-quiz-module__head">
                  <p className="nn-lab-block__eyebrow">Interactive check</p>
                  <h2 id="lab-quiz-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
                    Lesson practice questions
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
                    Six clinically focused items tied to this lab — pass at 70% or higher to mark complete and update your
                    report card.
                  </p>
                </header>
                <div className="nn-lab-quiz-module__body">
                  <PathwayLessonQuizSet
                    title="Clinical judgment check"
                    subtitle="Vignettes, prioritization, trends, and NCLEX-style traps with rationales."
                    items={quizItemsFull}
                    fullAccess
                    variant="post"
                    postMode={postMode}
                    onPostModeChange={setPostMode}
                    onAssessmentFinished={onQuizFinished}
                  />
                </div>
              </section>
            </>
          ) : (
            <div className="space-y-5">
              <LabLessonPreview lesson={lesson} measurementSystem={measurementSystem} />
              <SubscriptionPaywall context="lessons" />
            </div>
          )}
        </div>
        <LabLessonContextRail
          lesson={lesson}
          labTrack={labTrack}
          studyLinks={studyLinks}
          progressStatus={progressStatus}
          flashcardCount={flashcards.length}
        />
      </div>
    </div>
  );
}
