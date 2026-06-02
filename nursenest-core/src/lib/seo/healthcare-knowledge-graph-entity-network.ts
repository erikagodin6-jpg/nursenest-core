import type { StructuredSchemaType } from "@/lib/seo/eeat-entity-authority-architecture";

export type KnowledgeGraphEntityType =
  | "Disease"
  | "Medication"
  | "Lab"
  | "Clinical Skill"
  | "Procedure"
  | "Certification"
  | "Program"
  | "School"
  | "Career"
  | "Employer"
  | "Healthcare Profession"
  | "Body System"
  | "Specialty"
  | "Simulation"
  | "Question"
  | "Lesson"
  | "Flashcard"
  | "Care Plan";

export type KnowledgeGraphRelationshipType =
  | "related_to"
  | "assesses"
  | "treats"
  | "monitors"
  | "requires_skill"
  | "supports_certification"
  | "supports_profession"
  | "offered_by"
  | "employs"
  | "prepares_for"
  | "contains_learning_asset"
  | "belongs_to_system"
  | "belongs_to_specialty";

export type KnowledgeGraphSchemaType = StructuredSchemaType | "MedicalCondition" | "Drug" | "Organization" | "EducationalOrganization";

export type InternalLinkGroup =
  | "Related Topics"
  | "Related Diseases"
  | "Related Medications"
  | "Related Skills"
  | "Related Careers"
  | "Related Certifications"
  | "Related Employers"
  | "Related Programs";

export type TopicalAuthorityCluster =
  | "Cardiology"
  | "Respiratory"
  | "Critical Care"
  | "RT"
  | "Paramedic"
  | "NP"
  | "Pre-Nursing"
  | "Allied Health"
  | "Certification";

export type KnowledgeGraphRelationship = {
  targetId: string;
  type: KnowledgeGraphRelationshipType;
  evidence: string;
};

export type KnowledgeGraphEntity = {
  id: string;
  name: string;
  entityType: KnowledgeGraphEntityType;
  canonicalPath: string;
  aliases: readonly string[];
  definitionRequired: boolean;
  schemaTypes: readonly KnowledgeGraphSchemaType[];
  authorityClusters: readonly TopicalAuthorityCluster[];
  relationships: readonly KnowledgeGraphRelationship[];
};

export type KnowledgeGraphScore = {
  relationshipCoverage: number;
  schemaCoverage: number;
  canonicalCoverage: number;
  definitionCoverage: number;
  aiRetrievalReadiness: number;
  authorityScore: number;
};

export type OrphanEntityRisk = {
  entityId: string;
  entityName: string;
  weakRelationships: boolean;
  missingCanonicalPath: boolean;
  missingDefinition: boolean;
  weakSchema: boolean;
  requiresRemediation: boolean;
};

export type TopicalAuthorityScore = {
  cluster: TopicalAuthorityCluster;
  entityCount: number;
  relationshipCount: number;
  averageAuthorityScore: number;
  missingRelationshipCount: number;
};

export type KnowledgeGraphDashboard = {
  entityCount: number;
  relationshipCount: number;
  entityTypes: number;
  schemaTypes: number;
  authorityClusters: number;
  orphanEntities: number;
  averageAuthorityScore: number;
  internalLinkGroups: number;
  aiRetrievalOptimizationReady: boolean;
};

export const KNOWLEDGE_GRAPH_ENTITY_TYPES = [
  "Disease",
  "Medication",
  "Lab",
  "Clinical Skill",
  "Procedure",
  "Certification",
  "Program",
  "School",
  "Career",
  "Employer",
  "Healthcare Profession",
  "Body System",
  "Specialty",
  "Simulation",
  "Question",
  "Lesson",
  "Flashcard",
  "Care Plan",
] as const satisfies readonly KnowledgeGraphEntityType[];

export const INTERNAL_LINK_GROUPS = [
  "Related Topics",
  "Related Diseases",
  "Related Medications",
  "Related Skills",
  "Related Careers",
  "Related Certifications",
  "Related Employers",
  "Related Programs",
] as const satisfies readonly InternalLinkGroup[];

