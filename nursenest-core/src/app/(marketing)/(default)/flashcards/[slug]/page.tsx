import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Brain, CheckCircle2, Layers3, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
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
import {
  publicFlashcardDeckLoginHref,
  publicFlashcardsHubLoginHref,
} from "@/lib/flashcards/public-flashcards-auth-callback";
import { defaultFlashcardsMetaDescription } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ slug: string }> };

// Converted to ISR - flashcard detail pages are public educational content
// Already had revalidate=86400, removing force-dynamic to enable ISR caching
export const revalidate = 86400; // 24 hours

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
  const login =
    data.kind === "deck"
      ? publicFlashcardDeckLoginHref(locale, data.slug)
      : publicFlashcardsHubLoginHref(locale, marketingRegion);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), path: "/" },
          { name: t("nav.flashcards"), path: "/flashcards" },
          { name: crumbName, path: `/flashcards/${slug}` },
        ]}
      />

      <nav className="mb-6 nn-marketing-caption" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={home} className="text-[var(--semantic-brand)] hover:underline">
              {t("nav.home")}
            </Link>
          </li>
          <li aria-hidden className="text-[var(--theme-muted-text)]">/</li>
          <li>
            <Link href={flashcardsHub} className="text-[var(--semantic-brand)] hover:underline">
              {t("nav.flashcards")}
            </Link>
          </li>
          <li aria-hidden className="text-[var(--theme-muted-text)]">/</li>
          <li className="font-medium text-[var(--theme-heading-text)]">{crumbName}</li>
        </ol>
      </nav>

      <section className="relative overflow-hidden rounded-[2rem] border border-[var(--semantic-border-soft)] bg-gradient-to-br from-[var(--hero-gradient-start)] via-[var(--semantic-surface)] to-[var(--hero-gradient-end)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_10%,transparent)] blur-3xl" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <TrustBadge icon="verified" label="Trust-labelled deck" />
              <TrustBadge icon="review" label="Verify before clinical use" tone="warning" />
              {data.kind === "deck" ? <TrustBadge icon="cards" label={`${data.cardCount} cards`} tone="neutral" /> : null}
            </div>

            {data.kind === "deck" ? (
              <>
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-5xl">
                  {data.title}
                </h1>
                {data.description ? (
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--theme-muted-text)] sm:text-base sm:leading-7">
                    {data.description}
                  </p>
                ) : (
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--theme-muted-text)] sm:text-base sm:leading-7">
                    Review this deck with active recall, then sign in to save progress and continue with smart spaced review.
                  </p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-5xl">
                  {data.name}{t("pages.publicFlashcardSlug.topicTitleSuffix")}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--theme-muted-text)] sm:text-base sm:leading-7">
                  {t("pages.publicFlashcardSlug.topicIntroP1")}
                  <Link href={lessons} className="font-medium text-[var(--semantic-brand)] underline">
                    {t("pages.publicFlashcardSlug.topicIntroLinkLessons")}
                  </Link>
                  {t("pages.publicFlashcardSlug.topicIntroP2")}
                  <Link href={pathwayQuestions} className="font-medium text-[var(--semantic-brand)] underline">
                    {t("pages.publicFlashcardSlug.topicIntroLinkQuestionBank")}
                  </Link>
                  {t("pages.publicFlashcardSlug.topicIntroP3")}
                </p>
              </>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={login}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-90"
              >
                {t("pages.publicFlashcardSlug.ctaStudyInApp")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={flashcardsHub}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
              >
                {t("pages.publicFlashcardSlug.ctaAllFlashcards")}
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_88%,transparent)] p-5 shadow-[var(--semantic-shadow-soft)] backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--semantic-panel-cool)] p-3 text-[var(--semantic-brand)]">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Content trust layer</p>
                <p className="text-xs text-[var(--theme-muted-text)]">Built for safer clinical studying</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-[var(--theme-muted-text)]">
              <TrustListItem>AI or imported cards should stay labelled until reviewed.</TrustListItem>
              <TrustListItem>Clinical claims should include reviewer/source metadata.</TrustListItem>
              <TrustListItem>Medication and dosage cards require extra safety checks.</TrustListItem>
              <TrustListItem>Incorrect cards should be reportable and retired quickly.</TrustListItem>
            </ul>
          </aside>
        </div>
      </section>

      {data.kind === "topic" && data.decks.length > 0 ? (
        <section className="mt-8 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
          <div className="mb-4 flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-[var(--semantic-brand)]" aria-hidden />
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Related decks</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.decks.map((d) => (
              <li key={d.slug}>
                <Link
                  href={withMarketingLocale(locale, `/flashcards/${d.slug}`)}
                  className="flex min-h-[54px] items-center justify-between rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:border-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
                >
                  {d.title}
                  <ArrowRight className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10" aria-labelledby="sample-cards-title">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Active recall preview
            </div>
            <h2 id="sample-cards-title" className="text-2xl font-semibold tracking-tight text-[var(--theme-heading-text)]">
              {t("pages.publicFlashcardSlug.sampleCardsTitle")}
            </h2>
            <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{t("pages.publicFlashcardSlug.sampleCardsSubtitle")}</p>
          </div>
        </div>

        <ul className="grid gap-5 lg:grid-cols-2">
          {data.samples.length === 0 ? (
            <li className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-sm text-[var(--theme-muted-text)] shadow-[var(--semantic-shadow-soft)]">
              {t("pages.publicFlashcardSlug.noSamples")}
            </li>
          ) : (
            data.samples.map((s, i) => (
              <li key={i} className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
                    Sample card {i + 1}
                  </span>
                  {data.kind === "topic" && "deckTitle" in s ? (
                    <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] px-2.5 py-1 text-[11px] font-semibold text-[var(--theme-muted-text)]">
                      {s.deckTitle}
                    </span>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
                    {t("pages.publicFlashcardSlug.labelFront")}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--theme-heading-text)]">{s.front}</p>
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--theme-muted-text)]">
                    {t("pages.publicFlashcardSlug.labelAnswerPreview")}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--theme-muted-text)]">{s.backTeaser}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        <StudyModeCard icon={Brain} title="Smart review" text="Save progress and convert this deck into a spaced-review schedule." />
        <StudyModeCard icon={Sparkles} title="Explain card" text="Use guided explanations to understand why the answer is correct." />
        <StudyModeCard icon={ShieldCheck} title="Trust checks" text="Clinical decks can carry reviewer, source, and review-date metadata." />
      </section>
    </main>
  );
}

function TrustBadge({
  label,
  tone = "verified",
  icon,
}: {
  label: string;
  tone?: "verified" | "warning" | "neutral";
  icon: "verified" | "review" | "cards";
}) {
  const Icon = icon === "verified" ? ShieldCheck : icon === "review" ? ShieldAlert : Layers3;
  const toneClass =
    tone === "verified"
      ? "border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] text-[var(--semantic-success-contrast)]"
      : tone === "warning"
        ? "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] text-[var(--semantic-warning-contrast)]"
        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--theme-muted-text)]";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}

function TrustListItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

function StudyModeCard({ icon: Icon, title, text }: { icon: typeof Brain; title: string; text: string }) {
  return (
    <article className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
      <div className="mb-4 inline-flex rounded-2xl bg-[var(--semantic-panel-cool)] p-3 text-[var(--semantic-brand)]">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">{text}</p>
    </article>
  );
}
