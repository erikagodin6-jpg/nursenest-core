import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { AuthorityComparisonPage } from "@/lib/seo/authority-comparison-pages";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

function absoluteUrl(path: string): string {
  return `${resolveCanonicalSiteOrigin()}${path}`;
}

function ArticleJsonLd({ page }: { page: AuthorityComparisonPage }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: page.h1,
          description: page.description,
          url: absoluteUrl(page.path),
          datePublished: "2026-05-12",
          dateModified: "2026-05-12",
          author: { "@type": "Organization", name: "NurseNest", url: resolveCanonicalSiteOrigin() },
          publisher: { "@type": "Organization", name: "NurseNest", url: resolveCanonicalSiteOrigin() },
          inLanguage: "en-CA",
        }),
      }}
    />
  );
}

export function AuthorityComparisonPageView({ page }: { page: AuthorityComparisonPage }) {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Compare", href: "/compare" },
    { name: page.h1 },
  ];
  const schemaItems = [
    { name: "Home", item: absoluteUrl("/") },
    { name: "Compare", item: absoluteUrl("/compare") },
    { name: page.h1, item: absoluteUrl(page.path) },
  ];

  return (
    <>
      <WebPageJsonLd title={page.title} description={page.description} path={page.path} inLanguage="en-CA" />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={[...page.faq]} />
      <ArticleJsonLd page={page} />

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
        <header className="mt-6 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] px-6 py-8 sm:px-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">{page.eyebrow}</p>
          <h1 className="nn-marketing-h1 mt-3 text-balance">{page.h1}</h1>
          <p className="nn-marketing-lead mt-4 max-w-3xl text-[var(--theme-muted-text)]">{page.lead}</p>
        </header>

        <div className="mt-10 overflow-x-auto rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-sm">
          <table className="w-full min-w-[42rem] border-collapse text-sm text-[var(--theme-body-text)]">
            <caption className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">
              {page.comparison.caption}
            </caption>
            <thead>
              <tr>
                {page.comparison.columns.map((column) => (
                  <th key={column} scope="col" className="border-b border-[var(--semantic-border-soft)] px-4 py-3 text-left text-xs font-bold uppercase text-[var(--theme-muted-text)]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.comparison.rows.map((row) => (
                <tr key={row.join(":")} className="border-t border-[var(--semantic-border-soft)]">
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

        <section className="mt-10 grid gap-4 md:grid-cols-2" aria-label="Best fit guidance">
          {page.bestFor.map((item) => (
            <div key={item.label} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
              <h2 className="text-base font-bold text-[var(--theme-heading-text)]">{item.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))] p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Balanced comparison notes</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--theme-body-text)]">
            {page.balancedNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <nav className="mt-10 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6" aria-label="Related authority pages">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Continue comparing with active practice</h2>
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

        <section className="mt-10" aria-labelledby="comparison-faq">
          <h2 id="comparison-faq" className="nn-marketing-h2 border-b border-[var(--semantic-border-soft)] pb-3">Frequently asked questions</h2>
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
