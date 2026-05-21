import type {
  DuplicateImageOpportunity,
  LessonImageAuditRow,
} from "@/lib/content/lesson-image-audit/types";

function groupKey(row: LessonImageAuditRow): string | null {
  if (row.matchedObjectKey) return `object:${row.matchedObjectKey}`;
  if (row.sharedVisualSystemId) return `system:${row.sharedVisualSystemId}`;
  return null;
}

export function assignDuplicateGroupIds(rows: LessonImageAuditRow[]): LessonImageAuditRow[] {
  const buckets = new Map<string, LessonImageAuditRow[]>();

  for (const row of rows) {
    const key = groupKey(row);
    if (!key) continue;
    const list = buckets.get(key) ?? [];
    list.push(row);
    buckets.set(key, list);
  }

  let groupIndex = 0;
  const duplicateGroupByKey = new Map<string, string>();

  for (const [key, members] of buckets) {
    if (members.length < 2) continue;
    groupIndex += 1;
    duplicateGroupByKey.set(key, `dup-${groupIndex.toString().padStart(4, "0")}`);
  }

  return rows.map((row) => {
    const key = groupKey(row);
    const duplicateGroupId = key ? (duplicateGroupByKey.get(key) ?? null) : null;
    const status =
      duplicateGroupId && row.status !== "no_image" && row.status !== "low_quality_image"
        ? ("duplicate_image_candidate" as const)
        : row.status;
    return { ...row, duplicateGroupId, status };
  });
}

export function buildDuplicateOpportunities(rows: LessonImageAuditRow[]): DuplicateImageOpportunity[] {
  const byGroup = new Map<string, LessonImageAuditRow[]>();
  for (const row of rows) {
    if (!row.duplicateGroupId) continue;
    const list = byGroup.get(row.duplicateGroupId) ?? [];
    list.push(row);
    byGroup.set(row.duplicateGroupId, list);
  }

  const out: DuplicateImageOpportunity[] = [];

  for (const [duplicateGroupId, members] of byGroup) {
    const first = members[0]!;
    const sharedVisualSystemId = first.sharedVisualSystemId ?? "shared_asset";
    const objectKey = first.matchedObjectKey;
    const recommendation = objectKey
      ? `Reuse or modularize existing asset ${objectKey} across ${members.length} lessons; consider variant labels only.`
      : `Build one modular ${sharedVisualSystemId} illustration system for ${members.length} related lessons.`;

    out.push({
      duplicateGroupId,
      sharedVisualSystemId,
      matchedObjectKey: objectKey,
      recommendedFilename: first.recommendedFilename,
      lessonCount: members.length,
      lessonSlugs: members.map((m) => m.lessonSlug),
      pathwayIds: [...new Set(members.map((m) => m.pathwayId))],
      titles: members.map((m) => m.lessonTitle),
      recommendation,
    });
  }

  return out.sort((a, b) => b.lessonCount - a.lessonCount || a.duplicateGroupId.localeCompare(b.duplicateGroupId));
}
