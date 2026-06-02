export const ECG_VIDEO_QUESTION_FORMAT = "ecg_video" as const;
export const ECG_LIVE_STRIP_MEDIA_TYPE = "ecg_live_strip" as const;

export const ECG_VIDEO_TAG = "ecg-video" as const;

export const ECG_RHYTHM_CATEGORIES = [
  "Normal sinus rhythm",
  "Sinus bradycardia",
  "Sinus tachycardia",
  "Atrial fibrillation",
  "Atrial flutter",
  "SVT",
  "Ventricular tachycardia",
  "Ventricular fibrillation",
  "Asystole",
  "Pulseless electrical activity",
  "Heart block",
  "STEMI changes",
  "Hyperkalemia ECG changes",
  "Paced rhythm",
  "Artifact recognition",
] as const;

export const ECG_VIDEO_SUPPORTED_MIME_TYPES = ["video/mp4", "video/webm"] as const;

const SUPPORTED_MIME = new Set<string>(ECG_VIDEO_SUPPORTED_MIME_TYPES);

export type EcgVideoQuestionMode = "practice" | "cat";
export type EcgVideoQuestionPhase = "pre_submit" | "post_submit" | "post_exam_review";

export type EcgVideoAsset = {
  url?: string;
  assetId?: string;
  mimeType?: string;
  thumbnailUrl?: string;
  alt?: string;
  caption?: string;
  durationSeconds?: number;
};

export type EcgJsonValue = string | number | boolean | null | EcgJsonValue[] | { [key: string]: EcgJsonValue };

export type EcgLinkedLesson = {
  pathwayId?: string;
  slug?: string;
  href?: string;
  title?: string;
};

export type EcgVideoQuestionExhibit = {
  kind: typeof ECG_VIDEO_QUESTION_FORMAT;
  asset: EcgVideoAsset;
  mediaType?: typeof ECG_LIVE_STRIP_MEDIA_TYPE | "video_url";
  mediaConfig?: EcgJsonValue;
  rhythmCategory: string;
  recognitionClues?: string[];
  linkedLesson?: EcgLinkedLesson;
  safeFallbackText?: string;
};

export type EcgVideoQuestionLike = {
  stem?: string | null;
  questionType?: string | null;
  questionFormat?: string | null;
  exhibitData?: unknown;
  images?: unknown;
  options?: unknown;
  correctAnswer?: unknown;
  answerKey?: unknown;
  rationale?: string | null;
  tags?: string[] | null;
  level?: string | null;
  mode?: string | null;
  mediaType?: string | null;
  mediaConfig?: unknown;
  studyLinkPathwayId?: string | null;
  studyLinkLessonSlug?: string | null;
};

