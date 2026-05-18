import { AntibioticCoverageMatrix } from "@/src/components/prescribing/antibiotic-coverage-matrix";
import {
  PRESCRIBING_DOMAINS
} from "@/src/lib/prescribing/antibiotic-registry";

export default function PrescribingAcademyPage() {
  return (
    <main className="min-h-screen bg-[var(--semantic-background)] px-6 py-10 text-[var(--semantic-foreground)]">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100">
            NP Prescribing Academy
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight">
            Clinical Prescribing & Antibiotic Stewardship
          </h1>

          <p className="mt-6 text-lg leading-8 text-[var(--semantic-muted-foreground)]">
            Learn how clinicians think when prescribing: organism coverage,
            escalation, stewardship, resistance patterns, and syndrome-based
            treatment decisions.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {PRESCRIBING_DOMAINS.map((domain) => (
            <section
              key={domain.slug}
              className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8"
            >
              <h2 className="text-2xl font-semibold">{domain.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--semantic-muted-foreground)]">
                {domain.description}
              </p>

              <div className="mt-6 space-y-3">
                {domain.modules.map((module) => (
                  <div
                    key={module.slug}
                    className="rounded-2xl border border-white/10 bg-black/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium">{module.title}</h3>

                      {module.premium ? (
                        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100">
                          PREMIUM
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm text-[var(--semantic-muted-foreground)]">
                      {module.summary}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">
              Antibiotic Coverage Matrix
            </h2>
            <p className="mt-3 text-[var(--semantic-muted-foreground)]">
              Understand coverage patterns instead of memorizing isolated drugs.
            </p>
          </div>

          <AntibioticCoverageMatrix />
        </section>
      </section>
    </main>
  );
}
