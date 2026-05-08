import assert from "node:assert/strict";
import test from "node:test";
import { ecgModuleUnlocked } from "@/lib/ecg/ecg-access";
import { ecgCatalogBySlug } from "@/lib/ecg/ecg-catalog";

test("preview modules unlock without subscription scope", () => {
  const entry = ecgCatalogBySlug("normal-sinus-rhythm")!;
  assert.equal(ecgModuleUnlocked(entry, { hasAccess: false, reason: "no_access", tier: null, country: null, alliedCareer: null }), true);
});

test("non-preview stays locked without access", () => {
  const entry = ecgCatalogBySlug("ventricular-tachycardia")!;
  assert.equal(ecgModuleUnlocked(entry, { hasAccess: false, reason: "no_access", tier: null, country: null, alliedCareer: null }), false);
});

test("non-preview unlocks with lesson catalog access", () => {
  const entry = ecgCatalogBySlug("ventricular-tachycardia")!;
  assert.equal(ecgModuleUnlocked(entry, { hasAccess: true, reason: "active", tier: "RN", country: "US", alliedCareer: null }), true);
});

test("error entitlement fails closed", () => {
  const entry = ecgCatalogBySlug("normal-sinus-rhythm")!;
  assert.equal(ecgModuleUnlocked(entry, "error"), false);
});
