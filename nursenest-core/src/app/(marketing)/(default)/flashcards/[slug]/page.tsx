import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { resolvePublicFlashcardLanding } from "@/lib/seo/public-flashcard-slug-resolve";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import {
  MARKETING_PUBLIC_FLASHCARD_SLUG_META_DESCRIPTION_GENERIC_FALLBACK,
  MARKETING_PUBLIC_FLASHCARD_SLUG_NOT_FOUND_TITLE_FALLBACK,
} from "@/lib/marketing-i18n/marketing-safe-fallbacks";
import {
  getRequiredPublicMetadataInterpolated,
  getRequiredPublicMetadataLine,
} from "@/lib/marketing-i18n/marketing-metadata-strict";
import { defaultFlashcardsMetaDescription } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/flashcards/${slug}`;
  return safeGenerateMetadata(
    async () => {
      const locale = await getMarketingLocaleForDefaultRoute();
      const marketingRegion = await getMarketingRegionFromCookies();
      const m = await loadMarketingMessages(locale);
      const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const t = (key: string, p?: Record<string, string | number>) => formatMarketingMessage(m, key, p, en);

      const data = await resolvePublicFlashcardLanding(slug);
      if (!data) {
        return {
          title: getRequiredPublicMetadataLine(
            m,
            "pages.publicFlashcardSlug.metaTitleFallback",
            en,
            MARKETING_PUBLIC_FLASHCARD_SLUG_NOT_FOUND_TITLE_FALLBACK,
          ),
          description: getRequiredPublicMetadataLine(
            m,
            `pages.publicFlashcardsHub.metaDescription${metaSfx}`,
            en,
            defaultFlashcardsMetaDescription(marketingRegion),
          ),
          alternates: { canonical: absoluteUrl(`/flashcards/${slug}`) },
        };
      }
      if (data.kind === "deck") {
        const title = getRequiredPublicMetadataInterpolated(
          m,
          "pages.publicFlashcardSlug.metaDeckTitle",
          { title: data.title, count: data.cardCount },
          en,
          MARKETING_PUBLIC_FLASHCARD_SLUG_NOT_FOUND_TITLE_FALLBACK,
        );
        const userDesc = data.description && String(data.description).trim().slice(0, 155);
        const description =
          userDesc && userDesc.length > 0
            ? userDesc
            : getRequiredPublicMetadataInterpolated(
                m,
                "pages.publicFlashcardSlug.metaDeckDescriptionFallback",
                { title: data.title, count: data.cardCount },
                en,
                MARKETING_PUBLIC_FLASHCARD_SLUG_META_DESCRIPTION_GENERIC_FALLBACK,
              );
        return {
          title,
          description,
          alternates: { canonical: absoluteUrl(`/flashcards/${slug}`) },
        };
      }
      const title = getRequiredPublicMetadataInterpolated(
        m,
        "pages.publicFlashcardSlug.metaTopicTitle",
        { name: data.name },
        en,
        MARKETING_PUBLIC_FLASHCARD_SLUG_NOT_FOUND_TITLE_FALLBACK,
      );
      const description = getRequiredPublicMetadataInterpolated(
        m,
        "pages.publicFlashcardSlug.metaTopicDescription",
        { name: data.name },
        en,
        MARKETING_PUBLIC_FLASHCARD_SLUG_META_DESCRIPTION_GENERIC_FALLBACK,
      );
      return {
        title,
        description,
        alternates: { canonical: absoluteUrl(`/flashcards/${slug}`) },
      };
    },
    { pathname, routeGroup: "marketing.default.flashcards.slug" },
  );
}

export default async function PublicFlashcardSlugPage({ params }: Props) {
  const { slug } = await params;
  const data = await resolvePublicFlashcardLanding(slug);
  if (!data) notFound();

  const locale = await getMarketingLocaleForDefaultRoute();
  const marketingRegion = await getMarketingRegionFromCookies();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, p?: Record<string, string | number>) => formatMarketingMessage(m, key, p, en);

  const crumbName = data.kind === "deck" ? data.title : data.name;
  const home = withMarketingLocale(locale, "/");
  const flashcardsHub = withMarketingLocale(locale, "/flashcards");
  const lessons = withMarketingLocale(locale, "/lessons");
  const pathwayQuestions = withMarketingLocale(locale, rnQuestions(marketingRegion));
  const login = withMarketingLocale(locale, "/login");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), path: "/" },
          { name: t("nav.flashcards"), path: "/flashcards" },
          { name: crumbName, path: `/flashcards/${slug}` },
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
          <li>
            <Link href={flashcardsHub} className="text-primary underline">
              {t("nav.flashcards")}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--theme-heading-text)]">
            {data.kind === "deck" ? data.title : data.name}
          </li>
        </ol>
      </nav>

      {data.kind === "deck" ? (
        <>
          <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">{data.title}</h1>
          {data.description ? <p className="mt-3 text-sm text-[var(--theme-muted-text)]">{data.description}</p> : null}
          <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
            {t("pages.publicFlashcardSlug.deckCardLine", { count: data.cardCount })}
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">
            {data.name}
            {t("pages.publicFlashcardSlug.topicTitleSuffix")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
            {t("pages.publicFlashcardSlug.topicIntroP1")}
            <Link href={lessons} className="font-medium text-primary underline">
              {t("pages.publicFlashcardSlug.topicIntroLinkLessons")}
            </Link>
            {t("pages.publicFlashcardSlug.topicIntroP2")}
            <Link href={pathwayQuestions} className="font-medium text-primary underline">
              {t("pages.publicFlashcardSlug.topicIntroLinkQuestionBank")}
            </Link>
            {t("pages.publicFlashcardSlug.topicIntroP3")}
          </p>
          {data.decks.length > 0 ? (
            <ul className="mt-4 space-y-1 text-sm">
              {data.decks.map((d) => (
                <li key={d.slug}>
                  <Link href={withMarketingLocale(locale, `/flashcards/${d.slug}`)} className="text-primary underline">
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("pages.publicFlashcardSlug.sampleCardsTitle")}</h2>
        <p className="mt-1 text-xs text-[var(--theme-muted-text)]">{t("pages.publicFlashcardSlug.sampleCardsSubtitle")}</p>
        <ul className="mt-6 space-y-5">
          {data.samples.length === 0 ? (
            <li className="text-sm text-[var(--theme-muted-text)]">{t("pages.publicFlashcardSlug.noSamples")}</li>
          ) : (
            data.samples.map((s, i) => (
              <li key={i} className="nn-card p-5">
                {data.kind === "topic" && "deckTitle" in s ? (
                  <p className="text-xs font-medium text-primary">{s.deckTitle}</p>
                ) : null}
                <p className="mt-2 text-sm font-medium text-[var(--theme-heading-text)]">
                  {t("pages.publicFlashcardSlug.labelFront")}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{s.front}</p>
                <p className="mt-4 text-sm font-medium text-[var(--theme-heading-text)]">
                  {t("pages.publicFlashcardSlug.labelAnswerPreview")}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--theme-muted-text)]">{s.backTeaser}</p>
              </li>
            ))
          )}
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={login} className="rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground">
          {t("pages.publicFlashcardSlug.ctaStudyInApp")}
        </Link>
        <Link href={flashcardsHub} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
          {t("pages.publicFlashcardSlug.ctaAllFlashcards")}
        </Link>
      </div>
    </div>
  );
}
