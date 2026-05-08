"use client";

import { BadgeCheck, GraduationCap, ShieldCheck } from "lucide-react";

import { BrandTrustInline } from "@/components/brand/brand-trust-inline";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";

const TRUST_CARDS = [
  {
    id: "rn" as const,
    icon: BadgeCheck,
    quote: "The platform tells me what to review next instead of leaving me to guess from a giant queue.",
    name: "RN candidate",
    badge: "Licensure prep learner",
  },
  {
    id: "pn" as const,
    icon: ShieldCheck,
    quote:
      "Rationales walk through the clinical decision like an instructor at the bedside, not just 'correct / incorrect.'",
    name: "PN learner",
    badge: "Practice question focus",
  },
  {
    id: "np" as const,
    icon: GraduationCap,
    quote:
      "Lessons, flashcards, and CAT-style feels like one study system instead of three disconnected apps.",
    name: "NP candidate",
    badge: "Graduate-level pathway",
  },
] as const;

export function PremiumHomepageTrust() {
  const { t } = useMarketingI18n();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--trust border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-homepage-trust-heading"
      data-testid="section-premium-homepage-trust"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">
            {tr("pages.home.premium.trust.eyebrow", "Learner experience")}
          </p>
          <h2 id="premium-homepage-trust-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
            {tr("pages.home.premium.trust.heading", "Calm focus beats last-minute cramming.")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {tr(
              "pages.home.premium.trust.body",
              "Representative feedback from exam candidates—not outcome guarantees. Content stays exam-scoped with conservative claims.",
            )}
          </p>
          <BrandTrustInline variant="prep" className="mt-5 justify-center text-center" />
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {TRUST_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.id} className="nn-premium-trust-card rounded-2xl border p-5">
                <div className="flex items-center gap-2 text-[var(--semantic-warning)]" aria-label="Five star sentiment">
                  <span className="font-black tracking-wide">★★★★★</span>
                </div>
                <p className="nn-marketing-body-sm mt-4 text-pretty text-[var(--palette-text-muted)]">
                  &ldquo;
                  {tr(`pages.home.premium.trust.cards.${card.id}.quote`, card.quote)}
                  &rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="nn-premium-trust-card__avatar" aria-hidden>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-[var(--palette-heading)]">
                      {tr(`pages.home.premium.trust.cards.${card.id}.name`, card.name)}
                    </span>
                    <span className="block text-xs font-bold text-[var(--palette-text-muted)]">
                      {tr(`pages.home.premium.trust.cards.${card.id}.badge`, card.badge)}
                    </span>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
