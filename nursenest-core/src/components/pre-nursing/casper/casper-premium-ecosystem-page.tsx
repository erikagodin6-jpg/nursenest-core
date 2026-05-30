import Link from "next/link";
import { ArrowLeft, BarChart3, Brain, MessageCircle, ShieldCheck, Video } from "lucide-react";
import {
  CASPER_ANALYTICS_DIMENSIONS,
  CASPER_SCENARIOS,
  formatCasperDimensionLabel,
  getCasperCategoryCoverage,
} from "@/lib/casper/casper-premium-ecosystem";
import { CasperResponseTrainerClient } from "@/components/pre-nursing/casper/casper-response-trainer-client";

export function CasperPremiumEcosystemPage() {
  const coverage = getCasperCategoryCoverage();
  const featuredScenarios = CASPER_SCENARIOS.slice(0, 4);

  return (
    <main className="nn-marketing-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/pre-nursing"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-accent)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Pre-Nursing
        </Link>

        <section className="rounded-3xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center">
            <div>
              <p className="nn-premium-home-eyebrow">Admissions Preparation</p>
              <h1 className="nn-marketing-h1 mt-2 max-w-3xl text-balance text-[var(--semantic-text-primary)]">
                CASPer Situational Judgment Prep
              </h1>
              <p className="nn-marketing-body mt-4 max-w-3xl text-pretty text-[var(--semantic-text-secondary)]">
                Practice ethical reasoning, empathy, professionalism, communication, conflict resolution, and reflection
                through realistic response scenarios. This is built as a communication trainer, not a memorization bank.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <HeroMetric value={CASPER_SCENARIOS.length.toString()} label="Scenarios" />
                <HeroMetric value={coverage.length.toString()} label="Domains" />
                <HeroMetric value={CASPER_ANALYTICS_DIMENSIONS.length.toString()} label="Review scores" />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-panel-muted)] p-5">
              <p className="text-sm font-bold text-[var(--semantic-text-primary)]">What CASPer practice evaluates</p>
              <div className="mt-4 grid gap-2">
                {CASPER_ANALYTICS_DIMENSIONS.map((dimension) => (
                  <div key={dimension} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--semantic-surface)] px-3 py-2 text-sm">
                    <span className="text-[var(--semantic-text-primary)]">{formatCasperDimensionLabel(dimension)}</span>
                    <BarChart3 className="h-4 w-4 text-[var(--semantic-accent)]" aria-hidden />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4" aria-label="CASPer product capabilities">
          <Capability icon={Brain} title="Scenario engine" body="Ethics, professionalism, advocacy, equity, bias, confidentiality, safety, and team communication." />
          <Capability icon={MessageCircle} title="Response trainer" body="Excellent, average, and poor responses with scoring explanations and reasoning notes." />
          <Capability icon={Video} title="Video practice" body="Timed prompts, body-language coaching, pacing guidance, and professional communication frameworks." />
          <Capability icon={ShieldCheck} title="Structured review" body="Dimension-level feedback across empathy, professionalism, stakeholders, communication, and reasoning." />
        </section>

        <section className="mt-10 space-y-4" aria-labelledby="casper-scenario-coverage-heading">
          <div>
            <p className="nn-premium-home-eyebrow">Scenario Coverage</p>
            <h2 id="casper-scenario-coverage-heading" className="nn-marketing-h2 text-balance text-[var(--semantic-text-primary)]">
              Practice judgment, not memorized answers
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredScenarios.map((scenario) => (
              <article
                key={scenario.id}
                className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-[var(--shadow-card)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-accent)]">
                  {scenario.category.replaceAll("_", " ")}
                </p>
                <h3 className="mt-2 text-lg font-bold text-[var(--semantic-text-primary)]">{scenario.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--semantic-text-secondary)]">{scenario.prompt}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <CasperResponseTrainerClient />
        </section>

        <section className="mt-10 space-y-4" aria-labelledby="casper-response-examples-heading">
          <div>
            <p className="nn-premium-home-eyebrow">Model Responses</p>
            <h2 id="casper-response-examples-heading" className="nn-marketing-h2 text-balance text-[var(--semantic-text-primary)]">
              See why responses score differently
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {CASPER_SCENARIOS[0]?.examples.map((example) => (
              <article
                key={example.band}
                className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-[var(--shadow-card)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-accent)]">
                  {example.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--semantic-text-primary)]">{example.response}</p>
                <p className="mt-4 text-sm font-semibold text-[var(--semantic-text-primary)]">Why it performs this way</p>
                <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">{example.whyItPerformsThisWay}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-panel-muted)] p-4">
      <p className="text-2xl font-bold text-[var(--semantic-text-primary)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{label}</p>
    </div>
  );
}

function Capability({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Brain;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-[var(--shadow-card)]">
      <Icon className="h-5 w-5 text-[var(--semantic-accent)]" aria-hidden />
      <h2 className="mt-3 text-base font-bold text-[var(--semantic-text-primary)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">{body}</p>
    </article>
  );
}
