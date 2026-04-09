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

/**
 * Testimonials directly under the platform carousel. Copy is static scenarios, not a live feed.
 */
export function HomeReviewsSection() {
  const { t } = useMarketingI18n();

  return (
    <section
      className="border-t border-[var(--border-subtle)] bg-[var(--theme-page-bg)] pt-7 pb-10 md:pt-9 md:pb-12"
      aria-labelledby="home-reviews-heading"
      data-testid="section-home-reviews"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-6 max-w-3xl text-center md:mb-8">
          <h2 id="home-reviews-heading" className="nn-marketing-h2 text-balance">
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
              className="nn-card-soft nn-marketing-card-pad flex flex-col border-t-2 border-t-[color-mix(in_srgb,var(--theme-primary)_45%,transparent)]"
            >
              <blockquote className="nn-marketing-body-sm flex-1 text-pretty text-[var(--theme-body-text)]">
                &ldquo;{t(c.quote)}&rdquo;
              </blockquote>
              <p className="nn-marketing-caption mt-3 text-[var(--theme-muted-text)]">{t(c.meta)}</p>
            </li>
          ))}
        </ul>
        <p className="nn-marketing-caption mx-auto mt-8 max-w-2xl text-center text-[var(--theme-muted-text)]">
          {t("home.landing.reviews.disclaimer")}
        </p>
      </div>
    </section>
  );
}
