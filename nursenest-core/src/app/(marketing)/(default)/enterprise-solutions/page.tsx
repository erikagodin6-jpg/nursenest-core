import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Enterprise Solutions | NurseNest",
  description: "Enterprise learning and reporting solutions for healthcare education teams.",
};

export default function EnterpriseSolutionsPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Platform"
      title="Enterprise solutions"
      description="NurseNest can support larger education and workforce-readiness programs that need structured onboarding, scalable licensing, reporting, and clinical learning pathways."
      primaryCta={{ label: "Book a Demo", href: "/for-institutions" }}
      secondaryCta={{ label: "Contact Sales", href: "/contact" }}
      sections={[
        {
          title: "Scalable licensing",
          body: "Support cohorts, classrooms, remediation groups, clinical teams, or multi-site programs with licensing that can scale as your needs change.",
        },
        {
          title: "Analytics and reporting",
          body: "Enterprise conversations can include readiness reporting, progress views, domain-level insight, and cohort performance needs.",
        },
        {
          title: "Integration planning",
          body: "For larger organizations, we can discuss technical planning for API or EHR-adjacent workflows where appropriate and feasible.",
        },
      ]}
    />
  );
}
