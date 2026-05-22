import Link from "next/link";
import { BreadcrumbsFromResolution } from "@/components/navigation/breadcrumbs";
import { resolveDiscoveryBreadcrumbResolution } from "@/lib/breadcrumbs/discovery-breadcrumb-governance";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { ExamPrepCourseProgramJsonLd, WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { listAuthorityComparisonPages } from "@/lib/seo/authority-comparison-pages";
import type { AuthorityClusterPage } from "@/lib/seo/authority-cluster-pages";
import { listAuthorityClusterSiblings } from "@/lib/seo/authority-cluster-pages";
import { listAuthorityResourcePages } from "@/lib/seo/authority-resource-pages";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

const clusterLabels: Record<AuthorityClusterPage["cluster"], string> = {
  cnple: "CNPLE",
  "rex-pn": "REx-PN",
  "respiratory-therapy": "Respiratory therapy",
  "ca-rn": "NCLEX-RN (Canada)",
  "np-fnp": "FNP",
  "np-agpcnp": "AGPCNP",
  "np-pmhnp": "PMHNP",
  "np-whnp": "WHNP",
  "np-pnp-pc": "PNP-PC",
};

function clusterBasePath(page: AuthorityClusterPage): string {
  if (page.cluster === "cnple") return "/canada/np/cnple";
  if (page.cluster === "rex-pn") return "/canada/pn/rex-pn";
  if (page.cluster === "ca-rn") return "/canada/rn/nclex-rn";
  if (page.cluster === "np-fnp") return "/np-specialty/fnp";
  if (page.cluster === "np-agpcnp") return "/np-specialty/agpcnp";
  if (page.cluster === "np-pmhnp") return "/np-specialty/pmhnp";
  if (page.cluster === "np-whnp") return "/np-specialty/whnp";
  if (page.cluster === "np-pnp-pc") return "/np-specialty/pnp-pc";
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

function relatedAssetLinks(page: AuthorityClusterPage) {
  const resources = listAuthorityResourcePages();
  return resources.filter((asset) => {
    if (page.cluster === "cnple") return asset.cluster === "cnple" || asset.slug === "pharmacology-mnemonic-sheet";
    if (page.cluster === "rex-pn") return asset.cluster === "rex-pn" || asset.slug === "pharmacology-mnemonic-sheet";
    if (page.cluster === "ca-rn") return asset.slug === "pharmacology-mnemonic-sheet";
    if (page.cluster.startsWith("np-")) return asset.slug === "pharmacology-mnemonic-sheet";
    return asset.cluster === "respiratory-therapy" || asset.cluster === "ecg";
  });
}

function relatedComparisonLinks(page: AuthorityClusterPage) {
  const comparisons = listAuthorityComparisonPages();
  return comparisons.filter((comparison) => {
    if (page.cluster === "cnple") return comparison.slug.includes("cnple") || comparison.slug.startsWith("nursenest-vs");
    if (page.cluster === "rex-pn") return comparison.slug.includes("rex-pn") || comparison.slug.startsWith("nursenest-vs");
    if (page.cluster === "ca-rn" || page.cluster.startsWith("np-")) return comparison.slug.startsWith("nursenest-vs");
    return comparison.slug.startsWith("nursenest-vs");
  });
}

function VisualAuthorityPanel({ page }: { page: AuthorityClusterPage }) {
  if (page.cluster !== "respiratory-therapy") return null;

  const rows =
    page.slug.includes("abg") || page.slug === "abgs"
      ? [
          ["Respiratory acidosis", "pH down, PaCO2 up", "Assess ventilation, mental status, airway protection, and need for ventilatory support."],
          ["Respiratory alkalosis", "pH up, PaCO2 down", "Look for hyperventilation drivers such as pain, anxiety, hypoxemia, sepsis, or over-ventilation."],
          ["Metabolic acidosis", "pH down, HCO3 down", "Connect to shock, DKA, renal failure, lactic acidosis, and compensation status."],
        ]
      : page.slug.includes("vent")
        ? [
            ["Volume control", "Set tidal volume; pressure varies", "Watch high pressure, plateau pressure, compliance, and obstruction."],
            ["Pressure control", "Set pressure; tidal volume varies", "Watch delivered volume, minute ventilation, and worsening compliance."],
            ["Pressure support", "Patient-triggered support", "Watch apnea, fatigue, synchrony, and weaning readiness."],
          ]
        : [
            ["Nasal cannula", "Low-flow oxygen", "Mild hypoxemia with stable work of breathing."],
            ["Venturi mask", "Fixed FiO2", "COPD or when controlled oxygen delivery matters."],
            ["Non-rebreather", "High FiO2", "Severe hypoxemia while preparing escalation or definitive support."],
          ];

  return (
    <section
      className="mt-10 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))] p-6"
      aria-labelledby="visual-authority"
    >
      <h2 id="visual-authority" className="text-base font-bold text-[var(--theme-heading-text)]">
        Quick clinical reference
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--semantic-border-soft)]">
              <th scope="col" className="px-3 py-2 text-left text-xs font-bold uppercase text-[var(--theme-muted-text)]">Pattern</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-bold uppercase text-[var(--theme-muted-text)]">Signal</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-bold uppercase text-[var(--theme-muted-text)]">Decision focus</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-[var(--semantic-border-soft)]">
                {row.map((cell, index) => (
                  <td key={cell} className={`px-3 py-3 align-top text-[var(--theme-body-text)] ${index === 0 ? "font-semibold text-[var(--theme-heading-text)]" : ""}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AuthorityClusterPageView({ page }: { page: AuthorityClusterPage }) {
  const siblings = listAuthorityClusterSiblings(page);
  const siblingLinks = siblings.slice(0, 7);
  const assetLinks = relatedAssetLinks(page).slice(0, 4);
  const comparisonLinks = relatedComparisonLinks(page).slice(0, 4);
  const breadcrumbResolution = resolveDiscoveryBreadcrumbResolution({
    hubLabel: clusterLabels[page.cluster],
    hubPath: clusterBasePath(page),
    leafLabel: page.h1,
    leafPath: page.path,
    pathname: page.path,
  });

  return (
    <>
      <WebPageJsonLd title={page.title} description={page.description} path={page.path} inLanguage="en-CA" />
      <ExamPrepCourseProgramJsonLd
        path={page.path}
        name={page.h1}
        description={page.description}
        teaches={page.examTerms}
        occupationalCredential={
          page.cluster === "ca-rn"
            ? "NCLEX-RN (Canada)"
            : page.cluster === "rex-pn"
              ? "REx-PN"
              : page.cluster === "cnple"
                ? "CNPLE"
                : undefined
        }
      />
      <FaqJsonLd items={[...page.faq]} />
      <ArticleJsonLd page={page} />

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbsFromResolution
          resolution={breadcrumbResolution}
          pathname={page.path}
          navClassName="nn-marketing-caption text-[var(--theme-muted-text)]"
        />

        {/* ── CAT product CTA — only for authority pages that own a /cat URL ── */}
        {page.slug === "cat" ? (
          <section
            className="nn-cat-authority-cta mt-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-6"
            aria-label="Start or sign in to practise"
            data-nn-qa-cat-authority-cta="true"
          >
            <h2 className="text-base font-bold text-[var(--theme-heading-text)]">
              Practice with adaptive questions
            </h2>
            <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
              Sign in to launch an adaptive exam session or browse lessons and practice questions first.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(page.path)}`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:opacity-90"
                data-nn-qa-cat-authority-signin="true"
              >
                Sign In to Start
              </Link>
              {page.ctas
                .filter((c) => c.href !== page.path)
                .slice(0, 2)
                .map((cta) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-[14px] font-semibold text-[var(--theme-body-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
                  >
                    {cta.label}
                  </Link>
                ))}
            </div>
          </section>
        ) : null}

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

        <VisualAuthorityPanel page={page} />

        <section
          className="mt-10 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6"
          aria-labelledby="related-study-system"
        >
          <h2 id="related-study-system" className="text-base font-bold text-[var(--theme-heading-text)]">
            Related study system
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Downloadable and printable assets</h3>
              <ul className="mt-3 space-y-2">
                {assetLinks.map((asset) => (
                  <li key={asset.path}>
                    <Link className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline" href={asset.path}>
                      {asset.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Comparisons and buying guides</h3>
              <ul className="mt-3 space-y-2">
                {comparisonLinks.map((comparison) => (
                  <li key={comparison.path}>
                    <Link className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline" href={comparison.path}>
                      {comparison.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

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
