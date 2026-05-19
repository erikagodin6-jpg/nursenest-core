import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Features | NurseNest",
  description: "Explore NurseNest study features for clinical learning and exam readiness.",
};

export default function FeaturesPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Platform"
      title="Features built for clinical readiness"
      description="NurseNest combines lessons, adaptive practice, flashcards, CAT-style exams, progress signals, and clinical modules into one cohesive learning ecosystem."
      primaryCta={{ label: "Get Started", href: "/pricing" }}
      secondaryCta={{ label: "See How It Works", href: "/how-it-works" }}
      sections={[
        {
          title: "Structured lessons",
          body: "Premium lesson pages organize clinical concepts into readable learning flows with review architecture and pathway context.",
        },
        {
          title: "Adaptive practice",
          body: "Question practice and exam modes help learners identify weak areas, review rationales, and build safer clinical judgment patterns.",
        },
        {
          title: "Clinical modules",
          body: "ECG, labs, medication math, and other clinical-readiness modules are designed to support real decision-making, not isolated memorization.",
        },
      ]}
    />
  );
}
