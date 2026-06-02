/**
 * Phase 11 — public/developer API **versioning contracts** (no HTTP router).
 *
 * URL path prefix strategy remains a product decision; these constants support header-based negotiation later.
 *
 * See reports/phase-11-developer-platform.md
 */

export const NurseNestApiVersion = {
  v0InternalOnly: "0",
  v1DeveloperPreview: "1",
} as const;

export type NurseNestApiVersion = (typeof NurseNestApiVersion)[keyof typeof NurseNestApiVersion];

/** Request header name for explicit API version (never trust without server allowlist). */
export const NURSE_NEST_API_VERSION_HEADER = "x-nursenest-api-version" as const;
