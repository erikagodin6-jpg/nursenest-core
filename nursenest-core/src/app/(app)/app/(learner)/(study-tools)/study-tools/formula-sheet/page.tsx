import type { Metadata } from "next";
import { SmartFormulaSheetPanel } from "@/components/formula-sheet/smart-formula-sheet";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { pathwayIdFromLearnerSearchParams } from "@/lib/study-tools/study-tools-page-params.server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Smart Formula Sheet");
}

export default async function SmartFormulaSheetPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromLearnerSearchParams(searchParams);
  return (
    <StudyToolsActivityShell
      title="Smart Formula Sheet"
      description="Search medication math, ABG interpretation, ECG intervals, hemodynamic values, and lab references."
      pathwayId={pathwayId}
    >
      <SmartFormulaSheetPanel embedded />
    </StudyToolsActivityShell>
  );
}
