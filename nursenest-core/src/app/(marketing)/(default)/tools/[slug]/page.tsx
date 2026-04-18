import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolsToolShell } from "@/components/tools/tools-tool-shell";
import { ToolSeoArticle } from "@/components/tools/tool-seo-article";
import { isToolSlug } from "@/lib/tools/tool-registry";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 86400;

async function metaForSlug(
  slug: string,
  enMessages: MarketingMessages,
): Promise<{ title: string; description: string } | null> {
  if (slug === "med-math") {
    return {
      title: enMessages["tools.medMath.metaTitle"] ?? "Medication math",
      description: enMessages["tools.medMath.metaDescription"] ?? "",
    };
  }
  if (slug === "lab-values") {
    return {
      title: enMessages["tools.labValues.metaTitle"] ?? "Lab values",
      description: enMessages["tools.labValues.metaDescription"] ?? "",
    };
  }
  if (slug === "electrolyte-abg") {
    return {
      title: enMessages["tools.electrolyteAbg.metaTitle"] ?? "Electrolyte & ABG",
      description: enMessages["tools.electrolyteAbg.metaDescription"] ?? "",
    };
  }
  if (slug === "iv-infusion") {
    return {
      title: enMessages["tools.ivInfusion.metaTitle"] ?? "IV & infusion",
      description: enMessages["tools.ivInfusion.metaDescription"] ?? "",
    };
  }
  if (slug === "transfusion-safety") {
    return {
      title: enMessages["tools.transfusionSafety.metaTitle"] ?? "Transfusion safety",
      description: enMessages["tools.transfusionSafety.metaDescription"] ?? "",
    };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/tools/${slug}`;
  return safeGenerateMetadata(
    async () => {
      const enMessages = await loadMarketingMetadataMessages(
        DEFAULT_MARKETING_LOCALE,
        [
          "tools.medMath.metaTitle",
          "tools.medMath.metaDescription",
          "tools.labValues.metaTitle",
          "tools.labValues.metaDescription",
          "tools.electrolyteAbg.metaTitle",
          "tools.electrolyteAbg.metaDescription",
          "tools.ivInfusion.metaTitle",
          "tools.ivInfusion.metaDescription",
          "tools.transfusionSafety.metaTitle",
          "tools.transfusionSafety.metaDescription",
        ],
        MARKETING_CHROME_MESSAGE_SHARDS,
      );
      const m = await metaForSlug(slug, enMessages);
      if (!m) return {};
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, `/tools/${slug}`);
      return {
        title: m.title,
        description: m.description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title: m.title, description: m.description, url: alt.canonical, type: "website" },
      };
    },
    { pathname, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.tools.slug" },
  );
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  if (!isToolSlug(slug)) notFound();
  return (
    <>
      <ToolsToolShell slug={slug} />
      <ToolSeoArticle slug={slug} />
    </>
  );
}
