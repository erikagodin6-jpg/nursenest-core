import { buildAiOverviewDashboard, scoreLlmAuthority, type AiReadablePageSignals } from "@/lib/seo/ai-search-llm-citation-optimization-engine";
import { calculateInternalAuthorityScore, type PageAuthoritySignalInput } from "@/lib/seo/eeat-entity-authority-architecture";
import { buildKnowledgeGraphDashboard, calculateTopicalAuthorityScores } from "@/lib/seo/healthcare-knowledge-graph-entity-network";

export type CommandCenterTopic =
  | "Heart Failure"
  | "COPD"
  | "Diabetes"
  | "Sepsis"
  | "Stroke"
  | "AFib"
  | "AKI"
  | "CKD"
  | "Ventilator Management"
  | "ABG Interpretation"
  | "Trauma Assessment";

export type AlliedCommandProfession = "RT" | "Paramedic" | "OT" | "PT" | "MLT" | "PSW";

export type CertificationCommandTarget = "NCLEX" | "REx-PN" | "CNPLE" | "FNP" | "PMHNP" | "AGPCNP" | "WHNP" | "PNP-PC" | "TEAS" | "HESI" | "CASPER";

export type ContentPerformanceSurface =
  | "Top Pages"
  | "Top Clusters"
  | "Top Careers"
  | "Top Certifications"
  | "Top Programs"
  | "Top School Pages"
  | "Top Interview Pages"
  | "Top Placement Pages"
  | "Top Salary Pages";

export type AlertType =
  | "traffic_drop"
  | "conversion_drop"
  | "authority_decline"
  | "ranking_loss"
  | "indexation_problem"
  | "schema_break"
  | "subscription_notification_failure"
  | "stripe_webhook_failure";

export type ExecutiveOverviewMetrics = {
  organicTraffic: number;
  newUsers: number;
  accountsCreated: number;
  trialsStarted: number;
  subscriptions: number;
  mrrCents: number;
  arrCents: number;
  conversionRate: number;
  trafficGrowth: number;
  revenueGrowth: number;
  authorityGrowth: number;
};

export type SeoCommandCenterMetrics = {
  indexedPages: number;
  nonIndexedPages: number;
  crawledNotIndexed: number;
  duplicateContent: number;
  canonicalIssues: number;
  orphanPages: number;
  internalLinkingScore: number;
  schemaCoverage: number;
  breadcrumbCoverage: number;
  topKeywords: readonly string[];
  fastestGrowingKeywords: readonly string[];
};

export type TopicOwnershipRow = {
  topic: CommandCenterTopic;
  ownershipPercent: number;
  authorityScore: number;
  traffic: number;
  conversions: number;
  revenueCents: number;
  buildPriority: "Critical" | "High" | "Medium" | "Low";
};

export type AlliedCommandRow = {
  profession: AlliedCommandProfession;
  authorityScore: number;
  traffic: number;
  keywords: number;
  conversions: number;
  growth: number;
  contentGaps: readonly string[];
};

export type CertificationCommandRow = {
  certification: CertificationCommandTarget;
  traffic: number;
  conversions: number;
  contentCoverage: number;
  authorityScore: number;
  readinessScore: number;
};

export type AiVisibilityDashboard = {
  aiCitationReadiness: number;
  entityCoverage: number;
  definitionCoverage: number;
  faqCoverage: number;
  knowledgeGraphStrength: number;
  aiOverviewOpportunities: readonly string[];
  aiMentionTracking: readonly string[];
};

export type EeatDashboard = {
  authorCoverage: number;
  reviewerCoverage: number;
  clinicalReviewCoverage: number;
  freshnessCoverage: number;
  referenceCoverage: number;
  schemaCoverage: number;
  trustScore: number;
  authorityScore: number;
};

export type ConversionCommandCenter = {
  visitorToAccountRate: number;
  accountToTrialRate: number;
  trialToPaidRate: number;
  paidToRenewalRate: number;
  revenueAttributionCents: number;
  contentAttribution: readonly string[];
  professionAttribution: readonly string[];
};

export type ContentPerformanceRow = {
  surface: ContentPerformanceSurface;
  leaders: readonly string[];
  traffic: number;
  conversions: number;
  revenueCents: number;
};

export type OpportunityRecommendation = {
  question: "What should be built next?" | "Which content has the highest ROI?" | "Which topic has the highest traffic opportunity?" | "Which profession has the highest growth potential?" | "Which certification has the highest conversion potential?";
  recommendation: string;
  expectedImpact: "Traffic" | "Revenue" | "Authority" | "Conversion" | "Growth";
  priorityScore: number;
};

