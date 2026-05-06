/**
 * Phase 9 — **auth / session handoff** contract for native or embedded shells.
 *
 * - No secrets: do not pass `NEXTAUTH_SECRET`, refresh tokens, or service keys through this handoff.
 * - Short-lived, server-minted continuation is preferred over copying long-lived cookies into native stores.
 * - Re-validation: native apps must re-establish session through the same server-trusted paths as web.
 */

/** Opaque server-issued blob (e.g. encrypted JWT fragment or one-time exchange id). Not a password. */
export type MobileNativeSessionHandoffToken = string;

export type MobileNativeSessionHandoffPayload = {
  /** When the handoff expires (UTC ms). Native must discard after expiry. */
  readonly expiresAtMs: number;
  readonly handoffToken: MobileNativeSessionHandoffToken;
  /** Optional hint for telemetry only — never used for authorization decisions. */
  readonly environment?: "production" | "staging" | "development";
};

/**
 * After handoff, the native client holds only **opaque** session material issued by the auth server
 * (e.g. cookie jar managed by WebView, or native session tokens from your IdP SDK).
 * Mapping to concrete NextAuth / session tables stays server-side.
 */
export type MobileNativePostHandoffSessionHandle = {
  readonly kind: "opaque_native_session";
  /** Max length suggestion for logging; do not log token values in production. */
  readonly redactedFingerprint?: string;
};
