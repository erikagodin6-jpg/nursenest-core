import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  BookOpen,
  ClipboardCheck,
  Layers,
  MessageSquare,
  Pill,
  ShieldAlert,
  Stethoscope,
  TestTube2,
  Target,
} from "lucide-react";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { StudyCard } from "@/components/ui/study-card";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayHubAppFlashcardsHref, pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import type { PublicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";
import { US_NEW_GRAD_TRANSITION_PATHWAY_ID } from "@/lib/navigation/marketing-pathway-nav-destinations";
import { newGradMarketingHubBase, type NewGradMarketingShell } from "@/lib/navigation/new-grad-marketing-hub-paths";
import type { NewGradWorkAreaDefinition } from "@/lib/new-grad/new-grad-work-areas";
import type { AlliedPathwayHubOverview } from "@/lib/marketing/allied-pathway-hub-overview";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";

function SectionShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8">
      <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{children}</div>
    </section>
  );
}

export function NewGradWorkAreaHub({
  shell,
  definition,
  pathway,
  overview,
  study,
}: {
  shell: NewGradMarketingShell;
  definition: NewGradWorkAreaDefinition;
  pathway: ExamPathwayDefinition;
  overview: AlliedPathwayHubOverview | null;
  study: PublicNewGradStudyDestinations;
}) {
  const base = newGradMarketingHubBase(shell);
  const transitionPathwayId = US_NEW_GRAD_TRANSITION_PATHWAY_ID;
  const lessonsHref = study.lessons;
  const questionsHref = study.questions;
  const catHref = study.cat;
  const flashcardsHref = pathwayHubAppFlashcardsHref(transitionPathwayId);
  const practiceTestsHref = pathwayHubAppPracticeTestsHref(transitionPathwayId);
  const scenariosHref =
    shell === "us"
      ? loginWithCallback(withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, transitionPathwayId))
      : null;

  return (
    <div className="space-y-[var(--nn-rhythm-section-y)]" data-nn-new-grad-work-area-hub={definition.slug}>
      <header className="relative overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_7%,var(--semantic-surface))] px-6 py-10 shadow-[var(--semantic-shadow-soft)] sm:px-10 sm:py-12">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,transparent)] blur-3xl"
          aria-hidden
        />
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--semantic-brand)]">
          New Grad transition · {definition.title}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl sm:leading-[1.12]">
          {definition.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)] sm:text-lg">
          {definition.tagline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={base}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-panel-muted)]"
          >
            ← All work areas
          </Link>
          <Link
            href={lessonsHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-brand-contrast)] shadow-md transition hover:opacity-95"
          >
            Open transition lessons
          </Link>
        </div>
      </header>

      {overview ? (
        <section
          className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
          aria-labelledby="ng-hub-live-heading"
        >
          <h2 id="ng-hub-live-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
            New Grad library snapshot
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
            Live counts for the transition-to-practice pathway — scoped inventory, not the full NCLEX-RN marketing corpus.
          </p>
          <PathwayLiveInventoryStrip
            pathway={pathway}
            questionSnapshot={overview.questionSnapshot}
            lessonCount={overview.lessonCount}
            variant="hub"
          />
        </section>
      ) : null}

      <SectionShell title="What new grads need to know">
        <ul className="list-inside list-disc space-y-2">
          {definition.needToKnow.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell title="Common patient presentations">
        <ul className="list-inside list-disc space-y-2">
          {definition.commonPresentations.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell title="Priority assessments">
        <ul className="list-inside list-disc space-y-2">
          {definition.priorityAssessments.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell title="Safety risks">
        <ul className="list-inside list-disc space-y-2">
          {definition.safetyRisks.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SectionShell>

      <section
        className="rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-6 sm:p-8"
        aria-labelledby="ng-med-labs-heading"
      >
        <h2 id="ng-med-labs-heading" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Medications, labs, and equipment
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <article>
            <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--semantic-brand)]">
              <Pill className="h-4 w-4 shrink-0" aria-hidden />
              Medications
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
              {definition.medsLabsEquipment.medications.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--semantic-info)]">
              <TestTube2 className="h-4 w-4 shrink-0" aria-hidden />
              Labs & monitoring
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
              {definition.medsLabsEquipment.labs.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--semantic-success)]">
              <Stethoscope className="h-4 w-4 shrink-0" aria-hidden />
              Equipment & environment
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
              {definition.medsLabsEquipment.equipment.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <SectionShell title="Communication & reporting">
        <ul className="list-inside list-disc space-y-2">
          {definition.communicationReporting.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SectionShell>

      <section aria-labelledby="ng-study-modes-detail-heading">
        <h2 id="ng-study-modes-detail-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
          Study modes for this unit
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Use the transition pathway for lessons and bank questions; flashcards and longer sets open inside the app with the
          New Grad pathway id so your tier stays aligned.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={lessonsHref}
              icon={BookOpen}
              title="Lessons"
              description="Browse the New Grad transition lesson index — pick topics that match this unit’s priorities."
              cta="Open Lessons"
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              prefetch={false}
              href={flashcardsHref}
              icon={Layers}
              title="Flashcards"
              description="Spaced repetition inside the app on the New Grad pathway."
              cta="Open Flashcards"
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={questionsHref}
              icon={Target}
              title="Practice questions"
              description="NCLEX-style judgment items filtered to the New Grad transition bank."
              cta="Practice Questions"
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={catHref}
              icon={Activity}
              title="Readiness exams"
              description="CAT-style readiness hub for longer sessions when you are ready."
              cta="Explore Readiness Hub"
            />
          </li>
        </ul>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              prefetch={false}
              href={practiceTestsHref}
              icon={ClipboardCheck}
              title="Practice exams"
              description="Timed exam-style sets in the app — sign-in keeps the New Grad pathway context."
              cta="Open Practice Exams"
            />
          </li>
          <li>
            {scenariosHref ? (
              <StudyCard
                surface="hub"
                variant="featured"
                prefetch={false}
                href={scenariosHref}
                icon={MessageSquare}
                title="Clinical scenarios"
                description="Branching cases in the learner shell when your plan includes scenario access."
                cta="Open Clinical Scenarios"
              />
            ) : (
              <StudyCard
                surface="hub"
                variant="featured"
                href={questionsHref}
                icon={ShieldAlert}
                title="Scenario readiness"
                description="Scenario cases launch from the signed-in learner experience. Use practice questions here until you are in the app."
                cta="Go to Practice Questions"
              />
            )}
          </li>
        </ul>
      </section>
    </div>
  );
}
