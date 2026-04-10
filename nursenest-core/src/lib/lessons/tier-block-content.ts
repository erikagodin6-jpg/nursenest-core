/**
 * Tier-aware lesson body segments for **shared canonical copy** across PN / RN / NP.
 *
 * Authoring (plain text inside pathway lesson section bodies):
 *
 * ```text
 * Shared intro for everyone.
 *
 * <TierBlock tier="PN">Foundational explanation for practical-nurse scope.</TierBlock>
 *
 * <TierBlock tier="RN">Prioritization and delegation emphasis.</TierBlock>
 *
 * <TierBlock tier="NP">Differential diagnosis and management depth.</TierBlock>
 *
 * <TierBlock tier="ALL">Optional callout visible at every tier.</TierBlock>
 * ```
 *
 * - Nesting TierBlocks is not supported (regex is single-pass).
 * - Unknown/missing `tier` is treated like `ALL` (always shown).
 * - Aliases: LPN, LVN, RPN, PN → PN depth.
 */
import type { TierCode } from "@prisma/client";

export type TierBlockDepth = "PN" | "RN" | "NP" | "ALL";

function normalizeTierBlockLabel(raw: string): TierBlockDepth {
  const t = raw.trim().toUpperCase().replace(/[-\s]+/g, "_");
  if (t === "ALL" || t === "ANY" || t === "SHARED") return "ALL";
  if (t === "NP") return "NP";
  if (t === "RN" || t === "REGISTERED_NURSE") return "RN";
  if (t === "PN" || t === "LPN" || t === "LVN" || t === "RPN" || t === "PRACTICAL_NURSE") return "PN";
  return "ALL";
}

function tierAttrFromOpen(openAttrs: string): TierBlockDepth {
  const m = openAttrs.match(/\btier\s*=\s*["']([^"']+)["']/i);
  if (!m?.[1]) return "ALL";
  return normalizeTierBlockLabel(m[1]);
}

/** Minimum exam depth required to *see* a block of that depth (PN=1, RN=2, NP=3). */
function depthRank(d: TierBlockDepth): number {
  switch (d) {
    case "ALL":
      return 0;
    case "PN":
      return 1;
    case "RN":
      return 2;
    case "NP":
      return 3;
    default:
      return 0;
  }
}

/** Learner's max content depth from subscription tier (aligned with ladder: NP sees all). */
export function viewerContentDepth(tier: TierCode): number {
  switch (tier) {
    case "ALLIED":
      return 1;
    case "RPN":
    case "LVN_LPN":
      return 1;
    case "RN":
      return 2;
    case "NP":
      return 3;
    default:
      return 1;
  }
}

/** True if this tier-specific block should be visible to the viewer. */
export function tierBlockVisibleToViewer(block: TierBlockDepth, viewer: TierCode): boolean {
  if (block === "ALL") return true;
  return viewerContentDepth(viewer) >= depthRank(block);
}

/**
 * Remove `<TierBlock>` wrappers and drop blocks the viewer should not see.
 * When `viewerTier` is null/undefined, unwraps all blocks (everyone sees all inner content — legacy-safe).
 */
export function resolveTierBlocksForViewer(text: string, viewerTier: TierCode | null | undefined): string {
  const src = typeof text === "string" ? text : "";
  const lower = src.toLowerCase();
  if (!lower.includes("<tierblock")) return src;

  let out = "";
  let i = 0;
  const closeLower = "</tierblock>";

  while (i < src.length) {
    const openIdx = lower.indexOf("<tierblock", i);
    if (openIdx === -1) {
      out += src.slice(i);
      break;
    }
    out += src.slice(i, openIdx);
    const openEnd = src.indexOf(">", openIdx);
    if (openEnd === -1) {
      out += src.slice(openIdx);
      break;
    }
    const innerOpen = src.slice(openIdx + 1, openEnd);
    const attrs = innerOpen.replace(/^\s*tierblock\s*/i, "");
    const closeIdx = lower.indexOf(closeLower, openEnd + 1);
    if (closeIdx === -1) {
      out += src.slice(openIdx);
      break;
    }
    const inner = src.slice(openEnd + 1, closeIdx);
    const blockTier = tierAttrFromOpen(attrs);
    if (viewerTier == null || tierBlockVisibleToViewer(blockTier, viewerTier)) {
      out += inner;
    }
    i = closeIdx + closeLower.length;
  }

  return out;
}
