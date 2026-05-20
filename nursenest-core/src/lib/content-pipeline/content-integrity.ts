import { createHash } from "node:crypto";

/**
 * Stable JSON for hashing: sorted keys recursively so diffs and integrity checks are deterministic.
 */
export function canonicalStringify(value: unknown): string {
  return JSON.stringify(value, canonicalReplacer);
}

function canonicalReplacer(_key: string, v: unknown): unknown {
  if (v !== null && typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const k of Object.keys(o).sort()) {
      sorted[k] = o[k];
    }
    return sorted;
  }
  return v;
}

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export function contentIntegritySha256(payload: unknown): string {
  return sha256Hex(canonicalStringify(payload));
}
