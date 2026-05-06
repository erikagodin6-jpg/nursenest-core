/**
 * Low-volume, deduped stderr diagnostics for client-only code paths (no server logger).
 * Values must be non-PII (pathway/test ids and HTTP metadata only).
 */
const PREFIX = "[nursenest-core]";
const DEDUPE_MS = 30_000;
const recent = new Map<string, number>();

const EMAIL_LIKE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const ABS_URL = /\bhttps?:\/\/[^\s"'<>]+/gi;

function prune(now: number): void {
  if (recent.size <= 200) return;
  for (const [k, t] of recent) {
    if (now - t > DEDUPE_MS) recent.delete(k);
  }
}

export type ClientDiagnosticMeta = Record<string, string | number | boolean | null | undefined>;

const SENSITIVE_META_KEYS =
  /^(email|mail|token|authorization|cookie|password|secret|jwt|bearer|set-cookie|api[_-]?key)$/i;

function redactString(s: string): string {
  let out = s.replace(ABS_URL, "[url:redacted]");
  if (EMAIL_LIKE.test(out)) out = "[redacted]";
  if (out.length > 240) out = `${out.slice(0, 240)}…`;
  return out;
}

/** Best-effort meta sanitizer so diagnostics never echo raw emails, tokens, or absolute URLs. */
export function sanitizeClientDiagnosticMeta(meta?: ClientDiagnosticMeta): ClientDiagnosticMeta | undefined {
  if (!meta) return undefined;
  const out: ClientDiagnosticMeta = {};
  for (const [k, v] of Object.entries(meta)) {
    if (SENSITIVE_META_KEYS.test(k)) {
      out[k] = "[redacted]";
      continue;
    }
    if (v == null || typeof v === "number" || typeof v === "boolean") {
      out[k] = v as number | boolean | null | undefined;
      continue;
    }
    if (typeof v === "string") {
      out[k] = redactString(v);
    }
  }
  return out;
}

/**
 * One line per dedupe window per unique `scope:event:key` (key is caller-supplied discriminator).
 */
export function logDedupedClientDiagnostic(
  scope: string,
  event: string,
  dedupeKey: string,
  meta?: ClientDiagnosticMeta,
): void {
  const mapKey = `${scope}:${event}:${dedupeKey}`;
  const now = Date.now();
  const prev = recent.get(mapKey);
  if (prev != null && now - prev < DEDUPE_MS) return;
  recent.set(mapKey, now);
  prune(now);
  const safe = sanitizeClientDiagnosticMeta(meta);
  const tail = safe && Object.keys(safe).length > 0 ? ` ${JSON.stringify(safe)}` : "";
  console.error(`${PREFIX} client_diagnostic ${scope} ${event}${tail}`);
}
