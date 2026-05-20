import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ArrowRight } from "lucide-react";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgTopicBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import {
  ECG_CLUSTER_TOPICS,
  getEcgClusterTopic,
} from "@/lib/ecg-module/ecg-seo-cluster";
import {
  getAllEcgClusterSlugsFromRegistry,
  getAdditionalEcgClusterTopic,
  type EcgClusterRegistryEntry,
} from "@/lib/ecg-module/ecg-seo-cluster-registry";
import type { EcgClusterTopic } from "@/lib/ecg-module/ecg-seo-cluster";

export const revalidate = 86400;

const SITE_ORIGIN = "https://nursenest.ca";

type PageProps = { params: Promise<{ topic: string }> };

/**
 * generateStaticParams uses the unified registry (original 10 + additional registry slugs).
 * This ensures all cluster URLs listed in the sitemap have matching static pages.
 */
export function generateStaticParams() {
  return getAllEcgClusterSlugsFromRegistry().map((slug) => ({ topic: slug }));
}

/** Resolves a cluster topic from either the original or the registry extension. */
function resolveClusterTopic(slug: string): EcgClusterTopic | EcgClusterRegistryEntry | null {
  return getEcgClusterTopic(slug) ?? getAdditionalEcgClusterTopic(slug) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const page = resolveClusterTopic(topic);
  if (!page) return {};
  const PATH = `/ecg/${topic}`;
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title: page.title,
        description: page.description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        keywords: page.keywords,
        openGraph: {
          title: page.title,
          description: page.description,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: { card: "summary_large_image", title: page.title, description: page.description },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.ecgCluster" },
  );
}

export default async function EcgTopicPage({ params }: PageProps) {
  const { topic } = await params;
  const page = resolveClusterTopic(topic);
  if (!page) notFound();

  const PATH = `/ecg/${topic}`;
  const topicLabel = page.h1.split(":")[0]?.trim() ?? page.title;
  const breadcrumbResolution = ecgTopicBreadcrumbs(topicLabel, PATH);
  const jsonLdGraph = [
      {
        "@type": "Article",
        "@id": `${SITE_ORIGIN}${PATH}`,
        url: `${SITE_ORIGIN}${PATH}`,
        name: page.title,
        description: page.description,
        headline: page.h1,
        inLanguage: "en",
        author: { "@type": "Organization", name: "NurseNest" },
        isPartOf: {
          "@type": "WebSite",
          name: "NurseNest",
          url: SITE_ORIGIN,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ];

  return (
    <>
      <ClinicalAcademyJsonLdGraph graph={jsonLdGraph} />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <AcademyBreadcrumbBar resolution={breadcrumbResolution} />

        {/* Header */}
        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_08%,var(--semantic-surface))] text-[var(--semantic-chart-1)]">
              <Activity className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              ECG Mastery · Clinical Guide
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
            {page.h1}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {page.description}
          </p>
        </header>

        {/* Main content — first section is above fold (no containment); subsequent sections get
            content-visibility:auto to defer layout/paint cost until they scroll into view. */}
        <article className="mb-10 space-y-8">
          {page.sections.map((section, idx) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`h-${section.id}`}
              className={idx > 0 ? "nn-content-visibility-auto" : undefined}
            >
              <h2 id={`h-${section.id}`} className="mb-4 text-lg font-semibold text-[var(--semantic-text-primary)]">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.content.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {/* FAQ */}
        {page.faq.length > 0 ? (
          <section className="mb-10 space-y-4" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
              Frequently asked questions
            </h2>
            <dl className="space-y-3">
              {page.faq.map((f) => (
                <div key={f.question} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                  <dt className="text-sm font-semibold text-[var(--semantic-text-primary)]">{f.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* Pillar CTA */}
        <section className="mb-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_05%,var(--semantic-surface))] p-5" aria-labelledby="pillar-cta-heading">
          <h2 id="pillar-cta-heading" className="text-sm font-semibold text-[var(--semantic-text-primary)]">
            Continue with Advanced ECG Interpretation & Cardiac Rhythm Mastery
          </h2>
          <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">
            200+ strip-based questions across 9 clinical ECG tracks — integrated with your NurseNest study loop.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/advanced-ecg-nursing"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--semantic-chart-1)] px-4 py-2 text-xs font-semibold text-white"
            >
              ECG Mastery guide
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
            <Link
              href="/modules/ecg-advanced"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold text-[var(--semantic-text-secondary)]"
            >
              Open Advanced ECG Module
            </Link>
          </div>
        </section>

        {/* More topics */}
        <nav aria-label="More ECG topics" className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            More ECG topics
          </p>
          <ul className="flex flex-wrap gap-2">
            {ECG_CLUSTER_TOPICS.filter((t) => t.slug !== topic).map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/ecg/${t.slug}`}
                  className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"
                >
                  {t.title.split("—")[0]?.trim() ?? t.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Related resources */}
        <nav aria-label="Related ECG resources" className="border-t border-[var(--semantic-border-soft)] pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            Related resources
          </p>
          <ul className="flex flex-wrap gap-2">
            {[
              { href: "/advanced-ecg-nursing", label: "Advanced ECG for Nurses (Pillar)" },
              { href: "/ecg-interpretation", label: "ECG Interpretation" },
              { href: "/ecg-telemetry-mastery", label: "ECG Telemetry Mastery" },
              { href: "/modules/ecg/advanced/lessons", label: "Advanced ECG Lessons" },
              { href: "/modules/ecg/advanced/scenarios", label: "ECG Clinical Scenarios" },
              { href: "/modules/ecg/basic/quizzes", label: "Basic ECG Quizzes" },
              { href: "/clinical-modules", label: "Clinical Modules Hub" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
