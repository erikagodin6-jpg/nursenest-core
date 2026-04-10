import type { PracticeTestPathwayOption } from "@/lib/practice-tests/types";

/** CAT dropdown options: only pathways that allow adaptive start. */
export function catEligiblePathwayOptions(
  pathwayOptions: PracticeTestPathwayOption[],
  catEligiblePathwayIds: readonly string[],
): PracticeTestPathwayOption[] {
  if (catEligiblePathwayIds.length === 0) return [];
  const allow = new Set(catEligiblePathwayIds);
  return pathwayOptions.filter((p) => allow.has(p.id));
}

/**
 * Pathway id when switching into CAT mode (hub or initial URL-driven transition).
 * - Single CAT-eligible option → that id.
 * - Multiple → only a valid `pathwayId` query counts as an explicit choice; otherwise "".
 */
export function pathwayIdWhenEnteringCatMode(args: {
  catEligibleOptions: PracticeTestPathwayOption[];
  pathwayIdFromUrl: string | null | undefined;
}): string {
  const { catEligibleOptions, pathwayIdFromUrl } = args;
  if (catEligibleOptions.length === 0) return "";
  if (catEligibleOptions.length === 1) return catEligibleOptions[0]!.id;
  const u = typeof pathwayIdFromUrl === "string" ? pathwayIdFromUrl.trim() : "";
  if (u && catEligibleOptions.some((p) => p.id === u)) return u;
  return "";
}

/** Restore linear / non-CAT builder default when leaving CAT mode. */
export function pathwayIdWhenLeavingCatMode(
  defaultPathwayId: string | null | undefined,
  pathwayOptions: PracticeTestPathwayOption[],
): string {
  if (defaultPathwayId && pathwayOptions.some((p) => p.id === defaultPathwayId)) return defaultPathwayId;
  return pathwayOptions[0]?.id ?? "";
}

/** True when the hub must block “Start test” for CAT (client-side guard; mirrors button disabled rules). */
export function hubCatStartBlocked(args: {
  selectionMode: string;
  pathwayId: string;
  catEligibleOptionCount: number;
}): boolean {
  if (args.selectionMode !== "cat") return false;
  if (args.catEligibleOptionCount === 0) return true;
  return args.pathwayId.trim().length === 0;
}
