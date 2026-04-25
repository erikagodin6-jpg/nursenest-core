"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

function safeT(
  t: ((key: string) => string) | undefined,
  key: string,
  fallback: string
): string {
  try {
    const value = t?.(key);
    return typeof value === "string" && value.trim() ? value : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Soft friction-reduction band: what is free vs paid, without aggressive sales tone.
 * Fully defensive — never crashes if i18n is missing or broken.
 */
export function HomeConversionFreeAccessBand() {
  let t: ((key: string) => string) | undefined;

  try {
    t = useMarketingI18n()?.t;
  } catch {
    // fallback safe mode
  }

  return (
    <section
      className="border-b border-[var(--accent-surface-b-border)] bg-[var(--accent-surface-b)] py-8 md:py-10"
      aria-labelledby="home-free-access-heading"
      data-testid="section-home-free-access"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="home-free-access-heading"
          className="nn-marketing-h3 text-balance text-[var(--theme-heading-text)]"
        >
          {safeT(t, "home.conversion.freeAccess.title", "Start free. Upgrade when you’re ready.")}
        </h2>

        <p className="nn-marketing-body-sm mx-auto mt-3 max-w-2xl text-pretty text-[var(--theme-body-text)]">
          {safeT(
            t,
            "home.conversion.freeAccess.body",
            "Access lessons, flashcards, and practice questions at no cost. Unlock advanced tools as you progress."
          )}
        </p>

        <p className="nn-marketing-caption mx-auto mt-3 max-w-xl text-pretty text-[var(--theme-muted-text)]">
          {safeT(
            t,
            "home.conversion.freeAccess.tiersHint",
            "Free core access with optional premium tiers for deeper preparation."
          )}
        </p>
      </div>
    </section>
  );
}