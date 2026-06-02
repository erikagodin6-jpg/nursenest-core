import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createTraceInfo, traceLayout, withBuildTrace } from "@/build/tracing";
import { PremiumLayoutVersionMarker } from "@/components/layout/premium-layout-version-marker";
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

const advancedEcgShellTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "AdvancedEcgModuleShell",
  phase: "layout",
});

const AdvancedEcgLayout = traceLayout(
  import.meta,
  function AdvancedEcgLayout({ children }: { children: ReactNode }) {
    return withBuildTrace(advancedEcgShellTrace, () => (
      <AdvancedEcgModuleShell>
        <PremiumLayoutVersionMarker surface="advanced-ecg-module" />
        {children}
      </AdvancedEcgModuleShell>
    ));
  },
  { name: "AdvancedEcgLayout" },
);

export default AdvancedEcgLayout;
