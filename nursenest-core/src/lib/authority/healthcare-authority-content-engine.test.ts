import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTHORITY_CATEGORY_META,
  ALLIED_HEALTH_AUTHORITY_HUBS,
  AUTHORITY_BODY_SYSTEMS,
  AUTHORITY_CONDITION_PILLARS,
  AUTHORITY_CONTENT_PHASE_TARGETS,
  AUTHORITY_CONTENT_ROADMAP,
  AUTHORITY_LAYER_PROFESSIONS,
  AUTHORITY_LEARNING_ASSET_TYPES,
  AUTHORITY_TOPIC_CLUSTERS,
  CANADIAN_ADVANTAGE_NETWORK,
  CERTIFICATION_AUTHORITY_HUBS,
  CLINICAL_AUTHORITY_MINIMUM_PUBLICATION_SCORE,
  CLINICAL_AUTHORITY_STANDARD,
  CONTENT_PRODUCTION_MINIMUM_SCORE,
  CONTENT_PRODUCTION_WORKFLOW,
  CONTENT_SCENARIO_REQUIREMENTS,
  SEO_MONETIZATION_GUARDRAILS,
  SPECIALTY_AUTHORITY_HUBS,
  buildAuthorityContentDashboard,
  buildAuthorityClusterDashboard,
  buildAuthorityJsonLd,
  buildAuthorityPremiumFunnel,
  buildAuthorityScoreEngine,
  buildAuthorityUserJourneyNetwork,
  buildAlliedHealthProductionQueues,
  buildContentProductionCalendar,
  buildContentProductionDashboard,
  buildHealthcareKnowledgeGraph,
  buildHealthcareTopicalAuthorityDashboard,
  detectAuthorityContentGaps,
  generateContentBrief,
  generateContentOutline,
  getHealthcareKnowledgeGraphEdgesForNode,
  getHealthcareKnowledgeGraphNode,
  getAuthorityPage,
  getAuthorityPages,
  getAuthorityPagesByCategory,
  getAuthorityRoadmapByCategory,
  getAuthorityTopicCluster,
  listAuthorityContentPaths,
  searchAuthorityContent,
  scoreContentProductionCandidate,
  validateClinicalAuthorityStandard,
  validateAuthorityPage,
} from "@/lib/authority/healthcare-authority-content-engine";

test("authority content engine exposes every required library category", () => {
  assert.deepEqual(Object.keys(AUTHORITY_CATEGORY_META).sort(), [
    "allied-careers",
    "allied-study",
    "care-plans",
    "certifications",
    "clinical-skills",
    "conditions",
    "interview-prep",
    "labs",
    "medications",
    "placements",
  ]);
});

test("authority pages include EEAT governance and pass the quality gate", () => {
  const pages = getAuthorityPages();
  assert.ok(pages.length >= 10);

  for (const page of pages) {
    assert.ok(page.reviewer.name);
    assert.ok(page.reviewer.credentials);
    assert.ok(page.governance.updatedAt);
    assert.ok(page.governance.reviewCycleDue);
    assert.ok(page.references.length >= 2);
    assert.ok(page.related.length >= 3);

    const quality = validateAuthorityPage(page);
    assert.equal(quality.publishReady, true, `${page.slug}: ${quality.issues.join(", ")}`);
    assert.ok(quality.score >= 85);
  }
});

