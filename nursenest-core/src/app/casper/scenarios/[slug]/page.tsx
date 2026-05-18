import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CASPER_SCENARIOS, getCasperScenarioBySlug } from "@/lib/casper/casper-scenarios";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return CASPER_SCENARIOS.map((scenario) => ({
    slug: scenario.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getCasperScenarioBySlug(slug);

  if (!scenario) {
    return {
      title: "CASPer Scenario | NurseNest",
    };
  }

  return {
    title: `${scenario.title} | CASPer Scenario | NurseNest`,
    description: scenario.prompt,
    alternates: {
      canonical: `/casper/scenarios/${scenario.slug}`,
    },
  };
}

export default async function CasperScenarioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const scenario = getCasperScenarioBySlug(slug);

  if (!scenario) notFound();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12">
      <section>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-[var(--semantic-surface-secondary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
            {scenario.category.replace(/-/g, " ")}
          </span>

          <span className="rounded-full border border-[var(--semantic-border-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
            {scenario.difficulty}
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-6xl">
          {scenario.title}
        </h1>

        <p className="mt-8 text-lg leading-9 text-[var(--semantic-text-secondary)]">
          {scenario.prompt}
        </p>
      </section>

      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
        <h2 className="text-3xl font-semibold text-[var(--semantic-text-primary)]">
          Stakeholders to consider
        </h2>

        <div className="mt-8 flex flex-wrap gap-4">
          {scenario.stakeholders.map((stakeholder) => (
            <span key={stakeholder} className="rounded-full border border-[var(--semantic-border-primary)] px-5 py-3 text-sm font-medium text-[var(--semantic-text-primary)]">
              {stakeholder}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
          <h2 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">
            Strong response signals
          </h2>

          <ul className="mt-6 space-y-4 text-base leading-8 text-[var(--semantic-text-secondary)]">
            {scenario.strongResponseSignals.map((signal) => (
              <li key={signal}>• {signal}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
          <h2 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">
            Common mistakes
          </h2>

          <ul className="mt-6 space-y-4 text-base leading-8 text-[var(--semantic-text-secondary)]">
            {scenario.commonMistakes.map((mistake) => (
              <li key={mistake}>• {mistake}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
        <h2 className="text-3xl font-semibold text-[var(--semantic-text-primary)]">
          Reflection prompt
        </h2>

        <p className="mt-6 text-lg leading-9 text-[var(--semantic-text-secondary)]">
          {scenario.reflectionPrompt}
        </p>
      </section>
    </main>
  );
}
