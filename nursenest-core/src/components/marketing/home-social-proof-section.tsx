"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

const CARD_KEYS = [
  { quote: "home.landing.socialProof.card1.quote", meta: "home.landing.socialProof.card1.meta" },
  { quote: "home.landing.socialProof.card2.quote", meta: "home.landing.socialProof.card2.meta" },
  { quote: "home.landing.socialProof.card3.quote", meta: "home.landing.socialProof.card3.meta" },
  { quote: "home.landing.socialProof.card4.quote", meta: "home.landing.socialProof.card4.meta" },
  { quote: "home.landing.socialProof.card5.quote", meta: "home.landing.socialProof.card5.meta" },
  { quote: "home.landing.socialProof.card6.quote", meta: "home.landing.socialProof.card6.meta" },
] as const;

const CHIP_KEYS = [
  "home.landing.socialProof.chip.nclexRn",
  "home.landing.socialProof.chip.nclexPn",
  "home.landing.socialProof.chip.rexPn",
  "home.landing.socialProof.chip.np",
  "home.landing.socialProof.chip.flashcards",
  "home.landing.socialProof.chip.medMath",
  "home.landing.socialProof.chip.weakArea",
] as const;

/**
 * Static, believable study scenarios (not a live feed). Sits under the platform carousel.
 */
export function HomeSocialProofSection() {
  const { t } = useMarketingI18n();

  return (
    <section
      className="border-t border-[var(--border-subtle)] bg-[var(--theme-page-bg)] pt-8 pb-10 md:pt-10 md:pb-12"
      aria-labelledby="home-social-proof-heading"
      data-testid="section-home-social-proof"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-6 max-w-3xl text-center md:mb-8">
          <h2 id="home-social-proof-heading" className="nn-marketing-h2 text-balance">
            {t("home.landing.socialProof.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.landing.socialProof.sub")}
          </p>
        </header>

        <p className="nn-marketing-caption mb-3 text-center text-[var(--theme-muted-text)]">
          {t("home.landing.socialProof.chipsHeading")}
        </p>
        <ul className="mb-8 flex flex-wrap justify-center gap-2">
          {CHIP_KEYS.map((key) => (
            <li key={key}>
              <span className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] px-3 py-1.5 text-xs font-medium text-[var(--theme-body-text)] sm:text-sm">
                {t(key)}
              </span>
            </li>
          ))}
        </ul>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_KEYS.map((c) => (
            <li key={c.quote} className="nn-marketing-card nn-marketing-card-pad flex flex-col">
              <blockquote className="nn-marketing-body-sm flex-1 text-pretty text-[var(--theme-body-text)]">
                &ldquo;{t(c.quote)}&rdquo;
              </blockquote>
              <p className="nn-marketing-caption mt-3 text-[var(--theme-muted-text)]">{t(c.meta)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
