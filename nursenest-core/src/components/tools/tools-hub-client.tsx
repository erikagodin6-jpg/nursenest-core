"use client";

import Link from "next/link";
import { Calculator, Droplets, Activity, Shield } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getAllToolSlugs } from "@/lib/tools/tool-registry";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

function cardKeyPrefix(slug: string): string {
  if (slug === "med-math") return "medMath";
  if (slug === "lab-values") return "labValues";
  if (slug === "electrolyte-abg") return "electrolyteAbg";
  if (slug === "iv-infusion") return "ivInfusion";
  if (slug === "transfusion-safety") return "transfusionSafety";
  return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

const ICONS = {
  "med-math": Calculator,
  "lab-values": Droplets,
  "electrolyte-abg": Activity,
  "iv-infusion": Droplets,
  "transfusion-safety": Shield,
} as const;

const ICON_ACCENT: Record<string, string> = {
  "med-math": "var(--semantic-chart-2)",
  "lab-values": "var(--semantic-info)",
  "electrolyte-abg": "var(--semantic-chart-4)",
  "iv-infusion": "var(--semantic-chart-3)",
  "transfusion-safety": "var(--semantic-warning)",
};

export function ToolsHubClient() {
  const { t, locale } = useMarketingI18n();
  const slugs = getAllToolSlugs();

  return (
    <section className="nn-premium-tools-hub nn-tools-marketing-hero relative isolate overflow-x-clip border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pb-14 lg:px-8">
        <header className="mb-10 text-center sm:text-left" data-testid="marketing-tools-hub">
          <h1 className="nn-marketing-h1">{t("tools.hub.title")}</h1>
          <p className="nn-marketing-lead mx-auto mt-4 max-w-2xl text-[var(--theme-muted-text)] sm:mx-0">
            {t("tools.hub.subtitle")}
          </p>
        </header>
        <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {slugs.map((slug) => {
            const Icon = ICONS[slug as keyof typeof ICONS] ?? Calculator;
            const href = withMarketingLocale(locale, `/tools/${slug}`);
            const accent = ICON_ACCENT[slug] ?? "var(--semantic-brand)";
            return (
              <li key={slug}>
                <Link
                  href={href}
                  className="nn-premium-tools-hub-card nn-tools-hub-card group flex min-h-[5.5rem] gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] p-5 shadow-[var(--elevation-rest)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--border))] hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)]"
                  onClick={() =>
                    trackClientEvent(PH.marketingToolOpenClick, {
                      actor: "anonymous",
                      tool_slug: slug,
                    })
                  }
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))]"
                    style={{
                      background: `color-mix(in srgb, ${accent} 14%, var(--semantic-surface))`,
                      color: accent,
                    }}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="nn-marketing-h4 text-[var(--palette-heading)]">{t(`tools.card.${cardKeyPrefix(slug)}.title`)}</h2>
                    <p className="nn-marketing-body-sm mt-1 text-[var(--palette-text-muted)]">
                      {t(`tools.card.${cardKeyPrefix(slug)}.desc`)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="nn-marketing-caption mt-10 text-center sm:text-left">{t("tools.disclaimer")}</p>
      </div>
    </section>
  );
}
