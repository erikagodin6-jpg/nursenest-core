export type ContentScopeSurface =
  | "question"
  | "lesson"
  | "flashcard"
  | "clinical_skill"
  | "pharmacology"
  | "ecg"
  | "simulation";

export type ContentScopeSeverity = "low" | "medium" | "high" | "critical";

export type ContentScopeIssueType =
  | "rn_too_advanced"
  | "rpn_too_advanced"
  | "np_too_basic"
  | "rt_content_in_nursing"
  | "icu_content_in_entry_level"
  | "country_mismatch"
  | "exam_mismatch"
  | "allied_scope_mismatch";

export type ContentScopeAuditItem = {
  id: string;
  surface: ContentScopeSurface;
  title: string;
  body: string;
  tier?: string | null;
  exam?: string | null;
  country?: string | null;
  careerType?: string | null;
  pathwayId?: string | null;
  topic?: string | null;
  tags?: string[];
};

export type ContentScopeFinding = {
  itemId: string;
  surface: ContentScopeSurface;
  title: string;
  tier: string | null;
  exam: string | null;
  country: string | null;
  issueType: ContentScopeIssueType;
  severity: ContentScopeSeverity;
  evidence: string[];
  suggestedCorrection: string;
};

export type ContentScopeSummary = {
  totalItems: number;
  flaggedItems: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  complianceScore: number;
  bySurface: Record<ContentScopeSurface, { audited: number; flagged: number }>;
  byIssueType: Partial<Record<ContentScopeIssueType, number>>;
};

const SURFACES: ContentScopeSurface[] = [
  "question",
  "lesson",
  "flashcard",
  "clinical_skill",
  "pharmacology",
  "ecg",
  "simulation",
];

const ICU_HIGH_ACUITY = [
  "ecmo",
  "iabp",
  "intra-aortic balloon pump",
  "swan-ganz",
  "pulmonary artery catheter",
  "arterial line waveform",
  "cvp waveform",
  "crrt",
  "continuous renal replacement",
  "vasopressor titration",
  "titrate norepinephrine",
  "titrate vasopressin",
  "propofol infusion",
  "rapid sequence intubation",
  "ventilator dyssynchrony",
  "plateau pressure",
  "intracranial pressure",
  "icp monitoring",
];

const RT_TECHNICAL = [
  "peep titration",
  "ventilator mode",
  "pressure control ventilation",
  "volume control ventilation",
  "mean airway pressure",
  "bronchodilator nebulizer setup",
  "spirometry calibration",
  "flow-volume loop",
  "end-tidal co2 waveform",
  "abg compensation",
  "respiratory therapist",
];

const BASIC_FOUNDATION = [
  "call bell",
  "make the bed",
  "basic hygiene",
  "hand hygiene before patient contact",
  "take vital signs",
  "assist with bathing",
  "ambulate with assistance",
  "measure intake and output",
  "standard precautions are used for all patients",
];

const CANADIAN_MARKERS = [
  "cno",
  "rex-pn",
  "cpnre",
  "cnple",
  "ccrnr",
  "college of nurses of ontario",
  "controlled acts",
  "regulated health professions act",
];

const US_MARKERS = [
  "nclex-pn",
  "lvn",
  "state board of nursing",
  "medicare",
  "medicaid",
  "hipaa",
  "us state practice act",
];

