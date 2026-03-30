import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeCountryCodeForEntitlement } from "./country-code";

describe("normalizeCountryCodeForEntitlement", () => {
  it("accepts CA and US", () => {
    assert.equal(normalizeCountryCodeForEntitlement("CA"), "CA");
    assert.equal(normalizeCountryCodeForEntitlement("US"), "US");
  });

  it("normalizes case and whitespace", () => {
    assert.equal(normalizeCountryCodeForEntitlement(" ca "), "CA");
    assert.equal(normalizeCountryCodeForEntitlement("us"), "US");
  });

  it("returns null for unknown or empty values", () => {
    assert.equal(normalizeCountryCodeForEntitlement(null), null);
    assert.equal(normalizeCountryCodeForEntitlement(undefined), null);
    assert.equal(normalizeCountryCodeForEntitlement(""), null);
    assert.equal(normalizeCountryCodeForEntitlement("UK"), null);
    assert.equal(normalizeCountryCodeForEntitlement("XX"), null);
  });
});
