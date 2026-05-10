import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PremiumEducationalModuleShell } from "@/components/modules/premium-educational-module-shell";
import { requireLabValuesModuleAccess } from "@/lib/lab-values/lab-values-module.server";

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

export default async function LabValuesModuleLayout({ children }: { children: ReactNode }) {
  await requireLabValuesModuleAccess();
  return (
    <PremiumEducationalModuleShell
      eyebrow="Clinical Interpretation Module"
      title="Lab Values Readiness"
      description="Adaptive lab interpretation practice with NurseNest navigation, theme tokens, and learner-continuity controls preserved."
      backHref="/app/labs"
      backLabel="Back To Labs"
    >
      {children}
    </PremiumEducationalModuleShell>
  );
}
