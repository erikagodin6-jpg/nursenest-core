import type { Metadata } from "next";
import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";

export const metadata: Metadata = {
  title: "Pricing & plans | NurseNest",
  description:
    "Subscription plans for Canada and US nursing pathways—question bank, lessons, timed practice, and progress tracking in one place.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing & plans | NurseNest",
    description:
      "Choose a pathway-aligned plan and start studying with questions, lessons, and mock exams built for your registration context.",
    url: "/pricing",
  },
};

export default function PricingPage() {
  return <MarketingPricingPage locale="en" />;
}
