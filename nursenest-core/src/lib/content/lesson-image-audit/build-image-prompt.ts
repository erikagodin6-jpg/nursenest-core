import { STYLE_GOVERNANCE } from "@/lib/content/lesson-image-audit/constants";
import type { RecommendedLessonImageType } from "@/lib/content/lesson-image-audit/types";

export function buildSuggestedImagePrompt(args: {
  lessonTitle: string;
  recommendedImageType: RecommendedLessonImageType;
  productionNotes: string;
  clusterLabel: string;
}): string {
  const { lessonTitle, recommendedImageType, productionNotes, clusterLabel } = args;
  return [
    `Premium NurseNest clinical education illustration for "${lessonTitle}".`,
    `Type: ${recommendedImageType.replace(/_/g, " ")}.`,
    `Cluster: ${clusterLabel}.`,
    productionNotes,
    `Style: ${STYLE_GOVERNANCE.aesthetic}`,
    `Palette: Blossom/Mint Blossom soft pastels, warm plum ink labels, no stock photo, no muddy grey.`,
    `Format: vector-like, clean lines, generous whitespace, 3:2 landscape.`,
  ].join(" ");
}
