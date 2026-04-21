import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
  it("requires ack when checkout body targets a partial region even without cookie", () => {
    assert.equal(
      naBillingScopeAckRequiredForCheckout({
        globalRegionCookieRaw: undefined,
        checkoutBodyRegionSlug: "philippines",
      }),
      true,
    );
  });

  it("requires ack when cookie is partial even if body slug is full (stricter union)", () => {
    assert.equal(
      naBillingScopeAckRequiredForCheckout({
        globalRegionCookieRaw: "philippines",
        checkoutBodyRegionSlug: "us",
      }),
      true,
    );
  });

  it("does not require ack when only full-funnel regions are in play", () => {
    assert.equal(
      naBillingScopeAckRequiredForCheckout({
        globalRegionCookieRaw: "us",
        checkoutBodyRegionSlug: "canada",
      }),
      false,
    );
    assert.equal(
      naBillingScopeAckRequiredForCheckout({
        globalRegionCookieRaw: undefined,
        checkoutBodyRegionSlug: "us",
      }),
      false,
    );
  });
});
