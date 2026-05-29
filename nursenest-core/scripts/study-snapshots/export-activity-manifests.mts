/**
 * Export learner activity manifests used by instant-load startup.
 *
 * These manifests are intentionally metadata-only. They describe the activity
 * surfaces, cache keys, and prefetch targets for each learner pathway so hubs
 * can load navigation/availability without assembling full catalogs.
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import {
  activityManifestCacheKey,
  activityManifestSnapshotPath,
  buildActivityManifest,
  type ActivityManifest,
  type InstantLoadPathway,
} from "../../src/lib/performance/instant-load-architecture";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";
import {
  uploadSnapshotToSpaces,
  spacesConfigured,
} from "./lib/s3-snapshot-uploader.mts";
import { writeManifestToRedis, redisConfigured } from "./lib/redis-manifest-writer.mts";

const TARGETS: readonly InstantLoadPathway[] = ["rn", "rpn", "np", "allied", "newgrad", "prenursing"];

function filenameFor(pathway: InstantLoadPathway): string {
  return activityManifestSnapshotPath(pathway).at(-1) ?? `${pathway}-manifest.json`;
}

async function exportActivityManifest(
  pathway: InstantLoadPathway,
  baseDir: string,
): Promise<{ filePath: string; payload: ActivityManifest }> {
  const payload = buildActivityManifest({ pathway });
  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<ActivityManifest> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "activity_manifest",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const relDir = path.join(baseDir, "activity-manifests");
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, filenameFor(pathway));
  await writeFile(filePath, JSON.stringify(envelope), "utf8");
  return { filePath, payload };
}

async function main(): Promise<void> {
  const { tmpdir } = await import("node:os");
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim() || tmpdir();
  const useSpaces = spacesConfigured();
  const useRedis = redisConfigured();

  let ok = 0;
  let failed = 0;

  for (const pathway of TARGETS) {
    try {
      const { filePath, payload } = await exportActivityManifest(pathway, baseDir);
      console.log(`[activity-manifests] ${pathway} -> ${filePath}`);
      ok++;

      if (useSpaces) {
        await uploadSnapshotToSpaces(filePath, `activity-manifests/${filenameFor(pathway)}`);
      }
      if (useRedis) {
        await writeManifestToRedis(activityManifestCacheKey(pathway, payload.pathwayId), payload);
      }
    } catch (error) {
      console.error(`[activity-manifests] FAILED ${pathway}:`, error);
      failed++;
    }
  }

  await touchStudySnapshotManifest(baseDir, "activity_manifest");
  console.log(`\n[activity-manifests] Done: ${ok} exported, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error("[activity-manifests] Fatal:", error);
  process.exit(1);
});

