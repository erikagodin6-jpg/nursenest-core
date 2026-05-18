import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  HeartPulse,
  Layers,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { loadPublicFlashcardHub } from "@/lib/seo/public-flashcard-landing";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { getRequiredPublicMetadataLine } from "@/lib/marketing-i18n/marketing-metadata-strict";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import {
  defaultFlashcardsMetaDescription,
  defaultFlashcardsMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified clinical content",
    description:
      "Clinician-reviewed and source-verified decks can surface trust badges, review dates, and correction paths instead of anonymous study claims.",
  },
  {
    icon: Brain,
    title: "Smart spaced repetition",
    description:
      "Review with active recall, weak-area rescue, and exam-date pacing rather than passive card flipping alone.",
  },
  {
    icon: HeartPulse,
    title: "Visual nursing cards",
    description:
      "Built for ECG strips, labs, hemodynamics, pharmacology, prioritization, and clinical judgment—not just vocabulary lists.",
  },
  {
    icon: Sparkles,
    title: "AI with guardrails",
    description:
      "AI can simplify, explain, and clean cards, but imported or generated clinical content stays unverified until reviewed.",
  },
];

const HIGH_TRUST_BADGES = [
  "Clinician reviewed",
  "Source verified",
  "NCLEX-aligned",
  "Correction reporting",
  "Updated review dates",
  "Community decks labelled clearly",
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const locale = await getMarketingLocaleForDefaultRoute();
      const marketingRegion = await getMarketingRegionFromCookies();
      const m = await loadMarketingMessageShards(locale, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);
      const en = await loadMarketingMessageShards(
        DEFAULT_MARKETING_LOCALE,
        MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
      );
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = getRequiredPublicMetadataLine(
        m,
        `pages.publicFlashcardsHub.metaTitle${metaSfx}`,
        en,
        defaultFlashcardsMetaTitle(marketingRegion),
      );
      const description = getRequiredPublicMetadataLine(
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
  const { featuredDecks, categorySections, highYieldDecks } = await loadPublicFlashcardHub();
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessageShards(locale, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);
  const en = await loadMarketingMessageShards(
    DEFAULT_MARKETING_LOCALE,
    MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  );
  const t = (key: string, p?: Record<string, string | number>) => formatMarketingMessage(m, key, p, en);

  const home = withMarketingLocale(locale, "/");
  const login = withMarketingLocale(locale, "/login");
  const pricing = withMarketingLocale(locale, "/pricing");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), path: "/" },
          { name: t("nav.flashcards"), path: "/flashcards" },
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
          <li className="font-medium text-[var(--theme-heading-text)]">{t("nav.flashcards")}</li>
        </ol>
      </nav>

      <header className="relative overflow-hidden rounded-[2rem] border border-[var(--semantic-border-soft)] bg-gradient-to-br from-[var(--hero-gradient-start)] via-[var(--semantic-surface)] to-[var(--hero-gradient-end)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_10%,transparent)] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_10%,transparent)] blur-3xl"
          aria-hidden
        />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-3 py-1 text-xs font-semibold text-[var(--pill-fg)]">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              Verified clinical flashcards
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-5xl">
              NurseNest Flashcards
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-muted-text)] sm:text-base sm:leading-7">
              Quizlet-style simplicity with NurseNest’s clinical trust layer: source-aware flashcards,
              smart spaced review, ECG and nursing visuals, and clear warnings when content is imported,
              AI-generated, or not yet reviewed.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={login}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-90"
              >
                {t("pages.publicFlashcardsHub.ctaSignIn")}
              </Link>
              <Link
                href="#flashcard-deck-library"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
              >
                Browse decks
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_86%,transparent)] p-5 shadow-[var(--semantic-shadow-soft)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--semantic-brand)]">
                  Trust layer
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
                  Safer than random public decks
                </h2>
              </div>
              <CheckCircle2 className="h-6 w-6 text-[var(--semantic-success)]" aria-hidden />
            </div>
            <div className="grid gap-2">
              {HIGH_TRUST_BADGES.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-sm font-medium text-[var(--theme-heading-text)]"
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--semantic-brand)]" aria-hidden />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap gap-4 border-t border-[var(--semantic-border-soft)] pt-5">
          <StatItem icon={GraduationCap} label="Flashcard decks" value={featuredDecks.length} />
          <StatItem icon={Layers} label="Categories" value={categorySections.length} />
          <StatItem icon={ShieldCheck} label="Trust-labelled content" value="Verified" />
          <StatItem icon={Layers} label="Free to preview" value="All decks" />
        </div>
      </header>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Why NurseNest Flashcards is different">
        {TRUST_FEATURES.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-[var(--semantic-panel-cool)] p-3 text-[var(--semantic-brand)]">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              Compete with Quizlet without becoming low-trust
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--theme-heading-text)]">
              Community decks can scale, but verified clinical decks stay protected.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--theme-muted-text)]">
              Imported, AI-generated, and student-created decks should be clearly labelled until reviewed.
              That makes public flashcards useful for traffic without pretending every clinical claim is safe.
            </p>
          </div>
          <Link
            href={pricing}
            className="inline-flex min-h-[46px] shrink-0 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
          >
            See premium study tools
          </Link>
        </div>
      </section>

      {highYieldDecks.length > 0 ? (
        <section className="mt-10" aria-labelledby="topics-heading">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 id="topics-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
              Review high-yield flashcards
            </h2>
            <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
              {highYieldDecks.length} prioritized
            </span>
          </div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {highYieldDecks.slice(0, 6).map((deck) => (
              <li key={deck.slug}>
                <FlashcardDeckCard deck={deck} locale={locale} t={t} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section
        id="flashcard-deck-library"
        className="mt-8"
        aria-labelledby="featured-decks-heading"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="featured-decks-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
            Flashcards by lesson category
          </h2>
          <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
            {featuredDecks.length} {featuredDecks.length === 1 ? "deck" : "decks"}
          </span>
        </div>

        {featuredDecks.length === 0 ? (
          <div className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 text-center shadow-[var(--semantic-shadow-soft)]">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-[var(--semantic-text-muted)]" aria-hidden />
            <p className="text-sm font-medium text-[var(--theme-heading-text)]">
              {t("pages.publicFlashcardsHub.featuredEmpty")}
            </p>
            <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
              Check back soon — new decks are added regularly.
            </p>
          </div>
        ) : categorySections.length === 0 ? null : (
          <div className="space-y-8">
            {categorySections.map((section) => (
              <section key={section.id} aria-labelledby={`flashcards-category-${section.id}`}>
                <div className="mb-4">
                  <h3 id={`flashcards-category-${section.id}`} className="text-base font-semibold text-[var(--theme-heading-text)]">
                    {section.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{section.description}</p>
                </div>

                {section.decks.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {section.decks.map((deck) => (
                      <li key={deck.slug}>
                        <FlashcardDeckCard deck={deck} locale={locale} t={t} />
                      </li>
                    ))}
                  </ul>
                ) : null}

                {(section.subcategories ?? []).length > 0 ? (
                  <div className="mt-5 space-y-5">
                    {section.subcategories?.map((sub) => (
                      <div key={sub.id}>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                          {sub.title}
                        </h4>
                        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          {sub.decks.map((deck) => (
                            <li key={deck.slug}>
                              <FlashcardDeckCard deck={deck} locale={locale} t={t} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        )}
      </section>

      <section
        className="mt-12 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-gradient-to-br from-[var(--hero-gradient-start)] via-[var(--semantic-surface)] to-[var(--hero-gradient-end)] p-6 text-center shadow-[var(--semantic-shadow-soft)] sm:p-8"
        aria-label="Get started studying"
      >
        <GraduationCap className="mx-auto mb-3 h-8 w-8 text-[var(--semantic-brand)]" aria-hidden />
        <h2 className="text-xl font-semibold tracking-tight text-[var(--theme-heading-text)]">
          Ready to study? Create a free account.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--theme-muted-text)]">
          Sign in to track your progress, study all decks, and build custom study plans.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={login}
            className="inline-flex min-h-[48px] w-full max-w-[220px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
          >
            {t("pages.publicFlashcardsHub.ctaSignIn")}
          </Link>
          <Link
            href={pricing}
            className="inline-flex min-h-[48px] w-full max-w-[220px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
          >
            {t("pages.publicFlashcardsHub.ctaPricing")}
          </Link>
        </div>
      </section>
    </main>
  );
}

function StatItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
      <span className="text-sm font-semibold text-[var(--theme-heading-text)]">{value}</span>
      <span className="text-sm text-[var(--theme-muted-text)]">{label}</span>
    </div>
  );
}

type DeckProps = {
  deck: {
    slug: string;
    title: string;
    description: string | null;
    cardCount: number;
    sampleFront: string | null;
    lessonSource?: { slug: string; name: string };
  };
  locale: string;
  t: (key: string, p?: Record<string, string | number>) => string;
};

function FlashcardDeckCard({ deck, locale, t }: DeckProps) {
  const href = withMarketingLocale(locale, `/flashcards/${deck.slug}`);

  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-success-contrast)]">
          <ShieldCheck className="h-3 w-3" aria-hidden />
          Trust labelled
        </span>
        <span className="inline-flex items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
          Verify before clinical use
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <Link
          href={href}
          className="text-base font-semibold leading-snug text-[var(--theme-heading-text)] hover:text-[var(--semantic-brand)] hover:underline"
        >
          {deck.title}
        </Link>
        <span
          className={`ml-auto shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            deck.cardCount > 0
              ? "border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] text-[var(--semantic-success-contrast)]"
              : "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--theme-muted-text)]"
          }`}
        >
          {t("pages.publicFlashcardsHub.deckCardLine", { count: deck.cardCount })}
        </span>
      </div>

      {deck.description ? (
        <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">{deck.description}</p>
      ) : null}

      {deck.lessonSource ? (
        <p className="mt-2 text-xs font-medium text-[var(--theme-muted-text)]">
          Based on lesson:{" "}
          <Link href={withMarketingLocale(locale, `/lessons?q=${encodeURIComponent(deck.lessonSource.name)}`)} className="underline underline-offset-2 hover:text-[var(--semantic-brand)]">
            {deck.lessonSource.name}
          </Link>
        </p>
      ) : null}

      {deck.sampleFront ? (
        <div className="mt-4 flex-1 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
            {t("pages.publicFlashcardsHub.sampleCardBadge")}
          </p>
          <p className="text-sm leading-6 text-[var(--theme-heading-text)]">{deck.sampleFront}</p>
        </div>
      ) : (
        <div className="mt-4 flex-1" />
      )}

      <div className="mt-5 border-t border-[var(--semantic-border-soft)] pt-4">
        <Link
          href={href}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
        >
          Study this deck
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
