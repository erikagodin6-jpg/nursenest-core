import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, ClipboardList, LineChart, Target } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";
import { CasperPremiumEcosystemPage } from "@/components/pre-nursing/casper/casper-premium-ecosystem-page";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { getPreNursingModuleComponent } from "@/content/pre-nursing/pre-nursing-module-map";
import { getAdmissionExamProductBySlug, type AdmissionExamProduct } from "@/lib/admissions/admissions-entrance-exams";
import {
  getAdmissionsProductCompletionPercent,
  getAdmissionsProductLaunchGaps,
  getAdmissionsProductReadinessBySlug,
  type AdmissionsProductReadiness,
} from "@/lib/pre-nursing/admissions-product-readiness";
import { absoluteUrl } from "@/lib/seo/site-origin";

const RESERVED = new Set(["lessons", "study-plan"]);

type Props = { params: Promise<{ slug: string }> };

// 🧊 ISR: revalidate: 86400 below
export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getAdmissionsProductReadinessBySlug(slug);
  if (slug === "casper") {
    return {
      title: "CASPER Situational Judgment Prep | NurseNest",
      description:
        "Practice CASPER ethics, empathy, professionalism, communication, conflict resolution, written responses, video responses, and professional judgment scenarios.",
      alternates: { canonical: absoluteUrl("/pre-nursing/casper") },
      openGraph: {
        title: "CASPER Situational Judgment Prep | NurseNest",
        description:
          "A dedicated CASPER response-training ecosystem for situational judgment, ethical reasoning, and professional communication.",
        url: absoluteUrl("/pre-nursing/casper"),
        type: "website",
      },
    };
  }
  if (!product) return {};

  return {
    title: `${product.shortLabel} Prep | NurseNest`,
    description: `${product.shortLabel} admissions prep with exam-scoped lessons, flashcards, practice questions, study plans, and readiness tracking.`,
    alternates: { canonical: absoluteUrl(product.canonicalPath) },
    openGraph: {
      title: `${product.shortLabel} Prep | NurseNest`,
      description: product.summary,
      url: absoluteUrl(product.canonicalPath),
      type: "website",
    },
  };
}

/**
 * Legacy module URLs `/pre-nursing/:slug` → canonical `/pre-nursing/lessons/:slug`.
 * Reserved segments are handled by more specific routes.
 */
export default async function PreNursingLegacyModuleRedirect({ params }: Props) {
  const { slug } = await params;
  if (slug === "casper") return <CasperPremiumEcosystemPage />;

  const product = getAdmissionsProductReadinessBySlug(slug);
  const examProduct = getAdmissionExamProductBySlug(slug);
  if (product && examProduct) return <AdmissionsProductPage product={product} examProduct={examProduct} />;

  if (RESERVED.has(slug)) notFound();
  if (!getPreNursingModuleComponent(slug)) notFound();
  if (!PRE_NURSING_MODULE_REGISTRY.some((m) => m.slug === slug)) notFound();
  permanentRedirect(`/pre-nursing/lessons/${slug}`);
}

