/**
 * Phase 9 — shared **API client boundary** types for web, future native shells, and sync workers.
 * Framework-agnostic: consumers map these to fetch/URLSession/OkHttp/etc.
 *
 * Do not embed secrets, refresh tokens, or entitlement proofs in URL query strings.
 */

/** HTTP verbs used by learner-facing JSON APIs (extend intentionally). */
export type MobileNativeHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Stable operation id for logging, retries, and offline queue dedupe (not a URL). */
export type MobileNativeApiOperationId = string;

export type MobileNativeRequestHeaders = Readonly<Record<string, string>>;

/**
 * Caller supplies auth via a hook (e.g. attach `Cookie`, `Authorization`, or native attestation);
 * this object must never include raw passwords or long-lived refresh tokens in persisted queues.
 */
export type MobileNativePreparedRequest = {
  readonly operationId: MobileNativeApiOperationId;
  readonly method: MobileNativeHttpMethod;
  /** Absolute or app-relative path; native clients resolve against configured API base. */
  readonly path: string;
  readonly headers?: MobileNativeRequestHeaders;
  /** Serialized body for JSON APIs; omit for GET. */
  readonly bodyJson?: unknown;
};

export type MobileNativeApiErrorKind =
  | "network"
  | "timeout"
  | "http_4xx"
  | "http_5xx"
  | "parse"
  | "entitlement"
  | "unknown";

export type MobileNativeApiResult<T> =
  | { readonly ok: true; readonly status: number; readonly data: T }
  | { readonly ok: false; readonly kind: MobileNativeApiErrorKind; readonly status?: number; readonly message: string };

/**
 * Boundary implemented by the host (web `fetch` wrapper, native URL session, test doubles).
 * Server remains authoritative for entitlements; clients treat 401/403 as non-retryable without re-auth.
 */
export type MobileNativeApiClient = {
  readonly executeJson: <T>(req: MobileNativePreparedRequest) => Promise<MobileNativeApiResult<T>>;
};
