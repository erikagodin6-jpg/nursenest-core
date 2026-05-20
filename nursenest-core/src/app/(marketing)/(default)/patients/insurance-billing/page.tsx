import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Insurance & Billing | NurseNest",
  description: "Patient insurance and billing information for NurseNest.",
};

export default function InsuranceBillingPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Patients"
      title="Insurance & billing"
      description="NurseNest subscriptions are education products. Patient insurance billing is not active on NurseNest at this time."
      primaryCta={{ label: "Billing Support", href: "/contact" }}
      secondaryCta={{ label: "Pricing", href: "/pricing" }}
      sections={[
        {
          title: "Learner subscriptions",
          body: "Most billing questions relate to learner memberships, institutional licensing, or organization-level access.",
        },
        {
          title: "Insurance billing",
          body: "NurseNest does not currently submit patient insurance claims. If patient-facing services become available, billing guidance will be updated here.",
        },
      ]}
    />
  );
}