function AdmissionsProductPage({
  product,
  examProduct,
}: {
  product: AdmissionsProductReadiness;
  examProduct: AdmissionExamProduct;
}) {
  const completionPercent = getAdmissionsProductCompletionPercent(product);
  const qualityActions = getAdmissionsProductLaunchGaps(product);

  return (
    <main className="nn-marketing-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/admissions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-accent)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Admissions & Entrance Exams
        </Link>

        <section className="nn-surface-elevated rounded-3xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
            <div>
              <p className="nn-premium-home-eyebrow">{product.statusLabel}</p>
              <h1 className="nn-marketing-h1 mt-2 max-w-3xl text-balance text-[var(--semantic-text-primary)]">
                {examProduct.title}
              </h1>
              <p className="nn-marketing-body mt-4 max-w-3xl text-pretty text-[var(--semantic-text-secondary)]">
                {examProduct.overview}
              </p>

              <div className="mt-6 rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-panel-muted)] p-4">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{product.currentAccessLabel}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                  This pathway is scoped to {product.shortLabel}, so learners see admissions content before progressing
                  into broader Pre-Nursing, RN, RPN, and Allied Health preparation.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/pre-nursing" className="nn-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                  Open Pre-Nursing foundations
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/pricing" className="nn-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                  View available plans
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--semantic-accent)]">
                Product readiness
              </p>
              <p className="mt-3 text-4xl font-bold text-[var(--semantic-text-primary)]">{completionPercent}%</p>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
                Readiness model coverage across diagnostics, practice, remediation, and analytics.
              </p>

              <div className="mt-5">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Domains</p>
                <ul className="mt-3 grid list-none gap-2 p-0">
                  {product.domains.map((domain) => (
                    <li key={domain} className="flex items-start gap-2 text-sm text-[var(--semantic-text-secondary)]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-accent)]" aria-hidden />
                      <span>{domain}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <section className="mt-8 grid gap-4 border-t border-[var(--semantic-border)] pt-6 md:grid-cols-3" aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="sr-only">
              Learning activities
            </h2>
            {examProduct.learningActivities.map((activity, index) => {
              const Icon = index % 3 === 0 ? BookOpenCheck : index % 3 === 1 ? ClipboardList : LineChart;
              return (
                <div key={activity} className="rounded-2xl bg-[var(--semantic-panel-muted)] p-4">
                  <Icon className="h-5 w-5 text-[var(--semantic-accent)]" aria-hidden />
                  <p className="mt-3 font-semibold text-[var(--semantic-text-primary)]">{activity}</p>
                </div>
              );
            })}
          </section>

          <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" aria-labelledby="exam-breakdown-heading">
            <div>
              <h2 id="exam-breakdown-heading" className="text-lg font-bold text-[var(--semantic-text-primary)]">
                Exam breakdown
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {examProduct.examBreakdown.map((category) => (
                  <article key={category.title} className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-4">
                    <p className="font-semibold text-[var(--semantic-text-primary)]">{category.title}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {category.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-panel-muted)] p-5">
              <div className="flex items-start gap-3">
                <Target className="mt-1 h-5 w-5 shrink-0 text-[var(--semantic-accent)]" aria-hidden />
                <div>
                  <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Study plan</h2>
                  <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                    {examProduct.studyPlan.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </aside>
          </section>

          <section className="mt-8 grid gap-5 lg:grid-cols-3" aria-label={`${product.shortLabel} learning standards`}>
            <article className="rounded-2xl bg-[var(--semantic-panel-muted)] p-5">
              <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Practice modes</h2>
              <ul className="mt-4 grid list-none gap-3 p-0">
                {examProduct.practiceModes.map((mode) => (
                  <li key={mode.title} className="text-sm leading-6 text-[var(--semantic-text-secondary)]">
                    <span className="font-semibold text-[var(--semantic-text-primary)]">{mode.title}: </span>
                    {mode.description}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl bg-[var(--semantic-panel-muted)] p-5">
              <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Hints & pearls</h2>
              <ul className="mt-4 grid list-none gap-3 p-0">
                {examProduct.hintsAndPearls.map((pearl) => (
                  <li key={pearl} className="flex items-start gap-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--semantic-accent)]" aria-hidden />
                    <span>{pearl}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl bg-[var(--semantic-panel-muted)] p-5">
              <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Premium rationales</h2>
              <ul className="mt-4 grid list-none gap-2 p-0">
                {examProduct.rationaleRequirements.map((requirement) => (
                  <li key={requirement} className="flex items-start gap-2 text-sm text-[var(--semantic-text-secondary)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-accent)]" aria-hidden />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="mt-8 border-t border-[var(--semantic-border)] pt-6" aria-labelledby="quality-actions-heading">
            <h2 id="quality-actions-heading" className="text-lg font-bold text-[var(--semantic-text-primary)]">
              Ongoing quality controls
            </h2>
            <ul className="mt-4 grid list-none gap-3 p-0 md:grid-cols-3">
              {qualityActions.map((action) => (
                <li key={action} className="rounded-2xl bg-[var(--semantic-panel-muted)] p-4 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                  {action}
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </main>
  );
}
