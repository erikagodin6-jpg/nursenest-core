import Link from "next/link";
import { Fragment } from "react";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { BreadcrumbResolution } from "@/lib/seo/breadcrumb-types";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import { buildProgrammaticSeoBreadcrumbResolution } from "@/lib/seo/programmatic-breadcrumbs";
import { getProgrammaticPracticeConversionConfig } from "@/lib/seo/programmatic-practice-config";
import { ProgrammaticPageJsonLd } from "@/components/seo/seo-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ProgrammaticPracticeConversionBlocks } from "@/components/seo/programmatic-practice-conversion-blocks";
import { ProgrammaticPracticeHeroActions } from "@/components/seo/programmatic-practice-hero-actions";
import { ProgrammaticPracticeDynamicHeader } from "@/components/seo/programmatic-practice-dynamic-header";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { resolveProgrammaticProductLinks } from "@/lib/seo/programmatic-page-links";
import { ProgrammaticStudyHubBlock } from "@/components/seo/programmatic-study-hub-block";
import { ProgrammaticFinalFunnelCta, ProgrammaticMidPagePracticeCta } from "@/components/seo/programmatic-funnel-ctas";
import { isUnifiedPracticeSlug } from "@/lib/seo/programmatic-practice-hub";
import { NpMarketingProductDiscovery } from "@/components/marketing/np-marketing-product-discovery";
import { ProgrammaticStudyModesHub } from "@/components/seo/programmatic-study-modes-hub";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";

