import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SubscriptionStatus, TierCode } from "@prisma/client";
import type Stripe from "stripe";
import {
  runOwnerPaidSubscriptionNotificationsJobForTest,
  shouldOwnerNotifyPaidSubscriptionCheckout,
  type OwnerSubscriptionNotificationPayload,
} from "./subscription-owner-notify";

function minimalActiveSubscription(): Stripe.Subscription {
  return { status: "active", items: { data: [] } } as Stripe.Subscription;
}

describe("shouldOwnerNotifyPaidSubscriptionCheckout", () => {
  const livePaidActive = {
    sessionMode: "subscription" as Stripe.Checkout.Session.Mode,
    amountTotal: 1999,
    statusForDb: SubscriptionStatus.ACTIVE,
    stripeSubStatus: "active" as Stripe.Subscription.Status,
    stripeSubscription: minimalActiveSubscription(),
    eventLivemode: true,
    planTier: TierCode.RN,
  };

  it("is true for live paid active subscription checkout", () => {
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout(livePaidActive), true);
  });

  it("is false for non-subscription checkout mode", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, sessionMode: "payment" }),
      false,
    );
  });

  it("is false when amount_total is zero or missing", () => {
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, amountTotal: 0 }), false);
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, amountTotal: null }), false);
  });

  it("is false when Stripe subscription is not active (e.g. trialing)", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({
        ...livePaidActive,
        stripeSubStatus: "trialing",
      }),
      false,
    );
  });

  it("is false when DB row would not be ACTIVE", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({
        ...livePaidActive,
        statusForDb: SubscriptionStatus.CANCELLED,
      }),
      false,
    );
  });

  it("is false for test-mode events unless ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE is set", () => {
    const prev = process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE;
    delete process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE;
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, eventLivemode: false }), false);
    process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE = "true";
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, eventLivemode: false }), true);
    if (prev === undefined) delete process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE;
    else process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE = prev;
  });

  it("is false for free Stripe-billing nursing tiers", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({
        ...livePaidActive,
        planTier: TierCode.PRE_NURSING,
      }),
      false,
    );
  });

  it("is false without a retrieved Stripe subscription object", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({
        ...livePaidActive,
        stripeSubscription: null,
      }),
      false,
    );
  });
});

