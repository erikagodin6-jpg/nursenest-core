/**
 * Canada RN / NCLEX-RN hub — delegates to the generic exam pathway hub route.
 *
 * Static `canada/rn/nclex-rn` wins over `[locale]/[slug]/[examCode]` so the full product
 * workstation renders with correct metadata and canonical `/canada/rn/nclex-rn`.
 */
import type { Metadata } from "next";
import HubPage, {
  generateMetadata as hubGenerateMetadata,
} from "@/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page";

export const revalidate = 3600; // 🧊 ISR: static marketing content
export const dynamicParams = true;

const CA_RN_HUB_PARAMS = Promise.resolve({
  locale: "canada",
  slug: "rn",
  examCode: "nclex-rn",
});

export async function generateMetadata(): Promise<Metadata> {
  return hubGenerateMetadata({ params: CA_RN_HUB_PARAMS });
}

export default function CanadaRnNclexHubPage() {
  return <HubPage params={CA_RN_HUB_PARAMS} />;
}
