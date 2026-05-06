import "server-only";

import type { PrintableProduct } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { UserAccess } from "@/lib/entitlements/user-access-types";

export type PrintableAccessDenialReason =
  | "not_published"
  | "pathway_mismatch"
  | "premium_required"
  | "purchase_required"
  | "invalid_product_mode";

export function pathwayAllowsPrintable(productPathwayId: string, userPathwayId: string | null): boolean {
  const p = productPathwayId.trim();
  if (p === "*" || p === "all") return true;
  if (!userPathwayId || !userPathwayId.trim()) return false;
  return p === userPathwayId.trim();
}

export type PrintableForAccessCheck = Pick<
  PrintableProduct,
  "id" | "isPublished" | "isFree" | "isPremiumIncluded" | "priceCents" | "pathwayId"
>;

export function printableProductPricingValid(product: Pick<PrintableProduct, "isFree" | "isPremiumIncluded" | "priceCents">): boolean {
  if (product.isFree) {
    return !product.isPremiumIncluded && product.priceCents === 0;
  }
  if (product.isPremiumIncluded) {
    return product.priceCents === 0;
  }
  return product.priceCents > 0;
}

/**
 * Learner download authorization (after feature flag + auth). Does not check DB purchase rows — call
 * {@link ensurePaidPrintableAccess} when this returns `purchase_required`.
 */
export function evaluatePrintableLearnerAccess(
  product: PrintableForAccessCheck,
  userAccess: Pick<UserAccess, "hasPremium" | "allowedExam">,
): { ok: true } | { ok: false; reason: PrintableAccessDenialReason } {
  if (!product.isPublished) return { ok: false, reason: "not_published" };
  if (!printableProductPricingValid(product)) return { ok: false, reason: "invalid_product_mode" };
  if (!pathwayAllowsPrintable(product.pathwayId, userAccess.allowedExam.pathwayId)) {
    return { ok: false, reason: "pathway_mismatch" };
  }
  if (product.isFree) return { ok: true };
  if (product.isPremiumIncluded) {
    if (!userAccess.hasPremium) return { ok: false, reason: "premium_required" };
    return { ok: true };
  }
  return { ok: false, reason: "purchase_required" };
}

/** Maps product + grant row to analytics enum for download events. */
export { printableDownloadSourceForEvent } from "@/lib/printables/printable-download-source";

export async function userHasPaidPrintableAccess(userId: string, productId: string): Promise<boolean> {
  const row = await prisma.printableAccess.findFirst({
    where: {
      userId,
      printableProductId: productId,
      source: { in: ["PURCHASE", "SUBSCRIPTION", "ADMIN_GRANT", "FREE"] },
    },
    select: { id: true },
  });
  return Boolean(row);
}
