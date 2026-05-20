import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Credentialing Information | NurseNest",
  description: "Credentialing information for providers and reviewers.",
};

export default function CredentialingInformationPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Providers"
      title="Credentialing information"
      description="Credentialing helps ensure provider and reviewer participation stays aligned with professional scope, learner safety, and clinical education quality."
      primaryCta={{ label: "Start a Conversation", href: "/contact" }}
      secondaryCta={{ label: "Join as a Provider", href: "/providers/join" }}
      sections={[
        {
          title: "Information we may request",
          body: "Depending on the collaboration, NurseNest may request professional role, license or certification details, jurisdiction, specialty area, education background, and review scope.",
        },
        {
          title: "Scope and safety",
          body: "Credentialing does not create a patient-provider relationship. It supports review quality for educational content and future clinical learning partnerships.",
        },
      ]}
    />
  );
}
