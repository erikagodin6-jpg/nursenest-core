import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CASPer Session Review | NurseNest",
  description: "Review professionalism, communication, stakeholder awareness, and ethical reasoning performance.",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const reviewAreas = [
  {
    title: "Professionalism",
    summary: "Strong accountability and respectful communication across conflict-oriented prompts.",
  },
  {
    title: "Stakeholder awareness",
    summary: "Good recognition of affected parties, but some responses could prioritize safety earlier.",
  },
  {
    title: "Communication clarity",
    summary: "Responses are empathetic, though several answers become too long before reaching the action plan.",
  },
] as const;

export default async function CasperReviewPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          CASPer review session
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-5xl">
          Reflective performance analysis
        </h1>

        <p className="mt-5 text-lg leading-8 text-[var(--semantic-text-secondary)]">
          Session reference: {id}
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          ["Professionalism", "Strong"],
          ["Ethical reasoning", "Strong"],
          ["Communication clarity", "Moderate"],
        ].map(([title, value]) => (
          <article key={title} className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
            <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">{title}</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--semantic-text-primary)]">{value}</h2>
          </article>
        ))}
      </section>

      <section className="grid gap-6">
        {reviewAreas.map((area) => (
          <article key={area.title} className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
            <h2 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">
              {area.title}
            </h2>

            <p className="mt-5 text-base leading-8 text-[var(--semantic-text-secondary)]">
              {area.summary}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
