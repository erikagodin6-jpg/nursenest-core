import Link from "next/link";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import {
  getCrossClusterLinks,
  getRelatedProgrammaticPages,
} from "@/lib/seo/programmatic-registry";
import { ProgrammaticPageJsonLd } from "@/components/seo/seo-json-ld";

function productHref(locale: string, path: string): string {
  const mapped = mapLegacyMarketingHref(path);
  if (mapped.startsWith("/app")) return mapped;
  return withMarketingLocale(locale, mapped);
}

export function ProgrammaticSeoPage({ page, locale }: { page: SeoPageDefinition; locale: string }) {
  const related = getRelatedProgrammaticPages(page.slug, 6);
  const cross = getCrossClusterLinks(page.slug);
  const signup = withMarketingLocale(locale, "/signup");
  const pricing = withMarketingLocale(locale, "/pricing");
  const questions = productHref(locale, "/test-bank");
  const lessons = productHref(locale, "/lessons");
  const exams = productHref(locale, "/mock-exams");

  return (
    <>
      <ProgrammaticPageJsonLd page={page} locale={locale} />
      <article className="nn-marketing-surface mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-[var(--theme-card-border)] pb-8">
          <p className="text-sm font-medium text-primary">NurseNest exam prep</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-body-text)] sm:text-4xl">
            {page.h1}
          </h1>
          <p className="mt-4 text-lg text-[var(--theme-body-text)]/85">{page.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={signup}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Start free — create account
            </Link>
            <Link
              href={pricing}
              className="inline-flex items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
            >
              View plans
            </Link>
            <Link
              href={questions}
              className="inline-flex items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Open question bank
            </Link>
          </div>
        </header>

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
                  <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]/85">
                    {item.answer}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[var(--theme-body-text)]">Study inside NurseNest</h2>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]/85">
            Link lessons, timed questions, and full mock exams in one subscription workflow—built for Canadian and US
            pathways.
          </p>
          <ul className="mt-6 flex flex-col gap-2 text-sm font-medium text-primary sm:flex-row sm:flex-wrap sm:gap-4">
            <li>
              <Link href={lessons} className="underline-offset-4 hover:underline">
                Clinical lessons
              </Link>
            </li>
            <li>
              <Link href={questions} className="underline-offset-4 hover:underline">
                Practice questions & test bank
              </Link>
            </li>
            <li>
              <Link href={exams} className="underline-offset-4 hover:underline">
                Mock exams
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
