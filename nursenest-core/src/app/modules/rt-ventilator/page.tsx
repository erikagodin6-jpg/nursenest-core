import type { Metadata } from "next";
import { RtVentilatorModuleHub } from "@/components/rt-ventilator/rt-ventilator-module-hub";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

export const metadata: Metadata = {
  title: "Ventilator workstation hub | NurseNest",
  robots: { index: false, follow: true },
};

export default async function RtVentilatorModuleIndexPage() {
  const { t } = await getLearnerMarketingBundle();
  return (
    <div data-nn-rt-ventilator-hub="">
      <RtVentilatorModuleHub t={t} />
    </div>
  );
}
