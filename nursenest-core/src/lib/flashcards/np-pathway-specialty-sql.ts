import { Prisma } from "@prisma/client";

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isUsNpSpecialtyPathway } from "@/lib/exam-pathways/np-question-specialty-scope";

const FNP_BODY_SYSTEMS = ["Preventive Medicine", "Health Promotion", "Multi-system"] as const;
const AGPCNP_BODY_SYSTEMS = ["Geriatrics", "Geriatric"] as const;
const PMHNP_BODY_SYSTEMS = ["Psychiatry", "Mental Health"] as const;
const WHNP_BODY_SYSTEMS = ["Women's Health", "Reproductive", "Maternal/Newborn", "Maternal", "Obstetrics"] as const;
const PNP_PC_BODY_SYSTEMS = ["Pediatrics", "Pediatric"] as const;

const FNP_EXAM_LOWER = ["aanp", "aanp-fnp", "ancc-fnp", "fnp"] as const;
const AGPCNP_EXAM_LOWER = ["ancc-agpcnp", "agpcnp", "agnp"] as const;
const PMHNP_EXAM_LOWER = ["pmhnp"] as const;
const WHNP_EXAM_LOWER = ["whnp", "womens-health-np"] as const;
const PNP_PC_EXAM_LOWER = ["pnp-pc", "pnp_pc", "pediatric-pc-np"] as const;

function bodyInSql(values: readonly string[]): Prisma.Sql {
  return Prisma.sql`trim(coalesce(body_system, '')) IN (${Prisma.join([...values])})`;
}

function examLowerInSql(values: readonly string[]): Prisma.Sql {
  return Prisma.sql`lower(trim(coalesce(exam, ''))) IN (${Prisma.join([...values])})`;
}

function signalSql(bodyValues: readonly string[], examLower: readonly string[]): Prisma.Sql {
  return Prisma.sql`(${bodyInSql(bodyValues)} OR ${examLowerInSql(examLower)})`;
}

const SIG_FNP = signalSql(FNP_BODY_SYSTEMS, FNP_EXAM_LOWER);
const SIG_AG = signalSql(AGPCNP_BODY_SYSTEMS, AGPCNP_EXAM_LOWER);
const SIG_PM = signalSql(PMHNP_BODY_SYSTEMS, PMHNP_EXAM_LOWER);
const SIG_WH = signalSql(WHNP_BODY_SYSTEMS, WHNP_EXAM_LOWER);
const SIG_PNP = signalSql(PNP_PC_BODY_SYSTEMS, PNP_PC_EXAM_LOWER);

const ANY_SPECIALTY = Prisma.sql`(${SIG_FNP} OR ${SIG_AG} OR ${SIG_PM} OR ${SIG_WH} OR ${SIG_PNP})`;

/**
 * SQL AND fragment for US NP specialty pathways — mirrors {@link npPathwaySpecialtyWhere} Prisma logic.
 * Empty for non-specialty pathways.
 */
export function npPathwaySpecialtyAndSql(pathway: ExamPathwayDefinition): Prisma.Sql {
  if (!isUsNpSpecialtyPathway(pathway)) return Prisma.empty;

  const sharedCore = Prisma.sql`NOT (${ANY_SPECIALTY})`;

  if (pathway.id === "us-np-fnp") {
    return Prisma.sql` AND ((${sharedCore}) OR (${SIG_FNP}))`;
  }
  if (pathway.id === "us-np-agpcnp") {
    return Prisma.sql` AND ((${sharedCore}) OR (${SIG_AG}))`;
  }
  if (pathway.id === "us-np-pmhnp") {
    return Prisma.sql` AND ((${sharedCore}) OR (${SIG_PM}))`;
  }
  if (pathway.id === "us-np-whnp") {
    return Prisma.sql` AND ((${sharedCore}) OR (${SIG_WH}))`;
  }
  if (pathway.id === "us-np-pnp-pc") {
    return Prisma.sql` AND ((${sharedCore}) OR (${SIG_PNP}))`;
  }

  return Prisma.empty;
}
