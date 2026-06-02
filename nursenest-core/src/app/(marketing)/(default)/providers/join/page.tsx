import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Join as a Provider | NurseNest",
  description: "Provider partnership information for NurseNest.",
};

export default function JoinAsProviderPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Providers"
      title="Join as a provider"
      description="NurseNest is education-first. Provider participation is reviewed carefully so learner-facing resources stay clinically credible, scoped, and useful."
      primaryCta={{ label: "Contact Us", href: "/contact" }}
      secondaryCta={{ label: "Provider Resources", href: "/providers/resources" }}
      sections={[
        {
          title: "Who this is for",
          body: "Clinicians, educators, reviewers, and healthcare partners can reach out about clinical review, education support, or future provider-facing initiatives.",
        },
        {
          title: "Quality expectations",
          body: "Provider participation may involve credential review, scope alignment, content quality checks, and clear boundaries between education and clinical care.",
        },
      ]}
    />
  );
}
