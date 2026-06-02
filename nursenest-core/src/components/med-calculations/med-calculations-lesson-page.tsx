"use client";

import Link from "next/link";
import { MeasurementSystemToggle } from "@/components/measurements/measurement-system-toggle";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { MedCalcLessonArticle } from "@/components/med-calculations/med-calc-lesson-article";
import { MedCalcLessonContextRail } from "@/components/med-calculations/med-calc-lesson-context-rail";
import { useMedCalcLessonProgressActions } from "@/components/med-calculations/med-calc-lesson-progress-client";
import { MedCalculationsPracticeClient } from "@/components/med-calculations/med-calculations-practice-client";
import { MedCalcLearningBlock } from "@/components/med-calculations/med-calc-learning-block";
import { medCalcLessonStatusLabel, medCalcProgressStatusLabel } from "@/lib/med-calculations/med-calc-display";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";
import type {
  MedCalcFlashcard,
  MedCalcLessonDefinition,
  MedCalcQuestion,
  MedCalcStudyLinks,
  MedCalcTrack,
} from "@/lib/med-calculations/med-calculations-engine";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type Props = {
  userId: string;
  lesson: MedCalcLessonDefinition;
  questions: MedCalcQuestion[];
  flashcards: MedCalcFlashcard[];
  hasAccess: boolean;
  trackLabel: string;
  medTrack: MedCalcTrack;
  studyLinks: MedCalcStudyLinks;
  initialProgress?: PathwayLessonProgressStatus;
};

export function MedCalculationsLessonPreview({
  lesson,
  questions,
}: Pick<Props, "lesson" | "questions">) {
  const previewQuestions = questions.slice(0, 2);
  return (
    <div className="space-y-4">
      <MedCalcLearningBlock title="Clinical frame" eyebrow="Preview">
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
          {lesson.conceptExplanation.slice(0, 2).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </MedCalcLearningBlock>
      <MedCalcLearningBlock title="Preview drills" eyebrow="Sample items">
        <div className="space-y-3">
          {previewQuestions.map((question) => (
            <article key={question.id} className="nn-med-calc-worked-card">
              <p className="text-sm font-medium text-[var(--semantic-text-primary)]">{question.stem}</p>
              <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
                {question.type.replaceAll("_", " ")} · {question.difficulty}
              </p>
            </article>
          ))}
        </div>
      </MedCalcLearningBlock>
    </div>
  );
}

export function MedCalculationsLessonPage({
  userId,
  lesson,
  questions,
  flashcards,
  hasAccess,
  trackLabel,
  medTrack,
  studyLinks,
  initialProgress = "not_started",
}: Props) {
  const { measurementSystem, preference } = useMeasurementPreference("SI");
  const { progressStatus, onSessionComplete, onPracticeEngage } = useMedCalcLessonProgressActions({
    track: medTrack,
    category: lesson.category,
    lessonSlug: lesson.slug,
    hasAccess,
    initialStatus: initialProgress,
  });

  return (
    <div className="nn-med-calc-lesson-workspace space-y-6" data-nn-med-calc-lesson="">
      <header className="nn-med-calc-lesson-hero nn-learner-page-hero">
        <div className="space-y-2">
          <p className="nn-med-calc-lesson-hero__eyebrow">
            Medication calculations · {lesson.shortTitle} · {medCalcProgressStatusLabel(progressStatus)}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">{lesson.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.description}</p>
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Built for {trackLabel}. {medCalcLessonStatusLabel(hasAccess)} — bedside dosing setup, safety checks, and strict
            drill readiness for NCLEX-style medication math.
          </p>
          <p className="text-xs text-[var(--semantic-text-secondary)]">
            {measurementSystem === "US"
              ? "Imperial display keeps worked examples friendly to lb-style references where relevant."
              : "Metric display keeps worked examples anchored to kg and SI-first medication math."}
          </p>
        </div>
        <div className="mt-4 max-w-sm">
          <MeasurementSystemToggle
            fallbackSystem="SI"
            initialPreference={preference}
            title="Dose-unit display"
            description="Switch between metric and imperial display preferences without changing the module."
            compact
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/app/med-calculations" className="nn-med-calc-study-loop-link">
            Overview
          </Link>
          <Link href={studyLinks.flashcardsHref} className="nn-med-calc-study-loop-link">
            Flashcards
          </Link>
          <Link href={studyLinks.questionsHref} className="nn-med-calc-study-loop-link">
            Practice questions
          </Link>
        </div>
      </header>

      <div className="nn-med-calc-lesson-workspace__grid">
        <div className="nn-med-calc-lesson-workspace__primary min-w-0 space-y-5">
          {hasAccess ? (
            <>
              <MedCalcLessonArticle lesson={lesson} flashcards={flashcards} />
              <section className="nn-med-calc-drill-module" id="med-calc-interactive-drills" aria-labelledby="med-calc-drill-heading">
                <header className="nn-med-calc-drill-module__head">
                  <p className="nn-med-calc-block__eyebrow">Interactive drills</p>
                  <h2 id="med-calc-drill-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
                    Strict practice mode
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
                    Numeric input, full solution review, timed runs, and zero-error strict completion when enabled.
                  </p>
                </header>
                <div className="nn-med-calc-drill-module__body">
                  <MedCalculationsPracticeClient
                    userId={userId}
                    lesson={lesson}
                    questions={questions}
                    hasAccess={hasAccess}
                    medTrack={medTrack}
                    onSessionComplete={onSessionComplete}
                    onPracticeEngage={onPracticeEngage}
                  />
                </div>
              </section>
            </>
          ) : (
            <div className="space-y-5">
              <MedCalculationsLessonPreview lesson={lesson} questions={questions} />
              <SubscriptionPaywall context="lessons" />
            </div>
          )}
        </div>
        <MedCalcLessonContextRail
          lesson={lesson}
          medTrack={medTrack}
          studyLinks={studyLinks}
          progressStatus={progressStatus}
          questionCount={questions.length}
        />
      </div>
    </div>
  );
}
