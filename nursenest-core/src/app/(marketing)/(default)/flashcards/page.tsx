import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { loadPublicFlashcardHub } from "@/lib/seo/public-flashcard-landing";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage, resolveMarketingCopy } from "@/lib/marketing-i18n-core";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title = resolveMarketingCopy(m, "pages.publicFlashcardsHub.metaTitle", en, "NCLEX & nursing flashcards");
  const description = resolveMarketingCopy(
    m,
    "pages.publicFlashcardsHub.metaDescription",
    en,
    "Topic-organized nursing flashcards for NCLEX-RN, NCLEX-PN, and clinical review. Sample cards here; full study inside NurseNest.",
  );
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/flashcards") },
  };
}

export default async function PublicFlashcardsHubPage() {
  const { topics, featuredDecks } = await loadPublicFlashcardHub();
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, p?: Record<string, string | number>) => formatMarketingMessage(m, key, p, en);

  const home = withMarketingLocale(locale, "/");
  const login = withMarketingLocale(locale, "/login");
  const pricing = withMarketingLocale(locale, "/pricing");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), path: "/" },
          { name: t("nav.flashcards"), path: "/flashcards" },
        ]}
      />
      <nav className="mb-6 text-sm text-[var(--theme-muted-text)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={home} className="text-primary underline">
              {t("nav.home")}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--theme-heading-text)]">{t("nav.flashcards")}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">{t("pages.publicFlashcardsHub.h1")}</h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--theme-muted-text)]">{t("pages.publicFlashcardsHub.intro")}</p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("pages.publicFlashcardsHub.sectionTopicsTitle")}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {topics.length === 0 ? (
            <li className="text-sm text-[var(--theme-muted-text)]">{t("pages.publicFlashcardsHub.topicsEmpty")}</li>
          ) : (
            topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={withMarketingLocale(locale, `/flashcards/${topic.slug}`)}
                  className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40"
                >
                  {topic.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("pages.publicFlashcardsHub.sectionFeaturedTitle")}</h2>
        <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{t("pages.publicFlashcardsHub.featuredSubtitle")}</p>
        <ul className="mt-6 space-y-6">
          {featuredDecks.length === 0 ? (
            <li className="text-sm text-[var(--theme-muted-text)]">{t("pages.publicFlashcardsHub.featuredEmpty")}</li>
          ) : (
            featuredDecks.map((d) => (
              <li key={d.slug} className="nn-card p-5">
                <Link
                  href={withMarketingLocale(locale, `/flashcards/${d.slug}`)}
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  {d.title}
                </Link>
                {d.description ? <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{d.description}</p> : null}
                <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
                  {t("pages.publicFlashcardsHub.deckCardLine", { count: d.cardCount })}
                </p>
                {d.sampleFront ? (
                  <blockquote className="mt-4 rounded-lg border border-border bg-muted/30 p-4 text-sm text-[var(--theme-heading-text)]">
                    <span className="text-xs font-semibold uppercase text-primary">{t("pages.publicFlashcardsHub.sampleCardBadge")}</span>
                    <p className="mt-2 whitespace-pre-wrap">{d.sampleFront}</p>
                  </blockquote>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href={login}
          className="inline-flex rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground"
        >
          {t("pages.publicFlashcardsHub.ctaSignIn")}
        </Link>
        <Link href={pricing} className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
          {t("pages.publicFlashcardsHub.ctaPricing")}
        </Link>
      </div>
    </div>
  );
}
