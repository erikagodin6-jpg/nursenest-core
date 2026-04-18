import { CountryCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { NP_COVERAGE_THRESHOLDS } from "@/lib/np/np-coverage-thresholds";

export type NpPathwayInventoryGate = {
  publishedNpCanada: number;
  targetMinimum: number;
  belowThreshold: boolean;
  /** Honest copy for marketing hubs — avoids implying a “complete” bank when thin. */
  noticeMarkdown: string;
};

const NP_INVENTORY_TIMEOUT_MS = 1000;

/**
 * DB-backed NP Canada published count for pathway UX (no guessed numbers).
 */
export async function loadNpCanadaInventoryGate(): Promise<NpPathwayInventoryGate | null> {
  if (!isDatabaseUrlConfigured()) return null;
  const publishedNpCanada = await withDatabaseFallbackTimeout(
    () =>
      prisma.examQuestion.count({
        where: { status: "published", tier: "NP", countryCode: CountryCode.CA },
      }),
    -1,
    NP_INVENTORY_TIMEOUT_MS,
    { scope: "exam_pathway_hub", label: "np_inventory_count" },
  );
  if (publishedNpCanada < 0) return null;
  const targetMinimum = NP_COVERAGE_THRESHOLDS.canadaNpMinPublished;
  const belowThreshold = publishedNpCanada < targetMinimum;
  const noticeMarkdown = belowThreshold
    ? `This Canadian NP track is still scaling its case bank (${publishedNpCanada.toLocaleString()} published items vs. our ${targetMinimum.toLocaleString()}+ launch target). You get real adaptive practice now; we’re actively expanding depth by domain.`
    : "";
  return {
    publishedNpCanada,
    targetMinimum,
    belowThreshold,
    noticeMarkdown,
  };
}
