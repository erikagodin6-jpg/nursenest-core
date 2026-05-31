import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, CheckCircle2, ExternalLink, Link2, ShieldCheck } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  AUTHORITY_CATEGORY_META,
  buildAuthorityBreadcrumbs,
  buildAuthorityJsonLd,
  getAuthorityPage,
  getAuthorityPages,
  validateAuthorityPage,
} from "@/lib/authority/healthcare-authority-content-engine";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

type Props = { params: Promise<{ category: string; slug: string }> };

export const revalidate = 86400;

export function generateStaticParams() {
  return getAuthorityPages().map((page) => ({ category: page.category, slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const page = getAuthorityPage(category, slug);
  if (!page) return {};
  const path = `/healthcare/${page.category}/${page.slug}`;
  const alt = marketingAlternatesSharedPage("en", path);
  return {
    title: `${page.title} | Healthcare Education Library | NurseNest`,
    description: page.summary,
    alternates: { canonical: alt.canonical, languages: alt.languages },
    openGraph: {
      title: `${page.title} | NurseNest`,
      description: page.summary,
      type: "article",
      url: alt.canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | NurseNest`,
      description: page.summary,
    },
  };
}

export default async function HealthcareAuthorityDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const page = getAuthorityPage(category, slug);
  if (!page) notFound();
  const quality = validateAuthorityPage(page);
  const breadcrumbs = buildAuthorityBreadcrumbs(page);
  const jsonLd = buildAuthorityJsonLd(page);

  return (
    <main className="bg-[var(--theme-page-bg)] text-[var(--theme-body-text)]">
      <BreadcrumbJsonLd items={breadcrumbs.map((crumb) => ({ name: crumb.name, path: crumb.href }))} />
      {jsonLd.map((node) => (
        <script
          key={String(node["@id"] ?? node["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}

      <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={breadcrumbs} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />

        <header className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">
              {AUTHORITY_CATEGORY_META[page.category].singular}
            </p>
            <h1 className="nn-marketing-h1 mt-3 text-[var(--theme-heading-text)]">{page.title}</h1>
            <p className="nn-marketing-lead mt-4 max-w-3xl text-[var(--theme-muted-text)]">{page.deck}</p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--theme-body-text)]">{page.summary}</p>
          </div>

          <aside className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-[var(--semantic-success)]" aria-hidden />
              <div>
                <h2 className="text-base font-bold text-[var(--theme-heading-text)]">Clinical Review</h2>
                <p className="text-sm text-[var(--theme-muted-text)]">{reviewStatusLabel(page.clinicalReviewStatus)}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <ReviewRow label="Reviewer" value={page.reviewer.name} />
              <ReviewRow label="Credentials" value={page.reviewer.credentials} />
              <ReviewRow label="Specialty" value={page.reviewer.specialty} />
              <ReviewRow label="Reviewed" value={page.reviewer.reviewedAt} />
              <ReviewRow label="Updated" value={page.governance.updatedAt} />
              <ReviewRow label="Next Review" value={page.governance.reviewCycleDue} />
              <ReviewRow label="Quality Gate" value={`${quality.score}%`} />
            </dl>
          </aside>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-6">
            {page.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
              >
                <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">{section.title}</h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-[var(--theme-body-text)]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
              <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">Clinical Pearls</h2>
              <IconList items={page.clinicalPearls} />
            </section>

            <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
              <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">Common Mistakes</h2>
              <IconList items={page.commonMistakes} />
            </section>

            <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
              <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">FAQs</h2>
              <div className="mt-4 space-y-3">
                {page.faqs.map((faq) => (
                  <details key={faq.question} className="rounded-xl border border-[var(--semantic-border-soft)] p-4">
                    <summary className="cursor-pointer font-bold text-[var(--theme-heading-text)]">{faq.question}</summary>
                    <p className="mt-3 text-sm leading-6 text-[var(--theme-body-text)]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
              <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">References</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {page.references.map((reference) => (
                  <li key={reference.url}>
                    <a
                      href={reference.url}
                      rel="nofollow noopener noreferrer"
                      target="_blank"
                      className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {reference.title} — {reference.source}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
              <h2 className="flex items-center gap-2 text-base font-bold text-[var(--theme-heading-text)]">
                <Link2 className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
                Related Learning
              </h2>
              <ul className="mt-4 space-y-2">
                {page.related.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link href={item.href} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
              <h2 className="flex items-center gap-2 text-base font-bold text-[var(--theme-heading-text)]">
                <CalendarClock className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
                Content Governance
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-[var(--theme-body-text)]">
                {page.governance.changeHistory.map((item) => (
                  <li key={item} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--semantic-border-soft)] pb-2 last:border-b-0">
      <dt className="text-[var(--theme-muted-text)]">{label}</dt>
      <dd className="text-right font-semibold text-[var(--theme-heading-text)]">{value}</dd>
    </div>
  );
}

function IconList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-6">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function reviewStatusLabel(status: "clinically_reviewed" | "under_review" | "updated"): string {
  if (status === "clinically_reviewed") return "Clinically Reviewed";
  if (status === "updated") return "Updated";
  return "Under Review";
}
