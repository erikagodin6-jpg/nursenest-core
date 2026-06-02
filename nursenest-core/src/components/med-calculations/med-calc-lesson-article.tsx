"use client";

import { AlertTriangle, Calculator, Droplets, ListOrdered, Scale, ShieldAlert, Syringe } from "lucide-react";
import type { MedCalcFlashcard, MedCalcLessonDefinition } from "@/lib/med-calculations/med-calculations-engine";
import { MedCalcChipList, MedCalcLearningBlock } from "@/components/med-calculations/med-calc-learning-block";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function MedCalcLessonArticle({
  lesson,
  flashcards,
}: {
  lesson: MedCalcLessonDefinition;
  flashcards: MedCalcFlashcard[];
}) {
  return (
    <div className="nn-med-calc-lesson-article space-y-4">
      <MedCalcLearningBlock title="Concept explanation" eyebrow="Clinical frame" tone="info" icon={Calculator}>
        <BulletList items={lesson.conceptExplanation} />
      </MedCalcLearningBlock>

      <MedCalcLearningBlock title="Dimensional analysis" eyebrow="Setup pathway" tone="brand" icon={ListOrdered}>
        <BulletList items={lesson.dimensionalAnalysisMethod} />
      </MedCalcLearningBlock>

      <MedCalcLearningBlock title="Ratio-proportion method" eyebrow="Alternate setup" tone="neutral" icon={Scale}>
        <BulletList items={lesson.ratioProportionMethod} />
      </MedCalcLearningBlock>

      <MedCalcLearningBlock title="Formula method" eyebrow="Bedside equations" tone="info" icon={Syringe}>
        <BulletList items={lesson.formulaMethod} />
      </MedCalcLearningBlock>

      <MedCalcLearningBlock title="Equation manipulation" eyebrow="Isolate the dose" tone="neutral">
        <BulletList items={lesson.equationManipulation} />
      </MedCalcLearningBlock>

      <MedCalcLearningBlock title="Unit conversions" eyebrow="Safety chips" tone="warning" icon={Droplets}>
        <MedCalcChipList items={lesson.unitConversions} variant="default" />
      </MedCalcLearningBlock>

      <MedCalcLearningBlock title="Worked examples" eyebrow="Step-by-step" tone="success" icon={ListOrdered}>
        <div className="space-y-4">
          {lesson.workedExamples.map((example) => (
            <article key={example.title} className="nn-med-calc-worked-card">
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
      </MedCalcLearningBlock>

      <MedCalcLearningBlock title="Common mistakes" eyebrow="NCLEX traps" tone="warning" icon={AlertTriangle}>
        <BulletList items={lesson.commonMistakes} />
      </MedCalcLearningBlock>

      <MedCalcLearningBlock title="Safety considerations" eyebrow="High-alert focus" tone="danger" icon={ShieldAlert}>
        <BulletList items={lesson.safetyConsiderations} />
      </MedCalcLearningBlock>

      {flashcards.length > 0 ? (
        <MedCalcLearningBlock title="Flashcard reinforcement" eyebrow="Recall" tone="brand">
          <div className="grid gap-3 sm:grid-cols-2">
            {flashcards.map((card) => (
              <article key={card.id} className="nn-med-calc-worked-card">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{card.prompt}</p>
                <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{card.answer}</p>
              </article>
            ))}
          </div>
        </MedCalcLearningBlock>
      ) : null}
    </div>
  );
}
