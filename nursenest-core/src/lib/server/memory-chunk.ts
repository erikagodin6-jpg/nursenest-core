/**
 * Helpers to avoid unbounded in-memory fan-out (large arrays, huge `id: { in: [...] }` batches).
 * Prefer DB-side pagination; use these when you must iterate client-side in chunks.
 */

/** Split `items` into slices of at most `chunkSize` (last slice may be smaller). */
export function chunkArray<T>(items: readonly T[], chunkSize: number): T[][] {
  const n = Math.max(1, Math.floor(chunkSize));
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += n) {
    out.push(items.slice(i, i + n) as T[]);
  }
  return out;
}

/** Run `fn` on each chunk sequentially (limits peak memory vs `Promise.all` on all rows). */
export async function forEachChunkAsync<T, R>(
  items: readonly T[],
  chunkSize: number,
  fn: (chunk: T[]) => Promise<R>,
): Promise<R[]> {
  const chunks = chunkArray(items, chunkSize);
  const results: R[] = [];
  for (const c of chunks) {
    results.push(await fn(c));
  }
  return results;
}
