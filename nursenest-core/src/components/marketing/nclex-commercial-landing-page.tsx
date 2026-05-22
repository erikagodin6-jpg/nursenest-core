import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { seoPageMetadata } from "@/lib/seo/marketing-metadata";
import {
  buildNclexCommercialArticleJsonLd,
  buildNclexCommercialFaqJsonLd,
  getNclexCommercialLandingBySlug,
  type LandingCta,
  type NclexCommercialLandingPage as LandingPage,
} from "@/lib/seo/nclex-commercial-landing-pages";
import { absoluteUrl } from "@/lib/seo/site-origin";

export function generateNclexCommercialLandingMetadata(slug: string): Metadata {
  const landing = getNclexCommercialLandingBySlug(slug);
  if (!landing || landing.status !== "published") {
    return {
      title: "Nursing exam prep page unavailable | NurseNest",
      robots: { index: false, follow: true },
    };
  }

  return seoPageMetadata({
    title: landing.title,
    description: landing.metaDescription,
    path: landing.path,
    robots: { index: true, follow: true },
  });
}

function ctaClass(intent: LandingCta["intent"]): string {
  return intent === "primary" || intent === "upgrade"
    ? "nn-nclex-commercial-cta nn-nclex-commercial-cta--primary"
    : "nn-nclex-commercial-cta nn-nclex-commercial-cta--secondary";
}

function CtaLink({ cta }: { cta: LandingCta }) {
  return (
    <Link href={cta.href} className={ctaClass(cta.intent)}>
      {cta.label}
    </Link>
  );
}

function JsonLd({ value }: { value: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }} />;
}

