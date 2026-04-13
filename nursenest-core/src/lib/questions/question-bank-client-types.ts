/**
 * Shared types + safe parsing for question bank client (URL state, localStorage presets, session resume, discovery API).
 * Keeps `question-bank-practice-client` aligned with API payloads without weakening types at call sites.
 */

import type { RationaleQualityClient } from "@/components/student/premium-rationale-panel";
import type { RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";
import type { NormalizedTeachingPayload, TeachingMediaBundle } from "@/lib/content-quality/teaching-payload";
import type { ContentQualityTier } from "@/lib/content-quality/standards";
import { ALLOWED_QBANK_SESSION_SIZES } from "@/lib/student/learner-study-defaults";

export type QuestionBankPreset = "random_bank" | "topic_drill" | "pathway_mixed";

export type QuestionBankDifficultyBand = "" | "easy" | "moderate" | "hard";

export type SavedQuestionBankPreset = {
  id: string;
  name: string;
  savedAt: number;
  preset: QuestionBankPreset;
  pathwayId: string | null;
  topic: string | null;
  exam: string | null;
  difficultyBand: QuestionBankDifficultyBand;
  incorrectOnly: boolean;
  sessionSize: number;
  examShell: boolean;
  efficiencyMode: string | null;
};

export type QuestionBankLearningLoopPersisted = {
  topicCode: string | null;
  confidence: "high" | "medium" | "low";
  lessonHref: string | null;
  flashcardsHref: string | null;
  topicDrillHref: string | null;
};

/** Server-resolved lesson links for rationales (pathway-aware). */
export type RationaleLessonLinkClient = {
  kind: string;
  slug: string;
  title: string;
  href: string;
  hrefSource: "app" | "hub";
  ctaKey:
    | "learner.qbank.rationaleLinks.reviewTopic"
    | "learner.qbank.rationaleLinks.readRelatedLesson"
    | "learner.qbank.rationaleLinks.reviewPrioritization"
    | "learner.qbank.rationaleLinks.browseTopicHub"
    | "learner.qbank.rationaleLinks.openTopicLessons";
};

/** Matches graded map values in `QuestionBankPracticeClient` state. */
export type QuestionBankGradedStateEntry = {
  correct: boolean;
  /** Canonical correct option string(s); omitted on older persisted sessions. */
  correctKeys?: string[];
  rationale: string | null;
  rationaleQuality?: RationaleQualityClient | null;
  rationaleSections?: Array<{ heading: string; body: string }> | null;
  referenceMedia?: RationaleReferenceMedia[] | null;
  teaching?: NormalizedTeachingPayload | null;
  /** Present when rehydrated from storage; may be null if the blob was invalid. */
  teachingMedia?: TeachingMediaBundle | null;
  /** Optional concise clinical pearl surfaced in post-answer review. */
  clinicalPearl?: string | null;
  learningLoop?: QuestionBankLearningLoopPersisted | null;
  rationaleLessonLinks?: RationaleLessonLinkClient[] | null;
};

export type QuestionBankGradedStateMap = Record<string, QuestionBankGradedStateEntry>;

/** GET /api/questions/discovery JSON body (subset used by the client). */
export type QuestionBankDiscoveryResponse = {
  total?: number;
  buckets?: { topic: string; count: number }[];
  examFamily?: { exam: string | null; count: number }[];
  limits?: {
    topicBucketCap?: number;
    examBucketCap?: number;
    topicsTruncated?: boolean;
    examsTruncated?: boolean;
    topicsOmittedCount?: number;
    examsOmittedCount?: number;
    aggregateStrategy?: "sql_top_n";
  };
  diagnostics?: unknown;
};

/**
 * `nn_qbank_session_*` localStorage blob. Older clients omitted filter/session fields; all extensions optional except
 * what the UI reads with nullish coalescing.
 */
export type PersistedQuestionBankSessionState = {
  ids?: string[];
  idx?: number;
  topic?: string | null;
  pathwayId?: string | null;
  topicCode?: string | null;
  preset?: QuestionBankPreset;
  graded?: QuestionBankGradedStateMap;
  sessionSize?: number;
  difficultyBand?: QuestionBankDifficultyBand | string;
  examFilter?: string | null;
  incorrectOnly?: boolean;
  examShell?: boolean;
  savedAt?: number;
};

const PRESET_VALUES: readonly QuestionBankPreset[] = ["random_bank", "topic_drill", "pathway_mixed"];

function isQuestionBankPreset(x: unknown): x is QuestionBankPreset {
  return typeof x === "string" && (PRESET_VALUES as readonly string[]).includes(x);
}

export function normalizeQuestionBankDifficultyBand(x: unknown): QuestionBankDifficultyBand {
  if (x === "" || x === "easy" || x === "moderate" || x === "hard") return x;
  return "";
}

function clampSessionSize(n: unknown): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return 20;
  const allowed = ALLOWED_QBANK_SESSION_SIZES as readonly number[];
  return allowed.includes(Math.round(n)) ? Math.round(n) : 20;
}

