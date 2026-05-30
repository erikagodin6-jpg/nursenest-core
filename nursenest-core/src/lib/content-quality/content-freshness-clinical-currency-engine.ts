export type ClinicalCurrencyContentType =
  | "question"
  | "flashcard"
  | "lesson"
  | "clinical_skill"
  | "pharmacology"
  | "ecg"
  | "cat_content"
  | "loft_case"
  | "study_plan"
  | "readiness_assessment"
  | "blog_post"
  | "authority_cluster"
  | "seo_page";

export type ClinicalVolatility = "low" | "moderate" | "high";
export type GuidelineSensitivity = "low" | "moderate" | "high";
export type ClinicalRiskLevel = "low" | "moderate" | "high" | "critical";

export type ContentFreshnessStatus =
  | "current"
  | "review_soon"
  | "review_required"
  | "critical_review_required";

export type ContentReviewQueueName =
  | "critical_clinical_review"
  | "high_priority_review"
  | "routine_review";

export type ReferenceQualityLevel =
  | "primary_guideline"
  | "peer_reviewed_article"
  | "textbook"
  | "regulatory_source"
  | "professional_association"
  | "low_quality_web_source"
  | "missing";

export type ReferenceAccessStatus =
  | "accessible"
  | "broken"
  | "unavailable"
  | "retracted"
  | "unknown";

export type ReferenceAuditFlag =
  | "broken_reference"
  | "missing_reference"
  | "outdated_reference"
  | "unavailable_reference"
  | "duplicate_reference"
  | "low_quality_reference"
  | "retracted_reference";

export type ClinicalCurrencyAlertType =
  | "content_overdue_review"
  | "reference_failure"
  | "clinical_currency_risk"
  | "pharmacology_review_needed"
  | "ecg_review_needed"
  | "high_risk_content_aging";

export type ClinicalCurrencyReference = {
  id?: string | null;
  title?: string | null;
  url?: string | null;
  qualityLevel?: ReferenceQualityLevel | null;
  publicationYear?: number | null;
  publishedAt?: string | null;
  lastAccessedAt?: string | null;
  lastValidatedAt?: string | null;
  accessStatus?: ReferenceAccessStatus | null;
  isRetracted?: boolean | null;
};

export type PharmacologyCurrencyMetadata = {
  drugClasses?: string[] | null;
  indications?: string[] | null;
  contraindications?: string[] | null;
  adverseEffects?: string[] | null;
  monitoring?: string[] | null;
  interactions?: string[] | null;
  teachingPoints?: string[] | null;
  safetyWarnings?: string[] | null;
};

export type EcgCurrencyMetadata = {
  arrhythmias?: boolean | null;
  telemetry?: boolean | null;
  pacemaker?: boolean | null;
  twelveLead?: boolean | null;
  interpretationPractice?: boolean | null;
  caseStudies?: boolean | null;
};

export type ClinicalCurrencyUsageSignals = {
  learnerSessions?: number | null;
  pageViews?: number | null;
  conversionAssists?: number | null;
  reportCount?: number | null;
  qualityScore?: number | null;
};

export type ClinicalCurrencyContentItem = {
  id: string;
  contentType: ClinicalCurrencyContentType;
  title?: string | null;
  pathway?: string | null;
  tier?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  clinicalSpecialty?: string | null;
  body?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastReviewedAt?: string | null;
  reviewDueAt?: string | null;
  author?: string | null;
  reviewer?: string | null;
  references?: ClinicalCurrencyReference[] | null;
  tags?: string[] | null;
  explicitVolatility?: ClinicalVolatility | null;
  guidelineSensitivity?: GuidelineSensitivity | null;
  clinicalRisk?: ClinicalRiskLevel | null;
  pharmacology?: PharmacologyCurrencyMetadata | null;
  ecg?: EcgCurrencyMetadata | null;
  usage?: ClinicalCurrencyUsageSignals | null;
};

export type ReferenceAuditResult = {
  referenceKey: string;
  title: string;
  qualityLevel: ReferenceQualityLevel;
  accessStatus: ReferenceAccessStatus;
  ageYears: number | null;
  lastValidatedAgeDays: number | null;
  flags: ReferenceAuditFlag[];
};

export type ContentFreshnessAuditItem = {
  id: string;
  contentType: ClinicalCurrencyContentType;
  title: string;
  pathway: string;
  tier: string;
  topic: string;
  clinicalSpecialty: string;
  author: string | null;
  reviewer: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastReviewedAt: string | null;
  reviewDueAt: string | null;
  reviewCadenceMonths: 12 | 24 | 36;
  daysUntilReviewDue: number | null;
  contentAgeDays: number | null;
  lastReviewAgeDays: number | null;
  volatility: ClinicalVolatility;
  guidelineSensitivity: GuidelineSensitivity;
  clinicalRisk: ClinicalRiskLevel;
  freshnessScore: number;
  status: ContentFreshnessStatus;
  referenceQualityScore: number;
  referenceAudits: ReferenceAuditResult[];
  referenceFlags: ReferenceAuditFlag[];
  pharmacologyFlags: string[];
  ecgFlags: string[];
  reviewDrivers: string[];
};

