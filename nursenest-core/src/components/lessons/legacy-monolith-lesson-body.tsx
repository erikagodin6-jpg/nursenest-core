import type { ReactNode } from "react";
import { PathwayLessonBody } from "@/components/lessons/pathway-lesson-body";
import type { LessonContent, MedicationEntry, QuizQuestion } from "@legacy-client/data/lessons/types";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-border pb-6 last:border-0">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--theme-body-text)]">
      {items.map((x, i) => (
        <li key={i} className="whitespace-pre-wrap">
          {x}
        </li>
      ))}
    </ul>
  );
}

function MedicationCard({ m }: { m: MedicationEntry }) {
  if ("dose" in m) {
    return (
      <li className="rounded-lg border border-border bg-[var(--theme-muted-surface)]/40 p-3 text-sm">
        <p className="font-medium text-foreground">{m.name}</p>
        <dl className="mt-2 grid gap-1 text-xs text-muted-foreground">
          {m.dose ? (
            <div>
              <dt className="inline font-medium text-foreground">Dose: </dt>
              <dd className="inline">{m.dose}</dd>
            </div>
          ) : null}
          {m.route ? (
            <div>
              <dt className="inline font-medium text-foreground">Route: </dt>
              <dd className="inline">{m.route}</dd>
            </div>
          ) : null}
          {m.purpose ? (
            <div>
              <dt className="inline font-medium text-foreground">Purpose: </dt>
              <dd className="inline whitespace-pre-wrap">{m.purpose}</dd>
            </div>
          ) : null}
        </dl>
      </li>
    );
  }
  return (
    <li className="rounded-lg border border-border bg-[var(--theme-muted-surface)]/40 p-3 text-sm">
      <p className="font-medium text-foreground">{m.name}</p>
      <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
        {m.type ? (
          <div>
            <span className="font-medium text-foreground">Type: </span>
            {m.type}
          </div>
        ) : null}
        {m.action ? (
          <div className="whitespace-pre-wrap">
            <span className="font-medium text-foreground">Action: </span>
            {m.action}
          </div>
        ) : null}
        {m.sideEffects ? (
          <div className="whitespace-pre-wrap">
            <span className="font-medium text-foreground">Side effects: </span>
            {m.sideEffects}
          </div>
        ) : null}
        {m.contra ? (
          <div className="whitespace-pre-wrap">
            <span className="font-medium text-foreground">Contraindications: </span>
            {m.contra}
          </div>
        ) : null}
        {m.pearl ? (
          <div className="whitespace-pre-wrap">
            <span className="font-medium text-foreground">Pearl: </span>
            {m.pearl}
          </div>
        ) : null}
      </dl>
    </li>
  );
}

function QuizBlock({ title, questions }: { title: string; questions: QuizQuestion[] }) {
  if (!questions?.length) return null;
  return (
    <Section title={title}>
      <ol className="mt-2 list-decimal space-y-4 pl-5 text-sm text-[var(--theme-body-text)]">
        {questions.map((q, i) => {
          const correctIdx = q.correct ?? q.correctIndex ?? 0;
          return (
          <li key={i} className="marker:font-semibold">
            <p className="font-medium text-foreground">{q.question}</p>
            <ul className="mt-2 list-inside list-[circle] space-y-1 text-muted-foreground">
              {q.options.map((opt, j) => (
                <li key={j}>
                  {j === correctIdx ? <strong className="text-foreground">{opt}</strong> : opt}
                </li>
              ))}
            </ul>
            {q.rationale ? (
              <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                <span className="font-semibold text-foreground">Rationale: </span>
                {q.rationale}
              </p>
            ) : null}
          </li>
          );
        })}
      </ol>
    </Section>
  );
}

/** Renders monolith `client/src/data/lessons` {@link LessonContent} in the app shell. */
export function LegacyMonolithLessonBody({ lesson }: { lesson: LessonContent }) {
  const cellular =
    typeof lesson.cellular === "string"
      ? lesson.cellular
      : `${lesson.cellular?.title ?? ""}\n\n${lesson.cellular?.content ?? ""}`.trim();

  const overviewTitle =
    typeof lesson.cellular === "object" && lesson.cellular?.title ? lesson.cellular.title : "Overview";

  return (
    <article className="mt-6 space-y-6 text-sm leading-relaxed">
      {cellular ? (
        <Section title={overviewTitle}>
          <PathwayLessonBody text={cellular} />
        </Section>
      ) : null}
      {lesson.riskFactors && lesson.riskFactors.length > 0 ? (
        <Section title="Risk factors">
          <BulletList items={lesson.riskFactors} />
        </Section>
      ) : null}
      {lesson.diagnostics && lesson.diagnostics.length > 0 ? (
        <Section title="Diagnostics">
          <BulletList items={lesson.diagnostics} />
        </Section>
      ) : null}
      {lesson.management && lesson.management.length > 0 ? (
        <Section title="Management">
          <BulletList items={lesson.management} />
        </Section>
      ) : null}
      {lesson.nursingActions && lesson.nursingActions.length > 0 ? (
        <Section title="Nursing actions">
          <BulletList items={lesson.nursingActions} />
        </Section>
      ) : null}
      {lesson.assessmentFindings && lesson.assessmentFindings.length > 0 ? (
        <Section title="Assessment findings">
          <BulletList items={lesson.assessmentFindings} />
        </Section>
      ) : null}
      {lesson.pearls && lesson.pearls.length > 0 ? (
        <Section title="Clinical pearls">
          <BulletList items={lesson.pearls} />
        </Section>
      ) : null}
      {lesson.lifespan ? (
        <Section title={typeof lesson.lifespan === "object" ? lesson.lifespan.title : "Lifespan"}>
          <PathwayLessonBody
            text={typeof lesson.lifespan === "string" ? lesson.lifespan : lesson.lifespan.content ?? ""}
          />
        </Section>
      ) : null}
      {Array.isArray(lesson.signs) ? (
        <Section title="Signs & symptoms">
          <BulletList items={lesson.signs} />
        </Section>
      ) : lesson.signs ? (
        <Section title="Signs & symptoms">
          <BulletList items={[...(lesson.signs.left ?? []), ...(lesson.signs.right ?? [])]} />
        </Section>
      ) : null}
      {lesson.medications && lesson.medications.length > 0 ? (
        <Section title="Medications">
          <ul className="mt-2 space-y-3">
            {lesson.medications.map((m, i) => (
              <MedicationCard key={i} m={m} />
            ))}
          </ul>
        </Section>
      ) : null}
      <QuizBlock title="Pre-test" questions={lesson.preTest ?? []} />
      <QuizBlock title="Practice questions" questions={lesson.quiz ?? []} />
      <QuizBlock title="Post-test" questions={lesson.postTest ?? []} />
    </article>
  );
}