const TIERS: readonly ContentQualityTier[] = ["missing", "thin", "acceptable", "strong"];

function isRationaleQualityClient(x: unknown): x is RationaleQualityClient {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.wordCount === "number" &&
    typeof o.showEnrichmentNotice === "boolean" &&
    typeof o.tier === "string" &&
    (TIERS as readonly string[]).includes(o.tier)
  );
}

function parseRationaleSections(raw: unknown): Array<{ heading: string; body: string }> | null {
  if (!Array.isArray(raw)) return null;
  const out: Array<{ heading: string; body: string }> = [];
  for (const row of raw) {
    if (!row || typeof row !== "object" || Array.isArray(row)) continue;
    const o = row as Record<string, unknown>;
    if (typeof o.heading !== "string" || typeof o.body !== "string") continue;
    out.push({ heading: o.heading, body: o.body });
  }
  return out.length ? out : null;
}

function parseReferenceMediaPersisted(raw: unknown): RationaleReferenceMedia[] | null {
  if (!Array.isArray(raw)) return null;
  const out: RationaleReferenceMedia[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const o = item as Record<string, unknown>;
    const url = typeof o.url === "string" ? o.url.trim() : "";
    if (!url.startsWith("https://")) continue;
    const altRaw = typeof o.alt === "string" ? o.alt.trim() : "";
    out.push({
      url,
      alt: altRaw || "Clinical reference figure",
      ...(typeof o.caption === "string" && o.caption.trim() ? { caption: o.caption.trim() } : {}),
      ...(typeof o.kind === "string" && o.kind.trim() ? { kind: o.kind.trim() } : {}),
    });
  }
  return out;
}

function isNormalizedTeachingPayload(x: unknown): x is NormalizedTeachingPayload {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;
  const o = x as Record<string, unknown>;
  if (typeof o.questionType !== "string") return false;
  if (!Array.isArray(o.correctAnswers) || !o.correctAnswers.every((a) => typeof a === "string")) return false;
  if (typeof o.keyTakeawayDerived !== "boolean") return false;
  if (!Array.isArray(o.sections)) return false;
  for (const s of o.sections) {
    if (!s || typeof s !== "object" || Array.isArray(s)) return false;
    const se = s as Record<string, unknown>;
    if (typeof se.id !== "string" || typeof se.heading !== "string" || typeof se.body !== "string") return false;
  }
  const sn = (v: unknown): v is string | null => v === null || typeof v === "string";
  if (
    !sn(o.rationale) ||
    !sn(o.correctAnswerExplanation) ||
    !(o.distractorNotes === null || typeof o.distractorNotes === "string") ||
    !sn(o.conceptTested) ||
    !sn(o.examStrategy) ||
    !sn(o.keyTakeaway) ||
    !sn(o.clinicalReasoning) ||
    !sn(o.clinicalPearl) ||
    !sn(o.clinicalTrap) ||
    !sn(o.memoryHook)
  ) {
    return false;
  }
  return true;
}