export type ContentCurrencyReviewQueueItem = {
  itemId: string;
  title: string;
  contentType: ClinicalCurrencyContentType;
  pathway: string;
  tier: string;
  topic: string;
  clinicalSpecialty: string;
  status: ContentFreshnessStatus;
  freshnessScore: number;
  clinicalRisk: ClinicalRiskLevel;
  volatility: ClinicalVolatility;
  reason: string;
  dueWithinDays: number | null;
};

export type ClinicalCurrencyAlert = {
  type: ClinicalCurrencyAlertType;
  severity: "warning" | "critical";
  itemId: string;
  title: string;
  contentType: ClinicalCurrencyContentType;
  message: string;
  recommendedAction: string;
};

export type ContentFreshnessDashboardSummary = {
  contentFreshnessScore: number;
  currentContentPercent: number;
  reviewSoonPercent: number;
  reviewRequiredPercent: number;
  criticalReviewPercent: number;
  brokenReferences: number;
  outdatedReferences: number;
  missingReferences: number;
  unavailableReferences: number;
  retractedReferences: number;
  duplicateReferences: number;
  lowQualityReferences: number;
  contentWithoutReferences: number;
  averageContentAgeDays: number;
  queueCounts: Record<ContentReviewQueueName, number>;
  alertCounts: Record<ClinicalCurrencyAlertType, number>;
};

export type ContentFreshnessClinicalCurrencyReport = {
  generatedAt: string;
  totalItems: number;
  dashboard: ContentFreshnessDashboardSummary;
  byContentType: Record<string, { count: number; averageFreshnessScore: number; critical: number; reviewRequired: number }>;
  byPathway: Record<string, { count: number; averageFreshnessScore: number; critical: number; reviewRequired: number }>;
  byTopic: Record<string, { count: number; averageFreshnessScore: number; critical: number; reviewRequired: number }>;
  reviewQueues: Record<ContentReviewQueueName, ContentCurrencyReviewQueueItem[]>;
  referenceQueues: {
    broken: ContentCurrencyReviewQueueItem[];
    missing: ContentCurrencyReviewQueueItem[];
    outdated: ContentCurrencyReviewQueueItem[];
    highRiskClinical: ContentCurrencyReviewQueueItem[];
  };
  alerts: ClinicalCurrencyAlert[];
  items: ContentFreshnessAuditItem[];
};

export type ContentFreshnessClinicalCurrencyOptions = {
  generatedAt?: string | Date;
  highVolatilityReferenceMaxAgeYears?: number;
  moderateVolatilityReferenceMaxAgeYears?: number;
  lowVolatilityReferenceMaxAgeYears?: number;
};

const HIGH_VOLATILITY_KEYWORDS = [
  "pharmacology",
  "medication",
  "drug",
  "insulin",
  "anticoagulant",
  "heparin",
  "warfarin",
  "opioid",
  "diabetes",
  "cardiology",
  "stemi",
  "arrhythmia",
  "infectious",
  "sepsis",
  "screening",
  "critical care",
  "emergency",
  "ventilator",
  "pacemaker",
  "12-lead",
];

const MODERATE_VOLATILITY_KEYWORDS = [
  "assessment",
  "care planning",
  "patient education",
  "maternal",
  "pediatric",
  "mental health",
  "clinical skill",
  "ecg",
  "telemetry",
];

const LOW_VOLATILITY_KEYWORDS = [
  "communication",
  "documentation",
  "professionalism",
  "ethics",
  "handoff",
  "conflict",
  "delegation",
];

const HIGH_RISK_CONTENT_TYPES = new Set<ClinicalCurrencyContentType>([
  "pharmacology",
  "ecg",
  "clinical_skill",
  "cat_content",
  "loft_case",
]);

const CLINICAL_CONTENT_TYPES = new Set<ClinicalCurrencyContentType>([
  "question",
  "flashcard",
  "lesson",
  "clinical_skill",
  "pharmacology",
  "ecg",
  "cat_content",
  "loft_case",
  "study_plan",
  "readiness_assessment",
]);

