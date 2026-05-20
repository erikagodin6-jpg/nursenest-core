import { BadgeCheck, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";

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

/** Resolve a key from a flat messages record with an English fallback. */
function pickMsg(messages: Record<string, string>, key: string, fallback: string): string {
  const v = messages[key]?.trim();
  return v && v.length > 0 ? v : fallback;
}

/**
 * Server-safe inline trust bullet list — receives pre-split points as a prop.
 * No hooks; avoids pulling client context into a server component.
 */
function BrandTrustInlineServer({
  points,
  className = "",
}: {
  points: string[];
  className?: string;
}) {
  if (!points.length) return null;
  return (
    <ul
      className={`flex flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1 ${className}`}
      role="list"
    >
      {points.map((part) => (
        <li key={part} className="flex items-center gap-1.5">
          <CheckCircle2
            className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-success)]"
            aria-hidden
          />
          <span>{part}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Server Component — zero browser APIs, no state, no effects.
 *
 * Receives pre-computed i18n messages from the parent server component.
 * The BrandTrustInline trust bullets are also rendered server-side via
 * BrandTrustInlineServer (no hooks version of the client BrandTrustInline).
 */
export function PremiumHomepageTrust({
  messages,
}: {
  messages: Record<string, string>;
}) {
  const tr = (key: string, fallback: string) => pickMsg(messages, key, fallback);

  // Trust bullet list — split the same way BrandTrustInline does client-side
  const trustText = pickMsg(messages, "brand.trust.prep", "");
  const trustPoints = trustText
    .split(" · ")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--trust nn-marketing-brand-leaf-band border-b border-[var(--border-subtle)]"
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
          <BrandTrustInlineServer points={trustPoints} className="mt-5 justify-center text-center" />
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
