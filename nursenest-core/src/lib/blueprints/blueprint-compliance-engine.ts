import type { ExamBlueprintDefinition } from "@/lib/blueprints/exam-blueprint-definitions";

export type BlueprintContentType = "questions" | "flashcards" | "lessons" | "simulations";

export type BlueprintDomainContentCount = {
  domainId: string;
  questions: number;
  flashcards: number;
  lessons: number;
  simulations: number;
};

export type BlueprintDomainComplianceRow = BlueprintDomainContentCount & {
  label: string;
  objectives: string[];
  targetPercent: number;
  actualPercent: number;
  variancePercent: number;
  status: "aligned" | "underrepresented" | "overrepresented" | "missing";
  priority: "critical" | "high" | "moderate" | "low";
  suggestedAction: string;
  totalItems: number;
};

export type BlueprintComplianceReport = {
  blueprintId: string;
  blueprintLabel: string;
  complianceScore: number;
  totalItems: number;
  alignedDomains: number;
  missingObjectives: string[];
  underrepresentedDomains: BlueprintDomainComplianceRow[];
  overrepresentedDomains: BlueprintDomainComplianceRow[];
  rows: BlueprintDomainComplianceRow[];
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function statusFor(actual: number, target: number, total: number): BlueprintDomainComplianceRow["status"] {
  if (total === 0 || actual === 0) return "missing";
  const variance = actual - target;
  if (variance <= -2) return "underrepresented";
  if (variance >= 2) return "overrepresented";
  return "aligned";
}

function priorityFor(status: BlueprintDomainComplianceRow["status"], variance: number): BlueprintDomainComplianceRow["priority"] {
  if (status === "missing") return "critical";
  const magnitude = Math.abs(variance);
  if (magnitude >= 8) return "critical";
  if (magnitude >= 5) return "high";
  if (magnitude >= 2) return "moderate";
  return "low";
}

function suggestedAction(row: {
  status: BlueprintDomainComplianceRow["status"];
  label: string;
  questions: number;
  flashcards: number;
  lessons: number;
  simulations: number;
}): string {
  if (row.status === "overrepresented") return `Pause broad ${row.label} generation until weaker domains catch up.`;
  const weakest = [
    ["questions", row.questions],
    ["flashcards", row.flashcards],
    ["lessons", row.lessons],
    ["simulations", row.simulations],
  ].sort((a, b) => Number(a[1]) - Number(b[1]))[0]?.[0];
  return `Create ${row.label} ${weakest ?? "content"} first, then rebalance CAT/practice pools.`;
}

export function buildBlueprintComplianceReport(
  blueprint: ExamBlueprintDefinition,
  counts: readonly BlueprintDomainContentCount[],
): BlueprintComplianceReport {
  const countMap = new Map(counts.map((row) => [row.domainId, row]));
  const totalsByDomain = blueprint.domains.map((domain) => {
    const c = countMap.get(domain.id);
    return {
      domain,
      questions: c?.questions ?? 0,
      flashcards: c?.flashcards ?? 0,
      lessons: c?.lessons ?? 0,
      simulations: c?.simulations ?? 0,
    };
  });
  const totalItems = totalsByDomain.reduce(
    (sum, row) => sum + row.questions + row.flashcards + row.lessons + row.simulations,
    0,
  );

  const rows = totalsByDomain.map((row) => {
    const total = row.questions + row.flashcards + row.lessons + row.simulations;
    const actualPercent = totalItems > 0 ? round1((total / totalItems) * 100) : 0;
    const variancePercent = round1(actualPercent - row.domain.targetPercent);
    const status = statusFor(actualPercent, row.domain.targetPercent, total);
    return {
      domainId: row.domain.id,
      label: row.domain.label,
      objectives: row.domain.objectives,
      targetPercent: row.domain.targetPercent,
      actualPercent,
      variancePercent,
      status,
      priority: priorityFor(status, variancePercent),
      suggestedAction: suggestedAction({ ...row, label: row.domain.label, status }),
      totalItems: total,
      questions: row.questions,
      flashcards: row.flashcards,
      lessons: row.lessons,
      simulations: row.simulations,
    };
  });

  const avgAbsVariance =
    rows.length > 0 ? rows.reduce((sum, row) => sum + Math.abs(row.variancePercent), 0) / rows.length : 100;
  const missingPenalty = rows.filter((row) => row.status === "missing").length * 6;
  const complianceScore = Math.max(0, Math.min(100, Math.round(100 - avgAbsVariance * 4 - missingPenalty)));

  return {
    blueprintId: blueprint.id,
    blueprintLabel: blueprint.label,
    complianceScore,
    totalItems,
    alignedDomains: rows.filter((row) => row.status === "aligned").length,
    missingObjectives: rows
      .filter((row) => row.status === "missing" || row.status === "underrepresented")
      .flatMap((row) => row.objectives.map((objective) => `${row.label}: ${objective}`))
      .slice(0, 20),
    underrepresentedDomains: rows.filter((row) => row.status === "missing" || row.status === "underrepresented"),
    overrepresentedDomains: rows.filter((row) => row.status === "overrepresented"),
    rows,
  };
}
