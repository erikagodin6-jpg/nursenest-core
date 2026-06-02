import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Cookie Policy | NurseNest",
  description: "How NurseNest uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Legal"
      title="Cookie Policy"
      description="NurseNest uses cookies and similar technologies to operate the site, keep accounts secure, remember preferences, measure performance, and improve learning experiences."
      primaryCta={{ label: "Contact Support", href: "/contact" }}
      secondaryCta={{ label: "Privacy Policy", href: "/privacy" }}
      sections={[
        {
          title: "Essential cookies",
          body: "Essential cookies support sign-in, security, checkout, learner sessions, theme preferences, and core site functionality.",
        },
        {
          title: "Analytics and performance",
          body: "Where enabled, analytics help us understand page reliability, navigation performance, content quality, and product usage patterns without changing your subscription access.",
        },
        {
          title: "Your choices",
          body: "You can manage cookies in your browser settings. Some essential features may not work correctly when required cookies are disabled.",
        },
      ]}
    />
  );
}
