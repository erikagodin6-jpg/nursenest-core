/**
 * Progress logging for imports: counts and file names only — no stems, rationales, or answers.
 */
export function logImportProgressLine(
  phase: string,
  meta: { file?: string; processed?: number; pendingBatch?: number; inserted?: number; skipped?: number },
): void {
  const parts = [`[${phase}]`];
  if (meta.file) parts.push(`file=${meta.file}`);
  if (meta.processed !== undefined) parts.push(`processed=${meta.processed}`);
  if (meta.inserted !== undefined) parts.push(`inserted=${meta.inserted}`);
  if (meta.skipped !== undefined) parts.push(`skipped=${meta.skipped}`);
  if (meta.pendingBatch !== undefined) parts.push(`pendingBatch=${meta.pendingBatch}`);
  console.log(parts.join(" "));
}

/** Truncate any user-facing error for reports (avoid echoing full stems). */
export function truncateImportMessage(msg: string, max = 240): string {
  const t = msg.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}