export const KNOWLEDGE_GRAPH_SCHEMA_TYPES = [
  "DefinedTerm",
  "MedicalCondition",
  "Drug",
  "Person",
  "Organization",
  "EducationalOrganization",
  "Course",
  "FAQPage",
  "Review",
  "BreadcrumbList",
  "Article",
  "WebSite",
  "SearchAction",
] as const satisfies readonly KnowledgeGraphSchemaType[];

export const TOPICAL_AUTHORITY_CLUSTERS = [
  "Cardiology",
  "Respiratory",
  "Critical Care",
  "RT",
  "Paramedic",
  "NP",
  "Pre-Nursing",
  "Allied Health",
  "Certification",
] as const satisfies readonly TopicalAuthorityCluster[];

export const KNOWLEDGE_GRAPH_ENTITIES: readonly KnowledgeGraphEntity[] = [
  entity("disease-heart-failure", "Heart Failure", "Disease", "/healthcare/heart-failure", ["CHF"], true, ["MedicalCondition", "Article", "FAQPage", "BreadcrumbList"], ["Cardiology", "Critical Care"], [
    rel("disease-pulmonary-edema", "related_to", "Heart failure commonly causes pulmonary congestion and edema."),
    rel("lab-bnp", "assesses", "BNP is a core heart failure volume and stretch marker."),
    rel("medication-furosemide", "treats", "Loop diuretics are common heart failure and fluid overload treatments."),
    rel("topic-cardiac-output", "related_to", "Reduced cardiac output is a key heart failure concept."),
    rel("disease-afib", "related_to", "AFib can worsen cardiac output and heart failure symptoms."),
    rel("skill-echocardiography", "assesses", "Echocardiography supports diagnosis and functional assessment."),
    rel("careplan-heart-failure", "contains_learning_asset", "Care plans translate heart failure findings into nursing priorities."),
    rel("lesson-heart-failure", "contains_learning_asset", "Lessons teach pathophysiology, assessment, and management."),
    rel("simulation-heart-failure", "contains_learning_asset", "Simulations teach deterioration and escalation."),
    rel("question-heart-failure", "contains_learning_asset", "Questions assess clinical judgment and exam readiness."),
  ]),
  entity("disease-pulmonary-edema", "Pulmonary Edema", "Disease", "/healthcare/pulmonary-edema", [], true, ["MedicalCondition", "Article"], ["Cardiology", "Respiratory", "Critical Care"], [
    rel("disease-heart-failure", "related_to", "Heart failure is a common cause of pulmonary edema."),
    rel("medication-furosemide", "treats", "Diuresis is commonly used when fluid overload is present."),
    rel("profession-rt", "supports_profession", "RT learners need pulmonary edema oxygenation and ventilation reasoning."),
  ]),
  entity("medication-furosemide", "Furosemide", "Medication", "/medications/furosemide", ["Lasix"], true, ["Drug", "Article", "FAQPage", "BreadcrumbList"], ["Cardiology", "Critical Care"], [
    rel("disease-heart-failure", "treats", "Furosemide reduces congestion in volume-overloaded heart failure."),
    rel("disease-pulmonary-edema", "treats", "Furosemide is commonly used for fluid overload with respiratory compromise."),
    rel("topic-fluid-overload", "treats", "Loop diuretics support fluid removal."),
    rel("lab-potassium", "monitors", "Furosemide can lower potassium and increase arrhythmia risk."),
    rel("skill-medication-administration", "requires_skill", "Administration requires safety checks and patient education."),
    rel("skill-medication-safety", "requires_skill", "Loop diuretics require monitoring for hypotension, dehydration, and electrolytes."),
    rel("topic-patient-education", "related_to", "Patients need teaching about timing, weights, and symptoms."),
  ]),
  entity("lab-bnp", "BNP", "Lab", "/labs/bnp", ["B-type Natriuretic Peptide"], true, ["DefinedTerm", "Article", "FAQPage", "BreadcrumbList"], ["Cardiology"], [
    rel("disease-heart-failure", "assesses", "BNP can support heart failure assessment in the right clinical context."),
    rel("topic-cardiac-output", "related_to", "BNP connects volume status and cardiac stretch to perfusion reasoning."),
    rel("disease-pulmonary-edema", "related_to", "BNP may support assessment of cardiogenic dyspnea."),
    rel("topic-volume-overload", "related_to", "BNP trends can support volume-overload reasoning."),
    rel("specialty-cardiology", "belongs_to_specialty", "BNP is a high-yield cardiology interpretation concept."),
    rel("lesson-bnp-interpretation", "contains_learning_asset", "Interpretation guides connect values to nursing actions."),
    rel("case-heart-failure-bnp", "contains_learning_asset", "Case studies teach interpretation in clinical context."),
  ]),
  entity("profession-nursing", "Nursing", "Healthcare Profession", "/careers/nursing", ["RN", "RPN", "LPN"], true, ["DefinedTerm", "Article", "Organization"], ["Allied Health", "Certification"], [
    rel("skill-medication-administration", "requires_skill", "Medication administration is a core nursing competency."),
    rel("career-rn", "supports_profession", "RN career content supports nursing career discovery."),
    rel("certification-nclex", "supports_certification", "NCLEX is a major nursing certification pathway."),
    rel("program-mcmaster-nursing", "offered_by", "School and program pages connect early-funnel learners to nursing."),
    rel("employer-hamilton-health-sciences", "employs", "Employer pages connect nursing education to job pathways."),
    rel("specialty-cardiology", "belongs_to_specialty", "Nursing content connects to specialty clinical areas."),
  ]),
  entity("profession-rt", "Respiratory Therapy", "Healthcare Profession", "/allied-health/respiratory-therapy", ["RT"], true, ["DefinedTerm", "Article", "Course"], ["Respiratory", "RT", "Allied Health"], [
    rel("skill-ventilator-management", "requires_skill", "Ventilator management is a core RT competency."),
    rel("lab-abg", "assesses", "ABG interpretation is central to RT clinical reasoning."),
    rel("career-rt", "supports_profession", "RT career pages connect discovery to training."),
    rel("program-rt", "offered_by", "RT program pages support admissions search intent."),
    rel("employer-hospital", "employs", "RTs work across hospital and critical care settings."),
  ]),
  entity("certification-nclex", "NCLEX", "Certification", "/exams/nclex-rn", ["NCLEX-RN"], true, ["Course", "FAQPage", "Article", "BreadcrumbList"], ["Certification", "Pre-Nursing"], [
    rel("lesson-heart-failure", "contains_learning_asset", "NCLEX preparation includes cardiovascular lessons."),
    rel("question-heart-failure", "contains_learning_asset", "Questions test prioritization and clinical judgment."),
    rel("flashcard-heart-failure", "contains_learning_asset", "Flashcards support retrieval practice."),
    rel("careplan-heart-failure", "contains_learning_asset", "Care plans reinforce nursing reasoning."),
    rel("simulation-heart-failure", "contains_learning_asset", "Simulations connect assessment to outcomes."),
    rel("topic-study-plans", "prepares_for", "Study plans organize readiness work."),
    rel("topic-readiness", "prepares_for", "Readiness analytics indicate exam preparation progress."),
  ]),
  entity("career-rn", "Registered Nurse", "Career", "/careers/registered-nurse", ["RN"], true, ["DefinedTerm", "Article", "FAQPage"], ["Allied Health", "Certification"], [
    rel("profession-nursing", "supports_profession", "RN is a nursing career path."),
    rel("program-mcmaster-nursing", "prepares_for", "Nursing programs prepare learners for RN careers."),
    rel("employer-hamilton-health-sciences", "employs", "Hospitals employ registered nurses."),
    rel("certification-nclex", "supports_certification", "NCLEX supports RN licensure readiness."),
    rel("topic-rn-salary", "related_to", "Salary pages support career decision search intent."),
    rel("topic-nursing-interview", "related_to", "Interview guides support transition to employment."),
    rel("topic-clinical-placement", "related_to", "Placement guides connect school experience to career readiness."),
  ]),
  entity("program-mcmaster-nursing", "McMaster Nursing Program", "Program", "/schools/mcmaster-nursing", ["McMaster BScN"], true, ["EducationalOrganization", "Course", "FAQPage", "BreadcrumbList"], ["Pre-Nursing"], [
    rel("school-mcmaster", "offered_by", "School entities own program pages."),
    rel("profession-nursing", "prepares_for", "The program prepares learners for nursing practice."),
    rel("career-rn", "prepares_for", "Program pages connect to RN career outcomes."),
    rel("certification-nclex", "prepares_for", "Program completion leads toward NCLEX readiness."),
    rel("employer-hamilton-health-sciences", "related_to", "Regional employer content supports career pathways."),
  ]),
  entity("employer-hamilton-health-sciences", "Hamilton Health Sciences", "Employer", "/employers/hamilton-health-sciences", ["HHS"], true, ["Organization", "Article", "FAQPage", "BreadcrumbList"], ["Allied Health"], [
    rel("career-rn", "employs", "Employer pages connect RN careers to workplaces."),
    rel("profession-nursing", "employs", "Health systems employ nursing professionals."),
    rel("profession-rt", "employs", "Health systems employ respiratory therapists."),
    rel("specialty-cardiology", "belongs_to_specialty", "Specialty services connect employer and specialty authority."),
    rel("topic-new-grad-programs", "related_to", "New graduate programs connect education to employment."),
  ]),
  entity("specialty-cardiology", "Cardiology", "Specialty", "/specialties/cardiology", [], true, ["DefinedTerm", "Article", "BreadcrumbList"], ["Cardiology"], [
    rel("disease-heart-failure", "belongs_to_specialty", "Heart failure is a major cardiology topic."),
    rel("lab-bnp", "belongs_to_specialty", "BNP is a cardiology lab interpretation topic."),
    rel("medication-furosemide", "belongs_to_specialty", "Diuretics are commonly covered in cardiac care."),
    rel("disease-afib", "belongs_to_specialty", "AFib is a core cardiology rhythm topic."),
    rel("body-system-cardiovascular", "belongs_to_system", "Cardiology belongs to the cardiovascular system."),
  ]),
] as const;

