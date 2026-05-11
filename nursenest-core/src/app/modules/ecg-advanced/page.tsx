import { AdvancedEcgLearnerPage } from "@/components/advanced-ecg/advanced-ecg-learner-page";
import { ADVANCED_ECG_CURRICULUM } from "@/lib/advanced-ecg/advanced-ecg-curriculum";
import { loadAdvancedEcgAccess } from "@/lib/advanced-ecg/advanced-ecg-access";

export const dynamic = "force-dynamic";

export default async function AdvancedEcgModulePage() {
  const access = await loadAdvancedEcgAccess();
  return <AdvancedEcgLearnerPage access={access} curriculum={ADVANCED_ECG_CURRICULUM} />;
}
