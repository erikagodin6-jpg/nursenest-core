import type { Metadata } from "next";
import {
  generateNclexCommercialLandingMetadata,
  NclexCommercialLandingPage,
} from "@/components/marketing/nclex-commercial-landing-page";

const landingSlug = "best-nclex-prep-course";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return generateNclexCommercialLandingMetadata(landingSlug);
}

export default function Page() {
  return <NclexCommercialLandingPage slug={landingSlug} />;
}
