/**
 * Strip patterns that are risky in learner-facing text (overlay display only).
 * Does not replace HTML escaping in React — this is an extra guard for imports.
 */
const SCRIPT_OR_HANDLER = /<script\b|javascript:\s*|on\w+\s*=/i;

export function sanitizeEducationalOverlayStrings(value: unknown, path: string): { ok: true; value: unknown } | { ok: false; path: string; reason: string } {
  if (value === null || value === undefined) return { ok: true, value };
  if (typeof value === "string") {
    if (SCRIPT_OR_HANDLER.test(value)) {
      return { ok: false, path, reason: "disallowed_pattern_in_string" };
    }
    return { ok: true, value };
  }
  if (typeof value === "number" || typeof value === "boolean") return { ok: true, value };
  if (Array.isArray(value)) {
    const out: unknown[] = [];
    for (let i = 0; i < value.length; i++) {
      const r = sanitizeEducationalOverlayStrings(value[i], `${path}[${i}]`);
      if (!r.ok) return r;
      out.push(r.value);
    }
    return { ok: true, value: out };
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) {
      const r = sanitizeEducationalOverlayStrings(v, `${path}.${k}`);
      if (!r.ok) return r;
      out[k] = r.value;
    }
    return { ok: true, value: out };
  }
  return { ok: true, value };
}
