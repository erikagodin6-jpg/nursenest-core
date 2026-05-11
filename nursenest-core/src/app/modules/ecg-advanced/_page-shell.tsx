import { AdvancedEcgLearnerPage } from "@/components/advanced-ecg/advanced-ecg-learner-page";
import { ADVANCED_ECG_CURRICULUM } from "@/lib/advanced-ecg/advanced-ecg-curriculum";
import { loadAdvancedEcgAccess } from "@/lib/advanced-ecg/advanced-ecg-access";

export async function renderAdvancedEcgPage(options?: {
  currentSectionSlug?: string;
  currentPacemakerSectionSlug?: string;
}) {
  const access = await loadAdvancedEcgAccess();
  return (
    <AdvancedEcgLearnerPage
      access={access}
      curriculum={ADVANCED_ECG_CURRICULUM}
      currentSectionSlug={options?.currentSectionSlug}
      currentPacemakerSectionSlug={options?.currentPacemakerSectionSlug}
    />
  );
}
