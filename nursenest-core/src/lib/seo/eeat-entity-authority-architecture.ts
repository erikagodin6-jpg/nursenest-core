export type AuthorityPageSurface =
  | "Lessons"
  | "Disease Pages"
  | "Medication Pages"
  | "Care Plans"
  | "Clinical Skills"
  | "Career Guides"
  | "School Pages"
  | "Certification Pages"
  | "Interview Pages"
  | "Placement Pages"
  | "Allied Health Pages"
  | "NP Pages"
  | "Glossary Terms";

export type BreadcrumbHierarchyExample = {
  label: string;
  crumbs: readonly string[];
};

export type HealthcareEntityType =
  | "Disease"
  | "Medication"
  | "Lab"
  | "Skill"
  | "Simulation"
  | "Question"
  | "Career"
  | "Certification"
  | "Program"
  | "Employer"
  | "DefinedTerm"
  | "CarePlan";

export type AuthorityLayer = "profession" | "certification" | "body_system" | "topic" | "supporting_content";

export type StructuredSchemaType =
  | "MedicalWebPage"
  | "Article"
  | "FAQPage"
  | "BreadcrumbList"
  | "Organization"
  | "WebSite"
  | "SearchAction"
  | "EducationalOrganization"
  | "Course"
  | "HowTo"
  | "DefinedTerm"
  | "Review"
  | "Person";

export type EeatRequiredField =
  | "author"
  | "author_credentials"
  | "reviewer"
  | "reviewer_credentials"
  | "review_date"
  | "update_date"
  | "content_type"
  | "evidence_sources";

export type ReviewerProfession = "RN" | "NP" | "RT" | "Paramedic" | "OT" | "PT" | "MLT";

export type ReviewerProfileSeed = {
  slug: string;
  displayName: string;
  credentials: ReviewerProfession;
  specialty: string;
  bioRequired: true;
  pagesReviewedMetric: true;
};

export type EntityRelationshipSeed = {
  entity: string;
  entityType: HealthcareEntityType;
  relatedEntities: readonly string[];
  supportingContent: readonly string[];
};

export type AuthorityLayerNode = {
  layer: AuthorityLayer;
  label: string;
  examples: readonly string[];
};

export type OrganizationAuthorityContract = {
  organizationSchema: true;
  websiteSchema: true;
  searchAction: true;
  educationalOrganizationSchema: true;
  sameAsRequired: true;
  businessInformationRequired: true;
  educationalFocusRequired: true;
  professionalFocusRequired: true;
  healthcareFocusRequired: true;
};

export type DefinedTermSchemaSeed = {
  term: string;
  schemaType: "DefinedTerm";
  relatedEntities: readonly string[];
};

export type PageAuthoritySignalInput = {
  visibleBreadcrumbs: boolean;
  schemaBreadcrumbs: boolean;
  consistentHierarchy: boolean;
  authorDisplayed: boolean;
  authorCredentialsDisplayed: boolean;
  reviewerDisplayed: boolean;
  reviewerCredentialsDisplayed: boolean;
  reviewDateDisplayed: boolean;
  updateDateDisplayed: boolean;
  evidenceSourcesDisplayed: boolean;
  entityRelationshipsStored: boolean;
  internalLinks: number;
  schemaTypes: readonly StructuredSchemaType[];
};

export type InternalAuthorityScore = {
  breadcrumbCoverage: number;
  schemaCoverage: number;
  authorCoverage: number;
  reviewerCoverage: number;
  entityCoverage: number;
  knowledgeGraphReadiness: number;
  topicalAuthorityScore: number;
  eeatScore: number;
};

export type OrphanAuthorityRisk = {
  weakHierarchy: boolean;
  weakBreadcrumbStructure: boolean;
  weakEntityConnections: boolean;
  weakInternalLinks: boolean;
  requiresRemediation: boolean;
};

export type EeatEntityAuthorityDashboard = {
  pageSurfaces: number;
  breadcrumbExamples: number;
  entityRelationships: number;
  authorityLayers: number;
  reviewerProfiles: number;
  schemaTypes: number;
  definedTerms: number;
  organizationAuthorityReady: boolean;
};

export const INDEXABLE_PAGE_SURFACES = [
  "Lessons",
  "Disease Pages",
  "Medication Pages",
  "Care Plans",
  "Clinical Skills",
  "Career Guides",
  "School Pages",
  "Certification Pages",
  "Interview Pages",
  "Placement Pages",
  "Allied Health Pages",
  "NP Pages",
  "Glossary Terms",
] as const satisfies readonly AuthorityPageSurface[];

