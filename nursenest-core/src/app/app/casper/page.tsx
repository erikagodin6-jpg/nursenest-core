import Link from "next/link";
import type { Metadata } from "next";

import { CASPER_ENTITLEMENT, CASPER_FREE_MINI_TEST } from "@/lib/casper/casper-scenarios";

export const metadata: Metadata = {
  title: "CASPer Studio | NurseNest",
  description: "CASPer preparation dashboard with simulations, feedback, and professionalism coaching.",
};

const dashboardCards = [
  {
    title: "Free mini simulation",
    body: "Complete a short reflective simulation with healthcare-focused professionalism prompts.",
    href: "/casper/practice-test",
    cta: "Start practice",
  },
  {
    title: "Scenario library",
    body: "Review ethical domains, stakeholder analysis, strong response signals, and common traps.",
    href: "/casper/scenarios",
    cta: "Review scenarios",
  },
  {
    title: "Premium feedback",
    body: "Unlock advanced AI-guided response analysis, percentile benchmarking, and weakness tracking.",
    href: "/pricing?product=casper",
    cta: "Unlock premium",
  },
] as const;

export default function CasperLearnerDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          CASPer Studio
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-5xl">
          Build professional judgment before admissions day.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--semantic-text-secondary)]">
          Practice reflective situational judgment, healthcare communication, ethical reasoning, and stakeholder-aware decision-making in a calm writing-focused workspace.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-[var(--semantic-surface-secondary)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-primary)]">
            {CASPER_FREE_MINI_TEST.length} free starter stations
          </span>
          <span className="rounded-full border border-[var(--semantic-border-primary)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-secondary)]">
            Entitlement: {CASPER_ENTITLEMENT}
          </span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {dashboardCards.map((card) => (
          <article key={card.title} className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
            <h2 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{card.title}</h2>
            <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">{card.body}</p>
            <Link href={card.href} className="mt-8 inline-flex rounded-2xl border border-[var(--semantic-border-primary)] px-5 py-3 font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-surface-secondary)]">
              {card.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
        <h2 className="text-3xl font-semibold text-[var(--semantic-text-primary)]">Recommended next steps</h2>
        <ol className="mt-6 space-y-4 text-base leading-8 text-[var(--semantic-text-secondary)]">
          <li>1. Complete the free mini simulation.</li>
          <li>2. Review your responses against ethical domains and common traps.</li>
          <li>3. Upgrade for advanced response analysis and full-length simulations.</li>
        </ol>
      </section>
    </main>
  );
}
