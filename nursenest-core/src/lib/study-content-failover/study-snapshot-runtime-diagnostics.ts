import "server-only";

import { access, readdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { constants as fsConstants } from "node:fs";

import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

function snapshotDirFromEnv(): string | null {
  const raw = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  return raw && raw.length > 0 ? raw : null;
}

export function isStudyFailoverRequired(): boolean {
  return process.env.STUDY_FAILOVER_REQUIRED?.trim() === "1";
}

let loggedMissingSnapshotDir = false;

/**
 * When `STUDY_FAILOVER_REQUIRED=1` but no snapshot directory is configured, fail loudly once per process.
 * Invoked from {@link readStudyPublishedSnapshotFile} when a secondary read is attempted without a base dir.
 */
export function noteStudyPublishedSnapshotReadAttemptWithoutDir(): void {
  if (!isStudyFailoverRequired()) return;
  if (loggedMissingSnapshotDir) return;
  loggedMissingSnapshotDir = true;
  safeServerLogCritical("study_failover", "study_published_snapshot_dir_missing", {
    event: "study_published_snapshot_dir_missing",
    STUDY_FAILOVER_REQUIRED: "1",
    STUDY_PUBLISHED_SNAPSHOT_DIR: "unset_or_empty",
  });
}

export type StudyPublishedSnapshotDirProbe = {
  configured: boolean;
  failoverRequired: boolean;
  path: string | null;
  readable: boolean;
  readError?: string;
  manifestLastRefreshedAt: string | null;
};

export async function readStudySnapshotManifestLastRefreshedAt(): Promise<string | null> {
  const base = snapshotDirFromEnv();
  if (!base) return null;
  try {
    const txt = await readFile(path.join(base, "manifest.json"), "utf8");
    const raw: unknown = JSON.parse(txt) as unknown;
    if (!raw || typeof raw !== "object") return null;
    const last = (raw as Record<string, unknown>).lastRefreshedAt;
    return typeof last === "string" && last.length > 0 ? last : null;
  } catch {
    return null;
  }
}

export async function probeStudyPublishedSnapshotDir(): Promise<StudyPublishedSnapshotDirProbe> {
  const failoverRequired = isStudyFailoverRequired();
  const base = snapshotDirFromEnv();
  if (!base) {
    return {
      configured: false,
      failoverRequired,
      path: null,
      readable: false,
      manifestLastRefreshedAt: null,
    };
  }
  const resolved = path.resolve(base);
  let readable = false;
  let readError: string | undefined;
  try {
    await access(resolved, fsConstants.R_OK);
    readable = true;
  } catch (e) {
    readError = e instanceof Error ? e.message.slice(0, 240) : String(e).slice(0, 240);
  }
  const manifestLastRefreshedAt = readable ? await readStudySnapshotManifestLastRefreshedAt() : null;
  return {
    configured: true,
    failoverRequired,
    path: resolved,
    readable,
    readError,
    manifestLastRefreshedAt,
  };
}

export type StudyPublishedSnapshotSurfaceHealth = {
  /** Relative paths under snapshot root (posix-style for display). */
  topLevelDirs: string[];
  jsonFileCount: number;
  /** Max mtime among sampled JSON files (ms since epoch). */
  newestJsonMtimeMs: number | null;
  newestSnapshotAgeMs: number | null;
};

const EXPECTED_TOP_LEVEL = ["lessons-hub", "flashcards", "practice-tests", "practice-exams"] as const;

async function collectJsonStats(
  root: string,
  opts: { maxFiles: number; maxDepth: number },
): Promise<{ count: number; newestMtimeMs: number | null }> {
  let count = 0;
  let newestMtimeMs: number | null = null;
  const { stat } = await import("node:fs/promises");

  async function walk(dir: string, depth: number): Promise<void> {
    if (count >= opts.maxFiles || depth > opts.maxDepth) return;
    let entries: Awaited<ReturnType<typeof readdir>>;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      if (count >= opts.maxFiles) return;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        await walk(full, depth + 1);
      } else if (ent.isFile() && ent.name.endsWith(".json") && ent.name !== "manifest.json") {
        count += 1;
        try {
          const s = await stat(full);
          const t = s.mtimeMs;
          if (Number.isFinite(t) && (newestMtimeMs === null || t > newestMtimeMs)) newestMtimeMs = t;
        } catch {
          /* ignore */
        }
      }
    }
  }

  await walk(root, 0);
  return { count, newestMtimeMs: newestMtimeMs };
}

/**
 * Bounded filesystem scan for ops/admin (does not parse every JSON body).
 */
export async function runStudyPublishedSnapshotHealthScan(params?: {
  maxFiles?: number;
  maxDepth?: number;
}): Promise<{
  probe: StudyPublishedSnapshotDirProbe;
  aggregate: StudyPublishedSnapshotSurfaceHealth;
  missingExpectedTopLevel: string[];
}> {
  const probe = await probeStudyPublishedSnapshotDir();
  if (!probe.configured || !probe.readable || !probe.path) {
    return {
      probe,
      aggregate: {
        topLevelDirs: [],
        jsonFileCount: 0,
        newestJsonMtimeMs: null,
        newestSnapshotAgeMs: null,
      },
      missingExpectedTopLevel: [...EXPECTED_TOP_LEVEL],
    };
  }

  const root = probe.path;
  let topLevelDirs: string[] = [];
  try {
    const dirents = await readdir(root, { withFileTypes: true });
    topLevelDirs = dirents.filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    topLevelDirs = [];
  }

  const maxFiles = params?.maxFiles ?? 400;
  const maxDepth = params?.maxDepth ?? 6;
  const { count, newestMtimeMs } = await collectJsonStats(root, { maxFiles, maxDepth });
  const newestSnapshotAgeMs =
    newestMtimeMs != null && Number.isFinite(newestMtimeMs) ? Math.max(0, Date.now() - newestMtimeMs) : null;

  const missingExpectedTopLevel = EXPECTED_TOP_LEVEL.filter((name) => !topLevelDirs.includes(name));

  return {
    probe,
    aggregate: {
      topLevelDirs,
      jsonFileCount: count,
      newestJsonMtimeMs: newestMtimeMs,
      newestSnapshotAgeMs,
    },
    missingExpectedTopLevel,
  };
}

/** One-time boot line + critical alert when failover is required but the directory is missing or unreadable. */
export async function logStudyPublishedSnapshotStartupDiagnostics(): Promise<void> {
  const probe = await probeStudyPublishedSnapshotDir();
  safeServerLog("study_failover", "study_snapshot_boot_diagnostics", {
    event: "study_snapshot_boot_diagnostics",
    snapshot_dir_configured: String(probe.configured),
    snapshot_dir_readable: String(probe.readable),
    failover_required: String(probe.failoverRequired),
    manifest_last_refreshed_at: probe.manifestLastRefreshedAt ?? "",
  });
  if (probe.failoverRequired && (!probe.configured || !probe.readable)) {
    safeServerLogCritical("study_failover", "study_snapshot_boot_misconfigured", {
      event: "study_snapshot_boot_misconfigured",
      STUDY_FAILOVER_REQUIRED: "1",
      snapshot_dir_configured: String(probe.configured),
      snapshot_dir_readable: String(probe.readable),
      read_error: probe.readError ?? "",
    });
  }
}