test("clinical authority standard enforces depth, completeness, and 90-point publication threshold", () => {
  assert.equal(CLINICAL_AUTHORITY_MINIMUM_PUBLICATION_SCORE, 90);
  assert.equal(CLINICAL_AUTHORITY_STANDARD.conditions.wordTarget.min, 3000);
  assert.equal(CLINICAL_AUTHORITY_STANDARD.medications.wordTarget.min, 2500);
  assert.equal(CLINICAL_AUTHORITY_STANDARD["care-plans"].wordTarget.min, 2000);
  assert.equal(CLINICAL_AUTHORITY_STANDARD["clinical-skills"].wordTarget.min, 2500);
  assert.equal(CLINICAL_AUTHORITY_STANDARD.certifications.wordTarget.min, 4000);

  const heartFailure = getAuthorityPage("conditions", "heart-failure");
  assert.ok(heartFailure);
  const audit = validateClinicalAuthorityStandard(heartFailure);
  assert.equal(audit.minimumPublicationScore, 90);
  assert.equal(audit.publishReady, false);
  assert.ok(audit.wordCount < CLINICAL_AUTHORITY_STANDARD.conditions.wordTarget.min);
  assert.ok(audit.issues.includes("below_minimum_depth_target"));
  assert.ok(audit.missingElements.includes("Why This Matters Clinically"));
});

test("every authority library has a live seed page and phase-one target", () => {
  for (const category of Object.keys(AUTHORITY_CATEGORY_META)) {
    const pages = getAuthorityPagesByCategory(category as keyof typeof AUTHORITY_CATEGORY_META);
    assert.ok(pages.length > 0, `${category} should have at least one seed page`);
    assert.ok(AUTHORITY_CONTENT_PHASE_TARGETS[category as keyof typeof AUTHORITY_CATEGORY_META].phaseOneTarget > pages.length);
  }
});

test("authority roadmap captures the requested organic traffic expansion backlog", () => {
  assert.ok(AUTHORITY_CONTENT_ROADMAP.length >= 80);
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.category === "conditions" && entry.slug === "sepsis"));
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.category === "medications" && entry.slug === "metoprolol"));
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.category === "care-plans" && entry.slug === "copd-nursing-care-plan"));
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.category === "labs" && entry.slug === "troponin"));
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.category === "clinical-skills" && entry.slug === "foley-catheter-insertion"));
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.profession === "rt" && entry.slug === "ventilator-settings-guide"));
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.profession === "paramedic" && entry.slug === "primary-survey-guide"));
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.profession === "mlt" && entry.slug === "cbc-interpretation-guide"));
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.profession === "ot" && entry.slug === "adl-assessment-guide"));
  assert.ok(AUTHORITY_CONTENT_ROADMAP.some((entry) => entry.profession === "pt" && entry.slug === "mobility-assessment-guide"));

  const diseaseRoadmap = getAuthorityRoadmapByCategory("conditions");
  assert.ok(diseaseRoadmap.length >= 20);
  assert.equal(diseaseRoadmap[0].trafficOpportunity, "high");
});

test("topic cluster domination registry models pillar and supporting page ownership", () => {
  assert.ok(AUTHORITY_TOPIC_CLUSTERS.length >= 15);
  const priorityClusters = AUTHORITY_TOPIC_CLUSTERS.filter((cluster) => cluster.priority === 1);
  assert.deepEqual(
    priorityClusters.slice(0, 10).map((cluster) => cluster.id),
    ["heart-failure", "copd", "diabetes", "sepsis", "pneumonia", "stroke", "aki", "ckd", "atrial-fibrillation", "myocardial-infarction"],
  );

  const heartFailure = getAuthorityTopicCluster("heart-failure");
  assert.ok(heartFailure);
  assert.equal(heartFailure.targetSupportingPages.min, 30);
  assert.ok(heartFailure.supportingPages.length >= 30);
  assert.ok(heartFailure.supportingPages.some((page) => page.title === "Heart Failure BNP Interpretation"));
  assert.ok(heartFailure.supportingPages.some((page) => page.title === "Heart Failure Simulation"));
  assert.ok(heartFailure.supportingPages.some((page) => page.title === "Heart Failure Clinical Placement Guide"));

  const diabetes = getAuthorityTopicCluster("diabetes");
  assert.ok(diabetes);
  assert.equal(diabetes.targetSupportingPages.min, 50);
  assert.ok(diabetes.supportingPages.some((page) => page.title === "Diabetes Foot Care"));
  assert.ok(diabetes.supportingPages.some((page) => page.title === "DKA"));

  const respiratoryTherapy = getAuthorityTopicCluster("respiratory-therapy");
  assert.ok(respiratoryTherapy);
  assert.equal(respiratoryTherapy.profession, "rt");
  assert.ok(respiratoryTherapy.supportingPages.length >= 20);
});

