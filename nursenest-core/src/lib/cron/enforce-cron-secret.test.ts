/**
 * Authorization guard for cron POST endpoints — no DB.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";

describe("enforceCronSecretOrResponse", () => {
  const saved = { ...process.env };

  beforeEach(() => {
    process.env = { ...saved };
    delete process.env.CRON_SECRET;
    delete process.env.NURSE_NEST_ENFORCE_CRON_SECRET;
    process.env.NODE_ENV = "test";
    delete process.env.VERCEL_ENV;
  });

  afterEach(() => {
    process.env = { ...saved };
  });

  it("returns null in non-production when CRON_SECRET is unset (local dev)", () => {
    process.env.NODE_ENV = "development";
    const req = new Request("https://example.com/api/cron/jobs", { method: "POST" });
    assert.equal(enforceCronSecretOrResponse(req), null);
  });

  it("requires bearer token when CRON_SECRET is set (any env)", () => {
    process.env.NODE_ENV = "development";
    process.env.CRON_SECRET = "test-secret-xyz";
    const reqBad = new Request("https://example.com/api/cron/jobs", { method: "POST" });
    const resBad = enforceCronSecretOrResponse(reqBad);
    assert.ok(resBad);
    assert.equal(resBad!.status, 401);

    const reqOk = new Request("https://example.com/api/cron/jobs", {
      method: "POST",
      headers: { authorization: "Bearer test-secret-xyz" },
    });
    assert.equal(enforceCronSecretOrResponse(reqOk), null);
  });

  it("returns 503 in production when CRON_SECRET is missing", () => {
    process.env.NODE_ENV = "production";
    const req = new Request("https://example.com/api/cron/jobs", { method: "POST" });
    const res = enforceCronSecretOrResponse(req);
    assert.ok(res);
    assert.equal(res!.status, 503);
  });

  it("allows production when bearer matches CRON_SECRET", () => {
    process.env.NODE_ENV = "production";
    process.env.CRON_SECRET = "prod-cron";
    const req = new Request("https://example.com/api/cron/jobs", {
      method: "POST",
      headers: { authorization: "Bearer prod-cron" },
    });
    assert.equal(enforceCronSecretOrResponse(req), null);
  });
});