export function getKnowledgeGraphEntity(entityId: string, entities: readonly KnowledgeGraphEntity[] = KNOWLEDGE_GRAPH_ENTITIES): KnowledgeGraphEntity | undefined {
  return entities.find((entityItem) => entityItem.id === entityId);
}

export function listEntityRelationships(entityId: string, entities: readonly KnowledgeGraphEntity[] = KNOWLEDGE_GRAPH_ENTITIES): KnowledgeGraphRelationship[] {
  return [...(getKnowledgeGraphEntity(entityId, entities)?.relationships ?? [])];
}

export function buildInternalLinkGraph(entityId: string, entities: readonly KnowledgeGraphEntity[] = KNOWLEDGE_GRAPH_ENTITIES): Record<InternalLinkGroup, KnowledgeGraphEntity[]> {
  const entityItem = getKnowledgeGraphEntity(entityId, entities);
  const related = entityItem?.relationships.map((relationship) => getKnowledgeGraphEntity(relationship.targetId, entities)).filter((relatedEntity): relatedEntity is KnowledgeGraphEntity => Boolean(relatedEntity)) ?? [];
  return {
    "Related Topics": related.filter((item) => ["Disease", "Lab", "Specialty", "Body System"].includes(item.entityType)),
    "Related Diseases": related.filter((item) => item.entityType === "Disease"),
    "Related Medications": related.filter((item) => item.entityType === "Medication"),
    "Related Skills": related.filter((item) => ["Clinical Skill", "Procedure"].includes(item.entityType)),
    "Related Careers": related.filter((item) => item.entityType === "Career"),
    "Related Certifications": related.filter((item) => item.entityType === "Certification"),
    "Related Employers": related.filter((item) => item.entityType === "Employer"),
    "Related Programs": related.filter((item) => ["Program", "School"].includes(item.entityType)),
  };
}