function parseTeachingMediaBundlePersisted(raw: unknown): TeachingMediaBundle | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  let ref: RationaleReferenceMedia[];
  if (o.referenceMedia === undefined) {
    ref = [];
  } else {
    const parsed = parseReferenceMediaPersisted(o.referenceMedia);
    if (parsed === null) return null;
    ref = parsed;
  }
  const m = o.matchedConceptImage;
  if (m === null || m === undefined) return { referenceMedia: ref, matchedConceptImage: null };
  if (!m || typeof m !== "object" || Array.isArray(m)) return null;
  const mo = m as Record<string, unknown>;
  if (typeof mo.url !== "string" || typeof mo.alt !== "string" || typeof mo.objectKey !== "string") return null;
  return {
    referenceMedia: ref,
    matchedConceptImage: { url: mo.url, alt: mo.alt, objectKey: mo.objectKey },
  };
}

function parseLearningLoopPersisted(raw: unknown): QuestionBankLearningLoopPersisted | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const c = o.confidence;
  if (c !== "high" && c !== "medium" && c !== "low") return null;
  return {
    topicCode: typeof o.topicCode === "string" ? o.topicCode : null,
    confidence: c,
    lessonHref: typeof o.lessonHref === "string" ? o.lessonHref : null,
    flashcardsHref: typeof o.flashcardsHref === "string" ? o.flashcardsHref : null,
    topicDrillHref: typeof o.topicDrillHref === "string" ? o.topicDrillHref : null,
  };
}

const RATIONALE_CTA_KEYS = new Set<string>([
  "learner.qbank.rationaleLinks.reviewTopic",
  "learner.qbank.rationaleLinks.readRelatedLesson",
  "learner.qbank.rationaleLinks.reviewPrioritization",
  "learner.qbank.rationaleLinks.browseTopicHub",
]);

function parseRationaleLessonLinksPersisted(raw: unknown): RationaleLessonLinkClient[] | null {
  if (!Array.isArray(raw)) return null;
  const out: RationaleLessonLinkClient[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object" || Array.isArray(x)) continue;
    const o = x as Record<string, unknown>;
    const ctaKey = o.ctaKey;
    if (typeof ctaKey !== "string" || !RATIONALE_CTA_KEYS.has(ctaKey)) continue;
    const hrefSource = o.hrefSource;
    if (hrefSource !== "app" && hrefSource !== "hub") continue;
    if (typeof o.href !== "string" || typeof o.title !== "string" || typeof o.slug !== "string" || typeof o.kind !== "string")
      continue;
    out.push({
      kind: o.kind,
      slug: o.slug,
      title: o.title,
      href: o.href,
      hrefSource,
      ctaKey: ctaKey as RationaleLessonLinkClient["ctaKey"],
    });
  }
  return out.length > 0 ? out : null;
}

/**
 * Rehydrate graded map from localStorage. Drops malformed entries; never throws.
 */
