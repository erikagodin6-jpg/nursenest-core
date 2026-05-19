import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Support | NurseNest",
  description: "Get help with NurseNest accounts, billing, access, and learning tools.",
};

export default function SupportPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Support"
      title="NurseNest support"
      description="Get help with account access, billing, subscriptions, institutional inquiries, content questions, or technical issues."
      primaryCta={{ label: "Contact Support", href: "/contact" }}
      secondaryCta={{ label: "Read FAQ", href: "/faq" }}
      sections={[
        {
          title: "Account and billing",
          body: "For sign-in, subscription, checkout, cancellation, or invoice questions, contact support with the email address tied to your account.",
        },
        {
          title: "Learning access",
          body: "If lessons, flashcards, questions, or clinical modules are not loading correctly, send the route URL and a brief description of what you expected to see.",
        },
        {
          title: "Institutional support",
          body: "Schools, clinics, and healthcare organizations can use the institutional page to start a licensing or implementation conversation.",
        },
      ]}
    />
  );
}
