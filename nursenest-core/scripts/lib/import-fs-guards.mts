import { statSync } from "node:fs";

/** Refuse to read unexpectedly huge legacy TS/JSON sources into memory in one shot. */
export const MAX_LEGACY_IMPORT_SOURCE_FILE_BYTES = 64 * 1024 * 1024;

export function assertSourceFileBounded(absPath: string, maxBytes = MAX_LEGACY_IMPORT_SOURCE_FILE_BYTES): void {
  const st = statSync(absPath, { throwIfNoEntry: true });
  if (!st.isFile()) throw new Error(`Not a file: ${absPath}`);
  if (st.size > maxBytes) {
    throw new Error(
      `File too large for legacy import (${st.size} bytes > ${maxBytes}). Split the source, use JSONL, or raise MAX_LEGACY_IMPORT_SOURCE_FILE_BYTES intentionally.`,
    );
  }
}
