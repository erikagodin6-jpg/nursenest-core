import type { Metadata } from "next";
import { MarketingLoginPage } from "@/components/marketing/marketing-login-page";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to NurseNest Core",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <MarketingLoginPage locale="en" />;
}
