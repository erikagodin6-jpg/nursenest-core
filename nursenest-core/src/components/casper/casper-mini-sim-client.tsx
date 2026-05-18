"use client";

import { useMemo, useState } from "react";

import { CASPER_FREE_MINI_TEST } from "@/lib/casper/casper-scenarios";

export function CasperMiniSimClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const scenario = CASPER_FREE_MINI_TEST[step];

  const progress = useMemo(() => {
    return Math.round(((step + 1) / CASPER_FREE_MINI_TEST.length) * 100);
  }, [step]);

  const isComplete = step >= CASPER_FREE_MINI_TEST.length;

  if (isComplete) {
    return (
      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          Mini simulation complete
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
          Your reflective feedback preview
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Professionalism", "Strong"],
            ["Empathy", "Moderate"],
            ["Communication", "Strong"],
          ].map(([title, value]) => (
            <div key={title} className="rounded-2xl border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-6">
              <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">{title}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--semantic-text-primary)]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-8">
          <h3 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">
            Unlock the full CASPer prep experience
          </h3>

          <ul className="mt-5 space-y-3 text-base leading-8 text-[var(--semantic-text-secondary)]">
            <li>• Unlimited full-length simulations</li>
            <li>• Advanced AI-guided professionalism analysis</li>
            <li>• Ethical reasoning coaching</li>
            <li>• Stakeholder-awareness feedback</li>
            <li>• Percentile benchmarking</li>
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
            Station {step + 1} of {CASPER_FREE_MINI_TEST.length}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--semantic-text-primary)]">
            {scenario.title}
          </h2>
        </div>

        <div className="rounded-full border border-[var(--semantic-border-primary)] px-5 py-3 text-sm font-medium text-[var(--semantic-text-secondary)]">
          Progress {progress}%
        </div>
      </div>

      <div className="mt-8 h-2 overflow-hidden rounded-full bg-[var(--semantic-surface-secondary)]">
        <div className="h-full rounded-full bg-[var(--theme-primary)]" style={{ width: `${progress}%` }} />
      </div>

      <article className="mt-10 rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-8">
        <p className="text-base leading-8 text-[var(--semantic-text-primary)]">{scenario.prompt}</p>

        <div className="mt-8 space-y-4">
          {scenario.followUps.map((followUp) => (
            <div key={followUp} className="rounded-2xl bg-[var(--semantic-surface-primary)] px-5 py-4 text-sm leading-7 text-[var(--semantic-text-secondary)]">
              {followUp}
            </div>
          ))}
        </div>
      </article>

      <div className="mt-10">
        <label className="text-sm font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
          Reflective response
        </label>

        <textarea
          value={answers[scenario.id] ?? ""}
          onChange={(event) => {
            setAnswers((current) => ({
              ...current,
              [scenario.id]: event.target.value,
            }));
          }}
          placeholder="Describe how you would approach this scenario..."
          className="mt-4 min-h-[260px] w-full rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-6 text-base leading-8 text-[var(--semantic-text-primary)] outline-none transition-colors focus:border-[var(--theme-primary)]"
        />
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={() => setStep((current) => current + 1)}
          className="rounded-2xl bg-[var(--theme-primary)] px-6 py-4 font-semibold text-white shadow-sm hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </section>
  );
}
