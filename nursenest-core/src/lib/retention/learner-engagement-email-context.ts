import type { TierCode } from "@prisma/client";
import { appOriginForEmail } from "@/lib/email/app-origin";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

export type LearnerEngagementEmailContext = {
  firstName: string;
  /** Short exam track label for subject/body (RN, RPN, LVN/LPN, NP, Allied, New Grad). */
  trackLabel: string;
  /** Optional pathway display from registry. */
  pathwayLabel: string | null;
  /** One-line educational disclaimer (non-clinical). */
  educationalDisclaimer: string;
  managePrefsUrl: string;
};

function tierToTrackLabel(tier: TierCode): string {
  switch (tier) {
    case "RN":
      return "NCLEX-RN";
    case "RPN":
      return "RPN / RN-PN (Canada)";
    case "LVN_LPN":
      return "NCLEX-PN";
    case "NP":
      return "NP board prep";
    case "ALLIED":
      return "Allied health exam prep";
    case "NEW_GRAD":
      return "New grad transition";
    default:
      return "Nursing exam prep";
  }
}

const DISCLAIMER =
  "NurseNest is an educational study tool. It does not provide medical advice, diagnosis, or treatment. Always follow your school, employer, and licensing board requirements.";

/**
 * Builds pathway-aware, tier-aware copy context for retention templates (no PHI).
 */
export function buildLearnerEngagementEmailContext(args: {
  name: string;
  tier: TierCode;
  learnerPath: string | null;
  alliedProfessionKey: string | null;
}): LearnerEngagementEmailContext {
  const first = args.name.trim().split(/\s+/)[0] || "there";
  const pathwayId = args.learnerPath?.trim() || null;
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : null;
  let pathwayLabel = pathway ? pathway.shortName || pathway.displayName : pathwayId;
  if (args.tier === "ALLIED" && args.alliedProfessionKey?.trim()) {
    const prof = args.alliedProfessionKey.replace(/_/g, " ");
    pathwayLabel = pathwayLabel ? `${pathwayLabel} (${prof})` : prof;
  }
  const managePrefsUrl = `${appOriginForEmail()}/app/account/study-preferences`;
  return {
    firstName: first,
    trackLabel: tierToTrackLabel(args.tier),
    pathwayLabel: pathwayLabel?.trim() || null,
    educationalDisclaimer: DISCLAIMER,
    managePrefsUrl,
  };
}

export function engagementPreambleHtml(ctx: LearnerEngagementEmailContext): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const pathLine = ctx.pathwayLabel
    ? `<p style="font-size:14px;color:#444;">Your study context: <strong>${esc(ctx.trackLabel)}</strong> · ${esc(ctx.pathwayLabel)}</p>`
    : `<p style="font-size:14px;color:#444;">Your study context: <strong>${esc(ctx.trackLabel)}</strong></p>`;
  return `<p>Hi ${esc(ctx.firstName)},</p>${pathLine}`;
}

export function engagementFooterHtml(ctx: LearnerEngagementEmailContext): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const u = esc(ctx.managePrefsUrl);
  return `<p style="margin-top:20px;font-size:12px;color:#555;line-height:1.45;">${esc(ctx.educationalDisclaimer)}</p>
<p style="font-size:12px;color:#666;">Manage study emails: <a href="${u}">email preferences</a>.</p>`;
}
