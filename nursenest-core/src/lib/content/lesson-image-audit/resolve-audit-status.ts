import type { LessonImageResolution, LessonImageSource } from "@/lib/content/resolve-lesson-image";
import {
  findInventoryObjectKeyForBasename,
  lessonImageBasenameFromObjectKey,
  normalizeLessonImageBasename,
  resolveInventoryLessonImageKey,
} from "@/lib/content/lesson-image-inventory-match";
import { getInventoryKeys } from "@/lib/education-images/inventory";
import type { LessonImageAuditStatus } from "@/lib/content/lesson-image-audit/types";

const FALLBACK_SOURCES: LessonImageSource[] = [
  "topic_slug",
  "map_keyword",
  "map_body_system",
  "clinical_illustration",
];

const EXACT_SOURCES: LessonImageSource[] = ["override", "map_slug", "exact_slug"];

export function inventoryFilenameFromObjectKey(objectKey: string | null): string | null {
  if (!objectKey) return null;
  const base = lessonImageBasenameFromObjectKey(objectKey);
  const ext = objectKey.match(/\.[^.]+$/)?.[0] ?? ".webp";
  return `${base}${ext}`;
}

export function scoreImageQuality(args: {
  source: LessonImageSource;
  objectKey: string | null;
  inventoryFuzzy: boolean;
  status: LessonImageAuditStatus;
}): number {
  if (args.status === "no_image") return 0;
  if (args.status === "low_quality_image") return 32;

  let score = 55;
  if (EXACT_SOURCES.includes(args.source) && !args.inventoryFuzzy) score = 92;
  if (args.source === "exact_slug" && args.inventoryFuzzy) score = 72;
  if (FALLBACK_SOURCES.includes(args.source)) score = 48;

  const key = args.objectKey?.toLowerCase() ?? "";
  if (key.endsWith(".avif") || key.endsWith(".webp")) score += 6;
  if (key.endsWith(".jpg") || key.endsWith(".jpeg")) score -= 8;
  if (args.source === "map_body_system") score -= 15;

  return Math.min(100, Math.max(0, score));
}

export function resolveLessonImageAuditStatus(args: {
  resolution: LessonImageResolution;
  slug: string;
  title?: string | null;
  topicSlug?: string | null;
  inventoryKeys?: readonly string[];
}): {
  status: LessonImageAuditStatus;
  inventoryFuzzy: boolean;
  fallbackSourceUsed: string | null;
} {
  const { resolution, slug, title, topicSlug } = args;
  const inventoryKeys = args.inventoryKeys ?? getInventoryKeys();

  if (resolution.source === "none" || !resolution.url) {
    return { status: "no_image", inventoryFuzzy: false, fallbackSourceUsed: null };
  }

  let inventoryFuzzy = false;
  if (resolution.source === "exact_slug" || resolution.source === "topic_slug") {
    const semantic = resolveInventoryLessonImageKey(
      { slug, title, topicSlug },
      inventoryKeys,
    );
    inventoryFuzzy = semantic?.fuzzy ?? false;
    const directSlug = findInventoryObjectKeyForBasename(
      normalizeLessonImageBasename(slug),
      inventoryKeys,
    );
    if (directSlug && resolution.objectKey === directSlug) {
      inventoryFuzzy = false;
    }
  }

  let status: LessonImageAuditStatus;
  if (inventoryFuzzy) {
    status = "fuzzy_match";
  } else if (EXACT_SOURCES.includes(resolution.source)) {
    status = "exact_match";
  } else if (FALLBACK_SOURCES.includes(resolution.source)) {
    status = "fallback_match";
  } else {
    status = "exact_match";
  }

  const key = resolution.objectKey?.toLowerCase() ?? "";
  const isLegacyRaster =
    key.endsWith(".jpg") ||
    key.endsWith(".jpeg") ||
    (resolution.source === "map_body_system" && !key.endsWith(".webp"));

  if (isLegacyRaster) {
    status = "low_quality_image";
  }

  const fallbackSourceUsed = FALLBACK_SOURCES.includes(resolution.source)
    ? resolution.source
    : null;

  return { status, inventoryFuzzy, fallbackSourceUsed };
}
