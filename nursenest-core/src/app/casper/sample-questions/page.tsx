import type { Metadata } from "next";
import Link from "next/link";

import { CASPER_FREE_MINI_TEST } from "@/lib/casper/casper-scenarios";

export const metadata: Metadata = {
  title: "CASPer Sample Questions | NurseNest",
  description: "Review realistic CASPer sample questions involving professionalism, ethics, teamwork, and communication.",
  alternates: { canonical: "/casper/sample-questions" },
};

export default function CasperSampleQuestionsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12">
      <section className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          CASPer sample questions
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-6xl">
          Practice realistic situational judgment prompts before test day.
        </h1>

        <p className="mt-6 text-lg leading-8 text-[var(--semantic-text-secondary)]">
          Strong CASPer responses are balanced, professional, empathetic, and reflective rather than scripted or overly performative.
        </p>
      </section>

      <section className="grid gap-6">
        {CASPER_FREE_MINI_TEST.map((scenario, index) => (
          <article key={scenario.id} className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">
                  Sample scenario {index + 1}
                </p>

                <h2 className="mt-2 text-3xl font-semibold text-[var(--semantic-text-primary)]">
                  {scenario.title}
                </h2>
              </div>

              <span className="rounded-full border border-[var(--semantic-border-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {scenario.category.replace(/-/g, " ")}
              </span>
            </div>

            <p className="mt-8 text-lg leading-9 text-[var(--semantic-text-secondary)]">
              {scenario.prompt}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {scenario.ethicalDomains.map((domain) => (
                <span key={domain} className="rounded-full bg-[var(--semantic-surface-secondary)] px-4 py-2 text-sm text-[var(--semantic-text-primary)]">
                  {domain}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <div>
        <Link href="/casper/practice-test" className="inline-flex rounded-2xl bg-[var(--theme-primary)] px-6 py-4 font-semibold text-white shadow-sm hover:opacity-90">
          Start the free mini simulation
        </Link>
      </div>
    </main>
  );
}