export type EcgVideoPublishValidation = {
  ok: boolean;
  reasons: string[];
  warnings: string[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out = value.map((x) => String(x ?? "").trim()).filter(Boolean);
  return out.length > 0 ? out : undefined;
}

function assetFromRecord(raw: unknown): EcgVideoAsset | null {
  const record = asRecord(raw);
  if (!record) return null;
  const url = stringValue(record.url) ?? stringValue(record.src) ?? stringValue(record.publicUrl);
  const assetId = stringValue(record.assetId) ?? stringValue(record.id) ?? stringValue(record.mediaAssetId);
  const mimeType = stringValue(record.mimeType) ?? stringValue(record.type);
  const thumbnailUrl = stringValue(record.thumbnailUrl) ?? stringValue(record.poster);
  const alt = stringValue(record.alt) ?? stringValue(record.description);
  const caption = stringValue(record.caption);
  const durationRaw = record.durationSeconds;
  const durationSeconds = typeof durationRaw === "number" && Number.isFinite(durationRaw) ? durationRaw : undefined;
  if (!url && !assetId) return null;
  return { url, assetId, mimeType, thumbnailUrl, alt, caption, durationSeconds };
}

function firstVideoAssetFromImages(images: unknown): EcgVideoAsset | null {
  if (!Array.isArray(images)) return null;
  for (const image of images) {
    const asset = assetFromRecord(image);
    if (!asset) continue;
    const mime = asset.mimeType?.toLowerCase();
    if (mime?.startsWith("video/") || asset.url?.match(/\.(mp4|webm)(\?|#|$)/i)) return asset;
  }
  return null;
}

export function isEcgVideoQuestion(row: Pick<EcgVideoQuestionLike, "questionFormat" | "exhibitData" | "images" | "tags">): boolean {
  if (row.questionFormat === ECG_VIDEO_QUESTION_FORMAT) return true;
  if (row.tags?.some((tag) => tag.trim().toLowerCase() === ECG_VIDEO_TAG)) return true;
  const exhibit = asRecord(row.exhibitData);
  if (exhibit?.kind === ECG_VIDEO_QUESTION_FORMAT) return true;
  if (asRecord(exhibit?.ecgVideo)?.kind === ECG_VIDEO_QUESTION_FORMAT) return true;
  return Boolean(firstVideoAssetFromImages(row.images));
}

export function parseEcgVideoExhibit(exhibitData: unknown, images?: unknown): EcgVideoQuestionExhibit | null {
  const root = asRecord(exhibitData);
  const candidate = asRecord(root?.ecgVideo) ?? root;
  const mediaConfig = asRecord(candidate?.mediaConfig) ?? asRecord(candidate?.stripConfig);
  const mediaType = stringValue(candidate?.mediaType) ?? stringValue(mediaConfig?.mediaType);
  const asset = assetFromRecord(candidate?.asset) ?? assetFromRecord(candidate?.video) ?? firstVideoAssetFromImages(images);
  if (!asset && mediaType !== ECG_LIVE_STRIP_MEDIA_TYPE) return null;
  const rhythmCategory =
    stringValue(candidate?.rhythmCategory) ??
    stringValue(candidate?.category) ??
    stringValue(candidate?.rhythm) ??
    "ECG rhythm recognition";
  return {
    kind: ECG_VIDEO_QUESTION_FORMAT,
    asset: asset ?? {},
    mediaType: mediaType === ECG_LIVE_STRIP_MEDIA_TYPE ? ECG_LIVE_STRIP_MEDIA_TYPE : "video_url",
    mediaConfig: mediaConfig ? (mediaConfig as EcgJsonValue) : undefined,
    rhythmCategory,
    recognitionClues: stringArray(candidate?.recognitionClues ?? candidate?.clues),
    linkedLesson: asRecord(candidate?.linkedLesson)
      ? {
          pathwayId: stringValue(asRecord(candidate?.linkedLesson)?.pathwayId),
          slug: stringValue(asRecord(candidate?.linkedLesson)?.slug),
          href: stringValue(asRecord(candidate?.linkedLesson)?.href),
          title: stringValue(asRecord(candidate?.linkedLesson)?.title),
        }
      : undefined,
    safeFallbackText:
      stringValue(candidate?.safeFallbackText) ??
      "ECG strip could not load. Use the written rhythm description and answer options to continue.",
  };
}

export function ecgQuestionTeachingVisible(mode: EcgVideoQuestionMode, phase: EcgVideoQuestionPhase): boolean {
  if (mode === "cat") return phase === "post_exam_review";
  return phase === "post_submit" || phase === "post_exam_review";
}

export function validateEcgVideoQuestionForPublish(row: EcgVideoQuestionLike): EcgVideoPublishValidation {
  const reasons: string[] = [];
  const warnings: string[] = [];
  if (!isEcgVideoQuestion(row)) return { ok: true, reasons, warnings };

  if (!String(row.stem ?? "").trim()) reasons.push("ECG video question requires a visible stem.");
  const options = Array.isArray(row.options) ? row.options.filter((x) => String(x ?? "").trim().length > 0) : [];
  if (options.length < 2) reasons.push("ECG video question requires at least two answer options.");
  const answer = row.correctAnswer ?? row.answerKey;
  const answerKeys = Array.isArray(answer) ? answer.filter((x) => String(x ?? "").trim().length > 0) : [];
  if (answerKeys.length < 1) reasons.push("ECG video question requires a correct answer.");
  if (!String(row.rationale ?? "").trim()) reasons.push("ECG video question requires rationale before publish.");
  if (!["basic", "advanced"].includes(String(row.level ?? ""))) {
    reasons.push("ECG video question level must be basic or advanced.");
  }
  if (!["lesson", "quiz", "drill"].includes(String(row.mode ?? ""))) {
    reasons.push("ECG video question mode must be lesson, quiz, or drill.");
  }

  const exhibit = parseEcgVideoExhibit(row.exhibitData, row.images);
  const deterministicMediaType = row.mediaType === ECG_LIVE_STRIP_MEDIA_TYPE || exhibit?.mediaType === ECG_LIVE_STRIP_MEDIA_TYPE;
  if (!exhibit && !deterministicMediaType) {
    reasons.push("ECG video question requires a deterministic ECG strip mediaConfig or reviewed video asset.");
  } else if (deterministicMediaType && !row.mediaConfig && !exhibit?.mediaConfig) {
    reasons.push("ECG live strip question requires deterministic mediaConfig.");
  } else if (exhibit) {
    const mime = exhibit.asset.mimeType?.toLowerCase();
    if (!deterministicMediaType && mime && !SUPPORTED_MIME.has(mime)) reasons.push(`Unsupported ECG video MIME type: ${mime}.`);
    if (exhibit && !exhibit.rhythmCategory.trim()) reasons.push("ECG video question requires an ECG rhythm/category.");
    if (!deterministicMediaType && exhibit && !exhibit.asset.alt?.trim() && !exhibit.asset.caption?.trim()) {
      warnings.push("Add accessible ECG clip alt text or caption for learners who cannot load video.");
    }
  }

  const linkedLesson =
    exhibit?.linkedLesson?.href ||
    exhibit?.linkedLesson?.slug ||
    (row.studyLinkPathwayId && row.studyLinkLessonSlug ? `${row.studyLinkPathwayId}/${row.studyLinkLessonSlug}` : "");
  if (!linkedLesson) reasons.push("ECG video question requires a linked ECG lesson before publish.");

  return { ok: reasons.length === 0, reasons, warnings };
}
