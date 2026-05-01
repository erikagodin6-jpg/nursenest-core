/**
 * Pathway lesson hub — marketing headings + meta (H1 / title / description).
 *
 * List integrity elsewhere:
 * - Route resolves one `pathway.id` per URL (`resolveExamPathwayFromMarketingHubSegment`).
 * - Rows omit unusable links via `pathwayLessonHasRenderableHubSlug` (pathway-lesson-types).
 * - Public `/lessons` index filters by `pathwayMatchesMarketingRegion` (nursing-tier-public-labels).
 */
import { ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { resolveLessonContextForPathway } from "@/lib/lessons/lesson-region-exam";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";

/** Country label for visible copy and meta. */
export function pathwayCountryLabel(pathway: ExamPathwayDefinition): string {
  if (pathway.countrySlug === "canada") return "Canada";
  if (pathway.countrySlug === "us") return "United States";
  if (pathway.countrySlug === "uk") return "United Kingdom";
  if (pathway.countrySlug === "australia") return "Australia";
  if (pathway.countrySlug === "philippines") return "Philippines";
  if (pathway.countrySlug === "india") return "India";
  if (pathway.countrySlug === "nigeria") return "Nigeria";
  if (pathway.countrySlug === "saudi-arabia") return "Saudi Arabia";
  return pathway.countrySlug;
}

/**
 * Region-aware public exam label for lessons surfaces.
 * Fallback behavior (missing/unknown region) defaults to NCLEX naming for PN/RN.
 */
export function pathwayRegionAwareExamName(pathway: ExamPathwayDefinition): string {
  if (pathway.examFamily === ExamFamily.GENERIC) {
    return pathway.shortName || pathway.displayName;
  }
  const { exam } = resolveLessonContextForPathway(pathway);
  if (exam === "REX_PN") return "REx-PN";
  if (exam === "NCLEX_PN") return "NCLEX-PN";
  if (exam === "NCLEX_RN") return "NCLEX-RN";
  if (exam === "NP") return pathway.shortName || pathway.displayName;
  if (exam === "ALLIED") return pathway.shortName || "Allied health";
  return pathway.shortName || pathway.displayName;
}

/**
 * Tier + exam + country-aware headline for pathway lesson hubs (H1 + SEO alignment).
 * Primary exam keyword first, then lesson intent + country (matches `<title>` stem).
 */
export function pathwayLessonHubH1(pathway: ExamPathwayDefinition): string {
  const place = pathwayCountryLabel(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const country = pathway.countrySlug === "canada" ? "CA" : pathway.countrySlug === "us" ? "US" : "US";
  if (pathway.examFamily === ExamFamily.GENERIC && pathway.roleTrack === "rn") {
    return `${examName} clinical reasoning lessons · ${place}`;
  }
  switch (pathway.roleTrack) {
    case "rn":
      return `${examName} clinical lessons for ${place}`;
    case "lpn":
      return `${examName} (${getNursingRoleLabel({ country, role: "PN" })}) clinical lessons for ${place}`;
    case "rpn":
      return `${examName} (${getNursingRoleLabel({ country, role: "PN" })}) clinical lessons for ${place}`;
    case "np":
      return `${examName} exam prep lessons for ${place}`;
    case "allied":
      return `Allied health exam prep lessons for ${place}`;
    default:
      return `Clinical lessons for ${pathway.displayName}`;
  }
}

export function pathwayLessonHubMetaTitle(pathway: ExamPathwayDefinition): string {
  return `${pathwayLessonHubH1(pathway)} | NurseNest`;
}

export function pathwayLessonHubMetaDescription(pathway: ExamPathwayDefinition): string {
  const examName = pathwayRegionAwareExamName(pathway);
  if (pathway.countrySlug === "canada") {
    return `Practice ${examName} reasoning with guided clinical lessons, topic drills, and links to pathway questions and adaptive tests. Built for Canadian nurses.`;
  }
  if (pathway.countrySlug === "us") {
    return `Practice ${examName} reasoning with guided clinical lessons, topic drills, and pathway-matched question practice. Built for US nursing candidates.`;
  }
  if (pathway.countrySlug === "uk") {
    return `Clinical reasoning lessons and practice aligned to safe nursing judgement for United Kingdom NMC registration preparation. Verify CBT, OSCE, and eligibility details with the NMC.`;
  }
  if (pathway.countrySlug === "australia") {
    return `Clinical reasoning lessons and drills that strengthen judgement for AHPRA/NMBA internationally qualified nurse pathways. Follow official IQNM, portfolio, and assessment instructions from AHPRA.`;
  }
  if (pathway.countrySlug === "philippines") {
    return `Clinical reasoning support alongside Philippine nursing training; PNLE administration belongs to the PRC. NurseNest does not mirror proprietary PNLE items—use for transferable skills and parallel NCLEX prep when applicable.`;
  }
  if (pathway.countrySlug === "india") {
    return `Clinical reasoning lessons and drills that strengthen safe nursing judgement for Indian state nursing council registration preparation. Verify every eligibility and examination rule with your state council and INC notices.`;
  }
  if (pathway.countrySlug === "nigeria") {
    return `Clinical reasoning lessons and practice structure for NMCN RN licensure preparation. NurseNest does not reproduce proprietary NMCN examination items—confirm bulletins and eligibility with the Nursing and Midwifery Council of Nigeria.`;
  }
  if (pathway.countrySlug === "saudi-arabia") {
    return `Clinical reasoning lessons and drills oriented to SCFHS licensing preparation for internationally educated nurses. Follow official SCFHS instructions for your category; English UI is default with room for Arabic overlays later.`;
  }
  return `Practice ${examName} reasoning with guided clinical lessons, topic drills, and pathway-matched question practice.`;
}

export function pathwayLessonTopicClusterMetaTitle(pathway: ExamPathwayDefinition, topicLabel: string): string {
  const examName = pathwayRegionAwareExamName(pathway);
  return `${topicLabel} · ${examName} lessons (${pathwayCountryLabel(pathway)}) | NurseNest`;
}

function truncateMetaDescription(text: string, maxLen = 158): string {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  const slice = t.slice(0, maxLen - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const base = lastSpace > 48 ? slice.slice(0, lastSpace) : slice;
  return `${base}…`;
}

/**
 * SERP-focused meta for topic lesson clusters (lesson-level topic intent).
 * Keeps length within common snippet limits while adding question-bank + CAT vocabulary.
 */
export function pathwayLessonTopicClusterMetaDescription(
  pathway: ExamPathwayDefinition,
  topicLabel: string,
): string {
  const place =
    pathway.countrySlug === "canada"
      ? "Canadian"
      : pathway.countrySlug === "us"
        ? "US"
        : pathway.countrySlug === "uk"
          ? "UK"
          : pathway.countrySlug === "australia"
            ? "Australian"
            : pathway.countrySlug === "philippines"
              ? "Philippine"
              : pathway.countrySlug === "india"
                ? "Indian"
                : pathway.countrySlug === "nigeria"
                  ? "Nigerian"
                  : pathway.countrySlug === "saudi-arabia"
                    ? "Saudi"
                    : pathway.countrySlug;
  const exam = pathway.displayName;
  const examName = pathwayRegionAwareExamName(pathway);
  const topic = topicLabel.trim();
  const raw = `${topic} lessons for ${examName} (${exam}, ${place} scope): guided readings, clinical reasoning, and links to pathway-matched practice questions plus CAT-style adaptive study.`;
  return truncateMetaDescription(raw);
}