export const BREADCRUMB_HIERARCHY_EXAMPLES: readonly BreadcrumbHierarchyExample[] = [
  { label: "Heart Failure Care Plan", crumbs: ["Homepage", "Nursing", "RN", "Cardiovascular", "Heart Failure", "Heart Failure Nursing Care Plan"] },
  { label: "PEEP", crumbs: ["Homepage", "Allied Health", "Respiratory Therapy", "Ventilator Management", "PEEP"] },
  { label: "ATI TEAS Anatomy", crumbs: ["Homepage", "Admissions", "ATI TEAS", "Science", "Anatomy"] },
  { label: "RN Salary Ontario", crumbs: ["Homepage", "Career Center", "Nursing", "Ontario", "RN Salary Ontario"] },
] as const;

export const BREADCRUMB_SCHEMA_SURFACES = INDEXABLE_PAGE_SURFACES;

export const ENTITY_RELATIONSHIP_SEEDS: readonly EntityRelationshipSeed[] = [
  {
    entity: "Heart Failure",
    entityType: "Disease",
    relatedEntities: ["BNP", "Furosemide", "Pulmonary Edema", "Echocardiogram", "Cardiac Output", "AFib"],
    supportingContent: ["Heart Failure Care Plan", "Heart Failure Simulation", "Heart Failure Questions"],
  },
  {
    entity: "PEEP",
    entityType: "DefinedTerm",
    relatedEntities: ["Mechanical Ventilation", "FiO2", "ARDS", "Oxygenation", "Tidal Volume"],
    supportingContent: ["Ventilator Management Lesson", "ABG Interpretation Tool", "RT Clinical Placement Guide"],
  },
  {
    entity: "Metoprolol",
    entityType: "Medication",
    relatedEntities: ["Beta Blockers", "Heart Failure", "Atrial Fibrillation", "Blood Pressure", "Heart Rate"],
    supportingContent: ["Medication Page", "Pharmacology Questions", "Cardiac Case Study"],
  },
  {
    entity: "Hamilton Health Sciences",
    entityType: "Employer",
    relatedEntities: ["Nursing Careers", "Clinical Placements", "Ontario", "New Graduate Programs"],
    supportingContent: ["Employer Profile", "Nursing Interview Guide", "RN Salary Ontario"],
  },
] as const;

export const TOPICAL_AUTHORITY_LAYERS: readonly AuthorityLayerNode[] = [
  { layer: "profession", label: "Profession", examples: ["Nursing", "Respiratory Therapy", "Paramedicine", "OT", "PT", "MLT"] },
  { layer: "certification", label: "Certification", examples: ["NCLEX", "REx-PN", "CNPLE", "FNP", "PMHNP", "TEAS", "HESI", "CASPER"] },
  { layer: "body_system", label: "Body Systems", examples: ["Cardiovascular", "Respiratory", "Neurology", "Endocrine", "Renal", "GI"] },
  { layer: "topic", label: "Topics", examples: ["Heart Failure", "COPD", "Stroke", "Sepsis", "Diabetes"] },
  { layer: "supporting_content", label: "Supporting Content", examples: ["Questions", "Flashcards", "Lessons", "Skills", "Labs", "Simulations", "Care Plans", "Career Content"] },
] as const;

export const EEAT_REQUIRED_FIELDS = [
  "author",
  "author_credentials",
  "reviewer",
  "reviewer_credentials",
  "review_date",
  "update_date",
  "content_type",
  "evidence_sources",
] as const satisfies readonly EeatRequiredField[];

export const REVIEWER_PROFILE_SEEDS: readonly ReviewerProfileSeed[] = [
  reviewer("rn-reviewer", "RN Reviewer", "RN", "Nursing education and clinical judgment"),
  reviewer("np-reviewer", "NP Reviewer", "NP", "Advanced practice, diagnostics, and prescribing"),
  reviewer("rt-reviewer", "RT Reviewer", "RT", "Respiratory therapy and ventilation"),
  reviewer("paramedic-reviewer", "Paramedic Reviewer", "Paramedic", "Emergency response and prehospital care"),
  reviewer("ot-reviewer", "OT Reviewer", "OT", "Functional assessment and occupational therapy"),
  reviewer("pt-reviewer", "PT Reviewer", "PT", "Mobility, rehabilitation, and physiotherapy"),
  reviewer("mlt-reviewer", "MLT Reviewer", "MLT", "Laboratory interpretation and specimen quality"),
] as const;

export const ORGANIZATION_AUTHORITY_CONTRACT: OrganizationAuthorityContract = {
  organizationSchema: true,
  websiteSchema: true,
  searchAction: true,
  educationalOrganizationSchema: true,
  sameAsRequired: true,
  businessInformationRequired: true,
  educationalFocusRequired: true,
  professionalFocusRequired: true,
  healthcareFocusRequired: true,
};

