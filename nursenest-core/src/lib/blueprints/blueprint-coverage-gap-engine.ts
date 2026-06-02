import {
  buildBlueprintComplianceReport,
  type BlueprintDomainContentCount,
} from "@/lib/blueprints/blueprint-compliance-engine";
import {
  EXAM_BLUEPRINTS,
  type ExamBlueprintDefinition,
} from "@/lib/blueprints/exam-blueprint-definitions";
import { normalizeBlueprintDomain } from "@/lib/blueprints/domain-normalization";

export type BlueprintGapExam =
  | "NCLEX-RN"
  | "REx-PN"
  | "NCLEX-PN"
  | "CNPLE"
  | "FNP"
  | "AGPCNP"
  | "PMHNP"
  | "PNP-PC"
  | "WHNP"
  | "ENP";

export type BlueprintGapContentType =
  | "lessons"
  | "questions"
  | "flashcards"
  | "simulations"
  | "ngnCases";

export type BlueprintCoverageContentItem = {
  readonly id: string;
  readonly exam: BlueprintGapExam | string;
  readonly contentType: BlueprintGapContentType;
  readonly bodySystem?: string | null;
  readonly topic?: string | null;
  readonly subtopic?: string | null;
  readonly blueprintDomain?: string | null;
  readonly signals?: readonly (string | null | undefined)[];
  readonly published?: boolean | null;
  readonly publicationReady?: boolean | null;
  readonly monetizationReady?: boolean | null;
  readonly adaptiveReady?: boolean | null;
};

export type BlueprintCoverageExamTargets = Record<BlueprintGapContentType, number>;

export type BlueprintCoverageExamConfig = {
  readonly exam: BlueprintGapExam;
  readonly blueprint: ExamBlueprintDefinition;
  readonly targets: BlueprintCoverageExamTargets;
  readonly commercialWeight: number;
};

export type BlueprintCoverageDomainRow = {
  readonly domainId: string;
  readonly label: string;
  readonly targetPercent: number;
  readonly actualPercent: number;
  readonly coveragePercent: number;
  readonly variancePercent: number;
  readonly status: "missing" | "weak" | "aligned" | "overrepresented";
  readonly counts: Record<BlueprintGapContentType, number>;
  readonly missingContent: Partial<Record<BlueprintGapContentType, number>>;
  readonly priority: "critical" | "high" | "medium" | "low";
};

export type BlueprintCoverageBacklogItem = {
  readonly rank: number;
  readonly exam: BlueprintGapExam;
  readonly domainId: string;
  readonly domainLabel: string;
  readonly contentType: BlueprintGapContentType;
  readonly missingCount: number;
  readonly priorityScore: number;
  readonly rationale: string;
};

export type BlueprintCoverageExamReport = {
  readonly exam: BlueprintGapExam;
  readonly blueprintId: string;
  readonly blueprintLabel: string;
  readonly overallCoveragePercent: number;
  readonly blueprintCompliancePercent: number;
  readonly readinessPercent: number;
  readonly monetizationPercent: number;
  readonly publicationPercent: number;
  readonly adaptiveLearningPercent: number;
  readonly totals: Record<BlueprintGapContentType, number>;
  readonly targets: BlueprintCoverageExamTargets;
  readonly domainRows: readonly BlueprintCoverageDomainRow[];
  readonly weakestDomains: readonly BlueprintCoverageDomainRow[];
  readonly missingContent: readonly BlueprintCoverageBacklogItem[];
  readonly highestRoiNextBuilds: readonly BlueprintCoverageBacklogItem[];
};

export type BlueprintCoverageDashboard = {
  readonly generatedAt: string;
  readonly overallCoveragePercent: number;
  readonly readinessPercent: number;
  readonly monetizationPercent: number;
  readonly publicationPercent: number;
  readonly adaptiveLearningPercent: number;
  readonly exams: readonly BlueprintCoverageExamReport[];
  readonly rankedContentBacklog: readonly BlueprintCoverageBacklogItem[];
  readonly unmappedItems: readonly BlueprintCoverageContentItem[];
};

const CONTENT_TYPES: readonly BlueprintGapContentType[] = [
  "lessons",
  "questions",
  "flashcards",
  "simulations",
  "ngnCases",
] as const;

