/**
 * Canada NP / CNPLE simulation route.
 *
 * Keep the public CNPLE LOFT route on the canonical pathway contract. Without
 * this static delegate, the CNPLE authority-cluster [topic] route captures
 * /simulation as an unknown SEO topic and returns a 404.
 */
import type { Metadata } from "next";
import SimulationPage, {
  generateMetadata as simulationGenerateMetadata,
} from "@/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page";

export const dynamicParams = true;
export const revalidate = 86400;

const CNPLE_PARAMS = Promise.resolve({
  locale: "canada",
  slug: "np",
  examCode: "cnple",
});

export async function generateMetadata(): Promise<Metadata> {
  return simulationGenerateMetadata({ params: CNPLE_PARAMS });
}

export default function CnpleSimulationPage() {
  return <SimulationPage params={CNPLE_PARAMS} />;
}
