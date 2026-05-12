import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { AuthorityClusterPage } from "@/lib/seo/authority-cluster-pages";
import { listAuthorityClusterSiblings } from "@/lib/seo/authority-cluster-pages";

const clusterLabels: Record<AuthorityClusterPage["cluster"], string> = {
  cnple: "CNPLE",
  "rex-pn": "REx-PN",
  "respiratory-therapy": "Respiratory therapy",
};

function clusterBasePath(page: AuthorityClusterPage): string {
  if (page.cluster === "cnple") return "/canada/np/cnple";
  if (page.cluster === "rex-pn") return "/canada/rpn/rex-pn";
  return "/allied-health/respiratory-therapy";
}

export function AuthorityClusterPageView({ page }: { page: AuthorityClusterPage }) {
  const siblings = listAuthorityClusterSiblings(page);
  const siblingLinks = siblings.slice(0, 7);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: clusterLabels[page.cluster], href: clusterBasePath(page) },
    { name: page.h1 },
  ];
  const schemaItems = [
    { name: "Home", item: "/" },
    { name: clusterLabels[page.cluster], item: clusterBasePath(page) },
    { name: page.h1, item: page.path },
  ];

  return (
    <>
      <WebPageJsonLd title={page.title} description={page.description} path={page.path} inLanguage="en-CA" />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={[...page.faq]} />

      <article className="nn-marketing-surface mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />

        <header className="border-b border-[var(--theme-card-border)] pb-8">
          <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{page.eyebrow}</p>
          <h1 className="nn-marketing-h1 mt-2 text-balance">{page.h1}</h1>
          <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{page.lead}</p>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Exam terminology">
            {page.examTerms.map((term) => (
              <span
                key={term}
                className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-semibold text-[var(--theme-body-text)]"
              >
                {term}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {page.ctas.map((cta, index) => (
              <Link
                key={cta.href}
                href={cta.href}
                className={
                  index === 0
                    ? "inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                    : "inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-[var(--semantic-brand)]/40"
                }
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </header>

        <nav
          className="mt-8 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-5"
          aria-label={`${clusterLabels[page.cluster]} related authority pages`}
        >
          <h2 className="text-lg font-semibold text-[var(--theme-body-text)]">Related {clusterLabels[page.cluster]} guides</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {siblingLinks.map((item) => (
              <li key={item.path}>
                <Link className="text-sm font-semibold text-primary underline-offset-4 hover:underline" href={item.path}>
                  {item.h1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 overflow-x-auto rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] shadow-sm">
          <table className="w-full min-w-[min(100%,42rem)] border-collapse text-sm text-[var(--theme-body-text)]">
            <caption className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--theme-card-bg))] px-4 py-3 text-left font-semibold">
              {page.table.caption}
            </caption>
            <thead>
              <tr className="border-b border-[var(--semantic-border-soft)]">
                {page.table.columns.map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 text-left font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.table.rows.map((row, rowIndex) => (
                <tr key={row.join(":")} className={rowIndex % 2 === 0 ? "bg-[color-mix(in_srgb,var(--semantic-chart-4)_8%,var(--theme-card-bg))]" : undefined}>
                  {row.map((cell) => (
                    <td key={cell} className="border-t border-[var(--semantic-border-soft)] px-4 py-3 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="nn-marketing-body mt-10 space-y-10">
          {page.sections.map((section) => (
            <section key={section.heading} aria-labelledby={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
              <h2 id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="nn-marketing-h2">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section aria-labelledby="common-mistakes">
            <h2 id="common-mistakes" className="nn-marketing-h2">
              Common mistakes to avoid
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {page.mistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="exam-day">
            <h2 id="exam-day" className="nn-marketing-h2">
              What to expect on exam day
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {page.examDay.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faq">
            <h2 id="faq" className="nn-marketing-h2">
              Frequently asked questions
            </h2>
            <div className="mt-5 space-y-5">
              {page.faq.map((item) => (
                <div key={item.question}>
                  <h3 className="text-base font-semibold text-[var(--theme-body-text)]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]/85">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