export function parseQuestionBankGradedStateMap(raw: unknown): QuestionBankGradedStateMap | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const src = raw as Record<string, unknown>;
  const out: QuestionBankGradedStateMap = {};
  for (const [id, v] of Object.entries(src)) {
    if (typeof id !== "string" || !v || typeof v !== "object" || Array.isArray(v)) continue;
    const e = v as Record<string, unknown>;
    if (typeof e.correct !== "boolean") continue;
    const rationale = e.rationale;
    const ckRaw = e.correctKeys;
    const correctKeys =
      Array.isArray(ckRaw) && ckRaw.every((x) => typeof x === "string") ? (ckRaw as string[]) : undefined;

    const entry: QuestionBankGradedStateEntry = {
      correct: e.correct,
      ...(correctKeys && correctKeys.length > 0 ? { correctKeys } : {}),
      rationale: typeof rationale === "string" ? rationale : null,
      rationaleQuality: isRationaleQualityClient(e.rationaleQuality) ? e.rationaleQuality : null,
      rationaleSections: parseRationaleSections(e.rationaleSections),
      teaching: isNormalizedTeachingPayload(e.teaching) ? e.teaching : null,
      clinicalPearl: typeof e.clinicalPearl === "string" ? e.clinicalPearl : null,
      learningLoop: parseLearningLoopPersisted(e.learningLoop),
      rationaleLessonLinks: parseRationaleLessonLinksPersisted(e.rationaleLessonLinks),
    };
    if ("referenceMedia" in e) {
      const pm = parseReferenceMediaPersisted(e.referenceMedia);
      if (pm !== null) entry.referenceMedia = pm;
    }
    if ("teachingMedia" in e) {
      entry.teachingMedia = parseTeachingMediaBundlePersisted(e.teachingMedia);
    }
    out[id] = entry;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function parsePersistedQuestionBankSessionJson(raw: string | null): PersistedQuestionBankSessionState | null {
  if (raw == null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const o = parsed as Record<string, unknown>;
    const out: PersistedQuestionBankSessionState = {};
    if (Array.isArray(o.ids)) {
      out.ids = o.ids.filter((x): x is string => typeof x === "string");
    }
    if (typeof o.idx === "number" && Number.isFinite(o.idx)) out.idx = Math.max(0, Math.floor(o.idx));
    if (o.topic === null || typeof o.topic === "string") out.topic = o.topic;
    if (o.pathwayId === null || typeof o.pathwayId === "string") out.pathwayId = o.pathwayId;
    if (o.topicCode === null || typeof o.topicCode === "string") out.topicCode = o.topicCode;
    if (isQuestionBankPreset(o.preset)) out.preset = o.preset;
    const graded = parseQuestionBankGradedStateMap(o.graded);
    if (graded) out.graded = graded;
    if (typeof o.sessionSize === "number") out.sessionSize = clampSessionSize(o.sessionSize);
    if (o.difficultyBand !== undefined) out.difficultyBand = normalizeQuestionBankDifficultyBand(o.difficultyBand);
    if (o.examFilter === null || typeof o.examFilter === "string") out.examFilter = o.examFilter;
    if (typeof o.incorrectOnly === "boolean") out.incorrectOnly = o.incorrectOnly;
    if (typeof o.examShell === "boolean") out.examShell = o.examShell;
    if (typeof o.savedAt === "number" && Number.isFinite(o.savedAt)) out.savedAt = o.savedAt;
    return out;
  } catch {
    return null;
  }
}

export function normalizeSavedQuestionBankPreset(x: unknown): SavedQuestionBankPreset | null {
  if (!x || typeof x !== "object" || Array.isArray(x)) return null;
  const o = x as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.name !== "string") return null;
  if (!isQuestionBankPreset(o.preset)) return null;
  return {
    id: o.id,
    name: o.name,
    savedAt: typeof o.savedAt === "number" && Number.isFinite(o.savedAt) ? o.savedAt : Date.now(),
    preset: o.preset,
    pathwayId: typeof o.pathwayId === "string" ? o.pathwayId : null,
    topic: typeof o.topic === "string" ? o.topic : null,
    exam: typeof o.exam === "string" ? o.exam : null,
    difficultyBand: normalizeQuestionBankDifficultyBand(o.difficultyBand),
    incorrectOnly: Boolean(o.incorrectOnly),
    sessionSize: clampSessionSize(o.sessionSize),
    examShell: Boolean(o.examShell),
    efficiencyMode: typeof o.efficiencyMode === "string" ? o.efficiencyMode : null,
  };
}

export function parseSavedQuestionBankPresetsJson(raw: string | null): SavedQuestionBankPreset[] {
  if (raw == null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: SavedQuestionBankPreset[] = [];
    for (const item of parsed) {
      const row = normalizeSavedQuestionBankPreset(item);
      if (row) out.push(row);
    }
    return out;
  } catch {
    return [];
  }
}
