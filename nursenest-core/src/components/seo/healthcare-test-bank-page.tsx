import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { HealthcareTestBankPageConfig, HealthcareTestBankPageLink } from "@/lib/seo/healthcare-test-bank-pages";
import { getHealthcareTestBankPageByPath } from "@/lib/seo/healthcare-test-bank-pages";
import { absoluteUrl } from "@/lib/seo/site-origin";

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function courseJsonLd(page: HealthcareTestBankPageConfig): Record<string, unknown> {
  const url = absoluteUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@type": "EducationalCourse",
    "@id": `${url}#course`,
    name: page.courseName,
    description: page.courseDescription,
    url,
    provider: {
      "@type": "Organization",
      name: "NurseNest",
      url: absoluteUrl("/"),
    },
    educationalLevel: "Healthcare licensing exam preparation",
    teaches: [page.primaryKeyword, ...page.secondaryKeywords],
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "Self-paced practice questions, flashcards, lessons, and remediation",
    },
  };
}

export function metadataForHealthcareTestBankPage(path: string): Metadata {
  const page = getHealthcareTestBankPageByPath(path);
  if (!page) {
    return {
      robots: { index: false, follow: true },
    };
  }
  const canonical = absoluteUrl(page.path);
  return {
    // `absolute` bypasses the root layout template: "%s | NurseNest" — title already
    // includes the brand suffix, so we must not apply the template again.
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      type: "website",
    },
  };
}

function CtaLink({ link, variant }: { link: HealthcareTestBankPageLink; variant: "primary" | "secondary" }) {
  const classes =
    variant === "primary"
      ? "inline-flex min-h-[46px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
      : "inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]";
  return (
    <Link href={link.href} className={classes}>
      {link.label}
    </Link>
  );
}

export function HealthcareTestBankPage({ page }: { page: HealthcareTestBankPageConfig }) {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Exam prep", path: page.links.questions.href.replace(/\/questions$/, "") },
    { name: "Test bank", path: page.path },
  ];
  const visibleBreadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Exam prep", href: page.links.questions.href.replace(/\/questions$/, "") },
    { name: "Test bank", href: page.path },
  ];
  const allLinks = [
    page.links.questions,
    page.links.cat,
    page.links.flashcards,
    page.links.lessons,
    page.links.pricing,
  ];

  return (
    <>
      <WebPageJsonLd title={page.title} description={page.description} path={page.path} inLanguage="en" />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FaqJsonLd items={[...page.faqs]} />
      <JsonLdScript data={courseJsonLd(page)} />

      <main className="mx-auto max-w-5xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
        <BreadcrumbTrail items={visibleBreadcrumbs} />

        <article className="nn-marketing-body">
          <p className="nn-marketing-eyebrow mt-8 text-[var(--semantic-text-muted)]">{page.eyebrow}</p>
          <h1 className="nn-marketing-h1 mt-2 max-w-4xl text-balance">{page.h1}</h1>
          <p className="nn-marketing-lead mt-4 max-w-3xl text-[var(--theme-muted-text)]">{page.lead}</p>

          <section
            className="mt-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-5 sm:p-6"
            aria-label="Test bank access"
          >
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Practice with the full study loop</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">
                  {page.inventoryClaim} Source: {page.inventorySource}. Counts are only shown where NurseNest has
                  committed inventory data; unsupported official exam counts are not inferred.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <CtaLink link={page.premiumCta} variant="primary" />
                <CtaLink link={page.freePracticeCta} variant="secondary" />
              </div>
            </div>
          </section>

          <section className="mt-10" aria-labelledby="test-bank-positioning">
            <h2 id="test-bank-positioning" className="nn-marketing-h2">
              Why this test bank is pathway-specific
            </h2>
            <p className="mt-4">{page.examSpecificPositioning}</p>
          </section>

          <section className="mt-10" aria-labelledby="study-surface-links">
            <h2 id="study-surface-links" className="nn-marketing-h2">
              Linked study surfaces
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_36%,transparent)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))]"
                >
                  <span className="block text-sm font-bold text-[var(--theme-heading-text)]">{link.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--theme-muted-text)]">{link.note}</span>
                </Link>
              ))}
            </div>
          </section>

          {page.sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="nn-marketing-h2">{section.heading}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="mt-12 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6">
            <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Start with questions, then close the gap</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">
              The premium path combines question attempts, rationales, lessons, flashcards, and exam-format practice
              so weak-area remediation is visible instead of scattered across separate tools.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <CtaLink link={page.premiumCta} variant="primary" />
              <CtaLink link={page.freePracticeCta} variant="secondary" />
            </div>
          </section>

          <section className="mt-12" aria-labelledby="test-bank-faq">
            <h2 id="test-bank-faq" className="nn-marketing-h2">
              Frequently asked questions
            </h2>
            <div className="mt-5 divide-y divide-[var(--semantic-border-soft)] rounded-xl border border-[var(--semantic-border-soft)]">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="p-4 sm:p-5">
                  <h3 className="font-semibold text-[var(--theme-heading-text)]">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
