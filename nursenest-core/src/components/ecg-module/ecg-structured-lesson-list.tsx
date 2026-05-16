import { RetentionCheckCard } from "@/components/learning-science/retention-check-card";
import { buildDefaultRetentionChecks } from "@/lib/learning-science/retention-system";
import { getEcgStructuredLessons } from "@/lib/ecg-module/ecg-structured-lessons";
import type { EcgLevel } from "@/lib/ecg-module/ecg-module-config";

function SectionList({ title, items }: { title: string; items: readonly string[] }) {
  if (!items.length) return null;

  return (
    <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{title}</h4>
      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-info)]" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EcgStructuredLessonList({ level }: { level: EcgLevel }) {
  const lessons = getEcgStructuredLessons(level);

  return (
    <section className="space-y-6" aria-label={`${level} structured ECG lessons`}>
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_04%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_88%,var(--semantic-text-primary))]">
          Learning science layer
        </p>
        <h2 className="mt-1 text-xl font-semibold text-[var(--semantic-text-primary)]">
          Learn, retrieve, discriminate, transfer
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          These lessons are designed for retention, not memorization. Each lesson teaches the concept, then interrupts passive reading with retrieval checks, confidence calibration, misconception repair, and clinical transfer prompts.
        </p>
      </div>

      {lessons.map((lesson, lessonIndex) => {
        const checks = buildDefaultRetentionChecks({
          lessonId: lesson.id,
          title: lesson.title,
          correctDiagnosticClue: lesson.diagnosticCriteria[0] ?? lesson.objectives[0] ?? lesson.title,
          commonMistake: lesson.commonMistakes[0] ?? "Memorizing the label without checking the evidence.",
          nursingPriority: lesson.nursingPriorities[0] ?? "Assess the patient first.",
          differentiator: lesson.differentiators[0] ?? "Use the interpretation checklist before naming the rhythm.",
        });

        return (
          <article
            key={lesson.id}
            className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]"
            data-testid="ecg-structured-lesson-card"
          >
            <header className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--semantic-surface))] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                    Lesson {lessonIndex + 1} / {lesson.category}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)]">
                    {lesson.title}
                  </h3>
                </div>
                <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]">
                  {lesson.level}
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                {lesson.summary}
              </p>
            </header>

            <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="space-y-4">
                <SectionList title="Learning objectives" items={lesson.objectives} />
                <SectionList title="Interpretation checklist" items={lesson.interpretationChecklist} />
                <SectionList title="Diagnostic criteria" items={lesson.diagnosticCriteria} />
                {lesson.measurementTeaching ? <SectionList title="How to measure it" items={lesson.measurementTeaching} /> : null}
              </div>

              <div className="space-y-4">
                <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                  <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Mechanism</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.mechanism}</p>
                </section>
                {lesson.pWaveTeaching ? (
                  <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                    <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">P-wave teaching</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.pWaveTeaching}</p>
                  </section>
                ) : null}
                {lesson.prTeaching ? (
                  <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                    <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">PR interval teaching</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.prTeaching}</p>
                  </section>
                ) : null}
                {lesson.qrsTeaching ? (
                  <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                    <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">QRS teaching</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.qrsTeaching}</p>
                  </section>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 border-t border-[var(--semantic-border-soft)] p-5 lg:grid-cols-3">
              <SectionList title="Clinical presentation" items={lesson.clinicalPresentation} />
              <SectionList title="Nursing priorities" items={lesson.nursingPriorities} />
              <SectionList title="Common mistakes" items={lesson.commonMistakes} />
            </div>

            <div className="border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-warning)_04%,var(--semantic-surface))] p-5">
              <SectionList title="Differential reasoning — what rules out the look-alikes" items={lesson.differentiators} />
            </div>

            <div className="space-y-4 border-t border-[var(--semantic-border-soft)] p-5">
              {checks.map((check, index) => (
                <RetentionCheckCard key={check.id} check={check} index={index} />
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
