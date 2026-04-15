import test from "node:test";
import assert from "node:assert/strict";
import { navigationAfterUsCaMarketingToggle } from "./marketing-us-ca-toggle-navigation";

test("from Philippines exam hub to US → replace /us", () => {
  const r = navigationAfterUsCaMarketingToggle("/exams/philippines", "US");
  assert.deepEqual(r, { kind: "replace", href: "/us" });
});

test("from Philippines exam hub to CA → replace /canada", () => {
  const r = navigationAfterUsCaMarketingToggle("/exams/philippines", "CA");
  assert.deepEqual(r, { kind: "replace", href: "/canada" });
});

test("already on US pathway → refresh", () => {
  const r = navigationAfterUsCaMarketingToggle("/us/rn/nclex-rn", "US");
  assert.equal(r.kind, "refresh");
});
