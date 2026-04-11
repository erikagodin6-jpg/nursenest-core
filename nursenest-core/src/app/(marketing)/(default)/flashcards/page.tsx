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
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import {
  defaultFlashcardsMetaDescription,
  defaultFlashcardsMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const locale = await getMarketingLocaleForDefaultRoute();
      const marketingRegion = await getMarketingRegionFromCookies();
      const m = await loadMarketingMessages(locale);
      const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = resolveMarketingCopy(
        m,
        `pages.publicFlashcardsHub.metaTitle${metaSfx}`,
        en,
        defaultFlashcardsMetaTitle(marketingRegion),
      );
      const description = resolveMarketingCopy(
        m,
        `pages.publicFlashcardsHub.metaDescription${metaSfx}`,
        en,
        defaultFlashcardsMetaDescription(marketingRegion),
      );
      return {
        title,
        description,
        alternates: { canonical: absoluteUrl("/flashcards") },
      };
    },
    { pathname: "/flashcards", routeGroup: "marketing.default.flashcards" },
  );
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
      <nav className="mb-6 nn-marketing-caption" aria-label="Breadcrumb">
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

      <h1 className="nn-marketing-h1">{t("pages.publicFlashcardsHub.h1")}</h1>
      <p className="mt-3 max-w-2xl nn-marketing-body-sm text-[var(--theme-muted-text)]">{t("pages.publicFlashcardsHub.intro")}</p>

      <section className="mt-10">
        <h2 className="nn-marketing-h3">{t("pages.publicFlashcardsHub.sectionTopicsTitle")}</h2>
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

      <section className="mt-12" id="flashcard-deck-library">
        <details open className="group/flashcard-decks">
          <summary className="mb-4 flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm font-medium text-[var(--semantic-brand)] shadow-[var(--semantic-shadow-soft)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]">
            <span className="text-[var(--theme-muted-text)]">
              {featuredDecks.length} {featuredDecks.length === 1 ? "deck" : "decks"}
            </span>
            <span className="group-open/flashcard-decks:hidden">Show featured decks</span>
            <span className="hidden group-open/flashcard-decks:inline">Hide featured decks</span>
          </summary>
          <ul className="space-y-6">
            {featuredDecks.length === 0 ? (
              <li className="text-sm text-[var(--theme-muted-text)]">{t("pages.publicFlashcardsHub.featuredEmpty")}</li>
            ) : (
              featuredDecks.map((d) => (
                <li key={d.slug} className="nn-card p-5">
                  <Link
                    href={withMarketingLocale(locale, `/flashcards/${d.slug}`)}
                    className="nn-marketing-h3 text-primary hover:underline"
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
        </details>
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
