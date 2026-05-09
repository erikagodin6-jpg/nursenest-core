import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { ExamPathwayHubPremiumModules } from "@/components/exam-pathways/exam-pathway-hub-premium-modules";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  buildPremiumMarketingModuleCards,
  resolvePremiumCardHref,
} from "@/lib/marketing/exam-pathway-hub-premium-modules";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, "..", "..", "..");
const REPO_ROOT = resolve(PKG_ROOT, "..");
const MARKETING_EN = join(REPO_ROOT, "tools", "i18n", "marketing", "marketing-en.json");

function loadMarketingEn(): Record<string, string> {
  return JSON.parse(readFileSync(MARKETING_EN, "utf8")) as Record<string, string>;
}

function renderPremiumHtml(
  pathway: NonNullable<ReturnType<typeof getExamPathwayById>>,
  ecgModulePublic = true,
): string {
  const messages = loadMarketingEn();
  return renderToStaticMarkup(
    <MarketingI18nProvider locale="en" messages={messages}>
      <ExamPathwayHubPremiumModules pathway={pathway} isSignedIn={false} ecgModulePublic={ecgModulePublic} />
    </MarketingI18nProvider>,
  );
}

describe("buildPremiumMarketingModuleCards", () => {
  it("includes ECG only for RN/NP-capable pathways (not Canada REx-PN / RPN tier)", () => {
    const caRpn = getExamPathwayById("ca-rpn-rex-pn");
    const usRn = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(caRpn && usRn);
    const pnModules = buildPremiumMarketingModuleCards(caRpn, {
      clinicalScenariosPublic: false,
      oscePublic: false,
    });
    const rnModules = buildPremiumMarketingModuleCards(usRn, {
      clinicalScenariosPublic: false,
      oscePublic: false,
      ecgModulePublic: true,
    });
    assert.ok(!pnModules.studyTools.some((c) => c.key === "ecg"));
    assert.ok(rnModules.studyTools.some((c) => c.key === "ecg"));
    assert.ok(rnModules.studyTools.some((c) => c.key === "hub_lessons"));
    assert.ok(rnModules.studyTools.some((c) => c.key === "pathway_cat_landing"));
    assert.ok(rnModules.studyTools.some((c) => c.key === "clinical_scenarios"));
    assert.ok(rnModules.studyTools.some((c) => c.key === "flashcards"));
    assert.ok(rnModules.studyTools.some((c) => c.key === "practice_tests"));
    assert.ok(!rnModules.studyTools.some((c) => c.key === "clinical_cases"));
    assert.ok(pnModules.studyTools.some((c) => c.key === "hub_lessons"));
    assert.ok(pnModules.studyTools.some((c) => c.key === "clinical_scenarios"));
    assert.ok(!pnModules.studyTools.some((c) => c.key === "clinical_cases"));
  });

  it("NP omits generic clinical scenarios tile (uses clinical_cases instead)", () => {
    const np = getExamPathwayById("us-np-fnp");
    assert.ok(np);
    const m = buildPremiumMarketingModuleCards(np, {
      clinicalScenariosPublic: true,
      oscePublic: false,
      ecgModulePublic: true,
    });
    assert.ok(!m.studyTools.some((c) => c.key === "clinical_scenarios"));
  });

  it("includes NP clinical case tile for NP pathways", () => {
    const np = getExamPathwayById("us-np-fnp");
    assert.ok(np);
    const m = buildPremiumMarketingModuleCards(np, {
      clinicalScenariosPublic: false,
      oscePublic: false,
      ecgModulePublic: true,
    });
    assert.ok(m.studyTools.some((c) => c.key === "clinical_cases"));
    const cases = m.studyTools.find((c) => c.key === "clinical_cases");
    assert.ok(cases?.locked);
    assert.equal(resolvePremiumCardHref(cases!, true), "/");
  });

  it("does not yield navigable OSCE URLs when OSCE public flag is off", () => {
    const usRn = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(usRn);
    const { studyTools } = buildPremiumMarketingModuleCards(usRn, {
      oscePublic: false,
      ecgModulePublic: true,
    });
    const osce = studyTools.find((c) => c.key === "osce");
    assert.ok(osce?.locked);
    assert.equal(resolvePremiumCardHref(osce!, true), "/");
    assert.doesNotMatch(resolvePremiumCardHref(osce!, true), /\/app\/osce/);
  });

  it("RN hub locks ECG tile when ecgModulePublic is false (matches unpublished/disabled inventory)", () => {
    const usRn = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(usRn);
    const { studyTools } = buildPremiumMarketingModuleCards(usRn, {
      clinicalScenariosPublic: false,
      oscePublic: false,
      ecgModulePublic: false,
    });
    const ecg = studyTools.find((c) => c.key === "ecg");
    assert.ok(ecg?.locked);
    assert.equal(resolvePremiumCardHref(ecg!, true), "/");
  });

  it("Pre-Nursing pathway foundations ecosystem omits ECG, NGN tools, and new-grad strip", () => {
    const pre = getExamPathwayById("pre-nursing");
    assert.ok(pre);
    const m = buildPremiumMarketingModuleCards(pre!, { clinicalScenariosPublic: false, oscePublic: false });
    assert.ok(m.studyTools.some((c) => c.key === "pn_lesson_library"));
    assert.ok(m.studyTools.some((c) => c.key === "pn_mini_cat"));
    assert.ok(!m.studyTools.some((c) => c.key === "ecg"));
    assert.ok(!m.studyTools.some((c) => c.key === "ngn_tools"));
    assert.ok(!m.studyTools.some((c) => c.key === "clinical_cases"));
    assert.equal(m.newGrad.length, 0);
    const osce = m.studyTools.find((c) => c.key === "osce");
    assert.ok(osce?.locked);
  });

  it("US allied pathway scopes app module hrefs with alliedProfession when provided", () => {
    const allied = getExamPathwayById("us-allied-core");
    assert.ok(allied);
    const { studyTools } = buildPremiumMarketingModuleCards(allied, {
      clinicalScenariosPublic: false,
      oscePublic: false,
      alliedProfessionKey: "mlt",
    });
    const flash = studyTools.find((c) => c.key === "flashcards");
    assert.ok(flash?.href.includes("alliedProfession=mlt"));
    const osce = studyTools.find((c) => c.key === "osce");
    assert.ok(osce?.href.includes("pathwayId=us-allied-core"));
    assert.ok(osce?.href.includes("alliedProfession=mlt"));
    assert.ok(!studyTools.some((c) => c.key === "hub_lessons"));
    assert.ok(!studyTools.some((c) => c.key === "pathway_cat_landing"));
    assert.ok(!studyTools.some((c) => c.key === "clinical_scenarios"));
    assert.ok(!studyTools.some((c) => c.key === "ecg"), "no ECG tile on allied");
    assert.ok(!studyTools.some((c) => c.key === "ngn_tools"), "no NGN tools on allied");
    assert.ok(studyTools.some((c) => c.key === "skills_refresher"));
    assert.ok(studyTools.some((c) => c.key === "pathway_cat"));
    assert.ok(studyTools.some((c) => c.key === "clinical_cases"));
    assert.ok(studyTools.some((c) => c.key === "allied_career_resources"));
    const alliedCases = studyTools.find((c) => c.key === "clinical_cases");
    assert.ok(alliedCases?.titleKey.endsWith("alliedClinicalScenariosTitle"));
    assert.ok(!alliedCases?.qaMarker);
    assert.equal(/\/admin\/[^"'\s]*/i.test(JSON.stringify(studyTools)), false);
  });
});

describe("ExamPathwayHubPremiumModules DOM contract", () => {
  it("US RN hub markup exposes premium module labels and ECG marker", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const html = renderPremiumHtml(pathway);
    assert.match(html, /Lab values/i);
    assert.match(html, /Pharmacology practice/i);
    assert.match(html, /ECG/i);
    assert.match(html, /data-nn-qa-hub-ecg/);
    assert.match(html, /Exam plan/i);
    assert.match(html, /Study tools/i);
    assert.match(html, /Readiness/i);
    assert.match(html, /Pathway lessons/i);
    assert.match(html, /CAT (&amp;|&) adaptive intro/i);
    assert.match(html, /data-nn-qa-hub-premium-module="hub_lessons"/);
    assert.match(html, /data-nn-qa-hub-premium-module="pathway_cat_landing"/);
    assert.match(html, /data-nn-qa-hub-clinical-scenarios/);
    assert.match(html, /Clinical scenarios/i);
    assert.match(html, /data-nn-qa-hub-premium-module="ngn_tools"/);
    assert.match(html, /data-nn-qa-hub-premium-module="weak_areas"/);
    assert.match(html, /Flashcards/i);
    assert.match(html, /Practice exams/i);
    assert.equal(/Clinical case simulations/i.test(html.replace(/<[^>]+>/g, " ")), false);
    assert.equal(/\/admin\/[^"'\s]*/i.test(html), false);
  });

  it("US NP hub surfaces NP clinical cases copy and ECG marker", () => {
    const pathway = getExamPathwayById("us-np-fnp");
    assert.ok(pathway);
    const html = renderPremiumHtml(pathway);
    assert.match(html, /Clinical case simulations/i);
    assert.match(html, /data-nn-qa-hub-ecg/);
    assert.match(html, /data-nn-qa-hub-np-cases/);
    assert.doesNotMatch(html, /data-nn-qa-hub-clinical-scenarios/);
    assert.equal(/\/admin\/[^"'\s]*/i.test(html), false);
  });

  it("Canada REx-PN hub omits ECG marker, ECG copy, and raw /app/osce hrefs when OSCE is gated off", () => {
    const pathway = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(pathway);
    const html = renderPremiumHtml(pathway);
    assert.doesNotMatch(html, /data-nn-qa-hub-ecg/);
    assert.equal(/ECG/i.test(html.replace(/<[^>]+>/g, " ")), false);
    assert.doesNotMatch(html, /href="[^"]*\/app\/osce/);
    assert.match(html, /Flashcards/i);
  });

  it("Pre-Nursing hub markup exposes foundations ecosystem labels without ECG", () => {
    const pathway = getExamPathwayById("pre-nursing");
    assert.ok(pathway);
    const html = renderPremiumHtml(pathway);
    assert.match(html, /Foundations (&amp;|&) clinical prep ecosystem/i);
    assert.match(html, /Mini adaptive exam/i);
    assert.match(html, /Pre-Nursing lesson library/i);
    assert.doesNotMatch(html, /data-nn-qa-hub-ecg/);
    assert.equal(/\/admin\/[^"'\s]*/i.test(html), false);
  });

  it("New Grad pathway includes transition + clinical judgment labels", () => {
    const pathway = getExamPathwayById("us-rn-new-grad-transition");
    assert.ok(pathway);
    const html = renderPremiumHtml(pathway);
    assert.match(html, /New graduate transition/i);
    assert.match(html, /Transition roadmap/i);
    assert.match(html, /Clinical judgment/i);
    assert.match(html, /Skills refreshers/i);
    assert.match(html, /data-nn-qa-hub-premium-module="new_grad_pathway_cat"/);
    assert.match(html, /Adaptive readiness session/i);
    assert.match(html, /Prioritization (&amp;|&) delegation drills/i);
    assert.match(html, /data-nn-qa-hub-premium-module="new_grad_delegation"/);
    assert.match(html, /data-nn-qa-hub-clinical-scenarios/);
    assert.doesNotMatch(html, /data-nn-qa-hub-ecg/);
    assert.equal(/Clinical case simulations/i.test(html.replace(/<[^>]+>/g, " ")), false);
  });

  it("US allied pathway premium DOM exposes allied copy band and no admin links", () => {
    const pathway = getExamPathwayById("us-allied-core");
    assert.ok(pathway);
    const messages = loadMarketingEn();
    const html = renderToStaticMarkup(
      <MarketingI18nProvider locale="en" messages={messages}>
        <ExamPathwayHubPremiumModules pathway={pathway} isSignedIn={false} alliedProfessionKey="respiratory" />
      </MarketingI18nProvider>,
    );
    assert.match(html, /Allied pathway/i);
    assert.match(html, /data-nn-allied-premium-accent/);
    assert.match(html, /data-nn-qa-hub-premium-module="pathway_cat"/);
    assert.match(html, /data-nn-qa-hub-premium-module="skills_refresher"/);
    assert.match(html, /data-nn-qa-hub-premium-module="allied_career_resources"/);
    assert.doesNotMatch(html, /data-nn-qa-hub-np-cases/);
    assert.equal(/\/admin\/[^"'\s]*/i.test(html), false);
  });
});
