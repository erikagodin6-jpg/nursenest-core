import { clampMetaDescription, isWeakMetaDescription } from "@/lib/seo/programmatic-seo-engine/guardrails";
import type { ProgrammaticDescriptionMerge } from "@/lib/seo/programmatic-seo-engine/types";

/**
 * Blog public meta description: keep strong manual `seoDescription`; when weak, use deterministic auto.
 */
export function mergePublicBlogMetaDescription(
  manualSeoDescription: string | null | undefined,
  autoMetaDescription: string,
): ProgrammaticDescriptionMerge {
  const manual = (manualSeoDescription ?? "").trim();
  const auto = autoMetaDescription.trim();
  if (manual && !isWeakMetaDescription(manual)) {
    return { description: clampMetaDescription(manual), source: "manual" };
  }
  return { description: clampMetaDescription(auto || manual), source: "auto" };
}
