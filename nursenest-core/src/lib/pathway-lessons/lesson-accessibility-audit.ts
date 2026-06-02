/**
 * Read-only lesson reachability model for audits (ContentItem + PathwayLesson).
 * Does not mutate DB. Used by scripts/lesson-accessibility-audit.mts.
 */

import type { CountryCode, TierCode } from "@prisma/client";
import { contentItemTierStringsForProfileTier } from "@/lib/entitlements/accessible-tiers";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { getExamPathwayById, EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

export type ContentItemAccessibilityClassification =
  | "ACCESSIBLE"
  | "WEAKLY_ACCESSIBLE"
  | "ORPHANED"
  | "NON_PUBLISHED"
  | "NON_LESSON";

/** Profiles used to approximate “any subscriber list + freemium surface” (US/CA × ladder). */
export function lessonBankProbeMatrix(): { country: CountryCode; tier: TierCode; label: string }[] {
  return [
    { country: "US", tier: "NP", label: "US_NP" },
    { country: "US", tier: "RN", label: "US_RN" },
    { country: "US", tier: "LVN_LPN", label: "US_LVN_LPN" },
    { country: "US", tier: "RPN", label: "US_RPN" },
    { country: "US", tier: "ALLIED", label: "US_ALLIED" },
    { country: "CA", tier: "NP", label: "CA_NP" },
    { country: "CA", tier: "RN", label: "CA_RN" },
    { country: "CA", tier: "LVN_LPN", label: "CA_LVN_LPN" },
    { country: "CA", tier: "RPN", label: "CA_RPN" },
    { country: "CA", tier: "ALLIED", label: "CA_ALLIED" },
  ];
}

export type ContentItemLessonRow = {
  id: string;
  slug: string;
  title: string;
  type: string;
  status: string | null;
  tier: string | null;
  regionScope: string | null;
};

/**
 * Whether this row would be included in {@link lessonBankWhereForProfile} for the probe
 * (mirrors `content-access-scope` rules; keep in sync on ladder changes).
 */
export function contentItemMatchesLessonBankProbe(row: ContentItemLessonRow, country: CountryCode, tier: TierCode): boolean {
  if (row.type !== "lesson") return false;
  if ((row.status ?? "").toLowerCase() !== DB_PUBLISHED) return false;
  const tiers = contentItemTierStringsForProfileTier(tier).map((t) => t.toLowerCase());
  const rs = (row.regionScope ?? "BOTH").toUpperCase();
  const regionOk =
    rs === "BOTH" || (country === "CA" && rs === "CA_ONLY") || (country === "US" && rs === "US_ONLY");
  if (!regionOk) return false;
  const rt = (row.tier ?? "").trim().toLowerCase();
  if (rt.length === 0) return true;
  return tiers.includes(rt);
}

/**
 * Primary nursing discovery = NP/RN subscribers US + CA (broadest study surfaces).
 */
export function contentItemMatchesPrimaryNursingSurface(row: ContentItemLessonRow): boolean {
  const primary: { country: CountryCode; tier: TierCode }[] = [
    { country: "US", tier: "NP" },
    { country: "US", tier: "RN" },
    { country: "CA", tier: "NP" },
    { country: "CA", tier: "RN" },
  ];
  return primary.some((p) => contentItemMatchesLessonBankProbe(row, p.country, p.tier));
}

export function classifyContentItemLesson(row: ContentItemLessonRow): {
  classification: ContentItemAccessibilityClassification;
  matchedProbes: string[];
  primaryNursingSurface: boolean;
} {
  if (row.type !== "lesson") {
    return { classification: "NON_LESSON", matchedProbes: [], primaryNursingSurface: false };
  }
  if ((row.status ?? "").toLowerCase() !== DB_PUBLISHED) {
    return { classification: "NON_PUBLISHED", matchedProbes: [], primaryNursingSurface: false };
  }
  const matched: string[] = [];
  for (const p of lessonBankProbeMatrix()) {
    if (contentItemMatchesLessonBankProbe(row, p.country, p.tier)) matched.push(p.label);
  }
  const primary = contentItemMatchesPrimaryNursingSurface(row);
  if (matched.length === 0) {
    return { classification: "ORPHANED", matchedProbes: [], primaryNursingSurface: false };
  }
  if (!primary && matched.length > 0) {
    return { classification: "WEAKLY_ACCESSIBLE", matchedProbes: matched, primaryNursingSurface: false };
  }
  return { classification: "ACCESSIBLE", matchedProbes: matched, primaryNursingSurface: true };
}

export type PathwayLessonAccessibilityClassification = "ACCESSIBLE" | "WEAKLY_ACCESSIBLE" | "ORPHANED";

export type PathwayLessonAuditRow = {
  id: string;
  pathwayId: string;
  slug: string;
  title: string;
  topicSlug: string;
  status: string;
  locale: string;
};

/**
 * Pathway lesson is hub-listable if pathway exists in registry.
 * Weak if topic slug missing/placeholder (cluster index + deep links degrade).
 */
export function classifyPathwayLessonReachability(
  row: PathwayLessonAuditRow,
  topicSlugsInDbClusters: Set<string>,
): {
  classification: PathwayLessonAccessibilityClassification;
  channels: string[];
  notes: string[];
} {
  const pathway = getExamPathwayById(row.pathwayId);
  const channels: string[] = [];
  const notes: string[] = [];

  if (!pathway) {
    return {
      classification: "ORPHANED",
      channels: [],
      notes: [`pathwayId "${row.pathwayId}" not in EXAM_PATHWAYS registry`],
    };
  }
  if (pathway.status !== "active") {
    notes.push(`pathway status=${pathway.status} (non-active hubs may hide or de-emphasize)`);
  }

  channels.push("pathway_lessons_hub_paginated");
  const ts = (row.topicSlug ?? "").trim();
  if (!ts || ts === "general") {
    return {
      classification: "WEAKLY_ACCESSIBLE",
      channels,
      notes: [
        ...notes,
        "Missing or generic topicSlug — topic cluster surfacing and topic-filtered links are weak; assign a canonical topic slug.",
      ],
    };
  }

  if (topicSlugsInDbClusters.has(ts)) {
    channels.push("topic_cluster_page");
  } else {
    notes.push("topicSlug not in DB-derived cluster aggregate for pathway (verify locale or data drift).");
  }

  channels.push("lesson_detail_direct_slug");
  return { classification: "ACCESSIBLE", channels: [...new Set(channels)], notes };
}

/** Active pathway ids from registry (for batch cluster queries). */
export function activeRegistryPathwayIds(): string[] {
  return EXAM_PATHWAYS.filter((p) => p.status === "active").map((p) => p.id);
}
