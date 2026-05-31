export type ContentAssetKind =
  | "lesson"
  | "flashcard"
  | "question"
  | "case_study"
  | "clinical_skill"
  | "simulation"
  | "readiness_domain"
  | "study_plan";

export type RelatedContentRef = {
  readonly id: string;
  readonly kind: ContentAssetKind;
  readonly relevance: "primary" | "supporting" | "remediation";
};

export type ContentRelationshipNode = {
  readonly id: string;
  readonly kind: ContentAssetKind;
  readonly topicSlug: string;
  readonly relatedLessons: readonly RelatedContentRef[];
  readonly relatedFlashcards: readonly RelatedContentRef[];
  readonly relatedQuestions: readonly RelatedContentRef[];
  readonly relatedSimulations: readonly RelatedContentRef[];
  readonly relatedClinicalSkills: readonly RelatedContentRef[];
  readonly relatedReadinessDomains: readonly RelatedContentRef[];
};

export type ContentRelationshipAuditIssue = {
  readonly code: "missing_related_content" | "self_reference" | "wrong_kind_bucket" | "duplicate_relation";
  readonly message: string;
};

const bucketKind: Record<
  "relatedLessons" | "relatedFlashcards" | "relatedQuestions" | "relatedSimulations" | "relatedClinicalSkills" | "relatedReadinessDomains",
  ContentAssetKind
> = {
  relatedLessons: "lesson",
  relatedFlashcards: "flashcard",
  relatedQuestions: "question",
  relatedSimulations: "simulation",
  relatedClinicalSkills: "clinical_skill",
  relatedReadinessDomains: "readiness_domain",
};

const relationBuckets = Object.keys(bucketKind) as Array<keyof typeof bucketKind>;

export function createEmptyContentRelationshipNode(input: {
  id: string;
  kind: ContentAssetKind;
  topicSlug: string;
}): ContentRelationshipNode {
  return {
    ...input,
    relatedLessons: [],
    relatedFlashcards: [],
    relatedQuestions: [],
    relatedSimulations: [],
    relatedClinicalSkills: [],
    relatedReadinessDomains: [],
  };
}

export function auditContentRelationshipNode(node: ContentRelationshipNode): readonly ContentRelationshipAuditIssue[] {
  const issues: ContentRelationshipAuditIssue[] = [];
  const totalRelations = relationBuckets.reduce((sum, bucket) => sum + node[bucket].length, 0);
  if (totalRelations < 3) {
    issues.push({ code: "missing_related_content", message: `${node.id} must connect to at least three related assets` });
  }

  const seen = new Set<string>();
  for (const bucket of relationBuckets) {
    for (const ref of node[bucket]) {
      const key = `${bucket}:${ref.kind}:${ref.id}`;
      if (seen.has(key)) issues.push({ code: "duplicate_relation", message: `${node.id} duplicates relation ${key}` });
      seen.add(key);
      if (ref.id === node.id) issues.push({ code: "self_reference", message: `${node.id} references itself` });
      if (ref.kind !== bucketKind[bucket]) {
        issues.push({
          code: "wrong_kind_bucket",
          message: `${node.id} has ${ref.kind} in ${bucket}; expected ${bucketKind[bucket]}`,
        });
      }
    }
  }
  return issues;
}

export function contentRelationshipCompletenessScore(node: ContentRelationshipNode): number {
  const populatedBuckets = relationBuckets.filter((bucket) => node[bucket].length > 0).length;
  return Math.round((populatedBuckets / relationBuckets.length) * 100);
}
