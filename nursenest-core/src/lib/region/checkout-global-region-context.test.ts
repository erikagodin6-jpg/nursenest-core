import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it, beforeEach, afterEach } from "node:test";
import {
  CHECKOUT_GLOBAL_REGION_CONTEXT_MAX_AGE_SEC,
  collectAuthoritativeCheckoutGlobalRegionSlugs,
  decodeCheckoutGlobalRegionContextToken,
  encodeCheckoutGlobalRegionContextToken,
} from "./checkout-global-region-context";

describe("checkout global region context token", () => {
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

  it("round-trips a valid slug", () => {
    const tok = encodeCheckoutGlobalRegionContextToken("philippines");
    assert.ok(tok && tok.includes("."));
    assert.equal(decodeCheckoutGlobalRegionContextToken(tok), "philippines");
  });

  it("rejects tampered tokens", () => {
    const tok = encodeCheckoutGlobalRegionContextToken("philippines");
    assert.ok(tok);
    const tampered = `${tok.slice(0, -4)}xxxx`;
    assert.equal(decodeCheckoutGlobalRegionContextToken(tampered), undefined);
  });

  it("rejects expired tokens", () => {
    const tok = encodeCheckoutGlobalRegionContextToken("india");
    assert.ok(tok);
    const [b64, sig] = tok.split(".", 2);
    const payload = Buffer.from(b64, "base64url").toString("utf8");
    const parts = payload.split(":");
    const oldIat = Math.floor(Date.now() / 1000) - CHECKOUT_GLOBAL_REGION_CONTEXT_MAX_AGE_SEC - 10;
    const forgedPayload = `${parts[0]}:${parts[1]}:${oldIat}`;
    const secret = process.env.AUTH_SECRET!;
    const forgedSig = createHmac("sha256", secret).update(forgedPayload, "utf8").digest("base64url");
    const forgedB64 = Buffer.from(forgedPayload, "utf8").toString("base64url");
    assert.equal(decodeCheckoutGlobalRegionContextToken(`${forgedB64}.${forgedSig}`), undefined);
  });
});

describe("collectAuthoritativeCheckoutGlobalRegionSlugs", () => {
  const prevAuth = process.env.AUTH_SECRET;

  beforeEach(() => {
    process.env.AUTH_SECRET = "test-checkout-context-secret-min-32-characters-long";
  });

  afterEach(() => {
    if (prevAuth === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = prevAuth;
  });

  it("includes stamped slug when plain cookie is absent", () => {
    const tok = encodeCheckoutGlobalRegionContextToken("philippines");
    assert.ok(tok);
    const slugs = collectAuthoritativeCheckoutGlobalRegionSlugs({
      globalRegionCookieRaw: undefined,
      checkoutRegionContextCookieRaw: tok,
    });
    assert.deepEqual(slugs.sort(), ["philippines"]);
  });
});
