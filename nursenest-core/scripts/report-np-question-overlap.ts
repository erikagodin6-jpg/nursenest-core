import "../src/lib/db/env-bootstrap";

import { PrismaClient } from "@prisma/client";
import { getExamPathwayById } from "../src/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingWhere } from "../src/lib/exam-pathways/pathway-question-bank-snapshot";
import { deriveNpSpecialtyBuckets } from "../src/lib/exam-pathways/np-question-specialty-scope";
import { questionBankWhereForProfile } from "../src/lib/entitlements/content-access-scope";

const NP_PATHWAY_IDS = [
  "ca-np-cnple",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
] as const;

const US_NP_PATHWAY_IDS = ["us-np-fnp", "us-np-agpcnp", "us-np-pmhnp", "us-np-whnp", "us-np-pnp-pc"] as const;

const prisma = new PrismaClient();

type Options = {
  threshold: number;
  enforce: boolean;
};

type PairwiseRow = {
  a: string;
  b: string;
  intersection: number;
  union: number;
  jaccard: number;
};

function parseOptions(argv: string[]): Options {
  const thresholdArg = argv.find((arg) => arg.startsWith("--threshold="));
  const thresholdParsed = thresholdArg ? Number(thresholdArg.split("=")[1]) : 0.95;
  const threshold = Number.isFinite(thresholdParsed) && thresholdParsed > 0 && thresholdParsed <= 1 ? thresholdParsed : 0.95;
  return {
    threshold,
    enforce: argv.includes("--enforce"),
  };
}

function asLegacyWhere(pathwayId: string) {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) return { id: { in: [] as string[] } };
  const profile = questionBankWhereForProfile(pathway.countryCode, pathway.stripeTier);
  const examKeys = [...new Set(pathway.contentExamKeys)];
  if (examKeys.length === 0) return profile;
  return { AND: [profile, { exam: { in: examKeys } }] };
}

async function loadIdSet(pathwayId: string, mode: "legacy" | "current"): Promise<Set<string>> {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) return new Set();
  const where = mode === "legacy" ? asLegacyWhere(pathwayId) : pathwayExamQuestionMarketingWhere(pathway);
  const rows = await prisma.examQuestion.findMany({
    where,
    select: { id: true },
  });
  return new Set(rows.map((row) => row.id));
}

function pairwise(pathwayIds: readonly string[], sets: Record<string, Set<string>>): PairwiseRow[] {
  const rows: PairwiseRow[] = [];
  for (let i = 0; i < pathwayIds.length; i += 1) {
    for (let j = i + 1; j < pathwayIds.length; j += 1) {
      const a = pathwayIds[i]!;
      const b = pathwayIds[j]!;
      const as = sets[a] ?? new Set<string>();
      const bs = sets[b] ?? new Set<string>();
      let intersection = 0;
      for (const id of as) {
        if (bs.has(id)) intersection += 1;
      }
      const union = as.size + bs.size - intersection;
      rows.push({
        a,
        b,
        intersection,
        union,
        jaccard: union === 0 ? 0 : intersection / union,
      });
    }
  }
  return rows;
}

function exclusives(pathwayIds: readonly string[], sets: Record<string, Set<string>>) {
  const allByPathway = pathwayIds.map((pathwayId) => [pathwayId, sets[pathwayId] ?? new Set<string>()] as const);
  const rows = [];
  for (const [pathwayId, ownSet] of allByPathway) {
    let exclusive = 0;
    for (const id of ownSet) {
      let seenElsewhere = false;
      for (const [otherPathwayId, otherSet] of allByPathway) {
        if (otherPathwayId === pathwayId) continue;
        if (otherSet.has(id)) {
          seenElsewhere = true;
          break;
        }
      }
      if (!seenElsewhere) exclusive += 1;
    }
    rows.push({
      pathwayId,
      total: ownSet.size,
      exclusive,
      shared: ownSet.size - exclusive,
    });
  }
  return rows;
}

function allPairsAboveThreshold(rows: PairwiseRow[], threshold: number): boolean {
  if (rows.length === 0) return false;
  return rows.every((row) => row.jaccard >= threshold);
}

async function missingSpecialtyMetadataCount() {
  const rows = await prisma.examQuestion.findMany({
    where: {
      status: "published",
      tier: { in: ["np", "NP"] },
      exam: { in: ["NP", "AANP", "AANP-FNP", "ANCC-FNP", "ANCC-AGPCNP", "AGPCNP", "PMHNP", "WHNP", "PNP-PC"] },
      regionScope: { in: ["US_ONLY", "BOTH"] },
    },
    select: { id: true, exam: true, bodySystem: true },
  });
  let missing = 0;
  for (const row of rows) {
    const buckets = deriveNpSpecialtyBuckets({ exam: row.exam, bodySystem: row.bodySystem });
    if (buckets.length === 1 && buckets[0] === "shared_core") {
      missing += 1;
    }
  }
  return { evaluated: rows.length, missingSpecialtyMetadata: missing };
}

async function main() {
  const options = parseOptions(process.argv.slice(2));

  const legacySets: Record<string, Set<string>> = {};
  const currentSets: Record<string, Set<string>> = {};

  for (const pathwayId of NP_PATHWAY_IDS) {
    legacySets[pathwayId] = await loadIdSet(pathwayId, "legacy");
    currentSets[pathwayId] = await loadIdSet(pathwayId, "current");
  }

  const legacyPairwiseUS = pairwise(US_NP_PATHWAY_IDS, legacySets);
  const currentPairwiseUS = pairwise(US_NP_PATHWAY_IDS, currentSets);
  const legacyPairwiseAll = pairwise(NP_PATHWAY_IDS, legacySets);
  const currentPairwiseAll = pairwise(NP_PATHWAY_IDS, currentSets);
  const currentExclusiveUS = exclusives(US_NP_PATHWAY_IDS, currentSets);
  const specialtyMetadata = await missingSpecialtyMetadataCount();

  const legacyUnsafe = allPairsAboveThreshold(legacyPairwiseUS, options.threshold);
  const currentUnsafe = allPairsAboveThreshold(currentPairwiseUS, options.threshold);

  const report = {
    generatedAt: new Date().toISOString(),
    threshold: options.threshold,
    safety: {
      legacyAllUsPairsAboveThreshold: legacyUnsafe,
      currentAllUsPairsAboveThreshold: currentUnsafe,
      criticalWarning: currentUnsafe
        ? "CRITICAL: US NP pathways remain unspecialized by overlap threshold."
        : null,
    },
    counts: {
      legacy: NP_PATHWAY_IDS.map((pathwayId) => ({
        pathwayId,
        totalQuestions: legacySets[pathwayId]?.size ?? 0,
      })),
      current: NP_PATHWAY_IDS.map((pathwayId) => ({
        pathwayId,
        totalQuestions: currentSets[pathwayId]?.size ?? 0,
      })),
      currentSharedExclusiveUS: currentExclusiveUS,
    },
    pairwise: {
      legacyUS: legacyPairwiseUS,
      currentUS: currentPairwiseUS,
      legacyAll: legacyPairwiseAll,
      currentAll: currentPairwiseAll,
    },
    quality: specialtyMetadata,
  };

  if (currentUnsafe) {
    console.error("CRITICAL: US NP pathway overlap remains above threshold across all pairs.");
  }
  console.log(JSON.stringify(report, null, 2));

  if (options.enforce && currentUnsafe) {
    process.exitCode = 2;
  }
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`report failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
