import type { Metadata } from "next";
import { EcgModuleHub } from "@/components/ecg-module/ecg-module-hub";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

export const metadata: Metadata = {
  title: "ECG telemetry hub | NurseNest",
  description: "Rhythm interpretation, drills, and telemetry study loops integrated with your NurseNest pathway.",
  robots: { index: false, follow: true },
};

export default async function EcgModuleIndexPage() {
  const { t } = await getLearnerMarketingBundle();
  return <EcgModuleHub t={t} />;
}
