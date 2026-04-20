import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ensureCookieHeaderForJwtRead } from "./jwt-read-cookie-header-merge";

describe("ensureCookieHeaderForJwtRead", () => {
  it("leaves existing Cookie header untouched and reports hadIncoming", () => {
    const h = new Headers({ cookie: "a=1; b=2" });
    const r = ensureCookieHeaderForJwtRead(h, [{ name: "c", value: "3" }]);
    assert.equal(r.hadIncomingCookieHeader, true);
    assert.equal(r.synthesizedFromJar, false);
    assert.equal(h.get("cookie"), "a=1; b=2");
  });

  it("synthesizes Cookie from jar when header bag has no Cookie", () => {
    const h = new Headers();
    const r = ensureCookieHeaderForJwtRead(h, [
      { name: "authjs.session-token", value: "eyJ.test" },
      { name: "other", value: "x" },
    ]);
    assert.equal(r.hadIncomingCookieHeader, false);
    assert.equal(r.synthesizedFromJar, true);
    assert.match(h.get("cookie") ?? "", /authjs\.session-token=eyJ\.test/);
    assert.match(h.get("cookie") ?? "", /other=x/);
  });

  it("does not set Cookie when jar is empty and header has no Cookie", () => {
    const h = new Headers();
    const r = ensureCookieHeaderForJwtRead(h, []);
    assert.equal(r.hadIncomingCookieHeader, false);
    assert.equal(r.synthesizedFromJar, false);
    assert.equal(h.get("cookie"), null);
  });

  it("treats whitespace-only Cookie as missing and synthesizes from jar", () => {
    const h = new Headers({ cookie: "   " });
    const r = ensureCookieHeaderForJwtRead(h, [{ name: "n", value: "v" }]);
    assert.equal(r.synthesizedFromJar, true);
    assert.equal(h.get("cookie"), "n=v");
  });
});
