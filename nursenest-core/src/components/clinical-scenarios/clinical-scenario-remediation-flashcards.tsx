"use client";

import { ClinicalSkillsFlashcardReview } from "@/components/clinical-skills/clinical-skills-flashcard-review";
import type { ClinicalScenarioPerformanceReport } from "@/lib/clinical-scenarios/clinical-scenario-performance-report";
import { flashcardsFromPerformanceReport } from "@/lib/clinical-scenarios/clinical-scenario-performance-report";
import Link from "next/link";

export function ClinicalScenarioRemediationFlashcards({
  report,
  weakFlashcardsHref,
}: {
  report: ClinicalScenarioPerformanceReport;
  weakFlashcardsHref?: string | null;
}) {
  const cards = flashcardsFromPerformanceReport(report);
  if (!cards.length) return null;

  return (
    <section className="nn-clinical-scenarios-remediation">
      <p className="nn-clinical-scenarios-remediation__eyebrow">Retention reinforcement</p>
      <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">Case flashcards from your decisions</h3>
      <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
        Auto-generated from missed cues, unsafe choices, and clinical pearls — flip to lock in bedside judgment.
      </p>
      <div className="mt-4">
        <ClinicalSkillsFlashcardReview cards={cards} reviewedIds={[]} onReviewedChange={() => {}} />
      </div>
      {weakFlashcardsHref ? (
        <p className="mt-4 text-sm">
          <Link href={weakFlashcardsHref} className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
            Open full flashcard deck for this topic
          </Link>
        </p>
      ) : null}
      <ul className="mt-3 flex flex-wrap gap-2 text-xs">
        {report.remediationTopics.slice(0, 4).map((t) => (
          <li
            key={t}
            className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-1 font-medium text-[var(--semantic-text-secondary)]"
          >
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
