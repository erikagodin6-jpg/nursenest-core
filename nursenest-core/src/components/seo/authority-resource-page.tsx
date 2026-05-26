import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { AuthorityResourcePage } from "@/lib/seo/authority-resource-pages";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

function absoluteUrl(path: string): string {
  return `${resolveCanonicalSiteOrigin()}${path}`;
}

const clusterLabels: Record<AuthorityResourcePage["cluster"], string> = {
  cnple: "CNPLE",
  "rex-pn": "REx-PN",
  "respiratory-therapy": "Respiratory therapy",
  ecg: "ECG interpretation",
};

export function AuthorityResourcePageView({ page }: { page: AuthorityResourcePage }) {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Resources", href: "/resources" },
    { name: page.h1 },
  ];
  const schemaItems = [
    { name: "Home", item: absoluteUrl("/") },
    { name: "Resources", item: absoluteUrl("/resources") },
    { name: page.h1, item: absoluteUrl(page.path) },
  ];
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": ["Article", "LearningResource"],
    headline: page.h1,
    description: page.description,
    url: absoluteUrl(page.path),
    learningResourceType: "Printable study aid",
    about: { "@type": "DefinedTerm", name: clusterLabels[page.cluster] },
    datePublished: "2026-05-12",
    dateModified: "2026-05-12",
    publisher: { "@type": "Organization", name: "NurseNest", url: resolveCanonicalSiteOrigin() },
    inLanguage: "en-CA",
  };

  return (
    <>
      <WebPageJsonLd title={page.title} description={page.description} path={page.path} inLanguage="en-CA" />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={[...page.faq]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="mx-auto max-w-5xl px-4 py-10 print:max-w-none print:px-0 print:py-0 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
        <header className="mt-6 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] px-6 py-8 print:border-[#1f2937] print:bg-white sm:px-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)] print:text-[#1f2937]">{page.eyebrow}</p>
          <h1 className="nn-marketing-h1 mt-3 text-balance">{page.h1}</h1>
          <p className="nn-marketing-lead mt-4 max-w-3xl text-[var(--theme-muted-text)] print:text-[#1f2937]">{page.lead}</p>
          <p className="mt-4 text-sm font-semibold text-[var(--theme-body-text)] print:text-[#1f2937]">
            Print-friendly: use your browser print dialog to save this page as a PDF.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Printable sections">
          {page.sections.map((section) => (
            <div key={section.heading} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 print:border-[#1f2937]">
              <h2 className="text-base font-bold text-[var(--theme-heading-text)]">{section.heading}</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--theme-body-text)]">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <div className="mt-10 overflow-x-auto rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] print:overflow-visible print:border-[#1f2937]">
          <table className="w-full min-w-[42rem] border-collapse text-sm text-[var(--theme-body-text)] print:min-w-0">
            <caption className="border-b border-[var(--semantic-border-soft)] px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)] print:border-[#1f2937]">
              {page.table.caption}
            </caption>
            <thead>
              <tr>
                {page.table.columns.map((column) => (
                  <th key={column} scope="col" className="border-b border-[var(--semantic-border-soft)] px-4 py-3 text-left text-xs font-bold uppercase text-[var(--theme-muted-text)] print:border-[#1f2937]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.table.rows.map((row) => (
                <tr key={row.join(":")} className="border-t border-[var(--semantic-border-soft)] print:border-[#1f2937]">
                  {row.map((cell, index) => (
                    <td key={cell} className={`px-4 py-3 align-top ${index === 0 ? "font-semibold text-[var(--theme-heading-text)]" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav className="mt-10 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 print:hidden" aria-label="Related authority pages">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Use this with active practice</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {page.internalLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={index === 0 ? "rounded-full bg-[var(--semantic-brand)] px-5 py-2.5 text-sm font-semibold text-white" : "rounded-full border border-[var(--semantic-border-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-body-text)]"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className="mt-10 print:hidden" aria-labelledby="resource-faq">
          <h2 id="resource-faq" className="nn-marketing-h2 border-b border-[var(--semantic-border-soft)] pb-3">Frequently asked questions</h2>
          <dl className="mt-6 space-y-4">
            {page.faq.map((item) => (
              <div key={item.question} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
                <dt className="font-semibold text-[var(--theme-heading-text)]">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </>
  );
}
