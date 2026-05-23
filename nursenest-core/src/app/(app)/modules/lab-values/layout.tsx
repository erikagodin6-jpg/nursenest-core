import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createTraceInfo, traceLayout, withBuildTrace } from "@/build/tracing";
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

const labValuesAccessTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "requireLabValuesModuleAccess",
  phase: "layout",
});

const LabValuesModuleLayout = traceLayout(
  import.meta,
  async function LabValuesModuleLayout({ children }: { children: ReactNode }) {
    await withBuildTrace(labValuesAccessTrace, () => requireLabValuesModuleAccess());
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
  },
  { name: "LabValuesModuleLayout" },
);

export default LabValuesModuleLayout;