const EXAM_MARKERS: Record<string, string[]> = {
  "NCLEX-RN": ["nclex-rn", "nclex rn"],
  "NCLEX-PN": ["nclex-pn", "nclex pn"],
  "REX-PN": ["rex-pn", "rex pn"],
  CPNRE: ["cpnre"],
  CNPLE: ["cnple", "loft"],
  ALLIED: ["tmc", "rrt", "crt", "paramedic", "radiography", "mlt"],
};

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function contentBlob(item: ContentScopeAuditItem): string {
  return [item.title, item.body, item.topic, item.exam, item.tier, item.country, item.careerType, item.pathwayId, ...(item.tags ?? [])]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

function matchesAny(blob: string, phrases: string[]): string[] {
  return phrases.filter((phrase) => blob.includes(phrase));
}

function isNursingTier(tier: string | null | undefined): boolean {
  const t = normalize(tier);
  return t === "rn" || t === "rpn" || t === "lvn_lpn" || t === "new_grad" || t === "pre_nursing";
}

function isEntryLevelTier(tier: string | null | undefined): boolean {
  const t = normalize(tier);
  return t === "rn" || t === "rpn" || t === "lvn_lpn" || t === "pre_nursing";
}

function countryMismatch(item: ContentScopeAuditItem, blob: string): ContentScopeFinding[] {
  const country = normalize(item.country);
  const findings: ContentScopeFinding[] = [];
  const canadianEvidence = matchesAny(blob, CANADIAN_MARKERS);
  const usEvidence = matchesAny(blob, US_MARKERS);

  if (country === "us" && canadianEvidence.length > 0) {
    findings.push(makeFinding(item, "country_mismatch", "high", canadianEvidence, "Move this item to a Canadian pathway or replace Canadian regulator/exam language with US NCLEX/state-board framing."));
  }
  if (country === "ca" && usEvidence.length > 0) {
    findings.push(makeFinding(item, "country_mismatch", "high", usEvidence, "Move this item to a US pathway or replace US-specific legal, billing, and NCLEX-PN/LVN terminology with Canadian pathway language."));
  }
  return findings;
}

function examMismatch(item: ContentScopeAuditItem, blob: string): ContentScopeFinding[] {
  const exam = normalize(item.exam);
  if (!exam) return [];

  const currentKey = Object.keys(EXAM_MARKERS).find((key) => exam.includes(key.toLowerCase().replace("-", "")) || exam.includes(key.toLowerCase()));
  const findings: ContentScopeFinding[] = [];

  for (const [key, markers] of Object.entries(EXAM_MARKERS)) {
    const evidence = matchesAny(blob, markers);
    if (evidence.length === 0) continue;
    const normalizedKey = key.toLowerCase();
    const sameExam =
      exam.includes(normalizedKey) ||
      exam.includes(normalizedKey.replace("-", "_")) ||
      exam.includes(normalizedKey.replace("-", "")) ||
      currentKey === key;
    if (!sameExam) {
      findings.push(
        makeFinding(
          item,
          "exam_mismatch",
          "high",
          evidence,
          `Retag this content for ${key} or rewrite the exam-specific framing so it matches ${item.exam ?? "the selected exam"}.`,
        ),
      );
    }
  }
  return findings;
}

function makeFinding(
  item: ContentScopeAuditItem,
  issueType: ContentScopeIssueType,
  severity: ContentScopeSeverity,
  evidence: string[],
  suggestedCorrection: string,
): ContentScopeFinding {
  return {
    itemId: item.id,
    surface: item.surface,
    title: item.title,
    tier: item.tier ?? null,
    exam: item.exam ?? null,
    country: item.country ?? null,
    issueType,
    severity,
    evidence: [...new Set(evidence)].slice(0, 6),
    suggestedCorrection,
  };
}

export function auditContentScope(item: ContentScopeAuditItem): ContentScopeFinding[] {
  const blob = contentBlob(item);
  const tier = normalize(item.tier);
  const careerType = normalize(item.careerType);
  const tags = (item.tags ?? []).map(normalize);
  const findings: ContentScopeFinding[] = [];

  const icuEvidence = matchesAny(blob, ICU_HIGH_ACUITY);
  if (icuEvidence.length > 0 && isEntryLevelTier(tier) && !tags.some((tag) => tag.includes("icu") || tag.includes("critical-care"))) {
    findings.push(
      makeFinding(
        item,
        tier === "rpn" || tier === "lvn_lpn" ? "rpn_too_advanced" : "icu_content_in_entry_level",
        tier === "pre_nursing" || tier === "rpn" || tier === "lvn_lpn" ? "critical" : "high",
        icuEvidence,
        "Move this item to New Grad/ICU/critical-care scope, lower the acuity and decision responsibility, or add explicit specialty-track tagging before learner delivery.",
      ),
    );
  }

  const rtEvidence = matchesAny(blob, RT_TECHNICAL);
  if (rtEvidence.length > 0 && isNursingTier(tier) && careerType !== "rrt" && careerType !== "respiratory") {
    findings.push(
      makeFinding(
        item,
        "rt_content_in_nursing",
        "high",
        rtEvidence,
        "Route this content to Respiratory Therapy/Allied scope or rewrite it around nursing recognition, escalation, and collaboration instead of RT equipment management.",
      ),
    );
  }

  const basicEvidence = matchesAny(blob, BASIC_FOUNDATION);
  if (tier === "np" && basicEvidence.length > 0) {
    findings.push(
      makeFinding(
        item,
        "np_too_basic",
        "medium",
        basicEvidence,
        "Raise the item to NP diagnostic reasoning, management planning, prescribing, follow-up, or escalation expectations.",
      ),
    );
  }

  if (tier === "allied" && (blob.includes("nclex") || blob.includes("registered nurse") || blob.includes("licensed practical nurse"))) {
    findings.push(
      makeFinding(
        item,
        "allied_scope_mismatch",
        "high",
        ["nursing exam terminology in Allied item"],
        "Retag for nursing or rewrite the item around the specific Allied profession competency and exam language.",
      ),
    );
  }

  findings.push(...countryMismatch(item, blob), ...examMismatch(item, blob));

  return dedupeFindings(findings);
}

function dedupeFindings(findings: ContentScopeFinding[]): ContentScopeFinding[] {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const key = `${finding.itemId}:${finding.issueType}:${finding.evidence.join("|")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function summarizeScopeCompliance(items: ContentScopeAuditItem[], findings: ContentScopeFinding[]): ContentScopeSummary {
  const flaggedItemIds = new Set(findings.map((finding) => finding.itemId));
  const bySurface = Object.fromEntries(SURFACES.map((surface) => [surface, { audited: 0, flagged: 0 }])) as ContentScopeSummary["bySurface"];
  for (const item of items) {
    bySurface[item.surface].audited += 1;
    if (flaggedItemIds.has(item.id)) bySurface[item.surface].flagged += 1;
  }

  const byIssueType: ContentScopeSummary["byIssueType"] = {};
  for (const finding of findings) {
    byIssueType[finding.issueType] = (byIssueType[finding.issueType] ?? 0) + 1;
  }

  const criticalFindings = findings.filter((finding) => finding.severity === "critical").length;
  const highFindings = findings.filter((finding) => finding.severity === "high").length;
  const mediumFindings = findings.filter((finding) => finding.severity === "medium").length;
  const lowFindings = findings.filter((finding) => finding.severity === "low").length;
  const weightedPenalty = criticalFindings * 8 + highFindings * 5 + mediumFindings * 3 + lowFindings;
  const denominator = Math.max(1, items.length * 3);

  return {
    totalItems: items.length,
    flaggedItems: flaggedItemIds.size,
    criticalFindings,
    highFindings,
    mediumFindings,
    lowFindings,
    complianceScore: Math.max(0, Math.round(100 - (weightedPenalty / denominator) * 100)),
    bySurface,
    byIssueType,
  };
}

