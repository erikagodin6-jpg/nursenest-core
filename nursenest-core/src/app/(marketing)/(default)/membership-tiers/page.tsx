import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Membership Tiers | NurseNest",
  description: "Compare NurseNest membership access for learners, clinicians, and teams.",
};

export default function MembershipTiersPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Platform"
      title="Membership tiers"
      description="NurseNest memberships are designed around exam pathway, clinical depth, adaptive practice, and the support learners need as they move from lessons to questions to readiness."
      primaryCta={{ label: "Get Started", href: "/pricing" }}
      secondaryCta={{ label: "Contact Sales", href: "/for-institutions" }}
      sections={[
        {
          title: "Individual learners",
          body: "Study independently with pathway-specific lessons, question practice, CAT-style readiness tools, flashcards, and review features.",
        },
        {
          title: "Advanced clinical readiness",
          body: "Specialty modules such as ECG, labs, med math, and simulations can support learners who need deeper clinical reasoning practice.",
        },
        {
          title: "Teams and institutions",
          body: "Programs and healthcare organizations can request multi-seat licensing, onboarding support, reporting, and custom rollout guidance.",
        },
      ]}
    />
  );
}
