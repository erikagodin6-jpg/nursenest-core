import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { isTurnstileEnforced, isTurnstileQaBypassEnabled } from "@/lib/captcha/verify-turnstile";

const SAVED_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...SAVED_ENV };
});

describe("Turnstile QA bypass guard", () => {
  it("allows an explicit non-production QA bypass", () => {
    process.env = {
      ...SAVED_ENV,
      NODE_ENV: "test",
      QA_BYPASS_TURNSTILE: "1",
      TURNSTILE_SECRET_KEY: "secret",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site",
    };

    assert.equal(isTurnstileQaBypassEnabled(), true);
    assert.equal(isTurnstileEnforced(), false);
  });

  it("does not allow the QA bypass in production", () => {
    process.env = {
      ...SAVED_ENV,
      NODE_ENV: "production",
      QA_BYPASS_TURNSTILE: "1",
      TURNSTILE_SECRET_KEY: "secret",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site",
    };

    assert.equal(isTurnstileQaBypassEnabled(), false);
    assert.equal(isTurnstileEnforced(), true);
  });
});