export function scoreKnowledgeGraphEntity(entityItem: KnowledgeGraphEntity): KnowledgeGraphScore {
  const relationshipCoverage = coverage(entityItem.relationships.length, 8);
  const schemaCoverage = coverage(entityItem.schemaTypes.length, 4);
  const canonicalCoverage = entityItem.canonicalPath ? 100 : 0;
  const definitionCoverage = entityItem.definitionRequired ? 100 : 0;
  const aiRetrievalReadiness = average(relationshipCoverage, schemaCoverage, canonicalCoverage, definitionCoverage);
  const authorityScore = average(aiRetrievalReadiness, coverage(entityItem.authorityClusters.length, 2));
  return { relationshipCoverage, schemaCoverage, canonicalCoverage, definitionCoverage, aiRetrievalReadiness, authorityScore };
}

export function detectOrphanEntities(entities: readonly KnowledgeGraphEntity[] = KNOWLEDGE_GRAPH_ENTITIES): OrphanEntityRisk[] {
  return entities
    .map((entityItem) => {
      const weakRelationships = entityItem.relationships.length < 3;
      const missingCanonicalPath = entityItem.canonicalPath.length === 0;
      const missingDefinition = !entityItem.definitionRequired;
      const weakSchema = entityItem.schemaTypes.length < 2;
      return {
        entityId: entityItem.id,
        entityName: entityItem.name,
        weakRelationships,
        missingCanonicalPath,
        missingDefinition,
        weakSchema,
        requiresRemediation: weakRelationships || missingCanonicalPath || missingDefinition || weakSchema,
      };
    })
    .filter((risk) => risk.requiresRemediation);
}

