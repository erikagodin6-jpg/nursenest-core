import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Updates root `manifest.json` under the snapshot dir (best-effort; never throws to callers).
 */
export async function touchStudySnapshotManifest(baseDir: string, surface: string): Promise<void> {
  const manifestPath = path.join(baseDir, "manifest.json");
  let prev: Record<string, unknown> = {};
  try {
    prev = JSON.parse(await readFile(manifestPath, "utf8")) as Record<string, unknown>;
  } catch {
    prev = {};
  }
  const next = {
    schema: "nursenest.study_snapshot_manifest.v1",
    lastRefreshedAt: new Date().toISOString(),
    lastSurface: surface,
    ...prev,
  };
  try {
    await writeFile(manifestPath, JSON.stringify(next, null, 2), "utf8");
  } catch {
    /* ignore manifest write failures */
  }
}
