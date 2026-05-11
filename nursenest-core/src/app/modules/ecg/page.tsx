import type { Metadata } from "next";
import { EcgModuleHub } from "@/components/ecg-module/ecg-module-hub";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";

export const metadata: Metadata = {
  title: "ECG telemetry hub | NurseNest",
  description: "Rhythm interpretation, drills, and telemetry study loops integrated with your NurseNest pathway.",
  robots: { index: false, follow: true },
};

export default async function EcgModuleIndexPage() {
  const [{ t }, access] = await Promise.all([getLearnerMarketingBundle(), getCurrentEcgModuleAccess()]);
  return <EcgModuleHub t={t} accessState={access.ok ? access.accessState : "basic_only"} />;
}