export type CommandCenterAlert = {
  type: AlertType;
  severity: "critical" | "warning" | "info";
  trigger: string;
  ownerAction: string;
};

export type ExecutiveScorecard = {
  trafficScore: number;
  authorityScore: number;
  eeatScore: number;
  aiReadinessScore: number;
  conversionScore: number;
  revenueScore: number;
  internationalExpansionScore: number;
  alliedHealthScore: number;
  overallBusinessScore: number;
};

export type HealthcareAuthorityCommandCenter = {
  executiveOverview: ExecutiveOverviewMetrics;
  seo: SeoCommandCenterMetrics;
  topicOwnership: readonly TopicOwnershipRow[];
  alliedHealth: readonly AlliedCommandRow[];
  certifications: readonly CertificationCommandRow[];
  aiVisibility: AiVisibilityDashboard;
  eeat: EeatDashboard;
  conversion: ConversionCommandCenter;
  contentPerformance: readonly ContentPerformanceRow[];
  opportunities: readonly OpportunityRecommendation[];
  alerts: readonly CommandCenterAlert[];
  scorecard: ExecutiveScorecard;
};

export const TOPIC_OWNERSHIP_ROWS: readonly TopicOwnershipRow[] = [
  topic("Heart Failure", 82, 91, 18400, 420, 3360000),
  topic("COPD", 74, 88, 13200, 315, 2425000),
  topic("Diabetes", 78, 86, 15100, 350, 2710000),
  topic("Sepsis", 58, 79, 9200, 210, 1580000),
  topic("Stroke", 64, 82, 10100, 235, 1790000),
  topic("AFib", 57, 78, 7600, 166, 1230000),
  topic("AKI", 49, 72, 6100, 120, 890000),
  topic("CKD", 52, 74, 6800, 140, 990000),
  topic("Ventilator Management", 44, 70, 5400, 125, 980000),
  topic("ABG Interpretation", 46, 73, 5900, 136, 1030000),
  topic("Trauma Assessment", 38, 68, 4300, 92, 710000),
] as const;

export const ALLIED_COMMAND_ROWS: readonly AlliedCommandRow[] = [
  allied("RT", 78, 9100, 480, 210, 18, ["Ventilator management cluster", "ABG case library", "RT interview pages"]),
  allied("Paramedic", 66, 6400, 330, 135, 14, ["Trauma assessment pages", "Primary survey tools", "Paramedic salary pages"]),
  allied("OT", 61, 4200, 250, 82, 9, ["ADL assessment cluster", "OT placement pages", "Functional assessment examples"]),
  allied("PT", 60, 3900, 230, 76, 8, ["Gait assessment cluster", "PT placement pages", "Mobility tool pages"]),
  allied("MLT", 63, 4500, 270, 88, 11, ["CBC interpretation cluster", "Specimen collection pages", "MLT interview pages"]),
  allied("PSW", 55, 3100, 190, 54, 7, ["PSW career pages", "Long-term care skills", "Placement survival guides"]),
] as const;

export const CERTIFICATION_COMMAND_ROWS: readonly CertificationCommandRow[] = [
  certification("NCLEX", 24800, 650, 84, 90, 86),
  certification("REx-PN", 12400, 310, 79, 86, 82),
  certification("CNPLE", 9400, 270, 74, 83, 78),
  certification("FNP", 6900, 160, 58, 72, 61),
  certification("PMHNP", 5700, 145, 54, 70, 59),
  certification("AGPCNP", 3100, 70, 42, 62, 48),
  certification("WHNP", 2800, 64, 40, 61, 46),
  certification("PNP-PC", 2600, 58, 39, 60, 45),
  certification("TEAS", 11200, 255, 68, 78, 73),
  certification("HESI", 9800, 230, 66, 76, 71),
  certification("CASPER", 7600, 175, 62, 74, 69),
] as const;

export const CONTENT_PERFORMANCE_ROWS: readonly ContentPerformanceRow[] = [
  performance("Top Pages", ["Heart Failure", "NCLEX-RN Ultimate Guide", "ABG Interpretation"], 62400, 1385, 10520000),
  performance("Top Clusters", ["Cardiology", "Respiratory", "Certification"], 81500, 1810, 13840000),
  performance("Top Careers", ["Registered Nurse", "Respiratory Therapist", "Paramedic"], 22600, 440, 3100000),
  performance("Top Certifications", ["NCLEX", "REx-PN", "CNPLE"], 46600, 1230, 9580000),
  performance("Top Programs", ["McMaster Nursing", "RT Programs Canada", "Paramedic Programs Ontario"], 14200, 255, 1840000),
  performance("Top School Pages", ["Best Nursing Schools In Ontario", "Best RT Programs In Canada"], 9800, 180, 1280000),
  performance("Top Interview Pages", ["Nursing Interview Questions", "RT Interview Questions"], 7300, 132, 910000),
  performance("Top Placement Pages", ["First Day Of Nursing Clinical", "RT Placement Guide"], 6900, 118, 830000),
  performance("Top Salary Pages", ["RN Salary Ontario", "RT Salary Canada", "Paramedic Salary Ontario"], 8800, 150, 1040000),
] as const;

