import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgrammaticQuestionTopicCards } from "@/components/marketing/programmatic-question-topic-cards";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import {
  loadProgrammaticQuestionTopicQuestions,
  loadProgrammaticQuestionTopicRelatedLessons,
  PROGRAMMATIC_QUESTION_TOPIC_MAX_PAGE,
  PROGRAMMATIC_QUESTION_TOPIC_PAGE_SIZE,
} from "@/lib/seo/load-programmatic-question-topic-page";
import { getProgrammaticQuestionTopicDefinition } from "@/lib/seo/programmatic-question-topic-registry";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import { isRegionalMarketingUrlPublished } from "@/lib/marketing/published-regional-marketing-urls";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

export const dynamicParams = true;
export const revalidate = 86_400;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const marketingLocale = await getMarketingLocaleForDefaultRoute();
  const def = getProgrammaticQuestionTopicDefinition(slug);
  const pathname = `/questions/${slug}`;
  const pageRaw = Number(sp.page ?? "1");
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
  const paginated = page > 1;

  return safeGenerateMetadata(
    async () => {
      if (!def) return {};
      const alt = marketingAlternatesSharedPage(marketingLocale, pathname);
      const title = def.title;
      const description = def.description.slice(0, 160);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "article" },
        robots: paginated ? { index: false, follow: true } : { index: true, follow: true },
      };
    },
    { pathname, locale: marketingLocale, routeGroup: "marketing.default.programmatic_question_topic" },
  );
}

export default async function ProgrammaticQuestionTopicPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const def = getProgrammaticQuestionTopicDefinition(slug);
  if (!def) notFound();

  const pageRaw = Number(sp.page ?? "1");
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
  const safePage = Math.min(page, PROGRAMMATIC_QUESTION_TOPIC_MAX_PAGE);

  const locale = await getMarketingLocaleForDefaultRoute();
  const [qData, relatedLessons] = await Promise.all([
    loadProgrammaticQuestionTopicQuestions(slug, safePage),
    loadProgrammaticQuestionTopicRelatedLessons(slug),
  ]);
  if (!qData) notFound();

  const pathname = `/questions/${slug}`;
  const signup = withMarketingLocale(locale, "/signup");
  const appBank = loginWithCallback("/app/questions");
  const practiceExamsHref = withMarketingLocale(locale, "/practice-exams");

  const faqItems = def.faq.map((f) => ({ question: f.question, answer: f.answer }));

  const hubCards = def.hubPathwayIds
    .map((id) => getExamPathwayById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const relatedTopicLinks = (def.relatedQuestionPageSlugs ?? [])
    .map((s) => {
      const p = getProgrammaticQuestionTopicDefinition(s);
      return p ? { href: `/questions/${p.slug}`, label: p.h1 } : null;
    })
    .filter((x): x is { href: string; label: string } => Boolean(x));

  const regionalDha = "/middle-east/dha-exam";
  const showDhaGuide = slug === "dha-exam-practice" && isRegionalMarketingUrlPublished(regionalDha);

  const crumbs = [
    { name: "Home", href: "/" as const },
    { name: "Practice questions", href: "/question-bank" },
    { name: def.h1 },
  ];
  const schemaItems = [
    { name: "Home", item: toAbsoluteSiteUrl("/") },
    { name: "Practice questions", item: toAbsoluteSiteUrl("/question-bank") },
    { name: def.h1, item: absoluteUrl(pathname) },
  ];

  const web = buildMarketingWebPageJsonLdProps({
    locale,
    enPath: pathname,
    title: def.title,
    description: def.description.slice(0, 160),
  });

  const pageCount = qData.pageCount;
  const prevPage = safePage > 1 ? safePage - 1 : null;
  const nextPage = safePage < pageCount ? safePage + 1 : null;
  const pageQuery = (n: number) => (n <= 1 ? pathname : `${pathname}?page=${n}`);

  return (
    <>
      <WebPageJsonLd {...web} />
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd items={schemaItems} />
      <article className="nn-marketing-surface mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} navClassName="nn-marketing-caption" />

        <header className="mb-8 border-b border-[var(--semantic-border-soft)] pb-8">
          <p className="text-sm font-medium text-[var(--semantic-brand)]">Practice questions</p>
          <h1 className="nn-marketing-h1 mt-2 text-balance">{def.h1}</h1>
          <p className="nn-marketing-body mt-4 text-[var(--theme-muted-text)]">{def.description}</p>
        </header>

        <section className="space-y-4 nn-marketing-body leading-relaxed text-[var(--theme-body-text)]" aria-labelledby="intro-heading">
          <h2 id="intro-heading" className="nn-marketing-h3 text-[var(--theme-heading-text)]">
            How to use this topic page
          </h2>
          {def.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p>
            <Link href={withMarketingLocale(locale, "/question-bank")} className="font-semibold text-primary hover:underline">
              Browse all public question bank entry points
            </Link>{" "}
            by exam pathway, or{" "}
            <Link href={withMarketingLocale(locale, "/lessons")} className="font-semibold text-primary hover:underline">
              explore lessons
            </Link>{" "}
            when you need depth before drilling items.
          </p>
        </section>

        {showDhaGuide ? (
          <section className="mt-8 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,var(--theme-card-bg))] p-4 sm:p-5">
            <h2 className="nn-marketing-h4 text-[var(--theme-heading-text)]">GCC licensing context</h2>
            <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
              Pair these items with our Middle East registration overview—requirements change; verify eligibility on official sites.
            </p>
            <Link href={withMarketingLocale(locale, regionalDha)} className="mt-3 inline-flex font-semibold text-primary hover:underline">
              Read the DHA exam guide →
            </Link>
          </section>
        ) : null}

        <section className="mt-10" aria-labelledby="preview-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 id="preview-heading" className="nn-marketing-h3 text-[var(--theme-heading-text)]">
              Embedded question preview
            </h2>
            <p className="text-xs text-[var(--theme-muted-text)]">
              {PROGRAMMATIC_QUESTION_TOPIC_PAGE_SIZE} per page · {qData.total.toLocaleString()} matches in pool
            </p>
          </div>
          {qData.usedFallback ? (
            <p className="mb-4 text-sm text-[var(--theme-muted-text)]">
              Showing a broader pathway sample because the narrow topic filter returned fewer items—still pathway-scoped, not a generic dump.
            </p>
          ) : null}
          <ProgrammaticQuestionTopicCards rows={qData.rows} signupHref={signup} />
        </section>

        {pageCount > 1 ? (
          <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--semantic-border-soft)] pt-6" aria-label="Question preview pagination">
            {prevPage ? (
              <Link
                href={withMarketingLocale(locale, pageQuery(prevPage))}
                className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-primary hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_20%,transparent)]"
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-sm text-[var(--theme-muted-text)]">
              Page {safePage} of {pageCount}
            </span>
            {nextPage ? (
              <Link
                href={withMarketingLocale(locale, pageQuery(nextPage))}
                className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-primary hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_20%,transparent)]"
              >
                Next →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}

        <section className="mt-12 border-t border-[var(--semantic-border-soft)] pt-8" aria-labelledby="hubs-heading">
          <h2 id="hubs-heading" className="nn-marketing-h3 text-[var(--theme-heading-text)]">
            Exam hubs
          </h2>
          <ul className="mt-4 space-y-3">
            {hubCards.map((p) => (
              <li key={p.id}>
                <Link href={withMarketingLocale(locale, buildExamPathwayPath(p))} className="font-semibold text-primary hover:underline">
                  {p.displayName} — open hub
                </Link>
                <span className="text-[var(--theme-muted-text)]"> · </span>
                <Link
                  href={withMarketingLocale(locale, buildExamPathwayPath(p, "questions"))}
                  className="text-sm font-medium text-[var(--semantic-info)] hover:underline"
                >
                  Public questions landing
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {relatedLessons.length > 0 ? (
          <section className="mt-10" aria-labelledby="lessons-heading">
            <h2 id="lessons-heading" className="nn-marketing-h3 text-[var(--theme-heading-text)]">
              Related lessons
            </h2>
            <ul className="mt-4 space-y-2">
              {relatedLessons.map((l) => (
                <li key={l.href}>
                  <Link href={withMarketingLocale(locale, l.href)} className="font-medium text-primary hover:underline">
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {relatedTopicLinks.length > 0 ? (
          <section className="mt-10" aria-labelledby="related-topics-heading">
            <h2 id="related-topics-heading" className="nn-marketing-h3 text-[var(--theme-heading-text)]">
              Related topic pages
            </h2>
            <ul className="mt-4 space-y-2">
              {relatedTopicLinks.map((l) => (
                <li key={l.href}>
                  <Link href={withMarketingLocale(locale, l.href)} className="font-medium text-primary hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6">
          <h2 className="nn-marketing-h4 text-[var(--theme-heading-text)]">Study with full depth</h2>
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
            Create an account to unlock rationales, filters, and the same pathway scope as these previews—without loading the entire bank at once.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={signup}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Sign up free
            </Link>
            <Link
              href={appBank}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-5 py-2.5 text-sm font-semibold text-primary hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,transparent)]"
            >
              Open in-app question bank
            </Link>
            <Link
              href={practiceExamsHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-[var(--semantic-info)] hover:underline"
            >
              Practice exams overview
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
