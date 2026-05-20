import { redirect } from "next/navigation";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";

type Props = { params: Promise<{ locale: string }> };

/**
 * `/{country}/rn` shortcut — only country segments (`us`, `canada`) are valid here.
 * Non-country values (e.g. i18n `en`) resolve to the US RN hub so we never emit `/en/rn/nclex-rn`.
 */
export default async function RnShortcutPage({ params }: Props) {
  const { locale } = await params;
  const segment = locale.trim().toLowerCase();
  const destination =
    segment === "canada" || segment === "ca" ? CANONICAL_PATHWAY_HUB.caRn : CANONICAL_PATHWAY_HUB.usRn;
  redirect(destination);
}