export const COMMAND_CENTER_ALERTS: readonly CommandCenterAlert[] = [
  alert("traffic_drop", "critical", "Organic traffic drops more than 20% week over week.", "Open Search Console decay queue and inspect top losing pages."),
  alert("conversion_drop", "critical", "Visitor-to-account, trial, or paid conversion drops more than 20%.", "Review funnel instrumentation, paywall events, and checkout health."),
  alert("authority_decline", "warning", "Topic authority score drops for a priority cluster.", "Refresh internal links, schema, FAQs, and content depth."),
  alert("ranking_loss", "warning", "High-value page loses more than three average positions.", "Compare SERP intent, refresh title/meta, and add snippet blocks."),
  alert("indexation_problem", "critical", "Indexed pages fall or crawled-not-indexed grows.", "Audit robots, canonicals, sitemap inclusion, and thin content."),
  alert("schema_break", "critical", "Schema coverage or validation drops.", "Run structured data validation for affected page templates."),
  alert("subscription_notification_failure", "critical", "Owner subscription notification delivery fails.", "Check email, SMS, dashboard alert, and webhook delivery status."),
  alert("stripe_webhook_failure", "critical", "Stripe webhook processing fails.", "Inspect webhook logs and subscription state reconciliation."),
] as const;

export function buildHealthcareAuthorityCommandCenter(input?: {
  executiveOverview?: Partial<ExecutiveOverviewMetrics>;
  seo?: Partial<SeoCommandCenterMetrics>;
  aiPages?: readonly AiReadablePageSignals[];
  eeatPage?: PageAuthoritySignalInput;
}): HealthcareAuthorityCommandCenter {
  const executiveOverview = {
    organicTraffic: 126000,
    newUsers: 41800,
    accountsCreated: 6240,
    trialsStarted: 1840,
    subscriptions: 620,
    mrrCents: 4960000,
    arrCents: 59520000,
    conversionRate: 0.0148,
    trafficGrowth: 0.22,
    revenueGrowth: 0.18,
    authorityGrowth: 0.16,
    ...input?.executiveOverview,
  };
  const seo = {
    indexedPages: 3240,
    nonIndexedPages: 410,
    crawledNotIndexed: 185,
    duplicateContent: 18,
    canonicalIssues: 9,
    orphanPages: 24,
    internalLinkingScore: 82,
    schemaCoverage: 88,
    breadcrumbCoverage: 93,
    topKeywords: ["heart failure nursing care plan", "nclex study guide", "abg interpretation", "rn salary ontario"],
    fastestGrowingKeywords: ["respiratory therapist salary canada", "first day of nursing clinical", "what is peep"],
    ...input?.seo,
  };
  const aiVisibility = buildAiVisibilityDashboard(input?.aiPages);
  const eeat = buildEeatDashboard(input?.eeatPage);
  const conversion = buildConversionCommandCenter(executiveOverview);
  const opportunities = buildOpportunityRecommendations(TOPIC_OWNERSHIP_ROWS, ALLIED_COMMAND_ROWS, CERTIFICATION_COMMAND_ROWS);
  const scorecard = buildExecutiveScorecard({ executiveOverview, seo, aiVisibility, eeat, conversion });

  return {
    executiveOverview,
    seo,
    topicOwnership: TOPIC_OWNERSHIP_ROWS,
    alliedHealth: ALLIED_COMMAND_ROWS,
    certifications: CERTIFICATION_COMMAND_ROWS,
    aiVisibility,
    eeat,
    conversion,
    contentPerformance: CONTENT_PERFORMANCE_ROWS,
    opportunities,
    alerts: COMMAND_CENTER_ALERTS,
    scorecard,
  };
}