export async function ProgrammaticSeoPage({
  page,
  locale,
  related,
  cross,
  marketingRegion = "US",
  /** True when rendered from `/[locale]/[slug]` (prefix belongs in URLs). False on cookie-localized `(default)` routes. */
  localizedUrl = false,
  breadcrumbResolution,
  jsonLdResourcePath,
  pathwayForProductLinks,
}: {
  page: SeoPageDefinition;
  locale: string;
  related: { slug: string; title: string }[];
  cross: { slug: string; label: string }[];
  /** Canada/US exam toggle (cookie on `(default)` routes). */
  marketingRegion?: MarketingRegionToggle;
  localizedUrl?: boolean;
  /** When set (hub long-tail pages), overrides flat programmatic breadcrumbs. */
  breadcrumbResolution?: BreadcrumbResolution;
  /** English-default path for JSON-LD `url` when not `/{slug}`. Leading slash. */
  jsonLdResourcePath?: string;
  pathwayForProductLinks?: ExamPathwayDefinition | null;
}) {
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string) => formatMarketingMessage(m, key, undefined, en);

  const signup = withMarketingLocale(locale, "/signup");
  const pricing = withMarketingLocale(locale, HUB.pricing);
  const loginToApp = withMarketingLocale(locale, `/login?callbackUrl=${encodeURIComponent("/app")}`);
  const product = resolveProgrammaticProductLinks(page, locale, marketingRegion, pathwayForProductLinks);
  const { lessons, questions, cat, testBank, exams, tools, flashcards } = product;

  const pathForProgrammatic = (slug: string) =>
    localizedUrl && locale !== DEFAULT_MARKETING_LOCALE ? `/${locale}/${slug}` : `/${slug}`;

  const { crumbs, schemaItems } =
    breadcrumbResolution ??
    buildProgrammaticSeoBreadcrumbResolution(page, locale, {
      localized: localizedUrl,
    });
  const practiceConfig = getProgrammaticPracticeConversionConfig(page.slug);
  const introLead =
    locale !== DEFAULT_MARKETING_LOCALE
      ? page.description
      : (practiceConfig?.valueLead ?? page.description);

  return (
    <>
      <ProgrammaticPageJsonLd page={page} locale={locale} resourcePath={jsonLdResourcePath} />
      <BreadcrumbJsonLd items={schemaItems} />
      <article className="nn-marketing-surface mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />

        <ProgrammaticStudyHubBlock
          lessonsHref={lessons}
          questionsHref={questions}
          catHref={cat}
          signupHref={signup}
          loginHref={loginToApp}
          pricingHref={pricing}
          t={t}
        />

        {page.practiceConversion && isUnifiedPracticeSlug(page.slug) ? (
          <ProgrammaticStudyModesHub slug={page.slug} locale={locale} />
        ) : null}

        <header className="mb-10 border-b border-[var(--theme-card-border)] pb-8">
          <p className="text-sm font-medium text-primary">{t("programmatic.chrome.kicker")}</p>
          {page.practiceConversion && isUnifiedPracticeSlug(page.slug) ? (
            <ProgrammaticPracticeDynamicHeader
              slug={page.slug}
              locale={locale}
              fallbackTitle={page.h1}
              fallbackLead={introLead}
            />
          ) : (
            <>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-body-text)] sm:text-4xl">{page.h1}</h1>
              <p className="mt-4 text-lg leading-relaxed text-[var(--theme-body-text)]/90">{introLead}</p>
            </>
          )}
          <p className="mt-3 text-sm font-medium text-[var(--theme-body-text)]/85">{t("programmatic.chrome.subLead")}</p>
          <nav className="mt-3 text-sm text-primary" aria-label={t("programmatic.chrome.relatedHubsAria")}>
            <Link href={withMarketingLocale(locale, "/lessons")} className="underline-offset-4 hover:underline">
              {t("programmatic.nav.examLessons")}
            </Link>
            <span className="mx-2 text-[var(--theme-body-text)]/40" aria-hidden>
              ·
            </span>
            <Link href={withMarketingLocale(locale, "/blog")} className="underline-offset-4 hover:underline">
              {t("programmatic.nav.blog")}
            </Link>
            <span className="mx-2 text-[var(--theme-body-text)]/40" aria-hidden>
              ·
            </span>
            <Link href={withMarketingLocale(locale, "/tools")} className="underline-offset-4 hover:underline">
              {t("programmatic.nav.tools")}
            </Link>
          </nav>

          {page.practiceConversion && practiceConfig ? (
            <div className="mt-8 space-y-6">
              <ProgrammaticPracticeHeroActions locale={locale} slug={page.slug} />
              <div className="flex flex-wrap gap-3">
                <Link
                  href={signup}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
                >
                  {t("programmatic.cta.createFreeAccount")}
                </Link>
                <Link
                  href={pricing}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
                >
                  {t("programmatic.cta.comparePlans")}
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={signup}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)] transition hover:bg-role-cta-hover"
              >
                {t("programmatic.cta.startFreeCreateAccount")}
              </Link>
              <Link
                href={pricing}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
              >
                {t("programmatic.cta.viewPlans")}
              </Link>
              <Link
                href={questions}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                {t("programmatic.cta.startPracticeQuestions")}
              </Link>
            </div>
          )}
        </header>

        <NpMarketingProductDiscovery marketingRegion={marketingRegion} slug={page.slug} />

        {practiceConfig && page.practiceConversion ? (
          <ProgrammaticPracticeConversionBlocks slug={page.slug} locale={locale} config={practiceConfig} />
        ) : null}

        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:text-[var(--theme-body-text)] prose-p:text-[var(--theme-body-text)]/90 prose-li:text-[var(--theme-body-text)]/90">
          {page.sections.map((section, idx) => {
            const Tag = section.level === 2 ? "h2" : "h3";
            const table = page.comparisonTable;
            return (
              <Fragment key={idx}>
                <section className="mb-10">
                  <Tag className="mb-3 text-xl font-semibold sm:text-2xl">{section.heading}</Tag>
                  {section.body.map((para, j) => (
                    <p key={j} className="mb-3 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </section>
                {idx === 0 && table ? (
                  <div className="not-prose mb-10 overflow-x-auto rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] shadow-sm">
                    <table className="w-full min-w-[min(100%,36rem)] border-collapse text-sm text-[var(--theme-body-text)]">
                      {table.caption ? (
                        <caption className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--theme-card-bg))] px-4 py-3 text-left font-semibold text-[var(--theme-body-text)]">
                          {table.caption}
                        </caption>
                      ) : null}
                      <thead>
                        <tr className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-2)_14%,var(--theme-card-bg))]">
                          {table.columns.map((col, c) => (
                            <th
                              key={c}
                              scope="col"
                              className="px-3 py-2.5 text-left font-semibold first:rounded-tl-xl last:rounded-tr-xl sm:px-4"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, r) => (
                          <tr
                            key={r}
                            className={
                              r % 2 === 0
                                ? "bg-[color-mix(in_srgb,var(--semantic-chart-4)_8%,var(--theme-card-bg))]"
                                : "bg-[color-mix(in_srgb,var(--semantic-chart-5)_10%,var(--theme-card-bg))]"
                            }
                          >
                            {row.map((cell, c) => (
                              <td
                                key={c}
                                className="border-t border-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-border-soft))] px-3 py-2.5 align-top sm:px-4"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
                {idx === 0 ? (
                  <ProgrammaticMidPagePracticeCta questionsHref={questions} pricingHref={pricing} signupHref={signup} t={t} />
                ) : null}
              </Fragment>
            );
          })}
        </div>

        {page.faq?.length ? (
          <section className="mt-12 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--theme-body-text)]">{t("programmatic.faq.heading")}</h2>
            <ul className="mt-6 space-y-6">
              {page.faq.map((item, i) => (
                <li key={i}>
                  <h3 className="text-base font-semibold text-[var(--theme-body-text)]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]/85">{item.answer}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <ProgrammaticFinalFunnelCta questionsHref={questions} signupHref={signup} pricingHref={pricing} t={t} />

        <section className="mt-10 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-[var(--theme-body-text)]">{t("programmatic.studyInside.moreHeading")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]/85">{t("programmatic.studyInside.moreBody")}</p>
          <ul className="mt-5 flex flex-col gap-2 text-sm font-medium text-primary sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <li>
              <Link href={lessons} className="underline-offset-4 hover:underline">
                {t("programmatic.studyInside.linkExamLessons")}
              </Link>
            </li>
            <li>
              <Link href={questions} className="underline-offset-4 hover:underline">
                {t("programmatic.studyInside.linkPracticeQuestions")}
              </Link>
            </li>
            <li>
              <Link href={cat} className="underline-offset-4 hover:underline">
                {t("programmatic.studyInside.linkCat")}
              </Link>
            </li>
            <li>
              <Link href={testBank} className="underline-offset-4 hover:underline">
                {t("programmatic.studyInside.linkTestBank")}
              </Link>
            </li>
            <li>
              <Link href={exams} className="underline-offset-4 hover:underline">
                {t("programmatic.studyInside.linkExams")}
              </Link>
            </li>
            <li>
              <Link href={tools} className="underline-offset-4 hover:underline">
                {t("programmatic.studyInside.linkTools")}
              </Link>
            </li>
            <li>
              <Link href={flashcards} className="underline-offset-4 hover:underline">
                {t("programmatic.studyInside.linkFlashcards")}
              </Link>
            </li>
            <li>
              <Link href={pricing} className="underline-offset-4 hover:underline">
                {t("programmatic.studyInside.linkPricing")}
              </Link>
            </li>
            <li>
              <Link href={signup} className="underline-offset-4 hover:underline">
                {t("programmatic.studyInside.linkSignup")}
              </Link>
            </li>
          </ul>
        </section>

        {related.length > 0 ? (
          <nav className="mt-14" aria-label={t("programmatic.related.aria")}>
            <h2 className="text-lg font-semibold text-[var(--theme-body-text)]">{t("programmatic.related.heading")}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={pathForProgrammatic(r.slug)}
                    className="block rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-4 py-3 text-sm font-medium text-[var(--theme-body-text)] hover:border-primary/40"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {cross.length > 0 ? (
          <nav className="mt-10" aria-label={t("programmatic.explore.aria")}>
            <h2 className="text-lg font-semibold text-[var(--theme-body-text)]">{t("programmatic.explore.heading")}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cross.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={pathForProgrammatic(c.slug)}
                    className="inline-block rounded-full border border-[var(--theme-card-border)] px-3 py-1.5 text-xs font-medium text-[var(--theme-body-text)] hover:border-primary/40"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </article>
    </>
  );
}
