import type { ReactNode } from "react";
import type { Metadata } from "next";
import "@/app/ecg-workstation.css";
import { EcgModuleWorkstationLayout } from "@/components/ecg-module/ecg-module-workstation-layout";
import { EcgModulePublicationNotice } from "@/components/ecg-module/ecg-module-publication-notice";
import { PremiumLayoutVersionMarker } from "@/components/layout/premium-layout-version-marker";
import { PremiumEducationalModuleShell } from "@/components/modules/premium-educational-module-shell";
import { requireEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";
import { getEcgModuleStatus } from "@/lib/ecg-module/ecg-module-status";
import { isEcgModuleEnabled } from "@/lib/ecg-module/ecg-module-config";
import { traceLayout, tracePageData } from "@/build/tracing";

export const dynamic = "force-dynamic";

const generateMetadataImpl = tracePageData(
  import.meta,
  async function generateMetadata(): Promise<Metadata> {
    const enabled = isEcgModuleEnabled();
    const status = await getEcgModuleStatus();
    const published = enabled && status === "published";
    return {
      robots: published
        ? {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
          }
        : {
            index: false,
            follow: false,
            googleBot: { index: false, follow: false },
          },
    };
  },
  { name: "EcgModuleLayout.generateMetadata" },
);

export const generateMetadata = generateMetadataImpl;

const EcgModuleLayout = traceLayout(
  import.meta,
  async function EcgModuleLayout({ children }: { children: ReactNode }) {
    await requireEcgModuleAccess();
    return (
      <PremiumEducationalModuleShell
        eyebrow="Telemetry Module"
        title="ECG Clinical Readiness"
        description="Rhythm interpretation, worksheets, video drills, and scenario practice connected back to the NurseNest learner ecosystem."
        backHref="/app"
      >
        <PremiumLayoutVersionMarker surface="ecg-module" />
        <EcgModulePublicationNotice />
        <EcgModuleWorkstationLayout>{children}</EcgModuleWorkstationLayout>
      </PremiumEducationalModuleShell>
    );
  },
  { name: "EcgModuleLayout" },
);

export default EcgModuleLayout;
