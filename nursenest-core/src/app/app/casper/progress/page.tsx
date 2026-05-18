import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CASPer Progress | NurseNest",
  description: "Track professionalism, communication, and ethical reasoning progress for CASPer preparation.",
};

const progressAreas = [
  ["Professionalism", "Strong"],
  ["Empathy", "Developing"],
  ["Stakeholder awareness", "Strong"],
  ["Conflict resolution", "Moderate"],
  ["Ethical reasoning", "Strong"],
  ["Communication clarity", "Moderate"],
] as const;

export default function CasperProgressPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-12">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          CASPer progress tracking
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-5xl">
          Monitor growth across professionalism and ethical reasoning domains.
        </h1>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {progressAreas.map(([title, status]) => (
          <article key={title} className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
            <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">{title}</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--semantic-text-primary)]">{status}</h2>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
        <h2 className="text-3xl font-semibold text-[var(--semantic-text-primary)]">
          Suggested remediation focus
        </h2>

        <ul className="mt-6 space-y-4 text-base leading-8 text-[var(--semantic-text-secondary)]">
          <li>• Practice shorter, clearer opening statements in conflict scenarios.</li>
          <li>• Increase explicit stakeholder acknowledgment in ethical dilemmas.</li>
          <li>• Avoid over-explaining before identifying immediate safety concerns.</li>
        </ul>
      </section>
    </main>
  );
}
