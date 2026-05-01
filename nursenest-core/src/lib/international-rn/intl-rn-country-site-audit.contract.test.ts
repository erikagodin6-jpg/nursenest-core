import assert from "node:assert/strict";
import test from "node:test";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { nursingTierMarketingHeadline } from "@/lib/marketing/nursing-tier-hub-content";
import {
  INTL_RN_COUNTRY_SITE_MATRIX,
  getIntlRnCountrySiteMatrixRow,
} from "@/lib/international-rn/intl-rn-country-site-matrix";
import { auditInternationalRnCountrySites } from "@/lib/international-rn/intl-rn-country-site-audit";
import { lintIntlRnMarketCorpus } from "@/lib/international-rn/intl-rn-content-lint";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";

test("matrix rows cover the three international RN foundation pathway ids", () => {
  const ids = new Set(INTL_RN_COUNTRY_SITE_MATRIX.map((r) => r.pathwayId));
  assert.equal(ids.size, 3);
  assert.ok(ids.has("uk-rn-nmc-test-of-competence"));
  assert.ok(ids.has("au-rn-iqnm-pathway"));
  assert.ok(ids.has("ph-rn-prc-pnle"));
});

test("UK / Australia / Philippines RN hubs use matrix-specific titles and H1s", () => {
  for (const row of INTL_RN_COUNTRY_SITE_MATRIX) {
    const pathway = EXAM_PATHWAYS.find((p) => p.id === row.pathwayId);
    assert.ok(pathway, row.pathwayId);
    assert.equal(pathway!.seoTitle, `${row.titlePhrase} | NurseNest`);
    assert.equal(nursingTierMarketingHeadline(pathway!), row.h1Phrase);
  }
});

test("international RN foundation pathways are not sitemap-published by default", () => {
  for (const row of INTL_RN_COUNTRY_SITE_MATRIX) {
    assert.equal(isPathwayPublishedForPublicSite(row.pathwayId), false);
  }
});

test("canonical marketing base paths are unique per international RN hub", () => {
  const paths = INTL_RN_COUNTRY_SITE_MATRIX.map((row) => {
    const p = EXAM_PATHWAYS.find((x) => x.id === row.pathwayId);
    assert.ok(p);
    return buildExamPathwayPath(p!);
  });
  assert.equal(new Set(paths).size, paths.length);
});

test("CA/US NCLEX-RN hubs were not replaced by matrix headlines", () => {
  const ca = EXAM_PATHWAYS.find((p) => p.id === "ca-rn-nclex-rn");
  const us = EXAM_PATHWAYS.find((p) => p.id === "us-rn-nclex-rn");
  assert.ok(ca && us);
  assert.ok(!getIntlRnCountrySiteMatrixRow(ca!.id));
  assert.ok(!getIntlRnCountrySiteMatrixRow(us!.id));
  assert.match(nursingTierMarketingHeadline(ca!), /Canada/i);
  assert.match(nursingTierMarketingHeadline(us!), /US/i);
});

test("auditInternationalRnCountrySites passes with zero errors", () => {
  const { errors, warnings } = auditInternationalRnCountrySites();
  assert.equal(
    errors.length,
    0,
    errors.map((e) => `${e.code}: ${e.message}`).join("\n"),
  );
  assert.ok(warnings.length >= 0);
});

test("content lint flags bare NCLEX-RN on GB corpus but allows comparison framing", () => {
  assert.ok(lintIntlRnMarketCorpus("gb", "Prepare with NCLEX-RN only.").some((h) => h.ruleId === "nclex-rn"));
  assert.equal(lintIntlRnMarketCorpus("gb", "Parallel prep: compare NCLEX-RN item style to NMC CBT pacing.").length, 0);
});

test("content lint allows regulator disclaimer NCSBN mention under not affiliated", () => {
  const d =
    "NurseNest is an independent exam preparation platform and is not affiliated with NMC, AHPRA/NMBA, PRC, NCSBN, or any regulator.";
  assert.equal(lintIntlRnMarketCorpus("gb", d).length, 0);
});
