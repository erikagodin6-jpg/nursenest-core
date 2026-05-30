"use client";

import { marketingProofFromCoreKey } from "@/lib/marketing/marketing-proof-screenshots";
import { MarketingProductProofBand } from "@/components/marketing/marketing-product-proof-band";

export function EcgMarketingProductPreview() {
  return (
    <MarketingProductProofBand
      className="my-10"
      kicker="Telemetry workstation"
      title="See the ECG learning environment inside NurseNest"
      body="Rhythm strips, interpretation exercises, and clinical escalation prompts — integrated with your RN or NP study path."
      shot={marketingProofFromCoreKey("ecg-workstation", {
        alt: "NurseNest ECG telemetry workstation with rhythm interpretation exercises",
        theme: "ocean",
      })}
    />
  );
}
