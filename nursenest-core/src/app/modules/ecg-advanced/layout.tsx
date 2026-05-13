import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdvancedEcgModuleShell } from "@/components/advanced-ecg/advanced-ecg-module-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Advanced ECG & Telemetry Mastery | NurseNest",
  description:
    "Clinician-reviewed advanced ECG interpretation for RN and NP. 160+ questions across ventricular rhythms, ischemia, pacemakers, toxicology, and critical-care telemetry.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdvancedEcgLayout({ children }: { children: ReactNode }) {
  return <AdvancedEcgModuleShell>{children}</AdvancedEcgModuleShell>;
}