test("topic cluster dashboard exposes readiness metrics", () => {
  const dashboard = buildAuthorityClusterDashboard();
  assert.ok(dashboard.totalClusters >= 15);
  assert.equal(dashboard.phaseOneClusters, 10);
  assert.ok(dashboard.averageClusterCompletion > 70);
  assert.ok(dashboard.averagePublicationReadiness > 40);
  assert.ok(dashboard.rows.every((row) => row.internalLinkingScore > 0));
  assert.ok(dashboard.rows.every((row) => row.keywordCoverage > 0));
  assert.ok(dashboard.rows.every((row) => row.trafficPotential === "high"));
});

test("healthcare topical authority network defines all requested authority layers", () => {
  assert.deepEqual(
    AUTHORITY_LAYER_PROFESSIONS.map((profession) => profession.label),
    ["Nursing", "RPN/LPN", "NP", "RT", "Paramedic", "OT", "PT", "MLT", "PSW"],
  );
  assert.deepEqual(
    AUTHORITY_BODY_SYSTEMS.map((system) => system.label),
    ["Cardiovascular", "Respiratory", "Neurology", "Endocrine", "Renal", "GI", "Hematology", "Oncology", "Mental Health", "Pediatrics", "Maternal Child"],
  );
  assert.deepEqual([...AUTHORITY_CONDITION_PILLARS], ["Heart Failure", "COPD", "Stroke", "Diabetes", "Sepsis", "AKI", "CKD", "AFib", "Pneumonia", "MI"]);
  assert.deepEqual(
    AUTHORITY_LEARNING_ASSET_TYPES.map((asset) => asset.label),
    [
      "Lessons",
      "Flashcards",
      "Questions",
      "CAT",
      "NGN",
      "Simulations",
      "Clinical Skills",
      "Labs",
      "Pharmacology",
      "Care Plans",
      "Concept Maps",
      "Study Plans",
      "Clinical Reasoning Pathways",
    ],
  );
});

test("specialty, allied, and certification authority hubs cover the requested destinations", () => {
  assert.deepEqual(
    SPECIALTY_AUTHORITY_HUBS.map((hub) => hub.title),
    ["Cardiology Hub", "Respiratory Hub", "Critical Care Hub", "Emergency Hub", "Mental Health Hub", "Maternal Child Hub", "Pediatrics Hub", "Community Care Hub"],
  );
  assert.deepEqual(
    ALLIED_HEALTH_AUTHORITY_HUBS.map((hub) => hub.title),
    ["Respiratory Therapy Hub", "Paramedic Hub", "Occupational Therapy Hub", "Physiotherapy Hub", "Medical Laboratory Technology Hub", "PSW Hub"],
  );
  assert.ok(ALLIED_HEALTH_AUTHORITY_HUBS.every((hub) => hub.sections.includes("Career Guides")));
  assert.ok(ALLIED_HEALTH_AUTHORITY_HUBS.every((hub) => hub.sections.includes("Clinical Placement")));
  assert.ok(ALLIED_HEALTH_AUTHORITY_HUBS.every((hub) => hub.sections.includes("Clinical Reasoning")));

  assert.deepEqual(
    CERTIFICATION_AUTHORITY_HUBS.slice(0, 8).map((hub) => hub.title),
    ["NCLEX-RN Hub", "REx-PN Hub", "CNPLE Hub", "FNP Hub", "PMHNP Hub", "AGPCNP Hub", "WHNP Hub", "PNP-PC Hub"],
  );
  assert.ok(CANADIAN_ADVANTAGE_NETWORK.some((entry) => entry.title === "Canadian Nursing" && entry.priority === "highest"));
});