const reviewCadenceMonthsByVolatility: Record<ClinicalVolatility, 12 | 24 | 36> = {
  high: 12,
  moderate: 24,
  low: 36,
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoOrNull(date: Date | null): string | null {
  return date ? date.toISOString() : null;
}

function daysBetween(later: Date, earlier: Date): number {
  return Math.floor((later.getTime() - earlier.getTime()) / 86_400_000);
}

function monthsBetween(later: Date, earlier: Date): number {
  return Math.max(0, (later.getFullYear() - earlier.getFullYear()) * 12 + later.getMonth() - earlier.getMonth());
}

function addMonths(date: Date, months: number): Date {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function textBlob(item: ClinicalCurrencyContentItem): string {
  return [
    item.contentType,
    item.title,
    item.pathway,
    item.tier,
    item.topic,
    item.subtopic,
    item.clinicalSpecialty,
    item.body,
    ...(item.tags ?? []),
    ...(item.references ?? []).map((reference) => `${reference.title ?? ""} ${reference.url ?? ""}`),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasAny(text: string, markers: string[]): boolean {
  return markers.some((marker) => text.includes(marker));
}

export function classifyClinicalVolatility(item: ClinicalCurrencyContentItem): ClinicalVolatility {
  if (item.explicitVolatility) return item.explicitVolatility;
  const text = textBlob(item);
  if (item.contentType === "pharmacology" || hasAny(text, HIGH_VOLATILITY_KEYWORDS)) return "high";
  if (item.contentType === "ecg" || hasAny(text, MODERATE_VOLATILITY_KEYWORDS)) return "moderate";
  if (hasAny(text, LOW_VOLATILITY_KEYWORDS)) return "low";
  return "moderate";
}

function inferGuidelineSensitivity(item: ClinicalCurrencyContentItem, volatility: ClinicalVolatility): GuidelineSensitivity {
  if (item.guidelineSensitivity) return item.guidelineSensitivity;
  const text = textBlob(item);
  if (
    volatility === "high" ||
    /guideline|protocol|contraindication|warning|screening|dosage|dose|algorithm|acls|pals|bls/.test(text)
  ) {
    return "high";
  }
  if (/assessment|teaching|monitoring|follow-up|referral|care plan/.test(text)) return "moderate";
  return "low";
}

function inferClinicalRisk(item: ClinicalCurrencyContentItem): ClinicalRiskLevel {
  if (item.clinicalRisk) return item.clinicalRisk;
  const text = textBlob(item);
  if (/cardiac arrest|sepsis|shock|stemi|stroke|anaphylaxis|respiratory failure|ventilator|pediatric emergency/.test(text)) {
    return "critical";
  }
  if (
    item.contentType === "pharmacology" ||
    item.contentType === "ecg" ||
    /insulin|anticoagulant|opioid|digoxin|potassium|pacemaker|arrhythmia|diabetes|infectious|emergency/.test(text)
  ) {
    return "high";
  }
  if (HIGH_RISK_CONTENT_TYPES.has(item.contentType)) return "moderate";
  return "low";
}

function referenceMaxAgeYears(volatility: ClinicalVolatility, options: Required<Pick<
  ContentFreshnessClinicalCurrencyOptions,
  "highVolatilityReferenceMaxAgeYears" | "moderateVolatilityReferenceMaxAgeYears" | "lowVolatilityReferenceMaxAgeYears"
>>): number {
  if (volatility === "high") return options.highVolatilityReferenceMaxAgeYears;
  if (volatility === "moderate") return options.moderateVolatilityReferenceMaxAgeYears;
  return options.lowVolatilityReferenceMaxAgeYears;
}

function inferReferenceQuality(reference: ClinicalCurrencyReference | null | undefined): ReferenceQualityLevel {
  if (!reference) return "missing";
  if (reference.qualityLevel) return reference.qualityLevel;
  const text = `${reference.title ?? ""} ${reference.url ?? ""}`.toLowerCase();
  if (!text.trim()) return "missing";
  if (/guideline|aha|cdc|who|rnao|nice|idsa|diabetes canada|heart and stroke|canadian cardiovascular/.test(text)) {
    return "primary_guideline";
  }
  if (/college|regulatory|cno|bccnm|ncsbn|professional standard/.test(text)) return "regulatory_source";
  if (/association|society|academy/.test(text)) return "professional_association";
  if (/journal|peer|doi|pubmed|nejm|jama|lancet|bmj/.test(text)) return "peer_reviewed_article";
  if (/textbook|manual/.test(text)) return "textbook";
  if (/blog|wikipedia|forum|quizlet|webmd/.test(text)) return "low_quality_web_source";
  return "professional_association";
}

function referenceAgeYears(reference: ClinicalCurrencyReference, now: Date): number | null {
  if (reference.publicationYear) return Math.max(0, now.getFullYear() - reference.publicationYear);
  const publishedAt = parseDate(reference.publishedAt);
  return publishedAt ? Math.max(0, Math.floor(daysBetween(now, publishedAt) / 365.25)) : null;
}

function referenceKey(reference: ClinicalCurrencyReference): string {
  return String(reference.url ?? reference.title ?? reference.id ?? "missing").trim().toLowerCase();
}

function auditReferences(
  item: ClinicalCurrencyContentItem,
  now: Date,
  volatility: ClinicalVolatility,
  clinicalRisk: ClinicalRiskLevel,
  options: Required<Pick<
    ContentFreshnessClinicalCurrencyOptions,
    "highVolatilityReferenceMaxAgeYears" | "moderateVolatilityReferenceMaxAgeYears" | "lowVolatilityReferenceMaxAgeYears"
  >>,
): { audits: ReferenceAuditResult[]; flags: ReferenceAuditFlag[]; score: number } {
  const references = item.references ?? [];
  if (references.length === 0) {
    const missingScore = CLINICAL_CONTENT_TYPES.has(item.contentType) ? (clinicalRisk === "low" ? 55 : 30) : 65;
    return {
      audits: [
        {
          referenceKey: "missing",
          title: "Missing reference",
          qualityLevel: "missing",
          accessStatus: "unknown",
          ageYears: null,
          lastValidatedAgeDays: null,
          flags: ["missing_reference"],
        },
      ],
      flags: ["missing_reference"],
      score: missingScore,
    };
  }

  const seen = new Set<string>();
  const maxAge = referenceMaxAgeYears(volatility, options);
  const audits = references.map((reference) => {
    const flags: ReferenceAuditFlag[] = [];
    const key = referenceKey(reference);
    const qualityLevel = inferReferenceQuality(reference);
    const accessStatus = reference.isRetracted ? "retracted" : reference.accessStatus ?? (reference.url ? "accessible" : "unknown");
    const ageYears = referenceAgeYears(reference, now);
    const lastValidatedAt = parseDate(reference.lastValidatedAt ?? reference.lastAccessedAt);
    const lastValidatedAgeDays = lastValidatedAt ? daysBetween(now, lastValidatedAt) : null;

    if (!reference.title && !reference.url) flags.push("missing_reference");
    if (seen.has(key)) flags.push("duplicate_reference");
    seen.add(key);
    if (accessStatus === "broken") flags.push("broken_reference");
    if (accessStatus === "unavailable") flags.push("unavailable_reference");
    if (accessStatus === "retracted") flags.push("retracted_reference");
    if (qualityLevel === "low_quality_web_source" || qualityLevel === "missing") flags.push("low_quality_reference");
    if (ageYears !== null && ageYears > maxAge) flags.push("outdated_reference");
    if (lastValidatedAgeDays !== null && lastValidatedAgeDays > reviewCadenceMonthsByVolatility[volatility] * 31) {
      flags.push("outdated_reference");
    }

    return {
      referenceKey: key,
      title: reference.title ?? reference.url ?? "Untitled reference",
      qualityLevel,
      accessStatus,
      ageYears,
      lastValidatedAgeDays,
      flags: [...new Set(flags)],
    };
  });

  const flags = [...new Set(audits.flatMap((audit) => audit.flags))];
  const qualityScores = audits.map((audit) => {
    let score = 82;
    if (audit.qualityLevel === "primary_guideline" || audit.qualityLevel === "regulatory_source") score += 15;
    if (audit.qualityLevel === "peer_reviewed_article" || audit.qualityLevel === "professional_association") score += 8;
    if (audit.qualityLevel === "textbook") score += volatility === "high" ? 0 : 5;
    if (audit.flags.includes("low_quality_reference")) score -= 35;
    if (audit.flags.includes("outdated_reference")) score -= volatility === "high" ? 35 : 20;
    if (audit.flags.includes("duplicate_reference")) score -= 8;
    if (audit.flags.includes("broken_reference") || audit.flags.includes("unavailable_reference")) score -= 45;
    if (audit.flags.includes("retracted_reference")) score -= 70;
    return clamp(score);
  });

  return {
    audits,
    flags,
    score: average(qualityScores),
  };
}

function ageScore(ageMonths: number | null, cadenceMonths: number): number {
  if (ageMonths === null) return 45;
  if (ageMonths <= cadenceMonths / 2) return 100;
  if (ageMonths <= cadenceMonths) return 84;
  if (ageMonths <= cadenceMonths * 1.5) return 58;
  if (ageMonths <= cadenceMonths * 2) return 38;
  return 20;
}

function updatedScore(ageMonths: number | null, volatility: ClinicalVolatility): number {
  if (ageMonths === null) return 55;
  const threshold = volatility === "high" ? 12 : volatility === "moderate" ? 24 : 36;
  if (ageMonths <= threshold / 2) return 100;
  if (ageMonths <= threshold) return 86;
  if (ageMonths <= threshold * 1.5) return 65;
  if (ageMonths <= threshold * 2) return 45;
  return 25;
}

function riskScore(risk: ClinicalRiskLevel, guidelineSensitivity: GuidelineSensitivity, reviewOverdue: boolean): number {
  let score = 100;
  if (risk === "critical") score -= 18;
  if (risk === "high") score -= 10;
  if (guidelineSensitivity === "high") score -= 10;
  if (guidelineSensitivity === "moderate") score -= 4;
  if (reviewOverdue) score -= risk === "critical" || risk === "high" ? 24 : 12;
  return clamp(score);
}

function metadataListHasValues(value: string[] | null | undefined): boolean {
  return Array.isArray(value) && value.some((entry) => String(entry).trim().length > 0);
}

function textHas(text: string, pattern: RegExp): boolean {
  return pattern.test(text);
}

function auditPharmacology(item: ClinicalCurrencyContentItem, status: ContentFreshnessStatus): string[] {
  if (item.contentType !== "pharmacology") return [];
  const flags: string[] = [];
  const text = textBlob(item);
  const meta = item.pharmacology;

  const hasMonitoring = meta ? metadataListHasValues(meta.monitoring) : textHas(text, /monitor|lab|renal|liver|level|vital|bp|heart rate/);
  const hasContraindications = meta ? metadataListHasValues(meta.contraindications) : textHas(text, /contraindicat|avoid|do not give|hold/);
  const hasWarnings = meta ? metadataListHasValues(meta.safetyWarnings) : textHas(text, /warning|black box|high-alert|toxicity|safety/);
  const hasInteractions = meta ? metadataListHasValues(meta.interactions) : textHas(text, /interaction|interact|avoid with|combined with/);
  const hasTeaching = meta ? metadataListHasValues(meta.teachingPoints) : textHas(text, /teach|educat|instruct|patient should/);

  if (!hasMonitoring) flags.push("missing_monitoring_guidance");
  if (!hasContraindications) flags.push("missing_contraindications");
  if (!hasWarnings) flags.push("missing_safety_information");
  if (!hasInteractions) flags.push("missing_interaction_guidance");
  if (!hasTeaching) flags.push("missing_patient_teaching");
  if (status !== "current") flags.push("potentially_outdated_medication_guidance");

  return flags;
}

function auditEcg(item: ClinicalCurrencyContentItem, status: ContentFreshnessStatus): string[] {
  if (item.contentType !== "ecg") return [];
  const flags: string[] = [];
  const text = textBlob(item);
  const meta = item.ecg;

  const isArrhythmiaTopic = /arrhythmia|atrial fibrillation|flutter|svt|vtach|ventricular|heart block|rhythm/.test(text);
  const isTelemetryTopic = /telemetry|monitor|alarm|artifact|lead/.test(text);
  const isPacemakerTopic = /pacemaker|paced|pacing/.test(text);
  const isTwelveLeadTopic = /12-lead|stemi|axis|ischemia|infarct/.test(text);

  if ((meta?.arrhythmias === false || (!meta && isArrhythmiaTopic && !textHas(text, /interpret|recognize|treat|monitor|escalat/)))) {
    flags.push("incomplete_arrhythmia_coverage");
  }
  if ((meta?.telemetry === false || (!meta && isTelemetryTopic && !textHas(text, /artifact|alarm|lead|monitor/)))) {
    flags.push("incomplete_telemetry_coverage");
  }
  if ((meta?.pacemaker === false || (!meta && isPacemakerTopic && !textHas(text, /capture|sense|pace|failure/)))) {
    flags.push("incomplete_pacemaker_coverage");
  }
  if ((meta?.twelveLead === false || (!meta && isTwelveLeadTopic && !textHas(text, /12-lead|stemi|ischemia|infarct|lead/)))) {
    flags.push("incomplete_12_lead_coverage");
  }
  if (status !== "current") flags.push("outdated_ecg_teaching_review_needed");
  if (!meta?.interpretationPractice && !textHas(text, /practice|interpret|case|strip|rationale/)) {
    flags.push("missing_interpretation_practice");
  }

  return flags;
}

function statusFor(score: number, reviewOverdue: boolean, criticalDrivers: string[], daysUntilDue: number | null): ContentFreshnessStatus {
  if (score < 45 || criticalDrivers.length > 0) return "critical_review_required";
  if (score < 65 || reviewOverdue) return "review_required";
  if (score < 80 || (daysUntilDue !== null && daysUntilDue <= 90)) return "review_soon";
  return "current";
}

function average(values: number[]): number {
  return values.length > 0 ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : 0;
}

function percent(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 1000) / 10 : 0;
}

function queueReason(item: ContentFreshnessAuditItem): string {
  if (item.referenceFlags.includes("retracted_reference")) return "Retracted reference linked to content.";
  if (item.referenceFlags.includes("broken_reference")) return "Reference failure blocks evidence verification.";
  if (item.referenceFlags.includes("missing_reference")) return "Content has no auditable clinical reference.";
  if (item.reviewDrivers.length > 0) return item.reviewDrivers[0];
  return `${item.status.replaceAll("_", " ")} at ${item.freshnessScore}/100 freshness.`;
}

function queueItem(item: ContentFreshnessAuditItem): ContentCurrencyReviewQueueItem {
  return {
    itemId: item.id,
    title: item.title,
    contentType: item.contentType,
    pathway: item.pathway,
    tier: item.tier,
    topic: item.topic,
    clinicalSpecialty: item.clinicalSpecialty,
    status: item.status,
    freshnessScore: item.freshnessScore,
    clinicalRisk: item.clinicalRisk,
    volatility: item.volatility,
    reason: queueReason(item),
    dueWithinDays: item.daysUntilReviewDue,
  };
}

function shouldBeCritical(item: ContentFreshnessAuditItem): boolean {
  return (
    item.status === "critical_review_required" ||
    item.referenceFlags.includes("retracted_reference") ||
    ((item.clinicalRisk === "critical" || item.guidelineSensitivity === "high") &&
      (item.referenceFlags.includes("broken_reference") ||
        item.referenceFlags.includes("missing_reference") ||
        item.referenceFlags.includes("outdated_reference")))
  );
}

function buildAlerts(item: ContentFreshnessAuditItem): ClinicalCurrencyAlert[] {
  const alerts: ClinicalCurrencyAlert[] = [];
  const title = item.title;
  const severity = item.status === "critical_review_required" || item.clinicalRisk === "critical" ? "critical" : "warning";

  if (item.daysUntilReviewDue !== null && item.daysUntilReviewDue < 0) {
    alerts.push({
      type: "content_overdue_review",
      severity,
      itemId: item.id,
      title,
      contentType: item.contentType,
      message: `${title} is overdue for clinical review.`,
      recommendedAction: "Assign reviewer and refresh clinical guidance before further promotion.",
    });
  }

  if (
    item.referenceFlags.includes("broken_reference") ||
    item.referenceFlags.includes("unavailable_reference") ||
    item.referenceFlags.includes("retracted_reference")
  ) {
    alerts.push({
      type: "reference_failure",
      severity: item.referenceFlags.includes("retracted_reference") ? "critical" : severity,
      itemId: item.id,
      title,
      contentType: item.contentType,
      message: `${title} has a failed, unavailable, or retracted reference.`,
      recommendedAction: "Replace the reference and revalidate the supported claims.",
    });
  }

  if ((item.guidelineSensitivity === "high" || item.clinicalRisk === "high" || item.clinicalRisk === "critical") && item.status !== "current") {
    alerts.push({
      type: "clinical_currency_risk",
      severity,
      itemId: item.id,
      title,
      contentType: item.contentType,
      message: `${title} is guideline-sensitive and no longer current.`,
      recommendedAction: "Compare against the latest guideline, drug reference, or professional standard.",
    });
  }

  if (item.contentType === "pharmacology" && (item.status !== "current" || item.pharmacologyFlags.length > 0)) {
    alerts.push({
      type: "pharmacology_review_needed",
      severity,
      itemId: item.id,
      title,
      contentType: item.contentType,
      message: `${title} requires pharmacology currency review.`,
      recommendedAction: "Verify indications, contraindications, warnings, interactions, monitoring, and teaching.",
    });
  }

  if (item.contentType === "ecg" && (item.status !== "current" || item.ecgFlags.length > 0)) {
    alerts.push({
      type: "ecg_review_needed",
      severity,
      itemId: item.id,
      title,
      contentType: item.contentType,
      message: `${title} requires ECG currency review.`,
      recommendedAction: "Verify rhythm interpretation, telemetry, pacemaker, and 12-lead teaching coverage.",
    });
  }

  if (
    (item.clinicalRisk === "high" || item.clinicalRisk === "critical") &&
    item.lastReviewAgeDays !== null &&
    item.lastReviewAgeDays > item.reviewCadenceMonths * 31 * 0.75
  ) {
    alerts.push({
      type: "high_risk_content_aging",
      severity,
      itemId: item.id,
      title,
      contentType: item.contentType,
      message: `${title} is high-risk clinical content approaching or past its review window.`,
      recommendedAction: "Prioritize before lower-risk editorial refresh work.",
    });
  }

  return alerts;
}

export function auditContentFreshnessClinicalCurrencyItem(
  item: ClinicalCurrencyContentItem,
  options: ContentFreshnessClinicalCurrencyOptions = {},
): ContentFreshnessAuditItem {
  const now = parseDate(options.generatedAt) ?? new Date();
  const referenceOptions = {
    highVolatilityReferenceMaxAgeYears: options.highVolatilityReferenceMaxAgeYears ?? 3,
    moderateVolatilityReferenceMaxAgeYears: options.moderateVolatilityReferenceMaxAgeYears ?? 5,
    lowVolatilityReferenceMaxAgeYears: options.lowVolatilityReferenceMaxAgeYears ?? 8,
  };
  const volatility = classifyClinicalVolatility(item);
  const guidelineSensitivity = inferGuidelineSensitivity(item, volatility);
  const clinicalRisk = inferClinicalRisk(item);
  const cadenceMonths = reviewCadenceMonthsByVolatility[volatility];
  const createdAt = parseDate(item.createdAt);
  const updatedAt = parseDate(item.updatedAt);
  const lastReviewedAt = parseDate(item.lastReviewedAt);
  const explicitDueAt = parseDate(item.reviewDueAt);
  const reviewDueAt = explicitDueAt ?? (lastReviewedAt ? addMonths(lastReviewedAt, cadenceMonths) : null);
  const contentAgeDays = createdAt ? daysBetween(now, createdAt) : null;
  const lastReviewAgeDays = lastReviewedAt ? daysBetween(now, lastReviewedAt) : null;
  const reviewAgeMonths = lastReviewedAt ? monthsBetween(now, lastReviewedAt) : null;
  const updateAgeMonths = updatedAt ? monthsBetween(now, updatedAt) : null;
  const daysUntilReviewDue = reviewDueAt ? daysBetween(reviewDueAt, now) : null;
  const reviewOverdue = daysUntilReviewDue !== null ? daysUntilReviewDue < 0 : !lastReviewedAt;
  const referenceAudit = auditReferences(item, now, volatility, clinicalRisk, referenceOptions);

  const reviewScore = ageScore(reviewAgeMonths, cadenceMonths);
  const updateFreshnessScore = updatedScore(updateAgeMonths, volatility);
  const governanceScore = riskScore(clinicalRisk, guidelineSensitivity, reviewOverdue);
  const rawScore = clamp(
    reviewScore * 0.36 +
      updateFreshnessScore * 0.16 +
      referenceAudit.score * 0.3 +
      governanceScore * 0.18,
  );

  const criticalDrivers: string[] = [];
  if (referenceAudit.flags.includes("retracted_reference")) criticalDrivers.push("A linked reference is retracted.");
  if (clinicalRisk === "critical" && referenceAudit.flags.includes("missing_reference")) {
    criticalDrivers.push("Critical-risk clinical content is missing references.");
  }
  if (clinicalRisk === "critical" && !lastReviewedAt) criticalDrivers.push("Critical-risk clinical content has never been reviewed.");
  if (referenceAudit.flags.includes("broken_reference") && guidelineSensitivity === "high") {
    criticalDrivers.push("Guideline-sensitive content has a broken reference.");
  }

  const status = statusFor(rawScore, reviewOverdue, criticalDrivers, daysUntilReviewDue);
  const pharmacologyFlags = auditPharmacology(item, status);
  const ecgFlags = auditEcg(item, status);
  const reviewDrivers = [
    ...criticalDrivers,
    ...(reviewOverdue ? ["Content review window is overdue."] : []),
    ...(referenceAudit.flags.includes("outdated_reference") ? ["One or more references exceed age thresholds."] : []),
    ...(referenceAudit.flags.includes("broken_reference") ? ["One or more references are broken."] : []),
    ...(referenceAudit.flags.includes("missing_reference") ? ["Clinical content is missing references."] : []),
    ...pharmacologyFlags,
    ...ecgFlags,
  ];

  const flagPenalty = pharmacologyFlags.length * 4 + ecgFlags.length * 4;
  const freshnessScore = clamp(status === "critical_review_required" ? Math.min(rawScore - flagPenalty, 44) : rawScore - flagPenalty);

  return {
    id: item.id,
    contentType: item.contentType,
    title: item.title ?? item.id,
    pathway: item.pathway ?? "Unmapped",
    tier: item.tier ?? "Unmapped",
    topic: item.topic ?? "Unmapped",
    clinicalSpecialty: item.clinicalSpecialty ?? item.topic ?? "Unmapped",
    author: item.author ?? null,
    reviewer: item.reviewer ?? null,
    createdAt: toIsoOrNull(createdAt),
    updatedAt: toIsoOrNull(updatedAt),
    lastReviewedAt: toIsoOrNull(lastReviewedAt),
    reviewDueAt: toIsoOrNull(reviewDueAt),
    reviewCadenceMonths: cadenceMonths,
    daysUntilReviewDue,
    contentAgeDays,
    lastReviewAgeDays,
    volatility,
    guidelineSensitivity,
    clinicalRisk,
    freshnessScore,
    status,
    referenceQualityScore: referenceAudit.score,
    referenceAudits: referenceAudit.audits,
    referenceFlags: referenceAudit.flags,
    pharmacologyFlags,
    ecgFlags,
    reviewDrivers: [...new Set(reviewDrivers)],
  };
}

function addRollup(
  target: Record<string, { count: number; averageFreshnessScore: number; critical: number; reviewRequired: number }>,
  key: string,
  item: ContentFreshnessAuditItem,
): void {
  const entry = (target[key] ??= { count: 0, averageFreshnessScore: 0, critical: 0, reviewRequired: 0 });
  entry.count += 1;
  if (item.status === "critical_review_required") entry.critical += 1;
  if (item.status === "review_required") entry.reviewRequired += 1;
}

function finalizeRollup(
  target: Record<string, { count: number; averageFreshnessScore: number; critical: number; reviewRequired: number }>,
  items: ContentFreshnessAuditItem[],
  keyFn: (item: ContentFreshnessAuditItem) => string,
): void {
  for (const key of Object.keys(target)) {
    target[key].averageFreshnessScore = average(items.filter((item) => keyFn(item) === key).map((item) => item.freshnessScore));
  }
}

function sortQueue(queue: ContentCurrencyReviewQueueItem[]): ContentCurrencyReviewQueueItem[] {
  const riskRank: Record<ClinicalRiskLevel, number> = { critical: 4, high: 3, moderate: 2, low: 1 };
  return queue.sort((a, b) => {
    if (a.freshnessScore !== b.freshnessScore) return a.freshnessScore - b.freshnessScore;
    return riskRank[b.clinicalRisk] - riskRank[a.clinicalRisk];
  });
}

function emptyAlertCounts(): Record<ClinicalCurrencyAlertType, number> {
  return {
    content_overdue_review: 0,
    reference_failure: 0,
    clinical_currency_risk: 0,
    pharmacology_review_needed: 0,
    ecg_review_needed: 0,
    high_risk_content_aging: 0,
  };
}

export function buildContentFreshnessClinicalCurrencyReport(
  contentItems: ClinicalCurrencyContentItem[],
  options: ContentFreshnessClinicalCurrencyOptions = {},
): ContentFreshnessClinicalCurrencyReport {
  const generatedAt = (parseDate(options.generatedAt) ?? new Date()).toISOString();
  const items = contentItems.map((item) =>
    auditContentFreshnessClinicalCurrencyItem(item, { ...options, generatedAt }),
  );

  const byContentType: ContentFreshnessClinicalCurrencyReport["byContentType"] = {};
  const byPathway: ContentFreshnessClinicalCurrencyReport["byPathway"] = {};
  const byTopic: ContentFreshnessClinicalCurrencyReport["byTopic"] = {};
  const reviewQueues: ContentFreshnessClinicalCurrencyReport["reviewQueues"] = {
    critical_clinical_review: [],
    high_priority_review: [],
    routine_review: [],
  };
  const referenceQueues: ContentFreshnessClinicalCurrencyReport["referenceQueues"] = {
    broken: [],
    missing: [],
    outdated: [],
    highRiskClinical: [],
  };
  const alerts: ClinicalCurrencyAlert[] = [];

  for (const item of items) {
    addRollup(byContentType, item.contentType, item);
    addRollup(byPathway, item.pathway, item);
    addRollup(byTopic, item.topic, item);

    const queued = queueItem(item);
    if (shouldBeCritical(item)) {
      reviewQueues.critical_clinical_review.push(queued);
    } else if (item.status === "review_required" || item.referenceFlags.length > 0 || item.pharmacologyFlags.length > 0 || item.ecgFlags.length > 0) {
      reviewQueues.high_priority_review.push(queued);
    } else if (item.status === "review_soon" || (item.daysUntilReviewDue !== null && item.daysUntilReviewDue <= 180)) {
      reviewQueues.routine_review.push(queued);
    }

    if (item.referenceFlags.includes("broken_reference") || item.referenceFlags.includes("unavailable_reference") || item.referenceFlags.includes("retracted_reference")) {
      referenceQueues.broken.push(queued);
    }
    if (item.referenceFlags.includes("missing_reference")) referenceQueues.missing.push(queued);
    if (item.referenceFlags.includes("outdated_reference")) referenceQueues.outdated.push(queued);
    if ((item.clinicalRisk === "high" || item.clinicalRisk === "critical") && item.status !== "current") {
      referenceQueues.highRiskClinical.push(queued);
    }

    alerts.push(...buildAlerts(item));
  }

  finalizeRollup(byContentType, items, (item) => item.contentType);
  finalizeRollup(byPathway, items, (item) => item.pathway);
  finalizeRollup(byTopic, items, (item) => item.topic);

  for (const queue of Object.values(reviewQueues)) sortQueue(queue);
  for (const queue of Object.values(referenceQueues)) sortQueue(queue);

  const total = items.length;
  const current = items.filter((item) => item.status === "current").length;
  const reviewSoon = items.filter((item) => item.status === "review_soon").length;
  const reviewRequired = items.filter((item) => item.status === "review_required").length;
  const critical = items.filter((item) => item.status === "critical_review_required").length;
  const allReferenceFlags = items.flatMap((item) => item.referenceFlags);
  const alertCounts = emptyAlertCounts();
  for (const alert of alerts) alertCounts[alert.type] += 1;

  const dashboard: ContentFreshnessDashboardSummary = {
    contentFreshnessScore: average(items.map((item) => item.freshnessScore)),
    currentContentPercent: percent(current, total),
    reviewSoonPercent: percent(reviewSoon, total),
    reviewRequiredPercent: percent(reviewRequired, total),
    criticalReviewPercent: percent(critical, total),
    brokenReferences: allReferenceFlags.filter((flag) => flag === "broken_reference").length,
    outdatedReferences: allReferenceFlags.filter((flag) => flag === "outdated_reference").length,
    missingReferences: allReferenceFlags.filter((flag) => flag === "missing_reference").length,
    unavailableReferences: allReferenceFlags.filter((flag) => flag === "unavailable_reference").length,
    retractedReferences: allReferenceFlags.filter((flag) => flag === "retracted_reference").length,
    duplicateReferences: allReferenceFlags.filter((flag) => flag === "duplicate_reference").length,
    lowQualityReferences: allReferenceFlags.filter((flag) => flag === "low_quality_reference").length,
    contentWithoutReferences: items.filter((item) => item.referenceFlags.includes("missing_reference")).length,
    averageContentAgeDays: average(items.map((item) => item.contentAgeDays).filter((age): age is number => typeof age === "number")),
    queueCounts: {
      critical_clinical_review: reviewQueues.critical_clinical_review.length,
      high_priority_review: reviewQueues.high_priority_review.length,
      routine_review: reviewQueues.routine_review.length,
    },
    alertCounts,
  };

  return {
    generatedAt,
    totalItems: total,
    dashboard,
    byContentType,
    byPathway,
    byTopic,
    reviewQueues,
    referenceQueues,
    alerts,
    items,
  };
}
