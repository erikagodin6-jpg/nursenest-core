import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeClientDiagnosticMeta } from "./client-diagnostic-log";

test("sanitizeClientDiagnosticMeta: redacts emails, URLs, and sensitive keys", () => {
  const out = sanitizeClientDiagnosticMeta({
    pathwayId: "us-rn-nclex-rn",
    httpStatus: 403,
    token: "should-not-leak",
    note: "see https://example.com/x?token=abc for user@host.com",
  });
  assert.ok(out);
  assert.equal(out.pathwayId, "us-rn-nclex-rn");
  assert.equal(out.httpStatus, 403);
  assert.equal(out.token, "[redacted]");
  assert.ok(typeof out.note === "string");
  assert.ok(!String(out.note).includes("example.com"));
  assert.ok(!String(out.note).includes("@host.com"));
});
