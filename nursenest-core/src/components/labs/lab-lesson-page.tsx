"use client";

import Link from "next/link";
import { MeasurementSystemToggle } from "@/components/measurements/measurement-system-toggle";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";
import type {
  LabFlashcard,
  LabLessonDefinition,
  LabQuestion,
  LabsStudyLinks,
} from "@/lib/labs/labs-engine";

export type LabLessonPageProps = {
  lesson: LabLessonDefinition;
  hasAccess: boolean;
  trackLabel: string;
  questions: LabQuestion[];
  flashcards: LabFlashcard[];
  studyLinks: LabsStudyLinks;
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

function labNormalRangeForSystem(lesson: LabLessonDefinition, measurementSystem: "US" | "SI"): string {
  switch (lesson.slug) {
    case "creatinine-bun-aki-patterns":
      return measurementSystem === "US"
        ? "Creatinine about 0.5-1.2 mg/dL; BUN roughly 7-20 mg/dL (institution-specific)."
        : lesson.normalRange;
    case "ast-alt-bilirubin-liver-patterns":
      return measurementSystem === "US"
        ? "AST/ALT roughly < 35-40 U/L; total bilirubin about 0.3-1.2 mg/dL; ammonia ranges vary by lab."
        : lesson.normalRange;
    case "hemoglobin-wbc-platelet-cbc-patterns":
      return measurementSystem === "US"
        ? "Ranges vary; common adult anchors are Hgb about 12-16 g/dL, WBC 4-11 x10^9/L, platelets 150-400 x10^9/L."
        : lesson.normalRange;
    default:
      return lesson.normalRange;
  }
}

export function LabLessonArticle({
  lesson,
  questions,
  flashcards,
  measurementSystem = "SI",
}: Pick<LabLessonPageProps, "lesson" | "questions" | "flashcards"> & { measurementSystem?: "US" | "SI" }) {
  return (
    <div className="space-y-5">
      <Section title="Normal range and physiology">
        <p className="text-sm font-medium text-[var(--semantic-text-primary)]">Normal range: {labNormalRangeForSystem(lesson, measurementSystem)}</p>
        <BulletList items={lesson.physiology} />
      </Section>

      <Section title="High, low, and symptom patterns">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Causes of high</h3>
            <BulletList items={lesson.causesHigh} />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Causes of low</h3>
            <BulletList items={lesson.causesLow} />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Signs and symptoms</h3>
            <BulletList items={lesson.signsSymptoms} />
          </div>
        </div>
      </Section>

      <Section title="Priority thresholds and interventions">
        <div className="space-y-3">
          {lesson.priorityThresholds.map((threshold) => (
            <div key={threshold.label} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-3">
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                {threshold.label}: {threshold.threshold}
              </p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{threshold.whyItMatters}</p>
            </div>
          ))}
          <BulletList items={lesson.nursingInterventions} />
        </div>
      </Section>

      <Section title="Step-by-step treatment algorithm">
        <ol className="space-y-3 text-sm text-[var(--semantic-text-secondary)]">
          {lesson.treatmentAlgorithm.map((step) => (
            <li key={step.step} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
              <p className="font-semibold text-[var(--semantic-text-primary)]">
                Step {step.step}: {step.action}
              </p>
              <p className="mt-1">{step.why}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Medications, condition links, and clinical pearls">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Medications affecting the lab</h3>
            <BulletList items={lesson.medicationsAffecting} />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Lab-condition relationships</h3>
            <BulletList items={lesson.labConditionRelationships} />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Clinical pearls</h3>
            <BulletList items={lesson.clinicalPearls} />
          </div>
        </div>
      </Section>

      <Section title="Client education and NCLEX traps">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Client education</h3>
            <BulletList items={lesson.clientEducation} />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">NCLEX traps</h3>
            <BulletList items={lesson.nclexTraps} />
          </div>
        </div>
      </Section>

      <Section title="Trend interpretation">
        <BulletList items={lesson.trendInterpretation} />
      </Section>

      <Section title="Pattern recognition">
        <div className="grid gap-4 lg:grid-cols-2">
          {lesson.patternRecognition.map((pattern) => (
            <article key={pattern.title} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
              <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{pattern.title}</h3>
              <BulletList items={pattern.pattern} />
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{pattern.interpretation}</p>
              <p className="mt-2 text-sm font-medium text-[var(--semantic-text-primary)]">First action: {pattern.firstAction}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Priority decision-making">
        <BulletList items={lesson.priorityDecisionMaking} />
      </Section>

      <Section title="Case-based micro scenarios">
        <div className="space-y-4">
          {lesson.microScenarios.map((scenario) => (
            <article key={scenario.title} className="rounded-lg border border-[var(--semantic-border-soft)] p-4">
              <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{scenario.title}</h3>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{scenario.stem}</p>
              <BulletList items={scenario.findings} />
              <p className="mt-3 text-sm font-medium text-[var(--semantic-text-primary)]">Question: {scenario.question}</p>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">Best answer: {scenario.answer}</p>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{scenario.rationale}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Tier-specific focus">
        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(lesson.tierFocus).map(([track, items]) => (
            <article key={track} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--semantic-text-primary)]">{track}</h3>
              <BulletList items={items} />
            </article>
          ))}
        </div>
      </Section>

      <Section title="Practice and flashcard inventory">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Question set</h3>
            <div className="space-y-3">
              {questions.map((question) => (
                <article key={question.id} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
                  <p className="text-sm font-medium text-[var(--semantic-text-primary)]">{question.stem}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]">
                    {question.type.replaceAll("_", " ")} · {question.difficulty}
                  </p>
                  <ol className="mt-2 list-[upper-alpha] space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
                    {question.options.map((option) => (
                      <li key={option}>{option}</li>
                    ))}
                  </ol>
                  <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{question.rationale}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Generated flashcards</h3>
            <div className="space-y-3">
              {flashcards.map((card) => (
                <article key={card.id} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
                  <p className="text-sm font-medium text-[var(--semantic-text-primary)]">{card.prompt}</p>
                  <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{card.answer}</p>
                  <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">{card.rationale}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export function LabLessonPreview({
  lesson,
  questions,
  flashcards,
  measurementSystem = "SI",
}: Pick<LabLessonPageProps, "lesson" | "questions" | "flashcards"> & { measurementSystem?: "US" | "SI" }) {
  const previewQuestions = questions.slice(0, 2);
  const previewFlashcards = flashcards.slice(0, 2);

  return (
    <div className="space-y-5">
      <Section title="Preview">
        <p className="text-sm text-[var(--semantic-text-secondary)]">{lesson.freePreviewBlurb}</p>
        <p className="text-sm font-medium text-[var(--semantic-text-primary)]">Normal range: {labNormalRangeForSystem(lesson, measurementSystem)}</p>
        <BulletList items={lesson.physiology.slice(0, 2)} />
      </Section>
      <Section title="Clinical reasoning preview">
        <BulletList items={lesson.priorityDecisionMaking.slice(0, 2)} />
        <BulletList items={lesson.trendInterpretation.slice(0, 1)} />
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
      <Section title="Preview flashcards">
        <div className="space-y-3">
          {previewFlashcards.map((card) => (
            <article key={card.id} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
              <p className="text-sm font-medium text-[var(--semantic-text-primary)]">{card.prompt}</p>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{card.answer}</p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}

export function LabLessonPage({ lesson, hasAccess, trackLabel, questions, flashcards, studyLinks }: LabLessonPageProps) {
  const { measurementSystem, preference } = useMeasurementPreference("SI");
  return (
    <div className="space-y-6">
      <header className="nn-learner-page-hero">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--semantic-brand)]">
            Labs / {lesson.category}
          </p>
          <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">{lesson.title}</h1>
          <p className="text-sm text-[var(--semantic-text-secondary)]">{lesson.description}</p>
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Built for {trackLabel}. Free preview includes the clinical frame; paid access unlocks algorithms,
            full scenarios, flashcards, and question inventory.
          </p>
          <p className="text-xs text-[var(--semantic-text-secondary)]">
            Displaying {measurementSystem === "US" ? "imperial / US customary" : "metric / SI"} lab anchors where conversions are useful.
          </p>
        </div>
        <div className="mt-4 max-w-sm">
          <MeasurementSystemToggle
            fallbackSystem="SI"
            initialPreference={preference}
            title="Lab unit display"
            description="Switch between metric and imperial anchors without duplicating the lesson set."
            compact
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/app/labs" className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            Back to labs hub
          </Link>
          <Link href={studyLinks.flashcardsHref} className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            Flashcards
          </Link>
          <Link href={studyLinks.questionBankHref} className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            Practice
          </Link>
          <Link href={studyLinks.catHref} className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            CAT focus
          </Link>
        </div>
      </header>

      {hasAccess ? (
        <LabLessonArticle lesson={lesson} questions={questions} flashcards={flashcards} measurementSystem={measurementSystem} />
      ) : (
        <div className="space-y-5">
          <LabLessonPreview lesson={lesson} questions={questions} flashcards={flashcards} measurementSystem={measurementSystem} />
          <SubscriptionPaywall context="lessons" />
        </div>
      )}
    </div>
  );
}
