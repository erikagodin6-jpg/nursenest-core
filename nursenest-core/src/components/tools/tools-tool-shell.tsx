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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href={hub} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        {t("tools.hub.back")}
      </Link>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">{t(titleKey(slug))}</h1>
      </header>
      <ToolLazyView slug={slug} />
    </div>
  );
}
