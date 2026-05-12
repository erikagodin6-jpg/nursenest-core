import type { ReactNode } from "react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CnpleSeoFaq = { question: string; answer: string };

export type CnpleSeoHubProps = {
  path: string;
  title: string;
  h1: string;
  eyebrow?: string;
  lead: string;
  sections: { id: string; heading: string; body: ReactNode }[];
  faq?: CnpleSeoFaq[];
  relatedLinks?: { href: string; label: string }[];
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  description: string;
};

// ── Hub page template ─────────────────────────────────────────────────────────

/**
 * Reusable premium SEO hub template for CNPLE content pages.
 * All content pages share this layout: breadcrumbs, structured JSON-LD,
 * FAQ schema, internal linking, and a consistent prose hierarchy.
 */
export function CnpleSeoHubPage({
  path,
  title,
  h1,
  eyebrow = "Updated for 2026",
  lead,
  sections,
  faq,
  relatedLinks,
  primaryCtaHref = "/canada/np/cnple",
  primaryCtaLabel = "CNPLE Prep Hub",
  secondaryCtaHref = "/canada/np/cnple/simulation",
  secondaryCtaLabel = "CNPLE Simulation",
  description,
}: CnpleSeoHubProps) {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs(h1, path);

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

          {/* Disclaimer */}
          <div
            className="mt-5 rounded-xl border px-4 py-3 text-[13px]"
            style={{
              borderColor: "var(--semantic-border-soft)",
              background: "color-mix(in srgb, var(--semantic-info) 5%, var(--semantic-surface))",
              color: "var(--semantic-text-muted)",
            }}
          >
            <strong style={{ color: "var(--semantic-text-secondary)" }}>Independent preparation.</strong>{" "}
            NurseNest is an independent study platform and is not affiliated with CCRNR, the
            Canadian Association of Schools of Nursing, or any regulatory body. CNPLE® is a
            registered examination mark of its respective owners. NurseNest content is CNPLE-aligned
            preparation, not an official replica.
          </div>

          {/* Body sections */}
          {sections.map((s) => (
            <section key={s.id} className="mt-12" aria-labelledby={s.id}>
              <h2 id={s.id} className="nn-marketing-h2">
                {s.heading}
              </h2>
              <div className="mt-4">{s.body}</div>
            </section>
          ))}

          {/* FAQ */}
          {faq && faq.length > 0 ? (
            <section className="mt-12" aria-labelledby="cnple-hub-faq">
              <h2 id="cnple-hub-faq" className="nn-marketing-h2">
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

          {/* CTA */}
          <aside
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Prepare for the CNPLE on NurseNest</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              Clinical cases, prescribing practice, diagnostics, and a full linear simulation —
              all scoped to Canadian NP competencies.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ProseCtaLink href={primaryCtaHref} primary>
                {primaryCtaLabel}
              </ProseCtaLink>
              <ProseCtaLink href={secondaryCtaHref}>
                {secondaryCtaLabel}
              </ProseCtaLink>
            </div>
          </aside>

          {/* Related links */}
          {relatedLinks && relatedLinks.length > 0 ? (
            <nav className="mt-10" aria-label="Related CNPLE topics">
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

function ProseCtaLink({
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

// ── Shared related links ──────────────────────────────────────────────────────

export const CNPLE_RELATED_LINKS = [
  { href: "/canada/np/cnple", label: "CNPLE Hub" },
  { href: "/canada/np/cnple/simulation", label: "CNPLE Simulation" },
  { href: "/canada/np/cnple/lessons", label: "CNPLE Lessons" },
  { href: "/canada/np/cnple/questions", label: "Practice Questions" },
  { href: "/canada/np/cnple/flashcards", label: "CNPLE Flashcards" },
  { href: "/canada/np/cnple/report-card", label: "Report Card" },
  { href: "/cnple", label: "CNPLE Overview" },
  { href: "/cnple-practice-questions", label: "Practice Questions Hub" },
  { href: "/cnple-simulation-exam", label: "Simulation Info" },
  { href: "/cnple-study-guide", label: "Study Guide" },
  { href: "/cnple-clinical-judgment", label: "Clinical Judgment" },
  { href: "/cnple-prescribing-questions", label: "Prescribing Questions" },
  { href: "/cnple-lab-interpretation", label: "Lab Interpretation" },
  { href: "/cnple-case-studies", label: "Case Studies" },
  { href: "/exams/canada", label: "Canada Nursing Exams" },
] as const;
