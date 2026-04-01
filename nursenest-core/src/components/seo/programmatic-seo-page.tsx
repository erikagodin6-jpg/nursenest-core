import Link from "next/link";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import {
  getCrossClusterLinks,
  getRelatedProgrammaticPages,
} from "@/lib/seo/programmatic-registry";
import { buildProgrammaticSeoBreadcrumbResolution } from "@/lib/seo/programmatic-breadcrumbs";
import { getProgrammaticPracticeConversionConfig } from "@/lib/seo/programmatic-practice-config";
import { ProgrammaticPageJsonLd } from "@/components/seo/seo-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ProgrammaticPracticeConversionBlocks } from "@/components/seo/programmatic-practice-conversion-blocks";
import { ProgrammaticPracticeHeroActions } from "@/components/seo/programmatic-practice-hero-actions";
import { ProgrammaticPracticeDynamicHeader } from "@/components/seo/programmatic-practice-dynamic-header";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { resolveProgrammaticProductLinks } from "@/lib/seo/programmatic-page-links";
import { isUnifiedPracticeSlug } from "@/lib/seo/programmatic-practice-hub";

export function ProgrammaticSeoPage({ page, locale }: { page: SeoPageDefinition; locale: string }) {
  const related = getRelatedProgrammaticPages(page.slug, 6);
  const cross = getCrossClusterLinks(page.slug);
  const signup = withMarketingLocale(locale, "/signup");
  const pricing = withMarketingLocale(locale, HUB.pricing);
  const product = resolveProgrammaticProductLinks(page, locale);
  const { lessons, questions, testBank, exams, tools, flashcards } = product;

  const { crumbs, schemaItems } = buildProgrammaticSeoBreadcrumbResolution(page, locale);
  const practiceConfig = getProgrammaticPracticeConversionConfig(page.slug);
  const introLead = practiceConfig?.valueLead ?? page.description;

  return (
    <>
      <ProgrammaticPageJsonLd page={page} locale={locale} />
      <BreadcrumbJsonLd items={schemaItems} />
      <article className="nn-marketing-surface mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />

        <header className="mb-10 border-b border-[var(--theme-card-border)] pb-8">
          <p className="text-sm font-medium text-primary">NurseNest exam prep</p>
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
          <p className="mt-3 text-sm font-medium text-[var(--theme-body-text)]/85">
            Turn reading into reps: pathway-scoped questions, lessons, and timed exams—so you study what your authorization
            actually covers.
          </p>
          <nav className="mt-3 text-sm text-primary" aria-label="Related hubs">
            <Link href={withMarketingLocale(locale, "/exam-lessons")} className="underline-offset-4 hover:underline">
              Lesson hubs
            </Link>
            <span className="mx-2 text-[var(--theme-body-text)]/40" aria-hidden>
              ·
            </span>
            <Link href={withMarketingLocale(locale, "/blog")} className="underline-offset-4 hover:underline">
              Blog
            </Link>
            <span className="mx-2 text-[var(--theme-body-text)]/40" aria-hidden>
              ·
            </span>
            <Link href={withMarketingLocale(locale, "/tools")} className="underline-offset-4 hover:underline">
              Free tools
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
                  Create free account
                </Link>
                <Link
                  href={pricing}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
                >
                  Compare plans
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={signup}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)] transition hover:bg-role-cta-hover"
              >
                Start free (create account)
              </Link>
              <Link
                href={pricing}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
              >
                View plans
              </Link>
              <Link
                href={questions}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                Start practice questions
              </Link>
            </div>
          )}
        </header>

        {practiceConfig && page.practiceConversion ? (
          <ProgrammaticPracticeConversionBlocks slug={page.slug} locale={locale} config={practiceConfig} />
        ) : null}

        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:text-[var(--theme-body-text)] prose-p:text-[var(--theme-body-text)]/90 prose-li:text-[var(--theme-body-text)]/90">
          {page.sections.map((section, idx) => {
            const Tag = section.level === 2 ? "h2" : "h3";
            return (
              <section key={idx} className="mb-10">
                <Tag className="mb-3 text-xl font-semibold sm:text-2xl">{section.heading}</Tag>
                {section.body.map((para, j) => (
                  <p key={j} className="mb-3 leading-relaxed">
                    {para}
                  </p>
                ))}
              </section>
            );
          })}
        </div>

        {page.faq?.length ? (
          <section className="mt-12 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--theme-body-text)]">Common questions</h2>
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

        <section className="mt-14 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[var(--theme-body-text)]">Study inside NurseNest</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]/85">
            Every guide links to exam lessons, pathway questions, the public test bank, adaptive CAT exams, study tools, and flashcards so you never hit a dead end.
          </p>
          <ul className="mt-6 flex flex-col gap-2 text-sm font-medium text-primary sm:flex-row sm:flex-wrap sm:gap-4">
            <li>
              <Link href={lessons} className="underline-offset-4 hover:underline">
                Exam lesson hubs
              </Link>
            </li>
            <li>
              <Link href={questions} className="underline-offset-4 hover:underline">
                Practice questions
              </Link>
            </li>
            <li>
              <Link href={testBank} className="underline-offset-4 hover:underline">
                Test bank overview
              </Link>
            </li>
            <li>
              <Link href={exams} className="underline-offset-4 hover:underline">
                Adaptive CAT exams
              </Link>
            </li>
            <li>
              <Link href={tools} className="underline-offset-4 hover:underline">
                Study tools
              </Link>
            </li>
            <li>
              <Link href={flashcards} className="underline-offset-4 hover:underline">
                Flashcards
              </Link>
            </li>
            <li>
              <Link href={pricing} className="underline-offset-4 hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link href={signup} className="underline-offset-4 hover:underline">
                Sign up
              </Link>
            </li>
          </ul>
        </section>

        {related.length > 0 ? (
          <nav className="mt-14" aria-label="Related topics">
            <h2 className="text-lg font-semibold text-[var(--theme-body-text)]">Related guides</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={locale === DEFAULT_MARKETING_LOCALE ? `/${r.slug}` : `/${locale}/${r.slug}`}
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
          <nav className="mt-10" aria-label="More exam prep">
            <h2 className="text-lg font-semibold text-[var(--theme-body-text)]">Explore more</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cross.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={locale === DEFAULT_MARKETING_LOCALE ? `/${c.slug}` : `/${locale}/${c.slug}`}
                    className="inline-block rounded-full border border-[var(--theme-card-border)] px-3 py-1.5 text-xs font-medium text-[var(--theme-body-text)] hover:border-primary/40"
                  >
                    {c.h1}
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
