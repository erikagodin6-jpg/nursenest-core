"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { ToolSlug } from "@/lib/tools/tool-registry";
import { ToolLazyView } from "@/components/tools/tool-lazy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

function titleKey(slug: ToolSlug): string {
  switch (slug) {
    case "med-math":
      return "tools.medMath.title";
    case "lab-values":
      return "tools.labValues.title";
    case "electrolyte-abg":
      return "tools.electrolyteAbg.title";
    case "iv-infusion":
      return "tools.ivInfusion.title";
    case "transfusion-safety":
      return "tools.transfusionSafety.title";
    default:
      return "tools.hub.title";
  }
}

export function ToolsToolShell({ slug }: { slug: ToolSlug }) {
  const { t, locale } = useMarketingI18n();
  const hub = withMarketingLocale(locale, "/tools");

  return (
    <div
      className="nn-premium-tool-page mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8"
      data-testid={`marketing-tool-${slug}`}
      data-marketing-tool-slug={slug}
    >
      <Link
        href={hub}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-[var(--elevation-rest)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--border))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)]"
      >
        <ArrowLeft className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
        {t("tools.hub.back")}
      </Link>
      <header className="mb-8">
        <h1 className="nn-marketing-h2 text-[var(--palette-heading)]">{t(titleKey(slug))}</h1>
      </header>
      <div className="nn-premium-tools-calculator-wrap nn-tools-calculator-surface p-5 sm:p-8">
        <ToolLazyView slug={slug} />
      </div>
    </div>
  );
}
