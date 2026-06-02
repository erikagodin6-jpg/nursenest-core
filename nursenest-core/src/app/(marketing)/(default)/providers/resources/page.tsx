import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Provider Resources | NurseNest",
  description: "Resources for providers and clinical education partners.",
};

export default function ProviderResourcesPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Providers"
      title="Provider resources"
      description="This area will collect provider-facing guidance for clinical education participation, content review, learner safety, and professional scope alignment."
      primaryCta={{ label: "Contact Us", href: "/contact" }}
      secondaryCta={{ label: "Credentialing Information", href: "/providers/credentialing" }}
      sections={[
        {
          title: "Education boundaries",
          body: "NurseNest resources support learning and exam readiness. They do not replace local clinical policy, clinician judgment, or patient-specific care.",
        },
        {
          title: "Review workflow",
          body: "Clinical contributors and reviewers may be asked to document credentials, scope, review area, and conflicts before participating in provider-facing work.",
        },
      ]}
    />
  );
}
