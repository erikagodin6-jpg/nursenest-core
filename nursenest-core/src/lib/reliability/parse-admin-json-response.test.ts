import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseAdminJsonResponse } from "@/lib/admin/parse-admin-json-response";

describe("parseAdminJsonResponse", () => {
  it("returns a clear message for HTTP 504 non-JSON bodies", async () => {
    const res = new Response("<html>gateway timeout</html>", {
      status: 504,
      headers: { "content-type": "text/html" },
    });
    const out = await parseAdminJsonResponse(res);
    assert.equal(out.ok, false);
    assert.equal(out.status, 504);
    assert.match(
      out.errorMessage,
      /timed out before the server finished/i,
      "504 hint should mention timeout and queue",
    );
    assert.match(out.errorMessage, /queue status/i);
  });

  it("parses JSON responses normally", async () => {
    const res = Response.json({ jobId: "abc", status: "queued" }, { status: 202 });
    const out = await parseAdminJsonResponse<{ jobId: string; status: string }>(res);
    assert.equal(out.ok, true);
    assert.equal(out.status, 202);
    assert.equal(out.json.jobId, "abc");
    assert.equal(out.json.status, "queued");
  });

  it("surfaces non-JSON for other error statuses without the 504-specific copy", async () => {
    const res = new Response("Bad Gateway", { status: 502 });
    const out = await parseAdminJsonResponse(res);
    assert.equal(out.ok, false);
    assert.match(out.errorMessage, /non-JSON/i);
    assert.doesNotMatch(out.errorMessage, /queue status/i);
  });
});