test("healthcare knowledge graph stores condition, concept, hub, and learning asset relationships", () => {
  const graph = buildHealthcareKnowledgeGraph();
  assert.ok(graph.nodes.length > 100);
  assert.ok(graph.edges.length > 150);

  assert.ok(getHealthcareKnowledgeGraphNode("cluster:heart-failure"));
  const heartFailureEdges = getHealthcareKnowledgeGraphEdgesForNode("cluster:heart-failure");
  const targetLabels = heartFailureEdges
    .map((edge) => getHealthcareKnowledgeGraphNode(edge.targetId)?.label)
    .filter(Boolean);
  for (const label of [
    "BNP",
    "Furosemide",
    "Digoxin",
    "Pulmonary Edema",
    "Fluid Overload",
    "Cardiac Output",
    "AFib",
    "Echocardiography",
    "Heart Failure Care Plans",
    "Heart Failure Simulations",
    "Heart Failure NCLEX Questions",
  ]) {
    assert.ok(targetLabels.includes(label), `${label} should be related to Heart Failure`);
  }
});

test("authority score engine and gap detection track topic, system, profession, and certification readiness", () => {
  const scores = buildAuthorityScoreEngine();
  assert.ok(scores.some((score) => score.label === "Cardiology Authority Score" && score.scope === "system"));
  assert.ok(scores.some((score) => score.label === "Respiratory Authority Score" && score.scope === "system"));
  assert.ok(scores.some((score) => score.label === "Respiratory Therapy Authority Score" && score.scope === "profession"));
  assert.ok(scores.some((score) => score.label === "NCLEX-RN Authority Score" && score.scope === "certification"));
  assert.ok(scores.some((score) => score.label === "PMHNP Authority Score" && score.scope === "certification"));
  assert.ok(scores.every((score) => score.target === 90));

  const gaps = detectAuthorityContentGaps();
  assert.ok(gaps.missingTopics.includes("copd"));
  assert.ok(gaps.weakHubs.includes("Mental Health Hub"));
  assert.ok(gaps.underservedCertifications.includes("PMHNP Hub"));

  const dashboard = buildHealthcareTopicalAuthorityDashboard();
  assert.equal(dashboard.layerCounts.professions, 9);
  assert.equal(dashboard.hubs.specialty, 8);
  assert.equal(dashboard.hubs.allied, 6);
  assert.ok(dashboard.scoreSummary.totalScores >= 30);
});

test("authority user journey network connects public pages to premium training experiences", () => {
  const journey = buildAuthorityUserJourneyNetwork("heart-failure-nursing-care-plan");
  assert.deepEqual(
    journey.map((step) => step.title),
    [
      "Heart Failure",
      "Heart Failure Medications",
      "Heart Failure Labs",
      "Heart Failure Clinical Skills",
      "Heart Failure Simulation",
      "Heart Failure Flashcards",
      "Heart Failure Questions",
      "Heart Failure Study Plan",
    ],
  );
  assert.equal(journey[0].access, "public");
  assert.ok(journey.slice(3).every((step) => step.access === "subscription_required"));
});

