"use client";

import { GraduationCap, Gem, Wallet } from "lucide-react";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";

type Props = {
  questionCount: number;
  registeredLearners: number;
};

function formatCount(n: number, locale: string): string {
  if (n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
}

const BLOCKS = [
  {
    id: "pass",
    icon: GraduationCap,
    iconColor: "var(--semantic-success)",
    borderAccent: "var(--semantic-success)",
  },
  {
    id: "quality",
    icon: Gem,
    iconColor: "var(--semantic-info)",
    borderAccent: "var(--semantic-info)",
  },
  {
    id: "value",
    icon: Wallet,
    iconColor: "var(--semantic-brand)",
    borderAccent: "var(--semantic-brand)",
  },
] as const;

/**
 * Direct answers to top pre-purchase fears — placed after the sample question, before audience cards.
 */
export function HomeTrustFearsSection({ questionCount, registeredLearners }: Props) {
  const { locale, t } = useMarketingI18n();
  const q = formatCount(questionCount, locale);
  const learners = formatCount(registeredLearners, locale);

  const passBody = q
    ? formatSentenceCase(t("pages.home.trustFears.pass.bodyWithStats", { count: q }), locale)
    : formatSentenceCase(t("pages.home.trustFears.pass.bodyNoStats"), locale);
  const valueBody = learners
    ? formatSentenceCase(t("pages.home.trustFears.value.bodyWithStats", { count: learners }), locale)
    : formatSentenceCase(t("pages.home.trustFears.value.bodyNoStats"), locale);

  const bodies: Record<(typeof BLOCKS)[number]["id"], string> = {
    pass: passBody,
    quality: formatSentenceCase(t("pages.home.trustFears.quality.body"), locale),
    value: valueBody,
  };

  return (
    <section
      className="nn-section-block scroll-mt-20 border-b border-[var(--border-subtle)] bg-[var(--page-bg)]"
      aria-labelledby="home-trust-fears-heading"
      data-testid="section-home-trust-fears"
    >
      <div className="nn-section-shell py-10 sm:py-11">
        <FadeUp whenInView once viewMargin="-28px" className="mx-auto mb-8 max-w-2xl text-center">
          <p className="nn-marketing-eyebrow text-[var(--semantic-brand)]">
            {formatTitleCase(t("pages.home.trustFears.eyebrow"), locale)}
          </p>
          <h2 id="home-trust-fears-heading" className="nn-marketing-h2 mt-2 text-balance text-[var(--palette-heading)]">
            {formatTitleCase(t("pages.home.trustFears.heading"), locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty text-[var(--palette-text-muted)]">
            {formatSentenceCase(t("pages.home.trustFears.subheading"), locale)}
          </p>
        </FadeUp>

        <StaggerGroup className="grid gap-5 md:grid-cols-3" whenInView once viewMargin="-36px">
          {BLOCKS.map((block, idx) => {
            const Icon = block.icon;
            return (
              <StaggerItem key={block.id} variant={idx === 1 ? "softReveal" : "fadeUp"} className="min-w-0">
                <article
                  className="flex h-full flex-col gap-3 rounded-2xl border bg-[var(--bg-card)] p-5 shadow-[var(--shadow-elevated)] sm:p-6"
                  style={{
                    borderColor: `color-mix(in srgb, ${block.borderAccent} 20%, var(--border-subtle))`,
                    borderTopWidth: 3,
                    borderTopColor: block.borderAccent,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                      style={{
                        background: `color-mix(in srgb, ${block.iconColor} 12%, var(--bg-card))`,
                        borderColor: `color-mix(in srgb, ${block.iconColor} 28%, var(--border-subtle))`,
                      }}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" style={{ color: block.iconColor }} />
                    </span>
                    <h3 className="nn-marketing-h3 text-balance leading-snug text-[var(--palette-heading)]">
                      {formatTitleCase(t(`pages.home.trustFears.${block.id}.question`), locale)}
                    </h3>
                  </div>
                  <p className="nn-marketing-body-sm flex-grow leading-relaxed text-[var(--theme-muted-text)]">
                    {bodies[block.id]}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
