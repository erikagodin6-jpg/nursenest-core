import type { Prisma } from "@prisma/client";

export type BlogAdminPublishLogLevel = "info" | "warn" | "error";

export type BlogAdminPublishLogEntry = {
  at: string;
  level: BlogAdminPublishLogLevel;
  event: string;
  message: string;
  detail?: Record<string, unknown>;
};

const MAX_LOG_ENTRIES = 200;

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

/** Parse stored JSON into a bounded array of log rows (invalid → empty). */
export function parseBlogAdminPublishLog(existing: unknown): BlogAdminPublishLogEntry[] {
  if (!Array.isArray(existing)) return [];
  const out: BlogAdminPublishLogEntry[] = [];
  for (const row of existing) {
    if (!isRecord(row)) continue;
    const at = typeof row.at === "string" ? row.at : "";
    const level = row.level === "warn" || row.level === "error" ? row.level : "info";
    const event = typeof row.event === "string" ? row.event.slice(0, 80) : "unknown";
    const message = typeof row.message === "string" ? row.message.slice(0, 2000) : "";
    if (!at || !message) continue;
    const detail = isRecord(row.detail) ? row.detail : undefined;
    out.push(detail ? { at, level, event, message, detail } : { at, level, event, message });
  }
  return out;
}

export function appendBlogAdminPublishLog(
  existing: unknown,
  entry: Omit<BlogAdminPublishLogEntry, "at"> & { at?: string },
): Prisma.InputJsonValue {
  const prev = parseBlogAdminPublishLog(existing);
  const row: BlogAdminPublishLogEntry = {
    at: entry.at ?? new Date().toISOString(),
    level: entry.level ?? "info",
    event: entry.event.slice(0, 80),
    message: entry.message.slice(0, 2000),
    ...(entry.detail ? { detail: entry.detail } : {}),
  };
  return [...prev, row].slice(-MAX_LOG_ENTRIES) as unknown as Prisma.InputJsonValue;
}

export function appendBlogAdminPublishLogMany(
  existing: unknown,
  entries: (Omit<BlogAdminPublishLogEntry, "at"> & { at?: string })[],
): Prisma.InputJsonValue {
  let cur: unknown = existing;
  for (const e of entries) {
    cur = appendBlogAdminPublishLog(cur, e);
  }
  return cur as Prisma.InputJsonValue;
}

/** Initial log payload for brand-new posts (single event). */
export function seedBlogAdminPublishLog(event: string, message: string): Prisma.InputJsonValue {
  return appendBlogAdminPublishLog([], { level: "info", event, message });
}