test("SEO monetization guardrails separate public education from premium training", () => {
  assert.ok(SEO_MONETIZATION_GUARDRAILS.freeContent.includes("Disease pages"));
  assert.ok(SEO_MONETIZATION_GUARDRAILS.freeContent.includes("Clinical skill overviews"));
  assert.ok(SEO_MONETIZATION_GUARDRAILS.premiumContent.includes("Question Banks"));
  assert.ok(SEO_MONETIZATION_GUARDRAILS.premiumContent.includes("CAT Exams"));
  assert.ok(SEO_MONETIZATION_GUARDRAILS.premiumContent.includes("Clinical Reasoning Pathways"));
  assert.ok(SEO_MONETIZATION_GUARDRAILS.premiumContent.includes("Care Plan Builder"));
  assert.ok(SEO_MONETIZATION_GUARDRAILS.previewAllowed.includes("Learning objectives"));

  const page = getAuthorityPage("conditions", "heart-failure");
  assert.ok(page);
  const funnel = buildAuthorityPremiumFunnel(page);
  assert.deepEqual(
    funnel.map((item) => item.type),
    ["lesson", "flashcards", "questions", "cat-exam", "study-plan", "simulation", "care-plan-builder", "clinical-skill"],
  );
  assert.ok(funnel.every((item) => item.access === "subscription_required"));
  assert.ok(funnel.every((item) => item.href.startsWith("/pricing?")));
  assert.ok(funnel.every((item) => item.previewLabel.length > 0));
});

test("programmatic content production pipeline generates briefs and outlines before publication", () => {
  assert.equal(CONTENT_PRODUCTION_WORKFLOW[0], "keyword_opportunity");
  assert.equal(CONTENT_PRODUCTION_WORKFLOW.at(-1), "performance_monitoring");
  assert.ok(CONTENT_PRODUCTION_WORKFLOW.includes("clinical_review"));
  assert.ok(CONTENT_PRODUCTION_WORKFLOW.includes("eeat_review"));
  assert.equal(CONTENT_PRODUCTION_MINIMUM_SCORE, 90);
  assert.ok(CONTENT_SCENARIO_REQUIREMENTS.includes("Patient Cases"));
  assert.ok(CONTENT_SCENARIO_REQUIREMENTS.includes("Documentation Examples"));

  const roadmapEntry = AUTHORITY_CONTENT_ROADMAP.find((entry) => entry.slug === "copd-nursing-care-plan");
  assert.ok(roadmapEntry);
  const brief = generateContentBrief(roadmapEntry);
  assert.equal(brief.primaryKeyword, "COPD Nursing Care Plan");
  assert.equal(brief.clusterAssignment, "Respiratory Care Plans");
  assert.ok(brief.internalLinkTargets.includes("Related Questions"));
  assert.ok(brief.eeatRequirements.includes("Publication Score >= 90"));
  assert.ok(brief.conversionOpportunities.includes("questions"));
  assert.ok(brief.suggestedMedia.includes("Clinical Flowcharts"));

  const outline = generateContentOutline(roadmapEntry);
  assert.ok(outline.sections.includes("Patient Scenario"));
  assert.ok(outline.sections.includes("Interventions"));
  assert.ok(outline.sections.includes("Rationales"));
  assert.ok(outline.scenarioRequirements.includes("Escalation Situations"));
});

test("content quality scoring blocks weak or incomplete publication candidates", () => {
  const strong = scoreContentProductionCandidate({
    clinicalAccuracy: 95,
    educationalValue: 94,
    readability: 92,
    practicalUtility: 93,
    examRelevance: 91,
    alliedHealthRelevance: 90,
    internalLinking: 96,
    conversionPotential: 92,
    eeatStrength: 95,
    publicationReadiness: 94,
  });
  assert.equal(strong.publishReady, true);
  assert.ok(strong.score >= 90);

  const weak = scoreContentProductionCandidate({
    clinicalAccuracy: 95,
    educationalValue: 82,
    readability: 92,
    practicalUtility: 93,
    examRelevance: 91,
    alliedHealthRelevance: 90,
    internalLinking: 70,
    conversionPotential: 92,
    eeatStrength: 95,
    publicationReadiness: 94,
  });
  assert.equal(weak.publishReady, false);
  assert.ok(weak.revisionReasons.includes("educationalValue"));
  assert.ok(weak.revisionReasons.includes("internalLinking"));
});

