import { renderAdvancedEcgPage } from "@/app/modules/ecg-advanced/_page-shell";

export const dynamic = "force-dynamic";

export default async function AdvancedEcgRhythmInterpretationPage() {
  return renderAdvancedEcgPage({ currentSectionSlug: "rhythm-interpretation" });
}