const RN_TARGETS: BlueprintCoverageExamTargets = {
  lessons: 300,
  questions: 10_000,
  flashcards: 15_000,
  simulations: 50,
  ngnCases: 100,
};

const PN_TARGETS: BlueprintCoverageExamTargets = {
  lessons: 250,
  questions: 5_000,
  flashcards: 8_000,
  simulations: 50,
  ngnCases: 100,
};

const NP_TARGETS: BlueprintCoverageExamTargets = {
  lessons: 300,
  questions: 2_500,
  flashcards: 8_000,
  simulations: 50,
  ngnCases: 100,
};

export const BLUEPRINT_COVERAGE_EXAM_CONFIGS: readonly BlueprintCoverageExamConfig[] = [
  { exam: "NCLEX-RN", blueprint: EXAM_BLUEPRINTS.nclex_rn, targets: RN_TARGETS, commercialWeight: 1 },
  { exam: "REx-PN", blueprint: EXAM_BLUEPRINTS.rex_pn, targets: PN_TARGETS, commercialWeight: 0.9 },
  { exam: "NCLEX-PN", blueprint: EXAM_BLUEPRINTS.nclex_pn, targets: PN_TARGETS, commercialWeight: 0.85 },
  { exam: "CNPLE", blueprint: EXAM_BLUEPRINTS.cnple, targets: NP_TARGETS, commercialWeight: 0.95 },
  { exam: "FNP", blueprint: EXAM_BLUEPRINTS.cnple, targets: { ...NP_TARGETS, questions: 2_500 }, commercialWeight: 1 },
  { exam: "AGPCNP", blueprint: EXAM_BLUEPRINTS.cnple, targets: NP_TARGETS, commercialWeight: 0.85 },
  { exam: "PMHNP", blueprint: EXAM_BLUEPRINTS.cnple, targets: NP_TARGETS, commercialWeight: 0.9 },
  { exam: "PNP-PC", blueprint: EXAM_BLUEPRINTS.cnple, targets: NP_TARGETS, commercialWeight: 0.75 },
  { exam: "WHNP", blueprint: EXAM_BLUEPRINTS.cnple, targets: NP_TARGETS, commercialWeight: 0.75 },
  { exam: "ENP", blueprint: EXAM_BLUEPRINTS.cnple, targets: NP_TARGETS, commercialWeight: 0.7 },
] as const;

function pct(part: number, whole: number): number {
  return whole > 0 ? Number(Math.min(100, (part / whole) * 100).toFixed(1)) : 0;
}

function average(values: readonly number[]): number {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : 0;
}

function normalizeExam(exam: string): BlueprintGapExam | null {
  const text = exam.toUpperCase().replace(/_/g, "-").trim();
  if (text === "NCLEX-RN" || text === "US-NCLEX-RN" || text === "CA-NCLEX-RN") return "NCLEX-RN";
  if (text === "REX-PN" || text === "REXPN") return "REx-PN";
  if (text === "NCLEX-PN") return "NCLEX-PN";
  if (text === "CNPLE") return "CNPLE";
  if (text === "FNP" || text === "AANP-FNP" || text === "ANCC-FNP") return "FNP";
  if (text === "AGPCNP" || text === "ANCC-AGPCNP" || text === "AGNP") return "AGPCNP";
  if (text === "PMHNP") return "PMHNP";
  if (text === "PNP-PC" || text === "PNP-PC-NP" || text === "PEDIATRIC-PC-NP") return "PNP-PC";
  if (text === "WHNP" || text === "WOMENS-HEALTH-NP") return "WHNP";
  if (text === "ENP") return "ENP";
  return null;
}

function configFor(exam: BlueprintGapExam): BlueprintCoverageExamConfig {
  const found = BLUEPRINT_COVERAGE_EXAM_CONFIGS.find((config) => config.exam === exam);
  if (!found) throw new Error(`Unsupported blueprint coverage exam: ${exam}`);
  return found;
}

function zeroCounts(): Record<BlueprintGapContentType, number> {
  return { lessons: 0, questions: 0, flashcards: 0, simulations: 0, ngnCases: 0 };
}

