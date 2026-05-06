import type { BlogCliTopicTier } from "@/lib/blog/blog-cli-pathophysiology-topic-corpus";

/**
 * Map CLI audience tier to control-panel `exam` + `country` (pathway-aware prompts + internal link hints).
 */
export function blogCliTierToExamCountry(tier: BlogCliTopicTier): { exam: string; country: "US" | "CA" | "unspecified" } {
  switch (tier) {
    case "rpn":
      return { exam: "REx-PN", country: "CA" };
    case "pn":
      return { exam: "NCLEX-PN", country: "US" };
    case "np":
      return { exam: "CNPLE", country: "CA" };
    case "allied":
      return { exam: "Allied Health", country: "CA" };
    case "new-grad":
      return { exam: "NCLEX-RN", country: "US" };
    case "rn":
    default:
      return { exam: "NCLEX-RN", country: "US" };
  }
}
