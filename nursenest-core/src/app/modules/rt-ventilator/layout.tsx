import type { ReactNode } from "react";
import type { Metadata } from "next";
import {
  createTraceInfo,
  traceLayout,
  tracePageData,
  withBuildTrace,
} from "@/build/tracing";
import { PremiumEducationalModuleShell } from "@/components/modules/premium-educational-module-shell";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { requireRtVentilatorModuleAccess } from "@/lib/rt-ventilator/rt-ventilator-module-access.server";
import { isRtVentilatorLearnerModuleEnabled } from "@/lib/rt-ventilator/rt-ventilator-module-config";

export const dynamic = "force-dynamic";

const generateMetadataImpl = tracePageData(
  import.meta,
  async function generateMetadata(): Promise<Metadata> {
    const published = isRtVentilatorLearnerModuleEnabled();
    return {
      title: "Mechanical Ventilator Training | NurseNest",
      description: "Premium RT ventilator workstation — waveforms, scenarios, and allied-scoped practice hooks.",
      robots: published
        ? { index: false, follow: true, googleBot: { index: false, follow: true } }
        : { index: false, follow: false, googleBot: { index: false, follow: false } },
    };
  },
  { name: "RtVentilator.generateMetadata" },
);

export const generateMetadata = generateMetadataImpl;

const requireAccessTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "requireRtVentilatorModuleAccess",
  phase: "layout",
});

const marketingBundleTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "getLearnerMarketingBundle",
  phase: "layout",
});

const RtVentilatorModuleLayout = traceLayout(
  import.meta,
  async function RtVentilatorModuleLayout({ children }: { children: ReactNode }) {
    await withBuildTrace(requireAccessTrace, () => requireRtVentilatorModuleAccess());
    const { t } = await withBuildTrace(marketingBundleTrace, () => getLearnerMarketingBundle());
    return (
      <PremiumEducationalModuleShell
        eyebrow={t("rtVentilator.shell.eyebrow")}
        title={t("rtVentilator.shell.title")}
        description={t("rtVentilator.shell.description")}
        backHref="/app"
      >
        {children}
      </PremiumEducationalModuleShell>
    );
  },
  { name: "RtVentilatorModuleLayout" },
);

export default RtVentilatorModuleLayout;
