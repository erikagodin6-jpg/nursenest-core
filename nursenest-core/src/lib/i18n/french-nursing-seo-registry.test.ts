import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isLocaleSeoIndexable } from "@/lib/i18n/language-readiness";
import {
  FRENCH_MARKETING_LOCALE,
  FRENCH_NURSING_SEO_REGISTRY,
  frenchNursingRobotsDirective,
  getFrenchNursingSeoByRouteFr,
  shouldEmitFrenchHreflangAlternate,
  shouldIndexFrenchNursingSeoEntry,
} from "@/lib/i18n/french-nursing-seo-registry";

const PLACEHOLDER_RE = /\b(TODO|TBD|À TRADUIRE|machine translation)\b/i;

describe("french nursing SEO registry", () => {
  it("has unique ids and French routes", () => {
    const ids = new Set(FRENCH_NURSING_SEO_REGISTRY.map((e) => e.id));
    assert.equal(ids.size, FRENCH_NURSING_SEO_REGISTRY.length);
    const routes = new Set(FRENCH_NURSING_SEO_REGISTRY.map((e) => e.routeFr));
    assert.equal(routes.size, FRENCH_NURSING_SEO_REGISTRY.length);
    for (const e of FRENCH_NURSING_SEO_REGISTRY) {
      assert.ok(e.routeFr.startsWith("/fr/"), e.id);
      assert.ok(!e.routeEn.startsWith("/fr"), e.id);
      assert.ok(!e.routeEn.includes("//"));
    }
  });

  it("keeps French metadata distinct from English mapping fields", () => {
    for (const e of FRENCH_NURSING_SEO_REGISTRY) {
      assert.notEqual(e.titleFr.trim(), e.titleEn.trim(), e.id);
      assert.notEqual(e.metaDescriptionFr.trim(), e.metaDescriptionEn.trim(), e.id);
      assert.ok(e.titleFr.length >= 24);
      assert.ok(e.metaDescriptionFr.length >= 80);
      assert.ok(!PLACEHOLDER_RE.test(e.titleFr));
      assert.ok(!PLACEHOLDER_RE.test(e.metaDescriptionFr));
    }
  });

  it("resolves lookup by French route", () => {
    const first = FRENCH_NURSING_SEO_REGISTRY[0];
    assert.ok(first);
    assert.equal(getFrenchNursingSeoByRouteFr(first.routeFr)?.id, first.id);
  });

  it("gates indexing on locale policy and publish status", () => {
    const sample = FRENCH_NURSING_SEO_REGISTRY[0];
    assert.ok(sample);
    assert.equal(sample.status === "published", false);
    assert.equal(shouldIndexFrenchNursingSeoEntry(sample), false);
    assert.equal(frenchNursingRobotsDirective(sample), "noindex,follow");
    /** French is currently `partial` tier — expect no locale-level SEO indexing until promotion. */
    assert.equal(isLocaleSeoIndexable(FRENCH_MARKETING_LOCALE), false);
    assert.equal(shouldEmitFrenchHreflangAlternate({ ...sample, status: "published" }), false);
  });

  it("keeps free vs premium French segmentation", () => {
    for (const e of FRENCH_NURSING_SEO_REGISTRY) {
      assert.ok(e.segmentation.freeHighlightsFr.length >= 2);
      assert.ok(e.segmentation.premiumHighlightsFr.length >= 1);
    }
  });

  it("lists French query intents only in targetQueriesFr", () => {
    for (const e of FRENCH_NURSING_SEO_REGISTRY) {
      assert.ok(e.targetQueriesFr.length >= 1);
      for (const q of e.targetQueriesFr) {
        assert.ok(q.trim().length >= 3);
      }
    }
  });
});
