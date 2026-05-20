import { NextResponse } from "next/server";
import { ecgApiDeniedResponse, getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";
import { PEDIATRIC_ECG_CURRICULUM } from "@/lib/ecg-module/ecg-pediatric-curriculum";
import {
  filterPediatricTopicForRpnTier,
  getPediatricContentAccessLevel,
} from "@/lib/ecg-module/ecg-pediatric-governance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/modules/ecg-pediatric/topics
 *
 * Returns all pediatric ECG curriculum topics filtered by tier access level.
 * RPN/LPN: dosing and management details are condensed per getPediatricContentAccessLevel.
 */
export async function GET() {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok) return ecgApiDeniedResponse(access.reason);

  const tier = access.mode === "public" ? access.tier : "RN";
  const contentAccess = getPediatricContentAccessLevel(tier);

  const topics = PEDIATRIC_ECG_CURRICULUM.map((topic) => {
    const filtered = filterPediatricTopicForRpnTier(topic);
    return {
      id: filtered.id,
      label: filtered.label,
      primaryRhythmTag: filtered.primaryRhythmTag,
      relatedRhythmTags: filtered.relatedRhythmTags,
      ageGroups: filtered.ageGroups,
      depth: filtered.depth,
      palsPriority: filtered.palsPriority,
      hemodynamicRedFlags: filtered.hemodynamicRedFlags,
      respiratoryFindings: filtered.respiratoryFindings,
      // Filtered by tier: RPN gets escalation criteria but not dosing/management
      nursingActions: filtered.nursingActions,
      parentEducation: filtered.parentEducation,
      escalationCriteria: filtered.escalationCriteria,
      pitfalls: filtered.pitfalls,
      differentials: filtered.differentials,
      estimatedMinutes: filtered.estimatedMinutes,
      questionCount: filtered.questionCount,
      minimumPassScore: filtered.minimumPassScore,
      rpnAccessLevel: filtered.rpnAccessLevel,
      // Governance metadata always included
      clinicalReviewStatus: filtered.clinicalReviewStatus,
      reviewedAt: filtered.reviewedAt,
      guidelineVersion: filtered.guidelineVersion,
      // Omit dosing fields from RPN/LPN access
      includesDosing: contentAccess.showDosing ? filtered.includesDosing : false,
    };
  });

  return NextResponse.json({
    ok: true,
    topics,
    contentAccess,
    tierLabel: tier,
  });
}
