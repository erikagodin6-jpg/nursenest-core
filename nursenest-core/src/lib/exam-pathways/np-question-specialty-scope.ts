import { ExamFamily, type Prisma } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

const US_NP_SPECIALTY_PATHWAY_IDS = new Set([
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
]);

const PMHNP_BODY_SYSTEMS = ["Psychiatry", "Mental Health"] as const;
const WHNP_BODY_SYSTEMS = ["Women's Health", "Reproductive", "Maternal/Newborn", "Maternal", "Obstetrics"] as const;
const PNP_PC_BODY_SYSTEMS = ["Pediatrics", "Pediatric"] as const;
const AGPCNP_BODY_SYSTEMS = ["Geriatrics", "Geriatric"] as const;
const FNP_BODY_SYSTEMS = ["Preventive Medicine", "Health Promotion", "Multi-system"] as const;

const FNP_EXAM_VALUES = ["AANP", "AANP-FNP", "ANCC-FNP", "FNP"] as const;
const AGPCNP_EXAM_VALUES = ["ANCC-AGPCNP", "AGPCNP", "AGNP"] as const;
const PMHNP_EXAM_VALUES = ["PMHNP"] as const;
const WHNP_EXAM_VALUES = ["WHNP", "WOMENS-HEALTH-NP"] as const;
const PNP_PC_EXAM_VALUES = ["PNP-PC", "PNP_PC", "PEDIATRIC-PC-NP"] as const;

function bodySystemsWhere(values: readonly string[]): Prisma.ExamQuestionWhereInput {
  return {
    bodySystem: { in: [...values] },
  };
}

function examValuesWhere(values: readonly string[]): Prisma.ExamQuestionWhereInput {
  return {
    exam: { in: [...values] },
  };
}

export function isUsNpSpecialtyPathway(pathway: ExamPathwayDefinition | null): pathway is ExamPathwayDefinition {
  return Boolean(
    pathway &&
      pathway.examFamily === ExamFamily.NP &&
      pathway.countryCode === "US" &&
      US_NP_SPECIALTY_PATHWAY_IDS.has(pathway.id),
  );
}

function specialtySignalWheres(): Record<"fnp" | "agpcnp" | "pmhnp" | "whnp" | "pnp_pc", Prisma.ExamQuestionWhereInput> {
  return {
    fnp: { OR: [bodySystemsWhere(FNP_BODY_SYSTEMS), examValuesWhere(FNP_EXAM_VALUES)] },
    agpcnp: { OR: [bodySystemsWhere(AGPCNP_BODY_SYSTEMS), examValuesWhere(AGPCNP_EXAM_VALUES)] },
    pmhnp: { OR: [bodySystemsWhere(PMHNP_BODY_SYSTEMS), examValuesWhere(PMHNP_EXAM_VALUES)] },
    whnp: { OR: [bodySystemsWhere(WHNP_BODY_SYSTEMS), examValuesWhere(WHNP_EXAM_VALUES)] },
    pnp_pc: { OR: [bodySystemsWhere(PNP_PC_BODY_SYSTEMS), examValuesWhere(PNP_PC_EXAM_VALUES)] },
  };
}

export function npPathwaySpecialtyWhere(pathway: ExamPathwayDefinition | null): Prisma.ExamQuestionWhereInput | null {
  if (!isUsNpSpecialtyPathway(pathway)) return null;

  const signals = specialtySignalWheres();
  const allSpecialtySignals: Prisma.ExamQuestionWhereInput[] = [
    signals.fnp,
    signals.agpcnp,
    signals.pmhnp,
    signals.whnp,
    signals.pnp_pc,
  ];
  const sharedCore: Prisma.ExamQuestionWhereInput = {
    NOT: { OR: allSpecialtySignals },
  };

  if (pathway.id === "us-np-fnp") {
    return { OR: [sharedCore, signals.fnp] };
  }
  if (pathway.id === "us-np-agpcnp") {
    return { OR: [sharedCore, signals.agpcnp] };
  }
  if (pathway.id === "us-np-pmhnp") {
    return { OR: [sharedCore, signals.pmhnp] };
  }
  if (pathway.id === "us-np-whnp") {
    return { OR: [sharedCore, signals.whnp] };
  }
  if (pathway.id === "us-np-pnp-pc") {
    return { OR: [sharedCore, signals.pnp_pc] };
  }

  return null;
}

export type NpSpecialtyBucket = "shared_core" | "fnp" | "agpcnp" | "pmhnp" | "whnp" | "pnp_pc";

export function deriveNpSpecialtyBuckets(row: {
  exam: string | null;
  bodySystem: string | null;
}): NpSpecialtyBucket[] {
  const normalizedExam = row.exam?.trim().toUpperCase() ?? "";
  const bodySystem = row.bodySystem?.trim() ?? "";
  const matches: NpSpecialtyBucket[] = [];

  const matchesBody = (values: readonly string[]) => values.includes(bodySystem as (typeof values)[number]);
  const matchesExam = (values: readonly string[]) => values.includes(normalizedExam as (typeof values)[number]);

  if (matchesBody(FNP_BODY_SYSTEMS) || matchesExam(FNP_EXAM_VALUES)) matches.push("fnp");
  if (matchesBody(AGPCNP_BODY_SYSTEMS) || matchesExam(AGPCNP_EXAM_VALUES)) matches.push("agpcnp");
  if (matchesBody(PMHNP_BODY_SYSTEMS) || matchesExam(PMHNP_EXAM_VALUES)) matches.push("pmhnp");
  if (matchesBody(WHNP_BODY_SYSTEMS) || matchesExam(WHNP_EXAM_VALUES)) matches.push("whnp");
  if (matchesBody(PNP_PC_BODY_SYSTEMS) || matchesExam(PNP_PC_EXAM_VALUES)) matches.push("pnp_pc");

  if (matches.length === 0) matches.push("shared_core");
  return matches;
}

export function npSpecialtySignalsForDebug(): Record<string, Prisma.ExamQuestionWhereInput> {
  return specialtySignalWheres();
}
