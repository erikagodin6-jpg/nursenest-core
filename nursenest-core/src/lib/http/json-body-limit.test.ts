import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseJsonBodyWithLimit, readTextBodyWithByteLimit } from "@/lib/http/json-body-limit";

describe("readTextBodyWithByteLimit", () => {
  it("rejects when Content-Length exceeds max", async () => {
    const req = new Request("http://example.test/api", {
      method: "POST",
      headers: { "Content-Length": "99999999" },
      body: "x",
    });
    const r = await readTextBodyWithByteLimit(req, 10);
    assert.equal(r.ok, false);
    if (r.ok) throw new Error("expected failure");
    assert.equal(r.status, 413);
  });

  it("reads small UTF-8 JSON", async () => {
    const req = new Request("http://example.test/api", {
      method: "POST",
      body: '{"a":1}',
    });
    const r = await readTextBodyWithByteLimit(req, 100);
    assert.equal(r.ok, true);
    if (!r.ok) throw new Error("expected success");
    assert.equal(r.text, '{"a":1}');
  });

  it("stops when streamed chunks exceed max", async () => {
    const encoder = new TextEncoder();
    const a = "a".repeat(5);
    const b = "b".repeat(10);
    const parts = [encoder.encode(a), encoder.encode(b)];
    let i = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (i < parts.length) {
          controller.enqueue(parts[i]);
          i += 1;
        } else {
          controller.close();
        }
      },
    });
    const req = new Request("http://example.test/api", {
      method: "POST",
      duplex: "half",
      body: stream,
    } as RequestInit & { duplex: "half" });
    const r = await readTextBodyWithByteLimit(req, 8);
    assert.equal(r.ok, false);
    if (r.ok) throw new Error("expected failure");
    assert.equal(r.status, 413);
  });
});

describe("parseJsonBodyWithLimit", () => {
  it("returns 400 for empty body", async () => {
    const req = new Request("http://example.test/api", { method: "POST", body: "" });
    const r = await parseJsonBodyWithLimit(req, 100);
    assert.equal(r.ok, false);
    if (r.ok) throw new Error("expected failure");
    assert.equal(r.response.status, 400);
  });

  it("parses valid JSON", async () => {
    const req = new Request("http://example.test/api", {
      method: "POST",
      body: '{"x":true}',
    });
    const r = await parseJsonBodyWithLimit(req, 100);
    assert.equal(r.ok, true);
    if (!r.ok) throw new Error("expected success");
    assert.deepEqual(r.value, { x: true });
  });
});
