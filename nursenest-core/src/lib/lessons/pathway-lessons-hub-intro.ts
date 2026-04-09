/**
 * Exam-pathway-specific lead copy for public lesson index hubs (single source for tone + scope).
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export function pathwayLessonsHubLead(pathway: ExamPathwayDefinition): string {
  switch (pathway.id) {
    case "us-rn-nclex-rn":
      return "Clinical lessons for US RN candidates—decision-making and safety first, not isolated facts. Content follows the NCLEX-RN Client Needs structure; pair each lesson with pathway-scoped questions, adaptive (CAT) practice, and performance feedback. Subscription unlocks full depth; previews stay discoverable.";
    case "ca-rn-nclex-rn":
      return "Clinical lessons for Canadian RN candidates—written for judgment and safe care in Canadian acute contexts. Content follows NCLEX-RN Client Needs groupings; pair lessons with pathway-scoped questions and CAT practice. Subscription unlocks full depth; previews stay discoverable.";
    case "us-lpn-nclex-pn":
      return "Clinical lessons for US LVN/LPN candidates, organized by NCLEX-PN Client Needs—scope-safe judgment, delegation, and ordered care. Pair each lesson with pathway questions and CAT sessions. Subscription unlocks full depth; previews stay discoverable.";
    case "ca-rpn-rex-pn":
      return "Clinical lessons for Canadian practical nursing (RPN) candidates preparing for REx-PN: scope-safe judgment, delegation, and Canadian regulatory context. Pair lessons with pathway-scoped questions and practice. Subscription unlocks full depth; previews stay discoverable.";
    case "us-np-fnp":
      return "Advanced-practice lessons for US Family NP candidates—assessment → diagnosis → plan → evaluation across the full lifespan. Pair lessons with case-based questions and exam simulations; subscription unlocks full depth; previews stay discoverable.";
    case "ca-np-cnple":
      return "Canadian NP licensure (CNPLE) is evolving—this hub stays aligned as requirements finalize. Use pathway-scoped questions and CAT practice now; structured lessons will deepen here as they publish. Join the waitlist on the exam hub if checkout is not yet open for this track.";
    default: {
      const place = pathway.countrySlug === "canada" ? "Canada" : "the United States";
      return `Exam-scoped clinical lessons for ${pathway.shortName} (${place}). Terminology matches this pathway only—pair reading with the question bank and CAT practice. Subscription unlocks full lesson depth; previews remain indexable.`;
    }
  }
}
