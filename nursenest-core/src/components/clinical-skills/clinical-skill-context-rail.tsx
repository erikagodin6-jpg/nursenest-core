import type { ClinicalSkillDefinition } from "@/lib/clinical-skills/clinical-skills-catalog";
import { clinicalSkillProgressLabel, clinicalSkillTierLabel } from "@/lib/clinical-skills/clinical-skills-display";
import { ClinicalSkillsCompetencyMeter } from "@/components/clinical-skills/clinical-skills-competency-meter";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export function ClinicalSkillContextRail({
  skill,
  progressStatus = "not_started",
  checkpointCount = 0,
  readinessPct = 0,
  stepsDone = 0,
  flashcardsDone = 0,
  flashcardTotal = 0,
  confidenceRating = null,
}: {
  skill: ClinicalSkillDefinition;
  progressStatus?: PathwayLessonProgressStatus;
  checkpointCount?: number;
  readinessPct?: number;
  stepsDone?: number;
  flashcardTotal?: number;
  flashcardsDone?: number;
  confidenceRating?: number | null;
}) {
  return (
    <aside className="nn-clinical-skills-lesson-rail" aria-label="Competency context">
      <div className="nn-clinical-skills-lesson-rail__card nn-clinical-skills-lesson-rail__card--meter">
        <ClinicalSkillsCompetencyMeter
          readinessPct={readinessPct}
          stepsDone={stepsDone}
          stepTotal={skill.steps.length}
          flashcardsDone={flashcardsDone}
          flashcardTotal={flashcardTotal}
        />
      </div>

      <div className="nn-clinical-skills-lesson-rail__card">
        <h3>Learning state</h3>
        <ul className="mt-2 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">Estimated time:</span> {skill.estimatedMinutes} min
          </li>
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">Competency tier:</span> {clinicalSkillTierLabel(skill.competencyTier)}
          </li>
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">Status:</span> {clinicalSkillProgressLabel(progressStatus)}
          </li>
          {checkpointCount > 0 ? (
            <li>
              <span className="font-semibold text-[var(--semantic-text-primary)]">Checkpoint items:</span> {checkpointCount}
            </li>
          ) : null}
          {confidenceRating !== null ? (
            <li>
              <span className="font-semibold text-[var(--semantic-text-primary)]">Bedside confidence:</span> {confidenceRating}/5
            </li>
          ) : null}
        </ul>
      </div>

      <div className="nn-clinical-skills-lesson-rail__card">
        <h3>Simulation readiness</h3>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
          {skill.competencyTier === "simulation_ready"
            ? "High-acuity psychomotor sequencing — complete steps, sequencing, error spotting, flashcards, and checkpoints before lab validation."
            : skill.competencyTier === "proficiency"
              ? "Build speed and confidence with deliberate practice, then validate in skills lab."
              : "Foundation skill — focus on rights, technique, and observation before advancing."}
        </p>
      </div>

      <div className="nn-clinical-skills-lesson-rail__card">
        <h3>Procedure steps</h3>
        <ul>
          {skill.steps.map((step) => (
            <li key={step.title}>
              <strong className="text-[var(--semantic-text-primary)]">{step.title}</strong>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
