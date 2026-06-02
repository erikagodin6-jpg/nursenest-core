/**
 * Canada NP / CNPLE CAT compatibility route.
 *
 * CNPLE is delivered as a LOFT-style simulation in NurseNest, so the generic
 * pathway CAT page redirects this route to /simulation. This static delegate is
 * required because the CNPLE authority-cluster [topic] route would otherwise
 * catch /cat and 404 before the pathway contract can run.
 */
import type { Metadata } from "next";
import CatPage, {
  generateMetadata as catGenerateMetadata,
} from "@/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;

const CNPLE_PARAMS = Promise.resolve({
  locale: "canada",
  slug: "np",
  examCode: "cnple",
});

export async function generateMetadata(): Promise<Metadata> {
  return catGenerateMetadata({ params: CNPLE_PARAMS });
}

export default function CnpleCatCompatibilityPage() {
  return <CatPage params={CNPLE_PARAMS} />;
}
