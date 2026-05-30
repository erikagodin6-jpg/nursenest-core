import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardList, GraduationCap, LineChart, Sparkles } from "lucide-react";
import {
  ADMISSION_EXAM_PRODUCTS,
  ADMISSION_EXAM_ACTIVITY_REQUIREMENTS,
  ADMISSIONS_SUBSCRIPTION_STRATEGY,
  FUTURE_ADMISSION_EXAMS,
} from "@/lib/admissions/admissions-entrance-exams";

const featureIcons = [BookOpenCheck, ClipboardList, LineChart] as const;

export function AdmissionsEntranceExamsHub() {
  return (
    <main className="nn-marketing-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center">
          <div>
            <p className="nn-premium-home-eyebrow">Admissions & Entrance Exams</p>
            <h1 className="nn-marketing-h1 mt-3 max-w-4xl text-balance text-[var(--semantic-text-primary)]">
              Entrance exam prep that flows into nursing school readiness.
            </h1>
            <p className="nn-marketing-body mt-4 max-w-3xl text-pretty text-[var(--semantic-text-secondary)]">
              Prepare for ATI TEAS, HESI A2, and CASPER with exam-specific lessons, flashcards, practice questions,
              scenarios, study plans, and readiness tracking that naturally connect into Pre-Nursing, RN, RPN, and Allied
              Health pathways.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pre-nursing/ati-teas" className="nn-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                Start ATI TEAS
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/pre-nursing/casper" className="nn-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                Practice CASPER
              </Link>
            </div>
          </div>

          <aside className="nn-surface-elevated rounded-3xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--semantic-panel-muted)] text-[var(--semantic-accent)]">
                <GraduationCap className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Every admissions exam includes</p>
                <p className="text-sm text-[var(--semantic-text-secondary)]">A complete learn, review, practice, track loop.</p>
              </div>
            </div>
            <ul className="mt-5 grid list-none gap-2 p-0 sm:grid-cols-2">
              {ADMISSION_EXAM_ACTIVITY_REQUIREMENTS.map((requirement) => (
                <li key={requirement} className="flex items-start gap-2 text-sm text-[var(--semantic-text-secondary)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-accent)]" aria-hidden />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-12" aria-labelledby="admissions-products-heading">
          <div className="max-w-3xl">
            <p className="nn-premium-home-eyebrow">First-Class Products</p>
            <h2 id="admissions-products-heading" className="nn-marketing-h2 mt-2 text-balance text-[var(--semantic-text-primary)]">
              Choose your admissions pathway.
            </h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {ADMISSION_EXAM_PRODUCTS.map((product, index) => {
              const Icon = featureIcons[index % featureIcons.length];
              return (
                <article
                  key={product.slug}
                  className="nn-surface-elevated flex min-h-full flex-col rounded-3xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-accent)]">
                        Admissions Prep
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-[var(--semantic-text-primary)]">{product.shortTitle}</h3>
                    </div>
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--semantic-panel-muted)] text-[var(--semantic-accent)]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--semantic-text-secondary)]">{product.overview}</p>
                  <div className="mt-5 rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-panel-muted)] p-4">
                    <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Readiness dashboard</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.readinessDomains.map((domain) => (
                        <span
                          key={domain}
                          className="rounded-full border border-[var(--semantic-border)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={product.canonicalPath}
                    className="nn-btn-secondary mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold"
                    aria-label={`Open ${product.shortTitle} admissions prep`}
                  >
                    Explore {product.shortTitle}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" aria-labelledby="future-admissions-heading">
          <div className="nn-surface-elevated rounded-3xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-6 shadow-[var(--shadow-card)]">
            <p className="nn-premium-home-eyebrow">Future Support</p>
            <h2 id="future-admissions-heading" className="mt-2 text-2xl font-bold text-[var(--semantic-text-primary)]">
              Built to expand with admissions requirements.
            </h2>
            <ul className="mt-5 grid list-none gap-3 p-0">
              {FUTURE_ADMISSION_EXAMS.map((exam) => (
                <li key={exam.title} className="rounded-2xl bg-[var(--semantic-panel-muted)] p-4">
                  <p className="font-semibold text-[var(--semantic-text-primary)]">{exam.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--semantic-text-secondary)]">{exam.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="nn-surface-elevated rounded-3xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--semantic-panel-muted)] text-[var(--semantic-accent)]">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="nn-premium-home-eyebrow">Subscription Strategy</p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--semantic-text-primary)]">
                  Admissions should feed the ecosystem and still support a premium upgrade.
                </h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {ADMISSIONS_SUBSCRIPTION_STRATEGY.options.map((option) => (
                <div key={option.label} className="rounded-2xl bg-[var(--semantic-panel-muted)] p-4">
                  <p className="font-semibold text-[var(--semantic-text-primary)]">{option.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">{option.projection}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl border border-[var(--semantic-border)] p-4 text-sm leading-6 text-[var(--semantic-text-secondary)]">
              <span className="font-semibold text-[var(--semantic-text-primary)]">Recommendation: </span>
              {ADMISSIONS_SUBSCRIPTION_STRATEGY.recommendation}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
