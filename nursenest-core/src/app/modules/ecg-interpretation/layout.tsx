import type { ReactNode } from "react";
import type { Metadata } from "next";
import { PremiumEducationalModuleShell } from "@/components/modules/premium-educational-module-shell";
import { requireEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";

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

export default async function EcgInterpretationLayout({ children }: { children: ReactNode }) {
  await requireEcgModuleAccess();
  return (
    <PremiumEducationalModuleShell
      eyebrow="Telemetry Interpretation"
      title="ECG Interpretation Practice"
      description="Lessons, practice, and quiz flows presented inside the shared NurseNest premium learner architecture."
      backHref="/modules/ecg"
      backLabel="Back To ECG"
    >
      {children}
    </PremiumEducationalModuleShell>
  );
}