function HeroPreview({ landing }: { landing: LandingPage }) {
  return (
    <div className="nn-nclex-commercial-preview" aria-label="NurseNest readiness preview">
      <div className="nn-nclex-commercial-preview__topline">
        <span>Readiness signal</span>
        <strong>Clinical judgment loop</strong>
      </div>
      <div className="nn-nclex-commercial-preview__band" aria-hidden="true">
        <span style={{ width: "64%" }} />
      </div>
      <div className="nn-nclex-commercial-preview__grid">
        {landing.heroMetrics.map((metric, index) => (
          <div key={metric} className="nn-nclex-commercial-preview__tile">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{metric}</strong>
          </div>
        ))}
      </div>
      <div className="nn-nclex-commercial-preview__rhythm" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: LandingPage["sections"][number] }) {
  return (
    <section className="nn-nclex-commercial-card">
      {section.eyebrow ? <p className="nn-nclex-commercial-eyebrow">{section.eyebrow}</p> : null}
      <h2>{section.title}</h2>
      <p>{section.body}</p>
      <ul>
        {section.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function StudyTimeline({ landing }: { landing: LandingPage }) {
  return (
    <section className="nn-nclex-commercial-section" aria-labelledby="study-timeline-heading">
      <div className="nn-nclex-commercial-section__header">
        <p className="nn-nclex-commercial-eyebrow">Study plan timeline</p>
        <h2 id="study-timeline-heading">A practical route from baseline to readiness</h2>
        <p>
          The timeline is designed to reduce cognitive overload: diagnose, remediate, practice, rehearse, and repeat with better signal each cycle.
        </p>
      </div>
      <div className="nn-nclex-commercial-timeline">
        {landing.timeline.map((step) => (
          <article key={`${step.label}-${step.title}`}>
            <span>{step.label}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComparisonMatrix({ landing }: { landing: LandingPage }) {
  return (
    <section className="nn-nclex-commercial-section" aria-labelledby="comparison-heading">
      <div className="nn-nclex-commercial-section__header">
        <p className="nn-nclex-commercial-eyebrow">Comparison</p>
        <h2 id="comparison-heading">{landing.comparison.title}</h2>
      </div>
      <div className="nn-nclex-commercial-matrix" role="table" aria-label={landing.comparison.title}>
        <div role="row" className="nn-nclex-commercial-matrix__head">
          <span role="columnheader">Decision area</span>
          <span role="columnheader">NurseNest</span>
          <span role="columnheader">Generic prep pattern</span>
        </div>
        {landing.comparison.rows.map((row) => (
          <div role="row" key={row.label} className="nn-nclex-commercial-matrix__row">
            <strong role="cell">{row.label}</strong>
            <span role="cell">{row.nurseNest}</span>
            <span role="cell">{row.genericPrep}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function InternalLinks({ landing }: { landing: LandingPage }) {
  return (
    <section className="nn-nclex-commercial-section" aria-labelledby="ecosystem-links-heading">
      <div className="nn-nclex-commercial-section__header">
        <p className="nn-nclex-commercial-eyebrow">NurseNest ecosystem</p>
        <h2 id="ecosystem-links-heading">Move from search intent into the right study surface</h2>
      </div>
      <div className="nn-nclex-commercial-link-grid">
        {landing.internalLinks.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href} className="nn-nclex-commercial-link-card">
            <strong>{link.label}</strong>
            <span>{link.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Faqs({ landing }: { landing: LandingPage }) {
  return (
    <section className="nn-nclex-commercial-section" aria-labelledby="faq-heading">
      <div className="nn-nclex-commercial-section__header">
        <p className="nn-nclex-commercial-eyebrow">FAQ</p>
        <h2 id="faq-heading">Common questions before choosing a study path</h2>
      </div>
      <div className="nn-nclex-commercial-faq">
        {landing.faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function NclexCommercialLandingPage({ slug }: { slug: string }) {
  const landing = getNclexCommercialLandingBySlug(slug);
  if (!landing || landing.status !== "published") notFound();

  const breadcrumbItems = [
    { name: "Home", item: absoluteUrl("/") },
    { name: "Nursing exam prep", item: absoluteUrl("/question-bank") },
    { name: landing.h1, item: absoluteUrl(landing.path) },
  ];
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Nursing exam prep", href: "/question-bank" },
    { name: landing.h1, href: landing.path },
  ];

  return (
    <main className="nn-nclex-commercial">
      <JsonLd value={buildNclexCommercialArticleJsonLd(landing)} />
      <JsonLd value={buildNclexCommercialFaqJsonLd(landing)} />

      <section className="nn-nclex-commercial-hero">
        <div className="nn-nclex-commercial-shell">
          <BreadcrumbBar crumbs={crumbs} schemaItems={breadcrumbItems} navClassName="nn-nclex-commercial-breadcrumb" />
          <div className="nn-nclex-commercial-hero__grid">
            <div className="nn-nclex-commercial-hero__copy">
              <p className="nn-nclex-commercial-eyebrow">{landing.eyebrow}</p>
              <h1>{landing.h1}</h1>
              <p>{landing.heroLead}</p>
              <div className="nn-nclex-commercial-hero__ctas" aria-label="Primary study actions">
                <CtaLink cta={landing.primaryCta} />
                <CtaLink cta={landing.secondaryCta} />
              </div>
              <div className="nn-nclex-commercial-audience" aria-label="Best for">
                {landing.audience.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <HeroPreview landing={landing} />
          </div>
        </div>
      </section>

      <div className="nn-nclex-commercial-shell nn-nclex-commercial-body">
        <section className="nn-nclex-commercial-section" aria-labelledby="why-heading">
          <div className="nn-nclex-commercial-section__header">
            <p className="nn-nclex-commercial-eyebrow">Why it matters</p>
            <h2 id="why-heading">Premium exam prep should feel clinically intelligent</h2>
            <p>
              These pages answer search intent while showing how NurseNest turns lessons, questions, CAT, flashcards, and progress tracking into one study loop.
            </p>
          </div>
          <div className="nn-nclex-commercial-diff-grid">
            {landing.differentiators.map((item) => (
              <article key={item}>
                <span aria-hidden="true" />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <StudyTimeline landing={landing} />

        <div className="nn-nclex-commercial-card-grid">
          {landing.sections.map((section) => (
            <SectionCard key={section.title} section={section} />
          ))}
        </div>

        <ComparisonMatrix landing={landing} />
        <InternalLinks landing={landing} />
        <Faqs landing={landing} />

        <section className="nn-nclex-commercial-final">
          <p className="nn-nclex-commercial-eyebrow">Next best step</p>
          <h2>Start with the study action that matches your current readiness</h2>
          <p>
            If you need content, begin with lessons. If you know the topic but miss decisions, use questions and rationales. If test-day uncertainty is the issue, rehearse with CAT.
          </p>
          <div className="nn-nclex-commercial-hero__ctas">
            <CtaLink cta={landing.primaryCta} />
            <CtaLink cta={landing.secondaryCta} />
          </div>
        </section>
      </div>

      <div className="nn-nclex-commercial-mobile-cta" aria-label="Sticky study action">
        <CtaLink cta={landing.primaryCta} />
      </div>
    </main>
  );
}