export const MEDICAL_CONTENT_SCHEMA_TYPES = [
  "MedicalWebPage",
  "Article",
  "FAQPage",
  "BreadcrumbList",
  "Organization",
  "WebSite",
  "SearchAction",
  "EducationalOrganization",
  "Course",
  "HowTo",
  "DefinedTerm",
  "Review",
  "Person",
] as const satisfies readonly StructuredSchemaType[];

export const DEFINED_TERM_SCHEMA_SEEDS: readonly DefinedTermSchemaSeed[] = [
  definedTerm("Preload", ["Afterload", "Cardiac Output", "Heart Failure"]),
  definedTerm("Afterload", ["Preload", "Blood Pressure", "Heart Failure"]),
  definedTerm("PEEP", ["Ventilator Management", "FiO2", "ARDS"]),
  definedTerm("ABG", ["pH", "PaCO2", "PaO2", "Bicarbonate"]),
  definedTerm("Cardiac Output", ["Stroke Volume", "Heart Rate", "Perfusion"]),
  definedTerm("COPD", ["Dyspnea", "Oxygen Therapy", "ABG"]),
  definedTerm("Sepsis", ["Lactate", "Shock", "Infection"]),
] as const;

export function calculateInternalAuthorityScore(input: PageAuthoritySignalInput): InternalAuthorityScore {
  const breadcrumbCoverage = averageBooleans(input.visibleBreadcrumbs, input.schemaBreadcrumbs, input.consistentHierarchy);
  const authorCoverage = averageBooleans(input.authorDisplayed, input.authorCredentialsDisplayed);
  const reviewerCoverage = averageBooleans(input.reviewerDisplayed, input.reviewerCredentialsDisplayed, input.reviewDateDisplayed);
  const evidenceCoverage = averageBooleans(input.updateDateDisplayed, input.evidenceSourcesDisplayed);
  const entityCoverage = input.entityRelationshipsStored ? 100 : 0;
  const schemaCoverage = Math.round((Math.min(input.schemaTypes.length, 5) / 5) * 100);
  const linkCoverage = Math.round((Math.min(input.internalLinks, 15) / 15) * 100);
  const knowledgeGraphReadiness = Math.round((schemaCoverage + entityCoverage + linkCoverage + breadcrumbCoverage) / 4);
  const topicalAuthorityScore = Math.round((entityCoverage + linkCoverage + breadcrumbCoverage) / 3);
  const eeatScore = Math.round((authorCoverage + reviewerCoverage + evidenceCoverage + schemaCoverage) / 4);
  return {
    breadcrumbCoverage,
    schemaCoverage,
    authorCoverage,
    reviewerCoverage,
    entityCoverage,
    knowledgeGraphReadiness,
    topicalAuthorityScore,
    eeatScore,
  };
}

export function detectOrphanAuthorityRisk(input: PageAuthoritySignalInput): OrphanAuthorityRisk {
  const weakHierarchy = !input.consistentHierarchy;
  const weakBreadcrumbStructure = !input.visibleBreadcrumbs || !input.schemaBreadcrumbs;
  const weakEntityConnections = !input.entityRelationshipsStored;
  const weakInternalLinks = input.internalLinks < 5;
  return {
    weakHierarchy,
    weakBreadcrumbStructure,
    weakEntityConnections,
    weakInternalLinks,
    requiresRemediation: weakHierarchy || weakBreadcrumbStructure || weakEntityConnections || weakInternalLinks,
  };
}

export function buildEeatEntityAuthorityDashboard(): EeatEntityAuthorityDashboard {
  return {
    pageSurfaces: INDEXABLE_PAGE_SURFACES.length,
    breadcrumbExamples: BREADCRUMB_HIERARCHY_EXAMPLES.length,
    entityRelationships: ENTITY_RELATIONSHIP_SEEDS.length,
    authorityLayers: TOPICAL_AUTHORITY_LAYERS.length,
    reviewerProfiles: REVIEWER_PROFILE_SEEDS.length,
    schemaTypes: MEDICAL_CONTENT_SCHEMA_TYPES.length,
    definedTerms: DEFINED_TERM_SCHEMA_SEEDS.length,
    organizationAuthorityReady: Object.values(ORGANIZATION_AUTHORITY_CONTRACT).every(Boolean),
  };
}

function reviewer(slug: string, displayName: string, credentials: ReviewerProfession, specialty: string): ReviewerProfileSeed {
  return { slug, displayName, credentials, specialty, bioRequired: true, pagesReviewedMetric: true };
}

function definedTerm(term: string, relatedEntities: readonly string[]): DefinedTermSchemaSeed {
  return { term, schemaType: "DefinedTerm", relatedEntities };
}

function averageBooleans(...values: readonly boolean[]): number {
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}
