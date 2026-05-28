"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Brain,
  ClipboardList,
  Layers,
  ListOrdered,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { PathwayLessonQuizSet } from "@/components/lessons/pathway-lesson-quiz-set";
import {
  ClinicalSkillsLearningBlock,
  ClinicalSkillsChipList,
} from "@/components/clinical-skills/clinical-skills-learning-block";
import { ClinicalSkillContextRail } from "@/components/clinical-skills/clinical-skill-context-rail";
import { ClinicalSkillsErrorSpotting } from "@/components/clinical-skills/clinical-skills-error-spotting";
import { ClinicalSkillsFlashcardReview } from "@/components/clinical-skills/clinical-skills-flashcard-review";
import { ClinicalSkillsLabModeOverview } from "@/components/clinical-skills/clinical-skills-lab-mode-overview";
import { ClinicalSkillsProcedureWorkspace } from "@/components/clinical-skills/clinical-skills-procedure-workspace";
import { ClinicalSkillsRetentionQuickSet } from "@/components/clinical-skills/clinical-skills-retention-quick-set";
import { ClinicalSkillsSequencingChallenge } from "@/components/clinical-skills/clinical-skills-sequencing-challenge";
import { ClinicalSkillsSimulationMode } from "@/components/clinical-skills/clinical-skills-simulation-mode";
import { useClinicalSkillProgressActions } from "@/components/clinical-skills/clinical-skills-progress-actions";
import { clinicalSkillTierLabel } from "@/lib/clinical-skills/clinical-skills-display";
import type { ClinicalSkillDefinition } from "@/lib/clinical-skills/clinical-skills-catalog";
import { clinicalSkillCheckpointsToQuizItems } from "@/lib/clinical-skills/clinical-skills-checkpoints";
import { buildClinicalSkillCompetencyLabProfile } from "@/lib/clinical-skills/clinical-skills-competency-lab";
import { getClinicalSkillEnrichment } from "@/lib/clinical-skills/clinical-skills-enrichment";
import {
  computeSimulationReadinessPct,
  readClinicalSkillCompetency,
  writeClinicalSkillCompetency,
  type ClinicalSkillLessonCompetency,
} from "@/lib/clinical-skills/clinical-skills-lesson-competency.client";
import { useClinicalSkillsProgress } from "@/lib/clinical-skills/clinical-skills-progress.client";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { cn } from "@/lib/utils";

