"use client";

import { Brain, Crosshair, Scale, ShieldCheck } from "lucide-react";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";

const POINT_KEYS = ["card0", "card1", "card2", "card3"] as const;
const POINT_META: Record<
  (typeof POINT_KEYS)[number],
  { icon: typeof Brain; iconColor: string }
> = {
  card0: { icon: Brain, iconColor: "var(--semantic-info)" },
  card1: { icon: ShieldCheck, iconColor: "var(--semantic-success)" },
  card2: { icon: Scale, iconColor: "var(--semantic-warning)" },
  card3: { icon: Crosshair, iconColor: "var(--semantic-brand)" },
};

/**
 * Differentiation section: four colorful feature cards, each with a unique semantic icon color.
 * Tinted surface separates this visually from adjacent white card sections.
 */
export function HomeTrustProofSection() {
  const { locale, t } = useMarketingI18n();

  return (
    <section
      className="nn-section-block nn-section-enter border-y border-[var(--trust-surface-border)] bg-[var(--trust-surface)]"
      aria-labelledby="home-differentiation-heading"
      data-testid="section-home-differentiation"
    >
      <div className="nn-section-shell">
        <FadeUp whenInView once viewMargin="-32px" className="mx-auto mb-12 max-w-2xl text-center">
          <h2 id="home-differentiation-heading" className="nn-marketing-h2 text-balance">
            {formatTitleCase(t("pages.home.differentiation.title"), locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-[var(--palette-text-muted)]">
            {formatSentenceCase(t("pages.home.differentiation.subtitle"), locale)}
          </p>
        </FadeUp>

        <div
          className="mx-auto mb-10 grid max-w-3xl gap-3 sm:grid-cols-2 sm:gap-4"
          data-testid="section-home-differentiation-contrast"
        >
          <div
            className="rounded-xl border p-4 text-left sm:p-5"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-border-soft) 1, var(--border-subtle))",
              background: "color-mix(in srgb, var(--semantic-panel-cool) 10%, var(--bg-card))",
            }}
          >
            <p className="nn-marketing-caption font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">
              {formatTitleCase(t("pages.home.differentiation.contrastGenericLabel"), locale)}
            </p>
            <p className="nn-marketing-body-sm mt-2 leading-relaxed text-[var(--palette-text)]">
              {formatSentenceCase(t("pages.home.differentiation.contrastGenericLine"), locale)}
            </p>
          </div>
          <div
            className="rounded-xl border p-4 text-left sm:p-5"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-success) 24%, var(--semantic-border-soft))",
              background: "color-mix(in srgb, var(--semantic-panel-positive) 08%, var(--bg-card))",
            }}
          >
            <p className="nn-marketing-caption font-bold uppercase tracking-wide text-[var(--semantic-success)]">
              {formatTitleCase(t("pages.home.differentiation.contrastNnLabel"), locale)}
            </p>
            <p className="nn-marketing-body-sm mt-2 leading-relaxed text-[var(--palette-text)]">
              {formatSentenceCase(t("pages.home.differentiation.contrastNnLine"), locale)}
            </p>
          </div>
        </div>

        <StaggerGroup className="grid gap-5 md:grid-cols-2" whenInView once viewMargin="-40px">
          {POINT_KEYS.map((key, idx) => {
            const meta = POINT_META[key];
            const Icon = meta.icon;
            const title = t(`pages.home.differentiation.${key}.title`);
            return (
              <StaggerItem key={key} variant={idx % 2 === 0 ? "fadeUp" : "softReveal"} className="min-w-0">
              <article
                className="flex h-full gap-4 rounded-2xl border bg-[var(--bg-card)] p-6 shadow-[var(--shadow-elevated)] transition-[box-shadow,border-color] duration-200 ease-[var(--motion-ease)] hover:border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border-subtle))]"
                style={{
                  borderColor: `color-mix(in srgb, ${meta.iconColor} 18%, var(--border-subtle))`,
                  borderTop: `3px solid ${meta.iconColor}`,
                }}
              >
                <span
                  className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    background: `color-mix(in srgb, ${meta.iconColor} 10%, var(--bg-card))`,
                    borderColor: `color-mix(in srgb, ${meta.iconColor} 24%, var(--border-subtle))`,
                  }}
                  aria-hidden
                >
                  <Icon className="h-5 w-5" style={{ color: meta.iconColor }} />
                </span>
                <div className="min-w-0">
                  <h3 className="nn-marketing-h3 mb-1.5" style={{ color: "var(--palette-heading)" }}>
                    {formatTitleCase(title, locale)}
                  </h3>
                  <p className="nn-marketing-body-sm text-[var(--theme-muted-text)]">
                    {formatSentenceCase(t(`pages.home.differentiation.${key}.body`), locale)}
                  </p>
                </div>
              </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
