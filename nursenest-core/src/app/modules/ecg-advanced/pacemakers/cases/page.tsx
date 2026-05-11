import { renderAdvancedEcgPage } from "@/app/modules/ecg-advanced/_page-shell";

export const dynamic = "force-dynamic";

export default async function AdvancedEcgPacemakerCasesPage() {
  return renderAdvancedEcgPage({
    currentSectionSlug: "pacemakers",
    currentPacemakerSectionSlug: "cases",
  });
}
