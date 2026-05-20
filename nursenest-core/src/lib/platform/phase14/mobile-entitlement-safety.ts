/**
 * Phase 14B — **Entitlement and billing safety** on mobile-capable clients (types only).
 *
 * Documents policy: paid access mirrors web/DB state; checkout and subscription mutations stay
 * on web-trusted surfaces; native IAP and mobile-embedded Stripe Checkout are out of scope as
 * purchase authorities; admin APIs are not exposed through learner/native shells.
 */

/** Purchase UX may not run inside native shells; use web checkout in controlled WebView or Safari/Chrome. */
export type MobilePurchaseSurfacePolicy = {
  readonly allowsNativeStoreBilling: false;
  readonly allowsEmbeddedStripeCheckoutInMobileShell: false;
  readonly allowsWebHostedCheckoutLinkedFromMobile: true;
  readonly entitlementSourceOfTruth: "database_subscription_and_entitlements";
};

/**
 * Subscriptions owned by external stores (Apple/Google) are **not** modeled here as authority;
 * use `never` to mark the forbidden modeling path at compile time when wiring mappers.
 */
export type ExternalSubscriptionOwnership = never;

/**
 * Branded tag: only server/web-initiated Stripe Checkout and webhooks may move billing state.
 * Mobile clients observe mirrored entitlement snapshots from learner APIs.
 */
declare const webOnlyBillingAuthorityBrand: unique symbol;
export type WebOnlyBillingAuthority = string & { readonly [webOnlyBillingAuthorityBrand]: true };

/** Read-model shape mobile may cache; must not include admin-only diagnostics. */
export type MobileEntitlementMirror = {
  readonly tierOrEntitlementSnapshotVersion: number;
  readonly asOfServerTimeMs: number;
  readonly isOfflineStale: boolean;
};

/**
 * Compile-time guard type: attach to modules that must not import Stripe checkout builders
 * from mobile-only entrypoints.
 */
export type SubscriptionComplianceGuard = {
  readonly blocksNativeInAppPurchaseWiring: true;
  readonly blocksMobileStripeCheckoutSessionCreation: true;
  readonly requiresServerWebhookForPaidStateTransitions: true;
  readonly blocksAdminRoutesOnMobileCapabilitySurface: true;
};

/** Explicit forbidden purchase authority symbols for static audit tooling (values unused at runtime). */
export type ForbiddenMobilePurchaseAuthority =
  | "native_storekit_purchase_flow"
  | "native_google_play_billing_flow"
  | "stripe_checkout_session_from_mobile_sdk";
