import "server-only";

import { classifyDatabaseFallbackKind, isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type BlogPublicDbReadAttemptResult<T> =
  | { ok: true; value: T }
  | { ok: false; kind: string; reason: string };

/**
 * Public blog list/detail paths: distinguish **successful empty** Prisma results from **timeouts,
 * auth failures, or other errors** that must not be surfaced as an empty library.
 */
export async function blogPublicDbReadAttempt<T>(
  label: string,
  run: () => Promise<T>,
  timeoutMs: number,
): Promise<BlogPublicDbReadAttemptResult<T>> {
  if (!isDatabaseUrlConfigured()) {
    return { ok: false, kind: "db_missing_url", reason: "DATABASE_URL is not configured" };
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const value = await Promise.race([
      run(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("database_timeout")), timeoutMs);
      }),
    ]);
    return { ok: true, value };
  } catch (e) {
    const kind = classifyDatabaseFallbackKind(e);
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("blog", "blog_public_db_read_failed", {
      label,
      kind,
      message: message.slice(0, 500),
    });
    return { ok: false, kind, reason: message.slice(0, 400) };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
