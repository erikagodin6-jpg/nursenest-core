import type { Metadata } from "next";
import { MarketingSignupPage } from "@/components/marketing/marketing-signup-page";

export const metadata: Metadata = {
  title: "Signup",
  description: "Create your NurseNest Core account",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return <MarketingSignupPage locale="en" />;
}
