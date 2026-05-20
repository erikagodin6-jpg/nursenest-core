import type { ReactNode } from "react";
import type { Metadata } from "next";
import { PremiumEducationalModuleShell } from "@/components/modules/premium-educational-module-shell";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { requireRtVentilatorModuleAccess } from "@/lib/rt-ventilator/rt-ventilator-module-access.server";
import { isRtVentilatorLearnerModuleEnabled } from "@/lib/rt-ventilator/rt-ventilator-module-config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const published = isRtVentilatorLearnerModuleEnabled();
  return {
    title: "Mechanical Ventilator Training | NurseNest",
    description: "Premium RT ventilator workstation — waveforms, scenarios, and allied-scoped practice hooks.",
    robots: published
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export default async function RtVentilatorModuleLayout({ children }: { children: ReactNode }) {
  await requireRtVentilatorModuleAccess();
  const { t } = await getLearnerMarketingBundle();
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
}
