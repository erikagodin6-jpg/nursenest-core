import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PremiumEducationalModuleShell } from "@/components/modules/premium-educational-module-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdvancedEcgLayout({ children }: { children: ReactNode }) {
  return (
    <PremiumEducationalModuleShell
      eyebrow="Advanced ECG"
      title="Advanced ECG & Telemetry Mastery"
      description="A separate paid module for clinician-reviewed advanced ECG interpretation, telemetry escalation, and higher-acuity rhythm reasoning."
      backHref="/app"
    >
      {children}
    </PremiumEducationalModuleShell>
  );
}
