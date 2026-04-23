import "server-only";

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";

function snapshotBaseDir(): string | null {
  const raw = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  if (raw && raw.length > 0) return raw;
  return null;
}

export function studyPublishedSnapshotsConfigured(): boolean {
  return snapshotBaseDir() !== null;
}

export function snapshotAgeMs(capturedAtIso: string): number {
  const t = Date.parse(capturedAtIso);
  if (!Number.isFinite(t)) return -1;
  return Math.max(0, Date.now() - t);
}

function isEnvelope<T>(raw: unknown): raw is StudyPublishedSnapshotEnvelope<T> {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  return (
    o.schema === "nursenest.study_snapshot.v1" &&
    typeof o.surface === "string" &&
    typeof o.version === "string" &&
    typeof o.capturedAt === "string" &&
    "payload" in o
  );
}

/**
 * Read a published snapshot JSON file from {@link process.env.STUDY_PUBLISHED_SNAPSHOT_DIR}.
 * Returns null when unset, missing file, invalid envelope, or IO error (caller may try primary-only error path).
 */
export async function readStudyPublishedSnapshotFile<TPayload>(
  relativePathSegments: string[],
): Promise<StudyPublishedSnapshotEnvelope<TPayload> | null> {
  const base = snapshotBaseDir();
  if (!base) return null;
  const filePath = path.join(base, ...relativePathSegments);
  if (!filePath.startsWith(path.resolve(base))) {
    return null;
  }
  try {
    const txt = await readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(txt) as unknown;
    if (!isEnvelope<TPayload>(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function stableListOptsKey(listOpts: { q?: string; topicSlugsIn?: string[] } | undefined): string {
  if (!listOpts) return "all";
  const q = (listOpts.q ?? "").trim().toLowerCase();
  const topics = [...(listOpts.topicSlugsIn ?? [])].map((s) => s.trim().toLowerCase()).filter(Boolean).sort();
  const raw = JSON.stringify({ q, topics });
  if (raw.length <= 64) return raw.replace(/[^a-z0-9_-]+/gi, "_").slice(0, 64) || "all";
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}
