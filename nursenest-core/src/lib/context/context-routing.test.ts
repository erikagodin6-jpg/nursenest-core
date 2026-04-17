import assert from "node:assert/strict";
import test from "node:test";
import { resolveOnboardingRoute } from "./context-routing";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";

test("onboarding US + en resolves to canonical English pathway (no /en/ prefix)", () => {
  const r = resolveOnboardingRoute("us", "en", "rn", null);
  assert.ok(r.href.startsWith("/us/rn/"), `expected /us/rn/… hub, got ${r.href}`);
  assert.ok(!r.href.startsWith("/en/"), "English exam hubs omit locale prefix");
});

test("onboarding Canada + en resolves to /canada/… pathway, not /en/canada/…", () => {
  const r = resolveOnboardingRoute("canada", "en", "rn", null);
  assert.ok(r.href.startsWith("/canada/rn/"), `expected /canada/rn/… hub, got ${r.href}`);
  assert.ok(!r.href.startsWith("/en/"));
});

test("Philippines + Tagalog: expansion hub URL (cookie carries tl; no /tl/exams/… prefix)", () => {
  const r = resolveOnboardingRoute("philippines", "tl", "rn", null);
  assert.equal(r.href, "/exams/philippines");
  assert.equal(r.locale, "tl");
});

test("UK / AU: English onboarding routes to shipped expansion hubs", () => {
  assert.equal(resolveOnboardingRoute("uk", "en", "rn", null).href, "/exams/uk");
  assert.equal(resolveOnboardingRoute("aus", "en", "rn", null).href, "/exams/australia");
});

test("intentional /fr/ and /es/ marketing trees remain valid locale prefixes", () => {
  assert.equal(isCoreHostedNonDefaultLocale("fr"), true);
  assert.equal(isCoreHostedNonDefaultLocale("es"), true);
});
