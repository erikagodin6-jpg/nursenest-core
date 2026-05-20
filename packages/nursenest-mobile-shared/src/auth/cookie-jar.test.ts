import { describe, expect, it } from "vitest";
import { clearSessionCookiesFromJar, mergeCookieJar, parseCookieHeader, serializeCookieHeader } from "./cookie-jar.js";

describe("cookie-jar", () => {
  it("merges set-cookie into jar", () => {
    const jar = mergeCookieJar("foo=1", ["authjs.session-token=abc; Path=/; HttpOnly"]);
    const map = parseCookieHeader(jar);
    expect(map.get("foo")).toBe("1");
    expect(map.get("authjs.session-token")).toBe("abc");
  });

  it("clears known session cookies", () => {
    const before = serializeCookieHeader(
      new Map([
        ["authjs.session-token", "x"],
        ["other", "y"],
      ]),
    );
    const after = clearSessionCookiesFromJar(before);
    const m = parseCookieHeader(after);
    expect(m.has("authjs.session-token")).toBe(false);
    expect(m.get("other")).toBe("y");
  });
});
