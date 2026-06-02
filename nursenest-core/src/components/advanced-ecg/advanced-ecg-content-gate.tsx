import type { ReactNode } from "react";
import { AdvancedEcgPremiumHub } from "@/components/advanced-ecg/advanced-ecg-premium-hub";
import { ADVANCED_ECG_CURRICULUM } from "@/lib/advanced-ecg/advanced-ecg-curriculum";
import { loadAdvancedEcgAccess } from "@/lib/advanced-ecg/advanced-ecg-access";

export async function AdvancedEcgContentGate({ children }: { children: ReactNode }) {
  const access = await loadAdvancedEcgAccess();
  if (!access.ok) {
    return <AdvancedEcgPremiumHub access={access} curriculum={ADVANCED_ECG_CURRICULUM} />;
  }
  return <>{children}</>;
}
