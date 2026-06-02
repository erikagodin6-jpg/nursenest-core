import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isLikelySensitiveKey,
  redactAuthorizationHeaderValue,
  redactConnectionString,
  redactMetaForLog,
  redactOpaqueSecret,
} from "@/lib/env/redact-secrets";

describe("redact-secrets", () => {
  it("masks postgres URLs", () => {
    const out = redactConnectionString("postgresql://user:secret@db.example.com:5432/mydb?sslmode=require");
    assert.match(out, /\*\*\*:\*\*\*@/);
    assert.ok(out.includes("db.example.com"));
  });

  it("redacts sensitive keys in meta", () => {
    const m = redactMetaForLog({
      ok: true,
      accessToken: "sk-xxxxx-long-value",
      safePath: "/api/health",
    });
    assert.equal(m.ok, true);
    assert.match(String(m.accessToken), /^\*\*\*/);
    assert.equal(m.safePath, "/api/health");
  });

  it("detects likely sensitive keys", () => {
    assert.equal(isLikelySensitiveKey("refresh_token"), true);
    assert.equal(isLikelySensitiveKey("userId"), false);
  });

  it("truncates opaque secrets", () => {
    assert.equal(redactOpaqueSecret("abc"), "***");
    assert.match(redactOpaqueSecret("abcdefghijklmnop"), /^\*\*\*/);
  });

  it("redacts Authorization bearer values", () => {
    const out = redactAuthorizationHeaderValue("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0");
    assert.ok(out.startsWith("Bearer ***"));
  });
});