function domainFor(item: BlueprintCoverageContentItem, blueprint: ExamBlueprintDefinition): string | null {
  if (item.blueprintDomain && blueprint.domains.some((domain) => domain.id === item.blueprintDomain)) return item.blueprintDomain;
  return normalizeBlueprintDomain(blueprint, [
    ...(item.signals ?? []),
    item.bodySystem,
    item.topic,
    item.subtopic,
  ]);
}

function typeCoverage(totals: Record<BlueprintGapContentType, number>, targets: BlueprintCoverageExamTargets): number {
  return average(CONTENT_TYPES.map((type) => pct(totals[type], targets[type])));
}

function readiness(items: readonly BlueprintCoverageContentItem[], predicate: (item: BlueprintCoverageContentItem) => boolean): number {
  return pct(items.filter(predicate).length, items.length);
}

function statusFor(domainCoverage: number, actualPercent: number, targetPercent: number): BlueprintCoverageDomainRow["status"] {
  if (domainCoverage === 0) return "missing";
  if (actualPercent - targetPercent >= 5) return "overrepresented";
  if (domainCoverage < 70 || actualPercent < targetPercent - 3) return "weak";
  return "aligned";
}

function priorityFor(status: BlueprintCoverageDomainRow["status"], coverage: number): BlueprintCoverageDomainRow["priority"] {
  if (status === "missing") return "critical";
  if (coverage < 40) return "critical";
  if (coverage < 70) return "high";
  if (coverage < 90) return "medium";
  return "low";
}

function blueprintCountsForCompliance(domainRows: readonly BlueprintCoverageDomainRow[]): BlueprintDomainContentCount[] {
  return domainRows.map((row) => ({
    domainId: row.domainId,
    questions: row.counts.questions,
    flashcards: row.counts.flashcards,
    lessons: row.counts.lessons,
    simulations: row.counts.simulations + row.counts.ngnCases,
  }));
}

function buildBacklogForExam(
  exam: BlueprintGapExam,
  config: BlueprintCoverageExamConfig,
  domainRows: readonly BlueprintCoverageDomainRow[],
): BlueprintCoverageBacklogItem[] {
  const weights: Record<BlueprintGapContentType, number> = {
    questions: 1,
    flashcards: 0.78,
    lessons: 0.72,
    ngnCases: 0.88,
    simulations: 0.82,
  };
  const items: Omit<BlueprintCoverageBacklogItem, "rank">[] = [];
  for (const row of domainRows) {
    for (const type of CONTENT_TYPES) {
      const missingCount = row.missingContent[type] ?? 0;
      if (missingCount <= 0) continue;
      const priorityScore = Math.round(
        missingCount *
          weights[type] *
          config.commercialWeight *
          (row.priority === "critical" ? 1.35 : row.priority === "high" ? 1.15 : row.priority === "medium" ? 0.9 : 0.65),
      );
      items.push({
        exam,
        domainId: row.domainId,
        domainLabel: row.label,
        contentType: type,
        missingCount,
        priorityScore,
        rationale: `${row.label} is ${row.status} for ${exam}; build ${type} to move coverage toward the ${row.targetPercent}% blueprint target.`,
      });
    }
  }
  return items
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((item, index) => ({ rank: index + 1, ...item }));
}

