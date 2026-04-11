"use client";

import { Star } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const CARD_KEYS = [
  { quote: "home.landing.reviews.card1.quote", meta: "home.landing.reviews.card1.meta" },
  { quote: "home.landing.reviews.card2.quote", meta: "home.landing.reviews.card2.meta" },
  { quote: "home.landing.reviews.card3.quote", meta: "home.landing.reviews.card3.meta" },
  { quote: "home.landing.reviews.card4.quote", meta: "home.landing.reviews.card4.meta" },
  { quote: "home.landing.reviews.card5.quote", meta: "home.landing.reviews.card5.meta" },
  { quote: "home.landing.reviews.card6.quote", meta: "home.landing.reviews.card6.meta" },
] as const;

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="mb-2 flex gap-0.5" aria-label={`${count} out of 5 stars`} role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`nn-icon-md ${i < count ? "fill-[var(--semantic-warning)] text-[var(--semantic-warning)]" : "text-[var(--border-subtle)]"}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

/**
 * Testimonials with star ratings, directly under the platform carousel.
 * Copy is static scenarios, not a live feed.
 */
export function HomeReviewsSection() {
  const { t } = useMarketingI18n();

  return (
    <section
      className="nn-section-block nn-section-enter border-t border-[var(--border-subtle)] bg-[var(--bg-page)]"
      aria-labelledby="home-reviews-heading"
      data-testid="section-home-reviews"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-6 max-w-3xl text-center md:mb-8">
          {/* Aggregate star display */}
          <div className="mb-3 flex items-center justify-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="nn-icon-lg fill-[var(--semantic-warning)] text-[var(--semantic-warning)]"
                aria-hidden
              />
            ))}
            <span className="nn-marketing-body-sm ml-1.5 font-semibold tabular-nums text-[var(--palette-text)]">
              4.8 / 5
            </span>
            <span className="nn-marketing-caption text-[var(--palette-text-muted)]">from nursing students</span>
          </div>

          <h2 id="home-reviews-heading" className="nn-marketing-h2 text-balance">
            {t("home.landing.reviews.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {t("home.landing.reviews.sub")}
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_KEYS.map((c) => (
            <li
              key={c.quote}
              className="nn-card-soft nn-marketing-card-pad nn-card-interactive flex flex-col border-t-2 border-t-[color-mix(in_srgb,var(--palette-primary)_45%,transparent)]"
            >
              <StarRow />
              <blockquote className="nn-marketing-body-sm flex-1 text-pretty text-[var(--palette-text)]">
                &ldquo;{t(c.quote)}&rdquo;
              </blockquote>
              <p className="nn-marketing-caption mt-3 text-[var(--palette-text-muted)]">{t(c.meta)}</p>
            </li>
          ))}
        </ul>
        <p className="nn-marketing-caption mx-auto mt-8 max-w-2xl text-center text-[var(--palette-text-muted)]">
          {t("home.landing.reviews.disclaimer")}
        </p>
      </div>
    </section>
  );
}