export function buildAiVisibilityDashboard(pages?: readonly AiReadablePageSignals[]): AiVisibilityDashboard {
  const aiOverview = buildAiOverviewDashboard(pages);
  const knowledgeGraph = buildKnowledgeGraphDashboard();
  const citationReadiness = pages?.length ? Math.round(pages.reduce((sum, page) => sum + scoreLlmAuthority(page).aiCitationReadiness, 0) / pages.length) : aiOverview.averageAiReadinessScore;
  return {
    aiCitationReadiness: citationReadiness,
    entityCoverage: Math.min(100, knowledgeGraph.averageAuthorityScore + 4),
    definitionCoverage: aiOverview.missingDefinitionCoverage.length === 0 ? 100 : 78,
    faqCoverage: aiOverview.missingFaqCoverage.length === 0 ? 100 : 84,
    knowledgeGraphStrength: knowledgeGraph.averageAuthorityScore,
    aiOverviewOpportunities: aiOverview.pagesMostLikelyToBeCited,
    aiMentionTracking: ["Google AI Overviews", "ChatGPT", "Perplexity", "Claude", "Gemini"],
  };
}

export function buildEeatDashboard(input?: PageAuthoritySignalInput): EeatDashboard {
  const score = calculateInternalAuthorityScore(input ?? {
    visibleBreadcrumbs: true,
    schemaBreadcrumbs: true,
    consistentHierarchy: true,
    authorDisplayed: true,
    authorCredentialsDisplayed: true,
    reviewerDisplayed: true,
    reviewerCredentialsDisplayed: true,
    reviewDateDisplayed: true,
    updateDateDisplayed: true,
    evidenceSourcesDisplayed: true,
    entityRelationshipsStored: true,
    internalLinks: 18,
    schemaTypes: ["MedicalWebPage", "Article", "FAQPage", "BreadcrumbList", "Organization"],
  });
  return {
    authorCoverage: score.authorCoverage,
    reviewerCoverage: score.reviewerCoverage,
    clinicalReviewCoverage: score.reviewerCoverage,
    freshnessCoverage: 91,
    referenceCoverage: 87,
    schemaCoverage: score.schemaCoverage,
    trustScore: score.eeatScore,
    authorityScore: score.topicalAuthorityScore,
  };
}

export function buildConversionCommandCenter(metrics: ExecutiveOverviewMetrics): ConversionCommandCenter {
  return {
    visitorToAccountRate: rate(metrics.accountsCreated, metrics.newUsers),
    accountToTrialRate: rate(metrics.trialsStarted, metrics.accountsCreated),
    trialToPaidRate: rate(metrics.subscriptions, metrics.trialsStarted),
    paidToRenewalRate: 0.86,
    revenueAttributionCents: metrics.mrrCents,
    contentAttribution: ["Heart Failure cluster", "NCLEX hub", "RT career pages"],
    professionAttribution: ["RN", "RPN", "RT", "NP"],
  };
}

export function buildOpportunityRecommendations(
  topics: readonly TopicOwnershipRow[] = TOPIC_OWNERSHIP_ROWS,
  alliedRows: readonly AlliedCommandRow[] = ALLIED_COMMAND_ROWS,
  certifications: readonly CertificationCommandRow[] = CERTIFICATION_COMMAND_ROWS,
): OpportunityRecommendation[] {
  const nextTopic = [...topics].sort((a, b) => priorityValue(b) - priorityValue(a))[0];
  const highestRoi = [...topics].sort((a, b) => b.revenueCents / Math.max(1, 100 - b.ownershipPercent) - a.revenueCents / Math.max(1, 100 - a.ownershipPercent))[0];
  const highestTraffic = [...topics].sort((a, b) => b.traffic - a.traffic)[0];
  const growthProfession = [...alliedRows].sort((a, b) => b.growth - a.growth)[0];
  const conversionCertification = [...certifications].sort((a, b) => b.conversions - a.conversions)[0];
  return [
    opportunity("What should be built next?", `Expand ${nextTopic?.topic ?? "priority topic"} to close ownership gaps and compound authority.`, "Authority", nextTopic ? priorityValue(nextTopic) : 0),
    opportunity("Which content has the highest ROI?", `Refresh and expand ${highestRoi?.topic ?? "highest-revenue cluster"} because it already converts against an achievable gap.`, "Revenue", highestRoi ? Math.round(highestRoi.revenueCents / 100000) : 0),
    opportunity("Which topic has the highest traffic opportunity?", `${highestTraffic?.topic ?? "Top topic"} has the largest current traffic base and should receive snippet, FAQ, and internal-link improvements.`, "Traffic", highestTraffic ? Math.round(highestTraffic.traffic / 100) : 0),
    opportunity("Which profession has the highest growth potential?", `${growthProfession?.profession ?? "RT"} has the strongest allied-health growth signal.`, "Growth", growthProfession?.growth ?? 0),
    opportunity("Which certification has the highest conversion potential?", `${conversionCertification?.certification ?? "NCLEX"} currently drives the most certification conversions.`, "Conversion", conversionCertification?.conversions ?? 0),
  ];
}

