import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseDetectedIpCountryFromHeaderGet } from "@/lib/region/detected-ip-country-parse";

describe("parseDetectedIpCountryFromHeaderGet", () => {
  it("prefers x-vercel-ip-country", () => {
    const h = new Headers();
    h.set("x-vercel-ip-country", "us");
    h.set("cf-ipcountry", "CA");
    assert.equal(parseDetectedIpCountryFromHeaderGet(h.get.bind(h)), "US");
  });

  it("falls back to cf-ipcountry when Vercel header absent", () => {
    const h = new Headers();
    h.set("cf-ipcountry", "ca");
    assert.equal(parseDetectedIpCountryFromHeaderGet(h.get.bind(h)), "CA");
  });

  it("accepts CF-IPCountry casing", () => {
    const h = new Headers();
    h.set("CF-IPCountry", "US");
    assert.equal(parseDetectedIpCountryFromHeaderGet(h.get.bind(h)), "US");
  });

  it("returns null for empty or invalid", () => {
    const empty = new Headers();
    assert.equal(parseDetectedIpCountryFromHeaderGet(empty.get.bind(empty)), null);
    const h = new Headers();
    h.set("x-vercel-ip-country", "USA");
    assert.equal(parseDetectedIpCountryFromHeaderGet(h.get.bind(h)), null);
  });
});
