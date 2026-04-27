"use client";

import { Star } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { safeHomepageMarketingCopy } from "@/lib/marketing/homepage-safe-copy";

const CARD_KEYS = [
  { quote: "home.landing.reviews.card1.quote", meta: "home.landing.reviews.card1.meta" },
  { quote: "home.landing.reviews.card2.quote", meta: "home.landing.reviews.card2.meta" },
  { quote: "home.landing.reviews.card3.quote", meta: "home.landing.reviews.card3.meta" },
  { quote: "home.landing.reviews.card4.quote", meta: "home.landing.reviews.card4.meta" },
  { quote: "home.landing.reviews.card5.quote", meta: "home.landing.reviews.card5.meta" },
  { quote: "home.landing.reviews.card6.quote", meta: "home.landing.reviews.card6.meta" },
] as const;

const REVIEW_FB: Record<string, string> = {
  "home.landing.reviews.title": "How learners structure study",
  "home.landing.reviews.sub":
    "Typical workflows: rationales tied to stems, pathway lessons, practice exams, and weak-area review, with US and Canada wording where registration differs.",
  "home.landing.reviews.disclaimer":
    "Composite, anonymized study scenarios for illustration—not paid testimonials or guaranteed outcomes.",
  "home.landing.reviews.card1.quote":
    "I stopped guessing on SATA. The rationales tie each option back to the stem, and the lesson links are the fastest way to patch a weak topic before I start another block.",
  "home.landing.reviews.card1.meta": "RN candidate, NCLEX-RN, United States",
  "home.landing.reviews.card2.quote":
    "Clinical days eat my week, so I study in short runs. Flashcards for labs and a timed practice exam on the commute keep me honest without another app stack.",
  "home.landing.reviews.card2.meta": "PN student, NCLEX-PN, United States",
  "home.landing.reviews.card3.quote":
    "REx-PN is not recycled US NCLEX-PN copy. I needed Canadian scope and wording in the stems, then practice exams and weak-area review that stay inside the right exam.",
  "home.landing.reviews.card3.meta": "LPN/RPN candidate, REx-PN, Canada",
  "home.landing.reviews.card4.quote":
    "I lean on long rationales to check my reasoning, then open the lesson when I miss the same concept twice. It feels like closing gaps, not collecting screenshots.",
  "home.landing.reviews.card4.meta": "NP student, board-style prep, United States",
  "home.landing.reviews.card5.quote":
    "When my scores stall I pair the bank with the lesson library and stay inside the pathway I registered for, instead of drifting into random trivia.",
  "home.landing.reviews.card5.meta": "RN candidate, NCLEX-RN, Canada",
  "home.landing.reviews.card6.quote":
    "Med math and safety were my panic zone. I use practice exams for pacing, then flashcards and rationales until the calculations feel automatic.",
  "home.landing.reviews.card6.meta": "Career changer, NCLEX-RN, United States",
};

function pickReviewFb(key: string): string {
  return REVIEW_FB[key] ?? "";
}

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
  const { t, locale } = useMarketingI18n();

  return (
    <section
      className="nn-section-block nn-section-enter border-t border-[var(--border)] bg-[var(--page-bg)]"
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
            {safeHomepageMarketingCopy(t, "home.landing.reviews.title", pickReviewFb("home.landing.reviews.title"))}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {safeHomepageMarketingCopy(t, "home.landing.reviews.sub", pickReviewFb("home.landing.reviews.sub"))}
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_KEYS.map((c) => (
            <li
              key={c.quote}
              className="nn-card-system nn-card-system-pad nn-card-system--interactive border-t-2 border-t-[color-mix(in_srgb,var(--palette-primary)_45%,transparent)]"
            >
              <p className="nn-card-system__eyebrow">{formatEyebrow("Student Review", locale)}</p>
              <StarRow />
              <blockquote className="nn-card-system__description flex-1 text-[var(--palette-text)]">
                &ldquo;
                {formatSentenceCase(safeHomepageMarketingCopy(t, c.quote, pickReviewFb(c.quote)), locale)}
                &rdquo;
              </blockquote>
              <p className="nn-card-system__title text-[0.92rem] text-[var(--palette-text-muted)]">
                {formatTitleCase(safeHomepageMarketingCopy(t, c.meta, pickReviewFb(c.meta)), locale)}
              </p>
            </li>
          ))}
        </ul>
        <p className="nn-marketing-caption mx-auto mt-8 max-w-2xl text-center text-[var(--palette-text-muted)]">
          {safeHomepageMarketingCopy(t, "home.landing.reviews.disclaimer", pickReviewFb("home.landing.reviews.disclaimer"))}
        </p>
      </div>
    </section>
  );
}
