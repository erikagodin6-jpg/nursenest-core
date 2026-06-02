import type { LessonImageAuditRow } from "@/lib/content/lesson-image-audit/types";

export type ProductionRationales = {
  whyImageryNeeded: string;
  educationalRationale: string;
  seoRationale: string;
  backlogReason: "missing" | "upgrade_weak_match" | "upgrade_fallback" | "upgrade_low_quality";
};

function statusPhrase(status: LessonImageAuditRow["status"]): string {
  switch (status) {
    case "no_image":
      return "No clinical illustration is mapped to this lesson.";
    case "fuzzy_match":
      return "Only a fuzzy inventory match exists — a lesson-specific asset is needed.";
    case "fallback_match":
      return "A generic body-system fallback is shown — learners need topic-specific art.";
    case "low_quality_image":
      return "Current imagery is low quality or mismatched for this clinical topic.";
    case "duplicate_image_candidate":
      return "Shared fallback art repeats across lessons — a dedicated or modular asset would improve clarity.";
    default:
      return "Imagery should be upgraded to match clinical learning goals.";
  }
}

export function backlogReasonForRow(row: LessonImageAuditRow): ProductionRationales["backlogReason"] {
  if (row.status === "no_image") return "missing";
  if (row.status === "low_quality_image") return "upgrade_low_quality";
  if (row.status === "fuzzy_match") return "upgrade_weak_match";
  return "upgrade_fallback";
}

export function buildProductionRationales(row: LessonImageAuditRow): ProductionRationales {
  const reason = backlogReasonForRow(row);
  const statusLine = statusPhrase(row.status);

  const educationalRationale = [
    `Visual necessity ${row.visualNecessity}/100 — ${row.recommendedImageType.replace(/_/g, " ")} reinforces`,
    row.productionNotes.toLowerCase(),
    `Cluster: ${row.clusterLabel}.`,
    row.educationalValue >= 60
      ? "High conceptual load; illustration reduces cognitive overload."
      : "Supports pattern recognition and bedside-ready recall.",
  ].join(" ");

  const seoRationale = [
    `SEO/traffic weight ${row.seoImportance}/100; slug "${row.lessonSlug}".`,
    row.trafficPotential >= 55
      ? "Flagship nursing search topic — strong organic discovery potential."
      : "Pathway lesson with measurable learner search intent.",
    row.pathwayLabel,
  ].join(" ");

  const whyImageryNeeded = [
    statusLine,
    `Recommended: ${row.recommendedImageType.replace(/_/g, " ")} (${row.clusterLabel}).`,
    row.visualNecessity >= 65 ? "Highly visual clinical concept." : "Visual reinforcement improves retention.",
  ].join(" ");

  return { whyImageryNeeded, educationalRationale, seoRationale, backlogReason: reason };
}
