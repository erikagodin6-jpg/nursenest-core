/**
 * CAT readiness pool floors — pure constants with no Prisma, DB, or Next server APIs.
 * Safe to import from Client Components and marketing gates (must not pull in `cat-pool.ts`).
 */
export const CAT_MIN_COMPLETE_POOL = 150;

/** CAT readiness pool floor — full tracks use {@link CAT_MIN_COMPLETE_POOL}; Pre-Nursing uses a smaller MV pool. */
export function catReadinessMinCompletePoolRows(
  pathwayId: string | null | undefined,
): number {
  const id = pathwayId?.trim().toLowerCase() ?? "";
  if (id === "pre-nursing" || id === "pre-nursing-ca") return 8;
  return CAT_MIN_COMPLETE_POOL;
}
