import { CountryCode } from "@prisma/client";
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

  if (p.id === "ca-rpn-rex-pn") {
    return {
      region: "ca",
      examShortLabel: "REx-PN",
      examIdentityLabel: "REx-PN (Canadian Practical Nurse / RPN)",
      passingStandardPhrase: "the REx-PN practice passing standard (Canada PN)",
      rationaleExamInsightPrefix: "On the REx-PN exam,",
      delegationRemediationHint:
        "Review delegation between RN, RPN, and unregulated care providers using your provincial college standards—not US state LVN/UAP framing.",
      unlicensedAssistiveLabel: "unregulated care provider / care aide",
    };
  }

  if (p.id === "ca-rn-nclex-rn") {
    return {
      region: "ca",
      examShortLabel: "NCLEX-RN",
      examIdentityLabel: "NCLEX-RN (Canada RN)",
      passingStandardPhrase: "the NCLEX-RN practice passing standard (Canada)",
      rationaleExamInsightPrefix: "On the Canadian NCLEX-RN exam,",
      delegationRemediationHint:
        "Review Canadian scope, delegation, and documentation expectations aligned with your provincial college.",
      unlicensedAssistiveLabel: "unregulated care provider",
    };
  }

  if (p.id === "us-lpn-nclex-pn") {
    return {
      region: "us",
      examShortLabel: "NCLEX-PN",
      examIdentityLabel: "NCLEX-PN (US LVN/LPN)",
      passingStandardPhrase: "the NCLEX-PN practice passing band",
      rationaleExamInsightPrefix: "On the NCLEX-PN exam,",
      delegationRemediationHint: "Review delegation between RN, LPN/LVN, and assistive personnel per your state nurse practice act.",
      unlicensedAssistiveLabel: "UAP",
    };
  }

  if (p.id === "us-rn-nclex-rn") {
    return {
      region: "us",
      examShortLabel: "NCLEX-RN",
      examIdentityLabel: "NCLEX-RN (United States)",
      passingStandardPhrase: "the NCLEX-RN practice passing band",
      rationaleExamInsightPrefix: "On the NCLEX-RN exam,",
      delegationRemediationHint: "Review delegation and scope per US practice acts and facility policy.",
      unlicensedAssistiveLabel: "UAP",
    };
  }

  const isCa = p.countryCode === CountryCode.CA;
  return {
    region: isCa ? "ca" : "us",
    examShortLabel: p.shortName,
    examIdentityLabel: p.displayName,
    passingStandardPhrase: isCa
      ? "the practice passing standard for Canadian candidates"
      : "the practice passing band for US candidates",
    rationaleExamInsightPrefix: isCa ? "On your Canadian exam," : "On your US exam,",
    delegationRemediationHint: isCa
      ? "Follow provincial college standards for delegation and scope."
      : "Follow state scope and facility policy for delegation.",
    unlicensedAssistiveLabel: isCa ? "unregulated care provider" : "UAP",
  };
}
