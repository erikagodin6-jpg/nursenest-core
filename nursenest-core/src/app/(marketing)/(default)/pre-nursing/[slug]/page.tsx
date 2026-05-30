import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";
import { CasperPremiumEcosystemPage } from "@/components/pre-nursing/casper/casper-premium-ecosystem-page";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { getPreNursingModuleComponent } from "@/content/pre-nursing/pre-nursing-module-map";
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
      title: "CASPer Situational Judgment Prep | NurseNest",
      description:
        "Practice CASPer ethics, empathy, professionalism, communication, conflict resolution, and reflection through realistic response scenarios.",
      alternates: { canonical: absoluteUrl("/pre-nursing/casper") },
      robots: { index: false, follow: true },
      openGraph: {
        title: "CASPer Situational Judgment Prep | NurseNest",
        description:
          "A dedicated CASPer response-training ecosystem for situational judgment, ethical reasoning, and professional communication.",
        url: absoluteUrl("/pre-nursing/casper"),
        type: "website",
      },
    };
  }
  if (!product) return {};

  return {
    title: `${product.shortLabel} status | NurseNest`,
    description: `${product.shortLabel} is ${product.statusLabel.toLowerCase()} while NurseNest completes the dedicated admissions-prep product.`,
    alternates: { canonical: absoluteUrl(product.canonicalPath) },
    robots: { index: false, follow: true },
    openGraph: {
      title: `${product.shortLabel} status | NurseNest`,
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
  if (product) return <AdmissionsProductStatusPage product={product} />;

  if (RESERVED.has(slug)) notFound();
  if (!getPreNursingModuleComponent(slug)) notFound();
  if (!PRE_NURSING_MODULE_REGISTRY.some((m) => m.slug === slug)) notFound();
  permanentRedirect(`/pre-nursing/lessons/${slug}`);
}

function AdmissionsProductStatusPage({ product }: { product: AdmissionsProductReadiness }) {
  const completionPercent = getAdmissionsProductCompletionPercent(product);
  const launchGaps = getAdmissionsProductLaunchGaps(product);

  return (
    <main className="nn-marketing-surface">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/pre-nursing"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-accent)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Pre-Nursing
        </Link>

        <section className="nn-surface-elevated rounded-3xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
            <div>
              <p className="nn-premium-home-eyebrow">{product.statusLabel}</p>
              <h1 className="nn-marketing-h1 mt-2 max-w-3xl text-balance text-[var(--semantic-text-primary)]">
                {product.label}
              </h1>
              <p className="nn-marketing-body mt-4 max-w-3xl text-pretty text-[var(--semantic-text-secondary)]">
                {product.summary}
              </p>

              <div className="mt-6 rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-panel-muted)] p-4">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{product.currentAccessLabel}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                  This page exists to prevent silent routing into a generic pathway. NurseNest will not present {product.shortLabel} as a
                  complete purchasable product until entitlement, checkout, content, analytics, screenshots, and production QA are complete.
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
                Launch readiness
              </p>
              <p className="mt-3 text-4xl font-bold text-[var(--semantic-text-primary)]">{completionPercent}%</p>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">Internal readiness score from the admissions product checklist.</p>

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

          <section className="mt-8 border-t border-[var(--semantic-border)] pt-6" aria-labelledby="launch-gaps-heading">
            <h2 id="launch-gaps-heading" className="text-lg font-bold text-[var(--semantic-text-primary)]">
              Required before public launch
            </h2>
            <ul className="mt-4 grid list-none gap-3 p-0 md:grid-cols-2">
              {launchGaps.map((gap) => (
                <li key={gap} className="rounded-2xl bg-[var(--semantic-panel-muted)] p-4 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                  {gap}
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </main>
  );
}