function buildExamReport(
  exam: BlueprintGapExam,
  items: readonly BlueprintCoverageContentItem[],
): { report: BlueprintCoverageExamReport; unmapped: BlueprintCoverageContentItem[] } {
  const config = configFor(exam);
  const domainCounts = new Map<string, Record<BlueprintGapContentType, number>>();
  const unmapped: BlueprintCoverageContentItem[] = [];

  for (const item of items) {
    const domainId = domainFor(item, config.blueprint);
    if (!domainId) {
      unmapped.push(item);
      continue;
    }
    const counts = domainCounts.get(domainId) ?? zeroCounts();
    counts[item.contentType] += 1;
    domainCounts.set(domainId, counts);
  }

  const totals = items.reduce((acc, item) => {
    acc[item.contentType] += 1;
    return acc;
  }, zeroCounts());
  const totalMappedItems = [...domainCounts.values()].reduce(
    (sum, counts) => sum + CONTENT_TYPES.reduce((inner, type) => inner + counts[type], 0),
    0,
  );

  const domainRows: BlueprintCoverageDomainRow[] = config.blueprint.domains.map((domain) => {
    const counts = domainCounts.get(domain.id) ?? zeroCounts();
    const domainTotal = CONTENT_TYPES.reduce((sum, type) => sum + counts[type], 0);
    const actualPercent = totalMappedItems > 0 ? Number(((domainTotal / totalMappedItems) * 100).toFixed(1)) : 0;
    const missingContent = Object.fromEntries(
      CONTENT_TYPES.map((type) => {
        const expected = Math.ceil(config.targets[type] * (domain.targetPercent / 100));
        return [type, Math.max(0, expected - counts[type])];
      }).filter(([, missing]) => Number(missing) > 0),
    ) as Partial<Record<BlueprintGapContentType, number>>;
    const typeScores = CONTENT_TYPES.map((type) => {
      const expected = Math.ceil(config.targets[type] * (domain.targetPercent / 100));
      return pct(counts[type], expected);
    });
    const coveragePercent = average(typeScores);
    const status = statusFor(coveragePercent, actualPercent, domain.targetPercent);
    return {
      domainId: domain.id,
      label: domain.label,
      targetPercent: domain.targetPercent,
      actualPercent,
      coveragePercent,
      variancePercent: Number((actualPercent - domain.targetPercent).toFixed(1)),
      status,
      counts,
      missingContent,
      priority: priorityFor(status, coveragePercent),
    };
  });

  const compliance = buildBlueprintComplianceReport(config.blueprint, blueprintCountsForCompliance(domainRows));
  const backlog = buildBacklogForExam(exam, config, domainRows);

  return {
    report: {
      exam,
      blueprintId: config.blueprint.id,
      blueprintLabel: config.blueprint.label,
      overallCoveragePercent: typeCoverage(totals, config.targets),
      blueprintCompliancePercent: compliance.complianceScore,
      readinessPercent: average([typeCoverage(totals, config.targets), compliance.complianceScore]),
      monetizationPercent: readiness(items, (item) => item.monetizationReady === true),
      publicationPercent: readiness(items, (item) => item.published === true || item.publicationReady === true),
      adaptiveLearningPercent: readiness(items, (item) => item.adaptiveReady === true),
      totals,
      targets: config.targets,
      domainRows,
      weakestDomains: domainRows
        .slice()
        .sort((a, b) => a.coveragePercent - b.coveragePercent || Math.abs(b.variancePercent) - Math.abs(a.variancePercent))
        .slice(0, 5),
      missingContent: backlog.slice(0, 25),
      highestRoiNextBuilds: backlog.slice(0, 10),
    },
    unmapped,
  };
}

export function buildBlueprintCoverageDashboard(
  rawItems: readonly BlueprintCoverageContentItem[],
  exams: readonly BlueprintGapExam[] = BLUEPRINT_COVERAGE_EXAM_CONFIGS.map((config) => config.exam),
): BlueprintCoverageDashboard {
  const normalizedItems = rawItems
    .map((item) => {
      const exam = normalizeExam(item.exam);
      return exam ? ({ ...item, exam } satisfies BlueprintCoverageContentItem) : null;
    })
    .filter((item): item is BlueprintCoverageContentItem & { exam: BlueprintGapExam } => Boolean(item));

  const reports: BlueprintCoverageExamReport[] = [];
  const unmappedItems: BlueprintCoverageContentItem[] = [];
  for (const exam of exams) {
    const { report, unmapped } = buildExamReport(
      exam,
      normalizedItems.filter((item) => item.exam === exam),
    );
    reports.push(report);
    unmappedItems.push(...unmapped);
  }

  const rankedContentBacklog = reports
    .flatMap((report) => report.missingContent)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  return {
    generatedAt: new Date().toISOString(),
    overallCoveragePercent: average(reports.map((report) => report.overallCoveragePercent)),
    readinessPercent: average(reports.map((report) => report.readinessPercent)),
    monetizationPercent: average(reports.map((report) => report.monetizationPercent)),
    publicationPercent: average(reports.map((report) => report.publicationPercent)),
    adaptiveLearningPercent: average(reports.map((report) => report.adaptiveLearningPercent)),
    exams: reports,
    rankedContentBacklog,
    unmappedItems: unmappedItems.slice(0, 100),
  };
}
