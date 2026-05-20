/**
 * Canonical export for the full Advanced ECG curated question pack.
 *
 * Distribution (160 questions total):
 *   Category 1 – Complex ventricular rhythms        25 Q
 *   Category 2 – Advanced conduction disease         20 Q
 *   Category 3 – Advanced ischemia / infarction      25 Q
 *   Category 4 – Pacemaker interpretation            15 Q
 *   Category 5 – Electrolytes / toxicology           20 Q
 *   Category 6 – Advanced tachycardia differentiation 20 Q
 *   Category 7 – Critical-care telemetry             15 Q
 *   Category 8 – Case-based interpretation           20 Q
 *
 * Governance: all rows are clinicianReviewedAt 2026-05-12, qaStatus "approved",
 * publishSafetyStatus "safe" — learner-visible immediately after DB seed.
 */

import type { Prisma } from "@prisma/client";
import { ADVANCED_ECG_CURATED_PACK_PART1 } from "./advanced-ecg-curated-pack";
import { ADVANCED_ECG_CURATED_PACK_PART2 } from "./advanced-ecg-curated-pack-part2";

export const ADVANCED_ECG_CURATED_PACK: Prisma.EcgVideoQuestionCreateInput[] = [
  ...ADVANCED_ECG_CURATED_PACK_PART1,
  ...ADVANCED_ECG_CURATED_PACK_PART2,
];

export function buildAdvancedEcgCuratedPack(): Prisma.EcgVideoQuestionCreateInput[] {
  return ADVANCED_ECG_CURATED_PACK;
}
