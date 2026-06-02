import type { Metadata } from "next";
import {
  generateNclexCommercialLandingMetadata,
  NclexCommercialLandingPage,
} from "@/components/marketing/nclex-commercial-landing-page";

const landingSlug = "adaptive-nclex-testing";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return generateNclexCommercialLandingMetadata(landingSlug);
}

export default function Page() {
  return <NclexCommercialLandingPage slug={landingSlug} />;
}