export function buildExecutiveScorecard(input: {
  executiveOverview: ExecutiveOverviewMetrics;
  seo: SeoCommandCenterMetrics;
  aiVisibility: AiVisibilityDashboard;
  eeat: EeatDashboard;
  conversion: ConversionCommandCenter;
}): ExecutiveScorecard {
  const trafficScore = clamp(Math.round((input.executiveOverview.trafficGrowth * 100 + 80) / 1.2));
  const authorityScore = Math.round((averageTopicAuthority() + buildKnowledgeGraphDashboard().averageAuthorityScore) / 2);
  const eeatScore = Math.round((input.eeat.trustScore + input.eeat.authorityScore + input.eeat.referenceCoverage + input.eeat.freshnessCoverage) / 4);
  const aiReadinessScore = Math.round((input.aiVisibility.aiCitationReadiness + input.aiVisibility.knowledgeGraphStrength + input.aiVisibility.entityCoverage) / 3);
  const conversionScore = clamp(Math.round(input.conversion.trialToPaidRate * 200));
  const revenueScore = clamp(Math.round((input.executiveOverview.revenueGrowth * 100 + 82) / 1.1));
  const internationalExpansionScore = 62;
  const alliedHealthScore = Math.round(ALLIED_COMMAND_ROWS.reduce((sum, row) => sum + row.authorityScore, 0) / ALLIED_COMMAND_ROWS.length);
  const overallBusinessScore = Math.round((trafficScore + authorityScore + eeatScore + aiReadinessScore + conversionScore + revenueScore + internationalExpansionScore + alliedHealthScore) / 8);
  return { trafficScore, authorityScore, eeatScore, aiReadinessScore, conversionScore, revenueScore, internationalExpansionScore, alliedHealthScore, overallBusinessScore };
}

export function buildTopicAuthorityRollup(): readonly { cluster: string; score: number }[] {
  return calculateTopicalAuthorityScores().map((score) => ({ cluster: score.cluster, score: score.averageAuthorityScore }));
}

function topic(topicName: CommandCenterTopic, ownershipPercent: number, authorityScore: number, traffic: number, conversions: number, revenueCents: number): TopicOwnershipRow {
  const gap = 100 - ownershipPercent;
  const buildPriority = gap >= 45 ? "Critical" : gap >= 30 ? "High" : gap >= 18 ? "Medium" : "Low";
  return { topic: topicName, ownershipPercent, authorityScore, traffic, conversions, revenueCents, buildPriority };
}

function allied(profession: AlliedCommandProfession, authorityScore: number, traffic: number, keywords: number, conversions: number, growth: number, contentGaps: readonly string[]): AlliedCommandRow {
  return { profession, authorityScore, traffic, keywords, conversions, growth, contentGaps };
}

function certification(certificationName: CertificationCommandTarget, traffic: number, conversions: number, contentCoverage: number, authorityScore: number, readinessScore: number): CertificationCommandRow {
  return { certification: certificationName, traffic, conversions, contentCoverage, authorityScore, readinessScore };
}

function performance(surface: ContentPerformanceSurface, leaders: readonly string[], traffic: number, conversions: number, revenueCents: number): ContentPerformanceRow {
  return { surface, leaders, traffic, conversions, revenueCents };
}

function alert(type: AlertType, severity: CommandCenterAlert["severity"], trigger: string, ownerAction: string): CommandCenterAlert {
  return { type, severity, trigger, ownerAction };
}

function opportunity(question: OpportunityRecommendation["question"], recommendation: string, expectedImpact: OpportunityRecommendation["expectedImpact"], priorityScore: number): OpportunityRecommendation {
  return { question, recommendation, expectedImpact, priorityScore };
}

function priorityValue(row: TopicOwnershipRow): number {
  return Math.round((100 - row.ownershipPercent) * 1.5 + row.authorityScore * 0.4 + row.conversions * 0.1);
}

function averageTopicAuthority(): number {
  return Math.round(TOPIC_OWNERSHIP_ROWS.reduce((sum, row) => sum + row.authorityScore, 0) / TOPIC_OWNERSHIP_ROWS.length);
}

function rate(numerator: number, denominator: number): number {
  return denominator > 0 ? Number((numerator / denominator).toFixed(4)) : 0;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
