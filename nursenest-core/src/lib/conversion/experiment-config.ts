import { CONVERSION_VARIANT_ENV } from "@/lib/conversion/constants";

export type ConversionVariant = "default" | "urgency" | "outcome";

/**
 * Read a single env flag so pricing/paywall copy can be swapped without code changes.
 * Example: `NN_CONVERSION_VARIANT=urgency`
 */
export function getConversionVariant(): ConversionVariant {
  const v = (process.env[CONVERSION_VARIANT_ENV] ?? "default").toLowerCase().trim();
  if (v === "urgency" || v === "outcome") return v;
  return "default";
}
