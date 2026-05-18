import Link from "next/link";
import type { Metadata } from "next";

import { CASPER_FREE_MINI_TEST, listCasperScenarioCategories } from "@/lib/casper/casper-scenarios";

export const metadata: Metadata = {
  title: "CASPer Prep for Nursing & Healthcare Admissions | NurseNest",
  description: "Practice realistic CASPer scenarios with professionalism, ethical reasoning, and healthcare communication feedback.",
  alternates: { canonical: "/casper" },
};

const features = [
  ["Professionalism analysis", "Structured feedback on accountability, empathy, communication, and judgment."],
  ["Healthcare realism", "Clinical-adjacent dilemmas covering confidentiality, patient safety, teamwork, and equity."],
  ["Calm simulation design", "A writing-focused experience that does not reuse NCLEX or CAT exam chrome."],
] as const;

export default function CasperLandingPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-14 md:px-10 lg:px-12">
      <section className="grid gap-10 rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 shadow-sm lg:grid-cols-[1.15fr_0.85fr] lg:p-14">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-[var(--semantic-border-primary)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-secondary)]">
            Healthcare-focused situational judgment preparation
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-6xl">
            Premium CASPer preparation for future healthcare professionals.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--semantic-text-secondary)]">
            Practice realistic ethical dilemmas, teamwork conflicts, professionalism scenarios, and patient-centered communication prompts with structured reflective coaching.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/casper/practice-test" className="rounded-2xl bg-[var(--theme-primary)] px-6 py-4 font-semibold text-white shadow-sm hover:opacity-90">
              Start free mini simulation
            </Link>
            <Link href="/casper/scenarios" className="rounded-2xl border border-[var(--semantic-border-primary)] px-6 py-4 font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-surface-secondary)]">
              Explore scenarios
            </Link>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">Free mini simulation</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--semantic-text-primary)]">{CASPER_FREE_MINI_TEST.length} starter stations</h2>
            </div>
          </div>
          <div className="space-y-4">
            {CASPER_FREE_MINI_TEST.map((scenario, index) => (
              <div key={scenario.id} className="rounded-2xl border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-5">
                <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">Station {index + 1}</p>
                <h3 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">{scenario.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--semantic-text-secondary)]">{scenario.category.replace(/-/g, " ")}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {features.map(([title, body]) => (
          <article key={title} className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
            <h2 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
            <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">{body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">Scenario categories</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
          Practice the judgment skills healthcare programs actually evaluate.
        </h2>
        <div className="mt-10 flex flex-wrap gap-4">
          {listCasperScenarioCategories().map((category) => (
            <span key={category} className="rounded-full border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] px-5 py-3 text-sm font-medium capitalize text-[var(--semantic-text-primary)]">
              {category.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
