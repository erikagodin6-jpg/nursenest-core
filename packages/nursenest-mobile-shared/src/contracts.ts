/**
 * Metro-safe mirror of `nursenest-core/src/lib/mobile-native/api-boundary.ts` and
 * `auth-session-handoff.ts` / `engagement-analytics-events.ts`.
 * Source of truth for semantics stays in the Next.js app; update mirrors intentionally.
 */

export type MobileNativeHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type MobileNativeApiOperationId = string;

export type MobileNativeRequestHeaders = Readonly<Record<string, string>>;

export type MobileNativePreparedRequest = {
  readonly operationId: MobileNativeApiOperationId;
  readonly method: MobileNativeHttpMethod;
  readonly path: string;
  readonly headers?: MobileNativeRequestHeaders;
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

export type MobileNativeApiClient = {
  readonly executeJson: <T>(req: MobileNativePreparedRequest) => Promise<MobileNativeApiResult<T>>;
};

export type MobileNativeSessionHandoffToken = string;

export type MobileNativeSessionHandoffPayload = {
  readonly expiresAtMs: number;
  readonly handoffToken: MobileNativeSessionHandoffToken;
  readonly environment?: "production" | "staging" | "development";
};

export type MobileNativePostHandoffSessionHandle = {
  readonly kind: "opaque_native_session";
  readonly redactedFingerprint?: string;
};

export type MobileNativeEngagementEventName =
  | "engagement.session_start"
  | "engagement.session_end"
  | "engagement.streak_increment"
  | "engagement.dal_checkpoint"
  | "engagement.return_day_n";

export type MobileNativeEngagementBaseProps = {
  readonly pathwayId?: string;
  readonly surface: "dashboard" | "lessons" | "flashcards" | "practice" | "cat" | "account" | "other";
  readonly clientTimestampMs: number;
};

export type MobileNativeEngagementEvent =
  | (MobileNativeEngagementBaseProps & { readonly name: "engagement.session_start" })
  | (MobileNativeEngagementBaseProps & { readonly name: "engagement.session_end"; readonly durationMs: number })
  | (MobileNativeEngagementBaseProps & {
      readonly name: "engagement.streak_increment";
      readonly streakLengthDays: number;
    })
  | (MobileNativeEngagementBaseProps & { readonly name: "engagement.dal_checkpoint"; readonly dayIndex: number })
  | (MobileNativeEngagementBaseProps & { readonly name: "engagement.return_day_n"; readonly n: number });
