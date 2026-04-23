/**
 * Export a marketing pathway lessons hub page to the published snapshot store (for DB failover).
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots npx tsx scripts/study-snapshots/export-pathway-lessons-hub-snapshot.mts <pathwayId> <locale> <page> <pageSize> [listOptsJson]
 *
 * Run after content publish / in CI so secondary mirrors primary.
 */
import "../stub-server-only.cjs";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import { getPathwayLessonsPageFresh } from "../../src/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonsPageResult } from "../../src/lib/lessons/pathway-lesson-loader";

function stableListOptsKey(listOpts: { q?: string; topicSlugsIn?: string[] } | undefined): string {
  if (!listOpts) return "all";
  const q = (listOpts.q ?? "").trim().toLowerCase();
  const topics = [...(listOpts.topicSlugsIn ?? [])].map((s) => s.trim().toLowerCase()).filter(Boolean).sort();
  const raw = JSON.stringify({ q, topics });
  if (raw.length <= 64) return raw.replace(/[^a-z0-9_-]+/gi, "_").slice(0, 64) || "all";
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

async function main(): Promise<void> {
  const [, , pathwayId, locale, pageStr, sizeStr, listOptsRaw] = process.argv;
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  if (!baseDir) {
    console.error("STUDY_PUBLISHED_SNAPSHOT_DIR is required");
    process.exit(1);
  }
  if (!pathwayId || !locale || !pageStr || !sizeStr) {
    console.error(
      "Usage: export-pathway-lessons-hub-snapshot.mts <pathwayId> <locale> <page> <pageSize> [listOptsJson]",
    );
    process.exit(1);
  }
  const pageRequested = Math.max(1, Number(pageStr) || 1);
  const pageSizeRequested = Math.max(8, Number(sizeStr) || 24);
  const listOpts =
    listOptsRaw && listOptsRaw !== "undefined"
      ? (JSON.parse(listOptsRaw) as { q?: string; topicSlugsIn?: string[] })
      : undefined;

  const payload = await getPathwayLessonsPageFresh(pathwayId, pageRequested, pageSizeRequested, locale, listOpts);
  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<PathwayLessonsPageResult> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "pathway_lessons_hub",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const optsKey = stableListOptsKey(listOpts);
  const relDir = path.join(baseDir, "lessons-hub", pathwayId, locale);
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, `p${pageRequested}-s${pageSizeRequested}-${optsKey}.json`);
  await writeFile(filePath, JSON.stringify(envelope, null, 2), "utf8");
  console.log(`Wrote ${filePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
