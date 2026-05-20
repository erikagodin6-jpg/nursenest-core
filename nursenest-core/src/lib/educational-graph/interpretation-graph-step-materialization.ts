/**
 * Materialize governed EduGraphStep for interpretation entry surfaces.
 */
import type { ClinicalInterpretationEntry } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { clinicalInterpretationGuidePath } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { interpretationGraphLinkage } from "@/lib/breadcrumbs/breadcrumb-semantic-integration";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";

export function materializeInterpretationEntryGraphStep(
  entry: ClinicalInterpretationEntry,
  pathwayId: string | null,
): EduGraphStep {
  const linkage = interpretationGraphLinkage(entry, pathwayId);
  const interpretationStep = linkage.traversal.steps.find((s) => s.stepKind === "interpretation");
  if (interpretationStep) return interpretationStep;

  const topicSlug =
    entry.related.topicSlugs[0] ?? entry.slug.replace(/-interpretation$/, "").replace(/_/g, "-");
  const traversal = orchestrateEducationalGraph({
    topicSlug,
    topicLabel: entry.h1,
    pathwayId,
    sourceSurface: "topic_hub_public",
  });
  const fromOrch = traversal.steps.find((s) => s.stepKind === "interpretation");
  if (fromOrch) return fromOrch;

  return {
    stepId: `interpretation:${entry.slug}`,
    stepKind: "interpretation",
    competencyId: linkage.traversal.competencyId,
    topicSlug,
    title: entry.h1,
    description: entry.metaDescription.slice(0, 240),
    href: clinicalInterpretationGuidePath(entry.slug),
    pathwayId,
    educationalIntent: "interpretation",
    learnerStateReason: null,
    estimatedMinutes: 12,
    difficulty: "intermediate",
    remediationPriority: 8,
    graphDepth: 0,
    sourceSurface: "topic_hub_public",
    telemetryMetadata: { reasoningRelation: "lab_abnormality_to_prioritization" },
  };
}
