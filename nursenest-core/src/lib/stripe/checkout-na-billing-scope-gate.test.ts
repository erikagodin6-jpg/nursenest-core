import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { encodeCheckoutGlobalRegionContextToken } from "@/lib/region/checkout-global-region-context";
import {
  naBillingScopeAckRequiredForCheckout,
  naBillingScopeAckRequiredForCookieValue,
} from "./checkout-na-billing-scope-gate";

describe("naBillingScopeAckRequiredForCookieValue", () => {
  it("requires ack for partial/marketing regions (pricing not configured)", () => {
    assert.equal(naBillingScopeAckRequiredForCookieValue("philippines"), true);
    assert.equal(naBillingScopeAckRequiredForCookieValue("india"), true);
    assert.equal(naBillingScopeAckRequiredForCookieValue("nigeria"), true);
  });

  it("does not require ack for US/Canada", () => {
    assert.equal(naBillingScopeAckRequiredForCookieValue("us"), false);
    assert.equal(naBillingScopeAckRequiredForCookieValue("canada"), false);
  });

  it("treats missing or invalid cookie as no gate", () => {
    assert.equal(naBillingScopeAckRequiredForCookieValue(undefined), false);
    assert.equal(naBillingScopeAckRequiredForCookieValue(null), false);
    assert.equal(naBillingScopeAckRequiredForCookieValue(""), false);
    assert.equal(naBillingScopeAckRequiredForCookieValue("not-a-region"), false);
  });
});

describe("naBillingScopeAckRequiredForCheckout", () => {
  const prevAuth = process.env.AUTH_SECRET;
  const prevNext = process.env.NEXTAUTH_SECRET;

  beforeEach(() => {
    process.env.AUTH_SECRET = "test-checkout-context-secret-min-32-characters-long";
    delete process.env.NEXTAUTH_SECRET;
  });

  afterEach(() => {
    if (prevAuth === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = prevAuth;
    if (prevNext === undefined) delete process.env.NEXTAUTH_SECRET;
    else process.env.NEXTAUTH_SECRET = prevNext;
  });

  it("requires ack when checkout body targets a partial region even without cookie", () => {
    assert.equal(
      naBillingScopeAckRequiredForCheckout({
        globalRegionCookieRaw: undefined,
        checkoutBodyRegionSlug: "philippines",
      }),
      true,
    );
  });

  it("requires ack when HttpOnly signed context is gated and plain global cookie is absent", () => {
    const tok = encodeCheckoutGlobalRegionContextToken("philippines");
    assert.ok(tok);
    assert.equal(
      naBillingScopeAckRequiredForCheckout({
        globalRegionCookieRaw: undefined,
        checkoutRegionContextCookieRaw: tok,
      }),
      true,
    );
    assert.equal(naBillingScopeAckRequiredForCookieValue(undefined, tok), true);
  });

  it("requires ack when cookie is partial even if body slug is full (stricter union)", () => {
    assert.equal(
      naBillingScopeAckRequiredForCheckout({
        globalRegionCookieRaw: "philippines",
        checkoutRegionContextCookieRaw: undefined,
        checkoutBodyRegionSlug: "us",
      }),
      true,
    );
  });

  it("does not require ack when only full-funnel regions are in play", () => {
    assert.equal(
      naBillingScopeAckRequiredForCheckout({
        globalRegionCookieRaw: "us",
        checkoutRegionContextCookieRaw: undefined,
        checkoutBodyRegionSlug: "canada",
      }),
      false,
    );
    assert.equal(
      naBillingScopeAckRequiredForCheckout({
        globalRegionCookieRaw: undefined,
        checkoutRegionContextCookieRaw: undefined,
        checkoutBodyRegionSlug: "us",
      }),
      false,
    );
  });
});
