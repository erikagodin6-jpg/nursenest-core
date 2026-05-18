import type { Metadata } from "next";
import Link from "next/link";

import { CASPER_SCENARIOS } from "@/lib/casper/casper-scenarios";

export const metadata: Metadata = {
  title: "CASPer Scenario Bank | NurseNest",
  description: "Practice healthcare-focused CASPer scenarios with ethical reasoning and professionalism analysis.",
  alternates: { canonical: "/casper/scenarios" },
};

export default function CasperScenarioLibraryPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 lg:px-12">
      <section className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">CASPer scenario library</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-6xl">
          Ethical reasoning practice for healthcare admissions.
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--semantic-text-secondary)]">
          Review realistic prompts, ethical domains, strong answer signals, and common traps before starting the timed mini simulation.
        </p>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        {CASPER_SCENARIOS.map((scenario) => (
          <Link
            key={scenario.id}
            href={`/casper/scenarios/${scenario.slug}`}
            className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 transition-transform hover:-translate-y-1 hover:shadow-sm"
          >
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-[var(--semantic-surface-secondary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {scenario.category.replace(/-/g, " ")}
              </span>
              <span className="rounded-full border border-[var(--semantic-border-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {scenario.difficulty}
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-[var(--semantic-text-primary)]">{scenario.title}</h2>
            <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">{scenario.prompt}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {scenario.ethicalDomains.map((domain) => (
                <span key={domain} className="rounded-full border border-[var(--semantic-border-primary)] px-3 py-1 text-sm text-[var(--semantic-text-primary)]">
                  {domain}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm font-semibold text-[var(--theme-primary)]">Read scenario analysis →</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
