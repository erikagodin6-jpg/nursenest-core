import assert from "node:assert/strict";
import test from "node:test";
import { resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import {
  isIntlRnFoundationPathwayId,
  isPathwayPublishedForPublicSite,
} from "@/lib/navigation/country-exam-launch-readiness";
import { examPathwayRegionalHreflang } from "@/lib/seo/exam-pathway-hub-alternates";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { intlRnRegulatorDisclaimerText, resolveIntlRnHubSectionCopy } from "@/lib/marketing/intl-rn-pathway-hub-copy";

test("resolves international RN foundation marketing hubs", () => {
  const uk = resolveExamPathwayFromMarketingHubSegment("uk", "rn", "nmc-test-of-competence");
  assert.equal(uk?.id, "uk-rn-nmc-test-of-competence");
  assert.equal(uk?.countrySlug, "uk");

  const au = resolveExamPathwayFromMarketingHubSegment("australia", "rn", "iqnm-pathway");
  assert.equal(au?.id, "au-rn-iqnm-pathway");
  assert.equal(au?.countrySlug, "australia");

  const ph = resolveExamPathwayFromMarketingHubSegment("philippines", "rn", "prc-pnle");
  assert.equal(ph?.id, "ph-rn-prc-pnle");
  assert.equal(ph?.countrySlug, "philippines");

  const ind = resolveExamPathwayFromMarketingHubSegment("india", "rn", "state-nursing-council-registration");
  assert.equal(ind?.id, "in-rn-state-nursing-council-registration");
  assert.equal(ind?.countrySlug, "india");

  const ng = resolveExamPathwayFromMarketingHubSegment("nigeria", "rn", "nmcn-licensure");
  assert.equal(ng?.id, "ng-rn-nmcn-licensure");
  assert.equal(ng?.countrySlug, "nigeria");

  const sa = resolveExamPathwayFromMarketingHubSegment("saudi-arabia", "rn", "scfhs-licensure");
  assert.equal(sa?.id, "sa-rn-scfhs-licensure");
  assert.equal(sa?.countrySlug, "saudi-arabia");
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
  const uk = resolveExamPathwayFromMarketingHubSegment("uk", "rn", "nmc-test-of-competence");
  assert.ok(uk);
  const ukH = examPathwayRegionalHreflang(uk!);
  assert.ok(ukH["en-GB"]);
  assert.ok(ukH["x-default"]);

  const ind = resolveExamPathwayFromMarketingHubSegment("india", "rn", "state-nursing-council-registration");
  assert.ok(ind);
  const indH = examPathwayRegionalHreflang(ind!);
  assert.ok(indH["en-IN"]);

  const ng = resolveExamPathwayFromMarketingHubSegment("nigeria", "rn", "nmcn-licensure");
  assert.ok(ng);
  const ngH = examPathwayRegionalHreflang(ng!);
  assert.ok(ngH["en-NG"]);

  const sa = resolveExamPathwayFromMarketingHubSegment("saudi-arabia", "rn", "scfhs-licensure");
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

test("intl RN hub section copy resolves with English marketing keys (loaded from shard)", async () => {
  const { readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const here = fileURLToPath(new URL(".", import.meta.url));
  const marketingPath = join(here, "../../../public/i18n/en/marketing.json");
  const messages = JSON.parse(readFileSync(marketingPath, "utf8")) as Record<string, string>;
  const uk = resolveExamPathwayFromMarketingHubSegment("uk", "rn", "nmc-test-of-competence");
  assert.ok(uk);
  const copy = resolveIntlRnHubSectionCopy(uk!, messages);
  assert.ok(copy);
  assert.match(copy!.overview, /NMC|Nursing and Midwifery Council/i);
  const ind = resolveExamPathwayFromMarketingHubSegment("india", "rn", "state-nursing-council-registration");
  assert.ok(ind);
  const indCopy = resolveIntlRnHubSectionCopy(ind!, messages);
  assert.ok(indCopy);
  assert.match(indCopy!.overview, /Indian Nursing Council|INC/i);
  const disclaimer = intlRnRegulatorDisclaimerText(messages);
  assert.match(disclaimer, /not affiliated/i);
  assert.match(disclaimer, /INC|Indian Nursing Council/i);
});
