import assert from "node:assert/strict";
import test from "node:test";
import { resolveGeo } from "./geo-resolver";

test("resolveGeo: US + Spanish Accept-Language still yields en", () => {
  const r = resolveGeo("US", "es-US,es;q=0.9,en;q=0.5", null);
  assert.equal(r.locale, "en");
  assert.equal(r.region, "us");
});

test("resolveGeo: Canada + French Accept-Language still yields en", () => {
  const r = resolveGeo("CA", "fr-CA,fr;q=0.9,en;q=0.8", null);
  assert.equal(r.locale, "en");
  assert.equal(r.region, "canada");
});

test("resolveGeo: Philippines + Tagalog Accept-Language can yield tl", () => {
  const r = resolveGeo("PH", "tl,en;q=0.9", null);
  assert.equal(r.locale, "tl");
  assert.equal(r.region, "philippines");
});
