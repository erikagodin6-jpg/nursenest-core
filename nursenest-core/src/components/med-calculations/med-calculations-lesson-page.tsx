"use client";

import Link from "next/link";
import { MeasurementSystemToggle } from "@/components/measurements/measurement-system-toggle";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import {
  type MedCalcFlashcard,
  type MedCalcLessonDefinition,
  type MedCalcQuestion,
  type MedCalcStudyLinks,
} from "@/lib/med-calculations/med-calculations-engine";
import { MedCalculationsPracticeClient } from "@/components/med-calculations/med-calculations-practice-client";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";

type Props = {
  userId: string;
  lesson: MedCalcLessonDefinition;
  questions: MedCalcQuestion[];
  flashcards: MedCalcFlashcard[];
  hasAccess: boolean;
  trackLabel: string;
  studyLinks: MedCalcStudyLinks;
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
      <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
      {children}
    </section>
  );
}

function LessonArticle({
  lesson,
  flashcards,
}: {
  lesson: MedCalcLessonDefinition;
  flashcards: MedCalcFlashcard[];
}) {
  return (
    <div className="space-y-5">
      <Section title="Concept explanation">
        <BulletList items={lesson.conceptExplanation} />
      </Section>
      <Section title="Dimensional analysis method">
        <BulletList items={lesson.dimensionalAnalysisMethod} />
      </Section>
      <Section title="Ratio-proportion method">
        <BulletList items={lesson.ratioProportionMethod} />
      </Section>
      <Section title="Formula method">
        <BulletList items={lesson.formulaMethod} />
      </Section>
      <Section title="Equation manipulation">
        <BulletList items={lesson.equationManipulation} />
      </Section>
      <Section title="Unit conversions">
        <BulletList items={lesson.unitConversions} />
      </Section>
      <Section title="Worked examples">
        <div className="space-y-4">
          {lesson.workedExamples.map((example) => (
            <article key={example.title} className="rounded-lg border border-[var(--semantic-border-soft)] p-4">
              <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{example.title}</h3>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{example.problem}</p>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
                {example.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="mt-3 text-sm font-medium text-[var(--semantic-text-primary)]">Answer: {example.answer}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Common mistakes">
        <BulletList items={lesson.commonMistakes} />
      </Section>
      <Section title="Safety considerations">
        <BulletList items={lesson.safetyConsiderations} />
      </Section>
      <Section title="Generated flashcards">
        <div className="grid gap-4 lg:grid-cols-2">
          {flashcards.map((card) => (
            <article key={card.id} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{card.prompt}</p>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{card.answer}</p>
            </article>
          ))}
        </div>
      </Section>
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
  studyLinks,
}: Props) {
  const previewQuestions = questions.slice(0, 2);
  const { measurementSystem, preference } = useMeasurementPreference("SI");

  return (
    <div className="min-w-0 space-y-6">
      <header className="nn-learner-page-hero">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--semantic-brand)]">
            Medication calculations / {lesson.shortTitle}
          </p>
          <h1 className="break-words text-3xl font-bold text-[var(--semantic-text-primary)]">{lesson.title}</h1>
          <p className="text-sm text-[var(--semantic-text-secondary)]">{lesson.description}</p>
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Built for {trackLabel}. This topic teaches the setup, the rounding rule, the worked steps, and the safety check
            that has to sit beside the arithmetic.
          </p>
          <p className="text-xs text-[var(--semantic-text-secondary)]">
            {measurementSystem === "US"
              ? "Imperial display keeps worked examples friendly to lb / °F style references."
              : "Metric display keeps worked examples anchored to kg / cm / °C and SI-first medication math."}
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
        <div className="mt-4 flex min-w-0 flex-wrap gap-3 text-sm">
          <Link
            href="/app/med-calculations"
            className="inline-flex min-h-10 touch-manipulation items-center rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]"
          >
            Back to hub
          </Link>
          <Link
            href={studyLinks.flashcardsHref}
            className="inline-flex min-h-10 touch-manipulation items-center rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]"
          >
            Flashcards
          </Link>
          <Link
            href={studyLinks.questionsHref}
            className="inline-flex min-h-10 touch-manipulation items-center rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]"
          >
            Practice questions
          </Link>
          <Link
            href={studyLinks.catHref}
            className="inline-flex min-h-10 touch-manipulation items-center rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]"
          >
            Practice tests
          </Link>
        </div>
      </header>

      {hasAccess ? (
        <>
          <LessonArticle lesson={lesson} flashcards={flashcards} />
          <MedCalculationsPracticeClient userId={userId} lesson={lesson} questions={questions} hasAccess={hasAccess} />
        </>
      ) : (
        <div className="space-y-5">
          <Section title="Preview">
            <BulletList items={lesson.conceptExplanation.slice(0, 1)} />
            <BulletList items={lesson.formulaMethod.slice(0, 1)} />
            <BulletList items={lesson.safetyConsiderations.slice(0, 1)} />
          </Section>
          <Section title="Preview questions">
            <div className="space-y-3">
              {previewQuestions.map((question) => (
                <article key={question.id} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
                  <p className="text-sm font-medium text-[var(--semantic-text-primary)]">{question.stem}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]">
                    {question.type.replaceAll("_", " ")} · {question.difficulty}
                  </p>
                </article>
              ))}
            </div>
          </Section>
          <SubscriptionPaywall context="lessons" />
        </div>
      )}
    </div>
  );
}
