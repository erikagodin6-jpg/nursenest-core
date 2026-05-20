/**
 * Phase 14A — **Session handoff architecture** for native or embedded shells (types only).
 *
 * Conceptually aligns with `src/lib/mobile-native/auth-session-handoff.ts`:
 * - Prefer short-lived, server-minted handoff material over copying long-lived secrets into native stores.
 * - Post-handoff session handles remain opaque to app business logic; re-validation uses the same
 *   server-trusted paths as web.
 *
 * This module does **not** import `auth-session-handoff.ts` to avoid pulling auth wiring into
 * type-only barrels; names mirror that file where overlap exists.
 */

/** Opaque server-issued continuation (not a password, not a refresh token). */
export type MobileSessionHandoffToken = string;

/**
 * Envelope moving session establishment from web bootstrap into a native WebView or shell.
 * Field names parallel `MobileNativeSessionHandoffPayload` in auth-session-handoff.
 */
export type MobileSessionEnvelope = {
  readonly handoffToken: MobileSessionHandoffToken;
  readonly expiresAtMs: number;
  /** Telemetry hint only — never used for authorization. */
  readonly environment?: "production" | "staging" | "development";
  readonly issuedAtMs?: number;
};

/** Client-side holder after successful exchange (opaque to product features). */
export type MobileSessionOpaqueHandle = {
  readonly kind: "opaque_mobile_session";
  readonly redactedFingerprint?: string;
};

/** Server-side record keying material (implementation-specific; type stub for planning). */
export type MobileSessionServerBindingRef = {
  readonly bindingKind: "user_id_plus_rotation_epoch";
  readonly opaqueRef: string;
};
