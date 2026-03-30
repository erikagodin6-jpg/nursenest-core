import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolsToolShell } from "@/components/tools/tools-tool-shell";
import { isToolSlug } from "@/lib/tools/tool-registry";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { absoluteUrl } from "@/lib/seo/site-origin";

type Props = { params: Promise<{ slug: string }> };

async function metaForSlug(
  slug: string,
  enMessages: MarketingMessages,
): Promise<{ title: string; description: string; canonical: string } | null> {
  if (slug === "med-math") {
    return {
      title: enMessages["tools.medMath.metaTitle"] ?? "Medication math",
      description: enMessages["tools.medMath.metaDescription"] ?? "",
      canonical: absoluteUrl(`/tools/${slug}`),
    };
  }
  if (slug === "lab-values") {
    return {
      title: enMessages["tools.labValues.metaTitle"] ?? "Lab values",
      description: enMessages["tools.labValues.metaDescription"] ?? "",
      canonical: absoluteUrl(`/tools/${slug}`),
    };
  }
  if (slug === "electrolyte-abg") {
    return {
      title: enMessages["tools.electrolyteAbg.metaTitle"] ?? "Electrolyte & ABG",
      description: enMessages["tools.electrolyteAbg.metaDescription"] ?? "",
      canonical: absoluteUrl(`/tools/${slug}`),
    };
  }
  if (slug === "iv-infusion") {
    return {
      title: enMessages["tools.ivInfusion.metaTitle"] ?? "IV & infusion",
      description: enMessages["tools.ivInfusion.metaDescription"] ?? "",
      canonical: absoluteUrl(`/tools/${slug}`),
    };
  }
  if (slug === "transfusion-safety") {
    return {
      title: enMessages["tools.transfusionSafety.metaTitle"] ?? "Transfusion safety",
      description: enMessages["tools.transfusionSafety.metaDescription"] ?? "",
      canonical: absoluteUrl(`/tools/${slug}`),
    };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const enMessages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const m = await metaForSlug(slug, enMessages);
  if (!m) return {};
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: m.canonical },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  if (!isToolSlug(slug)) notFound();
  return <ToolsToolShell slug={slug} />;
}
