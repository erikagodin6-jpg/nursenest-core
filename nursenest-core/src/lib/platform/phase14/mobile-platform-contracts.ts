/**
 * Phase 14A — Mobile / App Store **platform contracts** (types and stable literals only).
 *
 * Describes how a future native or embedded client declares platform identity, capability
 * surfaces, API compatibility expectations, and release channels — without prescribing
 * runtime SDKs or store submission mechanics.
 */

/** Client OS / shell family (not authorization). */
export type MobileClientPlatform =
  | "ios"
  | "android"
  | "web_embedded"
  | "desktop_web"
  | "unknown";

/**
 * Coarse product surface the mobile client is allowed to bind to.
 * Authorization still follows server session + DB entitlements.
 */
export type MobileCapabilitySurface =
  | "marketing_public"
  | "learner_app"
  | "admin_staff"
  | "internal_ops"
  | "cron_or_webhook_only";

/** Declared API contract tier the client was built against (telemetry / UX only). */
export type MobileApiCompatibility = {
  readonly declaredClientContractVersion: `${number}.${number}.${number}`;
  readonly minSupportedServerContractVersion: `${number}.${number}.${number}`;
};

/** Boundary between remote-config / experiments and safety-critical gates. */
export type MobileFeatureFlagBoundary = {
  readonly flagKeyNamespace: `mobile.${string}` | `learner.${string}` | `exp.${string}`;
  readonly mayGateUiExperiments: true;
  /** Server must not grant paid capability from this boundary alone. */
  readonly mustNotGrantPaidEntitlement: true;
};

export const MobileBuildChannel = {
  appStore: "mobile.build.app_store",
  testFlight: "mobile.build.test_flight",
  playStore: "mobile.build.play_store",
  internalEnterprise: "mobile.build.internal_enterprise",
  sideloadDev: "mobile.build.sideload_dev",
  webPwa: "mobile.build.web_pwa",
} as const;

export type MobileBuildChannel = (typeof MobileBuildChannel)[keyof typeof MobileBuildChannel];

export const MobileReleaseEnvironment = {
  production: "mobile.env.production",
  staging: "mobile.env.staging",
  development: "mobile.env.development",
} as const;

export type MobileReleaseEnvironment =
  (typeof MobileReleaseEnvironment)[keyof typeof MobileReleaseEnvironment];
