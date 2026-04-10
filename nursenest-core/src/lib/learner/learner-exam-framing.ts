import { CountryCode } from "@prisma/client";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { getTerminology } from "@/lib/exam-context/terminology";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

/**
 * Region- and pathway-aware copy for rationales, CAT coach, and study flows.
 * Does not alter scoring or routing — presentation only.
 */
export type LearnerExamFraming = {
  /** ISO-like region for terminology helpers */
  region: "us" | "ca" | "unknown";
  /** Short exam name for microcopy (e.g. REx-PN, NCLEX-PN) */
  examShortLabel: string;
  /** Full label for headers */
  examIdentityLabel: string;
  /** Phrase for “passing standard” lines */
  passingStandardPhrase: string;
  /** Prefix for test-taking insight (Layer 3) */
  rationaleExamInsightPrefix: string;
  /** Delegation remediation bullet */
  delegationRemediationHint: string;
  /** Unlicensed assistive role label for stems */
  unlicensedAssistiveLabel: string;
};

export function getLearnerExamFraming(pathwayId: string | null | undefined): LearnerExamFraming {
  const p = pathwayId ? getExamPathwayById(pathwayId.trim()) : undefined;
  const ctx = buildGlobalExamContext(pathwayId, "en");
  if (!p) {
    return {
      region: "unknown",
      examShortLabel: "your licensure exam",
      examIdentityLabel: "your exam pathway",
      passingStandardPhrase: "the practice passing band",
      rationaleExamInsightPrefix: "On exam day,",
      delegationRemediationHint: "Review delegation rules for your provincial or state scope.",
      unlicensedAssistiveLabel: "unlicensed assistive personnel",
    };
  }
  const isCa = p.countryCode === CountryCode.CA;
  const examShortLabel = ctx ? getTerminology("pn_exam_short", ctx) : p.shortName;
  const unlicensedAssistiveLabel = ctx ? getTerminology("unlicensed_assistive", ctx) : isCa ? "unregulated care provider" : "UAP";
  const delegationHint = ctx ? getTerminology("delegation_hint_short", ctx) : null;
  return {
    region: isCa ? "ca" : "us",
    examShortLabel,
    examIdentityLabel: p.displayName,
    passingStandardPhrase: isCa
      ? `the ${examShortLabel} practice passing standard`
      : `the ${examShortLabel} practice passing band`,
    rationaleExamInsightPrefix: `On the ${examShortLabel} exam,`,
    delegationRemediationHint: delegationHint
      ? `Review ${delegationHint}.`
      : isCa
        ? "Follow provincial college standards for delegation and scope."
        : "Follow state scope and facility policy for delegation.",
    unlicensedAssistiveLabel,
  };
}