function withEnv<T>(patch: Record<string, string | undefined>, fn: () => Promise<T> | T): Promise<T> | T {
  const prev = new Map<string, string | undefined>();
  for (const key of Object.keys(patch)) {
    prev.set(key, process.env[key]);
    const value = patch[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  const restore = () => {
    for (const [key, value] of prev) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  };
  try {
    const result = fn();
    if (result && typeof (result as Promise<T>).then === "function") {
      return (result as Promise<T>).finally(restore);
    }
    restore();
    return result;
  } catch (e) {
    restore();
    throw e;
  }
}

function payload(overrides: Partial<OwnerSubscriptionNotificationPayload> = {}): OwnerSubscriptionNotificationPayload {
  const event = {
    id: "evt_notify_123",
    type: overrides.source ?? "checkout.session.completed",
    created: 1_714_000_000,
    livemode: true,
  } as Stripe.Event;
  return {
    event,
    eventIdPrefix: event.id.slice(0, 12),
    eventType: event.type,
    customerEmail: "learner@example.com",
    customerId: "cus_123",
    subscriptionId: "sub_123",
    priceId: "price_123",
    productId: "prod_123",
    amountPaid: 2900,
    currency: "cad",
    subscriptionStatus: "active",
    timestampIso: "2024-04-24T10:00:00.000Z",
    paymentKind: "first_payment",
    source: "checkout.session.completed",
    userId: "user_123",
    planTierLabel: "RN",
    planCountryLabel: "CA",
    billingRegionSlug: "canada",
    billingInterval: "month",
    livemode: true,
    correlation: "corr",
    ...overrides,
  };
}

describe("owner paid subscription notifications", () => {
  it("sends for checkout.session.completed paid subscription notifications", async () => {
    const sent: Array<{ to: string; payload: OwnerSubscriptionNotificationPayload }> = [];
    await withEnv(
      {
        ADMIN_NOTIFICATION_EMAIL: "admin@nursenest.ca",
        ADMIN_SUBSCRIPTION_NOTIFY_EMAIL: undefined,
        ADMIN_SUBSCRIPTION_NOTIFY_PHONE: undefined,
      },
      async () => {
        await runOwnerPaidSubscriptionNotificationsJobForTest(payload(), {
          claimEvent: async () => "claimed",
          sendEmail: async (p, to) => {
            sent.push({ payload: p, to });
            return { ok: true, provider: "postmark" };
          },
          log: () => undefined,
        });
      },
    );

    assert.equal(sent.length, 1);
    assert.equal(sent[0].to, "admin@nursenest.ca");
    assert.equal(sent[0].payload.source, "checkout.session.completed");
    assert.equal(sent[0].payload.paymentKind, "first_payment");
  });

  it("sends for invoice.payment_succeeded first-payment notifications", async () => {
    const sent: OwnerSubscriptionNotificationPayload[] = [];
    await withEnv({ ADMIN_NOTIFICATION_EMAIL: "admin@nursenest.ca", ADMIN_SUBSCRIPTION_NOTIFY_PHONE: undefined }, async () => {
      await runOwnerPaidSubscriptionNotificationsJobForTest(
        payload({
          event: { id: "evt_invoice_123", type: "invoice.payment_succeeded", created: 1_714_000_010, livemode: true } as Stripe.Event,
          eventIdPrefix: "evt_invoice_",
          eventType: "invoice.payment_succeeded",
          source: "invoice.payment_succeeded",
          paymentKind: "first_payment",
        }),
        {
          claimEvent: async () => "claimed",
          sendEmail: async (p) => {
            sent.push(p);
            return { ok: true, provider: "postmark" };
          },
          log: () => undefined,
        },
      );
    });

    assert.equal(sent.length, 1);
    assert.equal(sent[0].source, "invoice.payment_succeeded");
    assert.equal(sent[0].paymentKind, "first_payment");
  });

  it("does not send duplicate Stripe event notifications twice", async () => {
    let sendCount = 0;
    await withEnv({ ADMIN_NOTIFICATION_EMAIL: "admin@nursenest.ca", ADMIN_SUBSCRIPTION_NOTIFY_PHONE: undefined }, async () => {
      await runOwnerPaidSubscriptionNotificationsJobForTest(payload(), {
        claimEvent: async () => "duplicate",
        sendEmail: async () => {
          sendCount += 1;
          return { ok: true, provider: "postmark" };
        },
        log: () => undefined,
      });
    });

    assert.equal(sendCount, 0);
  });

  it("logs a warning when ADMIN_NOTIFICATION_EMAIL is missing without crashing", async () => {
    const logs: Array<{ event: string; details: Record<string, unknown> | undefined }> = [];
    await withEnv(
      {
        ADMIN_NOTIFICATION_EMAIL: undefined,
        ADMIN_SUBSCRIPTION_NOTIFY_EMAIL: undefined,
        ADMIN_SUBSCRIPTION_NOTIFY_PHONE: undefined,
      },
      async () => {
        await runOwnerPaidSubscriptionNotificationsJobForTest(payload(), {
          claimEvent: async () => "claimed",
          sendEmail: async () => ({ ok: true, provider: "postmark" }),
          log: (_scope, event, details) => {
            logs.push({ event, details });
          },
        });
      },
    );

    assert.equal(logs.some((entry) => entry.event === "admin_notification_email_missing"), true);
  });

  it("logs email provider failure and does not throw", async () => {
    const logs: Array<{ event: string; details: Record<string, unknown> | undefined }> = [];
    await withEnv({ ADMIN_NOTIFICATION_EMAIL: "admin@nursenest.ca", ADMIN_SUBSCRIPTION_NOTIFY_PHONE: undefined }, async () => {
      await runOwnerPaidSubscriptionNotificationsJobForTest(payload(), {
        claimEvent: async () => "claimed",
        sendEmail: async () => {
          throw new Error("postmark unavailable");
        },
        log: (_scope, event, details) => {
          logs.push({ event, details });
        },
      });
    });

    assert.equal(logs.some((entry) => entry.event === "email_exception"), true);
  });
});
