import type { CasperFeedbackDomain } from "@/lib/casper/casper-feedback";

export type CasperRemediationRecommendation = {
  domain: CasperFeedbackDomain;
  title: string;
  description: string;
  exercises: string[];
};

export const CASPER_REMEDIATION_LIBRARY: CasperRemediationRecommendation[] = [
  {
    domain: "communication-clarity",
    title: "Improve communication clarity",
    description:
      "Practice shorter opening statements that identify the issue and stakeholders earlier.",
    exercises: [
      "Limit introductions to two sentences before naming the action plan.",
      "Practice summarizing the ethical issue in one sentence.",
      "Use stakeholder-first framing in conflict scenarios.",
    ],
  },
  {
    domain: "stakeholder-awareness",
    title: "Strengthen stakeholder awareness",
    description:
      "Practice identifying who is affected directly and indirectly before proposing solutions.",
    exercises: [
      "List stakeholders before drafting your response.",
      "Consider hidden or indirect impacts.",
      "Practice balancing empathy with accountability.",
    ],
  },
  {
    domain: "professionalism",
    title: "Develop professionalism language",
    description:
      "Practice calm, respectful responses during disagreement or conflict.",
    exercises: [
      "Replace punitive language with collaborative phrasing.",
      "Practice non-defensive escalation wording.",
      "Use reflective rather than accusatory statements.",
    ],
  },
];

export function getCasperRemediationRecommendations(
  domains: CasperFeedbackDomain[],
): CasperRemediationRecommendation[] {
  return CASPER_REMEDIATION_LIBRARY.filter((recommendation) =>
    domains.includes(recommendation.domain),
  );
}
