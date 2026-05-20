"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  BookOpen,
  ClipboardCheck,
  Layers,
  MessageSquare,
  Pill,
  ShieldAlert,
  Stethoscope,
  Target,
  TestTube2,
} from "lucide-react";
import { NewGradMarketingCommandHero } from "@/components/marketing/new-grad/new-grad-marketing-command-hero";
import { MarketingHubGuidedStudyPathStrip } from "@/components/marketing/marketing-hub-guided-study-path";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import { StudyCard } from "@/components/ui/study-card";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayHubAppFlashcardsHref, pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
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
  const { t } = useMarketingI18n();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);
  const visual = getLessonHubSystemVisual(definition.lessonVisualKey);
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
    <div
      className="nn-premium-pathway-hub nn-premium-pathway-hub--new-grad space-y-[var(--nn-rhythm-section-y)]"
      data-nn-new-grad-work-area-hub={definition.slug}
      data-nn-nursing-tier-hub="surface"
    >
      <NewGradMarketingCommandHero
        accentVar={visual.accentVar}
        data-testid={`ng-hub-hero-${definition.slug}`}
        eyebrow={
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">
            {tr("newGrad.marketing.workArea.kickerTransition", "New Grad transition")}
          </p>
        }
        title={
          <h1 className="nn-marketing-h1 mt-3 max-w-3xl text-balance text-[var(--theme-heading-text)]">
            {definition.title}
          </h1>
        }
        subtitle={
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)] sm:text-lg">
            {definition.tagline}
          </p>
        }
        actions={
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={base}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-panel-muted)]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              {tr("newGrad.marketing.workArea.backAllWorkAreas", "All work areas")}
            </Link>
            <Link
              href={lessonsHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-brand-contrast)] shadow-md transition hover:opacity-95"
            >
              {tr("newGrad.marketing.workArea.openLessonsCta", "Open transition lessons")}
            </Link>
          </div>
        }
      />

      <MarketingHubGuidedStudyPathStrip
        headingId={`ng-work-area-guided-${definition.slug}`}
        title="Guided flow for this unit"
        subtitle={tr(
          "newGrad.marketing.workArea.guidedPathSubtitle",
          "Move from orientation to drills to readiness — each step stays on the New Grad transition pathway id.",
        )}
        steps={[
          {
            title: tr("newGrad.marketing.workArea.guidedLessons", "Lessons"),
            hint: tr("newGrad.marketing.workArea.guidedLessonsHint", "Topic index for transition lessons."),
            href: lessonsHref,
            tone: "success",
          },
          {
            title: tr("newGrad.marketing.workArea.guidedQuestions", "Practice questions"),
            hint: tr("newGrad.marketing.workArea.guidedQuestionsHint", "Judgment items on the same bank."),
            href: questionsHref,
            tone: "info",
          },
          {
            title: tr("newGrad.marketing.workArea.guidedFlashcards", "Flashcards"),
            hint: tr("newGrad.marketing.workArea.guidedFlashcardsHint", "App recall with pathway context."),
            href: flashcardsHref,
            tone: "chart1",
          },
          {
            title: tr("newGrad.marketing.workArea.guidedReadiness", "Readiness"),
            hint: tr("newGrad.marketing.workArea.guidedReadinessHint", "CAT-style hub when you are ready."),
            href: catHref,
            tone: "warning",
          },
          {
            title: tr("newGrad.marketing.workArea.guidedPracticeExams", "Practice exams"),
            hint: tr("newGrad.marketing.workArea.guidedPracticeExamsHint", "Timed sets in the app."),
            href: practiceTestsHref,
            tone: "chart5",
          },
        ]}
      />

      {overview ? (
        <section
          className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6"
          aria-labelledby="ng-hub-live-heading"
          data-nn-new-grad-compact-analytics="1"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="ng-hub-live-heading" className="nn-marketing-h2 text-balance">
              {tr("newGrad.marketing.workArea.snapshotTitle", "New Grad library snapshot")}
            </h2>
            {overview.lessonCount > 0 ? (
              <span className="nn-badge-semantic-success whitespace-nowrap px-2.5 py-1 text-[11px]">
                {overview.lessonCount} lessons
              </span>
            ) : null}
          </div>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-[var(--semantic-text-secondary)] sm:text-sm">
            {tr(
              "newGrad.marketing.workArea.snapshotBody",
              "Live counts for the transition-to-practice pathway — scoped inventory, not the full NCLEX-RN marketing corpus.",
            )}
          </p>
          <PathwayLiveInventoryStrip
            pathway={pathway}
            questionSnapshot={overview.questionSnapshot}
            lessonCount={overview.lessonCount}
            variant="hub"
          />
        </section>
      ) : null}

      <SectionShell title={tr("newGrad.marketing.workArea.whatToKnowTitle", "What new grads need to know")}>
        <ul className="list-inside list-disc space-y-2">
          {definition.needToKnow.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell title={tr("newGrad.marketing.workArea.presentationsTitle", "Common patient presentations")}>
        <ul className="list-inside list-disc space-y-2">
          {definition.commonPresentations.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell title={tr("newGrad.marketing.workArea.priorityAssessmentsTitle", "Priority assessments")}>
        <ul className="list-inside list-disc space-y-2">
          {definition.priorityAssessments.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell title={tr("newGrad.marketing.workArea.safetyRisksTitle", "Safety risks")}>
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
          {tr("newGrad.marketing.workArea.medsLabsTitle", "Medications, labs, and equipment")}
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <article>
            <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--semantic-brand)]">
              <Pill className="h-4 w-4 shrink-0" aria-hidden />
              {tr("newGrad.marketing.workArea.medsColumn", "Medications")}
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
              {tr("newGrad.marketing.workArea.labsColumn", "Labs & monitoring")}
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
              {tr("newGrad.marketing.workArea.equipmentColumn", "Equipment & environment")}
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
              {definition.medsLabsEquipment.equipment.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <SectionShell title={tr("newGrad.marketing.workArea.communicationTitle", "Communication & reporting")}>
        <ul className="list-inside list-disc space-y-2">
          {definition.communicationReporting.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SectionShell>

      <section aria-labelledby="ng-study-modes-detail-heading">
        <h2 id="ng-study-modes-detail-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
          {tr("newGrad.marketing.workArea.studyModesDetailHeading", "Study modes for this unit")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          {tr(
            "newGrad.marketing.workArea.studyModesDetailLead",
            "Use the transition pathway for lessons and bank questions; flashcards and longer sets open inside the app with the New Grad pathway id so your tier stays aligned.",
          )}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={lessonsHref}
              className="nn-exam-hub-study-card--lessons"
              icon={BookOpen}
              title={tr("newGrad.marketing.workArea.studyCardLessonsTitle", "Lessons")}
              description={tr(
                "newGrad.marketing.workArea.studyCardLessonsDesc",
                "Browse the New Grad transition lesson index — pick topics that match this unit’s priorities.",
              )}
              cta={tr("newGrad.marketing.workArea.studyCardLessonsCta", "Open Lessons")}
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              prefetch={false}
              href={flashcardsHref}
              className="nn-exam-hub-study-card--flashcards"
              icon={Layers}
              title={tr("newGrad.marketing.workArea.studyCardFlashcardsTitle", "Flashcards")}
              description={tr(
                "newGrad.marketing.workArea.studyCardFlashcardsDesc",
                "Spaced repetition inside the app on the New Grad pathway.",
              )}
              cta={tr("newGrad.marketing.workArea.studyCardFlashcardsCta", "Open Flashcards")}
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={questionsHref}
              className="nn-exam-hub-study-card--questions"
              icon={Target}
              title={tr("newGrad.marketing.workArea.studyCardQuestionsTitle", "Practice questions")}
              description={tr(
                "newGrad.marketing.workArea.studyCardQuestionsDesc",
                "NCLEX-style judgment items filtered to the New Grad transition bank.",
              )}
              cta={tr("newGrad.marketing.workArea.studyCardQuestionsCta", "Practice Questions")}
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={catHref}
              className="nn-exam-hub-study-card--cat"
              icon={Activity}
              title={tr("newGrad.marketing.workArea.studyCardReadinessTitle", "Readiness exams")}
              description={tr(
                "newGrad.marketing.workArea.studyCardReadinessDesc",
                "CAT-style readiness hub for longer sessions when you are ready.",
              )}
              cta={tr("newGrad.marketing.workArea.studyCardReadinessCta", "Explore Readiness Hub")}
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
              className="nn-exam-hub-study-card--practice"
              icon={ClipboardCheck}
              title={tr("newGrad.marketing.workArea.studyCardPracticeExamsTitle", "Practice exams")}
              description={tr(
                "newGrad.marketing.workArea.studyCardPracticeExamsDesc",
                "Timed exam-style sets in the app — sign-in keeps the New Grad pathway context.",
              )}
              cta={tr("newGrad.marketing.workArea.studyCardPracticeExamsCta", "Open Practice Exams")}
            />
          </li>
          <li>
            {scenariosHref ? (
              <StudyCard
                surface="hub"
                variant="featured"
                prefetch={false}
                href={scenariosHref}
                className="nn-exam-hub-study-card--questions"
                icon={MessageSquare}
                title={tr("newGrad.marketing.workArea.studyCardClinicalScenariosTitle", "Clinical scenarios")}
                description={tr(
                  "newGrad.marketing.workArea.studyCardClinicalScenariosDesc",
                  "Branching cases in the learner shell when your plan includes scenario access.",
                )}
                cta={tr("newGrad.marketing.workArea.studyCardClinicalScenariosCta", "Open Clinical Scenarios")}
              />
            ) : (
              <StudyCard
                surface="hub"
                variant="featured"
                href={questionsHref}
                className="nn-exam-hub-study-card--questions"
                icon={ShieldAlert}
                title={tr("newGrad.marketing.workArea.scenarioReadinessTitle", "Scenario readiness")}
                description={tr(
                  "newGrad.marketing.workArea.scenarioReadinessDesc",
                  "Scenario cases launch from the signed-in learner experience. Use practice questions here until you are in the app.",
                )}
                cta={tr("newGrad.marketing.workArea.scenarioReadinessCta", "Go to Practice Questions")}
              />
            )}
          </li>
        </ul>
      </section>
    </div>
  );
}
