/**
 * Guardrails for static i18n JSON size and content shape.
 * Long-form educational copy belongs in DB/CMS/pathway JSON — not in flat UI translation maps.
 */

/** Values longer than this are flagged in `npm run i18n:audit-payload` (not a hard compile error). */
export const I18N_PAYLOAD_LONG_VALUE_CHARS = 400;

/** Prefix families that should be UI chrome / short labels only (audit lists offenders). */
export const I18N_CONTENT_HEAVY_PREFIXES = [
  "lessons.lesson.",
  "lessons.sys.",
  "data.pre_nursing",
  "data.",
] as const;
