import {
  CASPER_MINI_SIMULATION_FORMAT,
  CASPER_OFFICIAL_FORMAT,
} from "@/lib/casper/casper-test-format";

export function CasperFormatOverview() {
  return (
    <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          Casper format overview
        </p>

        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-4xl">
          Practice using a structure aligned with the real Casper exam.
        </h2>

        <p className="mt-5 text-lg leading-8 text-[var(--semantic-text-secondary)]">
          The real Casper assessment currently combines video-response and typed-response sections. NurseNest practice experiences are designed around those pacing patterns rather than generic question-bank timing.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {CASPER_OFFICIAL_FORMAT.sections.map((section) => (
          <article
            key={section.key}
            className="rounded-2xl border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-6"
          >
            <h3 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">
              {section.label}
            </h3>

            <ul className="mt-5 space-y-3 text-base leading-8 text-[var(--semantic-text-secondary)]">
              <li>• {section.scenarioCount} scenarios</li>
              <li>• {section.questionsPerScenario} questions per scenario</li>
              <li>• {section.responseTimeLabel}</li>
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-6">
        <h3 className="text-xl font-semibold text-[var(--semantic-text-primary)]">
          NurseNest practice format
        </h3>

        <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">
          {CASPER_MINI_SIMULATION_FORMAT.disclaimer}
        </p>

        <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">
          The free simulation currently focuses on typed-response pacing with 3.5-minute reflective writing windows.
        </p>
      </div>

      <p className="mt-8 text-sm leading-7 text-[var(--semantic-text-secondary)]">
        {CASPER_OFFICIAL_FORMAT.accuracyDisclaimer}
      </p>
    </section>
  );
}
