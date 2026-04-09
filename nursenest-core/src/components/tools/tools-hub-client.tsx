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

export function ToolsHubClient() {
  const { t, locale } = useMarketingI18n();
  const slugs = getAllToolSlugs();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">{t("tools.hub.title")}</h1>
        <p className="mt-3 text-lg text-[var(--theme-muted-text)]">{t("tools.hub.subtitle")}</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {slugs.map((slug) => {
          const Icon = ICONS[slug as keyof typeof ICONS] ?? Calculator;
          const href = withMarketingLocale(locale, `/tools/${slug}`);
          return (
            <li key={slug}>
              <Link
                href={href}
                className="flex gap-4 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
                onClick={() =>
                  trackClientEvent(PH.marketingToolOpenClick, {
                    actor: "anonymous",
                    tool_slug: slug,
                  })
                }
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-[var(--theme-heading-text)]">{t(`tools.card.${cardKeyPrefix(slug)}.title`)}</h2>
                  <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{t(`tools.card.${cardKeyPrefix(slug)}.desc`)}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-10 text-xs text-[var(--theme-muted-text)]">{t("tools.disclaimer")}</p>
    </div>
  );
}