export function calculateTopicalAuthorityScores(entities: readonly KnowledgeGraphEntity[] = KNOWLEDGE_GRAPH_ENTITIES): TopicalAuthorityScore[] {
  return TOPICAL_AUTHORITY_CLUSTERS.map((cluster) => {
    const clusterEntities = entities.filter((entityItem) => entityItem.authorityClusters.includes(cluster));
    const relationshipCount = clusterEntities.reduce((sum, entityItem) => sum + entityItem.relationships.length, 0);
    const averageAuthorityScore = Math.round(clusterEntities.reduce((sum, entityItem) => sum + scoreKnowledgeGraphEntity(entityItem).authorityScore, 0) / (clusterEntities.length || 1));
    const missingRelationshipCount = clusterEntities.filter((entityItem) => entityItem.relationships.length < 5).length;
    return { cluster, entityCount: clusterEntities.length, relationshipCount, averageAuthorityScore, missingRelationshipCount };
  });
}

export function buildKnowledgeGraphDashboard(entities: readonly KnowledgeGraphEntity[] = KNOWLEDGE_GRAPH_ENTITIES): KnowledgeGraphDashboard {
  const scores = entities.map(scoreKnowledgeGraphEntity);
  const relationshipCount = entities.reduce((sum, entityItem) => sum + entityItem.relationships.length, 0);
  const orphanEntities = detectOrphanEntities(entities).length;
  return {
    entityCount: entities.length,
    relationshipCount,
    entityTypes: KNOWLEDGE_GRAPH_ENTITY_TYPES.length,
    schemaTypes: KNOWLEDGE_GRAPH_SCHEMA_TYPES.length,
    authorityClusters: TOPICAL_AUTHORITY_CLUSTERS.length,
    orphanEntities,
    averageAuthorityScore: Math.round(scores.reduce((sum, score) => sum + score.authorityScore, 0) / (scores.length || 1)),
    internalLinkGroups: INTERNAL_LINK_GROUPS.length,
    aiRetrievalOptimizationReady: relationshipCount > entities.length * 3 && orphanEntities === 0,
  };
}

function entity(
  id: string,
  name: string,
  entityType: KnowledgeGraphEntityType,
  canonicalPath: string,
  aliases: readonly string[],
  definitionRequired: boolean,
  schemaTypes: readonly KnowledgeGraphSchemaType[],
  authorityClusters: readonly TopicalAuthorityCluster[],
  relationships: readonly KnowledgeGraphRelationship[],
): KnowledgeGraphEntity {
  return { id, name, entityType, canonicalPath, aliases, definitionRequired, schemaTypes, authorityClusters, relationships };
}

function rel(targetId: string, type: KnowledgeGraphRelationshipType, evidence: string): KnowledgeGraphRelationship {
  return { targetId, type, evidence };
}

function coverage(value: number, target: number): number {
  return Math.max(0, Math.min(100, Math.round((Math.min(value, target) / target) * 100)));
}

function average(...values: readonly number[]): number {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