export function ClinicalSkillDetailClient({
  skill,
  pathwayId,
  userId,
  initialProgress = "not_started",
}: {
  skill: ClinicalSkillDefinition;
  pathwayId: string | null;
  userId: string | null;
  initialProgress?: PathwayLessonProgressStatus;
}) {
  const qp = pathwayId?.trim()
    ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}`
    : "";
  const hubHref = `/app/clinical-skills${qp}`;
  const enrichment = useMemo(() => getClinicalSkillEnrichment(skill), [skill]);
  const labProfile = useMemo(
    () => buildClinicalSkillCompetencyLabProfile(skill),
    [skill],
  );
  const { state, markViewed, markCompleted } =
    useClinicalSkillsProgress(userId);
  const { progressStatus, onCheckpointFinished } =
    useClinicalSkillProgressActions({
      skillSlug: skill.slug,
      userId,
      initialStatus: initialProgress,
    });

  const [competency, setCompetency] = useState<ClinicalSkillLessonCompetency>(
    () => readClinicalSkillCompetency(skill.slug),
  );

  useEffect(() => {
    markViewed(skill.slug);
  }, [markViewed, skill.slug]);

  const persistCompetency = useCallback(
    (patch: Partial<ClinicalSkillLessonCompetency>) => {
      setCompetency((prev) => {
        const next = { ...prev, ...patch };
        writeClinicalSkillCompetency(skill.slug, next);
        return next;
      });
    },
    [skill.slug],
  );

  const quizItems = useMemo(
    () => clinicalSkillCheckpointsToQuizItems(skill.slug),
    [skill.slug],
  );
  const localDone = state.completedSlugs.includes(skill.slug);
  const serverDone = progressStatus === "completed";
  const readinessPct = computeSimulationReadinessPct(
    competency,
    skill.steps.length,
    enrichment.flashcards.length,
  );

  const handleCheckpointFinished = (score: number, total: number) => {
    persistCompetency({ checkpointScore: score, checkpointTotal: total });
    onCheckpointFinished(score, total);
  };

  return (
    <div
      className="nn-clinical-skills-lesson-workspace space-y-6"
      data-nn-clinical-skill-detail=""
    >
      <header className="nn-clinical-skills-lesson-hero nn-learner-page-hero">
        <div className="space-y-2">
          <p className="nn-clinical-skills-lesson-hero__eyebrow">
            Clinical skills · {clinicalSkillTierLabel(skill.competencyTier)} ·{" "}
            {serverDone || localDone ? "Completed" : "In training"}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
            {skill.title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {skill.summary}
          </p>
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Interactive bedside simulation — rehearse sequencing, safety
            judgment, flashcards, and competency checkpoints in one workstation.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href={hubHref} className="nn-clinical-skills-study-loop-link">
            Overview
          </Link>
          <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-primary)]">
            ~{skill.estimatedMinutes} min
          </span>
          <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-brand)_90%,var(--semantic-text-primary))]">
            Simulation readiness {readinessPct}%
          </span>
        </div>
      </header>

      <ClinicalSkillsLabModeOverview profile={labProfile} />

      <div className="nn-clinical-skills-lesson-workspace__grid">
        <div className="nn-clinical-skills-lesson-workspace__primary min-w-0 space-y-5">
          <ClinicalSkillsLearningBlock
            title="Competency blueprint"
            eyebrow="Minimum skill requirements"
            tone="brand"
            icon={ClipboardList}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {labProfile.requiredSections.map((section) => (
                <article
                  key={section.key}
                  className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">
                    {section.label}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-[var(--semantic-text-secondary)]">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          </ClinicalSkillsLearningBlock>

          <ClinicalSkillsLearningBlock
            title="Simulation overview"
            eyebrow="Learn mode"
            tone="brand"
            icon={Sparkles}
          >
            <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {enrichment.simulationOverview}
            </p>
          </ClinicalSkillsLearningBlock>

          <ClinicalSkillsLearningBlock
            title="Clinical rationale"
            eyebrow="Learn mode"
            tone="info"
            icon={Brain}
            id="clinical-skills-learn-mode"
          >
            <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {enrichment.clinicalRationale}
            </p>
          </ClinicalSkillsLearningBlock>

          <ClinicalSkillsLearningBlock
            title="Procedure workspace"
            eyebrow="Competency mode"
            tone="info"
            icon={Stethoscope}
            id="clinical-skills-competency-mode"
          >
            <ClinicalSkillsProcedureWorkspace
              skill={skill}
              onCompetencyChange={setCompetency}
            />
          </ClinicalSkillsLearningBlock>

          <ClinicalSkillsLearningBlock
            title="Procedural sequencing"
            eyebrow="Active recall"
            tone="success"
            icon={ListOrdered}
          >
            <ClinicalSkillsSequencingChallenge
              skill={skill}
              passed={competency.sequencingPassed}
              onPassed={() => persistCompetency({ sequencingPassed: true })}
            />
          </ClinicalSkillsLearningBlock>

          <ClinicalSkillsLearningBlock
            title="What went wrong?"
            eyebrow="Safety checkpoint"
            tone="warning"
            icon={AlertTriangle}
          >
            <ClinicalSkillsErrorSpotting
              scenario={enrichment.errorScenario}
              passed={competency.errorSpottingPassed}
              onPassed={() => persistCompetency({ errorSpottingPassed: true })}
            />
          </ClinicalSkillsLearningBlock>

          <ClinicalSkillsLearningBlock
            title="Patient status simulation"
            eyebrow="Simulation mode"
            tone="warning"
            icon={AlertTriangle}
            id="clinical-skills-simulation-mode"
          >
            <ClinicalSkillsSimulationMode skill={skill} />
          </ClinicalSkillsLearningBlock>

          <ClinicalSkillsLearningBlock
            title="Global safety checkpoints"
            eyebrow="Before you finish"
            tone="warning"
            icon={AlertTriangle}
          >
            <ClinicalSkillsChipList
              items={[
                "Verify orders, allergies, and patient identity before psychomotor steps",
                "Maintain sterile or clean technique per policy — never shortcut infection control",
                "Stop and escalate if resistance, bleeding, or unexpected patient response occurs",
              ]}
              variant="escalation"
            />
          </ClinicalSkillsLearningBlock>

          {enrichment.retentionItems.length > 0 ? (
            <ClinicalSkillsLearningBlock
              title="Bedside retention prompts"
              eyebrow="Review mode"
              tone="info"
              icon={Brain}
            >
              <ClinicalSkillsRetentionQuickSet
                items={enrichment.retentionItems}
                onFinished={(score, total) =>
                  persistCompetency({
                    retentionScore: score,
                    retentionTotal: total,
                  })
                }
              />
            </ClinicalSkillsLearningBlock>
          ) : null}

          {quizItems.length > 0 ? (
            <section
              className="nn-clinical-skills-checkpoint-module"
              id="clinical-skills-checkpoint"
              aria-labelledby="clinical-skills-checkpoint-heading"
            >
              <header className="nn-clinical-skills-checkpoint-module__head">
                <p className="nn-clinical-skills-block__eyebrow">
                  Competency checkpoint
                </p>
                <h2
                  id="clinical-skills-checkpoint-heading"
                  className="text-lg font-semibold text-[var(--semantic-text-primary)]"
                >
                  Clinical judgment questions
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
                  Answer each item, review rationales, and score at least 70% to
                  record competency completion.
                </p>
              </header>
              <div className="nn-clinical-skills-checkpoint-module__body">
                <PathwayLessonQuizSet
                  title="Competency checkpoint"
                  subtitle="NCLEX-style traps, safety reasoning, and procedure sequencing with full rationales."
                  items={quizItems}
                  fullAccess
                  variant="post"
                  postMode="practice"
                  onAssessmentFinished={handleCheckpointFinished}
                />
              </div>
            </section>
          ) : null}

          <ClinicalSkillsLearningBlock
            title="Competency flashcards"
            eyebrow="Review mode"
            tone="brand"
            icon={Layers}
            id="clinical-skills-review-mode"
          >
            <p className="mb-3 text-sm text-[var(--semantic-text-secondary)]">
              Reinforce safety steps, sequencing, and clinical rationale — flip
              each card to build long-term procedural memory.
            </p>
            <ClinicalSkillsFlashcardReview
              cards={enrichment.flashcards}
              reviewedIds={competency.reviewedFlashcardIds}
              onReviewedChange={(ids) =>
                persistCompetency({ reviewedFlashcardIds: ids })
              }
            />
          </ClinicalSkillsLearningBlock>

          <ClinicalSkillsLearningBlock
            title="Confidence check"
            eyebrow="Self-rating"
            tone="info"
            icon={ShieldCheck}
          >
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              How ready do you feel to perform this skill at the bedside?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => persistCompetency({ confidenceRating: n })}
                  className={cn(
                    "min-h-10 min-w-[2.75rem] rounded-full border px-3 text-sm font-semibold transition-colors",
                    competency.confidenceRating === n
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))]",
                  )}
                  aria-pressed={competency.confidenceRating === n}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">
              1 = needs lab rehearsal · 5 = simulation-ready confidence
            </p>
          </ClinicalSkillsLearningBlock>

          <ClinicalSkillsLearningBlock
            title="Documentation callout"
            eyebrow="Close the loop"
            tone="brand"
            icon={ClipboardList}
          >
            <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Document indication, patient response, supplies, education, and
              follow-up — pair with your facility checklist and EHR fields.
            </p>
          </ClinicalSkillsLearningBlock>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={localDone && serverDone}
              onClick={() => markCompleted(skill.slug)}
              className={cn(
                "inline-flex min-h-10 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-[var(--semantic-shadow-soft)] transition-colors",
                localDone || serverDone
                  ? "border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-success)]"
                  : "bg-[var(--role-cta)] text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]",
              )}
            >
              {localDone || serverDone
                ? "Marked complete"
                : "Mark walkthrough reviewed"}
            </button>
          </div>
        </div>

        <ClinicalSkillContextRail
          skill={skill}
          progressStatus={serverDone ? "completed" : progressStatus}
          checkpointCount={quizItems.length}
          readinessPct={readinessPct}
          stepsDone={competency.completedStepIndices.length}
          flashcardsDone={competency.reviewedFlashcardIds.length}
          flashcardTotal={enrichment.flashcards.length}
          confidenceRating={competency.confidenceRating}
        />
      </div>

      <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] p-5 sm:p-6">
        <div className="flex gap-3">
          <ShieldCheck
            className="h-5 w-5 shrink-0 text-[var(--semantic-info)]"
            aria-hidden
          />
          <div>
            <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">
              Adaptive remediation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Weak sequencing or checkpoint scores stay visible in your
              competency rail. NurseNest can surface this lab alongside labs,
              medication calculations, and scenarios when related weakness
              signals appear on your dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
