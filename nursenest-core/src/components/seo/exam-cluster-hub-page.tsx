import type { ReactNode } from "react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { BreadcrumbResolution } from "@/lib/seo/breadcrumb-types";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ExamClusterFaq = { question: string; answer: string };

export type ExamClusterHubProps = {
  path: string;
  title: string;
  h1: string;
  eyebrow?: string;
  lead: string;
  description: string;
  sections: { id: string; heading: string; body: ReactNode }[];
  faq?: ExamClusterFaq[];
  relatedLinks?: { href: string; label: string }[];
  breadcrumbs: BreadcrumbResolution;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  ctaHeading: string;
  ctaBody: string;
  disclaimer?: ReactNode;
};

// ── Generic exam cluster hub template ─────────────────────────────────────────

export function ExamClusterHubPage({
  path,
  title,
  h1,
  eyebrow = "Updated for 2026",
  lead,
  description,
  sections,
  faq,
  relatedLinks,
  breadcrumbs,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  ctaHeading,
  ctaBody,
  disclaimer,
}: ExamClusterHubProps) {
  const { crumbs, schemaItems } = breadcrumbs;

  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale: DEFAULT_MARKETING_LOCALE,
          enPath: path,
          title,
          description,
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      {faq && faq.length > 0 ? <FaqJsonLd items={faq} /> : null}

      <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
        <BreadcrumbTrail items={crumbs} />

        <article className="nn-marketing-body">
          <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{eyebrow}</p>
          <h1 className="nn-marketing-h1 mt-2 text-balance">{h1}</h1>
          <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{lead}</p>

          {disclaimer ? <div className="mt-5">{disclaimer}</div> : null}

          {sections.map((s) => (
            <section key={s.id} className="mt-12" aria-labelledby={s.id}>
              <h2 id={s.id} className="nn-marketing-h2">
                {s.heading}
              </h2>
              <div className="mt-4">{s.body}</div>
            </section>
          ))}

          {faq && faq.length > 0 ? (
            <section className="mt-12" aria-labelledby="exam-cluster-faq">
              <h2 id="exam-cluster-faq" className="nn-marketing-h2">
                Frequently asked questions
              </h2>
              <dl className="mt-4 space-y-6">
                {faq.map((item) => (
                  <div key={item.question}>
                    <dt className="font-semibold text-[var(--theme-heading-text)]">{item.question}</dt>
                    <dd className="mt-2 text-[var(--theme-body-text)]">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <aside
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">{ctaHeading}</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">{ctaBody}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ClusterCtaLink href={primaryCtaHref} primary>
                {primaryCtaLabel}
              </ClusterCtaLink>
              {secondaryCtaHref && secondaryCtaLabel ? (
                <ClusterCtaLink href={secondaryCtaHref}>{secondaryCtaLabel}</ClusterCtaLink>
              ) : null}
            </div>
          </aside>

          {relatedLinks && relatedLinks.length > 0 ? (
            <nav className="mt-10" aria-label="Related topics">
              <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                Related topics
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </article>
      </div>
    </>
  );
}

function ClusterCtaLink({
  href,
  children,
  primary,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className="rounded-full px-6 py-2.5 text-[14px] font-semibold transition-colors"
      style={
        primary
          ? { background: "var(--semantic-brand)", color: "#fff" }
          : {
              background: "var(--semantic-surface)",
              color: "var(--semantic-text-secondary)",
              border: "1px solid var(--semantic-border-soft)",
            }
      }
    >
      {children}
    </Link>
  );
}
