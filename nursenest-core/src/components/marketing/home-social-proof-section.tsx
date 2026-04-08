"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

const CARD_KEYS = [
  { quote: "home.landing.reviews.card1.quote", meta: "home.landing.reviews.card1.meta" },
  { quote: "home.landing.reviews.card2.quote", meta: "home.landing.reviews.card2.meta" },
  { quote: "home.landing.reviews.card3.quote", meta: "home.landing.reviews.card3.meta" },
  { quote: "home.landing.reviews.card4.quote", meta: "home.landing.reviews.card4.meta" },
  { quote: "home.landing.reviews.card5.quote", meta: "home.landing.reviews.card5.meta" },
  { quote: "home.landing.reviews.card6.quote", meta: "home.landing.reviews.card6.meta" },
] as const;

const CHIP_KEYS = [
  "home.landing.socialProof.chip.rationales",
  "home.landing.socialProof.chip.lessons",
  "home.landing.socialProof.chip.flashcards",
  "home.landing.socialProof.chip.practiceExams",
  "home.landing.socialProof.chip.weakArea",
  "home.landing.socialProof.chip.region",
] as const;

/**
 * Single block under the platform carousel: testimonials plus compact study-area chips.
 * Not a second duplicate social-proof region elsewhere on the page.
 */
export function HomeSocialProofSection() {
  const { t } = useMarketingI18n();

  return (
    <section
      id="home-social-proof"
      className="border-t border-[var(--border-subtle)] bg-[var(--theme-page-bg)] pt-7 pb-10 md:pt-9 md:pb-12"
      aria-labelledby="home-social-proof-reviews-heading"
      data-testid="section-home-social-proof"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-6 max-w-3xl text-center md:mb-8">
          <h2 id="home-social-proof-reviews-heading" className="nn-marketing-h2 text-balance">
            {t("home.landing.reviews.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.landing.reviews.sub")}
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_KEYS.map((c) => (
            <li
              key={c.quote}
              className="nn-marketing-card nn-marketing-card-pad flex flex-col border-t-2 border-t-[color-mix(in_srgb,var(--theme-primary)_45%,transparent)] shadow-[var(--shadow-elevated)]"
            >
              <blockquote className="nn-marketing-body-sm flex-1 text-pretty text-[var(--theme-body-text)]">
                &ldquo;{t(c.quote)}&rdquo;
              </blockquote>
              <p className="nn-marketing-caption mt-3 text-[var(--theme-muted-text)]">{t(c.meta)}</p>
            </li>
          ))}
        </ul>

        <div
          className="mx-auto mt-10 max-w-4xl border-t border-[var(--border-subtle)] pt-8"
          aria-labelledby="home-social-proof-chips-heading"
        >
          <header className="mb-4 text-center">
            <h3 id="home-social-proof-chips-heading" className="nn-marketing-h3 text-balance">
              {t("home.landing.socialProof.chipsTitle")}
            </h3>
            <p className="nn-marketing-caption mx-auto mt-1.5 max-w-xl text-[var(--theme-muted-text)]">
              {t("home.landing.socialProof.chipsSub")}
            </p>
          </header>
          <ul className="flex flex-wrap justify-center gap-2">
            {CHIP_KEYS.map((key) => (
              <li key={key}>
                <span className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] px-3 py-1.5 text-left nn-marketing-body-sm text-[var(--theme-body-text)]">
                  {t(key)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
