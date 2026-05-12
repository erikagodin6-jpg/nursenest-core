import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { AuthorityClusterPage } from "@/lib/seo/authority-cluster-pages";
import { listAuthorityClusterSiblings } from "@/lib/seo/authority-cluster-pages";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

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

function absoluteUrl(path: string): string {
  return `${resolveCanonicalSiteOrigin()}${path}`;
}

function ArticleJsonLd({ page }: { page: AuthorityClusterPage }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    url: absoluteUrl(page.path),
    datePublished: page.datePublished ?? "2026-01-15",
    dateModified: page.dateModified ?? "2026-05-12",
    author: {
      "@type": "Organization",
      name: "NurseNest",
      url: resolveCanonicalSiteOrigin(),
    },
    publisher: {
      "@type": "Organization",
      name: "NurseNest",
      url: resolveCanonicalSiteOrigin(),
    },
    inLanguage: "en-CA",
    about: page.examTerms.map((term) => ({ "@type": "DefinedTerm", name: term })),
    educationalLevel: "Professional",
    teaches: page.whatYoullLearn,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
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
    { name: "Home", item: absoluteUrl("/") },
    { name: clusterLabels[page.cluster], item: absoluteUrl(clusterBasePath(page)) },
    { name: page.h1, item: absoluteUrl(page.path) },
  ];

  return (
    <>
      <WebPageJsonLd title={page.title} description={page.description} path={page.path} inLanguage="en-CA" />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={[...page.faq]} />
      <ArticleJsonLd page={page} />

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />

        {/* ── Premium hero ─────────────────────────────────────────────────── */}
        <header className="mt-6 overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
            {page.eyebrow}
          </p>
          <h1 className="nn-marketing-h1 mt-3 text-balance">{page.h1}</h1>
          <p className="nn-marketing-lead mt-4 max-w-2xl text-[var(--theme-muted-text)]">{page.lead}</p>

          {/* Exam terms */}
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Exam terminology">
            {page.examTerms.map((term) => (
              <span
                key={term}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_25%,transparent)] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] px-3 py-1 text-[11px] font-semibold text-[var(--semantic-brand)]"
              >
                {term}
              </span>
            ))}
          </div>

          {/* Primary CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            {page.ctas.map((cta, index) => (
              <Link
                key={cta.href}
                href={cta.href}
                className={
                  index === 0
                    ? "inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:opacity-90"
                    : "inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-[14px] font-semibold text-[var(--theme-body-text)] transition hover:border-[var(--semantic-brand)]/40"
                }
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </header>

        {/* ── What you'll learn ─────────────────────────────────────────────── */}
        {page.whatYoullLearn && page.whatYoullLearn.length > 0 ? (
          <section
            className="mt-8 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6"
            aria-labelledby="what-youll-learn"
          >
            <h2 id="what-youll-learn" className="text-base font-bold text-[var(--theme-heading-text)]">
              What you will learn on this page
            </h2>
            <ul className="mt-4 space-y-2">
              {page.whatYoullLearn.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--theme-body-text)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[10px] font-bold text-[var(--semantic-brand)]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ── Sibling navigation ────────────────────────────────────────────── */}
        <nav
          className="mt-8 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5"
          aria-label={`${clusterLabels[page.cluster]} related authority pages`}
        >
          <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">
            More {clusterLabels[page.cluster]} guides
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {siblingLinks.map((item) => (
              <li key={item.path}>
                <Link
                  className="text-[13px] font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                  href={item.path}
                >
                  {item.h1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Who this is for ───────────────────────────────────────────────── */}
        {page.whoThisIsFor ? (
          <section
            className="mt-8 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))] p-5"
            aria-labelledby="who-this-is-for"
          >
            <h2 id="who-this-is-for" className="text-sm font-bold text-[var(--theme-heading-text)]">
              Who this guide is for
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{page.whoThisIsFor}</p>
          </section>
        ) : null}

        {/* ── Comparison table ─────────────────────────────────────────────── */}
        <div className="mt-10 overflow-x-auto rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] shadow-sm">
          <table className="w-full min-w-[min(100%,40rem)] border-collapse text-sm text-[var(--theme-body-text)]">
            <caption className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">
              {page.table.caption}
            </caption>
            <thead>
              <tr className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))]">
                {page.table.columns.map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.table.rows.map((row, rowIndex) => (
                <tr
                  key={row.join(":")}
                  className={rowIndex % 2 === 0 ? "" : "bg-[color-mix(in_srgb,var(--semantic-brand)_3%,var(--semantic-surface))]"}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cell}
                      className={`border-t border-[var(--semantic-border-soft)] px-4 py-3 align-top ${cellIndex === 0 ? "font-semibold text-[var(--theme-heading-text)]" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Body sections ─────────────────────────────────────────────────── */}
        <div className="mt-10 space-y-10">
          {page.sections.map((section) => {
            const sectionId = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <section key={section.heading} aria-labelledby={sectionId}>
                <h2 id={sectionId} className="nn-marketing-h2 border-b border-[var(--semantic-border-soft)] pb-3">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-[15px] leading-relaxed text-[var(--theme-body-text)]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* ── High-yield exam tips ──────────────────────────────────────────── */}
        {page.highYieldTips && page.highYieldTips.length > 0 ? (
          <section
            className="mt-10 rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_5%,var(--semantic-surface))] p-6"
            aria-labelledby="high-yield-tips"
          >
            <h2 id="high-yield-tips" className="text-base font-bold text-[var(--theme-heading-text)]">
              High-yield exam tips
            </h2>
            <ul className="mt-4 space-y-3">
              {page.highYieldTips.map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-[var(--theme-body-text)]">
                  <span className="mt-0.5 text-base">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ── Recommended study order ───────────────────────────────────────── */}
        {page.studyOrder && page.studyOrder.length > 0 ? (
          <section className="mt-10" aria-labelledby="study-order">
            <h2 id="study-order" className="nn-marketing-h2 border-b border-[var(--semantic-border-soft)] pb-3">
              Recommended study order
            </h2>
            <ol className="mt-5 space-y-3">
              {page.studyOrder.map((step, index) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--semantic-brand)] text-[12px] font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-[15px] leading-relaxed text-[var(--theme-body-text)]">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* ── Common mistakes ───────────────────────────────────────────────── */}
        <section className="mt-10" aria-labelledby="common-mistakes">
          <h2 id="common-mistakes" className="nn-marketing-h2 border-b border-[var(--semantic-border-soft)] pb-3">
            Common mistakes to avoid
          </h2>
          <ul className="mt-5 space-y-3">
            {page.mistakes.map((mistake) => (
              <li key={mistake} className="flex items-start gap-3 text-[15px] text-[var(--theme-body-text)]">
                <span className="mt-0.5 text-base">⚠️</span>
                {mistake}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Exam day ─────────────────────────────────────────────────────── */}
        <section className="mt-10" aria-labelledby="exam-day">
          <h2 id="exam-day" className="nn-marketing-h2 border-b border-[var(--semantic-border-soft)] pb-3">
            What to expect on exam day
          </h2>
          <ul className="mt-5 space-y-3">
            {page.examDay.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-[var(--theme-body-text)]">
                <span className="mt-0.5 text-base">📋</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="mt-10" aria-labelledby="faq">
          <h2 id="faq" className="nn-marketing-h2 border-b border-[var(--semantic-border-soft)] pb-3">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6">
            {page.faq.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5"
              >
                <dt className="text-base font-semibold text-[var(--theme-heading-text)]">{item.question}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-[var(--theme-body-text)]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Next steps CTA ───────────────────────────────────────────────── */}
        {page.nextSteps && page.nextSteps.length > 0 ? (
          <aside
            className="mt-12 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Continue your preparation</p>
            <p className="mt-2 text-[14px] text-[var(--theme-muted-text)]">
              Move from reading to active practice — the fastest way to build exam-ready reasoning.
            </p>
            <nav className="mt-5 flex flex-wrap gap-3" aria-label="Next steps">
              {page.nextSteps.map((step, index) => (
                <Link
                  key={step.href}
                  href={step.href}
                  className="rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors"
                  style={
                    index === 0
                      ? { background: "var(--semantic-brand)", color: "#fff" }
                      : {
                          background: "var(--semantic-surface)",
                          color: "var(--semantic-text-secondary)",
                          border: "1px solid var(--semantic-border-soft)",
                        }
                  }
                >
                  {step.label}
                </Link>
              ))}
            </nav>
          </aside>
        ) : null}
      </article>
    </>
  );
}
