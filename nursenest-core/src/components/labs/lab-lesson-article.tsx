"use client";

import {
  Activity,
  AlertTriangle,
  Beaker,
  Brain,
  LineChart,
  ListOrdered,
  Stethoscope,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import type { LabFlashcard, LabLessonDefinition, LabTrack } from "@/lib/labs/labs-engine";
import { labTrackFocusLabel } from "@/lib/labs/labs-display";
import { LabChipList, LabLearningBlock } from "@/components/labs/lab-learning-block";
import type { LabsStudyLinks } from "@/lib/labs/labs-engine";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
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

function tierDepthLabel(track: LabTrack): string {
  switch (track) {
    case "allied":
      return "Allied health lens";
    case "np":
      return "NP diagnostic depth";
    case "pn":
      return "PN / LVN clinical emphasis";
    default:
      return "RN readiness depth";
  }
}

export function LabLessonArticle({
  lesson,
  labTrack,
  measurementSystem = "SI",
  studyLinks,
}: {
  lesson: LabLessonDefinition;
  labTrack: LabTrack;
  measurementSystem?: "US" | "SI";
  studyLinks: LabsStudyLinks;
}) {
  const primaryTierLines = lesson.tierFocus[labTrack] ?? [];

  return (
    <div className="nn-lab-lesson-article space-y-4">
      <LabLearningBlock title="Normal range and physiology" eyebrow="Foundation" tone="info" icon={Beaker}>
        <p className="text-sm font-medium text-[var(--semantic-text-primary)]">
          Normal range: {labNormalRangeForSystem(lesson, measurementSystem)}
        </p>
        <BulletList items={lesson.physiology} />
      </LabLearningBlock>

      <LabLearningBlock title="Pattern recognition" eyebrow="Clinical patterns" tone="brand" icon={Brain} id="lab-patterns">
        <div className="grid gap-4 lg:grid-cols-2">
          {lesson.patternRecognition.map((pattern) => (
            <article key={pattern.title} className="nn-lab-pattern-card">
              <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{pattern.title}</h3>
              <BulletList items={pattern.pattern} />
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{pattern.interpretation}</p>
              <p className="nn-lab-pattern-card__action">First action: {pattern.firstAction}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Causes of high</h3>
            <BulletList items={lesson.causesHigh} />
          </div>
          {lesson.causesLow.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Causes of low</h3>
              <BulletList items={lesson.causesLow} />
            </div>
          ) : null}
          <div>
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Signs and symptoms</h3>
            <BulletList items={lesson.signsSymptoms} />
          </div>
        </div>
      </LabLearningBlock>

      <LabLearningBlock title="Escalation logic" eyebrow="Critical values" tone="danger" icon={AlertTriangle} id="lab-escalation">
        <div className="space-y-3">
          {lesson.priorityThresholds.map((threshold) => (
            <div key={threshold.label} className="nn-lab-escalation-row">
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                {threshold.label}: {threshold.threshold}
              </p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{threshold.whyItMatters}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Priority decision-making</h3>
          <BulletList items={lesson.priorityDecisionMaking} />
        </div>
      </LabLearningBlock>

      <LabLearningBlock title="Treatment algorithm" eyebrow="Step-by-step" tone="success" icon={ListOrdered}>
        <ol className="space-y-3">
          {lesson.treatmentAlgorithm.map((step) => (
            <li key={step.step} className="nn-lab-algorithm-step">
              <p className="font-semibold text-[var(--semantic-text-primary)]">
                Step {step.step}: {step.action}
              </p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{step.why}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Nursing interventions</h3>
          <BulletList items={lesson.nursingInterventions} />
        </div>
      </LabLearningBlock>

      <LabLearningBlock title="Trend interpretation" eyebrow="Trajectory" tone="info" icon={TrendingUp} id="lab-trends">
        <BulletList items={lesson.trendInterpretation} />
      </LabLearningBlock>

      <LabLearningBlock title="NCLEX traps and pearls" eyebrow="Exam judgment" tone="warning" icon={Target} id="lab-nclex">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">NCLEX traps</h3>
            <LabChipList items={lesson.nclexTraps} variant="escalation" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Clinical pearls</h3>
            <BulletList items={lesson.clinicalPearls} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Medications affecting the lab</h3>
            <LabChipList items={lesson.medicationsAffecting} variant="medication" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Lab-condition relationships</h3>
            <BulletList items={lesson.labConditionRelationships} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Client education</h3>
          <BulletList items={lesson.clientEducation} />
        </div>
      </LabLearningBlock>

      <LabLearningBlock title="Case-based scenarios" eyebrow="Bedside reasoning" tone="brand" icon={Stethoscope} id="lab-cases">
        <div className="space-y-4">
          {lesson.microScenarios.map((scenario) => (
            <article key={scenario.title} className="nn-lab-scenario-card">
              <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{scenario.title}</h3>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{scenario.stem}</p>
              <BulletList items={scenario.findings} />
              <p className="mt-3 text-sm font-medium text-[var(--semantic-text-primary)]">Question: {scenario.question}</p>
              <details className="nn-lab-scenario-reveal mt-2">
                <summary>Reveal teaching answer</summary>
                <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{scenario.answer}</p>
                <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{scenario.rationale}</p>
              </details>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--semantic-text-muted)]">
          Complete the interactive check below to lock in retention — scores sync to your report card when you pass.
        </p>
      </LabLearningBlock>

      {primaryTierLines.length > 0 ? (
        <LabLearningBlock
          title={`${labTrackFocusLabel(labTrack)} · ${tierDepthLabel(labTrack)}`}
          eyebrow="Your track"
          tone="success"
          icon={Activity}
        >
          <BulletList items={primaryTierLines} />
        </LabLearningBlock>
      ) : null}

      <LabLearningBlock title="Study loops" eyebrow="Keep momentum" tone="neutral" icon={LineChart}>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Reinforce this lab with flashcards, the question bank, and CAT-style practice on your pathway.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={studyLinks.flashcardsHref} className="nn-lab-study-loop-link">
            Flashcards
          </Link>
          <Link href={studyLinks.questionBankHref} className="nn-lab-study-loop-link">
            Question bank
          </Link>
          <Link href={studyLinks.catLaunchHref} className="nn-lab-study-loop-link">
            CAT session
          </Link>
        </div>
      </LabLearningBlock>
    </div>
  );
}