test("content calendar, allied queues, and production dashboard track manufacturing capacity", () => {
  const calendar = buildContentProductionCalendar();
  assert.ok(calendar.some((item) => item.window === "30-day"));
  assert.ok(calendar.some((item) => item.window === "90-day"));
  assert.ok(calendar.every((item) => item.trafficOpportunityScore > 0));
  assert.ok(calendar.every((item) => item.revenueOpportunityScore > 0));

  const queues = buildAlliedHealthProductionQueues();
  assert.ok(queues.some((queue) => queue.profession === "rt" && queue.pagesPlanned >= 20));
  assert.ok(queues.some((queue) => queue.profession === "paramedic" && queue.pagesPlanned >= 20));
  assert.ok(queues.some((queue) => queue.profession === "mlt" && queue.pagesPlanned >= 20));
  assert.ok(queues.every((queue) => queue.pagesPublished === 0));

  const dashboard = buildContentProductionDashboard();
  assert.equal(dashboard.workflowStages.length, CONTENT_PRODUCTION_WORKFLOW.length);
  assert.equal(dashboard.briefsReady, AUTHORITY_CONTENT_ROADMAP.length);
  assert.equal(dashboard.outlinesReady, AUTHORITY_CONTENT_ROADMAP.length);
  assert.ok(dashboard.performanceSnapshot.indexedPages >= 10);
  assert.ok(dashboard.topicalAuthorityScores.some((item) => item.cluster === "Heart Failure"));
});

test("authority search supports synonyms and medical shorthand", () => {
  assert.equal(searchAuthorityContent("CHF")[0]?.slug, "heart-failure");
  assert.equal(searchAuthorityContent("Lasix")[0]?.slug, "furosemide");
  assert.equal(searchAuthorityContent("K+")[0]?.slug, "potassium");
  assert.equal(searchAuthorityContent("respiratory therapist Canada")[0]?.slug, "respiratory-therapist-canada");
  assert.equal(searchAuthorityContent("NCLEX-RN")[0]?.slug, "nclex-rn-study-guide");
});

test("authority detail pages can emit MedicalWebPage, FAQ, Article, and Organization schema", () => {
  const page = getAuthorityPage("conditions", "heart-failure");
  assert.ok(page);

  const graph = buildAuthorityJsonLd(page);
  assert.equal(graph[0]["@type"], "MedicalWebPage");
  assert.equal(graph[1]["@type"], "FAQPage");
  assert.equal(graph[2]["@type"], "Article");
  assert.equal(graph[3]["@type"], "Organization");
  assert.match(JSON.stringify(graph), /Heart Failure/);
  assert.match(JSON.stringify(graph), /NurseNest/);
});

test("authority dashboard tracks content targets and sitemap paths", () => {
  const dashboard = buildAuthorityContentDashboard();
  assert.equal(dashboard.totalPublishedPages, getAuthorityPages().length);
  assert.equal(dashboard.totalPhaseOneTarget, 2650);
  assert.ok(dashboard.totalLongTermTarget >= 12000);
  assert.equal(dashboard.rows.length, Object.keys(AUTHORITY_CATEGORY_META).length);
  assert.ok(dashboard.rows.every((row) => row.eeatCoverage === 100));
  assert.ok(dashboard.rows.every((row) => row.clinicalAuthorityCoverage === 0));
  assert.ok(dashboard.rows.every((row) => row.averageClinicalAuthorityScore < 90));
  assert.ok(dashboard.rows.every((row) => row.plannedPages > 0));
  assert.ok(dashboard.rows.every((row) => row.keywordCoverage > 0));
  assert.ok(dashboard.rows.some((row) => row.professionCoverage >= 50));
  assert.ok(dashboard.rows.every((row) => row.estimatedTrafficOpportunity === "high"));

  const paths = listAuthorityContentPaths();
  assert.ok(paths.includes("/healthcare"));
  assert.ok(paths.includes("/healthcare/conditions/heart-failure"));
  assert.ok(paths.includes("/healthcare/certifications/nclex-rn-study-guide"));
});
