import assert from "node:assert/strict";
import test from "node:test";
import {
  getExamPathwayByRoute,
  resolveExamPathwayFromMarketingHubSegment,
} from "@/lib/exam-pathways/exam-product-registry";
import {
  isIntlRnFoundationPathwayId,
  isPathwayPublishedForPublicSite,
} from "@/lib/navigation/country-exam-launch-readiness";
import { examPathwayRegionalHreflang } from "@/lib/seo/exam-pathway-hub-alternates";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";

test("international RN foundation hubs remain hidden from public marketing resolution", () => {
  const uk = getExamPathwayByRoute("uk", "rn", "nmc-test-of-competence");
  assert.equal(uk?.id, "uk-rn-nmc-test-of-competence");
  assert.equal(uk?.countrySlug, "uk");
  assert.equal(uk?.status, "hidden");
  assert.equal(resolveExamPathwayFromMarketingHubSegment("uk", "rn", "nmc-test-of-competence"), undefined);

  const au = getExamPathwayByRoute("australia", "rn", "iqnm-pathway");
  assert.equal(au?.id, "au-rn-iqnm-pathway");
  assert.equal(au?.countrySlug, "australia");
  assert.equal(resolveExamPathwayFromMarketingHubSegment("australia", "rn", "iqnm-pathway"), undefined);

  const ph = getExamPathwayByRoute("philippines", "rn", "prc-pnle");
  assert.equal(ph?.id, "ph-rn-prc-pnle");
  assert.equal(ph?.countrySlug, "philippines");
  assert.equal(resolveExamPathwayFromMarketingHubSegment("philippines", "rn", "prc-pnle"), undefined);

  const ind = getExamPathwayByRoute("india", "rn", "state-nursing-council-registration");
  assert.equal(ind?.id, "in-rn-state-nursing-council-registration");
  assert.equal(ind?.countrySlug, "india");
  assert.equal(resolveExamPathwayFromMarketingHubSegment("india", "rn", "state-nursing-council-registration"), undefined);

  const ng = getExamPathwayByRoute("nigeria", "rn", "nmcn-licensure");
  assert.equal(ng?.id, "ng-rn-nmcn-licensure");
  assert.equal(ng?.countrySlug, "nigeria");
  assert.equal(resolveExamPathwayFromMarketingHubSegment("nigeria", "rn", "nmcn-licensure"), undefined);

  const sa = getExamPathwayByRoute("saudi-arabia", "rn", "scfhs-licensure");
  assert.equal(sa?.id, "sa-rn-scfhs-licensure");
  assert.equal(sa?.countrySlug, "saudi-arabia");
  assert.equal(resolveExamPathwayFromMarketingHubSegment("saudi-arabia", "rn", "scfhs-licensure"), undefined);
});

test("international RN foundation pathways are not sitemap-published without explicit approval", () => {
  assert.equal(isPathwayPublishedForPublicSite("uk-rn-nmc-test-of-competence"), false);
  assert.equal(isPathwayPublishedForPublicSite("au-rn-iqnm-pathway"), false);
  assert.equal(isPathwayPublishedForPublicSite("ph-rn-prc-pnle"), false);
  assert.equal(isPathwayPublishedForPublicSite("in-rn-state-nursing-council-registration"), false);
  assert.equal(isPathwayPublishedForPublicSite("ng-rn-nmcn-licensure"), false);
  assert.equal(isPathwayPublishedForPublicSite("sa-rn-scfhs-licensure"), false);
});

test("Canada and US RN hubs remain published", () => {
  assert.equal(isPathwayPublishedForPublicSite("ca-rn-nclex-rn"), true);
  assert.equal(isPathwayPublishedForPublicSite("us-rn-nclex-rn"), true);
});

test("hreflang for international RN hubs uses regional locale codes", () => {
  const uk = getExamPathwayByRoute("uk", "rn", "nmc-test-of-competence");
  assert.ok(uk);
  const ukH = examPathwayRegionalHreflang(uk!);
  assert.ok(ukH["en-GB"]);
  assert.ok(ukH["x-default"]);

  const ind = getExamPathwayByRoute("india", "rn", "state-nursing-council-registration");
  assert.ok(ind);
  const indH = examPathwayRegionalHreflang(ind!);
  assert.ok(indH["en-IN"]);

  const ng = getExamPathwayByRoute("nigeria", "rn", "nmcn-licensure");
  assert.ok(ng);
  const ngH = examPathwayRegionalHreflang(ng!);
  assert.ok(ngH["en-NG"]);

  const sa = getExamPathwayByRoute("saudi-arabia", "rn", "scfhs-licensure");
  assert.ok(sa);
  const saH = examPathwayRegionalHreflang(sa!);
  assert.ok(saH["ar-SA"]);
});

test("intl foundation pathway id helper", () => {
  assert.equal(isIntlRnFoundationPathwayId("uk-rn-nmc-test-of-competence"), true);
  assert.equal(isIntlRnFoundationPathwayId("in-rn-state-nursing-council-registration"), true);
  assert.equal(isIntlRnFoundationPathwayId("us-rn-nclex-rn"), false);
});

test("international RN foundation pathways use distinct SEO titles", () => {
  const ids = new Set([
    "uk-rn-nmc-test-of-competence",
    "au-rn-iqnm-pathway",
    "ph-rn-prc-pnle",
    "in-rn-state-nursing-council-registration",
    "ng-rn-nmcn-licensure",
    "sa-rn-scfhs-licensure",
  ]);
  const titles = EXAM_PATHWAYS.filter((p) => ids.has(p.id)).map((p) => p.seoTitle);
  assert.equal(titles.length, 6);
  assert.equal(new Set(titles).size, 6);
});
