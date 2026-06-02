export type EvidenceGovernanceContentType =
  | "question"
  | "flashcard"
  | "lesson"
  | "pharmacology"
  | "clinical_skill"
  | "ecg"
  | "cat"
  | "loft"
  | "hesi"
  | "teas"
  | "blog_post"
  | "authority_page";

export type EvidenceReferenceQualityLevel =
  | "primary_guideline"
  | "peer_reviewed_article"
  | "textbook"
  | "regulatory_source"
  | "professional_association"
  | "low_quality_web_source"
  | "missing";

export type EvidenceReferenceAccessStatus =
  | "accessible"
  | "broken"
  | "unavailable"
  | "retracted"
  | "unknown";

export type EvidenceReferenceFlag =
  | "broken_reference"
  | "missing_reference"
  | "outdated_reference"
  | "duplicate_reference"
  | "low_quality_reference"
  | "unavailable_reference"
  | "retracted_reference"
  | "missing_url"
  | "missing_locator";

export type EvidenceRiskPriority =
  | "routine"
  | "elevated"
  | "high"
  | "critical";

export type EvidenceReferenceInput = {
  id?: string | null;
  title?: string | null;
  url?: string | null;
  doi?: string | null;
  organization?: string | null;
  qualityLevel?: EvidenceReferenceQualityLevel | null;
  publicationYear?: number | null;
  publishedAt?: string | null;
  lastValidatedAt?: string | null;
  accessStatus?: EvidenceReferenceAccessStatus | null;
  isRetracted?: boolean | null;
  locator?: string | null;
  claim?: string | null;
};

export type EvidenceGovernanceContentItem = {
  id: string;
  contentType: EvidenceGovernanceContentType;
  title?: string | null;
  pathway?: string | null;
  tier?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  clinicalSpecialty?: string | null;
  body?: string | null;
  stem?: string | null;
  rationale?: string | null;
  clinicalReasoning?: string | null;
  references?: EvidenceReferenceInput[] | null;
  rawReferences?: unknown;
  sourcesJson?: unknown;
  apaReferences?: string[] | null;
  tags?: string[] | null;
  guidelineSensitive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ExtractedEvidenceReference = EvidenceReferenceInput & {
  referenceKey: string;
  extractedFrom: "explicit" | "rawReferences" | "sourcesJson" | "apaReferences" | "body";
};

export type EvidenceReferenceAudit = {
  referenceKey: string;
  title: string;
  url: string | null;
  qualityLevel: EvidenceReferenceQualityLevel;
  accessStatus: EvidenceReferenceAccessStatus;
  ageYears: number | null;
  flags: EvidenceReferenceFlag[];
};

export type EvidenceGovernanceAuditItem = {
  id: string;
  contentType: EvidenceGovernanceContentType;
  title: string;
  pathway: string;
  tier: string;
  topic: string;
  clinicalSpecialty: string;
  riskPriority: EvidenceRiskPriority;
  references: EvidenceReferenceAudit[];
  referenceQualityScore: number;
  evidenceCurrencyScore: number;
  publishable: boolean;
  flags: EvidenceReferenceFlag[];
  reviewReasons: string[];
};

export type EvidenceGovernanceQueueItem = {
  itemId: string;
  title: string;
  contentType: EvidenceGovernanceContentType;
  pathway: string;
  tier: string;
  topic: string;
  riskPriority: EvidenceRiskPriority;
  referenceQualityScore: number;
  evidenceCurrencyScore: number;
  reason: string;
};

export type EvidenceGovernanceDashboard = {
  totalContentItems: number;
  totalReferences: number;
  referenceQualityScore: number;
  evidenceCurrencyScore: number;
  brokenReferences: number;
  missingReferences: number;
  outdatedReferences: number;
  duplicateReferences: number;
  lowQualityReferences: number;
  unavailableReferences: number;
  retractedReferences: number;
  contentWithoutCitations: number;
  highRiskItemsRequiringReview: number;
};

export type ReferenceValidationEvidenceGovernanceReport = {
  generatedAt: string;
  dashboard: EvidenceGovernanceDashboard;
  byContentType: Record<string, { count: number; averageReferenceQualityScore: number; averageEvidenceCurrencyScore: number }>;
  byPathway: Record<string, { count: number; averageReferenceQualityScore: number; averageEvidenceCurrencyScore: number }>;
  brokenReferenceQueue: EvidenceGovernanceQueueItem[];
  missingReferenceQueue: EvidenceGovernanceQueueItem[];
  highRiskClinicalReviewQueue: EvidenceGovernanceQueueItem[];
  items: EvidenceGovernanceAuditItem[];
};

export type ReferenceValidationOptions = {
  generatedAt?: string | Date;
  highRiskReferenceMaxAgeYears?: number;
  routineReferenceMaxAgeYears?: number;
  verifyAccess?: boolean;
  fetcher?: typeof fetch;
};

const URL_PATTERN = /https?:\/\/[^\s)"'<>,]+/gi;

const HIGH_RISK_MARKERS = [
  "pharmacology",
  "medication",
  "drug",
  "insulin",
  "anticoagulant",
  "opioid",
  "warfarin",
  "heparin",
  "ecg",
  "arrhythmia",
  "stemi",
  "pacemaker",
  "emergency",
  "sepsis",
  "infectious",
  "diabetes",
  "cardiac",
  "maternal",
  "pregnancy",
  "postpartum",
  "pediatric",
  "neonate",
  "guideline",
  "screening",
  "critical care",
];

const CRITICAL_MARKERS = [
  "septic shock",
  "cardiac arrest",
  "stemi",
  "stroke",
  "anaphylaxis",
  "respiratory failure",
  "ventilator",
  "maternal hemorrhage",
  "neonatal resuscitation",
];

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]): number {
  return values.length > 0 ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : 0;
}

