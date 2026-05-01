import assert from "node:assert/strict";
import test from "node:test";
import { resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import {
  isIntlRnFoundationPathwayId,
  isPathwayPublishedForPublicSite,
} from "@/lib/navigation/country-exam-launch-readiness";
import { examPathwayRegionalHreflang } from "@/lib/seo/exam-pathway-hub-alternates";

test("resolves UK, Australia, and Philippines RN foundation marketing hubs", () => {
  const uk = resolveExamPathwayFromMarketingHubSegment("uk", "rn", "nmc-test-of-competence");
  assert.equal(uk?.id, "uk-rn-nmc-test-of-competence");
  assert.equal(uk?.countrySlug, "uk");

  const au = resolveExamPathwayFromMarketingHubSegment("australia", "rn", "iqnm-pathway");
  assert.equal(au?.id, "au-rn-iqnm-pathway");
  assert.equal(au?.countrySlug, "australia");

  const ph = resolveExamPathwayFromMarketingHubSegment("philippines", "rn", "prc-pnle");
  assert.equal(ph?.id, "ph-rn-prc-pnle");
  assert.equal(ph?.countrySlug, "philippines");
});

test("international RN foundation pathways are not sitemap-published without explicit approval", () => {
  assert.equal(isPathwayPublishedForPublicSite("uk-rn-nmc-test-of-competence"), false);
  assert.equal(isPathwayPublishedForPublicSite("au-rn-iqnm-pathway"), false);
  assert.equal(isPathwayPublishedForPublicSite("ph-rn-prc-pnle"), false);
});

test("Canada and US RN hubs remain published", () => {
  assert.equal(isPathwayPublishedForPublicSite("ca-rn-nclex-rn"), true);
  assert.equal(isPathwayPublishedForPublicSite("us-rn-nclex-rn"), true);
});

test("hreflang for international RN hubs uses regional English codes", () => {
  const uk = resolveExamPathwayFromMarketingHubSegment("uk", "rn", "nmc-test-of-competence");
  assert.ok(uk);
  const h = examPathwayRegionalHreflang(uk!);
  assert.ok(h["en-GB"]);
  assert.ok(h["x-default"]);
});

test("intl foundation pathway id helper", () => {
  assert.equal(isIntlRnFoundationPathwayId("uk-rn-nmc-test-of-competence"), true);
  assert.equal(isIntlRnFoundationPathwayId("us-rn-nclex-rn"), false);
});
