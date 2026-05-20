import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Find Care | NurseNest",
  description: "Patient care navigation information from NurseNest.",
};

export default function FindCarePage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Patients"
      title="Find care"
      description="NurseNest is currently focused on education and clinical readiness. Patient care navigation features are not active yet."
      primaryCta={{ label: "Contact Support", href: "/contact" }}
      secondaryCta={{ label: "How It Works", href: "/how-it-works" }}
      sections={[
        {
          title: "For urgent needs",
          body: "If you have urgent symptoms or an emergency, contact local emergency services or seek immediate care through your local healthcare system.",
        },
        {
          title: "Education-first platform",
          body: "Current NurseNest tools are built for learners, clinicians, and organizations preparing for exams and clinical reasoning practice.",
        },
      ]}
    />
  );
}
