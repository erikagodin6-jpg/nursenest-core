import type { Metadata } from "next";
import { MarketingForgotPasswordPage } from "@/components/marketing/marketing-forgot-password-page";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your NurseNest password",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return <MarketingForgotPasswordPage locale="en" />;
}
