import type { BlueprintComplianceReport, BlueprintContentType } from "@/lib/blueprints/blueprint-compliance-engine";
import type { ExamBlueprintDefinition } from "@/lib/blueprints/exam-blueprint-definitions";

export type PathwayBlueprintComplianceReport = {
  pathwayId: string;
  pathwayName: string;
  countryCode: string;
  tier: string;
  examKey: string;
  blueprint: ExamBlueprintDefinition;
  report: BlueprintComplianceReport;
  contentTotals: Record<BlueprintContentType, number>;
  unmappedSignals: Array<{ contentType: BlueprintContentType; label: string; count: number }>;
};

export type AdminBlueprintComplianceDashboard = {
  generatedAt: string;
  degraded: boolean;
  selectedPathwayId: string;
  reports: PathwayBlueprintComplianceReport[];
  selected: PathwayBlueprintComplianceReport | null;
  summary: {
    pathwaysAudited: number;
    averageComplianceScore: number | null;
    criticalGaps: number;
    totalItems: number;
  };
  notes: string[];
};
