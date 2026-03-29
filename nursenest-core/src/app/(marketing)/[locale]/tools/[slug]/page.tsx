import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolsToolShell } from "@/components/tools/tools-tool-shell";
import { isToolSlug } from "@/lib/tools/tool-registry";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

type Props = { params: Promise<{ locale: string; slug: string }> };

function keysForSlug(slug: string): { title: string; desc: string } | null {
  if (slug === "med-math") return { title: "tools.medMath.metaTitle", desc: "tools.medMath.metaDescription" };
  if (slug === "lab-values") return { title: "tools.labValues.metaTitle", desc: "tools.labValues.metaDescription" };
  if (slug === "electrolyte-abg") return { title: "tools.electrolyteAbg.metaTitle", desc: "tools.electrolyteAbg.metaDescription" };
  if (slug === "iv-infusion") return { title: "tools.ivInfusion.metaTitle", desc: "tools.ivInfusion.metaDescription" };
  if (slug === "transfusion-safety") return { title: "tools.transfusionSafety.metaTitle", desc: "tools.transfusionSafety.metaDescription" };
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const k = keysForSlug(slug);
  if (!k) return {};
  const m = await loadMarketingMessages(locale);
  return {
    title: m[k.title],
    description: m[k.desc],
    alternates: { canonical: `/${locale}/tools/${slug}` },
  };
}

export default async function LocalizedToolPage({ params }: Props) {
  const { slug } = await params;
  if (!isToolSlug(slug)) notFound();
  return <ToolsToolShell slug={slug} />;
}