function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeReferenceKey(reference: EvidenceReferenceInput): string {
  return String(reference.doi ?? reference.url ?? reference.title ?? reference.id ?? "missing")
    .trim()
    .toLowerCase();
}

function textBlob(item: EvidenceGovernanceContentItem): string {
  return [
    item.contentType,
    item.title,
    item.pathway,
    item.tier,
    item.topic,
    item.subtopic,
    item.clinicalSpecialty,
    item.body,
    item.stem,
    item.rationale,
    item.clinicalReasoning,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function toReferenceObject(value: unknown): EvidenceReferenceInput | null {
  if (!value) return null;
  if (typeof value === "string") {
    const url = value.match(URL_PATTERN)?.[0] ?? null;
    return { title: value.replace(URL_PATTERN, "").trim() || url || value, url };
  }
  if (typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const title = record.title ?? record.name ?? record.label ?? record.source ?? record.citation;
  const url = record.url ?? record.href ?? record.link;
  const publicationYear = record.publicationYear ?? record.year;
  return {
    id: typeof record.id === "string" ? record.id : null,
    title: typeof title === "string" ? title : null,
    url: typeof url === "string" ? url : null,
    doi: typeof record.doi === "string" ? record.doi : null,
    organization: typeof record.organization === "string" ? record.organization : null,
    qualityLevel: isQualityLevel(record.qualityLevel) ? record.qualityLevel : null,
    publicationYear: typeof publicationYear === "number" ? publicationYear : null,
    publishedAt: typeof record.publishedAt === "string" ? record.publishedAt : null,
    lastValidatedAt: typeof record.lastValidatedAt === "string" ? record.lastValidatedAt : null,
    accessStatus: isAccessStatus(record.accessStatus) ? record.accessStatus : null,
    isRetracted: typeof record.isRetracted === "boolean" ? record.isRetracted : null,
    locator: typeof record.locator === "string" ? record.locator : null,
    claim: typeof record.claim === "string" ? record.claim : null,
  };
}

function isQualityLevel(value: unknown): value is EvidenceReferenceQualityLevel {
  return (
    value === "primary_guideline" ||
    value === "peer_reviewed_article" ||
    value === "textbook" ||
    value === "regulatory_source" ||
    value === "professional_association" ||
    value === "low_quality_web_source" ||
    value === "missing"
  );
}

function isAccessStatus(value: unknown): value is EvidenceReferenceAccessStatus {
  return value === "accessible" || value === "broken" || value === "unavailable" || value === "retracted" || value === "unknown";
}

function collectReferencesFromUnknown(value: unknown, extractedFrom: ExtractedEvidenceReference["extractedFrom"]): ExtractedEvidenceReference[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectReferencesFromUnknown(entry, extractedFrom));
  }
  const reference = toReferenceObject(value);
  return reference
    ? [
        {
          ...reference,
          referenceKey: normalizeReferenceKey(reference),
          extractedFrom,
        },
      ]
    : [];
}

function extractUrlsFromText(text: string | null | undefined): ExtractedEvidenceReference[] {
  if (!text) return [];
  const urls = text.match(URL_PATTERN) ?? [];
  return urls.map((url) => ({
    title: url,
    url,
    referenceKey: url.toLowerCase(),
    extractedFrom: "body" as const,
  }));
}

export function extractEvidenceReferences(item: EvidenceGovernanceContentItem): ExtractedEvidenceReference[] {
  const explicit = (item.references ?? []).map((reference) => ({
    ...reference,
    referenceKey: normalizeReferenceKey(reference),
    extractedFrom: "explicit" as const,
  }));
  const rawReferences = collectReferencesFromUnknown(item.rawReferences, "rawReferences");
  const sourcesJson = collectReferencesFromUnknown(item.sourcesJson, "sourcesJson");
  const apaReferences = (item.apaReferences ?? []).flatMap((reference) => collectReferencesFromUnknown(reference, "apaReferences"));
  const bodyUrls = extractUrlsFromText([item.body, item.rationale, item.clinicalReasoning].filter(Boolean).join("\n"));

  return [...explicit, ...rawReferences, ...sourcesJson, ...apaReferences, ...bodyUrls].filter(
    (reference) => reference.title || reference.url || reference.doi,
  );
}

export function inferReferenceQualityLevel(reference: EvidenceReferenceInput): EvidenceReferenceQualityLevel {
  if (reference.qualityLevel) return reference.qualityLevel;
  const text = `${reference.title ?? ""} ${reference.organization ?? ""} ${reference.url ?? ""} ${reference.doi ?? ""}`.toLowerCase();
  if (!text.trim()) return "missing";
  if (/guideline|aha|cdc|who|nice|rnao|idsa|diabetes canada|heart and stroke|surviving sepsis|acls|pals/.test(text)) {
    return "primary_guideline";
  }
  if (/college|regulatory|cno|bccnm|ncsbn|government|ministry|fda|health canada/.test(text)) return "regulatory_source";
  if (/association|society|academy|cna|ana|professional standard/.test(text)) return "professional_association";
  if (/doi|pubmed|journal|peer|nejm|jama|lancet|bmj|cochrane/.test(text)) return "peer_reviewed_article";
  if (/textbook|manual|handbook/.test(text)) return "textbook";
  if (/wikipedia|quizlet|blogspot|forum|reddit|webmd|healthline/.test(text)) return "low_quality_web_source";
  return reference.url ? "professional_association" : "missing";
}

function inferRiskPriority(item: EvidenceGovernanceContentItem): EvidenceRiskPriority {
  const text = textBlob(item);
  if (item.guidelineSensitive || CRITICAL_MARKERS.some((marker) => text.includes(marker))) return "critical";
  if (
    item.contentType === "pharmacology" ||
    item.contentType === "ecg" ||
    HIGH_RISK_MARKERS.some((marker) => text.includes(marker))
  ) {
    return "high";
  }
  if (item.contentType === "clinical_skill" || item.contentType === "cat" || item.contentType === "loft") return "elevated";
  return "routine";
}

function referenceAgeYears(reference: EvidenceReferenceInput, now: Date): number | null {
  if (typeof reference.publicationYear === "number") return Math.max(0, now.getFullYear() - reference.publicationYear);
  const publishedAt = parseDate(reference.publishedAt);
  return publishedAt ? Math.max(0, Math.floor((now.getTime() - publishedAt.getTime()) / 31_557_600_000)) : null;
}

function maxAgeYearsForRisk(risk: EvidenceRiskPriority, options: Required<Pick<ReferenceValidationOptions, "highRiskReferenceMaxAgeYears" | "routineReferenceMaxAgeYears">>): number {
  return risk === "critical" || risk === "high" ? options.highRiskReferenceMaxAgeYears : options.routineReferenceMaxAgeYears;
}

async function checkReferenceAccess(
  reference: EvidenceReferenceInput,
  fetcher: typeof fetch,
): Promise<EvidenceReferenceAccessStatus> {
  if (reference.isRetracted) return "retracted";
  if (!reference.url) return reference.accessStatus ?? "unknown";
  try {
    const head = await fetcher(reference.url, { method: "HEAD" });
    if (head.ok) return "accessible";
    if (head.status === 405 || head.status === 403) {
      const get = await fetcher(reference.url, { method: "GET" });
      return get.ok ? "accessible" : get.status >= 500 ? "unavailable" : "broken";
    }
    return head.status >= 500 ? "unavailable" : "broken";
  } catch {
    return "unavailable";
  }
}

function scoreReferenceQuality(audits: EvidenceReferenceAudit[], risk: EvidenceRiskPriority): number {
  if (audits.length === 0) return risk === "critical" || risk === "high" ? 25 : 55;
  return average(
    audits.map((audit) => {
      let score = 76;
      if (audit.qualityLevel === "primary_guideline" || audit.qualityLevel === "regulatory_source") score += 18;
      if (audit.qualityLevel === "peer_reviewed_article" || audit.qualityLevel === "professional_association") score += 10;
      if (audit.qualityLevel === "textbook") score += risk === "routine" ? 8 : 0;
      if (audit.flags.includes("low_quality_reference")) score -= 35;
      if (audit.flags.includes("missing_reference")) score -= 45;
      if (audit.flags.includes("duplicate_reference")) score -= 8;
      if (audit.flags.includes("missing_locator")) score -= 5;
      return clamp(score);
    }),
  );
}

function scoreEvidenceCurrency(audits: EvidenceReferenceAudit[], risk: EvidenceRiskPriority): number {
  if (audits.length === 0) return risk === "critical" || risk === "high" ? 20 : 55;
  return average(
    audits.map((audit) => {
      let score = 88;
      if (audit.flags.includes("outdated_reference")) score -= risk === "critical" || risk === "high" ? 42 : 24;
      if (audit.flags.includes("broken_reference") || audit.flags.includes("unavailable_reference")) score -= 45;
      if (audit.flags.includes("retracted_reference")) score -= 80;
      if (audit.accessStatus === "unknown") score -= 10;
      return clamp(score);
    }),
  );
}

function reasonForItem(item: EvidenceGovernanceAuditItem): string {
  if (item.flags.includes("retracted_reference")) return "Retracted evidence source requires immediate replacement.";
  if (item.flags.includes("broken_reference")) return "Broken reference prevents evidence verification.";
  if (item.flags.includes("missing_reference")) return "Content has no extracted references.";
  if (item.flags.includes("outdated_reference")) return "Reference age exceeds the acceptable threshold for this clinical risk level.";
  if (item.flags.includes("low_quality_reference")) return "Reference quality is below clinical publication standards.";
  return item.reviewReasons[0] ?? "Evidence review recommended.";
}

function toQueueItem(item: EvidenceGovernanceAuditItem): EvidenceGovernanceQueueItem {
  return {
    itemId: item.id,
    title: item.title,
    contentType: item.contentType,
    pathway: item.pathway,
    tier: item.tier,
    topic: item.topic,
    riskPriority: item.riskPriority,
    referenceQualityScore: item.referenceQualityScore,
    evidenceCurrencyScore: item.evidenceCurrencyScore,
    reason: reasonForItem(item),
  };
}

function sortQueue(queue: EvidenceGovernanceQueueItem[]): EvidenceGovernanceQueueItem[] {
  const riskRank: Record<EvidenceRiskPriority, number> = { critical: 4, high: 3, elevated: 2, routine: 1 };
  return queue.sort((a, b) => {
    if (riskRank[a.riskPriority] !== riskRank[b.riskPriority]) return riskRank[b.riskPriority] - riskRank[a.riskPriority];
    const aScore = Math.min(a.referenceQualityScore, a.evidenceCurrencyScore);
    const bScore = Math.min(b.referenceQualityScore, b.evidenceCurrencyScore);
    return aScore - bScore;
  });
}

function buildRollup(items: EvidenceGovernanceAuditItem[], keyFn: (item: EvidenceGovernanceAuditItem) => string) {
  const rollup: ReferenceValidationEvidenceGovernanceReport["byContentType"] = {};
  for (const item of items) {
    const key = keyFn(item);
    const entry = (rollup[key] ??= { count: 0, averageReferenceQualityScore: 0, averageEvidenceCurrencyScore: 0 });
    entry.count += 1;
  }
  for (const key of Object.keys(rollup)) {
    const group = items.filter((item) => keyFn(item) === key);
    rollup[key].averageReferenceQualityScore = average(group.map((item) => item.referenceQualityScore));
    rollup[key].averageEvidenceCurrencyScore = average(group.map((item) => item.evidenceCurrencyScore));
  }
  return rollup;
}

export async function auditEvidenceGovernanceItem(
  item: EvidenceGovernanceContentItem,
  options: ReferenceValidationOptions = {},
): Promise<EvidenceGovernanceAuditItem> {
  const now = parseDate(options.generatedAt) ?? new Date();
  const resolvedOptions = {
    highRiskReferenceMaxAgeYears: options.highRiskReferenceMaxAgeYears ?? 4,
    routineReferenceMaxAgeYears: options.routineReferenceMaxAgeYears ?? 8,
  };
  const riskPriority = inferRiskPriority(item);
  const extracted = extractEvidenceReferences(item);
  const seen = new Set<string>();
  const audits: EvidenceReferenceAudit[] = [];

  for (const reference of extracted) {
    const qualityLevel = inferReferenceQualityLevel(reference);
    const ageYears = referenceAgeYears(reference, now);
    const accessStatus = options.verifyAccess && options.fetcher
      ? await checkReferenceAccess(reference, options.fetcher)
      : reference.isRetracted
        ? "retracted"
        : reference.accessStatus ?? (reference.url ? "unknown" : "unknown");
    const flags: EvidenceReferenceFlag[] = [];
    const key = reference.referenceKey;

    if (!reference.title && !reference.url && !reference.doi) flags.push("missing_reference");
    if (!reference.url && !reference.doi) flags.push("missing_url");
    if (!reference.locator && item.contentType !== "blog_post" && item.contentType !== "authority_page") flags.push("missing_locator");
    if (seen.has(key)) flags.push("duplicate_reference");
    seen.add(key);
    if (qualityLevel === "low_quality_web_source" || qualityLevel === "missing") flags.push("low_quality_reference");
    if (accessStatus === "broken") flags.push("broken_reference");
    if (accessStatus === "unavailable") flags.push("unavailable_reference");
    if (accessStatus === "retracted") flags.push("retracted_reference");
    if (ageYears !== null && ageYears > maxAgeYearsForRisk(riskPriority, resolvedOptions)) flags.push("outdated_reference");

    audits.push({
      referenceKey: key,
      title: reference.title ?? reference.url ?? reference.doi ?? "Untitled reference",
      url: reference.url ?? null,
      qualityLevel,
      accessStatus,
      ageYears,
      flags: [...new Set(flags)],
    });
  }

  if (audits.length === 0) {
    audits.push({
      referenceKey: "missing",
      title: "Missing reference",
      url: null,
      qualityLevel: "missing",
      accessStatus: "unknown",
      ageYears: null,
      flags: ["missing_reference"],
    });
  }

  const flags = [...new Set(audits.flatMap((audit) => audit.flags))];
  const referenceQualityScore = scoreReferenceQuality(audits, riskPriority);
  const evidenceCurrencyScore = scoreEvidenceCurrency(audits, riskPriority);
  const highRisk = riskPriority === "critical" || riskPriority === "high";
  const reviewReasons = [
    ...(flags.includes("missing_reference") ? ["Content has no accessible citation inventory."] : []),
    ...(flags.includes("broken_reference") ? ["At least one reference returned a broken response."] : []),
    ...(flags.includes("unavailable_reference") ? ["At least one reference could not be reached."] : []),
    ...(flags.includes("outdated_reference") ? ["One or more references are older than the allowed evidence threshold."] : []),
    ...(flags.includes("low_quality_reference") ? ["Low-quality web source used for clinical education."] : []),
    ...(flags.includes("duplicate_reference") ? ["Duplicate references reduce evidence diversity."] : []),
  ];
  const publishable =
    !flags.includes("retracted_reference") &&
    !flags.includes("broken_reference") &&
    !flags.includes("missing_reference") &&
    !(highRisk && (flags.includes("outdated_reference") || flags.includes("low_quality_reference") || flags.includes("unavailable_reference")));

  return {
    id: item.id,
    contentType: item.contentType,
    title: item.title ?? item.id,
    pathway: item.pathway ?? "Unmapped",
    tier: item.tier ?? "Unmapped",
    topic: item.topic ?? "Unmapped",
    clinicalSpecialty: item.clinicalSpecialty ?? item.topic ?? "Unmapped",
    riskPriority,
    references: audits,
    referenceQualityScore,
    evidenceCurrencyScore,
    publishable,
    flags,
    reviewReasons: [...new Set(reviewReasons)],
  };
}

export async function buildReferenceValidationEvidenceGovernanceReport(
  contentItems: EvidenceGovernanceContentItem[],
  options: ReferenceValidationOptions = {},
): Promise<ReferenceValidationEvidenceGovernanceReport> {
  const generatedAt = (parseDate(options.generatedAt) ?? new Date()).toISOString();
  const items = await Promise.all(contentItems.map((item) => auditEvidenceGovernanceItem(item, { ...options, generatedAt })));
  const brokenReferenceQueue: EvidenceGovernanceQueueItem[] = [];
  const missingReferenceQueue: EvidenceGovernanceQueueItem[] = [];
  const highRiskClinicalReviewQueue: EvidenceGovernanceQueueItem[] = [];

  for (const item of items) {
    const queued = toQueueItem(item);
    if (item.flags.includes("broken_reference") || item.flags.includes("unavailable_reference") || item.flags.includes("retracted_reference")) {
      brokenReferenceQueue.push(queued);
    }
    if (item.flags.includes("missing_reference")) missingReferenceQueue.push(queued);
    if (
      (item.riskPriority === "critical" || item.riskPriority === "high") &&
      (!item.publishable || item.flags.includes("outdated_reference") || item.flags.includes("low_quality_reference"))
    ) {
      highRiskClinicalReviewQueue.push(queued);
    }
  }

  sortQueue(brokenReferenceQueue);
  sortQueue(missingReferenceQueue);
  sortQueue(highRiskClinicalReviewQueue);

  const allFlags = items.flatMap((item) => item.flags);
  const dashboard: EvidenceGovernanceDashboard = {
    totalContentItems: items.length,
    totalReferences: items.reduce((sum, item) => sum + item.references.filter((reference) => !reference.flags.includes("missing_reference")).length, 0),
    referenceQualityScore: average(items.map((item) => item.referenceQualityScore)),
    evidenceCurrencyScore: average(items.map((item) => item.evidenceCurrencyScore)),
    brokenReferences: allFlags.filter((flag) => flag === "broken_reference").length,
    missingReferences: allFlags.filter((flag) => flag === "missing_reference").length,
    outdatedReferences: allFlags.filter((flag) => flag === "outdated_reference").length,
    duplicateReferences: allFlags.filter((flag) => flag === "duplicate_reference").length,
    lowQualityReferences: allFlags.filter((flag) => flag === "low_quality_reference").length,
    unavailableReferences: allFlags.filter((flag) => flag === "unavailable_reference").length,
    retractedReferences: allFlags.filter((flag) => flag === "retracted_reference").length,
    contentWithoutCitations: items.filter((item) => item.flags.includes("missing_reference")).length,
    highRiskItemsRequiringReview: highRiskClinicalReviewQueue.length,
  };

  return {
    generatedAt,
    dashboard,
    byContentType: buildRollup(items, (item) => item.contentType),
    byPathway: buildRollup(items, (item) => item.pathway),
    brokenReferenceQueue,
    missingReferenceQueue,
    highRiskClinicalReviewQueue,
    items,
  };
}
